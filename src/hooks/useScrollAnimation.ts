import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from '../lib/gsap';

/**
 * Runs `setup` inside a GSAP context scoped to `scopeRef`, so every
 * tween / ScrollTrigger created inside is automatically reverted
 * (and its ScrollTriggers killed) on unmount or dependency change.
 */
export function useScrollAnimation(
  scopeRef: RefObject<HTMLElement | null>,
  setup: (ctx: { gsap: typeof gsap }) => void,
  deps: unknown[] = [],
) {
  useLayoutEffect(() => {
    if (!scopeRef.current) return;
    const ctx = gsap.context(() => setup({ gsap }), scopeRef);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
