import { useState, useEffect } from 'react';
import SectionHeading from '../components/SectionHeading';
import { useReveal } from '../hooks/useReveal';
import { getResetInfo } from '../utils/weeklyReset';
import characterData from '@data/my-character-clean.json';

interface CheckItem {
  id: string;
  label: string;
  detail: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'vault' | 'currency' | 'gear' | 'rep' | 'weekly' | 'daily';
  levelReq: number;
  ilvlReq: number;
}

const maxLevel = 90;
const charLevel = (characterData as any).level || 86;
const charIlvl = (characterData as any).ilvl || 156;

// ── All possible weekly tasks ──
const allTasks: CheckItem[] = [
  // LEVELING (sub-90)
  { id: 'level-up', label: 'Reach max level (90)', detail: 'Continue the Midnight campaign. Do bonus objectives and dungeon queues between quest hubs for fastest XP.', priority: 'critical', category: 'weekly', levelReq: 0, ilvlReq: 0 },
  { id: 'campaign', label: 'Complete Midnight campaign chapter', detail: 'Each campaign chapter unlocks world content, dungeons, and gear tracks. This is your #1 priority while leveling.', priority: 'critical', category: 'weekly', levelReq: 0, ilvlReq: 0 },
  { id: 'level-dungeon', label: 'Run 2-3 normal dungeons for gear + XP', detail: 'Queue as DPS while questing. Normal dungeons give strong XP and guarantee gear drops at your level.', priority: 'high', category: 'gear', levelReq: 0, ilvlReq: 0 },

  // FRESH 90
  { id: 'world-quests', label: 'Complete 8 world quests', detail: 'World quests give Adventurer-track gear (220-237 ilvl). Prioritize equipment reward WQs over gold/rep.', priority: 'high', category: 'gear', levelReq: 90, ilvlReq: 0 },
  { id: 'weekly-quest', label: 'Complete the weekly quest', detail: 'The weekly quest in Silvermoon rewards a Veteran cache (252-268 ilvl). Always do this first each Tuesday.', priority: 'critical', category: 'weekly', levelReq: 90, ilvlReq: 0 },
  { id: 'world-boss', label: 'Kill the world boss', detail: 'One world boss per week. Drops Champion-track gear (268-285 ilvl). Check group finder.', priority: 'high', category: 'weekly', levelReq: 90, ilvlReq: 0 },

  // GEARING
  { id: 'vault-dungeon-1', label: 'Great Vault: 1 dungeon slot (1 Heroic+)', detail: 'Complete 1 Heroic dungeon or M+ for your first Great Vault option. Even one dungeon is worth it.', priority: 'critical', category: 'vault', levelReq: 90, ilvlReq: 190 },
  { id: 'vault-dungeon-2', label: 'Great Vault: 4 dungeons for 2nd slot', detail: '4 Heroic/M+ dungeons unlock a second choice in the vault. More choices = better loot.', priority: 'high', category: 'vault', levelReq: 90, ilvlReq: 190 },
  { id: 'vault-dungeon-3', label: 'Great Vault: 8 dungeons for 3rd slot', detail: '8 dungeons for all 3 vault slots. This is the endgame weekly grind. Do it if you have time.', priority: 'medium', category: 'vault', levelReq: 90, ilvlReq: 200 },
  { id: 'vault-raid-1', label: 'Great Vault: Kill 2 raid bosses', detail: 'First raid vault slot. LFR counts. Queue for The Voidspire LFR wings.', priority: 'high', category: 'vault', levelReq: 90, ilvlReq: 210 },
  { id: 'vault-raid-2', label: 'Great Vault: Kill 4 raid bosses', detail: 'Second raid vault slot. 4 bosses across any difficulty.', priority: 'medium', category: 'vault', levelReq: 90, ilvlReq: 210 },
  { id: 'vault-pvp', label: 'Great Vault: 1250 honor for PvP slot', detail: 'If you PvP at all, 1250 honor for a vault slot. Epic battlegrounds are fastest.', priority: 'low', category: 'vault', levelReq: 90, ilvlReq: 190 },

  // CRAFTING
  { id: 'spark', label: 'Earn Spark of Midnight charges', detail: 'Sparks fuel your crafted gear. Complete the weekly Spark quest to earn charges.', priority: 'high', category: 'currency', levelReq: 90, ilvlReq: 0 },
  { id: 'craft-weapon', label: 'Craft or upgrade your weapon', detail: 'Weapon is the highest-impact craft. Use your first Spark on a staff with Darkmoon Sigil: Hunt embellishment.', priority: 'critical', category: 'gear', levelReq: 90, ilvlReq: 0 },

  // REPUTATION
  { id: 'rep-weekly', label: 'Complete reputation weekly quests', detail: 'Each faction has a weekly quest for reputation. Renown unlocks recipes, gear, and cosmetics.', priority: 'medium', category: 'rep', levelReq: 90, ilvlReq: 0 },

  // DAILY
  { id: 'daily-emissary', label: 'Complete emissary/calling quest', detail: 'Daily calling quest for gold, rep, and gear. Takes 15-20 minutes. Low priority but consistent rewards.', priority: 'low', category: 'daily', levelReq: 90, ilvlReq: 0 },
  { id: 'profession-daily', label: 'Complete profession dailies/weeklies', detail: 'Profession knowledge is time-gated. Do your weekly/daily profession quests to not fall behind.', priority: 'medium', category: 'daily', levelReq: 90, ilvlReq: 0 },

  // TIER
  { id: 'catalyst', label: 'Check Catalyst for tier conversion', detail: 'Convert non-tier pieces to tier using the Catalyst. One charge per week. Prioritize 4-piece.', priority: 'critical', category: 'gear', levelReq: 90, ilvlReq: 235 },
];

