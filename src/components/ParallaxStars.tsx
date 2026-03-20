import { useMemo } from 'react';

/**
 * ParallaxStars - Three layers of animated stars at different speeds.
 * Pure CSS box-shadow rendering. Zero dependencies.
 * Adapted from Superdesign parallax-stars-background prompt.
 */

const generateBoxShadows = (n: number, maxW: number, maxH: number, colors: string[]) => {
  const shadows: string[] = [];
  for (let i = 0; i < n; i++) {
    const x = Math.floor(Math.random() * maxW);
    const y = Math.floor(Math.random() * maxH);
    const color = colors[Math.floor(Math.random() * colors.length)];
    shadows.push(`${x}px ${y}px ${color}`);
  }
  return shadows.join(', ');
};

interface Props {
  speed?: number;
  className?: string;
}

export default function ParallaxStars({ speed = 1, className = '' }: Props) {
  // Lunar blues, golds, and white - matching the Balance Druid palette
  const starColors = [
    '#fff',
    '#fff',
    '#fff',
    'oklch(78% 0.16 60)',   // solar gold
    'oklch(72% 0.18 270)',  // lunar blue
    'oklch(85% 0.08 80)',   // faint gold
  ];

  const shadowsSmall = useMemo(() => generateBoxShadows(800, 2560, 2560, ['#fff', '#fff', '#dde']), []);
  const shadowsMedium = useMemo(() => generateBoxShadows(250, 2560, 2560, starColors), []);
  const shadowsBig = useMemo(() => generateBoxShadows(80, 2560, 2560, starColors), []);

  return (
    <div className={`fixed inset-0 z-0 pointer-events-none overflow-hidden ${className}`} aria-hidden="true">
      <style>{`
        @keyframes starDrift {
          from { transform: translateY(0); }
          to { transform: translateY(-2560px); }
        }
      `}</style>

      {/* Layer 1: Small distant stars */}
      <div
        className="absolute left-0 top-0 w-[1px] h-[1px] bg-transparent"
        style={{
          boxShadow: shadowsSmall,
          animation: `starDrift ${60 / speed}s linear infinite`,
        }}
      >
        <div
          className="absolute top-[2560px] w-[1px] h-[1px] bg-transparent"
          style={{ boxShadow: shadowsSmall }}
        />
      </div>

      {/* Layer 2: Medium stars */}
      <div
        className="absolute left-0 top-0 w-[2px] h-[2px] bg-transparent rounded-full"
        style={{
          boxShadow: shadowsMedium,
          animation: `starDrift ${120 / speed}s linear infinite`,
        }}
      >
        <div
          className="absolute top-[2560px] w-[2px] h-[2px] bg-transparent rounded-full"
          style={{ boxShadow: shadowsMedium }}
        />
      </div>

      {/* Layer 3: Large bright stars */}
      <div
        className="absolute left-0 top-0 w-[3px] h-[3px] bg-transparent rounded-full"
        style={{
          boxShadow: shadowsBig,
          animation: `starDrift ${180 / speed}s linear infinite`,
        }}
      >
        <div
          className="absolute top-[2560px] w-[3px] h-[3px] bg-transparent rounded-full"
          style={{ boxShadow: shadowsBig }}
        />
      </div>
    </div>
  );
}
