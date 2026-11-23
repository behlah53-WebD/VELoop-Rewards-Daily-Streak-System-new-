import styles from './TrustFooter.module.css';

export function TrustFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brandSide}>
          <div className={styles.shieldBadge} title="Verified VELoop Rewards Trust Mark">
            <span className={styles.shieldText}>VR</span>
            <span className={styles.shieldGlow} aria-hidden="true" />
          </div>
          <p className={styles.trustText}>
            Official rewards only on <span className={styles.officialDomain}>VeloopRewards.in</span> · Stay active, stay rewarded!
          </p>
        </div>

        <div className={styles.copyright}>
          VELoop Rewards &copy; 2026. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default TrustFooter;
