import React from 'react';

interface ScoreBadgeProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg' | 'hero' | 'ring';
  showTen?: boolean;
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  label,
  size = 'md',
  showTen = true,
}) => {
  const getGrade = (val: number) => {
    if (val >= 8.0) return 'A';
    if (val >= 6.5) return 'B';
    if (val >= 5.0) return 'C';
    return 'D';
  };

  const getColors = (val: number) => {
    if (val >= 7.5) {
      return {
        bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        ring: 'border-emerald-500 text-emerald-700 bg-emerald-50',
        badge: 'bg-emerald-600 text-white',
        text: 'text-emerald-700',
        border: 'border-emerald-300',
      };
    }
    if (val >= 5.0) {
      return {
        bg: 'bg-amber-50 border-amber-200 text-amber-800',
        ring: 'border-amber-500 text-amber-700 bg-amber-50',
        badge: 'bg-amber-500 text-white',
        text: 'text-amber-700',
        border: 'border-amber-300',
      };
    }
    return {
      bg: 'bg-rose-50 border-rose-200 text-rose-800',
      ring: 'border-rose-500 text-rose-700 bg-rose-50',
      badge: 'bg-rose-600 text-white',
      text: 'text-rose-700',
      border: 'border-rose-300',
    };
  };

  const colors = getColors(score);
  const grade = getGrade(score);

  if (size === 'ring') {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className={`w-12 h-12 rounded-full border-2 ${colors.ring} flex items-center justify-center font-black text-lg shadow-sm`}>
          {grade}
        </div>
        <span className="text-[10px] uppercase font-bold text-slate-500 mt-1 tracking-wider">Score</span>
      </div>
    );
  }

  if (size === 'hero') {
    return (
      <div className={`flex flex-col items-center justify-center p-5 rounded-3xl border-2 ${colors.border} bg-white shadow-lg`}>
        <div className="flex items-baseline space-x-1.5">
          <span className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">{score.toFixed(1)}</span>
          {showTen && <span className="text-xl font-semibold text-slate-400">/10</span>}
        </div>
        <div className="flex items-center space-x-1.5 mt-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-black shadow-sm ${colors.badge}`}>Grade {grade}</span>
          {label && <span className="text-xs uppercase tracking-wider font-bold text-slate-500">{label}</span>}
        </div>
      </div>
    );
  }

  if (size === 'lg') {
    return (
      <div className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-2xl border ${colors.bg} bg-white font-bold text-base shadow-sm`}>
        <span className={`w-6 h-6 rounded-full ${colors.badge} text-xs font-black flex items-center justify-center shadow-sm`}>
          {grade}
        </span>
        <span className="text-slate-900">{score.toFixed(1)}</span>
        {showTen && <span className="text-xs font-normal text-slate-400">/10</span>}
      </div>
    );
  }

  if (size === 'sm') {
    return (
      <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-extrabold ${colors.badge} shadow-sm`}>
        <span>{grade}</span>
        <span>·</span>
        <span>{score.toFixed(1)}</span>
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl border ${colors.bg} bg-white font-bold text-xs shadow-sm`}>
      <span className={`w-4 h-4 rounded-full ${colors.badge} text-[10px] font-black flex items-center justify-center`}>
        {grade}
      </span>
      <span className="text-slate-900">{score.toFixed(1)}</span>
      {showTen && <span className="text-slate-400 text-[10px]">/10</span>}
      {label && <span className="text-slate-500 text-[10px] ml-1">· {label}</span>}
    </div>
  );
};
