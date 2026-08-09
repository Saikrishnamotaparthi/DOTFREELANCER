export interface Service {
  num: string;
  name: string;
  description: string;
}

export const services: Service[] = [
  {
    num: '01',
    name: 'Full stack',
    description:
      'The interface, the backend, the database, the APIs and the infrastructure — built by one hand so nothing gets lost in translation between teams.',
  },
  {
    num: '02',
    name: 'SaaS',
    description:
      'From the first screen to a production deployment your first paying customer can actually use — auth, billing, and multi-tenant architecture included.',
  },
  {
    num: '03',
    name: 'Business software',
    description:
      'Billing, CRM, ERP, admin dashboards and the automation that connects them, tailored to how your operation actually runs.',
  },
  {
    num: '04',
    name: 'Marketing systems',
    description:
      'WhatsApp, email and SMS campaigns wired directly into your product data — not a separate tool your team has to babysit.',
  },
  {
    num: '05',
    name: 'Mobile',
    description:
      'Android applications that share the same backend and data as your web platform, so every surface stays in sync.',
  },
  {
    num: '06',
    name: 'AI',
    description:
      'AI-powered workflows, automation and integrations that remove repetitive work from your team\u2019s day, not just a chatbot bolted on top.',
  },
];
