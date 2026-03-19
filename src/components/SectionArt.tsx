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
const overlays: Record<string, string> = {
  lunar: 'linear-gradient(180deg, oklch(7% 0.015 285 / 0.7) 0%, oklch(7% 0.01 45 / 0.85) 60%, oklch(7% 0.01 45) 100%)',
  solar: 'linear-gradient(180deg, oklch(7% 0.015 55 / 0.65) 0%, oklch(7% 0.01 45 / 0.85) 60%, oklch(7% 0.01 45) 100%)',
  nature: 'linear-gradient(180deg, oklch(7% 0.015 155 / 0.68) 0%, oklch(7% 0.01 45 / 0.85) 60%, oklch(7% 0.01 45) 100%)',
  void: 'linear-gradient(180deg, oklch(5% 0.01 285 / 0.6) 0%, oklch(7% 0.01 45 / 0.85) 60%, oklch(7% 0.01 45) 100%)',
  eclipse: 'linear-gradient(180deg, oklch(7% 0.01 45 / 0.55) 0%, oklch(7% 0.01 45 / 0.8) 50%, oklch(7% 0.01 45) 100%)',
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
