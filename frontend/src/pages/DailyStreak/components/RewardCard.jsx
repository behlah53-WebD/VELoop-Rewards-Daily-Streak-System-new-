import { useServerCountdown } from '../../../hooks/useServerCountdown.js';
import { AnimatedAsset } from '../../../components/AnimatedAsset/AnimatedAsset.jsx';
import { Check, Lock, Clock, ChevronRight, Sparkles, Crown } from 'lucide-react';
import styles from './RewardCard.module.css';

export function RewardCard({
  rewardItem,
  serverTime = null,
  nextClaimAt = null,
  onClaimClick = null,
  onUnlocked = null,
  isClaiming = false,
  index = 0,
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
            <Check size={14} strokeWidth={3} className={styles.claimedCheck} />
            <span>Claimed</span>
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
            <span className={styles.btnSweep} aria-hidden="true" />
            <span className={styles.btnLabel}>
              {isClaiming ? 'Claiming...' : 'Claim Now'}
            </span>
            <ChevronRight size={15} className={styles.btnArrow} />
          </button>
        );

      case 'TODAY':
        return (
          <div className={styles.countdownPill} title="Next claim countdown">
            <Clock size={13} className={styles.clockIcon} />
            <span className={styles.countdownText}>{countdown.formattedTime}</span>
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
            <Lock size={12} className={styles.lockIcon} />
            <span>Locked</span>
          </div>
        );
    }
  };

  return (
    <div
      className={getCardClassName()}
      style={{ animationDelay: `${index * 65}ms` }}
    >
      {/* Top rim specular highlight line */}
      <div className={styles.cardTopRim} aria-hidden="true" />

      {/* Decorative sparkles on Available card */}
      {status === 'AVAILABLE' && (
        <div className={styles.availableSparkles} aria-hidden="true">
          <Sparkles size={12} className={styles.sparkleDot} />
        </div>
      )}

      {/* VIP Ribbon badge on Day 7 card */}
      {isUltimate && (
        <div className={styles.vipRibbonCorner}>
          <Crown size={11} />
          <span>VIP</span>
        </div>
      )}

      {/* Card Header (Day & Badge Tag) */}
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

      {/* Inner Aura & Reward Asset */}
      <div className={styles.assetWrap}>
        <div className={styles.assetInnerGlow} aria-hidden="true" />
        <AnimatedAsset
          type={assetType || 'coin'}
          size={isUltimate ? 62 : 52}
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

      {/* Hover unlock tooltip for locked cards */}
      {status !== 'CLAIMED' && status !== 'AVAILABLE' && status !== 'TODAY' && (
        <div className={styles.hoverHint}>
          Unlocks on Day {day}
        </div>
      )}

      <div className={styles.cardFooter}>
        {renderAction()}
      </div>
    </div>
  );
}

export default RewardCard;
