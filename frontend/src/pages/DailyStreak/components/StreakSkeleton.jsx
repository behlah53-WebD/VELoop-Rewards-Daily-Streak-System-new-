import styles from './StreakSkeleton.module.css';

export function StreakSkeleton() {
  return (
    <div className="min-vh-100 d-flex flex-column" style={{ background: 'var(--bg-gradient)' }} aria-hidden="true">
      {/* Header Skeleton */}
      <div className={`w-100 ${styles.skeletonHeader} px-4 py-3 d-flex justify-content-between align-items-center`}>
        <div className={`${styles.shimmer}`} style={{ width: 140, height: 32 }} />
        <div className={`${styles.shimmer}`} style={{ width: 100, height: 32, borderRadius: 20 }} />
      </div>

      <div className="container py-4" style={{ maxWidth: 1100 }}>
        {/* Hero Banner Skeleton */}
        <div className={`${styles.skeletonHero} ${styles.shimmer}`} />

        {/* Stats Skeleton */}
        <div className={`${styles.skeletonStats} ${styles.shimmer}`} />

        {/* Ultimate Reward Banner Skeleton */}
        <div className={`${styles.skeletonUltimate} ${styles.shimmer}`} />

        {/* Cards Row 1 */}
        <div className={styles.skeletonGrid}>
          <div className={`${styles.skeletonCard} ${styles.shimmer}`} />
          <div className={`${styles.skeletonCard} ${styles.shimmer}`} />
          <div className={`${styles.skeletonCard} ${styles.shimmer}`} />
          <div className={`${styles.skeletonCard} ${styles.shimmer}`} />
        </div>

        {/* Cards Row 2 */}
        <div className={styles.skeletonCardRow2}>
          <div className={`${styles.skeletonCard} ${styles.shimmer}`} />
          <div className={`${styles.skeletonCard} ${styles.shimmer}`} />
          <div className={`${styles.skeletonCard} ${styles.shimmer}`} />
        </div>
      </div>
    </div>
  );
}

export default StreakSkeleton;
