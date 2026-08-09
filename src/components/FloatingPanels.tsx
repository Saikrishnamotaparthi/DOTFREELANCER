import { useRef } from 'react';
import Glass from './Glass';
import { useMouseParallax } from '../hooks/useMouseParallax';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Panel {
  label: string;
  variant: 'default' | 'smoked' | 'clear';
  depth: number;
  bars: { width: string; accent?: boolean }[];
  style: React.CSSProperties;
}

const panels: Panel[] = [
  {
    label: 'Dashboard',
    variant: 'default',
    depth: 0.4,
    bars: [{ width: '80%' }, { width: '55%' }, { width: '65%', accent: true }],
    style: { top: '16%', left: '6%', width: 190 },
  },
  {
    label: 'Payments',
    variant: 'smoked',
    depth: 0.7,
    bars: [{ width: '40%' }, { width: '70%' }],
    style: { top: '60%', left: '9%', width: 150 },
  },
  {
    label: 'CRM',
    variant: 'default',
    depth: 0.5,
    bars: [{ width: '80%' }, { width: '35%' }, { width: '60%' }],
    style: { top: '12%', right: '7%', width: 170 },
  },
  {
    label: 'WhatsApp automation',
    variant: 'clear',
    depth: 0.85,
    bars: [{ width: '50%' }, { width: '80%' }],
    style: { top: '56%', right: '5%', width: 190 },
  },
  {
    label: 'QR scan',
    variant: 'smoked',
    depth: 0.3,
    bars: [{ width: '90%' }],
    style: { bottom: '6%', left: '30%', width: 140 },
  },
];

export default function FloatingPanels() {
  const stageRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery('(min-width: 861px)');
  const reduced = useReducedMotion();
  useMouseParallax(stageRef, isDesktop && !reduced);

  return (
    <div ref={stageRef} className="absolute inset-0 pointer-events-none" id="hero-stage">
      {panels.map((p) => (
        <Glass
          key={p.label}
          variant={p.variant}
          data-depth={p.depth}
          data-hero-panel
          className="absolute p-3.5"
          style={p.style}
        >
          <div className="mb-2 font-mono text-[0.64rem] uppercase tracking-wide text-ink-faint">
            {p.label}
          </div>
          <div className="flex flex-col gap-1.5">
            {p.bars.map((b, i) => (
              <span
                key={i}
                className={`block h-1.5 rounded-full ${
                  b.accent ? 'bg-brass/35' : 'bg-white/8'
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
