/**
 * SectionArt - Real photography backgrounds for key sections.
 * Uses Unsplash images (free license). Dark overlay preserves text readability.
 */

interface Props {
  variant: 'lunar' | 'solar' | 'nature' | 'void' | 'eclipse';
}

const BASE = import.meta.env.BASE_URL;
const images: Record<string, string> = {
  lunar: `${BASE}art/lunar-nebula.jpg`,
  solar: `${BASE}art/solar-golden.jpg`,
  nature: `${BASE}art/nature-forest.jpg`,
  void: `${BASE}art/void-space.jpg`,
  eclipse: `${BASE}art/hero-cosmic.jpg`,
};

// Each variant gets a tinted overlay that blends with the site's warm dark palette
// Overlays use CSS variable for void color so they flip with light/dark mode
const overlays: Record<string, string> = {
  lunar: 'linear-gradient(180deg, color-mix(in oklch, var(--color-void) 70%, oklch(50% 0.02 285)) 0%, color-mix(in oklch, var(--color-void) 85%, transparent) 60%, var(--color-void) 100%)',
  solar: 'linear-gradient(180deg, color-mix(in oklch, var(--color-void) 65%, oklch(50% 0.02 55)) 0%, color-mix(in oklch, var(--color-void) 85%, transparent) 60%, var(--color-void) 100%)',
  nature: 'linear-gradient(180deg, color-mix(in oklch, var(--color-void) 68%, oklch(50% 0.02 155)) 0%, color-mix(in oklch, var(--color-void) 85%, transparent) 60%, var(--color-void) 100%)',
  void: 'linear-gradient(180deg, color-mix(in oklch, var(--color-void) 60%, oklch(50% 0.02 285)) 0%, color-mix(in oklch, var(--color-void) 85%, transparent) 60%, var(--color-void) 100%)',
  eclipse: 'linear-gradient(180deg, color-mix(in oklch, var(--color-void) 55%, transparent) 0%, color-mix(in oklch, var(--color-void) 80%, transparent) 50%, var(--color-void) 100%)',
};

export default function SectionArt({ variant }: Props) {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {/* Real photograph */}
      <img
        src={images[variant]}
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: 0.5,
          mixBlendMode: 'lighten',
          filter: 'saturate(0.7) contrast(1.15)',
        }}
      />
      {/* Tinted overlay for readability */}
      <div
        className="absolute inset-0"
        style={{ background: overlays[variant] }}
      />
    </div>
  );
}
