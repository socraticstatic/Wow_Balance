import { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { useReveal } from '../hooks/useReveal';

interface DungeonGuide {
  name: string;
  shortName: string;
  expansion: string;
  timer: string;
  balanceRating: number;
  keyTrash: string[];
  bossNotes: string[];
  balanceTips: string[];
  solarBeamTargets: string[];
  utility: string[];
}

const dungeons: DungeonGuide[] = [
  {
    name: 'Magisters\' Terrace',
    shortName: 'MgT',
    expansion: 'Midnight',
    timer: '34:00',
    balanceRating: 5,
    keyTrash: [
      'Heavy caster trash. Solar Beam is extremely valuable on grouped caster packs.',
      'Hallway pulls are large and grouped. Starfall paradise.',
      'Tight corridors mean Typhoon can knock melee mobs into the healer - be careful with aim.',
    ],
    bossNotes: [
      'Selin Fireheart: Interrupt Fel Explosion. Drain crystals. ST check.',
      'Vexallus: Pure Energy adds need fast cleave. Starfall value.',
      'Priestess Delrissa: Council mini-boss. Multi-DoT. Solar Beam the healer add.',
      'Kael\'thas: Gravity Lapse phase - bank instants. Pyroblast interrupt critical.',
    ],
    balanceTips: [
      'The caster density makes this your best Solar Beam dungeon.',
      'Stampeding Roar between 2nd and 3rd boss (long corridor).',
      'Priestess Delrissa is a mini-council - Starfall hits all targets.',
    ],
    solarBeamTargets: ['Sunblade Mage Guard', 'Wretched Firebringer', 'Priestess Delrissa healer add'],
    utility: ['Solar Beam every caster pack', 'Typhoon corridors', 'Stampeding Roar long runs', 'Remove Corruption'],
  },
  {
    name: 'Maisara Caverns',
    shortName: 'MC',
    expansion: 'Midnight',
    timer: '33:00',
    balanceRating: 5,
    keyTrash: [
      'Community consensus: HARDEST dungeon in the pool. Extremely interrupt-heavy.',
      'Large cave packs with 6-8 mobs. AoE heaven for Balance.',
      'Environmental hazards in cave areas. Watch your feet.',
    ],
    bossNotes: [
      'All bosses have casts that must be interrupted. Solar Beam every boss.',
      'Add spawns on every boss. Starfall always has value.',
      'Final boss has a stacking enrage. Burn hard.',
    ],
    balanceTips: [
      'Take Light of the Sun talent for reduced Solar Beam CD. This dungeon demands it.',
      'More casts to stop here than any other dungeon.',
      'Go full AoE build. Sustained multi-target damage is rewarded heavily.',
      'Typhoon mobs out of hazardous ground effects in cave areas.',
    ],
    solarBeamTargets: ['Cave Channeler', 'Shadowcaster', 'Crystal Weaver', 'Every boss'],
    utility: ['Solar Beam (reduced CD mandatory)', 'Typhoon out of ground effects', 'Stampeding Roar cave navigation', 'Soothe enraged adds'],
  },
  {
    name: 'Nexus-Point Xenas',
    shortName: 'NPX',
    expansion: 'Midnight',
    timer: '30:00',
    balanceRating: 3,
    keyTrash: [
      'Shortest timer (30:00). Fast-paced, tight routes. No room for wipes.',
      'Mix of ST boss checks and AoE trash. Stay flexible.',
      'Void caster mobs need interrupts.',
    ],
    bossNotes: [
      'Bosses are ST checks. Keeper may outperform Elune\'s here.',
      'Movement-heavy boss mechanics. Save instant-cast procs for movement.',
      'Timer is the real enemy. Every second counts.',
    ],
    balanceTips: [
      'Consider hybrid build. Bosses are tight ST checks, trash is AoE.',
      'Stampeding Roar helps the group stay on pace for the tight timer.',
      'Starfall on larger pulls between bosses. Starsurge on bosses.',
    ],
    solarBeamTargets: ['Void Channeler', 'Nexus Arcanist', 'Rift Weaver'],
    utility: ['Solar Beam void casters', 'Stampeding Roar for pace', 'Typhoon repositioning', 'Bear Form for emergencies'],
  },
  {
    name: 'Windrunner Spire',
    shortName: 'WS',
    expansion: 'Midnight',
    timer: '33:30',
    balanceRating: 4,
    keyTrash: [
      'Vertical dungeon with multiple floors. Caster-heavy undead and void trash.',
      'Solar Beam targets on every floor.',
      'Floor-clearing pulls are large and reward Starfall.',
    ],
    bossNotes: [
      'Boss transitions between floors. Pool AP between phases.',
      'Add spawns during boss transitions. Starfall value.',
      'Final boss has void zones that shrink arena - move early.',
    ],
    balanceTips: [
      'Typhoon mobs off elevated platforms for environmental kills.',
      'Stampeding Roar between floors and during boss transitions.',
      'Remove Corruption useful for void debuffs.',
    ],
    solarBeamTargets: ['Shadow Priest', 'Void Channeler', 'Undead Arcanist'],
    utility: ['Solar Beam casters', 'Typhoon off platforms', 'Stampeding Roar between floors', 'Remove Corruption'],
  },
  {
    name: 'Algeth\'ar Academy',
    shortName: 'AA',
    expansion: 'Dragonflight',
    timer: '29:00',
    balanceRating: 4,
    keyTrash: [
      'Returning from Dragonflight S1/S2. Familiar if you played DF.',
      'Arcane Constructs and Unruly Textbook casters. Solar Beam the Textbook packs.',
      'Large open courtyard pulls are excellent for Starfall.',
    ],
    bossNotes: [
      'Vexamus: ST burn. Kill orbs fast before they reach boss. Interrupt.',
      'Overgrown Ancient: Add cleave. Starfall on lashers.',
      'Echo of Doragosa: Dodge swirlies. ST focus. Movement-heavy.',
    ],
    balanceTips: [
      'Mix of AoE and ST. Boss fights lean single target (especially Vexamus).',
      'Typhoon Vexamus orbs or reposition trash.',
      'Courtyard pulls are your biggest Starfall windows.',
    ],
    solarBeamTargets: ['Unruly Textbook', 'Arcane Construct', 'Spelltouched Scribe'],
    utility: ['Solar Beam textbooks', 'Typhoon orbs on Vexamus', 'Soothe constructs', 'Stampeding Roar courtyard'],
  },
  {
    name: 'Seat of the Triumvirate',
    shortName: 'SotT',
    expansion: 'Legion',
    timer: '34:00',
    balanceRating: 4,
    keyTrash: [
      'Void-themed circular layout. Heavy interrupt dungeon.',
      'Dire Voidbenders cast Abyssal Enhancement (must interrupt or purge).',
      'Dark Conjurers summon Void Callers. Shadowguard Subjugators heal with Shadowmend.',
    ],
    bossNotes: [
      'Zuraal: Void zones. Stay out. ST focus.',
      'Saprish: Interrupt Shadewing\'s Dread Screech. Purge Darkfang\'s Abyssal Enhancement.',
      'Viceroy Nezhar: Interrupt Mind Blast. Kill Umbral Tentacles before Collapsing Void.',
      'L\'ura: Final boss. Burn Void adds. Movement for void puddles.',
    ],
    balanceTips: [
      'Solar Beam + Light of the Sun talent mandatory. Interrupt-dense dungeon.',
      'Nezhar wing trash packs are great for Starfall.',
      'Remove Corruption useful for dispelling party members.',
    ],
    solarBeamTargets: ['Dire Voidbender', 'Dark Conjurer', 'Shadowguard Subjugator', 'Umbral Tentacle'],
    utility: ['Solar Beam (mandatory)', 'Remove Corruption dispels', 'Typhoon void adds', 'Bear Form for survival'],
  },
  {
    name: 'Skyreach',
    shortName: 'SR',
    expansion: 'WoD',
    timer: '28:00',
    balanceRating: 3,
    keyTrash: [
      'Shortest timer in pool (28:00). Vertical, movement-heavy.',
      'Solar Barrier casters (purge or interrupt). Blinding Light casters (always interrupt).',
      'Use stone columns near Ranjit to LoS Gale-Callers into melee for easier interrupts.',
    ],
    bossNotes: [
      'Ranjit: Wind mechanics. Keep casting through pushback.',
      'Araknath: Add priority. Solar Beam adds.',
      'Rukhran: Dodge feathers. ST burn.',
      'High Sage Viryx: Interrupt Solar Blast. Kill Shield Construct IMMEDIATELY (gives 99% DR).',
    ],
    balanceTips: [
      'Typhoon near ledges for environmental kills (counts for enemy forces!).',
      'Shield Construct on Viryx is the key mechanic. Focus it instantly.',
      'Stampeding Roar helps navigate vertical transitions.',
    ],
    solarBeamTargets: ['Solar Barrier caster', 'Blinding Light caster', 'Solar Bolt caster', 'Gale-Caller'],
    utility: ['Solar Beam casters', 'Typhoon for ledge kills', 'Stampeding Roar verticals', 'Soothe enraged'],
  },
  {
    name: 'Pit of Saron',
    shortName: 'PoS',
    expansion: 'WotLK',
    timer: '30:00',
    balanceRating: 5,
    keyTrash: [
      'Open quarry layout. 6 prisoner camps to liberate. Path decisions matter.',
      'Arcanist Cadaver casts Netherburst (full group AoE nuke - MUST interrupt every cast).',
      'Dreadpulse Lich: Icy Blast on tank, Torrent of Misery channel. Very dangerous on Fortified.',
    ],
    bossNotes: [
      'Forgemaster Garfrost: LoS behind Ore Chunks during Glacial Overload.',
      'Krick & Ick: Dodge poison. Kite boss. Movement-heavy.',
      'Scourgelord Tyrannus: Overlord\'s Brand debuff. Stop DPS when applied to tank.',
    ],
    balanceTips: [
      'Quarry prisoner camp pulls are MASSIVE. Starfall + Fury of Elune = insane damage.',
      'Stampeding Roar critical for Glacial Overload repositioning behind Ore Chunks.',
      'Typhoon undead mobs charging the group during camp liberations.',
      'On Fortified, Dreadpulse Lich and Ymirjar Graveblade are extremely dangerous. Prioritize interrupts.',
    ],
    solarBeamTargets: ['Arcanist Cadaver (Netherburst - MUST interrupt)', 'Dreadpulse Lich', 'Gloombound Shadebringer'],
    utility: ['Solar Beam Arcanist Cadaver (critical)', 'Stampeding Roar Glacial Overload', 'Typhoon camp mobs', 'Soothe undead'],
  },
];

// Affix info
const affixTiers = [
  { level: '2-4', name: 'Lindormi\'s Guidance', desc: 'Marks enemies, reduces HP/damage by 5%. No death timer penalty.' },
  { level: '5-11', name: 'Xal\'atath\'s Bargain', desc: 'Rotating weekly: Ascendant, Voidbound, Pulsar, Devour.' },
  { level: '7+', name: 'Tyrannical / Fortified', desc: 'Alternates weekly. Boss HP vs trash HP.' },
  { level: '12+', name: 'Xal\'atath\'s Guile', desc: 'Each death costs 15s. BOTH Tyrannical and Fortified active.' },
];

const bargainTips = [
  { name: 'Ascendant', tip: 'Use Incapacitating Roar to stop all orbs at once. Typhoon risks knocking mobs.' },
  { name: 'Voidbound', tip: 'Burn the Emissary fast. Interrupt every Dark Prayer cast.' },
  { name: 'Pulsar', tip: 'Stack with group. Pulsars clear instantly when players overlap.' },
  { name: 'Devour', tip: 'You have Remove Corruption. Use it. Handle your own dispel.' },
];

export default function DungeonGuides() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const r1 = useReveal();
  const r2 = useReveal();

  return (
    <section className="px-6 sm:px-10 py-32 max-w-6xl mx-auto">
      <div ref={r1} className="reveal">
        <SectionHeading
          title="M+ Dungeon Guide"
          sub="Midnight Season 1. Eight dungeons. Balance Druid strategies, Solar Beam targets, utility tips."
          accent="lunar"
        />
      </div>

      {/* Affix system */}
      <div ref={r2} className="reveal mb-16">
        <div className="text-[11px] uppercase font-bold mb-4" style={{ color: 'var(--color-text-1)', letterSpacing: '0.12em' }}>
          Season 1 Affix System
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-6">
          {affixTiers.map(a => (
            <div key={a.level} className="p-3 rounded-lg glass">
              <div className="text-[12px] font-bold mb-1" style={{ color: 'var(--color-solar)' }}>+{a.level}</div>
              <div className="text-[14px] font-semibold mb-0.5" style={{ color: 'var(--color-text-1)' }}>{a.name}</div>
              <div className="text-[13px]" style={{ color: 'var(--color-text-1)' }}>{a.desc}</div>
            </div>
          ))}
        </div>

        <div className="text-[11px] uppercase font-bold mb-3" style={{ color: 'var(--color-lunar)', letterSpacing: '0.12em' }}>
          Bargain Affix Tips (Balance Druid)
        </div>
        <div className="grid sm:grid-cols-2 gap-2">
          {bargainTips.map(b => (
            <div key={b.name} className="flex items-start gap-2 p-3 rounded-lg" style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-surface-2)' }}>
              <span className="text-[13px] font-bold shrink-0 w-20" style={{ color: 'var(--color-lunar)' }}>{b.name}</span>
              <span className="text-[14px]" style={{ color: 'var(--color-text-1)' }}>{b.tip}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dungeon tier list */}
      <div className="reveal mb-12 flex flex-wrap gap-2">
        {[...dungeons].sort((a, b) => b.balanceRating - a.balanceRating).map(d => (
          <button
            key={d.shortName}
            onClick={() => setExpanded(expanded === d.shortName ? null : d.shortName)}
            className="px-3 py-2 rounded-lg glass card-hover cursor-pointer text-left"
            style={{
              minWidth: 100,
              borderLeft: expanded === d.shortName ? '2px solid var(--color-lunar)' : '2px solid transparent',
            }}
          >
            <div className="text-[13px] font-bold mb-0.5" style={{ color: 'var(--color-text-1)' }}>
              {d.shortName}
            </div>
            <div className="flex items-center gap-0.5 mb-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full"
                  style={{ background: i < d.balanceRating ? 'var(--color-lunar)' : 'var(--color-surface-active)' }} />
              ))}
            </div>
            <div className="text-[11px]" style={{ color: 'var(--color-text-2)' }}>{d.timer}</div>
          </button>
        ))}
      </div>

      {/* Full dungeon guides */}
      <div className="space-y-4">
        {dungeons.map((dungeon) => (
          <DungeonCard
            key={dungeon.shortName}
            dungeon={dungeon}
            isExpanded={expanded === dungeon.shortName}
            onToggle={() => setExpanded(expanded === dungeon.shortName ? null : dungeon.shortName)}
          />
        ))}
      </div>
    </section>
  );
}

