import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Nav from './components/Nav';
import Hero from './pages/Hero';
import CelestialBg from './components/CelestialBg';
import CursorTrail from './components/CursorTrail';
import MissionBriefing from './components/MissionBriefing';
import { ProgressionProvider, useProgression } from './context/ProgressionContext';
import { useLiveData } from './hooks/useLiveData';
import { useCoaching } from './hooks/useCoaching';
import { meta } from './data';

// Lazy load below-fold sections for faster initial paint
const MyCharacter = lazy(() => import('./pages/MyCharacter'));
const Progression = lazy(() => import('./pages/Progression'));
const Faith = lazy(() => import('./pages/Faith'));
const AoeOptimization = lazy(() => import('./pages/AoeOptimization'));
const TalentBuild = lazy(() => import('./pages/TalentBuild'));
const AoeBreakpoints = lazy(() => import('./pages/AoeBreakpoints'));
const ActionBars = lazy(() => import('./pages/ActionBars'));
const Builds = lazy(() => import('./pages/Builds'));
const Gear = lazy(() => import('./pages/Gear'));
const GearDelta = lazy(() => import('./pages/GearDelta'));
const Consumables = lazy(() => import('./pages/Consumables'));
const Rankings = lazy(() => import('./pages/Rankings'));
const BossGuides = lazy(() => import('./pages/BossGuides'));
const DungeonGuides = lazy(() => import('./pages/DungeonGuides'));
const Macros = lazy(() => import('./pages/Macros'));
const WeeklyChecklist = lazy(() => import('./pages/WeeklyChecklist'));
const GearPriority = lazy(() => import('./pages/GearPriority'));
const MplusCdPlanner = lazy(() => import('./pages/MplusCdPlanner'));
const Changelog = lazy(() => import('./pages/Changelog'));
const LiveSession = lazy(() => import('./pages/LiveSession'));
const Setup = lazy(() => import('./pages/Setup'));

const sectionIds = ['hero', 'spiracle', 'progression', 'faith', 'aoe', 'talentbuild', 'breakpoints', 'keybinds', 'macros', 'builds', 'gear', 'geardelta', 'gearpriority', 'consumables', 'weekly', 'raid', 'dungeons', 'cdplanner', 'rankings', 'live', 'changelog', 'setup'] as const;

function SectionFallback() {
  return (
    <div className="px-6 py-32 flex items-center justify-center">
      <div className="w-5 h-5 rounded-full animate-pulse" style={{ background: 'color-mix(in oklch, var(--color-solar) 30%, transparent)' }} />
    </div>
  );
}

export default function App() {
  const { data, sessionState, isLocal } = useLiveData();
  const coaching = useCoaching(
    data?.recentFights || [],
    data?.sessionHistory || [],
    data?.presence?.level || 86,
    data?.presence?.ilvl || 156,
  );

  return (
    <ProgressionProvider data={data}>
      <AppContent data={data} sessionState={sessionState} isLocal={isLocal} coaching={coaching} />
    </ProgressionProvider>
  );
}

