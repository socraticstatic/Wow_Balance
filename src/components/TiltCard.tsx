import { useRef, type ReactNode, type MouseEvent } from 'react';

/**
 * 3D perspective tilt card. Tilts toward cursor on hover.
 */
interface Props {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glare?: boolean;
}

export default function TiltCard({ children, className = '', intensity = 8, glare = true }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    card.style.transform = `perspective(800px) rotateY(${x * intensity}deg) rotateX(${-y * intensity}deg) scale(1.02)`;

    if (glareRef.current) {
      const angle = Math.atan2(y, x) * (180 / Math.PI) + 180;
      glareRef.current.style.background = `linear-gradient(${angle}deg, hsla(50, 80%, 70%, 0.08) 0%, transparent 60%)`;
      glareRef.current.style.opacity = '1';
    }
  };

  const onLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
    if (glareRef.current) glareRef.current.style.opacity = '0';
  };

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ transition: 'transform 0.2s ease-out', transformStyle: 'preserve-3d' }}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          className="absolute inset-0 pointer-events-none rounded-lg"
          style={{ opacity: 0, transition: 'opacity 0.3s ease' }}
        />
      )}
    </div>
  );
}
