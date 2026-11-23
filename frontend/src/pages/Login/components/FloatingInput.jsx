import { useState } from 'react';
import { Eye, EyeOff, Check, AlertTriangle } from 'lucide-react';
import styles from './FloatingInput.module.css';

export function FloatingInput({
  id,
  label,
  type = 'text',
  value = '',
  onChange,
  icon = null,
  autoComplete,
  required = false,
  disabled = false,
  error = null,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);

  const isPassword = type === 'password';
  const isEmail = type === 'email';
  const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

  // Validate email format in real-time
  const isValidEmail = isEmail && value.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const isFloating = isFocused || (value && value.length > 0);

  const handleKeyDown = (e) => {
    if (isPassword && e.getModifierState) {
      setCapsLockActive(e.getModifierState('CapsLock'));
    }
  };

  const handleKeyUp = (e) => {
    if (isPassword && e.getModifierState) {
      setCapsLockActive(e.getModifierState('CapsLock'));
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (isPassword) {
      setCapsLockActive(false);
    }
  };

  return (
    <div className={`${styles.fieldGroup} ${error ? styles.hasError : ''}`}>
      <div className={`${styles.inputContainer} ${isFocused ? styles.focused : ''} ${value ? styles.filled : ''}`}>
        {/* Left Icon */}
        {icon && <div className={styles.leftIconWrapper}>{icon}</div>}

        {/* Floating Label */}
        <label
          htmlFor={id}
          className={`${styles.floatingLabel} ${isFloating ? styles.labelFloating : ''} ${icon ? styles.labelWithIcon : ''}`}
        >
          {label}
        </label>

        {/* The Native Input */}
        <input
          id={id}
          type={effectiveType}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          className={`${styles.nativeInput} ${icon ? styles.inputWithLeftIcon : ''} ${isPassword || isValidEmail ? styles.inputWithRightAdornment : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
        />

        {/* Right Adornment 1: Email Valid Check */}
        {isEmail && isValidEmail && (
          <div className={styles.validCheckBadge} title="Valid email format" aria-label="Valid email format">
            <Check size={14} strokeWidth={3} />
          </div>
        )}

        {/* Right Adornment 2: Password Eye Toggle */}
        {isPassword && (
          <button
            type="button"
            className={styles.eyeToggleBtn}
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            tabIndex={-1}
            disabled={disabled}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* Caps Lock Warning Banner */}
      {isPassword && capsLockActive && (
        <div className={styles.capsLockBadge} role="alert">
          <AlertTriangle size={13} className={styles.capsWarningIcon} />
          <span>Caps Lock is ON</span>
        </div>
      )}

      {/* Inline Validation Error Message */}
      {error && (
        <div id={`${id}-error`} className={styles.errorMessage} role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

export default FloatingInput;
