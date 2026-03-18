// Types matching the skill's JSON data schemas

export interface Build {
  id: string;
  name: string;
  use: string;
  heroSpec: string;
  difficulty: string;
  rating: number;
  description: string;
  keystones: string[];
  statPriority: string[];
  rotation: {
    opener: string[];
    priority: string[];
    cooldowns: string[];
  };
  notes: string;
  source: string;
}

export interface GearSlot {
  slot: string;
  name: string;
  source: string;
  isTier: boolean;
  ilvl?: number;
  stats?: Record<string, number>;
}

export interface Trinket {
  name: string;
  type: string;
  cooldown?: string;
  source: string;
  notes: string;
}

export interface BisGear {
  patchVersion: string;
  season: string;
  lastUpdated: string;
  tierSet: {
    name: string;
    twoPiece: string;
    fourPiece: string;
    notes: string;
    items?: Array<{ id: number; name: string; quality: string; level: number; slot: string }>;
  };
  raidMythic: GearSlot[];
  trinkets: {
    bestCombination: string;
    rankings: Trinket[];
  };
  weapon: {
    best: string;
    craftedAlternative: string;
    notes: string;
  };
  embellishments: {
    first: { name: string; slot: string; notes: string };
    second: { name: string; slot: string; notes: string };
  };
}

export interface TopPlayer {
  rank: number;
  name: string;
  realm?: string;
  region?: string;
  guild?: string;
  dps?: number;
  rating?: number;
  score?: number;
  encounterID?: number;
  notes?: string;
}

export interface TopPlayersData {
  lastUpdated: string;
  notes: string;
  communityFigures: Array<{ name: string; role: string; notes: string }>;
  pvpLeaderboard: TopPlayer[];
  raidLeaderboard: TopPlayer[];
  mythicPlusLeaderboard: TopPlayer[];
  currentAffixes?: {
    title: string;
    affixes: Array<{ name: string; description: string }>;
  };
  liveDataSources: Record<string, string>;
}

export interface ChangelogEntry {
  patch: string;
  expansion: string;
  date: string;
  type: string;
  changes: string[];
}

export interface EnchantsGems {
  patchVersion: string;
  lastUpdated: string;
  gems: {
    primary: { name: string; slot: string; notes: string };
    secondary: { name: string; recommendation: string; notes: string };
  };
  enchants: Record<string, { name: string; alternative?: string; notes: string }>;
  notes: string;
}

export interface MetaData {
  expansion: string;
  patch: string;
  season: string;
  lastSynced: string;
  raidTier: string;
  mythicPlusUnlock: string;
  notes: string;
}
