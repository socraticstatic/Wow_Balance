import { useState, useRef, useEffect } from 'react';
import { Moon, Star, Swords, Shield, Sparkles, BookOpen, Compass, ChevronUp, Users, Gem, FlaskConical, Trophy, Settings, ScrollText, Zap } from 'lucide-react';

const items = [
  { id: 'hero', label: 'Overview', icon: Moon },
  { id: 'spiracle', label: 'Spiracle', icon: Star },
  { id: 'progression', label: 'Advisor', icon: Compass },
  { id: 'faith', label: 'The Light', icon: BookOpen },
  { id: 'aoe', label: 'AoE DPS', icon: Zap },
  { id: 'builds', label: 'Builds', icon: Sparkles },
  { id: 'gear', label: 'Gear', icon: Shield },
  { id: 'geardelta', label: 'Delta', icon: Swords },
  { id: 'consumables', label: 'Consumables', icon: FlaskConical },
  { id: 'raid', label: 'Raid', icon: Users },
  { id: 'dungeons', label: 'M+', icon: Gem },
  { id: 'rankings', label: 'Rankings', icon: Trophy },
  { id: 'changelog', label: 'Changelog', icon: ScrollText },
  { id: 'setup', label: 'Make Yours', icon: Settings },
];

interface Props { active: string; onNav: (id: string) => void }

export default function Nav({ active, onNav }: Props) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      {/* Minimal top bar - just the logo */}
      <div className="fixed top-0 inset-x-0 z-40 pointer-events-none">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center">
          <button
            onClick={() => onNav('hero')}
            className="pointer-events-auto flex items-center gap-2 cursor-pointer"
            style={{
              background: 'oklch(7% 0.01 45 / 0.8)',
              backdropFilter: 'blur(12px)',
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid oklch(16% 0.012 45)',
            }}
          >
            <Moon size={14} style={{ color: 'oklch(78% 0.16 60)' }} />
            <span style={{
              fontFamily: '"Cormorant", Georgia, serif',
              fontSize: '14px',
              fontWeight: 600,
              fontStyle: 'italic',
              color: 'oklch(82% 0.02 55)',
              letterSpacing: '0.04em',
            }}>
              Balance Dossier
            </span>
          </button>
        </div>
      </div>

      {/* FAB + radial menu */}
      <div ref={menuRef} className="fixed bottom-6 right-6 z-50">
        {/* Menu items - arc upward */}
        <div style={{
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: open ? 'auto' : 'none',
          position: 'absolute',
          bottom: '64px',
          right: 0,
          width: '200px',
        }}>
          <div
            className="rounded-xl overflow-hidden py-2"
            style={{
              background: 'oklch(9% 0.012 45 / 0.95)',
              backdropFilter: 'blur(24px) saturate(1.3)',
              border: '1px solid oklch(78% 0.16 60 / 0.12)',
              boxShadow: '0 20px 60px oklch(0% 0 0 / 0.5), 0 0 40px oklch(78% 0.16 60 / 0.05)',
              maxHeight: '70vh',
              overflowY: 'auto',
            }}
          >
            {items.map((item, i) => {
              const Icon = item.icon;
              const isActive = active === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { onNav(item.id); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors"
                  style={{
                    color: isActive ? 'oklch(92% 0.01 60)' : 'oklch(82% 0.008 55)',
                    background: isActive ? 'oklch(16% 0.02 45)' : 'transparent',
                    transitionDelay: open ? `${i * 20}ms` : '0ms',
                  }}
                  onMouseEnter={e => { if (!isActive) (e.target as HTMLElement).style.background = 'oklch(13% 0.015 45)'; }}
                  onMouseLeave={e => { if (!isActive) (e.target as HTMLElement).style.background = 'transparent'; }}
                >
                  <Icon size={14} style={{ color: isActive ? 'oklch(78% 0.16 60)' : 'oklch(72% 0.008 55)' }} />
                  <span className="text-[12px] font-semibold">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: 'oklch(78% 0.16 60)' }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* The FAB itself */}
        <button
          onClick={() => setOpen(!open)}
          className="cursor-pointer"
          style={{
            width: 52,
            height: 52,
            borderRadius: '50%',
            background: open
              ? 'linear-gradient(135deg, oklch(78% 0.16 60), oklch(65% 0.14 50))'
              : 'oklch(10% 0.015 45 / 0.9)',
            border: `1px solid ${open ? 'oklch(78% 0.16 60 / 0.4)' : 'oklch(78% 0.16 60 / 0.2)'}`,
            backdropFilter: 'blur(16px)',
            boxShadow: open
              ? '0 8px 40px oklch(78% 0.16 60 / 0.3), 0 0 20px oklch(78% 0.16 60 / 0.1)'
              : '0 4px 20px oklch(0% 0 0 / 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          {open
            ? <ChevronUp size={20} style={{ color: 'oklch(10% 0.01 45)' }} />
            : <Moon size={20} style={{ color: 'oklch(78% 0.16 60)' }} />
          }
        </button>
      </div>

    </>
  );
}
