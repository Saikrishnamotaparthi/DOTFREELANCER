import { useRef } from 'react';
import Glass from './Glass';
import { useMouseParallax } from '../hooks/useMouseParallax';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useReducedMotion } from '../hooks/useReducedMotion';

export interface Panel {
  label: string;
  tag: string;
  status: string;
  depth: number;
  metric: string;
  metricLabel: string;
  bars: { width: string; accent?: boolean }[];
  style: React.CSSProperties;
}

export const heroPanels: Panel[] = [
  {
    label: 'Realtime Architecture',
    tag: 'NODE // 01',
    status: 'OPTIMAL',
    depth: 0.4,
    metric: '14ms',
    metricLabel: 'EDGE LATENCY',
    bars: [{ width: '85%', accent: true }, { width: '60%' }, { width: '75%' }],
    style: { top: '18%', left: '5%', width: 210 },
  },
  {
    label: 'Payment Mesh',
    tag: 'RAZORPAY + STRIPE',
    status: 'SECURE',
    depth: 0.7,
    metric: '₹42.8L',
    metricLabel: 'PROCESSED',
    bars: [{ width: '45%' }, { width: '80%', accent: true }],
    style: { top: '62%', left: '7%', width: 180 },
  },
  {
    label: 'AI Automation Engine',
    tag: 'n8n + LLM AGENTS',
    status: 'RUNNING',
    depth: 0.5,
    metric: '98.4%',
    metricLabel: 'TASKS AUTOMATED',
    bars: [{ width: '90%' }, { width: '40%' }, { width: '70%', accent: true }],
    style: { top: '15%', right: '5%', width: 210 },
  },
  {
    label: 'WhatsApp API Gateway',
    tag: 'INSTANT WEBHOOKS',
    status: 'LIVE',
    depth: 0.85,
    metric: '0.4s',
    metricLabel: 'SYNC TIME',
    bars: [{ width: '55%' }, { width: '95%', accent: true }],
    style: { top: '58%', right: '4%', width: 200 },
  },
];

export default function FloatingPanels() {
  const stageRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 960px)');
  const reduced = useReducedMotion();
  useMouseParallax(stageRef, isDesktop && !reduced);

  if (!isDesktop) return null;

  return (
    <div ref={stageRef} className="absolute inset-0 pointer-events-none" id="hero-stage">
      {heroPanels.map((p) => (
        <Glass
          key={p.label}
          data-depth={p.depth}
          data-hero-panel
          className="absolute p-4 border border-cyan/15 bg-bg-1/80 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_15px_rgba(0,242,254,0.05)] hover:border-cyan/40 transition-colors"
          style={p.style}
        >
          <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-line">
            <span className="font-mono text-[0.6rem] text-cyan uppercase tracking-wider">{p.tag}</span>
            <span className="flex items-center gap-1 font-mono text-[0.58rem] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {p.status}
            </span>
          </div>

          <div className="font-display text-[0.78rem] font-semibold text-ink mb-2">
            {p.label}
          </div>

          <div className="flex items-baseline justify-between mb-2">
            <span className="font-mono text-[0.58rem] text-ink-faint uppercase">{p.metricLabel}</span>
            <span className="font-mono text-[0.88rem] font-semibold text-cyan">{p.metric}</span>
          </div>

          <div className="flex flex-col gap-1.5 pt-1">
            {p.bars.map((b, i) => (
              <span
                key={i}
                className={`block h-1 rounded-full ${
                  b.accent ? 'bg-gradient-to-r from-cyan to-signal shadow-[0_0_8px_rgba(0,242,254,0.4)]' : 'bg-white/10'
                }`}
                style={{ width: b.width }}
              />
            ))}
          </div>
        </Glass>
      ))}
    </div>
  );
}