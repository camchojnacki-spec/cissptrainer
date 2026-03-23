import { useState } from 'react';
import { CheckCircle, Circle, BookOpen, Clock, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { useAppStore } from '../lib/store';
import { STUDY_PLAN } from '../data/studyPlan';
import { DOMAINS } from '../data/domains';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import ProgressBar from '../components/ui/ProgressBar';

type FilterType = 'all' | 'current-week' | 'completed';

export default function StudyPath() {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');

  const { studyDay, studyStartDate, completedDays, startStudyPlan, toggleStudyDay } = useAppStore();

  const getWeek = (day: number) => Math.ceil(day / 7);
  const currentWeek = getWeek(studyDay);

  const filteredPlan = STUDY_PLAN.filter((item) => {
    if (filter === 'current-week') return getWeek(item.day) === currentWeek;
    if (filter === 'completed') return completedDays.includes(item.day);
    return true;
  });

  const totalHours = STUDY_PLAN.reduce((sum, d) => sum + d.hours, 0);
  const completedHours = STUDY_PLAN
    .filter((d) => completedDays.includes(d.day))
    .reduce((sum, d) => sum + d.hours, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">60-Day Study Plan</h1>
          <p className="text-foreground-muted mt-1">Structured path covering all 8 CISSP domains</p>
        </div>
        {!studyStartDate && (
          <Button onClick={startStudyPlan} size="lg">Start Study Plan</Button>
        )}
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground-muted">Current Day</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{studyDay} / 60</p>
            <ProgressBar value={completedDays.length} max={60} className="mt-3" />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-success" />
              <span className="text-sm text-foreground-muted">Hours Studied</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{completedHours} / {totalHours}h</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-purple" />
              <span className="text-sm text-foreground-muted">Days Completed</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{completedDays.length} / 60</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {([
          { key: 'all' as const, label: 'All Days' },
          { key: 'current-week' as const, label: `Week ${currentWeek}` },
          { key: 'completed' as const, label: 'Completed' },
        ]).map(({ key, label }) => (
          <Button
            key={key}
            variant={filter === key ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => setFilter(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Study Days */}
      <div className="space-y-3">
        {filteredPlan.map((item) => {
          const isCompleted = completedDays.includes(item.day);
          const isCurrent = item.day === studyDay;
          const isExpanded = expandedDay === item.day;
          const domain = item.domain ? DOMAINS.find((d) => d.id === item.domain) : null;

          return (
            <Card
              key={item.day}
              className={
                isCurrent
                  ? 'border-primary ring-1 ring-primary/25'
                  : isCompleted
                  ? 'border-success/30'
                  : ''
              }
            >
              <div
                className="p-4 flex items-center gap-4 cursor-pointer"
                onClick={() => setExpandedDay(isExpanded ? null : item.day)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStudyDay(item.day);
                  }}
                  className="flex-shrink-0"
                  aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-success" />
                  ) : (
                    <Circle className="w-6 h-6 text-foreground-subtle hover:text-primary transition-colors" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-foreground-subtle">Day {item.day}</span>
                    {domain ? (
                      <Badge
                        style={{ backgroundColor: `${domain.color}20`, color: domain.color }}
                      >
                        D{domain.id}: {domain.name.split(' ').slice(0, 2).join(' ')}
                      </Badge>
                    ) : (
                      <Badge variant="neutral">Review / Exam</Badge>
                    )}
                    {isCurrent && <Badge>Current</Badge>}
                  </div>
                  <h3 className={`font-medium mt-1 ${isCompleted ? 'text-foreground-subtle line-through' : 'text-foreground'}`}>
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-foreground-muted hidden sm:block">{item.hours}h</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-foreground-muted" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-foreground-muted" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 ml-10 border-t border-border pt-3">
                  <p className="text-sm text-foreground-muted mb-3">
                    Estimated time: {item.hours} hours
                  </p>
                  <ul className="space-y-2">
                    {item.tasks.map((task, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground-muted">
                        <BookOpen className="w-4 h-4 text-foreground-subtle mt-0.5 flex-shrink-0" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