const categoryLabels: Record<string, { label: string; color: string }> = {
  vault: { label: 'Great Vault', color: 'var(--color-lunar)' },
  currency: { label: 'Currency', color: 'var(--color-solar)' },
  gear: { label: 'Gear', color: 'var(--color-solar)' },
  rep: { label: 'Reputation', color: 'var(--color-nature)' },
  weekly: { label: 'Weekly', color: 'var(--color-error)' },
  daily: { label: 'Daily', color: 'var(--color-lunar)' },
};

// Priority colors used in task rendering
const _priorityColors: Record<string, string> = {
  critical: 'var(--color-error)',
  high: 'var(--color-solar)',
  medium: 'var(--color-lunar)',
  low: 'var(--color-lunar)',
};
void _priorityColors;

export default function WeeklyChecklist() {
  const r1 = useReveal();
  const [checked, setChecked] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('bd-weekly-checked');
      const data = saved ? JSON.parse(saved) : { week: '', items: [] };
      // Reset if it's a new week
      const now = new Date();
      const currentWeek = `${now.getFullYear()}-W${Math.ceil((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 604800000)}`;
      if (data.week !== currentWeek) return new Set<string>();
      return new Set<string>(data.items);
    } catch { return new Set<string>(); }
  });

  // Save to localStorage
  useEffect(() => {
    const now = new Date();
    const currentWeek = `${now.getFullYear()}-W${Math.ceil((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 604800000)}`;
    localStorage.setItem('bd-weekly-checked', JSON.stringify({ week: currentWeek, items: [...checked] }));
  }, [checked]);

  const toggle = (id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Filter tasks by level/ilvl
  const isLeveling = charLevel < maxLevel;
  const activeTasks = allTasks.filter(t => {
    if (isLeveling) return t.levelReq === 0; // Only show leveling tasks
    return t.levelReq <= charLevel && t.ilvlReq <= charIlvl && t.id !== 'level-up' && t.id !== 'campaign' && t.id !== 'level-dungeon';
  });

  const resetInfo = getResetInfo();
  const completedCount = activeTasks.filter(t => checked.has(t.id)).length;
  const pct = activeTasks.length > 0 ? Math.round((completedCount / activeTasks.length) * 100) : 0;

  const critical = activeTasks.filter(t => t.priority === 'critical');
  const high = activeTasks.filter(t => t.priority === 'high');
  const medium = activeTasks.filter(t => t.priority === 'medium');
  const low = activeTasks.filter(t => t.priority === 'low');

  return (
    <section className="px-6 sm:px-10 py-32 max-w-6xl mx-auto relative z-10">
      <div ref={r1} className="reveal">
        <SectionHeading
          title="Weekly Checklist"
          sub={isLeveling ? `Level ${charLevel}. Focus on reaching 90.` : `Level ${charLevel}, ilvl ${charIlvl}. ${resetInfo.timeString}.`}
          accent="solar"
        />
      </div>

      {/* Progress bar */}
      <div className="reveal mb-12">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] font-semibold" style={{ color: 'var(--color-text-2)' }}>
            {completedCount} / {activeTasks.length} complete
          </span>
          <span className="text-[13px] font-mono font-bold" style={{ color: 'var(--color-solar)', fontVariantNumeric: 'tabular-nums' }}>
            {pct}%
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-2)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: pct === 100 ? 'var(--color-nature)' : 'var(--color-solar)' }} />
        </div>
      </div>

      {/* Reset timer */}
      <div className="reveal mb-12 p-4 rounded-lg glass flex items-center justify-between">
        <div>
          <div className="text-[11px] uppercase font-bold mb-1" style={{ color: 'var(--color-error)', letterSpacing: '0.12em' }}>
            Weekly Reset
          </div>
          <div className="text-[14px] font-semibold" style={{ color: 'var(--color-text-1)' }}>
            {resetInfo.timeString}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold font-mono" style={{ color: 'var(--color-solar)', fontVariantNumeric: 'tabular-nums' }}>
            {resetInfo.hoursUntilReset}h
          </div>
          <div className="text-[11px]" style={{ color: 'var(--color-text-4)' }}>until reset</div>
        </div>
      </div>

      {/* Task groups */}
      {critical.length > 0 && <TaskGroup label="Must Do" color="var(--color-error)" tasks={critical} checked={checked} onToggle={toggle} />}
      {high.length > 0 && <TaskGroup label="High Priority" color="var(--color-solar)" tasks={high} checked={checked} onToggle={toggle} />}
      {medium.length > 0 && <TaskGroup label="If You Have Time" color="var(--color-lunar)" tasks={medium} checked={checked} onToggle={toggle} />}
      {low.length > 0 && <TaskGroup label="Optional" color="var(--color-lunar)" tasks={low} checked={checked} onToggle={toggle} />}
    </section>
  );
}

