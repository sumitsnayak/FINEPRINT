import React, { useState } from 'react';
import { ScanResult } from '../types';
import { ScoreBadge } from '../components/ScoreBadge';
import { AllergenAlert } from '../components/AllergenAlert';
import { IngredientCard } from '../components/IngredientCard';
import { NutritionTable } from '../components/NutritionTable';
import { ExplainableScoreModal } from '../components/ExplainableScoreModal';
import { UniversalModal } from '../components/UniversalModal';
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
  HelpCircle,
  ChevronRight,
  Search,
  FileText
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
  const [isIngredientsModalOpen, setIsIngredientsModalOpen] = useState(false);
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
  const [isAlternativesModalOpen, setIsAlternativesModalOpen] = useState(false);
  const [ingredientSearch, setIngredientSearch] = useState('');

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

      {/* Decoded Ingredients Section (Compact Preview + View More Modal) */}
      {(() => {
        const allIngredients = scanResult.ingredient_analysis?.ingredients || [];
        const previewIngredients = allIngredients.slice(0, 3);
        const filteredIngredients = ingredientSearch.trim()
          ? allIngredients.filter(
              (ing: any) =>
                ing.name?.toLowerCase().includes(ingredientSearch.toLowerCase()) ||
                ing.ins_code?.toLowerCase().includes(ingredientSearch.toLowerCase()) ||
                ing.category?.toLowerCase().includes(ingredientSearch.toLowerCase())
            )
          : allIngredients;

        return (
          <>
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4 text-slate-900">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs uppercase tracking-wider font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Ingredients Intelligence
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      ({allIngredients.length} ingredients)
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 mt-1">
                    Decoded Ingredients & Additives
                  </h2>
                  <p className="text-xs text-slate-500">
                    Showing top detected ingredients. Tap below to inspect the full list with safety evidence.
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

              {/* Preview of top 3 ingredients */}
              <div className="space-y-2.5">
                {previewIngredients.map((ing: any, idx: number) => (
                  <IngredientCard key={idx} ingredient={ing} />
                ))}
              </div>

              {/* View More Ingredients Button */}
              {allIngredients.length > 3 && (
                <div className="pt-2 flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setIsIngredientsModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl mac-secondary-btn hover:text-emerald-800 text-slate-800 text-xs font-bold flex items-center justify-center space-x-2 shadow-xs border-slate-200 hover:border-emerald-300 transition-all hover:scale-[1.01]"
                  >
                    <span>View All Ingredients & Additive Details ({allIngredients.length} Items)</span>
                    <ChevronRight className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>
              )}
            </div>

            {/* Complete Ingredients Pop-Up Modal */}
            <UniversalModal
              isOpen={isIngredientsModalOpen}
              onClose={() => setIsIngredientsModalOpen(false)}
              title="Full Ingredients & Chemical Additives Intelligence"
              subtitle={`Complete list of all ${allIngredients.length} ingredients decoded from label fine print`}
              badge="INGREDIENT DOSSIER"
              maxWidth="max-w-3xl"
            >
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={ingredientSearch}
                    onChange={(e) => setIngredientSearch(e.target.value)}
                    placeholder="Search by ingredient name, INS code, or category..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
                  {filteredIngredients.length > 0 ? (
                    filteredIngredients.map((ing: any, idx: number) => (
                      <IngredientCard key={idx} ingredient={ing} />
                    ))
                  ) : (
                    <div className="p-8 text-center text-slate-400 text-xs">
                      No ingredients matching "{ingredientSearch}".
                    </div>
                  )}
                </div>
              </div>
            </UniversalModal>
          </>
        );
      })()}

      {/* Nutrition Facts Preview + View Complete Panel Modal */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-5 text-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase tracking-wider font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Nutritional Profile
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Confidence: <strong className="text-emerald-700">{scanResult.data_confidence || 'High'}</strong>
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Nutrition Quick Summary</h2>
            <p className="text-xs text-slate-500">
              Core macro and micronutrient breakdown per 100g serving against ICMR-NIN safe limits.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setIsNutritionModalOpen(true);
            }}
            className="py-2.5 px-5 rounded-2xl apple-pill-btn text-white text-xs font-bold flex items-center space-x-2 shadow-xs self-start sm:self-auto hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <span>View Complete Nutrition Panel (See Details)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4 Macro Quick Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Energy */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Energy</span>
            <div className="text-xl font-black font-mono text-slate-900">
              {scanResult.nutrition_facts?.calories ?? '--'} <span className="text-xs font-normal text-slate-500">kcal</span>
            </div>
            <span className="text-[10px] text-slate-500 block">per 100g</span>
          </div>

          {/* Added Sugars */}
          <div
            className={`p-4 rounded-2xl border space-y-1 ${
              (scanResult.nutrition_facts?.added_sugar ?? 0) > 10
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : (scanResult.nutrition_facts?.added_sugar ?? 0) > 5
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-75 block">Added Sugar</span>
            <div className="text-xl font-black font-mono">
              {scanResult.nutrition_facts?.added_sugar ?? scanResult.nutrition_facts?.total_sugar ?? '--'}{' '}
              <span className="text-xs font-normal">g</span>
            </div>
            <span className="text-[10px] font-semibold block">
              {(scanResult.nutrition_facts?.added_sugar ?? 0) > 10 ? '⚠️ High (Exceeds Limit)' : '✓ Within Limit'}
            </span>
          </div>

          {/* Sodium */}
          <div
            className={`p-4 rounded-2xl border space-y-1 ${
              (scanResult.nutrition_facts?.sodium ?? 0) > 600
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : (scanResult.nutrition_facts?.sodium ?? 0) > 300
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-75 block">Sodium</span>
            <div className="text-xl font-black font-mono">
              {scanResult.nutrition_facts?.sodium ?? '--'} <span className="text-xs font-normal">mg</span>
            </div>
            <span className="text-[10px] font-semibold block">
              {(scanResult.nutrition_facts?.sodium ?? 0) > 600 ? '⚠️ High Salt Content' : '✓ Acceptable'}
            </span>
          </div>

          {/* Protein */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Protein</span>
            <div className="text-xl font-black font-mono text-slate-900">
              {scanResult.nutrition_facts?.protein ?? '--'} <span className="text-xs font-normal text-slate-500">g</span>
            </div>
            <span className="text-[10px] text-slate-500 block">Clean macronutrient</span>
          </div>
        </div>
      </div>

      {/* Complete Nutrition Panel Modal */}
      <UniversalModal
        isOpen={isNutritionModalOpen}
        onClose={() => setIsNutritionModalOpen(false)}
        title="Complete Nutrition Facts Panel"
        subtitle={`${scanResult.product_name} · Per 100g & Serving Values`}
        badge="NUTRITIONAL MATRIX"
        maxWidth="max-w-3xl"
      >
        <NutritionTable
          nutrition100g={scanResult.nutrition_facts || {}}
          sourceConfidence={scanResult.data_confidence}
        />
      </UniversalModal>

      {/* Healthier Alternatives Section (Compact Preview + View More Modal) */}
      {scanResult.healthier_alternatives && scanResult.healthier_alternatives.length > 0 && (
        <>
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 text-slate-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Recommended Healthier Alternatives</h2>
                  <p className="text-xs text-slate-500">
                    Better nutritional profile without conflicting with your declared allergens.
                  </p>
                </div>
              </div>

              {scanResult.healthier_alternatives.length > 2 && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setIsAlternativesModalOpen(true);
                  }}
                  className="py-2.5 px-4 rounded-2xl mac-secondary-btn text-xs font-bold text-slate-800 hover:text-emerald-800 flex items-center space-x-1.5 shadow-xs self-start sm:self-auto"
                >
                  <span>View All Alternatives ({scanResult.healthier_alternatives.length})</span>
                  <ChevronRight className="w-3.5 h-3.5 text-emerald-600" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scanResult.healthier_alternatives.slice(0, 2).map((alt, i) => (
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

          {/* All Alternatives Pop-Up Modal */}
          <UniversalModal
            isOpen={isAlternativesModalOpen}
            onClose={() => setIsAlternativesModalOpen(false)}
            title="Clean & Healthier Swaps"
            subtitle={`Verified better food alternatives for ${scanResult.product_name}`}
            badge="CLEAN ALTERNATIVES"
            icon={<Sparkles className="w-5 h-5 text-emerald-600" />}
            maxWidth="max-w-4xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scanResult.healthier_alternatives.map((alt, i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all flex flex-col justify-between shadow-xs"
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
          </UniversalModal>
        </>
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
