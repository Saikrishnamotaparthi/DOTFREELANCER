import { useEffect, useRef, useState } from 'react';
import { ecosystemNodes, type EcoNode } from '../data/ecosystem';
import { useMediaQuery } from '../hooks/useMediaQuery';

interface Positioned extends EcoNode {
  x: number;
  y: number;
  path: string;
}

export default function Ecosystem() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Positioned[]>([]);
  const [active, setActive] = useState<number>(0);
  const [viewBox, setViewBox] = useState('0 0 100 100');
  const isMobile = useMediaQuery('(max-width: 900px)');

  const selectedNode = ecosystemNodes[active] || ecosystemNodes[0];

  useEffect(() => {
    if (isMobile) return;
    const el = stageRef.current;
    if (!el) return;

    const layout = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const cx = w / 2;
      const cy = h / 2;
      
      // Use elliptical radii with generous horizontal and vertical breathing room
      const Rx = Math.min(w * 0.42, 450);
      const Ry = Math.min(h * 0.38, 220);
      
      setViewBox(`0 0 ${w} ${h}`);
      setPositions(
        ecosystemNodes.map((n) => {
          const rad = (n.angle * Math.PI) / 180;
          const x = cx + Rx * Math.cos(rad);
          const y = cy + Ry * Math.sin(rad);
          const mx = cx + (x - cx) * 0.4;
          const my = cy + (y - cy) * 0.4;
          return { ...n, x, y, path: `M${cx},${cy} Q${mx},${my} ${x},${y}` };
        }),
      );
    };

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile]);

  return (
    <section id="ecosystem" className="py-20 md:py-36 relative overflow-hidden">
      <div className="wrap">
        <div className="pb-10 md:pb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="eyebrow mb-3">Connected Architecture</div>
            <h2 className="font-display max-w-[16ch] text-[clamp(2.2rem,5.5vw,4.2rem)] font-bold leading-[0.98]">
              A unified digital ecosystem — not fragmented tools.
            </h2>
          </div>
          <p className="max-w-[42ch] text-[0.92rem] text-ink-dim leading-relaxed">
            Every layer communicates natively without broken third-party glue. Tap any node to inspect telemetry.
          </p>
        </div>

        {/* Desktop Interactive Radial Graph */}
        {!isMobile ? (
          <div className="space-y-6">
            <div
              ref={stageRef}
              className="relative flex h-[620px] items-center justify-center rounded-3xl border border-cyan/15 bg-bg-1/60 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_0_80px_rgba(0,242,254,0.02)]"
            >
              {/* SVG Connectors */}
              <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={viewBox}>
                <defs>
                  <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                {positions.map((p, i) => (
                  <path
                    key={p.id}
                    d={p.path}
                    fill="none"
                    strokeWidth={active === i ? 2.5 : 1}
                    stroke={active === i ? 'url(#laserGrad)' : 'rgba(255,255,255,0.07)'}
                    opacity={active === i ? 1 : 0.4}
                    className="transition-all duration-300"
                  />
                ))}
              </svg>

              {/* Central Core */}
              <div className="absolute z-[4] flex h-[150px] w-[150px] flex-col items-center justify-center rounded-full border border-cyan/40 bg-bg-0/95 text-center shadow-[0_0_40px_rgba(0,242,254,0.25),inset_0_0_20px_rgba(0,242,254,0.15)]">
                <span className="relative flex h-2 w-2 mb-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
                </span>
                <span className="font-display text-[0.82rem] font-bold tracking-wider text-ink">
                  DOTFREELANCER
                </span>
                <span className="font-mono text-[0.6rem] text-cyan uppercase tracking-widest mt-0.5">
                  CORE ENGINE
                </span>
              </div>

              {/* Radial Nodes with balanced spacing */}
              {positions.map((p, i) => (
                <button
                  key={p.id}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  data-cursor="hover"
                  className={`absolute z-[3] -translate-x-1/2 -translate-y-1/2 rounded-xl border px-3.5 py-2 font-mono text-[0.72rem] tracking-wide transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                    active === i
                      ? 'border-cyan bg-cyan/20 text-ink shadow-[0_0_25px_rgba(0,242,254,0.4)] scale-105'
                      : 'border-line bg-surface/80 text-ink-dim hover:border-line-strong hover:text-ink'
                  }`}
                  style={{
                    left: p.x,
                    top: p.y,
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${active === i ? 'bg-cyan shadow-[0_0_6px_#00f2fe]' : 'bg-ink-faint'}`} />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>

            {/* Selected Node Detailed Telemetry Inspector */}
            <div className="rounded-2xl border border-cyan/25 bg-bg-1/90 backdrop-blur-2xl p-6 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-line">
                <div className="flex items-center gap-3">
                  <span className="cyber-badge">{selectedNode.category}</span>
                  <h3 className="font-display text-xl font-bold text-ink">{selectedNode.label}</h3>
                </div>
                <div className="font-mono text-[0.72rem] text-emerald-400 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  PROTOCOL: <span className="text-ink">{selectedNode.protocol}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_1.4fr] gap-6 mt-4 items-center">
                <div>
                  <div className="font-mono text-[0.66rem] text-ink-faint uppercase mb-1">TECH ARCHITECTURE</div>
                  <div className="font-mono text-[0.84rem] text-cyan font-medium">{selectedNode.tech}</div>
                </div>
                <div>
                  <div className="font-mono text-[0.66rem] text-ink-faint uppercase mb-1">BUSINESS IMPACT</div>
                  <p className="text-[0.9rem] text-ink-dim leading-relaxed">{selectedNode.details}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Mobile Streamlined Interactive Node Ribbon & Inspector */
          <div className="space-y-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {ecosystemNodes.map((n, i) => (
                <button
                  key={n.id}
                  onClick={() => setActive(i)}
                  className={`flex-none px-3.5 py-2 rounded-xl font-mono text-[0.72rem] transition-all whitespace-nowrap flex items-center gap-2 ${
                    active === i
                      ? 'border border-cyan bg-cyan/20 text-cyan shadow-[0_0_12px_rgba(0,242,254,0.25)] font-semibold'
                      : 'border border-line bg-surface/50 text-ink-dim'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${active === i ? 'bg-cyan' : 'bg-ink-faint'}`} />
                  <span>{n.label}</span>
                </button>
              ))}
            </div>

            {/* Compact Mobile Inspector Card */}
            <div className="rounded-2xl border border-cyan/30 bg-bg-1/95 p-5 shadow-[0_10px_30px_rgba(0,0,0,0.7)]">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="cyber-badge text-[0.6rem]">{selectedNode.category}</span>
                <span className="font-mono text-[0.64rem] text-emerald-400">● LIVE</span>
              </div>
              <h4 className="font-display text-lg font-bold text-ink">{selectedNode.label}</h4>
              <p className="mt-2 text-[0.86rem] text-ink-dim leading-relaxed">{selectedNode.details}</p>
              <div className="mt-4 pt-3 border-t border-line font-mono text-[0.68rem] text-cyan">
                STACK: <span className="text-ink">{selectedNode.tech}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
