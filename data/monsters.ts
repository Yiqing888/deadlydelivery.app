export type DangerLevel = 1 | 2 | 3;

export interface Monster {
  id: string;
  name: string;
  nickname?: string;
  floors?: number[];
  dangerLevel: DangerLevel;
  descriptionShort: string;
  attackPattern: string;
  counterStrategy: string;
  notes?: string;
  source?: string;
  lastUpdated?: string;
}

export const monsters: Monster[] = [
  {
    id: "pit-maw",
    name: "Pit Maw",
    nickname: "Blender",
    floors: [5, 6, 7, 8],
    dangerLevel: 3,
    descriptionShort: "Circular saw beast hiding in vents.",
    attackPattern:
      "Pops out of vents and does a multi-tick bite in melee range.",
    counterStrategy:
      "Stay off vent grates, toss stun items, and rotate in pairs to bait pops.",
    notes: "Porters should drop extra weight before these floors to dodge easier.",
  },
  {
    id: "fire-turkey",
    name: "Fire Turkey",
    floors: [6, 7, 8, 9],
    dangerLevel: 3,
    descriptionShort: "Fast bird that ignites the hallway.",
    attackPattern: "Sprints, leaves fire puddles, and body-checks the lead player.",
    counterStrategy:
      "Keep distance, jump fire puddles, and kite it into open rooms for stuns.",
    notes: "Carry coolant or stims to cleanse burn DoT.",
  },
  {
    id: "fridge-mimic",
    name: "Fridge Mimic",
    floors: [2, 3, 4],
    dangerLevel: 2,
    descriptionShort: "Looks like loot until it snaps shut on you.",
    attackPattern: "Lures with loot glow, then chomps and drags victims.",
    counterStrategy:
      "Ping suspicious fridges, poke with junk items, and never loot alone.",
  },
  {
    id: "running-food",
    name: "Running Food",
    nickname: "Meatball",
    floors: [1, 2, 3],
    dangerLevel: 1,
    descriptionShort: "Edible mobs that flee but explode if cornered.",
    attackPattern: "Runs until cornered, then self-destructs for AoE damage.",
    counterStrategy:
      "Shoot from range or leave them alone—value is low anyway.",
  },
  {
    id: "puppet",
    name: "Puppet",
    floors: [3, 4, 5, 6],
    dangerLevel: 2,
    descriptionShort: "Haunted mannequin that mirrors player actions.",
    attackPattern:
      "Copies movement with a short delay, landing heavy melee when it syncs.",
    counterStrategy:
      "Break line of sight, confuse it with verticality, or burst it with shock darts.",
  },
  {
    id: "clone",
    name: "Clone",
    nickname: "Fake Teammate",
    floors: [4, 5, 6, 7],
    dangerLevel: 3,
    descriptionShort: "Impostor entity that copies a random player.",
    attackPattern:
      "Appears as a teammate until it backstabs or drags you away.",
    counterStrategy:
      "Call out voice lines, watch for missing equipment, and ping if unsure.",
  },
  {
    id: "crocodile",
    name: "Sewer Crocodile",
    floors: [1, 2, 3, 4],
    dangerLevel: 2,
    descriptionShort: "Ambush predator living in waist-deep water.",
    attackPattern: "Lurks underwater then lunges for heavy bleed damage.",
    counterStrategy:
      "Move along the walls, bait lunges with decoys, and punish with ranged damage.",
  },
  {
    id: "puppet-master",
    name: "Puppet Master",
    floors: [7, 8, 9],
    dangerLevel: 3,
    descriptionShort: "Buffs nearby Puppets and disables abilities.",
    attackPattern:
      "Channels beams into minions making them immune while draining your stamina.",
    counterStrategy:
      "Delete the master first, use crowd control, and deny line of sight.",
  },
];
