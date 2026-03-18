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
    -- Presence data (updated on every save)
    presence = {
        lastPlayed = 0,
        zone = "",
        subZone = "",
        mapName = "",
        level = 0,
        ilvl = 0,
        quests = {},
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
frame:RegisterEvent("ZONE_CHANGED_NEW_AREA")
frame:RegisterEvent("ZONE_CHANGED")
frame:RegisterEvent("ZONE_CHANGED_INDOORS")
frame:RegisterEvent("QUEST_ACCEPTED")
frame:RegisterEvent("QUEST_TURNED_IN")
frame:RegisterEvent("QUEST_REMOVED")
frame:RegisterEvent("QUEST_LOG_UPDATE")
frame:RegisterEvent("PLAYER_LEVEL_UP")
frame:RegisterEvent("PLAYER_EQUIPMENT_CHANGED")
frame:RegisterEvent("PLAYER_LOGOUT")

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
    elseif event == "ZONE_CHANGED_NEW_AREA" or event == "ZONE_CHANGED" or event == "ZONE_CHANGED_INDOORS" then
        BD:UpdatePresence()
    elseif event == "QUEST_ACCEPTED" or event == "QUEST_TURNED_IN" or event == "QUEST_REMOVED" or event == "QUEST_LOG_UPDATE" then
        BD:UpdateQuests()
        BD:UpdatePresence()
    elseif event == "PLAYER_LEVEL_UP" or event == "PLAYER_EQUIPMENT_CHANGED" then
        BD:UpdatePresence()
    elseif event == "PLAYER_LOGOUT" then
        BD:UpdatePresence()
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
    BD:UpdatePresence()
    BD:UpdateQuests()

    -- Start a new session
    BD:StartSession()

    -- Heartbeat: update presence every 30 seconds
    C_Timer.NewTicker(30, function()
        BD:UpdatePresence()
    end)
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
-- Presence & Quest Tracking
----------------------------------------------------------------------

function BD:UpdatePresence()
    local p = BalanceDossierDB.presence
    p.lastPlayed = time()
    p.zone = GetZoneText() or ""
    p.subZone = GetSubZoneText() or ""
    p.level = UnitLevel("player") or 0

    -- Map name from the world map API
    local mapID = C_Map.GetBestMapForUnit("player")
    if mapID then
        local info = C_Map.GetMapInfo(mapID)
        p.mapName = info and info.name or p.zone
        p.mapID = mapID
    else
        p.mapName = p.zone
    end

    -- Average item level
    local _, equipped = GetAverageItemLevel()
    p.ilvl = math.floor(equipped or 0)

    -- Coordinates
    if mapID then
        local pos = C_Map.GetPlayerMapPosition(mapID, "player")
        if pos then
            p.x = math.floor(pos.x * 1000) / 10  -- e.g. 45.3
            p.y = math.floor(pos.y * 1000) / 10
        end
    end
end

function BD:UpdateQuests()
    local quests = {}
    local numEntries = C_QuestLog.GetNumQuestLogEntries()

    for i = 1, numEntries do
        local info = C_QuestLog.GetInfo(i)
        if info and not info.isHeader and not info.isHidden then
            local questID = info.questID
            local objectives = {}

            -- Get objectives for this quest
            local objData = C_QuestLog.GetQuestObjectives(questID)
            if objData then
                for _, obj in ipairs(objData) do
                    table.insert(objectives, {
                        text = obj.text or "",
                        finished = obj.finished or false,
                    })
                end
            end

            local isComplete = C_QuestLog.IsComplete(questID)

            table.insert(quests, {
                id = questID,
                title = info.title or "Unknown",
                level = info.difficultyLevel or 0,
                isComplete = isComplete,
                objectives = objectives,
                isOnMap = info.isOnMap or false,
                frequency = info.frequency or 0, -- 0=normal, 1=daily, 2=weekly
            })
        end
    end

    BalanceDossierDB.presence.quests = quests
    BalanceDossierDB.presence.questCount = #quests
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
