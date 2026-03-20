// src/hooks/useCoaching.ts
import { useMemo } from 'react';
import type { Fight, SessionSummary, CoachingOutput, CoachingTip, NextFocus } from '../types/live-session';

type Phase = 'leveling' | 'fresh90' | 'geared';

function getPhase(level: number, ilvl: number): Phase {
  if (level < 90) return 'leveling';
  if (ilvl < 230) return 'fresh90';
  return 'geared';
}

const THRESHOLDS: Record<Phase, { starfall: [number, number]; lunar: [number, number]; apCap: [number, number] }> = {
  leveling:  { starfall: [50, 65], lunar: [35, 50], apCap: [5, 3] },
  fresh90:   { starfall: [60, 75], lunar: [45, 60], apCap: [3, 2] },
  geared:    { starfall: [75, 85], lunar: [55, 70], apCap: [2, 1] },
};

function analyzeFights(fights: Fight[], phase: Phase): CoachingTip[] {
  const tips: CoachingTip[] = [];
  if (fights.length === 0) return tips;

  const t = THRESHOLDS[phase];
  const avgStarfall = fights.reduce((s, f) => s + f.starfallUptime, 0) / fights.length;
  const avgLunar = fights.reduce((s, f) => s + f.lunarPct, 0) / fights.length;
  const totalApCapped = fights.reduce((s, f) => s + f.apCapped, 0);
  const avgTargets = fights.reduce((s, f) => s + f.uniqueTargets, 0) / fights.length;

  if (avgTargets >= 3) {
    if (avgStarfall < t.starfall[0]) {
      tips.push({ severity: 'critical', title: 'Starfall Uptime Critical', detail: `${Math.round(avgStarfall)}% average. Target: ${t.starfall[1]}%+. Pool to 80 AP before Starfall so you can maintain it.`, metric: 'starfallUptime' });
    } else if (avgStarfall < t.starfall[1]) {
      tips.push({ severity: 'warning', title: 'Starfall Uptime Low', detail: `${Math.round(avgStarfall)}% average. Target: ${t.starfall[1]}%+. Pre-cast Starfall before pulls when possible.`, metric: 'starfallUptime' });
    } else {
      tips.push({ severity: 'praise', title: 'Starfall Uptime Strong', detail: `${Math.round(avgStarfall)}% average. Solid maintenance.`, metric: 'starfallUptime' });
    }
  }

  if (avgTargets >= 3) {
    if (avgLunar < t.lunar[0]) {
      tips.push({ severity: 'critical', title: 'Not Enough Lunar Eclipse', detail: `${Math.round(avgLunar)}% Lunar. Starfire cleaves in Lunar Eclipse - prioritize it in AoE.`, metric: 'lunarPct' });
    } else if (avgLunar < t.lunar[1]) {
      tips.push({ severity: 'warning', title: 'Lunar Eclipse Could Be Higher', detail: `${Math.round(avgLunar)}% Lunar. Cast Starfire to trigger Lunar before pressing Eclipse button.`, metric: 'lunarPct' });
    }
  }

  if (totalApCapped > t.apCap[0] * fights.length) {
    tips.push({ severity: 'critical', title: 'Astral Power Wasted', detail: `Capped ${totalApCapped} times across ${fights.length} fights. At 80+ AP, stop building and spend.`, metric: 'apCapped' });
  } else if (totalApCapped > t.apCap[1] * fights.length) {
    tips.push({ severity: 'warning', title: 'Minor AP Waste', detail: `Capped ${totalApCapped} times. Watch the AP bar around 80+.`, metric: 'apCapped' });
  } else if (totalApCapped === 0) {
    tips.push({ severity: 'praise', title: 'Zero AP Waste', detail: 'Perfect resource management this session.' });
  }

  const grades = fights.reduce((acc, f) => { acc[f.grade] = (acc[f.grade] || 0) + 1; return acc; }, {} as Record<string, number>);
  const goodPct = ((grades['S'] || 0) + (grades['A'] || 0)) / fights.length * 100;
  if (goodPct >= 80) {
    tips.push({ severity: 'praise', title: 'Excellent Session', detail: `${Math.round(goodPct)}% of fights graded A or S.` });
  } else if (goodPct < 50) {
    tips.push({ severity: 'warning', title: 'Room to Improve', detail: `Only ${Math.round(goodPct)}% A/S grades. Focus on the critical tips above.` });
  }

  return tips.sort((a, b) => {
    const order = { critical: 0, warning: 1, tip: 2, praise: 3 };
    return order[a.severity] - order[b.severity];
  });
}

