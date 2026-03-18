/**
 * build-exe.mjs
 *
 * Builds a standalone Windows .exe from the watcher.
 * Uses esbuild to bundle, then Node.js SEA to create the executable.
 *
 * Since we're on macOS and can't build a Windows .exe natively with SEA,
 * this script creates a self-contained installer package instead:
 * - Bundles watcher.ts into a single CJS file (no dependencies needed)
 * - Creates a .bat launcher that uses the system's Node.js
 * - Packages everything into a zip for distribution
 *
 * For a true .exe without Node.js: build on a Windows machine with:
 *   node --experimental-sea-config sea-config.json
 *   copy node.exe BalanceDossier.exe
 *   postject BalanceDossier.exe NODE_SEA_BLOB sea-prep.blob
 */

import { execSync } from 'child_process';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');

if (!existsSync(DIST)) mkdirSync(DIST, { recursive: true });

console.log('Building Balance Dossier Watcher for Windows...\n');

// Step 1: Bundle with esbuild
console.log('1. Bundling with esbuild...');
execSync('npx esbuild watcher.ts --format=cjs --platform=node --bundle --outfile=dist/watcher.cjs --external:fsevents', {
  cwd: ROOT,
  stdio: 'inherit',
});

// Step 2: Create Windows batch launcher
console.log('2. Creating Windows launcher...');
const batContent = `@echo off
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
`;
writeFileSync(join(DIST, 'BalanceDossier.bat'), batContent);

// Step 3: Create PowerShell installer script
console.log('3. Creating installer script...');
const installerContent = `# Balance Dossier - Installer
# Run this script to install the WoW addon and watcher

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "  Balance Dossier - Installer" -ForegroundColor Cyan
Write-Host "  ===========================" -ForegroundColor Cyan
Write-Host ""

# Find WoW installation
$wowPaths = @(
    "C:\\Program Files (x86)\\World of Warcraft",
    "C:\\Program Files\\World of Warcraft",
    "D:\\World of Warcraft",
    "D:\\Games\\World of Warcraft",
    "E:\\World of Warcraft"
)

$wowDir = $null
foreach ($path in $wowPaths) {
    if (Test-Path $path) {
        $wowDir = $path
        break
    }
}

if (-not $wowDir) {
    Write-Host "  WoW installation not found in standard locations." -ForegroundColor Yellow
    $wowDir = Read-Host "  Enter your WoW installation path (e.g. D:\\Games\\World of Warcraft)"
    if (-not (Test-Path $wowDir)) {
        Write-Host "  Path not found. Exiting." -ForegroundColor Red
        exit 1
    }
}

Write-Host "  Found WoW at: $wowDir" -ForegroundColor Green

# Install addon
$addonSrc = Join-Path $PSScriptRoot "BalanceDossier"
$addonDest = Join-Path $wowDir "_retail_\\Interface\\AddOns\\BalanceDossier"

if (Test-Path $addonSrc) {
    Write-Host "  Installing addon to: $addonDest" -ForegroundColor Cyan
    if (Test-Path $addonDest) {
        Remove-Item $addonDest -Recurse -Force
    }
    Copy-Item $addonSrc $addonDest -Recurse
    Write-Host "  Addon installed!" -ForegroundColor Green
} else {
    Write-Host "  Addon folder not found next to installer. Skipping." -ForegroundColor Yellow
}

# Check Node.js
$nodeVersion = $null
try {
    $nodeVersion = node --version 2>$null
} catch {}

if ($nodeVersion) {
    Write-Host "  Node.js found: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "  Node.js is required for the watcher." -ForegroundColor Yellow
    Write-Host "  Download from: https://nodejs.org" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host ""
Write-Host "  Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "  To start tracking:" -ForegroundColor Cyan
Write-Host "    1. Launch WoW and log into your Balance Druid" -ForegroundColor White
Write-Host "    2. Double-click BalanceDossier.bat to start the watcher" -ForegroundColor White
Write-Host "    3. Play normally. Type /reload in-game to sync data" -ForegroundColor White
Write-Host "    4. Check your Live Session page on the web app" -ForegroundColor White
Write-Host ""
Write-Host "  In-game commands:" -ForegroundColor Cyan
Write-Host "    /bd status  - Show tracking status" -ForegroundColor White
Write-Host "    /bd last    - Show last fight summary" -ForegroundColor White
Write-Host "    /bd export  - Force save for web sync" -ForegroundColor White
Write-Host ""
Read-Host "  Press Enter to close"
`;
writeFileSync(join(DIST, 'Install.ps1'), installerContent);

// Step 4: Create a simple readme
const readmeContent = `Balance Dossier - Combat Tracker for Windows
=============================================

Files:
  BalanceDossier.bat  - Double-click to start the watcher
  watcher.cjs         - The bundled watcher (no dependencies)
  Install.ps1         - Right-click > Run with PowerShell to install addon
  BalanceDossier/     - The WoW addon (copy to your AddOns folder)

Requirements:
  - Node.js (https://nodejs.org) - download and install
  - World of Warcraft with the BalanceDossier addon

Quick Start:
  1. Run Install.ps1 (right-click > Run with PowerShell)
  2. Launch WoW, enable BalanceDossier addon
  3. Double-click BalanceDossier.bat
  4. Play! Type /reload to sync data to the web app.
`;
writeFileSync(join(DIST, 'README.txt'), readmeContent);

console.log('\n4. Build complete!\n');
console.log('Output in dist/:');
console.log('  - BalanceDossier.bat  (double-click to run)');
console.log('  - watcher.cjs         (bundled watcher, no deps)');
console.log('  - Install.ps1         (addon installer)');
console.log('  - README.txt');
console.log('\nTo distribute: zip the dist/ folder + BalanceDossier/ addon folder together.');
console.log('User needs Node.js installed. For a true standalone .exe, build with SEA on Windows.');

