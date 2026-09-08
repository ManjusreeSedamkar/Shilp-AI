import React from 'react';

interface AppLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const AppLogo: React.FC<AppLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center space-x-2.5 ${className} select-none`}>
      {/* Attractive, Simple & Elegant Geometric Logo Mark */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-sm transition-transform hover:scale-105 duration-200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle Background Shield/Diamond */}
          <rect
            x="8"
            y="8"
            width="84"
            height="84"
            rx="24"
            className="fill-stone-900"
          />
          {/* Saffron & Amber Gradient Contour */}
          <defs>
            <linearGradient id="shilpGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <linearGradient id="threadGlow" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#fed7aa" />
            </linearGradient>
          </defs>

          {/* Traditional Interlocking Artisan Loom / Diamond Vault */}
          <path
            d="M50 18L78 46L50 74L22 46Z"
            stroke="url(#shilpGold)"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          
          {/* Inner Weave Threads representing Handloom & Pottery geometry */}
          <path
            d="M50 26L70 46L50 66L30 46Z"
            stroke="white"
            strokeOpacity="0.3"
            strokeWidth="1.5"
          />

          {/* Central AI Spark Star: The intelligence bridging Craft to Commerce */}
          <path
            d="M50 34C50 42 42 50 34 50C42 50 50 58 50 66C50 58 58 50 66 50C58 50 50 42 50 34Z"
            fill="url(#threadGlow)"
          />
          <circle cx="50" cy="50" r="3" fill="#ffffff" />

          {/* Four Corner Heritage Dots representing North, South, East, West crafts of India */}
          <circle cx="50" cy="14" r="2.5" fill="#f59e0b" />
          <circle cx="82" cy="46" r="2.5" fill="#ea580c" />
          <circle cx="50" cy="78" r="2.5" fill="#dc2626" />
          <circle cx="18" cy="46" r="2.5" fill="#fbbf24" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-black tracking-tight text-stone-900 ${textSizes[size]}`}>
            SHILP
          </span>
          <span className={`font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-saffron-600 to-amber-500 ${textSizes[size]}`}>
            AI
          </span>
          <span className="text-[10px] font-semibold text-stone-400 font-sans tracking-wide ml-0.5">
            शिल्प
          </span>
        </div>
        {showTagline && (
          <span className="text-[10.5px] font-medium text-stone-500 tracking-tight leading-tight mt-0.5">
            Craft to Commerce
          </span>
        )}
      </div>
    </div>
  );
};
