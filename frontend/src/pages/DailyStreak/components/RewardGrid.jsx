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

  /* ── MOBILE: scroll-snap carousel, today's card first ── */
  // Sort: AVAILABLE/TODAY first, then by day
  const sortedRewards = [...rewards].sort((a, b) => {
    const priority = { AVAILABLE: 0, TODAY: 1, CLAIMED: 2, LOCKED: 3, MISSED: 4 };
    if (a.isUltimate) return 1;
    if (b.isUltimate) return -1;
    if (a.status !== b.status) return (priority[a.status] ?? 5) - (priority[b.status] ?? 5);
    return a.day - b.day;
  });

  const nonVipMobile = sortedRewards.filter((r) => !r.isUltimate);

  return (
    <div className={styles.gridSection}>
      <div className={styles.mobileLayout}>
        <div className={styles.mobileCarousel}>
          {nonVipMobile.map((rewardItem, idx) => {
            const isHero = rewardItem.status === 'AVAILABLE';
            return (
              <div
                key={rewardItem.day}
                className={`${styles.mobileCardSlot} ${isHero ? styles.mobileCardSlotHero : ''}`}
              >
                <RewardCard
                  rewardItem={rewardItem}
                  index={idx}
                  {...sharedCardProps}
                />
              </div>
            );
          })}

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

        {/* Pagination dots (decorative) */}
        <div className={styles.mobileDots} aria-hidden="true">
          {rewards.map((_, i) => (
            <div key={i} className={`${styles.mobileDot} ${i === 0 ? styles.mobileDotActive : ''}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default RewardGrid;
