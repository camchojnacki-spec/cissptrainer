import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Target, Brain } from 'lucide-react';
import { DOMAINS } from '../data/domains';
import { QUESTIONS } from '../data/questions';

export default function Analytics({ state }) {
  const domainData = useMemo(() => {
    return DOMAINS.map((d) => {
      const progress = state.domainProgress[d.id] || { correct: 0, total: 0 };
      return {
        name: `D${d.id}`,
        fullName: d.name,
        accuracy: progress.total > 0 ? Math.round((progress.correct / progress.total) * 100) : 0,
        attempted: progress.total,
        correct: progress.correct,
        color: d.color,
        available: QUESTIONS.filter((q) => q.domain === d.id).length,
      };
    });
  }, [state.domainProgress]);

  const examTrend = useMemo(() => {
    return state.examHistory.map((exam, i) => ({
      name: `Exam ${i + 1}`,
      score: Math.round((exam.score / exam.total) * 100),
      passing: 70,
    }));
  }, [state.examHistory]);

  const difficultyData = useMemo(() => {
    const stats = { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } };
    state.questionHistory.forEach((h) => {
      const q = QUESTIONS.find((q) => q.id === h.questionId);
      if (q) {
        stats[q.difficulty].total++;
        if (h.correct) stats[q.difficulty].correct++;
      }
    });
    return Object.entries(stats).map(([name, s]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      accuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
      total: s.total,
    }));
  }, [state.questionHistory]);

  const totalQuestions = state.questionHistory.length;
  const totalCorrect = state.questionHistory.filter((q) => q.correct).length;
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const weakestDomains = [...domainData]
    .filter((d) => d.attempted > 0)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 3);

  const strongestDomains = [...domainData]
    .filter((d) => d.attempted > 0)
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 3);

  if (totalQuestions === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Analytics</h1>
        <div className="bg-[#1e293b] rounded-xl p-12 border border-slate-700 text-center">
          <Brain className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">No Data Yet</h2>
          <p className="text-slate-400">Start practicing questions or take a mock exam to see your analytics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Performance Analytics</h1>
        <p className="text-slate-400 mt-1">Track your progress and identify areas for improvement</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1e293b] rounded-xl p-5 border border-slate-700">
          <p className="text-xs text-slate-400 mb-1">Overall Accuracy</p>
          <p className="text-3xl font-bold text-white">{overallAccuracy}%</p>
        </div>
        <div className="bg-[#1e293b] rounded-xl p-5 border border-slate-700">
          <p className="text-xs text-slate-400 mb-1">Total Questions</p>
          <p className="text-3xl font-bold text-white">{totalQuestions}</p>
        </div>
        <div className="bg-[#1e293b] rounded-xl p-5 border border-slate-700">
          <p className="text-xs text-slate-400 mb-1">Exams Taken</p>
          <p className="text-3xl font-bold text-white">{state.examHistory.length}</p>
        </div>
        <div className="bg-[#1e293b] rounded-xl p-5 border border-slate-700">
          <p className="text-xs text-slate-400 mb-1">Exam Pass Rate</p>
          <p className="text-3xl font-bold text-white">
            {state.examHistory.length > 0
              ? Math.round(
                  (state.examHistory.filter((e) => (e.score / e.total) >= 0.7).length / state.examHistory.length) * 100
                )
              : 0}%
          </p>
        </div>
      </div>

      {/* Domain Accuracy Chart */}
      <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Accuracy by Domain</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={domainData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                labelStyle={{ color: '#e2e8f0' }}
                itemStyle={{ color: '#94a3b8' }}
                formatter={(value, name, props) => [`${value}%`, props.payload.fullName]}
                labelFormatter={(label) => `Domain ${label.replace('D', '')}`}
              />
              <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                {domainData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exam Trend */}
        {examTrend.length > 0 && (
          <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Exam Score Trend</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={examTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6' }} />
                  <Line type="monotone" dataKey="passing" stroke="#ef4444" strokeWidth={1} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Difficulty Breakdown */}
        <div className="bg-[#1e293b] rounded-xl p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">By Difficulty</h3>
          <div className="space-y-4">
            {difficultyData.map((d) => (
              <div key={d.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-300">{d.name}</span>
                  <span className="text-white">{d.accuracy}% ({d.total} questions)</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${d.accuracy}%`,
                      backgroundColor:
                        d.name === 'Easy' ? '#22c55e' : d.name === 'Medium' ? '#eab308' : '#ef4444',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {weakestDomains.length > 0 && (
          <div className="bg-[#1e293b] rounded-xl p-6 border border-red-500/20">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-semibold text-white">Needs Improvement</h3>
            </div>
            <div className="space-y-3">
              {weakestDomains.map((d) => (
                <div key={d.name} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                  <span className="text-sm text-slate-300">{d.fullName}</span>
                  <span className="text-sm font-medium text-red-400">{d.accuracy}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {strongestDomains.length > 0 && (
          <div className="bg-[#1e293b] rounded-xl p-6 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-semibold text-white">Strongest Areas</h3>
            </div>
            <div className="space-y-3">
              {strongestDomains.map((d) => (
                <div key={d.name} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                  <span className="text-sm text-slate-300">{d.fullName}</span>
                  <span className="text-sm font-medium text-emerald-400">{d.accuracy}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
