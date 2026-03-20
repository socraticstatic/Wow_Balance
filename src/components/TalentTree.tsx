import { useState, useEffect } from 'react';
import { getSpellIcon } from '../utils/wowIcons';

/**
 * Full Balance Druid spec talent tree - Midnight 12.0.1.
 * 38 nodes across 11 rows, 7 columns. Scraped from Wowhead talent calculator.
 * Animated entrance, glow pulses on active nodes, hover tooltips.
 */

interface TalentNode {
  name: string;       // Display name (for choice nodes: "A / B")
  row: number;        // 0-10
  col: number;        // 0-6
  type: 'passive' | 'active' | 'choice';
  selected?: boolean; // true = picked in the recommended AoE build
  pick?: string;      // For choice nodes: which option to pick
}

// Real Midnight 12.0.1 Balance spec tree from Wowhead
// selected = true means this talent is picked in the recommended Elune's Chosen AoE M+ build.
// pick = which side of a choice node to take.
const specTalents: TalentNode[] = [
  // Row 0 - Entry
  { name: 'Eclipse', row: 0, col: 3, type: 'passive', selected: true },
  // Row 1
  { name: 'Shooting Stars', row: 1, col: 2, type: 'passive', selected: true },
  { name: 'Solar Beam', row: 1, col: 4, type: 'active', selected: true },
  // Row 2
  { name: 'Solstice', row: 2, col: 1, type: 'passive', selected: true },
  { name: 'Astral Smolder', row: 2, col: 3, type: 'passive', selected: true },
  { name: 'Twin Moons', row: 2, col: 5, type: 'passive', selected: true },
  // Row 3
  { name: 'Improved Eclipse', row: 3, col: 0, type: 'passive', selected: false },
  { name: 'Nature\'s Balance', row: 3, col: 2, type: 'passive', selected: false },
  { name: 'Umbral Intensity', row: 3, col: 4, type: 'passive', selected: false },
  { name: 'Aetherial Kindling / Meteor Storm', row: 3, col: 6, type: 'choice', selected: true, pick: 'Aetherial Kindling' },
  // Row 4
  { name: 'Wild Surges', row: 4, col: 1, type: 'passive', selected: true },
  { name: 'Celestial Alignment', row: 4, col: 3, type: 'active', selected: true },
  { name: 'Soul of the Forest', row: 4, col: 5, type: 'passive', selected: true },
  // Row 5
  { name: 'Sunseeker Mushroom / Wild Mushroom', row: 5, col: 0, type: 'choice', selected: true, pick: 'Sunseeker Mushroom' },
  { name: 'Nature\'s Grace / Elune\'s Challenge', row: 5, col: 1, type: 'choice', selected: true, pick: 'Nature\'s Grace' },
  { name: 'Stellar Amplification', row: 5, col: 2, type: 'passive', selected: false },
  { name: 'Whirling Stars / Orbital Strike', row: 5, col: 3, type: 'choice', selected: true, pick: 'Orbital Strike' },
  { name: 'Touch the Cosmos', row: 5, col: 4, type: 'passive', selected: true },
  { name: 'Meteorites', row: 5, col: 6, type: 'passive', selected: false },
  // Row 6
  { name: 'Cosmic Rapidity', row: 6, col: 1, type: 'passive', selected: true },
  { name: 'Celestial Fire', row: 6, col: 2, type: 'active', selected: false },
  { name: 'Astral Communion', row: 6, col: 3, type: 'active', selected: false },
  { name: 'Hail of Stars', row: 6, col: 4, type: 'passive', selected: false },
  { name: 'Starlord', row: 6, col: 5, type: 'passive', selected: true },
  // Row 7
  { name: 'Sculpt the Stars', row: 7, col: 1, type: 'passive', selected: false },
  { name: 'Balance of All Things', row: 7, col: 2, type: 'passive', selected: true },
  { name: 'Total Eclipse', row: 7, col: 3, type: 'passive', selected: false },
  { name: 'Starweaver / Rattle the Stars', row: 7, col: 4, type: 'choice', selected: true, pick: 'Rattle the Stars' },
  { name: 'Power of Goldrinn', row: 7, col: 5, type: 'passive', selected: true },
  // Row 8 - Major choices
  { name: 'Sundered Firmament / Orbit Breaker', row: 8, col: 1, type: 'choice', selected: false },
  { name: 'Incarnation / Convoke', row: 8, col: 3, type: 'choice', selected: true, pick: 'Incarnation: Chosen of Elune' },
  { name: 'Fury of Elune / New Moon', row: 8, col: 5, type: 'choice', selected: true, pick: 'Fury of Elune' },
  // Row 9
  { name: 'Umbral Embrace', row: 9, col: 1, type: 'passive', selected: true },
  { name: 'Harmony of the Heavens', row: 9, col: 2, type: 'passive', selected: true },
  { name: 'Orbital Bombardment', row: 9, col: 3, type: 'passive', selected: false },
  { name: 'Elune\'s Guidance', row: 9, col: 4, type: 'passive', selected: true },
  { name: 'Radiant Moonlight', row: 9, col: 5, type: 'passive', selected: true },
  // Row 10 - Capstones
  { name: 'Waning Twilight / Denizen of the Dream', row: 10, col: 2, type: 'choice', selected: true, pick: 'Waning Twilight' },
  { name: 'The Eternal Moon', row: 10, col: 3, type: 'passive', selected: false },
  { name: 'Lunar Shrapnel / Elune\'s Wrath', row: 10, col: 4, type: 'choice', selected: false },
];

