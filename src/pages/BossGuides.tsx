import SectionHeading from '../components/SectionHeading';
import { useReveal } from '../hooks/useReveal';

interface BossGuide {
  name: string;
  order: number;
  type: 'Single Target' | 'Cleave' | 'Council' | 'Add Waves' | 'Intermission';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  balanceRating: number; // 1-5 stars, how good Balance is on this fight
  keyMechanics: string[];
  balanceTips: string[];
  cdTiming: string;
  positioning: string;
}

const raidName = 'Manaforge Omega';
const raidTier = 'Midnight Season 1';

// Boss data from Midnight 12.0.1
const bosses: BossGuide[] = [
  {
    name: 'Imperator Averzian',
    order: 1,
    type: 'Single Target',
    difficulty: 'Easy',
    balanceRating: 3,
    keyMechanics: [
      'Mana Overload - raid-wide AoE, spread to reduce damage',
      'Arcane Barrage - dodge swirlies on the ground',
      'Shield Phase - burn shield before mana detonation',
    ],
    balanceTips: [
      'Pure ST fight. Use Keeper of the Grove for maximum single target.',
      'Save Incarnation for shield phases when burn matters most.',
      'Starfall is wasted here. Starsurge only.',
    ],
    cdTiming: 'Incarnation on pull, then align with shield phases (every ~90s).',
    positioning: 'Max range. Spread for Mana Overload. Stack for healer CDs during Detonation.',
  },
  {
    name: 'Vorasius',
    order: 2,
    type: 'Cleave',
    difficulty: 'Medium',
    balanceRating: 4,
    keyMechanics: [
      'Devour Essence - tank buster, position boss away from raid',
      'Spawns Void Tendrils (adds) that must be cleaved down',
      'Shadow Crash - targeted circles, move out quickly',
    ],
    balanceTips: [
      'Elune\'s Chosen shines here. Starfall hits boss + tendrils simultaneously.',
      'Maintain Moonfire on all tendrils for Shooting Stars procs.',
      'Fury of Elune on tendril spawns for maximum value.',
    ],
    cdTiming: 'Incarnation when tendrils spawn. Fury of Elune every tendril wave.',
    positioning: 'Stack on boss for cleave. Move out for Shadow Crash, then return immediately.',
  },
  {
    name: 'Vaelgor & Ezzorak',
    order: 3,
    type: 'Council',
    difficulty: 'Hard',
    balanceRating: 5,
    keyMechanics: [
      'Two bosses share health - multidot is king',
      'Vaelgor casts Fel Blast (interrupt or die)',
      'Ezzorak charges random players - dodge',
      'Shared abilities intensify at 30%',
    ],
    balanceTips: [
      'This is YOUR fight. Balance excels at 2-target sustained cleave.',
      'Moonfire both bosses at all times. Sunfire hits both if close enough.',
      'Starfall hits both. Never Starsurge unless one boss needs burst.',
      'Solar Beam the Fel Blast casts on Vaelgor.',
    ],
    cdTiming: 'Incarnation on pull. Force of Nature/Fury of Elune on cooldown - always worth it with 2 targets.',
    positioning: 'Stay between both bosses for Starfall/Starfire to hit both. Max range from melee.',
  },
  {
    name: 'Fallen-King Salhadaar',
    order: 4,
    type: 'Intermission',
    difficulty: 'Medium',
    balanceRating: 3,
    keyMechanics: [
      'P1: Single target boss, dodge shadow patches',
      'Intermission: Add spawns from all sides, must AoE',
      'P2: Boss empowered, increased damage taken by raid',
    ],
    balanceTips: [
      'Go Elune\'s Chosen. The intermission AoE more than compensates for slightly less ST.',
      'Pool AP to 80+ before intermission. Dump Starfall immediately on add spawn.',
      'Fury of Elune the add wave. They die fast with proper AoE.',
    ],
    cdTiming: 'Save Incarnation for intermission. The add phase is the DPS check, not the boss.',
    positioning: 'Center of room for P1. Edge of room facing add spawns for intermission.',
  },
  {
    name: 'Lightblinded Vanguard',
    order: 5,
    type: 'Add Waves',
    difficulty: 'Hard',
    balanceRating: 5,
    keyMechanics: [
      'Waves of zealot adds charge the raid every 30s',
      'Boss shield regenerates between waves',
      'Light Barrier - must break before next wave or wipe',
      'Adds fixate random ranged players',
    ],
    balanceTips: [
      'Balance DOMINATES this fight. Uncapped Starfall + Starfire on add waves is massive.',
      'Pool AP between waves. 100 AP dump into Starfall when adds arrive.',
      'Typhoon adds away from raid when they fixate melee.',
      'Solar Beam caster zealots every wave.',
    ],
    cdTiming: 'Incarnation every other wave. Fury of Elune every wave. CDs on ADDS, not boss.',
    positioning: 'Max range from boss. Kite fixated adds toward tank. Starfall radius covers everything.',
  },
  {
    name: 'Crown of the Cosmos',
    order: 6,
    type: 'Single Target',
    difficulty: 'Medium',
    balanceRating: 3,
    keyMechanics: [
      'Cosmic Ray - frontal cone, dodge immediately',
      'Gravity Well - pulls players to center, resist or die',
      'Stellar Collapse at 40% and 20% - burn phases',
    ],
    balanceTips: [
      'Keeper is better here. Pure ST with tight burn windows.',
      'If going Elune\'s, switch to Starsurge only. No Starfall targets.',
      'Gravity Well lets you keep casting at range - don\'t panic.',
    ],
    cdTiming: 'Incarnation at 42% to push through first Stellar Collapse. Second use at 22%.',
    positioning: 'Max range. Pre-position away from Cosmic Ray direction.',
  },
  {
    name: 'Chimaerus the Undreamt God',
    order: 7,
    type: 'Cleave',
    difficulty: 'Hard',
    balanceRating: 4,
    keyMechanics: [
      'Three heads active at once - each has different abilities',
      'One head must die first (raid calls priority)',
      'Heads regenerate health over time',
      'Dream Phase - avoid nightmare zones',
    ],
    balanceTips: [
      'Elune\'s Chosen. Three targets = Starfall always active.',
      'Moonfire all three heads. Sunfire hits all if positioned correctly.',
      'Focus Starfire on priority head while Starfall passively damages all.',
    ],
    cdTiming: 'Incarnation when all 3 heads are active. Fury of Elune on cooldown - 3 targets makes it insane.',
    positioning: 'Center between heads. All three should be in Starfall radius.',
  },
  {
    name: 'Belo\'ren, Child of Al\'ar',
    order: 8,
    type: 'Intermission',
    difficulty: 'Hard',
    balanceRating: 4,
    keyMechanics: [
      'Phoenix boss - rebirths at 1% health',
      'Fire adds spawn from corpse',
      'Intermission: raid soaks fire orbs or they explode',
      'Enrage timer is tight on Mythic',
    ],
    balanceTips: [
      'Elune\'s Chosen for add phase value. Keeper if your raid needs faster boss burn.',
      'Pool AP before 1% push. Mass AoE the fire adds instantly.',
      'Stampeding Roar to help raid reach fire orbs during intermission.',
    ],
    cdTiming: 'Incarnation on pull for boss burn. Second use during add phase.',
    positioning: 'Ranged stack point. Spread only for fire soak. Return to stack immediately.',
  },
  {
    name: 'Midnight Falls',
    order: 9,
    type: 'Council',
    difficulty: 'Hard',
    balanceRating: 5,
    keyMechanics: [
      'Final boss - Dawnkeeper and Duskwalker fight simultaneously',
      'Each boss has distinct phase mechanics',
      'Eclipse mechanic - one boss empowers while other weakens (swap DPS)',
      'Soft enrage at 8 minutes',
    ],
    balanceTips: [
      'PERFECT fight for Balance. The Eclipse mechanic literally mirrors your spec.',
      'Moonfire/Sunfire both bosses always. Starfall hits both.',
      'When boss empowers, shift Starsurge focus to the weakened one.',
      'Your sustained 2-target cleave is among the best in the game here.',
    ],
    cdTiming: 'Incarnation on pull. Align subsequent uses with your raid\'s boss swap timing.',
    positioning: 'Between both bosses. Never be more than 40 yards from either.',
  },
];

