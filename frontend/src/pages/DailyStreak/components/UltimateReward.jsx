import { AnimatedAsset } from '../../../components/AnimatedAsset/AnimatedAsset.jsx';
import { Lock, Sparkles, CheckCircle2, ChevronRight, Crown } from 'lucide-react';
import styles from './UltimateReward.module.css';

export function UltimateReward({ ultimateReward, currentDay = 1, rewardItem, onClaimClick, isClaiming }) {
  const amount = ultimateReward?.amount || rewardItem?.reward?.amount || 5;
  const status = rewardItem?.status;
  const day = rewardItem?.day || 7;
  const isClaimed = status === 'CLAIMED' || currentDay > 7;
  const isAvailable = status === 'AVAILABLE';

  // Calculate completed days (0 to 7) based on currentDay — LOGIC UNCHANGED
  const completedDays = Math.max(0, Math.min(isClaimed ? 7 : currentDay - 1, 7));

  return (
    <div className={styles.vipCard}>
      {/* Decorative layers */}
      <div className={styles.sunburst} aria-hidden="true" />
      <div className={styles.vipGlow1} aria-hidden="true" />
      <div className={styles.vipGlow2} aria-hidden="true" />
      <div className={styles.particles} aria-hidden="true">
        <div className={styles.particle} />
        <div className={styles.particle} />
        <div className={styles.particle} />
        <div className={styles.particle} />
        <div className={styles.particle} />
      </div>
      <div className={styles.metalShimmer} aria-hidden="true" />

      <div className={styles.vipContent}>
        {/* Top VIP badge */}
        <div className={styles.vipBadge}>
          <Crown size={11} />
          VIP · ULTIMATE REWARD
        </div>

        <div className={styles.vipDetails}>
          {/* Crown stage */}
          <div className={styles.crownStage}>
            <div className={styles.crownHalo} aria-hidden="true" />
            <div className={styles.crownRing} aria-hidden="true" />
            <div className={styles.crownInner}>
              <AnimatedAsset type="crown" size={150} animation="glow" alt="Ultimate crown reward" />
            </div>
            <div className={styles.crownGlint} aria-hidden="true" />
            <div className={styles.crownFloor} aria-hidden="true" />
          </div>

          {/* Value section */}
          <div className={styles.vipValueSection}>
            <div className={styles.vipBrandChip}>Amazon Gift Card</div>
            <h3 className={styles.vipValueHeadline}>₹{amount} Gift Card</h3>
            <p className={styles.vipSubtext}>The grand finale of your 7-day streak</p>
          </div>

          {/* 7-segment progress dots */}
          <div className={styles.progressDots} aria-label={`${completedDays} of 7 days completed`}>
            {Array.from({ length: 7 }, (_, i) => {
              const dotDay = i + 1;
              const isFilled = dotDay < completedDays + 1;
              const isActive = dotDay === completedDays + 1 && !isClaimed;
              return (
                <div
                  key={dotDay}
                  className={`${styles.progressDot} ${isFilled ? styles.progressDotFilled : ''} ${isActive ? styles.progressDotActive : ''}`}
                  title={`Day ${dotDay}`}
                />
              );
            })}
          </div>
          <div className={styles.progressLabel}>
            {completedDays} of 7 days completed
          </div>
        </div>

        {/* Action area */}
        <div className={styles.vipAction}>
          {isClaimed ? (
            <div className={styles.vipClaimedPill}>
              <CheckCircle2 size={18} />
              <span>Claimed on Day 7</span>
            </div>
          ) : isAvailable ? (
            <button
              type="button"
              className={styles.vipClaimBtn}
              onClick={() => onClaimClick && onClaimClick(day)}
              disabled={isClaiming}
              aria-label="Claim VIP Day 7 reward"
            >
              <span className={styles.vipBtnSweep} aria-hidden="true" />
              <Crown size={16} />
              <span>{isClaiming ? 'Claiming…' : 'Claim Ultimate Reward'}</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <div className={styles.vipLockPill}>
              <span className={styles.pillSweep} aria-hidden="true" />
              <Lock size={16} className={styles.vipLockIcon} />
              <span>
                Unlock on <strong className={styles.boldDay}>Day 7</strong>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UltimateReward;
