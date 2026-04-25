import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Shared auth
import Login from './components/Login';
import Register from './components/Register';

// Student
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Lessons from './components/Lessons';
import Exercises from './components/Exercises';
import Calendar from './components/Calendar';
import Leaderboard from './components/Leaderboard';
import Achievements from './components/Achievements';
import Progress from './components/Progress';
import Profile from './components/Profile';

// Instructor
import InstructorLayout from './components/InstructorLayout';
import InstructorDashboard from './components/InstructorDashboard';
import MyLessons from './components/MyLessons';
import CreateLessons from './components/CreateLessons';
import Assignments from './components/Assignments';

// Admin
import Admin from './components/Admin';

// Testing
import WebSpeechExample from './components/WebSpeechExample';
import AIChatInterface from './components/AIChatInterface';

function getHomeRoute(role) {
  if (role === 'instructor') return '/instructor';
  if (role === 'admin') return '/admin';
  return '/';
}

function ProtectedRoute({ children, requiredRole }) {
  const { token, user } = useContext(AuthContext);
  if (!token) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={getHomeRoute(user?.role)} replace />;
  }
  return children;
}

function GuestRoute({ children }) {
  const { token, user } = useContext(AuthContext);
  if (token) return <Navigate to={getHomeRoute(user?.role)} replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
      <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

      {/* Testing Routes */}
      <Route path="/test/speech" element={<WebSpeechExample />} />
      <Route path="/test/ai-chat" element={<AIChatInterface />} />

      {/* Student routes */}
      <Route path="/" element={<ProtectedRoute requiredRole="student"><Layout /></ProtectedRoute>}>
        <Route index              element={<Dashboard />} />
        <Route path="lessons"     element={<Lessons />} />
        <Route path="exercises"   element={<Exercises />} />
        <Route path="calendar"    element={<Calendar />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="progress"    element={<Progress />} />
        <Route path="profile"     element={<Profile />} />
      </Route>

      {/* Instructor routes */}
      <Route path="/instructor" element={<ProtectedRoute requiredRole="instructor"><InstructorLayout /></ProtectedRoute>}>
        <Route index              element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard"   element={<InstructorDashboard />} />
        <Route path="lessons"     element={<MyLessons />} />
        <Route path="create"      element={<CreateLessons />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="calendar"    element={<Calendar />} />
        <Route path="profile"     element={<Profile />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><Admin /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}