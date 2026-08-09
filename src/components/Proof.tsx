const items = [
  { value: '9+', label: 'Projects shipped' },
  { value: '5+', label: 'Clients' },
  { value: '9', label: 'Connected systems' },
  { value: '1', label: 'Point of contact' },
];

export default function Proof() {
  return (
    <section id="proof" className="border-y border-line py-20">
      <div className="wrap grid grid-cols-2 gap-5 md:grid-cols-4">
        {items.map((it) => (
          <div key={it.label} className="text-center">
            <div className="font-display text-[clamp(1.6rem,3.4vw,2.6rem)] font-semibold">{it.value}</div>
            <div className="mt-2 font-mono text-[0.68rem] uppercase tracking-wide text-ink-faint">
              {it.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
