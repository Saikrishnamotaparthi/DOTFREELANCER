import { heroPanels, type Panel } from './FloatingPanels';
import { useMediaQuery } from '../hooks/useMediaQuery';

function find(label: string): Panel {
    const p = heroPanels.find((h) => h.label === label);
    if (!p) throw new Error(`Hero panel "${label}" not found`);
    return p;
}

/**
 * Mobile recomposition of FloatingPanels. Desktop scatters five
 * panels at different heights (Dashboard/CRM near the top, Payments/
 * WhatsApp lower, QR scan lowest and centered) — this reproduces that
 * same up/down rhythm per box, not just two evenly-shifted columns.
 * Every offset here is an *additional* top margin on top of normal
 * flow, never a negative one, so however tall any box renders, rows
 * can't collide — there's no absolute positioning or translateY
 * involved, which is what caused the original overlap bugs.
 */
export default function HeroPanelStrip() {
    const isDesktop = useMediaQuery('(min-width: 861px)');
    if (isDesktop) return null;

    return (
        <div className="mt-9 space-y-4">
            <div className="flex items-start gap-3">
                <div className="flex-1">
                    <PanelChip panel={find('Dashboard')} />
                </div>
                <div className="mt-7 flex-1">
                    <PanelChip panel={find('CRM')} />
                </div>
            </div>

            <div className="flex items-start gap-3">
                <div className="mt-5 flex-1">
                    <PanelChip panel={find('Payments')} />
                </div>
                <div className="flex-1">
                    <PanelChip panel={find('WhatsApp automation')} />
                </div>
            </div>

            <div className="flex justify-center">
                <div className="mt-2 w-[55%]">
                    <PanelChip panel={find('QR scan')} />
                </div>
            </div>
        </div>
    );
}

function PanelChip({ panel: p }: { panel: Panel }) {
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