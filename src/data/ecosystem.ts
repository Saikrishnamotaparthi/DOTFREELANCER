export interface EcoNode {
  id: string;
  label: string;
  angle: number; // degrees
  category: string;
  protocol: string;
  tech: string;
  details: string;
}

export const ecosystemNodes: EcoNode[] = [
  {
    id: 'web',
    label: 'High-Performance Web',
    angle: -90,
    category: 'INTERFACE',
    protocol: 'HTTPS / HTTP3 / SSR',
    tech: 'React 19, Next.js, Vite, Tailwind CSS',
    details: 'Conversion-engineered frontends with sub-second page loads, SEO optimization, and rich micro-animations.',
  },
  {
    id: 'saas',
    label: 'Multi-Tenant SaaS',
    angle: -45,
    category: 'PRODUCT ARCHITECTURE',
    protocol: 'REST / GraphQL / WebSockets',
    tech: 'Node.js, PostgreSQL, Auth0, Redis',
    details: 'End-to-end cloud platforms with tenant isolation, role management, seat billing, and usage dashboards.',
  },
  {
    id: 'business',
    label: 'Custom ERP & Portals',
    angle: 0,
    category: 'OPERATIONS',
    protocol: 'JWT / OAuth2 / Realtime Sync',
    tech: 'Custom Admin Desks, Inventory, QR Passes',
    details: 'Internal management tools tailored to your operational workflows, replacing messy Excel sheets and manual logs.',
  },
  {
    id: 'ai',
    label: 'AI Agents & Workflows',
    angle: 45,
    category: 'INTELLIGENCE',
    protocol: 'OpenAI GPT-4o / Gemini / n8n',
    tech: 'Autonomous Agents, Vector DBs, Auto-triaging',
    details: 'Practical AI that analyzes customer inputs, parses PDFs, automates multi-step jobs, and routes notifications.',
  },
  {
    id: 'marketing',
    label: 'WhatsApp & Client Comms',
    angle: 90,
    category: 'CONVERSIONS',
    protocol: 'Meta Cloud API / SMTP / SES',
    tech: 'WhatsApp Business API, Resend, Webhooks',
    details: 'Automated transactional alerts, dynamic payment links, and booking confirmations sent directly to customer phones.',
  },
  {
    id: 'payments',
    label: 'Payment Infrastructure',
    angle: 135,
    category: 'FINTECH',
    protocol: 'PCI-DSS / 256-bit Webhooks',
    tech: 'Razorpay, Stripe, UPI, Subscriptions',
    details: 'Frictionless checkout flows, instant invoice generation, auto-reconciliation, and payment verification scanners.',
  },
  {
    id: 'cloud',
    label: 'Cloud & Database Mesh',
    angle: 180,
    category: 'INFRASTRUCTURE',
    protocol: 'Docker / TLS / Automated Backups',
    tech: 'PostgreSQL, MongoDB, Supabase, Vercel, AWS',
    details: 'Scalable cloud backends with zero downtime, automatic failovers, and rigorous data encryption.',
  },
  {
    id: 'apps',
    label: 'Mobile & Progressive Apps',
    angle: 225,
    category: 'CROSS-PLATFORM',
    protocol: 'PWA / React Native / APIs',
    tech: 'Android PWA, Native APIs, Push Notifications',
    details: 'Fast mobile experiences sharing the exact same backend and database, so all devices stay in sync seamlessly.',
  },
];
