import SectionHeading from '../components/SectionHeading';
import { useReveal } from '../hooks/useReveal';

// Live session data - may not exist if watcher hasn't run yet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let liveData: any = null;
try {
  // This will fail at build time if the file doesn't exist, which is fine
  liveData = null; // Will be populated when watcher creates live-session.json
} catch {
  // No live data yet
}

const gradeColors: Record<string, string> = {
  S: 'oklch(80% 0.18 80)',
  A: 'oklch(72% 0.18 270)',
  B: 'oklch(72% 0.14 240)',
  C: 'oklch(68% 0.18 155)',
  D: 'oklch(82% 0.008 55)',
  F: 'oklch(72% 0.16 30)',
};

export default function LiveSession() {
  const r1 = useReveal();
  const r2 = useReveal();

  // If no live data, show setup instructions
  if (!liveData) {
    return (
      <section className="px-6 sm:px-10 py-32 max-w-6xl mx-auto relative z-10">
        <div ref={r1} className="reveal">
          <SectionHeading
            title="Live Session"
            sub="Real-time combat analysis from your in-game companion addon."
            accent="lunar"
          />
        </div>

        <div ref={r2} className="reveal">
          <div className="p-8 rounded-lg glass max-w-2xl">
            <h3 className="text-lg font-bold mb-4" style={{ color: 'oklch(80% 0.18 80)' }}>
              Setup Required
            </h3>
            <ol className="space-y-4 text-sm" style={{ color: 'oklch(84% 0.008 55)' }}>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                  style={{ color: 'oklch(80% 0.18 80)', background: 'oklch(80% 0.18 80 / 0.1)' }}>1</span>
                <div>
                  <strong>Install the addon.</strong> Copy <code className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'oklch(14% 0.012 45)', color: 'oklch(80% 0.18 80)' }}>companion-addon/BalanceDossier/</code> to your WoW AddOns folder.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                  style={{ color: 'oklch(80% 0.18 80)', background: 'oklch(80% 0.18 80 / 0.1)' }}>2</span>
                <div>
                  <strong>Start the watcher.</strong> Run <code className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'oklch(14% 0.012 45)', color: 'oklch(80% 0.18 80)' }}>npx tsx companion-addon/watcher.ts</code> in a terminal.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                  style={{ color: 'oklch(80% 0.18 80)', background: 'oklch(80% 0.18 80 / 0.1)' }}>3</span>
                <div>
                  <strong>Play and /reload.</strong> The addon tracks every fight. Type <code className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'oklch(14% 0.012 45)', color: 'oklch(80% 0.18 80)' }}>/reload</code> in-game to sync data.
                </div>
              </li>
            </ol>
            <p className="mt-6 text-xs" style={{ color: 'oklch(68% 0.008 55)' }}>
              Once connected, this page shows your live combat data: Starfall uptime, AP waste, Eclipse distribution, and a grade for every fight.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const data = liveData.default || liveData;
  const summary = data.summary;
  const fights = data.recentFights || [];
  const bests = data.bests;
  const presence = data.presence;

  return (
    <section className="px-6 sm:px-10 py-32 max-w-6xl mx-auto relative z-10">
      <div ref={r1} className="reveal">
        <SectionHeading
          title="Live Session"
          sub={`${summary.totalFights} fights tracked. Last update: ${new Date(data.lastUpdate).toLocaleTimeString()}`}
          accent="lunar"
        />
      </div>

      {/* Summary cards */}
      <div ref={r2} className="reveal grid grid-cols-2 lg:grid-cols-4 gap-3 mb-16">
        <StatCard label="Avg DPS" value={summary.avgDps.toLocaleString()} color="oklch(80% 0.18 80)" />
        <StatCard label="Starfall Uptime" value={`${summary.avgStarfallUptime}%`} color="oklch(72% 0.18 270)" />
        <StatCard label="Lunar Eclipse" value={`${summary.avgLunarPct}%`} color="oklch(72% 0.14 240)" />
        <StatCard label="AP Wasted" value={String(summary.totalApWasted)} color={summary.totalApWasted > 20 ? 'oklch(72% 0.16 30)' : 'oklch(68% 0.18 155)'} />
      </div>

      {/* Presence: Last Played, Location, Quests */}
      {presence && (
        <div className="reveal mb-16">
          <div className="grid sm:grid-cols-3 gap-3 mb-8">
            {/* Last Played */}
            <div className="p-5 rounded-lg glass">
              <div className="text-[9px] uppercase font-bold mb-2" style={{ color: 'oklch(80% 0.18 80)', letterSpacing: '0.1em' }}>Last Played</div>
              <div className="text-base font-bold mb-1" style={{ color: 'oklch(95% 0.005 60)' }}>
                {presence.lastPlayed ? new Date(presence.lastPlayed).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'Unknown'}
              </div>
              <div className="text-xs" style={{ color: 'oklch(72% 0.008 55)' }}>
                {presence.lastPlayed ? new Date(presence.lastPlayed).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : ''}
              </div>
            </div>

            {/* Location */}
            <div className="p-5 rounded-lg glass">
              <div className="text-[9px] uppercase font-bold mb-2" style={{ color: 'oklch(72% 0.18 270)', letterSpacing: '0.1em' }}>Location</div>
              <div className="text-base font-bold mb-1" style={{ color: 'oklch(95% 0.005 60)' }}>
                {presence.zone || 'Unknown'}
              </div>
              <div className="text-xs" style={{ color: 'oklch(72% 0.008 55)' }}>
                {presence.subZone ? `${presence.subZone} ` : ''}
                {presence.x && presence.y ? `(${presence.x}, ${presence.y})` : ''}
              </div>
            </div>

            {/* Level / iLvl */}
            <div className="p-5 rounded-lg glass">
              <div className="text-[9px] uppercase font-bold mb-2" style={{ color: 'oklch(68% 0.18 155)', letterSpacing: '0.1em' }}>Character</div>
              <div className="flex items-baseline gap-4">
                <div>
                  <div className="text-2xl font-bold font-mono" style={{ color: 'oklch(95% 0.005 60)', fontVariantNumeric: 'tabular-nums' }}>{presence.level}</div>
                  <div className="text-[9px] uppercase" style={{ color: 'oklch(68% 0.008 55)' }}>Level</div>
                </div>
                <div>
                  <div className="text-2xl font-bold font-mono" style={{ color: 'oklch(80% 0.18 80)', fontVariantNumeric: 'tabular-nums' }}>{presence.ilvl}</div>
                  <div className="text-[9px] uppercase" style={{ color: 'oklch(68% 0.008 55)' }}>iLvl</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quest Log */}
          {presence.quests && presence.quests.length > 0 && (
            <div>
              <div className="text-[9px] uppercase font-bold mb-4" style={{ color: 'oklch(80% 0.18 80)', letterSpacing: '0.12em' }}>
                Active Quests ({presence.questCount})
              </div>
              <div className="rounded-lg overflow-hidden glass">
                {presence.quests.slice(0, 20).map((q: any, i: number) => (
                  <div key={q.id || i}
                    className="px-5 py-3 flex items-start justify-between gap-4 row-hover"
                    style={{ borderTop: i > 0 ? '1px solid oklch(14% 0.012 45)' : 'none' }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold" style={{
                          color: q.isComplete ? 'oklch(68% 0.18 155)' : 'oklch(90% 0.006 60)',
                        }}>
                          {q.isComplete ? '\u2713 ' : ''}{q.title}
                        </span>
                        {q.frequency !== 'normal' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                            style={{
                              color: q.frequency === 'daily' ? 'oklch(72% 0.18 270)' : 'oklch(80% 0.18 80)',
                              background: q.frequency === 'daily' ? 'oklch(72% 0.18 270 / 0.1)' : 'oklch(80% 0.18 80 / 0.1)',
                            }}>
                            {q.frequency}
                          </span>
                        )}
                      </div>
                      {q.objectives && q.objectives.length > 0 && (
                        <div className="mt-1 space-y-0.5">
                          {q.objectives.map((obj: any, j: number) => (
                            <div key={j} className="text-xs flex items-center gap-1.5" style={{
                              color: obj.finished ? 'oklch(60% 0.12 155)' : 'oklch(72% 0.008 55)',
                            }}>
                              <span className="w-1 h-1 rounded-full" style={{
                                background: obj.finished ? 'oklch(60% 0.12 155)' : 'oklch(40% 0.006 45)',
                              }} />
                              {obj.text}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {q.level > 0 && (
                      <span className="text-[10px] font-mono shrink-0" style={{ color: 'oklch(60% 0.008 55)', fontVariantNumeric: 'tabular-nums' }}>
                        Lv{q.level}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fight timeline */}
      <div className="reveal mb-16">
        <div className="text-[9px] uppercase font-bold mb-5" style={{ color: 'oklch(72% 0.008 55)', letterSpacing: '0.12em' }}>
          Recent Fights
        </div>
        <div className="space-y-2">
          {fights.map((f: any, i: number) => (
            <div key={i} className="rounded-lg glass row-hover px-5 py-3 grid grid-cols-8 gap-3 items-center text-xs">
              <div className="font-mono text-lg font-bold" style={{ color: gradeColors[f.grade] || 'oklch(82% 0.008 55)' }}>
                {f.grade}
              </div>
              <div>
                <div style={{ color: 'oklch(68% 0.008 55)' }}>DPS</div>
                <div className="font-mono font-bold" style={{ color: 'oklch(80% 0.18 80)', fontVariantNumeric: 'tabular-nums' }}>
                  {(f.dps / 1000).toFixed(1)}k
                </div>
              </div>
              <div>
                <div style={{ color: 'oklch(68% 0.008 55)' }}>Starfall</div>
                <div className="font-mono font-bold" style={{ color: 'oklch(72% 0.18 270)', fontVariantNumeric: 'tabular-nums' }}>
                  {f.starfallUptime}%
                </div>
              </div>
              <div>
                <div style={{ color: 'oklch(68% 0.008 55)' }}>Lunar</div>
                <div className="font-mono font-bold" style={{ color: 'oklch(72% 0.14 240)', fontVariantNumeric: 'tabular-nums' }}>
                  {f.lunarPct}%
                </div>
              </div>
              <div>
                <div style={{ color: 'oklch(68% 0.008 55)' }}>Targets</div>
                <div className="font-mono font-bold" style={{ fontVariantNumeric: 'tabular-nums', color: 'oklch(84% 0.008 55)' }}>
                  {f.targets}
                </div>
              </div>
              <div>
                <div style={{ color: 'oklch(68% 0.008 55)' }}>SF Dmg</div>
                <div className="font-mono font-bold" style={{ fontVariantNumeric: 'tabular-nums', color: 'oklch(84% 0.008 55)' }}>
                  {f.starfallDamagePct}%
                </div>
              </div>
              <div>
                <div style={{ color: 'oklch(68% 0.008 55)' }}>AP Cap</div>
                <div className="font-mono font-bold" style={{ color: f.apCapped > 0 ? 'oklch(72% 0.16 30)' : 'oklch(68% 0.18 155)', fontVariantNumeric: 'tabular-nums' }}>
                  {f.apCapped}
                </div>
              </div>
              <div>
                <div style={{ color: 'oklch(68% 0.008 55)' }}>Time</div>
                <div className="font-mono" style={{ fontVariantNumeric: 'tabular-nums', color: 'oklch(84% 0.008 55)' }}>
                  {f.duration}s
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal bests */}
      {bests && (
        <div className="reveal">
          <div className="text-[9px] uppercase font-bold mb-5" style={{ color: 'oklch(80% 0.18 80)', letterSpacing: '0.12em' }}>
            Personal Bests
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="Highest DPS" value={bests.highestDps.toLocaleString()} color="oklch(80% 0.18 80)" />
            <StatCard label="Best Grade" value={bests.bestGrade} color={gradeColors[bests.bestGrade] || 'oklch(82% 0.008 55)'} />
            <StatCard label="Best SF Uptime" value={`${bests.bestStarfallUptime}%`} color="oklch(72% 0.18 270)" />
            <StatCard label="Longest Fight" value={`${bests.longestFight}s`} color="oklch(84% 0.008 55)" />
          </div>
        </div>
      )}
    </section>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="p-4 rounded-lg glass">
      <div className="text-[9px] uppercase font-bold mb-2" style={{ color: 'oklch(68% 0.008 55)', letterSpacing: '0.1em' }}>{label}</div>
      <div className="text-2xl font-bold font-mono" style={{ color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
    </div>
  );
}
