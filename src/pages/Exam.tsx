import { useState, useEffect, useRef } from 'react';
import { Clock, AlertTriangle, CheckCircle, XCircle, ArrowRight, ArrowLeft, Flag } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { QUESTIONS } from '../data/questions';
import { DOMAINS } from '../data/domains';
import type { ExamResult } from '../types/exam';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import type { Question } from '../types/question';

type ExamPhase = 'setup' | 'active' | 'results' | 'review';

export default function Exam() {
  const [phase, setPhase] = useState<ExamPhase>('setup');
  const [examLength, setExamLength] = useState(50);
  const [examQuestions, setExamQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { examHistory, recordExam } = useAppStore();

  useEffect(() => {
    if (phase === 'active' && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            finishExam();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const startExam = () => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5).slice(0, examLength);
    setExamQuestions(shuffled);
    setAnswers({});
    setFlagged(new Set());
    setCurrentIndex(0);
    setTimeLeft(examLength * 90);
    setPhase('active');
  };

  const finishExam = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    let score = 0;
    const domainScores: ExamResult['domainScores'] = {};
    examQuestions.forEach((q, i) => {
      const isCorrect = answers[i] === q.correct;
      if (isCorrect) score++;
      if (!domainScores[q.domain]) domainScores[q.domain] = { correct: 0, total: 0 };
      domainScores[q.domain].total++;
      if (isCorrect) domainScores[q.domain].correct++;
    });

    recordExam({
      id: Date.now(),
      date: new Date().toISOString(),
      score,
      total: examQuestions.length,
      timeSpent: examLength * 90 - timeLeft,
      domainScores,
    });

    setPhase('results');
  };

  // === SETUP ===
  if (phase === 'setup') {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mock Exam</h1>
          <p className="text-foreground-muted mt-1">Simulate the CISSP exam experience</p>
        </div>

        <Card>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground-muted mb-3 block">Number of Questions</label>
              <div className="flex gap-2 flex-wrap">
                {[25, 50, 80].map((n) => (
                  <Button
                    key={n}
                    variant={examLength === n ? 'primary' : 'secondary'}
                    size="lg"
                    onClick={() => setExamLength(n)}
                  >
                    {n} Questions
                  </Button>
                ))}
              </div>
            </div>

            <div className="bg-surface-elevated/50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between text-foreground-muted">
                <span>Time Limit</span>
                <span className="text-foreground">{formatTime(examLength * 90)}</span>
              </div>
              <div className="flex justify-between text-foreground-muted">
                <span>Questions</span>
                <span className="text-foreground">{examLength} (randomly selected)</span>
              </div>
              <div className="flex justify-between text-foreground-muted">
                <span>Passing Score</span>
                <span className="text-foreground">70%</span>
              </div>
            </div>

            <div className="bg-warning-muted border border-warning/30 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div className="text-sm text-warning">
                <p className="font-medium mb-1">Exam Simulation Tips</p>
                <ul className="list-disc list-inside text-warning/80 space-y-1">
                  <li>Read each question carefully before answering</li>
                  <li>Flag questions you're unsure about and come back</li>
                  <li>Manage your time — don't spend too long on one question</li>
                  <li>Look for the BEST or MOST answer, not just a correct one</li>
                </ul>
              </div>
            </div>

            <Button onClick={startExam} size="lg" className="w-full bg-purple hover:bg-violet-600">
              Begin Exam
            </Button>
          </CardContent>
        </Card>

        {/* Previous Exams */}
        {examHistory.length > 0 && (
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-4">Previous Exams</h2>
            <div className="space-y-3">
              {[...examHistory].reverse().slice(0, 5).map((exam) => {
                const pct = Math.round((exam.score / exam.total) * 100);
                const passed = pct >= 70;
                return (
                  <Card key={exam.id}>
                    <CardContent className="flex items-center justify-between py-4">
                      <div>
                        <p className="text-sm text-foreground font-medium">
                          {exam.score}/{exam.total} ({pct}%)
                        </p>
                        <p className="text-xs text-foreground-muted">
                          {new Date(exam.date).toLocaleDateString()} — {formatTime(exam.timeSpent)}
                        </p>
                      </div>
                      <Badge variant={passed ? 'success' : 'error'}>
                        {passed ? 'PASS' : 'FAIL'}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        )}
      </div>
    );
  }

  // === RESULTS ===
  if (phase === 'results') {
    const score = examQuestions.reduce((s, q, i) => s + (answers[i] === q.correct ? 1 : 0), 0);
    const pct = Math.round((score / examQuestions.length) * 100);
    const passed = pct >= 70;

    const domainResults: Record<number, { correct: number; total: number }> = {};
    examQuestions.forEach((q, i) => {
      if (!domainResults[q.domain]) domainResults[q.domain] = { correct: 0, total: 0 };
      domainResults[q.domain].total++;
      if (answers[i] === q.correct) domainResults[q.domain].correct++;
    });

    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="text-center py-8">
          <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center mb-4 ${passed ? 'bg-success-muted' : 'bg-destructive-muted'}`}>
            {passed ? <CheckCircle className="w-12 h-12 text-success" /> : <XCircle className="w-12 h-12 text-destructive" />}
          </div>
          <h1 className="text-3xl font-bold text-foreground">{passed ? 'Congratulations!' : 'Keep Studying!'}</h1>
          <p className="text-foreground-muted mt-2">
            {passed ? 'You passed the mock exam!' : 'You need 70% to pass. Review your weak areas.'}
          </p>
          <p className="text-5xl font-bold text-foreground mt-4">{pct}%</p>
          <p className="text-foreground-muted mt-1">{score} / {examQuestions.length} correct</p>
        </div>

        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold text-foreground mb-4">Domain Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(domainResults)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([domainId, result]) => {
                  const domain = DOMAINS.find((d) => d.id === Number(domainId));
                  const dpct = Math.round((result.correct / result.total) * 100);
                  return (
                    <div key={domainId} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground-muted">D{domainId}: {domain?.name}</span>
                        <span className={dpct >= 70 ? 'text-success' : 'text-destructive'}>
                          {result.correct}/{result.total} ({dpct}%)
                        </span>
                      </div>
                      <ProgressBar value={dpct} color={dpct >= 70 ? 'var(--color-success)' : 'var(--color-destructive)'} />
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={() => { setPhase('review'); setCurrentIndex(0); }}>
            Review Answers
          </Button>
          <Button className="flex-1" onClick={() => setPhase('setup')}>
            Back to Setup
          </Button>
        </div>
      </div>
    );
  }

  // === REVIEW ===
  if (phase === 'review') {
    const q = examQuestions[currentIndex];
    const userAnswer = answers[currentIndex];
    const isCorrect = userAnswer === q.correct;

    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Review — Question {currentIndex + 1} / {examQuestions.length}
          </h2>
          <Button variant="ghost" size="sm" onClick={() => setPhase('setup')}>Exit Review</Button>
        </div>

        <Card className={isCorrect ? 'border-success/30' : 'border-destructive/30'}>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              {isCorrect ? <CheckCircle className="w-5 h-5 text-success" /> : <XCircle className="w-5 h-5 text-destructive" />}
              <span className={`text-sm font-medium ${isCorrect ? 'text-success' : 'text-destructive'}`}>
                {isCorrect ? 'Correct' : 'Incorrect'}
              </span>
            </div>
            <h3 className="text-foreground font-medium mb-4">{q.question}</h3>
            <div className="space-y-2">
              {q.options.map((opt, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-sm ${
                    idx === q.correct
                      ? 'bg-success-muted border-success/50 text-success'
                      : idx === userAnswer && idx !== q.correct
                      ? 'bg-destructive-muted border-destructive/50 text-destructive'
                      : 'bg-surface-elevated/30 border-border text-foreground-subtle'
                  }`}
                >
                  {String.fromCharCode(65 + idx)}. {opt}
                  {idx === userAnswer && idx !== q.correct && ' (Your answer)'}
                  {idx === q.correct && ' (Correct)'}
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 bg-primary-muted border border-primary/20 rounded-lg">
              <p className="text-sm text-foreground-muted">{q.explanation}</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="ghost" onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0}>
            <ArrowLeft className="w-4 h-4" /> Previous
          </Button>
          <Button variant="ghost" onClick={() => setCurrentIndex(Math.min(examQuestions.length - 1, currentIndex + 1))} disabled={currentIndex === examQuestions.length - 1}>
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  // === ACTIVE EXAM ===
  const currentQ = examQuestions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* Exam Header */}
      <Card className="sticky top-0 z-10">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm text-foreground-muted">{currentIndex + 1} / {examQuestions.length}</span>
            <span className="text-sm text-foreground-muted">{answeredCount} answered</span>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${timeLeft < 300 ? 'text-destructive' : 'text-foreground-muted'}`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono text-sm font-medium">{formatTime(timeLeft)}</span>
            </div>
            <Button variant="destructive" size="sm" onClick={finishExam}>Submit Exam</Button>
          </div>
        </div>
      </Card>

      {/* Question */}
      <Card>
        <CardContent>
          <div className="flex items-start justify-between mb-4">
            <span className="text-xs text-foreground-subtle">
              Domain {currentQ.domain} — {DOMAINS.find((d) => d.id === currentQ.domain)?.name}
            </span>
            <button
              onClick={() => setFlagged((prev) => {
                const next = new Set(prev);
                if (next.has(currentIndex)) next.delete(currentIndex);
                else next.add(currentIndex);
                return next;
              })}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded transition-colors ${
                flagged.has(currentIndex) ? 'bg-warning-muted text-warning' : 'bg-surface-elevated text-foreground-subtle hover:text-warning'
              }`}
            >
              <Flag className="w-3 h-3" />
              {flagged.has(currentIndex) ? 'Flagged' : 'Flag'}
            </button>
          </div>

          <h2 className="text-lg font-medium text-foreground leading-relaxed mb-6">{currentQ.question}</h2>

          <div className="space-y-3">
            {currentQ.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => setAnswers((prev) => ({ ...prev, [currentIndex]: idx }))}
                className={`w-full text-left p-4 rounded-lg border transition-all flex items-start gap-3 ${
                  answers[currentIndex] === idx
                    ? 'bg-primary-muted border-primary text-primary'
                    : 'bg-surface-elevated/50 border-border text-foreground-muted hover:border-primary'
                }`}
              >
                <span className="flex-shrink-0 w-7 h-7 rounded-full border border-current flex items-center justify-center text-sm font-medium">
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="pt-0.5">{option}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))} disabled={currentIndex === 0}>
          <ArrowLeft className="w-4 h-4" /> Previous
        </Button>

        <div className="hidden md:flex gap-1 flex-wrap justify-center max-w-lg">
          {examQuestions.map((_, i) => {
            const isCurrent = i === currentIndex;
            const isAnswered = answers[i] !== undefined;
            const isFlagged = flagged.has(i);

            let bgClass = 'bg-surface-elevated text-foreground-subtle';
            if (isCurrent) bgClass = 'bg-primary text-white';
            else if (isAnswered && isFlagged) bgClass = 'bg-success-muted text-success ring-2 ring-warning';
            else if (isAnswered) bgClass = 'bg-success-muted text-success';
            else if (isFlagged) bgClass = 'bg-warning-muted text-warning ring-2 ring-warning';

            return (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-7 h-7 rounded text-xs font-medium transition-colors ${bgClass}`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        <Button variant="ghost" onClick={() => setCurrentIndex(Math.min(examQuestions.length - 1, currentIndex + 1))} disabled={currentIndex === examQuestions.length - 1}>
          Next <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
