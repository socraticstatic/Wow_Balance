# Living Dossier Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the Balance Druid Dossier from a static wiki into a living war room that reacts to gameplay in real-time, surfaces prioritized actions, and coaches improvement across sessions.

**Architecture:** Dual-channel data pipeline (combat log for real-time fights, SavedVariables for character state) feeds a local Express server. React app reads locally when available, falls back to GitHub. A coaching hook and mission briefing component consume live data to surface actionable priorities.

**Tech Stack:** Node.js (watcher + Express), WoW Combat Log parsing, React 19, TypeScript, Vite 8, existing CSS variable design system.

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `companion-addon/combat-log-parser.ts` | Parse WoWCombatLog.txt in real-time, extract Balance Druid fight metrics |
| `companion-addon/local-server.ts` | Express server serving live-session.json over HTTP for local app reads |
| `src/hooks/useCoaching.ts` | Coaching engine - level-aware thresholds, trend tracking, one drill per session |
| `src/hooks/useLiveData.ts` | Extracted live data hook - local server detection, GitHub fallback, freshness |
| `src/components/MissionBriefing.tsx` | Sticky briefing bar with pre/mid/post session states |
| `src/context/ProgressionContext.tsx` | Provides level, ilvl, progression phase to all components |
| `src/types/live-session.ts` | TypeScript types for live session data, session history, coaching output |

### Modified Files
| File | Changes |
|------|---------|
| `companion-addon/watcher.ts` | Add combat log channel, session history persistence, local server startup |
| `src/pages/LiveSession.tsx` | Extract analyzeSession to useCoaching, consume hook instead of inline logic |
| `src/components/Nav.tsx` | Badge state for "what changed", relevance dimming for nav icons |
| `src/App.tsx` | Add MissionBriefing, wrap in ProgressionContext, section relevance |
| `src/data/live-session.json` | Schema additions: sessionHistory[], nextFocus |

---

## Phase 1: Live Data Pipeline

### Task 1: Live Session Types

**Files:**
- Create: `src/types/live-session.ts`

- [ ] **Step 1: Define the live session schema types**

```typescript
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
```

- [ ] **Step 2: Verify types compile**

Run: `cd /Users/micahbos/Desktop/cloud-router-ui/Wow_Balance && npx tsc --noEmit`
Expected: Clean compile

- [ ] **Step 3: Commit**

```bash
git add src/types/live-session.ts
git commit -m "feat: add typed schema for live session data, coaching, and session history"
```

---

### Task 2: Combat Log Parser

**Files:**
- Create: `companion-addon/combat-log-parser.ts`

- [ ] **Step 1: Create the combat log parser module**

This parses WoW's `WoWCombatLog.txt` line by line. WoW combat log format:
```
M/D HH:MM:SS.mmm  SUBEVENT,sourceGUID,sourceName,...,spellId,spellName,...
```

