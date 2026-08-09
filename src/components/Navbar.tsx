import { useEffect, useState } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[500] flex items-center justify-between px-6 py-5.5 md:px-18 border-b transition-colors duration-400 ${
        scrolled
          ? 'bg-bg-0/60 backdrop-blur-xl border-line'
          : 'border-transparent'
      }`}
    >
      <a href="#hero" className="flex items-center gap-2 font-display font-semibold text-[1.02rem]">
        <span className="h-1.5 w-1.5 rounded-full bg-brass" />
        DOTFREELANCER
      </a>
      <nav className="hidden md:flex gap-8" aria-label="Primary">
        {[
          ['Systems', '#ecosystem'],
          ['Services', '#services'],
          ['Work', '#projects'],
          ['About', '#about'],
        ].map(([label, href]) => (
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
      <a
        href="#contact"
        data-cursor="hover"
        className="rounded-full border border-line-strong px-4.5 py-2.5 text-[0.78rem] tracking-wide text-ink transition-colors hover:border-brass hover:bg-white/5"
      >
        Start a project
      </a>
    </header>
  );
}
