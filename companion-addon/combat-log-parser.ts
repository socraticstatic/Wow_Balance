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

  parseNewLines(logPath: string): ParsedFight[] {
    const completedFights: ParsedFight[] = [];

    try {
      const stat = statSync(logPath);
      if (stat.size < this.lastReadPos) {
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

    if (this.currentFight && Date.now() - this.lastCombatTime > this.COMBAT_GAP_MS) {
      const fight = this.finalizeFight();
      if (fight) completedFights.push(fight);
    }

    this.fights.push(...completedFights);
    return completedFights;
  }

  private processLine(line: string): ParsedFight | null {
    const match = line.match(/^(\d+\/\d+)\s+(\d+:\d+:\d+\.\d+)\s\s(.+)$/);
    if (!match) return null;

    const [, , , payload] = match;
    const parts = payload.split(',');
    const subevent = parts[0];
    const sourceName = parts[2]?.replace(/"/g, '');

    if (sourceName !== this.playerName) {
      if (subevent === 'ENCOUNTER_END') {
        return this.finalizeFight();
      }
      return null;
    }

    this.lastCombatTime = Date.now();

    const spellId = parseInt(parts[9] || '0', 10);
    const amount = parseInt(parts[29] || parts[22] || '0', 10);
    const destGUID = parts[5] || '';

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

    if (subevent === 'SPELL_DAMAGE' || subevent === 'SPELL_PERIODIC_DAMAGE') {
      this.currentFight.totalDamage += amount;
      if (spellId === SPELLS.STARFALL) this.currentFight.starfallDamage += amount;
      if (destGUID) this.currentFight.targets.add(destGUID);
    }

    if (subevent === 'SPELL_CAST_SUCCESS') {
      this.currentFight.casts++;
    }

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

    if (f.starfallActive) f.starfallUptime += now - f.starfallStart;
    if (f.lunarActive) f.lunarTime += now - f.lunarStart;
    if (f.solarActive) f.solarTime += now - f.solarStart;

    this.currentFight = null;

    if (duration < 8) return null;

    const durationMs = duration * 1000;
    const starfallUptime = durationMs > 0 ? Math.min(100, (f.starfallUptime / durationMs) * 100) : 0;
    const eclipseTotal = f.lunarTime + f.solarTime;
    const lunarPct = eclipseTotal > 0 ? (f.lunarTime / eclipseTotal) * 100 : 0;
    const solarPct = eclipseTotal > 0 ? (f.solarTime / eclipseTotal) * 100 : 0;
    const starfallDamagePct = f.totalDamage > 0 ? (f.starfallDamage / f.totalDamage) * 100 : 0;
    const dps = duration > 0 ? Math.round(f.totalDamage / duration) : 0;

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
      starfallCasts: 0,
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
