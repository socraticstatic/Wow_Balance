import { getSpellIcon, type IconSize } from '../utils/wowIcons';

interface Props {
  name: string;
  size?: IconSize;
  className?: string;
  px?: number; // Override pixel size
}

export default function SpellIcon({ name, size = 'medium', className = '', px }: Props) {
  const dim = px || (size === 'tiny' ? 15 : size === 'small' ? 18 : size === 'medium' ? 36 : 56);
  return (
    <img
      src={getSpellIcon(name, size)}
      alt={name}
      width={dim}
      height={dim}
      className={`rounded ${className}`}
      style={{ imageRendering: 'auto' }}
      loading="lazy"
      onError={(e) => {
        // Replace broken icon with a gold circle initial
        const el = e.currentTarget;
        el.style.display = 'none';
        const fallback = document.createElement('div');
        fallback.style.cssText = `width:${dim}px;height:${dim}px;border-radius:4px;background:oklch(16% 0.02 45);border:1px solid oklch(78% 0.16 60 / 0.2);display:flex;align-items:center;justify-content:center;font-size:${Math.max(dim * 0.4, 10)}px;font-weight:700;color:oklch(78% 0.16 60);font-family:Cormorant,serif;`;
        fallback.textContent = name[0]?.toUpperCase() || '?';
        fallback.title = name;
        el.parentNode?.insertBefore(fallback, el);
      }}
    />
  );
}
