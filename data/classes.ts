export type ClassTier = "S" | "A" | "B" | "C";
export type ClassRole = "DPS" | "Support" | "Carry" | "Runner";

export interface ClassInfo {
  id: string;
  name: string;
  unlockCost: number;
  tier: ClassTier;
  role: ClassRole;
  description: string;
  pros: string[];
  cons: string[];
  recommendedFor: string[];
  source?: string;
  lastUpdated?: string;
}

export const classInfos: ClassInfo[] = [
  {
    id: "odd-jobber",
    name: "Odd Jobber",
    unlockCost: 0,
    tier: "C",
    role: "Carry",
    description: "Starter kit with average sprint and small carrying capacity.",
    pros: ["Free and always available", "Balanced stats", "No unlock friction"],
    cons: ["Low late-game ceiling", "Mediocre stamina"],
    recommendedFor: ["Brand-new players", "People learning monsters"],
    source: "Sportskeeda tier list",
    lastUpdated: "2025-01-05",
  },
  {
    id: "veterinarian",
    name: "Veterinarian",
    unlockCost: 12000,
    tier: "A",
    role: "Support",
    description: "Portable heals and pet buffs keep squads alive deep into runs.",
    pros: ["On-demand healing", "Pairs with greedy teams", "Great for Pit Maw floors"],
    cons: ["Limited damage output", "Needs consumables to shine"],
    recommendedFor: ["Coordinated groups", "Players who like support roles"],
    source: "Community guides",
    lastUpdated: "2025-01-05",
  },
  {
    id: "chef",
    name: "Chef",
    unlockCost: 18000,
    tier: "B",
    role: "Support",
    description: "Buff food and gadgets to keep everyone topped up between votes.",
    pros: ["Cheap sustain", "Great with food-heavy loot pools", "Easy solo sustain"],
    cons: ["Less carry space", "Setup time eats into vote windows"],
    recommendedFor: ["Players who roam base", "Duos that farm mid floors"],
    source: "Bloxinformer",
    lastUpdated: "2025-01-05",
  },
  {
    id: "sprinter",
    name: "Sprinter",
    unlockCost: 28000,
    tier: "S",
    role: "Runner",
    description: "Fastest class with elite escape tools for risky floors.",
    pros: ["Huge movement speed", "Pairs with greedy runs", "Low downtime"],
    cons: ["Fragile", "Team utility depends on player skill"],
    recommendedFor: ["Solo queue", "Monster bait", "Players who like to rotate objectives"],
    source: "Sportskeeda tier list",
    lastUpdated: "2025-01-05",
  },
  {
    id: "baseballer",
    name: "Baseballer",
    unlockCost: 32000,
    tier: "A",
    role: "DPS",
    description: "High stagger damage and crowd control with close-range swings.",
    pros: ["Deletes Puppets", "Cheap melee control", "Fun skill ceiling"],
    cons: ["Short range", "Needs stamina management"],
    recommendedFor: ["Aggressive squads", "Players who answer Clone spawns"],
    source: "Community spreadsheets",
    lastUpdated: "2025-01-05",
  },
  {
    id: "porter",
    name: "Porter",
    unlockCost: 40000,
    tier: "S",
    role: "Carry",
    description: "Expanded backpack and passive sprint keep profits sky high.",
    pros: ["Best money maker", "Extra slots and movement", "Pairs with any comp"],
    cons: ["Expensive unlock", "Less combat focus"],
    recommendedFor: ["Late-game farmers", "Teams chasing deep floors"],
    source: "Bloxinformer",
    lastUpdated: "2025-01-05",
  },
];
