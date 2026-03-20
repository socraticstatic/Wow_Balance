# Living Dossier Design Spec

**Date:** 2026-03-20
**Status:** Draft
**Author:** Helen (Claude Opus 4.6)

## Problem

The Balance Druid Dossier app has three compounding problems:
1. **Stale data** - Most content is static JSON. Live session data requires /reload in WoW to flush. The app doesn't reflect where the player actually is.
2. **Not actionable** - 22 sections of reference content. No guidance on what to DO next.
3. **Feels like a wiki** - Static, passive. Doesn't feel alive or responsive to gameplay.

## User Context

- **Player:** Spiracle, Level 86 Night Elf Balance Druid, Zul'jin (US)
- **Play pattern:** Weekday short bursts (30-60 min), weekend long sessions (2-4 hours)
- **App usage:** Before (planning), during (second monitor), and after (review) play sessions
- **Critical constraint:** If data feels stale, the player stops trusting and opening the app

## Design Principles

- The app knows where you are in the game
- It tells you what to do, not just what exists
- Data freshness is the heartbeat - visible, trustworthy, real-time
- Never more than 3-5 priorities. Ruthless focus.
- Everything already built stays. This is additive, not a rewrite.

---

## 1. Live Data Pipeline

### Problem
SavedVariables only flush on /reload or logout. This makes the app feel dead during play.

### Solution: Dual-Channel Data

**Channel 1 - Combat Log File (real-time)**
- WoW writes `WoWCombatLog.txt` to disk live when Advanced Combat Logging is on (`/combatlog`)
- A new watcher module parses this file in real-time
- Extracts Balance Druid combat metrics: DPS, Starfall uptime, AP waste, Eclipse state, target count
- Uses the same spell IDs already defined in Combat.lua
- Pushes data on fight end (ENCOUNTER_END event or 5-second combat gap)
- No /reload required. No addon dependency for combat data.

**Channel 2 - SavedVariables (character state)**
- Addon continues tracking: level, ilvl, zone, quest log, equipped gear
- Flushes naturally on logout (no /reload needed if player just quits)
- Watcher detects file changes and pushes character state

**Local Server**
- Watcher runs a tiny Express server (e.g., port 3847)
- Writes `live-session.json` locally on every update
- App detects local server availability and reads directly (< 1s latency)
- Falls back to GitHub raw content poll (60s) when local server unavailable

**Session History**
- `live-session.json` gains a `sessionHistory[]` array
- Last 20 sessions, each summarized: date, fight count, avg DPS, avg Starfall uptime, avg grade, focus metric
- Enables trend analysis across sessions

### Combat Log Parser Specification

**File location:**
- Windows: `C:\Program Files (x86)\World of Warcraft\_retail_\Logs\WoWCombatLog.txt`
- macOS: `~/Library/Application Support/Blizzard/World of Warcraft/_retail_/Logs/WoWCombatLog.txt`

**Events to parse:**
- `SPELL_DAMAGE` - DPS calculation (filter by source=player)
- `SPELL_AURA_APPLIED` / `SPELL_AURA_REMOVED` - Starfall uptime, Eclipse state
- `SPELL_CAST_SUCCESS` - Rotation tracking, AP waste detection
- `ENCOUNTER_START` / `ENCOUNTER_END` - Fight boundaries
- `COMBAT_LOG_EVENT` with UNIT_DIED - fight end detection for trash

**Spell IDs (Midnight 12.0.1):**
- Starfall: 191034
- Starsurge: 78674
- Moonfire: 8921, Sunfire: 93402
- Starfire: 194153, Wrath: 190984
- Eclipse (Solar): 48517, Eclipse (Lunar): 48518
- Incarnation: 102560

**Output:** Same `recentFights[]` schema as current live-session.json, plus `sessionHistory[]`.

---

## 2. Mission Briefing Bar

### Concept
A persistent sticky bar below the nav. Adapts to the player's current moment. Not a new page - sits on top of the existing dossier scroll.

### Three States

**Pre-session** (last combat data > 30 min old)
- Title: "Tonight's Priorities"
- 3 ranked actions based on current level, ilvl, gear gaps, and last session performance
- Gear gap summary line: "4 slots below ilvl 160. Biggest: Back (145), Chest (145)"
- Level-appropriate content: at 86, suggest dungeons and quests, not raids

**Mid-session** (combat data < 5 min old)
- Collapses to slim live bar: last fight DPS | Starfall uptime % | grade
- Tap to expand: fight timeline, coaching tip for weakest metric
- Large numbers, high contrast - designed for second-monitor glancing

**Post-session** (combat data 5-30 min old)
- Title: "Session Report"
- DPS trend, best fight, worst habit, grade distribution
- Session-over-session comparison: "Starfall uptime +8% from yesterday"
- "Next session focus:" one specific improvement target

