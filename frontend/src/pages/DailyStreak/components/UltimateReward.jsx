import { AnimatedAsset } from '../../../components/AnimatedAsset/AnimatedAsset.jsx';
import { Lock } from 'lucide-react';
import styles from './UltimateReward.module.css';

export function UltimateReward({ ultimateReward, currentDay = 1 }) {
  const amount = ultimateReward?.amount || 5;
  const isClaimed = currentDay > 7;

  return (
    <div className={styles.banner}>
      <div className={styles.glowDecor} />

      <div className={styles.leftPodium}>
        <div className={styles.crownContainer}>
          <AnimatedAsset type="crown" size={68} animation="glow" alt="Ultimate crown reward" />
        </div>

        <div className={styles.rewardInfo}>
          <div className={styles.chipRow}>
            <span className={styles.badgeChip}>VIP Reward</span>
            <span className={styles.brandChip}>Amazon Gift Card</span>
          </div>
          <h3 className={styles.bigValue}>₹{amount} Gift Card</h3>
          <span className={styles.valueSub}>The grand finale reward of your 7-day streak</span>
        </div>
      </div>

      <div className={styles.rightUnlock}>
        <Lock size={16} className={styles.lockIcon} />
        <span>
          {isClaimed ? (
            'Claimed on Day 7'
          ) : (
            <>
              Unlock on <span className={styles.boldDay}>Day 7</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
}

export default UltimateReward;
