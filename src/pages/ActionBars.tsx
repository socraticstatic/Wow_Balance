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
  { key: '1', spell: 'Starfire', color: 'var(--color-lunar)', role: 'ONLY Builder', note: 'Your ONLY builder. Cleaves in Lunar. Reduces Fury CD by 2s each cast (Lunation). Spam this.' },
  { key: '2', spell: 'Starfall', color: 'var(--color-lunar)', role: 'AoE Spender', note: '50 AP. 3+ targets. ALWAYS keep active in AoE. Your #1 priority button.' },
  { key: '3', spell: 'Starsurge', color: 'var(--color-lunar)', role: 'ST Spender', note: '40 AP. 1-2 targets ONLY. Also use Starweaver procs (free Starsurge after 3 Starfalls).' },
  { key: '4', spell: 'Moonfire', color: 'var(--color-lunar)', role: 'DoT', note: 'Maintain on all targets. Each tick can proc free Fury of Elune (Light of Elune).' },
  { key: '5', spell: 'Sunfire', color: 'var(--color-solar)', role: 'AoE DoT', note: 'Instant. Hits ALL nearby enemies. Cast FIRST on every pull. Procs Sunseeker Mushroom (passive).' },
  { key: '6', spell: 'Lunar Eclipse', color: 'var(--color-lunar)', role: 'Eclipse', note: 'ACTIVE button. 32s CD, 1 charge (2 with Improved Eclipse). Cast Starfire first, then press this.' },
  { key: '7', spell: 'Fury of Elune', color: 'var(--color-lunar)', role: 'AoE CD', note: '60s base (45s with Radiant Moonlight). Reduced by Lunation. 6% damage amp.' },
  { key: '8', spell: 'Incarnation', color: 'var(--color-gold-bright)', role: 'Major CD', note: '3 min CD, 30s, +10% Haste, +10% Crit. Use on biggest pulls.' },
  { key: '9', spell: 'Solar Beam', color: 'var(--color-solar)', role: 'Interrupt', note: '8s AoE silence. 1 min CD (reduced by Light of the Sun). Best interrupt in M+.' },
  { key: '0', spell: 'Ursol\'s Vortex', color: 'var(--color-lunar)', role: 'AoE Control', note: '1 min CD. AoE slow + pull. Keeps mobs grouped in Starfall radius.' },
  { key: '-', spell: 'Typhoon', color: 'var(--color-lunar)', role: 'Knockback', note: '25s CD. AoE knockback. Knock casters INTO Solar Beam zone. Environmental kills.' },
  { key: '=', spell: 'Wild Charge', color: 'var(--color-nature)', role: 'Movement', note: '15s CD. Disengage in Moonkin Form. Your mobility between packs.' },
];

// Shift bar: defensives, utility, forms. Every spell here is baseline or from the talented build.
const shiftBar: KeyBind[] = [
  { key: 'S-1', spell: 'Barkskin', color: 'var(--color-nature)', role: 'Defensive', note: '20% DR. 1 min CD. Use BEFORE big damage hits.' },
  { key: 'S-2', spell: 'Bear Form', color: 'var(--color-gold-dim)', role: 'Oh Shit', note: 'Emergency. +25% HP, +220% armor. Well-Honed Instincts auto-heals at 40%.' },
  { key: 'S-3', spell: 'Renewal', color: 'var(--color-nature)', role: 'Self Heal', note: '30% HP heal. 1.5 min CD. Stack with Barkskin for double save.' },
  { key: 'S-4', spell: 'Stampeding Roar', color: 'var(--color-gold-dim)', role: 'Group Sprint', note: '2 min CD. 60% speed for whole group. Essential M+ utility.' },
  { key: 'S-5', spell: 'Incapacitating Roar', color: 'var(--color-lunar)', role: 'AoE CC', note: '30s CD. AoE incapacitate. Stops Ascendant affix orbs.' },
  { key: 'S-6', spell: 'Innervate', color: 'var(--color-lunar)', role: 'Healer Buff', note: '3 min CD. Free healer mana for 12s. Give on hardest pulls.' },
  { key: 'S-7', spell: 'Remove Corruption', color: 'var(--color-nature)', role: 'Dispel', note: '8s CD. Removes curses and poisons. Critical for Devour affix.' },
  { key: 'S-8', spell: 'Soothe', color: 'var(--color-lunar)', role: 'Enrage Dispel', note: '10s CD. Removes enrage effects. Required on specific M+ mobs.' },
  { key: 'S-9', spell: 'Rebirth', color: 'var(--color-nature)', role: 'Battle Res', note: 'Combat rez. Most valuable raid utility a druid brings.' },
  { key: 'S-0', spell: 'Mark of the Wild', color: 'var(--color-nature)', role: 'Buff', note: '+3% Versatility for group. Cast before every key. Keep up always.' },
  { key: 'S--', spell: 'Moonkin Form', color: 'var(--color-lunar)', role: 'Form', note: 'Your DPS form. Re-enter after Bear Form emergency.' },
  { key: 'S-=', spell: 'Heart of the Wild', color: 'var(--color-nature)', role: 'Emergency CD', note: '2 min CD. In Bear Form: +30% max HP for 20s. Last resort survival.' },
];

