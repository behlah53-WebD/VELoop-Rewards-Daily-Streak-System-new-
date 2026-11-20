import { useState } from 'react';
import streakApi from '../../../services/streakApi.js';
import { AlertTriangle, X } from 'lucide-react';
import styles from './ResetBanner.module.css';

export function ResetBanner({ notice, onDismiss }) {
  const [isDismissing, setIsDismissing] = useState(false);

  if (!notice) return null;

  const handleAcknowledge = async () => {
    setIsDismissing(true);
    try {
      await streakApi.acknowledgeResetNotice();
    } catch {
      // Ignored non-blocking
    } finally {
      if (onDismiss) onDismiss();
    }
  };

  return (
    <div className={styles.banner} role="alert">
      <div className={styles.content}>
        <div className={styles.icon}>
          <AlertTriangle size={24} />
        </div>
        <div>
          <span className={styles.bold}>Streak Reset: </span>
          {notice.message || 'Your claim window expired. Start again fresh from Day 1!'}
          {notice.previousStreak > 0 && (
            <span style={{ color: 'var(--text-muted)', marginLeft: 6 }}>
              (Previous streak: {notice.previousStreak} days)
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleAcknowledge}
        className={styles.ackBtn}
        disabled={isDismissing}
      >
        <X size={14} style={{ marginRight: 4 }} />
        Got it
      </button>
    </div>
  );
}

export default ResetBanner;
