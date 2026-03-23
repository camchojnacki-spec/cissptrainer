import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DomainProgress } from '../types/domain';
import type { QuestionHistoryEntry } from '../types/question';
import type { ExamResult } from '../types/exam';

interface AppState {
  // Study plan
  studyDay: number;
  studyStartDate: string | null;
  completedDays: number[];

  // Questions
  questionHistory: QuestionHistoryEntry[];
  domainProgress: Record<number, DomainProgress>;

  // Exams
  examHistory: ExamResult[];

  // Actions
  startStudyPlan: () => void;
  toggleStudyDay: (day: number) => void;
  recordAnswer: (questionId: number, domain: number, isCorrect: boolean) => void;
  recordExam: (result: ExamResult) => void;
  resetProgress: () => void;
}

const initialDomainProgress: Record<number, DomainProgress> = {
  1: { studied: 0, correct: 0, total: 0 },
  2: { studied: 0, correct: 0, total: 0 },
  3: { studied: 0, correct: 0, total: 0 },
  4: { studied: 0, correct: 0, total: 0 },
  5: { studied: 0, correct: 0, total: 0 },
  6: { studied: 0, correct: 0, total: 0 },
  7: { studied: 0, correct: 0, total: 0 },
  8: { studied: 0, correct: 0, total: 0 },
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      studyDay: 1,
      studyStartDate: null,
      completedDays: [],
      questionHistory: [],
      domainProgress: { ...initialDomainProgress },
      examHistory: [],

      startStudyPlan: () =>
        set({ studyStartDate: new Date().toISOString(), studyDay: 1 }),

      toggleStudyDay: (day: number) =>
        set((state) => {
          const isCompleted = state.completedDays.includes(day);
          const newCompleted = isCompleted
            ? state.completedDays.filter((d) => d !== day)
            : [...state.completedDays, day];
          const maxCompleted = Math.max(...newCompleted, 0);
          return { completedDays: newCompleted, studyDay: maxCompleted + 1 };
        }),

      recordAnswer: (questionId: number, domain: number, isCorrect: boolean) =>
        set((state) => {
          const entry: QuestionHistoryEntry = {
            questionId,
            correct: isCorrect,
            timestamp: Date.now(),
            domain,
          };
          const dp = { ...state.domainProgress };
          const current = dp[domain] || { studied: 0, correct: 0, total: 0 };
          dp[domain] = {
            ...current,
            correct: current.correct + (isCorrect ? 1 : 0),
            total: current.total + 1,
          };
          return {
            questionHistory: [...state.questionHistory, entry],
            domainProgress: dp,
          };
        }),

      recordExam: (result: ExamResult) =>
        set((state) => ({
          examHistory: [...state.examHistory, result],
        })),

      resetProgress: () =>
        set({
          studyDay: 1,
          studyStartDate: null,
          completedDays: [],
          questionHistory: [],
          domainProgress: { ...initialDomainProgress },
          examHistory: [],
        }),
    }),
    { name: 'cissp-trainer' }
  )
);
