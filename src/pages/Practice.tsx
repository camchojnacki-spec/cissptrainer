import { useState, useMemo } from 'react';
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { QUESTIONS } from '../data/questions';
import { DOMAINS } from '../data/domains';
import type { Difficulty } from '../types/question';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';

export default function Practice() {
  const [selectedDomain, setSelectedDomain] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 });
  const [sessionActive, setSessionActive] = useState(false);

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
  }, [selectedDomain, difficulty, sessionActive]);

  const currentQuestion = filteredQuestions[currentIndex];

  const startSession = () => {
    setSessionActive(true);
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setSessionStats({ correct: 0, total: 0 });
  };

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null || !currentQuestion) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);

    const isCorrect = idx === currentQuestion.correct;
    setSessionStats((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));

    recordAnswer(currentQuestion.id, currentQuestion.domain, isCorrect);
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

  // Session complete
  if (!currentQuestion) {
    const pct = sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0;
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-foreground mb-4">Session Complete!</h2>
        <p className="text-foreground-muted mb-2">
          You answered {sessionStats.correct} out of {sessionStats.total} correctly
        </p>
        <p className="text-3xl font-bold text-foreground mb-8">{pct}%</p>
        <Button onClick={resetSession}>Start New Session</Button>
      </div>
    );
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
          {sessionStats.correct}/{sessionStats.total} correct
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
        <Button variant="ghost" onClick={resetSession}>
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
          <Button onClick={resetSession} className="bg-success hover:bg-emerald-500">
            View Results
          </Button>
        )}
      </div>
    </div>
  );
}
