import type { ReactNode } from 'react';

type Tint = 'neutral' | 'solar' | 'lunar' | 'nature';

const bg: Record<Tint, string> = {
  neutral: 'oklch(11% 0.015 270)',
  solar:   'oklch(11.5% 0.025 80)',
  lunar:   'oklch(11.5% 0.025 270)',
  nature:  'oklch(11.5% 0.025 155)',
};

const border: Record<Tint, string> = {
  neutral: 'oklch(18% 0.015 270)',
  solar:   'oklch(19% 0.04 80)',
  lunar:   'oklch(19% 0.04 270)',
  nature:  'oklch(19% 0.04 155)',
};

interface Props {
  children: ReactNode;
  tint?: Tint;
  className?: string;
  pad?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

const padMap = { sm: '12px 16px', md: '20px 24px', lg: '28px 32px' };

export default function Surface({ children, tint = 'neutral', className = '', pad = 'md', hover = true }: Props) {
  return (
    <div
      className={`${hover ? 'card-hover' : ''} ${className}`}
      style={{
        background: bg[tint],
        border: `1px solid ${border[tint]}`,
        borderRadius: 8,
        padding: padMap[pad],
      }}
    >
      {children}
    </div>
  );
}
