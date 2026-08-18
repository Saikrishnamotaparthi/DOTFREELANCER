export interface ProcessStep {
  num: string;
  label: string;
  tagline: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    num: '01',
    label: 'Discovery & Scope',
    tagline: 'REQUIREMENTS AUDIT',
    description: 'We clarify the core business bottleneck, target audience, and precise feature roadmap.',
  },
  {
    num: '02',
    label: 'System Blueprint',
    tagline: 'DATABASE & API ARCHITECTURE',
    description: 'Defining database schemas, auth mechanisms, webhook security, and scalable cloud stack.',
  },
  {
    num: '03',
    label: 'High-Fidelity Interface',
    tagline: 'CYBER-LUXURY UI/UX',
    description: 'Crafting responsive, conversion-focused user interfaces with rich micro-animations.',
  },
  {
    num: '04',
    label: 'Full-Stack Engineering',
    tagline: 'CLEAN, TYPE-SAFE CODE',
    description: 'Developing frontend components, REST/GraphQL APIs, and high-throughput backend services.',
  },
  {
    num: '05',
    label: 'Integration & Automation',
    tagline: 'PAYMENTS, WHATSAPP & n8n',
    description: 'Wiring up Razorpay/Stripe, WhatsApp Cloud API, automated notifications, and AI agents.',
  },
  {
    num: '06',
    label: 'Production Deployment',
    tagline: 'CI/CD & DOMAIN LIVE',
    description: 'Deploying to high-availability cloud infrastructure with SSL, edge caching, and 99.9% uptime.',
  },
  {
    num: '07',
    label: 'Scale & Optimization',
    tagline: 'METRICS & CONTINUOUS VALUE',
    description: 'Monitoring live user telemetry, scaling backend queries, and deploying feature enhancements.',
  },
];
