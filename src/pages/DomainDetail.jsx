import { useParams, Link } from 'react-router-dom';
import {
  Shield, Database, Building, Network, Key, ClipboardCheck, Monitor, Code,
  ArrowLeft, BookOpen, Lightbulb, Target,
} from 'lucide-react';
import { DOMAINS } from '../data/domains';
import { QUESTIONS } from '../data/questions';

const iconMap = { Shield, Database, Building, Network, Key, ClipboardCheck, Monitor, Code };

export default function DomainDetail({ state }) {
  const { id } = useParams();
  const domainId = parseInt(id);
  const domain = DOMAINS.find((d) => d.id === domainId);

  if (!domain) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl text-white">Domain not found</h2>
        <Link to="/" className="text-blue-400 hover:underline mt-4 inline-block">Back to Dashboard</Link>
      </div>
    );
  }

  const Icon = iconMap[domain.icon] || Shield;
  const progress = state.domainProgress[domain.id] || { correct: 0, total: 0 };
  const domainQuestions = QUESTIONS.filter((q) => q.domain === domainId);
  const accuracy = progress.total > 0 ? Math.round((progress.correct / progress.total) * 100) : 0;

  const difficultyBreakdown = ['easy', 'medium', 'hard'].map((diff) => ({
    level: diff,
    count: domainQuestions.filter((q) => q.difficulty === diff).length,
  }));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Header */}
      <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700">
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${domain.color}20` }}
          >
            <Icon className="w-7 h-7" style={{ color: domain.color }} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-slate-400 font-medium">Domain {domain.id} — {domain.weight} of exam</p>
            <h1 className="text-2xl font-bold text-white mt-1">{domain.name}</h1>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-white">{accuracy}%</p>
            <p className="text-xs text-slate-400 mt-1">Accuracy</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-white">{progress.total}</p>
            <p className="text-xs text-slate-400 mt-1">Questions Attempted</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-white">{domainQuestions.length}</p>
            <p className="text-xs text-slate-400 mt-1">Total Available</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${accuracy}%`, backgroundColor: domain.color }}
            />
          </div>
        </div>
      </div>

      {/* Topics */}
      <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Key Topics</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {domain.topics.map((topic, i) => (
            <div key={i} className="flex items-start gap-2 p-3 bg-slate-800 rounded-lg">
              <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs text-slate-400">{i + 1}</span>
              </div>
              <span className="text-sm text-slate-300">{topic}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Study Tips */}
      <div className="bg-[#1e293b] rounded-xl p-6 border border-amber-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-semibold text-white">Study Tips</h2>
        </div>
        <ul className="space-y-3">
          {domain.studyTips.map((tip, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
              <span className="text-amber-400 mt-0.5">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Question Difficulty */}
      <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">Question Breakdown</h2>
        </div>
        <div className="flex gap-4">
          {difficultyBreakdown.map(({ level, count }) => (
            <div key={level} className="flex-1 bg-slate-800 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-white">{count}</p>
              <p className={`text-xs mt-1 capitalize ${
                level === 'easy' ? 'text-emerald-400' : level === 'medium' ? 'text-amber-400' : 'text-red-400'
              }`}>
                {level}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Practice Button */}
      <Link
        to="/practice"
        className="block w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-semibold text-center transition-colors"
      >
        Practice Domain {domain.id} Questions
      </Link>
    </div>
  );
}
