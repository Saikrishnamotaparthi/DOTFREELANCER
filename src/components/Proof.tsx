const items = [
  { value: '12+', label: 'Systems Shipped', tag: '100% SUCCESS RATE' },
  { value: '100k+', label: 'Active Users & Requests Handled', tag: 'HIGH TRAFFIC SCALED' },
  { value: '99.98%', label: 'Platform Availability', tag: 'ZERO DOWNTIME' },
  { value: '1', label: 'Point of Accountability', tag: 'ZERO FRAGMENTATION' },
];

export default function Proof() {
  return (
    <section id="proof" className="border-y border-line py-16 bg-bg-1/40 backdrop-blur-md">
      <div className="wrap grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((it) => (
          <div
            key={it.label}
            className="hud-card p-6 border border-line bg-surface/30 text-center hover:border-cyan/40 transition-colors"
          >
            <div className="font-mono text-[0.6rem] text-cyan uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_6px_#00f2fe]" />
              {it.tag}
            </div>
            <div className="font-display text-[clamp(2.2rem,4vw,3.2rem)] font-bold text-ink drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              {it.value}
            </div>
            <div className="mt-1 font-mono text-[0.72rem] uppercase tracking-wider text-ink-dim">
              {it.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
