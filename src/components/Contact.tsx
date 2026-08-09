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

export default function Contact() {
  const [payload, setPayload] = useState<ContactPayload>(emptyPayload);
  const [errors, setErrors] = useState<ContactFieldErrors>({});
  const [state, setState] = useState<FormState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  function update<K extends keyof ContactPayload>(key: K, value: ContactPayload[K]) {
    setPayload((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
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
      setState('success');
    } else {
      setState('error');
      setErrorMessage(result.error || 'Something went wrong. Please try again or contact me directly on WhatsApp.');
    }
  }

  if (state === 'success') {
    return (
      <section id="contact" className="relative py-45 text-center">
        <Glow />
        <div className="wrap relative">
          <div className="mx-auto max-w-[480px]">
            <div className="eyebrow mb-5">Project received ✓</div>
            <h2 className="font-display text-[clamp(2rem,6vw,3.4rem)] font-semibold leading-[1.05]">
              Thank you, {payload.name.split(' ')[0]}.
            </h2>
            <p className="mt-6 text-ink-dim">
              Your project details are with me. I'll review them and get back to you shortly — keep an eye on your
              inbox for a confirmation email.
            </p>
            <div className="mt-11 flex flex-wrap justify-center gap-4">
              <a
                href="#hero"
                className="inline-flex items-center gap-2.5 rounded-full border border-line-strong px-6.5 py-3.5 text-[0.88rem] text-ink transition-all duration-300 hover:-translate-y-0.5 hover:border-brass"
              >
                Back to DotFreelancer
              </a>
              <a
                href={siteConfig.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="project"
                className="inline-flex items-center gap-2.5 rounded-full bg-ink px-6.5 py-3.5 text-[0.88rem] font-medium text-[#0a0a0a] transition-transform duration-300 hover:-translate-y-0.5"
              >
                Chat on WhatsApp →
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="relative py-45">
      <Glow />
      <div className="wrap relative">
        <div className="text-center">
          <div className="eyebrow mb-5 flex justify-center">Let's build it</div>
          <h2 className="font-display text-[clamp(2.4rem,8vw,5.6rem)] font-semibold leading-[0.98]">
            What are we
            <br />
            building?
          </h2>
          <p className="mx-auto mt-6 max-w-[46ch] text-ink-dim">
            Tell me what you're starting, and I'll tell you exactly how it gets built.
          </p>
        </div>

        <Glass variant="smoked" className="mx-auto mt-16 max-w-[760px] p-6 md:p-10">
          <form ref={formRef} onSubmit={handleSubmit} noValidate className="relative space-y-6">
            {/* Honeypot — hidden from real visitors, left in the tab flow for screen readers via aria-hidden on the wrapper instead of display:none */}
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
              <FieldWrap label="Name" required error={errors.name}>
                <TextField
                  value={payload.name}
                  onChange={(e) => update('name', e.target.value)}
                  error={errors.name}
                  placeholder="Your name"
                  autoComplete="name"
                />
              </FieldWrap>
              <FieldWrap label="Email" required error={errors.email}>
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
              <FieldWrap label="Phone / WhatsApp" required error={errors.phone}>
                <TextField
                  type="tel"
                  value={payload.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  error={errors.phone}
                  placeholder="+91 00000 00000"
                  autoComplete="tel"
                />
              </FieldWrap>
              <FieldWrap label="Company / Organization" hint="Optional">
                <TextField
                  value={payload.company}
                  onChange={(e) => update('company', e.target.value)}
                  placeholder="Where you work"
                  autoComplete="organization"
                />
              </FieldWrap>
            </div>

            <FieldWrap label="What do you want to build?" required error={errors.projectType}>
              <SelectField
                value={payload.projectType}
                onChange={(e) => update('projectType', e.target.value as ContactPayload['projectType'])}
                error={errors.projectType}
              >
                <option value="">Choose a project type</option>
                {projectTypeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </SelectField>
            </FieldWrap>

            <FieldWrap label="Project details" required error={errors.message} hint={`${payload.message.length} chars`}>
              <TextAreaField
                rows={5}
                value={payload.message}
                onChange={(e) => update('message', e.target.value)}
                error={errors.message}
                placeholder="What are you building, who is it for, and what's already in place?"
              />
            </FieldWrap>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <FieldWrap label="Budget" hint="Optional">
                <TextField
                  value={payload.budget}
                  onChange={(e) => update('budget', e.target.value)}
                  placeholder="e.g. ₹1.5L – ₹3L"
                />
              </FieldWrap>
              <FieldWrap label="Timeline" hint="Optional">
                <TextField
                  value={payload.timeline}
                  onChange={(e) => update('timeline', e.target.value)}
                  placeholder="e.g. Launch in 6 weeks"
                />
              </FieldWrap>
            </div>

            {state === 'error' && (
              <div className="rounded-lg border border-red-400/30 bg-red-400/[0.04] px-4 py-3.5 text-[0.86rem] text-red-300">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={state === 'submitting'}
              data-cursor="project"
              className="w-full rounded-full bg-ink px-6.5 py-4 text-center text-[0.9rem] font-medium tracking-wide text-[#0a0a0a] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {state === 'submitting' ? 'Sending…' : 'Send project brief'}
            </button>
          </form>
        </Glass>

        <div className="mx-auto mt-10 max-w-[760px] text-center">
          <p className="text-[0.86rem] text-ink-faint">
            Prefer a quick conversation?{' '}
            <a
              href={siteConfig.contact.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-dim underline decoration-line-strong underline-offset-4 transition-colors hover:text-brass"
            >
              Chat with me directly on WhatsApp →
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
      className="pointer-events-none absolute -bottom-[20%] left-1/2 h-[900px] w-[900px] -translate-x-1/2 rounded-full"
      style={{ background: 'radial-gradient(circle, rgba(159,185,201,0.08), transparent 60%)' }}
    />
  );
}
