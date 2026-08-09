import Lenis from 'lenis';
import { gsap, ScrollTrigger } from './gsap';

let lenis: Lenis | null = null;

/**
 * Creates the smooth-scroll instance once and drives it from GSAP's
 * ticker so ScrollTrigger stays perfectly in sync (rather than two
 * competing rAF loops fighting over scroll position).
 */
export function initLenis(): Lenis {
  if (lenis) return lenis;

  lenis = new Lenis({
    duration: 1.1,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis?.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function destroyLenis() {
  lenis?.destroy();
  lenis = null;
}

export function getLenis() {
  return lenis;
}
