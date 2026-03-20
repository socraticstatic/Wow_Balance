import { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { useReveal } from '../hooks/useReveal';

interface Macro {
  name: string;
  category: 'rotation' | 'cooldowns' | 'utility' | 'defensive' | 'targeting';
  priority: 'essential' | 'recommended' | 'optional';
  code: string;
  explanation: string;
  keybind: string;
}

const macros: Macro[] = [
  // -- ROTATION --
  {
    name: 'Mouseover Moonfire',
    category: 'rotation',
    priority: 'essential',
    keybind: '4 or Mouse Button',
    code: `#showtooltip Moonfire
/cast [@mouseover,harm,nodead][] Moonfire`,
    explanation: 'Applies Moonfire to whatever your mouse is hovering over without changing target. Essential for multi-DoT in AoE. If nothing is hovered, casts on your current target.',
  },
  {
    name: 'Mouseover Sunfire',
    category: 'rotation',
    priority: 'essential',
    keybind: '5 or Mouse Button',
    code: `#showtooltip Sunfire
/cast [@mouseover,harm,nodead][] Sunfire`,
    explanation: 'Same as Moonfire mouseover. Sunfire hits all nearby targets on application, but this lets you refresh on specific mobs without tab-targeting.',
  },
  {
    name: 'Starsurge (Cancel Starfire)',
    category: 'rotation',
    priority: 'recommended',
    keybind: '3',
    code: `#showtooltip Starsurge
/stopcasting
/cast Starsurge`,
    explanation: 'Cancels your current Starfire cast and immediately fires Starsurge. Use when a priority target appears or you need to dump AP before capping. The /stopcasting means you lose the remaining cast time but gain instant AP spend.',
  },
  // -- COOLDOWNS --
  {
    name: 'Incarnation + Trinket + Fury',
    category: 'cooldowns',
    priority: 'essential',
    keybind: '8 (Incarnation key)',
    code: `#showtooltip Incarnation: Chosen of Elune
/use 13
/cast Incarnation: Chosen of Elune
/cast Fury of Elune`,
    explanation: 'One button stacks all your burst: on-use trinket (slot 13) + Incarnation + Fury of Elune. Press at the start of big AoE packs. The trinket and Incarnation go on cooldown together, maximizing the damage window. Fury gets the 6% Atmospheric Exposure amp on everything.',
  },
  {
    name: 'Incarnation + Trinket (No Fury)',
    category: 'cooldowns',
    priority: 'recommended',
    keybind: 'Alt+8',
    code: `#showtooltip Incarnation: Chosen of Elune
/use 13
/cast Incarnation: Chosen of Elune`,
    explanation: 'Same as above but without Fury. Use when you want to save Fury for the next pack but still pop Incarnation + trinket. Good for packs that will die fast.',
  },
  {
    name: 'Lunar Eclipse (Safe)',
    category: 'cooldowns',
    priority: 'recommended',
    keybind: '6',
    code: `#showtooltip Lunar Eclipse
/cast Lunar Eclipse`,
    explanation: 'Simple Lunar Eclipse cast. With Lunar Calling talented, this is the only Eclipse you ever press. Cast Starfire first to set the type, then press this.',
  },
  // -- DEFENSIVE --
  {
    name: 'Bear Form Panic Button',
    category: 'defensive',
    priority: 'essential',
    keybind: 'Shift+2',
    code: `#showtooltip Bear Form
/cast Bear Form
/cast Frenzied Regeneration
/cast Barkskin`,
    explanation: 'Emergency survival. Shifts to Bear Form (+25% HP, +220% armor), pops Frenzied Regeneration (HoT), and Barkskin (20% DR) all in one press. Well-Honed Instincts will also auto-proc at 40% HP. Press this when you are about to die.',
  },
  {
    name: 'Barkskin (No Form Change)',
    category: 'defensive',
    priority: 'essential',
    keybind: 'Shift+1',
    code: `#showtooltip Barkskin
/cast Barkskin`,
    explanation: 'Barkskin without shifting. Use preemptively when you know big damage is coming. 20% DR, 1 min CD. Does not trigger GCD. Can be pressed during a Starfire cast without interrupting it.',
  },
  {
    name: 'Heart of the Wild + Bear',
    category: 'defensive',
    priority: 'recommended',
    keybind: 'Shift+=',
    code: `#showtooltip Heart of the Wild
/cast Heart of the Wild
/cast Bear Form`,
    explanation: 'Last resort. Heart of the Wild in Bear Form gives +30% max HP for 20 seconds. Combined with Bear Form\'s +25% Stamina and Barkskin, you become extremely tanky. Use when the healer is dead or you are the last one standing.',
  },
  // -- UTILITY --
  {
    name: 'Solar Beam (Focus)',
    category: 'utility',
    priority: 'essential',
    keybind: '9',
    code: `#showtooltip Solar Beam
/cast [@focus,harm,nodead][@target,harm,nodead] Solar Beam`,
    explanation: 'Casts Solar Beam on your focus target first, or your current target if no focus. Set focus on the most dangerous caster in a pack, then you can interrupt it without retargeting. The 8-second silence zone is more valuable than the interrupt itself.',
  },
  {
    name: 'Typhoon + Ursol\'s Vortex Combo',
    category: 'utility',
    priority: 'recommended',
    keybind: '- then 0',
    code: `#showtooltip Ursol's Vortex
/cast [@cursor] Ursol's Vortex`,
    explanation: 'Drops Ursol\'s Vortex at your cursor position without the targeting circle. Follow with Typhoon to knock mobs INTO the vortex. The vortex pulls them back, keeping them grouped for Starfall. Separate Typhoon on its own key for flexibility.',
  },
  {
    name: 'Stampeding Roar (Any Form)',
    category: 'utility',
    priority: 'essential',
    keybind: 'Shift+4',
    code: `#showtooltip Stampeding Roar
/cast [noform:1] Moonkin Form
/cast Stampeding Roar`,
    explanation: 'Ensures you are in Moonkin Form first (Stampeding Roar requires a shapeshift form), then casts Roar. 60% movement speed for the whole group for 8 seconds. Use proactively between pulls or during boss mechanics.',
  },
  {
    name: 'Remove Corruption (Mouseover)',
    category: 'utility',
    priority: 'recommended',
    keybind: 'Shift+7',
    code: `#showtooltip Remove Corruption
/cast [@mouseover,help,nodead][@player] Remove Corruption`,
    explanation: 'Dispels curses and poisons on the party member your mouse is hovering over, or yourself if hovering nothing. Critical for the Devour affix. Don\'t tab-target to allies to dispel - mouseover is faster.',
  },
  // -- TARGETING --
  {
    name: 'Target Nearest Enemy',
    category: 'targeting',
    priority: 'optional',
    keybind: 'Tab (rebind)',
    code: `/targetenemy [noexists][dead]`,
    explanation: 'Smarter tab targeting. Only acquires a new target if you don\'t have one or your current target is dead. Prevents accidental target swaps mid-cast.',
  },
  {
    name: 'Cancel Form + Mount',
    category: 'targeting',
    priority: 'optional',
    keybind: 'Any mount key',
    code: `#showtooltip
/cancelform
/cast Travel Form`,
    explanation: 'Drops Moonkin Form and goes straight to Travel Form. Faster than clicking. Travel Form is instant and usable indoors. Replace with your mount macro for outdoor.',
  },
];

const categoryLabels: Record<string, { label: string; color: string }> = {
  rotation: { label: 'Rotation', color: 'var(--color-lunar)' },
  cooldowns: { label: 'Cooldowns', color: 'var(--color-solar)' },
  defensive: { label: 'Defensive', color: 'var(--color-error)' },
  utility: { label: 'Utility', color: 'var(--color-nature)' },
  targeting: { label: 'Targeting', color: 'var(--color-text-muted)' },
};

const priorityColors: Record<string, string> = {
  essential: 'var(--color-solar)',
  recommended: 'var(--color-lunar)',
  optional: 'var(--color-text-muted)',
};

export default function Macros() {
  const [copied, setCopied] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const r1 = useReveal();

  const filtered = filter === 'all' ? macros : macros.filter(m => m.category === filter);
  const essentials = filtered.filter(m => m.priority === 'essential');
  const recommended = filtered.filter(m => m.priority === 'recommended');
  const optional = filtered.filter(m => m.priority === 'optional');

  const copyMacro = (code: string, name: string) => {
    navigator.clipboard.writeText(code);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <section className="px-6 sm:px-10 py-32 max-w-6xl mx-auto relative z-10">
      <div ref={r1} className="reveal">
        <SectionHeading
          title="Macros"
          sub="Copy-paste macros for Balance Druid. Every macro tested and explained."
          accent="lunar"
        />
      </div>

      {/* Filter tabs */}
      <div className="reveal flex flex-wrap gap-2 mb-12">
        {[{ id: 'all', label: 'All' }, ...Object.entries(categoryLabels).map(([id, v]) => ({ id, label: v.label }))].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className="px-4 py-2 rounded-lg text-[13px] font-semibold cursor-pointer transition-all"
            style={{
              color: filter === tab.id ? 'var(--color-text-1)' : 'var(--color-text-4)',
              background: filter === tab.id ? 'var(--color-surface-3)' : 'var(--color-surface-1)',
              border: `1px solid ${filter === tab.id ? 'var(--color-surface-elevated)' : 'var(--color-border)'}`,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Essential */}
      {essentials.length > 0 && (
        <MacroGroup label="Essential" color="var(--color-solar)" macros={essentials} onCopy={copyMacro} copied={copied} />
      )}

      {/* Recommended */}
      {recommended.length > 0 && (
        <MacroGroup label="Recommended" color="var(--color-lunar)" macros={recommended} onCopy={copyMacro} copied={copied} />
      )}

      {/* Optional */}
      {optional.length > 0 && (
        <MacroGroup label="Optional" color="var(--color-text-muted)" macros={optional} onCopy={copyMacro} copied={copied} />
      )}
    </section>
  );
}

function MacroGroup({ label, color, macros: items, onCopy, copied }: {
  label: string; color: string; macros: Macro[]; onCopy: (code: string, name: string) => void; copied: string | null;
}) {
  return (
    <div className="mb-16">
      <div className="text-[11px] uppercase font-bold mb-5" style={{ color, letterSpacing: '0.12em' }}>
        {label}
      </div>
      <div className="space-y-4">
        {items.map(macro => (
          <MacroCard key={macro.name} macro={macro} onCopy={onCopy} copied={copied === macro.name} />
        ))}
      </div>
    </div>
  );
}

function MacroCard({ macro, onCopy, copied }: { macro: Macro; onCopy: (code: string, name: string) => void; copied: boolean }) {
  const cat = categoryLabels[macro.category];
  return (
    <div className="reveal rounded-lg overflow-hidden glass">
      <div className="px-6 py-4 flex items-center justify-between flex-wrap gap-3"
        style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-baseline gap-3">
          <h3 className="text-lg font-bold" style={{ color: 'var(--color-text-1)' }}>
            {macro.name}
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded"
            style={{ color: cat.color, background: `color-mix(in oklch, ${cat.color} 7%, transparent)` }}>
            {cat.label}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded"
            style={{ color: priorityColors[macro.priority], background: `color-mix(in oklch, ${priorityColors[macro.priority]} 7%, transparent)` }}>
            {macro.priority}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-mono" style={{ color: 'var(--color-text-4)' }}>
            {macro.keybind}
          </span>
          <button
            onClick={() => onCopy(macro.code, macro.name)}
            className="px-3 py-1.5 rounded-md text-[12px] font-bold cursor-pointer transition-all"
            style={{
              color: copied ? 'var(--color-nature)' : 'var(--color-solar)',
              background: copied ? 'color-mix(in oklch, var(--color-nature) 10%, transparent)' : 'color-mix(in oklch, var(--color-solar) 10%, transparent)',
              border: `1px solid ${copied ? 'color-mix(in oklch, var(--color-nature) 20%, transparent)' : 'color-mix(in oklch, var(--color-solar) 20%, transparent)'}`,
            }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      <div className="px-6 py-5 grid md:grid-cols-[1fr_1fr] gap-6">
        <pre
          className="font-mono text-[13px] p-4 rounded-lg overflow-x-auto whitespace-pre"
          style={{
            background: 'var(--color-void)',
            border: '1px solid var(--color-surface-2)',
            color: 'var(--color-text-1)',
            lineHeight: 1.6,
          }}
        >
          {macro.code}
        </pre>
        <p className="text-[14px]" style={{ color: 'var(--color-text-1)', lineHeight: 1.75 }}>
          {macro.explanation}
        </p>
      </div>
    </div>
  );
}
