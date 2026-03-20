import { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { useReveal } from '../hooks/useReveal';

interface Pull {
  id: number;
  name: string;
  targets: number;
  type: 'trash' | 'boss' | 'miniboss';
  dangerous: boolean;
  cds: string[];
  notes: string;
}

interface DungeonRoute {
  name: string;
  shortName: string;
  timer: string;
  totalPulls: number;
  pulls: Pull[];
}

// ── Magisters' Terrace Route ──
const mgt: DungeonRoute = {
  name: "Magisters' Terrace",
  shortName: 'MgT',
  timer: '34:00',
  totalPulls: 18,
  pulls: [
    { id: 1, name: 'Entry hall casters', targets: 5, type: 'trash', dangerous: true, cds: ['Fury of Elune', 'Starfall'], notes: 'Solar Beam the caster pack. Group is tightly packed. Sunfire first for instant AoE application.' },
    { id: 2, name: 'Corridor patrol', targets: 4, type: 'trash', dangerous: false, cds: ['Starfall'], notes: 'Standard AoE. Pool AP from pull 1. Enter with 80+ AP.' },
    { id: 3, name: 'Selin Fireheart', targets: 1, type: 'boss', dangerous: true, cds: ['Incarnation', 'Fury of Elune'], notes: 'ST boss. Interrupt Fel Explosion. Use Incarnation + trinket here. Fury for Atmospheric Exposure amp.' },
    { id: 4, name: 'Crystal room pack', targets: 7, type: 'trash', dangerous: true, cds: ['Fury of Elune', 'Starfall'], notes: 'Big pack. Fury + Starfall. Solar Beam the casters in the back. This is your highest damage pull before boss 2.' },
    { id: 5, name: 'Transition hallway', targets: 4, type: 'trash', dangerous: false, cds: ['Starfall'], notes: 'Stampeding Roar to move the group faster. Quick Starfall and move.' },
    { id: 6, name: 'Vexallus', targets: 1, type: 'boss', dangerous: true, cds: ['Fury of Elune'], notes: 'ST with add spawns. Pure Energy adds need fast cleave. Save Starfall for add waves. Fury on boss for amp.' },
    { id: 7, name: 'Double pack before Priestess', targets: 8, type: 'trash', dangerous: true, cds: ['Incarnation', 'Fury of Elune', 'Starfall'], notes: 'BIGGEST pull of the dungeon. Pop everything. Incarnation + Fury + Starfall. Solar Beam one caster group, Typhoon the other into Ursol\'s Vortex.' },
    { id: 8, name: 'Priestess Delrissa', targets: 5, type: 'boss', dangerous: true, cds: ['Fury of Elune', 'Starfall'], notes: 'Council boss! Multi-DoT all 5 targets. Starfall always up. Solar Beam the healer add. Your best boss parse potential.' },
    { id: 9, name: 'Gauntlet to Kael', targets: 6, type: 'trash', dangerous: true, cds: ['Starfall'], notes: 'Rolling trash. Keep moving with the group. Stampeding Roar. Starfall on every pack.' },
    { id: 10, name: 'Kael\'thas Sunstrider', targets: 1, type: 'boss', dangerous: true, cds: ['Incarnation', 'Fury of Elune'], notes: 'Final boss. Gravity Lapse: bank instants. Pyroblast interrupt is CRITICAL. Incarnation on pull. Fury for amp. Use every CD.' },
  ],
};

// ── Pit of Saron Route ──
const pos: DungeonRoute = {
  name: 'Pit of Saron',
  shortName: 'PoS',
  timer: '30:00',
  totalPulls: 16,
  pulls: [
    { id: 1, name: 'Quarry entrance pack', targets: 6, type: 'trash', dangerous: false, cds: ['Fury of Elune', 'Starfall'], notes: 'First pull. Fury + Starfall. Standard AoE opener.' },
    { id: 2, name: 'Prisoner camp 1', targets: 8, type: 'trash', dangerous: true, cds: ['Incarnation', 'Fury of Elune', 'Starfall'], notes: 'MASSIVE pull. Pop everything. This is your biggest damage window. Solar Beam the Arcanist Cadaver (Netherburst WILL wipe you if not interrupted).' },
    { id: 3, name: 'Prisoner camp 2', targets: 7, type: 'trash', dangerous: true, cds: ['Fury of Elune', 'Starfall'], notes: 'Another big camp. Fury is back from Lunation reduction. Starfall always. Watch for Dreadpulse Lich on Fortified.' },
    { id: 4, name: 'Forgemaster Garfrost', targets: 1, type: 'boss', dangerous: true, cds: ['Fury of Elune'], notes: 'LoS behind Ore Chunks during Glacial Overload. Stampeding Roar for the group to reposition. Fury for amp. ST focus.' },
    { id: 5, name: 'Tunnel trash', targets: 5, type: 'trash', dangerous: false, cds: ['Starfall'], notes: 'Quick pack in the tunnel. Pool AP for Krick & Ick.' },
    { id: 6, name: 'Krick & Ick', targets: 1, type: 'boss', dangerous: true, cds: ['Incarnation', 'Fury of Elune'], notes: 'Dodge poison. Kite boss. Movement-heavy. Bank instants. Incarnation + Fury on pull. Bear Form if poison catches you.' },
    { id: 7, name: 'Ramp undead', targets: 6, type: 'trash', dangerous: true, cds: ['Fury of Elune', 'Starfall'], notes: 'Ascending ramp. Typhoon undead back down for positioning. Solar Beam casters.' },
    { id: 8, name: 'Scourgelord Tyrannus', targets: 1, type: 'boss', dangerous: true, cds: ['Fury of Elune'], notes: 'Overlord\'s Brand: STOP DPS when debuff is on tank. Watch for the skull icon. Fury for amp during safe windows.' },
  ],
};

// ── Maisara Caverns Route ──
const mc: DungeonRoute = {
  name: 'Maisara Caverns',
  shortName: 'MC',
  timer: '33:00',
  totalPulls: 15,
  pulls: [
    { id: 1, name: 'Cave entrance', targets: 6, type: 'trash', dangerous: true, cds: ['Fury of Elune', 'Starfall'], notes: 'Hardest dungeon in the pool. Solar Beam every caster pack. Light of the Sun talent mandatory for reduced CD.' },
    { id: 2, name: 'Large cave chamber', targets: 8, type: 'trash', dangerous: true, cds: ['Incarnation', 'Fury of Elune', 'Starfall'], notes: 'Biggest pack of the dungeon. Full CDs. This is AoE paradise. Typhoon mobs out of ground effects.' },
    { id: 3, name: 'Channeler pack', targets: 5, type: 'trash', dangerous: true, cds: ['Starfall'], notes: 'Solar Beam priority. Cave Channelers must be interrupted or they heal.' },
    { id: 4, name: 'Boss 1', targets: 1, type: 'boss', dangerous: true, cds: ['Fury of Elune'], notes: 'Interrupt every cast. Solar Beam on cooldown. Fury for amp.' },
    { id: 5, name: 'Crystal corridor', targets: 6, type: 'trash', dangerous: true, cds: ['Fury of Elune', 'Starfall'], notes: 'Watch ground effects. Typhoon mobs clear. Starfall uptime.' },
    { id: 6, name: 'Boss 2', targets: 1, type: 'boss', dangerous: true, cds: ['Incarnation', 'Fury of Elune'], notes: 'Add spawns. Starfall for adds, Starsurge on boss. Incarnation for the burn phase.' },
    { id: 7, name: 'Deep cave packs', targets: 7, type: 'trash', dangerous: true, cds: ['Fury of Elune', 'Starfall'], notes: 'More casters. More interrupts. This dungeon never lets up.' },
    { id: 8, name: 'Final boss', targets: 1, type: 'boss', dangerous: true, cds: ['Incarnation', 'Fury of Elune'], notes: 'Stacking enrage. Burn hard. Use everything. Bear Form if needed for survival.' },
  ],
};

const allRoutes: DungeonRoute[] = [mgt, pos, mc];

const cdColors: Record<string, string> = {
  'Incarnation': 'var(--color-solar)',
  'Fury of Elune': 'var(--color-lunar)',
  'Starfall': 'var(--color-lunar)',
  'Solar Beam': 'var(--color-error)',
};

export default function MplusCdPlanner() {
  const [selected, setSelected] = useState(allRoutes[0].shortName);
  const route = allRoutes.find(r => r.shortName === selected) || allRoutes[0];
  const r1 = useReveal();

  // Count CD usages
  const incarnUsages = route.pulls.filter(p => p.cds.includes('Incarnation')).length;
  const furyUsages = route.pulls.filter(p => p.cds.includes('Fury of Elune')).length;

  return (
    <section className="px-6 sm:px-10 py-32 max-w-6xl mx-auto relative z-10">
      <div ref={r1} className="reveal">
        <SectionHeading
          title="M+ CD Planner"
          sub="Pull-by-pull cooldown assignments. Know exactly when to press your buttons."
          accent="lunar"
        />
      </div>

      {/* Dungeon selector */}
      <div className="reveal flex flex-wrap gap-2 mb-8">
        {allRoutes.map(r => (
          <button
            key={r.shortName}
            onClick={() => setSelected(r.shortName)}
            className="px-4 py-2.5 rounded-lg text-[13px] font-semibold cursor-pointer transition-all"
            style={{
              color: selected === r.shortName ? 'var(--color-text-1)' : 'var(--color-text-4)',
              background: selected === r.shortName ? 'var(--color-surface-3)' : 'var(--color-surface-1)',
              border: `1px solid ${selected === r.shortName ? 'var(--color-text-ghost)' : 'var(--color-border)'}`,
            }}
          >
            {r.shortName}
            <span className="ml-2 text-[11px] font-mono" style={{ color: 'var(--color-text-muted)' }}>{r.timer}</span>
          </button>
        ))}
      </div>

      {/* CD budget overview */}
      <div className="reveal grid grid-cols-2 lg:grid-cols-4 gap-3 mb-12">
        <div className="p-4 rounded-lg glass">
          <div className="text-[11px] uppercase font-bold mb-1" style={{ color: 'var(--color-solar)', letterSpacing: '0.1em' }}>Incarnation</div>
          <div className="text-2xl font-bold font-mono" style={{ color: 'var(--color-solar)', fontVariantNumeric: 'tabular-nums' }}>{incarnUsages}x</div>
          <div className="text-[11px]" style={{ color: 'var(--color-text-4)' }}>3min CD, 2 charges</div>
        </div>
        <div className="p-4 rounded-lg glass">
          <div className="text-[11px] uppercase font-bold mb-1" style={{ color: 'var(--color-lunar)', letterSpacing: '0.1em' }}>Fury of Elune</div>
          <div className="text-2xl font-bold font-mono" style={{ color: 'var(--color-lunar)', fontVariantNumeric: 'tabular-nums' }}>{furyUsages}x</div>
          <div className="text-[11px]" style={{ color: 'var(--color-text-4)' }}>60s (reduced by Lunation)</div>
        </div>
        <div className="p-4 rounded-lg glass">
          <div className="text-[11px] uppercase font-bold mb-1" style={{ color: 'var(--color-text-1)', letterSpacing: '0.1em' }}>Total Pulls</div>
          <div className="text-2xl font-bold font-mono" style={{ color: 'var(--color-text-1)', fontVariantNumeric: 'tabular-nums' }}>{route.pulls.length}</div>
        </div>
        <div className="p-4 rounded-lg glass">
          <div className="text-[11px] uppercase font-bold mb-1" style={{ color: 'var(--color-text-1)', letterSpacing: '0.1em' }}>Timer</div>
          <div className="text-2xl font-bold font-mono" style={{ color: 'var(--color-text-1)', fontVariantNumeric: 'tabular-nums' }}>{route.timer}</div>
        </div>
      </div>

      {/* Pull-by-pull timeline */}
      <div className="reveal space-y-2">
        {route.pulls.map(pull => (
          <PullCard key={pull.id} pull={pull} />
        ))}
      </div>

      {/* Legend */}
      <div className="reveal mt-12 p-5 rounded-lg glass">
        <div className="text-[11px] uppercase font-bold mb-3" style={{ color: 'var(--color-text-3)', letterSpacing: '0.12em' }}>
          CD Color Legend
        </div>
        <div className="flex flex-wrap gap-4">
          {Object.entries(cdColors).map(([cd, color]) => (
            <div key={cd} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded" style={{ background: color }} />
              <span className="text-[12px] font-semibold" style={{ color }}>{cd}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PullCard({ pull }: { pull: Pull }) {
  const r = useReveal();
  const typeColor = pull.type === 'boss' ? 'var(--color-solar)' : pull.type === 'miniboss' ? 'var(--color-lunar)' : 'var(--color-text-muted)';
  const hasMajorCd = pull.cds.includes('Incarnation');

  return (
    <div ref={r} className="reveal rounded-lg glass overflow-hidden"
      style={{ borderLeft: hasMajorCd ? '3px solid var(--color-solar)' : pull.dangerous ? '3px solid var(--color-error)' : '3px solid transparent' }}
    >
      <div className="px-5 py-3.5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[13px] font-bold" style={{ color: 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
            P{String(pull.id).padStart(2, '0')}
          </span>
          <span className="text-[14px] font-semibold" style={{ color: 'var(--color-text-1)' }}>
            {pull.name}
          </span>
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ color: typeColor, background: `color-mix(in oklch, ${typeColor} 7%, transparent)` }}>
            {pull.type} {pull.targets > 1 ? `x${pull.targets}` : ''}
          </span>
          {pull.dangerous && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ color: 'var(--color-error)', background: 'color-mix(in oklch, var(--color-error) 10%, transparent)' }}>
              ⚠ dangerous
            </span>
          )}
        </div>
        <div className="flex gap-1.5">
          {pull.cds.map(cd => (
            <span key={cd} className="text-[10px] font-bold px-2 py-0.5 rounded"
              style={{ color: cdColors[cd] || 'var(--color-text-4)', background: `color-mix(in oklch, ${cdColors[cd] || 'var(--color-text-4)'} 8%, transparent)` }}>
              {cd}
            </span>
          ))}
        </div>
      </div>
      <div className="px-5 pb-3.5">
        <p className="text-[13px]" style={{ color: 'var(--color-text-2)', lineHeight: 1.7 }}>
          {pull.notes}
        </p>
      </div>
    </div>
  );
}
