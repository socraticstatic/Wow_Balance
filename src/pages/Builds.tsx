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

  const diffColor = active.difficulty === 'Beginner' ? 'oklch(68% 0.18 155)' :
    active.difficulty === 'Intermediate' ? 'oklch(80% 0.18 80)' : 'oklch(72% 0.16 30)';

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
                color: on ? 'oklch(96% 0.005 270)' : 'oklch(90% 0.005 55)',
                background: on ? 'oklch(16% 0.02 270)' : 'transparent',
                border: `1px solid ${on ? 'oklch(24% 0.025 270)' : 'oklch(14% 0.01 270)'}`,
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
            <h3 className="text-xl font-extrabold" style={{ color: 'oklch(93% 0.006 270)', letterSpacing: '-0.01em' }}>
              {active.name}
            </h3>
            <span className="text-[12px] font-bold px-2 py-0.5 rounded" style={{ color: diffColor, background: `${diffColor}10` }}>
              {active.difficulty}
            </span>
          </div>

          <p className="text-[15px] font-medium mb-1" style={{ color: 'oklch(52% 0.012 270)' }}>
            {active.heroSpec}
          </p>
          <p className="mb-8" style={{ color: 'oklch(90% 0.005 270)', fontSize: '0.9rem', lineHeight: 1.8, maxWidth: '52ch' }}>
            {active.description}
          </p>

          {/* Keystones with spell icons */}
          <div className="text-[11px] uppercase font-bold mb-3" style={{ color: 'oklch(52% 0.012 270)', letterSpacing: '0.12em' }}>
            Key Talents
          </div>
          <div className="flex flex-wrap gap-2 mb-8">
            {active.keystones.map(t => (
              <span key={t} className="glass flex items-center gap-2 px-3 py-1.5 rounded-lg text-[14px] font-medium card-hover"
                style={{ color: 'oklch(72% 0.015 270)' }}>
                <SpellIcon name={t} size="small" px={20} />
                {t}
              </span>
            ))}
          </div>

          <div className="text-[11px] uppercase font-bold mb-1.5" style={{ color: 'oklch(52% 0.012 270)', letterSpacing: '0.12em' }}>
            Stat Priority
          </div>
          <p className="text-sm font-mono" style={{ color: 'oklch(62% 0.012 270)', fontVariantNumeric: 'tabular-nums' }}>
            {active.statPriority.join('  >  ')}
          </p>
        </div>

        {/* Rating */}
        <div className="pt-1">
          <div className="relative w-20 h-20 mb-1">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="oklch(12% 0.012 270)" strokeWidth="3" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="oklch(72% 0.18 270)" strokeWidth="3" strokeLinecap="round"
                strokeDasharray={`${active.rating * 2.64} ${264 - active.rating * 2.64}`} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold font-mono"
              style={{ color: 'oklch(86% 0.015 270)', fontVariantNumeric: 'tabular-nums' }}>
              {active.rating}
            </span>
          </div>
          <span className="text-[12px] font-medium" style={{ color: 'oklch(38% 0.012 270)' }}>Rating</span>
        </div>
      </div>

      {/* Talent Tree Visualization */}
      <div ref={r4} className="reveal mb-20">
        <TalentTree activeKeystones={active.keystones} buildName={active.use} />
      </div>

      {/* Rotation: opener + priority */}
      <div ref={r3} className="reveal grid lg:grid-cols-2 gap-3">
        <div className="p-6 rounded-lg glass-solar">
          <h4 className="text-sm font-bold mb-5" style={{ color: 'oklch(80% 0.18 80)' }}>Opener</h4>
          <ol className="space-y-2">
            {active.rotation.opener.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[15px]" style={{ color: 'oklch(62% 0.012 270)', lineHeight: 1.6 }}>
                <span className="w-4 h-4 rounded-full text-[11px] flex items-center justify-center shrink-0 mt-0.5 font-mono font-bold"
                  style={{ color: 'oklch(80% 0.18 80)', background: 'oklch(80% 0.18 80 / 0.08)' }}>
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className="p-6 rounded-lg glass-lunar">
          <h4 className="text-sm font-bold mb-5" style={{ color: 'oklch(72% 0.18 270)' }}>Priority</h4>
          <ul className="space-y-2">
            {active.rotation.priority.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[15px]" style={{ color: 'oklch(62% 0.012 270)', lineHeight: 1.6 }}>
                <span className="w-1 h-1 rounded-full shrink-0 mt-2" style={{ background: 'oklch(72% 0.18 270 / 0.5)' }} />
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
