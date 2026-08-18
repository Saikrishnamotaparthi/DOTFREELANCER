import { useRef, useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const capabilities = [
  { name: 'Custom Web Apps', spec: 'React 19 / Next.js', status: 'ACTIVE' },
  { name: 'Backend & APIs', spec: 'Node.js / Express / REST', status: 'ACTIVE' },
  { name: 'Cloud & Database', spec: 'PostgreSQL / Mongo / AWS', status: 'ACTIVE' },
  { name: 'Payment Gateways', spec: 'Razorpay / Stripe / Webhooks', status: 'SECURE' },
  { name: 'AI & Automations', spec: 'n8n / OpenAI / Custom Agents', status: 'SYNCED' },
  { name: 'Marketing Systems', spec: 'WhatsApp Business API / SMTP', status: 'LIVE' },
];

const comparisons = [
  {
    topic: 'System Architecture',
    traditional: '5 different freelancers using mismatched tools and APIs',
    dotfreelancer: '1 unified blueprint where UI, backend, DB & automation connect natively',
  },
  {
    topic: 'Communication Overhead',
    traditional: 'Endless status meetings, blaming between frontend and backend',
    dotfreelancer: 'Direct 1-on-1 WhatsApp / Slack channel with the engineer shipping the code',
  },
  {
    topic: 'Delivery Velocity',
    traditional: 'Months lost waiting for one person to unblock the next',
    dotfreelancer: 'Rapid end-to-end iteration from first prototype to live deployment in weeks',
  },
  {
    topic: 'Maintenance & Ownership',
    traditional: 'No one takes responsibility when an API breaks after launch',
    dotfreelancer: 'Complete system accountability, documentation, and continuous reliability',
  },
];

export default function IdentitySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCap, setActiveCap] = useState<number | null>(null);

  useScrollAnimation(sectionRef, ({ gsap }) => {
    gsap.utils.toArray<HTMLElement>('.identity-row').forEach((row) => {
      gsap.timeline({
        scrollTrigger: { trigger: row, start: 'top 75%', end: 'bottom 40%', toggleActions: 'play reverse play reverse' },
      }).to(row, { opacity: 1, duration: 0.5, ease: 'power2.out' });
    });

    gsap.to('.capability-card', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.05,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.capability-grid', start: 'top 85%' },
    });
  });

  return (
    <section ref={sectionRef} id="identity" className="py-28 md:py-40">
      <div className="wrap">
        <div className="flex flex-col gap-2">
          <div className="identity-row font-display flex items-baseline gap-4 text-[clamp(2.4rem,7vw,5.2rem)] font-bold opacity-[0.25] tracking-tight">
            <small className="font-mono text-[0.85rem] text-cyan tracking-wider">01 //</small>
            ONE PARTNER.
          </div>
          <div className="identity-row font-display flex items-baseline gap-4 text-[clamp(2.4rem,7vw,5.2rem)] font-bold opacity-[0.25] tracking-tight">
            <small className="font-mono text-[0.85rem] text-cyan tracking-wider">02 //</small>
            EVERY CONNECTED SYSTEM.
          </div>
        </div>

        {/* Interactive Capability Matrix */}
        <div className="mt-16">
          <div className="flex items-center justify-between pb-4 border-b border-line">
            <span className="font-mono text-[0.72rem] text-cyan uppercase tracking-widest">
              DEPLOYED CAPABILITY MATRIX
            </span>
            <span className="font-mono text-[0.68rem] text-ink-faint">TAP / HOVER TO INSPECT</span>
          </div>

          <div className="capability-grid mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {capabilities.map((c, i) => (
              <div
                key={c.name}
                onMouseEnter={() => setActiveCap(i)}
                onMouseLeave={() => setActiveCap(null)}
                className={`capability-card hud-card p-5 cursor-pointer transition-all duration-300 opacity-0 translate-y-3 ${
                  activeCap === i ? 'border-cyan bg-cyan/10 shadow-[0_0_20px_rgba(0,242,254,0.2)]' : 'border-line'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-display text-[1rem] font-semibold text-ink">{c.name}</span>
                  <span className="font-mono text-[0.62rem] text-emerald-400 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                    {c.status}
                  </span>
                </div>
                <div className="font-mono text-[0.72rem] text-cyan">{c.spec}</div>
              </div>
            ))}
          </div>
        </div>

        {/* The Difference: Traditional vs DotFreelancer (Streamlined on mobile, full on desktop/tablet) */}
        <div className="hidden md:block mt-24 rounded-2xl border border-line-strong bg-surface/30 backdrop-blur-xl p-6 sm:p-10">
          <div className="mb-8">
            <div className="eyebrow mb-2">Architectural Advantage</div>
            <h3 className="font-display text-[clamp(1.6rem,4vw,2.4rem)] font-semibold">
              Why business founders choose a single system architect.
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comparisons.map((cmp, idx) => (
              <div key={idx} className="rounded-xl border border-line bg-bg-1/60 p-5 space-y-3.5">
                <div className="font-mono text-[0.74rem] uppercase text-ink tracking-wider font-semibold">
                  {cmp.topic}
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5 text-[0.85rem] text-red-300/80 bg-red-950/20 p-2.5 rounded-lg border border-red-900/30">
                    <span className="text-red-400 font-mono text-xs">✕</span>
                    <span>{cmp.traditional}</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-[0.88rem] text-emerald-300 bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-800/40">
                    <span className="text-emerald-400 font-mono text-xs">✓</span>
                    <span>{cmp.dotfreelancer}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
