import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * Renders a two-part cursor (a tight dot plus a trailing ring) and
 * exposes cursor "state" via classes on <body> (cur-hover / cur-project)
 * so any component can opt in just by adding data-cursor="hover" or
 * data-cursor="project" to an element — no cursor logic has to live
 * inside individual sections.
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 861px)');
  const reduced = useReducedMotion();
  const active = isDesktop && !reduced;

  useEffect(() => {
    if (!active) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = `${mx}px`;
      dot.style.top = `${my}px`;
    };
    window.addEventListener('mousemove', onMove);

    const ticker = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = `${rx}px`;
      ring.style.top = `${ry}px`;
    };
    gsap.ticker.add(ticker);

    const setState = (cls: string, on: boolean) =>
      document.body.classList.toggle(cls, on);

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-cursor]');
      if (!target) return;
      const kind = target.getAttribute('data-cursor');
      if (kind === 'hover') setState('cur-hover', true);
      if (kind === 'project') setState('cur-project', true);
    };
    const onOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-cursor]');
      if (!target) return;
      setState('cur-hover', false);
      setState('cur-project', false);
    };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    return () => {
      window.removeEventListener('mousemove', onMove);
      gsap.ticker.remove(ticker);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      document.body.classList.remove('cur-hover', 'cur-project');
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      <div ref={dotRef} id="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} id="cursor-ring" aria-hidden="true" />
    </>
  );
}
