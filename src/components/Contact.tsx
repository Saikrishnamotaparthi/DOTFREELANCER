import { useRef, useState, type FormEvent } from 'react';
import { siteConfig } from '../lib/siteConfig';
import { submitContact } from '../lib/api';
import { validateContact, projectTypeOptions } from '../lib/contact-types';
import type { ContactPayload, ContactFieldErrors } from '../lib/contact-types';
import { FieldWrap, TextField, TextAreaField, SelectField } from './FormFields';
import Glass from './Glass';

type FormState = 'idle' | 'submitting' | 'success' | 'error';

const emptyPayload: ContactPayload = {
  name: '',
  email: '',
  phone: '',
  company: '',
  projectType: '',
  message: '',
  budget: '',
  timeline: '',
  website: '', // honeypot
};

const featurePills = [
  'Payment Gateway (Razorpay/Stripe)',
  'WhatsApp Cloud Notifications',
  'Admin CRM & Analytics Desk',
  'User Auth & Role Management',
  'AI Agent / Workflow Automation',
  'QR Code & Ticket Generation',
];

const nextSteps = [
  { num: '01', text: 'Architectural Review: I evaluate your project requirements against technical specifications.' },
  { num: '02', text: 'Direct Response: You receive a response from me directly — usually within 2 to 6 hours.' },
  { num: '03', text: 'Turnkey Sprint: We finalize the roadmap and begin live end-to-end execution.' },
];

function referenceId() {
  return `DF-${Date.now().toString(36).toUpperCase()}`;
}

interface ContactProps {
  onNavigatePrivacy?: () => void;
}

