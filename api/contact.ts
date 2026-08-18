// Deploy target: Vercel (or any host that treats /api/*.ts files as
// serverless functions with a (req, res) Node-style handler). If you
// deploy elsewhere (Netlify, Cloudflare, a custom Express server),
// port this handler's body into that platform's function signature —
// the validation/email logic underneath is platform-agnostic.
//
// Sends mail through Gmail's SMTP server using a Google Account App
// Password — no third-party email API/provider involved.
//
// Required environment variables:
//   GMAIL_USER          - e.g. yourname@gmail.com
//   GMAIL_APP_PASSWORD   - 16-character Google App Password
//   CONTACT_TO_EMAIL     - inbox that should receive new leads

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
  const cleanPhone = payload.phone.replace(/[^0-9]/g, '');
  const waLink = `https://wa.me/${cleanPhone}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Project Dossier</title>
    </head>
    <body style="margin:0;padding:0;background-color:#050608;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#050608;padding:32px 16px;">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#0c0e14;border:1px solid #1e293b;border-radius:16px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.8);">
              
              <!-- Header Bar -->
              <tr>
                <td style="padding:28px 32px;background:linear-gradient(135deg,#0e1726,#07090e);border-bottom:1px solid #1e293b;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td>
                        <span style="font-family:monospace;font-size:11px;letter-spacing:0.18em;color:#00f2fe;text-transform:uppercase;font-weight:700;">
                          ● INCOMING PROJECT DOSSIER
                        </span>
                        <h1 style="margin:6px 0 0;font-size:22px;color:#f8fafc;font-weight:700;">
                          ${escapeHtml(payload.projectType || 'Project Inquiry')}
                        </h1>
                      </td>
                      <td align="right" valign="top">
                        <span style="display:inline-block;padding:4px 10px;border-radius:20px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.4);color:#34d399;font-size:11px;font-family:monospace;font-weight:600;">
                          NEW LEAD
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Client Specs Table -->
              <tr>
                <td style="padding:28px 32px;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
                    <tr>
                      <td style="padding:10px 0;border-bottom:1px solid #18202f;color:#64748b;font-size:12px;font-family:monospace;text-transform:uppercase;width:140px;">Client Name</td>
                      <td style="padding:10px 0;border-bottom:1px solid #18202f;color:#f8fafc;font-size:14px;font-weight:600;">${escapeHtml(payload.name)}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;border-bottom:1px solid #18202f;color:#64748b;font-size:12px;font-family:monospace;text-transform:uppercase;">Email</td>
                      <td style="padding:10px 0;border-bottom:1px solid #18202f;color:#38bdf8;font-size:14px;">
                        <a href="mailto:${escapeHtml(payload.email)}" style="color:#38bdf8;text-decoration:none;">${escapeHtml(payload.email)}</a>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;border-bottom:1px solid #18202f;color:#64748b;font-size:12px;font-family:monospace;text-transform:uppercase;">Phone / WhatsApp</td>
                      <td style="padding:10px 0;border-bottom:1px solid #18202f;color:#f8fafc;font-size:14px;">${escapeHtml(payload.phone)}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;border-bottom:1px solid #18202f;color:#64748b;font-size:12px;font-family:monospace;text-transform:uppercase;">Company / Org</td>
                      <td style="padding:10px 0;border-bottom:1px solid #18202f;color:#f8fafc;font-size:14px;">${escapeHtml(payload.company || '—')}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;border-bottom:1px solid #18202f;color:#64748b;font-size:12px;font-family:monospace;text-transform:uppercase;">Target Budget</td>
                      <td style="padding:10px 0;border-bottom:1px solid #18202f;color:#34d399;font-size:14px;font-weight:700;">${escapeHtml(payload.budget || 'To be discussed')}</td>
                    </tr>
                    <tr>
                      <td style="padding:10px 0;color:#64748b;font-size:12px;font-family:monospace;text-transform:uppercase;">Timeline</td>
                      <td style="padding:10px 0;color:#f8fafc;font-size:14px;">${escapeHtml(payload.timeline || 'Flexible')}</td>
                    </tr>
                  </table>

                  <!-- Scope Message Box -->
                  <div style="margin-top:24px;padding:20px;border-radius:12px;background-color:#111520;border:1px solid #1e293b;">
                    <div style="font-family:monospace;font-size:11px;color:#00f2fe;text-transform:uppercase;margin-bottom:8px;letter-spacing:0.1em;font-weight:700;">
                      PROJECT SPECIFICATIONS //
                    </div>
                    <div style="font-size:14px;line-height:1.65;color:#cbd5e1;white-space:pre-wrap;">${escapeHtml(payload.message)}</div>
                  </div>

                  <!-- Quick Action Buttons -->
                  <div style="margin-top:28px;text-align:center;">
                    <a href="${waLink}" target="_blank" style="display:inline-block;padding:12px 24px;margin:0 6px 10px;background:#25D366;color:#ffffff;font-size:13px;font-weight:700;text-decoration:none;border-radius:8px;">
                      Reply via WhatsApp →
                    </a>
                    <a href="mailto:${escapeHtml(payload.email)}" style="display:inline-block;padding:12px 24px;margin:0 6px 10px;background:#00f2fe;color:#050608;font-size:13px;font-weight:700;text-decoration:none;border-radius:8px;">
                      Reply via Email →
                    </a>
                  </div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:18px 32px;background-color:#080a0f;border-top:1px solid #18202f;text-align:center;">
                  <span style="font-family:monospace;font-size:11px;color:#475569;">
                    DOTFREELANCER INTAKE ENGINE · ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

function visitorEmailHtml(name: string, whatsappUrl: string): string {
  const firstName = escapeHtml(name.split(' ')[0]);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Project Ingested · DotFreelancer</title>
    </head>
    <body style="margin:0;padding:0;background-color:#050608;font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#050608;padding:36px 16px;">
        <tr>
          <td align="center">
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:580px;background-color:#0c0e14;border:1px solid #1e293b;border-radius:16px;overflow:hidden;box-shadow:0 20px 50px rgba(0,0,0,0.8);">
              
              <!-- Header Gradient -->
              <tr>
                <td align="center" style="padding:36px 32px 24px;background:linear-gradient(180deg,#0f172a,#0c0e14);border-bottom:1px solid #18202f;">
                  <div style="font-family:monospace;font-size:12px;letter-spacing:0.24em;color:#00f2fe;text-transform:uppercase;font-weight:700;margin-bottom:10px;">
                    DOTFREELANCER &gt;
                  </div>
                  <h1 style="margin:0;font-size:24px;color:#f8fafc;font-weight:700;">
                    Project brief received, ${firstName}.
                  </h1>
                </td>
              </tr>

              <!-- Body Message -->
              <tr>
                <td style="padding:28px 32px;">
                  <p style="font-size:15px;line-height:1.7;color:#94a3b8;margin:0 0 24px;">
                    Thank you for submitting your project specifications. I have received your details and am reviewing what is technically involved to engineer your digital architecture.
                  </p>

                  <!-- 3-Stage Progress Timeline -->
                  <div style="padding:20px;background-color:#111520;border:1px solid #1e293b;border-radius:12px;margin-bottom:28px;">
                    <div style="font-family:monospace;font-size:11px;color:#00f2fe;text-transform:uppercase;letter-spacing:0.12em;font-weight:700;margin-bottom:14px;">
                      PROJECT WORKFLOW PROTOCOL //
                    </div>
                    
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size:13px;">
                      <tr>
                        <td width="24" valign="top" style="color:#10b981;font-weight:700;">✓</td>
                        <td style="padding-bottom:12px;color:#f8fafc;font-weight:600;">
                          Step 1: Brief Ingestion
                          <div style="color:#64748b;font-weight:400;font-size:12px;margin-top:2px;">Specifications captured &amp; logged in system</div>
                        </td>
                      </tr>
                      <tr>
                        <td width="24" valign="top" style="color:#00f2fe;font-weight:700;">●</td>
                        <td style="padding-bottom:12px;color:#f8fafc;font-weight:600;">
                          Step 2: Technical Architecture Review
                          <div style="color:#64748b;font-weight:400;font-size:12px;margin-top:2px;">Scoping database schemas, APIs, and timeline</div>
                        </td>
                      </tr>
                      <tr>
                        <td width="24" valign="top" style="color:#475569;font-weight:700;">○</td>
                        <td style="color:#94a3b8;font-weight:600;">
                          Step 3: Direct Technical Discussion
                          <div style="color:#64748b;font-weight:400;font-size:12px;margin-top:2px;">Usually within 2 to 6 hours via WhatsApp or Email</div>
                        </td>
                      </tr>
                    </table>
                  </div>

                  <!-- WhatsApp CTA -->
                  <div style="text-align:center;padding:12px 0;">
                    <p style="font-size:13px;color:#64748b;margin:0 0 14px;">
                      Need an immediate response or want to share additional mockups?
                    </p>
                    <a href="${whatsappUrl}" target="_blank" style="display:inline-block;padding:14px 28px;background:linear-gradient(90deg,#00f2fe,#38bdf8);color:#050608;font-size:13px;font-weight:700;text-decoration:none;border-radius:10px;box-shadow:0 0 20px rgba(0,242,254,0.3);">
                      Chat with Sai Krishna on WhatsApp →
                    </a>
                  </div>
                </td>
              </tr>

              <!-- Founder Card -->
              <tr>
                <td style="padding:20px 32px;background-color:#080a0f;border-top:1px solid #18202f;">
                  <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                      <td>
                        <div style="font-size:13px;font-weight:700;color:#f8fafc;">Sai Krishna Motaparthi</div>
                        <div style="font-family:monospace;font-size:11px;color:#00f2fe;">Founder &amp; System Architect · DotFreelancer</div>
                      </td>
                      <td align="right">
                        <span style="font-family:monospace;font-size:11px;color:#475569;">INDIA</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

let cachedTransporter: nodemailer.Transporter | null = null;

function getTransporter(user: string, appPassword: string): nodemailer.Transporter {
  if (cachedTransporter) return cachedTransporter;

  cachedTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass: appPassword,
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

  // Honeypot
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
    // 1. Notify the studio
    await transporter.sendMail({
      from: `DotFreelancer <${gmailUser}>`,
      to: toEmail,
      replyTo: payload.email,
      subject: `⚡ New Project Dossier: ${payload.projectType} — ${payload.name}`,
      html: ownerEmailHtml(payload),
    });

    // 2. Confirm to the client
    try {
      await transporter.sendMail({
        from: `Sai Krishna · DotFreelancer <${gmailUser}>`,
        to: payload.email,
        subject: `Project brief received — DotFreelancer`,
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
