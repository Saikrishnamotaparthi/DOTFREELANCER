import { useRef } from 'react';
import { processSteps } from '../data/process';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ScrollTrigger } from '../lib/gsap';
import { useMediaQuery } from '../hooks/useMediaQuery';

export default function ProcessTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  // Pinned + scrubbed sections are the classic source of scroll jank
  // on phones (the address bar showing/hiding mid-scroll fights with
  // the pin's cached measurements). Desktop keeps the full mechanism;
  // mobile gets a plain sequential reveal, no pin, no scrub.
  const isDesktop = useMediaQuery('(min-width: 768px)');

  // Driven as one continuous scrub rather than per-step triggers, so
  // the fill and the active step always agree with each other — it
  // reads as one mechanism, not independent animations. Desktop only.
  useScrollAnimation(
    sectionRef,
    () => {
      if (!isDesktop) return;
      const steps = stepRefs.current.filter(Boolean) as HTMLDivElement[];
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate(self) {
          const p = self.progress;
          if (fillRef.current) fillRef.current.style.height = `${p * 100}%`;
          const idx = Math.min(steps.length - 1, Math.floor(p * steps.length));
          steps.forEach((s, i) => s.classList.toggle('process-active', i <= idx));
        },
      });
    },
    [isDesktop],
  );

  // Mobile: each step just fades/slides in as it enters view, and
  // stays active — no pin, no pixel-perfect fill sync required.
  useScrollAnimation(
    sectionRef,
    ({ gsap }) => {
      if (isDesktop) return;
      const steps = stepRefs.current.filter(Boolean) as HTMLDivElement[];
      steps.forEach((step, i) => {
        gsap.to(step, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: step, start: 'top 82%' },
          onStart: () => {
            step.classList.add('process-active');
            if (fillRef.current) fillRef.current.style.height = `${((i + 1) / steps.length) * 100}%`;
          },
        });
      });
    },
    [isDesktop],
  );

  return (
    <section
      ref={sectionRef}
      id="process"
      className={isDesktop ? 'relative h-[340vh]' : 'relative py-24'}
    >
      <div
        className={
          isDesktop
            ? 'wrap sticky top-0 flex h-screen flex-col justify-center overflow-hidden'
            : 'wrap flex flex-col justify-center'
        }
      >
        <div className="pb-10">
          <div className="eyebrow mb-4.5">How it gets built</div>
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-semibold">
            From idea to a system that scales.
          </h2>
        </div>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-line">
            <div ref={fillRef} className="absolute left-0 top-0 w-full bg-brass" style={{ height: 0 }} />
          </div>

          <div className="flex flex-col items-center gap-17.5">
            {processSteps.map((s, i) => (
              <div
                key={s.num}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className="process-step flex items-center gap-5.5 opacity-20 transition-[opacity,transform] duration-300"
                style={{ transform: 'scale(0.94)' }}
              >
                <span className="process-dot h-2.5 w-2.5 rounded-full bg-ink-faint transition-colors duration-300" />
                <span className="font-mono text-[0.7rem] text-ink-faint">{s.num}</span>
                <span className="font-display text-[clamp(1.4rem,3.6vw,2.4rem)] font-semibold tracking-wide">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .process-active { opacity: 1 !important; transform: scale(1) !important; }
        .process-active .process-dot { background: var(--color-brass); }
      `}</style>
    </section>
  );
}