```typescript
// companion-addon/combat-log-parser.ts
import { readFileSync, statSync, existsSync } from 'fs';
import { join } from 'path';
import { platform, homedir } from 'os';

// Same spell IDs as Combat.lua
const SPELLS = {
  STARFALL: 191034,
  STARSURGE: 78674,
  MOONFIRE: 8921,
  SUNFIRE: 93402,
  WRATH: 190984,
  STARFIRE: 194153,
  ECLIPSE_SOLAR: 48517,
  ECLIPSE_LUNAR: 48518,
  INCARNATION: 102560,
  FURY_OF_ELUNE: 202770,
  FORCE_OF_NATURE: 205636,
  CONVOKE: 391528,
};

const BUILDER_IDS = new Set([SPELLS.WRATH, SPELLS.STARFIRE]);
const SPENDER_IDS = new Set([SPELLS.STARFALL, SPELLS.STARSURGE]);
const DOT_IDS = new Set([SPELLS.MOONFIRE, SPELLS.SUNFIRE]);

interface FightState {
  startTime: number;
  totalDamage: number;
  starfallDamage: number;
  starfallActive: boolean;
  starfallStart: number;
  starfallUptime: number;
  lunarActive: boolean;
  lunarStart: number;
  lunarTime: number;
  solarActive: boolean;
  solarStart: number;
  solarTime: number;
  targets: Set<string>;
  casts: number;
  apCapped: number;
  errors: number;
}

export interface ParsedFight {
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
  grade: string;
}

export function getCombatLogPath(): string | null {
  const p = platform();
  let base: string;
  if (p === 'win32') {
    base = 'C:\\Program Files (x86)\\World of Warcraft\\_retail_\\Logs';
  } else if (p === 'darwin') {
    base = join(homedir(), 'Library/Application Support/Blizzard/World of Warcraft/_retail_/Logs');
  } else {
    return null;
  }
  const logPath = join(base, 'WoWCombatLog.txt');
  return existsSync(logPath) ? logPath : null;
}

export class CombatLogParser {
  private playerName: string;
  private lastReadPos = 0;
  private currentFight: FightState | null = null;
  private lastCombatTime = 0;
  private fights: ParsedFight[] = [];
  private readonly COMBAT_GAP_MS = 5000;

  constructor(playerName: string) {
    this.playerName = playerName;
  }

  /**
   * Read new lines from the combat log since last read.
   * Returns any completed fights since last call.
   */
  parseNewLines(logPath: string): ParsedFight[] {
    const completedFights: ParsedFight[] = [];

    try {
      const stat = statSync(logPath);
      if (stat.size < this.lastReadPos) {
        // Log was reset/rotated
        this.lastReadPos = 0;
      }
      if (stat.size === this.lastReadPos) return [];

      const content = readFileSync(logPath, 'utf8');
      const newContent = content.slice(this.lastReadPos);
      this.lastReadPos = stat.size;

      const lines = newContent.split('\n').filter(l => l.trim());

      for (const line of lines) {
        const fight = this.processLine(line);
        if (fight) completedFights.push(fight);
      }
    } catch {
      // File locked or unreadable - skip this cycle
    }

    // Check for combat gap timeout
    if (this.currentFight && Date.now() - this.lastCombatTime > this.COMBAT_GAP_MS) {
      const fight = this.finalizeFight();
      if (fight) completedFights.push(fight);
    }

    this.fights.push(...completedFights);
    return completedFights;
  }

  private processLine(line: string): ParsedFight | null {
    // Parse timestamp: "M/D HH:MM:SS.mmm  SUBEVENT,..."
    const match = line.match(/^(\d+\/\d+)\s+(\d+:\d+:\d+\.\d+)\s\s(.+)$/);
    if (!match) return null;

    const [, , , payload] = match;
    const parts = payload.split(',');
    const subevent = parts[0];
    const sourceName = parts[2]?.replace(/"/g, '');

    // Only track our player's events
    if (sourceName !== this.playerName) {
      // Still check for ENCOUNTER_END
      if (subevent === 'ENCOUNTER_END') {
        return this.finalizeFight();
      }
      return null;
    }

    this.lastCombatTime = Date.now();

    const spellId = parseInt(parts[9] || '0', 10);
    const amount = parseInt(parts[29] || parts[22] || '0', 10);
    const destGUID = parts[5] || '';

    // Start fight if not in one
    if (!this.currentFight && (subevent.includes('DAMAGE') || subevent === 'SPELL_CAST_SUCCESS')) {
      this.currentFight = {
        startTime: Date.now(),
        totalDamage: 0,
        starfallDamage: 0,
        starfallActive: false,
        starfallStart: 0,
        starfallUptime: 0,
        lunarActive: false,
        lunarStart: 0,
        lunarTime: 0,
        solarActive: false,
        solarStart: 0,
        solarTime: 0,
        targets: new Set(),
        casts: 0,
        apCapped: 0,
        errors: 0,
      };
    }

    if (!this.currentFight) return null;

    // Damage events
    if (subevent === 'SPELL_DAMAGE' || subevent === 'SPELL_PERIODIC_DAMAGE') {
      this.currentFight.totalDamage += amount;
      if (spellId === SPELLS.STARFALL) this.currentFight.starfallDamage += amount;
      if (destGUID) this.currentFight.targets.add(destGUID);
    }

    // Cast events
    if (subevent === 'SPELL_CAST_SUCCESS') {
      this.currentFight.casts++;
      // AP cap detection: builder cast could mean capped
      if (BUILDER_IDS.has(spellId) && this.currentFight.starfallActive) {
        // Heuristic: casting builder while Starfall is up and not in Eclipse is suspicious
        // Full AP tracking requires addon; this is a rough estimate
      }
    }

    // Buff tracking
    if (subevent === 'SPELL_AURA_APPLIED') {
      if (spellId === SPELLS.STARFALL) {
        this.currentFight.starfallActive = true;
        this.currentFight.starfallStart = Date.now();
      }
      if (spellId === SPELLS.ECLIPSE_LUNAR) {
        this.currentFight.lunarActive = true;
        this.currentFight.lunarStart = Date.now();
      }
      if (spellId === SPELLS.ECLIPSE_SOLAR) {
        this.currentFight.solarActive = true;
        this.currentFight.solarStart = Date.now();
      }
    }
    if (subevent === 'SPELL_AURA_REMOVED') {
      const now = Date.now();
      if (spellId === SPELLS.STARFALL && this.currentFight.starfallActive) {
        this.currentFight.starfallUptime += now - this.currentFight.starfallStart;
        this.currentFight.starfallActive = false;
      }
      if (spellId === SPELLS.ECLIPSE_LUNAR && this.currentFight.lunarActive) {
        this.currentFight.lunarTime += now - this.currentFight.lunarStart;
        this.currentFight.lunarActive = false;
      }
      if (spellId === SPELLS.ECLIPSE_SOLAR && this.currentFight.solarActive) {
        this.currentFight.solarTime += now - this.currentFight.solarStart;
        this.currentFight.solarActive = false;
      }
    }

    return null;
  }

  private finalizeFight(): ParsedFight | null {
    if (!this.currentFight) return null;
    const f = this.currentFight;
    const now = Date.now();
    const duration = (now - f.startTime) / 1000;

    // Close open buffs
    if (f.starfallActive) f.starfallUptime += now - f.starfallStart;
    if (f.lunarActive) f.lunarTime += now - f.lunarStart;
    if (f.solarActive) f.solarTime += now - f.solarStart;

    this.currentFight = null;

    // Skip fights shorter than 8 seconds
    if (duration < 8) return null;

    const durationMs = duration * 1000;
    const starfallUptime = durationMs > 0 ? Math.min(100, (f.starfallUptime / durationMs) * 100) : 0;
    const eclipseTotal = f.lunarTime + f.solarTime;
    const lunarPct = eclipseTotal > 0 ? (f.lunarTime / eclipseTotal) * 100 : 0;
    const solarPct = eclipseTotal > 0 ? (f.solarTime / eclipseTotal) * 100 : 0;
    const starfallDamagePct = f.totalDamage > 0 ? (f.starfallDamage / f.totalDamage) * 100 : 0;
    const dps = duration > 0 ? Math.round(f.totalDamage / duration) : 0;

    // Grade using same logic as Combat.lua
    let score = 100;
    const targets = f.targets.size;
    if (targets >= 3) {
      if (starfallUptime < 50) score -= 30;
      else if (starfallUptime < 70) score -= 15;
      else if (starfallUptime < 85) score -= 5;
      if (lunarPct < 40) score -= 20;
      else if (lunarPct < 55) score -= 10;
    }
    if (f.apCapped > 5) score -= 20;
    else if (f.apCapped > 2) score -= 10;
    else if (f.apCapped > 0) score -= 5;

    let grade: string;
    if (score >= 95) grade = 'S';
    else if (score >= 85) grade = 'A';
    else if (score >= 70) grade = 'B';
    else if (score >= 55) grade = 'C';
    else if (score >= 40) grade = 'D';
    else grade = 'F';

    return {
      timestamp: new Date().toISOString(),
      duration: Math.round(duration),
      dps,
      totalDamage: f.totalDamage,
      uniqueTargets: targets,
      starfallUptime: Math.round(starfallUptime),
      starfallCasts: 0, // Not tracked in combat log (no cast count per spell)
      starfallDamagePct: Math.round(starfallDamagePct),
      lunarPct: Math.round(lunarPct),
      solarPct: Math.round(solarPct),
      apCapped: f.apCapped,
      casts: f.casts,
      errors: f.errors,
      grade,
    };
  }

  getRecentFights(limit = 20): ParsedFight[] {
    return this.fights.slice(-limit);
  }

  getFightCount(): number {
    return this.fights.length;
  }
}
```

