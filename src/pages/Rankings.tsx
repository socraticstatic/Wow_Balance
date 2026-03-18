import SectionHeading from '../components/SectionHeading';
import { topPlayers } from '../data';
import { useReveal } from '../hooks/useReveal';

const podiumColors = ['oklch(80% 0.18 80)', 'oklch(70% 0.02 270)', 'oklch(60% 0.1 45)'];

export default function Rankings() {
  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();
  const hasRaid = topPlayers.raidLeaderboard.length > 0;
  const lastSync = new Date(topPlayers.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <section className="px-6 sm:px-10 py-28 max-w-6xl mx-auto">
      <div ref={r1} className="reveal">
        <SectionHeading title="Top Players" sub={`Live from WarcraftLogs and Raider.io. Synced ${lastSync}.`} accent="solar" />
      </div>

      {/* Affixes - inline pills */}
      {topPlayers.currentAffixes && (
        <div className="flex flex-wrap items-center gap-2 mb-14">
          <span className="text-[9px] uppercase font-bold mr-1" style={{ color: 'oklch(42% 0.012 270)', letterSpacing: '0.12em' }}>
            Affixes
          </span>
          {topPlayers.currentAffixes.affixes.map(a => (
            <span key={a.name} className="px-2.5 py-1 rounded text-[11px] font-medium"
              style={{ color: 'oklch(66% 0.012 270)', background: 'oklch(12% 0.012 270)', border: '1px solid oklch(18% 0.012 270)' }}>
              {a.name}
            </span>
          ))}
        </div>
      )}

      {/* Raid leaderboard - clean table, no card wrapper */}
      {hasRaid && (
        <div ref={r2} className="reveal mb-20">
          <div className="text-[9px] uppercase font-bold mb-4" style={{ color: 'oklch(80% 0.18 80)', letterSpacing: '0.12em' }}>
            Raid DPS
          </div>

          {/* Top 3 - featured */}
          <div className="grid sm:grid-cols-3 gap-2.5 mb-4">
            {topPlayers.raidLeaderboard.slice(0, 3).map((p, i) => (
              <div key={p.name} className="py-4 px-5 rounded-lg"
                style={{ background: 'oklch(10% 0.012 270)', border: '1px solid oklch(16% 0.012 270)', borderTop: `2px solid ${podiumColors[i]}` }}>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-mono text-xs font-bold" style={{ color: podiumColors[i] }}>#{p.rank}</span>
                  <span className="font-mono text-xs font-bold" style={{ color: 'oklch(80% 0.18 80)', fontVariantNumeric: 'tabular-nums' }}>
                    {p.dps ? `${(p.dps / 1e6).toFixed(2)}M` : '-'}
                  </span>
                </div>
                <div className="text-sm font-bold" style={{ color: 'oklch(90% 0.006 270)' }}>{p.name}</div>
                <div className="text-[11px]" style={{ color: 'oklch(42% 0.012 270)' }}>{p.realm} - {p.region}</div>
              </div>
            ))}
          </div>

          {/* Rest of leaderboard - compact rows */}
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid oklch(14% 0.008 270)' }}>
            {topPlayers.raidLeaderboard.slice(3, 20).map((p, i) => (
              <div key={p.name + i} className="flex items-center justify-between px-5 py-2"
                style={{
                  background: i % 2 === 0 ? 'oklch(8% 0.006 270)' : 'oklch(9.5% 0.008 270)',
                  borderTop: i > 0 ? '1px solid oklch(12% 0.006 270)' : 'none',
                }}>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[11px] font-bold w-5" style={{ color: 'oklch(38% 0.012 270)', fontVariantNumeric: 'tabular-nums' }}>
                    {p.rank}
                  </span>
                  <span className="text-[13px] font-semibold" style={{ color: 'oklch(82% 0.006 270)' }}>{p.name}</span>
                  {p.region && <span className="text-[10px]" style={{ color: 'oklch(40% 0.012 270)' }}>{p.region}</span>}
                </div>
                <span className="font-mono text-[12px] font-bold" style={{ color: 'oklch(72% 0.12 80)', fontVariantNumeric: 'tabular-nums' }}>
                  {p.dps ? `${(p.dps / 1e6).toFixed(2)}M` : '-'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Community figures - horizontal, no cards */}
      <div ref={r3} className="reveal">
        <div className="text-[9px] uppercase font-bold mb-5" style={{ color: 'oklch(72% 0.18 270)', letterSpacing: '0.12em' }}>
          Community
        </div>
        <div className="space-y-4">
          {topPlayers.communityFigures.map(f => (
            <div key={f.name} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'oklch(14% 0.02 270)', border: '1px solid oklch(20% 0.025 270)' }}>
                <span className="text-[11px] font-bold" style={{ color: 'oklch(72% 0.18 270)' }}>{f.name[0]}</span>
              </div>
              <div>
                <span className="text-sm font-bold" style={{ color: 'oklch(86% 0.006 270)' }}>{f.name}</span>
                <span className="text-[11px] ml-2" style={{ color: 'oklch(42% 0.012 270)' }}>{f.role}</span>
                <p className="text-[12px] mt-0.5" style={{ color: 'oklch(50% 0.012 270)' }}>{f.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
