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

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { CombatLogParser, getCombatLogPath } from './combat-log-parser';
import { startLocalServer } from './local-server';

// Detect platform and set WoW paths
const isWindows = process.platform === 'win32';

const WOW_PATHS = isWindows
  ? [
    // Windows - standard install locations
    'C:\\Program Files (x86)\\World of Warcraft\\_retail_\\WTF\\Account',
    'C:\\Program Files\\World of Warcraft\\_retail_\\WTF\\Account',
    'D:\\World of Warcraft\\_retail_\\WTF\\Account',
    'D:\\Games\\World of Warcraft\\_retail_\\WTF\\Account',
    'E:\\World of Warcraft\\_retail_\\WTF\\Account',
    // Battle.net default
    join(process.env.PROGRAMFILES || 'C:\\Program Files', 'World of Warcraft', '_retail_', 'WTF', 'Account'),
    join(process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)', 'World of Warcraft', '_retail_', 'WTF', 'Account'),
  ]
  : [
    // macOS
    join(process.env.HOME || '', 'Library/Application Support/Blizzard/World of Warcraft/_retail_/WTF/Account'),
    '/Applications/World of Warcraft/_retail_/WTF/Account',
  ];

// Output path for the JSON data
const OUTPUT_PATH = join(process.cwd(), 'live-session.json');

// GitHub config for auto-push
// The watcher pushes live-session.json directly to the repo via GitHub API.
// No local clone needed. Just a personal access token.
const GITHUB_CONFIG = {
  owner: 'socraticstatic',
  repo: 'Wow_Balance',
  branch: 'main',
  filePath: 'src/data/live-session.json',
  // Token loaded from environment variable or config file
  token: process.env.GITHUB_TOKEN || loadTokenFromFile(),
};

function loadTokenFromFile(): string {
  const configPath = join(process.cwd(), '.env');
  if (existsSync(configPath)) {
    const content = readFileSync(configPath, 'utf-8');
    const match = content.match(/GITHUB_TOKEN=(.+)/);
    if (match) return match[1].trim();
  }
  return '';
}

async function pushToGitHub(data: any): Promise<boolean> {
  if (!GITHUB_CONFIG.token) {
    console.log('  [GitHub] No token configured. Skipping push.');
    console.log('  [GitHub] Set GITHUB_TOKEN env var or create .env file with GITHUB_TOKEN=ghp_...');
    return false;
  }

  const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
  const apiUrl = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.filePath}`;

  try {
    // Get current file SHA (needed for update)
    let sha: string | undefined;
    try {
      const getResp = await fetch(apiUrl, {
        headers: {
          'Authorization': `Bearer ${GITHUB_CONFIG.token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });
      if (getResp.ok) {
        const existing = await getResp.json() as { sha: string };
        sha = existing.sha;
      }
    } catch {
      // File doesn't exist yet, that's fine
    }

    // Push update
    const body: Record<string, string> = {
      message: `Live session update: ${new Date().toISOString()}`,
      content,
      branch: GITHUB_CONFIG.branch,
    };
    if (sha) body.sha = sha;

    const putResp = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_CONFIG.token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (putResp.ok) {
      console.log('  [GitHub] Pushed to repo. Pages will rebuild.');
      return true;
    } else {
      const err = await putResp.text();
      console.log(`  [GitHub] Push failed: ${putResp.status} ${err.substring(0, 100)}`);
      return false;
    }
  } catch (e) {
    console.log(`  [GitHub] Push error: ${(e as Error).message}`);
    return false;
  }
}
const ADDON_SV_FILE = 'BalanceDossier.lua';