- [ ] **Step 2: Verify it compiles**

Run: `cd /Users/micahbos/Desktop/cloud-router-ui/Wow_Balance/companion-addon && npx tsc --noEmit combat-log-parser.ts --esModuleInterop --module nodenext --moduleResolution nodenext`
Expected: Clean compile (or adjust tsconfig)

- [ ] **Step 3: Commit**

```bash
git add companion-addon/combat-log-parser.ts
git commit -m "feat: add real-time WoW combat log parser for Balance Druid metrics"
```

---

### Task 3: Local Express Server

**Files:**
- Create: `companion-addon/local-server.ts`

- [ ] **Step 1: Create the local server module**

```typescript
// companion-addon/local-server.ts
import { createServer, IncomingMessage, ServerResponse } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const PORT = 3847;
const CORS_ORIGIN = '*'; // Allow any origin (local dev + GitHub Pages)

let dataPath = '';

function handler(req: IncomingMessage, res: ServerResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', CORS_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/live-session.json' && req.method === 'GET') {
    if (!existsSync(dataPath)) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'No data yet' }));
      return;
    }
    try {
      const data = readFileSync(dataPath, 'utf8');
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      });
      res.end(data);
    } catch {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Read failed' }));
    }
    return;
  }

  if (req.url === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', dataPath }));
    return;
  }

  res.writeHead(404);
  res.end();
}

export function startLocalServer(jsonPath: string): void {
  dataPath = jsonPath;
  const server = createServer(handler);
  server.listen(PORT, '127.0.0.1', () => {
    console.log(`[local-server] Serving live-session.json on http://127.0.0.1:${PORT}`);
  });
  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`[local-server] Port ${PORT} in use - another watcher is running`);
    } else {
      console.error('[local-server]', err.message);
    }
  });
}
```

- [ ] **Step 2: Commit**

```bash
git add companion-addon/local-server.ts
git commit -m "feat: add local HTTP server for sub-second live data reads"
```

---

### Task 4: Integrate Combat Log + Local Server into Watcher

**Files:**
- Modify: `companion-addon/watcher.ts`

- [ ] **Step 1: Read current watcher.ts to understand exact structure**

Read the full file at `/Users/micahbos/Desktop/cloud-router-ui/Wow_Balance/companion-addon/watcher.ts`

- [ ] **Step 2: Add combat log parser and local server imports**

At the top of watcher.ts, add:
```typescript
import { CombatLogParser, getCombatLogPath } from './combat-log-parser';
import { startLocalServer } from './local-server';
```

- [ ] **Step 3: Add combat log watching to the main loop**

In the watch loop (around line 320), add a second file watcher for the combat log:
- Initialize `CombatLogParser` with player name from SavedVariables
- Every 2 seconds (same loop), call `parser.parseNewLines(combatLogPath)`
- When new fights are returned, merge into the live-session.json data
- Write updated JSON locally AND push to GitHub

- [ ] **Step 4: Add session history persistence**

When writing live-session.json:
- Check if `sessionHistory` array exists, if not initialize as `[]`
- On session end (no new fights for 30 minutes), summarize current session and push to `sessionHistory[]`
- Keep last 20 sessions
- Calculate `nextFocus` from coaching logic

- [ ] **Step 5: Start local server on watcher boot**

After finding the data path, call:
```typescript
startLocalServer(join(outputDir, 'live-session.json'));
```

- [ ] **Step 6: Test the full pipeline manually**

1. Start watcher: `npx tsx companion-addon/watcher.ts`
2. Verify local server responds: `curl http://127.0.0.1:3847/health`
3. Verify data endpoint: `curl http://127.0.0.1:3847/live-session.json`
Expected: JSON response with current data

