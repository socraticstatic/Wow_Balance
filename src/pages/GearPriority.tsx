import SectionHeading from '../components/SectionHeading';
import { useReveal } from '../hooks/useReveal';
import characterData from '@data/my-character-clean.json';
import { bisGear } from '../data';

interface SlotUpgrade {
  slot: string;
  current: { name: string; ilvl: number; quality: number };
  target: { name: string; ilvl: number; source: string };
  gap: number;
  sources: { method: string; detail: string; difficulty: 'easy' | 'medium' | 'hard' }[];
}

function analyzeGearPriority(): SlotUpgrade[] {
  const c = characterData;
  const gear = c.gear as Array<{
    slot: string; name: string; ilvl: number; quality: number;
    tier: string | null; enchant: string | null; gems: string[];
  }>;

  const bis = (bisGear as unknown) as Array<{
    slot: string; name: string; ilvl: number; source: string;
    tier: boolean; stats: string; enchant: string; gem: string;
  }>;

  const upgrades: SlotUpgrade[] = [];

  for (const item of gear) {
    const bisItem = bis.find(b => b.slot.toLowerCase() === item.slot.toLowerCase());
    if (!bisItem) continue;

    const gap = bisItem.ilvl - item.ilvl;
    if (gap <= 0) continue;

    const sources = getUpgradeSources(item.slot, item.ilvl, (characterData as any).level);

    upgrades.push({
      slot: item.slot,
      current: { name: item.name, ilvl: item.ilvl, quality: item.quality },
      target: { name: bisItem.name, ilvl: bisItem.ilvl, source: bisItem.source },
      gap,
      sources,
    });
  }

  return upgrades.sort((a, b) => b.gap - a.gap);
}

function getUpgradeSources(slot: string, currentIlvl: number, level: number): SlotUpgrade['sources'] {
  const sources: SlotUpgrade['sources'] = [];
  const isLeveling = level < 90;

  if (isLeveling) {
    sources.push({ method: 'Quest rewards', detail: `Continue the Midnight campaign. Quest gear scales with level.`, difficulty: 'easy' });
    sources.push({ method: 'Normal dungeons', detail: `Queue for normal dungeons. Guaranteed drops every run.`, difficulty: 'easy' });
    if (level >= 87) {
      sources.push({ method: 'Heroic dungeons', detail: `At 87+, queue for Heroic dungeons for better ilvl drops.`, difficulty: 'medium' });
    }
    return sources;
  }

  // At max level, sources depend on current ilvl
  if (currentIlvl < 220) {
    sources.push({ method: 'World quests', detail: `Check the map for ${slot} reward world quests. Adventurer track (220-237).`, difficulty: 'easy' });
    sources.push({ method: 'Normal dungeons', detail: `Any normal dungeon can drop this slot. Fast queue.`, difficulty: 'easy' });
    sources.push({ method: 'Crafted gear', detail: `Commission a crafter via the Work Order system. Costs gold + materials.`, difficulty: 'easy' });
  }

  if (currentIlvl < 252) {
    sources.push({ method: 'Heroic dungeons', detail: `Heroic dungeons drop Veteran-track gear (237-252).`, difficulty: 'medium' });
    sources.push({ method: 'LFR raid', detail: `Queue for LFR Voidspire. Boss drops and Great Vault.`, difficulty: 'medium' });
    sources.push({ method: 'Weekly quest', detail: `Silvermoon weekly quest rewards a Veteran cache.`, difficulty: 'easy' });
  }

  if (currentIlvl < 268) {
    sources.push({ method: 'M+ 2-5', detail: `Low M+ keys drop Champion-track gear (252-268).`, difficulty: 'medium' });
    sources.push({ method: 'Normal raid', detail: `The Voidspire Normal drops Champion gear.`, difficulty: 'medium' });
    sources.push({ method: 'World boss', detail: `Weekly world boss drops Champion-track pieces.`, difficulty: 'easy' });
  }

  if (currentIlvl < 285) {
    sources.push({ method: 'M+ 6-9', detail: `Mid-range keys. Hero-track end-of-run drops (268-285).`, difficulty: 'hard' });
    sources.push({ method: 'Heroic raid', detail: `Heroic Voidspire drops Hero-track gear.`, difficulty: 'hard' });
    sources.push({ method: 'Great Vault', detail: `Your best weekly upgrade source. Fill all 3 dungeon slots for max choices.`, difficulty: 'medium' });
  }

  if (currentIlvl < 289) {
    sources.push({ method: 'M+ 10+', detail: `High keys. Myth-track vault rewards (285-289).`, difficulty: 'hard' });
    sources.push({ method: 'Mythic raid', detail: `Mythic Voidspire. The ceiling.`, difficulty: 'hard' });
  }

  // Slot-specific sources
  const craftableSlots = ['back', 'wrist', 'waist', 'boots', 'finger1', 'finger2'];
  if (craftableSlots.includes(slot.toLowerCase())) {
    sources.push({ method: 'Craft with embellishment', detail: `This is a good embellishment slot. Craft Arcanoweave Lining here.`, difficulty: 'medium' });
  }

  if (slot.toLowerCase() === 'weapon' || slot.toLowerCase() === 'main hand') {
    sources.unshift({ method: 'Craft a staff', detail: `Weapon is highest-impact craft. Use Spark of Midnight + Darkmoon Sigil: Hunt.`, difficulty: 'medium' });
  }

  return sources;
}

