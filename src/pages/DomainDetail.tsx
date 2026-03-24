import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Lightbulb, Target } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { DOMAINS } from '../data/domains';
import { QUESTIONS } from '../data/questions';
import { getDomainIcon } from '../lib/icons';
import Card, { CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';

export default function DomainDetail() {
  const { id } = useParams<{ id: string }>();
  const domainId = parseInt(id || '0');
  const domain = DOMAINS.find((d) => d.id === domainId);
  const domainProgress = useAppStore((s) => s.domainProgress);

  if (!domain) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl text-foreground">Domain not found</h2>
        <Link to="/" className="text-primary hover:underline mt-4 inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  const Icon = getDomainIcon(domain.icon);
  const progress = domainProgress[domain.id] || { correct: 0, total: 0 };
  const domainQuestions = QUESTIONS.filter((q) => q.domain === domainId);
  const accuracy = progress.total > 0 ? Math.round((progress.correct / progress.total) * 100) : 0;

  const difficultyBreakdown = (['easy', 'medium', 'hard'] as const).map((diff) => ({
    level: diff,
    count: domainQuestions.filter((q) => q.difficulty === diff).length,
  }));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link to="/" className="flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Header */}
      <Card>
        <CardContent>
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${domain.color}20` }}
            >
              <Icon className="w-7 h-7" style={{ color: domain.color }} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-foreground-muted font-medium">Domain {domain.id} — {domain.weight} of exam</p>
              <h1 className="text-2xl font-bold text-foreground mt-1">{domain.name}</h1>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            {[
              { value: `${accuracy}%`, label: 'Accuracy' },
              { value: progress.total, label: 'Questions Attempted' },
              { value: domainQuestions.length, label: 'Total Available' },
            ].map(({ value, label }) => (
              <div key={label} className="bg-surface-elevated/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-foreground-muted mt-1">{label}</p>
              </div>
            ))}
          </div>

          <ProgressBar value={accuracy} color={domain.color} size="lg" className="mt-4" />
        </CardContent>
      </Card>

      {/* Topics */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Key Topics</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {domain.topics.map((topic, i) => (
              <div key={i} className="flex items-start gap-2 p-3 bg-surface-elevated/50 rounded-lg">
                <div className="w-5 h-5 rounded-full bg-surface-elevated flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-foreground-muted">{i + 1}</span>
                </div>
                <span className="text-sm text-foreground-muted">{topic}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Study Tips */}
      <Card className="border-warning/20">
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-warning" />
            <h2 className="text-lg font-semibold text-foreground">Study Tips</h2>
          </div>
          <ul className="space-y-3">
            {domain.studyTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-foreground-muted">
                <span className="text-warning mt-0.5">•</span>
                {tip}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Question Difficulty */}
      <Card>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-purple" />
            <h2 className="text-lg font-semibold text-foreground">Question Breakdown</h2>
          </div>
          <div className="flex gap-4">
            {difficultyBreakdown.map(({ level, count }) => (
              <div key={level} className="flex-1 bg-surface-elevated/50 rounded-lg p-4 text-center">
                <p className="text-xl font-bold text-foreground">{count}</p>
                <Badge variant={level === 'easy' ? 'success' : level === 'medium' ? 'warning' : 'error'} className="mt-1">
                  {level}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Link to={`/practice?domain=${domain.id}`}>
        <Button size="lg" className="w-full">
          Practice Domain {domain.id} Questions
        </Button>
      </Link>
    </div>
  );
}