function DungeonCard({ dungeon, isExpanded, onToggle }: {
  dungeon: DungeonGuide; isExpanded: boolean; onToggle: () => void;
}) {
  const r = useReveal();

  return (
    <div ref={r} className="reveal">
      <div className="rounded-lg overflow-hidden glass">
        <button
          onClick={onToggle}
          className="w-full px-6 py-4 flex items-center justify-between cursor-pointer text-left"
          style={{ borderBottom: isExpanded ? '1px solid var(--color-border)' : 'none' }}
        >
          <div className="flex items-baseline gap-3">
            <span className="text-xl font-display font-bold" style={{ color: 'var(--color-text-1)', fontStyle: 'italic' }}>
              {dungeon.name}
            </span>
            <span className="text-[12px] font-medium" style={{ color: 'var(--color-text-2)' }}>{dungeon.expansion}</span>
            <span className="font-mono text-[12px]" style={{ color: 'var(--color-text-3)', fontVariantNumeric: 'tabular-nums' }}>{dungeon.timer}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full"
                  style={{ background: i < dungeon.balanceRating ? 'var(--color-lunar)' : 'var(--color-surface-active)' }} />
              ))}
            </div>
            <span style={{ color: 'var(--color-text-2)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease', display: 'inline-block' }}>
              &#8963;
            </span>
          </div>
        </button>

        {isExpanded && (
          <div className="px-6 py-5">
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div>
                <div className="text-[11px] uppercase font-bold mb-3" style={{ color: 'var(--color-solar)', letterSpacing: '0.12em' }}>
                  Key Trash
                </div>
                <ul className="space-y-2 mb-6">
                  {dungeon.keyTrash.map((t, i) => (
                    <li key={i} className="text-[15px]" style={{ color: 'var(--color-text-1)', lineHeight: 1.7 }}>{t}</li>
                  ))}
                </ul>

                <div className="text-[11px] uppercase font-bold mb-3" style={{ color: 'var(--color-lunar)', letterSpacing: '0.12em' }}>
                  Boss Notes
                </div>
                <ul className="space-y-2">
                  {dungeon.bossNotes.map((b, i) => (
                    <li key={i} className="text-[15px]" style={{ color: 'var(--color-text-1)', lineHeight: 1.7 }}>{b}</li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="text-[11px] uppercase font-bold mb-3" style={{ color: 'var(--color-nature)', letterSpacing: '0.12em' }}>
                  Balance Druid Tips
                </div>
                <ul className="space-y-2 mb-6">
                  {dungeon.balanceTips.map((t, i) => (
                    <li key={i} className="text-[15px] pl-3" style={{
                      color: 'var(--color-text-1)',
                      lineHeight: 1.7,
                      borderLeft: '2px solid color-mix(in oklch, var(--color-nature) 30%, transparent)',
                    }}>
                      {t}
                    </li>
                  ))}
                </ul>

                <div className="p-4 rounded-lg mb-4" style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-surface-2)' }}>
                  <div className="text-[11px] uppercase font-bold mb-2" style={{ color: 'var(--color-error)', letterSpacing: '0.12em' }}>
                    Solar Beam Targets
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {dungeon.solarBeamTargets.map(t => (
                      <span key={t} className="text-[13px] font-medium px-2 py-0.5 rounded"
                        style={{ color: 'var(--color-error)', background: 'color-mix(in oklch, var(--color-error) 8%, transparent)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-lg" style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-surface-2)' }}>
                  <div className="text-[11px] uppercase font-bold mb-2" style={{ color: 'var(--color-text-1)', letterSpacing: '0.12em' }}>
                    Utility Checklist
                  </div>
                  <ul className="space-y-1">
                    {dungeon.utility.map(u => (
                      <li key={u} className="flex items-center gap-2 text-[14px]" style={{ color: 'var(--color-text-1)' }}>
                        <span className="w-1 h-1 rounded-full" style={{ background: 'var(--color-solar)' }} />
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
