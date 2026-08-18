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
   * Where the project lives.
   */
  url?: string;

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
    id: 'solevault',
    title: 'SoleVault E-Commerce',
    flagship: true,
    url: 'https://solevault-lsr4.onrender.com/',
    category: 'Full-Stack E-Commerce & Logistics Platform',
    meta: [
      { label: 'Role', value: 'End-to-End Store & Logistics' },
      { label: 'Stack', value: 'Storefront · Delhivery · Inventory · Payments' },
      { label: 'Type', value: 'Live Production Platform' },
    ],
    flow: [
      'Shopper',
      'Catalog & Search',
      'Cart & Wishlist',
      'Checkout',
      'Razorpay / Stripe',
      'Delhivery Auto-Dispatch',
      'Realtime Tracking',
      'Inventory Auto-Sync',
      'Admin Dashboard',
    ],
    technologies: ['React', 'Node.js', 'MongoDB', 'Delhivery API', 'Razorpay', 'Inventory Sync', 'Webhooks'],
  },
  {
    id: 'pro-nights',
    title: 'PRAMANA26 | GITAM',
    flagship: true,
    url: 'https://pramana.gitam.edu/',
    category: 'Event platform',
    meta: [
      { label: 'Role', value: 'End-to-end build' },
      { label: 'Stack', value: 'Web · Payments · QR · Dashboard' },
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
    url: 'https://restaurant-gamma-kohl.vercel.app/',
    category: 'Website + admin system',
    meta: [
      { label: 'Role', value: 'Website + admin system' },
      { label: 'Stack', value: 'QR menu · Orders · Dashboard' },
    ],
    flow: ['Customer', 'Live menu', 'Order', 'Admin', 'Restaurant dashboard'],
    note: 'Scroll → the live menu becomes the admin panel that runs it',
    technologies: ['React', 'Node.js', 'MongoDB'],
  },
  {
    id: 'anvayaa-productions',
    title: 'Anvayaa Productions',
    url: 'https://www.anvayaaproductions.in/',
    category: 'Event Production & Luxury Weddings',
    meta: [
      { label: 'Role', value: 'Website Development' },
      { label: 'Stack', value: 'React · Responsive UI · Interactive Experience' },
    ],
    flow: ['Discovery', 'Services', 'Portfolio', 'Events', 'Contact'],
    technologies: ['React', 'Node.js', 'Responsive Design'],
  },
  {
    id: 'school',
    title: 'School Website',
    url: 'https://education-beige-three.vercel.app/',
    category: 'Website + CMS',
    meta: [
      { label: 'Role', value: 'Website + CMS' },
      { label: 'Stack', value: 'Admissions · Announcements · Gallery' },
    ],
    technologies: ['Next.js', 'Sanity CMS'],
  },
  {
    id: 'event-management',
    title: 'Nexus Legacy Events',
    url: 'https://nexuslegacyevents.vercel.app/',
    category: 'Discovery to analytics',
    meta: [
      { label: 'Role', value: 'Discovery to analytics' },
      { label: 'Stack', value: 'Registration · Payments · QR · Dashboard' },
    ],
    flow: ['Discovery', 'Registration', 'Payment', 'Ticket', 'Entry', 'Dashboard'],
    technologies: ['React', 'Node.js', 'Stripe'],
  },
];

export interface Client {
  name: string;
  tags: string[];
  logo?: string;
}

export const clients: Client[] = [
  {
    name: 'SoleVault',
    tags: ['E-Commerce'],
    logo: '',
  },
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