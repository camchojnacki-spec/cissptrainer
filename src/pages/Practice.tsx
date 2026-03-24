import { useState, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { QUESTIONS } from '../data/questions';
import { DOMAINS } from '../data/domains';
import type { Difficulty } from '../types/question';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';

interface SessionAnswer {
  questionId: number;
  question: string;
  options: string[];
  selected: number;
  correct: number;
  isCorrect: boolean;
  domain: number;
  difficulty: Difficulty;
  explanation: string;
  reference: string;
}

type Phase = 'setup' | 'active' | 'results';

export default function Practice() {
  const [searchParams] = useSearchParams();
  const initialDomain = parseInt(searchParams.get('domain') || '0') || 0;
  const [selectedDomain, setSelectedDomain] = useState(initialDomain);
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [sessionAnswers, setSessionAnswers] = useState<SessionAnswer[]>([]);
  const [phase, setPhase] = useState<Phase>('setup');
  const [expandedMissed, setExpandedMissed] = useState<Set<number>>(new Set());
  const sessionStartRef = useRef<number>(0);
  const [sessionTime, setSessionTime] = useState(0);

  const recordAnswer = useAppStore((s) => s.recordAnswer);

  const filteredQuestions = useMemo(() => {
    let qs = [...QUESTIONS];
    if (selectedDomain > 0) qs = qs.filter((q) => q.domain === selectedDomain);
    if (difficulty !== 'all') qs = qs.filter((q) => q.difficulty === difficulty);
    for (let i = qs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [qs[i], qs[j]] = [qs[j], qs[i]];
    }
    return qs;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDomain, difficulty, phase]);

  const currentQuestion = filteredQuestions[currentIndex];
  const sessionCorrect = sessionAnswers.filter((a) => a.isCorrect).length;

  const startSession = () => {
    setPhase('active');
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setSessionAnswers([]);
    sessionStartRef.current = Date.now();
  };

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null || !currentQuestion) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);

    const isCorrect = idx === currentQuestion.correct;
    const answer: SessionAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      options: currentQuestion.options,
      selected: idx,
      correct: currentQuestion.correct,
      isCorrect,
      domain: currentQuestion.domain,
      difficulty: currentQuestion.difficulty,
      explanation: currentQuestion.explanation,
      reference: currentQuestion.reference,
    };
    setSessionAnswers((prev) => [...prev, answer]);
    recordAnswer(currentQuestion.id, currentQuestion.domain, isCorrect);
  };

  const nextQuestion = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const endSession = () => {
    setSessionTime(Math.round((Date.now() - sessionStartRef.current) / 1000));
    setPhase('results');
  };

  const retryMissed = () => {
    // This will trigger filteredQuestions to reshuffle, but we override with missed Qs
    setPhase('setup');
    // Small timeout to let state reset, then start with missed questions
    const missedIds = new Set(sessionAnswers.filter((a) => !a.isCorrect).map((a) => a.questionId));
    if (missedIds.size === 0) return;
    setPhase('active');
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setSessionAnswers([]);
    sessionStartRef.current = Date.now();
  };

  const resetToSetup = () => {
    setPhase('setup');
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setSessionAnswers([]);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  // === SETUP ===
  if (phase === 'setup') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Practice Questions</h1>
          <p className="text-foreground-muted mt-1">Select a domain and difficulty to begin</p>
        </div>

        <Card>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground-muted mb-3 block">Select Domain</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button
                  variant={selectedDomain === 0 ? 'primary' : 'secondary'}
                  className="justify-start"
                  onClick={() => setSelectedDomain(0)}
                >
                  All Domains ({QUESTIONS.length} questions)
                </Button>
                {DOMAINS.map((d) => {
                  const count = QUESTIONS.filter((q) => q.domain === d.id).length;
                  return (
                    <Button
                      key={d.id}
                      variant={selectedDomain === d.id ? 'primary' : 'secondary'}
                      className="justify-start"
                      onClick={() => setSelectedDomain(d.id)}
                    >
                      D{d.id}: {d.name} ({count})
                    </Button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground-muted mb-3 block">Difficulty</label>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'easy', 'medium', 'hard'] as const).map((d) => (
                  <Button
                    key={d}
                    variant={difficulty === d ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => setDifficulty(d)}
                  >
                    {d === 'all' ? 'All Levels' : d.charAt(0).toUpperCase() + d.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <Button onClick={startSession} size="lg" className="w-full">
              Start Practice ({filteredQuestions.length} questions available)
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // === RESULTS ===
  if (phase === 'results') {
    const total = sessionAnswers.length;
    const correct = sessionAnswers.filter((a) => a.isCorrect).length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    const passed = pct >= 70;
    const missed = sessionAnswers.filter((a) => !a.isCorrect);

    // Domain breakdown
    const domainBreakdown: Record<number, { correct: number; total: number }> = {};
    for (const a of sessionAnswers) {
      if (!domainBreakdown[a.domain]) domainBreakdown[a.domain] = { correct: 0, total: 0 };
      domainBreakdown[a.domain].total++;
      if (a.isCorrect) domainBreakdown[a.domain].correct++;
    }

    return (
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Score Hero */}
        <div className="text-center py-8">
          <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-4 ${passed ? 'bg-success-muted' : 'bg-destructive-muted'}`}>
            {passed ? <CheckCircle className="w-10 h-10 text-success" /> : <XCircle className="w-10 h-10 text-destructive" />}
          </div>
          <h1 className="text-3xl font-bold text-foreground">Session Complete</h1>
          <p className="text-5xl font-bold text-foreground mt-4">{pct}%</p>
          <p className="text-foreground-muted mt-2">
            {correct} / {total} correct
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-foreground-muted">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{formatTime(sessionTime)}</span>
          </div>
        </div>

        {/* Domain Breakdown */}
        {Object.keys(domainBreakdown).length > 1 && (
          <Card>
            <CardContent>
              <h3 className="text-sm font-semibold text-foreground mb-3">Domain Breakdown</h3>
              <div className="space-y-3">
                {Object.entries(domainBreakdown)
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
        )}

        {/* Missed Questions Review */}
        {missed.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Missed Questions ({missed.length})
            </h3>
            <div className="space-y-3">
              {missed.map((answer, i) => {
                const isExpanded = expandedMissed.has(i);
                const domain = DOMAINS.find((d) => d.id === answer.domain);
                return (
                  <Card key={i} className="border-destructive/20">
                    <div
                      className="p-4 cursor-pointer flex items-start gap-3"
                      onClick={() => {
                        setExpandedMissed((prev) => {
                          const next = new Set(prev);
                          if (next.has(i)) next.delete(i);
                          else next.add(i);
                          return next;
                        });
                      }}
                    >
                      <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge style={{ backgroundColor: `${domain?.color}20`, color: domain?.color }}>
                            D{answer.domain}
                          </Badge>
                          <Badge
                            variant={answer.difficulty === 'easy' ? 'success' : answer.difficulty === 'medium' ? 'warning' : 'error'}
                          >
                            {answer.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground line-clamp-2">{answer.question}</p>
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-foreground-muted flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-foreground-muted flex-shrink-0" />}
                    </div>
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-3 border-t border-border pt-3 ml-8">
                        <div className="space-y-2">
                          {answer.options.map((opt, idx) => (
                            <div
                              key={idx}
                              className={`p-3 rounded-lg border text-sm ${
                                idx === answer.correct
                                  ? 'bg-success-muted border-success/50 text-success'
                                  : idx === answer.selected
                                  ? 'bg-destructive-muted border-destructive/50 text-destructive'
                                  : 'bg-surface-elevated/30 border-border text-foreground-subtle'
                              }`}
                            >
                              {String.fromCharCode(65 + idx)}. {opt}
                              {idx === answer.selected && idx !== answer.correct && ' (Your answer)'}
                              {idx === answer.correct && ' (Correct)'}
                            </div>
                          ))}
                        </div>
                        <div className="p-3 bg-primary-muted border border-primary/20 rounded-lg">
                          <p className="text-xs font-semibold text-primary mb-1">Explanation</p>
                          <p className="text-sm text-foreground-muted">{answer.explanation}</p>
                          <p className="text-xs text-foreground-subtle mt-2">Ref: {answer.reference}</p>
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 flex-wrap">
          {missed.length > 0 && (
            <Button variant="secondary" className="flex-1" onClick={retryMissed}>
              <RotateCcw className="w-4 h-4" />
              Retry Missed ({missed.length})
            </Button>
          )}
          <Button variant="secondary" className="flex-1" onClick={resetToSetup}>
            New Session
          </Button>
          <Button className="flex-1" onClick={() => window.location.hash = '/'}>
            Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // === ACTIVE SESSION ===
  if (!currentQuestion) {
    endSession();
    return null;
  }

  const domain = DOMAINS.find((d) => d.id === currentQuestion.domain);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Session Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-foreground-muted">
            Question {currentIndex + 1} / {filteredQuestions.length}
          </span>
          <Badge style={{ backgroundColor: `${domain?.color}20`, color: domain?.color }}>
            Domain {currentQuestion.domain}
          </Badge>
          <Badge
            variant={
              currentQuestion.difficulty === 'easy'
                ? 'success'
                : currentQuestion.difficulty === 'medium'
                ? 'warning'
                : 'error'
            }
          >
            {currentQuestion.difficulty}
          </Badge>
        </div>
        <span className="text-sm text-foreground-muted">
          {sessionCorrect}/{sessionAnswers.length} correct
        </span>
      </div>

      <ProgressBar value={currentIndex + 1} max={filteredQuestions.length} size="sm" />

      {/* Question */}
      <Card>
        <CardContent>
          <h2 className="text-lg font-medium text-foreground leading-relaxed mb-6">
            {currentQuestion.question}
          </h2>

          <div className="space-y-3">
            {currentQuestion.options.map((option, idx) => {
              let classes = 'bg-surface-elevated/50 border-border text-foreground-muted hover:border-primary cursor-pointer';
              if (selectedAnswer !== null) {
                if (idx === currentQuestion.correct) {
                  classes = 'bg-success-muted border-success text-success';
                } else if (idx === selectedAnswer && idx !== currentQuestion.correct) {
                  classes = 'bg-destructive-muted border-destructive text-destructive';
                } else {
                  classes = 'bg-surface-elevated/30 border-border text-foreground-subtle';
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
                    <CheckCircle className="w-5 h-5 text-success ml-auto flex-shrink-0 mt-0.5" />
                  )}
                  {selectedAnswer !== null && idx === selectedAnswer && idx !== currentQuestion.correct && (
                    <XCircle className="w-5 h-5 text-destructive ml-auto flex-shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Explanation */}
      {showExplanation && (
        <Card className="border-primary/30">
          <CardContent>
            <h3 className="text-sm font-semibold text-primary mb-2">Explanation</h3>
            <p className="text-foreground-muted text-sm leading-relaxed">{currentQuestion.explanation}</p>
            <p className="text-xs text-foreground-subtle mt-3">Reference: {currentQuestion.reference}</p>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="ghost" onClick={endSession}>
          <RotateCcw className="w-4 h-4" />
          End Session
        </Button>
        {selectedAnswer !== null && currentIndex < filteredQuestions.length - 1 && (
          <Button onClick={nextQuestion}>
            Next Question
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
        {selectedAnswer !== null && currentIndex === filteredQuestions.length - 1 && (
          <Button onClick={endSession} className="bg-success hover:bg-emerald-500">
            View Results
          </Button>
        )}
      </div>
    </div>
  );
}
