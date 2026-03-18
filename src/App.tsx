import { useState, useEffect, useRef } from 'react';
import Nav from './components/Nav';
import Hero from './pages/Hero';
import Builds from './pages/Builds';
import Gear from './pages/Gear';
import Rankings from './pages/Rankings';
import Changelog from './pages/Changelog';
import MyCharacter from './pages/MyCharacter';
import AoeOptimization from './pages/AoeOptimization';
import CelestialBg from './components/CelestialBg';
import CursorTrail from './components/CursorTrail';
import Setup from './pages/Setup';
import Faith from './pages/Faith';
import Progression from './pages/Progression';
import { meta } from './data';

const sectionIds = ['hero', 'spiracle', 'progression', 'faith', 'aoe', 'builds', 'gear', 'rankings', 'changelog', 'setup'] as const;

export default function App() {
  const [active, setActive] = useState('hero');
  const [scrollPct, setScrollPct] = useState(0);
  const refs = useRef<Record<string, HTMLDivElement | null>>({});

  // Section observer
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => { for (const e of entries) if (e.isIntersecting) setActive(e.target.id); },
      { threshold: 0.25 },
    );
    for (const id of sectionIds) {
      const el = refs.current[id];
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
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
        <div id="spiracle" ref={ref('spiracle')}><MyCharacter /></div>
        <Divider />
        <div id="progression" ref={ref('progression')}><Progression /></div>
        <Divider />
        <div id="faith" ref={ref('faith')}><Faith /></div>
        <Divider />
        <div id="aoe" ref={ref('aoe')}><AoeOptimization /></div>
        <Divider />
        <div id="builds" ref={ref('builds')}><Builds /></div>
        <Divider />
        <div id="gear" ref={ref('gear')}><Gear /></div>
        <Divider />
        <div id="rankings" ref={ref('rankings')}><Rankings /></div>
        <Divider />
        <div id="changelog" ref={ref('changelog')}><Changelog /></div>
        <Divider />
        <div id="setup" ref={ref('setup')}><Setup /></div>

        <footer className="px-6 py-20 text-center">
          <p className="text-[10px] font-bold tracking-widest mb-1" style={{ color: 'oklch(28% 0.015 270)', letterSpacing: '0.14em' }}>
            BALANCE DRUID DOSSIER
          </p>
          <p className="text-[11px]" style={{ color: 'oklch(22% 0.01 270)' }}>
            {meta.expansion} {meta.season}. Not affiliated with Blizzard Entertainment.
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
