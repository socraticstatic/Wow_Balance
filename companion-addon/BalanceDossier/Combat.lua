----------------------------------------------------------------------
-- BalanceDossier - Combat Tracker
-- Monitors COMBAT_LOG_EVENT_UNFILTERED for Balance Druid metrics.
-- Tracks: Starfall uptime, AP waste, Eclipse distribution,
-- rotation errors, damage per target count, DoT uptime.
----------------------------------------------------------------------

local BD = BalanceDossier

-- Spell IDs (Midnight 12.0.1)
local SPELLS = {
    STARFALL        = 191034,
    STARSURGE       = 78674,
    MOONFIRE        = 8921,
    SUNFIRE         = 93402,
    WRATH           = 190984,
    STARFIRE        = 194153,
    ECLIPSE_SOLAR   = 48517,  -- Solar Eclipse buff
    ECLIPSE_LUNAR   = 48518,  -- Lunar Eclipse buff
    CELESTIAL_ALIGN = 194223,
    INCARNATION     = 102560,
    FURY_OF_ELUNE   = 202770,
    FORCE_OF_NATURE = 205636,
    CONVOKE         = 391528,
    FULL_MOON       = 274283,
    HALF_MOON       = 274282,
    NEW_MOON        = 274281,
    SHOOTING_STARS  = 202497,
    ASTRAL_POWER    = 8, -- Power type index
}

-- Current fight state
local fight = nil
local combatFrame = CreateFrame("Frame", "BalanceDossierCombatFrame", UIParent)

----------------------------------------------------------------------
-- Combat Start/End
----------------------------------------------------------------------

combatFrame:RegisterEvent("PLAYER_REGEN_DISABLED")
combatFrame:RegisterEvent("PLAYER_REGEN_ENABLED")
combatFrame:RegisterEvent("COMBAT_LOG_EVENT_UNFILTERED")

combatFrame:SetScript("OnEvent", function(self, event, ...)
    if not BD.playerSpec or BD.playerSpec ~= "Balance" then return end

    if event == "PLAYER_REGEN_DISABLED" then
        BD:OnCombatStart()
    elseif event == "PLAYER_REGEN_ENABLED" then
        BD:OnCombatEnd()
    elseif event == "COMBAT_LOG_EVENT_UNFILTERED" then
        BD:OnCombatLogEvent(CombatLogGetCurrentEventInfo())
    end
end)

function BD:OnCombatStart()
    BD.inCombat = true

    fight = {
        startTime = GetTime(),
        endTime = nil,
        duration = 0,

        -- Damage tracking
        totalDamage = 0,
        starfallDamage = 0,
        starsurgeDamage = 0,
        dotDamage = 0,    -- Moonfire + Sunfire
        builderDamage = 0, -- Wrath + Starfire

        -- Cast tracking
        casts = {},
        castCount = {
            starfall = 0,
            starsurge = 0,
            moonfire = 0,
            sunfire = 0,
            wrath = 0,
            starfire = 0,
            furyOfElune = 0,
            forceOfNature = 0,
            convoke = 0,
            fullMoon = 0,
        },

        -- Starfall uptime
        starfallActive = false,
        starfallStart = 0,
        starfallUptime = 0,

        -- Eclipse tracking
        lunarTime = 0,
        solarTime = 0,
        lunarStart = 0,
        solarStart = 0,
        currentEclipse = nil, -- "lunar" or "solar" or nil

        -- AP tracking
        apSamples = {},
        apCapped = 0, -- times we hit 100 AP while casting builders
        apWastedEstimate = 0,

        -- Target tracking
        targetsHit = {},  -- GUID set
        maxSimultaneousTargets = 0,

        -- DoT tracking
        moonfireTargets = {},
        sunfireTargets = {},
        peakDotCount = 0,

        -- Rotation errors
        errors = {},
    }
end

