import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import LoginPage from './pages/Login/LoginPage.jsx';
import RegisterPage from './pages/Register/RegisterPage.jsx';
import DailyStreakPage from './pages/DailyStreak/DailyStreakPage.jsx';
import StreakCalendarPage from './pages/DailyStreak/StreakCalendarPage.jsx';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'var(--bg-base)' }}>
        <div className="spinner-border text-primary" role="status" style={{ color: 'var(--violet-soft)' }}>
          <span className="visually-hidden">Loading session...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function PublicOnlyRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/daily-streak" replace />;
  }

  return children;
}

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes>
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <LoginPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <RegisterPage />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/daily-streak"
            element={
              <ProtectedRoute>
                <DailyStreakPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/daily-streak/calendar"
            element={
              <ProtectedRoute>
                <StreakCalendarPage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/daily-streak" replace />} />
          <Route path="*" element={<Navigate to="/daily-streak" replace />} />
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
