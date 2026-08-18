export interface TechItem {
  name: string;
  badge: string;
  desc: string;
}

export interface TechGroup {
  id: string;
  label: string;
  icon: string;
  items: TechItem[];
}

export const technologies: TechGroup[] = [
  {
    id: 'frontend',
    label: 'Frontend & UI Core',
    icon: '⚡',
    items: [
      { name: 'React 19 & Next.js', badge: 'FRAMEWORK', desc: 'Server components, fast client hydration, and routing.' },
      { name: 'TypeScript', badge: 'TYPE SAFETY', desc: 'Zero runtime bugs with strict end-to-end interface contracts.' },
      { name: 'Tailwind CSS v4', badge: 'STYLING', desc: 'Ultra-fast CSS-first design token architecture.' },
      { name: 'GSAP & Lenis', badge: 'MOTION', desc: 'Hardware-accelerated 60fps scroll choreography.' },
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile, iOS & Android',
    icon: '📱',
    items: [
      { name: 'Flutter (Dart)', badge: 'CROSS-PLATFORM', desc: 'Single codebase compiled natively to iOS and Android at 120fps.' },
      { name: 'iOS App Development', badge: 'APPLE ECOSYSTEM', desc: 'SwiftUI, Apple Pay integration, and App Store deployment.' },
      { name: 'Android Native & PWA', badge: 'GOOGLE PLAY', desc: 'Play Store releases, native hardware APIs, and offline PWAs.' },
      { name: 'React Native', badge: 'HYBRID MOBILE', desc: 'Fast mobile interfaces sharing TypeScript API contracts with the web.' },
    ],
  },
  {
    id: 'backend',
    label: 'Backend & APIs',
    icon: '⚙️',
    items: [
      { name: 'Node.js & Express', badge: 'RUNTIME', desc: 'Event-driven, asynchronous high-throughput backend services.' },
      { name: 'REST & GraphQL APIs', badge: 'PROTOCOLS', desc: 'Structured, versioned endpoints with strict payload validation.' },
      { name: 'WebSockets & Webhooks', badge: 'REALTIME', desc: 'Instant bidirectional event broadcasts and third-party sync.' },
      { name: 'Redis Caching', badge: 'IN-MEMORY', desc: 'Sub-millisecond query caching and atomic rate limiters.' },
    ],
  },
  {
    id: 'database',
    label: 'Database & Cloud',
    icon: '💾',
    items: [
      { name: 'PostgreSQL & Prisma', badge: 'RELATIONAL', desc: 'ACID transactions, indexed schemas, and relational integrity.' },
      { name: 'MongoDB', badge: 'DOCUMENT', desc: 'Flexible JSON documents for high-volume logs and records.' },
      { name: 'AWS & Vercel Edge', badge: 'DEPLOYMENT', desc: 'Global edge networks with auto-scaling and zero-downtime CI/CD.' },
      { name: 'Docker & Microservices', badge: 'CONTAINERS', desc: 'Isolated production environments and reproducible builds.' },
    ],
  },
  {
    id: 'ai-automation',
    label: 'AI & Automation Engine',
    icon: '🤖',
    items: [
      { name: 'n8n Workflow Engine', badge: 'ORCHESTRATION', desc: 'Complex multi-step pipelines connecting 300+ SaaS apps.' },
      { name: 'OpenAI GPT-4o & Gemini', badge: 'LLM AGENTS', desc: 'Intelligent customer assistants, auto-categorizers, and text parsers.' },
      { name: 'WhatsApp Cloud API', badge: 'MESSAGING', desc: 'Direct WhatsApp broadcast, ticketing, and verification bots.' },
      { name: 'Razorpay & Stripe Mesh', badge: 'FINTECH', desc: 'Instant UPI, Cards, NetBanking, and automated refunds.' },
    ],
  },
];
