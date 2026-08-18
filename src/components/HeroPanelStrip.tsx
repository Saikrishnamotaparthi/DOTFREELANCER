import { heroPanels, type Panel } from './FloatingPanels';
import { useMediaQuery } from '../hooks/useMediaQuery';

function find(label: string): Panel {
  const p = heroPanels.find((h) => h.label === label);
  if (!p) return heroPanels[0];
  return p;
}

export default function HeroPanelStrip() {
  const isDesktop = useMediaQuery('(min-width: 960px)');
  if (isDesktop) return null;

  return (
    <div className="mt-8 grid grid-cols-2 gap-3 w-full">
      <PanelChip panel={find('Realtime Architecture')} />
      <PanelChip panel={find('Payment Mesh')} />
    </div>
  );
}

function PanelChip({ panel: p }: { panel: Panel }) {
  return (
    <div className="rounded-xl border border-cyan/15 bg-bg-1/80 backdrop-blur-md p-3">
      <div className="flex items-center justify-between gap-1 mb-1 pb-1 border-b border-line">
        <span className="font-mono text-[0.55rem] text-cyan uppercase">{p.tag}</span>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
      </div>

      <div className="font-display text-[0.76rem] font-semibold text-ink truncate mb-1">
        {p.label}
      </div>

      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[0.52rem] text-ink-faint uppercase">{p.metricLabel}</span>
        <span className="font-mono text-[0.78rem] font-bold text-cyan">{p.metric}</span>
      </div>
    </div>
  );
}