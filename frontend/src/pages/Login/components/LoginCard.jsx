import { Link } from 'react-router-dom';
import { useMouseTilt } from '../hooks/useMouseTilt.js';
import FloatingInput from './FloatingInput.jsx';
import EvaluationTicket from './EvaluationTicket.jsx';
import { VeloopLogo } from '../../../assets/index.jsx';
import {
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  Check,
  Flame,
  AlertCircle,
} from 'lucide-react';
import styles from './LoginCard.module.css';

export function LoginCard({
  email,
  setEmail,
  password,
  setPassword,
  rememberMe,
  setRememberMe,
  isLoading,
  isSuccess,
  errorMessage,
  isShaking,
  onSubmit,
  onQuickFill,
}) {
  const { ref: cardRef, style: tiltStyle, glareStyle } = useMouseTilt({ maxTilt: 6 });

  return (
    <div
      ref={cardRef}
      style={tiltStyle}
      className={`${styles.cardWrapper} ${isShaking ? styles.shakeAnimation : ''}`}
    >
      {/* Specular glare dynamic reflection */}
      <div className={styles.cardGlare} style={glareStyle} aria-hidden="true" />

      {/* Gradient border shimmer */}
      <div className={styles.cardBorderShimmer} aria-hidden="true" />

      {/* Brand Logo Header */}
      <div className={styles.cardHeader}>
        <div className={styles.logoRingContainer}>
          <div className={styles.conicRing} aria-hidden="true" />
          <div className={styles.logoHaloPulse} aria-hidden="true" />
          <VeloopLogo size={56} className={styles.logoIcon} />
        </div>

        <h1 className={styles.brandTitle}>
          VELoop <span className={styles.goldShimmerText}>Rewards</span>
        </h1>

        <div className={styles.subtitleRow}>
          <p className={styles.brandSub}>
            Log in to access your 7-day streak
          </p>
          <span className={styles.streakMiniBadge} title="7-Day Streak Active">
            <Flame size={13} className={styles.flameIcon} />
            <span>Streak</span>
          </span>
        </div>
      </div>

      {/* Error Banner on failed login */}
      {errorMessage && (
        <div className={styles.errorBanner} role="alert" aria-live="assertive">
          <AlertCircle size={16} className={styles.errorIcon} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className={styles.form} noValidate>
        <FloatingInput
          id="login-email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail size={18} />}
          autoComplete="email"
          required
          disabled={isLoading || isSuccess}
        />

        <FloatingInput
          id="login-password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock size={18} />}
          autoComplete="current-password"
          required
          disabled={isLoading || isSuccess}
        />

        {/* Remember Me toggle & Forgot Password */}
        <div className={styles.optionsRow}>
          <label className={styles.rememberToggleLabel}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className={styles.toggleCheckbox}
              disabled={isLoading || isSuccess}
            />
            <span className={styles.toggleTrack}>
              <span className={styles.toggleThumb} />
            </span>
            <span className={styles.rememberText}>Remember me</span>
          </label>

          <button
            type="button"
            className={styles.forgotPassBtn}
            onClick={() => alert('Password reset link will be sent to your email.')}
            disabled={isLoading || isSuccess}
          >
            Forgot password?
          </button>
        </div>

        {/* Sign In Button with Light-sweep, Arrow slide & Success morph */}
        <button
          type="submit"
          className={`${styles.primarySubmitBtn} ${isSuccess ? styles.btnSuccess : ''}`}
          disabled={isLoading || isSuccess}
        >
          <span className={styles.btnShineSweep} aria-hidden="true" />

          {isLoading ? (
            <>
              <Loader2 size={18} className={styles.btnSpinner} />
              <span>Signing you in…</span>
            </>
          ) : isSuccess ? (
            <>
              <Check size={18} strokeWidth={3} className={styles.checkMorph} />
              <span>Welcome Back!</span>
            </>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight size={18} className={styles.arrowSlide} />
            </>
          )}
        </button>
      </form>

      {/* Evaluation Account Pass Ticket with Typewriter Quick Fill */}
      <EvaluationTicket onQuickFill={onQuickFill} />

      {/* Social Logins Divider (UI Only) */}
      <div className={styles.dividerRow}>
        <div className={styles.dividerHairline} />
        <span className={styles.dividerText}>or continue with</span>
        <div className={styles.dividerHairline} />
      </div>

      <div className={styles.socialButtonsRow}>
        <button
          type="button"
          className={styles.socialBtn}
          title="Google Sign-In (Coming soon)"
          disabled
        >
          {/* Google G SVG */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
          <span>Google</span>
        </button>

        <button
          type="button"
          className={styles.socialBtn}
          title="GitHub Sign-In (Coming soon)"
          disabled
        >
          {/* GitHub SVG */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          <span>GitHub</span>
        </button>
      </div>

      {/* Card Footer: Create Account + Legal */}
      <div className={styles.cardFooter}>
        <div className={styles.createAccountRow}>
          <span>New here?</span>
          <Link to="/register" className={styles.createAccountLink}>
            Create account
          </Link>
        </div>

        <div className={styles.legalLinksRow}>
          <span className={styles.legalLink}>Terms of Service</span>
          <span className={styles.legalDot}>•</span>
          <span className={styles.legalLink}>Privacy Policy</span>
        </div>
      </div>
    </div>
  );
}

export default LoginCard;
