interface ProjectFlowProps {
  steps: string[];
}

export default function ProjectFlow({ steps }: ProjectFlowProps) {
  return (
    <div className="flow-strip">
      {steps.map((step, i) => (
        <div key={step} className="contents">
          <div
            className="glass flex-none whitespace-nowrap px-4.5 py-3 font-mono text-[0.7rem] tracking-wide text-ink-dim"
            style={i === steps.length - 1 ? { borderColor: 'var(--color-brass)' } : undefined}
          >
            {step}
          </div>
          {i !== steps.length - 1 && <span className="flex-none text-ink-faint">→</span>}
        </div>
      ))}
    </div>
  );
}
