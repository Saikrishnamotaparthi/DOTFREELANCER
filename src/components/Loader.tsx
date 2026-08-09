import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useLayoutEffect(() => {
    if (reduced) {
      onComplete();
      return;
    }

    const tl = gsap.timeline({
      onComplete,
    });
    tl.to(barRef.current, { width: '100%', duration: 0.9, ease: 'power2.out' });
    tl.to(rootRef.current, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, '+=0.35');

    return () => {
      tl.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (reduced) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-3.5 bg-bg-0"
      aria-hidden="true"
    >
      <div className="font-display text-[clamp(1.4rem,3vw,2rem)] font-semibold tracking-wide">
        DOTFREELANCER
      </div>
      <div className="font-mono text-[0.68rem] tracking-[0.24em] uppercase text-ink-faint">
        Initializing digital system
      </div>
      <div className="relative h-px w-[180px] overflow-hidden bg-line">
        <span ref={barRef} className="absolute top-0 left-0 h-full w-0 bg-brass" />
      </div>
    </div>
  );
}
