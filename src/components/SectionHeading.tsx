type Accent = 'solar' | 'lunar' | 'nature';

const colors: Record<Accent, string> = {
  solar:  'var(--color-solar)',
  lunar:  'var(--color-lunar)',
  nature: 'var(--color-nature)',
};

type Freshness = 'live' | 'recent' | 'static';

const freshnessColors: Record<Freshness, string> = {
  live: 'var(--color-nature)',
  recent: 'var(--color-solar)',
  static: 'var(--color-text-ghost)',
};

interface Props {
  title: string;
  sub?: string;
  accent?: Accent;
  freshness?: Freshness;
}

export default function SectionHeading({ title, sub, accent = 'lunar', freshness }: Props) {
  return (
    <header className="mb-12">
      <h2
        className="flex items-center gap-3"
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
        {freshness && (
          <span
            className="inline-block w-2 h-2 rounded-full flex-shrink-0"
            style={{
              background: freshnessColors[freshness],
              boxShadow: freshness === 'live' ? `0 0 6px ${freshnessColors[freshness]}` : 'none',
            }}
            title={freshness === 'live' ? 'Synced < 1 hour' : freshness === 'recent' ? 'Synced < 24 hours' : 'Static reference'}
          />
        )}
      </h2>
      {sub && (
        <p className="mt-3 max-w-lg" style={{ color: 'var(--color-text-1)', fontSize: '0.9rem', lineHeight: 1.75 }}>
          {sub}
        </p>
      )}
    </header>
  );
}
