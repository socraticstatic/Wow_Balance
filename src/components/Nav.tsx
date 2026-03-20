import { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Star, Swords, Shield, Sparkles, BookOpen, Compass, Users, Gem, FlaskConical, Trophy, Settings, ScrollText, Zap, Target, Radio, Keyboard, TreePine, Terminal, CalendarCheck, ArrowUpCircle, Map, Menu, X } from 'lucide-react';

const items = [
  { id: 'hero', label: 'Overview', icon: Moon },
  { id: 'spiracle', label: 'Spiracle', icon: Star },
  { id: 'progression', label: 'Advisor', icon: Compass },
  { id: 'faith', label: 'The Light', icon: BookOpen },
  { id: 'aoe', label: 'AoE DPS', icon: Zap },
  { id: 'talentbuild', label: 'Talents', icon: TreePine },
  { id: 'breakpoints', label: 'Breakpoints', icon: Target },
  { id: 'keybinds', label: 'Keybinds', icon: Keyboard },
  { id: 'macros', label: 'Macros', icon: Terminal },
  { id: 'builds', label: 'Builds', icon: Sparkles },
  { id: 'gear', label: 'Gear', icon: Shield },
  { id: 'geardelta', label: 'Delta', icon: Swords },
  { id: 'gearpriority', label: 'Upgrades', icon: ArrowUpCircle },
  { id: 'consumables', label: 'Consumables', icon: FlaskConical },
  { id: 'weekly', label: 'Weekly', icon: CalendarCheck },
  { id: 'raid', label: 'Raid', icon: Users },
  { id: 'dungeons', label: 'M+', icon: Gem },
  { id: 'cdplanner', label: 'CD Plan', icon: Map },
  { id: 'rankings', label: 'Rankings', icon: Trophy },
  { id: 'live', label: 'Live', icon: Radio },
  { id: 'changelog', label: 'Log', icon: ScrollText },
  { id: 'setup', label: 'Setup', icon: Settings },
];

interface Props {
  active: string;
  onNav: (id: string) => void;
  badges?: Record<string, boolean>;
  sectionRelevance?: Record<string, boolean>;
}

export default function Nav({ active, onNav, badges = {}, sectionRelevance = {} }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  // Auto-scroll the active item into view in the rail
  useEffect(() => {
    const container = railRef.current;
    if (!container) return;
    const activeBtn = container.querySelector(`[data-nav-id="${active}"]`) as HTMLElement;
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [active]);

  // Close mobile nav on navigate
  const handleNav = (id: string) => {
    onNav(id);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Top bar: logo left, mobile hamburger right */}
      <div className="fixed top-0 inset-x-0 z-50 pointer-events-none">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => handleNav('hero')}
            className="pointer-events-auto flex items-center gap-2 cursor-pointer"
            style={{
              background: 'color-mix(in oklch, var(--color-void) 80%, transparent)',
              backdropFilter: 'blur(12px)',
              padding: '6px 14px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
            }}
          >
            <Moon size={14} style={{ color: 'var(--color-solar)' }} />
            <span style={{
              fontFamily: '"Cormorant", Georgia, serif',
              fontSize: '14px',
              fontWeight: 600,
              fontStyle: 'italic',
              color: 'var(--color-text-2)',
              letterSpacing: '0.04em',
            }}>
              Balance Dossier
            </span>
          </button>

          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Light/Dark toggle */}
            <button
              onClick={() => document.documentElement.classList.toggle('light')}
              className="cursor-pointer"
              title="Toggle light/dark mode"
              style={{
                background: 'color-mix(in oklch, var(--color-void) 80%, transparent)',
                backdropFilter: 'blur(12px)',
                padding: '8px',
                borderRadius: '8px',
                border: '1px solid var(--color-border)',
                color: 'var(--color-solar)',
              }}
            >
              <Sun size={14} />
            </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden cursor-pointer"
            style={{
              background: 'color-mix(in oklch, var(--color-void) 80%, transparent)',
              backdropFilter: 'blur(12px)',
              padding: '8px',
              borderRadius: '8px',
              border: '1px solid var(--color-border)',
              color: 'var(--color-solar)',
            }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          </div>
        </div>
      </div>

      {/* Desktop: Floating side rail - right edge, vertically centered */}
      <nav
        className="fixed right-0 top-1/2 z-50 hidden md:flex flex-col items-end"
        style={{ transform: 'translateY(-50%)' }}
      >
        <div
          ref={railRef}
          className="flex flex-col gap-0.5 py-3 px-1.5 rounded-l-lg overflow-y-auto"
          style={{
            background: 'color-mix(in oklch, var(--color-void) 85%, transparent)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--color-border)',
            borderRight: 'none',
            maxHeight: '85vh',
          }}
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            const isHovered = hovered === item.id;
            const showLabel = isHovered || isActive;

            const isRelevant = sectionRelevance[item.id] !== false;
            const hasBadge = badges[item.id] === true;

            return (
              <button
                key={item.id}
                data-nav-id={item.id}
                onClick={() => handleNav(item.id)}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                className="relative flex items-center justify-end cursor-pointer"
                style={{
                  padding: '5px 6px',
                  borderRadius: '6px',
                  background: isActive ? 'var(--color-surface-active)' : 'transparent',
                  opacity: isRelevant ? 1 : 0.35,
                  transition: 'background 0.15s ease, opacity 0.3s ease',
                }}
              >
                {showLabel && (
                  <span
                    className="absolute right-full mr-2 whitespace-nowrap px-2.5 py-1 rounded-md"
                    style={{
                      background: 'color-mix(in oklch, var(--color-surface-1) 95%, transparent)',
                      border: '1px solid var(--color-border-light)',
                      color: isActive ? 'var(--color-solar)' : 'var(--color-text-1)',
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.02em',
                      boxShadow: '0 4px 12px oklch(0% 0 0 / 0.4)',
                    }}
                  >
                    {item.label}
                  </span>
                )}

                <Icon
                  size={13}
                  style={{
                    color: isActive
                      ? 'var(--color-solar)'
                      : isHovered
                      ? 'var(--color-text-1)'
                      : 'var(--color-text-muted)',
                    transition: 'color 0.15s ease',
                  }}
                />

                {hasBadge && !isActive && (
                  <div
                    className="absolute -top-0.5 -right-0.5"
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: 'var(--color-solar)',
                    }}
                  />
                )}

                {isActive && (
                  <div
                    className="absolute right-0 top-1/2"
                    style={{
                      width: '2px',
                      height: '14px',
                      background: 'var(--color-solar)',
                      borderRadius: '1px',
                      transform: 'translateY(-50%) translateX(4px)',
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile: Full-screen overlay nav */}
      {mobileOpen && (
        <nav
          className="fixed inset-0 z-40 md:hidden"
          style={{
            background: 'color-mix(in oklch, var(--color-void) 95%, transparent)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="pt-20 px-8 pb-8 h-full overflow-y-auto">
            <div className="grid grid-cols-2 gap-2">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNav(item.id)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer text-left"
                    style={{
                      background: isActive ? 'var(--color-surface-active)' : 'var(--color-surface-1)',
                      border: `1px solid ${isActive ? 'color-mix(in oklch, var(--color-solar) 30%, transparent)' : 'var(--color-border)'}`,
                    }}
                  >
                    <Icon
                      size={16}
                      style={{ color: isActive ? 'var(--color-solar)' : 'var(--color-text-muted)' }}
                    />
                    <span
                      className="text-sm font-semibold"
                      style={{ color: isActive ? 'var(--color-solar)' : 'var(--color-text-2)' }}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
