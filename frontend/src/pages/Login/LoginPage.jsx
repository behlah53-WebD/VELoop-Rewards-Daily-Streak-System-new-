import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { VeloopLogo } from '../../assets/index.jsx';
import { ArrowRight, Loader2, Sparkles } from 'lucide-react';
import styles from './Login.module.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleFillDemo = () => {
    setEmail('demo@veloop.test');
    setPassword('Demo@1234');
    showToast('Demo credentials autofilled', 'info', 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter both email and password', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back to VELoop Rewards!', 'success');
      navigate('/daily-streak');
    } catch (err) {
      showToast(err.message || 'Invalid credentials', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.authCard}>
        <div className={styles.logoHeader}>
          <VeloopLogo size={52} />
          <h1 className={styles.brandTitle}>
            VELoop <span style={{ color: 'var(--gold-text)' }}>Rewards</span>
          </h1>
          <p className={styles.brandSub}>Log in to access your 7-day streak</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="login-email">
              Email Address
            </label>
            <input
              id="login-email"
              type="email"
              className={styles.input}
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className={styles.primaryBtn} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Evaluation Demo Credentials Hint */}
        <div className={styles.demoBanner}>
          <div className={styles.demoTop}>
            <span className="d-flex align-items-center gap-1">
              <Sparkles size={14} /> Evaluation Account
            </span>
            <button type="button" className={styles.fillBtn} onClick={handleFillDemo}>
              Quick Fill
            </button>
          </div>
          <div className={styles.demoDetails}>
            demo@veloop.test / Demo@1234
          </div>
        </div>

        <div className={styles.footerLink}>
          Don&apos;t have an account?{' '}
          <Link to="/register" style={{ fontWeight: 600 }}>
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
