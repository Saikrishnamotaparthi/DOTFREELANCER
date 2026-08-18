import { useEffect, useState } from 'react';
import { siteConfig } from '../lib/siteConfig';

export default function Footer() {
  const { contact, founder } = siteConfig;
  const [time, setTime] = useState({ ist: '', utc: '' });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime({
        ist: now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false }),
        utc: now.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false }),
      });
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="relative z-[1] border-t border-line bg-bg-1/80 px-6 py-14 md:px-16 backdrop-blur-xl">
      <div className="wrap">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] gap-10 pb-12 border-b border-line">
          {/* Brand Col */}
          <div>
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="DotFreelancer Logo"
                className="h-9 w-9 object-contain rounded-lg drop-shadow-[0_0_12px_rgba(0,242,254,0.4)]"
              />
              <div className="font-display text-xl font-bold text-ink">DOTFREELANCER</div>
            </div>
            <p className="mt-3 font-mono text-[0.74rem] leading-relaxed text-ink-dim max-w-[40ch]">
              Architected by {founder}. Custom web applications, payments, AI pipelines &amp; business ERPs engineered with zero team fragmentation.
            </p>

            {/* Live Telemetry Clock */}
            <div className="mt-6 inline-flex items-center gap-4 rounded-xl border border-cyan/20 bg-bg-0/60 px-4 py-2.5 font-mono text-[0.68rem]">
              <div>
                <span className="text-ink-faint">INDIA [IST]: </span>
                <span className="text-cyan font-semibold">{time.ist || '14:30:00'}</span>
              </div>
              <span className="text-line-strong">|</span>
              <div>
                <span className="text-ink-faint">UTC: </span>
                <span className="text-emerald-400 font-semibold">{time.utc || '09:00:00'}</span>
              </div>
            </div>
          </div>

          {/* Direct Comms */}
          <div>
            <div className="eyebrow mb-4">Direct Channels</div>
            <ul className="flex flex-col gap-3 font-mono text-[0.78rem]">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-ink-dim hover:text-cyan transition-colors flex items-center gap-2"
                >
                  <span className="text-cyan">✉</span>
                  <span>{contact.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-dim hover:text-cyan transition-colors flex items-center gap-2"
                >
                  <span className="text-emerald-400">💬</span>
                  <span>WhatsApp: {contact.phoneDisplay}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Elsewhere */}
          <div>
            <div className="eyebrow mb-4">Engineering Network</div>
            <ul className="flex flex-col gap-3 font-mono text-[0.78rem]">
              <li>
                <a
                  href={contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-dim hover:text-cyan transition-colors flex items-center gap-2"
                >
                  <span>→ LinkedIn</span>
                </a>
              </li>
              <li>
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-dim hover:text-cyan transition-colors flex items-center gap-2"
                >
                  <span>→ GitHub Repositories</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 font-mono text-[0.68rem] text-ink-faint">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>ALL SYSTEMS OPERATIONAL · HIGH-AVAILABILITY CLUSTER</span>
          </div>
          <span>© {new Date().getFullYear()} DotFreelancer. Single-Architect Software Engineering.</span>
        </div>
      </div>
    </footer>
  );
}