- [ ] **Step 7: Commit**

```bash
git add companion-addon/watcher.ts
git commit -m "feat: integrate combat log parser and local server into watcher pipeline"
```

---

## Phase 2: Coaching Engine

### Task 5: Extract and Upgrade useCoaching Hook

**Files:**
- Create: `src/hooks/useCoaching.ts`
- Modify: `src/pages/LiveSession.tsx` (lines 391-585)

- [ ] **Step 1: Create the useCoaching hook**

Extract `analyzeSession()` from LiveSession.tsx and enhance with:
- Level-aware thresholds (leveling/fresh90/geared)
- Session history trend tracking
- One-drill-per-session focus selection

```typescript
// src/hooks/useCoaching.ts
import { useMemo } from 'react';
import type { Fight, SessionSummary, CoachingOutput, CoachingTip, NextFocus } from '../types/live-session';

type Phase = 'leveling' | 'fresh90' | 'geared';

function getPhase(level: number, ilvl: number): Phase {
  if (level < 90) return 'leveling';
  if (ilvl < 230) return 'fresh90';
  return 'geared';
}

const THRESHOLDS: Record<Phase, { starfall: [number, number]; lunar: [number, number]; apCap: [number, number] }> = {
  leveling:  { starfall: [50, 65], lunar: [35, 50], apCap: [5, 3] },
  fresh90:   { starfall: [60, 75], lunar: [45, 60], apCap: [3, 2] },
  geared:    { starfall: [75, 85], lunar: [55, 70], apCap: [2, 1] },
};

function analyzeFights(fights: Fight[], phase: Phase): CoachingTip[] {
  const tips: CoachingTip[] = [];
  if (fights.length === 0) return tips;

  const t = THRESHOLDS[phase];
  const avgStarfall = fights.reduce((s, f) => s + f.starfallUptime, 0) / fights.length;
  const avgLunar = fights.reduce((s, f) => s + f.lunarPct, 0) / fights.length;
  const totalApCapped = fights.reduce((s, f) => s + f.apCapped, 0);
  const avgTargets = fights.reduce((s, f) => s + f.uniqueTargets, 0) / fights.length;

  // Starfall uptime (only matters for AoE)
  if (avgTargets >= 3) {
    if (avgStarfall < t.starfall[0]) {
      tips.push({ severity: 'critical', title: 'Starfall Uptime Critical', detail: `${Math.round(avgStarfall)}% average. Target: ${t.starfall[1]}%+. Pool to 80 AP before Starfall so you can maintain it.`, metric: 'starfallUptime' });
    } else if (avgStarfall < t.starfall[1]) {
      tips.push({ severity: 'warning', title: 'Starfall Uptime Low', detail: `${Math.round(avgStarfall)}% average. Target: ${t.starfall[1]}%+. Pre-cast Starfall before pulls when possible.`, metric: 'starfallUptime' });
    } else {
      tips.push({ severity: 'praise', title: 'Starfall Uptime Strong', detail: `${Math.round(avgStarfall)}% average. Solid maintenance.`, metric: 'starfallUptime' });
    }
  }

  // Eclipse distribution (AoE)
  if (avgTargets >= 3) {
    if (avgLunar < t.lunar[0]) {
      tips.push({ severity: 'critical', title: 'Not Enough Lunar Eclipse', detail: `${Math.round(avgLunar)}% Lunar. Starfire cleaves in Lunar Eclipse - prioritize it in AoE.`, metric: 'lunarPct' });
    } else if (avgLunar < t.lunar[1]) {
      tips.push({ severity: 'warning', title: 'Lunar Eclipse Could Be Higher', detail: `${Math.round(avgLunar)}% Lunar. Cast Starfire to trigger Lunar before pressing Eclipse button.`, metric: 'lunarPct' });
    }
  }

  // AP waste
  if (totalApCapped > t.apCap[0] * fights.length) {
    tips.push({ severity: 'critical', title: 'Astral Power Wasted', detail: `Capped ${totalApCapped} times across ${fights.length} fights. At 80+ AP, stop building and spend.`, metric: 'apCapped' });
  } else if (totalApCapped > t.apCap[1] * fights.length) {
    tips.push({ severity: 'warning', title: 'Minor AP Waste', detail: `Capped ${totalApCapped} times. Watch the AP bar around 80+.`, metric: 'apCapped' });
  } else if (totalApCapped === 0) {
    tips.push({ severity: 'praise', title: 'Zero AP Waste', detail: 'Perfect resource management this session.' });
  }

  // Grade distribution
  const grades = fights.reduce((acc, f) => { acc[f.grade] = (acc[f.grade] || 0) + 1; return acc; }, {} as Record<string, number>);
  const goodPct = ((grades['S'] || 0) + (grades['A'] || 0)) / fights.length * 100;
  if (goodPct >= 80) {
    tips.push({ severity: 'praise', title: 'Excellent Session', detail: `${Math.round(goodPct)}% of fights graded A or S.` });
  } else if (goodPct < 50) {
    tips.push({ severity: 'warning', title: 'Room to Improve', detail: `Only ${Math.round(goodPct)}% A/S grades. Focus on the critical tips above.` });
  }

  return tips.sort((a, b) => {
    const order = { critical: 0, warning: 1, tip: 2, praise: 3 };
    return order[a.severity] - order[b.severity];
  });
}

function calculateTrends(history: SessionSummary[]): CoachingOutput['trends'] {
  if (history.length < 2) return [];
  const trends: CoachingOutput['trends'] = [];

  for (const metric of ['avgDps', 'avgStarfallUptime', 'avgLunarPct'] as const) {
    const values = history.slice(-5).map(s => s[metric]);
    const first = values[0];
    const last = values[values.length - 1];
    const change = first > 0 ? ((last - first) / first) * 100 : 0;
    trends.push({
      metric,
      values,
      direction: change > 10 ? 'up' : change < -10 ? 'down' : 'flat',
    });
  }

  return trends;
}

function pickNextFocus(tips: CoachingTip[], fights: Fight[], phase: Phase): NextFocus | null {
  // Find the worst critical or warning tip
  const actionable = tips.filter(t => t.severity === 'critical' || t.severity === 'warning');
  if (actionable.length === 0) return null;

  const worst = actionable[0]; // Already sorted by severity
  const t = THRESHOLDS[phase];

  if (worst.metric === 'starfallUptime') {
    const current = fights.reduce((s, f) => s + f.starfallUptime, 0) / fights.length;
    return { metric: 'Starfall Uptime', current: Math.round(current), target: t.starfall[1], tip: 'Pool to 80 AP before Starfall. Pre-cast before pulls.' };
  }
  if (worst.metric === 'lunarPct') {
    const current = fights.reduce((s, f) => s + f.lunarPct, 0) / fights.length;
    return { metric: 'Lunar Eclipse %', current: Math.round(current), target: t.lunar[1], tip: 'Cast Starfire to set Eclipse type, then press Lunar Eclipse.' };
  }
  if (worst.metric === 'apCapped') {
    const current = fights.reduce((s, f) => s + f.apCapped, 0);
    return { metric: 'AP Waste', current, target: 0, tip: 'At 80+ AP, stop building. Spend on Starfall (AoE) or Starsurge (ST).' };
  }

  return null;
}

export function useCoaching(
  fights: Fight[],
  sessionHistory: SessionSummary[],
  level: number,
  ilvl: number,
): CoachingOutput {
  return useMemo(() => {
    const phase = getPhase(level, ilvl);
    const tips = analyzeFights(fights, phase);
    const trends = calculateTrends(sessionHistory);
    const nextFocus = pickNextFocus(tips, fights, phase);

    // Session report
    let sessionReport: CoachingOutput['sessionReport'] = null;
    if (fights.length > 0 && sessionHistory.length > 0) {
      const prev = sessionHistory[sessionHistory.length - 1];
      const avgDps = fights.reduce((s, f) => s + f.dps, 0) / fights.length;
      const avgStarfall = fights.reduce((s, f) => s + f.starfallUptime, 0) / fights.length;
      const grades = fights.reduce((acc, f) => { acc[f.grade] = (acc[f.grade] || 0) + 1; return acc; }, {} as Record<string, number>);

      sessionReport = {
        dpsChange: prev.avgDps > 0 ? ((avgDps - prev.avgDps) / prev.avgDps) * 100 : 0,
        starfallChange: prev.avgStarfallUptime > 0 ? avgStarfall - prev.avgStarfallUptime : 0,
        bestFight: fights.reduce((best, f) => f.dps > (best?.dps || 0) ? f : best, null as Fight | null),
        worstHabit: tips.find(t => t.severity === 'critical')?.title || tips.find(t => t.severity === 'warning')?.title || 'None detected',
        gradeBreakdown: grades,
      };
    }

    return { tips, sessionReport, nextFocus, trends };
  }, [fights, sessionHistory, level, ilvl]);
}
```

