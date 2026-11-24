import RewardCard from './RewardCard.jsx';
import VipCard from './UltimateReward.jsx';
import { useMediaQuery } from '../../../hooks/useMediaQuery.js';
import styles from './RewardGrid.module.css';

export function RewardGrid({
  rewards = [],
  serverTime = null,
  nextClaimAt = null,
  onClaimClick = null,
  onUnlocked = null,
  isClaiming = false,
}) {
  const isDesktop = useMediaQuery('(min-width: 1200px)');
  const isTablet  = useMediaQuery('(min-width: 768px)');

  if (!rewards || rewards.length === 0) return null;

  // Separate Day 7 (ultimate) from Days 1–6
  const days1to6 = rewards.filter((r) => !r.isUltimate);
  const day7     = rewards.find((r) => r.isUltimate);

  const sharedCardProps = {
    serverTime,
    nextClaimAt,
    onClaimClick,
    onUnlocked,
    isClaiming,
  };

  /* ── DESKTOP: 12-col grid, Days 1-6 in 3×2, VIP in 4-col right ── */
  if (isDesktop) {
    return (
      <div className={styles.gridSection}>
        <div className={styles.desktopLayout}>
          <div className={styles.daysGrid}>
            {days1to6.map((rewardItem, idx) => (
              <RewardCard
                key={rewardItem.day}
                rewardItem={rewardItem}
                index={idx}
                {...sharedCardProps}
              />
            ))}
          </div>

          {day7 && (
            <div className={styles.vipSlot}>
              <VipCard
                ultimateReward={day7.reward}
                currentDay={day7.day}
                rewardItem={day7}
                onClaimClick={onClaimClick}
                isClaiming={isClaiming}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── TABLET: 2×3 or 3×2 grid Days 1-6, VIP full-width below ── */
  if (isTablet) {
    return (
      <div className={styles.gridSection}>
        <div className={styles.tabletLayout}>
          <div className={styles.tabletDaysGrid}>
            {days1to6.map((rewardItem, idx) => (
              <RewardCard
                key={rewardItem.day}
                rewardItem={rewardItem}
                index={idx}
                {...sharedCardProps}
              />
            ))}
          </div>

          {day7 && (
            <div className={styles.tabletVipRow}>
              <VipCard
                ultimateReward={day7.reward}
                currentDay={day7.day}
                rewardItem={day7}
                onClaimClick={onClaimClick}
                isClaiming={isClaiming}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ── MOBILE (< 768px): 3×2 grid (Days 1–6) + full-width Day 7 VIP finale card ── */
  return (
    <div className={styles.gridSection}>
      <div className={styles.mobileLayout}>
        <div className={styles.mobileDaysGrid}>
          {days1to6.map((rewardItem, idx) => (
            <RewardCard
              key={rewardItem.day}
              rewardItem={rewardItem}
              index={idx}
              {...sharedCardProps}
            />
          ))}
        </div>

        {day7 && (
          <div className={styles.mobileVipSlot}>
            <VipCard
              ultimateReward={day7.reward}
              currentDay={day7.day}
              rewardItem={day7}
              onClaimClick={onClaimClick}
              isClaiming={isClaiming}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default RewardGrid;
