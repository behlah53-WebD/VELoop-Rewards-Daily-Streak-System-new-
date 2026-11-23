import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import BrandPanel from './components/BrandPanel.jsx';
import StreakPath from './components/StreakPath.jsx';
import LoginCard from './components/LoginCard.jsx';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMessage('');
    if (demoEmail === 'demo@veloop.test') {
      showToast('Demo credentials autofilled', 'info', 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      showToast('Please enter both email and password', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);

      // Trigger celebratory confetti burst on successful auth
      try {
        confetti({
          particleCount: 75,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFC93C', '#8B5CF6', '#34D399', '#38BDF8', '#F59E0B'],
        });
      } catch {
        // Silently continue if canvas is unavailable
      }

      setIsSuccess(true);
      showToast('Welcome back to VELoop Rewards!', 'success');

      // Brief pause for checkmark morph & confetti celebration before redirecting
      setTimeout(() => {
        navigate('/daily-streak');
      }, 500);
    } catch (err) {
      const msg = err.message || 'Invalid email or password';
      setErrorMessage(msg);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      showToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.splitPageContainer}>
      {/* Background Atmosphere Blobs */}
      <div className={styles.ambientBlob1} aria-hidden="true" />
      <div className={styles.ambientBlob2} aria-hidden="true" />

      {/* Main Split-Screen Layout */}
      <div className={styles.splitGrid}>
        {/* Left Side: Brand Showcase Hero (Desktop only, ~55%) */}
        <section className={styles.leftPanel}>
          <BrandPanel />
        </section>

        {/* Mobile-Only Top Compact Header Banner */}
        <section className={styles.mobileHeroBanner} aria-hidden="true">
          <div className={styles.mobileBrandHeader}>
            <span className={styles.mobileTag}>VELoop Rewards</span>
            <h2 className={styles.mobileHeadline}>
              Show up daily. <span className={styles.mobileGold}>Earn bigger.</span>
            </h2>
          </div>
          <StreakPath isCompact={true} />
        </section>

        {/* Right Side: Glassmorphism Login Card (~45%) */}
        <section className={styles.rightPanel}>
          <LoginCard
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            isLoading={isLoading}
            isSuccess={isSuccess}
            errorMessage={errorMessage}
            isShaking={isShaking}
            onSubmit={handleSubmit}
            onQuickFill={handleQuickFill}
          />
        </section>
      </div>
    </div>
  );
}

export default LoginPage;
