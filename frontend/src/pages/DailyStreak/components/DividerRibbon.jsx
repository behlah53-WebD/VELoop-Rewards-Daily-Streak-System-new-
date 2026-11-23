import { Sparkles } from 'lucide-react';
import styles from './DividerRibbon.module.css';

export function DividerRibbon({ text = null, canClaim = false }) {
  const displayText = text || (canClaim ? 'Claim your daily reward today!' : 'Come back tomorrow for more rewards!');

  return (
    <div className={styles.ribbonWrapper}>
      <div className={styles.ribbon}>
        <div className={styles.shimmerStreak} aria-hidden="true" />
        <Sparkles size={14} className={styles.sparkle} />
        <span className={styles.ribbonText}>{displayText}</span>
        <Sparkles size={14} className={styles.sparkle} />
      </div>
    </div>
  );
}

export default DividerRibbon;
