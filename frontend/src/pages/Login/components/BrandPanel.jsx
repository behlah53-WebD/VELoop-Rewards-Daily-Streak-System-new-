import StreakPath from './StreakPath.jsx';
import { ShieldCheck, Sparkles, Flame, Zap, Award } from 'lucide-react';
import styles from './BrandPanel.module.css';

export function BrandPanel() {
  return (
    <div className={styles.showcasePanel}>
      {/* Living Atmospheric Mesh Glows */}
      <div className={styles.meshGlowViolet} aria-hidden="true" />
      <div className={styles.meshGlowMagenta} aria-hidden="true" />
      <div className={styles.meshGlowGold} aria-hidden="true" />
      <div className={styles.gridOverlay} aria-hidden="true" />

      {/* Twinkling Star Particles */}
      <div className={styles.starryField} aria-hidden="true">
        <span className={`${styles.star} ${styles.star1}`} />
        <span className={`${styles.star} ${styles.star2}`} />
        <span className={`${styles.star} ${styles.star3}`} />
        <span className={`${styles.star} ${styles.star4}`} />
        <span className={`${styles.star} ${styles.star5}`} />
      </div>

      {/* Floating Glass Parallax Reward Chips */}
      <div className={styles.floatingChipsStage} aria-hidden="true">
        <div className={`${styles.rewardChip} ${styles.chip1}`}>
          <Sparkles size={14} className={styles.chipGoldIcon} />
          <span>+50 pts</span>
        </div>
        <div className={`${styles.rewardChip} ${styles.chip2}`}>
          <Flame size={14} className={styles.chipFlameIcon} />
          <span>5-Day Streak</span>
        </div>
        <div className={`${styles.rewardChip} ${styles.chip3}`}>
          <Zap size={13} className={styles.chipCyanIcon} />
          <span>Bonus 2x</span>
        </div>
      </div>

      {/* Main Hero Copy */}
      <div className={styles.contentWrap}>
        <div className={styles.badgeRow}>
          <span className={styles.exclusiveBadge}>
            <Award size={13} />
            Fintech Rewards &amp; Daily Streaks
          </span>
        </div>

        <h2 className={styles.headline}>
          Show up daily. <span className={styles.goldText}>Earn bigger.</span>
        </h2>

        <p className={styles.subtitle}>
          Build an unstoppable streak, unlock exclusive digital rewards, and turn consistency into real treasures.
        </p>

        {/* Signature 7-Day Streak Path */}
        <div className={styles.pathContainer}>
          <StreakPath />
        </div>

        {/* Trust Strip */}
        <div className={styles.trustStrip}>
          <div className={styles.trustItem}>
            <ShieldCheck size={15} className={styles.trustIcon} />
            <span>Secure login</span>
          </div>
          <span className={styles.trustDot}>•</span>
          <div className={styles.trustItem}>
            <span>Encrypted</span>
          </div>
          <span className={styles.trustDot}>•</span>
          <div className={styles.trustItem}>
            <span className={styles.streakersCount}>10k+</span>
            <span>daily streakers</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrandPanel;
