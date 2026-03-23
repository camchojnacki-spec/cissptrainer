export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: number;
  domain: number;
  difficulty: Difficulty;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  reference: string;
}

export interface QuestionHistoryEntry {
  questionId: number;
  correct: boolean;
  timestamp: number;
  domain: number;
}
