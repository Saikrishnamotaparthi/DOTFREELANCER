import { useRef } from 'react';
import Glass from './Glass';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const principles = [
  { num: '01', title: 'Build with purpose' },
  { num: '02', title: 'Keep it simple' },
  { num: '03', title: 'Automate the repetitive' },
  { num: '04', title: 'Design for scale' },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useScrollAnimation(sectionRef, ({ gsap }) => {
    gsap.from('.about-portrait', {
      opacity: 0,
      x: -30,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.about-grid', start: 'top 80%' },
    });
    gsap.from('.principle', {
      opacity: 0,
      y: 16,
      stagger: 0.08,
      duration: 0.6,
      scrollTrigger: { trigger: '.principles', start: 'top 90%' },
    });
  });

  return (
    <section ref={sectionRef} id="about" className="pb-40">
      <div className="wrap">
        <div className="pb-15">
          <div className="eyebrow">The person behind it</div>
        </div>
        <div className="about-grid grid grid-cols-1 items-start gap-15 md:grid-cols-[0.8fr_1.2fr]">
          <Glass variant="smoked" className="about-portrait relative flex aspect-[4/5] items-end overflow-hidden p-5.5">
            {/* Fallback initials shown behind the photo */}
            <div className="font-display absolute inset-0 flex items-center justify-center text-[6rem] font-bold text-white/5">
              SM
            </div>
            {/* Profile photo — place your image as /public/profile.jpg */}
            <img
              src="/profile.png"
              alt="Sai Krishna Motaparthi"
              className="absolute inset-0 h-full w-full object-cover object-top"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="relative font-mono text-[0.66rem] tracking-wide text-ink-faint">
              SAI KRISHNA MOTAPARTHI · FOUNDER, DOTFREELANCER
            </div>
          </Glass>
          <div>
            <div className="font-display text-[clamp(1.9rem,4vw,2.8rem)] font-semibold">
              Sai Krishna Motaparthi
            </div>
            <div className="mt-2 font-mono text-[0.76rem] uppercase tracking-wide text-ink-faint">
              Founder — DotFreelancer
            </div>
            <p className="mt-6.5 max-w-[56ch] leading-relaxed text-ink-dim">
              I build the full stack of a business's digital presence — website, application,
              backend, payments, automation and the AI layered on top — as one person who
              understands how every piece connects. That's the difference between hiring five
              specialists and hiring one partner who ships a working system.
            </p>
            <div className="principles mt-11 grid grid-cols-1 gap-4.5 md:grid-cols-2">
              {principles.map((p) => (
                <div key={p.num} className="principle border-t border-line pt-5">
                  <div className="font-mono text-[0.68rem] text-ink-faint">{p.num}</div>
                  <div className="font-display mt-2 text-[1.02rem] font-semibold">{p.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
