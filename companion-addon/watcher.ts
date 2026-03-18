/**
 * watcher.ts - SavedVariables File Watcher
 *
 * Monitors WoW's SavedVariables file for the BalanceDossier addon.
 * When WoW writes new data (after /reload, logout, or zone change),
 * this script parses it and pushes to the web app's data directory.
 *
 * Usage: npx tsx watcher.ts
 *
 * The watcher runs continuously. It checks every 2 seconds for changes.
 * Data flows: WoW -> SavedVariables -> watcher -> app data -> live page
 */

import { watch, readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));

// WoW SavedVariables paths (macOS)
const WOW_PATHS = [
  // Retail
  join(process.env.HOME || '', 'Library/Application Support/Blizzard/World of Warcraft/_retail_/WTF/Account'),
  // Classic (just in case)
  join(process.env.HOME || '', 'Library/Application Support/Blizzard/World of Warcraft/_classic_/WTF/Account'),
];

const OUTPUT_PATH = join(__dirname, '..', 'src', 'data', 'live-session.json');
const ADDON_SV_FILE = 'BalanceDossier.lua';

// Find the SavedVariables file
function findSavedVariables(): string | null {
  for (const basePath of WOW_PATHS) {
    if (!existsSync(basePath)) continue;

    // Scan account folders
    try {
      const accounts = execSync(`ls "${basePath}"`, { encoding: 'utf-8' }).trim().split('\n');
      for (const account of accounts) {
        const svPath = join(basePath, account, 'SavedVariables', ADDON_SV_FILE);
        if (existsSync(svPath)) {
          return svPath;
        }
      }
    } catch {
      continue;
    }
  }
  return null;
}

// Parse WoW SavedVariables Lua format
// SavedVariables are Lua tables serialized to disk.
// Format: BalanceDossierDB = { ... }
function parseSavedVariables(content: string): any {
  // Extract the table assignment
  const match = content.match(/BalanceDossierDB\s*=\s*(\{[\s\S]*\})\s*$/);
  if (!match) return null;

  let luaTable = match[1];

  // Convert Lua table syntax to JSON
  // Handle: ["key"] = value, key = value, {nested}, etc.
  luaTable = luaTable
    // Remove Lua comments
    .replace(/--[^\n]*/g, '')
    // ["key"] = value -> "key": value
    .replace(/\["([^"]+)"\]\s*=/g, '"$1":')
    // [number] = value -> "number": value
    .replace(/\[(\d+)\]\s*=/g, '"$1":')
    // key = value (unquoted keys) -> "key": value
    .replace(/(\w+)\s*=/g, '"$1":')
    // nil -> null
    .replace(/\bnil\b/g, 'null')
    // true/false are the same
    // Remove trailing commas before }
    .replace(/,\s*}/g, '}')
    .replace(/,\s*]/g, ']');

  try {
    return JSON.parse(luaTable);
  } catch (e) {
    console.error('Failed to parse SavedVariables:', (e as Error).message);
    // Try a more lenient parse
    try {
      // Sometimes Lua serializes with extra whitespace
      const cleaned = luaTable.replace(/\n/g, ' ').replace(/\s+/g, ' ');
      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  }
}

