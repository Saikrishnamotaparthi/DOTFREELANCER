export interface Service {
  num: string;
  name: string;
  category: string;
  description: string;
  deliverables: string[];
  technologies: string[];
  turnaround: string;
}

export const services: Service[] = [
  {
    num: '01',
    name: 'Full Stack Web Applications',
    category: 'END-TO-END DEVELOPMENT',
    description:
      'The interface, backend, database, APIs, and cloud infrastructure — crafted by one hand so nothing gets lost in translation between separate teams.',
    deliverables: ['Custom React / Next.js UI', 'REST / GraphQL API Server', 'Database Schema & Indexes', 'Cloud Deploy on Vercel/AWS'],
    technologies: ['React 19', 'Node.js', 'PostgreSQL', 'Tailwind CSS', 'Vite'],
    turnaround: '2 - 4 Weeks',
  },
  {
    num: '02',
    name: 'SaaS Platforms & Subscriptions',
    category: 'PRODUCT ENGINEERING',
    description:
      'From the first screen to a production deployment your first paying customer can actually use — auth, billing, customer portals, and multi-tenant security included.',
    deliverables: ['User Auth & Role Management', 'Stripe / Razorpay Recurring Billing', 'Admin Dashboard & Metrics', 'Multi-tenant Architecture'],
    technologies: ['Next.js', 'Prisma / Drizzle', 'Stripe', 'Redis', 'PostgreSQL'],
    turnaround: '3 - 6 Weeks',
  },
  {
    num: '03',
    name: 'Custom Business Software & ERPs',
    category: 'ENTERPRISE OPERATIONS',
    description:
      'Billing, CRM, inventory, admin desks, and the automations that connect them — tailored to how your business operation actually functions.',
    deliverables: ['Custom Operations Portal', 'Live Inventory & Order Trackers', 'Role-based Permissions', 'Automated PDF Invoice Engine'],
    technologies: ['React', 'Node.js', 'MongoDB', 'PostgreSQL', 'Tailwind'],
    turnaround: '2 - 5 Weeks',
  },
  {
    num: '04',
    name: 'WhatsApp & Communication Automation',
    category: 'CUSTOMER CONVERSIONS',
    description:
      'WhatsApp Business API and transactional notifications wired directly into your product database — not a disjointed third-party tool.',
    deliverables: ['WhatsApp Cloud API Integration', 'Instant Order / QR Pass Delivery', 'Automated Lead Triggers', 'Transactional Email Systems'],
    technologies: ['Meta WhatsApp API', 'Webhooks', 'Resend', 'Nodemailer'],
    turnaround: '1 - 2 Weeks',
  },
  {
    num: '05',
    name: 'Mobile & Progressive Web Apps',
    category: 'CROSS-DEVICE',
    description:
      'Android and PWA applications sharing the exact same backend and database as your web platform, ensuring zero data divergence.',
    deliverables: ['Installable PWA / Mobile App', 'Push Notification Triggers', 'Offline-friendly Caching', 'Unified API Sync'],
    technologies: ['PWA', 'React Native / Web', 'Service Workers', 'Capacitor'],
    turnaround: '3 - 5 Weeks',
  },
  {
    num: '06',
    name: 'AI Agent Workflows & n8n',
    category: 'AI AUTOMATION',
    description:
      'AI-powered workflow pipelines, intelligent document parsers, and custom LLM agents that eliminate hours of repetitive manual toil.',
    deliverables: ['n8n Autonomous Workflows', 'LLM Inquiry Triage Assistant', 'Data Extraction Pipelines', 'Webhook CRM Auto-sync'],
    technologies: ['n8n', 'OpenAI GPT-4o', 'Gemini API', 'Vector DB', 'Webhooks'],
    turnaround: '1 - 3 Weeks',
  },
];
