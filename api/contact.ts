// Deploy target: Vercel (or any host that treats /api/*.ts files as
// serverless functions with a (req, res) Node-style handler). If you
// deploy elsewhere (Netlify, Cloudflare, a custom Express server),
// port this handler's body into that platform's function signature —
// the validation/email logic underneath is platform-agnostic.
//
// Sends mail through Gmail's SMTP server using a Google Account App
// Password — no third-party email API/provider involved.
//
// Required environment variables (set in your hosting provider's
// dashboard, never committed, never sent to the client):
//
//   GMAIL_USER          - the Gmail address that sends the mail,
//                          e.g. yourname@gmail.com
//   GMAIL_APP_PASSWORD   - a 16-character Google App Password
//                          (Google Account → Security → 2-Step
//                          Verification → App Passwords). This is
//                          NOT your normal Gmail login password.
//   CONTACT_TO_EMAIL     - inbox that should receive new leads
//                          (can be the same as GMAIL_USER, or any
//                          inbox you check)
//
// See .env.example and the README for step-by-step setup.

import nodemailer from 'nodemailer';
import { validateContact } from '../src/lib/contact-types.js';
import type { ContactPayload } from '../src/lib/contact-types.js';

interface VercelRequest {
  method?: string;
  body?: unknown;
  headers: Record<string, string | string[] | undefined>;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => void;
}

// Best-effort in-memory rate limit. Serverless instances are
// short-lived and multiplied across regions, so this will not catch
// every abuser — it just stops the obvious repeat-submit case within
// a single warm instance. Swap for Upstash/Redis if you need real
// rate limiting across instances.
const submissions = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (submissions.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  submissions.set(ip, timestamps);
  return timestamps.length > MAX_PER_WINDOW;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function ownerEmailHtml(payload: ContactPayload): string {
  const rows: [string, string][] = [
    ['Name', payload.name],
    ['Email', payload.email],
    ['Phone / WhatsApp', payload.phone],
    ['Company', payload.company || '—'],
    ['Project type', payload.projectType],
    ['Budget', payload.budget || '—'],
    ['Timeline', payload.timeline || '—'],
  ];

  return `
    <div style="font-family:Helvetica,Arial,sans-serif;background:#08090b;color:#f2f0eb;padding:32px;">
      <h2 style="margin:0 0 4px;font-size:20px;">New project inquiry</h2>
      <p style="color:#a7a8ad;font-size:13px;margin:0 0 24px;">via dotfreelancer.dev</p>
      <table style="width:100%;border-collapse:collapse;">
        ${rows
          .map(
            ([label, value]) => `
          <tr>
            <td style="padding:8px 0;color:#5c5f66;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;width:160px;vertical-align:top;">${escapeHtml(label)}</td>
            <td style="padding:8px 0;font-size:14px;">${escapeHtml(value)}</td>
          </tr>`,
          )
          .join('')}
      </table>
      <div style="margin-top:24px;padding-top:24px;border-top:1px solid #232323;">
        <div style="color:#5c5f66;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Project details</div>
        <p style="font-size:14px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(payload.message)}</p>
      </div>
      <p style="margin-top:24px;color:#5c5f66;font-size:12px;">Submitted at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
    </div>
  `;
}

function visitorEmailHtml(name: string, whatsappUrl: string): string {
  return `
    <div style="font-family:Helvetica,Arial,sans-serif;background:#08090b;color:#f2f0eb;padding:32px;text-align:center;">
      <div style="font-size:14px;letter-spacing:0.05em;color:#c9a876;margin-bottom:24px;">DOTFREELANCER</div>
      <h2 style="margin:0 0 16px;font-size:22px;">Thanks for reaching out, ${escapeHtml(name)}.</h2>
      <p style="color:#a7a8ad;font-size:14px;line-height:1.7;max-width:420px;margin:0 auto 28px;">
        I've received your project details and will review them shortly.
        I'll get back to you as soon as possible.
      </p>
      <p style="color:#a7a8ad;font-size:14px;line-height:1.7;max-width:420px;margin:0 auto 28px;">
        If you'd like to discuss the project directly, you can also reach me on WhatsApp.
      </p>
      <a href="${whatsappUrl}" style="display:inline-block;background:#f2f0eb;color:#0a0a0a;padding:14px 28px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:600;">
        Chat on WhatsApp
      </a>
      <p style="margin-top:36px;color:#5c5f66;font-size:12px;">Sai Krishna Motaparthi · DotFreelancer</p>
    </div>
  `;
}

let cachedTransporter: nodemailer.Transporter | null = null;

function getTransporter(user: string, appPassword: string): nodemailer.Transporter {
  // Reused across invocations of the same warm serverless instance so
  // we're not opening a fresh SMTP connection on every request.
  if (cachedTransporter) return cachedTransporter;

  cachedTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass: appPassword, // Google App Password, not the account password
    },
  });

  return cachedTransporter;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const ip =
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    (req.headers['x-real-ip'] as string) ||
    'unknown';

  if (isRateLimited(ip)) {
    res.status(429).json({ error: 'Too many submissions. Please try again later.' });
    return;
  }

  const payload = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) as ContactPayload;

  // Honeypot — a real visitor never fills this field.
  if (payload.website) {
    res.status(200).json({ ok: true });
    return;
  }

  const errors = validateContact(payload);
  if (Object.keys(errors).length > 0) {
    res.status(400).json({ error: 'Please check the highlighted fields.', fieldErrors: errors });
    return;
  }

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const toEmail = process.env.CONTACT_TO_EMAIL || gmailUser;

  if (!gmailUser || !gmailAppPassword || !toEmail) {
    console.error('Contact API is missing required env vars (GMAIL_USER / GMAIL_APP_PASSWORD / CONTACT_TO_EMAIL).');
    res.status(500).json({ error: 'Email service is not configured yet. Please reach out via WhatsApp instead.' });
    return;
  }

  const whatsappUrl = 'https://wa.me/917995988480';
  const transporter = getTransporter(gmailUser, gmailAppPassword);

  try {
    // 1. Notify the studio — reply-to is set to the visitor so hitting
    //    "Reply" in Gmail goes straight back to them.
    await transporter.sendMail({
      from: `DotFreelancer <${gmailUser}>`,
      to: toEmail,
      replyTo: payload.email,
      subject: `New DotFreelancer Project Inquiry — ${payload.projectType}`,
      html: ownerEmailHtml(payload),
    });

    // 2. Confirm to the visitor. Failure here shouldn't fail the whole
    //    request — the lead is already captured for the studio.
    try {
      await transporter.sendMail({
        from: `DotFreelancer <${gmailUser}>`,
        to: payload.email,
        subject: 'Thanks for reaching out to DotFreelancer',
        html: visitorEmailHtml(payload.name, whatsappUrl),
      });
    } catch (visitorErr) {
      console.error('Visitor confirmation email failed:', visitorErr);
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact submission failed:', err);
    res.status(502).json({ error: 'Could not send your message right now. Please try WhatsApp instead.' });
  }
}
