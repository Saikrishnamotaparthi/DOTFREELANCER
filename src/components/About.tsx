import { useRef } from 'react';
import Glass from './Glass';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const principles = [
  { num: '01', title: 'System-First Thinking', desc: 'Designing software where databases, UI, and automations reinforce each other without leaky abstractions.' },
  { num: '02', title: 'Zero Bloat & Peak Velocity', desc: 'Shipping clean, type-safe code that renders instantly without unnecessary dependency baggage.' },
  { num: '03', title: 'Automate Everything Repeatable', desc: 'Connecting n8n, webhooks, and WhatsApp bots so human staff never waste hours doing repetitive tasks.' },
  { num: '04', title: 'Total Code Ownership', desc: 'You receive full administrative access, clear documentation, and zero vendor lock-in.' },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useScrollAnimation(sectionRef, ({ gsap }) => {
    gsap.from('.about-portrait', {
      opacity: 0,
      x: -30,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.about-grid', start: 'top 80%' },
    });
    gsap.from('.principle', {
      opacity: 0,
      y: 16,
      stagger: 0.08,
      duration: 0.6,
      scrollTrigger: { trigger: '.principles', start: 'top 90%' },
    });
  });

  return (
    <section ref={sectionRef} id="about" className="py-24 md:py-36">
      <div className="wrap">
        <div className="pb-14">
          <div className="eyebrow mb-3">Architect &amp; Founder</div>
          <h2 className="font-display max-w-[16ch] text-[clamp(2.2rem,6vw,4.2rem)] font-bold leading-[0.98]">
            The engineer behind your system.
          </h2>
        </div>

        <div className="about-grid grid grid-cols-1 items-start gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Founder Portrait Card */}
          <Glass variant="smoked" className="about-portrait relative flex aspect-[4/5] flex-col justify-end overflow-hidden p-6 border border-cyan/20 bg-bg-1/90 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            {/* Fallback initials */}
            <div className="font-display absolute inset-0 flex items-center justify-center text-[7rem] font-bold text-white/5">
              SKM
            </div>

            {/* Profile photo */}
            <img
              src="/profile.png"
              alt="Sai Krishna Motaparthi"
              className="absolute inset-0 h-full w-full object-cover object-top opacity-90"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />

            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <span className="cyber-badge-emerald text-[0.6rem]">● VERIFIED DEVELOPER</span>
              <span className="font-mono text-[0.62rem] text-cyan">INDIA</span>
            </div>

            <div className="relative z-[2] rounded-xl bg-bg-0/80 backdrop-blur-md p-4 border border-line">
              <div className="font-display text-lg font-bold text-ink">Sai Krishna Motaparthi</div>
              <div className="font-mono text-[0.68rem] text-cyan uppercase tracking-wider">
                Full Stack Architect &amp; Automation Engineer
              </div>
            </div>
          </Glass>

          {/* Details & Principles */}
          <div>
            <div className="cyber-badge mb-3">SINGLE-PARTNER ADVANTAGE</div>
            <h3 className="font-display text-[clamp(1.9rem,4vw,2.8rem)] font-bold text-ink">
              Building every layer of your business infrastructure with precision.
            </h3>
            <p className="mt-5 max-w-[56ch] leading-relaxed text-ink-dim text-[1rem]">
              I design and build the complete digital footprint of high-growth businesses — web applications, scalable APIs, payment meshes, automation pipelines, and custom AI agents. Because one architect designs the entire stack, your frontend and backend communicate flawlessly with zero finger-pointing between teams.
            </p>

            <div className="principles mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {principles.map((p) => (
                <div key={p.num} className="principle hud-card p-5 border border-line bg-surface/30 hover:border-cyan/30 transition-colors">
                  <div className="font-mono text-[0.68rem] text-cyan font-semibold">{p.num} //</div>
                  <div className="font-display mt-1 text-[1.05rem] font-semibold text-ink">{p.title}</div>
                  <p className="mt-2 text-[0.82rem] text-ink-dim leading-relaxed">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
