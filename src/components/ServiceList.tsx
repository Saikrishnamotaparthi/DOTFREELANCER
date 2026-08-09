import { useRef } from 'react';
import { services } from '../data/services';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

export default function ServiceList() {
  const sectionRef = useRef<HTMLElement>(null);

  useScrollAnimation(sectionRef, ({ gsap }) => {
    gsap.utils.toArray<HTMLElement>('.service-row').forEach((row) => {
      gsap.set(row, { opacity: 0, y: 30 });
      gsap.to(row, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: row, start: 'top 88%' },
      });
    });
  });

  return (
    <section ref={sectionRef} id="services" className="pb-25">
      <div className="wrap">
        <div className="pt-35 pb-15">
          <div className="eyebrow mb-4.5">Capabilities</div>
          <h2 className="font-display max-w-[16ch] text-[clamp(2.2rem,6vw,4.4rem)] font-semibold leading-[0.98]">
            Six ways I plug the gaps between "idea" and "running business."
          </h2>
        </div>

        <div>
          {services.map((s, i) => (
            <div
              key={s.num}
              className={`service-row group grid grid-cols-1 gap-3.5 border-t border-line py-13 md:grid-cols-[120px_1fr_1.1fr] md:gap-10 ${
                i === services.length - 1 ? 'border-b' : ''
              }`}
            >
              <div className="pt-2 font-mono text-base text-ink-faint transition-colors duration-300 group-hover:text-brass">
                {s.num}
              </div>
              <div className="font-display text-[clamp(1.6rem,3.4vw,2.6rem)] font-semibold transition-transform duration-300 group-hover:translate-x-1.5">
                {s.name}
              </div>
              <div className="self-center text-[0.98rem] leading-relaxed text-ink-dim transition-colors duration-300 group-hover:text-ink">
                {s.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
