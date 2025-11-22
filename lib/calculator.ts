export type PlayerClass =
  | "Odd Jobber"
  | "Veterinarian"
  | "Chef"
  | "Sprinter"
  | "Baseballer"
  | "Porter";

export type TimeLeftTier = "HIGH" | "MID" | "LOW" | null;
export type RiskPreference = "SAFE" | "NORMAL" | "RISKY";

export interface CalculatorInput {
  currentFloor: number;
  targetFloor: number;
  alivePlayers: number;
  playerClass: PlayerClass;
  inventoryValue: number;
  timeLeftTier: TimeLeftTier;
  riskPreference: RiskPreference;
}

export interface CalculationResult {
  deathProb: number;
  survivalRate: number;
  estimatedGain: number;
  evStay: number;
  evGo: number;
  diff: number;
  diffRatio: number;
  decision: "EVACUATE" | "HOLD" | "DEEPER";
  decisionTitle: string;
  tone: "danger" | "neutral" | "success";
  reasoning: string;
  notes: string[];
  dangerLabel: string;
}

// Central knobs for quick tuning without rewriting logic.
export const RISK_CONFIG = {
  floorRiskBase: {
    1: 0.1,
    2: 0.2,
    3: 0.3,
    4: 0.4,
    5: 0.5,
    6: 0.6,
    7: 0.7,
    8: 0.78,
    9: 0.85,
    10: 0.9,
  } as Record<number, number>,
  defaultFloorRisk: 0.97,
  riskClamp: { min: 0.05, max: 0.99 },
  // Rough base gain per floor; tweak slope or base to shift overall EV tone.
  gain: {
    base: 250,
    perFloor: 125,
    classBonus: {
      Porter: 0.15,
      Sprinter: 0.1,
    } as Partial<Record<PlayerClass, number>>,
  },
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

function teamModifier(alivePlayers: number): number {
  if (alivePlayers >= 4) return -0.1;
  if (alivePlayers === 3) return -0.05;
  if (alivePlayers === 2) return 0;
  return 0.05;
}

function classModifier(playerClass: PlayerClass): number {
  switch (playerClass) {
    case "Porter":
      return -0.05;
    case "Sprinter":
      return -0.05;
    case "Veterinarian":
      return -0.03;
    case "Baseballer":
      return -0.02;
    case "Chef":
      return 0;
    case "Odd Jobber":
    default:
      return 0.02;
  }
}

function timeModifier(timeLeftTier: TimeLeftTier): number {
  if (!timeLeftTier) return 0;
  if (timeLeftTier === "HIGH") return -0.02;
  if (timeLeftTier === "MID") return 0;
  return 0.05;
}

function riskPrefModifier(pref: RiskPreference): number {
  if (pref === "SAFE") return -0.05;
  if (pref === "RISKY") return 0.05;
  return 0;
}

function getFloorsToSimulate(currentFloor: number, targetFloor: number): number[] {
  const steps = Math.max(1, targetFloor - currentFloor);
  return Array.from({ length: steps }, (_, index) => currentFloor + index);
}

export function calcDeathProb(input: CalculatorInput): number {
  const floors = getFloorsToSimulate(input.currentFloor, input.targetFloor);
  const modifier =
    teamModifier(input.alivePlayers) +
    classModifier(input.playerClass) +
    timeModifier(input.timeLeftTier) +
    riskPrefModifier(input.riskPreference);

  let survivalProduct = 1;

  for (const floor of floors) {
    const base = RISK_CONFIG.floorRiskBase[floor] ?? RISK_CONFIG.defaultFloorRisk;
    const stepProb = clamp(
      base + modifier,
      RISK_CONFIG.riskClamp.min,
      RISK_CONFIG.riskClamp.max,
    );
    survivalProduct *= 1 - stepProb;
  }

  const combinedDeath = 1 - survivalProduct;
  return clamp(combinedDeath, RISK_CONFIG.riskClamp.min, RISK_CONFIG.riskClamp.max);
}

export function estimateGain(
  currentFloor: number,
  targetFloor: number,
  playerClass: PlayerClass,
): number {
  const floors = getFloorsToSimulate(currentFloor, targetFloor);
  let total = 0;

  floors.forEach((floor) => {
    total += RISK_CONFIG.gain.base + floor * RISK_CONFIG.gain.perFloor;
  });

  const bonus = RISK_CONFIG.gain.classBonus[playerClass];
  if (bonus) total *= 1 + bonus;
  return Math.round(total);
}

function getDangerLabel(prob: number): string {
  if (prob < 0.2) return "Low";
  if (prob < 0.4) return "Manageable";
  if (prob < 0.6) return "High";
  if (prob < 0.8) return "Very High";
  return "Extreme";
}

function deriveDecision(
  diffRatio: number,
  pref: RiskPreference,
): "EVACUATE" | "HOLD" | "DEEPER" {
  const offset = pref === "SAFE" ? 0.05 : pref === "RISKY" ? -0.05 : 0;
  const goThreshold = 0.1 + offset;
  const leaveThreshold = -0.1 + offset;

  if (diffRatio <= leaveThreshold) return "EVACUATE";
  if (diffRatio >= goThreshold) return "DEEPER";
  return "HOLD";
}

function buildNotes(
  input: CalculatorInput,
  result: { deathProb: number; estimatedGain: number },
): string[] {
  const notes: string[] = [];
  const baseGain = 200 + input.currentFloor * 150;
  const plannedFloors = Math.max(1, input.targetFloor - input.currentFloor);

  if (input.inventoryValue >= baseGain * 3) {
    notes.push(
      "You've already banked well above a normal run for this floor. Greed will sting if you wipe.",
    );
  } else if (input.inventoryValue >= baseGain * 2) {
    notes.push("This floor is already profitable--no shame in cashing out.");
  }

  if (result.deathProb >= 0.6) {
    notes.push(
      "Death odds are spiking. Ping your team or link them the monsters list before deciding.",
    );
  }

  if (input.currentFloor >= 7) {
    notes.push(
      "Deep floors spawn nastier entities like Fire Turkey and Pit Maw more often--prep stims before moving on.",
    );
  }

  if (result.estimatedGain <= 350) {
    notes.push(
      "Expected extra loot is modest; only go deeper if you still need specific drops.",
    );
  }

  if (plannedFloors >= 2) {
    notes.push(
      `Planning ${plannedFloors} floors in one go multiplies wipe risk--double-check squad resources before locking in.`,
    );
  }

  return notes;
}

export function runCalculation(input: CalculatorInput): CalculationResult {
  const deathProb = calcDeathProb(input);
  const survivalRate = Number((1 - deathProb).toFixed(2));
  const estimatedGain = estimateGain(
    input.currentFloor,
    input.targetFloor,
    input.playerClass,
  );
  const evStay = input.inventoryValue;
  const evGo = (input.inventoryValue + estimatedGain) * survivalRate;
  const diff = evGo - evStay;
  const diffRatio = input.inventoryValue === 0 ? 0 : diff / input.inventoryValue;
  const decision = deriveDecision(diffRatio, input.riskPreference);
  const dangerLabel = getDangerLabel(deathProb);

  let decisionTitle = "Hold the vote";
  let tone: CalculationResult["tone"] = "neutral";
  let reasoning =
    "EV gain is roughly equal to staying. Talk to your squad before locking in.";

  if (decision === "EVACUATE") {
    decisionTitle = "Evacuate";
    tone = "danger";
    reasoning =
      diffRatio <= -0.2
        ? "EV drops hard if you go deeper. Bank the loot before it disappears."
        : "Marginal upside but real wipe risk. Cash out and reset the run.";
  } else if (decision === "DEEPER") {
    decisionTitle = "Go deeper";
    tone = "success";
    reasoning =
      diffRatio >= 0.2
        ? "Huge upside next floor and survival odds are acceptable."
        : "Slight EV edge. Move fast and don't get separated.";
  }

  const notes = buildNotes(input, { deathProb, estimatedGain });

  return {
    deathProb,
    survivalRate,
    estimatedGain,
    evStay,
    evGo,
    diff,
    diffRatio,
    decision,
    decisionTitle,
    tone,
    reasoning,
    notes,
    dangerLabel,
  };
}
