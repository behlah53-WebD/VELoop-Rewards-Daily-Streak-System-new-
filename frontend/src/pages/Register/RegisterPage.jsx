import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { VeloopLogo } from '../../assets/index.jsx';
import { ArrowRight, Loader2, User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import styles from './Register.module.css';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters long', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      await register(name, email, password);
      showToast('Account created successfully! Welcome to VELoop Rewards.', 'success');
      navigate('/daily-streak');
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.authWrapper}>
      <div className={styles.ambientBlob1} aria-hidden="true" />
      <div className={styles.ambientBlob2} aria-hidden="true" />

      <div className={styles.authCard}>
        <div className={styles.cardShimmer} aria-hidden="true" />

        <div className={styles.logoHeader}>
          <div className={styles.logoRingWrapper}>
            <div className={styles.logoPulseHalo} aria-hidden="true" />
            <VeloopLogo size={58} className={styles.logoIcon} />
          </div>

          <h1 className={styles.brandTitle}>
            Join VELoop <span className={styles.goldText}>Rewards</span>
          </h1>
          <p className={styles.brandSub}>Start earning daily check-in rewards &amp; vouchers</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="reg-name">
              Full Name
            </label>
            <div className={styles.inputWrapper}>
              <User size={18} className={styles.inputIcon} aria-hidden="true" />
              <input
                id="reg-name"
                type="text"
                className={styles.input}
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="reg-email">
              Email Address
            </label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.inputIcon} aria-hidden="true" />
              <input
                id="reg-email"
                type="email"
                className={styles.input}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="reg-password">
              Password (min. 6 characters)
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.inputIcon} aria-hidden="true" />
              <input
                id="reg-password"
                type={showPassword ? 'text' : 'password'}
                className={`${styles.input} ${styles.inputWithToggle}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.primaryBtn} disabled={isLoading}>
            <span className={styles.btnShine} aria-hidden="true" />
            {isLoading ? (
              <>
                <Loader2 size={18} className={styles.spinner} />
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={18} className={styles.arrowIcon} />
              </>
            )}
          </button>
        </form>

        <div className={styles.footerLink}>
          Already have an account?{' '}
          <Link to="/login" className={styles.loginLink}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
