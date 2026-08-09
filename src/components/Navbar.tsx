import { useEffect, useState } from 'react';

const links: [string, string][] = [
  ['Systems', '#ecosystem'],
  ['Services', '#services'],
  ['Work', '#projects'],
  ['About', '#about'],
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile menu is open, and close it
  // automatically if the viewport grows back into desktop range.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMenuOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[500] flex items-center justify-between px-6 py-5.5 md:px-18 border-b transition-colors duration-400 ${
        scrolled || menuOpen ? 'bg-bg-0/60 backdrop-blur-xl border-line' : 'border-transparent'
      }`}
    >
      <a href="#hero" className="flex items-center gap-2 font-display font-semibold text-[1.02rem]">
        <span className="h-1.5 w-1.5 rounded-full bg-brass" />
        DOTFREELANCER
      </a>

      {/* Desktop nav — unchanged */}
      <nav className="hidden md:flex gap-8" aria-label="Primary">
        {links.map(([label, href]) => (
          <a
            key={href}
            href={href}
            data-cursor="hover"
            className="group relative text-[0.82rem] text-ink-dim transition-colors hover:text-ink"
          >
            {label}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-brass transition-all duration-300 group-hover:w-full" />
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <a
          href="#contact"
          data-cursor="hover"
          className="hidden sm:inline-flex rounded-full border border-line-strong px-4.5 py-2.5 text-[0.78rem] tracking-wide text-ink transition-colors hover:border-brass hover:bg-white/5"
        >
          Start a project
        </a>

        {/* Mobile menu toggle — only rendered below md, so it never
            touches desktop layout or spacing. */}
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav-panel"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="relative flex h-9 w-9 flex-none items-center justify-center md:hidden"
        >
          <span className="relative block h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-px w-full bg-ink transition-all duration-300 ${
                menuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : ''
              }`}
            />
            <span
              className={`absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-ink transition-opacity duration-200 ${
                menuOpen ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-px w-full bg-ink transition-all duration-300 ${
                menuOpen ? 'bottom-1/2 translate-y-1/2 -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        id="mobile-nav-panel"
        className={`absolute left-0 right-0 top-full border-b border-line bg-bg-0/95 backdrop-blur-xl md:hidden transition-all duration-300 ease-out ${
          menuOpen ? 'pointer-events-auto max-h-[420px] opacity-100' : 'pointer-events-none max-h-0 opacity-0'
        }`}
        style={{ overflow: 'hidden' }}
      >
        <nav className="flex flex-col gap-1 px-6 py-6" aria-label="Mobile">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="border-b border-line py-4 font-display text-lg font-medium text-ink last:border-b-0"
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-5 inline-flex items-center justify-center rounded-full bg-ink px-6 py-3.5 text-[0.88rem] font-medium text-[#0a0a0a]"
          >
            Start a project
          </a>
        </nav>
      </div>
    </header>
  );
}