const diffColors = {
  easy: 'oklch(68% 0.18 155)',
  medium: 'oklch(80% 0.18 80)',
  hard: 'oklch(72% 0.16 30)',
};

export default function GearPriority() {
  const r1 = useReveal();
  const upgrades = analyzeGearPriority();
  const totalGap = upgrades.reduce((s, u) => s + u.gap, 0);
  const avgGap = upgrades.length > 0 ? Math.round(totalGap / upgrades.length) : 0;

  return (
    <section className="px-6 sm:px-10 py-28 max-w-6xl mx-auto relative z-10">
      <div ref={r1} className="reveal">
        <SectionHeading
          title="Upgrade Priority"
          sub={`${upgrades.length} slots need upgrades. Average gap: ${avgGap} ilvl per slot.`}
          accent="solar"
        />
      </div>

      {upgrades.length === 0 ? (
        <div className="reveal p-6 rounded-lg glass">
          <p className="text-[15px]" style={{ color: 'oklch(88% 0.005 55)' }}>
            All gear is at or above BiS ilvl. You're done. Focus on tier set completion and optimal secondary stats.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {upgrades.map((u, i) => (
            <UpgradeCard key={u.slot} upgrade={u} rank={i + 1} />
          ))}
        </div>
      )}
    </section>
  );
}

function UpgradeCard({ upgrade: u, rank }: { upgrade: SlotUpgrade; rank: number }) {
  const r = useReveal();
  const urgency = u.gap >= 80 ? 'oklch(72% 0.16 30)' : u.gap >= 40 ? 'oklch(80% 0.18 80)' : 'oklch(72% 0.18 270)';

  return (
    <div ref={r} className="reveal rounded-lg glass overflow-hidden" style={{ borderLeft: `3px solid ${urgency}` }}>
      <div className="px-6 py-4 flex items-center justify-between flex-wrap gap-3"
        style={{ borderBottom: '1px solid oklch(16% 0.012 45)' }}>
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-sm font-bold" style={{ color: urgency, fontVariantNumeric: 'tabular-nums' }}>
            #{rank}
          </span>
          <span className="text-[11px] uppercase font-bold" style={{ color: 'oklch(78% 0.005 55)', letterSpacing: '0.08em' }}>
            {u.slot}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm" style={{ color: 'oklch(72% 0.16 30)', fontVariantNumeric: 'tabular-nums' }}>
            {u.current.ilvl}
          </span>
          <span style={{ color: 'oklch(50% 0.005 50)' }}>→</span>
          <span className="font-mono text-sm font-bold" style={{ color: 'oklch(68% 0.18 155)', fontVariantNumeric: 'tabular-nums' }}>
            {u.target.ilvl}
          </span>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded" style={{ color: urgency, background: `${urgency}12` }}>
            +{u.gap} ilvl
          </span>
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-[11px] uppercase font-bold mb-2" style={{ color: 'oklch(72% 0.16 30)', letterSpacing: '0.1em' }}>Current</div>
            <div className="text-[14px] font-semibold" style={{ color: 'oklch(82% 0.005 55)' }}>{u.current.name}</div>
            <div className="text-[12px] font-mono" style={{ color: 'oklch(60% 0.005 50)', fontVariantNumeric: 'tabular-nums' }}>ilvl {u.current.ilvl}</div>
          </div>
          <div>
            <div className="text-[11px] uppercase font-bold mb-2" style={{ color: 'oklch(68% 0.18 155)', letterSpacing: '0.1em' }}>Target</div>
            <div className="text-[14px] font-semibold" style={{ color: 'oklch(92% 0.006 60)' }}>{u.target.name}</div>
            <div className="text-[12px]" style={{ color: 'oklch(70% 0.005 55)' }}>{u.target.source}</div>
          </div>
        </div>

        <div className="text-[11px] uppercase font-bold mb-3" style={{ color: 'oklch(80% 0.18 80)', letterSpacing: '0.1em' }}>
          How to Upgrade This Week
        </div>
        <div className="space-y-2">
          {u.sources.slice(0, 4).map((s, i) => (
            <div key={i} className="flex items-start gap-3 text-[13px]">
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                style={{ color: diffColors[s.difficulty], background: `${diffColors[s.difficulty]}12` }}>
                {s.difficulty}
              </span>
              <div>
                <span className="font-semibold" style={{ color: 'oklch(90% 0.005 55)' }}>{s.method}: </span>
                <span style={{ color: 'oklch(80% 0.005 55)' }}>{s.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