- [ ] **Step 2: Verify it compiles**

Run: `cd /Users/micahbos/Desktop/cloud-router-ui/Wow_Balance && npx tsc --noEmit`
Expected: Clean

- [ ] **Step 3: Update LiveSession.tsx to use the hook**

Replace the inline `analyzeSession()` function (lines 391-585) with:
```typescript
import { useCoaching } from '../hooks/useCoaching';
// In component:
const { tips, sessionReport, nextFocus, trends } = useCoaching(
  data?.recentFights || [],
  data?.sessionHistory || [],
  data?.presence?.level || 86,
  data?.presence?.ilvl || 156,
);
```

Remove the old `analyzeSession` function entirely. Update all references from `advice` to `tips`.

- [ ] **Step 4: Verify LiveSession still renders**

Run dev server, navigate to LiveSession section, confirm no errors.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useCoaching.ts src/pages/LiveSession.tsx
git commit -m "feat: extract coaching engine to hook with level-aware thresholds and trends"
```

---

## Phase 3: App UI

### Task 6: Extract useLiveData Hook

**Files:**
- Create: `src/hooks/useLiveData.ts`
- Modify: `src/pages/LiveSession.tsx` (lines 11-38)

- [ ] **Step 1: Create useLiveData with local server detection**

```typescript
// src/hooks/useLiveData.ts
import { useState, useEffect, useCallback } from 'react';
import type { LiveSessionData, SessionState } from '../types/live-session';
import fallbackData from '../data/live-session.json';

