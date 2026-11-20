import { useState, useEffect, useRef } from 'react';
import { AnimatedAsset } from '../../../components/AnimatedAsset/AnimatedAsset.jsx';
import { ShieldCheck } from 'lucide-react';
import styles from './CpaDemo.module.css';

/**
 * CpaDemo Component
 * High-polish placeholder simulation for CPA advertisement / reward verification flow.
 * Grants nothing by itself; triggers onVerified() only after durationMs elapses.
 *
 * // TODO(VELoop): replace CpaDemo with the real CPA/ad integration
 */
export function CpaDemo({ durationMs = 3000, onVerified }) {
  const [progress, setProgress] = useState(0);
  const onVerifiedRef = useRef(onVerified);
  onVerifiedRef.current = onVerified;

  useEffect(() => {
    const startTime = performance.now();
    let animationFrameId;

    const tick = (now) => {
      const elapsed = now - startTime;
      const pct = Math.min(100, (elapsed / durationMs) * 100);
      setProgress(pct);

      if (elapsed < durationMs) {
        animationFrameId = requestAnimationFrame(tick);
      } else {
        if (onVerifiedRef.current) {
          onVerifiedRef.current();
        }
      }
    };

    animationFrameId = requestAnimationFrame(tick);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [durationMs]);

  // SVG Circular progress math (r = 38, perimeter = 2 * PI * 38 ≈ 238.76)
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={styles.container}>
      <div className={styles.cpaBadge}>
        <ShieldCheck size={14} color="var(--violet-soft)" />
        Reward Verification
      </div>

      <div className={styles.spinnerWrapper}>
        <svg className={styles.progressRing} width="90" height="90" viewBox="0 0 90 90">
          <defs>
            <linearGradient id="goldRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFC83D" />
              <stop offset="100%" stopColor="#F5A300" />
            </linearGradient>
          </defs>
          <circle
            className={styles.ringBg}
            strokeWidth="5"
            fill="transparent"
            r={radius}
            cx="45"
            cy="45"
          />
          <circle
            className={styles.ringFill}
            strokeWidth="5"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            r={radius}
            cx="45"
            cy="45"
          />
        </svg>

        <div className={styles.centerIcon}>
          <AnimatedAsset type="gem" size={32} animation="pulse" />
        </div>
      </div>

      <h3 className={styles.title}>Preparing your reward…</h3>
      <p className={styles.subtext}>
        Verifying daily streak activity. Please wait while your reward is secured.
      </p>

      <div className={styles.progressBarContainer}>
        <div className={styles.progressBarFill} style={{ width: `${progress}%` }} />
      </div>

      <div className={styles.placeholderNote}>
        Reward verification demo in progress…
      </div>
    </div>
  );
}

export default CpaDemo;
