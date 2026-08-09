import { useEffect, useRef } from 'react';

interface ParallaxTarget {
  el: HTMLElement;
  depth: number;
}

/**
 * Tracks pointer position within `containerRef` and applies a
 * spring-interpolated translate to any descendant carrying
 * `data-depth`. Uses requestAnimationFrame rather than direct
 * mousemove writes so motion has inertia instead of feeling glued
 * to the cursor.
 */
export function useMouseParallax(
  containerRef: React.RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const targets = useRef<ParallaxTarget[]>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const current = useRef<{ x: number; y: number }[]>([]);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    const els = Array.from(
      container.querySelectorAll<HTMLElement>('[data-depth]'),
    );
    targets.current = els.map((el) => ({
      el,
      depth: parseFloat(el.dataset.depth || '0.5'),
    }));
    current.current = targets.current.map(() => ({ x: 0, y: 0 }));

    const onMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      pointer.current = {
        x: (e.clientX - cx) / (rect.width / 2),
        y: (e.clientY - cy) / (rect.height / 2),
      };
    };

    const tick = () => {
      targets.current.forEach((t, i) => {
        const state = current.current[i];
        const tx = pointer.current.x * 26 * t.depth;
        const ty = pointer.current.y * 26 * t.depth;
        state.x += (tx - state.x) * 0.08;
        state.y += (ty - state.y) * 0.08;
        t.el.style.transform = `translate3d(${state.x}px, ${state.y}px, 0)`;
      });
      raf.current = requestAnimationFrame(tick);
    };

    container.addEventListener('mousemove', onMove);
    raf.current = requestAnimationFrame(tick);

    return () => {
      container.removeEventListener('mousemove', onMove);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [containerRef, enabled]);
}
