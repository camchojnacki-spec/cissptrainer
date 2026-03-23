const STORAGE_KEY = 'cissp-trainer';

const defaultState = {
  studyDay: 1,
  studyStartDate: null,
  completedDays: [],
  questionHistory: [], // { questionId, correct, timestamp, domain }
  examHistory: [], // { id, date, score, total, timeSpent, domainScores }
  domainProgress: {
    1: { studied: 0, correct: 0, total: 0 },
    2: { studied: 0, correct: 0, total: 0 },
    3: { studied: 0, correct: 0, total: 0 },
    4: { studied: 0, correct: 0, total: 0 },
    5: { studied: 0, correct: 0, total: 0 },
    6: { studied: 0, correct: 0, total: 0 },
    7: { studied: 0, correct: 0, total: 0 },
    8: { studied: 0, correct: 0, total: 0 },
  },
  settings: {
    dailyGoal: 20, // questions per day
    examLength: 50,
  },
};

export function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultState, ...parsed, domainProgress: { ...defaultState.domainProgress, ...parsed.domainProgress } };
    }
  } catch (e) {
    console.warn('Failed to load state:', e);
  }
  return { ...defaultState };
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Failed to save state:', e);
  }
}

export function resetState() {
  localStorage.removeItem(STORAGE_KEY);
  return { ...defaultState };
}
