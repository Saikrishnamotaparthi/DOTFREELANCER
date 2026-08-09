export interface TechGroup {
  label: string;
  items: string[];
}

export const technologies: TechGroup[] = [
  { label: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'] },
  { label: 'Backend', items: ['Node.js', 'Express', 'REST APIs', 'WebSockets'] },
  { label: 'Database', items: ['MongoDB', 'PostgreSQL', 'Firebase', 'Supabase'] },
  { label: 'Cloud', items: ['AWS', 'Docker', 'CI / CD'] },
  { label: 'AI', items: ['OpenAI', 'Gemini', 'AI APIs'] },
  { label: 'Payments & comms', items: ['Razorpay', 'Stripe', 'WhatsApp API', 'Email \u00b7 SMS'] },
];
