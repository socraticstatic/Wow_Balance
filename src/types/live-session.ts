// src/types/live-session.ts

export interface Fight {
  timestamp: string;
  duration: number;
  dps: number;
  totalDamage: number;
  uniqueTargets: number;
  starfallUptime: number;
  starfallCasts: number;
  starfallDamagePct: number;
  lunarPct: number;
  solarPct: number;
  apCapped: number;
  casts: number;
  errors: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F' | 'N/A';
}

export interface SessionSummary {
  date: string;
  fightCount: number;
  avgDps: number;
  avgStarfallUptime: number;
  avgLunarPct: number;
  totalApWasted: number;
  gradeDistribution: Record<string, number>;
  focusMetric: string;
  focusValue: number;
}

export interface NextFocus {
  metric: string;
  current: number;
  target: number;
  tip: string;
}

export interface Presence {
  lastPlayed: string;
  zone: string;
  subZone?: string;
  level: number;
  ilvl: number;
  x?: number;
  y?: number;
  questCount: number;
  quests: Quest[];
}

export interface Quest {
  id: number;
  title: string;
  level: number;
  isComplete: boolean;
  objectives: { text: string; finished: boolean }[];
  frequency: 'daily' | 'weekly' | 'normal';
}

export interface LiveSessionData {
  lastUpdate: string;
  playerName: string;
  spec: string;
  presence: Presence;
  summary: {
    totalFights: number;
    totalDuration: number;
    avgDps: number;
    avgStarfallUptime: number;
    totalApWasted: number;
    avgLunarPct: number;
    grades: Record<string, number>;
  };
  recentFights: Fight[];
  bests: {
    highestDps: number;
    bestGrade: string;
    bestStarfallUptime: number;
    longestFight: number;
  };
  sessionHistory: SessionSummary[];
  nextFocus: NextFocus | null;
}

export type SessionState = 'pre' | 'mid' | 'post';

export interface CoachingTip {
  severity: 'critical' | 'warning' | 'tip' | 'praise';
  title: string;
  detail: string;
  metric?: string;
}

export interface CoachingOutput {
  tips: CoachingTip[];
  sessionReport: {
    dpsChange: number;
    starfallChange: number;
    bestFight: Fight | null;
    worstHabit: string;
    gradeBreakdown: Record<string, number>;
  } | null;
  nextFocus: NextFocus | null;
  trends: { metric: string; values: number[]; direction: 'up' | 'down' | 'flat' }[];
}
