import { Link } from 'react-router-dom';
import { Flame, ChevronRight, Trophy, CheckCircle, Gift } from 'lucide-react';
import styles from './StreakStats.module.css';

export function StreakStats({ streakData }) {
  const currentStreak = streakData?.currentStreak || 0;
  const totalRewards = streakData?.totalRewards || 7;
  const checkedIn = streakData?.checkedIn || 0;
  const nextReward = streakData?.nextReward;

  const getNextRewardText = () => {
    if (!nextReward) return '+10 VEs';
    if (nextReward.type === 'VES') {
      return `+${nextReward.amount} VEs`;
    }
    return `₹${nextReward.amount} Voucher`;
  };

  const checkInProgressPct = totalRewards > 0 ? (checkedIn / totalRewards) * 100 : 0;

  return (
    <div className={styles.statsContainer}>
      <div className={styles.topBar}>
        <div className={styles.streakBadge}>
          <span className={styles.flameIconWrap}>
            <Flame size={16} className={styles.flameIcon} />
          </span>
          <span>
            {currentStreak > 0 ? `${currentStreak} Day Streak` : 'Start your streak'}
          </span>
        </div>

        <Link to="/daily-streak/calendar" className={styles.calendarLink}>
          <span>Streak Calendar</span>
          <ChevronRight size={15} className={styles.calendarArrow} />
        </Link>
      </div>

      <div className={styles.tilesGrid}>
        {/* Bento Tile 1: Total Rewards */}
        <div className={styles.tile}>
          <div className={styles.tileHeader}>
            <span className={styles.tileIconBadge}>
              <Trophy size={14} />
            </span>
            <span className={styles.tileLabel}>Total Rewards</span>
          </div>
          <div className={styles.tileValue}>{totalRewards}</div>
          <div className={styles.tileSub}>Milestones available</div>
        </div>

        {/* Bento Tile 2: Checked In */}
        <div className={styles.tile}>
          <div className={styles.tileHeader}>
            <span className={`${styles.tileIconBadge} ${styles.badgeSuccess}`}>
              <CheckCircle size={14} />
            </span>
            <span className={styles.tileLabel}>Checked In</span>
          </div>
          <div className={styles.tileValue}>
            {checkedIn} <span className={styles.denominator}>/ {totalRewards}</span>
          </div>
          {/* Mini progress bar on Checked In tile */}
          <div className={styles.miniProgressTrack}>
            <div
              className={styles.miniProgressFill}
              style={{ width: `${checkInProgressPct}%` }}
            />
          </div>
        </div>

        {/* Bento Tile 3: Next Reward (Golden glow) */}
        <div className={`${styles.tile} ${styles.tileNextReward}`}>
          <div className={styles.tileHeader}>
            <span className={`${styles.tileIconBadge} ${styles.badgeGold}`}>
              <Gift size={14} />
            </span>
            <span className={styles.tileLabel}>Next Reward</span>
          </div>
          <div className={`${styles.tileValue} ${styles.goldValue}`}>
            {getNextRewardText()}
          </div>
          <div className={styles.tileSubGold}>Next daily unlock</div>
        </div>
      </div>
    </div>
  );
}

export default StreakStats;
