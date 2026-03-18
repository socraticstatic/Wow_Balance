import SectionHeading from '../components/SectionHeading';
import { bisGear } from '../data';
import { useReveal } from '../hooks/useReveal';

export default function Gear() {
  const r1 = useReveal();
  const r2 = useReveal();
  const r3 = useReveal();
  const r4 = useReveal();

  return (
    <section className="px-6 sm:px-10 py-32 max-w-6xl mx-auto">
      <div ref={r1} className="reveal">
        <SectionHeading title="Best in Slot" sub={`${bisGear.season}. ${bisGear.tierSet.name} tier set.`} accent="solar" />
      </div>

      {/* Tier set - glass callout with gold border */}
      <div ref={r2} className="reveal glass-solar pl-5 pr-5 py-5 mb-16 max-w-2xl rounded-lg" style={{ borderLeft: '2px solid oklch(80% 0.18 80)' }}>
        <h4 className="text-sm font-bold mb-2" style={{ color: 'oklch(80% 0.18 80)' }}>
          {bisGear.tierSet.name}
        </h4>
        <p className="text-[13px] mb-1.5" style={{ color: 'oklch(74% 0.01 270)', lineHeight: 1.7 }}>
          <strong style={{ color: 'oklch(78% 0.01 270)' }}>2pc</strong> {bisGear.tierSet.twoPiece}
        </p>
        <p className="text-[13px]" style={{ color: 'oklch(74% 0.01 270)', lineHeight: 1.7 }}>
          <strong style={{ color: 'oklch(78% 0.01 270)' }}>4pc</strong> {bisGear.tierSet.fourPiece}
        </p>
      </div>

      {/* AoE stat priority callout */}
      <div className="glass-lunar pl-5 pr-5 py-4 mb-16 max-w-2xl rounded-lg" style={{ borderLeft: '2px solid oklch(68% 0.16 285)' }}>
        <h4 className="text-[10px] uppercase font-bold mb-2" style={{ color: 'oklch(68% 0.16 285)', letterSpacing: '0.1em' }}>
          AoE Stat Priority (Elune's Chosen)
        </h4>
        <p className="text-[13px] font-semibold" style={{ color: 'oklch(82% 0.01 270)' }}>
          Intellect {'>'} <span style={{ color: 'oklch(80% 0.18 80)' }}>Haste</span> {'>'} Mastery {'>'} Crit {'>'} Versatility
        </p>
        <p className="text-[12px] mt-1" style={{ color: 'oklch(58% 0.012 270)' }}>
          Haste reduces Fury of Elune CD via Lunation and increases Starfire cast speed for bigger AoE windows.
        </p>
      </div>

      {/* Gear table - clean rows, no outer card */}
      <div ref={r3} className="reveal rounded-lg overflow-hidden mb-16" style={{ border: '1px solid oklch(14% 0.01 270)' }}>
        {/* Header row - desktop only */}
        <div className="hidden sm:grid grid-cols-12 gap-3 px-5 py-2.5 text-[9px] uppercase font-bold"
          style={{ background: 'oklch(9.5% 0.01 270)', color: 'oklch(50% 0.012 270)', letterSpacing: '0.12em' }}>
          <div className="col-span-2">Slot</div>
          <div className="col-span-6">Item</div>
          <div className="col-span-4">Source</div>
        </div>

        {bisGear.raidMythic.map((item, i) => (
          <div key={item.slot}
            className="grid grid-cols-12 gap-3 px-5 py-2.5 items-center"
            style={{
              background: i % 2 === 0 ? 'oklch(8% 0.008 270)' : 'oklch(10% 0.01 270)',
              borderTop: i === 0 ? 'none' : '1px solid oklch(13% 0.008 270)',
              ...(item.isTier ? { borderLeft: '2px solid oklch(80% 0.18 80)' } : {}),
            }}>
            <div className="col-span-2 text-[12px]" style={{ color: 'oklch(72% 0.01 50)' }}>{item.slot}</div>
            <div className="col-span-6 text-[13px] font-semibold" style={{ color: item.isTier ? 'oklch(80% 0.18 80)' : 'oklch(88% 0.006 270)' }}>
              {item.name}
            </div>
            <div className="col-span-4 text-[12px] hidden sm:block" style={{ color: 'oklch(52% 0.012 270)' }}>{item.source}</div>
          </div>
        ))}
      </div>

      {/* Trinkets - 2 featured + rest compact */}
      <div ref={r4} className="reveal">
        <div className="text-[9px] uppercase font-bold mb-4" style={{ color: 'oklch(80% 0.18 80)', letterSpacing: '0.12em' }}>
          Trinkets
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mb-10">
          {bisGear.trinkets.rankings.slice(0, 2).map(t => (
            <div key={t.name} className={`p-5 rounded-lg card-hover ${t.type === 'On-Use' ? 'glass-solar' : 'glass'}`}>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm font-bold" style={{ color: 'oklch(88% 0.006 270)' }}>{t.name}</span>
                <span className="text-[10px] font-semibold" style={{ color: 'oklch(52% 0.012 270)' }}>{t.type}</span>
              </div>
              <p className="text-[12px]" style={{ color: 'oklch(52% 0.012 270)', lineHeight: 1.6 }}>{t.notes}</p>
            </div>
          ))}
        </div>

        {/* Remaining trinkets as compact list */}
        {bisGear.trinkets.rankings.length > 2 && (
          <div className="space-y-1.5 mb-16">
            {bisGear.trinkets.rankings.slice(2).map(t => (
              <div key={t.name} className="flex items-baseline justify-between px-4 py-2.5 rounded"
                style={{ background: 'oklch(9% 0.008 270)', border: '1px solid oklch(13% 0.008 270)' }}>
                <div className="flex items-baseline gap-3">
                  <span className="text-[13px] font-semibold" style={{ color: 'oklch(78% 0.008 270)' }}>{t.name}</span>
                  <span className="text-[11px]" style={{ color: 'oklch(52% 0.012 270)' }}>{t.type}</span>
                </div>
                <span className="text-[11px]" style={{ color: 'oklch(52% 0.012 270)' }}>{t.source}</span>
              </div>
            ))}
          </div>
        )}

        {/* Weapon + Embellishments - no cards, just text blocks */}
        <div className="grid sm:grid-cols-2 gap-12">
          <div>
            <div className="text-[9px] uppercase font-bold mb-3" style={{ color: 'oklch(52% 0.012 270)', letterSpacing: '0.12em' }}>Weapon</div>
            <p className="text-sm font-semibold mb-1" style={{ color: 'oklch(88% 0.006 270)' }}>{bisGear.weapon.best}</p>
            <p className="text-[12px]" style={{ color: 'oklch(72% 0.01 50)', lineHeight: 1.6 }}>{bisGear.weapon.notes}</p>
          </div>
          <div>
            <div className="text-[9px] uppercase font-bold mb-3" style={{ color: 'oklch(52% 0.012 270)', letterSpacing: '0.12em' }}>Embellishments</div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: 'oklch(88% 0.006 270)' }}>{bisGear.embellishments.first.name}</p>
            <p className="text-[12px] mb-3" style={{ color: 'oklch(72% 0.01 50)', lineHeight: 1.6 }}>{bisGear.embellishments.first.notes}</p>
            <p className="text-sm font-semibold mb-0.5" style={{ color: 'oklch(88% 0.006 270)' }}>{bisGear.embellishments.second.name}</p>
            <p className="text-[12px]" style={{ color: 'oklch(72% 0.01 50)', lineHeight: 1.6 }}>{bisGear.embellishments.second.notes}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
