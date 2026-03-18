import { meta, builds } from '../data';
import { useReveal } from '../hooks/useReveal';

export default function Hero() {
  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();
  const raidBuild = builds.find(b => b.id === 'raid-st-keeper');

  return (
    <section className="px-6 sm:px-10 pt-32 pb-24 max-w-6xl mx-auto">
      {/* Context breadcrumb */}
      <div ref={r1} className="reveal flex items-center gap-2.5 mb-12">
        {[meta.expansion, `Patch ${meta.patch}`, meta.season].map((t, i) => (
          <span key={t} className="flex items-center gap-2.5">
            {i > 0 && <span className="w-[3px] h-[3px] rounded-full" style={{ background: 'oklch(24% 0.01 270)' }} />}
            <span className="text-[11px] font-semibold" style={{ color: 'oklch(42% 0.012 270)', letterSpacing: '0.1em' }}>
              {t.toUpperCase()}
            </span>
          </span>
        ))}
      </div>

      {/* Title block - asymmetric, left-heavy */}
      <div ref={r2} className="reveal mb-20">
        <h1
          className="gold-shimmer"
          style={{
            fontFamily: '"Cormorant", Georgia, serif',
            fontWeight: 300,
            fontStyle: 'italic',
            fontSize: 'clamp(4rem, 12vw, 10rem)',
            lineHeight: 0.85,
            letterSpacing: '-0.02em',
          }}
        >
          Balance
        </h1>
        <p
          style={{
            fontFamily: '"Cormorant", Georgia, serif',
            fontWeight: 500,
            fontSize: 'clamp(1rem, 2.5vw, 1.75rem)',
            lineHeight: 1,
            letterSpacing: '0.08em',
            color: 'oklch(55% 0.012 50)',
            marginTop: '8px',
          }}
        >
          DRUID DOSSIER
        </p>
      </div>

      {/* Two-column: description left, stats right */}
      <div ref={r3} className="reveal grid lg:grid-cols-[1fr_340px] gap-16 items-end">
        <p style={{ color: 'oklch(60% 0.012 50)', fontSize: 'clamp(0.875rem, 1.1vw, 1rem)', lineHeight: 1.8, maxWidth: '38ch' }}>
          The definitive guide to Eclipse mechanics, optimal builds,
          best-in-slot gear, and everything a Night Elf moonkin needs
          to dominate in {meta.expansion}.
        </p>

        <div className="grid grid-cols-2 gap-2.5">
          <QuickStat label="Raid Tier" value="S-Tier" color="oklch(78% 0.16 60)" />
          <QuickStat label="M+ Tier" value="A-Tier" color="oklch(68% 0.16 285)" />
          <QuickStat label="Meta" value={raidBuild?.heroSpec ?? 'Keeper'} />
          <QuickStat label="Raid" value={meta.raidTier.split('/')[0].trim()} />
        </div>
      </div>
    </section>
  );
}

function QuickStat({ label, value, color }: { label: string; value: string; color?: string }) {
  const c = color ?? 'oklch(57% 0.012 50)';
  return (
    <div className="glass card-hover py-3 px-4 rounded-lg">
      <div className="text-[9px] uppercase font-bold mb-1" style={{ color: c, letterSpacing: '0.12em' }}>{label}</div>
      <div className="text-base font-bold" style={{ color: color ? c : 'oklch(82% 0.008 270)' }}>{value}</div>
    </div>
  );
}
