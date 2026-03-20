import SectionHeading from '../components/SectionHeading';
import { topPlayers } from '../data';
import { useReveal } from '../hooks/useReveal';

const podiumColors = ['var(--color-solar)', 'var(--color-text-4)', 'var(--color-gold-dim)'];

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
          <span className="text-[11px] uppercase font-bold mr-1" style={{ color: 'var(--color-text-4)', letterSpacing: '0.12em' }}>
            Affixes
          </span>
          {topPlayers.currentAffixes.affixes.map(a => (
            <span key={a.name} className="px-2.5 py-1 rounded text-[13px] font-medium"
              style={{ color: 'var(--color-text-1)', background: 'var(--color-surface-1)', border: '1px solid var(--color-surface-3)' }}>
              {a.name}
            </span>
          ))}
        </div>
      )}

      {/* Raid leaderboard - clean table, no card wrapper */}
      {hasRaid && (
        <div ref={r2} className="reveal mb-20">
          <div className="text-[11px] uppercase font-bold mb-4" style={{ color: 'var(--color-solar)', letterSpacing: '0.12em' }}>
            Raid DPS
          </div>

          {/* Top 3 - featured */}
          <div className="grid sm:grid-cols-3 gap-2.5 mb-4">
            {topPlayers.raidLeaderboard.slice(0, 3).map((p, i) => (
              <div key={p.name} className={`py-4 px-5 rounded-lg card-hover ${i === 0 ? 'glass-solar' : 'glass'}`}
                style={{ borderTopWidth: 2, borderTopStyle: 'solid', borderTopColor: podiumColors[i] }}>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="font-mono text-sm font-bold" style={{ color: podiumColors[i] }}>#{p.rank}</span>
                  <span className="font-mono text-sm font-bold" style={{ color: 'var(--color-solar)', fontVariantNumeric: 'tabular-nums' }}>
                    {p.dps ? `${(p.dps / 1e6).toFixed(2)}M` : '-'}
                  </span>
                </div>
                <div className="text-sm font-bold" style={{ color: 'var(--color-text-1)' }}>{p.name}</div>
                <div className="text-[13px]" style={{ color: 'var(--color-text-4)' }}>{p.realm} - {p.region}</div>
              </div>
            ))}
          </div>

          {/* Rest of leaderboard - compact rows */}
          <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--color-border)' }}>
            {topPlayers.raidLeaderboard.slice(3, 20).map((p, i) => (
              <div key={p.name + i} className="flex items-center justify-between px-5 py-2"
                style={{
                  background: i % 2 === 0 ? 'var(--color-void)' : 'var(--color-surface-1)',
                  borderTop: i > 0 ? '1px solid var(--color-surface-1)' : 'none',
                }}>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-[13px] font-bold w-5" style={{ color: 'var(--color-text-faint)', fontVariantNumeric: 'tabular-nums' }}>
                    {p.rank}
                  </span>
                  <span className="text-[15px] font-semibold" style={{ color: 'var(--color-text-2)' }}>{p.name}</span>
                  {p.region && <span className="text-[12px]" style={{ color: 'var(--color-text-faint)' }}>{p.region}</span>}
                </div>
                <span className="font-mono text-[14px] font-bold" style={{ color: 'var(--color-gold-dim)', fontVariantNumeric: 'tabular-nums' }}>
                  {p.dps ? `${(p.dps / 1e6).toFixed(2)}M` : '-'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Community figures - horizontal, no cards */}
      <div ref={r3} className="reveal">
        <div className="text-[11px] uppercase font-bold mb-5" style={{ color: 'var(--color-lunar)', letterSpacing: '0.12em' }}>
          Community
        </div>
        <div className="space-y-4">
          {topPlayers.communityFigures.map(f => (
            <div key={f.name} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border-light)' }}>
                <span className="text-[13px] font-bold" style={{ color: 'var(--color-lunar)' }}>{f.name[0]}</span>
              </div>
              <div>
                <span className="text-sm font-bold" style={{ color: 'var(--color-text-2)' }}>{f.name}</span>
                <span className="text-[13px] ml-2" style={{ color: 'var(--color-text-4)' }}>{f.role}</span>
                <p className="text-[14px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{f.notes}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
