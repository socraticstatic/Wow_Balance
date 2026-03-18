import SectionHeading from '../components/SectionHeading';
import { useReveal } from '../hooks/useReveal';
import { bisGear, builds, enchantsGems } from '../data';
import characterData from '@data/my-character-clean.json';

/*
 * Midnight Season 1 Gear Track System:
 *   Adventurer: 220-237   (World quests, rare drops)
 *   Veteran:    233-250   (Heroic dungeons, LFR)
 *   Champion:   246-263   (M0, Normal raid, Renown vendors, Bountiful Delves)
 *   Hero:       259-276   (M+7-10, Heroic raid, Hero crafted)
 *   Myth:       272-289   (M+10 vault, Mythic raid, Myth crafted)
 *
 * ilvl thresholds for content:
 *   Normal dungeons: no req (queue at 90)
 *   Heroic dungeons: 220
 *   LFR:             220
 *   M0:              235
 *   Normal raid:     235
 *   Heroic raid:     255
 */

type Rec = {
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  title: string;
  detail: string;
  actionable: string;
};

function analyzeProgression() {
  const c = characterData;
  const gear = c.gear as Array<{
    slot: string; name: string; ilvl: number; quality: number;
    tier: string | null; enchant: string | null; gems: string[];
  }>;

  const avgIlvl = c.ilvl;
  const charLevel = (c as any).level || null;
  const tierPieces = gear.filter(g => g.tier);
  const missingEnchants = gear.filter(g =>
    ['back', 'chest', 'wrist', 'legs', 'feet', 'finger1', 'finger2'].includes(g.slot) && !g.enchant
  );
  const missingGems = gear.filter(g =>
    ['head', 'neck', 'finger1', 'finger2', 'back'].includes(g.slot) && g.gems.length === 0
  );
  const sortedGear = [...gear].sort((a, b) => a.ilvl - b.ilvl);
  const weakest = sortedGear.slice(0, 3);

  const recs: Rec[] = [];

  // Determine progression phase based on actual level + ilvl
  const maxLevel = 90;
  const isLeveling = charLevel !== null ? charLevel < maxLevel : avgIlvl < 190;
  const levelsToGo = charLevel !== null ? maxLevel - charLevel : null;
  const isFreshMax = !isLeveling && avgIlvl < 220;
  const isEarlyGearing = !isLeveling && avgIlvl >= 220 && avgIlvl < 235;
  const isMidGearing = !isLeveling && avgIlvl >= 235 && avgIlvl < 255;
  const isLateGearing = !isLeveling && avgIlvl >= 255;

  // ── PHASE: Still Leveling ──
  if (isLeveling) {
    const levelDisplay = charLevel ? `Level ${charLevel}` : `ilvl ${avgIlvl}`;
    const levelsLeft = levelsToGo ? `${levelsToGo} levels to go` : 'Keep pushing';

    // Zone recommendations based on level ranges in Midnight
    let zoneAdvice = '';
    if (charLevel && charLevel < 82) {
      zoneAdvice = 'You should be questing in Hallowfall or Isle of Dorn. Follow the campaign breadcrumbs.';
    } else if (charLevel && charLevel < 85) {
      zoneAdvice = 'Azj-Kahet or the Ringing Deeps are your level range. Campaign quests give the best XP here.';
    } else if (charLevel && charLevel < 88) {
      zoneAdvice = 'Push through Quel\'Danas and Silvermoon zones. The Midnight campaign accelerates XP in the 85-88 range. Mix in dungeons for variety and bonus XP.';
    } else if (charLevel && charLevel < 90) {
      zoneAdvice = 'You\'re close. Finish the Midnight campaign. If quests dry up, queue Normal dungeons for fast XP. Bonus objectives and side quests fill gaps.';
    }

    recs.push({
      priority: 'critical',
      category: 'Leveling',
      title: `${levelDisplay} - ${levelsLeft}`,
      detail: `Max level is ${maxLevel}. All endgame systems (world quests, M+, raids, delves, Great Vault) unlock at ${maxLevel}. ${zoneAdvice}`,
      actionable: 'Priority: Main campaign questline > Side quests in current zone > Normal dungeon queue > Bonus objectives. Campaign gives the most XP per hour and unlocks endgame systems.',
    });

    recs.push({
      priority: 'high',
      category: 'Leveling',
      title: 'Equip Gear As You Go',
      detail: `Your weakest slots: ${weakest.map(w => `${w.slot} (${w.ilvl})`).join(', ')}. Quest rewards will replace these quickly.`,
      actionable: 'Always equip higher ilvl quest rewards even if the stats aren\'t perfect. Raw intellect from higher ilvl always beats secondary stat optimization while leveling.',
    });

    recs.push({
      priority: 'high',
      category: 'Dungeons',
      title: 'Queue Normal Dungeons Between Quests',
      detail: `At level ${charLevel || '??'}, Normal dungeons give strong XP and gear drops. Queue as DPS while questing for minimal downtime.`,
      actionable: 'Open Dungeon Finder (default key: I), select Specific Dungeons, check all available, and queue. Continue questing while waiting. Balance Druid has 10-15 min DPS queues.',
    });

    recs.push({
      priority: 'medium',
      category: 'Talents',
      title: 'Use an AoE Leveling Build',
      detail: 'While leveling, prioritize AoE and self-sustain over single-target DPS.',
      actionable: 'Take Starfall, Wild Mushroom, and Stellar Drift for huge AoE pulls. Take Restoration Affinity for passive healing. Pull 3-5 mobs, dot with Moonfire/Sunfire, then Starfall. Move to next pack.',
    });

    if (charLevel && charLevel >= 87) {
      recs.push({
        priority: 'low',
        category: 'Preparation',
        title: 'Prepare for Level 90',
        detail: 'You\'re close to max level. A few things to set up now will save time at 90.',
        actionable: 'Save gold for crafted gear (base epics at ilvl 252-259 cost no Spark). Install WeakAuras and import a Balance Druid aura set. Start learning the Eclipse rotation. Join a guild if you want raid access.',
      });
    }

    return { recs, avgIlvl, charLevel, tierPieces, missingEnchants, missingGems, weakest, phase: 'leveling' as const };
  }

  // ── PHASE: Fresh 90 (ilvl 190-220) ──
  if (isFreshMax) {
    recs.push({
      priority: 'critical',
      category: 'Campaign',
      title: 'Finish the Midnight Campaign',
      detail: 'The campaign unlocks world quests, endgame delves, faction vendors, and the weekly event. Nothing else matters until this is done.',
      actionable: 'Follow the main questline to completion. It will take 3-5 hours. You\'ll get gear upgrades along the way. World quests won\'t appear until the campaign is finished.',
    });

    recs.push({
      priority: 'high',
      category: 'Gearing',
      title: 'Vacuum World Quests to ilvl 220',
      detail: `World quests drop Adventurer track gear (ilvl 220-237). You need to reach 220 to unlock Heroic dungeons and LFR.`,
      actionable: 'Do every world quest that rewards gear, especially weapon quests. Check all three Midnight zones. Prioritize your lowest ilvl slots. This should take 1-2 sessions.',
    });

    recs.push({
      priority: 'medium',
      category: 'Gearing',
      title: 'Run Normal Dungeons',
      detail: 'Normal dungeons have no ilvl requirement and drop ilvl 214 gear. Fast queues as DPS during off-hours.',
      actionable: 'Queue for Normal dungeons while doing world quests. The gear is lower than WQ rewards but the dungeons teach you the mechanics you\'ll need for Heroic and M+.',
    });

    return { recs, avgIlvl, tierPieces, missingEnchants, missingGems, weakest, phase: 'fresh90' as const };
  }

  // ── PHASE: Early Gearing (ilvl 220-235) ──
  if (isEarlyGearing) {
    recs.push({
      priority: 'critical',
      category: 'Dungeons',
      title: 'Grind Heroic Dungeons',
      detail: `At ilvl ${avgIlvl}, Heroic dungeons are your bread and butter. They drop Veteran track gear (ilvl 226-250).`,
      actionable: 'Queue for every Heroic dungeon. Each run takes 15-25 minutes. Target your weakest slots. Once you hit 235, you unlock M0 and Normal raid.',
    });

    recs.push({
      priority: 'high',
      category: 'Renown',
      title: 'Push Faction Renown',
      detail: 'Faction vendors sell Champion track gear (ilvl 246) at Renown milestones. This is HIGHER than M0 drops.',
      actionable: 'Grind Renown through world quests, weekly quests, and reputation events. Check each faction for which slots they sell. Buy the highest ilvl pieces first.',
    });

    recs.push({
      priority: 'high',
      category: 'LFR',
      title: 'Queue for LFR',
      detail: 'Looking For Raid opens at ilvl 220. It drops Veteran track gear and gives you a chance at tier pieces.',
      actionable: 'Queue for both LFR wings each week. Even if gear drops are side-grades, you\'ll learn raid mechanics for when you do Normal. Tier tokens can drop here.',
    });

    recs.push({
      priority: 'medium',
      category: 'Crafting',
      title: 'Craft 1-2 Pieces',
      detail: 'Base epic crafted gear starts at ilvl 252-259 with no Spark needed. Massive jump from your current gear.',
      actionable: 'Craft into non-tier slots (Wrist, Belt, Boots, or Weapon). Do NOT craft Head, Shoulders, Chest, Hands, or Legs - those slots need to be tier pieces later. Save Sparks for Hero-quality crafts.',
    });

    return { recs, avgIlvl, tierPieces, missingEnchants, missingGems, weakest, phase: 'earlyGearing' as const };
  }

  // ── PHASE: Mid Gearing (ilvl 235-255) ──
  if (isMidGearing) {
    recs.push({
      priority: 'critical',
      category: 'M+',
      title: 'Start Mythic+ Keys',
      detail: `At ilvl ${avgIlvl}, you can push M+ keys. M+2 drops Champion gear (239), M+7 drops Hero gear (255). Complete 8 per week for 3 Great Vault options.`,
      actionable: 'Start at +2 and push as high as you can time. Focus on timing keys, not just completing them. Great Vault at +10 gives Myth track gear (272).',
    });

    recs.push({
      priority: 'high',
      category: 'Raid',
      title: 'Start Normal Raid',
      detail: `Normal raid opens at 235. Drops Champion gear (246-263) and tier pieces. ${bisGear.tierSet.name} 4pc is critical.`,
      actionable: `Join a Normal pug via Group Finder. Focus tier bosses first. ${4 - tierPieces.length} more pieces for 4pc bonus. Catalyst converts non-tier raid drops to tier.`,
    });

    recs.push({
      priority: 'high',
      category: 'Delves',
      title: 'Bountiful Delves Tier 8',
      detail: 'Bountiful Delves at Tier 8 drop Champion/Hero gear and give Great Vault slots. Complete 4 per week minimum.',
      actionable: 'Do 4 Bountiful Delves + 4 Prey Hunts per week to fill all 3 Great Vault world activity slots.',
    });
  }

  // ── PHASE: Late Gearing (ilvl 255+) ──
  if (isLateGearing) {
    recs.push({
      priority: 'critical',
      category: 'Raid',
      title: 'Push Heroic Raid',
      detail: `At ilvl ${avgIlvl}, Heroic raid is your primary upgrade path. Hero track gear (259-276). Push for tier 4pc if you don't have it.`,
      actionable: 'Join Heroic pugs or a guild raid team. Heroic drops are Hero track - significant upgrade over Normal.',
    });

    recs.push({
      priority: 'high',
      category: 'M+',
      title: 'Push M+10 for Myth Vault',
      detail: 'Great Vault at M+10 and above rewards Myth track gear (272+). This is your highest weekly guaranteed upgrade.',
      actionable: 'Time 8 keys at +10 or higher for 3 Myth-track vault options. This is the fastest path to 272+ gear.',
    });
  }

  // ── Universal recs for max-level phases ──
  if (!isLeveling) {
    if (missingEnchants.length > 0) {
      recs.push({
        priority: avgIlvl >= 235 ? 'high' : 'medium',
        category: 'Enchants',
        title: `${missingEnchants.length} Missing Enchants`,
        detail: `Unenchanted: ${missingEnchants.map(m => m.slot).join(', ')}. Free stats you're leaving on the table.`,
        actionable: `Priority: ${Object.entries(enchantsGems.enchants).slice(0, 3).map(([slot, e]) => `${slot}: ${e.name}`).join(', ')}`,
      });
    }

    if (missingGems.length > 0) {
      recs.push({
        priority: 'medium',
        category: 'Gems',
        title: `${missingGems.length} Empty Gem Sockets`,
        detail: `Slots: ${missingGems.map(m => m.slot).join(', ')}. Each gem is ~50-80 secondary stat points.`,
        actionable: `Primary: ${enchantsGems.gems.primary.name}. Secondary: ${enchantsGems.gems.secondary.recommendation}.`,
      });
    }

    if (weakest.length > 0 && weakest[0].ilvl < avgIlvl - 15) {
      recs.push({
        priority: 'medium',
        category: 'Upgrades',
        title: 'Priority Upgrade Slots',
        detail: `Weakest: ${weakest.map(w => `${w.slot} (${w.ilvl})`).join(', ')}. These drag your average down significantly.`,
        actionable: 'Target these slots in dungeons, raid, or world quests. Even a small upgrade here raises your average more than upgrading your best slots.',
      });
    }
  }

  const phase = isLateGearing ? 'lateGearing' : isMidGearing ? 'midGearing' : isEarlyGearing ? 'earlyGearing' : 'fresh90';
  return { recs, avgIlvl, charLevel, tierPieces, missingEnchants, missingGems, weakest, phase: phase as string };
}

