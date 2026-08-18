import { useEffect, useState } from 'react';

const links: [string, string][] = [
  ['Systems', '#ecosystem'],
  ['Capabilities', '#services'],
  ['Projects', '#projects'],
  ['Architecture', '#tech'],
  ['Founder', '#about'],
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 960px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[500] px-4 py-3 sm:px-8 sm:py-4 transition-all duration-300 ${
        scrolled ? 'pt-2.5 sm:pt-3' : 'pt-4 sm:pt-6'
      }`}
    >
      <div
        className={`mx-auto max-w-[1400px] flex items-center justify-between px-5 py-3 rounded-2xl transition-all duration-300 ${
          scrolled || menuOpen
            ? 'glass border-cyan/20 bg-bg-0/80 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(0,242,254,0.08)]'
            : 'border border-white/5 bg-bg-0/30 backdrop-blur-md'
        }`}
      >
        {/* Logo */}
        <a
          href="#hero"
          data-cursor="hover"
          className="group flex items-center gap-2.5 font-display font-semibold text-[0.98rem] sm:text-[1.08rem] tracking-tight"
        >
          <img
            src="/logo.png"
            alt="DotFreelancer Logo"
            className="h-7 w-7 sm:h-8 sm:w-8 object-contain rounded-md drop-shadow-[0_0_10px_rgba(0,242,254,0.4)] transition-transform group-hover:scale-105"
          />
          <span className="flex items-center text-ink group-hover:text-cyan transition-colors font-bold">
            DOTFREELANCER
            <span className="font-mono text-cyan text-xs ml-1 opacity-80">&gt;</span>
          </span>
        </a>

        {/* Live status badge (Desktop & Tablet) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border border-emerald/30 bg-emerald/5 font-mono text-[0.68rem] text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>SYSTEM ONLINE · INDIA &amp; GLOBAL</span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Primary">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              data-cursor="hover"
              className="group relative font-mono text-[0.76rem] uppercase tracking-wider text-ink-dim transition-colors hover:text-cyan"
            >
              {label}
              <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-gradient-to-r from-cyan to-signal transition-all duration-300 group-hover:w-full shadow-[0_0_6px_#00f2fe]" />
            </a>
          ))}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            data-cursor="project"
            className="hidden sm:inline-flex items-center gap-2 rounded-xl border border-cyan/40 bg-cyan/10 px-4.5 py-2 font-mono text-[0.75rem] uppercase tracking-wider text-cyan transition-all duration-300 hover:bg-cyan hover:text-bg-0 hover:shadow-[0_0_20px_rgba(0,242,254,0.4)]"
          >
            <span>Start a Project</span>
            <span className="text-xs">→</span>
          </a>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="relative flex h-9 w-9 flex-none items-center justify-center rounded-lg border border-line md:hidden hover:border-cyan/40"
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 top-0 h-[1.5px] w-full bg-cyan transition-all duration-300 ${
                  menuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : ''
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-ink transition-opacity duration-200 ${
                  menuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-[1.5px] w-full bg-cyan transition-all duration-300 ${
                  menuOpen ? 'bottom-1/2 translate-y-1/2 -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        id="mobile-nav-panel"
        className={`mx-auto mt-2 max-w-[1400px] overflow-hidden rounded-2xl border border-cyan/20 bg-bg-0/95 backdrop-blur-2xl md:hidden transition-all duration-300 ease-out shadow-[0_20px_40px_rgba(0,0,0,0.9)] ${
          menuOpen ? 'pointer-events-auto max-h-[480px] opacity-100 p-6' : 'pointer-events-none max-h-0 opacity-0 p-0 border-transparent'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-line">
          <span className="font-mono text-[0.68rem] text-cyan uppercase tracking-wider flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            TELEMETRY ACTIVE
          </span>
          <span className="font-mono text-[0.68rem] text-ink-faint">NODE: IN-01</span>
        </div>

        <nav className="flex flex-col gap-1 py-4" aria-label="Mobile">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between py-3 font-display text-lg font-medium text-ink hover:text-cyan border-b border-line/40 transition-colors"
            >
              <span>{label}</span>
              <span className="font-mono text-xs text-ink-faint">0{links.findIndex(l => l[0] === label) + 1}</span>
            </a>
          ))}
        </nav>

        <a
          href="#contact"
          onClick={() => setMenuOpen(false)}
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan py-3.5 font-mono text-[0.82rem] font-semibold uppercase tracking-wider text-bg-0 shadow-[0_0_20px_rgba(0,242,254,0.35)]"
        >
          <span>Initiate Project Brief</span>
          <span>→</span>
        </a>
      </div>
    </header>
  );
}
