import { useRef } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const metrics = [
  { value: '3x', label: 'Faster Time-to-Market', detail: 'No handoff delays or sprint alignment overhead between separate teams.' },
  { value: '60%', label: 'Cost Reduction', detail: 'One direct senior architect instead of agency retainers and 5 project manager salaries.' },
  { value: '100%', label: 'Codebase Ownership', detail: 'Clean, type-safe, documented repository with full administrative control given to you.' },
  { value: '0', label: 'Miscommunication', detail: 'The person scoping your architecture is the exact engineer building it.' },
];

export default function WhyDotFreelancer() {
  const sectionRef = useRef<HTMLElement>(null);

  useScrollAnimation(sectionRef, ({ gsap }) => {
    gsap.utils.toArray<HTMLElement>('.why-metric-card').forEach((card) => {
      gsap.from(card, {
        opacity: 0,
        y: 25,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%' },
      });
    });
  });

  return (
    <section ref={sectionRef} id="why" className="py-24 md:py-36 relative overflow-hidden">
      <div className="wrap">
        <div className="pb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="eyebrow mb-4">The Strategic Advantage</div>
            <h2 className="font-display max-w-[16ch] text-[clamp(2.2rem,6vw,4.2rem)] font-bold leading-[0.98]">
              Stop managing 5 freelancers. Work with one unified engineer.
            </h2>
          </div>
          <p className="max-w-[42ch] text-[0.95rem] text-ink-dim leading-relaxed">
            Eliminate communication breakdowns, mismatched API schemas, and delayed launches with single-point engineering accountability.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((m, i) => (
            <div
              key={i}
              className="why-metric-card hud-card p-6 sm:p-7 border border-line bg-surface/30 hover:border-cyan/40 transition-all duration-300"
            >
              <div className="font-display text-[clamp(2.8rem,5vw,3.8rem)] font-bold text-cyan drop-shadow-[0_0_20px_rgba(0,242,254,0.3)]">
                {m.value}
              </div>
              <div className="font-display text-lg font-semibold text-ink mt-2 mb-2">
                {m.label}
              </div>
              <p className="text-[0.88rem] text-ink-dim leading-relaxed">
                {m.detail}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-16 rounded-2xl border border-cyan/30 bg-gradient-to-r from-bg-1 via-surface to-bg-1 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,242,254,0.06)]">
          <div>
            <span className="cyber-badge mb-3">HIGH EFFICIENCY PARTNERSHIP</span>
            <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink">
              Ready to replace chaos with a clean, fast launch?
            </h3>
            <p className="mt-2 text-ink-dim text-[0.95rem]">
              Let’s review your project requirements and outline a turnkey technical architecture.
            </p>
          </div>

          <a
            href="#contact"
            className="flex-none inline-flex items-center gap-3 rounded-xl bg-cyan px-7 py-4 font-mono text-[0.82rem] font-semibold uppercase tracking-wider text-bg-0 hover:shadow-[0_0_30px_rgba(0,242,254,0.5)] transition-all hover:scale-105"
          >
            <span>Book Technical Brief</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
