import { useState, useEffect, useRef, useMemo } from 'react';
import { Clock, AlertTriangle, CheckCircle, XCircle, ArrowRight, ArrowLeft, Flag } from 'lucide-react';
import { QUESTIONS } from '../data/questions';
import { DOMAINS } from '../data/domains';

export default function Exam({ state, updateState }) {
  const [examActive, setExamActive] = useState(false);
  const [examLength, setExamLength] = useState(50);
  const [examQuestions, setExamQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flagged, setFlagged] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [examFinished, setExamFinished] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const timerRef = useRef(null);

  // Timer
  useEffect(() => {
    if (examActive && !examFinished && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            finishExam();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [examActive, examFinished]);

  const startExam = () => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, examLength);
    setExamQuestions(shuffled);
    setAnswers({});
    setFlagged(new Set());
    setCurrentIndex(0);
    setTimeLeft(examLength * 90); // 1.5 min per question
    setExamActive(true);
    setExamFinished(false);
    setShowReview(false);
  };

  const finishExam = () => {
    clearInterval(timerRef.current);
    setExamFinished(true);

    // Calculate and save results
    let score = 0;
    const domainScores = {};
    examQuestions.forEach((q, i) => {
      const isCorrect = answers[i] === q.correct;
      if (isCorrect) score++;
      if (!domainScores[q.domain]) domainScores[q.domain] = { correct: 0, total: 0 };
      domainScores[q.domain].total++;
      if (isCorrect) domainScores[q.domain].correct++;
    });

    updateState((prev) => ({
      ...prev,
      examHistory: [
        ...prev.examHistory,
        {
          id: Date.now(),
          date: new Date().toISOString(),
          score,
          total: examQuestions.length,
          timeSpent: examLength * 90 - timeLeft,
          domainScores,
        },
      ],
    }));
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const selectAnswer = (idx) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: idx }));
  };

  const toggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(currentIndex)) next.delete(currentIndex);
      else next.add(currentIndex);
      return next;
    });
  };

  // Setup screen
  if (!examActive) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-white">Mock Exam</h1>
          <p className="text-slate-400 mt-1">Simulate the CISSP exam experience</p>
        </div>

        <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700 space-y-6">
          <div>
            <label className="text-sm font-medium text-slate-300 mb-3 block">Number of Questions</label>
            <div className="flex gap-2 flex-wrap">
              {[25, 50, 80].map((n) => (
                <button
                  key={n}
                  onClick={() => setExamLength(n)}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                    examLength === n ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {n} Questions
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Time Limit</span>
              <span className="text-white">{formatTime(examLength * 90)}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Questions</span>
              <span className="text-white">{examLength} (randomly selected)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Passing Score</span>
              <span className="text-white">70%</span>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-300">
              <p className="font-medium mb-1">Exam Simulation Tips</p>
              <ul className="list-disc list-inside text-amber-300/80 space-y-1">
                <li>Read each question carefully before answering</li>
                <li>Flag questions you're unsure about and come back</li>
                <li>Manage your time — don't spend too long on one question</li>
                <li>Look for the BEST or MOST answer, not just a correct one</li>
              </ul>
            </div>
          </div>

          <button
            onClick={startExam}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            Begin Exam
          </button>
        </div>

        {/* Previous Exams */}
        {state.examHistory.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Previous Exams</h2>
            <div className="space-y-3">
              {[...state.examHistory].reverse().slice(0, 5).map((exam) => {
                const pct = Math.round((exam.score / exam.total) * 100);
                const passed = pct >= 70;
                return (
                  <div key={exam.id} className="bg-[#1e293b] rounded-xl p-4 border border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="text-sm text-white font-medium">
                        {exam.score}/{exam.total} ({pct}%)
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(exam.date).toLocaleDateString()} — {formatTime(exam.timeSpent)}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Results screen
  if (examFinished && !showReview) {
    const score = examQuestions.reduce((s, q, i) => s + (answers[i] === q.correct ? 1 : 0), 0);
    const pct = Math.round((score / examQuestions.length) * 100);
    const passed = pct >= 70;

    const domainResults = {};
    examQuestions.forEach((q, i) => {
      if (!domainResults[q.domain]) domainResults[q.domain] = { correct: 0, total: 0 };
      domainResults[q.domain].total++;
      if (answers[i] === q.correct) domainResults[q.domain].correct++;
    });

    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="text-center py-8">
          <div
            className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-4 ${
              passed ? 'bg-emerald-500/20' : 'bg-red-500/20'
            }`}
          >
            {passed ? (
              <CheckCircle className="w-12 h-12 text-emerald-400" />
            ) : (
              <XCircle className="w-12 h-12 text-red-400" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-white">{passed ? 'Congratulations!' : 'Keep Studying!'}</h1>
          <p className="text-slate-400 mt-2">
            {passed ? 'You passed the mock exam!' : 'You need 70% to pass. Review your weak areas.'}
          </p>
          <p className="text-5xl font-bold text-white mt-4">{pct}%</p>
          <p className="text-slate-400 mt-1">
            {score} / {examQuestions.length} correct
          </p>
        </div>

        {/* Domain Breakdown */}
        <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Domain Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(domainResults)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([domainId, result]) => {
                const domain = DOMAINS.find((d) => d.id === Number(domainId));
                const dpct = Math.round((result.correct / result.total) * 100);
                return (
                  <div key={domainId} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-300">D{domainId}: {domain?.name}</span>
                      <span className={dpct >= 70 ? 'text-emerald-400' : 'text-red-400'}>
                        {result.correct}/{result.total} ({dpct}%)
                      </span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${dpct}%`,
                          backgroundColor: dpct >= 70 ? '#10b981' : '#ef4444',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowReview(true)}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Review Answers
          </button>
          <button
            onClick={() => {
              setExamActive(false);
              setExamFinished(false);
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-medium transition-colors"
          >
            Back to Setup
          </button>
        </div>
      </div>
    );
  }

  // Review mode
  if (examFinished && showReview) {
    const q = examQuestions[currentIndex];
    const userAnswer = answers[currentIndex];
    const isCorrect = userAnswer === q.correct;

    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            Review — Question {currentIndex + 1} / {examQuestions.length}
          </h2>
          <button
            onClick={() => {
              setExamActive(false);
              setExamFinished(false);
              setShowReview(false);
            }}
            className="text-sm text-slate-400 hover:text-white"
          >
            Exit Review
          </button>
        </div>

        <div className={`bg-[#1e293b] rounded-xl p-6 border ${isCorrect ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
          <div className="flex items-center gap-2 mb-4">
            {isCorrect ? (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
            <span className={`text-sm font-medium ${isCorrect ? 'text-emerald-400' : 'text-red-400'}`}>
              {isCorrect ? 'Correct' : 'Incorrect'}
            </span>
          </div>
          <h3 className="text-white font-medium mb-4">{q.question}</h3>
          <div className="space-y-2">
            {q.options.map((opt, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-lg border text-sm ${
                  idx === q.correct
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300'
                    : idx === userAnswer && idx !== q.correct
                    ? 'bg-red-500/10 border-red-500/50 text-red-300'
                    : 'bg-slate-800/50 border-slate-700 text-slate-500'
                }`}
              >
                {String.fromCharCode(65 + idx)}. {opt}
                {idx === userAnswer && idx !== q.correct && ' (Your answer)'}
                {idx === q.correct && ' (Correct)'}
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-slate-300">{q.explanation}</p>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
            disabled={currentIndex === 0}
            className="flex items-center gap-2 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          <button
            onClick={() => setCurrentIndex(Math.min(examQuestions.length - 1, currentIndex + 1))}
            disabled={currentIndex === examQuestions.length - 1}
            className="flex items-center gap-2 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Active exam
  const currentQ = examQuestions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Exam Header */}
      <div className="bg-[#1e293b] rounded-xl p-4 border border-slate-700 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-400">
            {currentIndex + 1} / {examQuestions.length}
          </span>
          <span className="text-sm text-slate-400">
            {answeredCount} answered
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 ${timeLeft < 300 ? 'text-red-400' : 'text-slate-300'}`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono text-sm font-medium">{formatTime(timeLeft)}</span>
          </div>
          <button
            onClick={finishExam}
            className="bg-red-600 hover:bg-red-500 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Submit Exam
          </button>
        </div>
      </div>

      {/* Question */}
      <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700">
        <div className="flex items-start justify-between mb-4">
          <span className="text-xs text-slate-500">
            Domain {currentQ.domain} — {DOMAINS.find((d) => d.id === currentQ.domain)?.name}
          </span>
          <button
            onClick={toggleFlag}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
              flagged.has(currentIndex)
                ? 'bg-amber-500/20 text-amber-400'
                : 'bg-slate-800 text-slate-500 hover:text-amber-400'
            }`}
          >
            <Flag className="w-3 h-3" />
            {flagged.has(currentIndex) ? 'Flagged' : 'Flag'}
          </button>
        </div>

        <h2 className="text-lg font-medium text-white leading-relaxed mb-6">{currentQ.question}</h2>

        <div className="space-y-3">
          {currentQ.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => selectAnswer(idx)}
              className={`w-full text-left p-4 rounded-lg border transition-all flex items-start gap-3 ${
                answers[currentIndex] === idx
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                  : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-blue-500'
              }`}
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-full border border-current flex items-center justify-center text-sm font-medium">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="pt-0.5">{option}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>

        {/* Question navigator pills */}
        <div className="hidden md:flex gap-1 flex-wrap justify-center max-w-md">
          {examQuestions.slice(0, 20).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-7 h-7 rounded text-xs font-medium transition-colors ${
                i === currentIndex
                  ? 'bg-blue-600 text-white'
                  : answers[i] !== undefined
                  ? 'bg-emerald-600/30 text-emerald-400'
                  : flagged.has(i)
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {i + 1}
            </button>
          ))}
          {examQuestions.length > 20 && <span className="text-slate-500 text-xs self-center">...</span>}
        </div>

        <button
          onClick={() => setCurrentIndex(Math.min(examQuestions.length - 1, currentIndex + 1))}
          disabled={currentIndex === examQuestions.length - 1}
          className="flex items-center gap-2 text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
        >
          Next <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
