/**
 * SectionArt - Real photography backgrounds for key sections.
 * Uses Unsplash images (free license). Dark overlay preserves text readability.
 */

interface Props {
  variant: 'lunar' | 'solar' | 'nature' | 'void' | 'eclipse';
}

const images: Record<string, string> = {
  lunar: '/art/lunar-nebula.jpg',
  solar: '/art/solar-golden.jpg',
  nature: '/art/nature-forest.jpg',
  void: '/art/void-space.jpg',
  eclipse: '/art/hero-cosmic.jpg',
};

// Each variant gets a tinted overlay that blends with the site's warm dark palette
const overlays: Record<string, string> = {
  lunar: 'linear-gradient(180deg, oklch(7% 0.015 285 / 0.82) 0%, oklch(7% 0.01 45 / 0.92) 60%, oklch(7% 0.01 45) 100%)',
  solar: 'linear-gradient(180deg, oklch(7% 0.015 55 / 0.78) 0%, oklch(7% 0.01 45 / 0.92) 60%, oklch(7% 0.01 45) 100%)',
  nature: 'linear-gradient(180deg, oklch(7% 0.015 155 / 0.8) 0%, oklch(7% 0.01 45 / 0.92) 60%, oklch(7% 0.01 45) 100%)',
  void: 'linear-gradient(180deg, oklch(5% 0.01 285 / 0.75) 0%, oklch(7% 0.01 45 / 0.92) 60%, oklch(7% 0.01 45) 100%)',
  eclipse: 'linear-gradient(180deg, oklch(7% 0.01 45 / 0.7) 0%, oklch(7% 0.01 45 / 0.88) 50%, oklch(7% 0.01 45) 100%)',
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
          opacity: 0.35,
          mixBlendMode: 'lighten',
          filter: 'saturate(0.6) contrast(1.1)',
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