function BD:OnCombatEnd()
    if not fight then return end
    BD.inCombat = false

    fight.endTime = GetTime()
    fight.duration = fight.endTime - fight.startTime

    -- Close any open Eclipse window
    if fight.currentEclipse == "lunar" and fight.lunarStart > 0 then
        fight.lunarTime = fight.lunarTime + (fight.endTime - fight.lunarStart)
    elseif fight.currentEclipse == "solar" and fight.solarStart > 0 then
        fight.solarTime = fight.solarTime + (fight.endTime - fight.solarStart)
    end

    -- Close Starfall window if active
    if fight.starfallActive then
        fight.starfallUptime = fight.starfallUptime + (fight.endTime - fight.starfallStart)
    end

    -- Calculate summary
    local summary = BD:BuildFightSummary(fight)

    -- Store in session
    local session = BD:GetCurrentSession()
    if session then
        table.insert(session.fights, summary)
    end

    -- Print quick summary
    BD:PrintFightSummary(summary)

    fight = nil
end

----------------------------------------------------------------------
-- Combat Log Processing
----------------------------------------------------------------------

function BD:OnCombatLogEvent(...)
    if not fight then return end

    local timestamp, subevent, _, sourceGUID, sourceName, _, _, destGUID, destName, _, _, spellId, spellName = ...

    -- Only track our own events
    if sourceGUID ~= BD.playerGUID then return end

    -- Cast tracking
    if subevent == "SPELL_CAST_SUCCESS" then
        BD:OnCastSuccess(spellId, spellName, destGUID, timestamp)
    end

    -- Damage tracking
    if subevent == "SPELL_DAMAGE" or subevent == "SPELL_PERIODIC_DAMAGE" then
        local amount = select(15, ...)
        BD:OnDamage(spellId, spellName, destGUID, amount, subevent == "SPELL_PERIODIC_DAMAGE")
    end

    -- Buff tracking (Eclipse, Starfall)
    if subevent == "SPELL_AURA_APPLIED" then
        BD:OnBuffApplied(spellId, destGUID)
    elseif subevent == "SPELL_AURA_REMOVED" then
        BD:OnBuffRemoved(spellId, destGUID)
    end
end

function BD:OnCastSuccess(spellId, spellName, destGUID, timestamp)
    -- Record cast
    table.insert(fight.casts, {
        time = GetTime() - fight.startTime,
        spell = spellName,
        spellId = spellId,
    })

    -- Count casts
    if spellId == SPELLS.STARFALL then
        fight.castCount.starfall = fight.castCount.starfall + 1
    elseif spellId == SPELLS.STARSURGE then
        fight.castCount.starsurge = fight.castCount.starsurge + 1
    elseif spellId == SPELLS.MOONFIRE then
        fight.castCount.moonfire = fight.castCount.moonfire + 1
        if destGUID then fight.moonfireTargets[destGUID] = GetTime() end
    elseif spellId == SPELLS.SUNFIRE then
        fight.castCount.sunfire = fight.castCount.sunfire + 1
        if destGUID then fight.sunfireTargets[destGUID] = GetTime() end
    elseif spellId == SPELLS.WRATH then
        fight.castCount.wrath = fight.castCount.wrath + 1
        BD:CheckApCap("wrath")
    elseif spellId == SPELLS.STARFIRE then
        fight.castCount.starfire = fight.castCount.starfire + 1
        BD:CheckApCap("starfire")
    elseif spellId == SPELLS.FURY_OF_ELUNE then
        fight.castCount.furyOfElune = fight.castCount.furyOfElune + 1
    elseif spellId == SPELLS.FORCE_OF_NATURE then
        fight.castCount.forceOfNature = fight.castCount.forceOfNature + 1
    elseif spellId == SPELLS.CONVOKE then
        fight.castCount.convoke = fight.castCount.convoke + 1
    elseif spellId == SPELLS.FULL_MOON then
        fight.castCount.fullMoon = fight.castCount.fullMoon + 1
    end

    -- Sample AP after each cast
    local ap = UnitPower("player", SPELLS.ASTRAL_POWER)
    table.insert(fight.apSamples, { time = GetTime() - fight.startTime, ap = ap })
