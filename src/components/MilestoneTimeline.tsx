/**
 * Visual milestone timeline for character progression.
 * Shows current position and what unlocks at each threshold.
 */

interface Milestone {
  label: string;
  threshold: number; // ilvl or level
  unlocks: string;
  color: string;
}

const levelMilestones: Milestone[] = [
  { label: 'Current', threshold: 0, unlocks: '', color: 'oklch(72% 0.18 30)' },
  { label: 'Lv 90', threshold: 90, unlocks: 'World quests, delves, endgame', color: 'oklch(80% 0.18 80)' },
];

const ilvlMilestones: Milestone[] = [
  { label: 'Current', threshold: 0, unlocks: '', color: 'oklch(72% 0.18 30)' },
  { label: '220', threshold: 220, unlocks: 'Heroic dungeons, LFR', color: 'oklch(68% 0.16 285)' },
  { label: '235', threshold: 235, unlocks: 'M0, Normal raid', color: 'oklch(80% 0.18 80)' },
  { label: '255', threshold: 255, unlocks: 'Heroic raid', color: 'oklch(68% 0.18 155)' },
  { label: '272', threshold: 272, unlocks: 'Myth track, Mythic raid', color: 'oklch(72% 0.18 30)' },
  { label: '289', threshold: 289, unlocks: 'Myth 6/6 cap', color: 'oklch(80% 0.18 80)' },
];

interface Props {
  level: number | null;
  ilvl: number;
}

export default function MilestoneTimeline({ level, ilvl }: Props) {
  const isLeveling = level !== null && level < 90;
  const milestones = isLeveling ? levelMilestones : ilvlMilestones;
  const currentValue = isLeveling ? (level || 0) : ilvl;
  const maxValue = isLeveling ? 90 : 289;
  const minValue = isLeveling ? 80 : 140; // Start range from reasonable minimum
  const pct = Math.min(Math.max((currentValue - minValue) / (maxValue - minValue), 0), 1) * 100;

  // Find next milestone
  const nextMilestone = milestones.find(m => m.threshold > currentValue);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="text-[9px] uppercase font-bold" style={{ color: 'oklch(78% 0.16 60)', letterSpacing: '0.12em' }}>
          {isLeveling ? 'Level Progress' : 'Gear Progress'}
        </div>
        {nextMilestone && (
          <div className="text-[10px]" style={{ color: 'oklch(48% 0.01 50)' }}>
            Next: <span style={{ color: nextMilestone.color }}>{nextMilestone.label}</span> - {nextMilestone.unlocks}
          </div>
        )}
      </div>

      {/* Progress bar with milestone markers */}
      <div className="relative h-6 mb-2">
        {/* Track */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 rounded-full" style={{ background: 'oklch(12% 0.008 45)' }}>
          {/* Fill */}
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: 'linear-gradient(90deg, oklch(72% 0.18 30), oklch(80% 0.18 80))',
              transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </div>

        {/* Milestone markers */}
        {milestones.slice(1).map(m => {
          const mPct = Math.min(Math.max((m.threshold - minValue) / (maxValue - minValue), 0), 1) * 100;
          const reached = currentValue >= m.threshold;
          return (
            <div
              key={m.label}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${mPct}%` }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full border-2"
                style={{
                  borderColor: reached ? m.color : 'oklch(25% 0.015 270)',
                  background: reached ? m.color : 'oklch(8% 0.006 45)',
                }}
              />
            </div>
          );
        })}

        {/* Current position marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
          style={{ left: `${pct}%` }}
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{
              background: 'oklch(80% 0.18 80)',
              boxShadow: '0 0 8px oklch(80% 0.18 80 / 0.4)',
            }}
          />
        </div>
      </div>

      {/* Milestone labels */}
      <div className="relative h-4">
        {milestones.slice(1).map(m => {
          const mPct = Math.min(Math.max((m.threshold - minValue) / (maxValue - minValue), 0), 1) * 100;
          const reached = currentValue >= m.threshold;
          return (
            <div
              key={m.label}
              className="absolute -translate-x-1/2 text-[9px] font-mono font-bold"
              style={{
                left: `${mPct}%`,
                color: reached ? m.color : 'oklch(35% 0.01 50)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {m.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
