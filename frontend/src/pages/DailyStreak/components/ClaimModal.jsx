import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import CpaDemo from './CpaDemo.jsx';
import { AnimatedAsset } from '../../../components/AnimatedAsset/AnimatedAsset.jsx';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';
import styles from './ClaimModal.module.css';

export function ClaimModal({
  isOpen,
  claimStep, // 'CPA_DEMO' | 'CONFIRMING' | 'SUCCESS' | 'ERROR'
  pendingClaim, // { claimId, demoDurationMs, day }
  claimResult, // { day, reward, wallet }
  onVerified,
  onClose,
}) {
  const modalRef = useRef(null);

  // Trigger confetti celebration on SUCCESS
  useEffect(() => {
    if (claimStep === 'SUCCESS') {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#FFC83D', '#7C3AED', '#22C55E', '#A78BFA'],
        });
      } catch {
        // Fallback silently if canvas not available
      }
    }
  }, [claimStep]);

  // Trap focus and prevent ESC key during in-progress claim verification
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      const isProcessing = claimStep === 'CPA_DEMO' || claimStep === 'CONFIRMING';
      if (e.key === 'Escape' && !isProcessing) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, claimStep, onClose]);

  if (!isOpen) return null;

  const isProcessing = claimStep === 'CPA_DEMO' || claimStep === 'CONFIRMING';

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby="claim-modal-title"
    >
      <div className={styles.modal} ref={modalRef}>
        {!isProcessing && (
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        )}

        {/* Phase 1 & 2: CPA Demo and Processing */}
        {(claimStep === 'CPA_DEMO' || claimStep === 'CONFIRMING') && (
          <CpaDemo
            durationMs={pendingClaim?.demoDurationMs || 3000}
            onVerified={onVerified}
          />
        )}

        {/* Phase 3: Success Reveal */}
        {claimStep === 'SUCCESS' && (
          <div className={styles.successContainer}>
            <div className={styles.shimmerAura}>
              <AnimatedAsset
                type={claimResult?.reward?.type === 'VES' ? 'coin' : 'crown'}
                size={76}
                animation="glow"
              />
            </div>

            <h3 id="claim-modal-title" className={styles.successTitle}>
              <Sparkles size={18} style={{ display: 'inline', marginRight: 6 }} />
              Reward Unlocked!
            </h3>

            <div className={styles.rewardTitle}>
              {claimResult?.reward?.title || `Day ${claimResult?.day} Reward`}
            </div>

            <div className={styles.rewardSub}>
              <CheckCircle2 size={16} style={{ display: 'inline', marginRight: 6 }} />
              Added to your VELoop Wallet
            </div>

            <button type="button" className={styles.continueBtn} onClick={onClose}>
              Awesome!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClaimModal;
