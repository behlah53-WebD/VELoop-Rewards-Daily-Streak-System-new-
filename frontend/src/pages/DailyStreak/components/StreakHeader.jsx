import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { GemIcon } from '../../../assets/index.jsx';
import { ChevronLeft, Flame, LogOut } from 'lucide-react';
import styles from './StreakHeader.module.css';

export function StreakHeader({ walletBalance = 0 }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.leftSection}>
          <button
            type="button"
            className={styles.backBtn}
            onClick={() => navigate(-1)}
            aria-label="Go back"
            title="Go back"
          >
            <ChevronLeft size={20} className={styles.backIcon} />
          </button>

          <div className={styles.brandTitleWrap}>
            <h1 className={styles.pageTitle}>
              Daily Streak
              <span className={styles.flameWrap}>
                <Flame size={21} className={styles.flameIcon} />
                <span className={styles.flameGlow} aria-hidden="true" />
              </span>
            </h1>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.balancePill} title="Your current VE balance">
            <span className={styles.gemWrap}>
              <GemIcon size={19} />
            </span>
            <span className={styles.balanceValue}>{walletBalance} VEs</span>
            <span className={styles.pillShimmer} aria-hidden="true" />
          </div>

          <div className={styles.logoutWrapper}>
            <button
              type="button"
              className={styles.logoutBtn}
              onClick={logout}
              title="Log out"
              aria-label="Log out"
            >
              <LogOut size={17} />
            </button>
            <span className={styles.logoutTooltip}>Logout</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default StreakHeader;
