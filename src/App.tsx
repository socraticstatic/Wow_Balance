import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import Nav from './components/Nav';
import Hero from './pages/Hero';
import CelestialBg from './components/CelestialBg';
import CursorTrail from './components/CursorTrail';
import SectionArt from './components/SectionArt';
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
      <div className="w-5 h-5 rounded-full animate-pulse" style={{ background: 'oklch(78% 0.16 60 / 0.3)' }} />
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState('hero');
  const [scrollPct, setScrollPct] = useState(0);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  // Section observer
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        // Pick the entry with the largest intersection ratio
        let best: IntersectionObserverEntry | null = null;
        for (const e of entries) {
          if (e.isIntersecting && (!best || e.intersectionRatio > best.intersectionRatio)) {
            best = e;
          }
        }
        if (best) setActive(best.target.id);
      },
      { threshold: [0, 0.1, 0.25, 0.5], rootMargin: '-10% 0px -40% 0px' },
    );
    for (const id of sectionIds) {
      const el = refs.current[id];
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
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
      { threshold: 0.01, rootMargin: '50px 0px 0px 0px' },
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

  const nav = (id: string) => refs.current[id]?.scrollIntoView({ behavior: 'smooth' });
  const ref = (id: string) => (el: HTMLDivElement | null) => { refs.current[id] = el; };

  return (
    <div className="min-h-screen relative">
      <CelestialBg />
      <CursorTrail />
      <div className="scroll-bar" style={{ width: `${scrollPct}%` }} />
      <Nav active={active} onNav={nav} />

      <main className="relative z-10">
        <div id="hero" ref={ref('hero')}><Hero /></div>
        <Divider />
        <ErrorBoundary>
        <Suspense fallback={<SectionFallback />}>
          <div id="spiracle" ref={ref('spiracle')}><MyCharacter /></div>
          <Divider />
          <div id="progression" ref={ref('progression')}><Progression /></div>
          <Divider />
          <div id="faith" ref={ref('faith')}><Faith /></div>
          <Divider />
          <div id="aoe" ref={ref('aoe')} className="relative">
            <SectionArt variant="eclipse" />
            <AoeOptimization />
          </div>
          <Divider />
          <div id="talentbuild" ref={ref('talentbuild')} className="relative">
            <SectionArt variant="solar" />
            <TalentBuild />
          </div>
          <Divider />
          <div id="breakpoints" ref={ref('breakpoints')} className="relative">
            <SectionArt variant="lunar" />
            <AoeBreakpoints />
          </div>
          <Divider />
          <div id="keybinds" ref={ref('keybinds')} className="relative">
            <SectionArt variant="solar" />
            <ActionBars />
          </div>
          <Divider />
          <div id="macros" ref={ref('macros')}><Macros /></div>
          <Divider />
          <div id="builds" ref={ref('builds')} className="relative">
            <SectionArt variant="lunar" />
            <Builds />
          </div>
          <Divider />
          <div id="gear" ref={ref('gear')} className="relative">
            <SectionArt variant="solar" />
            <Gear />
          </div>
          <Divider />
          <div id="geardelta" ref={ref('geardelta')}><GearDelta /></div>
          <Divider />
          <div id="gearpriority" ref={ref('gearpriority')}><GearPriority /></div>
          <Divider />
          <div id="consumables" ref={ref('consumables')} className="relative">
            <SectionArt variant="nature" />
            <Consumables />
          </div>
          <Divider />
          <div id="weekly" ref={ref('weekly')}><WeeklyChecklist /></div>
          <Divider />
          <div id="raid" ref={ref('raid')} className="relative">
            <SectionArt variant="solar" />
            <BossGuides />
          </div>
          <Divider />
          <div id="dungeons" ref={ref('dungeons')} className="relative">
            <SectionArt variant="void" />
            <DungeonGuides />
          </div>
          <Divider />
          <div id="cdplanner" ref={ref('cdplanner')} className="relative">
            <SectionArt variant="lunar" />
            <MplusCdPlanner />
          </div>
          <Divider />
          <div id="rankings" ref={ref('rankings')}><Rankings /></div>
          <Divider />
          <div id="live" ref={ref('live')}><LiveSession /></div>
          <Divider />
          <div id="changelog" ref={ref('changelog')}><Changelog /></div>
          <Divider />
          <div id="setup" ref={ref('setup')}><Setup /></div>
        </Suspense>
        </ErrorBoundary>

        <footer className="px-6 py-20 text-center">
          <p className="text-[10px] font-bold tracking-widest mb-1" style={{ color: 'oklch(28% 0.015 270)', letterSpacing: '0.14em' }}>
            BALANCE DRUID DOSSIER
          </p>
          <p className="text-[11px] mb-2" style={{ color: 'oklch(22% 0.01 270)' }}>
            {meta.expansion} {meta.season}. Not affiliated with Blizzard Entertainment.
          </p>
          <p className="text-[10px]" style={{ color: 'oklch(18% 0.008 270)' }}>
            Press <kbd className="px-1.5 py-0.5 rounded text-[9px] font-mono" style={{ background: 'oklch(12% 0.01 270)', border: '1px solid oklch(18% 0.01 270)' }}>j</kbd> / <kbd className="px-1.5 py-0.5 rounded text-[9px] font-mono" style={{ background: 'oklch(12% 0.01 270)', border: '1px solid oklch(18% 0.01 270)' }}>k</kbd> to navigate sections
          </p>
        </footer>
      </main>
    </div>
  );
}

function Divider() {
  return (
    <div className="py-8">
      <div className="ornament">
        <span className="ornament-diamond relative" />
      </div>
    </div>
  );
}
