import { useEffect } from 'react';
import { siteConfig } from '../lib/siteConfig';

interface PrivacyPolicyProps {
  onBackToHome: () => void;
}

export default function PrivacyPolicy({ onBackToHome }: PrivacyPolicyProps) {
  const { contact, founder } = siteConfig;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const policyClauses = [
    {
      num: '01',
      id: 'introduction',
      title: '1. Introduction & Entity Overview',
      content: (
        <>
          <p className="mb-3">
            Welcome to <strong className="text-ink">DotFreelancer</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;, or &quot;Company&quot;),
            accessible via <a href={siteConfig.url} className="text-cyan underline underline-offset-4">{siteConfig.domain}</a>.
            DotFreelancer is an engineering and cloud software consultancy founded and architected by{' '}
            <strong className="text-ink">{founder}</strong> based in India.
          </p>
          <p className="mb-3">
            We are committed to maintaining the absolute confidentiality, integrity, and security of all personal,
            business, and telemetry data entrusted to us. This Privacy Policy details how we collect, store, process,
            disclose, and protect information when you visit our website, submit project inquiries, engage our custom
            engineering services, or interact with systems and transactional workflows powered by our{' '}
            <strong className="text-ink">WhatsApp Business API messaging integrations</strong>.
          </p>
          <p>
            By accessing our website, initiating project discussions, submitting forms, or utilizing any of our services,
            you acknowledge and consent to the policies outlined herein.
          </p>
        </>
      ),
    },
    {
      num: '02',
      id: 'data-collection',
      title: '2. Information We Collect',
      content: (
        <p>
          We collect only the minimum information necessary to execute software deliverables and communicate with you.
          This includes your full name, work email address, phone / WhatsApp mobile number, company name, project specifications,
          and essential technical telemetry (such as IP address, browser type, and operating system).
        </p>
      ),
    },
    {
      num: '03',
      id: 'purpose-usage',
      title: '3. Purpose & How We Use Your Information',
      content: (
        <p>
          We use collected data solely to review technical specifications, communicate project roadmaps, deliver custom
          software applications, process payments/invoices, respond to direct support inquiries, and ensure platform security.
        </p>
      ),
    },
    {
      num: '04',
      id: 'whatsapp-messaging',
      title: '4. WhatsApp Business API & Messaging Communications',
      content: (
        <>
          <p className="mb-3">
            We utilize the official <strong className="text-ink">WhatsApp Cloud API (Meta Platforms, Inc.)</strong> to deliver
            transactional notifications (such as project milestone updates, digital tickets/passes, OTPs, or order confirmations)
            and respond to customer-initiated conversations. WhatsApp communications are dispatched only after receiving prior
            explicit opt-in or when you initiate a message with us.
          </p>
          <p>
            You can opt out of automated WhatsApp messages at any time simply by replying <strong className="text-cyan font-mono">&quot;STOP&quot;</strong>,{' '}
            <strong className="text-cyan font-mono">&quot;UNSUBSCRIBE&quot;</strong>, or by emailing{' '}
            <a href={`mailto:${contact.email}`} className="text-cyan underline">{contact.email}</a>.
            Your phone number is strictly protected and will never be shared, sold, or rented for third-party marketing.
          </p>
        </>
      ),
    },
    {
      num: '05',
      id: 'legal-bases',
      title: '5. Legal Bases for Processing',
      content: (
        <p>
          We process personal data in compliance with the Indian Digital Personal Data Protection (DPDP) Act 2023 and GDPR under
          four lawful grounds: performance of a software development contract, explicit user consent, legitimate business security interests,
          and compliance with statutory tax/commercial obligations.
        </p>
      ),
    },
    {
      num: '06',
      id: 'subprocessors',
      title: '6. Third-Party Sub-processors & Infrastructure',
      content: (
        <p>
          We do not sell data to third parties. We share data only with essential, enterprise-grade cloud providers for core operations:
          Meta Platforms, Inc. (WhatsApp Cloud API routing), Google LLC (email delivery via Gmail SMTP), Vercel &amp; Cloudflare
          (hosting &amp; edge security), Razorpay &amp; Stripe (encrypted payment processing), and Delhivery (logistics tracking, where integrated).
        </p>
      ),
    },
    {
      num: '07',
      id: 'data-security',
      title: '7. Data Security & Encryption',
      content: (
        <p>
          We enforce strict defense-in-depth measures: all traffic and API endpoints are protected via HTTPS with 256-bit TLS 1.3 encryption.
          Our backend endpoints run in stateless serverless environments protected by rate limiting and honeypot anti-spam mechanisms, with zero hardcoded credentials.
        </p>
      ),
    },
    {
      num: '08',
      id: 'no-reselling',
      title: '8. Strict Anti-Spam & Zero Reselling Policy',
      content: (
        <p>
          We maintain a zero-tolerance policy against unsolicited spam. We never buy, scrape, rent, or trade contact lists.
          Your contact information, project details, and chat records remain strictly confidential.
        </p>
      ),
    },
    {
      num: '09',
      id: 'data-retention',
      title: '9. Data Retention & Deletion',
      content: (
        <p>
          Project inquiries are retained for up to 12 months for active project communication and then systematically purged.
          WhatsApp transmission logs are rotated every 90 days. Statutory tax and financial invoices are retained as required by Indian commercial law.
          You may request earlier deletion at any time.
        </p>
      ),
    },
    {
      num: '10',
      id: 'user-rights',
      title: '10. Your Privacy Rights & Access',
      content: (
        <p>
          You have the right to request access to your personal data, request correction of inaccurate records, withdraw communication consent,
          or request complete erasure (&quot;Right to be Forgotten&quot;). To exercise these rights, email{' '}
          <a href={`mailto:${contact.email}`} className="text-cyan underline">{contact.email}</a>. We resolve all verified requests within 48 to 72 hours.
        </p>
      ),
    },
    {
      num: '11',
      id: 'cookies-telemetry',
      title: '11. Cookies & Telemetry',
      content: (
        <p>
          We use only strictly necessary, non-invasive cookies for session performance, smooth scrolling, and user preferences (such as reduced motion).
          We do not use third-party behavioral advertising trackers or marketing pixels.
        </p>
      ),
    },
    {
      num: '12',
      id: 'children-privacy',
      title: '12. Children\'s Privacy Protection',
      content: (
        <p>
          Our services and website are intended solely for businesses and individuals aged 18 and older. We do not knowingly solicit or collect
          personal data from minors under the age of 18.
        </p>
      ),
    },
    {
      num: '13',
      id: 'policy-updates',
      title: '13. Policy Revisions & Updates',
      content: (
        <p>
          We may update this Privacy Policy periodically to reflect changes in software integrations, WhatsApp guidelines, or regulatory requirements.
          Any revisions will be posted directly on this page with an updated &quot;LAST UPDATED&quot; date.
        </p>
      ),
    },
    {
      num: '14',
      id: 'grievance-officer',
      title: '14. Grievance Redressal & Contact Officer',
      content: (
        <div className="space-y-2">
          <p>
            In compliance with the Information Technology Act, 2000, and the Digital Personal Data Protection Act, 2023, the designated Grievance &amp; Data Protection Officer is:
          </p>
          <div className="p-4 rounded-xl border border-line bg-surface/40 font-mono text-xs text-ink space-y-1.5 mt-2">
            <div><span className="text-ink-faint">Name / Officer:</span> <strong className="text-cyan">{founder}</strong> (DotFreelancer)</div>
            <div><span className="text-ink-faint">Email:</span> <a href={`mailto:${contact.email}`} className="text-cyan underline">{contact.email}</a></div>
            <div><span className="text-ink-faint">WhatsApp / Phone:</span> <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">{contact.phoneDisplay}</a></div>
            <div><span className="text-ink-faint">Location:</span> Hyderabad, Telangana, India</div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative min-h-screen bg-bg-0 text-ink pt-28 pb-20 px-4 sm:px-8 md:px-12 selection:bg-cyan selection:text-bg-0">
      {/* Background glow effects */}
      <div className="cyber-glow-sphere -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan/15 blur-[120px] pointer-events-none" />

      <div className="wrap relative z-10 max-w-[960px] mx-auto">
        {/* Top Header Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-line">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 rounded-xl border border-cyan/40 bg-cyan/10 px-4 py-2 font-mono text-[0.78rem] uppercase tracking-wider text-cyan transition-all duration-200 hover:bg-cyan hover:text-bg-0 hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] cursor-pointer"
          >
            <span>← Return to Home</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface/60 px-3.5 py-1.5 font-mono text-[0.74rem] text-ink-dim hover:text-cyan hover:border-cyan/40 transition-colors cursor-pointer"
            >
              <span>🖨 Print / PDF</span>
            </button>
            <div className="font-mono text-[0.72rem] text-ink-faint">
              LAST UPDATED: <span className="text-cyan font-medium">FEBRUARY 2026</span>
            </div>
          </div>
        </div>

        {/* Hero Title Banner */}
        <div className="py-10 md:py-12 text-left border-b border-line">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-cyan/5 px-3 py-1 font-mono text-[0.7rem] text-cyan uppercase tracking-widest mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" />
            PRIVACY &amp; DATA POLICY
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink">
            Privacy Policy
          </h1>
          <p className="mt-3 text-base text-ink-dim max-w-[70ch] leading-relaxed">
            Clear, transparent terms governing how <strong className="text-ink">{founder}</strong> (operating as <strong className="text-ink">DotFreelancer</strong>) handles your information, software communications, and WhatsApp API services.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="cyber-badge">India DPDP Act 2023 &amp; IT Act</span>
            <span className="cyber-badge cyber-badge-emerald">Meta WhatsApp Cloud API Aligned</span>
            <span className="cyber-badge cyber-badge-brass">256-Bit SSL Encrypted</span>
            <span className="cyber-badge cyber-badge-emerald">Zero Data Reselling</span>
          </div>
        </div>

        {/* Concise Policy Terms List */}
        <div className="mt-10 space-y-6">
          {policyClauses.map((clause) => (
            <section
              key={clause.id}
              id={clause.id}
              className="glass p-6 sm:p-7 rounded-2xl border border-line hover:border-line-strong transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-xs text-cyan font-bold">{clause.num} //</span>
                <h2 className="font-display text-lg sm:text-xl font-bold text-ink">
                  {clause.title}
                </h2>
              </div>
              <div className="text-ink-dim leading-relaxed text-[0.92rem]">
                {clause.content}
              </div>
            </section>
          ))}
        </div>

        {/* Bottom CTA to return */}
        <div className="mt-12 text-center pt-8 border-t border-line">
          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-3 rounded-xl bg-cyan px-8 py-3.5 font-mono text-[0.82rem] font-bold uppercase tracking-wider text-bg-0 shadow-[0_0_25px_rgba(0,242,254,0.4)] hover:shadow-[0_0_35px_rgba(0,242,254,0.6)] transition-all cursor-pointer"
          >
            <span>← Back to DotFreelancer Main Platform</span>
          </button>
        </div>
      </div>
    </div>
  );
}
