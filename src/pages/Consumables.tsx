import { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import { useReveal } from '../hooks/useReveal';
import consumablesData from '@data/consumables.json';

type ContentType = 'raid' | 'mythicplus';

export default function Consumables() {
  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();
  const [contentType, setContentType] = useState<ContentType>('raid');

  const checklist = contentType === 'raid'
    ? consumablesData.raidNightChecklist
    : consumablesData.mythicPlusChecklist;

  const sections = [
    { key: 'flasks', label: 'Flasks', items: consumablesData.flasks, accent: 'var(--color-lunar)' },
    { key: 'food', label: 'Food', items: consumablesData.food, accent: 'var(--color-solar)' },
    { key: 'potions', label: 'Potions', items: consumablesData.potions, accent: 'var(--color-error)' },
    { key: 'weapon', label: 'Weapon Oil', items: consumablesData.weaponEnhancement, accent: 'var(--color-nature)' },
    { key: 'rune', label: 'Augment Rune', items: consumablesData.augmentRune, accent: 'var(--color-lunar)' },
  ];

  return (
    <section className="px-6 sm:px-10 py-28 max-w-6xl mx-auto">
      <div ref={r1} className="reveal">
        <SectionHeading
          title="Consumables"
          sub="Flasks, food, potions, and weapon enhancements. Never show up unprepared."
          accent="nature"
        />
      </div>

      {/* Content type toggle */}
      <div className="flex gap-2 mb-12">
        {(['raid', 'mythicplus'] as const).map(ct => {
          const on = contentType === ct;
          return (
            <button
              key={ct}
              onClick={() => setContentType(ct)}
              className="px-4 py-2 rounded text-[15px] font-semibold cursor-pointer transition-all"
              style={{
                color: on ? 'var(--color-text-1)' : 'var(--color-text-1)',
                background: on ? 'var(--color-surface-active)' : 'transparent',
                border: `1px solid ${on ? 'var(--color-surface-elevated)' : 'var(--color-border)'}`,
              }}
            >
              {ct === 'raid' ? 'Raid Night' : 'Mythic+'}
            </button>
          );
        })}
      </div>

      {/* Shopping checklist */}
      <div ref={r2} className="reveal glass-solar p-5 rounded-lg mb-16">
        <div className="text-[11px] uppercase font-bold mb-4" style={{ color: 'var(--color-solar)', letterSpacing: '0.12em' }}>
          {contentType === 'raid' ? 'Raid Night' : 'M+ Session'} Checklist
        </div>
        <div className="grid sm:grid-cols-2 gap-1.5">
          {checklist.map((item, i) => (
            <div key={i} className="flex items-center gap-2.5 py-1.5">
              <div className="w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0"
                style={{ borderColor: 'var(--color-text-ghost)' }}>
                <div className="w-1.5 h-1.5 rounded-sm" style={{ background: 'color-mix(in oklch, var(--color-solar) 30%, transparent)' }} />
              </div>
              <span className="text-[14px]" style={{ color: 'var(--color-text-4)' }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Consumable categories */}
      <div ref={r3} className="reveal space-y-10">
        {sections.map(section => (
          <div key={section.key}>
            <div className="text-[11px] uppercase font-bold mb-4" style={{ color: section.accent, letterSpacing: '0.12em' }}>
              {section.label}
            </div>
            <div className="space-y-2">
              {section.items.map((item, i) => (
                <div
                  key={i}
                  className="glass p-4 rounded-lg card-hover"
                  style={{ borderLeft: `2px solid ${i === 0 ? section.accent : 'var(--color-surface-3)'}` }}
                >
                  <div className="flex items-baseline justify-between mb-1">
                    <h4 className="text-[15px] font-bold" style={{ color: i === 0 ? section.accent : 'var(--color-text-3)' }}>
                      {item.name}
                    </h4>
                    <span className="text-[12px] font-mono" style={{ color: 'var(--color-text-faint)', fontVariantNumeric: 'tabular-nums' }}>
                      {item.goldEstimate}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mb-1.5 text-[13px]" style={{ color: 'var(--color-text-1)' }}>
                    <span style={{ color: section.accent }}>{item.value}</span>
                    <span className="w-1 h-1 rounded-full" style={{ background: 'var(--color-surface-elevated)' }} />
                    <span>{item.source}</span>
                  </div>
                  <p className="text-[13px]" style={{ color: 'var(--color-text-faint)', lineHeight: 1.6 }}>
                    {item.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