function AppContent({ data, sessionState, isLocal, coaching }: {
  data: ReturnType<typeof useLiveData>['data'];
  sessionState: ReturnType<typeof useLiveData>['sessionState'];
  isLocal: boolean;
  coaching: ReturnType<typeof useCoaching>;
}) {
  const [active, setActive] = useState('hero');
  const [scrollPct, setScrollPct] = useState(0);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});
  const { sectionRelevance } = useProgression();

  // Section observer - uses scroll position as primary, IO as fallback
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const viewportCenter = window.scrollY + window.innerHeight * 0.35;
        let closest: string = sectionIds[0];
        let closestDist = Infinity;
        for (const id of sectionIds) {
          const el = refs.current[id];
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          const elTop = rect.top + window.scrollY;
          const dist = Math.abs(elTop - viewportCenter);
          if (dist < closestDist) {
            closestDist = dist;
            closest = id;
          }
        }
        setActive(closest);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // Run once on mount
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Global reveal observer - catches ALL .reveal elements including those without useReveal hook
  useEffect(() => {
    const revealObs = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            revealObs.unobserve(e.target);
          }
        }
      },
      { threshold: 0.01, rootMargin: '200px 0px 200px 0px' },
    );

    // Observe existing and watch for new .reveal elements via MutationObserver
    const observeReveals = () => {
      document.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObs.observe(el));
    };
    observeReveals();

    const mutObs = new MutationObserver(() => observeReveals());
    mutObs.observe(document.body, { childList: true, subtree: true });

    return () => { revealObs.disconnect(); mutObs.disconnect(); };
  }, []);

  // Scroll progress
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Keyboard navigation: j/k to move between sections, / to focus nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't capture when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;

      if (e.key === 'j' || e.key === 'k') {
        e.preventDefault();
        const idx = sectionIds.indexOf(active as typeof sectionIds[number]);
        const next = e.key === 'j'
          ? Math.min(idx + 1, sectionIds.length - 1)
          : Math.max(idx - 1, 0);
        const nextId = sectionIds[next];
        refs.current[nextId]?.scrollIntoView({ behavior: 'smooth' });
        setActive(nextId);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);

  const nav = (id: string) => {
    const el = refs.current[id];
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth' });
    // Force-reveal all elements in the target section after scroll
    setTimeout(() => {
      el.querySelectorAll('.reveal:not(.visible)').forEach(r => r.classList.add('visible'));
    }, 100);
    setTimeout(() => {
      el.querySelectorAll('.reveal:not(.visible)').forEach(r => r.classList.add('visible'));
    }, 600);
  };
  const ref = (id: string) => (el: HTMLDivElement | null) => { refs.current[id] = el; };

  return (
    <div className="min-h-screen relative">
      <CelestialBg />
      <CursorTrail />
      <div className="scroll-bar" style={{ width: `${scrollPct}%` }} />
      <Nav active={active} onNav={nav} sectionRelevance={sectionRelevance} />

      {/* Scroll to top */}
      {scrollPct > 5 && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-50 cursor-pointer"
          style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'color-mix(in oklch, var(--color-surface-1) 85%, transparent)',
            backdropFilter: 'blur(12px)',
            border: '1px solid color-mix(in oklch, var(--color-solar) 20%, transparent)',
            color: 'var(--color-solar)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', lineHeight: 1,
            boxShadow: '0 4px 16px oklch(0% 0 0 / 0.3)',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
          }}
          title="Scroll to top"
        >
          &#8593;
        </button>
      )}

      <main className="relative z-10">
        <div id="hero" ref={ref('hero')}><Hero /></div>
        <MissionBriefing data={data} sessionState={sessionState} coaching={coaching} isLocal={isLocal} />
        <Divider />
        <ErrorBoundary>
        <Suspense fallback={<SectionFallback />}>
          <div id="spiracle" ref={ref('spiracle')}><MyCharacter /></div>
          <Divider />
          <div id="progression" ref={ref('progression')}><Progression /></div>
          <Divider />
          <div id="faith" ref={ref('faith')}><Faith /></div>
          <Divider />
          <div id="aoe" ref={ref('aoe')}>
            <AoeOptimization />
          </div>
          <Divider />
          <div id="talentbuild" ref={ref('talentbuild')}>
            <TalentBuild />
          </div>
          <Divider />
          <div id="breakpoints" ref={ref('breakpoints')}>
            <AoeBreakpoints />
          </div>
          <Divider />
          <div id="keybinds" ref={ref('keybinds')}>
            <ActionBars />
          </div>
          <Divider />
          <div id="macros" ref={ref('macros')}><Macros /></div>
          <Divider />
          <div id="builds" ref={ref('builds')}>
            <Builds />
          </div>
          <Divider />
          <div id="gear" ref={ref('gear')}>
            <Gear />
          </div>
          <Divider />
          <div id="geardelta" ref={ref('geardelta')}><GearDelta /></div>
          <Divider />
          <div id="gearpriority" ref={ref('gearpriority')}><GearPriority /></div>
          <Divider />
          <div id="consumables" ref={ref('consumables')} style={{ opacity: sectionRelevance['consumables'] ? 1 : 0.4, transition: 'opacity 0.3s' }}>
            <Consumables />
          </div>
          <Divider />
          <div id="weekly" ref={ref('weekly')} style={{ opacity: sectionRelevance['weekly'] ? 1 : 0.4, transition: 'opacity 0.3s' }}><WeeklyChecklist /></div>
          <Divider />
          <div id="raid" ref={ref('raid')} style={{ opacity: sectionRelevance['raid'] ? 1 : 0.4, transition: 'opacity 0.3s' }}>
            <BossGuides />
          </div>
          <Divider />
          <div id="dungeons" ref={ref('dungeons')} style={{ opacity: sectionRelevance['dungeons'] ? 1 : 0.4, transition: 'opacity 0.3s' }}>
            <DungeonGuides />
          </div>
          <Divider />
          <div id="cdplanner" ref={ref('cdplanner')} style={{ opacity: sectionRelevance['cdplanner'] ? 1 : 0.4, transition: 'opacity 0.3s' }}>
            <MplusCdPlanner />
          </div>
          <Divider />
          <div id="rankings" ref={ref('rankings')} style={{ opacity: sectionRelevance['rankings'] ? 1 : 0.4, transition: 'opacity 0.3s' }}><Rankings /></div>
          <Divider />
          <div id="live" ref={ref('live')}><LiveSession /></div>
          <Divider />
          <div id="changelog" ref={ref('changelog')}><Changelog /></div>
          <Divider />
          <div id="setup" ref={ref('setup')}><Setup /></div>
        </Suspense>
        </ErrorBoundary>

        <footer className="px-6 py-20 text-center">
          <p className="text-[10px] font-bold tracking-widest mb-1" style={{ color: 'var(--color-text-ghost)', letterSpacing: '0.14em' }}>
            BALANCE DRUID DOSSIER
          </p>
          <p className="text-[11px] mb-2" style={{ color: 'var(--color-text-ghost)' }}>
            {meta.expansion} {meta.season}. Not affiliated with Blizzard Entertainment.
          </p>
          <p className="text-[10px]" style={{ color: 'var(--color-text-ghost)' }}>
            Press <kbd className="px-1.5 py-0.5 rounded text-[9px] font-mono" style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-surface-3)' }}>j</kbd> / <kbd className="px-1.5 py-0.5 rounded text-[9px] font-mono" style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-surface-3)' }}>k</kbd> to navigate sections
          </p>
        </footer>
      </main>
    </div>
  );
}

function Divider() {
  return (
    <div className="py-4">
      <div className="ornament">
        <span className="ornament-diamond relative" />
      </div>
    </div>
  );
}
