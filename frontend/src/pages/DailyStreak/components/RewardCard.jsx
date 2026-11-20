import { useServerCountdown } from '../../../hooks/useServerCountdown.js';
import { AnimatedAsset } from '../../../components/AnimatedAsset/AnimatedAsset.jsx';
import { Check, Lock, Clock, ChevronRight } from 'lucide-react';
import styles from './RewardCard.module.css';

export function RewardCard({
  rewardItem,
  serverTime = null,
  nextClaimAt = null,
  onClaimClick = null,
  onUnlocked = null,
  isClaiming = false,
}) {
  const { day, status, badge, assetType, isUltimate, reward } = rewardItem;

  // Use countdown hook only when status is 'TODAY'
  const countdown = useServerCountdown(
    status === 'TODAY' ? serverTime : null,
    status === 'TODAY' ? nextClaimAt : null,
    onUnlocked
  );

  const getCardClassName = () => {
    let classes = styles.card;
    if (isUltimate) classes += ` ${styles.cardUltimate}`;
    switch (status) {
      case 'CLAIMED':
        return `${classes} ${styles.cardClaimed}`;
      case 'AVAILABLE':
        return `${classes} ${styles.cardAvailable}`;
      case 'TODAY':
        return `${classes} ${styles.cardToday}`;
      case 'MISSED':
        return `${classes} ${styles.cardMissed}`;
      default:
        return `${classes} ${styles.cardLocked}`;
    }
  };

  const getAnimation = () => {
    if (status === 'AVAILABLE') return 'pulse';
    if (isUltimate) return 'glow';
    if (status === 'TODAY') return 'float';
    return 'none';
  };

  const renderAction = () => {
    switch (status) {
      case 'CLAIMED':
        return (
          <div className={styles.claimedPill}>
            <Check size={14} strokeWidth={3} />
            Claimed
          </div>
        );

      case 'AVAILABLE':
        return (
          <button
            type="button"
            className={styles.claimBtn}
            onClick={() => onClaimClick && onClaimClick(day)}
            disabled={isClaiming}
            aria-label={`Claim reward for Day ${day}`}
          >
            {isClaiming ? 'Claiming...' : 'Claim Now'}
            <ChevronRight size={16} />
          </button>
        );

      case 'TODAY':
        return (
          <div className={styles.countdownPill} title="Next claim countdown">
            <Clock size={14} />
            <span>{countdown.formattedTime}</span>
          </div>
        );

      case 'MISSED':
        return (
          <div className={styles.missedPill}>
            Missed
          </div>
        );

      default:
        return (
          <div className={styles.lockedPill}>
            <Lock size={12} />
            Locked
          </div>
        );
    }
  };

  return (
    <div className={getCardClassName()}>
      <div className={styles.cardTop}>
        <span className={styles.dayPill}>Day {day}</span>
        {badge && (
          <span
            className={`${styles.badgePill} ${
              badge === 'VIP' ? styles.badgeGold : styles.badgeViolet
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      <div className={styles.assetWrap}>
        <AnimatedAsset
          type={assetType || 'coin'}
          size={isUltimate ? 58 : 50}
          animation={getAnimation()}
          alt={reward?.title || `Day ${day} reward`}
        />
      </div>

      <div className={styles.cardCategory}>
        {isUltimate ? 'Ultimate Reward' : 'Daily Reward'}
      </div>

      <div className={`${styles.cardValue} ${isUltimate || status === 'AVAILABLE' ? styles.goldValue : ''}`}>
        {reward?.title || `${reward?.amount} VEs`}
      </div>

      <div className={styles.cardFooter}>
        {renderAction()}
      </div>
    </div>
  );
}

export default RewardCard;
