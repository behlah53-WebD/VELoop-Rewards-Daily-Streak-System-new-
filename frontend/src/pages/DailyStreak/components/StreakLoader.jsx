import { VeloopLogo } from '../../../assets/index.jsx';
import { AnimatedAsset } from '../../../components/AnimatedAsset/AnimatedAsset.jsx';

export function StreakLoader({ message = 'Loading your streak…' }) {
  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center p-4"
      style={{ background: 'var(--bg-gradient)' }}
      role="status"
      aria-live="polite"
    >
      <div className="position-relative mb-4">
        <AnimatedAsset type="gem" size={64} animation="pulse" />
        <div
          className="position-absolute top-50 start-50 translate-middle"
          style={{ zIndex: -1, width: 100, height: 100, borderRadius: '50%', background: 'var(--violet-glow)', filter: 'blur(20px)' }}
        />
      </div>

      <div className="d-flex align-items-center gap-2 mb-2">
        <VeloopLogo size={28} />
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>
          VELoop <span style={{ color: 'var(--gold-text)' }}>Rewards</span>
        </span>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
        {message}
      </p>

      <div className="mt-4" style={{ width: 140, height: 3, background: 'var(--surface-raised)', borderRadius: 2, overflow: 'hidden' }}>
        <div
          style={{
            width: '60%',
            height: '100%',
            background: 'var(--gold-gradient)',
            borderRadius: 2,
            animation: 'shimmerAnim 1.5s infinite linear',
          }}
        />
      </div>

      <style>{`
        @keyframes shimmerAnim {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
}

export default StreakLoader;
