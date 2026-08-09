import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Mobile browsers resize the viewport when the address bar shows/hides
// on scroll, which by default re-triggers a full ScrollTrigger
// recalculation mid-scroll — the classic cause of pinned sections
// jumping or lagging on phones. This tells ScrollTrigger to ignore
// those address-bar-driven resizes specifically.
ScrollTrigger.config({ ignoreMobileResize: true });

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
