export interface Domain {
  id: number;
  name: string;
  weight: string;
  color: string;
  icon: string;
  topics: string[];
  studyTips: string[];
}

export interface DomainProgress {
  studied: number;
  correct: number;
  total: number;
}
