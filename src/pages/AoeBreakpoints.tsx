import { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { useReveal } from '../hooks/useReveal';
import { parseAnalysis } from '../data';

/**
 * AoE Breakpoints - The math behind multi-target destruction.
 * Target-count calculator, AP economy, Starfall overlap windows, live parse data.
 */

// Damage constants (approximate, scaled to current patch)
const STARSURGE_BASE = 180000;
const STARSURGE_COST = 30;
const STARFALL_TICK = 18000;
const STARFALL_TICKS = 8;
const STARFALL_COST = 50;
const SOTF_AP_PER_TICK = 2; // Soul of the Forest AP refund per tick per target

function calcDpap(targets: number) {
  const starsurgeDpap = STARSURGE_BASE / STARSURGE_COST;
  const starfallTotal = STARFALL_TICK * STARFALL_TICKS * targets;
  const starfallDpap = starfallTotal / STARFALL_COST;
  const sotfRefund = SOTF_AP_PER_TICK * STARFALL_TICKS * targets;
  const effectiveCost = Math.max(STARFALL_COST - sotfRefund, 0);
  const starfallEffectiveDpap = effectiveCost > 0 ? starfallTotal / effectiveCost : Infinity;

  return {
    targets,
    starsurgeDpap: Math.round(starsurgeDpap),
    starfallDpap: Math.round(starfallDpap),
    starfallEffectiveDpap: effectiveCost > 0 ? Math.round(starfallEffectiveDpap) : 'FREE',
    sotfRefund,
    effectiveCost: Math.max(effectiveCost, 0),
    starfallWins: starfallDpap > starsurgeDpap,
    apPositive: sotfRefund >= STARFALL_COST,
  };
}

const parseEntries = Object.entries(parseAnalysis).map(([name, data]) => ({
  name,
  ...data,
}));

export default function AoeBreakpoints() {
  const [targetCount, setTargetCount] = useState(5);
  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();

  const breakpoints = Array.from({ length: 10 }, (_, i) => calcDpap(i + 1));
  const current = calcDpap(targetCount);

  return (
    <section className="px-6 sm:px-10 py-32 max-w-6xl mx-auto relative z-10">
      <div ref={r1} className="reveal">
        <SectionHeading
          title="AoE Breakpoints"
          sub="The math behind multi-target destruction. When Starfall beats Starsurge, AP economy, and what the rank 1 players actually do."
          accent="lunar"
        />
      </div>

      {/* Interactive target calculator */}
      <div ref={r2} className="reveal mb-20">
        <div className="text-[11px] uppercase font-bold mb-5" style={{ color: 'oklch(72% 0.18 270)', letterSpacing: '0.12em' }}>
          Target Count Calculator
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-8">
          {/* Slider + result */}
          <div>
            <div className="flex items-center gap-6 mb-6">
              <input
                type="range" min={1} max={10} value={targetCount}
                onChange={e => setTargetCount(Number(e.target.value))}
                className="flex-1 accent-[oklch(72%_0.18_270)]"
                style={{ height: 6 }}
              />
              <div className="text-4xl font-bold font-mono" style={{ color: 'oklch(95% 0.005 60)', fontVariantNumeric: 'tabular-nums', minWidth: '3ch', textAlign: 'right' }}>
                {targetCount}
              </div>
            </div>

            <div className="p-5 rounded-lg glass mb-4">
              <div className="text-lg font-bold mb-1" style={{
                color: current.starfallWins ? 'oklch(72% 0.18 270)' : 'oklch(80% 0.18 80)',
              }}>
                {current.starfallWins ? 'STARFALL' : 'STARSURGE'} wins at {targetCount} target{targetCount > 1 ? 's' : ''}
              </div>
              <p className="text-sm" style={{ color: 'oklch(90% 0.005 55)' }}>
                {current.starfallWins
                  ? current.apPositive
                    ? `Starfall is AP-POSITIVE here. You spend 50 AP but Soul of the Forest refunds ${current.sotfRefund} AP. It costs you nothing.`
                    : `Starfall deals ${current.starfallDpap.toLocaleString()} damage per AP vs Starsurge's ${current.starsurgeDpap.toLocaleString()}. ${Math.round((current.starfallDpap / current.starsurgeDpap - 1) * 100)}% more efficient.`
                  : `Starsurge deals ${current.starsurgeDpap.toLocaleString()} damage per AP vs Starfall's ${current.starfallDpap.toLocaleString()}. Stay single-target.`
                }
              </p>
            </div>

            {current.apPositive && (
              <div className="p-4 rounded-lg gilt-border" style={{ background: 'oklch(12% 0.02 285 / 0.3)' }}>
                <div className="text-sm font-bold mb-1" style={{ color: 'oklch(72% 0.18 270)' }}>
                  AP-Positive Loop Active
                </div>
                <p className="text-sm" style={{ color: 'oklch(90% 0.005 55)' }}>
                  At {targetCount} targets, SotF refunds {current.sotfRefund} AP per Starfall (cost: 50).
                  You GAIN {current.sotfRefund - STARFALL_COST} AP per cast. Spam Starfall. Your AP bar will never empty.
                </p>
              </div>
            )}
          </div>

          {/* Breakpoint table */}
          <div className="rounded-lg overflow-hidden glass">
            <div className="grid grid-cols-4 gap-2 px-4 py-2.5 text-[11px] uppercase font-bold"
              style={{ color: 'oklch(82% 0.005 55)', letterSpacing: '0.1em', borderBottom: '1px solid oklch(16% 0.012 45)' }}>
              <div>#</div>
              <div>Starsurge</div>
              <div>Starfall</div>
              <div>Winner</div>
            </div>
            {breakpoints.map(bp => (
              <div key={bp.targets}
                className="grid grid-cols-4 gap-2 px-4 py-2 text-sm row-hover"
                style={{
                  background: bp.targets === targetCount ? 'oklch(16% 0.02 270 / 0.3)' : 'transparent',
                  borderLeft: bp.targets === targetCount ? '2px solid oklch(72% 0.18 270)' : '2px solid transparent',
                }}
              >
                <div className="font-mono font-bold" style={{
                  color: bp.apPositive ? 'oklch(72% 0.18 270)' : 'oklch(90% 0.005 55)',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {bp.targets}
                </div>
                <div className="font-mono" style={{ color: 'oklch(80% 0.18 80)', fontVariantNumeric: 'tabular-nums' }}>
                  {bp.starsurgeDpap.toLocaleString()}
                </div>
                <div className="font-mono" style={{ color: 'oklch(72% 0.18 270)', fontVariantNumeric: 'tabular-nums' }}>
                  {typeof bp.starfallDpap === 'number' ? bp.starfallDpap.toLocaleString() : bp.starfallDpap}
                </div>
                <div className="font-bold" style={{
                  color: bp.starfallWins ? 'oklch(72% 0.18 270)' : 'oklch(80% 0.18 80)',
                }}>
                  {bp.apPositive ? 'FREE' : bp.starfallWins ? 'Starfall' : 'Starsurge'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AP Economy */}
      <div ref={r3} className="reveal mb-20">
        <div className="text-[11px] uppercase font-bold mb-5" style={{ color: 'oklch(80% 0.18 80)', letterSpacing: '0.12em' }}>
          Astral Power Economy
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-lg glass">
            <div className="text-2xl font-bold font-mono mb-1" style={{ color: 'oklch(80% 0.18 80)', fontVariantNumeric: 'tabular-nums' }}>80+</div>
            <div className="text-sm font-bold mb-2" style={{ color: 'oklch(80% 0.18 80)' }}>Pool Before Starfall</div>
            <p className="text-sm" style={{ color: 'oklch(90% 0.005 55)', lineHeight: 1.7 }}>
              Never Starfall below 80 AP. You need buffer for the immediate follow-up cast and Starweaver procs.
            </p>
          </div>
          <div className="p-5 rounded-lg glass">
            <div className="text-2xl font-bold font-mono mb-1" style={{ color: 'oklch(72% 0.18 270)', fontVariantNumeric: 'tabular-nums' }}>100</div>
            <div className="text-sm font-bold mb-2" style={{ color: 'oklch(72% 0.18 270)' }}>Pool Before M+ Pulls</div>
            <p className="text-sm" style={{ color: 'oklch(90% 0.005 55)', lineHeight: 1.7 }}>
              Enter every pull at max AP. Sunfire (instant AoE) into Starfall immediately. The pull starts at maximum damage.
            </p>
          </div>
          <div className="p-5 rounded-lg glass-nature">
            <div className="text-2xl font-bold font-mono mb-1" style={{ color: 'oklch(52% 0.14 155)', fontVariantNumeric: 'tabular-nums' }}>0</div>
            <div className="text-sm font-bold mb-2" style={{ color: 'oklch(52% 0.14 155)' }}>AP Wasted = DPS Lost</div>
            <p className="text-sm" style={{ color: 'oklch(90% 0.005 55)', lineHeight: 1.7 }}>
              Capping at 100 AP while casting builders = wasted generation. In AoE this shouldn't happen since Starfall is always available.
            </p>
          </div>
        </div>

        {/* Pull sequence */}
        <div className="p-5 rounded-lg glass-lunar">
          <div className="text-sm font-bold mb-3" style={{ color: 'oklch(72% 0.18 270)' }}>
            Optimal AoE Pull Sequence
          </div>
          <ol className="space-y-2">
            {[
              'Pool to 100 AP before tank pulls',
              'Sunfire (instant, hits all targets, applies DoT)',
              'Starfall (50 AP spent, SotF refund begins)',
              'Moonfire priority targets that Sunfire missed',
              'Enter Lunar Eclipse (2 Starfire casts)',
              'Starfire spam (cleaves in Lunar Eclipse)',
              'Starfall again when AP allows (5+ targets = AP-positive)',
              'Fury of Elune on cooldown (massive AP generation)',
              'Repeat: Starfall > Starfire > Starfall > Starfire',
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'oklch(92% 0.004 270)' }}>
                <span className="w-5 h-5 rounded-full text-[12px] flex items-center justify-center shrink-0 mt-0.5 font-mono font-bold"
                  style={{ color: 'oklch(72% 0.18 270)', background: 'oklch(72% 0.18 270 / 0.1)' }}>
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Live parse data */}
      <div className="reveal mb-16">
        <div className="text-[11px] uppercase font-bold mb-5" style={{ color: 'oklch(80% 0.18 80)', letterSpacing: '0.12em' }}>
          Live Parse Data - Top Balance Druids (Mythic)
        </div>

        <div className="space-y-3">
          {parseEntries.filter(e => e.topParses?.length > 0).map(encounter => (
            <div key={encounter.name} className="rounded-lg overflow-hidden glass">
              <div className="px-5 py-3 flex items-center justify-between"
                style={{ borderBottom: '1px solid oklch(16% 0.012 45)' }}>
                <span className="font-display text-base font-bold" style={{ color: 'oklch(92% 0.008 60)', fontStyle: 'italic' }}>
                  {encounter.name}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-sm" style={{ color: 'oklch(82% 0.005 55)' }}>
                    Avg: <span className="font-mono font-bold" style={{ color: 'oklch(80% 0.18 80)', fontVariantNumeric: 'tabular-nums' }}>
                      {encounter.avgDps?.toLocaleString()}
                    </span>
                  </span>
                  <span className="text-sm" style={{ color: 'oklch(82% 0.005 55)' }}>
                    Max: <span className="font-mono font-bold" style={{ color: 'oklch(95% 0.005 60)', fontVariantNumeric: 'tabular-nums' }}>
                      {encounter.maxDps?.toLocaleString()}
                    </span>
                  </span>
                </div>
              </div>
              <div className="px-5 py-2.5 flex flex-wrap gap-3">
                {encounter.topParses?.slice(0, 5).map((p: any, i: number) => (
                  <div key={i} className="flex items-baseline gap-2 text-sm">
                    <span className="font-mono font-bold" style={{
                      color: i === 0 ? 'oklch(80% 0.18 80)' : 'oklch(90% 0.005 55)',
                      fontVariantNumeric: 'tabular-nums',
                    }}>
                      #{i + 1}
                    </span>
                    <span style={{ color: 'oklch(92% 0.004 270)' }}>{p.name}</span>
                    <span className="font-mono" style={{ color: 'oklch(82% 0.005 55)', fontVariantNumeric: 'tabular-nums' }}>
                      {Math.round(p.dps).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Starfall overlap guide */}
      <div className="reveal">
        <div className="text-[11px] uppercase font-bold mb-5" style={{ color: 'oklch(72% 0.18 270)', letterSpacing: '0.12em' }}>
          Starfall Overlap Windows
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { title: 'Incarnation / CA', desc: 'With 50% AP gen buff, cast Starfall every 4-5 GCDs. Stack overlapping Starfalls for massive AoE.', color: 'oklch(80% 0.18 80)' },
            { title: 'Fury of Elune', desc: 'Generates massive AP. Use Fury + Starfall spam for the single biggest AoE window in your kit.', color: 'oklch(72% 0.18 270)' },
            { title: 'Convoke the Spirits', desc: 'Convoke casts random Balance spells including Starfall. On 5+ targets, Convoke is devastating combined with manual Starfalls.', color: 'oklch(68% 0.18 155)' },
            { title: 'Two Starfalls on 6 Targets', desc: '1.73M total damage over 8 seconds. 216K DPS from Starfall alone. Plus DoTs, Shooting Stars, Orbit Breaker Full Moons.', color: 'oklch(95% 0.005 60)' },
          ].map(item => (
            <div key={item.title} className="p-5 rounded-lg glass card-hover">
              <div className="text-sm font-bold mb-2" style={{ color: item.color }}>{item.title}</div>
              <p className="text-sm" style={{ color: 'oklch(90% 0.005 55)', lineHeight: 1.7 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