// -- Rotation sequences --

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
  { key: '1', spell: 'Starfire', condition: 'Cast once to set Eclipse type to Lunar.' },
  { key: '6', spell: 'Lunar Eclipse', condition: 'Press to enter Lunar Eclipse. 15s of empowered Starfire.', critical: true },
  { key: '8', spell: 'Incarnation', condition: 'If available (3 min CD). +10% Haste + 10% Crit for 30s.', critical: true },
  { key: '7', spell: 'Fury of Elune', condition: 'Beam on pack. AP gen + 6% damage amp (Atmospheric Exposure).', critical: true },
  { key: '2', spell: 'Starfall', condition: 'Dump AP. First 3 spenders get +20% from Ascendant Eclipse.', critical: true },
  { key: '1', spell: 'Starfire', condition: 'Cleaves all nearby. Reduces Fury CD by 1.5s via Lunation.' },
  { key: '1', spell: 'Starfire', condition: 'Keep building AP.' },
  { key: '2', spell: 'Starfall', condition: 'Starfall again. Loop: 1 1 1 > 2 > 1 1 1 > 2.', critical: true },
];

const aoePriority: RotationStep[] = [
  { key: '6', spell: 'Lunar Eclipse', condition: 'If not in Eclipse and charge available. Starfire first to set type, then press.', critical: true },
  { key: '2', spell: 'Starfall', condition: '50+ AP and 3+ targets. ALWAYS keep active. Never let it drop.', critical: true },
  { key: '5', spell: 'Sunfire', condition: 'Refresh if falling off. Instant cast, hits all targets.' },
  { key: '4', spell: 'Moonfire', condition: 'Refresh on targets. Each tick can proc free Fury of Elune.' },
  { key: '7', spell: 'Fury of Elune', condition: 'On cooldown (60s base, reduced by Lunation). 6% damage amp.' },
  { key: '1', spell: 'Starfire', condition: 'Your builder. Cleaves in Lunar. Each cast reduces Fury CD by 1.5s.', critical: true },
  { key: '3', spell: 'Starsurge', condition: 'ONLY on 1-2 targets or Starweaver proc. Never in AoE otherwise.' },
];

