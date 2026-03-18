import SectionHeading from '../components/SectionHeading';
import { useReveal } from '../hooks/useReveal';

interface BossGuide {
  name: string;
  raid: string;
  order: number;
  type: 'Single Target' | 'Cleave' | 'Council' | 'Add Waves' | 'Multi-Phase';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  balanceRating: number;
  keyMechanics: string[];
  balanceTips: string[];
  cdTiming: string;
  positioning: string;
}

const bosses: BossGuide[] = [
  {
    name: 'Imperator Averzian',
    raid: 'The Voidspire',
    order: 1,
    type: 'Single Target',
    difficulty: 'Medium',
    balanceRating: 3,
    keyMechanics: [
      '3x3 grid arena. Servants spawn on tiles and claim them.',
      'If 3 claimed tiles align in a row, instant wipe.',
      'Kill servants before they finish claiming. Interrupt Pitch Bulwark.',
    ],
    balanceTips: [
      'Primarily ST on boss. Eclipse triggers passively from casting Starfire. Focus builders on boss, swap to adds when they spawn.',
      'Starfall is wasted - adds die fast and are spread across the grid.',
      'Interrupt Pitch Bulwark (gives absorb shields to nearby enemies).',
      'Ramp time works against you on quick add swaps. Pre-DoT as servants spawn.',
    ],
    cdTiming: 'CDs on pull for boss burn. Hold second set for servant spawns if your guild needs DPS there.',
    positioning: 'Max range from boss. Watch the grid - never stand on a tile about to complete a row.',
  },
  {
    name: 'Vorasius',
    raid: 'The Voidspire',
    order: 2,
    type: 'Single Target',
    difficulty: 'Easy',
    balanceRating: 4,
    keyMechanics: [
      'Stationary boss creates crystal walls dividing the arena.',
      'Blistercreep adds must be pulled into walls (2 explosions each) to destroy walls.',
      'Void Breath fires in a direction - dodge. Primordial Roar is stacking raid damage.',
    ],
    balanceTips: [
      'Turret-friendly fight. High uptime on boss. Mostly ST.',
      'Assist damage on Blistercreeps but let tank position them into walls.',
      'Bear Form + Heart of the Wild for late Primordial Roar stacks.',
      'One of your best pure ST logs. Plant and cast.',
    ],
    cdTiming: 'Align with Heroism on pull. Use CDs on cooldown - no hold needed.',
    positioning: 'Max range. Stay clear of crystal wall paths. Don\'t stand in Void Breath cone.',
  },
  {
    name: 'Fallen-King Salhadaar',
    raid: 'The Voidspire',
    order: 3,
    type: 'Add Waves',
    difficulty: 'Medium',
    balanceRating: 5,
    keyMechanics: [
      'Kill Void Orbs that spawn periodically.',
      'Manage puddle placement - don\'t paint yourself into a corner.',
      'Survive arena-wide beam phases with movement.',
    ],
    balanceTips: [
      'Boomkin excels here. ST boss + burst AoE on grouped orbs is your exact profile.',
      'Hold CDs for orb spawn windows to maximize cleave.',
      'Bank instant-cast procs for beam movement phases.',
      'Puddle placement: always move toward open space, never toward walls.',
    ],
    cdTiming: 'Hold Incarnation/CA for orb spawns. Fury of Elune on orb groups.',
    positioning: 'Center of room. Move puddles to edges. Face open space for beam dodges.',
  },
  {
    name: 'Vaelgor & Ezzorak',
    raid: 'The Voidspire',
    order: 4,
    type: 'Cleave',
    difficulty: 'Hard',
    balanceRating: 5,
    keyMechanics: [
      'Two dragons. Must die within 10% HP of each other or survivor enrages.',
      'Raid splits in half. Each dragon has different mechanics.',
      'Intermission at 100 energy: dragons fly, burn Manifestation of Midnight add.',
    ],
    balanceTips: [
      'THIS IS YOUR FIGHT. Multi-DoT both dragons. Starfall hits both if in range.',
      'Moonfire + Sunfire both targets at all times. Starfall is always up.',
      'Starsurge to equalize HP between dragons when one is lower.',
      'Incarnation for intermission add burn - it\'s the DPS check.',
    ],
    cdTiming: 'Minor CDs on pull. Save Incarnation/CA for intermission Manifestation add.',
    positioning: 'Position where Starfall radius covers both dragons. Never tunnel one.',
  },
  {
    name: 'Lightblinded Vanguard',
    raid: 'The Voidspire',
    order: 5,
    type: 'Council',
    difficulty: 'Hard',
    balanceRating: 5,
    keyMechanics: [
      'Three bosses: Commander Venel, General Bellamy, War Chaplain Senn.',
      'Independent energy bars. Must keep HP roughly even.',
      'Bellamy + Senn bubble for 8s on pull. Start on Venel.',
      'At 100 energy: each boss drops permanent consecration where standing. Positioning critical.',
    ],
    balanceTips: [
      'THE Boomkin fight. Three targets needing even damage = Starfall + multi-DoT heaven.',
      'Elune\'s Chosen hero talent excels here for sustained multi-target.',
      'Start on Venel (no bubble). Spread DoTs to Bellamy/Senn after 8s.',
      'Starfall should be up CONSTANTLY. Never let it drop.',
    ],
    cdTiming: 'Pop CDs 8 seconds after pull when all 3 targets are damageable.',
    positioning: 'Center of all three bosses. Max Starfall coverage. Watch consecration drops.',
  },
  {
    name: 'Crown of the Cosmos',
    raid: 'The Voidspire',
    order: 6,
    type: 'Multi-Phase',
    difficulty: 'Hard',
    balanceRating: 2,
    keyMechanics: [
      'Alleria Windrunner fight. Sentinel adds need tanking in melee.',
      'Silverstrike Arrow clears Void but cleaves raid if aimed wrong.',
      'Crushing Singularity intermission: massive healing check.',
      'Mythic: sequential kick orders on Death\'s Dirge.',
    ],
    balanceTips: [
      'HARDEST fight for Boomkin. Forced movement kills your ramp.',
      'Bank Eclipse charges for movement phases. Don\'t waste them.',
      'Bear Form + Heart of the Wild for Singularity intermission survival.',
      'Typhoon for add repositioning. Solar Beam the Sentinels.',
      'Expect to parse below melee. This is a survival fight, not a DPS parse.',
    ],
    cdTiming: 'Save CDs for burn windows on Sentinels and post-intermission. Don\'t waste during movement.',
    positioning: 'Ranged stack. Move as a group. Never be isolated during Singularity.',
  },
  {
    name: 'Chimaerus, the Undreamt God',
    raid: 'The Dreamrift',
    order: 7,
    type: 'Add Waves',
    difficulty: 'Hard',
    balanceRating: 4,
    keyMechanics: [
      'Raid splits into two groups. One enters Aln realm.',
      'Aln group disables Manifestation shields, sending adds to normal realm.',
      'Normal realm kills adds before boss consumes them (Cannibalized Essence stacks).',
      'Phase 2: boss flies, Corrupted Devastation raid damage, Ravenous Dive.',
    ],
    balanceTips: [
      'Normal realm assignment: Starfall the grouped Manifestation adds. Your value is here.',
      'Aln realm: more ST focused on priority targets. Less ideal for Boomkin.',
      'Interrupt Haunting Essence adds: Fearsome Cry and Essence Bolt.',
      'Save raid CDs for Phase 2 Corrupted Devastation.',
    ],
    cdTiming: 'Hold major CDs for Phase 2 or heavy Manifestation waves. Don\'t blow everything in Phase 1.',
    positioning: 'Group with your realm assignment. Stack on add spawn points in normal realm.',
  },
  {
    name: 'Belo\'ren, Child of Al\'ar',
    raid: 'March on Quel\'Danas',
    order: 8,
    type: 'Multi-Phase',
    difficulty: 'Hard',
    balanceRating: 3,
    keyMechanics: [
      'Light/Void feather assignments swap throughout fight.',
      'Tank color cones must match assignments. Miss twice = wipe.',
      'Phoenix rebirth: boss becomes egg for 30s. Burn HARD.',
      'Expect 2-3 rebirth cycles.',
    ],
    balanceTips: [
      'Egg burn phases are where you dump everything. Classic "save and dump" fight.',
      'Save CDs for egg phases. Eclipse triggers passively from your builders.',
      'Feather mechanic is positioning, not DPS. Stay disciplined.',
      'ST-focused. Keeper is better than Elune\'s here.',
    ],
    cdTiming: 'Hold Incarnation/CA for egg phases. 30s burn windows.',
    positioning: 'Assigned feather position. Move with your group during color swaps.',
  },
  {
    name: 'Midnight Falls (L\'ura)',
    raid: 'March on Quel\'Danas',
    order: 9,
    type: 'Single Target',
    difficulty: 'Hard',
    balanceRating: 2,
    keyMechanics: [
      'Final boss of tier. Death\'s Dirge shows Dark Runes to memorize.',
      'Heaven\'s Glaives tear through arena. Dodge patterns.',
      'Midnight Crystals must die before Cosmic Fracture.',
      'Arena shrinks progressively. Tight enrage (40k+ team DPS).',
    ],
    balanceTips: [
      'Tightest fight for Boomkin. Shrinking arena + constant movement = caster nightmare.',
      'Maintain Eclipse uptime while moving. Bank instant-cast procs.',
      'Bear Form for emergency survival. Don\'t be greedy with casts.',
      'Stampeding Roar helps raid reposition during Glaive patterns.',
      'Use CDs on cooldown. This is a burn race. Don\'t hold anything.',
    ],
    cdTiming: 'CDs on cooldown with Heroism. Burn race. No holds.',
    positioning: 'Center of remaining safe space. Move early, not late. Anticipate Glaive paths.',
  },
];

