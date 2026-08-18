import { useRef, useState, type MouseEvent } from 'react';
import { projects, clients, type Project, type Client } from '../data/projects';
import ProjectFlow from './ProjectFlow';
import InterfaceDeck from './InterfaceDeck';
import { projectMocks } from './ProjectMocks';
import Glass from './Glass';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

function ProjectBlock({ project }: { project: Project }) {
  const blockRef = useRef<HTMLDivElement>(null);
  const [deviceMode, setDeviceMode] = useState<'laptop' | 'tablet' | 'mobile'>('laptop');
  const clickable = Boolean(project.url);
  const isInternal = clickable && project.url!.startsWith('/');

  useScrollAnimation(blockRef, ({ gsap }) => {
    gsap.from(blockRef.current, {
      opacity: 0,
      y: 40,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: { trigger: blockRef.current, start: 'top 85%' },
    });
  });

  const panels = projectMocks[project.id]?.() ?? [];

  function handleCardClick(e: MouseEvent<HTMLDivElement>) {
    if (!clickable) return;
    if ((e.target as HTMLElement).closest('a, button, input, select')) return;
    if (isInternal) {
      window.location.href = project.url!;
    } else {
      window.open(project.url, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <div
      ref={blockRef}
      onClick={handleCardClick}
      data-cursor={clickable ? 'project' : undefined}
      className="project-block group border-t border-line py-20 transition-all duration-400"
    >
      {/* Project Header */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="cyber-badge text-[0.62rem]">{project.category || 'DEPLOYED SYSTEM'}</span>
            {project.flagship && <span className="cyber-badge-brass text-[0.62rem]">★ FLAGSHIP CASE STUDY</span>}
          </div>
          <h3 className="font-display text-[clamp(2rem,4.5vw,3.5rem)] font-bold text-ink group-hover:text-cyan transition-colors">
            {project.title}
          </h3>

          {project.technologies && (
            <div className="mt-3 flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-line bg-surface/40 px-2.5 py-1 font-mono text-[0.68rem] text-ink-dim"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {project.meta.map((m) => (
            <div key={m.label} className="font-mono text-[0.68rem] uppercase tracking-wide text-ink-faint">
              {m.label}
              <b className="mt-1 block font-sans text-[0.82rem] font-medium text-ink">
                {m.value}
              </b>
            </div>
          ))}

          {clickable && (
            <a
              href={project.url}
              aria-label={`View ${project.title}`}
              {...(!isInternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="inline-flex items-center gap-2 rounded-xl border border-cyan/40 bg-cyan/10 px-4.5 py-2.5 font-mono text-[0.72rem] uppercase tracking-wider text-cyan transition-all duration-300 hover:bg-cyan hover:text-bg-0 hover:shadow-[0_0_20px_rgba(0,242,254,0.35)]"
            >
              <span>{project.flagship ? 'Launch Platform' : 'Live Preview'}</span>
              <span>→</span>
            </a>
          )}
        </div>
      </div>

      {/* Cyber Frame Container with Responsive Device Switcher */}
      <Glass
        variant={project.flagship ? 'smoked' : 'default'}
        className="mockframe relative flex flex-col gap-4 overflow-hidden p-5 sm:p-7 border border-cyan/20 bg-bg-1/90 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(0,242,254,0.04)]"
      >
        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-line">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-500/80" />
            <span className="h-2 w-2 rounded-full bg-yellow-500/80" />
            <span className="h-2 w-2 rounded-full bg-green-500/80" />
            <span className="ml-2 font-mono text-[0.66rem] text-ink-faint uppercase">
              PREVIEW // {project.id}.prod
            </span>
          </div>

          {/* Device Switcher (Desktop & Tablet) */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-line bg-surface/50 p-1">
            <button
              onClick={() => setDeviceMode('laptop')}
              className={`px-2.5 py-1 rounded font-mono text-[0.62rem] uppercase transition-colors ${
                deviceMode === 'laptop' ? 'bg-cyan text-bg-0 font-bold' : 'text-ink-faint hover:text-ink'
              }`}
            >
              💻 Laptop
            </button>
            <button
              onClick={() => setDeviceMode('tablet')}
              className={`px-2.5 py-1 rounded font-mono text-[0.62rem] uppercase transition-colors ${
                deviceMode === 'tablet' ? 'bg-cyan text-bg-0 font-bold' : 'text-ink-faint hover:text-ink'
              }`}
            >
              📟 Tablet
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`px-2.5 py-1 rounded font-mono text-[0.62rem] uppercase transition-colors ${
                deviceMode === 'mobile' ? 'bg-cyan text-bg-0 font-bold' : 'text-ink-faint hover:text-ink'
              }`}
            >
              📱 Mobile
            </button>
          </div>
        </div>

        {/* Operational Flow Strip */}
        {project.flow && (
          <div className="pt-1">
            <div className="font-mono text-[0.64rem] text-cyan uppercase tracking-widest mb-1.5">
              OPERATIONAL WORKFLOW PIPELINE //
            </div>
            <ProjectFlow steps={project.flow} />
          </div>
        )}

        {/* Mockup Deck centered with Device Aspect Ratio Frame */}
        <div
          className={`mx-auto w-full transition-all duration-400 ${
            deviceMode === 'mobile'
              ? 'max-w-[420px] rounded-3xl border-2 border-line-strong p-3 bg-bg-0'
              : deviceMode === 'tablet'
              ? 'max-w-[700px] rounded-2xl border border-line-strong p-4 bg-bg-0'
              : 'max-w-full'
          }`}
        >
          {panels.length > 0 && <InterfaceDeck className="min-h-[220px] flex-1">{panels}</InterfaceDeck>}
        </div>

        {project.note && (
          <div className="mt-2 font-mono text-[0.68rem] text-ink-faint flex items-center gap-2">
            <span className="text-cyan">↳</span>
            <span>{project.note}</span>
          </div>
        )}
      </Glass>
    </div>
  );
}

function LogoMarquee({ items }: { items: Client[] }) {
  const track = [...items, ...items, ...items, ...items];
  const duration = Math.max(14, items.length * 5);

  return (
    <div className="marquee-mask relative -mx-1 overflow-hidden px-1">
      <div
        className="marquee-track flex w-max items-center"
        style={{ animationDuration: `${duration}s` }}
      >
        {track.map((c, i) => (
          <div
            key={`${c.name}-${i}`}
            title={c.name}
            className="hud-card mr-5 flex h-24 w-44 flex-none items-center justify-center rounded-2xl p-6 sm:h-28 sm:w-52"
          >
            {c.logo ? (
              <img
                src={c.logo}
                alt={c.name}
                className="max-h-12 max-w-full object-contain opacity-80 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
              />
            ) : (
              <span className="font-display text-[0.78rem] font-semibold text-ink-faint">
                {c.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProjectShowcase() {
  return (
    <section id="projects" className="pt-20 md:pt-32 pb-12 md:pb-16">
      <div className="wrap">
        <div className="pb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="eyebrow mb-4">Production Portfolio</div>
            <h2 className="font-display max-w-[16ch] text-[clamp(2.2rem,6vw,4.4rem)] font-bold leading-[0.98]">
              Live production platforms, not Figma concepts.
            </h2>
          </div>
          <p className="max-w-[42ch] text-[0.95rem] text-ink-dim leading-relaxed">
            Every project below is an active system handling real visitors, orders, QR tickets, and business data.
          </p>
        </div>

        {projects.map((p) => (
          <ProjectBlock key={p.id} project={p} />
        ))}

        <div className="border-t border-line pb-4 pt-14 sm:pt-16">
          <div className="eyebrow mb-2">Trusted Partnerships</div>
          <h3 className="font-display mb-6 text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold">
            Powering real businesses &amp; institutions.
          </h3>
          <LogoMarquee items={clients} />
        </div>
      </div>
    </section>
  );
}