function calculateTrends(history: SessionSummary[]): CoachingOutput['trends'] {
  if (history.length < 2) return [];
  const trends: CoachingOutput['trends'] = [];

  for (const metric of ['avgDps', 'avgStarfallUptime', 'avgLunarPct'] as const) {
    const values = history.slice(-5).map(s => s[metric]);
    const first = values[0];
    const last = values[values.length - 1];
    const change = first > 0 ? ((last - first) / first) * 100 : 0;
    trends.push({
      metric,
      values,
      direction: change > 10 ? 'up' : change < -10 ? 'down' : 'flat',
    });
  }

  return trends;
}

function pickNextFocus(tips: CoachingTip[], fights: Fight[], phase: Phase): NextFocus | null {
  const actionable = tips.filter(t => t.severity === 'critical' || t.severity === 'warning');
  if (actionable.length === 0) return null;

  const worst = actionable[0];
  const t = THRESHOLDS[phase];

  if (worst.metric === 'starfallUptime') {
    const current = fights.reduce((s, f) => s + f.starfallUptime, 0) / fights.length;
    return { metric: 'Starfall Uptime', current: Math.round(current), target: t.starfall[1], tip: 'Pool to 80 AP before Starfall. Pre-cast before pulls.' };
  }
  if (worst.metric === 'lunarPct') {
    const current = fights.reduce((s, f) => s + f.lunarPct, 0) / fights.length;
    return { metric: 'Lunar Eclipse %', current: Math.round(current), target: t.lunar[1], tip: 'Cast Starfire to set Eclipse type, then press Lunar Eclipse.' };
  }
  if (worst.metric === 'apCapped') {
    const current = fights.reduce((s, f) => s + f.apCapped, 0);
    return { metric: 'AP Waste', current, target: 0, tip: 'At 80+ AP, stop building. Spend on Starfall (AoE) or Starsurge (ST).' };
  }

  return null;
}

export function useCoaching(
  fights: Fight[],
  sessionHistory: SessionSummary[],
  level: number,
  ilvl: number,
): CoachingOutput {
  return useMemo(() => {
    const phase = getPhase(level, ilvl);
    const tips = analyzeFights(fights, phase);
    const trends = calculateTrends(sessionHistory);
    const nextFocus = pickNextFocus(tips, fights, phase);

    let sessionReport: CoachingOutput['sessionReport'] = null;
    if (fights.length > 0 && sessionHistory.length > 0) {
      const prev = sessionHistory[sessionHistory.length - 1];
      const avgDps = fights.reduce((s, f) => s + f.dps, 0) / fights.length;
      const avgStarfall = fights.reduce((s, f) => s + f.starfallUptime, 0) / fights.length;
      const grades = fights.reduce((acc, f) => { acc[f.grade] = (acc[f.grade] || 0) + 1; return acc; }, {} as Record<string, number>);

      sessionReport = {
        dpsChange: prev.avgDps > 0 ? ((avgDps - prev.avgDps) / prev.avgDps) * 100 : 0,
        starfallChange: prev.avgStarfallUptime > 0 ? avgStarfall - prev.avgStarfallUptime : 0,
        bestFight: fights.reduce((best, f) => f.dps > (best?.dps || 0) ? f : best, null as Fight | null),
        worstHabit: tips.find(t => t.severity === 'critical')?.title || tips.find(t => t.severity === 'warning')?.title || 'None detected',
        gradeBreakdown: grades,
      };
    }

    return { tips, sessionReport, nextFocus, trends };
  }, [fights, sessionHistory, level, ilvl]);
}
