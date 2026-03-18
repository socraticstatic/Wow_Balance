/**
 * SectionArt - Bold atmospheric background artwork for key sections.
 * CSS gradients + SVG. Visible. Not subtle. Fantasy atmosphere.
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
        top: '-20%',
        right: '-10%',
        width: '700px',
        height: '700px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, oklch(60% 0.2 285 / 0.15) 0%, oklch(50% 0.15 285 / 0.06) 40%, transparent 70%)',
      }} />
      {/* Crescent moon shape */}
      <svg className="absolute" style={{ top: '5%', right: '8%', opacity: 0.12 }} width="200" height="200" viewBox="0 0 200 200" fill="none">
        <circle cx="100" cy="100" r="80" fill="oklch(75% 0.12 285)" />
        <circle cx="130" cy="85" r="70" fill="oklch(7% 0.01 45)" />
      </svg>
      {/* Moonbeam streaks */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" fill="none" style={{ opacity: 0.08 }}>
        <line x1="900" y1="0" x2="400" y2="800" stroke="oklch(68% 0.16 285)" strokeWidth="1.5" />
        <line x1="1000" y1="0" x2="500" y2="800" stroke="oklch(68% 0.16 285)" strokeWidth="0.8" />
        <line x1="1100" y1="0" x2="600" y2="800" stroke="oklch(68% 0.16 285)" strokeWidth="0.5" />
      </svg>
      {/* Star motes */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" fill="none">
        {Array.from({ length: 20 }, (_, i) => {
          const x = ((i * 137) % 1100) + 50;
          const y = ((i * 271) % 700) + 50;
          const r = 1.5 + (i % 3);
          const dur = 4 + (i % 3) * 2;
          const delay = (i * 0.6) % 5;
          return (
            <circle key={i} cx={x} cy={y} r={r} fill="oklch(85% 0.1 285)">
              <animate attributeName="opacity" values="0.05;0.25;0.05" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
            </circle>
          );
        })}
      </svg>
    </>
  );
}

