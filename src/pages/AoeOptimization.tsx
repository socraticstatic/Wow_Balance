import { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import SpellIcon from '../components/SpellIcon';
import { useReveal } from '../hooks/useReveal';
import { builds, bisGear } from '../data';

// The AoE / M+ build
const aoeBuild = builds.find(b => b.id === 'mythicplus-elune') || builds.find(b => b.id === 'raid-aoe-elune')!;

// Talent tree organized by function for visualization
const talentTree = {
  core: {
    label: 'Core (Always Take)',
    color: 'var(--color-text-1)',
    talents: [
      { name: 'Eclipse', desc: 'Passive. Triggers from casting builders. With Lunar Calling, always Lunar.' },
      { name: 'Total Eclipse', desc: '2 charges + chance to proc opposite Eclipse.' },
      { name: 'Soul of the Forest', desc: 'Starsurge buffs next builder 50%. Starfall generates AP/tick.' },
      { name: 'Starlord', desc: '1% Haste per spender, stacks to 3. 20s duration.' },
      { name: 'Shooting Stars', desc: 'DoTs proc bonus damage + AP. Feeds tier set.' },
    ],
  },
  aoe: {
    label: 'AoE Focused',
    color: 'var(--color-lunar)',
    talents: [
      { name: 'Starweaver', desc: 'After 3 Starsurges: free Starfall. After 3 Starfalls: free Starsurge.' },
      { name: 'Aetherial Kindling', desc: 'Cleave talent. Extra damage on nearby targets.' },
      { name: 'Solstice', desc: 'Shooting Stars proc rate doubled during Eclipse.' },
      { name: 'Orbit Breaker', desc: 'Full Moon every 25 Shooting Stars. Free damage.' },
      { name: 'Hail of Stars', desc: 'Shooting Stars proc Starfall ticks. Chain reaction.' },
    ],
  },
  hero: {
    label: 'Elune\'s Chosen',
    color: 'var(--color-nature)',
    talents: [
      { name: 'Lunar Calling', desc: 'All builders become Starfire. Always Lunar Eclipse. Core identity.' },
      { name: 'Lunation', desc: 'Every builder reduces Fury of Elune CD. More casts = more FoE.' },
      { name: 'Atmospheric Exposure', desc: '4% damage amp on Fury of Elune targets. Permanent on AoE.' },
      { name: 'Fury of Elune', desc: '1-min CD beam. AoE damage + 40 AP. Use on cooldown.' },
      { name: 'Boundless Moonlight', desc: 'Moonfire bounces. More DoTs = more Shooting Stars.' },
    ],
  },
  apex: {
    label: 'Apex: Ascendant Eclipses',
    color: 'var(--color-solar)',
    talents: [
      { name: 'Rank 1', desc: 'Eclipse buffs next 3 spenders +20% damage. Instant next filler.' },
      { name: 'Rank 2', desc: 'Spell crits deal 24% of damage as 6s DoT. Crit = value.' },
      { name: 'Rank 3', desc: 'Eclipse fires Lunar bolts (AoE splash). More targets = more damage.' },
      { name: 'Rank 4', desc: 'CA/Incarnation fires BOTH bolts. Guaranteed crits. Cascade.' },
    ],
  },
};

// AoE stat priority
const aoeStats = [
  { stat: 'Intellect', weight: 100, note: 'Always #1. Higher ilvl = more Int.' },
  { stat: 'Haste', weight: 88, note: 'More casts = more Starfire AoE hits = more Shooting Stars = more FoE reductions.' },
  { stat: 'Mastery', weight: 82, note: 'Flat damage increase to all Nature/Arcane. Always strong.' },
  { stat: 'Critical Strike', weight: 75, note: 'Apex Rank 2 DoTs. Each Starfire crit splashes DoT to all targets hit.' },
  { stat: 'Versatility', weight: 45, note: 'Flat damage + survivability. Lowest priority for AoE.' },
];

export default function AoeOptimization() {
  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();
  const r4 = useReveal();
  const r5 = useReveal();

  return (
    <section className="px-6 sm:px-10 py-28 max-w-6xl mx-auto">
      <div ref={r1} className="reveal">
        <SectionHeading
          title="AoE DPS Optimization"
          sub="Everything you need to maximize multi-target damage. Elune's Chosen + Starfire spam + uncapped Starfall."
          accent="lunar"
        />
      </div>

      {/* ── Talent Tree Visualization ── */}
      <div ref={r2} className="reveal mb-20">
        <div className="text-[11px] uppercase font-bold mb-6" style={{ color: 'var(--color-lunar)', letterSpacing: '0.12em' }}>
          Talent Build: {aoeBuild.name}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {Object.values(talentTree).map(group => (
            <TalentGroup key={group.label} group={group} />
          ))}
        </div>

        {/* Stat priority note */}
        <p className="mt-6 text-[14px] max-w-xl" style={{ color: 'var(--color-text-muted)' }}>
          {aoeBuild.notes}
        </p>
      </div>

      {/* ── AoE Stat Priority ── */}
      <div ref={r3} className="reveal mb-20">
        <div className="text-[11px] uppercase font-bold mb-6" style={{ color: 'var(--color-solar)', letterSpacing: '0.12em' }}>
          AoE Stat Priority
        </div>

        <div className="max-w-xl space-y-4">
          {aoeStats.map((s, i) => (
            <div key={s.stat}>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-sm font-bold" style={{ color: i === 0 ? 'var(--color-text-1)' : 'var(--color-text-2)' }}>
                  {s.stat}
                </span>
                <span className="font-mono text-[14px] font-bold" style={{
                  color: i === 0 ? 'var(--color-solar)' : 'var(--color-text-1)',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {s.weight}
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden mb-1.5" style={{ background: 'var(--color-surface-1)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${s.weight}%`,
                    background: i === 0 ? 'var(--color-solar)' : `oklch(${55 + (4 - i) * 5}% 0.1 270)`,
                  }}
                />
              </div>
              <p className="text-[13px]" style={{ color: 'var(--color-text-1)' }}>{s.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── AoE Rotation ── */}
      <div ref={r4} className="reveal mb-20">
        <div className="text-[11px] uppercase font-bold mb-6" style={{ color: 'var(--color-lunar)', letterSpacing: '0.12em' }}>
          AoE Rotation
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Opener */}
          <div className="p-6 rounded-lg glass-lunar">
            <h4 className="text-sm font-bold mb-4" style={{ color: 'var(--color-lunar)' }}>Pull Sequence</h4>
            <ol className="space-y-2">
              {aoeBuild.rotation.opener.map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[15px]" style={{ color: 'var(--color-text-3)', lineHeight: 1.6 }}>
                  <span className="w-4 h-4 rounded-full text-[11px] flex items-center justify-center shrink-0 mt-0.5 font-mono font-bold"
                    style={{ color: 'var(--color-lunar)', background: 'color-mix(in oklch, var(--color-lunar) 8%, transparent)' }}>
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Priority */}
          <div className="p-6 rounded-lg glass-nature">
            <h4 className="text-sm font-bold mb-4" style={{ color: 'var(--color-nature)' }}>Sustained Priority</h4>
            <ul className="space-y-2">
              {aoeBuild.rotation.priority.map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-[15px]" style={{ color: 'var(--color-text-3)', lineHeight: 1.6 }}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ background: 'color-mix(in oklch, var(--color-nature) 50%, transparent)' }} />
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Target count thresholds */}
        <div className="mt-6 p-5 rounded-lg max-w-xl glass">
          <div className="text-[11px] uppercase font-bold mb-3" style={{ color: 'var(--color-text-1)', letterSpacing: '0.12em' }}>
            Target Count Rules
          </div>
          <div className="space-y-1.5 text-[15px]" style={{ color: 'var(--color-text-3)' }}>
            <p><strong style={{ color: 'var(--color-text-2)' }}>1 target:</strong> Starsurge only. Starfire filler (Lunar Calling = no Wrath).</p>
            <p><strong style={{ color: 'var(--color-text-2)' }}>2+ targets:</strong> Starfall &gt; Starsurge. Starfire filler (hits all nearby).</p>
            <p><strong style={{ color: 'var(--color-text-2)' }}>3+ targets:</strong> Moonfire all. Sunfire. Starfall on cooldown. Starfire spam.</p>
            <p><strong style={{ color: 'var(--color-text-2)' }}>5+ targets:</strong> Never Starsurge. Starfall + Starfire only. Fury of Elune on CD.</p>
          </div>
        </div>
      </div>

      {/* ── AoE Damage Scaling Calculator ── */}
      <div className="reveal mb-20">
        <div className="text-[11px] uppercase font-bold mb-6" style={{ color: 'var(--color-solar)', letterSpacing: '0.12em' }}>
          AoE Damage Scaling
        </div>
        <AoeDamageCalculator />
      </div>

      {/* ── AoE Gear & Enhancements ── */}
      <div ref={r5} className="reveal">
        <div className="text-[11px] uppercase font-bold mb-6" style={{ color: 'var(--color-solar)', letterSpacing: '0.12em' }}>
          AoE Gear & Enhancements
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Key gear differences for AoE */}
          <div>
            <h4 className="text-sm font-bold mb-4" style={{ color: 'var(--color-text-1)' }}>Gear Notes</h4>
            <ul className="space-y-3 text-[15px]" style={{ color: 'var(--color-text-1)', lineHeight: 1.7 }}>
              <li className="pl-4" style={{ borderLeft: '2px solid var(--color-solar)' }}>
                <strong style={{ color: 'var(--color-solar)' }}>Tier set is critical.</strong> 4pc Luminous Bloom procs exploding Shooting Stars on Starfall casts. More targets = more procs = more damage.
              </li>
              <li className="pl-4" style={{ borderLeft: '2px solid var(--color-lunar)' }}>
                <strong style={{ color: 'var(--color-lunar)' }}>Trinkets:</strong> {bisGear.trinkets.bestCombination}. On-use trinket aligns with Incarnation burst.
              </li>
              <li className="pl-4" style={{ borderLeft: '2px solid var(--color-nature)' }}>
                <strong style={{ color: 'var(--color-nature)' }}>Weapon:</strong> {bisGear.weapon.best}. If no raid weapon, craft {bisGear.weapon.craftedAlternative}.
              </li>
              <li className="pl-4" style={{ borderLeft: '2px solid var(--color-text-1)' }}>
                <strong style={{ color: 'var(--color-text-2)' }}>Embellishments:</strong> {bisGear.embellishments.first.name} (weapon) + {bisGear.embellishments.second.name} (wrist/waist).
              </li>
            </ul>
          </div>

          {/* Enchants & Gems for AoE */}
          <div>
            <h4 className="text-sm font-bold mb-4" style={{ color: 'var(--color-text-1)' }}>Enchants & Gems</h4>
            <div className="space-y-2">
              <EnchantRow slot="Head" value="Empowered Hex of Leeching" note="Self-sustain for M+ pulls" />
              <EnchantRow slot="Back" value="Graceful Avoidance" note="Survivability" />
              <EnchantRow slot="Chest" value="Crystalline Radiance" note="Intellect" />
              <EnchantRow slot="Wrist" value="Devotion of Haste" note="Haste priority for AoE" />
              <EnchantRow slot="Legs" value="Stormbound Armor Kit" note="Int + Stamina" />
              <EnchantRow slot="Boots" value="Scout's March" note="Movement speed for M+" />
              <EnchantRow slot="Rings" value="Radiant Haste" note="Haste on both rings for AoE" />
              <EnchantRow slot="Weapon" value="Thalassian Phoenix Oil" note="Reapply hourly" />
            </div>

            <div className="mt-6">
              <div className="text-[11px] uppercase font-bold mb-3" style={{ color: 'var(--color-text-1)', letterSpacing: '0.12em' }}>
                Gems
              </div>
              <div className="space-y-1.5 text-[15px]" style={{ color: 'var(--color-text-1)' }}>
                <p><strong style={{ color: 'var(--color-lunar)' }}>1x</strong> Indecipherable Eversong Diamond (unique)</p>
                <p><strong style={{ color: 'var(--color-text-3)' }}>All others:</strong> Haste gems (AoE priority) or sim yourself</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-[11px] uppercase font-bold mb-3" style={{ color: 'var(--color-text-1)', letterSpacing: '0.12em' }}>
                Consumables
              </div>
              <div className="space-y-1.5 text-[15px]" style={{ color: 'var(--color-text-1)' }}>
                <p><strong style={{ color: 'var(--color-text-2)' }}>Flask:</strong> Flask of the Magisters</p>
                <p><strong style={{ color: 'var(--color-text-2)' }}>Food:</strong> Harandar Celebration (feast) or Royal Roast</p>
                <p><strong style={{ color: 'var(--color-text-2)' }}>Potion:</strong> Potion of Recklessness (on big pulls)</p>
                <p><strong style={{ color: 'var(--color-text-2)' }}>Rune:</strong> Void-Touched Augment Rune</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TalentGroup({ group }: { group: { label: string; color: string; talents: Array<{ name: string; desc: string }> } }) {
  return (
    <div className="p-5 rounded-lg glass card-hover">
      <div className="text-[12px] uppercase font-bold mb-4" style={{ color: group.color, letterSpacing: '0.1em' }}>
        {group.label}
      </div>
      <div className="space-y-3">
        {group.talents.map(t => (
          <div key={t.name} className="flex items-start gap-3">
            <SpellIcon name={t.name} size="small" className="shrink-0 mt-0.5 rounded" />
            <div>
              <span className="text-[15px] font-bold" style={{ color: 'var(--color-text-1)' }}>{t.name}</span>
              <p className="text-[13px] mt-0.5" style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{t.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Interactive AoE damage scaling calculator */
function AoeDamageCalculator() {
  const [targets, setTargets] = useState(5);

  // Approximate relative DPS multipliers for Balance Druid AoE
  // Based on: Starfall hits all, Starfire cleaves sqrt-scaled, Shooting Stars scale linearly
  const starfallDmg = targets * 1.0;           // Linear scaling
  const starfireDmg = Math.sqrt(targets) * 1.2; // Sqrt scaling (uncapped but diminishing)
  const shootingStars = targets * 0.6;           // Linear (more DoTs = more procs)
  const furyOfElune = Math.min(targets, 8) * 0.8; // Soft cap at 8
  const moonfireDots = targets * 0.35;           // Each target has a dot
  const apexBolts = Math.min(targets, 6) * 0.5;  // Splash capped
  const totalRelative = starfallDmg + starfireDmg + shootingStars + furyOfElune + moonfireDots + apexBolts;
  const stMultiplier = (totalRelative / (1.0 + 1.2 + 0.6 + 0.8 + 0.35 + 0.5)).toFixed(1);

  const bars = [
    { label: 'Starfall', value: starfallDmg, max: 20, color: 'var(--color-lunar)' },
    { label: 'Starfire', value: starfireDmg, max: 6, color: 'var(--color-lunar)' },
    { label: 'Shooting Stars', value: shootingStars, max: 12, color: 'var(--color-solar)' },
    { label: 'Fury of Elune', value: furyOfElune, max: 8, color: 'var(--color-nature)' },
    { label: 'Moonfire DoTs', value: moonfireDots, max: 7, color: 'var(--color-gold-dim)' },
    { label: 'Apex Bolts', value: apexBolts, max: 4, color: 'var(--color-quality-apex)' },
  ];

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-4 mb-6">
        <label className="text-[15px] font-semibold" style={{ color: 'var(--color-text-1)' }}>
          Targets:
        </label>
        <input
          type="range"
          min={1}
          max={20}
          value={targets}
          onChange={e => setTargets(Number(e.target.value))}
          className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, var(--color-solar) ${(targets / 20) * 100}%, var(--color-surface-2) ${(targets / 20) * 100}%)` }}
        />
        <span className="font-mono text-lg font-bold w-8 text-right" style={{ color: 'var(--color-solar)', fontVariantNumeric: 'tabular-nums' }}>
          {targets}
        </span>
      </div>

      <div className="space-y-3 mb-6">
        {bars.map(b => (
          <div key={b.label}>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-[14px] font-medium" style={{ color: 'var(--color-text-1)' }}>{b.label}</span>
              <span className="font-mono text-[13px]" style={{ color: b.color, fontVariantNumeric: 'tabular-nums' }}>
                {b.value.toFixed(1)}x
              </span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-1)' }}>
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min((b.value / b.max) * 100, 100)}%`, background: b.color }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-lg glass-solar">
        <div className="flex items-baseline justify-between">
          <span className="text-[15px] font-bold" style={{ color: 'var(--color-text-1)' }}>
            Relative DPS vs Single Target
          </span>
          <span className="font-mono text-xl font-bold" style={{ color: 'var(--color-solar)', fontVariantNumeric: 'tabular-nums' }}>
            {stMultiplier}x
          </span>
        </div>
        <p className="text-[13px] mt-1" style={{ color: 'var(--color-text-muted)' }}>
          {targets === 1 ? 'Single target baseline' :
           targets <= 3 ? 'Starfall becomes efficient. Starfire cleaves worth it.' :
           targets <= 6 ? 'Sweet spot for Balance. All abilities scale well.' :
           targets <= 10 ? 'Massive AoE. Shooting Stars chain-proccing. Starfall dominates.' :
           'Absolute carnage. Starfall + Starfire spam. Never press Starsurge.'}
        </p>
      </div>
    </div>
  );
}

function EnchantRow({ slot, value, note }: { slot: string; value: string; note: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5" style={{ borderBottom: '1px solid var(--color-surface-1)' }}>
      <div className="flex items-baseline gap-2">
        <span className="text-[14px] font-medium w-14" style={{ color: 'var(--color-text-1)' }}>{slot}</span>
        <span className="text-[15px] font-semibold" style={{ color: 'var(--color-nature)' }}>{value}</span>
      </div>
      <span className="text-[12px]" style={{ color: 'var(--color-text-faint)' }}>{note}</span>
    </div>
  );
}