// Transform raw DB data into the format the web app expects
function transformForApp(db: any): any {
  if (!db || !db.sessions) return null;

  const sessions = db.sessions || [];
  const currentIdx = db.currentSession;
  const current = currentIdx ? sessions[currentIdx - 1] : sessions[sessions.length - 1]; // Lua 1-indexed

  if (!current) return null;

  const fights = current.fights || [];

  // Calculate session-level stats
  const totalFights = fights.length;
  const totalDuration = fights.reduce((sum: number, f: any) => sum + (f.duration || 0), 0);
  const avgDps = totalFights > 0
    ? Math.round(fights.reduce((sum: number, f: any) => sum + (f.dps || 0), 0) / totalFights)
    : 0;
  const avgStarfallUptime = totalFights > 0
    ? Math.round(fights.reduce((sum: number, f: any) => sum + (f.starfallUptime || 0), 0) / totalFights)
    : 0;
  const totalApWasted = fights.reduce((sum: number, f: any) => sum + (f.apWasted || 0), 0);
  const avgLunarPct = totalFights > 0
    ? Math.round(fights.reduce((sum: number, f: any) => sum + (f.lunarPct || 0), 0) / totalFights)
    : 0;

  // Grade distribution
  const grades: Record<string, number> = {};
  for (const f of fights) {
    grades[f.grade] = (grades[f.grade] || 0) + 1;
  }

  return {
    lastUpdate: new Date().toISOString(),
    playerName: current.playerName,
    spec: current.spec,
    sessionStart: current.startTime,

    summary: {
      totalFights,
      totalDuration,
      avgDps,
      avgStarfallUptime,
      totalApWasted,
      avgLunarPct,
      grades,
    },

    // Last 20 fights for the timeline
    recentFights: fights.slice(-20).map((f: any) => ({
      timestamp: f.timestamp,
      duration: f.duration,
      dps: f.dps,
      grade: f.grade,
      starfallUptime: f.starfallUptime,
      lunarPct: f.lunarPct,
      apCapped: f.apCapped,
      targets: f.uniqueTargets,
      starfallDamagePct: f.starfallDamagePct,
      errorCount: f.errorCount,
      casts: f.casts,
    })),

    // All-time bests
    bests: {
      highestDps: Math.max(...fights.map((f: any) => f.dps || 0), 0),
      bestGrade: fights.find((f: any) => f.grade === 'S') ? 'S' : fights.find((f: any) => f.grade === 'A') ? 'A' : 'B',
      bestStarfallUptime: Math.max(...fights.map((f: any) => f.starfallUptime || 0), 0),
      longestFight: Math.max(...fights.map((f: any) => f.duration || 0), 0),
    },
  };
}

// Main watcher loop
async function main() {
  console.log('Balance Dossier - SavedVariables Watcher');
  console.log('=========================================\n');

  const svPath = findSavedVariables();

  if (!svPath) {
    console.log('SavedVariables file not found. Looking in:');
    WOW_PATHS.forEach(p => console.log(`  ${p}`));
    console.log('\nMake sure:');
    console.log('  1. WoW is installed');
    console.log('  2. BalanceDossier addon is installed in your Addons folder');
    console.log('  3. You have logged in at least once with the addon enabled');
    console.log('\nThe watcher will keep checking every 10 seconds...\n');

    // Keep trying
    setInterval(() => {
      const path = findSavedVariables();
      if (path) {
        console.log(`Found SavedVariables at: ${path}`);
        startWatching(path);
      }
    }, 10000);
    return;
  }

  console.log(`Found SavedVariables: ${svPath}\n`);
  startWatching(svPath);
}

let lastModified = 0;

function startWatching(svPath: string) {
  // Initial read
  processFile(svPath);

  // Watch for changes
  console.log('Watching for changes... (WoW writes on /reload, logout, or zone change)\n');

  setInterval(() => {
    try {
      const stat = require('fs').statSync(svPath);
      const mtime = stat.mtimeMs;
      if (mtime > lastModified) {
        lastModified = mtime;
        processFile(svPath);
      }
    } catch {
      // File might be locked during write
    }
  }, 2000);
}

function processFile(svPath: string) {
  try {
    const content = readFileSync(svPath, 'utf-8');
    const db = parseSavedVariables(content);

    if (!db) {
      console.log('  Could not parse SavedVariables');
      return;
    }

    const appData = transformForApp(db);
    if (!appData) {
      console.log('  No session data found');
      return;
    }

    writeFileSync(OUTPUT_PATH, JSON.stringify(appData, null, 2));

    const ts = new Date().toLocaleTimeString();
    console.log(`[${ts}] Updated: ${appData.summary.totalFights} fights, avg ${appData.summary.avgDps.toLocaleString()} DPS, ${appData.summary.avgStarfallUptime}% SF uptime`);
  } catch (e) {
    console.error('  Error:', (e as Error).message);
  }
}

main().catch(console.error);