// ST opener - same keys, different priority. Starsurge replaces Starfall as spender.
const stOpener: RotationStep[] = [
  { key: '4', spell: 'Moonfire', condition: 'Apply DoT.' },
  { key: '5', spell: 'Sunfire', condition: 'Apply DoT.' },
  { key: '1', spell: 'Starfire', condition: 'Set Eclipse type to Lunar.' },
  { key: '6', spell: 'Lunar Eclipse', condition: 'Enter Lunar Eclipse.', critical: true },
  { key: '8', spell: 'Incarnation', condition: 'If available (3 min CD).', critical: true },
  { key: '7', spell: 'Fury of Elune', condition: '6% damage amp (Atmospheric Exposure).' },
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
        <div className="text-[11px] uppercase font-bold mb-5" style={{ color: 'var(--color-solar)', letterSpacing: '0.12em' }}>
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
                style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-surface-elevated)', color: kb.color }}>
                {kb.key}
              </kbd>
              <div>
                <span className="font-bold" style={{ color: kb.color }}>{kb.spell}</span>
                <span style={{ color: 'var(--color-text-2)' }}> - {kb.role}</span>
                <span style={{ color: 'var(--color-text-1)' }}> - {kb.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shift bar */}
      <div ref={r3} className="reveal mb-20">
        <div className="text-[11px] uppercase font-bold mb-5" style={{ color: 'var(--color-lunar)', letterSpacing: '0.12em' }}>
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
                style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-surface-elevated)', color: kb.color }}>
                {kb.key}
              </kbd>
              <div>
                <span className="font-bold" style={{ color: kb.color }}>{kb.spell}</span>
                <span style={{ color: 'var(--color-text-2)' }}> - {kb.role}</span>
                <span style={{ color: 'var(--color-text-1)' }}> - {kb.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* -- Rotation Sequences -- */}
      <div ref={r4} className="reveal">
        <div className="text-[11px] uppercase font-bold mb-8" style={{ color: 'var(--color-solar)', letterSpacing: '0.12em' }}>
          Rotation Sequences - Press These Keys in Order
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* AoE Opener */}
          <div className="rounded-lg glass-lunar p-6">
            <h3 className="text-base font-bold mb-1" style={{ color: 'var(--color-lunar)' }}>
              AoE Opener (3+ Targets)
            </h3>
            <p className="text-sm mb-5" style={{ color: 'var(--color-text-2)' }}>
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
            <h3 className="text-base font-bold mb-1" style={{ color: 'var(--color-solar)' }}>
              Single Target Opener (1-2 Targets)
            </h3>
            <p className="text-sm mb-5" style={{ color: 'var(--color-text-2)' }}>
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
          <h3 className="text-base font-bold mb-1" style={{ color: 'var(--color-text-1)' }}>
            AoE Priority (Ongoing - What to Press Next)
          </h3>
          <p className="text-sm mb-5" style={{ color: 'var(--color-text-2)' }}>
            After the opener, follow this priority. #1 is always first. Only go to #2 if #1 isn't available.
          </p>
          <div className="space-y-2">
            {aoePriority.map((step, i) => (
              <RotationRow key={i} step={step} index={i} priority />
            ))}
          </div>
        </div>

        {/* Quick reference strip */}
        <div className="mt-12 p-5 rounded-lg gilt-border" style={{ background: 'color-mix(in oklch, var(--color-surface-1) 30%, transparent)' }}>
          <div className="text-sm font-bold mb-3" style={{ color: 'var(--color-solar)' }}>
            AoE Cheat Sheet - Tape This to Your Monitor
          </div>
          <div className="font-mono text-lg font-bold" style={{ color: 'var(--color-text-1)', lineHeight: 2.2 }}>
            <span style={{ color: 'var(--color-solar)' }}>5</span>
            {' \u2192 '}
            <span style={{ color: 'var(--color-lunar)' }}>4</span>
            {' \u2192 '}
            <span style={{ color: 'var(--color-lunar)' }}>1</span>
            {' \u2192 '}
            <span style={{ color: 'var(--color-lunar)' }}>6</span>
            {' \u2192 '}
            <span style={{ color: 'var(--color-gold-bright)' }}>8</span>
            {' \u2192 '}
            <span style={{ color: 'var(--color-lunar)' }}>7</span>
            {' \u2192 '}
            <span style={{ color: 'var(--color-lunar)' }}>2</span>
            {' \u2192 '}
            <span style={{ color: 'var(--color-lunar)' }}>1 1 1</span>
            {' \u2192 '}
            <span style={{ color: 'var(--color-lunar)' }}>2</span>
            {' \u2192 repeat'}
          </div>
          <p className="text-[15px] mt-3" style={{ color: 'var(--color-text-1)' }}>
            Sunfire {'\u2192'} Moonfire {'\u2192'} Starfire {'\u2192'} Lunar Eclipse {'\u2192'} Incarnation {'\u2192'} Fury {'\u2192'} Starfall {'\u2192'} Starfire x3 {'\u2192'} Starfall {'\u2192'} loop
          </p>
          <p className="text-sm mt-2 font-bold" style={{ color: 'var(--color-lunar)' }}>
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
          background: 'color-mix(in oklch, var(--color-surface-1) 70%, transparent)',
          border: `1px solid color-mix(in oklch, ${kb.color} 19%, transparent)`,
          boxShadow: `0 2px 8px color-mix(in oklch, ${kb.color} 6%, transparent)`,
        }}
      >
        <SpellIcon name={kb.spell} px={shift ? 18 : 22} />
        <span className="text-[10px] font-bold" style={{ color: kb.color }}>{shift ? kb.key.replace('S-', '') : kb.key}</span>
      </div>
      <span className="text-[10px] font-medium text-center leading-tight" style={{ color: 'var(--color-text-2)' }}>
        {kb.spell.split(' ')[0]}
      </span>
    </div>
  );
}

function RotationRow({ step, index, priority }: { step: RotationStep; index: number; priority?: boolean }) {
  const kb = [...mainBar, ...shiftBar].find(k => k.key === step.key || k.key === `S-${step.key}`);
  const color = kb?.color || 'var(--color-text-1)';

  return (
    <div className="flex items-center gap-3" style={{ opacity: step.critical ? 1 : 0.85 }}>
      <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[12px] font-mono font-bold"
        style={{
          color: step.critical ? 'var(--color-text-1)' : 'var(--color-text-2)',
          background: step.critical ? `color-mix(in oklch, ${color} 13%, transparent)` : 'var(--color-surface-2)',
          border: step.critical ? `1px solid color-mix(in oklch, ${color} 25%, transparent)` : '1px solid var(--color-surface-3)',
        }}>
        {priority ? `${index + 1}` : `${index + 1}`}
      </span>
      <kbd className="shrink-0 w-7 h-7 flex items-center justify-center rounded font-mono font-bold text-[14px]"
        style={{ background: 'var(--color-surface-2)', border: `1px solid color-mix(in oklch, ${color} 25%, transparent)`, color }}>
        {step.key}
      </kbd>
      <div className="flex-1 min-w-0">
        <span className="text-[15px] font-bold" style={{ color }}>{step.spell}</span>
        {step.condition && (
          <span className="text-[14px] ml-2" style={{ color: 'var(--color-text-1)' }}>
            {step.condition}
          </span>
        )}
      </div>
    </div>
  );
}
