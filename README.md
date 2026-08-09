# DotFreelancer

Production implementation of the approved DotFreelancer design — a
scroll-driven, glass-material portfolio for Sai Krishna Motaparthi.

## Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4 (design tokens defined in `src/index.css` via `@theme`)
- GSAP + ScrollTrigger for scroll choreography
- Lenis for smooth scrolling, synced to GSAP's ticker

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # type-check + production build to dist/
npm run preview   # serve the production build locally
```

## Structure

```
api/
  contact.ts    serverless function — validates, honeypot-checks, rate-limits,
                sends owner notification + visitor confirmation via Resend
src/
  components/   one component per section (Hero, Ecosystem, ProcessTimeline, ...)
  data/         editable content — services.ts, projects.ts, ecosystem.ts, etc.
  hooks/        useMouseParallax, useScrollAnimation, useMediaQuery, useReducedMotion
  lib/          gsap.ts, lenis.ts, siteConfig.ts (contact info), api.ts (client
                fetch to /api/contact), contact-types.ts (shared validation)
  index.css     design tokens (@theme) + glass/cursor/grain system
```

## Contact form & email

The contact form posts to `/api/contact`, a serverless function (Vercel
convention — any file under `/api` becomes a function automatically on
deploy). It validates the payload, rejects honeypot submissions, applies
a best-effort per-IP rate limit, then sends two emails through **Gmail's
SMTP server using a Google App Password** (via `nodemailer` — no
third-party email API or provider involved): a notification to you
(with `reply_to` set to the visitor, so hitting reply goes straight to
them) and a branded confirmation to the visitor with a WhatsApp CTA.

### Setting up the Gmail App Password

1. Turn on **2-Step Verification** on the Google account you want to
   send from, if it isn't already: `myaccount.google.com/security`.
2. Go to `myaccount.google.com/apppasswords` (only visible once 2-Step
   Verification is on).
3. Create a new App Password — name it something like "DotFreelancer
   contact form" — and copy the 16-character password it generates.
   This is **not** your normal Gmail login password, and Google only
   shows it once.

**Required environment variables** (set in your hosting provider's
dashboard — see `.env.example`):

```
GMAIL_USER            the Gmail address that sends the mail, e.g. yourname@gmail.com
GMAIL_APP_PASSWORD     the 16-character App Password from step 3 above
CONTACT_TO_EMAIL       inbox that should receive new leads (defaults to GMAIL_USER)
```

None of these are prefixed `VITE_`, so Vite never bundles them into
client-side JS — they only exist inside the serverless function at
runtime. If you deploy somewhere other than Vercel, port the handler
body in `api/contact.ts` into that platform's function signature; the
validation/email logic itself doesn't need to change.

Gmail SMTP has a sending cap (roughly 500 messages/day on a standard
account), which is generous for a contact form but worth knowing if
volume ever grows — at that point a dedicated transactional provider
would make more sense.

## Editing content

Copy, project details, service descriptions, tech groups and client
names all live in `src/data/*.ts` — update those files rather than the
components to change content without touching layout or animation code.

## Notes

- Proof-section stats (`src/components/Proof.tsx`) reflect real figures
  as of the last update (9+ projects shipped, 5+ clients) — update the
  `items` array directly when those numbers change.
- All contact details (email, phone, WhatsApp link, LinkedIn, GitHub)
  live in one place: `src/lib/siteConfig.ts`. Update them there and
  every section (footer, contact form, WhatsApp CTAs) picks it up.
- Project links live in `src/data/projects.ts` as `project.url`. A
  project renders as non-clickable (no dead link, no hover affordance)
  until you add a real URL — set it and the whole project block
  becomes clickable automatically, opening in a new tab unless the
  URL starts with `/` (treated as an internal route).
- `prefers-reduced-motion` is respected throughout: the loader, hero
  intro, cursor, and scroll-scrubbed animations all fall back to a
  static, fully accessible layout.
- The custom cursor is disabled below 861px and on any device
  reporting reduced motion; focus states remain visible via
  `:focus-visible` regardless of cursor state.
