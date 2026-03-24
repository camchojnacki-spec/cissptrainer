import { Link } from 'react-router-dom';
import { Target, TrendingUp, BookOpen, Award, ClipboardCheck } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { DOMAINS } from '../data/domains';
import { QUESTIONS } from '../data/questions';
import { getDomainIcon } from '../lib/icons';
import Card, { CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';
import StatCard from '../components/ui/StatCard';

export default function Dashboard() {
  const { questionHistory, examHistory, domainProgress, getStudyDaysCount } = useAppStore();

  const totalQuestions = questionHistory.length;
  const correctAnswers = questionHistory.filter((q) => q.correct).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const bestExamScore = examHistory.length > 0
    ? Math.max(...examHistory.map((e) => Math.round((e.score / e.total) * 100)))
    : 0;
  const studyDays = getStudyDaysCount();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h1>
        <p className="text-foreground-muted">Continue your CISSP exam preparation journey</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Target} label="Questions Practiced" value={totalQuestions} color="blue" />
        <StatCard icon={TrendingUp} label="Accuracy" value={`${accuracy}%`} color="green" />
        <StatCard icon={BookOpen} label="Study Days" value={studyDays} color="purple" />
        <StatCard icon={Award} label="Best Exam" value={examHistory.length > 0 ? `${bestExamScore}%` : '--'} color="amber" />
      </div>

      {/* Domain Progress */}
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">Domain Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DOMAINS.map((domain) => {
            const progress = domainProgress[domain.id] || { correct: 0, total: 0 };
            const domainQuestionCount = QUESTIONS.filter((q) => q.domain === domain.id).length;
            const pct = progress.total > 0 ? Math.round((progress.correct / progress.total) * 100) : 0;
            const Icon = getDomainIcon(domain.icon);

            return (
              <Link key={domain.id} to={`/domain/${domain.id}`}>
                <Card className="hover:border-foreground-subtle transition-all group">
                  <CardContent>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${domain.color}20` }}
                        >
                          <Icon className="w-5 h-5" style={{ color: domain.color }} />
                        </div>
                        <div>
                          <p className="text-xs text-foreground-muted font-medium">Domain {domain.id}</p>
                          <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {domain.name}
                          </h3>
                        </div>
                      </div>
                      <Badge variant="neutral">{domain.weight}</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-foreground-muted">
                          {progress.total} / {domainQuestionCount} questions attempted
                        </span>
                        <span className="text-foreground font-medium">{pct}%</span>
                      </div>
                      <ProgressBar value={pct} color={domain.color} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/practice"
            className="bg-gradient-to-br from-primary to-primary-hover rounded-xl p-6 text-center hover:opacity-90 transition-opacity"
          >
            <Target className="w-8 h-8 text-white mx-auto mb-3" />
            <h3 className="text-white font-semibold">Practice Questions</h3>
            <p className="text-blue-200 text-sm mt-1">Drill by domain or mixed</p>
          </Link>
          <Link
            to="/exam"
            className="bg-gradient-to-br from-purple to-violet-700 rounded-xl p-6 text-center hover:opacity-90 transition-opacity"
          >
            <ClipboardCheck className="w-8 h-8 text-white mx-auto mb-3" />
            <h3 className="text-white font-semibold">Mock Exam</h3>
            <p className="text-purple-200 text-sm mt-1">Timed practice exam</p>
          </Link>
          <Link
            to="/study"
            className="bg-gradient-to-br from-success to-emerald-700 rounded-xl p-6 text-center hover:opacity-90 transition-opacity"
          >
            <BookOpen className="w-8 h-8 text-white mx-auto mb-3" />
            <h3 className="text-white font-semibold">Study Plan</h3>
            <p className="text-emerald-200 text-sm mt-1">Follow your 60-day path</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