### Implementation
- New component: `src/components/MissionBriefing.tsx`
- Reads from `useLiveData()` hook (existing) + `useCoaching()` hook (new)
- Renders in `App.tsx` between Nav and first section
- Collapsible via toggle button
- Respects light/dark mode via existing CSS variables

### Priority Rules
- Never more than 3-5 items displayed
- Priorities ranked by: gear upgrades available > rotation improvement potential > content unlocks > weekly tasks
- Level gates: no raid/M+ priorities below level 90

---

## 3. Context-Aware Sections

### Relevance Dimming
- Sections not relevant to current level/progression get: 60% opacity, collapsed by default, badge showing unlock condition
- At level 86: dim Raid Guides, M+ CD Planner, Rankings. Bright: Gear Delta, AoE Optimization, Talent Build, Action Bars.
- Relevance rules defined per section based on level thresholds and gear gates

### Freshness Indicators
- Green dot: synced < 1 hour
- Amber dot: synced < 24 hours
- Gray dot: static reference content
- Displayed on section headers next to the title
- Sections fed by live data show actual sync timestamp on hover

### "What Changed" Badges
- Nav rail icons get notification dots when underlying data updates
- Badge clears when user scrolls to (or navigates to) that section
- Tracked via a simple `lastViewed` timestamp per section vs data `lastUpdate`

### Nav Rail Grouping
- Active sections (relevant to current progression): full brightness icons
- Reference sections (not yet relevant or always-reference): muted icons
- No reordering - position stays consistent to build muscle memory

### Implementation
- New context: `src/context/ProgressionContext.tsx` - provides level, ilvl, progression phase
- Each section wrapper checks relevance and renders dimmed/collapsed if not active
- Nav component reads same context for icon brightness
- Badge state stored in React state (resets on page load, which is fine)

---

## 4. Coaching Engine Upgrade

### Level-Aware Thresholds
- Coaching targets scale with progression phase:
  - Leveling (80-89): Starfall uptime > 50% is good, > 65% is great
  - Fresh 90 (ilvl < 230): > 60% good, > 75% great
  - Geared (ilvl 260+): > 75% good, > 85% great
- Same scaling for AP waste, Eclipse distribution, DPS targets

### Trend Tracking
- Compare current session to last 5 sessions for each metric
- Surface improvements: "Starfall uptime: 58% → 72% over 5 sessions"
- Surface regressions: "AP waste increased - you capped 4x more than last session"
- Trends feed into Mission Briefing's post-session report

### One Drill Per Session
- After each session, coaching engine selects ONE focus for next time
- Selection logic: weakest metric that is most improvable (largest gap between current and target)
- Persists in live-session.json as `nextFocus: { metric, current, target, tip }`
- Displayed in Mission Briefing pre-session state

### Implementation
- Extract from `LiveSession.tsx` lines 391-585 into `src/hooks/useCoaching.ts`
- Hook accepts: `recentFights[]`, `sessionHistory[]`, `characterState`
- Returns: `{ tips: Tip[], sessionReport: Report, nextFocus: Focus, trends: Trend[] }`
- Consumed by both `MissionBriefing` and `LiveSession` page

---

## Build Order

1. **Live Data Pipeline** - Combat log parser + local server + session history
2. **Coaching Hook** - Extract and upgrade coaching logic
3. **Mission Briefing** - Build the three-state bar
4. **Context-Aware Sections** - Relevance dimming, freshness, badges

Each phase is independently useful. Pipeline makes data fresh. Coaching makes advice smart. Briefing makes priorities visible. Context makes sections relevant.

## What Stays the Same

- All 22 dossier sections
- Medieval design system (Cormorant, oklch palette, glassmorphism)
- Parallax stars, lightning effects
- Light/dark mode
- The scroll experience
- Companion addon (enhanced, not replaced)
- GitHub Pages deployment

## Files Created/Modified

**New files:**
- `companion-addon/combat-log-parser.ts` - WoWCombatLog.txt parser
- `companion-addon/local-server.ts` - Express server for local data
- `src/components/MissionBriefing.tsx` - Sticky briefing bar
- `src/hooks/useCoaching.ts` - Coaching engine
- `src/context/ProgressionContext.tsx` - Level/progression state

**Modified files:**
- `companion-addon/watcher.ts` - Add combat log channel, session history
- `src/App.tsx` - Add MissionBriefing, wrap in ProgressionContext
- `src/pages/LiveSession.tsx` - Consume useCoaching hook instead of inline logic
- `src/components/Nav.tsx` - Badge state, relevance grouping
- `src/data/live-session.json` - Schema additions (sessionHistory, nextFocus)
