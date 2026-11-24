import { useServerCountdown } from '../../../hooks/useServerCountdown.js';
import { AnimatedAsset } from '../../../components/AnimatedAsset/AnimatedAsset.jsx';
import { Check, Lock, Clock, ChevronRight, Sparkles, Crown } from 'lucide-react';
import styles from './RewardCard.module.css';

/* Presentation-layer type chip mapping by day number (no logic change) */
const DAY_TYPE_MAP = {
  1: { label: 'COIN',      style: 'chipCoin' },
  2: { label: 'COIN',      style: 'chipCoin' },
  3: { label: 'COIN',      style: 'chipCoin' },
  4: { label: 'GIFT',      style: 'chipGift' },
  5: { label: 'GIFT CARD', style: 'chipGiftCard' },
  6: { label: 'COIN',      style: 'chipCoin' },
  7: { label: 'VIP',       style: 'chipVip' },
};

/* Spotlight color by asset type */
const SPOTLIGHT_CLASS = {
  coin:       styles.spotlightCoin,
  'gift-box': styles.spotlightGift,
  'gift-card':styles.spotlightGiftCard,
  crown:      styles.spotlightCrown,
};

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

  // Use countdown hook only when status is 'TODAY' — LOGIC UNCHANGED
  const countdown = useServerCountdown(
    status === 'TODAY' ? serverTime : null,
    status === 'TODAY' ? nextClaimAt : null,
    onUnlocked
  );

  /* ── Presentation helpers ── */
  const getCardClassName = () => {
    let classes = styles.card;
    if (isUltimate) classes += ` ${styles.cardUltimate}`;
    switch (status) {
      case 'CLAIMED':   return `${classes} ${styles.cardClaimed}`;
      case 'AVAILABLE': return `${classes} ${styles.cardAvailable}`;
      case 'TODAY':     return `${classes} ${styles.cardToday}`;
      case 'MISSED':    return `${classes} ${styles.cardMissed}`;
      default:          return `${classes} ${styles.cardLocked}`;
    }
  };

  const getAnimation = () => {
    if (status === 'AVAILABLE') return 'pulse';
    if (isUltimate) return 'glow';
    if (status === 'TODAY') return 'float';
    return 'none';
  };

  const typeChip = DAY_TYPE_MAP[day] || DAY_TYPE_MAP[1];
  const badgeToShow = isUltimate ? typeChip : (badge ? { label: badge, style: badge === 'VIP' ? 'chipVip' : 'chipGift' } : typeChip);
  const spotlightClass = SPOTLIGHT_CLASS[assetType] || styles.spotlightCoin;

  /* ── Action footer renders ── */
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
              {isClaiming ? 'Claiming…' : 'Claim Now'}
            </span>
            <ChevronRight size={15} className={styles.btnArrow} />
          </button>
        );

      case 'TODAY':
        return (
          <div
            className={styles.countdownPill}
            title="Next claim countdown"
            aria-live="polite"
            aria-label={`Unlocks in ${countdown.formattedTime}`}
          >
            <Clock size={13} className={styles.clockIcon} />
            <span className={styles.countdownLabel}>Unlocks in</span>
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
            <div className={styles.lockPillRow}>
              <Lock size={12} className={styles.lockIcon} />
              <span>Locked</span>
            </div>
            <span className={styles.unlockDay}>Unlocks Day {day}</span>
          </div>
        );
    }
  };

  /* ── Asset size ── */
  const assetSize = isUltimate ? 72 : 96;

  return (
    <div
      className={getCardClassName()}
      style={{ animationDelay: `${index * 65}ms` }}
    >
      {/* TODAY ribbon (only on AVAILABLE card) */}
      {status === 'AVAILABLE' && (
        <div className={styles.todayRibbon} aria-hidden="true">TODAY</div>
      )}

      {/* Orbiting sparkles on AVAILABLE */}
      {status === 'AVAILABLE' && (
        <div className={styles.availableSparkles} aria-hidden="true">
          <Sparkles size={12} className={styles.sparkleDot} />
          <Sparkles size={10} className={styles.sparkleDot} />
        </div>
      )}

      {/* ── ROW 1: Header — Day badge + Type chip ── */}
      <div className={styles.cardHeader}>
        <span className={styles.dayPill}>DAY {day}</span>
        <span className={`${styles.typeChip} ${styles[badgeToShow.style]}`}>
          {isUltimate && <Crown size={9} style={{ marginRight: 3 }} />}
          {badgeToShow.label}
        </span>
      </div>

      {/* ── ROW 2: Stage — asset with spotlight, floor shadow, shine ── */}
      <div className={styles.assetStage}>
        <div className={`${styles.assetSpotlight} ${spotlightClass}`} aria-hidden="true" />
        <div className={styles.assetFloor} aria-hidden="true" />

        <div className={styles.assetWrap}>
          <AnimatedAsset
            type={assetType || 'coin'}
            size={assetSize}
            animation={getAnimation()}
            alt={reward?.title || `Day ${day} reward`}
          />
          <span className={styles.assetShine} aria-hidden="true" />

          {/* Claimed stamp badge */}
          {status === 'CLAIMED' && (
            <div className={styles.claimedStamp} aria-hidden="true">
              <Check size={12} strokeWidth={3} />
            </div>
          )}

          {/* Lock badge overlay on locked asset */}
          {status !== 'CLAIMED' && status !== 'AVAILABLE' && status !== 'TODAY' && status !== 'MISSED' && (
            <div className={styles.lockBadge} aria-hidden="true">
              <Lock size={12} />
            </div>
          )}
        </div>
      </div>

      {/* ── ROW 3: Reward Info ── */}
      <div className={styles.rewardInfo}>
        <div className={styles.cardCategory}>
          {isUltimate ? 'Ultimate Reward' : 'Daily Reward'}
        </div>
        <div className={`${styles.cardValue} ${isUltimate || status === 'AVAILABLE' ? styles.goldValue : ''}`}>
          {reward?.title || `+${reward?.amount} VEs`}
        </div>
      </div>

      {/* ── ROW 4: Footer Action ── */}
      <div className={styles.cardFooter}>
        {renderAction()}
      </div>
    </div>
  );
}

export default RewardCard;