// Connections between adjacent rows
const connections: [number, number][] = [
  // Row 0 -> 1
  [0, 1], [0, 2],
  // Row 1 -> 2
  [1, 3], [1, 4], [2, 4], [2, 5],
  // Row 2 -> 3
  [3, 6], [3, 7], [4, 7], [4, 8], [5, 8], [5, 9],
  // Row 3 -> 4
  [6, 10], [7, 10], [7, 11], [8, 11], [8, 12], [9, 12],
  // Row 4 -> 5
  [10, 13], [10, 14], [11, 15], [11, 16], [12, 17], [12, 18],
  // Row 5 -> 6
  [13, 19], [14, 19], [15, 20], [16, 21], [17, 22], [17, 23], [18, 23],
  // Row 6 -> 7
  [19, 24], [20, 25], [21, 26], [22, 27], [23, 28],
  // Row 7 -> 8
  [24, 29], [25, 29], [26, 30], [27, 30], [28, 31],
  // Row 8 -> 9
  [29, 32], [29, 33], [30, 33], [30, 34], [31, 35], [31, 36],
  // Row 9 -> 10
  [32, 37], [33, 38], [34, 39], [35, 40], [36, 41],
];

interface Props {
  activeKeystones: string[];
  buildName: string;
}

// Use the node's built-in `selected` property
function isNodeActive(node: TalentNode): boolean {
  return node.selected === true;
}

// Get the icon name - for choice nodes, use the `pick` value if selected
function getIconName(node: TalentNode): string {
  if (node.pick && node.selected) return node.pick;
  if (!node.name.includes('/')) return node.name;
  const parts = node.name.split('/').map(s => s.trim());
  return node.pick || parts[0];
}

