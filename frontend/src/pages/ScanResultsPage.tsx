import React, { useState } from 'react';
import { ScanResult } from '../types';
import { ScoreBadge } from '../components/ScoreBadge';
import { AllergenAlert } from '../components/AllergenAlert';
import { IngredientCard } from '../components/IngredientCard';
import { NutritionTable } from '../components/NutritionTable';
import { ExplainableScoreModal } from '../components/ExplainableScoreModal';
import { useScan } from '../context/ScanContext';
import { api } from '../services/api';
import {
  Sparkles,
  Bookmark,
  Calendar,
  Scale,
  CheckCircle,
  AlertTriangle,
  Check,
  HelpCircle
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface ScanResultsPageProps {
  scanResult: ScanResult;
  onNavigate: (tab: string) => void;
  onAskAssistant: (product: any) => void;
}

export const ScanResultsPage: React.FC<ScanResultsPageProps> = ({
  scanResult,
  onAskAssistant,
}) => {
  const { addToCompare } = useScan();
  const [saved, setSaved] = useState(false);
  const [loggedToDiary, setLoggedToDiary] = useState(false);
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);

  const handleSave = async () => {
    if (scanResult.scan_id) {
      try {
        await api.saveProduct(scanResult.scan_id);
        setSaved(true);
      } catch {}
    } else {
      setSaved(true);
    }
  };

  const handleQuickLog = async () => {
    try {
      await api.addMealEntry({
        meal_type: 'snack',
        food_name: scanResult.product_name,
        portion_amount: 1,
        portion_unit: 'serving',
        calories: scanResult.nutrition_facts?.calories || 250,
        protein: scanResult.nutrition_facts?.protein || 5,
        carbs: scanResult.nutrition_facts?.carbs || 35,
        fat: scanResult.nutrition_facts?.total_fat || 10,
        sugar: scanResult.nutrition_facts?.total_sugar || 4,
        sodium: scanResult.nutrition_facts?.sodium || 300,
        source_type: 'scan',
      });
      setLoggedToDiary(true);
    } catch {
      alert('Sign in to log meals to your daily food diary.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl text-slate-900">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-full border border-slate-200">
                Food Intelligence Report
              </span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {scanResult.engine_source}
              </span>
              {scanResult.fssai_license && (
                <span className="text-xs font-mono font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200">
                  FSSAI: {scanResult.fssai_license}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {scanResult.product_name}
            </h1>

            <p className="text-sm font-medium text-slate-500">
              Verdict: <span className="font-bold text-emerald-800">{scanResult.summary_verdict}</span>
            </p>
          </div>

          {/* Scores Overview */}
          <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="text-center pr-4 border-r border-slate-200 flex flex-col items-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Overall Score
              </span>
              <ScoreBadge score={scanResult.overall_score} size="ring" />
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setIsExplainModalOpen(true);
                }}
                className="mt-2.5 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold mac-secondary-btn hover:text-emerald-700 text-slate-700 transition-all shadow-xs"
                title="Explain this food rating"
              >
                <HelpCircle className="w-3 h-3 text-emerald-600" />
                <span>Explain This Score</span>
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between space-x-5">
                <span className="text-slate-500">Safety Score:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {scanResult.safety_score.toFixed(1)}/10
                </span>
              </div>
              <div className="flex items-center justify-between space-x-5">
                <span className="text-slate-500">Nutrition Score:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {scanResult.nutrition_score.toFixed(1)}/10
                </span>
              </div>
              <div className="flex items-center justify-between space-x-5">
                <span className="text-slate-500">Concern Level:</span>
                <span className="font-bold capitalize text-emerald-700 font-mono">
                  {scanResult.concern_level}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Ribbon */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleQuickLog}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 shadow-sm ${
              loggedToDiary
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20'
            }`}
          >
            {loggedToDiary ? <Check className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
            <span>{loggedToDiary ? 'Logged to Diary' : 'Add to Food Diary'}</span>
          </button>

          <button
            type="button"
            onClick={() =>
              addToCompare({
                id: scanResult.scan_id || 999,
                name: scanResult.product_name,
                category: 'Packaged Food',
                overall_score: scanResult.overall_score,
                safety_score: scanResult.safety_score,
                nutrition_score: scanResult.nutrition_score,
                concern_level: scanResult.concern_level as any,
                is_verified: true,
                source: 'user_scan',
              })
            }
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 text-slate-700 text-xs font-bold transition-colors flex items-center space-x-1.5 bg-white shadow-xs hover:bg-emerald-50/40"
          >
            <Scale className="w-4 h-4 text-emerald-600" />
            <span>Add to Compare</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 text-slate-700 text-xs font-bold transition-colors flex items-center space-x-1.5 bg-white shadow-xs hover:bg-emerald-50/40"
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'text-emerald-600 fill-emerald-600' : 'text-slate-400'}`} />
            <span>{saved ? 'Bookmarked' : 'Save Product'}</span>
          </button>

          <button
            type="button"
            onClick={() => onAskAssistant(scanResult)}
            className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Ask AI Assistant About This</span>
          </button>
        </div>
      </div>

      {/* High Alert Allergen Warning Banner (if matches user profile) */}
      <AllergenAlert alerts={scanResult.ingredient_analysis?.user_alerts || []} />

      {/* AI Plain Language Summary */}
      <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border border-emerald-200 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-900 uppercase tracking-wide">
            Plain-Language Food Analysis
          </h2>
        </div>
        <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
          {scanResult.ai_summary}
        </p>
      </div>

      {/* Transparent Dual-Vector Score Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-slate-900">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Transparent Scoring Criteria</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {scanResult.methodology}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Positive Factors */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
            <h3 className="text-xs uppercase tracking-wider font-bold text-emerald-800 flex items-center space-x-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Factors that Raised the Score</span>
            </h3>
            {scanResult.factors_positive && scanResult.factors_positive.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-slate-700">
                {scanResult.factors_positive.map((factor, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">No significant positive bonuses awarded.</p>
            )}
          </div>

          {/* Negative Deductions */}
          <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-2.5">
            <h3 className="text-xs uppercase tracking-wider font-bold text-rose-800 flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>Factors that Lowered the Score</span>
            </h3>
            {scanResult.factors_negative && scanResult.factors_negative.length > 0 ? (
              <ul className="space-y-1.5 text-xs text-slate-700">
                {scanResult.factors_negative.map((factor, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">No regulatory penalties or adverse ingredients identified.</p>
            )}
          </div>
        </div>
      </div>

      {/* Decoded Ingredients Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Ingredients Intelligence ({scanResult.ingredient_analysis?.ingredient_count || 0})
            </h2>
            <p className="text-xs text-slate-500">
              Click any ingredient to inspect safety evidence, INS code, and manufacturing purpose.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs">
            <span
              className={`px-3 py-1 rounded-full font-bold ${
                scanResult.ingredient_analysis?.dietary_flags?.is_vegetarian
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {scanResult.ingredient_analysis?.dietary_flags?.is_vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
            </span>
            <span
              className={`px-3 py-1 rounded-full font-bold ${
                scanResult.ingredient_analysis?.dietary_flags?.is_vegan
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {scanResult.ingredient_analysis?.dietary_flags?.is_vegan ? 'Vegan' : 'Non-Vegan'}
            </span>
          </div>
        </div>

        <div className="space-y-2.5">
          {scanResult.ingredient_analysis?.ingredients?.map((ing, idx) => (
            <IngredientCard key={idx} ingredient={ing} />
          ))}
        </div>
      </div>

      {/* Nutrition Facts Table */}
      <NutritionTable
        nutrition100g={scanResult.nutrition_facts || {}}
        sourceConfidence={scanResult.data_confidence}
      />

      {/* Healthier Alternatives Section */}
      {scanResult.healthier_alternatives && scanResult.healthier_alternatives.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-slate-900">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">Recommended Healthier Alternatives</h2>
              <p className="text-xs text-slate-500">
                Better nutritional profile without conflicting with your declared allergens.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scanResult.healthier_alternatives.map((alt, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between shadow-xs hover:shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {alt.brand} · {alt.category}
                    </span>
                    <ScoreBadge score={alt.overall_score} size="sm" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">{alt.name}</h3>
                  <p className="text-xs text-slate-700 mt-2.5 leading-relaxed bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                    <strong className="text-emerald-700">Why it's better:</strong> {alt.why_better}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Energy: {alt.nutrition_per_100g?.calories} kcal · Protein: {alt.nutrition_per_100g?.protein}g
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explainable Food Score Modal */}
      <ExplainableScoreModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
        product={scanResult}
      />
    </div>
  );
};
