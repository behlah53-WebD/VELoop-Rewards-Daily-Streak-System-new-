import { Check, Crown } from 'lucide-react';
import styles from './ProgressRail.module.css';

export function ProgressRail({ currentDay = 1, claimedDays = [], totalDays = 7 }) {
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  // Calculate width percentage of completed track line up to claimed days or active day
  const maxReached = Math.max(
    claimedDays.length,
    Math.min(currentDay - 1, totalDays - 1)
  );
  const progressPercent = totalDays > 1 ? (maxReached / (totalDays - 1)) * 100 : 0;

  return (
    <div className={styles.railContainer} aria-label="Streak progression track">
      <div className={styles.railWrapper}>
        {/* Inactive background track */}
        <div className={styles.trackLine} />

        {/* Active glowing gradient track */}
        <div
          className={styles.activeTrackLine}
          style={{ width: `${progressPercent}%` }}
        />

        {days.map((day) => {
          const isClaimed = claimedDays.includes(day);
          const isActive = day === currentDay && !isClaimed;
          const isUpcoming = !isClaimed && !isActive;
          const isDay7 = day === 7;

          let nodeClass = styles.node;
          if (isClaimed) nodeClass += ` ${styles.nodeClaimed}`;
          else if (isActive) nodeClass += ` ${styles.nodeActive}`;
          else if (isUpcoming) nodeClass += ` ${styles.nodeUpcoming}`;

          return (
            <div key={day} className={styles.nodeColumn}>
              <div className={nodeClass} title={`Day ${day}`}>
                {isClaimed ? (
                  <Check size={14} strokeWidth={3} className={styles.checkIcon} />
                ) : isDay7 ? (
                  <Crown size={14} className={styles.crownNodeIcon} />
                ) : (
                  <span>{day}</span>
                )}
                {isActive && <span className={styles.activeHalo} aria-hidden="true" />}
              </div>
              <span className={styles.dayCaption}>D{day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProgressRail;