function SolarArt() {
  return (
    <>
      {/* Warm radiance from top left */}
      <div className="absolute" style={{
        top: '-15%',
        left: '-10%',
        width: '800px',
        height: '800px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, oklch(78% 0.18 60 / 0.12) 0%, oklch(65% 0.14 55 / 0.05) 40%, transparent 65%)',
      }} />
      {/* Sun disc */}
      <svg className="absolute" style={{ top: '-3%', left: '2%', opacity: 0.08 }} width="300" height="300" viewBox="0 0 300 300" fill="none">
        <circle cx="150" cy="150" r="60" fill="oklch(85% 0.16 60)" />
        <circle cx="150" cy="150" r="100" fill="none" stroke="oklch(78% 0.14 60)" strokeWidth="0.5" opacity="0.5" />
        <circle cx="150" cy="150" r="130" fill="none" stroke="oklch(78% 0.14 60)" strokeWidth="0.3" opacity="0.3" />
      </svg>
      {/* Sunbeam rays */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" fill="none" style={{ opacity: 0.06 }}>
        <line x1="0" y1="80" x2="900" y2="500" stroke="oklch(78% 0.16 60)" strokeWidth="2" />
        <line x1="0" y1="180" x2="1000" y2="600" stroke="oklch(78% 0.16 60)" strokeWidth="1" />
        <line x1="100" y1="0" x2="700" y2="700" stroke="oklch(78% 0.16 60)" strokeWidth="0.6" />
        <line x1="50" y1="0" x2="500" y2="400" stroke="oklch(85% 0.12 65)" strokeWidth="0.4" />
      </svg>
      {/* Golden dust */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" fill="none">
        {Array.from({ length: 25 }, (_, i) => {
          const x = ((i * 193) % 1100) + 50;
          const y = ((i * 347) % 700) + 50;
          const dur = 5 + (i % 4) * 2;
          const delay = (i * 0.7) % 6;
          return (
            <circle key={i} cx={x} cy={y} r="2" fill="oklch(88% 0.14 60)">
              <animate attributeName="opacity" values="0;0.2;0" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
              <animate attributeName="cy" values={`${y};${y - 20};${y}`} dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
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
        bottom: '-25%',
        left: '10%',
        width: '700px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, oklch(52% 0.16 155 / 0.1) 0%, oklch(45% 0.12 155 / 0.04) 40%, transparent 70%)',
      }} />
      {/* Organic vine curves */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" fill="none" style={{ opacity: 0.1 }}>
        <path d="M 0 600 Q 300 400 600 500 T 1200 300" stroke="oklch(55% 0.16 155)" strokeWidth="1.5" fill="none" />
        <path d="M 0 700 Q 400 500 700 600 T 1200 400" stroke="oklch(50% 0.14 155)" strokeWidth="0.8" fill="none" />
        <path d="M 200 800 Q 500 600 800 700 T 1200 500" stroke="oklch(48% 0.12 155)" strokeWidth="0.5" fill="none" />
      </svg>
      {/* Leaf-like floating particles */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" fill="none">
        {Array.from({ length: 15 }, (_, i) => {
          const x = ((i * 167) % 1100) + 50;
          const y = ((i * 293) % 700) + 50;
          const dur = 6 + (i % 3) * 3;
          const delay = (i * 0.9) % 7;
          return (
            <ellipse key={i} cx={x} cy={y} rx="3" ry="1.5" fill="oklch(60% 0.14 155)" transform={`rotate(${(i * 30) % 360} ${x} ${y})`}>
              <animate attributeName="opacity" values="0;0.15;0" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
              <animate attributeName="cy" values={`${y};${y - 25};${y}`} dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
            </ellipse>
          );
        })}
      </svg>
    </>
  );
}

function VoidArt() {
  return (
    <>
      {/* Void portal - concentric rings */}
      <div className="absolute" style={{
        top: '20%',
        right: '-8%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, oklch(35% 0.12 285 / 0.15) 0%, oklch(25% 0.08 285 / 0.08) 30%, transparent 60%)',
      }} />
      <div className="absolute" style={{
        top: '28%',
        right: '0%',
        width: '250px',
        height: '250px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, oklch(50% 0.16 285 / 0.1) 0%, transparent 70%)',
      }} />
      {/* Void tendrils */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" fill="none" style={{ opacity: 0.08 }}>
        <path d="M 1200 300 Q 900 250 800 400 T 600 350" stroke="oklch(55% 0.14 285)" strokeWidth="1" fill="none" />
        <path d="M 1200 400 Q 950 380 850 500 T 700 450" stroke="oklch(50% 0.12 285)" strokeWidth="0.6" fill="none" />
        <path d="M 1200 500 Q 1000 450 900 550 T 750 520" stroke="oklch(45% 0.1 285)" strokeWidth="0.4" fill="none" />
      </svg>
      {/* Void particles drifting inward */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" fill="none">
        {Array.from({ length: 12 }, (_, i) => {
          const x = 800 + ((i * 73) % 350);
          const y = 200 + ((i * 131) % 400);
          const dur = 5 + (i % 4) * 2;
          const delay = (i * 0.8) % 6;
          return (
            <circle key={i} cx={x} cy={y} r="2" fill="oklch(60% 0.16 285)">
              <animate attributeName="opacity" values="0;0.2;0" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
            </circle>
          );
        })}
      </svg>
    </>
  );
}

function EclipseArt() {
  return (
    <>
      {/* Eclipse - sun corona with moon shadow */}
      <div className="absolute" style={{
        top: '0%',
        right: '5%',
        width: '400px',
        height: '400px',
      }}>
        {/* Corona glow */}
        <div className="absolute inset-0 rounded-full" style={{
          background: 'radial-gradient(circle, oklch(78% 0.18 60 / 0.15) 0%, oklch(70% 0.14 55 / 0.06) 40%, transparent 65%)',
        }} />
        {/* Sun ring */}
        <svg className="absolute inset-0" viewBox="0 0 400 400" fill="none" style={{ opacity: 0.1 }}>
          <circle cx="200" cy="200" r="80" fill="none" stroke="oklch(82% 0.16 60)" strokeWidth="1.5" />
          <circle cx="200" cy="200" r="60" fill="oklch(85% 0.14 60)" opacity="0.3" />
        </svg>
        {/* Moon shadow crossing */}
        <div className="absolute rounded-full" style={{
          width: '130px',
          height: '130px',
          top: '35%',
          left: '30%',
          background: 'oklch(7% 0.01 45)',
          boxShadow: '0 0 40px 20px oklch(7% 0.01 45 / 0.5)',
        }} />
      </div>
      {/* Corona rays radiating outward */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" fill="none" style={{ opacity: 0.06 }}>
        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const cx = 1020;
          const cy = 200;
          const innerR = 90;
          const outerR = 300;
          return (
            <line key={i}
              x1={cx + Math.cos(angle) * innerR}
              y1={cy + Math.sin(angle) * innerR}
              x2={cx + Math.cos(angle) * outerR}
              y2={cy + Math.sin(angle) * outerR}
              stroke="oklch(78% 0.16 60)"
              strokeWidth={i % 3 === 0 ? '1' : '0.4'}
            />
          );
        })}
      </svg>
      {/* Dual-tone particles: gold near sun, purple near moon */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 800" fill="none">
        {Array.from({ length: 18 }, (_, i) => {
          const x = 700 + ((i * 67) % 450);
          const y = ((i * 131) % 500) + 50;
          const isGold = x > 1000;
          const fill = isGold ? 'oklch(85% 0.14 60)' : 'oklch(70% 0.14 285)';
          const dur = 4 + (i % 3) * 2;
          const delay = (i * 0.5) % 5;
          return (
            <circle key={i} cx={x} cy={y} r="2" fill={fill}>
              <animate attributeName="opacity" values="0;0.2;0" dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" />
            </circle>
          );
        })}
      </svg>
    </>
  );
}
