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

export default function Contact() {
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
              <span className="absolute inset-0 rounded-full border border-cyan/30 animate-ping" />
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 12.5L9.5 18L20 6"
                  stroke="#00f2fe"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="cyber-badge-emerald mb-3">● PROJECT BRIEF TRANSMITTED</div>
            <h2 className="font-display text-[clamp(2rem,5vw,3rem)] font-bold text-ink">
              Thank you, {payload.name.split(' ')[0]}.
            </h2>
            <p className="mx-auto mt-4 max-w-[44ch] text-ink-dim text-[0.96rem] leading-relaxed">
              Your system specifications have been ingested. A confirmation receipt is dispatched to{' '}
              <span className="text-cyan font-mono">{payload.email}</span>.
            </p>

            <div className="mx-auto mt-10 max-w-[460px] space-y-4 border-t border-line pt-8 text-left">
              {nextSteps.map((step) => (
                <div key={step.num} className="flex gap-4">
                  <span className="font-mono text-xs text-cyan font-bold">{step.num} //</span>
                  <span className="text-[0.88rem] leading-relaxed text-ink-dim">{step.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a
                href="#hero"
                className="inline-flex items-center gap-2.5 rounded-xl border border-line-strong px-6 py-3.5 font-mono text-[0.78rem] uppercase tracking-wider text-ink transition-all duration-300 hover:border-cyan hover:text-cyan"
              >
                Return to Top
              </a>

              <a
                href={siteConfig.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="project"
                className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan to-signal px-7 py-3.5 font-mono text-[0.78rem] font-semibold uppercase tracking-wider text-bg-0 shadow-[0_0_20px_rgba(0,242,254,0.4)] hover:scale-105 transition-all"
              >
                Instant WhatsApp Chat →
              </a>
            </div>

            <div className="mt-8 font-mono text-[0.64rem] tracking-wider text-ink-faint">
              DOSSIER IDENTIFIER // {refId}
            </div>
          </Glass>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-24 md:py-36 relative overflow-hidden">
      <Glow />
      <div className="wrap relative">
        <div className="text-center pb-12">
          <div className="eyebrow mb-4 flex justify-center">Engineering Intake</div>
          <h2 className="font-display text-[clamp(2.4rem,7vw,5.2rem)] font-bold leading-[0.98]">
            Let’s build your <br />
            <span className="bg-gradient-to-r from-cyan to-signal bg-clip-text text-transparent">
              complete digital system.
            </span>
          </h2>
          <p className="mx-auto mt-5 max-w-[48ch] text-[1.02rem] text-ink-dim leading-relaxed">
            Specify your requirements below. I’ll evaluate your architecture and provide a turnkey deployment plan.
          </p>
        </div>

        {/* Customer Interactive Feature Selector */}
        <div className="mx-auto max-w-[820px] mb-8 rounded-2xl border border-cyan/20 bg-bg-1/80 backdrop-blur-2xl p-6 shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
          <div className="font-mono text-[0.68rem] text-cyan uppercase tracking-widest mb-3">
            INTERACTIVE SCOPE CONFIGURATOR // SELECT DESIRED MODULES
          </div>
          <div className="flex flex-wrap gap-2.5">
            {featurePills.map((feature) => {
              const isSelected = selectedFeatures.includes(feature);
              return (
                <button
                  key={feature}
                  type="button"
                  onClick={() => toggleFeature(feature)}
                  className={`px-3.5 py-2 rounded-xl font-mono text-[0.72rem] transition-all duration-300 flex items-center gap-2 ${
                    isSelected
                      ? 'border border-cyan bg-cyan/20 text-cyan shadow-[0_0_15px_rgba(0,242,254,0.25)] font-semibold'
                      : 'border border-line bg-surface/50 text-ink-dim hover:border-line-strong hover:text-ink'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-cyan' : 'bg-ink-faint'}`} />
                  <span>{feature}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Container */}
        <Glass variant="smoked" className="mx-auto max-w-[820px] p-6 sm:p-10 border border-line-strong bg-bg-1/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <form ref={formRef} onSubmit={handleSubmit} noValidate className="relative space-y-6">
            {/* Honeypot */}
            <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
              <label>
                Company website
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={payload.website}
                  onChange={(e) => update('website', e.target.value)}
                />
              </label>
            </div>

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
              <FieldWrap label="Email Address" required error={errors.email}>
                <TextField
                  type="email"
                  value={payload.email}
                  onChange={(e) => update('email', e.target.value)}
                  error={errors.email}
                  placeholder="you@company.com"
                  autoComplete="email"
                />
              </FieldWrap>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FieldWrap label="Phone / WhatsApp Number" required error={errors.phone}>
                <TextField
                  type="tel"
                  value={payload.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  error={errors.phone}
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
              className="w-full rounded-xl bg-gradient-to-r from-cyan to-signal py-4 text-center font-mono text-[0.84rem] font-bold uppercase tracking-wider text-bg-0 shadow-[0_0_25px_rgba(0,242,254,0.4)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,242,254,0.6)] hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {state === 'submitting' ? 'Transmitting Specifications…' : 'Submit Project Specifications →'}
            </button>
          </form>
        </Glass>

        {/* WhatsApp Direct Option */}
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