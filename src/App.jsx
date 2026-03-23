import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  ClipboardList,
  BarChart3,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import StudyPath from './pages/StudyPath';
import Practice from './pages/Practice';
import Exam from './pages/Exam';
import Analytics from './pages/Analytics';
import DomainDetail from './pages/DomainDetail';
import { loadState, saveState } from './utils/storage';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/study', label: 'Study Path', icon: BookOpen },
  { path: '/practice', label: 'Practice', icon: HelpCircle },
  { path: '/exam', label: 'Mock Exam', icon: ClipboardList },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
];

export default function App() {
  const [state, setState] = useState(loadState);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const updateState = (updates) => {
    setState((prev) => {
      const next = typeof updates === 'function' ? updates(prev) : { ...prev, ...updates };
      return next;
    });
  };

  return (
    <div className="flex min-h-screen bg-[#0f172a]">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1e293b] border-r border-slate-700 fixed h-full z-20">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">CISSP Trainer</h1>
              <p className="text-xs text-slate-400">Exam Preparation</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`
              }
              end={path === '/'}
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-700">
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-xs text-slate-400 mb-1">Study Streak</p>
            <p className="text-2xl font-bold text-white">{state.completedDays.length} days</p>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-[#1e293b] border-b border-slate-700 z-30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-lg font-bold text-white">CISSP Trainer</h1>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-400 hover:text-white">
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-20" onClick={() => setMobileMenuOpen(false)}>
          <div className="bg-[#1e293b] w-64 h-full pt-16 p-4 space-y-1" onClick={(e) => e.stopPropagation()}>
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-sm font-medium ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`
                }
                end={path === '/'}
              >
                <Icon className="w-5 h-5" />
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="p-4 lg:p-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard state={state} updateState={updateState} />} />
            <Route path="/study" element={<StudyPath state={state} updateState={updateState} />} />
            <Route path="/practice" element={<Practice state={state} updateState={updateState} />} />
            <Route path="/exam" element={<Exam state={state} updateState={updateState} />} />
            <Route path="/analytics" element={<Analytics state={state} />} />
            <Route path="/domain/:id" element={<DomainDetail state={state} updateState={updateState} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