const LOCAL_URL = 'http://127.0.0.1:3847/live-session.json';
const GITHUB_URL = 'https://raw.githubusercontent.com/socraticstatic/Wow_Balance/main/src/data/live-session.json';
const LOCAL_POLL_MS = 3000;   // 3s when local server available
const REMOTE_POLL_MS = 60000; // 60s for GitHub fallback

export function useLiveData() {
  const [data, setData] = useState<LiveSessionData>(fallbackData as unknown as LiveSessionData);
  const [isLocal, setIsLocal] = useState(false);
  const [lastCheck, setLastCheck] = useState(Date.now());
  const [polling, setPolling] = useState(true);

  // Detect local server
  useEffect(() => {
    fetch('http://127.0.0.1:3847/health', { mode: 'cors' })
      .then(r => r.ok && setIsLocal(true))
      .catch(() => setIsLocal(false));
  }, []);

  const fetchLive = useCallback(async () => {
    const url = isLocal
      ? LOCAL_URL
      : `${GITHUB_URL}?t=${Date.now()}`;

    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.lastUpdate && (!data?.lastUpdate || json.lastUpdate > data.lastUpdate)) {
          setData(json);
        }
      }
    } catch {
      // If local fails, try GitHub
      if (isLocal) {
        try {
          const res = await fetch(`${GITHUB_URL}?t=${Date.now()}`, { cache: 'no-store' });
          if (res.ok) {
            const json = await res.json();
            if (json.lastUpdate > (data?.lastUpdate || '')) setData(json);
          }
        } catch { /* silent */ }
      }
    }
    setLastCheck(Date.now());
  }, [data?.lastUpdate, isLocal]);

  useEffect(() => {
    if (!polling) return;
    fetchLive();
    const interval = isLocal ? LOCAL_POLL_MS : REMOTE_POLL_MS;
    const id = setInterval(fetchLive, interval);
    return () => clearInterval(id);
  }, [fetchLive, polling, isLocal]);

  // Determine session state
  const sessionState: SessionState = (() => {
    if (!data?.lastUpdate) return 'pre';
    const age = Date.now() - new Date(data.lastUpdate).getTime();
    const fiveMin = 5 * 60 * 1000;
    const thirtyMin = 30 * 60 * 1000;
    if (age < fiveMin) return 'mid';
    if (age < thirtyMin) return 'post';
    return 'pre';
  })();

  return { data, isLocal, lastCheck, polling, setPolling, sessionState };
}
```

- [ ] **Step 2: Update LiveSession.tsx to use the extracted hook**

Replace the inline `useLiveData` function with an import from the new file.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useLiveData.ts src/pages/LiveSession.tsx
git commit -m "feat: extract useLiveData hook with local server detection and session state"
```

---

### Task 7: Progression Context

**Files:**
- Create: `src/context/ProgressionContext.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create ProgressionContext**

```typescript
// src/context/ProgressionContext.tsx
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
```

- [ ] **Step 2: Wrap App.tsx in ProgressionProvider**

In App.tsx, import `useLiveData` and `ProgressionProvider`. Wrap the main content:
```typescript
const { data, sessionState, isLocal } = useLiveData();

