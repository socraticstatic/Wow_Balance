import SectionHeading from '../components/SectionHeading';
import SpellIcon from '../components/SpellIcon';
import { useReveal } from '../hooks/useReveal';

/**
 * ActionBars - Exact keybind layout and rotation sequences.
 * Tells you what goes on keys 1 through =, and the exact order to press them.
 */

interface KeyBind {
  key: string;
  spell: string;
  color: string;
  role: string;
  note: string;
}

// Main action bar: keys 1 through =
// Elune's Chosen M+ build - VERIFIED against Method, Maxroll, Icy Veins, Wowhead.
// Lunar Calling = no Solar Eclipse. Starfire only builder. Incarnation replaces CA.
// Force of Nature = Keeper of the Grove only. Sunseeker Mushroom = PASSIVE (not a button).
// Warrior of Elune was REMOVED in 12.0.0. Instant Starfire now comes from Ascendant Eclipses Rank 1.
const mainBar: KeyBind[] = [
  { key: '1', spell: 'Starfire', color: 'oklch(72% 0.18 270)', role: 'ONLY Builder', note: 'Your ONLY builder. Cleaves in Lunar. Reduces Fury CD by 2s each cast (Lunation). Spam this.' },
  { key: '2', spell: 'Starfall', color: 'oklch(72% 0.2 270)', role: 'AoE Spender', note: '50 AP. 3+ targets. ALWAYS keep active in AoE. Your #1 priority button.' },
  { key: '3', spell: 'Starsurge', color: 'oklch(85% 0.14 270)', role: 'ST Spender', note: '40 AP. 1-2 targets ONLY. Also use Starweaver procs (free Starsurge after 3 Starfalls).' },
  { key: '4', spell: 'Moonfire', color: 'oklch(72% 0.14 240)', role: 'DoT', note: 'Maintain on all targets. Each tick can proc free Fury of Elune (Light of Elune).' },
  { key: '5', spell: 'Sunfire', color: 'oklch(80% 0.16 70)', role: 'AoE DoT', note: 'Instant. Hits ALL nearby enemies. Cast FIRST on every pull. Procs Sunseeker Mushroom (passive).' },
  { key: '6', spell: 'Eclipse', color: 'oklch(88% 0.1 270)', role: 'Eclipse Toggle', note: 'ACTIVE BUTTON in Midnight. 32s CD, 2 charges. Press after Starfire to enter Lunar Eclipse.' },
  { key: '7', spell: 'Fury of Elune', color: 'oklch(72% 0.16 285)', role: 'AoE CD', note: '45s CD (reduced by Lunation to ~every pack). AoE beam + AP gen + 4% damage amp.' },
  { key: '8', spell: 'Incarnation', color: 'oklch(88% 0.12 65)', role: 'Major CD', note: '3 min CD, 30s, +10% Haste, +10% Arcane damage. Use on biggest pulls.' },
  { key: '9', spell: 'Solar Beam', color: 'oklch(80% 0.14 80)', role: 'Interrupt', note: '8s AoE silence. 1 min CD (reduced by Light of the Sun). Best interrupt in M+.' },
  { key: '0', spell: 'Ursol\'s Vortex', color: 'oklch(68% 0.14 270)', role: 'AoE Control', note: '1 min CD. AoE slow + pull. Keeps mobs grouped in Starfall radius.' },
  { key: '-', spell: 'Typhoon', color: 'oklch(65% 0.12 200)', role: 'Knockback', note: '25s CD. AoE knockback. Knock casters INTO Solar Beam zone. Environmental kills.' },
  { key: '=', spell: 'Wild Charge', color: 'oklch(60% 0.14 155)', role: 'Movement', note: '15s CD. Disengage in Moonkin Form. Your mobility between packs.' },
];

