import { getAssetByType } from '../../assets/index.jsx';
import styles from './AnimatedAsset.module.css';

/**
 * AnimatedAsset Component
 * Renders vector SVG assets or pre-animated assets (.webp/.webm) with gentle, restrained CSS animations.
 * Strictly respects prefers-reduced-motion.
 *
 * @param {string} type - 'coin' | 'gift-box' | 'gift-card' | 'crown' | 'calendar' | 'gem' | 'logo'
 * @param {number} size - pixel size
 * @param {string} animation - 'float' | 'pulse' | 'glow' | 'shine' | 'none'
 * @param {string} preAnimatedSrc - Optional pre-rendered webp or video source
 */
export function AnimatedAsset({
  type = 'coin',
  size = 56,
  animation = 'none',
  className = '',
  preAnimatedSrc = null,
  alt = '',
}) {
  const animClass = animation !== 'none' && styles[animation] ? styles[animation] : '';

  return (
    <div
      className={`${styles.container} ${animClass} ${className}`.trim()}
      style={{ width: size, height: size }}
      role="img"
      aria-label={alt || `${type} reward asset`}
    >
      {preAnimatedSrc ? (
        <img
          src={preAnimatedSrc}
          alt={alt || `${type} asset`}
          width={size}
          height={size}
          loading="lazy"
          style={{ objectFit: 'contain' }}
        />
      ) : (
        getAssetByType(type, { size })
      )}
    </div>
  );
}

export default AnimatedAsset;
