import { useState, useEffect, useRef, useCallback } from 'react';
import streakApi from '../services/streakApi.js';

/**
 * useServerCountdown Hook
 * Monotonic countdown timer immune to local device clock tampering.
 * When reaching ~0, queries the server status to verify unlock before flipping the UI.
 *
 * @param {string|Date} serverTime - Server ISO string or Date when status was fetched
 * @param {string|Date} nextClaimAt - Target unlock timestamp
 * @param {Function} onUnlocked - Callback invoked once server confirms target day is unlocked
 */
export function useServerCountdown(serverTime, nextClaimAt, onUnlocked = null) {
  const [remainingMs, setRemainingMs] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const syncTimeoutRef = useRef(null);

  // Store performance reference and initial server time anchor
  const timingRef = useRef({
    serverTimeMs: serverTime ? new Date(serverTime).getTime() : 0,
    perfAtFetch: performance.now(),
    targetMs: nextClaimAt ? new Date(nextClaimAt).getTime() : 0,
  });

  // Update timing anchor whenever serverTime or nextClaimAt changes from backend response
  useEffect(() => {
    if (serverTime && nextClaimAt) {
      const serverTimeMs = new Date(serverTime).getTime();
      const targetMs = new Date(nextClaimAt).getTime();
      timingRef.current = {
        serverTimeMs,
        perfAtFetch: performance.now(),
        targetMs,
      };
    }
  }, [serverTime, nextClaimAt]);

  const syncWithServer = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      const res = await streakApi.getStatus();
      if (res?.canClaim && onUnlocked) {
        onUnlocked(res);
      } else if (res?.nextClaimAt) {
        // Still waiting: update anchor with new server time
        timingRef.current = {
          serverTimeMs: new Date(res.serverTime).getTime(),
          perfAtFetch: performance.now(),
          targetMs: new Date(res.nextClaimAt).getTime(),
        };
      }
    } catch {
      // Retry in 3 seconds on network error
      syncTimeoutRef.current = setTimeout(syncWithServer, 3000);
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, onUnlocked]);

  useEffect(() => {
    if (!nextClaimAt) {
      setRemainingMs(0);
      return;
    }

    const interval = setInterval(() => {
      const { serverTimeMs, perfAtFetch, targetMs } = timingRef.current;
      if (!serverTimeMs || !targetMs) return;

      const elapsedMs = performance.now() - perfAtFetch;
      const currentServerTime = serverTimeMs + elapsedMs;
      const diff = Math.max(0, targetMs - currentServerTime);

      setRemainingMs(diff);

      if (diff <= 0) {
        clearInterval(interval);
        syncWithServer();
      }
    }, 1000);

    // Initial tick
    const { serverTimeMs, perfAtFetch, targetMs } = timingRef.current;
    if (serverTimeMs && targetMs) {
      const elapsedMs = performance.now() - perfAtFetch;
      const diff = Math.max(0, targetMs - (serverTimeMs + elapsedMs));
      setRemainingMs(diff);
      if (diff <= 0) syncWithServer();
    }

    return () => {
      clearInterval(interval);
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
    };
  }, [nextClaimAt, syncWithServer]);

  // Format as HH:MM:SS
  const totalSeconds = Math.floor(remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (n) => String(n).padStart(2, '0');
  const formattedTime = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

  return {
    remainingMs,
    formattedTime,
    hours,
    minutes,
    seconds,
    isZero: remainingMs <= 0,
    isSyncing,
  };
}

export default useServerCountdown;
