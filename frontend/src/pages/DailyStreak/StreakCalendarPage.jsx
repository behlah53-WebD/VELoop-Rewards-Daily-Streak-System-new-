import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import streakApi from '../../services/streakApi.js';
import { useAuth } from '../../context/AuthContext.jsx';
import StreakHeader from './components/StreakHeader.jsx';
import TrustFooter from './components/TrustFooter.jsx';
import { ArrowLeft, Calendar, Loader2 } from 'lucide-react';
import styles from './StreakCalendar.module.css';

export function StreakCalendarPage() {
  const { wallet } = useAuth();
  const [claims, setClaims] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchHistory(page = 1) {
      setIsLoading(true);
      try {
        const res = await streakApi.getHistory(page, 20);
        if (isMounted && res?.success) {
          setClaims(res.claims || []);
          if (res.pagination) {
            setPagination(res.pagination);
          }
        }
      } catch {
        // Fallback gracefully
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchHistory(pagination.page);

    return () => {
      isMounted = false;
    };
  }, [pagination.page]);

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className={styles.wrapper}>
      <StreakHeader walletBalance={wallet.VES} />

      <main className={styles.container}>
        <div className={styles.topBar}>
          <Link to="/daily-streak" className={styles.backLink}>
            <ArrowLeft size={18} />
            Back to Daily Streak
          </Link>

          <h2 className={styles.title}>
            <Calendar size={22} color="var(--gold-start)" />
            Streak History
          </h2>
        </div>

        <div className={styles.historyCard}>
          <div className={styles.tableHeader}>
            <div>Day</div>
            <div>Reward</div>
            <div>Date</div>
            <div>Status</div>
          </div>

          {isLoading ? (
            <div className="d-flex justify-content-center py-5">
              <Loader2 size={32} className="animate-spin" color="var(--violet-soft)" />
            </div>
          ) : claims.length === 0 ? (
            <div className={styles.emptyState}>
              <Calendar size={48} color="var(--text-subtle)" style={{ marginBottom: 12 }} />
              <p>No streak history recorded yet. Claim your first day to start your streak!</p>
            </div>
          ) : (
            claims.map((claim) => (
              <div key={claim._id || claim.claimId} className={styles.rowItem}>
                <div>
                  <span className={styles.dayBadge}>Day {claim.day}</span>
                </div>

                <div className={styles.rewardInfo}>
                  <span className={styles.rewardName}>
                    {claim.rewardSnapshot?.title || `${claim.rewardSnapshot?.amount} ${claim.rewardSnapshot?.currency}`}
                  </span>
                  {claim.transactionId && (
                    <span className={styles.txId}>Tx: {claim.transactionId.substring(0, 13)}…</span>
                  )}
                </div>

                <div className={styles.dateText}>
                  {formatDate(claim.claimedAt || claim.createdAt)}
                </div>

                <div>
                  <span
                    className={`${styles.statusPill} ${
                      claim.status === 'COMPLETED'
                        ? styles.statusCompleted
                        : styles.statusMissed
                    }`}
                  >
                    {claim.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {pagination.totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              type="button"
              className={styles.pageBtn}
              onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
              disabled={pagination.page <= 1}
            >
              Previous
            </button>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              type="button"
              className={styles.pageBtn}
              onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
            </button>
          </div>
        )}
      </main>

      <TrustFooter />
    </div>
  );
}

export default StreakCalendarPage;
