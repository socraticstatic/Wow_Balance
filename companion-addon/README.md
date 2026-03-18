# Balance Dossier - WoW Companion Addon

In-game tracking addon for the Balance Druid Dossier web app.

## What it tracks

- **Starfall uptime** per fight (% of combat time with Starfall active)
- **AP waste** (builder casts at 90+ Astral Power = wasted generation)
- **Eclipse distribution** (% time in Lunar vs Solar Eclipse)
- **Damage breakdown** (Starfall / Starsurge / DoTs / Builders)
- **Rotation errors** (AP capping, missed Eclipse transitions)
- **Per-fight grade** (S through F based on AoE efficiency)
- **Cast timeline** (every spell cast with timestamp)

## Install

1. Copy the `BalanceDossier` folder to your WoW addons directory:
   ```
   ~/Library/Application Support/Blizzard/World of Warcraft/_retail_/Interface/AddOns/
   ```

2. Restart WoW or type `/reload` in-game.

3. Verify: type `/bd status` in-game chat.

## In-game usage

- `/bd status` - Show tracking status
- `/bd last` - Show last fight summary
- `/bd export` - Mark session for export
- `/bd reset` - Clear current session

The addon automatically tracks every combat encounter when you're in Balance spec. A small HUD shows real-time Starfall status, AP level, and Eclipse state during combat.

## Connecting to the web app

1. Start the file watcher:
   ```bash
   cd companion-addon
   npx tsx watcher.ts
   ```

2. Play WoW normally. After each fight, `/reload` or change zones to trigger a SavedVariables write.

3. The watcher detects the file change, parses it, and writes to `src/data/live-session.json`.

4. The web app's Live Session page auto-refreshes with your latest data.

## How it works

```
WoW Client                    Your Mac                    Web App
-----------                   ---------                   -------
Combat events                    |                           |
    |                            |                           |
    v                            |                           |
BalanceDossier                   |                           |
Lua addon                        |                           |
    |                            |                           |
    v                            |                           |
SavedVariables                   |                           |
(disk file)  -----> watcher.ts --+---> live-session.json     |
                    (Node.js)    |         |                 |
                                 |         v                 |
                                 |    Vite HMR ----------> Live Session
                                 |                        page updates
```

## Grade system

| Grade | Meaning |
|-------|---------|
| S | Perfect: 85%+ Starfall uptime, 60%+ Lunar, 0 AP waste |
| A | Excellent: minor AP waste or Eclipse mismanagement |
| B | Good: room for improvement on uptime or Eclipse |
| C | Average: significant rotation issues |
| D | Below average: major uptime or waste problems |
| F | Needs work: fundamental rotation errors |
