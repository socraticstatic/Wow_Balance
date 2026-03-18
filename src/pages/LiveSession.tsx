import SectionHeading from '../components/SectionHeading';
import { useReveal } from '../hooks/useReveal';

// Live session data - pushed from PC watcher via GitHub API
import liveSessionJson from '../data/live-session.json';
const liveData: any = liveSessionJson;

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

      {/* ── Coaching Analysis ── */}
      <div className="reveal mb-16">
        <div className="text-[9px] uppercase font-bold mb-5" style={{ color: 'oklch(80% 0.18 80)', letterSpacing: '0.12em' }}>
          Session Coaching
        </div>
        <CoachingAnalysis summary={summary} fights={fights} />
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

// ── Coaching Engine ──
// Analyzes session data and generates specific advice from the Balance Druid skill's AoE mastery knowledge.

interface Advice {
  severity: 'critical' | 'warning' | 'tip' | 'praise';
  title: string;
  detail: string;
  metric?: string;
}

function analyzeSession(summary: any, fights: any[]): Advice[] {
  const advice: Advice[] = [];
  if (!fights || fights.length === 0) return advice;

  const { avgStarfallUptime, avgLunarPct } = summary;

  // ── Starfall Uptime ──
  const aoeFights = fights.filter((f: any) => f.targets >= 3);
  const avgAoeSfUptime = aoeFights.length > 0
    ? Math.round(aoeFights.reduce((s: number, f: any) => s + (f.starfallUptime || 0), 0) / aoeFights.length)
    : avgStarfallUptime;

  if (aoeFights.length > 0) {
    if (avgAoeSfUptime >= 85) {
      advice.push({
        severity: 'praise',
        title: 'Starfall uptime is excellent',
        detail: `${avgAoeSfUptime}% on AoE pulls. You're keeping Starfall rolling. This is the #1 indicator of a strong Boomkin. Keep it up.`,
        metric: `${avgAoeSfUptime}%`,
      });
    } else if (avgAoeSfUptime >= 65) {
      advice.push({
        severity: 'warning',
        title: 'Starfall uptime needs work on AoE pulls',
        detail: `${avgAoeSfUptime}% average on 3+ target fights. Target is 85%+. You're letting Starfall drop mid-pull. The fix: pool to 80 AP before every Starfall cast so you always have enough for the next one. Never cast builders when Starfall is down and you have 50+ AP.`,
        metric: `${avgAoeSfUptime}%`,
      });
    } else {
      advice.push({
        severity: 'critical',
        title: 'Starfall uptime is critically low on AoE',
        detail: `${avgAoeSfUptime}% on multi-target fights. This is your biggest DPS loss. At 3+ targets, Starfall should ALWAYS be active. The rotation is simple: Starfall > Builders > Starfall > Builders. If Starfall ever falls off during an AoE pull, that's wasted damage. Pool to 80 AP, cast Starfall, build AP, repeat.`,
        metric: `${avgAoeSfUptime}%`,
      });
    }
  }

  // ── AP Waste ──
  const avgApCapPerFight = fights.length > 0
    ? Math.round(fights.reduce((s: number, f: any) => s + (f.apCapped || 0), 0) / fights.length)
    : 0;

  if (avgApCapPerFight === 0) {
    advice.push({
      severity: 'praise',
      title: 'Zero AP waste',
      detail: 'You never capped Astral Power while casting builders. Perfect resource management. Every point of AP went into damage.',
      metric: '0',
    });
  } else if (avgApCapPerFight <= 2) {
    advice.push({
      severity: 'tip',
      title: 'Minor AP capping detected',
      detail: `~${avgApCapPerFight} capped builders per fight. This happens when you cast Wrath/Starfire at 90+ AP. The fix: at 80+ AP, stop building and spend. Starsurge on 1-2 targets, Starfall on 3+. The 80 AP rule exists for this reason.`,
      metric: String(avgApCapPerFight),
    });
  } else {
    advice.push({
      severity: 'critical',
      title: 'Significant AP waste',
      detail: `~${avgApCapPerFight} capped builders per fight. That's roughly ${avgApCapPerFight * 8} AP wasted per fight, which is ${Math.floor(avgApCapPerFight * 8 / 50)} free Starfalls you're losing. Watch your AP bar. At 80+, STOP BUILDING and SPEND. This is likely your single biggest DPS gain right now.`,
      metric: String(avgApCapPerFight),
    });
  }

  // ── Eclipse Distribution ──
  if (aoeFights.length > 0) {
    if (avgLunarPct >= 60) {
      advice.push({
        severity: 'praise',
        title: 'Lunar Eclipse prioritization is correct',
        detail: `${avgLunarPct}% Lunar in AoE. Starfire cleaves during Lunar Eclipse, making it far superior to Solar for multi-target. You're managing your Eclipse transitions well.`,
        metric: `${avgLunarPct}%`,
      });
    } else if (avgLunarPct >= 45) {
      advice.push({
        severity: 'warning',
        title: 'Spend more time in Lunar Eclipse during AoE',
        detail: `${avgLunarPct}% Lunar. Target is 60%+. Starfire cleaves nearby targets during Lunar Eclipse, making every builder a multi-target spell. In AoE: enter Lunar (2 Starfire casts), stay in Lunar as long as possible, and when it ends, rush back to Lunar. Solar Eclipse is just a transition phase in AoE.`,
        metric: `${avgLunarPct}%`,
      });
    } else {
      advice.push({
        severity: 'critical',
        title: 'Lunar Eclipse uptime is too low for AoE',
        detail: `${avgLunarPct}% Lunar. In AoE situations, Lunar Eclipse is KING because Starfire cleaves all nearby targets. You're spending too much time in Solar or out of Eclipse entirely. Prioritize entering Lunar: cast 2 Starfire to trigger it, then stay. Every second in Lunar = free cleave damage on all targets.`,
        metric: `${avgLunarPct}%`,
      });
    }
  }

  // ── Starfall Damage Share ──
  const avgSfDmgPct = fights.length > 0
    ? Math.round(fights.reduce((s: number, f: any) => s + (f.starfallDamagePct || 0), 0) / fights.length)
    : 0;

  if (aoeFights.length > 0 && avgSfDmgPct < 20) {
    advice.push({
      severity: 'warning',
      title: 'Starfall damage share is low',
      detail: `Starfall is only ${avgSfDmgPct}% of your total damage. On AoE pulls with 4+ targets, Starfall should be 30-45% of your damage. This usually means either low Starfall uptime or not enough targets in the Starfall radius. Position yourself where Starfall hits all mobs.`,
      metric: `${avgSfDmgPct}%`,
    });
  }

  // ── Target Count Awareness ──
  const stFights = fights.filter((f: any) => f.targets <= 2);
  const stWithStarfall = stFights.filter((f: any) => f.starfallUptime > 30);
  if (stWithStarfall.length > 0) {
    advice.push({
      severity: 'tip',
      title: 'Starfall on single target is wasteful',
      detail: `${stWithStarfall.length} fight(s) with 1-2 targets had high Starfall uptime. At under 3 targets, Starsurge deals more damage per AP (6,000 DPAP vs ${Math.round(18000 * 8 * 2 / 50).toLocaleString()} for 2-target Starfall). Switch to Starsurge on 1-2 targets, Starfall at 3+.`,
    });
  }

  // ── Fight Duration Pattern ──
  const shortFights = fights.filter((f: any) => f.duration < 15);
  if (shortFights.length > fights.length * 0.5 && fights.length > 3) {
    advice.push({
      severity: 'tip',
      title: 'Many short fights detected',
      detail: `${shortFights.length} of ${fights.length} fights were under 15 seconds. Balance Druid ramps over time, so short fights won't show your true potential. This is normal for open-world questing. Your metrics will improve in dungeons and raids where fights last 30+ seconds.`,
    });
  }

  // ── DPS Trend ──
  if (fights.length >= 4) {
    const firstHalf = fights.slice(0, Math.floor(fights.length / 2));
    const secondHalf = fights.slice(Math.floor(fights.length / 2));
    const firstAvg = firstHalf.reduce((s: number, f: any) => s + (f.dps || 0), 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((s: number, f: any) => s + (f.dps || 0), 0) / secondHalf.length;
    const improvement = ((secondAvg - firstAvg) / firstAvg) * 100;

    if (improvement > 10) {
      advice.push({
        severity: 'praise',
        title: 'DPS is trending upward',
        detail: `Your DPS improved ${Math.round(improvement)}% from the first half to the second half of this session. You're warming up and executing better as you play. Keep the momentum.`,
        metric: `+${Math.round(improvement)}%`,
      });
    } else if (improvement < -15) {
      advice.push({
        severity: 'warning',
        title: 'DPS is declining',
        detail: `Your DPS dropped ${Math.round(Math.abs(improvement))}% from early fights to late fights. This could be fatigue, harder content, or sloppy rotation over time. Take a break or refocus on the fundamentals: Starfall uptime > AP management > Lunar Eclipse.`,
        metric: `${Math.round(improvement)}%`,
      });
    }
  }

  // ── Rotation Error Count ──
  const totalErrors = fights.reduce((s: number, f: any) => s + (f.errorCount || 0), 0);
  if (totalErrors === 0 && fights.length > 2) {
    advice.push({
      severity: 'praise',
      title: 'Clean rotation',
      detail: 'Zero rotation errors detected across all fights. Your cast sequence is disciplined.',
    });
  } else if (totalErrors > fights.length * 3) {
    advice.push({
      severity: 'warning',
      title: `${totalErrors} rotation errors this session`,
      detail: 'Most errors are AP capping (casting builders when AP is nearly full). The single biggest fix: watch your AP bar. At 80, spend. At 50 with 3+ targets, Starfall. At 30 with 1-2 targets, Starsurge. Build only when you have room.',
    });
  }

  // ── Overall Assessment ──
  const grades = summary.grades || {};
  const sCount = grades['S'] || 0;
  const aCount = grades['A'] || 0;
  const goodPct = fights.length > 0 ? Math.round(((sCount + aCount) / fights.length) * 100) : 0;

  if (goodPct >= 80) {
    advice.push({
      severity: 'praise',
      title: 'Outstanding session',
      detail: `${goodPct}% of fights graded A or S. You're playing at a high level. Focus on the few remaining imperfections to push into truly elite territory.`,
    });
  } else if (goodPct >= 50) {
    advice.push({
      severity: 'tip',
      title: 'Solid session with room to grow',
      detail: `${goodPct}% A/S grades. The fights that dropped to B or C usually have one common issue. Check the advice above to find your pattern and fix it.`,
    });
  } else if (fights.length > 2) {
    advice.push({
      severity: 'warning',
      title: 'Session needs improvement',
      detail: `Only ${goodPct}% A/S grades. Don't try to fix everything at once. Pick ONE thing from the advice above (usually Starfall uptime or AP waste) and focus on that for your next session. Mastery comes from deliberate practice on one mechanic at a time.`,
    });
  }

  return advice;
}

const severityStyles: Record<string, { border: string; icon: string; iconColor: string; bg: string }> = {
  critical: { border: 'oklch(72% 0.16 30)', icon: '!', iconColor: 'oklch(72% 0.16 30)', bg: 'oklch(72% 0.16 30 / 0.06)' },
  warning: { border: 'oklch(80% 0.18 80)', icon: '\u26A0', iconColor: 'oklch(80% 0.18 80)', bg: 'oklch(80% 0.18 80 / 0.04)' },
  tip: { border: 'oklch(72% 0.18 270)', icon: '\u2139', iconColor: 'oklch(72% 0.18 270)', bg: 'oklch(72% 0.18 270 / 0.04)' },
  praise: { border: 'oklch(68% 0.18 155)', icon: '\u2713', iconColor: 'oklch(68% 0.18 155)', bg: 'oklch(68% 0.18 155 / 0.04)' },
};

function CoachingAnalysis({ summary, fights }: { summary: any; fights: any[] }) {
  const advice = analyzeSession(summary, fights);

  if (advice.length === 0) {
    return (
      <div className="p-6 rounded-lg glass">
        <p className="text-sm" style={{ color: 'oklch(72% 0.008 55)' }}>
          No fights recorded yet. Play some combat encounters and /reload to see coaching advice.
        </p>
      </div>
    );
  }

  // Sort: critical first, then warning, tip, praise
  const order = ['critical', 'warning', 'tip', 'praise'];
  const sorted = [...advice].sort((a, b) => order.indexOf(a.severity) - order.indexOf(b.severity));

  return (
    <div className="space-y-3">
      {sorted.map((a, i) => {
        const s = severityStyles[a.severity];
        return (
          <div key={i} className="rounded-lg overflow-hidden" style={{ background: s.bg, borderLeft: `3px solid ${s.border}` }}>
            <div className="px-5 py-4">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5"
                  style={{ color: s.iconColor, background: `${s.iconColor}15`, border: `1px solid ${s.iconColor}30` }}>
                  {s.icon}
                </span>
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-3 mb-1.5">
                    <h4 className="text-sm font-bold" style={{ color: s.iconColor }}>
                      {a.title}
                    </h4>
                    {a.metric && (
                      <span className="text-xs font-mono font-bold shrink-0" style={{ color: s.iconColor, fontVariantNumeric: 'tabular-nums' }}>
                        {a.metric}
                      </span>
                    )}
                  </div>
                  <p className="text-[13px]" style={{ color: 'oklch(84% 0.006 55)', lineHeight: 1.75 }}>
                    {a.detail}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
