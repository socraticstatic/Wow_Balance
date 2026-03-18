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

   **Windows:**
   ```
   C:\Program Files (x86)\World of Warcraft\_retail_\Interface\AddOns\
   ```

   **macOS:**
   ```
   /Applications/World of Warcraft/_retail_/Interface/AddOns/
   ```

2. Restart WoW or type `/reload` in-game.

3. Verify: type `/bd status` in-game chat.

## In-game usage

- `/bd status` - Show tracking status
- `/bd last` - Show last fight summary
- `/bd export` - Mark session for export
- `/bd reset` - Clear current session

The addon automatically tracks every combat encounter when you're in Balance spec. A small HUD shows real-time Starfall status, AP level, and Eclipse state during combat.

## Connecting to the web app (auto-push to GitHub Pages)

The watcher pushes your combat data directly to GitHub. No Mac needed. No manual syncing.

### One-time setup:

1. Create a GitHub Personal Access Token:
   - Go to https://github.com/settings/tokens
   - Click "Generate new token (classic)"
   - Give it `repo` scope
   - Copy the token (starts with `ghp_`)

2. Create a `.env` file next to `BalanceDossier.bat`:
   ```
   GITHUB_TOKEN=ghp_your_token_here
   ```

### How it works:

1. Double-click `BalanceDossier.bat`
2. Play WoW. `/reload` after fights to trigger a SavedVariables write.
3. Watcher detects the change, parses your combat data.
4. Watcher pushes `live-session.json` to the GitHub repo via API.
5. GitHub Pages automatically rebuilds with your fresh data.
6. Visit https://socraticstatic.github.io/Wow_Balance/ to see your Live Session.

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
