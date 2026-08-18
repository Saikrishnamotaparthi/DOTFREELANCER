import { useRef, useState } from 'react';
import { processSteps } from '../data/process';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function ProcessTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedStep, setSelectedStep] = useState(0);

  useScrollAnimation(sectionRef, ({ gsap }) => {
    gsap.utils.toArray<HTMLElement>('.timeline-step-card').forEach((card) => {
      gsap.from(card, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 85%' },
      });
    });
  });

  return (
    <section ref={sectionRef} id="process" className="py-24 md:py-36 relative overflow-hidden">
      <div className="wrap">
        <div className="pb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="eyebrow mb-4">Execution Protocol</div>
            <h2 className="font-display max-w-[16ch] text-[clamp(2.2rem,6vw,4.2rem)] font-bold leading-[0.98]">
              From concept to live enterprise system.
            </h2>
          </div>
          <p className="max-w-[42ch] text-[0.95rem] text-ink-dim leading-relaxed">
            A battle-tested 7-stage engineering lifecycle designed for speed, precision, and zero bottlenecks.
          </p>
        </div>

        {/* Interactive Milestones Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-8 items-start">
          {/* Milestone List */}
          <div className="space-y-3">
            {processSteps.map((s, i) => (
              <button
                key={s.num}
                onClick={() => setSelectedStep(i)}
                className={`timeline-step-card w-full p-4.5 rounded-xl border text-left transition-all duration-300 flex items-center justify-between gap-4 ${
                  selectedStep === i
                    ? 'border-cyan bg-cyan/10 shadow-[0_0_20px_rgba(0,242,254,0.15)] text-ink'
                    : 'border-line bg-surface/30 hover:border-line-strong text-ink-dim'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className={`font-mono text-xs font-semibold ${selectedStep === i ? 'text-cyan' : 'text-ink-faint'}`}>
                    {s.num} //
                  </span>
                  <div>
                    <span className="font-display text-[1rem] font-semibold text-ink block">{s.label}</span>
                    <span className="font-mono text-[0.62rem] text-cyan uppercase">{s.tagline}</span>
                  </div>
                </div>
                <span className={`h-2 w-2 rounded-full ${selectedStep === i ? 'bg-cyan animate-pulse shadow-[0_0_8px_#00f2fe]' : 'bg-line-strong'}`} />
              </button>
            ))}
          </div>

          {/* Active Phase Deep-Dive Card */}
          <div className="sticky top-28 rounded-2xl border border-cyan/30 bg-bg-1/95 backdrop-blur-2xl p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,242,254,0.06)]">
            <div className="flex items-center justify-between pb-4 border-b border-line">
              <span className="cyber-badge text-[0.64rem]">
                STAGE {processSteps[selectedStep].num} OF 07
              </span>
              <span className="font-mono text-[0.68rem] text-emerald-400">
                ● STATUS: REPEATABLE &amp; VERIFIED
              </span>
            </div>

            <div className="mt-6">
              <span className="font-mono text-[0.72rem] text-cyan uppercase tracking-widest">
                {processSteps[selectedStep].tagline}
              </span>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-ink mt-1">
                {processSteps[selectedStep].label}
              </h3>
              <p className="mt-4 text-[1.02rem] text-ink-dim leading-relaxed">
                {processSteps[selectedStep].description}
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-line flex flex-wrap items-center justify-between gap-4">
              <div className="font-mono text-[0.7rem] text-ink-faint">
                ESTIMATED SPRINT: <span className="text-ink font-semibold">1–2 WEEKS</span>
              </div>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-lg bg-cyan px-4 py-2 font-mono text-[0.72rem] font-semibold uppercase tracking-wider text-bg-0 hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all"
              >
                <span>Initiate This Process</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
