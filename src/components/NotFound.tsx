import { useEffect, useState } from 'react';
import { siteConfig } from '../lib/siteConfig';

interface NotFoundProps {
  onBackToHome: () => void;
  onNavigateContact?: () => void;
}

export default function NotFound({ onBackToHome, onNavigateContact }: NotFoundProps) {
  const { contact } = siteConfig;
  const [currentPath, setCurrentPath] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname + window.location.search + window.location.hash);
    }
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toISOString());
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTeleport = (hash: string) => {
    onBackToHome();
    setTimeout(() => {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  const quickLinks: { label: string; hash: string; desc: string }[] = [
    { label: 'Ecosystem & Workflows', hash: '#ecosystem', desc: 'SaaS, Web, Mobile & Automations' },
    { label: 'Core Capabilities', hash: '#services', desc: 'Full-stack engineering & AI integrations' },
    { label: 'Featured Deployments', hash: '#projects', desc: 'Live customer production projects' },
    { label: 'Technical Architecture', hash: '#tech', desc: 'Modern high-throughput tech stack' },
    { label: 'About & Founder', hash: '#about', desc: 'Sai Krishna Motaparthi engineering dossier' },
    { label: 'Initiate Contact', hash: '#contact', desc: 'Request project scoping or direct quote' },
  ];

  return (
    <div className="relative min-h-screen bg-bg-0 text-ink pt-28 pb-20 px-4 sm:px-8 md:px-12 selection:bg-cyan selection:text-bg-0 overflow-hidden flex flex-col justify-center">
      {/* Background glow effects */}
      <div className="cyber-glow-sphere -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan/15 blur-[140px] pointer-events-none" />
      <div className="cyber-glow-sphere -bottom-32 right-1/4 w-[500px] h-[300px] bg-brass/10 blur-[130px] pointer-events-none" />

      <div className="wrap relative z-10 max-w-[920px] mx-auto w-full">
        {/* Top return bar */}
        <div className="flex items-center justify-between gap-4 pb-6 border-b border-line">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan/40 bg-cyan/10 px-4 py-2 font-mono text-[0.78rem] uppercase tracking-wider text-cyan transition-all duration-200 hover:bg-cyan hover:text-bg-0 hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] cursor-pointer"
          >
            <span>← Return to Mission Base</span>
          </button>

          <div className="flex items-center gap-2 font-mono text-[0.72rem] text-rose-400">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <span>ERR_404_ROUTE_UNDEFINED</span>
          </div>
        </div>

        {/* Central HUD Card */}
        <div className="mt-8 glass p-6 sm:p-10 rounded-3xl border border-rose-500/20 shadow-[0_0_50px_rgba(244,63,94,0.05)] relative overflow-hidden">
          {/* Subtle scanning line */}
          <div className="scanline opacity-30" />

          {/* Glitch 404 Headline */}
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-1 font-mono text-[0.7rem] text-rose-400 uppercase tracking-widest mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-ping" />
              ANOMALY DETECTED // 404 NOT FOUND
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
              <h1 className="font-display text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter text-ink drop-shadow-[0_0_35px_rgba(0,242,254,0.3)]">
                404
              </h1>
              <span className="font-mono text-sm sm:text-base text-cyan font-bold tracking-wider uppercase">
                // Coordinate Not Found
              </span>
            </div>

            <p className="mt-3 text-base text-ink-dim max-w-[65ch] leading-relaxed">
              The requested spatial coordinate or sub-routine does not exist in the DotFreelancer architecture matrix. It may have been decommissioned, relocated, or temporarily obstructed.
            </p>
          </div>

          {/* Real-time Diagnostics Terminal */}
          <div className="mt-8 p-4 sm:p-5 rounded-2xl border border-line bg-surface/80 font-mono text-xs text-ink space-y-2 relative">
            <div className="flex items-center justify-between pb-2 border-b border-line text-[0.72rem] text-ink-faint">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 font-bold text-ink">DIAGNOSTIC_TERMINAL_V2</span>
              </div>
              <div className="text-cyan">STATUS: SIGNAL_LOST</div>
            </div>

            <div className="space-y-1.5 text-[0.78rem] pt-1">
              <div>
                <span className="text-ink-faint">TARGET_URI:</span>{' '}
                <span className="text-rose-400 font-semibold bg-rose-500/10 px-1.5 py-0.5 rounded">
                  {currentPath || '/404'}
                </span>
              </div>
              <div>
                <span className="text-ink-faint">TIMESTAMP_UTC:</span>{' '}
                <span className="text-emerald-400">{currentTime || 'SYNCING...'}</span>
              </div>
              <div>
                <span className="text-ink-faint">SERVER_NODE:</span>{' '}
                <span className="text-ink">Vercel Edge Cluster (ap-south-1)</span>
              </div>
              <div>
                <span className="text-ink-faint">SYSTEM_RECOMMENDATION:</span>{' '}
                <span className="text-cyan">Reroute to Mission Control or verify URI parameter.</span>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <button
              type="button"
              onClick={onBackToHome}
              className="inline-flex items-center gap-2.5 rounded-xl bg-cyan px-7 py-3.5 font-mono text-[0.82rem] font-bold uppercase tracking-wider text-bg-0 shadow-[0_0_25px_rgba(0,242,254,0.4)] hover:shadow-[0_0_35px_rgba(0,242,254,0.7)] hover:bg-cyan/90 transition-all cursor-pointer"
            >
              <span>← Teleport to Homepage</span>
            </button>

            {onNavigateContact ? (
              <button
                type="button"
                onClick={onNavigateContact}
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/70 px-6 py-3.5 font-mono text-[0.82rem] font-medium text-ink hover:text-cyan hover:border-cyan/40 transition-colors cursor-pointer"
              >
                <span>💬 Report Lost Link / Contact</span>
              </button>
            ) : (
              <a
                href={`mailto:${contact.email}?subject=Broken%20Link%20Report`}
                className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/70 px-6 py-3.5 font-mono text-[0.82rem] font-medium text-ink hover:text-cyan hover:border-cyan/40 transition-colors"
              >
                <span>✉ Email Support</span>
              </a>
            )}
          </div>
        </div>

        {/* Quick Teleport Matrix */}
        <div className="mt-10">
          <div className="flex items-center gap-2 font-mono text-xs text-ink-faint uppercase tracking-wider mb-4">
            <span className="text-cyan">❖</span>
            <span>AVAILABLE SUB-SYSTEMS &amp; MODULES:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {quickLinks.map((link) => (
              <button
                key={link.hash}
                type="button"
                onClick={() => handleTeleport(link.hash)}
                className="glass p-4 rounded-xl border border-line hover:border-cyan/40 hover:bg-surface/80 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="font-display text-sm font-bold text-ink group-hover:text-cyan transition-colors">
                    {link.label}
                  </div>
                  <span className="font-mono text-xs text-cyan opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </div>
                <div className="text-xs text-ink-dim line-clamp-1">{link.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer Support Info */}
        <div className="mt-12 text-center font-mono text-xs text-ink-faint">
          Need immediate engineering assistance? Reach out directly via{' '}
          <a
            href={contact.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-400 hover:underline"
          >
            WhatsApp ({contact.phoneDisplay})
          </a>{' '}
          or{' '}
          <a href={`mailto:${contact.email}`} className="text-cyan hover:underline">
            {contact.email}
          </a>.
        </div>
      </div>
    </div>
  );
}