export default function TalentTree({ buildName }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setEntered(false);
    const t = setTimeout(() => setEntered(true), 80);
    return () => clearTimeout(t);
  }, [buildName]);

  const maxRow = 10;
  const maxCol = 6;
  const nodeSize = 38;
  const gapX = 62;
  const gapY = 52;
  const padX = 32;
  const padY = 24;
  const svgW = padX * 2 + maxCol * gapX + nodeSize;
  const svgH = padY * 2 + maxRow * gapY + nodeSize;

  const pos = (row: number, col: number) => ({
    x: padX + col * gapX + nodeSize / 2,
    y: padY + row * gapY + nodeSize / 2,
  });

  const activeCount = specTalents.filter((_, i) => isNodeActive(specTalents[i])).length;

  return (
    <div className="relative">
      <div className="text-[11px] uppercase font-bold mb-4 flex items-center gap-3 flex-wrap" style={{ color: 'var(--color-lunar)', letterSpacing: '0.12em' }}>
        <span>Balance Spec Tree</span>
        <span className="px-2 py-0.5 rounded" style={{ color: 'var(--color-solar)', background: 'color-mix(in oklch, var(--color-solar) 10%, transparent)' }}>
          {buildName}
        </span>
        <span style={{ color: 'var(--color-text-2)' }}>
          {activeCount}/{specTalents.length} highlighted
        </span>
        <span style={{ color: 'var(--color-text-4)' }}>
          Midnight 12.0.1
        </span>
      </div>

      <div className="overflow-x-auto rounded-lg p-3" style={{ background: 'color-mix(in oklch, var(--color-void) 60%, transparent)' }}>
        <svg
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="block mx-auto"
        >
          <defs>
            <radialGradient id="activeGlow">
              <stop offset="0%" stopColor="oklch(78% 0.16 60)" stopOpacity="0.25">
                <animate attributeName="stop-opacity" values="0.25;0.1;0.25" dur="3s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="oklch(78% 0.16 60)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Connections */}
          {connections.map(([fromIdx, toIdx], i) => {
            const from = specTalents[fromIdx];
            const to = specTalents[toIdx];
            if (!from || !to) return null;
            const p1 = pos(from.row, from.col);
            const p2 = pos(to.row, to.col);
            const bothActive = isNodeActive(from) && isNodeActive(to);
            const delay = (from.row + to.row) * 30;

            return (
              <line
                key={`c${i}`}
                x1={p1.x} y1={p1.y + nodeSize / 2 - 1}
                x2={p2.x} y2={p2.y - nodeSize / 2 + 1}
                stroke={bothActive ? 'oklch(78% 0.16 60 / 0.45)' : 'oklch(16% 0.008 270 / 0.5)'}
                strokeWidth={bothActive ? 1.5 : 0.5}
                style={{ opacity: entered ? 1 : 0, transition: `opacity 0.4s ease ${delay}ms` }}
              />
            );
          })}

          {/* Nodes */}
          {specTalents.map((t, idx) => {
            const p = pos(t.row, t.col);
            const active = isNodeActive(t);
            const isHov = hovered === idx;
            const isChoice = t.type === 'choice';
            const delay = t.row * 60 + t.col * 15;
            const iconSz = 24;
            const iconName = getIconName(t);

            return (
              <g
                key={idx}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  cursor: 'pointer',
                  opacity: entered ? 1 : 0,
                  transform: entered ? 'none' : `translateY(6px)`,
                  transition: `opacity 0.45s ease ${delay}ms, transform 0.45s ease ${delay}ms`,
                }}
              >
                {/* Glow */}
                {active && <circle cx={p.x} cy={p.y} r={nodeSize / 2 + 6} fill="url(#activeGlow)" />}
                {active && <circle cx={p.x} cy={p.y} r={nodeSize / 2 + 2} fill="none" stroke="oklch(78% 0.16 60 / 0.35)" strokeWidth={1} />}

                {/* Shape */}
                {isChoice ? (
                  <rect
                    x={p.x - nodeSize / 2 + 5} y={p.y - nodeSize / 2 + 5}
                    width={nodeSize - 10} height={nodeSize - 10}
                    rx={3}
                    transform={`rotate(45 ${p.x} ${p.y})`}
                    fill={active ? 'oklch(13% 0.018 60)' : 'oklch(8% 0.006 270)'}
                    stroke={active ? 'oklch(78% 0.16 60 / 0.5)' : isHov ? 'oklch(28% 0.015 270)' : 'oklch(15% 0.01 270)'}
                    strokeWidth={isHov ? 1.5 : 0.75}
                  />
                ) : (
                  <rect
                    x={p.x - nodeSize / 2} y={p.y - nodeSize / 2}
                    width={nodeSize} height={nodeSize}
                    rx={t.type === 'active' ? 6 : 19}
                    fill={active ? 'oklch(13% 0.018 60)' : 'oklch(8% 0.006 270)'}
                    stroke={active ? 'oklch(78% 0.16 60 / 0.5)' : isHov ? 'oklch(28% 0.015 270)' : 'oklch(15% 0.01 270)'}
                    strokeWidth={isHov ? 1.5 : 0.75}
                  />
                )}

                {/* Icon */}
                <clipPath id={`tc${idx}`}>
                  <rect x={p.x - iconSz / 2} y={p.y - iconSz / 2} width={iconSz} height={iconSz} rx={t.type === 'active' ? 3 : isChoice ? 3 : 12} />
                </clipPath>
                <image
                  href={getSpellIcon(iconName, 'large')}
                  x={p.x - iconSz / 2} y={p.y - iconSz / 2}
                  width={iconSz} height={iconSz}
                  clipPath={`url(#tc${idx})`}
                  opacity={active ? 1 : 0.25}
                  style={{ transition: 'opacity 0.2s ease' }}
                />

                {/* Dim overlay */}
                {!active && !isHov && (
                  <rect
                    x={p.x - nodeSize / 2} y={p.y - nodeSize / 2}
                    width={nodeSize} height={nodeSize}
                    rx={t.type === 'active' ? 6 : isChoice ? 3 : 19}
                    fill="oklch(6% 0.004 270 / 0.35)"
                    transform={isChoice ? `rotate(45 ${p.x} ${p.y})` : undefined}
                    style={{ pointerEvents: 'none' }}
                  />
                )}

                {/* Hover ring */}
                {isHov && (
                  <circle cx={p.x} cy={p.y} r={nodeSize / 2 + 4} fill="none"
                    stroke={active ? 'oklch(78% 0.16 60 / 0.25)' : 'oklch(45% 0.02 270 / 0.15)'} strokeWidth={1}
                  />
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Tooltip */}
      {hovered !== null && (() => {
        const t = specTalents[hovered];
        if (!t) return null;
        const active = isNodeActive(t);
        const iconName = getIconName(t);
        const displayName = t.name.includes('/') ? t.name.split('/').map(s => s.trim()).join('  /  ') : t.name;

        return (
          <div
            className="glass rounded-lg p-3 mt-2 max-w-sm"
            style={{
              borderLeft: `2px solid ${active ? 'var(--color-solar)' : 'var(--color-text-ghost)'}`,
              animation: 'ttFade 0.12s ease',
            }}
          >
            <style>{`@keyframes ttFade { from { opacity:0; transform:translateY(3px); } to { opacity:1; transform:translateY(0); } }`}</style>
            <div className="flex items-center gap-2 mb-1">
              <img src={getSpellIcon(iconName, 'medium')} alt="" className="w-6 h-6 rounded"
                style={{ border: active ? '1px solid color-mix(in oklch, var(--color-solar) 30%, transparent)' : '1px solid var(--color-surface-3)' }} />
              <div>
                <div className="text-[15px] font-bold" style={{ color: active ? 'var(--color-solar)' : 'var(--color-text-4)' }}>
                  {displayName}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px]" style={{ color: 'var(--color-text-2)' }}>
                    {t.type === 'choice' ? 'Choice' : t.type === 'active' ? 'Active' : 'Passive'} - Row {t.row + 1}
                  </span>
                  {active && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ color: 'var(--color-solar)', background: 'color-mix(in oklch, var(--color-solar) 10%, transparent)' }}>
                      IN BUILD
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
