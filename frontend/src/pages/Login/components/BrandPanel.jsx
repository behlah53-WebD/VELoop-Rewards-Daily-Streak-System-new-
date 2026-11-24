import StreakPath from './StreakPath.jsx';
import { ShieldCheck, Sparkles, Flame, Zap, Award } from 'lucide-react';
import styles from './BrandPanel.module.css';

/*
  BrandPanel — Login left panel redesign
  - Floating chips repositioned to avoid overlaps
  - Fake numbers removed (+50 pts, 10k+, Bonus 2x, 5-Day Streak)
  - Replaced with generic non-numeric brand copy
  - StreakPath remains (purely illustrative preview)
  - Trust strip: "Secure login" + "Encrypted" (no fake count)
  LOGIC UNCHANGED.
*/
export function BrandPanel() {
  return (
    <div className={styles.showcasePanel}>
      {/* Living Atmospheric Mesh Glows */}
      <div className={styles.meshGlowViolet}  aria-hidden="true" />
      <div className={styles.meshGlowMagenta} aria-hidden="true" />
      <div className={styles.meshGlowGold}    aria-hidden="true" />
      <div className={styles.gridOverlay}     aria-hidden="true" />

      {/* Twinkling Star Particles */}
      <div className={styles.starryField} aria-hidden="true">
        <span className={`${styles.star} ${styles.star1}`} />
        <span className={`${styles.star} ${styles.star2}`} />
        <span className={`${styles.star} ${styles.star3}`} />
        <span className={`${styles.star} ${styles.star4}`} />
        <span className={`${styles.star} ${styles.star5}`} />
      </div>

      {/* Floating Glass Reward Chips — repositioned, no fake numbers */}
      <div className={styles.floatingChipsStage} aria-hidden="true">
        <div className={`${styles.rewardChip} ${styles.chip1}`}>
          <Sparkles size={13} className={styles.chipGoldIcon} />
          <span>Daily Rewards</span>
        </div>
        <div className={`${styles.rewardChip} ${styles.chip2}`}>
          <Flame size={13} className={styles.chipFlameIcon} />
          <span>Streak Bonus</span>
        </div>
        <div className={`${styles.rewardChip} ${styles.chip3}`}>
          <Zap size={12} className={styles.chipCyanIcon} />
          <span>VIP Unlocks</span>
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

        {/* Signature 7-Day Streak Path — static illustrative preview */}
        <div className={styles.pathContainer}>
          <StreakPath />
        </div>

        {/* Trust Strip — removed fake "10k+ daily streakers" count */}
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
            <span>VELoop Verified</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BrandPanel;
