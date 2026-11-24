import { Link } from 'react-router-dom';
import { AnimatedAsset } from '../../../components/AnimatedAsset/AnimatedAsset.jsx';
import { Flame, Trophy, CheckCircle, Gift, ChevronRight, Sparkles } from 'lucide-react';
import styles from './HeroBanner.module.css';

/*
  HeroBanner now serves as the full Streak Command Center.
  It still accepts NO props of its own (banner is decorative),
  but we consume streakData via a co-located prop so DailyStreakPage
  doesn't change its call signature.

  LOGIC UNCHANGED: no API calls, no state, no hooks added.
  Only JSX structure and class names changed.
*/
export function HeroBanner({ streakData }) {
  const currentStreak = streakData?.currentStreak || 0;
  const totalRewards  = streakData?.totalRewards || 7;
  const checkedIn     = streakData?.checkedIn || 0;
  const nextReward    = streakData?.nextReward;

  const getNextRewardText = () => {
    if (!nextReward) return 'Available';
    if (nextReward.type === 'VES') return `+${nextReward.amount} VEs`;
    return `₹${nextReward.amount} Voucher`;
  };

  /* SVG ring calculation */
  const circumference = 2 * Math.PI * 45; // r=45
  const progress = totalRewards > 0 ? checkedIn / totalRewards : 0;
  const offset   = circumference * (1 - progress);

  return (
    <div className={styles.banner}>
      {/* Background decorations */}
      <div className={styles.auroraGlow1} aria-hidden="true" />
      <div className={styles.auroraGlow2} aria-hidden="true" />
      <div className={styles.gridLines}   aria-hidden="true" />
      <div className={styles.sparkleField} aria-hidden="true">
        <span className={`${styles.starDot} ${styles.star1}`} />
        <span className={`${styles.starDot} ${styles.star2}`} />
        <span className={`${styles.starDot} ${styles.star3}`} />
        <span className={`${styles.starDot} ${styles.star4}`} />
      </div>

      {/* Floating decorative assets — edge-only, no text overlap */}
      <div className={`${styles.artAsset} ${styles.artLeft}`}>
        <AnimatedAsset type="calendar" size={56} animation="none" alt="" />
      </div>
      <div className={`${styles.artAsset} ${styles.artRight}`}>
        <AnimatedAsset type="gift-box" size={52} animation="none" alt="" />
      </div>

      {/* ── LEFT: Circular Progress Ring ── */}
      <div className={styles.ringColumn}>
        <span className={styles.ringKicker}>Your streak</span>
        <div className={styles.progressRingWrap}>
          <svg
            className={styles.progressRingSvg}
            viewBox="0 0 100 100"
            aria-label={`${checkedIn} of ${totalRewards} days checked in`}
          >
            <defs>
              <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%"   stopColor="#34d399" />
                <stop offset="50%"  stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ffc93c" />
              </linearGradient>
            </defs>
            <circle className={styles.ringTrack} cx="50" cy="50" r="45" />
            <circle
              className={styles.ringFill}
              cx="50"
              cy="50"
              r="45"
              style={{ strokeDashoffset: offset.toFixed(2) }}
            />
          </svg>

          <div className={styles.ringCenter}>
            <div className={styles.flameWrap}>
              <Flame size={20} className={styles.flameIcon} />
              <span className={styles.flameGlow} aria-hidden="true" />
            </div>
            <span className={styles.streakNumber}>{currentStreak}</span>
            <span className={styles.streakLabel}>{currentStreak === 1 ? 'DAY' : 'DAYS'} IN A ROW</span>
          </div>
        </div>
      </div>

      {/* ── MIDDLE: 3 stat chips ── */}
      <div className={styles.statsColumn} aria-label="Your reward progress">
        <div className={styles.statChip}>
          <div className={`${styles.statIconBadge}`}>
            <Trophy size={13} />
          </div>
          <div className={styles.statText}>
            <span className={styles.statLabel}>Total Rewards</span>
            <span className={styles.statValue}>{totalRewards} Milestones</span>
          </div>
        </div>

        <div className={styles.statChip}>
          <div className={`${styles.statIconBadge} ${styles.statIconSuccess}`}>
            <CheckCircle size={13} />
          </div>
          <div className={styles.statText}>
            <span className={styles.statLabel}>Checked In</span>
            <span className={styles.statValue}>
              {checkedIn}<span className={styles.statSuffix}> / {totalRewards}</span>
            </span>
          </div>
        </div>

        <div className={`${styles.statChip} ${styles.statChipGold}`}>
          <div className={`${styles.statIconBadge} ${styles.statIconGold}`}>
            <Gift size={13} />
          </div>
          <div className={styles.statText}>
            <span className={styles.statLabel}>Next Reward</span>
            <span className={`${styles.statValue} ${styles.statValueGold}`}>
              {getNextRewardText()}
            </span>
          </div>
        </div>
      </div>

      {/* ── RIGHT: Headline + Streak Calendar link ── */}
      <div className={styles.textColumn}>
        <span className={styles.badgePill}><Sparkles size={12} /> DAILY REWARDS <span className={styles.badgeDivider} /> 7-DAY JOURNEY</span>
        <h2 className={styles.headline}>
          Login Daily &amp; Earn{' '}
          <span className={styles.goldText}>Bigger Rewards!</span>
        </h2>
        <p className={styles.subtext}>
          Maintain your streak and unlock{' '}
          <span className={styles.highlightText}>exciting rewards</span> every day.
        </p>
        <Link to="/daily-streak/calendar" className={styles.calendarLink}>
          <span>Explore your calendar</span>
          <ChevronRight size={15} />
        </Link>
      </div>
    </div>
  );
}

export default HeroBanner;
