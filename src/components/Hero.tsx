import { useRef } from 'react';
import FloatingPanels from './FloatingPanels';
import HeroPanelStrip from './HeroPanelStrip';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface HeroProps {
  introReady: boolean;
}

export default function Hero({ introReady }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  // Intro reveal, gated on the loader finishing.
  useScrollAnimation(
    sectionRef,
    ({ gsap }) => {
      if (!introReady || reduced) return;
      const tl = gsap.timeline({ delay: 0.05 });
      tl.from('.hero-copy > *', {
        y: 26,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: 'power3.out',
      }).from(
        '[data-hero-panel]',
        { y: 40, opacity: 0, duration: 1.2, stagger: 0.08, ease: 'power3.out' },
        '-=0.7',
      );
    },
    [introReady, reduced],
  );

  // Scroll disassembly — the hero dissolves into Identity rather than
  // hard-cutting, so there is no visual seam between sections.
  useScrollAnimation(
    sectionRef,
    ({ gsap }) => {
      if (reduced) return;
      gsap.to('.hero-copy', {
        y: -80,
        opacity: 0,
        filter: 'blur(6px)',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
      gsap.to('[data-hero-panel]', {
        y: -160,
        opacity: 0,
        stagger: 0.02,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    },
    [reduced],
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen md:h-screen md:min-h-[720px] flex-col justify-center overflow-hidden"
    >
      <div
        className="pointer-events-none absolute -top-[10%] left-1/2 h-[900px] w-[900px] -translate-x-1/2 rounded-full blur-[20px]"
        style={{ background: 'radial-gradient(circle, rgba(201,168,118,0.10), transparent 60%)' }}
      />
      <FloatingPanels />

      <div className="wrap hero-copy relative z-[3]">
        <div className="mb-5.5 flex items-center gap-2.5 eyebrow">
          <span className="h-px w-9 bg-ink-faint" />
          DotFreelancer — Sai Krishna Motaparthi
        </div>
        <h1 className="font-display max-w-[14ch] text-[clamp(2.6rem,8.2vw,6.6rem)] font-semibold leading-[0.98] tracking-tight">
          I build software
          <br />
          that <span className="text-brass">moves</span> businesses.
        </h1>
        <p className="mt-6.5 max-w-[44ch] text-[1.02rem] leading-relaxed text-ink-dim">
          One partner for the interface, the backend, the payments, the automation and the AI —
          instead of five freelancers who never talk to each other.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#contact"
            data-cursor="project"
            className="inline-flex items-center gap-2.5 rounded-full bg-ink px-6.5 py-3.5 text-[0.88rem] font-medium text-[#0a0a0a] transition-transform duration-300 hover:-translate-y-0.5"
          >
            Start a project
          </a>
          <a
            href="#projects"
            data-cursor="hover"
            className="inline-flex items-center gap-2.5 rounded-full border border-line-strong px-6.5 py-3.5 text-[0.88rem] text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-brass"
          >
            See the work
          </a>
        </div>

        <HeroPanelStrip />
      </div >

      <div className="absolute bottom-9 left-6 md:left-18 flex items-center gap-2.5 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-ink-faint">
        <span className="relative h-11 w-px overflow-hidden bg-gradient-to-b from-ink-faint to-transparent">
          <span className="absolute left-0 top-[-100%] h-full w-full animate-[wire-run_2.2s_cubic-bezier(.65,0,.35,1)_infinite] bg-brass" />
        </span>
        Scroll
      </div>
    </section >
  );
}