import { useRef, useState } from 'react';
import { services } from '../data/services';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function ServiceList() {
  const sectionRef = useRef<HTMLElement>(null);
  const [expanded, setExpanded] = useState<string | null>('01');

  useScrollAnimation(sectionRef, ({ gsap }) => {
    gsap.utils.toArray<HTMLElement>('.service-card-item').forEach((card) => {
      gsap.from(card, {
        opacity: 0,
        y: 25,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 90%' },
      });
    });
  });

  return (
    <section ref={sectionRef} id="services" className="py-24 md:py-36">
      <div className="wrap">
        <div className="pb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="eyebrow mb-4">Core Capabilities</div>
            <h2 className="font-display max-w-[16ch] text-[clamp(2.2rem,6vw,4.2rem)] font-bold leading-[0.98]">
              Engineered for velocity, scalability, and impact.
            </h2>
          </div>
          <p className="max-w-[42ch] text-[0.95rem] text-ink-dim leading-relaxed">
            Click any capability to inspect deliverables, tech architecture, and turnaround timelines.
          </p>
        </div>

        <div className="space-y-4">
          {services.map((s) => {
            const isSelected = expanded === s.num;

            return (
              <div
                key={s.num}
                className={`service-card-item rounded-2xl border transition-all duration-400 overflow-hidden ${
                  isSelected
                    ? 'border-cyan/40 bg-bg-1/90 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(0,242,254,0.06)]'
                    : 'border-line bg-surface/30 hover:border-line-strong'
                }`}
              >
                {/* Header row */}
                <button
                  onClick={() => setExpanded(isSelected ? null : s.num)}
                  data-cursor="hover"
                  className="w-full p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left"
                >
                  <div className="flex items-center gap-5">
                    <span className={`font-mono text-sm sm:text-base font-semibold transition-colors ${
                      isSelected ? 'text-cyan' : 'text-ink-faint'
                    }`}>
                      {s.num} //
                    </span>
                    <div>
                      <div className="font-mono text-[0.64rem] text-cyan uppercase tracking-wider mb-1">
                        {s.category}
                      </div>
                      <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">
                        {s.name}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <span className="cyber-badge-emerald text-[0.62rem]">
                      ⚡ {s.turnaround}
                    </span>
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full border border-line text-xs font-mono transition-transform duration-300 ${
                      isSelected ? 'rotate-180 border-cyan text-cyan' : 'text-ink-faint'
                    }`}>
                      ↓
                    </span>
                  </div>
                </button>

                {/* Expandable Drawer */}
                {isSelected && (
                  <div className="px-6 pb-7 sm:px-7 pt-2 border-t border-line/60 grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8">
                    <div>
                      <p className="text-[0.96rem] text-ink-dim leading-relaxed mb-5">
                        {s.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {s.technologies.map((t) => (
                          <span
                            key={t}
                            className="rounded-lg border border-cyan/20 bg-cyan/5 px-2.5 py-1 font-mono text-[0.7rem] text-cyan"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl border border-line bg-surface/50 p-5">
                      <div className="font-mono text-[0.68rem] text-ink-faint uppercase tracking-wider mb-3">
                        DELIVERABLES INCLUDED //
                      </div>
                      <ul className="space-y-2 mb-5">
                        {s.deliverables.map((d, i) => (
                          <li key={i} className="flex items-center gap-2.5 text-[0.84rem] text-ink">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan flex-none" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>

                      <a
                        href="#contact"
                        className="inline-flex items-center gap-2 rounded-lg bg-ink px-4 py-2 font-mono text-[0.74rem] font-semibold uppercase tracking-wider text-bg-0 hover:bg-cyan transition-colors"
                      >
                        <span>Select for My Project</span>
                        <span>→</span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
