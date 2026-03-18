import type { ReactNode } from 'react';

type Tint = 'neutral' | 'solar' | 'lunar' | 'nature';

const glassClass: Record<Tint, string> = {
  neutral: 'glass',
  solar:   'glass-solar',
  lunar:   'glass-lunar',
  nature:  'glass-nature',
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
      className={`${glassClass[tint]} ${hover ? 'card-hover' : ''} ${className}`}
      style={{
        borderRadius: 8,
        padding: padMap[pad],
      }}
    >
      {children}
    </div>
  );
}
