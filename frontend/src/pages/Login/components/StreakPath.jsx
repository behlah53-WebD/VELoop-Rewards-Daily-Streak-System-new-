import { Check, Flame, Lock, Trophy, Sparkles } from 'lucide-react';
import styles from './StreakPath.module.css';

const NODES_DATA = [
  { day: 1, state: 'completed', icon: 'check', label: 'Day 1' },
  { day: 2, state: 'completed', icon: 'flame', label: 'Day 2' },
  { day: 3, state: 'completed', icon: 'check', label: 'Day 3' },
  { day: 4, state: 'current', icon: 'flame', label: 'Day 4', tag: 'TODAY' },
  { day: 5, state: 'locked', icon: 'lock', label: 'Day 5' },
  { day: 6, state: 'locked', icon: 'lock', label: 'Day 6' },
  { day: 7, state: 'ultimate', icon: 'trophy', label: 'Day 7', tag: 'GRAND REWARD' },
];

export function StreakPath({ isCompact = false }) {
  return (
    <div className={`${styles.streakContainer} ${isCompact ? styles.compactMode : ''}`}>
      <div className={styles.headerRow}>
        <div className={styles.streakIndicator}>
          <Flame size={16} className={styles.flameIcon} />
          <span className={styles.streakIndicatorText}>7-Day Milestone Path</span>
        </div>
        <span className={styles.streakCounter}>Day 4 of 7 Active</span>
      </div>

      <div className={styles.pathWrapper}>
        {/* SVG Self-Drawing Connecting Line */}
        <svg className={styles.svgTrack} preserveAspectRatio="none" viewBox="0 0 600 20">
          <defs>
            <linearGradient id="trackGradBg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.08)" />
              <stop offset="100%" stopColor="rgba(255, 255, 255, 0.04)" />
            </linearGradient>
            <linearGradient id="trackGradActive" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#34D399" />
              <stop offset="50%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#FFC93C" />
            </linearGradient>
          </defs>
          {/* Background track line */}
          <line x1="20" y1="10" x2="580" y2="10" stroke="url(#trackGradBg)" strokeWidth="4" strokeLinecap="round" />
          {/* Animated active path line (up to Day 4) */}
          <line
            x1="20"
            y1="10"
            x2="300"
            y2="10"
            stroke="url(#trackGradActive)"
            strokeWidth="4"
            strokeLinecap="round"
            className={styles.animatedDrawLine}
          />
        </svg>

        {/* 7 Interactive Nodes */}
        <div className={styles.nodesGrid}>
          {NODES_DATA.map((node, index) => {
            const isCompleted = node.state === 'completed';
            const isCurrent = node.state === 'current';
            const isLocked = node.state === 'locked';
            const isUltimate = node.state === 'ultimate';

            let nodeClass = styles.node;
            if (isCompleted) nodeClass += ` ${styles.nodeCompleted}`;
            if (isCurrent) nodeClass += ` ${styles.nodeCurrent}`;
            if (isLocked) nodeClass += ` ${styles.nodeLocked}`;
            if (isUltimate) nodeClass += ` ${styles.nodeUltimate}`;

            return (
              <div
                key={node.day}
                className={styles.nodeColumn}
                style={{ animationDelay: `${index * 80 + 200}ms` }}
              >
                <div className={nodeClass}>
                  {isCompleted && <Check size={14} strokeWidth={3} className={styles.iconCheck} />}
                  {isCurrent && (
                    <>
                      <Flame size={16} className={styles.iconFlame} />
                      <span className={styles.currentPulseRing} aria-hidden="true" />
                    </>
                  )}
                  {isLocked && <Lock size={12} className={styles.iconLock} />}
                  {isUltimate && (
                    <>
                      <Trophy size={16} className={styles.iconTrophy} />
                      <span className={styles.trophySparkle} aria-hidden="true">
                        <Sparkles size={10} />
                      </span>
                    </>
                  )}
                </div>

                <span className={styles.dayLabel}>
                  {node.tag ? (
                    <span className={isCurrent ? styles.tagCurrent : styles.tagUltimate}>
                      {node.tag}
                    </span>
                  ) : (
                    `D${node.day}`
                  )}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default StreakPath;
