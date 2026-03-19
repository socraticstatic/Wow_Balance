import { useEffect, useRef } from 'react';

/**
 * CelestialBg - Real cosmic photography background with parallax scroll.
 * Uses Unsplash images (free license).
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
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Real cosmic photograph */}
      <img
        ref={imgRef}
        src={`${import.meta.env.BASE_URL}art/hero-cosmic.jpg`}
        alt=""
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
        style={{
          opacity: 0.18,
          filter: 'saturate(0.5) contrast(1.2)',
          transform: 'scale(1.1)',
        }}
      />
      {/* Dark overlay that increases with scroll depth */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, oklch(7% 0.01 45 / 0.6) 0%, oklch(7% 0.01 45 / 0.85) 30%, oklch(7% 0.01 45 / 0.95) 60%, oklch(7% 0.01 45) 100%)',
        }}
      />
    </div>
  );
}
