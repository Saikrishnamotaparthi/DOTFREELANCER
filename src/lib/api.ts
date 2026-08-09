import { siteConfig } from './siteConfig';
import type { ContactPayload } from './contact-types';

export interface SubmitContactResult {
  ok: boolean;
  error?: string;
}

export async function submitContact(payload: ContactPayload): Promise<SubmitContactResult> {
  try {
    const res = await fetch(siteConfig.api.contactEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return { ok: false, error: data?.error || 'Something went wrong. Please try again.' };
    }

    return { ok: true };
  } catch {
    return { ok: false, error: 'Network error — please check your connection and try again.' };
  }
}
