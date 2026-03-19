import { useState } from 'react';
import { Moon, Star, Swords, Shield, Sparkles, BookOpen, Compass, Users, Gem, FlaskConical, Trophy, Settings, ScrollText, Zap, Target, Radio, Keyboard, TreePine } from 'lucide-react';

const items = [
  { id: 'hero', label: 'Overview', icon: Moon },
  { id: 'spiracle', label: 'Spiracle', icon: Star },
  { id: 'progression', label: 'Advisor', icon: Compass },
  { id: 'faith', label: 'The Light', icon: BookOpen },
  { id: 'aoe', label: 'AoE DPS', icon: Zap },
  { id: 'talentbuild', label: 'Talents', icon: TreePine },
  { id: 'breakpoints', label: 'Breakpoints', icon: Target },
  { id: 'keybinds', label: 'Keybinds', icon: Keyboard },
  { id: 'builds', label: 'Builds', icon: Sparkles },
  { id: 'gear', label: 'Gear', icon: Shield },
  { id: 'geardelta', label: 'Delta', icon: Swords },
  { id: 'consumables', label: 'Consumables', icon: FlaskConical },
  { id: 'raid', label: 'Raid', icon: Users },
  { id: 'dungeons', label: 'M+', icon: Gem },
  { id: 'rankings', label: 'Rankings', icon: Trophy },
  { id: 'live', label: 'Live', icon: Radio },
  { id: 'changelog', label: 'Log', icon: ScrollText },
  { id: 'setup', label: 'Setup', icon: Settings },
];

interface Props { active: string; onNav: (id: string) => void }

export default function Nav({ active, onNav }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <>
      {/* Top left logo */}
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

      {/* Floating side rail - right edge, vertically centered */}
      <nav
        className="fixed right-0 top-1/2 z-50 hidden lg:flex flex-col items-end"
        style={{ transform: 'translateY(-50%)' }}
      >
        <div
          className="flex flex-col gap-0.5 py-3 px-1.5 rounded-l-lg"
          style={{
            background: 'oklch(7% 0.01 45 / 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid oklch(16% 0.012 45)',
            borderRight: 'none',
          }}
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            const isHovered = hovered === item.id;
            const showLabel = isHovered || isActive;

            return (
              <button
                key={item.id}
                onClick={() => onNav(item.id)}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                className="relative flex items-center justify-end cursor-pointer"
                style={{
                  padding: '5px 6px',
                  borderRadius: '6px',
                  background: isActive ? 'oklch(16% 0.02 45)' : 'transparent',
                  transition: 'background 0.15s ease',
                }}
              >
                {/* Tooltip label - appears to the left on hover */}
                {showLabel && (
                  <span
                    className="absolute right-full mr-2 whitespace-nowrap px-2.5 py-1 rounded-md"
                    style={{
                      background: 'oklch(10% 0.012 45 / 0.95)',
                      border: '1px solid oklch(20% 0.015 45)',
                      color: isActive ? 'oklch(78% 0.16 60)' : 'oklch(88% 0.006 55)',
                      fontSize: '12px',
                      fontWeight: 600,
                      letterSpacing: '0.02em',
                      boxShadow: '0 4px 12px oklch(0% 0 0 / 0.4)',
                    }}
                  >
                    {item.label}
                  </span>
                )}

                {/* Icon dot */}
                <Icon
                  size={13}
                  style={{
                    color: isActive
                      ? 'oklch(78% 0.16 60)'
                      : isHovered
                      ? 'oklch(88% 0.006 55)'
                      : 'oklch(50% 0.01 50)',
                    transition: 'color 0.15s ease',
                  }}
                />

                {/* Active indicator bar */}
                {isActive && (
                  <div
                    className="absolute right-0 top-1/2"
                    style={{
                      width: '2px',
                      height: '14px',
                      background: 'oklch(78% 0.16 60)',
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

      {/* Mobile: horizontal bottom bar with just icons */}
      <nav
        className="fixed bottom-0 inset-x-0 z-50 lg:hidden"
        style={{
          background: 'oklch(7% 0.01 45 / 0.92)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid oklch(16% 0.012 45)',
        }}
      >
        <div className="flex items-center justify-start gap-0 overflow-x-auto px-2 py-1.5" style={{ scrollbarWidth: 'none' }}>
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNav(item.id)}
                className="flex flex-col items-center gap-0.5 px-2.5 py-1 cursor-pointer shrink-0"
                style={{ minWidth: '44px' }}
              >
                <Icon
                  size={14}
                  style={{
                    color: isActive ? 'oklch(78% 0.16 60)' : 'oklch(50% 0.01 50)',
                  }}
                />
                <span
                  className="text-[8px] font-semibold"
                  style={{
                    color: isActive ? 'oklch(78% 0.16 60)' : 'oklch(42% 0.01 50)',
                  }}
                >
                  {item.label}
                </span>
                {isActive && (
                  <div style={{
                    width: '12px',
                    height: '2px',
                    background: 'oklch(78% 0.16 60)',
                    borderRadius: '1px',
                    marginTop: '-1px',
                  }} />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
