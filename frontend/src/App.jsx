import { useState } from 'react';
import { VeloopLogo, GemIcon, CoinAsset, CrownAsset } from './assets/index.js';

export function App() {
  const [gemCount] = useState(120);

  return (
    <div className="min-vh-100 d-flex flex-column">
      {/* Scaffold Header */}
      <header className="py-3 px-4 border-bottom" style={{ borderColor: 'var(--border-subtle)', background: 'var(--surface-overlay)' }}>
        <div className="container-fluid d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center gap-2">
            <VeloopLogo size={36} />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-main)' }}>
              VELoop <span style={{ color: 'var(--gold-text)' }}>Rewards</span>
            </span>
          </div>

          <div
            className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill"
            style={{
              background: 'var(--surface-raised)',
              border: '1px solid var(--border-default)',
              boxShadow: 'var(--glow-sm)',
            }}
          >
            <GemIcon size={18} />
            <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--violet-soft)' }}>
              {gemCount} VEs
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="container my-auto py-5 text-center">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div
              className="p-4 p-md-5 rounded-4"
              style={{
                background: 'var(--surface-card)',
                border: '1px solid var(--border-default)',
                boxShadow: 'var(--glow-md)',
              }}
            >
              <div className="d-flex justify-content-center gap-3 mb-4">
                <CoinAsset size={52} />
                <CrownAsset size={58} />
              </div>

              <h1 className="h3 mb-3" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                Daily Streak &amp; Rewards Engine
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Scaffold phase completed. Presentation layer configured with Design Tokens, Bootstrap 5, and ES Modules.
              </p>

              <div className="mt-4 pt-3 border-top" style={{ borderColor: 'var(--border-subtle)' }}>
                <span
                  className="badge px-3 py-2 rounded-pill"
                  style={{
                    background: 'var(--success-bg)',
                    color: 'var(--success)',
                    border: '1px solid var(--success-border)',
                    fontSize: '0.85rem',
                  }}
                >
                  Phase 1 Scaffold Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Scaffold Footer */}
      <footer className="py-3 text-center border-top" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
        VELoop Rewards &copy; 2026. Official rewards only on VeloopRewards.in
      </footer>
    </div>
  );
}

export default App;
