export interface ProcessStep {
  num: string;
  label: string;
}

export const processSteps: ProcessStep[] = [
  { num: '01', label: 'Idea' },
  { num: '02', label: 'Architecture' },
  { num: '03', label: 'Design' },
  { num: '04', label: 'Build' },
  { num: '05', label: 'Connect' },
  { num: '06', label: 'Deploy' },
  { num: '07', label: 'Scale' },
];
