import { Children, useRef, type ReactNode } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface InterfaceDeckProps {
  children: ReactNode;
  className?: string;
}

/**
 * Stacks its children as absolutely-positioned "interface states" and
 * crossfades sequentially through them as the block scrolls past —
 * the mechanism behind "menu becomes admin panel" / "tickets become
 * the QR pass" without a full page pin (keeps each project block a
 * normal-height section, matching the approved layout).
 */
export default function InterfaceDeck({ children, className = '' }: InterfaceDeckProps) {
  const deckRef = useRef<HTMLDivElement>(null);
  const panels = Children.toArray(children);

  useScrollAnimation(
    deckRef,
    ({ gsap }) => {
      const els = deckRef.current?.querySelectorAll<HTMLElement>('[data-deck-panel]');
      if (!els || els.length < 2) return;

      gsap.set(els, { opacity: 0, y: 14 });
      gsap.set(els[0], { opacity: 1, y: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: deckRef.current,
          start: 'top 68%',
          end: 'bottom 24%',
          scrub: 0.6,
        },
      });

      els.forEach((el, i) => {
        if (i === 0) return;
        const prev = els[i - 1];
        tl.to(prev, { opacity: 0, y: -14, duration: 1 }, i - 1);
        tl.to(el, { opacity: 1, y: 0, duration: 1 }, i - 1);
      });
    },
    [panels.length],
  );

  if (panels.length < 2) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={deckRef} className={`relative ${className}`}>
      {panels.map((panel, i) => (
        <div key={i} data-deck-panel className={i === 0 ? 'relative' : 'absolute inset-0'}>
          {panel}
        </div>
      ))}
    </div>
  );
}
