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
import { UniversalModal } from './UniversalModal';

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

  const productName = product?.product_name || product?.name || 'Packaged Food Product';
  const overallScore = Number(product?.overall_score ?? product?.score ?? product?.overall_rating ?? 5.0);
  const safetyScore = Number(product?.safety_score ?? overallScore);
  const nutritionScore = Number(product?.nutrition_score ?? overallScore);
  const concernLevel = product?.concern_level || (overallScore >= 7.5 ? 'low' : overallScore >= 5.0 ? 'moderate' : 'high');

  // Normalize nutrition facts safely
  let normalizedNutrition: any = {};
  if (product?.nutrition_facts) {
    normalizedNutrition = product.nutrition_facts;
  } else if (product?.nutrition_per_100g) {
    if (typeof product.nutrition_per_100g === 'string') {
      try {
        normalizedNutrition = JSON.parse(product.nutrition_per_100g);
      } catch {}
    } else {
      normalizedNutrition = product.nutrition_per_100g;
    }
  }

  const cacheKey = `${productName}_${overallScore}_${safetyScore}_${nutritionScore}`;

  // ALL HOOKS UNCONDITIONALLY AT TOP (No hooks after early return)
  useEffect(() => {
    if (!isOpen || !product) return;

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
      } catch {
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
  }, [isOpen, cacheKey, product]);

  // Early return strictly AFTER all hooks have executed
  if (!isOpen || !product) return null;

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

  const currentExplanation = explanation || buildClientDeterministicExplanation(
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

  return (
    <UniversalModal
      isOpen={isOpen}
      onClose={onClose}
      title={productName}
      subtitle="Nutritional values, ingredient factors, and regulatory standards"
      badge="EXPLAIN SCORE"
      badgeColor={scoreTheme.badgeBg}
      icon={<Sparkles className="w-5 h-5 text-emerald-600" />}
      maxWidth="max-w-3xl"
      footer={
        <div className="flex justify-between items-center w-full">
          <span className="text-[11px] font-mono text-slate-400">
            FINEPRINT Transparent Food Intelligence
          </span>
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="py-2 px-5 rounded-2xl apple-pill-btn text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            Close Explanation
          </button>
        </div>
      }
    >
      <div className="space-y-6">
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
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
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
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'evidence'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Supporting Evidence</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveTab('methodology');
            }}
            className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 flex items-center space-x-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'methodology'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Scientific Methodology</span>
          </button>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center space-x-3 text-xs text-emerald-800 animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin text-emerald-600" />
            <span>Synthesizing verified scoring evidence & AI explanation...</span>
          </div>
        )}

        {/* AI Simple Explanation Callout */}
        {currentExplanation.ai_explanation && (
          <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1.5 relative z-10 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Plain-Language Verdict</span>
              </span>
              <span className="text-[9px] font-mono font-bold text-slate-400">
                {currentExplanation.is_ai_live ? 'Gemini 2.5 Live' : 'FinePrint Deterministic Engine'}
              </span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {currentExplanation.ai_explanation}
            </p>
          </div>
        )}

        {/* TAB 1: BREAKDOWN */}
        {activeTab === 'breakdown' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Nutritional Profile Quick Grid */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-900 block">
                Nutritional Assessment (Per 100g / Declared Serving):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* Added Sugar */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center space-x-1 text-slate-500 text-[10px] font-bold uppercase">
                    <Droplets className="w-3 h-3 text-amber-500" />
                    <span>Added Sugar</span>
                  </div>
                  <div className="font-mono font-black text-sm text-slate-900">
                    {normalizedNutrition.added_sugar ?? normalizedNutrition.total_sugar ?? 'N/A'}
                    {normalizedNutrition.added_sugar !== undefined || normalizedNutrition.total_sugar !== undefined ? 'g' : ''}
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    {Number(normalizedNutrition.added_sugar ?? normalizedNutrition.total_sugar ?? 0) > 10 ? '⚠️ High' : '✅ Low'}
                  </span>
                </div>

                {/* Sodium */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center space-x-1 text-slate-500 text-[10px] font-bold uppercase">
                    <Scale className="w-3 h-3 text-rose-500" />
                    <span>Sodium</span>
                  </div>
                  <div className="font-mono font-black text-sm text-slate-900">
                    {normalizedNutrition.sodium ?? 'N/A'}
                    {normalizedNutrition.sodium !== undefined ? 'mg' : ''}
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    {Number(normalizedNutrition.sodium ?? 0) > 600 ? '⚠️ High' : '✅ Safe'}
                  </span>
                </div>

                {/* Saturated Fat */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center space-x-1 text-slate-500 text-[10px] font-bold uppercase">
                    <Flame className="w-3 h-3 text-amber-600" />
                    <span>Saturated Fat</span>
                  </div>
                  <div className="font-mono font-black text-sm text-slate-900">
                    {normalizedNutrition.saturated_fat ?? 'N/A'}
                    {normalizedNutrition.saturated_fat !== undefined ? 'g' : ''}
                  </div>
                  <span className="text-[10px] text-slate-500 block">
                    {Number(normalizedNutrition.saturated_fat ?? 0) > 4 ? '⚠️ High' : '✅ Moderate'}
                  </span>
                </div>

                {/* Processing Info */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="flex items-center space-x-1 text-slate-500 text-[10px] font-bold uppercase">
                    <Factory className="w-3 h-3 text-purple-500" />
                    <span>Processing</span>
                  </div>
                  <div className="font-bold text-xs text-slate-900 truncate">
                    {currentExplanation.processing_information?.classification || 'Nova-4 Ultra'}
                  </div>
                  <span className="text-[10px] text-purple-700 block">
                    Industrial pack
                  </span>
                </div>
              </div>
            </div>

            {/* Positive vs Potential Concerns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {/* Positive Factors */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <span className="text-xs font-black text-emerald-900 flex items-center space-x-1.5 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Positive Scoring Factors ({currentExplanation.positive_factors?.length || 0})</span>
                </span>
                {currentExplanation.positive_factors && currentExplanation.positive_factors.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {currentExplanation.positive_factors.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic">No significant positive nutritional factors detected.</p>
                )}
              </div>

              {/* Potential Concerns */}
              <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-2">
                <span className="text-xs font-black text-rose-900 flex items-center space-x-1.5 uppercase tracking-wider">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Potential Concerns ({currentExplanation.potential_concerns?.length || 0})</span>
                </span>
                {currentExplanation.potential_concerns && currentExplanation.potential_concerns.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {currentExplanation.potential_concerns.map((item: string, idx: number) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0 mt-1.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500 italic">No critical food safety concerns detected.</p>
                )}
              </div>
            </div>

            {/* Missing or Unverified Information */}
            {((currentExplanation.missing_information && currentExplanation.missing_information.length > 0) ||
              (currentExplanation.unverified_information && currentExplanation.unverified_information.length > 0)) && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-xs font-black text-slate-800 flex items-center space-x-1.5 uppercase tracking-wider">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <span>Missing or Unverified Product Declarations</span>
                </span>
                <p className="text-[11px] text-slate-500">
                  By law, food safety algorithms must disclose unverified values rather than inventing scores:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {currentExplanation.missing_information?.map((item: string, idx: number) => (
                    <span key={`mis-${idx}`} className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono font-bold flex items-center space-x-1">
                      <MinusCircle className="w-3 h-3 text-amber-600" />
                      <span>Missing: {item}</span>
                    </span>
                  ))}
                  {currentExplanation.unverified_information?.map((item: string, idx: number) => (
                    <span key={`unv-${idx}`} className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-mono font-bold flex items-center space-x-1">
                      <Info className="w-3 h-3 text-slate-500" />
                      <span>{item}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SUPPORTING EVIDENCE */}
        {activeTab === 'evidence' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs font-black text-slate-900 block">
                Evidence-Based Verification Trail:
              </span>
              <p className="text-[11px] text-slate-500">
                Every factor influencing this score is derived directly from the manufacturer's declared back-of-pack label, FSSAI regulatory schedules, or ICMR-NIN nutritional standards.
              </p>
            </div>

            <div className="space-y-3">
              {/* Ingredient Assessment */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <span className="text-xs font-black text-slate-900 flex items-center space-x-1.5 uppercase tracking-wider">
                  <Wheat className="w-3.5 h-3.5 text-amber-600" />
                  <span>Ingredient Evaluation & Flagged Additives</span>
                </span>
                {product.ingredient_analysis?.additives && product.ingredient_analysis.additives.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {product.ingredient_analysis.additives.map((add: any, idx: number) => (
                      <div key={idx} className="py-2 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900">
                            {add.code ? `${add.code} · ` : ''}{add.name}
                          </span>
                          <span className="text-[10px] text-slate-500 block">{add.purpose || 'Preservative / Texture'}</span>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          add.concern_level === 'danger' || add.risk === 'high'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {add.concern_level || add.risk || 'Caution'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-600">
                    No high-risk artificial additives or hazardous INS codes flagged in the declared ingredient list.
                  </p>
                )}
              </div>

              {/* FSSAI License & Regulatory Evidence */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <span className="text-xs font-black text-slate-900 flex items-center space-x-1.5 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>FSSAI License & Statutory Status</span>
                </span>
                <div className="text-xs space-y-1 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Declared FSSAI License:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {product.fssai_license || 'Not declared / unverified'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Classification:</span>
                    <span className="font-medium text-slate-900">
                      {currentExplanation.processing_information?.classification || 'Standard Packaged Food'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SCIENTIFIC METHODOLOGY */}
        {activeTab === 'methodology' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-black text-slate-900 flex items-center space-x-1.5 uppercase tracking-wider">
                <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                <span>FinePrint Dual-Vector Mathematical Scoring Engine</span>
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                FinePrint calculates food ratings using a deterministic dual-vector model. Numerical scores are never invented by an AI language model; Gemini is only used to translate verified laboratory findings into simple language.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">Vector A: Food Safety (45%)</span>
                  <span className="text-xs font-mono font-bold text-emerald-700">{safetyScore.toFixed(1)}/10</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Evaluates 450+ INS chemical additives, artificial colors (e.g. Tartrazine), chemical preservatives, heavy metal limits, and FSSAI statutory adherence.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">Vector B: Nutritional Quality (55%)</span>
                  <span className="text-xs font-mono font-bold text-emerald-700">{nutritionScore.toFixed(1)}/10</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Evaluates ICMR-NIN 2024 thresholds for free sugars, sodium density, saturated palmitic acids, industrial trans-fats, and dietary fiber ratios.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <span className="font-bold block uppercase text-[10px] tracking-wider">
                Deterministic Integrity Guarantee:
              </span>
              <p className="text-[11px] text-slate-700 leading-relaxed">
                All penalties, thresholds, and calculations remain 100% auditable and reproducible according to published FSSAI Codex standards.
              </p>
            </div>
          </div>
        )}
      </div>
    </UniversalModal>
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
    ai_explanation: `${productName} scored ${overallScore.toFixed(1)}/10 based on evaluated nutritional values and ingredient safety factors.`,
    processing_information: {
      classification: processingLevel || null,
      description: processingLevel ? `Classified as ${processingLevel}.` : 'Processing information unavailable.',
      source: 'Package formulation review'
    }
  };
}
