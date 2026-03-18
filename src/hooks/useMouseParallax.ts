import { useEffect, useRef, useState } from 'react';

/** Returns x/y offset (-1 to 1) based on mouse position relative to an element */
export function useMouseParallax(strength = 12) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const x = ((e.clientX - cx) / (rect.width / 2)) * strength;
      const y = ((e.clientY - cy) / (rect.height / 2)) * strength;
      setOffset({ x: Math.max(-strength, Math.min(strength, x)), y: Math.max(-strength, Math.min(strength, y)) });
    };

    const onLeave = () => setOffset({ x: 0, y: 0 });

    window.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);

  return { ref, offset };
}
