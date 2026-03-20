import { createContext, useContext, useMemo } from 'react';
import type { LiveSessionData } from '../types/live-session';

interface ProgressionState {
  level: number;
  ilvl: number;
  phase: 'leveling' | 'fresh90' | 'geared';
  sectionRelevance: Record<string, boolean>;
}

const ProgressionContext = createContext<ProgressionState>({
  level: 86, ilvl: 156, phase: 'leveling', sectionRelevance: {},
});

const SECTION_LEVEL_GATES: Record<string, number> = {
  hero: 0, spiracle: 0, progression: 0, faith: 0,
  aoe: 0, talentbuild: 0, breakpoints: 0, keybinds: 0, macros: 0,
  builds: 0, gear: 0, geardelta: 0, gearpriority: 0,
  consumables: 80, weekly: 80,
  raid: 90, dungeons: 80, cdplanner: 90,
  rankings: 90, live: 0, changelog: 0, setup: 0,
};

export function ProgressionProvider({ data, children }: { data: LiveSessionData | null; children: React.ReactNode }) {
  const value = useMemo(() => {
    const level = data?.presence?.level || 86;
    const ilvl = data?.presence?.ilvl || 156;
    const phase = level < 90 ? 'leveling' as const : ilvl < 230 ? 'fresh90' as const : 'geared' as const;

    const sectionRelevance: Record<string, boolean> = {};
    for (const [id, gate] of Object.entries(SECTION_LEVEL_GATES)) {
      sectionRelevance[id] = level >= gate;
    }

    return { level, ilvl, phase, sectionRelevance };
  }, [data?.presence?.level, data?.presence?.ilvl]);

  return <ProgressionContext.Provider value={value}>{children}</ProgressionContext.Provider>;
}

export function useProgression() {
  return useContext(ProgressionContext);
}
