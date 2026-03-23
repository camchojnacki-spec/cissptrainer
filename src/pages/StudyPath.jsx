import { useState } from 'react';
import { CheckCircle, Circle, BookOpen, Clock, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { STUDY_PLAN } from '../data/studyPlan';
import { DOMAINS } from '../data/domains';

export default function StudyPath({ state, updateState }) {
  const [expandedDay, setExpandedDay] = useState(null);
  const [filter, setFilter] = useState('all'); // all, current-week, completed

  const currentDay = state.studyDay || 1;
  const completedDays = state.completedDays || [];

  const startStudy = () => {
    updateState({ studyStartDate: new Date().toISOString(), studyDay: 1 });
  };

  const toggleDay = (day) => {
    const isCompleted = completedDays.includes(day);
    let newCompleted;
    if (isCompleted) {
      newCompleted = completedDays.filter((d) => d !== day);
    } else {
      newCompleted = [...completedDays, day];
    }
    const maxCompleted = Math.max(...newCompleted, 0);
    updateState((prev) => ({
      ...prev,
      completedDays: newCompleted,
      studyDay: maxCompleted + 1,
    }));
  };

  const getWeek = (day) => Math.ceil(day / 7);
  const currentWeek = getWeek(currentDay);

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
          <h1 className="text-3xl font-bold text-white">60-Day Study Plan</h1>
          <p className="text-slate-400 mt-1">Structured path covering all 8 CISSP domains</p>
        </div>
        {!state.studyStartDate && (
          <button
            onClick={startStudy}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Start Study Plan
          </button>
        )}
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#1e293b] rounded-xl p-5 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-slate-400">Current Day</span>
          </div>
          <p className="text-2xl font-bold text-white">{currentDay} / 60</p>
          <div className="h-2 bg-slate-700 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${(completedDays.length / 60) * 100}%` }}
            />
          </div>
        </div>
        <div className="bg-[#1e293b] rounded-xl p-5 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="text-sm text-slate-400">Hours Studied</span>
          </div>
          <p className="text-2xl font-bold text-white">
            {completedHours} / {totalHours}h
          </p>
        </div>
        <div className="bg-[#1e293b] rounded-xl p-5 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-slate-400">Days Completed</span>
          </div>
          <p className="text-2xl font-bold text-white">{completedDays.length} / 60</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: 'All Days' },
          { key: 'current-week', label: `Week ${currentWeek}` },
          { key: 'completed', label: 'Completed' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Study Days */}
      <div className="space-y-3">
        {filteredPlan.map((item) => {
          const isCompleted = completedDays.includes(item.day);
          const isCurrent = item.day === currentDay;
          const isExpanded = expandedDay === item.day;
          const domain = item.domain ? DOMAINS.find((d) => d.id === item.domain) : null;

          return (
            <div
              key={item.day}
              className={`bg-[#1e293b] rounded-xl border transition-all ${
                isCurrent
                  ? 'border-blue-500 ring-1 ring-blue-500/25'
                  : isCompleted
                  ? 'border-emerald-600/30'
                  : 'border-slate-700'
              }`}
            >
              <div
                className="p-4 flex items-center gap-4 cursor-pointer"
                onClick={() => setExpandedDay(isExpanded ? null : item.day)}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleDay(item.day);
                  }}
                  className="flex-shrink-0"
                >
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-slate-600 hover:text-blue-400 transition-colors" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-slate-500">Day {item.day}</span>
                    {domain && (
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: `${domain.color}20`, color: domain.color }}
                      >
                        D{domain.id}: {domain.name.split(' ').slice(0, 2).join(' ')}
                      </span>
                    )}
                    {!domain && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-medium">
                        Review / Exam
                      </span>
                    )}
                    {isCurrent && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-600 text-white font-medium">
                        Current
                      </span>
                    )}
                  </div>
                  <h3 className={`font-medium mt-1 ${isCompleted ? 'text-slate-500 line-through' : 'text-white'}`}>
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-slate-400 hidden sm:block">{item.hours}h</span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 pt-0 ml-10 border-t border-slate-700/50 mt-0 pt-3">
                  <p className="text-sm text-slate-400 mb-3">
                    Estimated time: {item.hours} hours
                  </p>
                  <ul className="space-y-2">
                    {item.tasks.map((task, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                        <BookOpen className="w-4 h-4 text-slate-500 mt-0.5 flex-shrink-0" />
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
