import { useState, useEffect, useCallback, useRef } from 'react';
import streakApi from '../services/streakApi.js';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * useDailyStreak Hook
 * Fetches and manages the single source of truth for the daily streak.
 * Integrates BroadcastChannel for cross-tab sync and window visibility listeners.
 */
export function useDailyStreak() {
  const { updateWallet, isAuthenticated } = useAuth();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const broadcastChannelRef = useRef(null);

  const fetchStreak = useCallback(
    async (isBackground = false) => {
      if (!isAuthenticated) {
        setStatus('idle');
        return;
      }

      if (isBackground) {
        setIsRefreshing(true);
      } else {
        setStatus('loading');
      }

      try {
        const res = await streakApi.getDailyStreak();
        if (res?.success) {
          setData(res);
          setError(null);
          setStatus('success');
          if (res.wallet) {
            updateWallet(res.wallet);
          }
        }
      } catch (err) {
        setError(err);
        setStatus('error');
      } finally {
        setIsRefreshing(false);
      }
    },
    [isAuthenticated, updateWallet]
  );

  // Initial fetch
  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  // Window visibility & focus listener (refetch when user returns to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchStreak(true);
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleVisibilityChange);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [fetchStreak]);

  // BroadcastChannel for cross-tab sync
  useEffect(() => {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      const channel = new BroadcastChannel('veloop_streak_sync');
      broadcastChannelRef.current = channel;

      channel.onmessage = (event) => {
        if (event.data?.type === 'STREAK_UPDATED') {
          fetchStreak(true);
        }
      };

      return () => {
        channel.close();
      };
    }
  }, [fetchStreak]);

  const notifyStreakUpdated = useCallback(() => {
    if (broadcastChannelRef.current) {
      try {
        broadcastChannelRef.current.postMessage({ type: 'STREAK_UPDATED', timestamp: Date.now() });
      } catch {
        // BroadcastChannel failed silently
      }
    }
  }, []);

  const refresh = useCallback(
    (isBackground = true) => {
      return fetchStreak(isBackground);
    },
    [fetchStreak]
  );

  return {
    data,
    status,
    error,
    refresh,
    isRefreshing,
    notifyStreakUpdated,
  };
}

export default useDailyStreak;
