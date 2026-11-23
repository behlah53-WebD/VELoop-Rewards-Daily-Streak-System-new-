/**
 * VELoop Rewards — Midnight Aurora Luxe Asset Library
 * High-craft vector illustrations with 3D depths, multi-stop metallic gradients,
 * specular bevel highlights, and layered glows.
 */

export const VeloopLogo = ({ className = '', size = 32 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="VELoop Logo"
  >
    <defs>
      <linearGradient id="vlLogoRing" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#C4B5FD" />
        <stop offset="35%" stopColor="#8B5CF6" />
        <stop offset="70%" stopColor="#6D28D9" />
        <stop offset="100%" stopColor="#FFC93C" />
      </linearGradient>
      <linearGradient id="vlLogoInner" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1C0F42" />
        <stop offset="100%" stopColor="#0B0620" />
      </linearGradient>
      <linearGradient id="vlVeeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="50%" stopColor="#DDD6FE" />
        <stop offset="100%" stopColor="#FFC93C" />
      </linearGradient>
      <filter id="vlLogoGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#8B5CF6" floodOpacity="0.45" />
      </filter>
    </defs>
    <g filter="url(#vlLogoGlow)">
      <circle cx="24" cy="24" r="22" fill="url(#vlLogoInner)" stroke="url(#vlLogoRing)" strokeWidth="2.5" />
      <circle cx="24" cy="24" r="18" stroke="rgba(255,255,255,0.08)" strokeWidth="1" strokeDasharray="2 3" />
      {/* Dynamic V Chevron */}
      <path
        d="M15 16.5L24 33L33 16.5"
        stroke="url(#vlVeeGrad)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="21" r="3" fill="#FFC93C" />
      <circle cx="24" cy="21" r="1.2" fill="#FFFFFF" />
    </g>
  </svg>
);

export const GemIcon = ({ className = '', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Gem"
  >
    <defs>
      <linearGradient id="gemTopGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#E9D5FF" />
        <stop offset="50%" stopColor="#C4B5FD" />
        <stop offset="100%" stopColor="#A78BFA" />
      </linearGradient>
      <linearGradient id="gemFacetLeft" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#5B21B6" />
      </linearGradient>
      <linearGradient id="gemFacetMid" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="50%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#4C1D95" />
      </linearGradient>
      <linearGradient id="gemFacetRight" x1="100%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#38BDF8" />
      </linearGradient>
      <filter id="gemGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#8B5CF6" floodOpacity="0.55" />
      </filter>
    </defs>
    <g filter="url(#gemGlowFilter)">
      {/* Crown upper facets */}
      <polygon points="8,4 24,4 30,12 2,12" fill="url(#gemTopGrad)" stroke="#F3E8FF" strokeWidth="0.8" />
      <polygon points="12,4 20,4 24,12 8,12" fill="rgba(255,255,255,0.35)" />
      {/* Pavilion lower facets */}
      <polygon points="2,12 8,12 16,28" fill="url(#gemFacetLeft)" stroke="#C4B5FD" strokeWidth="0.6" />
      <polygon points="8,12 24,12 16,28" fill="url(#gemFacetMid)" stroke="#DDD6FE" strokeWidth="0.6" />
      <polygon points="24,12 30,12 16,28" fill="url(#gemFacetRight)" stroke="#C4B5FD" strokeWidth="0.6" />
      {/* Specular sparkle highlight */}
      <polygon points="13,6 15,6 17,12 11,12" fill="rgba(255,255,255,0.6)" />
    </g>
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
      <radialGradient id="coinFaceLuxe" cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="25%" stopColor="#FFE08A" />
        <stop offset="55%" stopColor="#FFC93C" />
        <stop offset="85%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#92400E" />
      </radialGradient>
      <linearGradient id="coinRimLuxe" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="30%" stopColor="#FFC93C" />
        <stop offset="70%" stopColor="#B45309" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
      <linearGradient id="coinInnerBevel" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#78350F" />
        <stop offset="100%" stopColor="#FFFBEB" />
      </linearGradient>
      <filter id="coinGlowLuxe" x="-25%" y="-25%" width="150%" height="150%">
        <feDropShadow dx="0" dy="6" stdDeviation="7" floodColor="#F59E0B" floodOpacity="0.5" />
      </filter>
    </defs>
    <g filter="url(#coinGlowLuxe)">
      {/* Outer Rim Chamfer */}
      <circle cx="32" cy="32" r="28" fill="url(#coinRimLuxe)" />
      {/* Inner Rim Groove */}
      <circle cx="32" cy="32" r="25.5" fill="url(#coinInnerBevel)" />
      {/* Center Face */}
      <circle cx="32" cy="32" r="23.5" fill="url(#coinFaceLuxe)" />
      {/* Beaded rim dots */}
      <circle cx="32" cy="32" r="21" stroke="#FDE68A" strokeWidth="0.8" strokeDasharray="1.5 2.5" opacity="0.8" />
      {/* Embossed Drop Shadow for VE Monogram */}
      <text
        x="32"
        y="39.5"
        textAnchor="middle"
        fontFamily="Sora, sans-serif"
        fontWeight="800"
        fontSize="17"
        fill="#78350F"
        opacity="0.85"
      >
        VE
      </text>
      {/* Embossed Main VE Monogram */}
      <text
        x="32"
        y="38.5"
        textAnchor="middle"
        fontFamily="Sora, sans-serif"
        fontWeight="800"
        fontSize="17"
        fill="#FFFBEB"
      >
        VE
      </text>
      {/* Top Specular Crescent Sheen */}
      <path
        d="M13 25C15 16 23 10 32 10C41 10 49 16 51 25C46 17 38 12 32 12C26 12 18 17 13 25Z"
        fill="rgba(255, 255, 255, 0.45)"
      />
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
      <linearGradient id="gbBoxBody" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#7C3AED" />
        <stop offset="50%" stopColor="#5B21B6" />
        <stop offset="100%" stopColor="#3B0764" />
      </linearGradient>
      <linearGradient id="gbBoxLid" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="40%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#5B21B6" />
      </linearGradient>
      <linearGradient id="gbGoldRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="30%" stopColor="#FFE08A" />
        <stop offset="70%" stopColor="#FFC93C" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <filter id="gbGlowLuxe" x="-25%" y="-25%" width="150%" height="150%">
        <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#8B5CF6" floodOpacity="0.45" />
      </filter>
    </defs>
    <g filter="url(#gbGlowLuxe)">
      {/* Box Body */}
      <rect x="11" y="27" width="42" height="30" rx="6" fill="url(#gbBoxBody)" stroke="#A78BFA" strokeWidth="1" />
      {/* Box Lid */}
      <rect x="8" y="19" width="48" height="11" rx="4" fill="url(#gbBoxLid)" stroke="#DDD6FE" strokeWidth="1.2" />
      {/* Vertical Ribbon with Gold Sheen */}
      <rect x="27.5" y="19" width="9" height="38" fill="url(#gbGoldRibbon)" />
      <rect x="29" y="19" width="2" height="38" fill="rgba(255,255,255,0.4)" />
      {/* Horizontal Ribbon */}
      <rect x="11" y="38" width="42" height="8" fill="url(#gbGoldRibbon)" />
      {/* Double Loop Bow */}
      <path
        d="M23 19C17 11 25 7 31 16C37 7 45 11 39 19C35 17 33 17 31 19C29 17 27 17 23 19Z"
        fill="url(#gbGoldRibbon)"
        stroke="#FFFBEB"
        strokeWidth="0.8"
      />
      <circle cx="31" cy="18" r="2.5" fill="#FFE08A" />
      {/* Sparkle Glint */}
      <polygon points="40,14 41.5,17 44,18 41.5,19 40,22 38.5,19 36,18 38.5,17" fill="#FFFBEB" />
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
      <linearGradient id="gcTitanium" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#2D214F" />
        <stop offset="50%" stopColor="#1B1233" />
        <stop offset="100%" stopColor="#0E0824" />
      </linearGradient>
      <linearGradient id="gcGoldTrim" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFE08A" />
        <stop offset="50%" stopColor="#FF9900" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <filter id="gcGlowLuxe" x="-25%" y="-25%" width="150%" height="150%">
        <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="#FF9900" floodOpacity="0.45" />
      </filter>
    </defs>
    <g filter="url(#gcGlowLuxe)">
      {/* Card Base */}
      <rect x="5" y="15" width="54" height="35" rx="6" fill="url(#gcTitanium)" stroke="url(#gcGoldTrim)" strokeWidth="1.5" />
      {/* Diagonal Sheen Streak */}
      <path d="M12 15L32 15L20 50L5 50Z" fill="rgba(255, 255, 255, 0.05)" />
      {/* Microchip Contact */}
      <rect x="11" y="21" width="8" height="6.5" rx="1.5" fill="#FFE08A" opacity="0.85" />
      {/* Amazon Smile Arc */}
      <path
        d="M18 38.5C24 43.5 37 43.5 45 37"
        stroke="#FF9900"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M43 34.5L47.5 37.5L43.5 40.5" fill="#FF9900" />
      {/* Amazon Text */}
      <text x="21" y="27" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="7.5" fill="#FFFFFF" letterSpacing="0.3">
        amazon
      </text>
      {/* Currency Pill */}
      <text x="47" y="26" fontFamily="Sora, sans-serif" fontWeight="800" fontSize="9" fill="#FFE08A">
        ₹
      </text>
    </g>
  </svg>
);

export const CrownAsset = ({ className = '', size = 72 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 68 68"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    role="img"
    aria-label="Ultimate Reward Crown"
  >
    <defs>
      <linearGradient id="crGoldFace" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FFFBEB" />
        <stop offset="25%" stopColor="#FFE08A" />
        <stop offset="55%" stopColor="#FFC93C" />
        <stop offset="85%" stopColor="#D97706" />
        <stop offset="100%" stopColor="#78350F" />
      </linearGradient>
      <linearGradient id="crBaseTrim" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#FFE08A" />
        <stop offset="100%" stopColor="#92400E" />
      </linearGradient>
      <filter id="crGlowLuxe" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#FFC93C" floodOpacity="0.65" />
      </filter>
    </defs>
    <g filter="url(#crGlowLuxe)">
      {/* Conic Halo Glow Behind Crown */}
      <circle cx="34" cy="34" r="26" fill="rgba(255, 201, 60, 0.08)" />
      {/* Main Crown Facets */}
      <path
        d="M10 49L6 23L21 34L34 14L47 34L62 23L58 49H10Z"
        fill="url(#crGoldFace)"
        stroke="#FFFBEB"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      {/* Front Specular Bevel */}
      <path d="M34 14L28 34L34 49L40 34L34 14Z" fill="rgba(255,255,255,0.22)" />
      {/* Peak Jewels */}
      <circle cx="6" cy="23" r="3.5" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="1" />
      <circle cx="21" cy="34" r="2.8" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="0.8" />
      <circle cx="34" cy="14" r="4.5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.2" />
      <circle cx="47" cy="34" r="2.8" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="0.8" />
      <circle cx="62" cy="23" r="3.5" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="1" />
      {/* Imperial Base Band */}
      <rect x="10" y="49" width="48" height="7.5" rx="3" fill="url(#crBaseTrim)" stroke="#FFE08A" strokeWidth="1" />
      {/* Base Inset Jewels */}
      <circle cx="18" cy="52.8" r="2" fill="#38BDF8" />
      <circle cx="28" cy="52.8" r="2" fill="#34D399" />
      <circle cx="38" cy="52.8" r="2" fill="#F472B6" />
      <circle cx="48" cy="52.8" r="2" fill="#38BDF8" />
      {/* Light Glint */}
      <polygon points="34,8 35.5,12 39,13.5 35.5,15 34,19 32.5,15 29,13.5 32.5,12" fill="#FFFFFF" />
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
      <linearGradient id="calHeaderLuxe" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="50%" stopColor="#7C3AED" />
        <stop offset="100%" stopColor="#5B21B6" />
      </linearGradient>
      <linearGradient id="calBodyLuxe" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1E123F" />
        <stop offset="100%" stopColor="#100828" />
      </linearGradient>
      <filter id="calGlowLuxe" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#8B5CF6" floodOpacity="0.4" />
      </filter>
    </defs>
    <g filter="url(#calGlowLuxe)">
      <rect x="7" y="13" width="50" height="44" rx="9" fill="url(#calBodyLuxe)" stroke="#8B5CF6" strokeWidth="1.5" />
      <path d="M7 22C7 17.0294 11.0294 13 16 13H48C52.9706 13 57 17.0294 57 22V27H7V22Z" fill="url(#calHeaderLuxe)" />
      {/* Calendar Rings */}
      <rect x="17" y="7" width="5" height="11" rx="2.5" fill="#FFE08A" stroke="#78350F" strokeWidth="0.8" />
      <rect x="42" y="7" width="5" height="11" rx="2.5" fill="#FFE08A" stroke="#78350F" strokeWidth="0.8" />
      {/* Grid Checkmarks */}
      <circle cx="20" cy="35" r="3" fill="#34D399" />
      <circle cx="32" cy="35" r="3" fill="#34D399" />
      <circle cx="44" cy="35" r="3" fill="#34D399" />
      <circle cx="20" cy="46" r="3" fill="#34D399" />
      <circle cx="32" cy="46" r="4" fill="#FFC93C" />
      <circle cx="44" cy="46" r="3" fill="rgba(255,255,255,0.18)" />
    </g>
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
