import { useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Cell, LineChart, Line,
} from 'recharts';
import { TrendingUp, TrendingDown, Brain } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { DOMAINS } from '../data/domains';
import { QUESTIONS } from '../data/questions';
import Card, { CardContent } from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';

export default function Analytics() {
  const { questionHistory, examHistory, domainProgress } = useAppStore();

  const domainData = useMemo(() => {
    return DOMAINS.map((d) => {
      const progress = domainProgress[d.id] || { correct: 0, total: 0 };
      return {
        name: `D${d.id}`,
        fullName: d.name,
        accuracy: progress.total > 0 ? Math.round((progress.correct / progress.total) * 100) : 0,
        attempted: progress.total,
        color: d.color,
      };
    });
  }, [domainProgress]);

  const examTrend = useMemo(() => {
    return examHistory.map((exam, i) => ({
      name: `Exam ${i + 1}`,
      score: Math.round((exam.score / exam.total) * 100),
      passing: 70,
    }));
  }, [examHistory]);

  const difficultyData = useMemo(() => {
    const stats = { easy: { correct: 0, total: 0 }, medium: { correct: 0, total: 0 }, hard: { correct: 0, total: 0 } };
    questionHistory.forEach((h) => {
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
      color: name === 'easy' ? 'var(--color-success)' : name === 'medium' ? 'var(--color-warning)' : 'var(--color-destructive)',
    }));
  }, [questionHistory]);

  const totalQuestions = questionHistory.length;
  const totalCorrect = questionHistory.filter((q) => q.correct).length;
  const overallAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const weakestDomains = [...domainData].filter((d) => d.attempted > 0).sort((a, b) => a.accuracy - b.accuracy).slice(0, 3);
  const strongestDomains = [...domainData].filter((d) => d.attempted > 0).sort((a, b) => b.accuracy - a.accuracy).slice(0, 3);

  if (totalQuestions === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <Card>
          <CardContent className="text-center py-12">
            <Brain className="w-16 h-16 text-foreground-subtle mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No Data Yet</h2>
            <p className="text-foreground-muted">Start practicing questions or take a mock exam to see your analytics.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Performance Analytics</h1>
        <p className="text-foreground-muted mt-1">Track your progress and identify areas for improvement</p>
      </div>

      {/* Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Overall Accuracy', value: `${overallAccuracy}%` },
          { label: 'Total Questions', value: totalQuestions },
          { label: 'Exams Taken', value: examHistory.length },
          {
            label: 'Exam Pass Rate',
            value: examHistory.length > 0
              ? `${Math.round((examHistory.filter((e) => (e.score / e.total) >= 0.7).length / examHistory.length) * 100)}%`
              : '0%',
          },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardContent>
              <p className="text-xs text-foreground-muted mb-1">{label}</p>
              <p className="text-3xl font-bold text-foreground">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Domain Chart */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold text-foreground mb-4">Accuracy by Domain</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={domainData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-foreground-muted)" fontSize={12} />
                <YAxis stroke="var(--color-foreground-muted)" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }}
                  labelStyle={{ color: 'var(--color-foreground)' }}
                  formatter={(value: number, _name: string, props: { payload: { fullName: string } }) => [`${value}%`, props.payload.fullName]}
                />
                <Bar dataKey="accuracy" radius={[4, 4, 0, 0]}>
                  {domainData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exam Trend */}
        {examTrend.length > 0 && (
          <Card>
            <CardContent>
              <h3 className="text-lg font-semibold text-foreground mb-4">Exam Score Trend</h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={examTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="name" stroke="var(--color-foreground-muted)" fontSize={12} />
                    <YAxis stroke="var(--color-foreground-muted)" fontSize={12} domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="score" stroke="var(--color-primary)" strokeWidth={2} dot={{ fill: 'var(--color-primary)' }} />
                    <Line type="monotone" dataKey="passing" stroke="var(--color-destructive)" strokeWidth={1} strokeDasharray="5 5" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Difficulty */}
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold text-foreground mb-4">By Difficulty</h3>
            <div className="space-y-4">
              {difficultyData.map((d) => (
                <div key={d.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground-muted">{d.name}</span>
                    <span className="text-foreground">{d.accuracy}% ({d.total} questions)</span>
                  </div>
                  <ProgressBar value={d.accuracy} color={d.color} size="lg" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strengths / Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {weakestDomains.length > 0 && (
          <Card className="border-destructive/20">
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <TrendingDown className="w-5 h-5 text-destructive" />
                <h3 className="text-lg font-semibold text-foreground">Needs Improvement</h3>
              </div>
              <div className="space-y-3">
                {weakestDomains.map((d) => (
                  <div key={d.name} className="flex items-center justify-between p-3 bg-surface-elevated/50 rounded-lg">
                    <span className="text-sm text-foreground-muted">{d.fullName}</span>
                    <span className="text-sm font-medium text-destructive">{d.accuracy}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        {strongestDomains.length > 0 && (
          <Card className="border-success/20">
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-success" />
                <h3 className="text-lg font-semibold text-foreground">Strongest Areas</h3>
              </div>
              <div className="space-y-3">
                {strongestDomains.map((d) => (
                  <div key={d.name} className="flex items-center justify-between p-3 bg-surface-elevated/50 rounded-lg">
                    <span className="text-sm text-foreground-muted">{d.fullName}</span>
                    <span className="text-sm font-medium text-success">{d.accuracy}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
