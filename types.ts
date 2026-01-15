
export interface Intention {
  id: string;
  original: string;
  refined: string;
  resonance: number;
  timestamp: number;
  quantumState: 'superposition' | 'collapsed';
  imageUrl?: string;
}

export interface RefinementResult {
  refinedIntention: string;
  explanation: string;
  resonanceScore: number;
  focusKeywords: string[];
  visualPrompt: string;
}

export enum AppState {
  WELCOME = 'WELCOME',
  FORMULATE = 'FORMULATE',
  REFINE = 'REFINE',
  FOCUS = 'FOCUS',
  HISTORY = 'HISTORY'
}
