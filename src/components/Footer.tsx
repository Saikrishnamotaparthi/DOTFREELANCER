import { siteConfig } from '../lib/siteConfig';

export default function Footer() {
  const { contact, founder } = siteConfig;

  return (
    <footer className="relative z-[1] border-t border-line px-6 py-12 md:px-18">
      <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="font-display text-lg font-semibold">DOTFREELANCER</div>
          <p className="mt-2.5 font-mono text-[0.72rem] leading-relaxed text-ink-faint">
            Software. Systems. Experiences.
            <br />
            {founder}
          </p>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:gap-12">
          <div>
            <div className="eyebrow mb-3">Contact</div>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-[0.82rem] text-ink-dim transition-colors hover:text-brass"
                >
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.82rem] text-ink-dim transition-colors hover:text-brass"
                >
                  WhatsApp — {contact.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="eyebrow mb-3">Elsewhere</div>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.82rem] text-ink-dim transition-colors hover:text-brass"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.82rem] text-ink-dim transition-colors hover:text-brass"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
        <span className="font-mono text-[0.66rem] text-ink-faint">
          © {new Date().getFullYear()} DotFreelancer. All rights reserved.
        </span>
        <a
          href={contact.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-2 font-mono text-[0.68rem] uppercase tracking-wide text-ink-dim transition-colors hover:text-brass"
        >
          Chat on WhatsApp →
        </a>
      </div>
    </footer>
  );
}
