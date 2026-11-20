import { Check } from 'lucide-react';
import styles from './ProgressRail.module.css';

export function ProgressRail({ currentDay = 1, claimedDays = [], totalDays = 7 }) {
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  // Calculate width percentage of completed track line
  const completedCount = claimedDays.length;
  const progressPercent = totalDays > 1 ? (Math.min(completedCount, totalDays - 1) / (totalDays - 1)) * 100 : 0;

  return (
    <div className={styles.railContainer} aria-label="Streak progression track">
      <div className={styles.railWrapper}>
        <div className={styles.trackLine} />
        <div
          className={styles.activeTrackLine}
          style={{ width: `${progressPercent}%` }}
        />

        {days.map((day) => {
          const isClaimed = claimedDays.includes(day);
          const isActive = day === currentDay && !isClaimed;

          let nodeClass = styles.node;
          if (isClaimed) nodeClass += ` ${styles.nodeClaimed}`;
          else if (isActive) nodeClass += ` ${styles.nodeActive}`;

          return (
            <div key={day} className={nodeClass} title={`Day ${day}`}>
              {isClaimed ? <Check size={14} strokeWidth={3} /> : day}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressRail;
