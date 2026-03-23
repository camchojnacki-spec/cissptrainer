import { Link } from 'react-router-dom';
import {
  Shield,
  Database,
  Building,
  Network,
  Key,
  ClipboardCheck,
  Monitor,
  Code,
  TrendingUp,
  Target,
  BookOpen,
  Award,
} from 'lucide-react';
import { DOMAINS } from '../data/domains';
import { QUESTIONS } from '../data/questions';

const iconMap = {
  Shield, Database, Building, Network, Key, ClipboardCheck, Monitor, Code,
};

export default function Dashboard({ state }) {
  const totalQuestions = state.questionHistory.length;
  const correctAnswers = state.questionHistory.filter((q) => q.correct).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const examsCompleted = state.examHistory.length;
  const bestExamScore = examsCompleted > 0
    ? Math.max(...state.examHistory.map((e) => Math.round((e.score / e.total) * 100)))
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
        <p className="text-slate-400">Continue your CISSP exam preparation journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Target} label="Questions Practiced" value={totalQuestions} color="blue" />
        <StatCard icon={TrendingUp} label="Accuracy" value={`${accuracy}%`} color="green" />
        <StatCard icon={BookOpen} label="Study Days" value={state.completedDays.length} color="purple" />
        <StatCard icon={Award} label="Best Exam" value={examsCompleted > 0 ? `${bestExamScore}%` : '--'} color="amber" />
      </div>

      {/* Domain Progress */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Domain Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DOMAINS.map((domain) => {
            const progress = state.domainProgress[domain.id] || { correct: 0, total: 0 };
            const domainQuestions = QUESTIONS.filter((q) => q.domain === domain.id).length;
            const pct = progress.total > 0 ? Math.round((progress.correct / progress.total) * 100) : 0;
            const Icon = iconMap[domain.icon] || Shield;

            return (
              <Link
                key={domain.id}
                to={`/domain/${domain.id}`}
                className="bg-[#1e293b] rounded-xl p-5 border border-slate-700 hover:border-slate-500 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${domain.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: domain.color }} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Domain {domain.id}</p>
                      <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {domain.name}
                      </h3>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-1 rounded">
                    {domain.weight}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">
                      {progress.total} / {domainQuestions} questions attempted
                    </span>
                    <span className="text-white font-medium">{pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: domain.color,
                      }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/practice"
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-center hover:from-blue-500 hover:to-blue-600 transition-all"
          >
            <Target className="w-8 h-8 text-white mx-auto mb-3" />
            <h3 className="text-white font-semibold">Practice Questions</h3>
            <p className="text-blue-200 text-sm mt-1">Drill by domain or mixed</p>
          </Link>
          <Link
            to="/exam"
            className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-center hover:from-purple-500 hover:to-purple-600 transition-all"
          >
            <ClipboardCheck className="w-8 h-8 text-white mx-auto mb-3" />
            <h3 className="text-white font-semibold">Mock Exam</h3>
            <p className="text-purple-200 text-sm mt-1">Timed practice exam</p>
          </Link>
          <Link
            to="/study"
            className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-6 text-center hover:from-emerald-500 hover:to-emerald-600 transition-all"
          >
            <BookOpen className="w-8 h-8 text-white mx-auto mb-3" />
            <h3 className="text-white font-semibold">Study Plan</h3>
            <p className="text-emerald-200 text-sm mt-1">Follow your 60-day path</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    blue: 'from-blue-600/20 to-blue-600/5 border-blue-600/30',
    green: 'from-emerald-600/20 to-emerald-600/5 border-emerald-600/30',
    purple: 'from-purple-600/20 to-purple-600/5 border-purple-600/30',
    amber: 'from-amber-600/20 to-amber-600/5 border-amber-600/30',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} border rounded-xl p-5`}>
      <Icon className="w-5 h-5 text-slate-400 mb-3" />
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-slate-400 mt-1">{label}</p>
    </div>
  );
}
