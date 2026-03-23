import { useState, useMemo } from 'react';
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Filter } from 'lucide-react';
import { QUESTIONS } from '../data/questions';
import { DOMAINS } from '../data/domains';

export default function Practice({ state, updateState }) {
  const [selectedDomain, setSelectedDomain] = useState(0); // 0 = all
  const [difficulty, setDifficulty] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });
  const [sessionActive, setSessionActive] = useState(false);

  const filteredQuestions = useMemo(() => {
    let qs = [...QUESTIONS];
    if (selectedDomain > 0) qs = qs.filter((q) => q.domain === selectedDomain);
    if (difficulty !== 'all') qs = qs.filter((q) => q.difficulty === difficulty);
    // Shuffle
    for (let i = qs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [qs[i], qs[j]] = [qs[j], qs[i]];
    }
    return qs;
  }, [selectedDomain, difficulty, sessionActive]);

  const currentQuestion = filteredQuestions[currentIndex];

  const startSession = () => {
    setSessionActive(true);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setSessionStats({ correct: 0, total: 0 });
  };

  const handleAnswer = (idx) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);

    const isCorrect = idx === currentQuestion.correct;
    setSessionStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    // Record to global state
    updateState((prev) => {
      const newHistory = [
        ...prev.questionHistory,
        {
          questionId: currentQuestion.id,
          correct: isCorrect,
          timestamp: Date.now(),
          domain: currentQuestion.domain,
        },
      ];
      const dp = { ...prev.domainProgress };
      const d = dp[currentQuestion.domain] || { studied: 0, correct: 0, total: 0 };
      dp[currentQuestion.domain] = {
        ...d,
        correct: d.correct + (isCorrect ? 1 : 0),
        total: d.total + 1,
      };
      return { ...prev, questionHistory: newHistory, domainProgress: dp };
    });
  };

  const nextQuestion = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const resetSession = () => {
    setSessionActive(false);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setSessionStats({ correct: 0, total: 0 });
  };

  // Setup screen
  if (!sessionActive) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Practice Questions</h1>
          <p className="text-slate-400 mt-1">Select a domain and difficulty to begin</p>
        </div>

        <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700 space-y-6">
          {/* Domain Selection */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-3 block">Select Domain</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => setSelectedDomain(0)}
                className={`p-3 rounded-lg text-sm text-left transition-colors ${
                  selectedDomain === 0
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All Domains ({QUESTIONS.length} questions)
              </button>
              {DOMAINS.map((d) => {
                const count = QUESTIONS.filter((q) => q.domain === d.id).length;
                return (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDomain(d.id)}
                    className={`p-3 rounded-lg text-sm text-left transition-colors ${
                      selectedDomain === d.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    D{d.id}: {d.name} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-sm font-medium text-slate-300 mb-3 block">Difficulty</label>
            <div className="flex gap-2 flex-wrap">
              {['all', 'easy', 'medium', 'hard'].map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                    difficulty === d
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {d === 'all' ? 'All Levels' : d}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={startSession}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Start Practice ({filteredQuestions.length} questions available)
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-white mb-4">Session Complete!</h2>
        <p className="text-slate-400 mb-2">
          You answered {sessionStats.correct} out of {sessionStats.total} correctly
        </p>
        <p className="text-3xl font-bold text-white mb-8">
          {sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0}%
        </p>
        <button onClick={resetSession} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium">
          Start New Session
        </button>
      </div>
    );
  }

  const domain = DOMAINS.find((d) => d.id === currentQuestion.domain);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Session Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">
            Question {currentIndex + 1} / {filteredQuestions.length}
          </span>
          <span
            className="text-xs px-2 py-1 rounded-full font-medium"
            style={{ backgroundColor: `${domain?.color}20`, color: domain?.color }}
          >
            Domain {currentQuestion.domain}
          </span>
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              currentQuestion.difficulty === 'easy'
                ? 'bg-emerald-500/20 text-emerald-400'
                : currentQuestion.difficulty === 'medium'
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {currentQuestion.difficulty}
          </span>
        </div>
        <div className="text-sm text-slate-400">
          {sessionStats.correct}/{sessionStats.total} correct
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / filteredQuestions.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700">
        <h2 className="text-lg font-medium text-white leading-relaxed mb-6">
          {currentQuestion.question}
        </h2>

        <div className="space-y-3">
          {currentQuestion.options.map((option, idx) => {
            let classes = 'bg-slate-800 border-slate-600 text-slate-300 hover:border-blue-500 cursor-pointer';
            if (selectedAnswer !== null) {
              if (idx === currentQuestion.correct) {
                classes = 'bg-emerald-500/10 border-emerald-500 text-emerald-300';
              } else if (idx === selectedAnswer && idx !== currentQuestion.correct) {
                classes = 'bg-red-500/10 border-red-500 text-red-300';
              } else {
                classes = 'bg-slate-800/50 border-slate-700 text-slate-500';
              }
            }

            return (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={selectedAnswer !== null}
                className={`w-full text-left p-4 rounded-lg border transition-all flex items-start gap-3 ${classes}`}
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-full border border-current flex items-center justify-center text-sm font-medium">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="pt-0.5">{option}</span>
                {selectedAnswer !== null && idx === currentQuestion.correct && (
                  <CheckCircle className="w-5 h-5 text-emerald-400 ml-auto flex-shrink-0 mt-0.5" />
                )}
                {selectedAnswer !== null && idx === selectedAnswer && idx !== currentQuestion.correct && (
                  <XCircle className="w-5 h-5 text-red-400 ml-auto flex-shrink-0 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="bg-[#1e293b] rounded-xl p-6 border border-blue-500/30">
          <h3 className="text-sm font-semibold text-blue-400 mb-2">Explanation</h3>
          <p className="text-slate-300 text-sm leading-relaxed">{currentQuestion.explanation}</p>
          <p className="text-xs text-slate-500 mt-3">Reference: {currentQuestion.reference}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={resetSession}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          End Session
        </button>
        {selectedAnswer !== null && currentIndex < filteredQuestions.length - 1 && (
          <button
            onClick={nextQuestion}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Next Question
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
        {selectedAnswer !== null && currentIndex === filteredQuestions.length - 1 && (
          <button
            onClick={resetSession}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            View Results
          </button>
        )}
      </div>
    </div>
  );
}
