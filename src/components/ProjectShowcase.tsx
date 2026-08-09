import { useRef, type MouseEvent } from 'react';
import { projects, clients } from '../data/projects';
import type { Project, Client } from '../data/projects';
import ProjectFlow from './ProjectFlow';
import InterfaceDeck from './InterfaceDeck';
import { projectMocks } from './ProjectMocks';
import Glass from './Glass';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

function ProjectBlock({ project }: { project: Project }) {
  const blockRef = useRef<HTMLDivElement>(null);
  const clickable = Boolean(project.url);
  const isInternal = clickable && project.url!.startsWith('/');

  useScrollAnimation(blockRef, ({ gsap }) => {
    gsap.from(blockRef.current, {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: blockRef.current, start: 'top 85%' },
    });

    const frame = blockRef.current?.querySelector('.mockframe');
    if (frame) {
      gsap.from(frame, {
        scale: 0.96,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: frame, start: 'top 88%' },
      });
    }
  });

  const panels = projectMocks[project.id]?.() ?? [];

  // The whole block is clickable, but the visible CTA link is a real
  // <a> of its own, so clicks landing on it just use native anchor
  // behavior, and this handler steps aside rather than double-firing.
  function handleCardClick(e: MouseEvent<HTMLDivElement>) {
    if (!clickable) return;
    if ((e.target as HTMLElement).closest('a, button')) return;
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
      className={`project-block group border-t border-line py-22.5 transition-transform duration-500 ease-out ${clickable ? 'cursor-pointer hover:-translate-y-1' : ''
        }`}
    >
      <div className="mb-11 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h3 className="font-display text-[clamp(1.9rem,4.6vw,3.4rem)] font-semibold">{project.title}</h3>
          {project.technologies && (
            <div className="mt-3 flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.62rem] text-ink-faint"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-6.5">
          {project.meta.map((m) => (
            <div key={m.label} className="font-mono text-[0.68rem] uppercase tracking-wide text-ink-faint">
              {m.label}
              <b className="mt-1 block font-sans text-[0.78rem] font-normal normal-case tracking-normal text-ink-dim">
                {m.value}
              </b>
            </div>
          ))}

          {clickable && (
            <a
              href={project.url}
              aria-label={`View ${project.title}`}
              {...(!isInternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4.5 py-2.5 font-mono text-[0.72rem] uppercase tracking-wide text-ink transition-colors duration-300 hover:border-brass hover:text-brass"
            >
              {project.flagship ? 'View the work' : 'View the demo'} →
            </a>
          )}
        </div>
      </div>

      <Glass
        variant={project.flagship ? 'smoked' : 'default'}
        className="mockframe relative flex min-h-[340px] flex-col gap-4 overflow-hidden p-6.5 transition-transform duration-500 ease-out group-hover:scale-[1.015]"
      >
        <div className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
          <span className="h-2 w-2 rounded-full bg-line-strong" />
        </div>

        {project.flow && (
          <>
            <div className="eyebrow">The full operational flow, end to end</div>
            <ProjectFlow steps={project.flow} />
          </>
        )}

        {panels.length > 0 && <InterfaceDeck className="min-h-[190px] flex-1">{panels}</InterfaceDeck>}

        {project.note && <div className="eyebrow mt-1.5">{project.note}</div>}

        {/* Subtle reflection sweep on hover, restrained, not a shine gimmick */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
        />
      </Glass>
    </div>
  );
}

function LogoMarquee({ items }: { items: Client[] }) {
  // Repeat the set 4 times for a longer, smoother marquee.
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
            className="glass mr-5 flex h-24 w-40 flex-none items-center justify-center rounded-2xl p-6 sm:h-28 sm:w-48"
          >
            {c.logo ? (
              <img
                src={c.logo}
                alt={c.name}
                className="max-h-14 max-w-full object-contain opacity-80 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 sm:max-h-16"
              />
            ) : (
              <span className="font-display text-[0.72rem] font-semibold text-ink-faint">
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
    <section id="projects" className="pb-15">
      <div className="wrap">
        <div className="pt-35 pb-15">
          <div className="eyebrow mb-4.5">Selected work</div>
          <h2 className="font-display max-w-[16ch] text-[clamp(2.2rem,6vw,4.4rem)] font-semibold leading-[0.98]">
            Systems in production, not screenshots in a card.
          </h2>
        </div>

        {projects.map((p) => (
          <ProjectBlock key={p.id} project={p} />
        ))}

        <div className="project-block border-t border-line pb-5 pt-22.5">
          <h3 className="font-display mb-8 text-[clamp(1.9rem,4.6vw,3.4rem)] font-semibold">Built with</h3>
          {/* Logo-only, continuously auto-scrolling, new client logos
              can be appended to src/data/projects.ts and the marquee
              just keeps looping, no layout changes needed. */}
          <LogoMarquee items={clients} />
        </div>
      </div>
    </section>
  );
}