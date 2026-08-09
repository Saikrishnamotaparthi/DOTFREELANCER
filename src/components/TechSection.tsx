import { useRef } from 'react';
import { technologies } from '../data/technologies';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function TechSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useScrollAnimation(sectionRef, ({ gsap }) => {
    gsap.utils.toArray<HTMLElement>('.tech-item').forEach((li, i) => {
      gsap.set(li, { opacity: 0, x: -8 });
      gsap.to(li, {
        opacity: 1,
        x: 0,
        duration: 0.5,
        delay: (i % 6) * 0.04,
        ease: 'power2.out',
        scrollTrigger: { trigger: li, start: 'top 92%' },
      });
    });
  });

  return (
    <section ref={sectionRef} id="tech" className="py-35">
      <div className="wrap">
        <div className="pb-0">
          <div className="eyebrow mb-4.5">Under the hood</div>
          <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-semibold">
            A focused technical stack, not a logo wall.
          </h2>
        </div>
        <div className="mt-14 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-11">
          {technologies.map((g) => (
            <div key={g.label}>
              <div className="eyebrow mb-4">{g.label}</div>
              <ul className="flex flex-col gap-2.5">
                {g.items.map((item) => (
                  <li key={item} className="tech-item text-[0.94rem] text-ink-dim">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
