import { AnimatedAsset } from '../../../components/AnimatedAsset/AnimatedAsset.jsx';
import { Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import styles from './UltimateReward.module.css';

export function UltimateReward({ ultimateReward, currentDay = 1 }) {
  const amount = ultimateReward?.amount || 5;
  const isClaimed = currentDay > 7;

  // Calculate mini progress days (0 to 7) based on currentDay
  const completedDays = Math.max(0, Math.min(isClaimed ? 7 : currentDay - 1, 7));

  return (
    <div className={styles.banner}>
      {/* Decorative rotating halo & warm ambient glow */}
      <div className={styles.conicHalo} aria-hidden="true" />
      <div className={styles.glowDecor} aria-hidden="true" />

      {/* Floating sparkles */}
      <div className={styles.sparkleRow} aria-hidden="true">
        <Sparkles size={14} className={styles.sparkle1} />
        <Sparkles size={12} className={styles.sparkle2} />
      </div>

      <div className={styles.leftPodium}>
        <div className={styles.crownContainer}>
          <div className={styles.crownHaloPulse} aria-hidden="true" />
          <AnimatedAsset type="crown" size={72} animation="glow" alt="Ultimate crown reward" />
          <div className={styles.rotatingGlint} aria-hidden="true" />
        </div>

        <div className={styles.rewardInfo}>
          <div className={styles.chipRow}>
            <span className={styles.badgeChip}>VIP Reward</span>
            <span className={styles.brandChip}>Amazon Gift Card</span>
          </div>
          <h3 className={styles.bigValue}>₹{amount} Gift Card</h3>
          <span className={styles.valueSub}>The grand finale reward of your 7-day streak</span>

          {/* Mini progression countdown tracker */}
          <div className={styles.progressCounter}>
            <span className={styles.progressCounterText}>
              {completedDays} of 7 days completed
            </span>
            <div className={styles.progressMiniBar}>
              <div
                className={styles.progressMiniFill}
                style={{ width: `${(completedDays / 7) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.rightUnlock}>
        {isClaimed ? (
          <div className={styles.claimedPill}>
            <CheckCircle2 size={16} className={styles.claimedIcon} />
            <span>Claimed on Day 7</span>
          </div>
        ) : (
          <div className={styles.unlockPill}>
            <span className={styles.unlockShimmer} aria-hidden="true" />
            <Lock size={15} className={styles.lockIcon} />
            <span>
              Unlock on <strong className={styles.boldDay}>Day 7</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default UltimateReward;