return (
  <ProgressionProvider data={data}>
    <div className="min-h-screen relative">
      {/* existing content */}
    </div>
  </ProgressionProvider>
);
```

- [ ] **Step 3: Add relevance dimming to section wrappers**

For each section div in App.tsx, add conditional styling:
```typescript
const { sectionRelevance } = useProgression();

// On each section div:
<div id="raid" ref={ref('raid')}
  style={{ opacity: sectionRelevance['raid'] ? 1 : 0.4, transition: 'opacity 0.3s' }}
>
```

- [ ] **Step 4: Verify sections dim appropriately at level 86**

At level 86: raid, cdplanner, rankings should be dimmed. Others bright.

- [ ] **Step 5: Commit**

```bash
git add src/context/ProgressionContext.tsx src/App.tsx
git commit -m "feat: add progression context with level-gated section relevance"
```

---

### Task 8: Mission Briefing Component

**Files:**
- Create: `src/components/MissionBriefing.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create MissionBriefing component**

Three-state component based on `sessionState` from `useLiveData`:

```typescript
// src/components/MissionBriefing.tsx
import { useState } from 'react';
import { useProgression } from '../context/ProgressionContext';
import type { LiveSessionData, SessionState, CoachingOutput } from '../types/live-session';

interface Props {
  data: LiveSessionData | null;
  sessionState: SessionState;
  coaching: CoachingOutput;
  isLocal: boolean;
}

export default function MissionBriefing({ data, sessionState, coaching, isLocal }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const { level, ilvl, phase } = useProgression();

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed top-16 left-1/2 -translate-x-1/2 z-40 glass px-4 py-1.5 rounded-full text-[11px] font-bold uppercase cursor-pointer"
        style={{ color: 'var(--color-solar)', letterSpacing: '0.1em', border: '1px solid color-mix(in oklch, var(--color-solar) 20%, transparent)' }}
      >
        Mission Briefing
      </button>
    );
  }

  return (
    <div className="sticky top-14 z-30 mx-4 sm:mx-8 mb-6">
      <div className="glass rounded-xl px-5 py-4" style={{ borderColor: 'color-mix(in oklch, var(--color-solar) 15%, transparent)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full" style={{
              background: sessionState === 'mid' ? 'var(--color-nature)' : sessionState === 'post' ? 'var(--color-solar)' : 'var(--color-text-ghost)',
              boxShadow: sessionState === 'mid' ? '0 0 8px var(--color-nature)' : 'none',
            }} />
            <h3 className="text-[13px] font-bold uppercase" style={{ color: 'var(--color-solar)', letterSpacing: '0.1em' }}>
              {sessionState === 'pre' && "Tonight's Priorities"}
              {sessionState === 'mid' && 'Live Session'}
              {sessionState === 'post' && 'Session Report'}
            </h3>
            {isLocal && (
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'color-mix(in oklch, var(--color-nature) 15%, transparent)', color: 'var(--color-nature)' }}>
                LIVE
              </span>
            )}
          </div>
          <button onClick={() => setCollapsed(true)} className="text-[11px] cursor-pointer" style={{ color: 'var(--color-text-ghost)' }}>
            Collapse
          </button>
        </div>

        {sessionState === 'pre' && <PreSession data={data} coaching={coaching} level={level} ilvl={ilvl} phase={phase} />}
        {sessionState === 'mid' && <MidSession data={data} />}
        {sessionState === 'post' && <PostSession data={data} coaching={coaching} />}
      </div>
    </div>
  );
}

function PreSession({ data, coaching, level, ilvl, phase }: {
  data: LiveSessionData | null;
  coaching: CoachingOutput;
  level: number;
  ilvl: number;
  phase: string;
}) {
  // Generate priorities based on state
  const priorities: string[] = [];

  // Gear priority
  if (data?.presence && ilvl < 170) {
    priorities.push(`Gear up - current ilvl ${ilvl}. Queue Normal Dungeons for ilvl 214 drops.`);
  }

  // Level priority
  if (level < 90) {
    priorities.push(`Level to 90 (currently ${level}). Complete campaign quests for fastest XP.`);
  }

  // Coaching focus from last session
  if (coaching.nextFocus) {
    priorities.push(`${coaching.nextFocus.metric}: ${coaching.nextFocus.current}% → ${coaching.nextFocus.target}%. ${coaching.nextFocus.tip}`);
  }

  // Fallback
  if (priorities.length === 0) {
    priorities.push('No recent data. Log in and play to generate priorities.');
  }

  return (
    <ol className="space-y-2">
      {priorities.slice(0, 3).map((p, i) => (
        <li key={i} className="flex gap-3 text-[13px]" style={{ color: 'var(--color-text-1)' }}>
          <span className="font-bold" style={{ color: 'var(--color-solar)', minWidth: '1.2em' }}>{i + 1}.</span>
          {p}
        </li>
      ))}
    </ol>
  );
}

function MidSession({ data }: { data: LiveSessionData | null }) {
  const last = data?.recentFights?.[data.recentFights.length - 1];
  if (!last) return <p className="text-[13px]" style={{ color: 'var(--color-text-3)' }}>Waiting for combat data...</p>;

  return (
    <div className="flex items-center gap-8">
      <div>
        <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--color-text-ghost)', letterSpacing: '0.1em' }}>Last Fight</div>
        <div className="text-2xl font-bold" style={{ color: 'var(--color-solar)' }}>{last.dps.toLocaleString()} DPS</div>
      </div>
      <div>
        <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--color-text-ghost)', letterSpacing: '0.1em' }}>Starfall</div>
        <div className="text-2xl font-bold" style={{ color: 'var(--color-lunar)' }}>{last.starfallUptime}%</div>
      </div>
      <div>
        <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--color-text-ghost)', letterSpacing: '0.1em' }}>Grade</div>
        <div className="text-2xl font-bold" style={{ color: 'var(--color-solar)' }}>{last.grade}</div>
      </div>
      <div className="text-[11px] ml-auto" style={{ color: 'var(--color-text-3)' }}>
        {data?.summary?.totalFights || 0} fights this session
      </div>
    </div>
  );
}

function PostSession({ data, coaching }: { data: LiveSessionData | null; coaching: CoachingOutput }) {
  const report = coaching.sessionReport;

  return (
    <div className="space-y-3">
      {report && (
        <div className="flex items-center gap-6 text-[13px]">
          <span style={{ color: report.dpsChange >= 0 ? 'var(--color-nature)' : 'var(--color-error)' }}>
            DPS {report.dpsChange >= 0 ? '+' : ''}{Math.round(report.dpsChange)}% vs last session
          </span>
          {report.starfallChange !== 0 && (
            <span style={{ color: report.starfallChange >= 0 ? 'var(--color-nature)' : 'var(--color-error)' }}>
              Starfall {report.starfallChange >= 0 ? '+' : ''}{Math.round(report.starfallChange)}% uptime
            </span>
          )}
        </div>
      )}
      {coaching.nextFocus && (
        <div className="text-[13px]" style={{ color: 'var(--color-text-1)' }}>
          <span className="font-bold" style={{ color: 'var(--color-solar)' }}>Next session focus: </span>
          {coaching.nextFocus.metric} ({coaching.nextFocus.current}% → {coaching.nextFocus.target}%)
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Add MissionBriefing to App.tsx**

After the Hero section, before the first lazy section:
```typescript
import MissionBriefing from './components/MissionBriefing';
import { useCoaching } from './hooks/useCoaching';

