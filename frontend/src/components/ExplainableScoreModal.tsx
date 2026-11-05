import React, { useState, useEffect } from 'react';
import {
  X,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileText,
  Scale,
  Activity,
  Droplets,
  Flame,
  Info,
  Layers,
  Cpu,
  RefreshCw,
  ExternalLink,
  MinusCircle,
  Check,
  Wheat,
  Factory
} from 'lucide-react';
import { api } from '../services/api';
import { sounds } from '../utils/soundEffects';

interface ExplainableScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    name?: string;
    product_name?: string;
    overall_score?: number;
    score?: number;
    overall_rating?: number;
    safety_score?: number;
    nutrition_score?: number;
    concern_level?: string;
    nutrition_facts?: any;
    nutrition_per_100g?: any;
    ingredient_analysis?: any;
    fssai_license?: string | null;
    processing_level?: string | null;
    [key: string]: any;
  } | null;
}

// In-memory module cache to avoid duplicate API / Gemini requests
const explanationCache: Record<string, any> = {};

export const ExplainableScoreModal: React.FC<ExplainableScoreModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [activeTab, setActiveTab] = useState<'breakdown' | 'evidence' | 'methodology'>('breakdown');
  const [loading, setLoading] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<any | null>(null);

  if (!isOpen || !product) return null;

  const productName = product.product_name || product.name || 'Packaged Food Product';
  const overallScore = Number(product.overall_score ?? product.score ?? product.overall_rating ?? 5.0);
  const safetyScore = Number(product.safety_score ?? overallScore);
  const nutritionScore = Number(product.nutrition_score ?? overallScore);
  const concernLevel = product.concern_level || (overallScore >= 7.5 ? 'low' : overallScore >= 5.0 ? 'moderate' : 'high');

  // Normalize nutrition facts
  let normalizedNutrition: any = {};
  if (product.nutrition_facts) {
    normalizedNutrition = product.nutrition_facts;
  } else if (product.nutrition_per_100g) {
    if (typeof product.nutrition_per_100g === 'string') {
      try {
        normalizedNutrition = JSON.parse(product.nutrition_per_100g);
      } catch {}
    } else {
      normalizedNutrition = product.nutrition_per_100g;
    }
  }

  const cacheKey = `${productName}_${overallScore}_${safetyScore}_${nutritionScore}`;

  // Fetch or retrieve cached explanation
  useEffect(() => {
    if (!isOpen) return;

    if (explanationCache[cacheKey]) {
      setExplanation(explanationCache[cacheKey]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    const fetchExplanation = async () => {
      setLoading(true);
      try {
        const data = await api.explainScore({
          product_name: productName,
          overall_score: overallScore,
          safety_score: safetyScore,
          nutrition_score: nutritionScore,
          concern_level: concernLevel,
          nutrition_facts: normalizedNutrition,
          ingredient_analysis: product.ingredient_analysis,
          fssai_license: product.fssai_license,
          processing_level: product.processing_level,
        });

        if (isMounted) {
          explanationCache[cacheKey] = data;
          setExplanation(data);
        }
      } catch (err) {
        // Fallback to client-side deterministic construction if API fails/offline
        if (isMounted) {
          const fallbackData = buildClientDeterministicExplanation(
            productName,
            overallScore,
            safetyScore,
            nutritionScore,
            concernLevel,
            normalizedNutrition,
            product.ingredient_analysis,
            product.fssai_license,
            product.processing_level
          );
          explanationCache[cacheKey] = fallbackData;
          setExplanation(fallbackData);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchExplanation();

    return () => {
      isMounted = false;
    };
  }, [isOpen, cacheKey]);

  // Color & Verdict Theme
  const isGood = overallScore >= 7.5;
  const isAvg = overallScore >= 5.0 && overallScore < 7.5;

  const scoreTheme = isGood
    ? {
        label: 'Safe / Low Concern',
        textColor: 'text-emerald-700',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        ringColor: '#10b981',
      }
    : isAvg
    ? {
        label: 'Moderate Concern',
        textColor: 'text-amber-700',
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
        ringColor: '#f59e0b',
      }
    : {
        label: 'High Concern',
        textColor: 'text-rose-700',
        badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
        ringColor: '#f43f5e',
      };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white/95 backdrop-blur-3xl rounded-[36px] p-6 sm:p-8 space-y-6 border border-white/80 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Specular Top Reflection */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/90 to-transparent pointer-events-none" />

        {/* Apple Circle Dismiss Button */}
        <button
          type="button"
          onClick={() => {
            sounds.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100/90 hover:bg-slate-200/90 border border-slate-200/60 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all hover:scale-105 active:scale-95 z-20 shadow-xs"
          aria-label="Close"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2 relative z-10 pr-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-black uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>EXPLAINABLE FOOD SCORE · EVIDENCE & TRANSPARENCY</span>
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${scoreTheme.badgeBg}`}>
              {scoreTheme.label}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
            {productName}
          </h2>

          <p className="text-xs text-slate-500 max-w-xl">
            Detailed itemized breakdown showing which nutritional values, ingredient factors, and regulatory standards determined this score.
          </p>
        </div>

        {/* Score Summary Banner */}
        <div className="p-4 sm:p-5 rounded-3xl bg-slate-50 border border-slate-200/80 relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Main Ring */}
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
              <svg className="w-16 h-16 -rotate-90 transform" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" className="stroke-slate-200" strokeWidth="5" fill="none" />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke={scoreTheme.ringColor}
                  strokeWidth="5"
                  strokeDasharray={`${(overallScore / 10) * 163.36} 163.36`}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono font-black text-sm text-slate-900 leading-none">
                  {overallScore.toFixed(1)}
                </span>
                <span className="text-[9px] font-bold text-slate-400">/ 10</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Overall Combined Score
              </span>
              <h3 className={`text-base font-black ${scoreTheme.textColor}`}>
                {scoreTheme.label}
              </h3>
              <span className="text-[11px] text-slate-500">
                Formula: (Safety × 45%) + (Nutrition × 55%)
              </span>
            </div>
          </div>

          {/* Sub-scores */}
          <div className="flex items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-5">
            <div className="text-center sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Safety (45%)
              </span>
              <span className="text-sm font-black font-mono text-slate-900">
                {safetyScore.toFixed(1)} / 10
              </span>
            </div>

            <div className="text-center sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Nutrition (55%)
              </span>
              <span className="text-sm font-black font-mono text-slate-900">
                {nutritionScore.toFixed(1)} / 10
              </span>
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 relative z-10 gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveTab('breakdown');
            }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'breakdown'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Score Breakdown</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveTab('evidence');
            }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'evidence'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Evidence & Concerns</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveTab('methodology');
            }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'methodology'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>How Was This Score Calculated?</span>
          </button>
        </div>

        {/* TAB 1: SCORE BREAKDOWN */}
        {activeTab === 'breakdown' && (
          <div className="space-y-5 relative z-10 animate-in fade-in duration-150">
            {/* Plain-Language AI / Deterministic Explanation Box */}
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/90 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-900 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Score Summary</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  {explanation?.explanation_source || (explanation?.is_ai_live ? 'Gemini 1.5 Flash' : 'Deterministic Rules Engine')}
                </span>
              </div>

              {loading ? (
                <div className="space-y-2 animate-pulse py-1">
                  <div className="h-3 bg-emerald-200/60 rounded w-full" />
                  <div className="h-3 bg-emerald-200/60 rounded w-4/5" />
                </div>
              ) : (
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {explanation?.ai_explanation ||
                    `${productName} scored ${overallScore}/10 under FinePrint's dual-vector assessment, factoring in additive safety and nutritional profiling.`}
                </p>
              )}
            </div>

            {/* Nutritional Profile Progress Cards */}
            <div className="space-y-2.5">
              <span className="text-xs uppercase font-extrabold text-slate-600 tracking-wider block">
                Nutritional Profile & Benchmark Tests:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Added Sugar */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                      <Flame className="w-3.5 h-3.5 text-rose-500" />
                      <span>Added Sugar</span>
                    </span>
                    <span className="text-xs font-mono font-black text-slate-900">
                      {normalizedNutrition.added_sugar !== undefined
                        ? `${normalizedNutrition.added_sugar}g`
                        : normalizedNutrition.total_sugar !== undefined
                        ? `${normalizedNutrition.total_sugar}g (Total)`
                        : 'Not Declared'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        Number(normalizedNutrition.added_sugar ?? normalizedNutrition.total_sugar ?? 0) > 10
                          ? 'bg-rose-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(
                          (Number(normalizedNutrition.added_sugar ?? normalizedNutrition.total_sugar ?? 0) / 25) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    ICMR ceiling: &lt; 25g/day. Safe single-serving threshold is &lt; 10g/100g.
                  </p>
                </div>

                {/* Sodium */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                      <Droplets className="w-3.5 h-3.5 text-amber-500" />
                      <span>Sodium</span>
                    </span>
                    <span className="text-xs font-mono font-black text-slate-900">
                      {normalizedNutrition.sodium !== undefined
                        ? `${normalizedNutrition.sodium}mg`
                        : 'Not Declared'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        Number(normalizedNutrition.sodium ?? 0) > 600 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(((Number(normalizedNutrition.sodium ?? 0) / 2000) * 100), 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    ICMR ceiling: &lt; 2,000mg/day. Elevated if &gt; 600mg per 100g.
                  </p>
                </div>

                {/* Saturated Fat */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                      <Scale className="w-3.5 h-3.5 text-slate-600" />
                      <span>Saturated Fat</span>
                    </span>
                    <span className="text-xs font-mono font-black text-slate-900">
                      {normalizedNutrition.saturated_fat !== undefined
                        ? `${normalizedNutrition.saturated_fat}g`
                        : 'Not Declared'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        Number(normalizedNutrition.saturated_fat ?? 0) > 10 ? 'bg-rose-500' : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(((Number(normalizedNutrition.saturated_fat ?? 0) / 20) * 100), 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    FSSAI benchmark: elevated if &gt; 10g/100g (watch for palm olein).
                  </p>
                </div>

                {/* Protein */}
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                      <Wheat className="w-3.5 h-3.5 text-teal-600" />
                      <span>Protein</span>
                    </span>
                    <span className="text-xs font-mono font-black text-slate-900">
                      {normalizedNutrition.protein !== undefined
                        ? `${normalizedNutrition.protein}g`
                        : 'Not Declared'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-teal-500"
                      style={{
                        width: `${Math.min(((Number(normalizedNutrition.protein ?? 0) / 20) * 100), 100)}%`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Positive reward if &ge; 8.0g/100g. Clean muscle and satiety nutrient.
                  </p>
                </div>
              </div>
            </div>

            {/* Processing Information Section */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Factory className="w-3.5 h-3.5 text-slate-600" />
                  <span>Industrial Food Processing Status</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-600">
                  {explanation?.processing_information?.classification || 'Processing Classification'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600">
                {explanation?.processing_information?.description ||
                  (product.processing_level ? `Classified as ${product.processing_level}.` : 'Processing information unavailable.')}
              </p>
              {explanation?.processing_information?.source && (
                <span className="text-[10px] text-slate-400 block font-mono">
                  Source: {explanation.processing_information.source}
                </span>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: EVIDENCE & CONCERNS */}
        {activeTab === 'evidence' && (
          <div className="space-y-4 relative z-10 animate-in fade-in duration-150">
            {/* Positive Factors */}
            <div className="space-y-2">
              <span className="text-xs font-black uppercase text-emerald-800 tracking-wider flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Positive Scoring Factors:</span>
              </span>

              {explanation?.positive_factors && explanation.positive_factors.length > 0 ? (
                <div className="space-y-1.5">
                  {explanation.positive_factors.map((item: string, i: number) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-emerald-50/80 border border-emerald-200/70 text-xs text-emerald-900 flex items-start space-x-2"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No specific positive rewards registered.</p>
              )}
            </div>

            {/* Potential Concerns */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-black uppercase text-rose-800 tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>Potential Concerns & Deductions:</span>
              </span>

              {explanation?.potential_concerns && explanation.potential_concerns.length > 0 ? (
                <div className="space-y-1.5">
                  {explanation.potential_concerns.map((item: string, i: number) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-200/70 text-xs text-rose-900 flex items-start space-x-2"
                    >
                      <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-700 font-semibold">No critical safety or nutritional concerns detected.</p>
              )}
            </div>

            {/* Missing or Unverified Information */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center space-x-1.5">
                <MinusCircle className="w-4 h-4 text-slate-500" />
                <span>Missing or Unverified Information on Packaging:</span>
              </span>

              <div className="space-y-1.5">
                {explanation?.missing_information && explanation.missing_information.length > 0 ? (
                  explanation.missing_information.map((item: string, i: number) => (
                    <div
                      key={i}
                      className="p-2 rounded-xl bg-slate-100/80 border border-dashed border-slate-300 text-xs text-slate-600 flex items-start space-x-2"
                    >
                      <span className="text-[10px] font-mono text-slate-400 font-bold">MISSING:</span>
                      <span>{item}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-2 rounded-xl bg-slate-50 text-xs text-slate-500">
                    All core nutritional and regulatory fields were declared.
                  </div>
                )}

                {explanation?.unverified_information &&
                  explanation.unverified_information.map((item: string, i: number) => (
                    <div
                      key={`unv_${i}`}
                      className="p-2 rounded-xl bg-amber-50/70 border border-dashed border-amber-200 text-xs text-amber-800 flex items-start space-x-2"
                    >
                      <span className="text-[10px] font-mono text-amber-600 font-bold">UNVERIFIED:</span>
                      <span>{item}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: HOW WAS THIS SCORE CALCULATED? */}
        {activeTab === 'methodology' && (
          <div className="space-y-4 relative z-10 animate-in fade-in duration-150 text-xs text-slate-700 leading-relaxed">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center space-x-1.5">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <span>Deterministic Dual-Vector Scoring Formula</span>
              </h3>
              <p>
                FinePrint calculates every product score using a transparent, deterministic mathematical formula that never invents data:
              </p>
              <div className="p-3 rounded-xl bg-white border border-slate-200 font-mono text-xs font-black text-emerald-800">
                Overall Score = (Regulatory Safety Score × 0.45) + (Nutritional Quality Score × 0.55)
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Safety Vector */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 space-y-1.5">
                <span className="font-extrabold text-slate-900 block text-xs">
                  1. Regulatory & Additive Safety (45%)
                </span>
                <p className="text-[11px] text-slate-600 leading-normal">
                  Starts at baseline 10.0. Penalized for partially hydrogenated fats (-2.5), synthetic azo dyes (-2.0), heavy chemical preservatives (-1.1), and undeclared allergens (-0.8).
                </p>
              </div>

              {/* Nutrition Vector */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 space-y-1.5">
                <span className="font-extrabold text-slate-900 block text-xs">
                  2. Nutritional Quality Profiling (55%)
                </span>
                <p className="text-[11px] text-slate-600 leading-normal">
                  Starts at baseline 6.0. Penalized for added sugars &gt; 10g (-1.5 to -2.5), sodium &gt; 600mg (-1.5 to -2.5), saturated fat &gt; 10g. Rewarded for protein &ge; 8g (+1.0 to +2.0) and fiber &ge; 3g (+0.8 to +1.5).
                </p>
              </div>
            </div>

            {/* Reference Standards */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <span className="font-extrabold text-slate-900 block text-xs">
                Official Reference Criteria Applied:
              </span>
              <ul className="text-[11px] text-slate-600 space-y-1 list-disc list-inside">
                <li>FSSAI (Packaging & Labelling) Regulations 2020</li>
                <li>ICMR-NIN (National Institute of Nutrition) Dietary Guidelines for Indians 2024</li>
                <li>WHO Guidelines on Free Sugars and Daily Sodium Caps for Adults</li>
                <li>Codex Alimentarius General Standard for Food Additives (GSFA)</li>
              </ul>
            </div>

            {/* Non-FSSAI Certification Legal Disclaimer */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
              <div className="font-extrabold flex items-center space-x-1.5">
                <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>Important Consumer Disclaimer:</span>
              </div>
              <p className="leading-normal">
                {explanation?.legal_disclaimer ||
                  "FinePrint's rating is an independent educational score to empower consumers. It does not constitute an official FSSAI certification or regulatory endorsement. A flagged ingredient reflects dietary guidance and does not automatically imply the food is toxic."}
              </p>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-100 relative z-10">
          <span className="text-[11px] font-mono text-slate-400">
            FINEPRINT Transparent Food Intelligence
          </span>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="py-2.5 px-6 rounded-2xl apple-pill-btn text-white text-xs font-bold shadow-xs hover:scale-105 active:scale-95 transition-all"
          >
            Close Explanation
          </button>
        </div>
      </div>
    </div>
  );
};

// Client-side fallback if network is unreachable
function buildClientDeterministicExplanation(
  productName: string,
  overallScore: number,
  safetyScore: number,
  nutritionScore: number,
  concernLevel: string,
  nutritionFacts: any,
  ingredientAnalysis: any,
  fssaiLicense: any,
  processingLevel: any
) {
  const positive_factors: string[] = [];
  const potential_concerns: string[] = [];
  const missing_information: string[] = [];
  const unverified_information: string[] = [];

  const sugar = nutritionFacts?.added_sugar ?? nutritionFacts?.total_sugar;
  if (sugar !== undefined) {
    if (Number(sugar) > 10) potential_concerns.push(`Elevated sugar content: ${sugar}g/100g`);
    else positive_factors.push(`Low sugar formulation: ${sugar}g/100g`);
  } else {
    missing_information.push('Added sugar not declared on package');
  }

  const sodium = nutritionFacts?.sodium;
  if (sodium !== undefined) {
    if (Number(sodium) > 600) potential_concerns.push(`High sodium: ${sodium}mg/100g`);
    else positive_factors.push(`Low sodium profile: ${sodium}mg/100g`);
  } else {
    missing_information.push('Sodium content not declared');
  }

  if (fssaiLicense) positive_factors.push(`FSSAI License declared: ${fssaiLicense}`);
  else unverified_information.push('FSSAI license unverified on scanned surface');

  return {
    product_name: productName,
    overall_score: overallScore,
    safety_score: safetyScore,
    nutrition_score: nutritionScore,
    concern_level: concernLevel,
    positive_factors,
    potential_concerns,
    missing_information,
    unverified_information,
    explanation_source: 'FinePrint Deterministic Rules Engine (Offline Fallback)',
    is_ai_live: false,
    ai_explanation: `${productName} scored ${overallScore}/10 based on evaluated nutritional values and ingredient safety factors.`,
    processing_information: {
      classification: processingLevel || null,
      description: processingLevel ? `Classified as ${processingLevel}.` : 'Processing information unavailable.',
      source: 'Package formulation review'
    }
  };
}
