----------------------------------------------------------------------
-- BalanceDossier - Core
-- Companion addon for the Balance Druid Dossier web app.
-- Tracks combat performance and writes to SavedVariables for
-- external parsing by the file watcher.
----------------------------------------------------------------------

BalanceDossier = BalanceDossier or {}
local BD = BalanceDossier

-- Addon version
BD.VERSION = "1.0.0"

-- SavedVariables database (persisted to disk)
BalanceDossierDB = BalanceDossierDB or {
    version = BD.VERSION,
    sessions = {},
    currentSession = nil,
    config = {
        trackCombat = true,
        showMinimap = true,
        announceErrors = false,
    },
}

-- Runtime state (not saved)
BD.inCombat = false
BD.currentEncounter = nil
BD.playerGUID = nil
BD.playerName = nil
BD.playerSpec = nil

----------------------------------------------------------------------
-- Initialization
----------------------------------------------------------------------

local frame = CreateFrame("Frame", "BalanceDossierFrame", UIParent)
frame:RegisterEvent("ADDON_LOADED")
frame:RegisterEvent("PLAYER_LOGIN")
frame:RegisterEvent("PLAYER_SPECIALIZATION_CHANGED")

frame:SetScript("OnEvent", function(self, event, ...)
    if event == "ADDON_LOADED" then
        local addon = ...
        if addon == "BalanceDossier" then
            BD:Initialize()
        end
    elseif event == "PLAYER_LOGIN" then
        BD:OnLogin()
    elseif event == "PLAYER_SPECIALIZATION_CHANGED" then
        BD:UpdateSpec()
    end
end)

function BD:Initialize()
    -- Migrate DB if needed
    if BalanceDossierDB.version ~= BD.VERSION then
        BalanceDossierDB.version = BD.VERSION
    end

    print("|cFF78A0E0[Balance Dossier]|r v" .. BD.VERSION .. " loaded. /bd for options.")
end

function BD:OnLogin()
    BD.playerGUID = UnitGUID("player")
    BD.playerName = UnitName("player")
    BD:UpdateSpec()

    -- Start a new session
    BD:StartSession()
end

function BD:UpdateSpec()
    local specIndex = GetSpecialization()
    if specIndex then
        local _, name = GetSpecializationInfo(specIndex)
        BD.playerSpec = name
    end

    -- Only track if Balance
    if BD.playerSpec == "Balance" then
        BD:EnableTracking()
    else
        BD:DisableTracking()
    end
end

function BD:EnableTracking()
    frame:RegisterEvent("PLAYER_REGEN_DISABLED")  -- Enter combat
    frame:RegisterEvent("PLAYER_REGEN_ENABLED")   -- Leave combat
    frame:RegisterEvent("ENCOUNTER_START")
    frame:RegisterEvent("ENCOUNTER_END")
end

function BD:DisableTracking()
    frame:UnregisterEvent("PLAYER_REGEN_DISABLED")
    frame:UnregisterEvent("PLAYER_REGEN_ENABLED")
    frame:UnregisterEvent("ENCOUNTER_START")
    frame:UnregisterEvent("ENCOUNTER_END")
end

----------------------------------------------------------------------
-- Session Management
----------------------------------------------------------------------

function BD:StartSession()
    local session = {
        startTime = time(),
        playerName = BD.playerName,
        spec = BD.playerSpec,
        fights = {},
        exportTimestamp = nil,
    }

    table.insert(BalanceDossierDB.sessions, session)
    BalanceDossierDB.currentSession = #BalanceDossierDB.sessions

    -- Cap sessions at 50
    while #BalanceDossierDB.sessions > 50 do
        table.remove(BalanceDossierDB.sessions, 1)
        BalanceDossierDB.currentSession = #BalanceDossierDB.sessions
    end
end

function BD:GetCurrentSession()
    if BalanceDossierDB.currentSession then
        return BalanceDossierDB.sessions[BalanceDossierDB.currentSession]
    end
    return nil
end

----------------------------------------------------------------------
-- Slash Commands
----------------------------------------------------------------------

SLASH_BALANCEDOSSIER1 = "/bd"
SLASH_BALANCEDOSSIER2 = "/balancedossier"

SlashCmdList["BALANCEDOSSIER"] = function(msg)
    msg = strtrim(msg):lower()

    if msg == "export" or msg == "save" then
        BD:ExportSession()
    elseif msg == "reset" then
        BD:ResetSession()
    elseif msg == "status" then
        BD:PrintStatus()
    elseif msg == "last" then
        BD:PrintLastFight()
    else
        print("|cFF78A0E0[Balance Dossier]|r Commands:")
        print("  /bd status - Show tracking status")
        print("  /bd last - Show last fight summary")
        print("  /bd export - Force save to SavedVariables")
        print("  /bd reset - Clear current session")
    end
end

function BD:ExportSession()
    local session = BD:GetCurrentSession()
    if session then
        session.exportTimestamp = time()
        print("|cFF78A0E0[Balance Dossier]|r Session exported. " .. #session.fights .. " fights saved.")
        print("|cFF78A0E0[Balance Dossier]|r /reload to write to disk for the web app.")
    end
end

function BD:ResetSession()
    BD:StartSession()
    print("|cFF78A0E0[Balance Dossier]|r Session reset.")
end

function BD:PrintStatus()
    local session = BD:GetCurrentSession()
    local fights = session and #session.fights or 0
    print("|cFF78A0E0[Balance Dossier]|r Status:")
    print("  Spec: " .. (BD.playerSpec or "Unknown"))
    print("  Tracking: " .. (BD.playerSpec == "Balance" and "|cFF00FF00ON|r" or "|cFFFF0000OFF|r (not Balance)"))
    print("  Current session: " .. fights .. " fights")
    print("  In combat: " .. (BD.inCombat and "Yes" or "No"))
end
