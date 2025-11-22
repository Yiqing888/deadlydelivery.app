export type RunStyle = "safe" | "balanced" | "greedy";

export interface RunPlan {
  runIndex: number;
  targetFloor: number;
  focus: string;
  tips: string[];
}

const basePlan: Array<{ target: number; focus: string; tips: string[] }> = [
  {
    target: 1,
    focus: "Learn the elevator vote timing and loot icons.",
    tips: ["Only grab obvious valuables", "Ping every monster for muscle memory"],
  },
  {
    target: 1,
    focus: "Identify fast escape routes.",
    tips: ["Keep sprint meter full", "Practice calling out monster names"],
  },
  {
    target: 2,
    focus: "Take your first greedy floor if backpack < 600 cr.",
    tips: ["Leave if half the team is down", "Drink buffs before diving"],
  },
  {
    target: 2,
    focus: "Start respecting Mimics and Crocs.",
    tips: ["Assign one teammate to scout ahead", "Drop junk before the vote"],
  },
  {
    target: 3,
    focus: "Test your emergency voice lines and stuns.",
    tips: ["Carry coolant or darts", "Have a caller track timers"],
  },
  {
    target: 3,
    focus: "Stabilize income and unlock your first paid class.",
    tips: ["Farm 15k credits before greed", "Use the calculator every vote"],
  },
  {
    target: 4,
    focus: "Prep for Pit Maw / Fire Turkey floors.",
    tips: ["Craft heals before leaving lobby", "Assign bait and backline"],
  },
  {
    target: 5,
    focus: "Push a deeper run if loot RNG is good.",
    tips: ["Bank if backpack > 2x base gain", "Double-check stim stock"],
  },
  {
    target: 5,
    focus: "Start practicing clone checks.",
    tips: ["Spam emotes", "Call names before opening vaults"],
  },
  {
    target: 6,
    focus: "Execute a serious profit run or stop early if scuffed.",
    tips: ["Porters lead vote math", "Rotate monster counters"],
  },
];

const styleAdjustment: Record<RunStyle, number> = {
  safe: -1,
  balanced: 0,
  greedy: 1,
};

export function generateRunPlan(style: RunStyle, hasSquad: boolean): RunPlan[] {
  const offset = styleAdjustment[style];
  return basePlan.map((entry, index) => {
    const targetFloor = clamp(entry.target + offset, 1, 9);
    const tips = [...entry.tips];

    if (hasSquad) {
      tips.push("Call the vote timer aloud so everyone preps at the same pace.");
    } else {
      tips.push("Solo queue: prioritize stuns and mobility over raw value.");
    }

    if (style === "greedy" && index >= 6) {
      tips.push("Greed style: do not overstay without heals and stims ready.");
    }

    if (style === "safe" && index <= 3) {
      tips.push("Safe style: cash out once backpacks hit 1.5x base gain.");
    }

    return {
      runIndex: index + 1,
      targetFloor,
      focus: entry.focus,
      tips,
    };
  });
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}
