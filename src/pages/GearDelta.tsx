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
    const recommendedEnchant = enchantsGems.enchants[item.slot === 'mainhand' ? 'weapon' : item.slot === 'finger1' || item.slot === 'finger2' ? 'rings' : item.slot];

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
    gap <= 20 ? 'oklch(68% 0.18 155)' :
    gap <= 80 ? 'oklch(80% 0.18 80)' :
    'oklch(72% 0.18 30)';

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
        <StatCard label="Avg Gap" value={`${avgGap} ilvl`} sub={`vs ${mythIlvl} myth cap`} color="oklch(72% 0.18 30)" />
        <StatCard label="Tier Set" value={`${tierPieces.length}/5`} sub={tierPieces.length >= 4 ? '4pc active' : `${4 - tierPieces.length} to 4pc`} color="oklch(80% 0.18 80)" />
        <StatCard label="Enchants" value={missingEnchants.length === 0 ? 'Done' : `${missingEnchants.length} missing`} sub={missingEnchants.length === 0 ? 'All slots' : 'Free stats!'} color={missingEnchants.length === 0 ? 'oklch(68% 0.18 155)' : 'oklch(72% 0.18 30)'} />
        <StatCard label="Gems" value={missingGems.length === 0 ? 'Done' : `${missingGems.length} empty`} sub="Sockets" color={missingGems.length === 0 ? 'oklch(68% 0.18 155)' : 'oklch(80% 0.18 80)'} />
      </div>

      {/* Tier set visual tracker */}
      <div ref={r3} className="reveal mb-16">
        <div className="text-[9px] uppercase font-bold mb-4" style={{ color: 'oklch(80% 0.18 80)', letterSpacing: '0.12em' }}>
          {bisGear.tierSet.name} Set Progress
        </div>
        <div className="flex gap-2 mb-3">
          {tierSlots.map(slot => {
            const has = gear.find(g => g.slot === slot && g.tier);
            return (
              <div
                key={slot}
                className="glass p-3 rounded-lg flex-1 text-center"
                style={{ borderTop: `2px solid ${has ? 'oklch(80% 0.18 80)' : 'oklch(20% 0.01 270)'}` }}
              >
                <div className="text-[9px] uppercase font-bold mb-1 capitalize" style={{ color: has ? 'oklch(80% 0.18 80)' : 'oklch(38% 0.01 50)' }}>
                  {slot}
                </div>
                <div className="text-[11px]" style={{ color: has ? 'oklch(68% 0.012 50)' : 'oklch(30% 0.01 50)' }}>
                  {has ? has.name : 'Missing'}
                </div>
              </div>
            );
          })}
        </div>
        <div className="glass p-3 rounded-lg">
          <div className="text-[11px] mb-1" style={{ color: 'oklch(68% 0.01 50)' }}>
            <strong style={{ color: 'oklch(80% 0.18 80)' }}>2pc:</strong> {bisGear.tierSet.twoPiece}
          </div>
          <div className="text-[11px]" style={{ color: 'oklch(68% 0.01 50)' }}>
            <strong style={{ color: 'oklch(80% 0.18 80)' }}>4pc:</strong> {bisGear.tierSet.fourPiece}
          </div>
        </div>
      </div>

      {/* Gear comparison table */}
      <div ref={r4} className="reveal">
        <div className="text-[9px] uppercase font-bold mb-4" style={{ color: 'oklch(78% 0.16 60)', letterSpacing: '0.12em' }}>
          Per-Slot Comparison (sorted by upgrade priority)
        </div>

        <div className="space-y-1.5">
          {sortedDeltas.map((d, i) => (
            <div
              key={d.slot}
              className="grid grid-cols-12 gap-2 items-center px-4 py-2.5 rounded-lg row-hover"
              style={{
                background: i % 2 === 0 ? 'oklch(8% 0.006 45 / 0.4)' : 'oklch(9.5% 0.008 45 / 0.4)',
                borderLeft: `2px solid ${gapColor(d.gap)}`,
              }}
            >
              {/* Slot */}
              <div className="col-span-2 text-[11px] capitalize font-medium" style={{ color: 'oklch(68% 0.01 50)' }}>
                {d.slot.replace(/(\d)/, ' $1')}
                {d.isTierSlot && <span className="ml-1 text-[8px]" style={{ color: 'oklch(80% 0.18 80)' }}>T</span>}
              </div>

              {/* Current item */}
              <div className="col-span-3">
                <div className="text-[12px] font-semibold" style={{ color: 'oklch(75% 0.015 270)' }}>
                  {d.current.name}
                </div>
                <div className="text-[10px] font-mono" style={{ color: 'oklch(58% 0.01 50)', fontVariantNumeric: 'tabular-nums' }}>
                  ilvl {d.current.ilvl}
                </div>
              </div>

              {/* Arrow + gap */}
              <div className="col-span-1 text-center">
                <span className="text-[10px] font-mono font-bold" style={{ color: gapColor(d.gap), fontVariantNumeric: 'tabular-nums' }}>
                  +{d.gap}
                </span>
              </div>

              {/* BiS target */}
              <div className="col-span-3">
                <div className="text-[12px] font-semibold" style={{ color: d.bisTier ? 'oklch(80% 0.18 80)' : 'oklch(68% 0.012 50)' }}>
                  {d.bisName}
                </div>
                <div className="text-[10px]" style={{ color: 'oklch(58% 0.01 50)' }}>
                  {d.bisSource}
                </div>
              </div>

              {/* Progress bar */}
              <div className="col-span-2">
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'oklch(12% 0.008 45)' }}>
                  <div className="h-full rounded-full" style={{ width: `${d.pct}%`, background: gapColor(d.gap) }} />
                </div>
              </div>

              {/* Enchant status */}
              <div className="col-span-1 text-right">
                {d.missingEnchant && (
                  <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ color: 'oklch(72% 0.18 30)', background: 'oklch(72% 0.18 30 / 0.1)' }}>
                    NO ENCHANT
                  </span>
                )}
                {d.isEnchantable && d.current.enchant && (
                  <span className="text-[8px] px-1.5 py-0.5 rounded" style={{ color: 'oklch(58% 0.14 155)', background: 'oklch(58% 0.14 155 / 0.08)' }}>
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
          <div className="text-[9px] uppercase font-bold mb-4" style={{ color: 'oklch(72% 0.18 30)', letterSpacing: '0.12em' }}>
            Missing Enchants - Priority Fix
          </div>
          <div className="space-y-1.5">
            {missingEnchants.map(d => (
              <div key={d.slot} className="flex items-center justify-between glass p-3 rounded-lg">
                <div>
                  <span className="text-[12px] font-semibold capitalize" style={{ color: 'oklch(75% 0.015 270)' }}>
                    {d.slot.replace(/(\d)/, ' $1')}
                  </span>
                  <span className="text-[11px] ml-2" style={{ color: 'oklch(48% 0.01 50)' }}>
                    {d.current.name}
                  </span>
                </div>
                <div className="text-[11px] font-medium" style={{ color: 'oklch(68% 0.18 155)' }}>
                  {d.recommendedEnchant || 'Sim dependent'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-12 text-center">
        <p className="text-[11px] italic" style={{ color: 'oklch(58% 0.01 50)', fontFamily: '"Cormorant", Georgia, serif', fontSize: '0.85rem' }}>
          BiS targets are for Mythic raid. Gear delta updates when character data syncs.
        </p>
      </div>
    </section>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="glass p-4 rounded-lg">
      <div className="text-[9px] uppercase font-bold mb-2" style={{ color: 'oklch(48% 0.01 50)', letterSpacing: '0.12em' }}>{label}</div>
      <div className="text-lg font-extrabold font-mono mb-0.5" style={{ color, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
      <div className="text-[10px]" style={{ color: 'oklch(45% 0.01 50)' }}>{sub}</div>
    </div>
  );
}
