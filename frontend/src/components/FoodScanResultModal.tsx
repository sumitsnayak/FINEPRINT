import React from 'react';
import {
  X,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface FoodScanResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: any | null;
  onViewDetails?: (productId: number) => void;
  onViewAlternatives?: () => void;
}

export const FoodScanResultModal: React.FC<FoodScanResultModalProps> = ({
  isOpen,
  onClose,
  result,
  onViewDetails,
  onViewAlternatives,
}) => {
  if (!isOpen || !result) return null;

  // Calculate score (can be overall_score or score or overall_rating)
  const score: number = Number(
    result.overall_score ?? result.score ?? result.overall_rating ?? 7.0
  );

  // Status tiers: GREEN (>= 7.5), YELLOW (5.0 - 7.4), RED (< 5.0)
  const isGood = score >= 7.5;
  const isAvg = score >= 5.0 && score < 7.5;
  const isBad = score < 5.0;

  // Visual Theme Config
  const theme = isGood
    ? {
        label: 'GOOD PRODUCT',
        sublabel: 'Safe to consume · FSSAI Standards Compliant',
        textColor: 'text-emerald-700',
        bgColor: 'bg-emerald-500/10',
        borderColor: 'border-emerald-500/30',
        glowColor: 'shadow-[0_20px_60px_-10px_rgba(16,185,129,0.35)]',
        badgeBg: 'bg-emerald-600 text-white',
        strokeColor: '#10b981',
        icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
        ringColor: 'stroke-emerald-500',
      }
    : isAvg
    ? {
        label: 'AVERAGE PRODUCT',
        sublabel: 'Moderate concern · Safe in moderation',
        textColor: 'text-amber-700',
        bgColor: 'bg-amber-500/10',
        borderColor: 'border-amber-500/30',
        glowColor: 'shadow-[0_20px_60px_-10px_rgba(245,158,11,0.35)]',
        badgeBg: 'bg-amber-500 text-white',
        strokeColor: '#f59e0b',
        icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
        ringColor: 'stroke-amber-500',
      }
    : {
        label: 'NOT RECOMMENDED',
        sublabel: 'High safety concern · Harmful additives or high sugar/sodium',
        textColor: 'text-rose-700',
        bgColor: 'bg-rose-500/10',
        borderColor: 'border-rose-500/30',
        glowColor: 'shadow-[0_20px_60px_-10px_rgba(244,63,94,0.38)]',
        badgeBg: 'bg-rose-600 text-white',
        strokeColor: '#f43f5e',
        icon: <ShieldAlert className="w-5 h-5 text-rose-600" />,
        ringColor: 'stroke-rose-500',
      };

  // Circular gauge calculations (Apple Activity Ring style)
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (Math.min(Math.max(score, 0), 10) / 10) * circumference;

  // Extract Nutrition if present
  let nutrition: any = {};
  try {
    if (typeof result.nutrition_per_100g === 'string') {
      nutrition = JSON.parse(result.nutrition_per_100g);
    } else if (result.nutrition_per_100g) {
      nutrition = result.nutrition_per_100g;
    } else if (result.nutrition_facts) {
      nutrition = result.nutrition_facts;
    }
  } catch {}

  // Parse rating factors
  let factorsPositive: string[] = [];
  let factorsNegative: string[] = [];
  try {
    if (typeof result.rating_factors === 'string') {
      const parsed = JSON.parse(result.rating_factors);
      factorsPositive = parsed.positive || [];
      factorsNegative = parsed.negative || [];
    } else if (result.rating_factors) {
      factorsPositive = result.rating_factors.positive || [];
      factorsNegative = result.rating_factors.negative || [];
    }
  } catch {}

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      {/* Glossy Modal Window with Specular Reflection and Dynamic Verdict Glow */}
      <div
        className={`w-full max-w-lg bg-white/95 backdrop-blur-3xl rounded-[36px] p-5 sm:p-7 space-y-5 border ${theme.borderColor} ${theme.glowColor} relative overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200`}
      >
        {/* Specular Top-Light Gloss Highlight */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/90 via-white/30 to-transparent pointer-events-none" />

        {/* Apple Circle Dismiss Button */}
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100/90 hover:bg-slate-200/90 border border-slate-200/60 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all hover:scale-105 active:scale-95 z-20 shadow-xs"
          aria-label="Close"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Apple Health / Activity Style Dynamic Verdict Card */}
        <div className={`p-4 rounded-3xl ${theme.bgColor} border ${theme.borderColor} relative z-10 flex items-center space-x-4`}>
          {/* Apple Circular Score Ring Gauge */}
          <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
            <svg className="w-16 h-16 -rotate-90 transform" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r={radius}
                className="stroke-slate-200/60"
                strokeWidth="5"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r={radius}
                className={theme.ringColor}
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset,
                  transition: 'stroke-dashoffset 0.8s ease-in-out',
                }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-mono font-black text-sm text-slate-900 leading-none">
                {score.toFixed(1)}
              </span>
              <span className="text-[9px] font-bold text-slate-400 leading-none mt-0.5">/10</span>
            </div>
          </div>

          {/* Verdict Description */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-black tracking-wider uppercase ${theme.textColor}`}>
                {theme.label}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${theme.badgeBg}`}>
                {isGood ? 'SAFE' : isAvg ? 'MODERATE' : 'CONCERN'}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-snug">
              {theme.sublabel}
            </p>
          </div>
        </div>

        {/* Product Details Header */}
        <div className="flex items-center space-x-3.5 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 overflow-hidden flex-shrink-0 shadow-sm">
            <img
              src={
                result.image_url ||
                'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=300&q=80'
              }
              alt={result.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block truncate">
              {result.brand || 'Verified Food'} {result.category ? `· ${result.category}` : ''}
            </span>
            <h3 className="text-base font-black text-slate-900 truncate">
              {result.name || 'Packaged Food Product'}
            </h3>
            {result.fssai_license ? (
              <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-flex items-center space-x-1 mt-1 font-semibold">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>FSSAI Lic: {result.fssai_license}</span>
              </span>
            ) : (
              <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full inline-block mt-1 font-medium">
                Barcode: {result.barcode || 'Verified'}
              </span>
            )}
          </div>
        </div>

        {/* Key Health & Safety Factors */}
        <div className="space-y-2 relative z-10">
          {factorsPositive.length > 0 && (
            <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 space-y-1 text-xs">
              <span className="font-extrabold text-emerald-800 flex items-center space-x-1.5 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>Positive Safety Factors</span>
              </span>
              <ul className="space-y-0.5 text-slate-700 pl-4 list-disc text-[11px]">
                {factorsPositive.slice(0, 2).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {factorsNegative.length > 0 && (
            <div className={`p-3 rounded-2xl ${isBad ? 'bg-rose-50/85 border-rose-200' : 'bg-amber-50/85 border-amber-200'} border space-y-1 text-xs`}>
              <span className={`font-extrabold flex items-center space-x-1.5 text-[11px] ${isBad ? 'text-rose-800' : 'text-amber-800'}`}>
                {isBad ? (
                  <XCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                )}
                <span>Identified Concerns</span>
              </span>
              <ul className="space-y-0.5 text-slate-700 pl-4 list-disc text-[11px]">
                {factorsNegative.slice(0, 3).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Quick Nutrition Snapshot (Apple Health Mini Cards) */}
        {nutrition && Object.keys(nutrition).length > 0 && (
          <div className="grid grid-cols-4 gap-2 text-center text-xs relative z-10">
            <div className="p-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-xs">
              <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Calories</span>
              <span className="font-mono font-black text-slate-900 text-xs block mt-0.5">{nutrition.calories || '--'}</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-xs">
              <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Sugar</span>
              <span className="font-mono font-black text-slate-900 text-xs block mt-0.5">{nutrition.total_sugar ? `${nutrition.total_sugar}g` : '--'}</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-xs">
              <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Sodium</span>
              <span className="font-mono font-black text-slate-900 text-xs block mt-0.5">{nutrition.sodium ? `${nutrition.sodium}mg` : '--'}</span>
            </div>
            <div className="p-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-xs">
              <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Fat</span>
              <span className="font-mono font-black text-slate-900 text-xs block mt-0.5">{nutrition.total_fat ? `${nutrition.total_fat}g` : '--'}</span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5 pt-1 relative z-10">
          {result.id && onViewDetails && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewDetails(result.id);
              }}
              className="flex-1 py-3 px-4 rounded-2xl apple-pill-btn text-white text-xs font-black flex items-center justify-center space-x-1.5 group"
            >
              <span>View Full Report</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}

          {isBad && onViewAlternatives && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onViewAlternatives();
              }}
              className="py-3 px-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 flex items-center space-x-1 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Clean Swaps</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="py-3 px-5 rounded-2xl mac-secondary-btn text-slate-700 text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
