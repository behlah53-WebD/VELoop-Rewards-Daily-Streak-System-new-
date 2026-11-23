import { VeloopLogo } from '../../../assets/index.jsx';
import { GemIcon } from '../../../assets/index.jsx';
import styles from './StreakLoader.module.css';

export function StreakLoader({ message = 'Loading your streak…' }) {
  return (
    <div
      className={styles.loaderContainer}
      role="status"
      aria-live="polite"
    >
      {/* Background ambient lighting */}
      <div className={styles.auroraGlow} aria-hidden="true" />

      {/* Hero Gem Moment with orbiting sparkles and radial pulse */}
      <div className={styles.gemHeroStage}>
        <div className={styles.radialPulseRing} aria-hidden="true" />
        <div className={styles.sparkleOrbit1} aria-hidden="true" />
        <div className={styles.sparkleOrbit2} aria-hidden="true" />

        <div className={styles.gemFloatWrapper}>
          <GemIcon size={76} className={styles.gem3D} />
        </div>
      </div>

      {/* Brand title */}
      <div className={styles.brandRow}>
        <VeloopLogo size={32} />
        <span className={styles.brandText}>
          VELoop <span className={styles.goldText}>Rewards</span>
        </span>
      </div>

      <p className={styles.messageText}>
        {message}
      </p>

      {/* Slim progress bar with gold gradient and moving shine */}
      <div className={styles.progressBarTrack}>
        <div className={styles.progressBarFill}>
          <div className={styles.progressShine} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}

export default StreakLoader;
