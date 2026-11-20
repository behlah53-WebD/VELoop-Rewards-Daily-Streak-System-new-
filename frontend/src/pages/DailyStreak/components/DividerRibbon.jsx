import styles from './DividerRibbon.module.css';

export function DividerRibbon({ text = null, canClaim = false }) {
  const displayText = text || (canClaim ? '✦ Claim your daily reward today! ✦' : '✦ Come back tomorrow for more rewards! ✦');

  return (
    <div className={styles.ribbon}>
      <span className={styles.sparkle}>✦</span>
      <span>{displayText}</span>
      <span className={styles.sparkle}>✦</span>
    </div>
  );
}

export default DividerRibbon;
