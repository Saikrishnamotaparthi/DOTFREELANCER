import { useRef, useState } from 'react';
import { technologies } from '../data/technologies';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function TechSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  useScrollAnimation(sectionRef, ({ gsap }) => {
    gsap.utils.toArray<HTMLElement>('.tech-card-item').forEach((card) => {
      gsap.from(card, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: card, start: 'top 90%' },
      });
    });
  });

  const displayedGroups =
    activeTab === 'all' ? technologies : technologies.filter((g) => g.id === activeTab);

  return (
    <section ref={sectionRef} id="tech" className="pt-14 md:pt-20 pb-24 md:pb-36 relative">
      <div className="wrap">
        <div className="pb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="eyebrow mb-4">Production Stack</div>
            <h2 className="font-display max-w-[16ch] text-[clamp(2.2rem,6vw,4.2rem)] font-bold leading-[0.98]">
              Proven modern tech, zero legacy baggage.
            </h2>
          </div>
          <p className="max-w-[42ch] text-[0.95rem] text-ink-dim leading-relaxed">
            Every library, framework, and database is chosen for high execution speed, maintainability, and enterprise uptime.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 pb-8 border-b border-line">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl font-mono text-[0.72rem] uppercase tracking-wider transition-all duration-300 ${
              activeTab === 'all'
                ? 'bg-cyan text-bg-0 font-bold shadow-[0_0_15px_rgba(0,242,254,0.35)]'
                : 'border border-line bg-surface/40 text-ink-dim hover:text-ink'
            }`}
          >
            All Tech Stacks (16+)
          </button>

          {technologies.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveTab(g.id)}
              className={`px-4 py-2 rounded-xl font-mono text-[0.72rem] uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                activeTab === g.id
                  ? 'bg-cyan text-bg-0 font-bold shadow-[0_0_15px_rgba(0,242,254,0.35)]'
                  : 'border border-line bg-surface/40 text-ink-dim hover:text-ink'
              }`}
            >
              <span>{g.icon}</span>
              <span>{g.label}</span>
            </button>
          ))}
        </div>

        {/* Tech Grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedGroups.map((g) => (
            <div key={g.id} className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-line font-mono text-[0.72rem] text-cyan font-semibold uppercase tracking-wider">
                <span>{g.icon}</span>
                <span>{g.label}</span>
              </div>

              <div className="space-y-3">
                {g.items.map((item) => (
                  <div
                    key={item.name}
                    className="tech-card-item hud-card p-4.5 border border-line bg-surface/40 hover:border-cyan/40 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-display text-[0.95rem] font-semibold text-ink">{item.name}</span>
                      <span className="font-mono text-[0.58rem] text-cyan border border-cyan/30 bg-cyan/10 px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-[0.82rem] text-ink-dim leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
