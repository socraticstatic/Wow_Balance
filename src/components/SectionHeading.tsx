type Accent = 'solar' | 'lunar' | 'nature';

const colors: Record<Accent, string> = {
  solar:  'oklch(78% 0.16 60)',
  lunar:  'oklch(68% 0.16 285)',
  nature: 'oklch(58% 0.14 155)',
};

interface Props {
  title: string;
  sub?: string;
  accent?: Accent;
}

export default function SectionHeading({ title, sub, accent = 'lunar' }: Props) {
  return (
    <header className="mb-12">
      <h2
        style={{
          fontFamily: '"Cormorant", Georgia, serif',
          fontWeight: 600,
          fontStyle: 'italic',
          color: colors[accent],
          fontSize: 'clamp(2rem, 5vw, 3.25rem)',
          lineHeight: 1.1,
          letterSpacing: '-0.01em',
        }}
      >
        {title}
      </h2>
      {sub && (
        <p className="mt-3 max-w-lg" style={{ color: 'oklch(60% 0.012 50)', fontSize: '0.9rem', lineHeight: 1.75 }}>
          {sub}
        </p>
      )}
    </header>
  );
}