const typeColors: Record<string, string> = {
  'Single Target': 'oklch(80% 0.18 80)',
  'Cleave': 'oklch(72% 0.18 270)',
  'Council': 'oklch(68% 0.18 155)',
  'Add Waves': 'oklch(72% 0.16 30)',
  'Intermission': 'oklch(65% 0.14 300)',
};

const diffColors: Record<string, string> = {
  'Easy': 'oklch(68% 0.18 155)',
  'Medium': 'oklch(80% 0.18 80)',
  'Hard': 'oklch(72% 0.16 30)',
};

export default function BossGuides() {
  const r1 = useReveal();

  return (
    <section className="px-6 sm:px-10 py-28 max-w-6xl mx-auto">
      <div ref={r1} className="reveal">
        <SectionHeading
          title="Raid Guide"
          sub={`${raidName} - ${raidTier}. Balance Druid encounter strategies for every boss.`}
          accent="solar"
        />
      </div>

      {/* Overview: which fights Balance excels at */}
      <div className="reveal mb-16 flex flex-wrap gap-2">
        {bosses.map(b => (
          <div
            key={b.name}
            className="px-3 py-2 rounded-lg glass card-hover text-center"
            style={{ minWidth: 90 }}
          >
            <div className="text-[10px] font-bold mb-1" style={{ color: typeColors[b.type] }}>
              {b.order}. {b.name.split(' ')[0]}
            </div>
            <div className="flex items-center justify-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: i < b.balanceRating
                      ? 'oklch(80% 0.18 80)'
                      : 'oklch(16% 0.01 270)',
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Per-boss guides */}
      <div className="space-y-6">
        {bosses.map((boss) => (
          <BossCard key={boss.name} boss={boss} />
        ))}
      </div>
    </section>
  );
}

function BossCard({ boss }: { boss: BossGuide }) {
  const r = useReveal();
  return (
    <div ref={r} className="reveal">
      <div className="rounded-lg overflow-hidden glass card-hover">
        {/* Header bar */}
        <div className="px-6 py-4 flex items-center justify-between flex-wrap gap-3"
          style={{ borderBottom: '1px solid oklch(16% 0.012 45)' }}>
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-sm font-bold" style={{ color: 'oklch(50% 0.01 50)', fontVariantNumeric: 'tabular-nums' }}>
              {String(boss.order).padStart(2, '0')}
            </span>
            <h3 className="font-display text-xl font-bold" style={{ color: 'oklch(92% 0.008 60)', fontStyle: 'italic' }}>
              {boss.name}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded"
              style={{ color: typeColors[boss.type], background: `${typeColors[boss.type]}12` }}>
              {boss.type}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded"
              style={{ color: diffColors[boss.difficulty], background: `${diffColors[boss.difficulty]}12` }}>
              {boss.difficulty}
            </span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full"
                  style={{ background: i < boss.balanceRating ? 'oklch(80% 0.18 80)' : 'oklch(16% 0.01 270)' }} />
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 grid md:grid-cols-2 gap-8">
          {/* Left: Mechanics + Balance tips */}
          <div>
            <div className="text-[9px] uppercase font-bold mb-3" style={{ color: 'oklch(64% 0.012 50)', letterSpacing: '0.12em' }}>
              Key Mechanics
            </div>
            <ul className="space-y-2 mb-6">
              {boss.keyMechanics.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: 'oklch(66% 0.012 270)', lineHeight: 1.7 }}>
                  <span className="w-1 h-1 rounded-full shrink-0 mt-2.5" style={{ background: 'oklch(50% 0.01 50)' }} />
                  {m}
                </li>
              ))}
            </ul>

            <div className="text-[9px] uppercase font-bold mb-3" style={{ color: 'oklch(72% 0.18 270)', letterSpacing: '0.12em' }}>
              Balance Druid Tips
            </div>
            <ul className="space-y-2">
              {boss.balanceTips.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px]" style={{ color: 'oklch(72% 0.012 270)', lineHeight: 1.7 }}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ background: 'oklch(72% 0.18 270)' }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* Right: CD timing + positioning */}
          <div>
            <div className="p-4 rounded-lg mb-4" style={{ background: 'oklch(9% 0.008 45)', border: '1px solid oklch(14% 0.01 45)' }}>
              <div className="text-[9px] uppercase font-bold mb-2" style={{ color: 'oklch(80% 0.18 80)', letterSpacing: '0.12em' }}>
                Cooldown Timing
              </div>
              <p className="text-[13px]" style={{ color: 'oklch(70% 0.012 270)', lineHeight: 1.7 }}>
                {boss.cdTiming}
              </p>
            </div>

            <div className="p-4 rounded-lg" style={{ background: 'oklch(9% 0.008 45)', border: '1px solid oklch(14% 0.01 45)' }}>
              <div className="text-[9px] uppercase font-bold mb-2" style={{ color: 'oklch(68% 0.18 155)', letterSpacing: '0.12em' }}>
                Positioning
              </div>
              <p className="text-[13px]" style={{ color: 'oklch(70% 0.012 270)', lineHeight: 1.7 }}>
                {boss.positioning}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