// Shift bar: defensives, utility, forms. Every spell here is baseline or from the talented build.
const shiftBar: KeyBind[] = [
  { key: 'S-1', spell: 'Barkskin', color: 'oklch(60% 0.14 155)', role: 'Defensive', note: '20% DR. 1 min CD. Use BEFORE big damage hits, not after.' },
  { key: 'S-2', spell: 'Bear Form', color: 'oklch(65% 0.1 45)', role: 'Oh Shit', note: 'Emergency. +25% HP, +220% armor. Well-Honed Instincts auto-heals at 40%.' },
  { key: 'S-3', spell: 'Renewal', color: 'oklch(68% 0.18 155)', role: 'Self Heal', note: '30% HP heal. 1.5 min CD. Stack with Barkskin for double save.' },
  { key: 'S-4', spell: 'Stampeding Roar', color: 'oklch(65% 0.1 45)', role: 'Group Sprint', note: '2 min CD. 60% speed for whole group. Essential M+ utility.' },
  { key: 'S-5', spell: 'Incapacitating Roar', color: 'oklch(72% 0.14 270)', role: 'AoE CC', note: '30s CD. AoE incapacitate. Stops Ascendant affix orbs.' },
  { key: 'S-6', spell: 'Innervate', color: 'oklch(72% 0.14 240)', role: 'Healer Buff', note: '3 min CD. Free healer mana for 12s. Give on hardest pulls.' },
  { key: 'S-7', spell: 'Remove Corruption', color: 'oklch(68% 0.18 155)', role: 'Dispel', note: '8s CD. Removes curses and poisons. Critical for Devour affix.' },
  { key: 'S-8', spell: 'Soothe', color: 'oklch(60% 0.12 200)', role: 'Enrage Dispel', note: '10s CD. Removes enrage effects. Required on specific M+ mobs.' },
  { key: 'S-9', spell: 'Rebirth', color: 'oklch(68% 0.18 155)', role: 'Battle Res', note: 'Combat rez. Most valuable raid utility a druid brings.' },
  { key: 'S-0', spell: 'Mark of the Wild', color: 'oklch(60% 0.14 155)', role: 'Buff', note: '+3% Versatility for group. Cast before every key. Keep up always.' },
  { key: 'S--', spell: 'Moonkin Form', color: 'oklch(72% 0.14 270)', role: 'Form', note: 'Your DPS form. Re-enter after Bear Form emergency.' },
  { key: 'S-=', spell: 'Heart of the Wild', color: 'oklch(60% 0.14 155)', role: 'Emergency CD', note: '2 min CD. In Bear Form: +30% max HP for 20s. Last resort survival.' },
];

// ── Rotation sequences ──

interface RotationStep {
  key: string;
  spell: string;
  condition?: string;
  critical?: boolean;
}

// With Elune's Chosen: Lunar Calling means you're ALWAYS in Lunar Eclipse.
// No Solar Eclipse. No Wrath. Starfire is your only builder.
// Verified Elune's Chosen rotation. Keys match the main bar above exactly.
const aoeOpener: RotationStep[] = [
  { key: '5', spell: 'Sunfire', condition: 'Instant AoE DoT. Hits ALL targets. Always first.', critical: true },
  { key: '4', spell: 'Moonfire', condition: 'Tab-target Moonfire priority targets. Procs Light of Elune (free Fury).' },
  { key: '6', spell: 'Eclipse', condition: 'Press after Starfire to enter Lunar Eclipse.' },
  { key: '8', spell: 'Incarnation', condition: 'If available (3 min CD). +10% Haste + 10% Arcane for 30s.', critical: true },
  { key: '7', spell: 'Fury of Elune', condition: 'Beam on pack. AP gen + 4% damage amp (Atmospheric Exposure).', critical: true },
  { key: '2', spell: 'Starfall', condition: 'Dump AP. First 3 spenders get +20% from Ascendant Eclipse.', critical: true },
  { key: '1', spell: 'Starfire', condition: 'First Starfire after Eclipse entry is INSTANT (Ascendant Eclipses Rank 1).', critical: true },
  { key: '1', spell: 'Starfire', condition: 'Cast-time Starfire. Cleaves all nearby. Reduces Fury CD by 1.5s.' },
  { key: '1', spell: 'Starfire', condition: 'Keep building AP for next Starfall.' },
  { key: '2', spell: 'Starfall', condition: 'AP refilled. Starfall again. Loop: 1 1 1 > 2 > 1 1 1 > 2.', critical: true },
];

