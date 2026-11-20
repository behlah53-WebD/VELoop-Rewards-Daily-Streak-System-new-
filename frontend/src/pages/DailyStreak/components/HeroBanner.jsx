import { AnimatedAsset } from '../../../components/AnimatedAsset/AnimatedAsset.jsx';
import styles from './HeroBanner.module.css';

export function HeroBanner() {
  return (
    <div className={styles.banner}>
      <div className={styles.auroraGlow} />

      <div className={styles.artLeft}>
        <AnimatedAsset type="calendar" size={68} animation="float" alt="Calendar streak" />
      </div>

      <div className={styles.textCenter}>
        <h2 className={styles.headline}>
          Login Daily &amp; Earn <span className={styles.goldText}>Bigger Rewards!</span>
        </h2>
        <p className={styles.subtext}>
          Maintain your streak and unlock <em>exciting rewards</em> every day.
        </p>
      </div>

      <div className={styles.artRight}>
        <AnimatedAsset type="gift-box" size={68} animation="float" alt="Gift box" />
      </div>
    </div>
  );
}

export default HeroBanner;
