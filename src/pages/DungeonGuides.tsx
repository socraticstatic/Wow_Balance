import { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { useReveal } from '../hooks/useReveal';

interface DungeonGuide {
  name: string;
  shortName: string;
  expansion: string;
  balanceRating: number; // 1-5
  keyTrash: string[];
  bossNotes: string[];
  balanceTips: string[];
  solarBeamTargets: string[];
  utility: string[];
}

const dungeons: DungeonGuide[] = [
  {
    name: 'Priory of the Sacred Flame',
    shortName: 'Priory',
    expansion: 'Midnight',
    balanceRating: 5,
    keyTrash: [
      'Hallway packs are massive - 8-12 mobs. Starfall paradise.',
      'Sacred Flamecasters channel dangerous AoE. Solar Beam priority.',
      'Pull the courtyard wide - 3 packs at once on Fortified. Your Starfall covers all of it.',
    ],
    bossNotes: [
      'Baron Braunpyke: ST check. Dodge charges. Starsurge focus.',
      'Captain Dailcry: Cleave fight. Keep Starfall up for adds. Solar Beam the healer add.',
      'Prioress Murrpray: Burn boss. Typhoon adds away. Incarnation on pull.',
    ],
    balanceTips: [
      'The mega-pull before Boss 2 is where you shine. Pool 100 AP, Incarnation, Fury of Elune, Starfall, Starfire spam.',
      'Stampeding Roar on the long hallway runs between bosses.',
      'Entangling Roots the Zealot mobs to stop their charge.',
    ],
    solarBeamTargets: ['Sacred Flamecaster', 'Devout Healer', 'Holy Sentinel'],
    utility: ['Solar Beam every caster pack', 'Typhoon adds in courtyard', 'Stampeding Roar hallways', 'Entangling Roots zealots'],
  },
  {
    name: 'The Rookery',
    shortName: 'Rookery',
    expansion: 'Midnight',
    balanceRating: 4,
    keyTrash: [
      'Bird packs are spread out - use Sunfire to pull, then group with Typhoon.',
      'Stormcaller casts chain lightning. Interrupt or die in high keys.',
      'The gauntlet before last boss: constant add spawns. Never stop casting Starfire.',
    ],
    bossNotes: [
      'Kyrioss: Wind mechanics. Keep casting through the pushback. Starfire is your friend.',
      'Stormguard Gorren: Dodge lightning. ST burn with cleave on sparks.',
      'Voidstone Monstrosity: Big AoE check on void zones. Starfall the spawns.',
    ],
    balanceTips: [
      'The gauntlet is your chance to top meters. Non-stop Starfall + Starfire.',
      'Moonfire spread on bird packs for passive damage during movement.',
      'Use Dash (cat form) to quickly reposition for wind mechanics.',
    ],
    solarBeamTargets: ['Stormcaller', 'Thunderspeaker', 'Lightning Channeler'],
    utility: ['Solar Beam stormcallers', 'Typhoon birds into group', 'Stampeding Roar wind phases', 'Soothe enraged mobs'],
  },
  {
    name: 'Cinderbrew Meadery',
    shortName: 'Cinderbrew',
    expansion: 'Midnight',
    balanceRating: 5,
    keyTrash: [
      'Brew elemental packs are HUGE. 10+ mobs. Starfall + Fury of Elune = massive damage.',
      'Brewmasters throw barrels - dodge or take massive damage.',
      'The bar room can be pulled wall-to-wall if your tank is brave.',
    ],
    bossNotes: [
      'Brew Master Aldryr: Dodge brew puddles. ST focus with cleave on oozes.',
      'I\'pa: Interrupt priority. Solar Beam the Ferment cast. Movement heavy.',
      'Benk Buzzbee: DPS race. Burn hard. Incarnation immediately.',
    ],
    balanceTips: [
      'Wall-to-wall the bar room. Pool AP, Incarnation, dump everything. You will top the meters.',
      'The elemental packs at the start are your biggest Starfall windows.',
      'Soothe the enraged brew elementals to reduce tank damage.',
    ],
    solarBeamTargets: ['Flavor Scientist', 'Brewmaster Apprentice', 'I\'pa (boss)'],
    utility: ['Solar Beam flavor scientists', 'Soothe enraged elementals', 'Typhoon oozes', 'Stampeding Roar dodge phases'],
  },
  {
    name: 'Darkflame Cleft',
    shortName: 'Darkflame',
    expansion: 'Midnight',
    balanceRating: 3,
    keyTrash: [
      'Tight corridors limit Starfall value. Many packs are 3-4 mobs.',
      'Candle mobs explode on death - stay at range.',
      'Shadow casters need priority interrupts.',
    ],
    bossNotes: [
      'Ol\' Waxbeard: Dodge flame waves. ST burn. Kite when needed.',
      'Blazikon: Fire puddles reduce space. Stay mobile. DoT while moving.',
      'The Candle King: Add priority. Solar Beam the add healers.',
    ],
    balanceTips: [
      'Worst dungeon for Balance. Tight spaces, small packs, lots of movement.',
      'Go single target talents if possible. Starfall value is limited.',
      'Your utility (Solar Beam, Typhoon) is more valuable than your DPS here.',
    ],
    solarBeamTargets: ['Shadow Channeler', 'Wax Priest', 'Dark Ritualist'],
    utility: ['Solar Beam shadow casters', 'Typhoon melee adds', 'Bear form for emergencies', 'Stampeding Roar flame dodges'],
  },
  {
    name: 'Ara-Kara, City of Echoes',
    shortName: 'Ara-Kara',
    expansion: 'TWW',
    balanceRating: 4,
    keyTrash: [
      'Spider packs come in waves of 6-8. Solid Starfall targets.',
      'Web Spinners root players - break with damage or shapeshift.',
      'The poison area before Boss 2 ticks hard. Move through quickly.',
    ],
    bossNotes: [
      'Avanoxx: Spider adds. Starfall value. Moonfire all spiderlings.',
      'Anub\'zekt: Burrow phases. Pool AP during downtime. Dump when boss surfaces.',
      'Ki\'katal: Shadowcaster. Interrupt and burn. Save CDs for execute.',
    ],
    balanceTips: [
      'Shapeshift to break web roots instantly. Cat Form -> back to Moonkin.',
      'The spider gauntlet before Avanoxx is great for Starfall.',
      'Entangling Roots the Skitterer adds to control packs.',
    ],
    solarBeamTargets: ['Web Spinner', 'Shadow Weaver', 'Venomous Caster'],
    utility: ['Shapeshift breaks webs', 'Entangling Roots skitterers', 'Solar Beam casters', 'Remove Corruption on poison'],
  },
  {
    name: 'City of Threads',
    shortName: 'CoT',
    expansion: 'TWW',
    balanceRating: 4,
    keyTrash: [
      'Nerubian packs are dense. 5-8 mobs per pull. Good Starfall value.',
      'Eye Stalkers cast fear - Solar Beam or Typhoon them.',
      'Silk wraps on players need fast damage to break.',
    ],
    bossNotes: [
      'Orator Krix\'vizk: Move out of sonic waves. Cleave the echoes.',
      'Fangs of the Queen: Council-style. Maintain DoTs on both.',
      'The Coaglamation: Big add spawns. Your moment. Starfall everything.',
    ],
    balanceTips: [
      'The Coaglamation fight is pure Balance territory. Massive add spawns.',
      'Maintain Moonfire on all Eye Stalkers for Shooting Stars value.',
      'Typhoon is clutch for knocking back the charging adds.',
    ],
    solarBeamTargets: ['Eye Stalker', 'Thread Weaver', 'Silk Enchanter'],
    utility: ['Solar Beam eye stalkers', 'Typhoon charging adds', 'Remove Corruption', 'Stampeding Roar fear phases'],
  },
  {
    name: 'The Stonevault',
    shortName: 'Stonevault',
    expansion: 'TWW',
    balanceRating: 4,
    keyTrash: [
      'Machine packs hit hard but die fast. Good burst AoE value.',
      'Earth Shapers cast dangerous ground effects - Solar Beam.',
      'The conveyor belt section: constant small adds. Never stop casting.',
    ],
    bossNotes: [
      'E.D.N.A.: Dodge drill. ST burn. Simple.',
      'Skarmorak: Crystal adds need fast AoE. Starfall + Fury of Elune.',
      'Master Machinists: Council fight. DoTs on both. Starfall covers both.',
    ],
    balanceTips: [
      'The Skarmorak crystal phase is a DPS check. Save Incarnation for it.',
      'Conveyor belt: pool AP between sections, dump on machine packs.',
      'Bear Form briefly if you get targeted by the rock throw.',
    ],
    solarBeamTargets: ['Earth Shaper', 'Stone Channeler', 'Ore Enchanter'],
    utility: ['Solar Beam earth shapers', 'Typhoon crystal adds', 'Bear form for tank death', 'Soothe enraged machines'],
  },
  {
    name: 'The Dawnbreaker',
    shortName: 'Dawnbreaker',
    expansion: 'TWW',
    balanceRating: 5,
    keyTrash: [
      'The airship trash is MASSIVE. 10-15 mobs. Biggest Starfall windows in the game.',
      'Dark Ritualists must be interrupted. Solar Beam every pack.',
      'The ground section has tighter packs but still solid AoE.',
    ],
    bossNotes: [
      'Speaker Shadowcrown: Interrupt priority. ST with minor adds.',
      'Anub\'ikkaj: Shadow orbs. Dodge and DPS. Pool AP for orb phases.',
      'Rashanan: Final boss. Big AoE check. Starfall the web adds. This is your fight.',
    ],
    balanceTips: [
      'THE best M+ dungeon for Balance Druid. The airship mega-pulls are absurd Starfall value.',
      'On the airship, pool 100 AP, Incarnation, Fury of Elune, Starfall, Starfire. Watch the meters explode.',
      'Stampeding Roar for the jump between airship sections.',
    ],
    solarBeamTargets: ['Dark Ritualist', 'Shadow Channeler', 'Riftmender'],
    utility: ['Solar Beam every ritualist', 'Typhoon shadow adds', 'Stampeding Roar jump sections', 'Innervate healer on big pulls'],
  },
];

export default function DungeonGuides() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const r1 = useReveal();

  return (
    <section className="px-6 sm:px-10 py-32 max-w-6xl mx-auto">
      <div ref={r1} className="reveal">
        <SectionHeading
          title="M+ Dungeon Guide"
          sub="Balance Druid strategies for every Midnight Season 1 dungeon. Solar Beam targets, utility, and AoE opportunities."
          accent="lunar"
        />
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
              borderLeft: expanded === d.shortName ? '2px solid oklch(72% 0.18 270)' : '2px solid transparent',
            }}
          >
            <div className="text-[11px] font-bold mb-0.5" style={{ color: 'oklch(88% 0.006 270)' }}>
              {d.shortName}
            </div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full"
                  style={{ background: i < d.balanceRating ? 'oklch(72% 0.18 270)' : 'oklch(16% 0.01 270)' }} />
              ))}
            </div>
            <div className="text-[9px] mt-0.5" style={{ color: 'oklch(50% 0.01 50)' }}>{d.expansion}</div>
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
        {/* Clickable header */}
        <button
          onClick={onToggle}
          className="w-full px-6 py-4 flex items-center justify-between cursor-pointer text-left"
          style={{ borderBottom: isExpanded ? '1px solid oklch(16% 0.012 45)' : 'none' }}
        >
          <div className="flex items-baseline gap-3">
            <span className="text-xl font-display font-bold" style={{ color: 'oklch(92% 0.008 60)', fontStyle: 'italic' }}>
              {dungeon.name}
            </span>
            <span className="text-[10px] font-medium" style={{ color: 'oklch(50% 0.01 50)' }}>{dungeon.expansion}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full"
                  style={{ background: i < dungeon.balanceRating ? 'oklch(72% 0.18 270)' : 'oklch(16% 0.01 270)' }} />
              ))}
            </div>
            <span className="text-lg" style={{ color: 'oklch(50% 0.01 50)', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s ease' }}>
              &#8963;
            </span>
          </div>
        </button>

        {/* Expanded content */}
        {isExpanded && (
          <div className="px-6 py-5">
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              {/* Trash + bosses */}
              <div>
                <div className="text-[9px] uppercase font-bold mb-3" style={{ color: 'oklch(80% 0.18 80)', letterSpacing: '0.12em' }}>
                  Key Trash
                </div>
                <ul className="space-y-2 mb-6">
                  {dungeon.keyTrash.map((t, i) => (
                    <li key={i} className="text-[13px]" style={{ color: 'oklch(68% 0.012 270)', lineHeight: 1.7 }}>{t}</li>
                  ))}
                </ul>

                <div className="text-[9px] uppercase font-bold mb-3" style={{ color: 'oklch(72% 0.18 270)', letterSpacing: '0.12em' }}>
                  Boss Notes
                </div>
                <ul className="space-y-2">
                  {dungeon.bossNotes.map((b, i) => (
                    <li key={i} className="text-[13px]" style={{ color: 'oklch(68% 0.012 270)', lineHeight: 1.7 }}>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Balance tips + utility */}
              <div>
                <div className="text-[9px] uppercase font-bold mb-3" style={{ color: 'oklch(68% 0.18 155)', letterSpacing: '0.12em' }}>
                  Balance Druid Tips
                </div>
                <ul className="space-y-2 mb-6">
                  {dungeon.balanceTips.map((t, i) => (
                    <li key={i} className="text-[13px] pl-3" style={{
                      color: 'oklch(72% 0.012 270)',
                      lineHeight: 1.7,
                      borderLeft: '2px solid oklch(68% 0.18 155 / 0.3)',
                    }}>
                      {t}
                    </li>
                  ))}
                </ul>

                {/* Solar Beam targets */}
                <div className="p-4 rounded-lg mb-4" style={{ background: 'oklch(9% 0.008 45)', border: '1px solid oklch(14% 0.01 45)' }}>
                  <div className="text-[9px] uppercase font-bold mb-2" style={{ color: 'oklch(72% 0.16 30)', letterSpacing: '0.12em' }}>
                    Solar Beam Targets
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {dungeon.solarBeamTargets.map(t => (
                      <span key={t} className="text-[11px] font-medium px-2 py-0.5 rounded"
                        style={{ color: 'oklch(72% 0.16 30)', background: 'oklch(72% 0.16 30 / 0.08)' }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Utility checklist */}
                <div className="p-4 rounded-lg" style={{ background: 'oklch(9% 0.008 45)', border: '1px solid oklch(14% 0.01 45)' }}>
                  <div className="text-[9px] uppercase font-bold mb-2" style={{ color: 'oklch(64% 0.012 50)', letterSpacing: '0.12em' }}>
                    Utility Checklist
                  </div>
                  <ul className="space-y-1">
                    {dungeon.utility.map(u => (
                      <li key={u} className="flex items-center gap-2 text-[12px]" style={{ color: 'oklch(66% 0.012 270)' }}>
                        <span className="w-1 h-1 rounded-full" style={{ background: 'oklch(80% 0.18 80)' }} />
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