// Inside App component:
const coaching = useCoaching(
  data?.recentFights || [],
  data?.sessionHistory || [],
  data?.presence?.level || 86,
  data?.presence?.ilvl || 156,
);

// In JSX, after Hero:
<MissionBriefing data={data} sessionState={sessionState} coaching={coaching} isLocal={isLocal} />
```

- [ ] **Step 3: Verify MissionBriefing renders in pre-session state**

Screenshot the app with the mission briefing visible below the hero.

- [ ] **Step 4: Commit**

```bash
git add src/components/MissionBriefing.tsx src/App.tsx
git commit -m "feat: add mission briefing bar with pre/mid/post session states"
```

---

### Task 9: Nav Badges and Freshness

**Files:**
- Modify: `src/components/Nav.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Add freshness dots to section headers**

Read `src/components/SectionHeading.tsx`. Add an optional `freshness` prop:
- `'live'` = green dot
- `'recent'` = amber dot
- `'static'` = gray dot

- [ ] **Step 2: Add "what changed" badge dots to Nav rail icons**

In Nav.tsx, accept a `badges` prop (Record<string, boolean>). Show a small dot on icons where badge is true. Use `var(--color-solar)` for the dot color.

- [ ] **Step 3: Wire badges in App.tsx**

Track `lastViewed` timestamps per section (set on scroll). Compare to `data.lastUpdate`. If data is newer than last view, badge = true.

- [ ] **Step 4: Add relevance dimming to nav icons**

Import `useProgression`. Dim icons for irrelevant sections (opacity 0.35).

- [ ] **Step 5: Verify nav badges and dimming**

Check that raid/rankings nav icons are dimmed at level 86. Check that badge dots appear on sections with fresh data.

- [ ] **Step 6: Commit**

```bash
git add src/components/Nav.tsx src/components/SectionHeading.tsx src/App.tsx
git commit -m "feat: add nav badges, freshness indicators, and relevance dimming"
```

---

## Build Order Summary

| Phase | Task | Description | Depends On |
|-------|------|-------------|------------|
| 1 | Task 1 | Live session types | - |
| 1 | Task 2 | Combat log parser | Task 1 |
| 1 | Task 3 | Local Express server | - |
| 1 | Task 4 | Integrate into watcher | Tasks 2, 3 |
| 2 | Task 5 | Coaching hook | Task 1 |
| 2 | Task 6 | useLiveData hook | Task 1 |
| 3 | Task 7 | Progression context | Task 6 |
| 3 | Task 8 | Mission Briefing | Tasks 5, 6, 7 |
| 3 | Task 9 | Nav badges + freshness | Tasks 6, 7 |
