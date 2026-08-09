import { useEffect, useRef, useState } from 'react';
import { ecosystemNodes } from '../data/ecosystem';
import { useMediaQuery } from '../hooks/useMediaQuery';
import Glass from './Glass';

interface Positioned {
  label: string;
  x: number;
  y: number;
  path: string;
}

export default function Ecosystem() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [positions, setPositions] = useState<Positioned[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const [viewBox, setViewBox] = useState('0 0 100 100');
  const isMobile = useMediaQuery('(max-width: 700px)');

  useEffect(() => {
    if (isMobile) return; // recomposed as a list below instead
    const el = stageRef.current;
    if (!el) return;

    const layout = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const cx = w / 2;
      const cy = h / 2;
      const R = Math.min(w, h) / 2 - 70;
      setViewBox(`0 0 ${w} ${h}`);
      setPositions(
        ecosystemNodes.map((n) => {
          const rad = (n.angle * Math.PI) / 180;
          const x = cx + R * Math.cos(rad);
          const y = cy + R * Math.sin(rad);
          const mx = cx + (x - cx) * 0.5;
          const my = cy + (y - cy) * 0.5;
          return { label: n.label, x, y, path: `M${cx},${cy} Q${mx},${my} ${x},${y}` };
        }),
      );
    };

    layout();
    const ro = new ResizeObserver(layout);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile]);

  if (isMobile) {
    // Mobile: recompose the radial diagram as a connected list rather
    // than shrinking a diagram that depends on spatial arrangement.
    return (
      <section id="ecosystem" className="pb-40">
        <div className="wrap">
          <SectionHead />
          <Glass variant="smoked" className="p-2">
            {ecosystemNodes.map((n, i) => (
              <div
                key={n.label}
                className={`flex items-center gap-3 px-4 py-3.5 font-mono text-[0.82rem] text-ink-dim ${
                  i !== ecosystemNodes.length - 1 ? 'border-b border-line' : ''
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                {n.label}
              </div>
            ))}
          </Glass>
        </div>
      </section>
    );
  }

  return (
    <section id="ecosystem" className="pb-40">
      <div className="wrap">
        <SectionHead />
        <div
          ref={stageRef}
          className="relative flex h-[640px] items-center justify-center"
          onMouseLeave={() => setActive(null)}
        >
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={viewBox}>
            {positions.map((p, i) => (
              <path
                key={p.label}
                d={p.path}
                fill="none"
                strokeWidth={active === i ? 1.4 : 1}
                stroke={active === i ? 'var(--color-brass)' : 'var(--color-line-strong)'}
                opacity={active !== null && active !== i ? 0.25 : 1}
                style={{ transition: 'stroke .3s ease, stroke-width .3s ease, opacity .3s ease' }}
              />
            ))}
          </svg>

          <Glass className="absolute z-[4] flex h-[150px] w-[150px] items-center justify-center !rounded-full text-center">
            <span className="font-display text-[0.86rem] font-semibold tracking-wide">
              DOT
              <br />
              FREELANCER
            </span>
          </Glass>

          {positions.map((p, i) => (
            <button
              key={p.label}
              data-cursor="hover"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="absolute z-[3] -translate-x-1/2 -translate-y-1/2 rounded-full border px-4 py-2.5 font-mono text-[0.74rem] tracking-wide transition-all duration-300"
              style={{
                left: p.x,
                top: p.y,
                borderColor: active === i ? 'var(--color-brass)' : 'var(--color-line)',
                color: active === i ? 'var(--color-ink)' : 'var(--color-ink-dim)',
                opacity: active !== null && active !== i ? 0.3 : 1,
                background:
                  'linear-gradient(160deg, rgba(255,255,255,.06), rgba(255,255,255,.015))',
                backdropFilter: 'blur(18px) saturate(140%)',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHead() {
  return (
    <div className="pt-0 pb-15">
      <div className="eyebrow mb-4.5">What I build</div>
      <h2 className="font-display max-w-[16ch] text-[clamp(2.2rem,6vw,4.4rem)] font-semibold leading-[0.98]">
        A single connected system — not nine separate hires.
      </h2>
    </div>
  );
}
