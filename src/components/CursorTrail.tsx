import { useEffect, useRef } from 'react';

/**
 * Golden particle trail following the cursor.
 * Canvas-based, GPU composited, 60fps.
 */
export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    let w = window.innerWidth;
    let h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;

    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      life: number; maxLife: number; size: number; hue: number;
    }> = [];

    let mouseX = 0;
    let mouseY = 0;
    let lastX = 0;
    let lastY = 0;
    let frame = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const onResize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    const spawn = () => {
      const dx = mouseX - lastX;
      const dy = mouseY - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy);

      // Only spawn when moving, and proportional to speed
      if (speed > 2) {
        const count = Math.min(Math.floor(speed * 0.15), 3);
        for (let i = 0; i < count; i++) {
          particles.push({
            x: mouseX + (Math.random() - 0.5) * 8,
            y: mouseY + (Math.random() - 0.5) * 8,
            vx: (Math.random() - 0.5) * 1.5 - dx * 0.02,
            vy: (Math.random() - 0.5) * 1.5 - dy * 0.02 - 0.5,
            life: 1,
            maxLife: 30 + Math.random() * 30,
            size: 1 + Math.random() * 2,
            hue: 50 + Math.random() * 20, // gold range
          });
        }
      }
      lastX = mouseX;
      lastY = mouseY;
    };

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      frame++;

      if (frame % 2 === 0) spawn();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy -= 0.02; // float up
        p.vx *= 0.98;
        p.life++;

        const progress = p.life / p.maxLife;
        if (progress >= 1) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = (1 - progress) * 0.6;
        const size = p.size * (1 - progress * 0.5);

        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${alpha})`;
        ctx.fill();

        // Glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 3, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${alpha * 0.15})`;
        ctx.fill();
      }

      // Keep particle count bounded
      if (particles.length > 100) particles.splice(0, particles.length - 100);

      requestAnimationFrame(render);
    };

    const raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9997 }}
      aria-hidden="true"
    />
  );
}
