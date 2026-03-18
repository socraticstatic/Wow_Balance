// watcher.ts
var import_fs = require("fs");
var import_path = require("path");
var isWindows = process.platform === "win32";
var WOW_PATHS = isWindows ? [
  // Windows - standard install locations
  "C:\\Program Files (x86)\\World of Warcraft\\_retail_\\WTF\\Account",
  "C:\\Program Files\\World of Warcraft\\_retail_\\WTF\\Account",
  "D:\\World of Warcraft\\_retail_\\WTF\\Account",
  "D:\\Games\\World of Warcraft\\_retail_\\WTF\\Account",
  "E:\\World of Warcraft\\_retail_\\WTF\\Account",
  // Battle.net default
  (0, import_path.join)(process.env.PROGRAMFILES || "C:\\Program Files", "World of Warcraft", "_retail_", "WTF", "Account"),
  (0, import_path.join)(process.env["PROGRAMFILES(X86)"] || "C:\\Program Files (x86)", "World of Warcraft", "_retail_", "WTF", "Account")
] : [
  // macOS
  (0, import_path.join)(process.env.HOME || "", "Library/Application Support/Blizzard/World of Warcraft/_retail_/WTF/Account"),
  "/Applications/World of Warcraft/_retail_/WTF/Account"
];
var OUTPUT_PATH = (0, import_path.join)(process.cwd(), "live-session.json");
var ADDON_SV_FILE = "BalanceDossier.lua";
function findSavedVariables() {
  for (const basePath of WOW_PATHS) {
    if (!(0, import_fs.existsSync)(basePath)) continue;
    try {
      const entries = (0, import_fs.readdirSync)(basePath);
      for (const account of entries) {
        const accountPath = (0, import_path.join)(basePath, account);
        try {
          if (!(0, import_fs.statSync)(accountPath).isDirectory()) continue;
        } catch {
          continue;
        }
        const svPath = (0, import_path.join)(accountPath, "SavedVariables", ADDON_SV_FILE);
        if ((0, import_fs.existsSync)(svPath)) {
          return svPath;
        }
      }
    } catch {
      continue;
    }
  }
  return null;
}
function parseSavedVariables(content) {
  const match = content.match(/BalanceDossierDB\s*=\s*(\{[\s\S]*\})\s*$/);
  if (!match) return null;
  let luaTable = match[1];
  luaTable = luaTable.replace(/--[^\n]*/g, "").replace(/\["([^"]+)"\]\s*=/g, '"$1":').replace(/\[(\d+)\]\s*=/g, '"$1":').replace(/(\w+)\s*=/g, '"$1":').replace(/\bnil\b/g, "null").replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");
  try {
    return JSON.parse(luaTable);
  } catch (e) {
    console.error("Failed to parse SavedVariables:", e.message);
    try {
      const cleaned = luaTable.replace(/\n/g, " ").replace(/\s+/g, " ");
      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  }
}
function transformForApp(db) {
  if (!db || !db.sessions) return null;
  const sessions = db.sessions || [];
  const currentIdx = db.currentSession;
  const current = currentIdx ? sessions[currentIdx - 1] : sessions[sessions.length - 1];
  if (!current) return null;
  const fights = current.fights || [];
  const totalFights = fights.length;
  const totalDuration = fights.reduce((sum, f) => sum + (f.duration || 0), 0);
  const avgDps = totalFights > 0 ? Math.round(fights.reduce((sum, f) => sum + (f.dps || 0), 0) / totalFights) : 0;
  const avgStarfallUptime = totalFights > 0 ? Math.round(fights.reduce((sum, f) => sum + (f.starfallUptime || 0), 0) / totalFights) : 0;
  const totalApWasted = fights.reduce((sum, f) => sum + (f.apWasted || 0), 0);
  const avgLunarPct = totalFights > 0 ? Math.round(fights.reduce((sum, f) => sum + (f.lunarPct || 0), 0) / totalFights) : 0;
  const grades = {};
  for (const f of fights) {
    grades[f.grade] = (grades[f.grade] || 0) + 1;
  }
  return {
    lastUpdate: (/* @__PURE__ */ new Date()).toISOString(),
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
      grades
    },
    // Last 20 fights for the timeline
    recentFights: fights.slice(-20).map((f) => ({
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
      casts: f.casts
    })),
    // All-time bests
    bests: {
      highestDps: Math.max(...fights.map((f) => f.dps || 0), 0),
      bestGrade: fights.find((f) => f.grade === "S") ? "S" : fights.find((f) => f.grade === "A") ? "A" : "B",
      bestStarfallUptime: Math.max(...fights.map((f) => f.starfallUptime || 0), 0),
      longestFight: Math.max(...fights.map((f) => f.duration || 0), 0)
    }
  };
}
async function main() {
  console.log("Balance Dossier - SavedVariables Watcher");
  console.log("=========================================\n");
  const svPath = findSavedVariables();
  if (!svPath) {
    console.log("SavedVariables file not found. Looking in:");
    WOW_PATHS.forEach((p) => console.log(`  ${p}`));
    console.log("\nMake sure:");
    console.log("  1. WoW is installed");
    console.log("  2. BalanceDossier addon is installed in your Addons folder");
    console.log("  3. You have logged in at least once with the addon enabled");
    console.log("\nThe watcher will keep checking every 10 seconds...\n");
    setInterval(() => {
      const path = findSavedVariables();
      if (path) {
        console.log(`Found SavedVariables at: ${path}`);
        startWatching(path);
      }
    }, 1e4);
    return;
  }
  console.log(`Found SavedVariables: ${svPath}
`);
  startWatching(svPath);
}
var lastModified = 0;
function startWatching(svPath) {
  processFile(svPath);
  console.log("Watching for changes... (WoW writes on /reload, logout, or zone change)\n");
  setInterval(() => {
    try {
      const stat = (0, import_fs.statSync)(svPath);
      const mtime = stat.mtimeMs;
      if (mtime > lastModified) {
        lastModified = mtime;
        processFile(svPath);
      }
    } catch {
    }
  }, 2e3);
}
function processFile(svPath) {
  try {
    const content = (0, import_fs.readFileSync)(svPath, "utf-8");
    const db = parseSavedVariables(content);
    if (!db) {
      console.log("  Could not parse SavedVariables");
      return;
    }
    const appData = transformForApp(db);
    if (!appData) {
      console.log("  No session data found");
      return;
    }
    (0, import_fs.writeFileSync)(OUTPUT_PATH, JSON.stringify(appData, null, 2));
    const ts = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    console.log(`[${ts}] Updated: ${appData.summary.totalFights} fights, avg ${appData.summary.avgDps.toLocaleString()} DPS, ${appData.summary.avgStarfallUptime}% SF uptime`);
  } catch (e) {
    console.error("  Error:", e.message);
  }
}
main().catch(console.error);
