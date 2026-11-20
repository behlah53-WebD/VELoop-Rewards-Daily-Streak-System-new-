import { useState, useCallback, useRef } from 'react';
import streakApi from '../services/streakApi.js';
import { useToast } from '../context/ToastContext.jsx';

/**
 * useClaimFlow Hook
 * Coordinates the two-phase claim flow:
 * Phase 1: POST /api/daily-streak/claim -> sets up CPA demo state
 * Phase 2: POST /api/daily-streak/claim/confirm -> atomic credit and state commit
 *
 * Enforces double-click protection and clean error mapping.
 */
export function useClaimFlow({ onSuccess = null, onCompleted = null } = {}) {
  const { showToast } = useToast();
  const [claimStep, setClaimStep] = useState('IDLE'); // 'IDLE' | 'INITIATING' | 'CPA_DEMO' | 'CONFIRMING' | 'SUCCESS' | 'ERROR'
  const [pendingClaim, setPendingClaim] = useState(null); // { claimId, demoDurationMs, day }
  const [claimResult, setClaimResult] = useState(null);
  const isProcessingRef = useRef(false);

  const initiateClaim = useCallback(
    async (day = null) => {
      if (isProcessingRef.current) return;
      isProcessingRef.current = true;
      setClaimStep('INITIATING');

      try {
        const res = await streakApi.initiateClaim(day);
        if (res?.success && res?.claimId) {
          const claimPayload = {
            claimId: res.claimId,
            demoDurationMs: res.demoDurationMs || 3000,
            day,
          };
          setPendingClaim(claimPayload);
          setClaimStep('CPA_DEMO');
          return claimPayload;
        }
      } catch (err) {
        setClaimStep('ERROR');
        isProcessingRef.current = false;
        const msg = err.message || 'Unable to initiate claim. Please try again.';
        showToast(msg, 'error');
        throw err;
      }
    },
    [showToast]
  );

  const confirmClaim = useCallback(
    async (claimIdInput = null) => {
      const claimId = claimIdInput || pendingClaim?.claimId;
      if (!claimId) {
        setClaimStep('ERROR');
        isProcessingRef.current = false;
        return;
      }

      setClaimStep('CONFIRMING');
      const idempotencyKey = `claim-${claimId}-${Date.now()}`;

      try {
        const res = await streakApi.confirmClaim(claimId, idempotencyKey);
        if (res?.success) {
          setClaimResult(res);
          setClaimStep('SUCCESS');
          showToast(`Reward claimed! +${res.reward?.amount} ${res.reward?.currency} added to your wallet`, 'success');

          if (onSuccess) {
            onSuccess(res);
          }
          return res;
        }
      } catch (err) {
        setClaimStep('ERROR');
        const msg = err.message || 'Unable to confirm claim. Please try again.';
        showToast(msg, 'error');
        throw err;
      } finally {
        isProcessingRef.current = false;
        if (onCompleted) {
          onCompleted();
        }
      }
    },
    [pendingClaim, onSuccess, onCompleted, showToast]
  );

  const resetClaimFlow = useCallback(() => {
    isProcessingRef.current = false;
    setClaimStep('IDLE');
    setPendingClaim(null);
    setClaimResult(null);
  }, []);

  return {
    claimStep,
    pendingClaim,
    claimResult,
    isProcessing: claimStep === 'INITIATING' || claimStep === 'CONFIRMING',
    initiateClaim,
    confirmClaim,
    resetClaimFlow,
  };
}

export default useClaimFlow;
