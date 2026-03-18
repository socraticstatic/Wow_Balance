import { useEffect, useRef } from 'react';

/**
 * CelestialBg - Parallax background with moon, constellations, and floating motes.
 * Three layers at different depths for parallax on scroll.
 * All GPU-composited (transform + opacity only).
 */
export default function CelestialBg() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const scrollY = window.scrollY;
      const layers = containerRef.current.children;
      // Layer 0: moon (slowest)
      (layers[0] as HTMLElement).style.transform = `translateY(${scrollY * 0.08}px)`;
      // Layer 1: constellations
      (layers[1] as HTMLElement).style.transform = `translateY(${scrollY * 0.15}px)`;
      // Layer 2: motes (fastest)
      (layers[2] as HTMLElement).style.transform = `translateY(${scrollY * 0.25}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Layer 0: Crescent moon */}
      <div className="absolute will-change-transform" style={{ top: '8%', right: '12%' }}>
        <svg width="180" height="180" viewBox="0 0 180 180" fill="none" style={{ opacity: 0.06 }}>
          <circle cx="90" cy="90" r="80" fill="oklch(78% 0.16 60)" />
          <circle cx="120" cy="75" r="70" fill="oklch(7% 0.01 45)" />
        </svg>
      </div>

      {/* Layer 1: Constellation patterns */}
      <div className="absolute inset-0 will-change-transform">
        <svg width="100%" height="100%" viewBox="0 0 1200 3000" fill="none" style={{ opacity: 0.04 }}>
          {/* Constellation 1 - top right (Elune's eye) */}
          <ConstellationGroup cx={900} cy={200} />
          {/* Constellation 2 - mid left */}
          <ConstellationGroup cx={150} cy={800} />
          {/* Constellation 3 - center */}
          <ConstellationGroup cx={600} cy={1400} />
          {/* Constellation 4 - right */}
          <ConstellationGroup cx={950} cy={2000} />
          {/* Constellation 5 - left bottom */}
          <ConstellationGroup cx={200} cy={2600} />

          {/* Scattered individual stars */}
          {Array.from({ length: 40 }, (_, i) => {
            const x = ((i * 137.5) % 1200);
            const y = ((i * 271.3) % 3000);
            const r = 1 + (i % 3) * 0.5;
            return <circle key={i} cx={x} cy={y} r={r} fill="oklch(85% 0.06 60)" opacity={0.3 + (i % 5) * 0.1} />;
          })}
        </svg>
      </div>

      {/* Layer 2: Floating motes of light */}
      <div className="absolute inset-0 will-change-transform">
        <svg width="100%" height="100%" viewBox="0 0 1200 3000" fill="none">
          {Array.from({ length: 20 }, (_, i) => {
            const x = ((i * 193.7) % 1200);
            const y = ((i * 347.1) % 3000);
            const delay = (i * 0.8) % 6;
            const dur = 4 + (i % 3) * 2;
            return (
              <circle key={i} cx={x} cy={y} r="2" fill="oklch(85% 0.1 60)" opacity="0">
                <animate attributeName="opacity" values="0;0.15;0" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
                <animate attributeName="cy" values={`${y};${y - 30};${y}`} dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
              </circle>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

/** A small constellation cluster - connected stars */
function ConstellationGroup({ cx, cy }: { cx: number; cy: number }) {
  // Generate a small cluster of 5-7 connected stars
  const points = [
    [cx, cy],
    [cx + 35, cy - 20],
    [cx + 60, cy + 10],
    [cx + 25, cy + 40],
    [cx - 15, cy + 25],
    [cx + 50, cy + 50],
  ];

  const lines = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [2, 5],
  ];

  return (
    <g>
      {lines.map(([a, b], i) => (
        <line
          key={`l${i}`}
          x1={points[a][0]} y1={points[a][1]}
          x2={points[b][0]} y2={points[b][1]}
          stroke="oklch(78% 0.1 60)"
          strokeWidth="0.5"
          opacity="0.5"
        />
      ))}
      {points.map(([x, y], i) => (
        <circle key={`p${i}`} cx={x} cy={y} r={i === 0 ? 2.5 : 1.5} fill="oklch(85% 0.08 60)" opacity="0.7" />
      ))}
    </g>
  );
}
