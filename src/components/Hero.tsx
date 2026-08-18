import { useRef, useState } from 'react';
import FloatingPanels from './FloatingPanels';
import HeroPanelStrip from './HeroPanelStrip';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface HeroProps {
  introReady: boolean;
}

const systemModes = [
  {
    id: 'saas',
    name: 'SaaS Platform',
    icon: '⚡',
    badge: 'FULL STACK',
    speed: '12ms',
    throughput: '4.8k req/s',
    tech: ['React 19', 'Node.js', 'PostgreSQL', 'Razorpay', 'Redis'],
    summary: 'Single-architecture frontend, backend, payments, and multi-tenant database.',
  },
  {
    id: 'ai-automation',
    name: 'AI & n8n Agent',
    icon: '🤖',
    badge: 'AUTONOMOUS',
    speed: '0.6s',
    throughput: '120 workflows/m',
    tech: ['n8n Engine', 'OpenAI / Gemini', 'WhatsApp API', 'CRM Webhooks'],
    summary: 'Automated lead triage, AI chatbots, invoice parsing, and WhatsApp notification loops.',
  },
  {
    id: 'enterprise',
    name: 'Custom ERP & Operations',
    icon: '🛡️',
    badge: 'ENTERPRISE',
    speed: '99.99%',
    throughput: '100% Audit Log',
    tech: ['Role Auth', 'Admin Portal', 'QR Scanner', 'Realtime Sync'],
    summary: 'Tailor-made internal business tooling that replaces 6 fragmented software subscriptions.',
  },
];

