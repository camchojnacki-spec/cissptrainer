export interface DomainScore {
  correct: number;
  total: number;
}

export interface ExamResult {
  id: number;
  date: string;
  score: number;
  total: number;
  timeSpent: number;
  domainScores: Record<number, DomainScore>;
}
