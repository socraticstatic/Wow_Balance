import { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { useReveal } from '../hooks/useReveal';

// Pure AoE DPS: Elune's Chosen Raid build - maximum multi-target damage, zero utility tax.
// This is NOT the M+ build (which wastes points on Solar Beam CD, Ursol's, etc.)
// This is the build for someone who wants to be an AoE DPS god.
const IMPORT_STRING = 'CYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWoMbNjxMDwsMzMzMYYmZMzyMLmZGLjlZWGjBLYAwYZbmBjZbEYCAAAwiZmZmBbGGjBAgZGYA';

interface TalentRow {
  name: string;
  points: number;
  why: string;
  category: 'damage' | 'defensive' | 'mobility' | 'utility' | 'core' | 'aoe' | 'throughput' | 'cd';
}

const classTree: TalentRow[] = [
  { name: 'Starfire', points: 1, why: 'Baseline. Your Lunar builder.', category: 'core' },
  { name: 'Moonkin Form', points: 1, why: 'Your DPS form. Always active.', category: 'core' },
  { name: 'Sunfire', points: 1, why: 'Instant AoE DoT. Cast FIRST on every pull.', category: 'core' },
  { name: 'Starsurge', points: 1, why: 'ST spender. Only use on 1-2 targets.', category: 'core' },
  { name: 'Nurturing Instinct', points: 2, why: 'Passive DPS increase.', category: 'damage' },
  { name: 'Lycara\'s Teachings', points: 2, why: 'Passive DPS from shapeshifting buffs.', category: 'damage' },
  { name: 'Starlight Conduit', points: 1, why: 'Passive DPS increase.', category: 'damage' },
  { name: 'Circle of the Heavens', points: 1, why: '5% magical damage increase.', category: 'damage' },
  { name: 'Lore of the Grove', points: 1, why: 'Passive DPS increase.', category: 'damage' },
  { name: 'Thick Hide', points: 1, why: '4% damage reduction. Always take.', category: 'defensive' },
  { name: 'Improved Barkskin', points: 1, why: 'Stronger Barkskin.', category: 'defensive' },
  { name: 'Oakskin', points: 1, why: 'Barkskin reduces magic damage too.', category: 'defensive' },
  { name: 'Natural Recovery', points: 1, why: '4% increased healing received.', category: 'defensive' },
  { name: 'Well-Honed Instincts', points: 1, why: 'Auto heal at 40% HP. Life saver.', category: 'defensive' },
  { name: 'Frenzied Regeneration', points: 1, why: 'Enables Well-Honed Instincts.', category: 'defensive' },
  { name: 'Verdant Heart', points: 1, why: '20% more healing during Barkskin.', category: 'defensive' },
  { name: 'Aessina\'s Renewal', points: 1, why: 'Passive healing.', category: 'defensive' },
  { name: 'Feline Swiftness', points: 1, why: '15% passive movement speed.', category: 'mobility' },
  { name: 'Wild Charge', points: 1, why: 'Dash forward in Moonkin Form.', category: 'mobility' },
  { name: 'Astral Influence', points: 1, why: '5 yards extra range on everything.', category: 'mobility' },
  { name: 'Stampeding Roar', points: 1, why: 'Group sprint. Essential M+.', category: 'utility' },
  { name: 'Improved Stampeding Roar', points: 1, why: 'Better group sprint.', category: 'utility' },
  { name: 'Typhoon', points: 1, why: 'AoE knockback. Interrupt + kiting.', category: 'utility' },
  { name: 'Ursol\'s Vortex', points: 1, why: 'AoE slow. Keeps mobs in Starfall.', category: 'utility' },
  { name: 'Incapacitating Roar', points: 1, why: 'AoE CC. Stops Ascendant orbs.', category: 'utility' },
  { name: 'Light of the Sun', points: 1, why: 'Shorter Solar Beam CD. Huge for M+.', category: 'utility' },
  { name: 'Innervate', points: 1, why: 'Free healer mana. Flex slot.', category: 'utility' },
  { name: 'Soothe', points: 1, why: 'Enrage dispel. Required in some M+.', category: 'utility' },
];

const specTree: TalentRow[] = [
  { name: 'Eclipse', points: 1, why: 'Passive. Triggers automatically from Starfire/Wrath casts. Grants Lunar or Solar Eclipse.', category: 'core' },
  { name: 'Shooting Stars', points: 1, why: 'DoTs proc bonus damage + AP. Feeds entire AoE engine.', category: 'aoe' },
  { name: 'Solar Beam', points: 1, why: '8s AoE silence. Best interrupt in M+.', category: 'utility' },
  { name: 'Twin Moons', points: 1, why: 'Moonfire hits 2 targets. Free cleave.', category: 'aoe' },
  { name: 'Solstice', points: 1, why: 'Shooting Stars doubles during Eclipse. Massive with AoE DoTs.', category: 'aoe' },
  { name: 'Soul of the Forest', points: 1, why: 'Starfall generates 5 AP/tick. Makes Starfall AP-positive at 5+ targets.', category: 'core' },
  { name: 'Aetherial Kindling', points: 1, why: 'Extends DoT duration in Eclipse. Longer DoTs = more Shooting Stars.', category: 'aoe' },
  { name: 'Wild Surges', points: 1, why: 'Instant Starfire procs. Cast while moving without losing DPS.', category: 'throughput' },
  { name: 'Nature\'s Grace', points: 1, why: 'Haste on Eclipse activation. Faster casts.', category: 'throughput' },
  { name: 'Astral Smolder', points: 1, why: 'Crits apply a DoT. Feeds Ascendant Eclipses.', category: 'throughput' },
  { name: 'Starlord', points: 2, why: '3% Haste from spender stacks. Permanent uptime in AoE.', category: 'throughput' },
  { name: 'Umbral Embrace', points: 1, why: 'Bonus damage during Lunar Eclipse. You live in Lunar.', category: 'throughput' },
  { name: 'Cosmic Rapidity', points: 2, why: 'Shorter Eclipse CD. More Eclipse = more damage.', category: 'throughput' },
  { name: 'Balance of All Things', points: 2, why: '20% Crit at Eclipse start. Huge burst window.', category: 'throughput' },
  { name: 'Power of Goldrinn', points: 1, why: 'Bonus damage procs from Starsurge.', category: 'throughput' },
  { name: 'Waning Twilight', points: 1, why: '6% damage to targets with 3+ DoTs. Always active in AoE.', category: 'aoe' },
  { name: 'Celestial Alignment', points: 1, why: 'Prerequisite. Replaced by Incarnation below. Still costs 1 point.', category: 'cd' },
  { name: 'Incarnation: Chosen of Elune', points: 1, why: '3 min CD, 30s duration, +10% Haste. Your big window.', category: 'cd' },
  { name: 'Sunseeker Mushroom', points: 1, why: 'AoE damage tool.', category: 'aoe' },
  { name: 'Orbital Strike', points: 1, why: 'AoE burst from Incarnation/CA.', category: 'aoe' },
  { name: 'Touch the Cosmos', points: 1, why: 'Free spender procs. More Starfalls.', category: 'throughput' },
  { name: 'Rattle the Stars', points: 1, why: 'Starfall costs 5 less AP and deals 10% more.', category: 'aoe' },
  { name: 'Fury of Elune', points: 1, why: '1 min CD beam. AoE + massive AP gen. Core for Elune\'s Chosen.', category: 'cd' },
  { name: 'Radiant Moonlight', points: 1, why: 'Stronger Fury of Elune.', category: 'cd' },
  { name: 'Elune\'s Guidance', points: 1, why: 'Starfall costs 12 less AP. Smoother economy.', category: 'aoe' },
  { name: 'Harmony of the Heavens', points: 1, why: 'Eclipse generates bonus resources.', category: 'throughput' },
];

const heroTalents = [
  { name: 'Boundless Moonlight', type: 'Keystone', effect: 'Fury of Elune ends with AoE explosion. Full Moon calls 2 Minor Moons.' },
  { name: 'Moon Guardian', type: 'Auto', effect: 'Moonfire deals 10% more damage.' },
  { name: 'Glistening Fur', type: 'Auto', effect: 'Moonkin Form: -6% Arcane dmg taken, -3% other magic.' },
  { name: 'Lunar Amplification', type: 'Auto', effect: 'Non-Arcane abilities buff next Arcane by 3%, stacks 3x.' },
  { name: 'Atmospheric Exposure', type: 'Auto', effect: 'Fury of Elune targets take 4% more damage from you for 6s.' },
  { name: 'Elune\'s Grace', type: 'PICK THIS', effect: 'Wild Charge CD reduced 3s. Better mobility between packs.' },
  { name: 'Stellar Command', type: 'Auto', effect: 'Fury of Elune damage +15%.' },
  { name: 'Lunar Calling', type: 'Auto', effect: 'Starfire +40% to primary. No longer triggers Solar Eclipse. You stay Lunar.' },
  { name: 'The Light of Elune', type: 'PICK THIS', effect: 'Moonfire damage can proc a free 3s Fury of Elune.' },
  { name: 'Arcane Affinity', type: 'Auto', effect: 'All Arcane damage +3%.' },
  { name: 'Lunation', type: 'Auto', effect: 'Each Starfire reduces Fury CD by 2s, Full Moon CD by 1s.' },
  { name: 'The Eternal Moon', type: 'Capstone', effect: 'Fury flash generates 6 AP + 50% more damage. Moons call Minor Moons.' },
];

const catColors: Record<string, string> = {
  core: 'oklch(97% 0.003 60)',
  damage: 'oklch(80% 0.18 80)',
  defensive: 'oklch(68% 0.18 155)',
  mobility: 'oklch(72% 0.14 240)',
  utility: 'oklch(72% 0.18 270)',
  aoe: 'oklch(72% 0.2 270)',
  throughput: 'oklch(80% 0.18 80)',
  cd: 'oklch(88% 0.12 65)',
};

export default function TalentBuild() {
  const [copied, setCopied] = useState(false);
  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();
  const r4 = useReveal();

  const copyImport = () => {
    navigator.clipboard.writeText(IMPORT_STRING);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="px-6 sm:px-10 py-32 max-w-6xl mx-auto relative z-10">
      <div ref={r1} className="reveal">
        <SectionHeading
          title="Talent Build"
          sub="The exact AoE M+ build. Every point. Paste the import string or follow the guide below."
          accent="solar"
        />
      </div>

      {/* Import string - the fast path */}
      <div ref={r2} className="reveal mb-20">
        <div className="p-6 rounded-lg gilt-border" style={{ background: 'oklch(10% 0.02 60 / 0.3)' }}>
          <div className="flex items-center justify-between mb-3">
            <div className="text-base font-bold" style={{ color: 'oklch(80% 0.18 80)' }}>
              Import String - Paste into WoW
            </div>
            <button
              onClick={copyImport}
              className="px-4 py-2 rounded-lg font-bold text-sm cursor-pointer transition-all"
              style={{
                background: copied ? 'oklch(68% 0.18 155 / 0.2)' : 'oklch(80% 0.18 80 / 0.15)',
                color: copied ? 'oklch(68% 0.18 155)' : 'oklch(80% 0.18 80)',
                border: `1px solid ${copied ? 'oklch(68% 0.18 155 / 0.3)' : 'oklch(80% 0.18 80 / 0.3)'}`,
              }}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <code className="block text-sm font-mono p-3 rounded-lg break-all" style={{
            background: 'oklch(8% 0.01 45)',
            color: 'oklch(80% 0.18 80)',
            border: '1px solid oklch(16% 0.012 45)',
            lineHeight: 1.6,
          }}>
            {IMPORT_STRING}
          </code>
          <p className="text-sm mt-3" style={{ color: 'oklch(82% 0.005 55)' }}>
            Open Talents in WoW. Click the import icon (top right). Paste. Click "Apply". All 3 trees filled.
          </p>
        </div>
      </div>

      {/* Hero spec callout */}
      <div className="reveal mb-16">
        <div className="p-5 rounded-lg glass-lunar">
          <div className="text-base font-bold mb-2" style={{ color: 'oklch(72% 0.18 270)' }}>
            Hero Spec: Elune's Chosen
          </div>
          <p className="text-sm mb-4" style={{ color: 'oklch(90% 0.005 55)' }}>
            79% of top M+ Balance Druids run Elune's Chosen. The key mechanic: Lunar Calling makes Starfire your ONLY builder (no more Solar Eclipse). You permanently stay in Lunar Eclipse. Simpler rotation, stronger AoE.
          </p>
          <div className="space-y-2">
            {heroTalents.map(t => (
              <div key={t.name} className="flex items-start gap-3 text-sm">
                <span className="shrink-0 text-sm font-bold" style={{
                  color: t.type === 'PICK THIS' ? 'oklch(80% 0.18 80)' : t.type === 'Keystone' || t.type === 'Capstone' ? 'oklch(72% 0.18 270)' : 'oklch(72% 0.005 55)',
                  minWidth: '70px',
                }}>
                  {t.type === 'PICK THIS' ? '\u2605 PICK' : t.type}
                </span>
                <div>
                  <span className="font-bold" style={{ color: t.type === 'PICK THIS' ? 'oklch(80% 0.18 80)' : 'oklch(92% 0.004 60)' }}>{t.name}</span>
                  <span style={{ color: 'oklch(85% 0.004 55)' }}> - {t.effect}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Class tree */}
      <div ref={r3} className="reveal mb-16">
        <div className="text-[11px] uppercase font-bold mb-5" style={{ color: 'oklch(68% 0.18 155)', letterSpacing: '0.12em' }}>
          Druid Class Tree (31 Points)
        </div>
        <TreeTable talents={classTree} />
      </div>

      {/* Spec tree */}
      <div ref={r4} className="reveal">
        <div className="text-[11px] uppercase font-bold mb-5" style={{ color: 'oklch(72% 0.18 270)', letterSpacing: '0.12em' }}>
          Balance Spec Tree (30 Points)
        </div>
        <TreeTable talents={specTree} />
      </div>
    </section>
  );
}

function TreeTable({ talents }: { talents: TalentRow[] }) {
  return (
    <div className="rounded-lg overflow-hidden glass">
      <div className="grid grid-cols-12 gap-2 px-5 py-3 text-[11px] uppercase font-bold"
        style={{ color: 'oklch(78% 0.005 55)', letterSpacing: '0.1em', borderBottom: '1px solid oklch(16% 0.012 45)' }}>
        <div className="col-span-3">Talent</div>
        <div className="col-span-1 text-center">Pts</div>
        <div className="col-span-1">Type</div>
        <div className="col-span-7">Why</div>
      </div>
      {talents.map((t, i) => (
        <div key={t.name}
          className="grid grid-cols-12 gap-2 px-5 py-2.5 items-center text-sm row-hover"
          style={{ borderTop: i > 0 ? '1px solid oklch(12% 0.01 45)' : 'none' }}
        >
          <div className="col-span-3 font-bold" style={{ color: catColors[t.category] }}>
            {t.name}
          </div>
          <div className="col-span-1 text-center font-mono font-bold" style={{ color: 'oklch(90% 0.005 55)', fontVariantNumeric: 'tabular-nums' }}>
            {t.points}
          </div>
          <div className="col-span-1">
            <span className="text-[11px] font-bold" style={{ color: catColors[t.category] }}>
              {t.category === 'core' ? 'Core' : t.category === 'aoe' ? 'AoE' : t.category === 'cd' ? 'CD' : t.category.charAt(0).toUpperCase() + t.category.slice(1)}
            </span>
          </div>
          <div className="col-span-7" style={{ color: 'oklch(88% 0.004 55)' }}>
            {t.why}
          </div>
        </div>
      ))}
      <div className="px-5 py-3 text-sm font-bold" style={{ color: 'oklch(80% 0.18 80)', borderTop: '1px solid oklch(16% 0.012 45)' }}>
        Total: {talents.reduce((s, t) => s + t.points, 0)} points
      </div>
    </div>
  );
}