end

function BD:OnDamage(spellId, spellName, destGUID, amount, isPeriodic)
    if not amount then return end

    fight.totalDamage = fight.totalDamage + amount

    -- Track by category
    if spellId == SPELLS.STARFALL then
        fight.starfallDamage = fight.starfallDamage + amount
    elseif spellId == SPELLS.STARSURGE then
        fight.starsurgeDamage = fight.starsurgeDamage + amount
    elseif spellId == SPELLS.MOONFIRE or spellId == SPELLS.SUNFIRE then
        fight.dotDamage = fight.dotDamage + amount
    elseif spellId == SPELLS.WRATH or spellId == SPELLS.STARFIRE then
        fight.builderDamage = fight.builderDamage + amount
    end

    -- Track unique targets
    if destGUID then
        fight.targetsHit[destGUID] = true
    end
end

function BD:OnBuffApplied(spellId, destGUID)
    if destGUID ~= BD.playerGUID then return end

    if spellId == SPELLS.ECLIPSE_LUNAR then
        fight.currentEclipse = "lunar"
        fight.lunarStart = GetTime()
    elseif spellId == SPELLS.ECLIPSE_SOLAR then
        fight.currentEclipse = "solar"
        fight.solarStart = GetTime()
    elseif spellId == SPELLS.STARFALL then
        fight.starfallActive = true
        fight.starfallStart = GetTime()
    end
end

function BD:OnBuffRemoved(spellId, destGUID)
    if destGUID ~= BD.playerGUID then return end

    if spellId == SPELLS.ECLIPSE_LUNAR and fight.currentEclipse == "lunar" then
        fight.lunarTime = fight.lunarTime + (GetTime() - fight.lunarStart)
        fight.currentEclipse = nil
    elseif spellId == SPELLS.ECLIPSE_SOLAR and fight.currentEclipse == "solar" then
        fight.solarTime = fight.solarTime + (GetTime() - fight.solarStart)
        fight.currentEclipse = nil
    elseif spellId == SPELLS.STARFALL then
        if fight.starfallActive then
            fight.starfallUptime = fight.starfallUptime + (GetTime() - fight.starfallStart)
        end
        fight.starfallActive = false
    end
end

----------------------------------------------------------------------
-- AP Waste Detection
----------------------------------------------------------------------

function BD:CheckApCap(spell)
    local ap = UnitPower("player", SPELLS.ASTRAL_POWER)
    local maxAp = UnitPowerMax("player", SPELLS.ASTRAL_POWER)

    -- If casting a builder at 90+ AP, that's potential waste
    if ap >= (maxAp - 10) then
        fight.apCapped = fight.apCapped + 1
        fight.apWastedEstimate = fight.apWastedEstimate + 8 -- rough estimate per capped builder

        table.insert(fight.errors, {
            time = GetTime() - fight.startTime,
            type = "ap_cap",
            message = spell .. " at " .. ap .. " AP (capped)",
        })
    end
end

----------------------------------------------------------------------
-- Fight Summary Builder
----------------------------------------------------------------------

