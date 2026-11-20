import { RefreshCw, AlertCircle } from 'lucide-react';
import styles from './ErrorState.module.css';

export function ErrorState({ error, onRetry }) {
  const getErrorMessage = () => {
    if (!error) return 'Unable to load your rewards. Please check your network connection.';
    switch (error.code) {
      case 'UNAUTHENTICATED':
        return 'Your session has expired. Please log in again to view your streak.';
      case 'NETWORK_ERROR':
        return 'Network connection lost. Please make sure the backend server is reachable.';
      case 'RATE_LIMITED':
        return 'Too many requests. Please wait a moment before trying again.';
      default:
        return error.message || 'Unable to load streak rewards at this time.';
    }
  };

  return (
    <div className={styles.errorWrapper} role="alert">
      <div className={styles.errorCard}>
        <div className={styles.iconCircle}>
          <AlertCircle size={36} color="var(--danger)" />
        </div>

        <h2 className={styles.title}>Oops! Something went wrong</h2>
        <p className={styles.message}>{getErrorMessage()}</p>

        {onRetry && (
          <button type="button" onClick={onRetry} className={styles.retryBtn}>
            <RefreshCw size={18} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorState;
