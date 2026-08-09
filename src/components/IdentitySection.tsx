import { useRef } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const lines = [
  { num: '01', text: 'ONE PARTNER.' },
  { num: '02', text: 'EVERY DIGITAL SYSTEM.' },
];

const capabilities = ['Web', 'Mobile', 'Backend', 'Payments', 'Automation', 'Marketing', 'AI', 'Cloud'];

export default function IdentitySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useScrollAnimation(sectionRef, ({ gsap }) => {
    gsap.utils.toArray<HTMLElement>('.identity-row').forEach((row) => {
      gsap.timeline({
        scrollTrigger: { trigger: row, start: 'top 70%', end: 'bottom 40%', toggleActions: 'play reverse play reverse' },
      }).to(row, { opacity: 1, duration: 0.5, ease: 'power2.out' });
    });

    gsap.to('.capability-pill', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.06,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.capability-belt', start: 'top 85%' },
    });
  });

  return (
    <section ref={sectionRef} id="identity" className="pb-40">
      <div className="wrap">
        <div className="flex flex-col gap-1">
          {lines.map((l) => (
            <div
              key={l.num}
              className="identity-row font-display flex items-baseline gap-5 text-[clamp(2.4rem,7vw,5.6rem)] font-semibold opacity-[0.16]"
            >
              <small className="font-mono text-[0.9rem] tracking-wide text-ink-faint">{l.num}</small>
              {l.text}
            </div>
          ))}
        </div>
        <div className="capability-belt mt-20 flex flex-wrap gap-3.5">
          {capabilities.map((c) => (
            <span
              key={c}
              className="capability-pill rounded-full border border-line px-4.5 py-2.5 font-mono text-[0.78rem] tracking-wide text-ink-dim opacity-0"
              style={{ transform: 'translateY(14px)' }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
