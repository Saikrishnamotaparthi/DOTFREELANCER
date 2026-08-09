export interface EcoNode {
  label: string;
  angle: number; // degrees
}

export const ecosystemNodes: EcoNode[] = [
  { label: 'Websites', angle: -90 },
  { label: 'Apps', angle: -50 },
  { label: 'SaaS', angle: -10 },
  { label: 'Business software', angle: 30 },
  { label: 'Automation', angle: 70 },
  { label: 'Marketing', angle: 110 },
  { label: 'Payments', angle: 150 },
  { label: 'AI', angle: 190 },
  { label: 'Cloud', angle: 230 },
];
