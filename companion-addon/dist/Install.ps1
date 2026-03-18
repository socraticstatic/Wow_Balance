# Balance Dossier - Installer
# Run this script to install the WoW addon and watcher

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "  Balance Dossier - Installer" -ForegroundColor Cyan
Write-Host "  ===========================" -ForegroundColor Cyan
Write-Host ""

# Find WoW installation
$wowPaths = @(
    "C:\Program Files (x86)\World of Warcraft",
    "C:\Program Files\World of Warcraft",
    "D:\World of Warcraft",
    "D:\Games\World of Warcraft",
    "E:\World of Warcraft"
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
    $wowDir = Read-Host "  Enter your WoW installation path (e.g. D:\Games\World of Warcraft)"
    if (-not (Test-Path $wowDir)) {
        Write-Host "  Path not found. Exiting." -ForegroundColor Red
        exit 1
    }
}

Write-Host "  Found WoW at: $wowDir" -ForegroundColor Green

# Install addon
$addonSrc = Join-Path $PSScriptRoot "BalanceDossier"
$addonDest = Join-Path $wowDir "_retail_\Interface\AddOns\BalanceDossier"

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