const aoePriority: RotationStep[] = [
  { key: '2', spell: 'Starfall', condition: '50+ AP and 3+ targets. ALWAYS #1 priority. Never let it drop.', critical: true },
  { key: '5', spell: 'Sunfire', condition: 'Refresh if falling off. Instant cast, hits all targets.' },
  { key: '4', spell: 'Moonfire', condition: 'Refresh on targets. Each tick can proc free Fury of Elune.' },
  { key: '7', spell: 'Fury of Elune', condition: 'On cooldown (45s base, reduced by Lunation). 4% damage amp.' },
  { key: '1', spell: 'Starfire', condition: 'Your builder. Cleaves all nearby. Each cast reduces Fury CD by 1.5s (Lunation).', critical: true },
  { key: '3', spell: 'Starsurge', condition: 'ONLY on 1-2 targets or Starweaver proc. Never in AoE otherwise.' },
];

// ST opener - same keys, different priority. Starsurge replaces Starfall as spender.
const stOpener: RotationStep[] = [
  { key: '4', spell: 'Moonfire', condition: 'Apply DoT.' },
  { key: '5', spell: 'Sunfire', condition: 'Apply DoT.' },
  { key: '6', spell: 'Eclipse', condition: 'Enter Lunar Eclipse.' },
  { key: '8', spell: 'Incarnation', condition: 'If available (3 min CD).', critical: true },
  { key: '7', spell: 'Fury of Elune', condition: '4% damage amp on target.' },
  { key: '7', spell: 'Fury of Elune', condition: '6% damage amp on target (Atmospheric Exposure).' },
  { key: '3', spell: 'Starsurge', condition: 'Dump AP. First 3 spenders get +20% from Ascendant Eclipse.', critical: true },
  { key: '1', spell: 'Starfire', condition: 'Build AP. +100% to primary via Lunar Calling.' },
  { key: '3', spell: 'Starsurge', condition: 'Dump at 40+ AP.', critical: true },
  { key: '1', spell: 'Starfire', condition: 'Repeat: Starfire > Starsurge > Starfire > Starsurge.' },
];