// Find the SavedVariables file
function findSavedVariables(): string | null {
  for (const basePath of WOW_PATHS) {
    if (!existsSync(basePath)) continue;

    // Scan account folders (cross-platform)
    try {
      const entries = readdirSync(basePath);
      for (const account of entries) {
        const accountPath = join(basePath, account);
        try {
          if (!statSync(accountPath).isDirectory()) continue;
        } catch { continue; }
        const svPath = join(accountPath, 'SavedVariables', ADDON_SV_FILE);
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

    // Presence data from the addon
    presence: db.presence ? {
      lastPlayed: db.presence.lastPlayed ? new Date(db.presence.lastPlayed * 1000).toISOString() : null,
      zone: db.presence.zone || 'Unknown',
      subZone: db.presence.subZone || '',
      mapName: db.presence.mapName || '',
      level: db.presence.level || 0,
      ilvl: db.presence.ilvl || 0,
      x: db.presence.x || 0,
      y: db.presence.y || 0,
      questCount: db.presence.questCount || 0,
      quests: (db.presence.quests || []).map((q: any) => ({
        id: q.id,
        title: q.title,
        level: q.level,
        isComplete: q.isComplete,
        objectives: q.objectives || [],
        frequency: q.frequency === 1 ? 'daily' : q.frequency === 2 ? 'weekly' : 'normal',
      })),
    } : null,
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
let combatParser: CombatLogParser | null = null;
let combatLogPath: string | null = null;
let lastCombatTime: number = Date.now();
let sessionHistory: any[] = [];
let currentSessionFights: any[] = [];
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const MAX_SESSION_HISTORY = 20;

// Load persisted session history from disk if it exists
function loadSessionHistory(outputDir: string): void {
  const historyPath = join(outputDir, 'session-history.json');
  if (existsSync(historyPath)) {
    try {
      sessionHistory = JSON.parse(readFileSync(historyPath, 'utf-8'));
      console.log(`  Loaded ${sessionHistory.length} previous sessions from history.`);
    } catch {
      sessionHistory = [];
    }
  }
}

function saveSessionHistory(outputDir: string): void {
  const historyPath = join(outputDir, 'session-history.json');
  writeFileSync(historyPath, JSON.stringify(sessionHistory, null, 2));
}

function summarizeAndArchiveSession(outputDir: string): void {
  if (currentSessionFights.length === 0) return;

  const totalFights = currentSessionFights.length;
  const totalDuration = currentSessionFights.reduce((sum, f) => sum + (f.duration || 0), 0);
  const avgDps = totalFights > 0
    ? Math.round(currentSessionFights.reduce((sum, f) => sum + (f.dps || 0), 0) / totalFights)
    : 0;

  const session = {
    startTime: currentSessionFights[0]?.timestamp || new Date().toISOString(),
    endTime: currentSessionFights[currentSessionFights.length - 1]?.timestamp || new Date().toISOString(),
    totalFights,
    totalDuration,
    avgDps,
    highestDps: Math.max(...currentSessionFights.map(f => f.dps || 0), 0),
    archivedAt: new Date().toISOString(),
  };

  sessionHistory.push(session);
  if (sessionHistory.length > MAX_SESSION_HISTORY) {
    sessionHistory = sessionHistory.slice(-MAX_SESSION_HISTORY);
  }

  saveSessionHistory(outputDir);

  const ts = new Date().toLocaleTimeString();
  console.log(`[${ts}] Session archived: ${totalFights} fights, avg ${avgDps.toLocaleString()} DPS`);

  currentSessionFights = [];
}

function checkSessionTimeout(outputDir: string): void {
  if (currentSessionFights.length === 0) return;
  const elapsed = Date.now() - lastCombatTime;
  if (elapsed >= SESSION_TIMEOUT_MS) {
    console.log('  No new combat for 30 minutes. Archiving session...');
    summarizeAndArchiveSession(outputDir);
  }
}

function startWatching(svPath: string) {
  const outputDir = process.cwd();

  // Start local server for real-time data access
  startLocalServer(join(outputDir, 'live-session.json'));

  // Load session history from disk
  loadSessionHistory(outputDir);

  // Initial read to get player name for combat log parser
  processFile(svPath);

  // Initialize combat log parser using player name from SavedVariables
  try {
    const content = readFileSync(svPath, 'utf-8');
    const db = parseSavedVariables(content);
    const appData = db ? transformForApp(db) : null;
    const playerName = appData?.playerName || 'Unknown';

    combatParser = new CombatLogParser(playerName);
    combatLogPath = getCombatLogPath();

    if (combatLogPath) {
      console.log(`  Combat log parser initialized for "${playerName}"`);
      console.log(`  Watching combat log: ${combatLogPath}\n`);
    } else {
      console.log('  Combat log not found. Parser will skip combat log parsing.\n');
    }
  } catch (e) {
    console.log(`  Could not initialize combat log parser: ${(e as Error).message}`);
  }

  // Watch for changes
  console.log('Watching for changes... (WoW writes on /reload, logout, or zone change)\n');

  setInterval(() => {
    try {
      const stat = statSync(svPath);
      const mtime = stat.mtimeMs;
      if (mtime > lastModified) {
        lastModified = mtime;
        processFile(svPath);
      }
    } catch {
      // File might be locked during write
    }

    // Parse new combat log lines if parser and path are available
    if (combatParser && combatLogPath && existsSync(combatLogPath)) {
      try {
        const newFights = combatParser.parseNewLines(combatLogPath);
        if (newFights && newFights.length > 0) {
          lastCombatTime = Date.now();
          currentSessionFights.push(...newFights);

          // Merge new fights into live-session.json
          mergeCombatFights(newFights, outputDir);
        }
      } catch {
        // Combat log might be locked or temporarily unavailable
      }
    }

    // Check if we should archive the current session
    checkSessionTimeout(outputDir);
  }, 2000);
}

function mergeCombatFights(newFights: any[], outputDir: string): void {
  const outputPath = join(outputDir, 'live-session.json');
  if (!existsSync(outputPath)) return;

  try {
    const existing = JSON.parse(readFileSync(outputPath, 'utf-8'));

    // Append new fights to recentFights, keep last 20
    const merged = [...(existing.recentFights || []), ...newFights];
    existing.recentFights = merged.slice(-20);

    // Recalculate summary stats with all fights
    const allFights = existing.recentFights;
    const totalFights = allFights.length;
    existing.summary = {
      ...existing.summary,
      totalFights,
      avgDps: totalFights > 0
        ? Math.round(allFights.reduce((sum: number, f: any) => sum + (f.dps || 0), 0) / totalFights)
        : 0,
      avgStarfallUptime: totalFights > 0
        ? Math.round(allFights.reduce((sum: number, f: any) => sum + (f.starfallUptime || 0), 0) / totalFights)
        : 0,
      totalApWasted: allFights.reduce((sum: number, f: any) => sum + (f.apWasted || 0), 0),
    };

    // Update bests
    existing.bests = {
      ...existing.bests,
      highestDps: Math.max(...allFights.map((f: any) => f.dps || 0), existing.bests?.highestDps || 0),
    };

    // Attach session history
    existing.sessionHistory = sessionHistory;

    existing.lastUpdate = new Date().toISOString();
    writeFileSync(outputPath, JSON.stringify(existing, null, 2));

    const ts = new Date().toLocaleTimeString();
    console.log(`[${ts}] Combat log: merged ${newFights.length} new fight(s)`);

    // Push updated data to GitHub
    pushToGitHub(existing).catch(() => {});
  } catch (e) {
    console.error('  Error merging combat fights:', (e as Error).message);
  }
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

    // Push to GitHub so Pages rebuilds with fresh data
    pushToGitHub(appData).catch(() => {});
  } catch (e) {
    console.error('  Error:', (e as Error).message);
  }
}

main().catch(console.error);