const priorityConfig = {
  critical: { color: 'oklch(72% 0.18 30)', bg: 'oklch(72% 0.18 30 / 0.06)', label: 'CRITICAL', border: 'oklch(72% 0.18 30 / 0.15)' },
  high:     { color: 'oklch(80% 0.18 80)', bg: 'oklch(80% 0.18 80 / 0.05)', label: 'HIGH', border: 'oklch(80% 0.18 80 / 0.12)' },
  medium:   { color: 'oklch(68% 0.16 285)', bg: 'oklch(68% 0.16 285 / 0.05)', label: 'MEDIUM', border: 'oklch(68% 0.16 285 / 0.1)' },
  low:      { color: 'oklch(58% 0.14 155)', bg: 'oklch(58% 0.14 155 / 0.04)', label: 'LOW', border: 'oklch(58% 0.14 155 / 0.08)' },
};

const phaseLabels: Record<string, { name: string; color: string; sub: string }> = {
  leveling:     { name: 'Leveling',         color: 'oklch(72% 0.18 30)',  sub: 'Reach level 90 to unlock endgame' },
  fresh90:      { name: 'Fresh 90',         color: 'oklch(80% 0.18 80)',  sub: 'Campaign, world quests, normal dungeons' },
  earlyGearing: { name: 'Early Gearing',    color: 'oklch(68% 0.16 285)', sub: 'Heroic dungeons, LFR, renown vendors' },
  midGearing:   { name: 'Mid Gearing',      color: 'oklch(58% 0.14 155)', sub: 'M+, Normal raid, delves, crafting' },
  lateGearing:  { name: 'Endgame',          color: 'oklch(80% 0.18 80)',  sub: 'Heroic raid, M+10, myth track' },
};

