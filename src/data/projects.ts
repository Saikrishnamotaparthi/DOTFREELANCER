export interface ProjectMeta {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  meta: ProjectMeta[];
  flow?: string[];
  note?: string;
  flagship?: boolean;

  /**
   * Where the project lives. Currently a placeholder — swap in the
   * real URL when it's ready. Leaving it empty renders the showcase
   * as non-clickable (no dead links). A value starting with "/" is
   * treated as an internal route instead of opening a new tab.
   */
  url?: string;

  /** Real screenshot, once available. Falls back to the built mockup. */
  image?: string;
  images?: string[];

  description?: string;
  features?: string[];
  technologies?: string[];
  client?: string;
  year?: string;
  category?: string;
}

export const projects: Project[] = [
  {
    id: 'pro-nights',
    title: 'PRAMANA26 | GITAM',
    flagship: true,
    url: 'https://pramana.gitam.edu/',
    category: 'Event platform',
    meta: [
      { label: 'Role', value: 'End-to-end build' },
      { label: 'Stack', value: 'Web \u00b7 Payments \u00b7 QR \u00b7 Dashboard' },
      { label: 'Type', value: 'Flagship case study' },
    ],
    flow: [
      'Visitor',
      'Landing page',
      'Ticket selection',
      'Payment',
      'Payment success',
      'QR pass',
      'Entry scanner',
      'Verification',
      'Organizer dashboard',
      'Live analytics',
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Razorpay', 'WhatsApp API'],
  },
  {
    id: 'restaurant',
    title: 'Restaurant Platform',
    // TODO: replace with the live project URL.
    url: 'https://restaurant-gamma-kohl.vercel.app/',
    category: 'Website + admin system',
    meta: [
      { label: 'Role', value: 'Website + admin system' },
      { label: 'Stack', value: 'QR menu \u00b7 Orders \u00b7 Dashboard' },
    ],
    flow: ['Customer', 'Live menu', 'Order', 'Admin', 'Restaurant dashboard'],
    note: 'Scroll \u2192 the live menu becomes the admin panel that runs it',
    technologies: ['React', 'Node.js', 'MongoDB'],
  },
  {
    id: 'school',
    title: 'School Website',
    // TODO: replace with the live project URL.
    url: 'https://education-beige-three.vercel.app/',
    category: 'Website + CMS',
    meta: [
      { label: 'Role', value: 'Website + CMS' },
      { label: 'Stack', value: 'Admissions \u00b7 Announcements \u00b7 Gallery' },
    ],
    technologies: ['Next.js', 'Sanity CMS'],
  },
  {
    id: 'event-management',
    title: 'Event Management Platform',
    url: 'https://nexuslegacyevents.vercel.app/',
    category: 'Discovery to analytics',
    meta: [
      { label: 'Role', value: 'Discovery to analytics' },
      { label: 'Stack', value: 'Registration \u00b7 Payments \u00b7 QR \u00b7 Dashboard' },
    ],
    flow: ['Discovery', 'Registration', 'Payment', 'Ticket', 'Entry', 'Dashboard'],
    technologies: ['React', 'Node.js', 'Stripe'],
  },
  {
    id: 'anvayaa-productions',
    title: 'Anvayaa Productions',
    // TODO: replace with the live project URL.
    url: 'https://www.anvayaaproductions.in/',
    category: 'Event Production & Luxury Weddings',
    meta: [
      { label: 'Role', value: 'Website Development' },
      { label: 'Stack', value: 'React · Responsive UI · Interactive Experience' },
    ],
    flow: ['Discovery', 'Services', 'Portfolio', 'Events', 'Contact'],
    technologies: ['React', 'Node.js', 'Responsive Design'],
  },
];

export interface Client {
  name: string;
  tags: string[];
  /** Client logo, once available (e.g. `/logos/nexus.svg`). Falls back to a monogram. */
  logo?: string;
}

export const clients: Client[] = [
  {
    name: 'Pramana26',
    tags: [],
    logo: '/pramana.png',
  },
  {
    name: 'Nexus Legacy Events',
    tags: [],
    logo: '/nexus-legacy-events.png',
  },
  {
    name: 'Anvayaa Productions',
    tags: [],
    logo: '/anvayaa-productions.png',
  },
];