import { heroPanels } from './FloatingPanels';
import { useMediaQuery } from '../hooks/useMediaQuery';

/**
 * Mobile recomposition of FloatingPanels: same five "system" chips
 * (Dashboard, Payments, CRM, WhatsApp automation, QR scan), staggered
 * across two columns — one column offset lower than the other — so
 * it reads as scattered "here and there" like the desktop floating
 * layout, rather than a flat single row. Both columns are independent
 * in-flow vertical stacks (no absolute positioning, no translateY
 * tricks), so there's no risk of the overlap bugs the original
 * absolutely-positioned layout had on narrow screens.
 */
export default function HeroPanelStrip() {
    const isDesktop = useMediaQuery('(min-width: 861px)');
    if (isDesktop) return null;

    const left = heroPanels.filter((_, i) => i % 2 === 0);
    const right = heroPanels.filter((_, i) => i % 2 === 1);

    return (
        <div className="mt-9 flex gap-3">
            <div className="flex flex-1 flex-col gap-3">
                {left.map((p) => (
                    <PanelChip key={p.label} panel={p} />
                ))}
            </div>
            <div className="mt-8 flex flex-1 flex-col gap-3">
                {right.map((p) => (
                    <PanelChip key={p.label} panel={p} />
                ))}
            </div>
        </div>
    );
}

function PanelChip({ panel: p }: { panel: (typeof heroPanels)[number] }) {
    return (
        <div
            className={`glass p-3.5 ${p.variant === 'smoked' ? 'glass-smoked' : p.variant === 'clear' ? 'glass-clear' : ''
                }`}
        >
            <div className="mb-2 truncate font-mono text-[0.62rem] uppercase tracking-wide text-ink-faint">
                {p.label}
            </div>
            <div className="flex flex-col gap-1.5">
                {p.bars.map((b, i) => (
                    <span
                        key={i}
                        className={`block h-1.5 rounded-full ${b.accent ? 'bg-brass/35' : 'bg-white/8'}`}
                        style={{ width: b.width }}
                    />
                ))}
            </div>
        </div>
    );
}