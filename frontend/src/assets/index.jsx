/**
 * VELoop Rewards — Central Asset Map
 * Maps asset types ('coin', 'gift-box', 'gift-card', 'crown', 'gem', 'logo', 'calendar')
 * to dedicated SVG components or asset paths.
 * If external PNG/WebP files are added in the future, they can be imported and swapped here.
 */

export const VeloopLogo = ({ className = '', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="VELoop Logo"
  >
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="50%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#FFC83D" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="19" stroke="url(#logoGrad)" strokeWidth="2" fill="#120B24" />
    <path
      d="M13 14L20 28L27 14"
      stroke="url(#logoGrad)"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="20" cy="18" r="2.5" fill="#FFC83D" />
  </svg>
);

export const GemIcon = ({ className = '', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Gem"
  >
    <defs>
      <linearGradient id="gemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C4B5FD" />
        <stop offset="50%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#6D28D9" />
      </linearGradient>
    </defs>
    <path
      d="M6 3L18 3L22 9L12 21L2 9L6 3Z"
      fill="url(#gemGrad)"
      stroke="#DDD6FE"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M12 21L7 9L12 3L17 9L12 21Z" fill="rgba(255,255,255,0.18)" />
    <path d="M2 9H22" stroke="#DDD6FE" strokeWidth="1.2" />
  </svg>
);

export const CoinAsset = ({ className = '', size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Gold Coin Reward"
  >
    <defs>
      <radialGradient id="coinFace" cx="40%" cy="35%" r="65%">
        <stop offset="0%" stopColor="#FFF275" />
        <stop offset="45%" stopColor="#FFC83D" />
        <stop offset="85%" stopColor="#E69500" />
        <stop offset="100%" stopColor="#B36B00" />
      </radialGradient>
      <linearGradient id="coinRim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE082" />
        <stop offset="100%" stopColor="#B36B00" />
      </linearGradient>
      <filter id="coinGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#FFC83D" floodOpacity="0.35" />
      </filter>
    </defs>
    <g filter="url(#coinGlow)">
      <circle cx="32" cy="32" r="28" fill="url(#coinRim)" />
      <circle cx="32" cy="32" r="24" fill="url(#coinFace)" stroke="#FFF275" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="20" stroke="#FFE082" strokeWidth="1" strokeDasharray="3 2" />
      <text
        x="32"
        y="39"
        textAnchor="middle"
        fontFamily="Sora, sans-serif"
        fontWeight="800"
        fontSize="18"
        fill="#5E3800"
      >
        VE
      </text>
    </g>
  </svg>
);

export const GiftBoxAsset = ({ className = '', size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Mystery Gift Box"
  >
    <defs>
      <linearGradient id="boxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#9061F9" />
        <stop offset="100%" stopColor="#5B21B6" />
      </linearGradient>
      <linearGradient id="lidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
      <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE082" />
        <stop offset="100%" stopColor="#F59E0B" />
      </linearGradient>
      <filter id="boxGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#8B5CF6" floodOpacity="0.4" />
      </filter>
    </defs>
    <g filter="url(#boxGlow)">
      {/* Box Body */}
      <rect x="12" y="26" width="40" height="30" rx="4" fill="url(#boxGrad)" stroke="#C4B5FD" strokeWidth="1" />
      {/* Box Lid */}
      <rect x="9" y="19" width="46" height="10" rx="3" fill="url(#lidGrad)" stroke="#DDD6FE" strokeWidth="1" />
      {/* Vertical Ribbon */}
      <rect x="28" y="19" width="8" height="37" fill="url(#ribbonGrad)" />
      {/* Horizontal Ribbon */}
      <rect x="12" y="37" width="40" height="7" fill="url(#ribbonGrad)" />
      {/* Ribbon Bow */}
      <path
        d="M25 19C25 13 28 10 32 16C36 10 39 13 39 19C35 17 33 17 32 19C31 17 29 17 25 19Z"
        fill="url(#ribbonGrad)"
      />
    </g>
  </svg>
);

export const GiftCardAsset = ({ className = '', size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Amazon Gift Card"
  >
    <defs>
      <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#232F3E" />
        <stop offset="100%" stopColor="#131921" />
      </linearGradient>
      <linearGradient id="cardGlowFilter" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF9900" />
        <stop offset="100%" stopColor="#FFC83D" />
      </linearGradient>
      <filter id="giftCardShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#FF9900" floodOpacity="0.35" />
      </filter>
    </defs>
    <g filter="url(#giftCardShadow)">
      <rect x="6" y="16" width="52" height="34" rx="5" fill="url(#cardBg)" stroke="#FF9900" strokeWidth="1.5" />
      {/* Amazon Smile Arc */}
      <path
        d="M17 38C23 43 37 43 45 36"
        stroke="#FF9900"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M43 34L47 37L43 40" fill="#FF9900" />
      {/* Card text */}
      <text x="14" y="27" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="7.5" fill="#FFFFFF">
        amazon
      </text>
      <text x="44" y="26" fontFamily="Sora, sans-serif" fontWeight="700" fontSize="8" fill="#FFC83D">
        ₹
      </text>
    </g>
  </svg>
);

export const CrownAsset = ({ className = '', size = 72 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Ultimate Reward Crown"
  >
    <defs>
      <linearGradient id="crownGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFF48F" />
        <stop offset="40%" stopColor="#FFC83D" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <filter id="crownGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#FFC83D" floodOpacity="0.55" />
      </filter>
    </defs>
    <g filter="url(#crownGlow)">
      <path
        d="M10 46L6 22L20 32L32 14L44 32L58 22L54 46H10Z"
        fill="url(#crownGold)"
        stroke="#FFEAA7"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Jewels on tips */}
      <circle cx="6" cy="22" r="3" fill="#A855F7" stroke="#FFF" strokeWidth="1" />
      <circle cx="32" cy="14" r="3.5" fill="#EF4444" stroke="#FFF" strokeWidth="1" />
      <circle cx="58" cy="22" r="3" fill="#A855F7" stroke="#FFF" strokeWidth="1" />
      {/* Base band */}
      <rect x="10" y="46" width="44" height="6" rx="2" fill="#B45309" stroke="#FFC83D" strokeWidth="1" />
      {/* Base gems */}
      <circle cx="18" cy="49" r="1.5" fill="#60A5FA" />
      <circle cx="27" cy="49" r="1.5" fill="#34D399" />
      <circle cx="36" cy="49" r="1.5" fill="#F472B6" />
      <circle cx="45" cy="49" r="1.5" fill="#60A5FA" />
    </g>
  </svg>
);

export const CalendarAsset = ({ className = '', size = 56 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Calendar Streak"
  >
    <defs>
      <linearGradient id="calHeader" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#6D28D9" />
      </linearGradient>
    </defs>
    <rect x="8" y="14" width="48" height="42" rx="8" fill="#1A1033" stroke="#8B5CF6" strokeWidth="1.5" />
    <path d="M8 22C8 17.5817 11.5817 14 16 14H48C52.4183 14 56 17.5817 56 22V26H8V22Z" fill="url(#calHeader)" />
    <rect x="18" y="8" width="4" height="10" rx="2" fill="#C4B5FD" />
    <rect x="42" y="8" width="4" height="10" rx="2" fill="#C4B5FD" />
    {/* Flame/Check inside */}
    <circle cx="22" cy="35" r="3" fill="#22C55E" />
    <circle cx="32" cy="35" r="3" fill="#22C55E" />
    <circle cx="42" cy="35" r="3" fill="#22C55E" />
    <circle cx="22" cy="45" r="3" fill="#22C55E" />
    <circle cx="32" cy="45" r="3.5" fill="#FFC83D" />
  </svg>
);

/**
 * Maps assetType string to its respective component
 */
// eslint-disable-next-line react-refresh/only-export-components
export const getAssetByType = (type, props = {}) => {
  switch (type) {
    case 'coin':
      return <CoinAsset {...props} />;
    case 'gift-box':
      return <GiftBoxAsset {...props} />;
    case 'gift-card':
      return <GiftCardAsset {...props} />;
    case 'crown':
      return <CrownAsset {...props} />;
    case 'calendar':
      return <CalendarAsset {...props} />;
    case 'gem':
      return <GemIcon {...props} />;
    case 'logo':
      return <VeloopLogo {...props} />;
    default:
      return <CoinAsset {...props} />;
  }
};

export default {
  VeloopLogo,
  GemIcon,
  CoinAsset,
  GiftBoxAsset,
  GiftCardAsset,
  CrownAsset,
  CalendarAsset,
  getAssetByType,
};
