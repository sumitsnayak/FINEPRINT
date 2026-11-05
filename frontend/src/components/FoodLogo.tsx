import React from 'react';

interface FoodLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const FoodLogo: React.FC<FoodLogoProps> = ({
  size = 'md',
  showText = false,
  className = '',
}) => {
  const sizeMap = {
    sm: { box: 'w-8 h-8 rounded-xl', svg: 'w-5 h-5', text: 'text-lg' },
    md: { box: 'w-10 h-10 rounded-2xl', svg: 'w-6 h-6', text: 'text-xl' },
    lg: { box: 'w-16 h-16 rounded-3xl', svg: 'w-10 h-10', text: 'text-3xl' },
    xl: { box: 'w-20 h-20 rounded-[28px]', svg: 'w-12 h-12', text: 'text-4xl' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center space-x-2.5 ${className}`}>
      {/* macOS Glossy Food Emblem (Organic Apple + Fork of Nutrition & Safety) */}
      <div
        className={`${currentSize.box} relative flex items-center justify-center bg-gradient-to-b from-emerald-500 to-emerald-600 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_4px_16px_rgba(5,150,105,0.35)] transition-transform group-hover:scale-105 overflow-hidden`}
      >
        {/* Specular Top-Light Gloss Highlight */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />

        {/* Crisp Food Icon: Organic Apple & Fork Vector */}
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${currentSize.svg} text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.15)] relative z-10`}
        >
          {/* Apple Stem & Leaf */}
          <path
            d="M24 10C23.5 7 25 5 26.5 4"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M25 8C27 4.5 31.5 5 32.5 7C30.5 9.5 26.5 9.5 25 8Z"
            fill="currentColor"
            opacity="0.95"
          />

          {/* Organic Apple Outline / Silhouette */}
          <path
            d="M24 13C26.5 10.5 34.5 11 36 17C37.8 23 33.5 32 27.5 35.5C25.8 36.4 25 36.1 24 35.7C23 36.1 22.2 36.4 20.5 35.5C14.5 32 10.2 23 12 17C13.5 11 21.5 10.5 24 13Z"
            fill="currentColor"
          />

          {/* Fork inside Apple (Food Intelligence) */}
          <path
            d="M24 31V23"
            stroke="#059669"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M21.5 22.5C21.5 24.5 26.5 24.5 26.5 22.5"
            stroke="#059669"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M21.5 22.5V17M24 22.5V16M26.5 22.5V17"
            stroke="#059669"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {showText && (
        <span className={`${currentSize.text} font-black tracking-tight text-slate-900`}>
          FINE<span className="text-emerald-600">PRINT</span>
        </span>
      )}
    </div>
  );
};

