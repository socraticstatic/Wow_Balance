import { useEffect, useState } from 'react';
import { meta, builds } from '../data';
import { useReveal } from '../hooks/useReveal';
import TiltCard from '../components/TiltCard';

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
    <section className="px-6 sm:px-10 pt-32 pb-28 max-w-6xl mx-auto">
      {/* Context breadcrumb */}
      <div ref={r1} className="reveal flex items-center gap-2.5 mb-14">
        {[meta.expansion, `Patch ${meta.patch}`, meta.season].map((t, i) => (
          <span key={t} className="flex items-center gap-2.5">
            {i > 0 && <span className="w-[3px] h-[3px] rounded-full" style={{ background: 'oklch(24% 0.01 270)' }} />}
            <span className="text-[11px] font-semibold" style={{ color: 'oklch(55% 0.012 50)', letterSpacing: '0.1em' }}>
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
          color: 'oklch(50% 0.012 50)',
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
          background: `linear-gradient(90deg, oklch(78% 0.16 60), oklch(78% 0.16 60 / 0.1))`,
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
          color: 'oklch(58% 0.012 50)',
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
            <div className="text-[9px] uppercase font-bold mb-1" style={{ color: 'oklch(78% 0.16 60)', letterSpacing: '0.12em' }}>Raid Tier</div>
            <div className="text-lg font-bold" style={{ color: 'oklch(78% 0.16 60)' }}>S-Tier</div>
          </TiltCard>
          <TiltCard className="glass py-3 px-4 rounded-lg">
            <div className="text-[9px] uppercase font-bold mb-1" style={{ color: 'oklch(68% 0.16 285)', letterSpacing: '0.12em' }}>M+ Tier</div>
            <div className="text-lg font-bold" style={{ color: 'oklch(68% 0.16 285)' }}>A-Tier</div>
          </TiltCard>
          <TiltCard className="glass py-3 px-4 rounded-lg">
            <div className="text-[9px] uppercase font-bold mb-1" style={{ color: 'oklch(57% 0.012 50)', letterSpacing: '0.12em' }}>Meta</div>
            <div className="text-base font-bold" style={{ color: 'oklch(82% 0.008 270)' }}>{raidBuild?.heroSpec ?? 'Keeper'}</div>
          </TiltCard>
          <TiltCard className="glass py-3 px-4 rounded-lg">
            <div className="text-[9px] uppercase font-bold mb-1" style={{ color: 'oklch(57% 0.012 50)', letterSpacing: '0.12em' }}>Raid</div>
            <div className="text-base font-bold" style={{ color: 'oklch(82% 0.008 270)' }}>{meta.raidTier.split('/')[0].trim()}</div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
