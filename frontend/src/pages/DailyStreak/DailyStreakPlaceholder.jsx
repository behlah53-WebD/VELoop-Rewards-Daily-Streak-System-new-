import { useAuth } from '../../context/AuthContext.jsx';
import { useDailyStreak } from '../../hooks/useDailyStreak.js';
import { VeloopLogo, GemIcon } from '../../assets/index.jsx';
import { AnimatedAsset } from '../../components/AnimatedAsset/AnimatedAsset.jsx';
import { Flame, LogOut, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export function DailyStreakPlaceholder() {
  const { user, wallet, logout } = useAuth();
  const { data, status, refresh, isRefreshing } = useDailyStreak();

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* App Header */}
      <header
        className="py-3 px-4 border-bottom"
        style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-overlay)' }}
      >
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-3">
            <VeloopLogo size={36} />
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '1.2rem',
                color: 'var(--text-main)',
              }}
            >
              VELoop <span style={{ color: 'var(--gold-text)' }}>Rewards</span>
            </span>
          </div>

          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill"
              style={{
                background: 'var(--surface-raised)',
                border: '1px solid var(--border-default)',
                boxShadow: 'var(--glow-sm)',
              }}
            >
              <GemIcon size={18} />
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--violet-soft)' }}>
                {wallet.VES} VEs
              </span>
            </div>

            <button
              onClick={logout}
              className="btn btn-sm d-flex align-items-center gap-1"
              style={{
                background: 'var(--surface-raised)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
              }}
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container my-auto py-5 text-center">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div
              className="p-4 p-md-5 rounded-4"
              style={{
                background: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                boxShadow: 'var(--glow-md)',
              }}
            >
              <div className="d-flex justify-content-center gap-3 mb-4">
                <AnimatedAsset type="coin" size={56} animation="float" />
                <AnimatedAsset type="crown" size={64} animation="glow" />
              </div>

              <div
                className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3"
                style={{
                  background: 'rgba(255, 200, 61, 0.12)',
                  border: '1px solid var(--border-gold)',
                  color: 'var(--gold-text)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                <Flame size={16} color="var(--gold-start)" />
                {data?.streak?.currentStreak || 0} Day Streak
              </div>

              <h1 className="h3 mb-2" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                Welcome, {user?.name || 'Explorer'}!
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Phase 4 Foundation active. Hooks, Auth Context, Toast System, API Interceptors, and Animated Assets are verified.
              </p>

              <div className="d-flex justify-content-center gap-3 mt-4">
                <Link
                  to="/daily-streak/calendar"
                  className="btn d-flex align-items-center gap-2"
                  style={{
                    background: 'var(--surface-raised)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--text-main)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.9rem',
                  }}
                >
                  <Calendar size={16} /> Streak Calendar
                </Link>

                <button
                  onClick={() => refresh(true)}
                  disabled={isRefreshing}
                  className="btn"
                  style={{
                    background: 'var(--gold-gradient)',
                    border: 'none',
                    color: '#3b2200',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.9rem',
                  }}
                >
                  {isRefreshing ? 'Syncing...' : 'Sync Server'}
                </button>
              </div>

              <div className="mt-4 pt-3 border-top" style={{ borderColor: 'var(--border-subtle)', fontSize: '0.8rem', color: 'var(--text-subtle)' }}>
                Streak Status: <span style={{ color: 'var(--success)' }}>{status.toUpperCase()}</span> · Phase: {data?.streak?.phase || 'INITIAL'}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DailyStreakPlaceholder;