export default function ActionBars() {
  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();
  const r4 = useReveal();

  return (
    <section className="px-6 sm:px-10 py-32 max-w-6xl mx-auto relative z-10">
      <div ref={r1} className="reveal">
        <SectionHeading
          title="Action Bars"
          sub="Exactly what goes on each key. No guessing. Press these buttons in this order."
          accent="solar"
        />
      </div>

      {/* Main bar: 1 through = */}
      <div ref={r2} className="reveal mb-16">
        <div className="text-[11px] uppercase font-bold mb-5" style={{ color: 'oklch(80% 0.18 80)', letterSpacing: '0.12em' }}>
          Main Bar (1 through =)
        </div>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 mb-4">
          {mainBar.map(kb => (
            <KeyCap key={kb.key} kb={kb} />
          ))}
        </div>
        <div className="space-y-1.5">
          {mainBar.map(kb => (
            <div key={kb.key} className="flex items-start gap-3 text-sm">
              <kbd className="shrink-0 w-7 h-7 flex items-center justify-center rounded font-mono font-bold text-[13px]"
                style={{ background: 'oklch(14% 0.012 45)', border: '1px solid oklch(22% 0.015 45)', color: kb.color }}>
                {kb.key}
              </kbd>
              <div>
                <span className="font-bold" style={{ color: kb.color }}>{kb.spell}</span>
                <span style={{ color: 'oklch(78% 0.005 55)' }}> - {kb.role}</span>
                <span style={{ color: 'oklch(90% 0.004 55)' }}> - {kb.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shift bar */}
      <div ref={r3} className="reveal mb-20">
        <div className="text-[11px] uppercase font-bold mb-5" style={{ color: 'oklch(72% 0.18 270)', letterSpacing: '0.12em' }}>
          Shift Bar (Shift + 1 through =)
        </div>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2 mb-4">
          {shiftBar.map(kb => (
            <KeyCap key={kb.key} kb={kb} shift />
          ))}
        </div>
        <div className="space-y-1.5">
          {shiftBar.map(kb => (
            <div key={kb.key} className="flex items-start gap-3 text-sm">
              <kbd className="shrink-0 px-1.5 h-7 flex items-center justify-center rounded font-mono font-bold text-[12px]"
                style={{ background: 'oklch(14% 0.012 45)', border: '1px solid oklch(22% 0.015 45)', color: kb.color }}>
                {kb.key}
              </kbd>
              <div>
                <span className="font-bold" style={{ color: kb.color }}>{kb.spell}</span>
                <span style={{ color: 'oklch(78% 0.005 55)' }}> - {kb.role}</span>
                <span style={{ color: 'oklch(90% 0.004 55)' }}> - {kb.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Rotation Sequences ── */}
      <div ref={r4} className="reveal">
        <div className="text-[11px] uppercase font-bold mb-8" style={{ color: 'oklch(80% 0.18 80)', letterSpacing: '0.12em' }}>
          Rotation Sequences - Press These Keys in Order
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* AoE Opener */}
          <div className="rounded-lg glass-lunar p-6">
            <h3 className="text-base font-bold mb-1" style={{ color: 'oklch(72% 0.18 270)' }}>
              AoE Opener (3+ Targets)
            </h3>
            <p className="text-sm mb-5" style={{ color: 'oklch(82% 0.005 55)' }}>
              Pool to 100 AP before the tank pulls. Then press:
            </p>
            <div className="space-y-2">
              {aoeOpener.map((step, i) => (
                <RotationRow key={i} step={step} index={i} />
              ))}
            </div>
          </div>

          {/* ST Opener */}
          <div className="rounded-lg glass-solar p-6">
            <h3 className="text-base font-bold mb-1" style={{ color: 'oklch(80% 0.18 80)' }}>
              Single Target Opener (1-2 Targets)
            </h3>
            <p className="text-sm mb-5" style={{ color: 'oklch(82% 0.005 55)' }}>
              Boss fights. Pool AP. Pre-cast Starfire 2 seconds before pull.
            </p>
            <div className="space-y-2">
              {stOpener.map((step, i) => (
                <RotationRow key={i} step={step} index={i} />
              ))}
            </div>
          </div>
        </div>

        {/* AoE Priority List */}
        <div className="rounded-lg glass p-6">
          <h3 className="text-base font-bold mb-1" style={{ color: 'oklch(95% 0.005 60)' }}>
            AoE Priority (Ongoing - What to Press Next)
          </h3>
          <p className="text-sm mb-5" style={{ color: 'oklch(82% 0.005 55)' }}>
            After the opener, follow this priority. #1 is always first. Only go to #2 if #1 isn't available.
          </p>
          <div className="space-y-2">
            {aoePriority.map((step, i) => (
              <RotationRow key={i} step={step} index={i} priority />
            ))}
          </div>
        </div>

        {/* Quick reference strip */}
        <div className="mt-12 p-5 rounded-lg gilt-border" style={{ background: 'oklch(10% 0.015 60 / 0.3)' }}>
          <div className="text-sm font-bold mb-3" style={{ color: 'oklch(80% 0.18 80)' }}>
            AoE Cheat Sheet - Tape This to Your Monitor
          </div>
          <div className="font-mono text-lg font-bold" style={{ color: 'oklch(90% 0.006 60)', lineHeight: 2.2 }}>
            <span style={{ color: 'oklch(80% 0.16 70)' }}>5</span>
            {' \u2192 '}
            <span style={{ color: 'oklch(72% 0.14 240)' }}>4</span>
            {' \u2192 '}
            <span style={{ color: 'oklch(88% 0.1 270)' }}>6</span>
            {' \u2192 '}
            <span style={{ color: 'oklch(88% 0.12 65)' }}>8</span>
            {' \u2192 '}
            <span style={{ color: 'oklch(72% 0.16 285)' }}>7</span>
            {' \u2192 '}
            <span style={{ color: 'oklch(72% 0.14 270)' }}>9</span>
            {' \u2192 '}
            <span style={{ color: 'oklch(72% 0.2 270)' }}>2</span>
            {' \u2192 '}
            <span style={{ color: 'oklch(72% 0.18 270)' }}>1 1 1</span>
            {' \u2192 '}
            <span style={{ color: 'oklch(72% 0.2 270)' }}>2</span>
            {' \u2192 '}
            <span style={{ color: 'oklch(72% 0.18 270)' }}>1 1 1</span>
            {' \u2192 '}
            <span style={{ color: 'oklch(72% 0.2 270)' }}>2</span>
            {' \u2192 repeat'}
          </div>
          <p className="text-[15px] mt-3" style={{ color: 'oklch(90% 0.004 55)' }}>
            Sunfire \u2192 Moonfire \u2192 Eclipse \u2192 Incarnation \u2192 Fury \u2192 Starfall \u2192 Starfire (instant) \u2192 Starfire \u2192 Starfall \u2192 loop
          </p>
          <p className="text-sm mt-2 font-bold" style={{ color: 'oklch(72% 0.18 270)' }}>
            No Wrath. No Force of Nature. No Convoke. Lunar Calling = Starfire only builder.
          </p>
        </div>
      </div>
    </section>
  );
}

function KeyCap({ kb, shift }: { kb: KeyBind; shift?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="w-full aspect-square rounded-lg flex flex-col items-center justify-center gap-0.5 card-hover"
        style={{
          background: 'oklch(12% 0.012 45)',
          border: `1px solid ${kb.color}30`,
          boxShadow: `0 2px 8px ${kb.color}10`,
        }}
      >
        <SpellIcon name={kb.spell} px={shift ? 18 : 22} />
        <span className="text-[10px] font-bold" style={{ color: kb.color }}>{shift ? kb.key.replace('S-', '') : kb.key}</span>
      </div>
      <span className="text-[10px] font-medium text-center leading-tight" style={{ color: 'oklch(78% 0.005 55)' }}>
        {kb.spell.split(' ')[0]}
      </span>
    </div>
  );
}

function RotationRow({ step, index, priority }: { step: RotationStep; index: number; priority?: boolean }) {
  const kb = [...mainBar, ...shiftBar].find(k => k.key === step.key || k.key === `S-${step.key}`);
  const color = kb?.color || 'oklch(90% 0.005 55)';

  return (
    <div className="flex items-center gap-3" style={{ opacity: step.critical ? 1 : 0.85 }}>
      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[12px] font-mono font-bold"
        style={{
          color: step.critical ? 'oklch(95% 0.005 60)' : 'oklch(82% 0.005 55)',
          background: step.critical ? `${color}20` : 'oklch(14% 0.012 45)',
          border: step.critical ? `1px solid ${color}40` : '1px solid oklch(18% 0.012 45)',
        }}>
        {priority ? `${index + 1}` : `${index + 1}`}
      </span>
      <kbd className="shrink-0 w-7 h-7 flex items-center justify-center rounded font-mono font-bold text-[14px]"
        style={{ background: 'oklch(14% 0.012 45)', border: `1px solid ${color}40`, color }}>
        {step.key}
      </kbd>
      <div className="flex-1 min-w-0">
        <span className="text-[15px] font-bold" style={{ color }}>{step.spell}</span>
        {step.condition && (
          <span className="text-[14px] ml-2" style={{ color: 'oklch(88% 0.004 55)' }}>
            {step.condition}
          </span>
        )}
      </div>
    </div>
  );
}
