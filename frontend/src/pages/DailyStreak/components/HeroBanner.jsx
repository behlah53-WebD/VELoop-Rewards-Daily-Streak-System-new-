import { AnimatedAsset } from '../../../components/AnimatedAsset/AnimatedAsset.jsx';
import styles from './HeroBanner.module.css';

export function HeroBanner() {
  return (
    <div className={styles.banner}>
      {/* Layered Aurora background swirls & sparkles */}
      <div className={styles.auroraGlow1} aria-hidden="true" />
      <div className={styles.auroraGlow2} aria-hidden="true" />
      <div className={styles.sparkleField} aria-hidden="true">
        <span className={`${styles.starDot} ${styles.star1}`} />
        <span className={`${styles.starDot} ${styles.star2}`} />
        <span className={`${styles.starDot} ${styles.star3}`} />
        <span className={`${styles.starDot} ${styles.star4}`} />
      </div>

      <div className={styles.artLeft}>
        <div className={styles.assetPlate}>
          <AnimatedAsset type="calendar" size={72} animation="float" alt="Calendar streak" />
        </div>
      </div>

      <div className={styles.textCenter}>
        <div className={styles.badgeRow}>
          <span className={styles.miniPill}>✦ Daily Rewards Lounge ✦</span>
        </div>
        <h2 className={styles.headline}>
          Login Daily &amp; Earn <span className={styles.goldText}>Bigger Rewards!</span>
        </h2>
        <p className={styles.subtext}>
          Maintain your streak and unlock <span className={styles.highlightText}>exciting rewards</span> every day.
        </p>
      </div>

      <div className={styles.artRight}>
        <div className={styles.assetPlate}>
          <AnimatedAsset type="gift-box" size={72} animation="float" alt="Gift box" />
        </div>
      </div>
    </div>
  );
}

export default HeroBanner;
