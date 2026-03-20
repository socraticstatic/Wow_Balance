import SectionHeading from '../components/SectionHeading';
import { useReveal } from '../hooks/useReveal';
import { bisGear, enchantsGems } from '../data';
import characterData from '@data/my-character-clean.json';

// Slot name normalization: character data uses lowercase, BiS uses Title Case
const slotMap: Record<string, string> = {
  head: 'Head', neck: 'Neck', shoulder: 'Shoulders', back: 'Cloak',
  chest: 'Chest', waist: 'Belt', wrist: 'Wrist', hands: 'Gloves',
  legs: 'Legs', feet: 'Boots', finger1: 'Ring 1', finger2: 'Ring 2',
  trinket1: 'Trinket 1', trinket2: 'Trinket 2', mainhand: 'Weapon', offhand: 'Off-Hand',
};

// Enchantable slots
const enchantableSlots = ['head', 'back', 'chest', 'wrist', 'legs', 'feet', 'finger1', 'finger2', 'mainhand'];

// Tier slots
const tierSlots = ['head', 'shoulder', 'chest', 'hands', 'legs'];

interface GearItem {
  slot: string; name: string; ilvl: number; quality: number;
  tier: string | null; enchant: string | null; gems: string[];
}

export default function GearDelta() {
  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();
  const r4 = useReveal();

  const gear = characterData.gear as GearItem[];
  const bisSlots = bisGear.raidMythic;
  const mythIlvl = 289; // Myth track 6/6 cap

  // Build the delta rows
  const deltas = gear.map(item => {
    const bisName = slotMap[item.slot] || item.slot;
    const bisItem = bisSlots.find(b => b.slot === bisName);
    const gap = bisItem ? mythIlvl - item.ilvl : 0;
    const pct = Math.min((item.ilvl / mythIlvl) * 100, 100);
    const isEnchantable = enchantableSlots.includes(item.slot);
    const isTierSlot = tierSlots.includes(item.slot);
    const enchantSlotMap: Record<string, string> = { mainhand: 'weapon', finger1: 'rings', finger2: 'rings', feet: 'boots', back: 'cloak' };
    const enchantKey = enchantSlotMap[item.slot] || item.slot;
    const recommendedEnchant = (enchantsGems as any)?.enchants?.[enchantKey];

    return {
      slot: item.slot,
      current: item,
      bisName: bisItem?.name || '-',
      bisSource: bisItem?.source || '-',
      bisTier: bisItem?.isTier || false,
      gap,
      pct,
      isEnchantable,
      isTierSlot,
      missingEnchant: isEnchantable && !item.enchant,
      recommendedEnchant: recommendedEnchant?.name || null,
    };
  });

  const totalGap = deltas.reduce((sum, d) => sum + d.gap, 0);
  const avgGap = Math.round(totalGap / deltas.length);
  const missingEnchants = deltas.filter(d => d.missingEnchant);
  const missingGems = gear.filter(g => ['head', 'neck', 'finger1', 'finger2', 'back'].includes(g.slot) && g.gems.length === 0);
  const tierPieces = gear.filter(g => g.tier);

  // Sort by gap descending (biggest upgrade priority first)
  const sortedDeltas = [...deltas].sort((a, b) => b.gap - a.gap);

  const gapColor = (gap: number) =>
    gap <= 20 ? 'var(--color-nature)' :
    gap <= 80 ? 'var(--color-solar)' :
    'var(--color-error)';

  return (
    <section className="px-6 sm:px-10 py-28 max-w-6xl mx-auto">
      <div ref={r1} className="reveal">
        <SectionHeading
          title="Gear Delta"
          sub="What you have vs what you need. Sorted by biggest upgrade opportunity."
          accent="solar"
        />
      </div>

      {/* Overview stats */}
      <div ref={r2} className="reveal grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-16">
        <StatCard label="Avg Gap" value={`${avgGap} ilvl`} sub={`vs ${mythIlvl} myth cap`} color="var(--color-error)" />
        <StatCard label="Tier Set" value={`${tierPieces.length}/5`} sub={tierPieces.length >= 4 ? '4pc active' : `${4 - tierPieces.length} to 4pc`} color="var(--color-solar)" />
        <StatCard label="Enchants" value={missingEnchants.length === 0 ? 'Done' : `${missingEnchants.length} missing`} sub={missingEnchants.length === 0 ? 'All slots' : 'Free stats!'} color={missingEnchants.length === 0 ? 'var(--color-nature)' : 'var(--color-error)'} />
        <StatCard label="Gems" value={missingGems.length === 0 ? 'Done' : `${missingGems.length} empty`} sub="Sockets" color={missingGems.length === 0 ? 'var(--color-nature)' : 'var(--color-solar)'} />
      </div>

      {/* Tier set visual tracker */}
      <div ref={r3} className="reveal mb-16">
        <div className="text-[11px] uppercase font-bold mb-4" style={{ color: 'var(--color-solar)', letterSpacing: '0.12em' }}>
          {bisGear.tierSet.name} Set Progress
        </div>
        <div className="flex gap-2 mb-3">
          {tierSlots.map(slot => {
            const has = gear.find(g => g.slot === slot && g.tier);
            return (
              <div
                key={slot}
                className="glass p-3 rounded-lg flex-1 text-center"
                style={{ borderTop: `2px solid ${has ? 'var(--color-solar)' : 'var(--color-surface-3)'}` }}
              >
                <div className="text-[11px] uppercase font-bold mb-1 capitalize" style={{ color: has ? 'var(--color-solar)' : 'var(--color-text-ghost)' }}>
                  {slot}
                </div>
                <div className="text-[13px]" style={{ color: has ? 'var(--color-text-1)' : 'var(--color-text-ghost)' }}>
                  {has ? has.name : 'Missing'}
                </div>
              </div>
            );
          })}
        </div>
        <div className="glass p-3 rounded-lg">
          <div className="text-[13px] mb-1" style={{ color: 'var(--color-text-1)' }}>
            <strong style={{ color: 'var(--color-solar)' }}>2pc:</strong> {bisGear.tierSet.twoPiece}
          </div>
          <div className="text-[13px]" style={{ color: 'var(--color-text-1)' }}>
            <strong style={{ color: 'var(--color-solar)' }}>4pc:</strong> {bisGear.tierSet.fourPiece}
          </div>
        </div>
      </div>

      {/* Gear comparison table */}
      <div ref={r4} className="reveal">
        <div className="text-[11px] uppercase font-bold mb-4" style={{ color: 'var(--color-solar)', letterSpacing: '0.12em' }}>
          Per-Slot Comparison (sorted by upgrade priority)
        </div>

        <div className="space-y-1.5">
          {sortedDeltas.map((d, i) => (
            <div
              key={d.slot}
              className="grid grid-cols-12 gap-2 items-center px-4 py-2.5 rounded-lg row-hover"
              style={{
                background: i % 2 === 0 ? 'color-mix(in oklch, var(--color-void) 40%, transparent)' : 'color-mix(in oklch, var(--color-surface-1) 40%, transparent)',
                borderLeft: `2px solid ${gapColor(d.gap)}`,
              }}
            >
              {/* Slot */}
              <div className="col-span-2 text-[13px] capitalize font-medium" style={{ color: 'var(--color-text-1)' }}>
                {d.slot.replace(/(\d)/, ' $1')}
                {d.isTierSlot && <span className="ml-1 text-[10px]" style={{ color: 'var(--color-solar)' }}>T</span>}
              </div>

              {/* Current item */}
              <div className="col-span-3">
                <div className="text-[14px] font-semibold" style={{ color: 'var(--color-text-3)' }}>
                  {d.current.name}
                </div>
                <div className="text-[12px] font-mono" style={{ color: 'var(--color-text-2)', fontVariantNumeric: 'tabular-nums' }}>
                  ilvl {d.current.ilvl}
                </div>
              </div>

              {/* Arrow + gap */}
              <div className="col-span-1 text-center">
                <span className="text-[12px] font-mono font-bold" style={{ color: gapColor(d.gap), fontVariantNumeric: 'tabular-nums' }}>
                  +{d.gap}
                </span>
              </div>

              {/* BiS target */}
              <div className="col-span-3">
                <div className="text-[14px] font-semibold" style={{ color: d.bisTier ? 'var(--color-solar)' : 'var(--color-text-1)' }}>
                  {d.bisName}
                </div>
                <div className="text-[12px]" style={{ color: 'var(--color-text-2)' }}>
                  {d.bisSource}
                </div>
              </div>

              {/* Progress bar */}
              <div className="col-span-2">
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-1)' }}>
                  <div className="h-full rounded-full" style={{ width: `${d.pct}%`, background: gapColor(d.gap) }} />
                </div>
              </div>

              {/* Enchant status */}
              <div className="col-span-1 text-right">
                {d.missingEnchant && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ color: 'var(--color-error)', background: 'color-mix(in oklch, var(--color-error) 10%, transparent)' }}>
                    NO ENCHANT
                  </span>
                )}
                {d.isEnchantable && d.current.enchant && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ color: 'var(--color-nature)', background: 'color-mix(in oklch, var(--color-nature) 8%, transparent)' }}>
                    OK
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Missing enchants detail */}
      {missingEnchants.length > 0 && (
        <div className="mt-12">
          <div className="text-[11px] uppercase font-bold mb-4" style={{ color: 'var(--color-error)', letterSpacing: '0.12em' }}>
            Missing Enchants - Priority Fix
          </div>
          <div className="space-y-1.5">
            {missingEnchants.map(d => (
              <div key={d.slot} className="flex items-center justify-between glass p-3 rounded-lg">
                <div>
                  <span className="text-[14px] font-semibold capitalize" style={{ color: 'var(--color-text-3)' }}>
                    {d.slot.replace(/(\d)/, ' $1')}
                  </span>
                  <span className="text-[13px] ml-2" style={{ color: 'var(--color-text-faint)' }}>
                    {d.current.name}
                  </span>
                </div>
                <div className="text-[13px] font-medium" style={{ color: 'var(--color-nature)' }}>
                  {d.recommendedEnchant || 'Sim dependent'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 text-center">
        <p className="text-[13px] italic" style={{ color: 'var(--color-text-2)', fontFamily: '"Cormorant", Georgia, serif', fontSize: '0.85rem' }}>
          BiS targets are for Mythic raid. Gear delta updates when character data syncs.
        </p>
      </div>
    </section>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="glass p-4 rounded-lg">
      <div className="text-[11px] uppercase font-bold mb-2" style={{ color: 'var(--color-text-faint)', letterSpacing: '0.12em' }}>{label}</div>
      <div className="text-lg font-extrabold font-mono mb-0.5" style={{ color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div className="text-[12px]" style={{ color: 'var(--color-text-faint)' }}>{sub}</div>
    </div>
  );
}
