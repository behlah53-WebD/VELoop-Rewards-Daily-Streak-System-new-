import RewardCard from './RewardCard.jsx';
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
  const isDesktop = useMediaQuery('(min-width: 1100px)');

  if (!rewards || rewards.length === 0) return null;

  // On wide desktop (>=1100px), display 7 cards in a single row
  if (isDesktop && rewards.length === 7) {
    return (
      <div className={styles.gridContainer}>
        <div className={styles.desktopRow}>
          {rewards.map((rewardItem) => (
            <RewardCard
              key={rewardItem.day}
              rewardItem={rewardItem}
              serverTime={serverTime}
              nextClaimAt={nextClaimAt}
              onClaimClick={onClaimClick}
              onUnlocked={onUnlocked}
              isClaiming={isClaiming}
            />
          ))}
        </div>
      </div>
    );
  }

  // Mobile / Tablet: 4 cards in Row 1 + 3 cards in Row 2
  const row1Cards = rewards.slice(0, 4);
  const row2Cards = rewards.slice(4);

  return (
    <div className={styles.gridContainer}>
      <div className={styles.row1}>
        {row1Cards.map((rewardItem) => (
          <RewardCard
            key={rewardItem.day}
            rewardItem={rewardItem}
            serverTime={serverTime}
            nextClaimAt={nextClaimAt}
            onClaimClick={onClaimClick}
            onUnlocked={onUnlocked}
            isClaiming={isClaiming}
          />
        ))}
      </div>

      <div className={styles.row2}>
        {row2Cards.map((rewardItem) => (
          <RewardCard
            key={rewardItem.day}
            rewardItem={rewardItem}
            serverTime={serverTime}
            nextClaimAt={nextClaimAt}
            onClaimClick={onClaimClick}
            onUnlocked={onUnlocked}
            isClaiming={isClaiming}
          />
        ))}
      </div>
    </div>
  );
}

export default RewardGrid;
