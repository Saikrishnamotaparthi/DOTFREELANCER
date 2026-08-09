import { useRef } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const roles = [
  'Designer',
  'Developer',
  'Backend developer',
  'App developer',
  'Automation developer',
  'DevOps',
  'Marketing integration',
];

export default function WhyDotFreelancer() {
  const sectionRef = useRef<HTMLElement>(null);

  useScrollAnimation(sectionRef, ({ gsap }) => {
    gsap.from('.why-piece', {
      opacity: 0,
      y: 14,
      stagger: 0.05,
      duration: 0.6,
      scrollTrigger: { trigger: '.why-pieces', start: 'top 85%' },
    });
    gsap.from('.why-result', {
      opacity: 0,
      scale: 0.9,
      duration: 0.8,
      ease: 'back.out(1.6)',
      scrollTrigger: { trigger: '.why-result', start: 'top 90%' },
    });
  });

  return (
    <section ref={sectionRef} id="why" className="pb-40">
      <div className="wrap text-center">
        <h2 className="font-display mx-auto mb-17.5 max-w-[16ch] text-[clamp(2.2rem,6.4vw,4.6rem)] font-semibold leading-[0.98]">
          Stop building your product in pieces.
        </h2>
        <div className="flex flex-col items-center gap-2.5">
          <div className="why-pieces mx-auto flex max-w-[820px] flex-wrap justify-center gap-3">
            {roles.map((r) => (
              <span
                key={r}
                className="why-piece rounded-full border border-line px-4 py-2.5 font-mono text-[0.76rem] text-ink-faint line-through"
              >
                {r}
              </span>
            ))}
          </div>
          <div className="my-6.5 text-2xl text-ink-faint">↓</div>
          <div
            className="why-result glass !rounded-full px-10.5 py-5.5 font-display text-[1.3rem] font-semibold"
            style={{ borderColor: 'var(--color-brass)' }}
          >
            DOTFREELANCER — one connected system
          </div>
        </div>
      </div>
    </section>
  );
}
