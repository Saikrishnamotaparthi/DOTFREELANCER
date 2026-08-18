import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) {
      onComplete();
      return;
    }

    const tl = gsap.timeline({
      onComplete,
    });
    tl.fromTo(logoRef.current, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' });
    tl.to(barRef.current, { width: '100%', duration: 0.9, ease: 'power2.out' }, '-=0.2');
    tl.to(rootRef.current, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, '+=0.25');

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (reduced) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-4 bg-bg-0"
      aria-hidden="true"
    >
      <img
        ref={logoRef}
        src="/logo.png"
        alt="DotFreelancer"
        className="h-16 w-16 sm:h-20 sm:w-20 object-contain drop-shadow-[0_0_25px_rgba(0,242,254,0.6)]"
      />
      <div className="font-display text-[clamp(1.4rem,3vw,2rem)] font-bold tracking-wide text-ink">
        DOTFREELANCER
      </div>
      <div className="font-mono text-[0.68rem] tracking-[0.24em] uppercase text-cyan">
        ● INITIALIZING ARCHITECTURE
      </div>
      <div className="relative h-[2px] w-[200px] overflow-hidden rounded-full bg-white/10 mt-1">
        <span ref={barRef} className="absolute top-0 left-0 h-full w-0 bg-gradient-to-r from-cyan to-signal shadow-[0_0_8px_#00f2fe]" />
      </div>
    </div>
  );
}