function BD:BuildFightSummary(f)
    local duration = math.max(f.duration, 1)
    local uniqueTargets = 0
    for _ in pairs(f.targetsHit) do uniqueTargets = uniqueTargets + 1 end

    -- Starfall uptime percentage
    local starfallUptimePct = (f.starfallUptime / duration) * 100

    -- Eclipse distribution
    local eclipseTotal = f.lunarTime + f.solarTime
    local lunarPct = eclipseTotal > 0 and (f.lunarTime / eclipseTotal) * 100 or 0

    -- DPS
    local dps = f.totalDamage / duration

    -- Damage breakdown percentages
    local starfallPct = f.totalDamage > 0 and (f.starfallDamage / f.totalDamage) * 100 or 0
    local starsurgePct = f.totalDamage > 0 and (f.starsurgeDamage / f.totalDamage) * 100 or 0
    local dotPct = f.totalDamage > 0 and (f.dotDamage / f.totalDamage) * 100 or 0

    -- Grade the fight
    local grade = BD:GradeFight(starfallUptimePct, lunarPct, f.apCapped, uniqueTargets, duration)

    return {
        timestamp = time(),
        duration = math.floor(duration),
        dps = math.floor(dps),
        totalDamage = math.floor(f.totalDamage),
        uniqueTargets = uniqueTargets,

        -- Starfall
        starfallUptime = math.floor(starfallUptimePct),
        starfallCasts = f.castCount.starfall,
        starfallDamage = math.floor(f.starfallDamage),
        starfallDamagePct = math.floor(starfallPct),

        -- Eclipse
        lunarPct = math.floor(lunarPct),
        solarPct = math.floor(100 - lunarPct),
        lunarTime = math.floor(f.lunarTime),
        solarTime = math.floor(f.solarTime),

        -- AP
        apCapped = f.apCapped,
        apWasted = math.floor(f.apWastedEstimate),

        -- Casts
        casts = f.castCount,

        -- Rotation errors
        errors = f.errors,
        errorCount = #f.errors,

        -- Grade
        grade = grade,
    }
end

function BD:GradeFight(starfallUptime, lunarPct, apCapped, targets, duration)
    -- Only grade fights longer than 15 seconds
    if duration < 15 then return "N/A" end

    local score = 100

    -- Starfall uptime (target: 85%+ in AoE)
    if targets >= 3 then
        if starfallUptime < 50 then score = score - 30
        elseif starfallUptime < 70 then score = score - 15
        elseif starfallUptime < 85 then score = score - 5 end
    end

    -- Lunar Eclipse preference in AoE (target: 60%+)
    if targets >= 3 then
        if lunarPct < 40 then score = score - 20
        elseif lunarPct < 55 then score = score - 10 end
    end

    -- AP waste (target: 0)
    if apCapped > 5 then score = score - 20
    elseif apCapped > 2 then score = score - 10
    elseif apCapped > 0 then score = score - 5 end

    -- Letter grade
    if score >= 95 then return "S"
    elseif score >= 85 then return "A"
    elseif score >= 70 then return "B"
    elseif score >= 55 then return "C"
    elseif score >= 40 then return "D"
    else return "F" end
end

----------------------------------------------------------------------
-- Print Helpers
----------------------------------------------------------------------

function BD:PrintFightSummary(s)
    local gradeColor = {
        S = "|cFFFF8000", A = "|cFFA335EE", B = "|cFF0070DD",
        C = "|cFF1EFF00", D = "|cFFFFFFFF", F = "|cFFFF0000",
    }
    local gc = gradeColor[s.grade] or "|cFFFFFFFF"

    print("|cFF78A0E0[Balance Dossier]|r Fight complete:")
    print("  " .. gc .. "Grade: " .. s.grade .. "|r  |  DPS: " .. string.format("%.1fk", s.dps / 1000) .. "  |  Duration: " .. s.duration .. "s")
    print("  Starfall: " .. s.starfallUptime .. "% uptime (" .. s.starfallCasts .. " casts, " .. s.starfallDamagePct .. "% of damage)")
    print("  Eclipse: " .. s.lunarPct .. "% Lunar / " .. s.solarPct .. "% Solar")
    if s.apCapped > 0 then
        print("  |cFFFF4444AP Waste: " .. s.apCapped .. " capped builders (~" .. s.apWasted .. " AP wasted)|r")
    end
    if s.errorCount > 0 then
        print("  Rotation errors: " .. s.errorCount)
    end
end

function BD:PrintLastFight()
    local session = BD:GetCurrentSession()
    if not session or #session.fights == 0 then
        print("|cFF78A0E0[Balance Dossier]|r No fights recorded this session.")
        return
    end

    local s = session.fights[#session.fights]
    BD:PrintFightSummary(s)
end
