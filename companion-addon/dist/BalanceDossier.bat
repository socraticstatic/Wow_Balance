@echo off
title Balance Dossier - Combat Tracker
echo.
echo  ============================================
echo   Balance Dossier - Combat Tracker v1.0.0
echo  ============================================
echo.
echo  Watching for WoW SavedVariables changes...
echo  Keep this window open while playing.
echo.
echo  Press Ctrl+C to stop.
echo.
node "%~dp0watcher.cjs"
if %errorlevel% neq 0 (
  echo.
  echo  ERROR: Node.js is required. Install from https://nodejs.org
  echo.
  pause
)