const raidGroups = [
  { name: 'The Voidspire', bosses: bosses.filter(b => b.raid === 'The Voidspire') },
  { name: 'The Dreamrift', bosses: bosses.filter(b => b.raid === 'The Dreamrift') },
  { name: 'March on Quel\'Danas', bosses: bosses.filter(b => b.raid === 'March on Quel\'Danas') },
];

const typeColors: Record<string, string> = {
  'Single Target': 'oklch(80% 0.18 80)',
  'Cleave': 'oklch(72% 0.18 270)',
  'Council': 'oklch(68% 0.18 155)',
  'Add Waves': 'oklch(72% 0.16 30)',
  'Multi-Phase': 'oklch(65% 0.14 300)',
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
          sub="Midnight Season 1. Three raids, nine bosses. Balance Druid strategies for every encounter."
          accent="solar"
        />
      </div>

      {/* Overview: which fights Balance excels at */}
      <div className="reveal mb-8">
        <div className="text-[11px] uppercase font-bold mb-4" style={{ color: 'oklch(90% 0.005 55)', letterSpacing: '0.12em' }}>
          Balance Druid Effectiveness
        </div>
        <div className="flex flex-wrap gap-2">
          {bosses.map(b => (
            <div key={b.name} className="px-3 py-2 rounded-lg glass card-hover text-center" style={{ minWidth: 90 }}>
              <div className="text-[12px] font-bold mb-1" style={{ color: typeColors[b.type] }}>
                {b.name.split(' ')[0]}
              </div>
              <div className="flex items-center justify-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full"
                    style={{ background: i < b.balanceRating ? 'oklch(80% 0.18 80)' : 'oklch(16% 0.01 270)' }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Excels / Struggles summary */}
      <div className="reveal grid sm:grid-cols-2 gap-4 mb-16">
        <div className="p-5 rounded-lg glass-nature">
          <div className="text-[11px] uppercase font-bold mb-3" style={{ color: 'oklch(68% 0.18 155)', letterSpacing: '0.12em' }}>
            Boomkin Excels
          </div>
          <ul className="space-y-1.5 text-[15px]" style={{ color: 'oklch(92% 0.004 270)', lineHeight: 1.7 }}>
            <li><strong style={{ color: 'oklch(80% 0.18 80)' }}>Lightblinded Vanguard</strong> - Council, 3 targets, Starfall god mode</li>
            <li><strong style={{ color: 'oklch(80% 0.18 80)' }}>Vaelgor & Ezzorak</strong> - Dual boss cleave, multi-DoT</li>
            <li><strong style={{ color: 'oklch(80% 0.18 80)' }}>Fallen-King Salhadaar</strong> - ST + burst AoE on orbs</li>
          </ul>
        </div>
        <div className="p-5 rounded-lg glass">
          <div className="text-[11px] uppercase font-bold mb-3" style={{ color: 'oklch(72% 0.16 30)', letterSpacing: '0.12em' }}>
            Hardest for Boomkin
          </div>
          <ul className="space-y-1.5 text-[15px]" style={{ color: 'oklch(92% 0.004 270)', lineHeight: 1.7 }}>
            <li><strong style={{ color: 'oklch(72% 0.16 30)' }}>Crown of the Cosmos</strong> - Heavy movement, intermittent adds</li>
            <li><strong style={{ color: 'oklch(72% 0.16 30)' }}>Midnight Falls</strong> - Tight enrage, shrinking arena</li>
            <li><strong style={{ color: 'oklch(72% 0.16 30)' }}>Imperator Averzian</strong> - Quick add swaps punish ramp</li>
          </ul>
        </div>
      </div>

      {/* Per-raid groups */}
      {raidGroups.map(group => (
        <div key={group.name} className="mb-12">
          <div className="text-[11px] uppercase font-bold mb-5" style={{ color: 'oklch(80% 0.18 80)', letterSpacing: '0.12em' }}>
            {group.name}
          </div>
          <div className="space-y-4">
            {group.bosses.map((boss) => (
              <BossCard key={boss.name} boss={boss} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function BossCard({ boss }: { boss: BossGuide }) {
  const r = useReveal();
  return (
    <div ref={r} className="reveal">
      <div className="rounded-lg overflow-hidden glass card-hover">
        <div className="px-6 py-4 flex items-center justify-between flex-wrap gap-3"
          style={{ borderBottom: '1px solid oklch(16% 0.012 45)' }}>
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-sm font-bold" style={{ color: 'oklch(82% 0.005 55)', fontVariantNumeric: 'tabular-nums' }}>
              {String(boss.order).padStart(2, '0')}
            </span>
            <h3 className="font-display text-xl font-bold" style={{ color: 'oklch(92% 0.008 60)', fontStyle: 'italic' }}>
              {boss.name}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-bold px-2 py-0.5 rounded"
              style={{ color: typeColors[boss.type], background: `${typeColors[boss.type]}12` }}>
              {boss.type}
            </span>
            <span className="text-[12px] font-bold px-2 py-0.5 rounded"
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

        <div className="px-6 py-5 grid md:grid-cols-2 gap-8">
          <div>
            <div className="text-[11px] uppercase font-bold mb-3" style={{ color: 'oklch(90% 0.005 55)', letterSpacing: '0.12em' }}>
              Key Mechanics
            </div>
            <ul className="space-y-2 mb-6">
              {boss.keyMechanics.map((m, i) => (
                <li key={i} className="flex items-start gap-2 text-[15px]" style={{ color: 'oklch(90% 0.005 270)', lineHeight: 1.7 }}>
                  <span className="w-1 h-1 rounded-full shrink-0 mt-2.5" style={{ background: 'oklch(82% 0.005 55)' }} />
                  {m}
                </li>
              ))}
            </ul>

            <div className="text-[11px] uppercase font-bold mb-3" style={{ color: 'oklch(72% 0.18 270)', letterSpacing: '0.12em' }}>
              Balance Druid Tips
            </div>
            <ul className="space-y-2">
              {boss.balanceTips.map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-[15px]" style={{ color: 'oklch(92% 0.004 270)', lineHeight: 1.7 }}>
                  <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-2" style={{ background: 'oklch(72% 0.18 270)' }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="p-4 rounded-lg mb-4" style={{ background: 'oklch(9% 0.008 45)', border: '1px solid oklch(14% 0.01 45)' }}>
              <div className="text-[11px] uppercase font-bold mb-2" style={{ color: 'oklch(80% 0.18 80)', letterSpacing: '0.12em' }}>
                Cooldown Timing
              </div>
              <p className="text-[15px]" style={{ color: 'oklch(92% 0.004 270)', lineHeight: 1.7 }}>
                {boss.cdTiming}
              </p>
            </div>

            <div className="p-4 rounded-lg" style={{ background: 'oklch(9% 0.008 45)', border: '1px solid oklch(14% 0.01 45)' }}>
              <div className="text-[11px] uppercase font-bold mb-2" style={{ color: 'oklch(68% 0.18 155)', letterSpacing: '0.12em' }}>
                Positioning
              </div>
              <p className="text-[15px]" style={{ color: 'oklch(92% 0.004 270)', lineHeight: 1.7 }}>
                {boss.positioning}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
