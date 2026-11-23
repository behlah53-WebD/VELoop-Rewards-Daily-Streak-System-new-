import { useState } from 'react';
import { useDailyStreak } from '../../hooks/useDailyStreak.js';
import { useClaimFlow } from '../../hooks/useClaimFlow.js';
import StreakHeader from './components/StreakHeader.jsx';
import HeroBanner from './components/HeroBanner.jsx';
import StreakStats from './components/StreakStats.jsx';
import UltimateReward from './components/UltimateReward.jsx';
import ProgressRail from './components/ProgressRail.jsx';
import DividerRibbon from './components/DividerRibbon.jsx';
import RewardGrid from './components/RewardGrid.jsx';
import ClaimModal from './components/ClaimModal.jsx';
import ResetBanner from './components/ResetBanner.jsx';
import StreakLoader from './components/StreakLoader.jsx';
import ErrorState from './components/ErrorState.jsx';
import WhyStreak from './components/WhyStreak.jsx';
import TrustFooter from './components/TrustFooter.jsx';
import { Sparkles } from 'lucide-react';
import styles from './DailyStreak.module.css';

export function DailyStreakPage() {
  const { data, status, error, refresh, notifyStreakUpdated } = useDailyStreak();
  const [resetDismissed, setResetDismissed] = useState(false);

  const {
    claimStep,
    pendingClaim,
    claimResult,
    initiateClaim,
    confirmClaim,
    resetClaimFlow,
  } = useClaimFlow({
    onSuccess: () => {
      // Refresh whole UI and wallet from the single source of truth in backend
      refresh(true);
      notifyStreakUpdated();
    },
  });

  // Initial loading state
  if (status === 'loading' && !data) {
    return <StreakLoader />;
  }

  // Error state on initial fetch failure
  if (status === 'error' && !data) {
    return <ErrorState error={error} onRetry={() => refresh(false)} />;
  }

  const streak = data?.streak;
  const rewards = data?.rewards || [];
  const wallet = data?.wallet || { VES: 0, INR: 0 };
  const resetNotice = !resetDismissed ? streak?.resetNotice : null;

  const handleClaimClick = async (day) => {
    try {
      await initiateClaim(day);
    } catch {
      // Toast handles error display
    }
  };

  const handleCpaVerified = async () => {
    try {
      await confirmClaim();
    } catch {
      // Toast handles error display
    }
  };

  const handleServerUnlocked = () => {
    // Monotonic timer hit 0 and server verified unlock: refresh fresh state from backend
    refresh(true);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Ambient background lighting */}
      <div className={styles.ambientBlobTop} aria-hidden="true" />
      <div className={styles.ambientBlobBottom} aria-hidden="true" />

      <StreakHeader walletBalance={wallet.VES} />

      <main className={styles.mainContainer}>
        {/* Reset Notice Banner (lazily generated when claim window expired) */}
        {resetNotice && (
          <ResetBanner
            notice={resetNotice}
            onDismiss={() => setResetDismissed(true)}
          />
        )}

        {/* Hero Banner */}
        <HeroBanner />

        {/* Stats Row & Ultimate Reward (Tablet & Desktop Side-by-Side, Mobile Stacked) */}
        <div className={styles.statsAndUltimateRow}>
          <StreakStats streakData={streak} />
          <UltimateReward
            ultimateReward={streak?.ultimateReward}
            currentDay={streak?.currentDay}
          />
        </div>

        {/* Progress Rail */}
        <ProgressRail
          currentDay={streak?.currentDay}
          claimedDays={rewards.filter((r) => r.status === 'CLAIMED').map((r) => r.day)}
          totalDays={streak?.totalRewards || 7}
        />

        {/* Divider Ribbon */}
        <DividerRibbon canClaim={streak?.canClaim} />

        {/* Responsive 7-Day Reward Grid */}
        <RewardGrid
          rewards={rewards}
          serverTime={data?.serverTime}
          nextClaimAt={streak?.nextClaimAt}
          onClaimClick={handleClaimClick}
          onUnlocked={handleServerUnlocked}
          isClaiming={claimStep === 'INITIATING'}
        />

        {/* Don't Miss Out Callout Panel */}
        <div className={styles.dontMissOutPanel}>
          <div className={styles.lightStreak} aria-hidden="true" />
          <Sparkles size={20} className={styles.sparkleIcon} />
          <p className={styles.dontMissOutText}>
            Don&apos;t Miss Out —{' '}
            <span className={styles.dontMissOutGold}>
              come back every day &amp; unlock all rewards!
            </span>
          </p>
        </div>

        {/* Why Maintain Streak Columns */}
        <WhyStreak />
      </main>

      <TrustFooter />

      {/* Two-Phase Claim Modal with CPA Verification Simulation */}
      <ClaimModal
        isOpen={claimStep !== 'IDLE'}
        claimStep={claimStep}
        pendingClaim={pendingClaim}
        claimResult={claimResult}
        onVerified={handleCpaVerified}
        onClose={resetClaimFlow}
      />
    </div>
  );
}

export default DailyStreakPage;
