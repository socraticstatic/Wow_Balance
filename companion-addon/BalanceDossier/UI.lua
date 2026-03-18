----------------------------------------------------------------------
-- BalanceDossier - Minimal UI
-- Shows a small anchor frame with real-time Starfall uptime
-- and AP status during combat. Non-intrusive.
----------------------------------------------------------------------

local BD = BalanceDossier

-- Create a tiny combat HUD
local hud = CreateFrame("Frame", "BalanceDossierHUD", UIParent)
hud:SetSize(160, 40)
hud:SetPoint("TOP", UIParent, "TOP", 0, -100)
hud:SetMovable(true)
hud:EnableMouse(true)
hud:RegisterForDrag("LeftButton")
hud:SetScript("OnDragStart", hud.StartMoving)
hud:SetScript("OnDragStop", hud.StopMovingOrSizing)
hud:Hide()

-- Background
local bg = hud:CreateTexture(nil, "BACKGROUND")
bg:SetAllPoints()
bg:SetColorTexture(0, 0, 0, 0.6)

-- Starfall indicator
local sfText = hud:CreateFontString(nil, "OVERLAY", "GameFontNormal")
sfText:SetPoint("LEFT", hud, "LEFT", 8, 8)
sfText:SetFont("Fonts\\FRIZQT__.TTF", 11, "OUTLINE")
sfText:SetText("SF: --")

-- AP indicator
local apText = hud:CreateFontString(nil, "OVERLAY", "GameFontNormal")
apText:SetPoint("LEFT", hud, "LEFT", 8, -8)
apText:SetFont("Fonts\\FRIZQT__.TTF", 11, "OUTLINE")
apText:SetText("AP: --")

-- Eclipse indicator
local eclipseText = hud:CreateFontString(nil, "OVERLAY", "GameFontNormal")
eclipseText:SetPoint("RIGHT", hud, "RIGHT", -8, 0)
eclipseText:SetFont("Fonts\\FRIZQT__.TTF", 10, "OUTLINE")
eclipseText:SetText("")

-- Update ticker
local STARFALL_BUFF_ID = 191034
local ECLIPSE_LUNAR_ID = 48518
local ECLIPSE_SOLAR_ID = 48517
local AP_POWER_TYPE = 8

local ticker = CreateFrame("Frame")
local elapsed = 0

ticker:SetScript("OnUpdate", function(self, dt)
    if not BD.inCombat then
        hud:Hide()
        return
    end

    elapsed = elapsed + dt
    if elapsed < 0.1 then return end
    elapsed = 0

    hud:Show()

    -- Starfall active?
    local sfActive = false
    for i = 1, 40 do
        local name, _, _, _, _, _, _, _, _, spellId = UnitBuff("player", i)
        if not name then break end
        if spellId == STARFALL_BUFF_ID then
            sfActive = true
            break
        end
    end

    if sfActive then
        sfText:SetText("|cFF6C7BFF\226\151\143 STARFALL|r")
    else
        sfText:SetText("|cFF555555\226\151\139 starfall|r")
    end

    -- AP bar
    local ap = UnitPower("player", AP_POWER_TYPE)
    local maxAp = UnitPowerMax("player", AP_POWER_TYPE)
    local apPct = maxAp > 0 and (ap / maxAp) * 100 or 0

    local apColor
    if ap >= 90 then
        apColor = "|cFFFF4444"  -- Red: you're capping!
    elseif ap >= 80 then
        apColor = "|cFFFFAA00"  -- Orange: dump soon
    else
        apColor = "|cFF78A0E0"  -- Blue: normal
    end

    apText:SetText(apColor .. "AP: " .. ap .. "|r")

    -- Eclipse state
    local inLunar = false
    local inSolar = false
    for i = 1, 40 do
        local name, _, _, _, _, _, _, _, _, spellId = UnitBuff("player", i)
        if not name then break end
        if spellId == ECLIPSE_LUNAR_ID then inLunar = true end
        if spellId == ECLIPSE_SOLAR_ID then inSolar = true end
    end

    if inLunar then
        eclipseText:SetText("|cFF6C7BFF\226\152\189 Lunar|r")
    elseif inSolar then
        eclipseText:SetText("|cFFFFAA00\226\152\128 Solar|r")
    else
        eclipseText:SetText("|cFF555555No Eclipse|r")
    end
end)
