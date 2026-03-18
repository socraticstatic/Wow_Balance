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
    />
  );
}
