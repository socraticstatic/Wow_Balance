import { useReveal } from '../hooks/useReveal';
import { useMouseParallax } from '../hooks/useMouseParallax';
import { useCountUp } from '../hooks/useCountUp';
import characterData from '@data/my-character-clean.json';

const qualityColors: Record<number, string> = {
  2: 'oklch(68% 0.18 155)',   // uncommon
  3: 'oklch(62% 0.18 240)',   // rare
  4: 'oklch(68% 0.22 300)',   // epic
  5: 'oklch(80% 0.18 80)',    // legendary
  6: 'oklch(80% 0.18 80)',    // artifact
};

export default function MyCharacter() {
  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();
  const r4 = useReveal();

  const c = characterData;
  const gear = c.gear as Array<{
    slot: string; name: string; ilvl: number; quality: number;
    tier: string | null; enchant: string | null; gems: string[];
  }>;

  const tierPieces = gear.filter(g => g.tier);
  const missingEnchants = gear.filter(g =>
    ['back', 'chest', 'wrist', 'legs', 'feet', 'finger1', 'finger2'].includes(g.slot) && !g.enchant
  );

  const { ref: parallaxRef, offset } = useMouseParallax(15);
  const ilvlCount = useCountUp(c.ilvl, 1000);
  const achieveCount = useCountUp(c.achievementPoints, 1500);

  return (
    <section className="relative px-6 sm:px-10 py-28 max-w-6xl mx-auto">

      {/* ── Hero block: identity left, character render right ── */}
      <div ref={r1} className="reveal grid md:grid-cols-[1fr_380px] gap-8 items-center mb-20 min-h-[480px]">

        {/* Character render - right side, mouse parallax */}
        <div ref={parallaxRef} className="relative order-2 md:order-2 flex justify-center md:justify-end">
          {/* Ambient glow - tracks mouse */}
          <div
            className="absolute top-1/2 left-1/2 w-[360px] h-[480px] blur-[80px] rounded-full"
            style={{
              background: 'radial-gradient(ellipse, oklch(40% 0.18 270), transparent 70%)',
              animation: 'glowPulse 6s ease-in-out infinite',
              transform: `translate(calc(-50% + ${offset.x * 0.5}px), calc(-50% + ${offset.y * 0.5}px))`,
              transition: 'transform 0.3s ease-out',
            }}
          />
          {/* Character with mouse parallax + idle float */}
          <img
            src={`${import.meta.env.BASE_URL}spiracle-cropped.png`}
            alt="Spiracle - Night Elf Balance Druid"
            className="relative z-10 h-[520px] w-auto object-contain"
            style={{
              filter: 'drop-shadow(0 4px 40px oklch(25% 0.15 270 / 0.3))',
              animation: 'characterIdle 6s ease-in-out infinite',
              transform: `translate(${offset.x}px, ${offset.y}px)`,
              transition: 'transform 0.15s ease-out',
            }}
          />
        </div>

        {/* Identity - left side */}
        <div className="order-1 md:order-1">
          <h2
            className="gold-shimmer"
            style={{
              fontFamily: '"Cormorant", Georgia, serif',
              fontWeight: 400,
              fontStyle: 'italic',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              lineHeight: 0.95,
              letterSpacing: '-0.01em',
            }}
          >
            Spiracle
          </h2>
          <p className="text-base mb-8" style={{ color: 'oklch(57% 0.012 50)' }}>
            {c.race} {c.spec} {c.class} - {c.realm} ({c.region.toUpperCase()})
          </p>

          {/* Key stats row */}
          <div className="flex items-end gap-8 mb-8">
            <div>
              <div className="text-[9px] uppercase font-bold mb-1" style={{ color: 'oklch(72% 0.18 270)', letterSpacing: '0.12em' }}>
                Item Level
              </div>
              <span ref={ilvlCount.ref} className="text-5xl font-extrabold font-mono" style={{ color: 'oklch(94% 0.006 270)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em' }}>
                {ilvlCount.value}
              </span>
            </div>
            <div>
              <div className="text-[9px] uppercase font-bold mb-1" style={{ color: 'oklch(80% 0.18 80)', letterSpacing: '0.12em' }}>
                Tier
              </div>
              <span className="text-2xl font-extrabold font-mono" style={{ color: 'oklch(80% 0.18 80)', fontVariantNumeric: 'tabular-nums' }}>
                {tierPieces.length}<span className="text-base font-medium" style={{ color: 'oklch(42% 0.012 270)' }}>/5</span>
              </span>
            </div>
            <div>
              <div className="text-[9px] uppercase font-bold mb-1" style={{ color: 'oklch(57% 0.012 50)', letterSpacing: '0.12em' }}>
                Achievements
              </div>
              <span ref={achieveCount.ref} className="text-2xl font-extrabold font-mono" style={{ color: 'oklch(72% 0.012 270)', fontVariantNumeric: 'tabular-nums' }}>
                {achieveCount.value.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="flex gap-2">
            <ExtLink href={c.warcraftlogsUrl} label="WarcraftLogs" />
            <ExtLink href={c.raiderioUrl} label="Raider.io" />
          </div>
        </div>
      </div>

      {/* ── Gear table ── */}
      <div ref={r2} className="reveal mb-16">
        <div className="text-[9px] uppercase font-bold mb-5" style={{ color: 'oklch(72% 0.18 270)', letterSpacing: '0.12em' }}>
          Equipped Gear
        </div>

        <div className="rounded-lg overflow-hidden" style={{ border: '1px solid oklch(14% 0.008 270)' }}>
          <div className="hidden sm:grid grid-cols-12 gap-3 px-5 py-2.5 text-[9px] uppercase font-bold"
            style={{ background: 'oklch(9.5% 0.01 270)', color: 'oklch(42% 0.012 270)', letterSpacing: '0.12em' }}>
            <div className="col-span-2">Slot</div>
            <div className="col-span-4">Item</div>
            <div className="col-span-1">iLvl</div>
            <div className="col-span-2">Enchant</div>
            <div className="col-span-3">Gems</div>
          </div>

          {gear.map((item, i) => (
            <div key={item.slot}
              className="grid grid-cols-12 gap-3 px-5 py-2 items-center"
              style={{
                background: i % 2 === 0 ? 'oklch(8% 0.006 270)' : 'oklch(9.5% 0.008 270)',
                borderTop: i === 0 ? 'none' : '1px solid oklch(12% 0.006 270)',
                ...(item.tier ? { borderLeft: '2px solid oklch(80% 0.18 80)' } : {}),
              }}>
              <div className="col-span-2 text-[12px] capitalize" style={{ color: 'oklch(57% 0.012 50)' }}>
                {item.slot.replace(/(\d)/, ' $1')}
              </div>
              <div className="col-span-4 text-[13px] font-semibold" style={{ color: qualityColors[item.quality] || 'oklch(82% 0.006 270)' }}>
                {item.name}
              </div>
              <div className="col-span-1 font-mono text-[12px]" style={{ color: 'oklch(65% 0.012 270)', fontVariantNumeric: 'tabular-nums' }}>
                {item.ilvl}
              </div>
              <div className="col-span-2 text-[11px] hidden sm:block" style={{ color: item.enchant ? 'oklch(68% 0.18 155)' : 'oklch(35% 0.008 50)' }}>
                {item.enchant || '-'}
              </div>
              <div className="col-span-3 text-[11px] hidden sm:flex flex-wrap gap-1">
                {item.gems.length > 0 ? item.gems.map((g, gi) => (
                  <span key={gi} style={{ color: 'oklch(62% 0.14 270)' }}>{g}</span>
                )) : <span style={{ color: 'oklch(35% 0.008 50)' }}>-</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── iLvl Gap Visualization ── */}
      <div className="reveal mb-16">
        <div className="text-[9px] uppercase font-bold mb-5" style={{ color: 'oklch(78% 0.16 60)', letterSpacing: '0.12em' }}>
          Gear Progress (Current vs Myth Track)
        </div>
        <div className="space-y-1.5">
          {gear.slice(0, 14).map(item => {
            const mythTarget = 180; // Approximate myth track cap
            const pct = Math.min((item.ilvl / mythTarget) * 100, 100);
            const gap = mythTarget - item.ilvl;
            return (
              <div key={item.slot} className="flex items-center gap-3 group">
                <span className="text-[11px] w-16 capitalize shrink-0" style={{ color: 'oklch(55% 0.012 50)' }}>
                  {item.slot.replace(/(\d)/, ' $1')}
                </span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'oklch(12% 0.012 45)' }}>
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: gap <= 10 ? 'oklch(68% 0.18 155)' : gap <= 30 ? 'oklch(78% 0.16 60)' : 'oklch(60% 0.14 30)',
                      transition: 'width 1s var(--ease)',
                    }}
                  />
                </div>
                <span className="font-mono text-[10px] w-8 text-right" style={{
                  color: gap <= 10 ? 'oklch(68% 0.18 155)' : 'oklch(60% 0.012 50)',
                  fontVariantNumeric: 'tabular-nums',
                }}>
                  {item.ilvl}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 text-[10px]" style={{ color: 'oklch(50% 0.012 50)' }}>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: 'oklch(68% 0.18 155)' }} /> Near cap</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: 'oklch(78% 0.16 60)' }} /> Upgradeable</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: 'oklch(60% 0.14 30)' }} /> Priority upgrade</span>
        </div>
      </div>

      {/* ── Audit cards ── */}
      <div ref={r3} className="reveal grid sm:grid-cols-2 gap-4 mb-16">
        {/* Tier progress */}
        <div className="p-5 rounded-lg glass-solar">
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-[9px] uppercase font-bold" style={{ color: 'oklch(80% 0.18 80)', letterSpacing: '0.12em' }}>
              Tier Pieces
            </span>
            <span className="font-mono text-sm font-bold" style={{ color: 'oklch(80% 0.18 80)', fontVariantNumeric: 'tabular-nums' }}>
              {tierPieces.length}/5
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-1 rounded-full mb-4 overflow-hidden" style={{ background: 'oklch(14% 0.015 80)' }}>
            <div className="h-full rounded-full" style={{ width: `${(tierPieces.length / 5) * 100}%`, background: 'oklch(80% 0.18 80)' }} />
          </div>
          <ul className="space-y-1">
            {tierPieces.map(t => (
              <li key={t.slot} className="text-[12px]" style={{ color: 'oklch(62% 0.012 270)' }}>
                <span className="capitalize">{t.slot}</span> - <span style={{ color: 'oklch(80% 0.18 80)' }}>{t.name}</span>
              </li>
            ))}
          </ul>
          {tierPieces.length >= 4 ? (
            <p className="text-[11px] mt-3 font-semibold" style={{ color: 'oklch(80% 0.18 80)' }}>4pc bonus active.</p>
          ) : (
            <p className="text-[11px] mt-3" style={{ color: 'oklch(57% 0.012 50)' }}>
              {4 - tierPieces.length} more for 4pc bonus.
            </p>
          )}
        </div>

        {/* Missing enchants */}
        <div className={`p-5 rounded-lg ${missingEnchants.length > 0 ? 'glass' : 'glass-nature'}`}>
          <div className="flex items-baseline justify-between mb-4">
            <span className="text-[9px] uppercase font-bold" style={{
              color: missingEnchants.length > 0 ? 'oklch(72% 0.16 30)' : 'oklch(68% 0.18 155)',
              letterSpacing: '0.12em',
            }}>
              {missingEnchants.length > 0 ? 'Missing Enchants' : 'All Enchanted'}
            </span>
            {missingEnchants.length > 0 && (
              <span className="font-mono text-sm font-bold" style={{ color: 'oklch(72% 0.16 30)', fontVariantNumeric: 'tabular-nums' }}>
                {missingEnchants.length}
              </span>
            )}
          </div>
          {missingEnchants.length > 0 ? (
            <ul className="space-y-1">
              {missingEnchants.map(m => (
                <li key={m.slot} className="text-[12px] capitalize" style={{ color: 'oklch(58% 0.012 270)' }}>
                  {m.slot} - {m.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[12px]" style={{ color: 'oklch(58% 0.012 270)' }}>All enchantable slots covered.</p>
          )}
        </div>
      </div>

      {/* ── Raid progression ── */}
      <div ref={r4} className="reveal">
        <div className="text-[9px] uppercase font-bold mb-4" style={{ color: 'oklch(57% 0.012 50)', letterSpacing: '0.12em' }}>
          Midnight Season 1 Raid
        </div>
        <div className="flex gap-6 text-sm">
          <ProgStat label="Normal" value={c.raidProgression?.['tier-mn-1']?.normal_bosses_killed ?? 0} total={9} />
          <ProgStat label="Heroic" value={c.raidProgression?.['tier-mn-1']?.heroic_bosses_killed ?? 0} total={9} />
          <ProgStat label="Mythic" value={c.raidProgression?.['tier-mn-1']?.mythic_bosses_killed ?? 0} total={9} />
        </div>
      </div>
    </section>
  );
}

function ProgStat({ label, value, total }: { label: string; value: number; total: number }) {
  const pct = total > 0 ? (value / total) * 100 : 0;
  return (
    <div className="min-w-[100px]">
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[12px] font-medium" style={{ color: 'oklch(58% 0.012 270)' }}>{label}</span>
        <span className="font-mono text-[12px] font-bold" style={{ color: value > 0 ? 'oklch(80% 0.006 270)' : 'oklch(34% 0.012 270)', fontVariantNumeric: 'tabular-nums' }}>
          {value}/{total}
        </span>
      </div>
      <div className="h-1 rounded-full overflow-hidden" style={{ background: 'oklch(14% 0.012 270)' }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'oklch(72% 0.18 270)' }} />
      </div>
    </div>
  );
}

function ExtLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="glass text-[12px] font-semibold px-3.5 py-2 rounded-lg transition-all inline-flex items-center gap-1.5 hover:scale-105"
      style={{ color: 'oklch(68% 0.012 50)' }}>
      {label}
      <span style={{ fontSize: '10px' }}>&#8599;</span>
    </a>
  );
}
