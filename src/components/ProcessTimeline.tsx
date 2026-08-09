import { useRef } from 'react';
import { processSteps } from '../data/process';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { ScrollTrigger } from '../lib/gsap';

export default function ProcessTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Driven as one continuous scrub rather than per-step triggers, so
  // the fill and the active step always agree with each other — it
  // reads as one mechanism, not independent animations.
  useScrollAnimation(sectionRef, () => {
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
  });

  return (
    <section ref={sectionRef} id="process" className="relative h-[340vh]">
      <div className="wrap sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
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
