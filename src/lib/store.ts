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

  // Computed helpers
  getStudyDaysCount: () => number;
  getStudyStreak: () => number;
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

function getDistinctDays(history: QuestionHistoryEntry[]): string[] {
  const daySet = new Set<string>();
  for (const entry of history) {
    daySet.add(new Date(entry.timestamp).toDateString());
  }
  return [...daySet].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
}

function computeStreak(history: QuestionHistoryEntry[]): number {
  if (history.length === 0) return 0;

  const days = getDistinctDays(history);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastDay = new Date(days[days.length - 1]);
  lastDay.setHours(0, 0, 0, 0);

  // If last activity wasn't today or yesterday, streak is 0
  const diffFromToday = Math.floor((today.getTime() - lastDay.getTime()) / 86400000);
  if (diffFromToday > 1) return 0;

  let streak = 1;
  for (let i = days.length - 1; i > 0; i--) {
    const current = new Date(days[i]);
    const previous = new Date(days[i - 1]);
    current.setHours(0, 0, 0, 0);
    previous.setHours(0, 0, 0, 0);
    const diff = Math.floor((current.getTime() - previous.getTime()) / 86400000);
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
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
          return {
            completedDays: newCompleted,
            studyDay: maxCompleted + 1,
            // Auto-start study plan on first day completion
            studyStartDate: state.studyStartDate || new Date().toISOString(),
          };
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
            // Auto-initialize study start date on first activity
            studyStartDate: state.studyStartDate || new Date().toISOString(),
          };
        }),

      recordExam: (result: ExamResult) =>
        set((state) => ({
          examHistory: [...state.examHistory, result],
          // Auto-initialize on exam too
          studyStartDate: state.studyStartDate || new Date().toISOString(),
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

      getStudyDaysCount: () => {
        return getDistinctDays(get().questionHistory).length;
      },

      getStudyStreak: () => {
        return computeStreak(get().questionHistory);
      },
    }),
    { name: 'cissp-trainer' }
  )
);
