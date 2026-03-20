import { useState } from 'react';
import { useProgression } from '../context/ProgressionContext';
import type { LiveSessionData, SessionState, CoachingOutput } from '../types/live-session';

interface Props {
  data: LiveSessionData | null;
  sessionState: SessionState;
  coaching: CoachingOutput;
  isLocal: boolean;
}

export default function MissionBriefing({ data, sessionState, coaching, isLocal }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const { level, ilvl, phase } = useProgression();

  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        className="fixed top-16 left-1/2 -translate-x-1/2 z-40 glass px-4 py-1.5 rounded-full text-[11px] font-bold uppercase cursor-pointer"
        style={{ color: 'var(--color-solar)', letterSpacing: '0.1em', border: '1px solid color-mix(in oklch, var(--color-solar) 20%, transparent)' }}
      >
        Mission Briefing
      </button>
    );
  }

  return (
    <div className="sticky top-14 z-30 mx-4 sm:mx-8 mb-6">
      <div className="glass rounded-xl px-5 py-4" style={{ borderColor: 'color-mix(in oklch, var(--color-solar) 15%, transparent)' }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full" style={{
              background: sessionState === 'mid' ? 'var(--color-nature)' : sessionState === 'post' ? 'var(--color-solar)' : 'var(--color-text-ghost)',
              boxShadow: sessionState === 'mid' ? '0 0 8px var(--color-nature)' : 'none',
            }} />
            <h3 className="text-[13px] font-bold uppercase" style={{ color: 'var(--color-solar)', letterSpacing: '0.1em' }}>
              {sessionState === 'pre' && "Tonight's Priorities"}
              {sessionState === 'mid' && 'Live Session'}
              {sessionState === 'post' && 'Session Report'}
            </h3>
            {isLocal && (
              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'color-mix(in oklch, var(--color-nature) 15%, transparent)', color: 'var(--color-nature)' }}>
                LIVE
              </span>
            )}
          </div>
          <button onClick={() => setCollapsed(true)} className="text-[11px] cursor-pointer" style={{ color: 'var(--color-text-ghost)' }}>
            Collapse
          </button>
        </div>

        {sessionState === 'pre' && <PreSession data={data} coaching={coaching} level={level} ilvl={ilvl} phase={phase} />}
        {sessionState === 'mid' && <MidSession data={data} />}
        {sessionState === 'post' && <PostSession data={data} coaching={coaching} />}
      </div>
    </div>
  );
}

function PreSession({ data, coaching, level, ilvl }: {
  data: LiveSessionData | null;
  coaching: CoachingOutput;
  level: number;
  ilvl: number;
  phase: string;
}) {
  const priorities: string[] = [];

  if (data?.presence && ilvl < 170) {
    priorities.push(`Gear up - current ilvl ${ilvl}. Queue Normal Dungeons for ilvl 214 drops.`);
  }

  if (level < 90) {
    priorities.push(`Level to 90 (currently ${level}). Complete campaign quests for fastest XP.`);
  }

  if (coaching.nextFocus) {
    priorities.push(`${coaching.nextFocus.metric}: ${coaching.nextFocus.current}% \u2192 ${coaching.nextFocus.target}%. ${coaching.nextFocus.tip}`);
  }

  if (priorities.length === 0) {
    priorities.push('No recent data. Log in and play to generate priorities.');
  }

  return (
    <ol className="space-y-2">
      {priorities.slice(0, 3).map((p, i) => (
        <li key={i} className="flex gap-3 text-[13px]" style={{ color: 'var(--color-text-1)' }}>
          <span className="font-bold" style={{ color: 'var(--color-solar)', minWidth: '1.2em' }}>{i + 1}.</span>
          {p}
        </li>
      ))}
    </ol>
  );
}

function MidSession({ data }: { data: LiveSessionData | null }) {
  const last = data?.recentFights?.[data.recentFights.length - 1];
  if (!last) return <p className="text-[13px]" style={{ color: 'var(--color-text-3)' }}>Waiting for combat data...</p>;

  return (
    <div className="flex items-center gap-8">
      <div>
        <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--color-text-ghost)', letterSpacing: '0.1em' }}>Last Fight</div>
        <div className="text-2xl font-bold" style={{ color: 'var(--color-solar)' }}>{last.dps.toLocaleString()} DPS</div>
      </div>
      <div>
        <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--color-text-ghost)', letterSpacing: '0.1em' }}>Starfall</div>
        <div className="text-2xl font-bold" style={{ color: 'var(--color-lunar)' }}>{last.starfallUptime}%</div>
      </div>
      <div>
        <div className="text-[10px] uppercase font-bold" style={{ color: 'var(--color-text-ghost)', letterSpacing: '0.1em' }}>Grade</div>
        <div className="text-2xl font-bold" style={{ color: 'var(--color-solar)' }}>{last.grade}</div>
      </div>
      <div className="text-[11px] ml-auto" style={{ color: 'var(--color-text-3)' }}>
        {data?.summary?.totalFights || 0} fights this session
      </div>
    </div>
  );
}

function PostSession({ coaching }: { data: LiveSessionData | null; coaching: CoachingOutput }) {
  const report = coaching.sessionReport;

  return (
    <div className="space-y-3">
      {report && (
        <div className="flex items-center gap-6 text-[13px]">
          <span style={{ color: report.dpsChange >= 0 ? 'var(--color-nature)' : 'var(--color-error)' }}>
            DPS {report.dpsChange >= 0 ? '+' : ''}{Math.round(report.dpsChange)}% vs last session
          </span>
          {report.starfallChange !== 0 && (
            <span style={{ color: report.starfallChange >= 0 ? 'var(--color-nature)' : 'var(--color-error)' }}>
              Starfall {report.starfallChange >= 0 ? '+' : ''}{Math.round(report.starfallChange)}% uptime
            </span>
          )}
        </div>
      )}
      {coaching.nextFocus && (
        <div className="text-[13px]" style={{ color: 'var(--color-text-1)' }}>
          <span className="font-bold" style={{ color: 'var(--color-solar)' }}>Next session focus: </span>
          {coaching.nextFocus.metric} ({coaching.nextFocus.current}% \u2192 {coaching.nextFocus.target}%)
        </div>
      )}
    </div>
  );
}
