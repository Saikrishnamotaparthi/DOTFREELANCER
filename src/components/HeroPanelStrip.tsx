import { heroPanels } from './FloatingPanels';
import { useMediaQuery } from '../hooks/useMediaQuery';

/**
 * Mobile recomposition of FloatingPanels: same five "system" chips
 * (Dashboard, Payments, CRM, WhatsApp automation, QR scan), but laid
 * out as a normal in-flow, horizontally scrollable strip rather than
 * absolutely positioned over the headline. That absolute layout is
 * what caused panels to overlap the text and each other on narrow
 * screens — this sidesteps the problem entirely by never taking
 * elements out of flow in the first place.
 */
export default function HeroPanelStrip() {
    const isDesktop = useMediaQuery('(min-width: 861px)');
    if (isDesktop) return null;

    return (
        <div className="mt-9 -mx-6 flex gap-3 overflow-x-auto px-6 pb-1" style={{ scrollbarWidth: 'none' }}>
            {heroPanels.map((p) => (
                <div
                    key={p.label}
                    className={`glass flex-none w-[150px] flex-shrink-0 p-3.5 ${p.variant === 'smoked' ? 'glass-smoked' : p.variant === 'clear' ? 'glass-clear' : ''
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
            ))}
        </div>
    );
}