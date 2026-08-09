export const projectTypeOptions = [
  'Website',
  'Android App',
  'SaaS',
  'Business Software',
  'Automation',
  'Marketing Platform',
  'AI Integration',
  'Something New',
] as const;

export type ProjectType = (typeof projectTypeOptions)[number];

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  company?: string;
  projectType: ProjectType | '';
  message: string;
  budget?: string;
  timeline?: string;
  /** Honeypot — must arrive empty. Any value marks the submission as spam. */
  website?: string;
}

export type ContactFieldErrors = Partial<Record<keyof ContactPayload, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Shared so the client can show inline errors instantly and the
 * server can reject bad payloads even if JS validation was bypassed.
 */
export function validateContact(payload: ContactPayload): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  if (!payload.name?.trim()) errors.name = 'Your name is required.';
  if (!payload.email?.trim()) {
    errors.email = 'Your email is required.';
  } else if (!EMAIL_RE.test(payload.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }
  if (!payload.phone?.trim()) errors.phone = 'A phone or WhatsApp number is required.';
  if (!payload.projectType) errors.projectType = 'Choose what you want to build.';
  if (!payload.message?.trim() || payload.message.trim().length < 10) {
    errors.message = 'Add a few details about the project (10+ characters).';
  }

  return errors;
}
