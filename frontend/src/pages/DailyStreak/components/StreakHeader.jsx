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
          >
            <ChevronLeft size={20} />
          </button>
          <h1 className={styles.pageTitle}>
            Daily Streak <Flame size={20} className={styles.flameIcon} />
          </h1>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.balancePill} title="Your current VE balance">
            <GemIcon size={18} />
            <span className={styles.balanceValue}>{walletBalance} VEs</span>
          </div>

          <button
            type="button"
            className={styles.logoutBtn}
            onClick={logout}
            title="Log out"
            aria-label="Log out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default StreakHeader;