export default function Contact({ onNavigatePrivacy }: ContactProps) {
  const [payload, setPayload] = useState<ContactPayload>(emptyPayload);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [state, setState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [refId, setRefId] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  function update<K extends keyof ContactPayload>(key: K, value: ContactPayload[K]) {
    setPayload((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function toggleFeature(feature: string) {
    const next = selectedFeatures.includes(feature)
      ? selectedFeatures.filter((f) => f !== feature)
      : [...selectedFeatures, feature];
    setSelectedFeatures(next);

    // Append / sync selected features to the message field if empty or update note
    if (!payload.message.includes('Features included:')) {
      update('message', payload.message ? `${payload.message}\n\nFeatures required: ${next.join(', ')}` : `Features required: ${next.join(', ')}`);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const fieldErrors = validateContact(payload);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setState('submitting');
    setErrorMessage('');

    const result = await submitContact(payload);

    if (result.ok) {
      setRefId(referenceId());
      setState('success');
    } else {
      setState('error');
      setErrorMessage(result.error || 'Something went wrong. Please try again or contact me directly on WhatsApp.');
    }
  }

  if (state === 'success') {
    return (
      <section id="contact" className="relative overflow-hidden py-36 text-center">
        <Glow />
        <div className="wrap relative">
          <Glass
            variant="smoked"
            className="success-in mx-auto max-w-[620px] p-8 sm:p-14 border border-cyan/30 bg-bg-1/95 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(0,242,254,0.15)]"
          >
            <div className="relative mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-cyan/50 bg-cyan/10">
              <span className="font-mono text-2xl text-cyan">✓</span>
            </div>

            <div className="eyebrow mb-2">Specifications Transmitted</div>
            <h3 className="font-display text-2xl font-bold sm:text-3xl text-ink">Project Logged Successfully</h3>
            <p className="mt-3 text-[0.92rem] text-ink-dim max-w-[45ch] mx-auto">
              Your inquiry has been encrypted and delivered directly to Sai Krishna. Reviewing your technical scope now.
            </p>

            <div className="mt-8 rounded-xl border border-cyan/20 bg-bg-0/60 p-4 font-mono text-[0.8rem]">
              <div className="text-ink-faint">TRANSMISSION REFERENCE</div>
              <div className="mt-1 text-cyan font-bold tracking-wider">{refId}</div>
            </div>

            <div className="mx-auto mt-8 max-w-[460px] space-y-3 border-t border-line pt-6 text-left">
              {nextSteps.map((step) => (
                <div key={step.num} className="flex gap-3">
                  <span className="font-mono text-xs text-cyan font-bold">{step.num} //</span>
                  <span className="text-[0.84rem] leading-relaxed text-ink-dim">{step.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={siteConfig.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-6 py-3 font-mono text-[0.82rem] font-semibold text-emerald-300 hover:bg-emerald-500/30 transition-all"
              >
                <span>💬 Expedite on WhatsApp</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setPayload(emptyPayload);
                  setSelectedFeatures([]);
                  setState('idle');
                }}
                className="w-full sm:w-auto rounded-xl border border-line bg-surface/50 px-6 py-3 font-mono text-[0.82rem] text-ink-dim hover:text-cyan transition-colors"
              >
                Submit Another Inquiry
              </button>
            </div>
          </Glass>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="relative py-28 md:py-36 overflow-hidden">
      <Glow />
      <div className="wrap relative z-10">
        <div className="text-center max-w-[700px] mx-auto mb-16">
          <div className="eyebrow mb-3">Direct Engagement</div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink">
            Start a Direct Project Brief
          </h2>
          <p className="mt-4 text-base sm:text-lg text-ink-dim">
            Zero account managers, zero sales fluff. Send your specifications directly to the engineer who will architect and build your software.
          </p>
        </div>

        <div className="max-w-[820px] mx-auto mb-10">
          <div className="text-xs font-mono uppercase tracking-wider text-ink-faint mb-3 text-center sm:text-left">
            Select Core Architectural Capabilities:
          </div>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {featurePills.map((feature) => {
              const active = selectedFeatures.includes(feature);
              return (
                <button
                  key={feature}
                  type="button"
                  onClick={() => toggleFeature(feature)}
                  className={`rounded-xl px-3.5 py-1.5 font-mono text-[0.72rem] transition-all duration-200 border cursor-pointer ${
                    active
                      ? 'border-cyan bg-cyan/15 text-cyan shadow-[0_0_15px_rgba(0,242,254,0.2)]'
                      : 'border-line bg-surface/40 text-ink-dim hover:border-line-strong hover:text-ink'
                  }`}
                >
                  {active ? '✓ ' : '+ '}
                  {feature}
                </button>
              );
            })}
          </div>
        </div>

        <Glass
          variant="smoked"
          className="mx-auto max-w-[820px] p-6 sm:p-12 border border-line bg-bg-1/90 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)]"
        >
          <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
            <input
              type="text"
              name="website"
              value={payload.website}
              onChange={(e) => update('website', e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="sr-only"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FieldWrap label="Your Name" required error={errors.name}>
                <TextField
                  value={payload.name}
                  onChange={(e) => update('name', e.target.value)}
                  error={errors.name}
                  placeholder="e.g. Rahul Sharma"
                  autoComplete="name"
                />
              </FieldWrap>
              <FieldWrap label="Work Email" required error={errors.email}>
                <TextField
                  type="email"
                  value={payload.email}
                  onChange={(e) => update('email', e.target.value)}
                  error={errors.email}
                  placeholder="rahul@company.com"
                  autoComplete="email"
                />
              </FieldWrap>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FieldWrap label="Phone / WhatsApp Number" hint="Optional">
                <TextField
                  type="tel"
                  value={payload.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                />
              </FieldWrap>
              <FieldWrap label="Company / Brand" hint="Optional">
                <TextField
                  value={payload.company}
                  onChange={(e) => update('company', e.target.value)}
                  placeholder="e.g. Acme Innovations"
                  autoComplete="organization"
                />
              </FieldWrap>
            </div>

            <FieldWrap label="System Architecture Type" required error={errors.projectType}>
              <SelectField
                value={payload.projectType}
                onChange={(e) => update('projectType', e.target.value as ContactPayload['projectType'])}
                error={errors.projectType}
              >
                <option value="">Select project classification</option>
                {projectTypeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </SelectField>
            </FieldWrap>

            <FieldWrap
              label="Project Scope &amp; Deliverables"
              required
              error={errors.message}
              hint={`${payload.message.length} characters`}
            >
              <TextAreaField
                rows={5}
                value={payload.message}
                onChange={(e) => update('message', e.target.value)}
                error={errors.message}
                placeholder="Describe what you want to build, who your users are, and any existing tools or workflows in place..."
              />
            </FieldWrap>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FieldWrap label="Target Budget Estimate" hint="Optional">
                <TextField
                  value={payload.budget}
                  onChange={(e) => update('budget', e.target.value)}
                  placeholder="e.g. ₹1.5L – ₹3.5L or $2k–$5k"
                />
              </FieldWrap>
              <FieldWrap label="Target Launch Date" hint="Optional">
                <TextField
                  value={payload.timeline}
                  onChange={(e) => update('timeline', e.target.value)}
                  placeholder="e.g. Within 4 weeks"
                />
              </FieldWrap>
            </div>

            {state === 'error' && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-[0.88rem] text-red-300">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={state === 'submitting'}
              data-cursor="project"
              className="w-full rounded-xl bg-gradient-to-r from-cyan to-signal py-4 text-center font-mono text-[0.84rem] font-bold uppercase tracking-wider text-bg-0 shadow-[0_0_25px_rgba(0,242,254,0.4)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,242,254,0.6)] hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {state === 'submitting' ? 'Transmitting Specifications…' : 'Submit Project Specifications →'}
            </button>

            <p className="mt-3 text-center font-mono text-[0.7rem] text-ink-faint">
              By submitting this form, you acknowledge our{' '}
              <a
                href="/privacy-policy"
                onClick={(e) => {
                  if (onNavigatePrivacy) {
                    e.preventDefault();
                    onNavigatePrivacy();
                  }
                }}
                className="text-cyan underline decoration-cyan/40 underline-offset-2 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>{' '}
              &amp; consent to direct communication.
            </p>
          </form>
        </Glass>

        <div className="mx-auto mt-10 max-w-[820px] text-center">
          <p className="text-[0.9rem] text-ink-faint">
            Need an immediate discussion?{' '}
            <a
              href={siteConfig.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan font-mono underline decoration-cyan/40 underline-offset-4 hover:text-white transition-colors"
            >
              Message Sai Krishna on WhatsApp →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

function Glow() {
  return (
    <div
      className="pointer-events-none absolute -bottom-[20%] left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(0,242,254,0.06), transparent 70%)' }}
    />
  );
}