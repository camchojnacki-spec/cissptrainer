import { Routes, Route } from 'react-router-dom';
import Shell from './components/layout/Shell';
import Dashboard from './pages/Dashboard';
import StudyPath from './pages/StudyPath';
import Practice from './pages/Practice';
import Exam from './pages/Exam';
import Analytics from './pages/Analytics';
import DomainDetail from './pages/DomainDetail';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/study" element={<StudyPath />} />
        <Route path="/practice" element={<Practice />} />
        <Route path="/exam" element={<Exam />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/domain/:id" element={<DomainDetail />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Shell>
  );
}
