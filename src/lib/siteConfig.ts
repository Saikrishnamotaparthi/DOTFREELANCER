/**
 * Single source of truth for contact details and outbound links.
 * Edit this file to update contact info everywhere on the site.
 */
export const siteConfig = {
  name: 'DotFreelancer',
  founder: 'Sai Krishna Motaparthi',

  contact: {
    email: 'hello@dotfreelancer.dev',
    phone: '+917995988480',
    // Display format, kept separate from the dialable `phone` above.
    phoneDisplay: '+91 79959 88480',
    whatsapp: 'https://wa.me/917995988480',
    linkedin: 'https://www.linkedin.com/in/', // TODO: add real profile URL
    github: 'https://github.com/', // TODO: add real profile URL
  },

  // Client-facing API endpoint the contact form submits to. Points at
  // a serverless function (see /api/contact.ts) — no secrets live here.
  api: {
    contactEndpoint: '/api/contact',
  },
} as const;
