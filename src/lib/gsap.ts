import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Central motion tokens so every section shares the same easing
// language instead of hand-picked curves per component.
export const motion = {
  ease: {
    out: 'power3.out',
    inOut: 'power2.inOut',
    spring: 'back.out(1.6)',
  },
  duration: {
    fast: 0.4,
    base: 0.8,
    slow: 1.2,
  },
};

export { gsap, ScrollTrigger };
