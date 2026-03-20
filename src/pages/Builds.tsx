import { useState } from 'react';
import SectionHeading from '../components/SectionHeading';
import SpellIcon from '../components/SpellIcon';
import TalentTree from '../components/TalentTree';
import { builds } from '../data';
import { useReveal } from '../hooks/useReveal';

export default function Builds() {
  // Default to M+ AoE build (Elune's Chosen) since Spiracle focuses on AoE
  const aoeDefault = builds.find(b => b.id === 'mythicplus-elune') || builds.find(b => b.id === 'raid-aoe-elune') || builds[0];
  const [activeId, setActiveId] = useState(aoeDefault.id);
  const active = builds.find(b => b.id === activeId)!;
  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();
  const r4 = useReveal();

  const diffColor = active.difficulty === 'Beginner' ? 'var(--color-nature)' :
    active.difficulty === 'Intermediate' ? 'var(--color-solar)' : 'var(--color-error)';

  return (
    <section className="px-6 sm:px-10 py-28 max-w-6xl mx-auto">
      <div ref={r1} className="reveal">
        <SectionHeading title="Talent Builds" sub="Optimized builds for every content type. Derived from top WarcraftLogs parses." accent="lunar" />
      </div>

      {/* Tabs */}
      <div ref={r2} className="reveal flex flex-wrap gap-1.5 mb-12">
        {builds.map(b => {
          const on = activeId === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setActiveId(b.id)}
              className="px-4 py-2 rounded text-[15px] font-semibold cursor-pointer transition-all duration-150"
              style={{
                color: on ? 'var(--color-text-1)' : 'var(--color-text-1)',
                background: on ? 'var(--color-surface-active)' : 'transparent',
                border: `1px solid ${on ? 'var(--color-surface-elevated)' : 'var(--color-surface-2)'}`,
              }}
            >
              {b.use}
            </button>
          );
        })}
      </div>

      {/* Active build: asymmetric */}
      <div className="grid lg:grid-cols-[1fr_120px] gap-12 items-start mb-20">
        <div>
          <div className="flex items-baseline gap-3 mb-1.5">
            <h3 className="text-xl font-extrabold" style={{ color: 'var(--color-text-1)', letterSpacing: '-0.01em' }}>
              {active.name}
            </h3>
            <span className="text-[12px] font-bold px-2 py-0.5 rounded" style={{ color: diffColor, background: `color-mix(in oklch, ${diffColor} 6%, transparent)` }}>
              {active.difficulty}
            </span>
          </div>

          <p className="text-[15px] font-medium mb-1" style={{ color: 'var(--color-text-muted)' }}>
            {active.heroSpec}
          </p>
          <p className="mb-8" style={{ color: 'var(--color-text-1)', fontSize: '0.9rem', lineHeight: 1.8, maxWidth: '52ch' }}>
            {active.description}
          </p>

          {/* Keystones with spell icons */}
          <div className="text-[11px] uppercase font-bold mb-3" style={{ color: 'var(--color-text-muted)', letterSpacing: '0.12em' }}>
            Key Talents
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {active.keystones.map(t => (
              <span key={t} className="glass flex items-center gap-2 px-3 py-1.5 rounded-lg text-[14px] font-medium card-hover"
                style={{ color: 'var(--color-text-3)' }}>
                <SpellIcon name={t} size="small" px={20} />
                {t}
              </span>
            ))}
          </div>

          <div className="text-[11px] uppercase font-bold mb-1.5" style={{ color: 'var(--color-text-muted)', letterSpacing: '0.12em' }}>
            Stat Priority
          </div>
          <p className="text-sm font-mono" style={{ color: 'var(--color-text-muted)', fontVariantNumeric: 'tabular-nums' }}>
            {active.statPriority.join('  >  ')}
          </p>
        </div>

        {/* Rating */}
        <div className="pt-1">
          <div className="relative w-20 h-20 mb-1">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-surface-1)" strokeWidth="3" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="var(--color-lunar)" strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${active.rating * 2.64} ${264 - active.rating * 2.64}`} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold font-mono"
              style={{ color: 'var(--color-text-1)', fontVariantNumeric: 'tabular-nums' }}>
              {active.rating}
            </span>
          </div>
          <span className="text-[12px] font-medium" style={{ color: 'var(--color-text-ghost)' }}>Rating</span>
        </div>
      </div>

      {/* Talent Tree Visualization */}
      <div ref={r4} className="reveal mb-20">
        <TalentTree activeKeystones={active.keystones} buildName={active.use} />
      </div>

      {/* Rotation: opener + priority */}
      <div ref={r3} className="reveal grid lg:grid-cols-2 gap-3">
        <div className="p-6 rounded-lg glass-solar">
          <h4 className="text-sm font-bold mb-5" style={{ color: 'var(--color-solar)' }}>Opener</h4>
          <ol className="space-y-2">
            {active.rotation.opener.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[15px]" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                <span className="w-4 h-4 rounded-full text-[11px] flex items-center justify-center shrink-0 mt-0.5 font-mono font-bold"
                  style={{ color: 'var(--color-solar)', background: 'color-mix(in oklch, var(--color-solar) 8%, transparent)' }}>
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="p-6 rounded-lg glass-lunar">
          <h4 className="text-sm font-bold mb-5" style={{ color: 'var(--color-lunar)' }}>Priority</h4>
          <ul className="space-y-2">
            {active.rotation.priority.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[15px]" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                <span className="w-1 h-1 rounded-full shrink-0 mt-2" style={{ background: 'color-mix(in oklch, var(--color-lunar) 50%, transparent)' }} />
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
