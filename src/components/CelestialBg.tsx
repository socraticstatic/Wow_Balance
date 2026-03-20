import { useEffect, useRef } from 'react';
import ParallaxStars from './ParallaxStars';

/**
 * CelestialBg - Layered cosmic background:
 * 1. Parallax stars (animated, multi-layer depth)
 * 2. Cosmic photograph (parallax scroll)
 * 3. Dark gradient overlay
 */
export default function CelestialBg() {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        if (imgRef.current) {
          const scrollY = window.scrollY;
          imgRef.current.style.transform = `translateY(${scrollY * 0.15}px) scale(1.1)`;
        }
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Layer 0: Animated parallax stars */}
      <ParallaxStars speed={0.5} />

      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {/* Layer 1: Cosmic photograph */}
        <img
          ref={imgRef}
          src={`${import.meta.env.BASE_URL}art/hero-cosmic.jpg`}
          alt=""
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          style={{
            opacity: 0.12,
            filter: 'saturate(0.5) contrast(1.2)',
            transform: 'scale(1.1)',
          }}
        />
        {/* Layer 2: Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, color-mix(in oklch, var(--color-void) 40%, transparent) 0%, color-mix(in oklch, var(--color-void) 75%, transparent) 30%, color-mix(in oklch, var(--color-void) 92%, transparent) 60%, var(--color-void) 100%)',
          }}
        />
      </div>
    </>
  );
}