export default function Progression() {
  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();
  const { recs, avgIlvl, charLevel, phase, missingEnchants } = analyzeProgression();

  const phaseInfo = phaseLabels[phase] || phaseLabels.leveling;
  const criticalCount = recs.filter(r => r.priority === 'critical').length;
  const highCount = recs.filter(r => r.priority === 'high').length;
  const lastSync = new Date(characterData.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <section className="px-6 sm:px-10 py-28 max-w-6xl mx-auto">
      <div ref={r1} className="reveal">
        <SectionHeading
          title="Progression Advisor"
          sub={`AI-driven recommendations for Spiracle. Last synced ${lastSync}.`}
          accent="solar"
        />
      </div>

      {/* Current phase banner */}
      <div ref={r2} className="reveal mb-10">
        <div
          className="glass p-5 rounded-lg"
          style={{ borderLeft: `3px solid ${phaseInfo.color}` }}
        >
          <div className="flex items-center gap-3 mb-1">
            <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded"
              style={{ color: phaseInfo.color, background: `${phaseInfo.color}15`, letterSpacing: '0.1em' }}>
              Current Phase
            </span>
          </div>
          <h3 className="text-lg font-bold" style={{ color: phaseInfo.color }}>
            {phaseInfo.name}
          </h3>
          <p className="text-sm" style={{ color: 'oklch(58% 0.012 50)' }}>{phaseInfo.sub}</p>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-16">
        <OverviewCard
          label="Level"
          value={charLevel ? String(charLevel) : '??'}
          sub={charLevel ? (charLevel < 90 ? `${90 - charLevel} to max` : 'Max level') : 'Unknown'}
          color={charLevel && charLevel >= 90 ? 'oklch(58% 0.14 155)' : 'oklch(80% 0.18 80)'}
        />
        <OverviewCard label="Item Level" value={String(avgIlvl)} sub="Equipped avg" color="oklch(90% 0.01 270)" />
        <OverviewCard
          label="Next Unlock"
          value={phase === 'leveling' ? 'Level 90' : avgIlvl < 220 ? 'Heroics' : avgIlvl < 235 ? 'M0 / Raid' : avgIlvl < 255 ? 'Heroic Raid' : 'Myth Track'}
          sub={phase === 'leveling' ? (charLevel ? `${90 - charLevel} levels` : 'Keep questing') : avgIlvl < 220 ? `${220 - avgIlvl} ilvl to go` : avgIlvl < 235 ? `${235 - avgIlvl} ilvl to go` : avgIlvl < 255 ? `${255 - avgIlvl} ilvl to go` : 'Push +10 keys'}
          color="oklch(80% 0.18 80)"
        />
        <OverviewCard
          label="Issues"
          value={String(criticalCount + highCount)}
          sub={`${criticalCount} critical`}
          color={criticalCount > 0 ? 'oklch(72% 0.18 30)' : 'oklch(58% 0.14 155)'}
        />
      </div>

      {/* Recommendations */}
      <div ref={r3} className="reveal">
        <div className="text-[9px] uppercase font-bold mb-5" style={{ color: 'oklch(78% 0.16 60)', letterSpacing: '0.12em' }}>
          Recommendations
        </div>

        <div className="space-y-3">
          {recs.map((rec, i) => {
            const p = priorityConfig[rec.priority];
            return (
              <div
                key={i}
                className="rounded-lg p-5"
                style={{
                  background: p.bg,
                  border: `1px solid ${p.border}`,
                  borderLeft: `3px solid ${p.color}`,
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded" style={{
                    color: p.color,
                    background: `${p.color}15`,
                    letterSpacing: '0.1em',
                  }}>
                    {p.label}
                  </span>
                  <span className="text-[10px] font-semibold" style={{ color: 'oklch(48% 0.01 50)' }}>
                    {rec.category}
                  </span>
                </div>

                <h3 className="text-sm font-bold mb-1.5" style={{ color: 'oklch(88% 0.01 270)' }}>
                  {rec.title}
                </h3>
                <p className="text-[13px] mb-3" style={{ color: 'oklch(58% 0.012 50)', lineHeight: 1.65 }}>
                  {rec.detail}
                </p>

                <div
                  className="text-[12px] p-3 rounded-md"
                  style={{
                    background: 'oklch(8% 0.008 45 / 0.5)',
                    color: 'oklch(65% 0.012 50)',
                    lineHeight: 1.6,
                    borderLeft: `2px solid ${p.color}40`,
                  }}
                >
                  {rec.actionable}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gear track reference */}
      <div className="mt-16 mb-8">
        <div className="text-[9px] uppercase font-bold mb-4" style={{ color: 'oklch(48% 0.01 50)', letterSpacing: '0.12em' }}>
          Midnight Season 1 Gear Tracks
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {[
            { name: 'Adventurer', range: '220-237', color: 'oklch(58% 0.02 270)' },
            { name: 'Veteran', range: '233-250', color: 'oklch(62% 0.14 240)' },
            { name: 'Champion', range: '246-263', color: 'oklch(68% 0.22 300)' },
            { name: 'Hero', range: '259-276', color: 'oklch(80% 0.18 80)' },
            { name: 'Myth', range: '272-289', color: 'oklch(72% 0.18 30)' },
          ].map(track => (
            <div key={track.name} className="glass p-2.5 rounded text-center">
              <div className="text-[9px] font-bold mb-0.5" style={{ color: track.color }}>{track.name}</div>
              <div className="text-[11px] font-mono" style={{ color: 'oklch(55% 0.012 50)', fontVariantNumeric: 'tabular-nums' }}>{track.range}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <p className="text-[11px] italic" style={{ color: 'oklch(42% 0.01 50)', fontFamily: '"Cormorant", Georgia, serif', fontSize: '0.85rem' }}>
          Recommendations update automatically as your character progresses.
        </p>
      </div>
    </section>
  );
}

function OverviewCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="glass p-4 rounded-lg">
      <div className="text-[9px] uppercase font-bold mb-2" style={{ color: 'oklch(48% 0.01 50)', letterSpacing: '0.12em' }}>
        {label}
      </div>
      <div className="text-lg font-extrabold font-mono mb-0.5" style={{ color, fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
      <div className="text-[10px]" style={{ color: 'oklch(45% 0.01 50)' }}>{sub}</div>
    </div>
  );
}
