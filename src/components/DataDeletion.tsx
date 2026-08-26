import { useEffect, useState } from 'react';
import { siteConfig } from '../lib/siteConfig';

interface DataDeletionProps {
  onBackToHome: () => void;
}

export default function DataDeletion({ onBackToHome }: DataDeletionProps) {
  const { contact, founder } = siteConfig;
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const emailTemplateText = `Subject: User Data Deletion Request - [Your Full Name]

Dear DotFreelancer Privacy Team / Grievance Officer,

I am writing to formally request the complete erasure and deletion of all personal data and associated records connected to my identity from DotFreelancer systems, databases, and sub-processors.

Details for Identification:
- Full Name: [Your Full Name]
- Registered Email: [Your Email Address]
- Phone / WhatsApp Number: [Your Phone Number]
- Associated Service / Integration: [e.g. Website Form / WhatsApp Chat / Meta OAuth / Project Contract]

Specific Request:
- [x] Delete all personal profile & contact information
- [x] Purge chat transcripts & communication history
- [x] Revoke and remove all third-party API / OAuth tokens (Meta/Facebook, etc.)
- [x] Cascade deletion to all downstream cloud infrastructure & sub-processors

I understand that statutory financial and tax records (such as completed GST invoices) may be retained where strictly mandated by applicable law.

Please confirm receipt of this request and provide confirmation once deletion is complete.

Thank you,
[Your Name]
[Your Contact Information]`;

  const copyTemplate = () => {
    navigator.clipboard.writeText(emailTemplateText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const sections = [
    {
      num: '01',
      id: 'stored-data',
      title: '1. What User Data We Store',
      content: (
        <div className="space-y-4">
          <p>
            At <strong className="text-ink">DotFreelancer</strong>, we adhere to strict data minimization principles under the Indian Digital Personal Data Protection (DPDP) Act 2023, the Information Technology Act 2000, and GDPR Article 17. We collect and store only data strictly necessary to communicate, execute software contracts, or operate authorized messaging integrations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-2">
            <div className="p-4 rounded-xl border border-line bg-surface/50">
              <div className="flex items-center gap-2 font-mono text-xs text-cyan font-semibold mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                Contact &amp; Profile Identifiers
              </div>
              <p className="text-xs text-ink-dim leading-relaxed">
                Full name, business/personal email address, contact telephone / WhatsApp number, company name, and job title submitted via our contact forms or service inquiries.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-line bg-surface/50">
              <div className="flex items-center gap-2 font-mono text-xs text-cyan font-semibold mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                Project &amp; Technical Communications
              </div>
              <p className="text-xs text-ink-dim leading-relaxed">
                Project briefs, architecture specifications, feedback notes, submitted inquiries, and historical email correspondence exchanged during software development.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-line bg-surface/50">
              <div className="flex items-center gap-2 font-mono text-xs text-cyan font-semibold mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                Meta Platform &amp; WhatsApp Data
              </div>
              <p className="text-xs text-ink-dim leading-relaxed">
                Meta/Facebook User IDs (ASUIDs), WhatsApp phone numbers, message timestamps, webhook transmission statuses, and opt-in preferences for automated transactional alerts.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-line bg-surface/50">
              <div className="flex items-center gap-2 font-mono text-xs text-cyan font-semibold mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                Telemetry &amp; Billing Metadata
              </div>
              <p className="text-xs text-ink-dim leading-relaxed">
                IP addresses, browser/OS telemetry, serverless request logs, and invoice payment reference IDs (Razorpay/Stripe). <em>Note: We never store raw credit card or banking credentials.</em>
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      num: '02',
      id: 'how-to-request',
      title: '2. How Users Can Request Deletion',
      content: (
        <div className="space-y-4">
          <p>
            You have the absolute right to request the total erasure of your personal data at any time (&quot;Right to Erasure / Right to be Forgotten&quot;). We provide multiple direct, friction-free channels to initiate your deletion request:
          </p>

          <div className="space-y-3">
            {/* Option A: Email */}
            <div className="p-4 rounded-xl border border-line bg-surface/60 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-mono text-xs text-cyan font-bold uppercase tracking-wider">
                  Method A: Direct Email Request (Universal)
                </div>
                <span className="cyber-badge cyber-badge-emerald">Fastest &amp; Preferred</span>
              </div>
              <p className="text-xs text-ink-dim leading-relaxed">
                Send an email directly to{' '}
                <a href={`mailto:${contact.email}?subject=Data%20Deletion%20Request`} className="text-cyan underline font-medium">
                  {contact.email}
                </a>{' '}
                from your registered email address with the subject line <code className="bg-surface-hi px-1.5 py-0.5 rounded text-cyan text-[0.75rem]">Data Deletion Request - [Your Name]</code>.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={copyTemplate}
                  className="inline-flex items-center gap-2 rounded-lg border border-cyan/40 bg-cyan/10 px-3 py-1.5 font-mono text-[0.72rem] text-cyan hover:bg-cyan hover:text-bg-0 transition-colors cursor-pointer"
                >
                  <span>{copied ? '✓ Template Copied to Clipboard!' : '📋 Copy Pre-Filled Email Template'}</span>
                </button>
              </div>
            </div>

            {/* Option B: WhatsApp Opt-out */}
            <div className="p-4 rounded-xl border border-line bg-surface/60 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider">
                  Method B: Instant WhatsApp Messaging Deletion
                </div>
                <span className="cyber-badge cyber-badge-emerald">Automated Bot &amp; Cloud API</span>
              </div>
              <p className="text-xs text-ink-dim leading-relaxed">
                If you have interacted with our WhatsApp Business API integration, simply send the keyword{' '}
                <strong className="text-cyan font-mono">&quot;STOP&quot;</strong>, <strong className="text-cyan font-mono">&quot;DELETE DATA&quot;</strong>, or{' '}
                <strong className="text-cyan font-mono">&quot;UNSUBSCRIBE&quot;</strong> directly to our WhatsApp number at{' '}
                <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline font-medium">
                  {contact.phoneDisplay}
                </a>. This immediately halts all messages and schedules your transmission logs for automatic purging.
              </p>
            </div>

            {/* Option C: Meta Facebook App Settings */}
            <div className="p-4 rounded-xl border border-line bg-surface/60 space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="font-mono text-xs text-brass font-bold uppercase tracking-wider">
                  Method C: Meta / Facebook Account Settings
                </div>
                <span className="cyber-badge cyber-badge-brass">Meta Policy 4.5</span>
              </div>
              <p className="text-xs text-ink-dim leading-relaxed">
                If you authenticated or connected via Facebook Login, Instagram, or Meta Business tools, you can remove DotFreelancer permissions directly within Facebook Settings (see Section 4 below for the step-by-step walkthrough).
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      num: '03',
      id: 'what-happens-after',
      title: '3. What Happens After You Request Deletion',
      content: (
        <div className="space-y-4">
          <p>
            We process all verified erasure requests with urgency through a structured, multi-stage compliance SLA workflow:
          </p>

          <div className="relative border-l border-cyan/30 ml-4 pl-6 space-y-6">
            {/* Step 1 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-bg-0 border-2 border-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
              </span>
              <div className="font-mono text-xs text-cyan font-semibold">STAGE 1 — 0 to 24 Hours</div>
              <h3 className="font-display text-sm font-bold text-ink mt-0.5">Acknowledgment &amp; Identity Verification</h3>
              <p className="text-xs text-ink-dim mt-1 leading-relaxed">
                We log your request, assign a unique tracking identifier, and verify ownership of the requesting email or phone number to prevent unauthorized or malicious data deletion requests.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-bg-0 border-2 border-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
              </span>
              <div className="font-mono text-xs text-cyan font-semibold">STAGE 2 — 24 to 48 Hours</div>
              <h3 className="font-display text-sm font-bold text-ink mt-0.5">Infrastructure &amp; Sub-processor Cascade</h3>
              <p className="text-xs text-ink-dim mt-1 leading-relaxed">
                We trigger automated deletion scripts across our operational databases, serverless mailers, CRM contact records, and downstream sub-processors (including Meta WhatsApp Cloud API webhooks, edge cache layers, and email queues).
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-bg-0 border-2 border-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
              </span>
              <div className="font-mono text-xs text-cyan font-semibold">STAGE 3 — 48 to 72 Hours</div>
              <h3 className="font-display text-sm font-bold text-ink mt-0.5">Permanent Cryptographic Purge</h3>
              <p className="text-xs text-ink-dim mt-1 leading-relaxed">
                All identifying personal records, authentication tokens, message transcripts, and telemetry associations are permanently overwritten or hard-deleted from production data stores.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative">
              <span className="absolute -left-[31px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-bg-0 border-2 border-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <div className="font-mono text-xs text-emerald-400 font-semibold">STAGE 4 — Final Confirmation</div>
              <h3 className="font-display text-sm font-bold text-ink mt-0.5">Deletion Receipt Dispatched</h3>
              <p className="text-xs text-ink-dim mt-1 leading-relaxed">
                A formal deletion confirmation notice containing your resolution summary and timestamp is emailed to you. Once confirmed, no further marketing or transactional communication will occur.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      num: '04',
      id: 'meta-facebook-data',
      title: '4. Disconnecting & Deleting Meta / Facebook Platform Data',
      content: (
        <div className="space-y-4">
          <p>
            In accordance with <strong className="text-ink">Meta Platform Terms (Section 4.5 &amp; User Data Deletion Instructions)</strong>, if you have linked your Facebook account, used Facebook Login, or interacted with DotFreelancer via Meta Developer integrations, you can disconnect your account and remove all data stored by DotFreelancer at any time.
          </p>

          <div className="p-5 rounded-xl border border-cyan/20 bg-surface/70 space-y-3">
            <div className="font-mono text-xs text-cyan font-bold uppercase tracking-wider flex items-center gap-2">
              <span>📱 Step-by-Step Facebook App Permission Removal:</span>
            </div>

            <ol className="list-decimal list-inside space-y-2 text-xs text-ink-dim leading-relaxed ml-1">
              <li>
                Log into your <strong className="text-ink">Facebook Account</strong> on desktop or the mobile app.
              </li>
              <li>
                Click your profile avatar in the top right &gt; select <strong className="text-ink">Settings &amp; Privacy</strong> &gt; click <strong className="text-ink">Settings</strong>.
              </li>
              <li>
                In the left sidebar menu, scroll to the <em>Your information and permissions</em> section and click <strong className="text-cyan">Apps and Websites</strong>.
              </li>
              <li>
                Locate <strong className="text-ink">DotFreelancer</strong> (or the associated app) in the list of active connected applications.
              </li>
              <li>
                Click the <strong className="text-rose-400 font-medium">Remove</strong> button next to the app name.
              </li>
              <li>
                Check the confirmation box to remove all posts, videos, or events that the app may have published on your behalf, and click <strong className="text-rose-400 font-medium">Remove</strong> again.
              </li>
              <li>
                Under the <strong className="text-ink">Removed Apps and Websites</strong> tab, you can click on <strong className="text-ink">DotFreelancer</strong> &gt; click <strong className="text-cyan">View</strong> to view your unique <strong className="text-cyan font-mono">Confirmation Code</strong> and track your automated data deletion status.
              </li>
            </ol>
          </div>

          <div className="p-4 rounded-xl border border-line bg-surface/40 text-xs text-ink-dim space-y-1.5">
            <div className="font-mono text-[0.75rem] text-brass font-bold uppercase">
              Meta Data Deletion Callback / Status Query:
            </div>
            <p>
              When a user removes our app via Facebook, our system automatically receives a signed deletion webhook from Meta. You may also query the status of your deletion request by emailing your Meta confirmation code to{' '}
              <a href={`mailto:${contact.email}?subject=Meta%20Data%20Deletion%20Status%20Query`} className="text-cyan underline">
                {contact.email}
              </a>.
            </p>
          </div>
        </div>
      ),
    },
    {
      num: '05',
      id: 'statutory-retention',
      title: '5. Data That Must Legally Be Retained (Statutory Exceptions)',
      content: (
        <div className="space-y-4">
          <p>
            While we delete all identifying personal information upon request, certain categories of transactional and security data must be retained pursuant to overriding Indian statutory regulations and international commercial laws:
          </p>

          <div className="space-y-2.5">
            <div className="p-3.5 rounded-xl border border-line bg-surface/40 flex items-start gap-3">
              <span className="font-mono text-xs text-brass font-bold pt-0.5">§ 5.1</span>
              <div className="text-xs text-ink-dim leading-relaxed">
                <strong className="text-ink">Statutory Financial, Tax &amp; Invoicing Records:</strong> Tax invoices, GST receipts, and commercial payment records are required to be maintained for up to <strong className="text-ink">8 financial years</strong> under the Indian Goods and Services Tax (GST) Act 2017 and Section 44AA of the Income Tax Act 1961 for government audit and accounting compliance.
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-line bg-surface/40 flex items-start gap-3">
              <span className="font-mono text-xs text-brass font-bold pt-0.5">§ 5.2</span>
              <div className="text-xs text-ink-dim leading-relaxed">
                <strong className="text-ink">Cybersecurity &amp; Server Incident Logs:</strong> System server connection logs and firewall security records are retained for <strong className="text-ink">180 days</strong> in strict accordance with the CERT-In (Indian Computer Emergency Response Team) Cybersecurity Directions under the Information Technology Act, 2000.
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-line bg-surface/40 flex items-start gap-3">
              <span className="font-mono text-xs text-brass font-bold pt-0.5">§ 5.3</span>
              <div className="text-xs text-ink-dim leading-relaxed">
                <strong className="text-ink">Active Dispute Resolution &amp; Defense of Legal Claims:</strong> Data strictly necessary to resolve active arbitrations, outstanding contractual claims, or defend against fraud is preserved until the final resolution of the dispute or expiration of statutory limitation periods.
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-xs text-ink-dim">
            <strong className="text-emerald-400">Strict Isolation Guarantee:</strong> Any retained statutory records are placed in an isolated, encrypted archive with access restricted exclusively to authorized accounting/legal advisors. They will never be used for marketing, automated profiling, or day-to-day operations.
          </div>
        </div>
      ),
    },
    {
      num: '06',
      id: 'subprocessors-cascade',
      title: '6. Third-Party Sub-processors Cascade',
      content: (
        <div className="space-y-3">
          <p>
            Upon executing a data deletion request, we trigger cascading deletion protocols across all third-party service providers and cloud infrastructure holding cached or routed data:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-line bg-surface/30">
              <div className="text-ink font-semibold">Meta Platforms, Inc.</div>
              <div className="text-ink-faint mt-0.5">WhatsApp Cloud API logs purged; phone identifier unlinked.</div>
            </div>
            <div className="p-3 rounded-lg border border-line bg-surface/30">
              <div className="text-ink font-semibold">Google LLC (Gmail SMTP)</div>
              <div className="text-ink-faint mt-0.5">Direct email threads archived and deleted per retention policy.</div>
            </div>
            <div className="p-3 rounded-lg border border-line bg-surface/30">
              <div className="text-ink font-semibold">Vercel &amp; Cloudflare</div>
              <div className="text-ink-faint mt-0.5">Edge CDN logs and serverless runtime state rotated and cleared.</div>
            </div>
            <div className="p-3 rounded-lg border border-line bg-surface/30">
              <div className="text-ink font-semibold">Razorpay &amp; Stripe</div>
              <div className="text-ink-faint mt-0.5">Customer profiles detached; legal financial ledger preserved.</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      num: '07',
      id: 'contact-officer',
      title: '7. How to Contact Us for Data Deletion',
      content: (
        <div className="space-y-4">
          <p>
            If you have questions about your data, need assistance removing Meta integrations, or wish to submit an erasure request, you can directly reach our designated Grievance &amp; Data Protection Officer:
          </p>

          <div className="p-5 rounded-2xl border border-cyan/30 bg-surface/60 space-y-3 font-mono text-xs text-ink">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-line">
              <div>
                <span className="text-ink-faint">Data Protection &amp; Grievance Officer:</span>{' '}
                <strong className="text-cyan text-sm">{founder}</strong>
              </div>
              <span className="cyber-badge cyber-badge-emerald">Official Authority</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-ink-faint block mb-0.5">Direct Privacy Email:</span>
                <a href={`mailto:${contact.email}`} className="text-cyan underline font-medium">
                  {contact.email}
                </a>
              </div>
              <div>
                <span className="text-ink-faint block mb-0.5">WhatsApp / Phone:</span>
                <a href={contact.whatsapp} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline font-medium">
                  {contact.phoneDisplay}
                </a>
              </div>
              <div>
                <span className="text-ink-faint block mb-0.5">Organization / Entity:</span>
                <span className="text-ink">DotFreelancer</span>
              </div>
              <div>
                <span className="text-ink-faint block mb-0.5">Registered Operating Base:</span>
                <span className="text-ink">Hyderabad, Telangana, India</span>
              </div>
            </div>

            <div className="pt-2 text-[0.72rem] text-ink-faint border-t border-line">
              ⚡ SLA Commitment: Initial acknowledgment within <strong className="text-cyan">24 hours</strong>; full data deletion resolution completed within <strong className="text-cyan">48 to 72 hours</strong>.
            </div>
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
            USER DATA DELETION &amp; ERASURE POLICY
          </div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink">
            Data Deletion Instructions &amp; Policy
          </h1>
          <p className="mt-3 text-base text-ink-dim max-w-[70ch] leading-relaxed">
            Transparent instructions on how to request the deletion of your personal data, WhatsApp messaging records, and connected Meta/Facebook platform information from <strong className="text-ink">DotFreelancer</strong>.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="cyber-badge">India DPDP Act 2023 &amp; IT Act</span>
            <span className="cyber-badge cyber-badge-brass">Meta / Facebook Policy 4.5 Compliant</span>
            <span className="cyber-badge cyber-badge-emerald">48–72h Resolution SLA</span>
            <span className="cyber-badge cyber-badge-emerald">Irreversible Cryptographic Purge</span>
          </div>
        </div>

        {/* Sections List */}
        <div className="mt-10 space-y-6">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="glass p-6 sm:p-7 rounded-2xl border border-line hover:border-line-strong transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-xs text-cyan font-bold">{section.num} //</span>
                <h2 className="font-display text-lg sm:text-xl font-bold text-ink">
                  {section.title}
                </h2>
              </div>
              <div className="text-ink-dim leading-relaxed text-[0.92rem]">
                {section.content}
              </div>
            </section>
          ))}
        </div>

        {/* Pre-formatted email template card */}
        <div className="mt-10 p-6 sm:p-7 glass rounded-2xl border border-cyan/30">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-cyan font-bold">TEMPLATE //</span>
              <h3 className="font-display text-base font-bold text-ink">Quick Data Deletion Request Email</h3>
            </div>
            <button
              type="button"
              onClick={copyTemplate}
              className="inline-flex items-center gap-2 rounded-xl bg-cyan px-4 py-2 font-mono text-[0.75rem] font-bold text-bg-0 hover:shadow-[0_0_20px_rgba(0,242,254,0.5)] transition-all cursor-pointer"
            >
              <span>{copied ? '✓ Copied to Clipboard!' : '📋 Copy Email Template'}</span>
            </button>
          </div>
          <p className="text-xs text-ink-dim mb-3">
            Copy and send this pre-filled template to{' '}
            <a href={`mailto:${contact.email}`} className="text-cyan underline">
              {contact.email}
            </a>:
          </p>
          <pre className="p-4 rounded-xl border border-line bg-surface/70 font-mono text-xs text-ink-dim overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {emailTemplateText}
          </pre>
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
