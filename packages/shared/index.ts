export interface Cliche {
  id: string;
  phrase: string;
  category: 'business' | 'tech' | 'academic' | 'marketing' | 'other';
  severity: number;
  matchType: 'exact' | 'word' | 'phrase';
  alternatives: string[];
  explanation: string;
  count?: number;
  positions?: number[];
}

export interface Analysis {
  id?: string;
  inputText: string;
  outputText?: string;
  clichesFound: number;
  healthScore: number;
  clicheList: Cliche[];
  status: 'analyzed' | 'saved';
  createdAt?: string;
}

export interface User {
  id: string;
  email: string;
  subscriptionTier: 'free' | 'pro' | 'team';
  analysesUsed: number;
  createdAt: string;
}
