import SectionHeading from '../components/SectionHeading';
import { changelog } from '../data';
import { useReveal } from '../hooks/useReveal';

const typeColors: Record<string, string> = {
  expansion_launch: 'oklch(80% 0.18 80)',
  tuning: 'var(--color-lunar)',
  patch: 'var(--color-nature)',
};

export default function Changelog() {
  const r1 = useReveal();

  return (
    <section className="px-6 sm:px-10 py-24 max-w-6xl mx-auto">
      <div ref={r1} className="reveal">
        <SectionHeading title="Changelog" sub="Patch history affecting Balance Druid." accent="nature" />
      </div>

      <div className="max-w-2xl space-y-10">
        {changelog.map(entry => {
          const color = typeColors[entry.type] || 'var(--color-text-muted)';
          return (
            <ChangelogEntry key={entry.patch + entry.date} entry={entry} color={color} />
          );
        })}
      </div>
    </section>
  );
}

function ChangelogEntry({ entry, color }: { entry: { patch: string; date: string; type: string; changes: string[] }; color: string }) {
  const ref = useReveal();

  return (
    <div ref={ref} className="reveal pl-5" style={{ borderLeft: `2px solid ${color}` }}>
      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-base font-extrabold" style={{ color }}>{entry.patch}</span>
        <span className="text-[13px]" style={{ color: 'var(--color-text-faint)' }}>{entry.date}</span>
        <span className="text-[11px] font-bold uppercase px-1.5 py-0.5 rounded"
          style={{ color, background: `${color}0C`, letterSpacing: '0.08em' }}>
          {entry.type.replace('_', ' ')}
        </span>
      </div>
      <ul className="space-y-1">
        {entry.changes.map((c, i) => (
          <li key={i} className="flex items-start gap-2 text-[15px]" style={{ color: 'var(--color-text-1)', lineHeight: 1.65 }}>
            <span className="w-1 h-1 rounded-full shrink-0 mt-2" style={{ background: 'var(--color-text-ghost)' }} />
            {c}
          </li>
        ))}
      </ul>
    </div>
  );
}