export default function Hero({ introReady }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeMode, setActiveMode] = useState(0);
  const [isScanning, setIsScanning] = useState(false);
  const reduced = useReducedMotion();

  const currentMode = systemModes[activeMode];

  function triggerScan() {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 1200);
  }

  // Intro reveal, gated on the loader finishing.
  useScrollAnimation(
    sectionRef,
    ({ gsap }) => {
      if (!introReady || reduced) return;
      const tl = gsap.timeline({ delay: 0.05 });
      tl.from('.hero-copy > *', {
        y: 26,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
      }).from(
        '[data-hero-panel]',
        { y: 35, opacity: 0, duration: 1, stagger: 0.06, ease: 'power3.out' },
        '-=0.6',
      );
    },
    [introReady, reduced],
  );

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden pt-28 pb-20 md:py-32"
    >
      {/* Background cyber glow spheres */}
      <div
        className="cyber-glow-sphere -top-[10%] left-1/2 h-[600px] w-[600px] -translate-x-1/2"
        style={{ background: 'radial-gradient(circle, rgba(0,242,254,0.18), transparent 70%)' }}
      />
      <div
        className="cyber-glow-sphere top-[40%] right-[10%] h-[450px] w-[450px]"
        style={{ background: 'radial-gradient(circle, rgba(226,177,112,0.12), transparent 70%)' }}
      />

      <FloatingPanels />

      <div className="wrap hero-copy relative z-[3]">
        {/* Eyebrow badge */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="cyber-badge">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
            <span>DOTFREELANCER // SAI KRISHNA MOTAPARTHI</span>
          </div>
          <div className="hidden sm:inline-flex cyber-badge-emerald">
            <span>READY FOR NEW PROJECTS · 2026</span>
          </div>
        </div>

        {/* Headline */}
        <h1 className="font-display max-w-[18ch] text-[clamp(2.5rem,7.5vw,5.8rem)] font-bold leading-[0.98] tracking-tight">
          Architecting software <br />
          that <span className="bg-gradient-to-r from-cyan via-signal to-brass bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,242,254,0.3)]">powers</span> high-growth businesses.
        </h1>

        <p className="mt-6 max-w-[54ch] text-[1.02rem] sm:text-[1.12rem] leading-relaxed text-ink-dim">
          One dedicated partner building your web application, cloud infrastructure, payments, AI agents, and workflow automations — with zero team fragmentation.
        </p>

        {/* Action CTAs */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href="#contact"
            data-cursor="project"
            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-cyan to-signal px-7 py-4 font-mono text-[0.84rem] font-semibold uppercase tracking-wider text-bg-0 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,242,254,0.5)] hover:scale-[1.02]"
          >
            <span>Launch Your Project</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            <div className="scanline" />
          </a>
          <a
            href="#projects"
            data-cursor="hover"
            className="inline-flex items-center gap-2.5 rounded-xl border border-line-strong bg-surface/50 backdrop-blur-md px-6 py-4 font-mono text-[0.84rem] tracking-wider text-ink transition-all duration-300 hover:border-cyan/50 hover:bg-surface hover:text-cyan hover:-translate-y-0.5"
          >
            <span>Explore Deployed Systems</span>
            <span className="text-xs text-ink-faint">↓</span>
          </a>
        </div>

        {/* Customer Interactive System Simulator */}
        <div className="mt-14 max-w-[880px] rounded-2xl border border-cyan/20 bg-bg-1/90 backdrop-blur-2xl p-5 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(0,242,254,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-line">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/80 inline-block" />
              <span className="ml-2 font-mono text-[0.72rem] text-ink-dim tracking-wider uppercase">
                INTERACTIVE ARCHITECTURE SIMULATOR
              </span>
            </div>

            <button
              onClick={triggerScan}
              className="flex items-center gap-2 rounded-lg border border-cyan/30 bg-cyan/10 px-3 py-1.5 font-mono text-[0.68rem] text-cyan hover:bg-cyan hover:text-bg-0 transition-colors"
            >
              <span className={`h-1.5 w-1.5 rounded-full bg-cyan ${isScanning ? 'animate-ping' : ''}`} />
              <span>{isScanning ? 'DIAGNOSING…' : 'RUN DIAGNOSTIC'}</span>
            </button>
          </div>

          {/* Interactive Mode Tabs */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {systemModes.map((mode, i) => (
              <button
                key={mode.id}
                onClick={() => setActiveMode(i)}
                data-cursor="hover"
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all duration-300 ${
                  activeMode === i
                    ? 'border-cyan bg-cyan/10 shadow-[0_0_15px_rgba(0,242,254,0.15)] text-ink'
                    : 'border-line bg-surface/30 hover:border-line-strong text-ink-dim'
                }`}
              >
                <span className="text-lg">{mode.icon}</span>
                <div>
                  <div className="font-display text-[0.82rem] font-semibold">{mode.name}</div>
                  <div className="font-mono text-[0.62rem] text-ink-faint uppercase">{mode.badge}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Active Mode Architecture Specs */}
          <div className="mt-5 rounded-xl border border-line bg-surface/40 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="font-mono text-[0.68rem] text-cyan uppercase tracking-wider">
                  SYSTEM OVERVIEW //
                </span>
                <p className="mt-1 text-[0.92rem] text-ink font-medium">{currentMode.summary}</p>
              </div>
              <div className="flex items-center gap-6 font-mono">
                <div>
                  <div className="text-[0.6rem] uppercase text-ink-faint">RESPONSE TIME</div>
                  <div className="text-[1.1rem] font-semibold text-emerald-400">{currentMode.speed}</div>
                </div>
                <div>
                  <div className="text-[0.6rem] uppercase text-ink-faint">SYSTEM CAPACITY</div>
                  <div className="text-[1.1rem] font-semibold text-cyan">{currentMode.throughput}</div>
                </div>
              </div>
            </div>

            {/* Tech chips */}
            <div className="mt-4 pt-4 border-t border-line flex flex-wrap items-center gap-2">
              <span className="font-mono text-[0.64rem] text-ink-faint uppercase mr-1">DEPLOYED TECH:</span>
              {currentMode.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-line-strong bg-white/5 px-2.5 py-1 font-mono text-[0.68rem] text-ink-dim"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        <HeroPanelStrip />
      </div>

      {/* Futuristic Scroll prompt */}
      <div className="hidden lg:flex absolute bottom-8 left-8 xl:left-16 items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.2em] text-ink-faint">
        <span className="relative h-12 w-[1.5px] overflow-hidden bg-line">
          <span className="absolute left-0 top-[-100%] h-full w-full animate-[wire-run_2s_cubic-bezier(.65,0,.35,1)_infinite] bg-cyan shadow-[0_0_8px_#00f2fe]" />
        </span>
        <span>SCROLL TO EXPLORE</span>
      </div>
    </section>
  );
}