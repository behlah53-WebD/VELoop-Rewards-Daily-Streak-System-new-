import { useState, useRef } from 'react';
import { Sparkles, Copy, Check, Terminal } from 'lucide-react';
import styles from './EvaluationTicket.module.css';

export function EvaluationTicket({
  onQuickFill,
  emailDemo = 'demo@veloop.test',
  passwordDemo = 'Demo@1234',
}) {
  const [copied, setCopied] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimerRef = useRef(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${emailDemo} / ${passwordDemo}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently ignore if clipboard permissions unavailable
    }
  };

  const handleQuickFillClick = () => {
    if (isTyping) return;
    setIsTyping(true);

    // High-polish typewriter simulation across 360ms
    let emailIdx = 0;
    let passIdx = 0;

    // Initial clear
    onQuickFill('', '');

    typingTimerRef.current = setInterval(() => {
      emailIdx = Math.min(emailDemo.length, emailIdx + 2);
      passIdx = Math.min(passwordDemo.length, passIdx + 1);

      const partialEmail = emailDemo.slice(0, emailIdx);
      const partialPass = passwordDemo.slice(0, passIdx);

      onQuickFill(partialEmail, partialPass);

      if (emailIdx >= emailDemo.length && passIdx >= passwordDemo.length) {
        clearInterval(typingTimerRef.current);
        setIsTyping(false);
      }
    }, 28);
  };

  return (
    <div className={styles.ticketCard}>
      {/* Semicircle notch cut-outs */}
      <div className={styles.notchLeft} aria-hidden="true" />
      <div className={styles.notchRight} aria-hidden="true" />

      {/* Header bar */}
      <div className={styles.ticketHeader}>
        <div className={styles.badgeLabel}>
          <Sparkles size={13} className={styles.sparkleIcon} />
          <span>Evaluation Pass</span>
        </div>

        <div className={styles.actionsGroup}>
          <button
            type="button"
            className={styles.copyBtn}
            onClick={handleCopy}
            title="Copy credentials to clipboard"
            aria-label="Copy demo credentials"
          >
            {copied ? (
              <>
                <Check size={12} className={styles.checkIcon} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            className={styles.fillBtn}
            onClick={handleQuickFillClick}
            disabled={isTyping}
            title="Autofill credentials with typewriter animation"
          >
            <Sparkles size={12} className={isTyping ? styles.typingSpin : ''} />
            <span>{isTyping ? 'Typing…' : 'Quick Fill'}</span>
          </button>
        </div>
      </div>

      {/* Perforated ticket dashed divider */}
      <div className={styles.dashedDivider} aria-hidden="true" />

      {/* Credentials code block */}
      <div className={styles.credentialsRow}>
        <Terminal size={14} className={styles.terminalIcon} aria-hidden="true" />
        <code className={styles.codeText}>
          <span className={styles.emailPart}>{emailDemo}</span>
          <span className={styles.dividerSlash}>/</span>
          <span className={styles.passPart}>{passwordDemo}</span>
        </code>
      </div>
    </div>
  );
}

export default EvaluationTicket;
