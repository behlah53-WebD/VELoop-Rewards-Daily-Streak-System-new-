import { Link } from 'react-router-dom';
import { Flame, ChevronRight } from 'lucide-react';
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

  return (
    <div className={styles.statsContainer}>
      <div className={styles.topBar}>
        <div className={styles.streakBadge}>
          <Flame size={16} color="#ff6b00" />
          <span>
            {currentStreak > 0 ? `${currentStreak} Day Streak` : 'Start your streak'}
          </span>
        </div>

        <Link to="/daily-streak/calendar" className={styles.calendarLink}>
          Streak Calendar <ChevronRight size={16} />
        </Link>
      </div>

      <div className={styles.tilesGrid}>
        <div className={styles.tile}>
          <div className={styles.tileLabel}>Total Rewards</div>
          <div className={styles.tileValue}>{totalRewards}</div>
        </div>

        <div className={styles.tile}>
          <div className={styles.tileLabel}>Checked In</div>
          <div className={styles.tileValue}>
            {checkedIn} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ {totalRewards}</span>
          </div>
        </div>

        <div className={styles.tile}>
          <div className={styles.tileLabel}>Next Reward</div>
          <div className={`${styles.tileValue} ${styles.goldValue}`}>
            {getNextRewardText()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default StreakStats;
