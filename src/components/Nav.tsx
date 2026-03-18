import { useState } from 'react';
import { Moon, Menu, X } from 'lucide-react';

const items = [
  { id: 'hero', label: 'Overview' },
  { id: 'spiracle', label: 'Spiracle' },
  { id: 'progression', label: 'Advisor' },
  { id: 'faith', label: 'The Light' },
  { id: 'aoe', label: 'AoE DPS' },
  { id: 'builds', label: 'Builds' },
  { id: 'gear', label: 'Gear' },
  { id: 'rankings', label: 'Rankings' },
  { id: 'changelog', label: 'Changelog' },
  { id: 'setup', label: 'Make Yours' },
];

interface Props { active: string; onNav: (id: string) => void }

export default function Nav({ active, onNav }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 inset-x-0 z-50"
      style={{
        background: 'oklch(7% 0.01 45 / 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid oklch(16% 0.012 45)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <button onClick={() => onNav('hero')} className="flex items-center gap-2.5 cursor-pointer">
          <Moon size={16} style={{ color: 'oklch(78% 0.16 60)' }} />
          <span
            style={{
              fontFamily: '"Cormorant", Georgia, serif',
              fontSize: '15px',
              fontWeight: 600,
              fontStyle: 'italic',
              color: 'oklch(82% 0.02 55)',
              letterSpacing: '0.05em',
            }}
          >
            Balance Dossier
          </span>
        </button>

        <div className="hidden md:flex gap-0.5">
          {items.map(i => (
            <button
              key={i.id}
              onClick={() => onNav(i.id)}
              className="px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors"
              style={{
                color: active === i.id ? 'oklch(90% 0.01 60)' : 'oklch(60% 0.012 50)',
                background: active === i.id ? 'oklch(16% 0.015 45)' : 'transparent',
              }}
            >
              {i.label}
            </button>
          ))}
        </div>

        <button className="md:hidden p-2 cursor-pointer" onClick={() => setOpen(!open)} style={{ color: 'oklch(62% 0.015 50)' }}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-4 flex flex-col gap-1" style={{ background: 'oklch(9% 0.01 45 / 0.98)' }}>
          {items.map(i => (
            <button
              key={i.id}
              onClick={() => { onNav(i.id); setOpen(false); }}
              className="text-left px-3 py-2 rounded text-sm font-semibold cursor-pointer"
              style={{
                color: active === i.id ? 'oklch(90% 0.01 60)' : 'oklch(60% 0.012 50)',
                background: active === i.id ? 'oklch(16% 0.015 45)' : 'transparent',
              }}
            >
              {i.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
