/**
 * SectionArt - Atmospheric background artwork for key sections.
 * Uses CSS gradients and SVG to create fantasy ambiance without external images.
 */

interface Props {
  variant: 'lunar' | 'solar' | 'nature' | 'void' | 'eclipse';
}

export default function SectionArt({ variant }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {variant === 'lunar' && <LunarArt />}
      {variant === 'solar' && <SolarArt />}
      {variant === 'nature' && <NatureArt />}
      {variant === 'void' && <VoidArt />}
      {variant === 'eclipse' && <EclipseArt />}
    </div>
  );
}

function LunarArt() {
  return (
    <>
      {/* Large moon glow top right */}
      <div className="absolute" style={{
        top: '-15%',
        right: '-5%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, oklch(68% 0.16 285 / 0.06) 0%, transparent 70%)',
      }} />
      {/* Subtle moonbeam streaks */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" fill="none" style={{ opacity: 0.03 }}>
        <line x1="900" y1="0" x2="400" y2="800" stroke="oklch(68% 0.16 285)" strokeWidth="1" />
        <line x1="1000" y1="0" x2="500" y2="800" stroke="oklch(68% 0.16 285)" strokeWidth="0.5" />
        <line x1="1100" y1="0" x2="600" y2="800" stroke="oklch(68% 0.16 285)" strokeWidth="0.3" />
      </svg>
      {/* Scattered star motes */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" fill="none" style={{ opacity: 0.06 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={i}
            cx={((i * 137) % 1100) + 50}
            cy={((i * 271) % 700) + 50}
            r={1 + (i % 3) * 0.5}
            fill="oklch(80% 0.08 285)"
          />
        ))}
      </svg>
    </>
  );
}

function SolarArt() {
  return (
    <>
      {/* Warm radiance from top left */}
      <div className="absolute" style={{
        top: '-10%',
        left: '-8%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, oklch(78% 0.16 60 / 0.04) 0%, transparent 65%)',
      }} />
      {/* Sunbeam rays */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" fill="none" style={{ opacity: 0.025 }}>
        <line x1="0" y1="100" x2="800" y2="500" stroke="oklch(78% 0.16 60)" strokeWidth="1.5" />
        <line x1="0" y1="200" x2="900" y2="600" stroke="oklch(78% 0.16 60)" strokeWidth="0.8" />
        <line x1="100" y1="0" x2="700" y2="700" stroke="oklch(78% 0.16 60)" strokeWidth="0.5" />
      </svg>
      {/* Golden dust particles */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" fill="none">
        {Array.from({ length: 15 }, (_, i) => {
          const x = ((i * 193) % 1100) + 50;
          const y = ((i * 347) % 700) + 50;
          const dur = 5 + (i % 4) * 2;
          const delay = (i * 0.7) % 6;
          return (
            <circle key={i} cx={x} cy={y} r="1.5" fill="oklch(85% 0.12 60)" opacity="0">
              <animate attributeName="opacity" values="0;0.08;0" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
            </circle>
          );
        })}
      </svg>
    </>
  );
}

function NatureArt() {
  return (
    <>
      {/* Forest glow from bottom */}
      <div className="absolute" style={{
        bottom: '-20%',
        left: '20%',
        width: '500px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, oklch(52% 0.14 155 / 0.04) 0%, transparent 70%)',
      }} />
      {/* Organic vine-like curves */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" fill="none" style={{ opacity: 0.03 }}>
        <path d="M 0 600 Q 300 400 600 500 T 1200 300" stroke="oklch(52% 0.14 155)" strokeWidth="1" fill="none" />
        <path d="M 0 700 Q 400 500 700 600 T 1200 400" stroke="oklch(52% 0.14 155)" strokeWidth="0.5" fill="none" />
      </svg>
    </>
  );
}

function VoidArt() {
  return (
    <>
      {/* Deep void portal effect */}
      <div className="absolute" style={{
        top: '30%',
        right: '-10%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, oklch(30% 0.08 285 / 0.06) 0%, transparent 60%)',
      }} />
      <div className="absolute" style={{
        top: '35%',
        right: '-5%',
        width: '200px',
        height: '200px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, oklch(50% 0.12 285 / 0.04) 0%, transparent 70%)',
      }} />
    </>
  );
}

function EclipseArt() {
  return (
    <>
      {/* Eclipse - sun partially blocked by moon */}
      <div className="absolute" style={{
        top: '5%',
        right: '10%',
        width: '300px',
        height: '300px',
      }}>
        {/* Sun glow */}
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(circle, oklch(78% 0.16 60 / 0.06) 0%, transparent 60%)',
        }} />
        {/* Moon shadow */}
        <div className="absolute rounded-full" style={{
          width: '120px',
          height: '120px',
          top: '40%',
          left: '35%',
          background: 'radial-gradient(circle, oklch(5% 0.01 270 / 0.15) 0%, transparent 80%)',
        }} />
      </div>
      {/* Corona rays */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" fill="none" style={{ opacity: 0.02 }}>
        {Array.from({ length: 8 }, (_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const cx = 1000;
          const cy = 150;
          const len = 200;
          return (
            <line key={i}
              x1={cx} y1={cy}
              x2={cx + Math.cos(angle) * len}
              y2={cy + Math.sin(angle) * len}
              stroke="oklch(78% 0.16 60)"
              strokeWidth="0.5"
            />
          );
        })}
      </svg>
    </>
  );
}