function TaskGroup({ label, color, tasks, checked, onToggle }: {
  label: string; color: string; tasks: CheckItem[]; checked: Set<string>; onToggle: (id: string) => void;
}) {
  return (
    <div className="reveal mb-10">
      <div className="text-[11px] uppercase font-bold mb-4" style={{ color, letterSpacing: '0.12em' }}>
        {label}
      </div>
      <div className="space-y-2">
        {tasks.map(task => {
          const done = checked.has(task.id);
          const cat = categoryLabels[task.category];
          return (
            <button
              key={task.id}
              onClick={() => onToggle(task.id)}
              className="w-full text-left rounded-lg glass card-hover cursor-pointer px-5 py-4 flex items-start gap-4"
              style={{ opacity: done ? 0.5 : 1, transition: 'opacity 0.2s ease' }}
            >
              <div
                className="w-5 h-5 rounded border-2 shrink-0 mt-0.5 flex items-center justify-center"
                style={{
                  borderColor: done ? 'var(--color-nature)' : 'var(--color-text-ghost)',
                  background: done ? 'color-mix(in oklch, var(--color-nature) 15%, transparent)' : 'transparent',
                }}
              >
                {done && <span className="text-[11px] font-bold" style={{ color: 'var(--color-nature)' }}>✓</span>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="text-[14px] font-semibold" style={{
                    color: done ? 'var(--color-text-muted)' : 'var(--color-text-1)',
                    textDecoration: done ? 'line-through' : 'none',
                  }}>
                    {task.label}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ color: cat.color, background: `color-mix(in oklch, ${cat.color} 7%, transparent)` }}>
                    {cat.label}
                  </span>
                </div>
                <p className="text-[13px]" style={{ color: done ? 'var(--color-text-muted)' : 'var(--color-text-3)', lineHeight: 1.65 }}>
                  {task.detail}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
