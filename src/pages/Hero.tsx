import { useEffect, useState } from 'react';
import { meta, builds } from '../data';
import { useReveal } from '../hooks/useReveal';
import TiltCard from '../components/TiltCard';
import Lightning from '../components/Lightning';

export default function Hero() {
  const r1 = useReveal();
  const r3 = useReveal();
  const raidBuild = builds.find(b => b.id === 'raid-st-keeper');
  const [lettersVisible, setLettersVisible] = useState(0);

  // Staggered letter reveal
  useEffect(() => {
    const word = 'Balance';
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setLettersVisible(i);
      if (i >= word.length) clearInterval(interval);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const letters = 'Balance'.split('');

  return (
    <section className="relative px-6 sm:px-10 pt-20 sm:pt-32 pb-28 max-w-6xl mx-auto overflow-hidden">
      {/* Lightning discharge background - Astral purple, offset right. Hidden in light mode. */}
      <div className="absolute inset-0 -z-10 transition-opacity duration-500" style={{ opacity: 'var(--lightning-opacity, 0.2)', mixBlendMode: 'screen' }}>
        <Lightning hue={265} speed={0.35} intensity={0.45} size={1.2} xOffset={0.8} />
      </div>
      {/* Fade lightning out at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-40 -z-10" style={{
        background: 'linear-gradient(to top, var(--color-void), transparent)',
      }} />
      {/* Context breadcrumb */}
      <div ref={r1} className="reveal flex items-center gap-2.5 mb-14">
        {[meta.expansion, `Patch ${meta.patch}`, meta.season].map((t, i) => (
          <span key={t} className="flex items-center gap-2.5">
            {i > 0 && <span className="w-[3px] h-[3px] rounded-full" style={{ background: 'var(--color-text-ghost)' }} />}
            <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text-1)', letterSpacing: '0.1em' }}>
              {t.toUpperCase()}
            </span>
          </span>
        ))}
      </div>

      {/* Title - staggered letter reveal with individual gold shimmer */}
      <div className="mb-6">
        <h1 style={{
          fontFamily: '"Cormorant", Georgia, serif',
          fontWeight: 300,
          fontStyle: 'italic',
          fontSize: 'clamp(4.5rem, 14vw, 11rem)',
          lineHeight: 0.82,
          letterSpacing: '-0.03em',
          display: 'flex',
        }}>
          {letters.map((char, i) => (
            <span
              key={i}
              className="gold-shimmer inline-block"
              style={{
                opacity: i < lettersVisible ? 1 : 0,
                transform: i < lettersVisible ? 'translateY(0) rotate(0deg)' : 'translateY(30px) rotate(-3deg)',
                transition: `opacity 0.5s ease ${i * 0.08}s, transform 0.6s var(--ease) ${i * 0.08}s`,
                animationDelay: `${i * 0.3}s`,
              }}
            >
              {char}
            </span>
          ))}
        </h1>
      </div>

      <p
        style={{
          fontFamily: '"Cormorant", Georgia, serif',
          fontWeight: 500,
          fontSize: 'clamp(1rem, 2.5vw, 1.75rem)',
          lineHeight: 1,
          letterSpacing: '0.12em',
          color: 'var(--color-text-1)',
          opacity: lettersVisible >= 7 ? 1 : 0,
          transform: lettersVisible >= 7 ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.6s ease 0.2s, transform 0.6s var(--ease) 0.2s',
        }}
      >
        DRUID DOSSIER
      </p>

      {/* Decorative line that draws itself */}
      <div className="my-16 max-w-xs">
        <div style={{
          height: 1,
          background: `linear-gradient(90deg, var(--color-solar), color-mix(in oklch, var(--color-solar) 10%, transparent))`,
          transformOrigin: 'left',
          transform: lettersVisible >= 7 ? 'scaleX(1)' : 'scaleX(0)',
          transition: 'transform 1s var(--ease) 0.6s',
        }} />
      </div>

      {/* Two-column: description left, stats right */}
      <div ref={r3} className="reveal grid lg:grid-cols-[1fr_380px] gap-16 items-end">
        <p className="drop-cap" style={{
          fontFamily: '"Cormorant", Georgia, serif',
          fontStyle: 'italic',
          color: 'var(--color-text-1)',
          fontSize: 'clamp(0.95rem, 1.2vw, 1.1rem)',
          lineHeight: 1.85,
          maxWidth: '42ch',
        }}>
          The definitive guide to Eclipse mechanics, optimal builds,
          best-in-slot gear, and everything a Night Elf moonkin needs
          to dominate in {meta.expansion}. Forged from live data.
          Updated weekly. Tailored to your character.
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          <TiltCard className="glass py-3 px-4 rounded-lg">
            <div className="text-[11px] uppercase font-bold mb-1" style={{ color: 'var(--color-solar)', letterSpacing: '0.12em' }}>Raid Tier</div>
            <div className="text-lg font-bold" style={{ color: 'var(--color-solar)' }}>S-Tier</div>
          </TiltCard>
          <TiltCard className="glass py-3 px-4 rounded-lg">
            <div className="text-[11px] uppercase font-bold mb-1" style={{ color: 'var(--color-lunar)', letterSpacing: '0.12em' }}>M+ Tier</div>
            <div className="text-lg font-bold" style={{ color: 'var(--color-lunar)' }}>A-Tier</div>
          </TiltCard>
          <TiltCard className="glass py-3 px-4 rounded-lg">
            <div className="text-[11px] uppercase font-bold mb-1" style={{ color: 'var(--color-text-1)', letterSpacing: '0.12em' }}>Meta</div>
            <div className="text-base font-bold" style={{ color: 'var(--color-text-1)' }}>{raidBuild?.heroSpec ?? 'Keeper'}</div>
          </TiltCard>
          <TiltCard className="glass py-3 px-4 rounded-lg">
            <div className="text-[11px] uppercase font-bold mb-1" style={{ color: 'var(--color-text-1)', letterSpacing: '0.12em' }}>Raid</div>
            <div className="text-base font-bold" style={{ color: 'var(--color-text-1)' }}>{meta.raidTier.split('/')[0].trim()}</div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
