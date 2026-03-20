import ParallaxStars from './ParallaxStars';

/**
 * CelestialBg - Animated parallax stars with subtle radial gradient.
 * No static images - stars are the show.
 */
export default function CelestialBg() {
  return (
    <>
      <ParallaxStars speed={0.5} />

      {/* Subtle radial vignette for depth */}
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at 50% 30%, transparent 0%, color-mix(in oklch, var(--color-void) 60%, transparent) 50%, var(--color-void) 100%)',
          }}
        />
      </div>
    </>
  );
}
