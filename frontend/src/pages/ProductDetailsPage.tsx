import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ScoreBadge } from '../components/ScoreBadge';
import { NutritionTable } from '../components/NutritionTable';
import { IngredientCard } from '../components/IngredientCard';
import { ExplainableScoreModal } from '../components/ExplainableScoreModal';
import { UniversalModal } from '../components/UniversalModal';
import { useScan } from '../context/ScanContext';
import { ArrowLeft, Calendar, Scale, Sparkles, Check, HelpCircle, ChevronRight, Search } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface ProductDetailsPageProps {
  productId: number;
  onBack: () => void;
  onNavigate: (tab: string) => void;
  onAskAssistant: (product: any) => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  productId,
  onBack,
  onAskAssistant,
}) => {
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [logged, setLogged] = useState(false);
  const [isExplainModalOpen, setIsExplainModalOpen] = useState(false);
  const [isIngredientsModalOpen, setIsIngredientsModalOpen] = useState(false);
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);
  const [ingredientSearch, setIngredientSearch] = useState('');
  const { addToCompare } = useScan();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await api.getProductById(productId);
        setProduct(data);
      } catch (err) {
        console.error('Error loading product details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center text-slate-500 text-sm">
        Loading product intelligence...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-3">
        <p className="text-slate-900 font-bold">Product not found.</p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Products</span>
      </button>

      {/* Main Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl flex flex-col md:flex-row gap-6 items-start text-slate-900">
        {product.image_url && (
          <div className="w-full md:w-64 aspect-square rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0">
            <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs uppercase tracking-wider font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-full border border-slate-200">
              {product.brand || 'Verified Packaged Food'}
            </span>
            {product.is_verified && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                FSSAI Verified
              </span>
            )}
            {product.package_weight && (
              <span className="text-xs text-slate-500 font-mono bg-slate-50 px-2.5 py-0.5 rounded-md border border-slate-200">
                {product.package_weight}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {product.name}
          </h1>

          <p className="text-xs text-slate-500">
            Category: {product.category} · Barcode: <span className="font-mono text-slate-700">{product.barcode || 'N/A'}</span>
          </p>

          <div className="pt-2 flex items-center space-x-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 w-fit">
            <div className="flex flex-col items-center">
              <ScoreBadge score={product.overall_score} size="ring" />
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setIsExplainModalOpen(true);
                }}
                className="mt-2 inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold mac-secondary-btn hover:text-emerald-700 text-slate-700 transition-all shadow-xs"
                title="Explain how this score was calculated"
              >
                <HelpCircle className="w-3 h-3 text-emerald-600" />
                <span>Explain This Score</span>
              </button>
            </div>
            <div className="text-xs text-slate-600 space-y-1">
              <div>Safety Score: <strong className="font-mono text-slate-900">{product.safety_score}/10</strong></div>
              <div>Nutritional Quality: <strong className="font-mono text-slate-900">{product.nutrition_score}/10</strong></div>
              <div>Concern Level: <strong className="font-mono text-emerald-700 uppercase">{product.concern_level}</strong></div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-2.5">
            <button
              onClick={async () => {
                await api.addMealEntry({
                  meal_type: 'snack',
                  food_name: product.name,
                  portion_amount: 1,
                  portion_unit: 'serving',
                  calories: product.nutrition_per_100g?.calories || 250,
                  protein: product.nutrition_per_100g?.protein || 5,
                  carbs: product.nutrition_per_100g?.carbs || 35,
                  fat: product.nutrition_per_100g?.total_fat || 10,
                  sugar: product.nutrition_per_100g?.total_sugar || 4,
                  sodium: product.nutrition_per_100g?.sodium || 300,
                  product_id: product.id,
                  source_type: 'database',
                });
                setLogged(true);
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                logged
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20'
              }`}
            >
              {logged ? <Check className="w-4 h-4" /> : <Calendar className="w-4 h-4" />}
              <span>{logged ? 'Logged to Diary' : 'Log to Food Diary'}</span>
            </button>

            <button
              onClick={() =>
                addToCompare({
                  id: product.id,
                  name: product.name,
                  category: product.category,
                  overall_score: product.overall_score,
                  safety_score: product.safety_score,
                  nutrition_score: product.nutrition_score,
                  concern_level: product.concern_level,
                  is_verified: product.is_verified,
                  source: product.source,
                })
              }
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50 flex items-center space-x-1.5 bg-white transition-colors shadow-xs"
            >
              <Scale className="w-4 h-4 text-emerald-600" />
              <span>Compare</span>
            </button>

            <button
              onClick={() => onAskAssistant(product)}
              className="px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold hover:bg-emerald-100 flex items-center space-x-1.5 transition-colors shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Ingredients breakdown (Compact preview + View More Modal) */}
      {(() => {
        const allIngredients = product.ingredient_analysis?.ingredients || [];
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
                    Ingredients & Additives Analysis
                  </h2>
                  <p className="text-xs text-slate-500">
                    Showing top detected ingredients. Tap below to inspect all chemical additives and INS numbers.
                  </p>
                </div>
              </div>

              {/* Preview top 3 ingredients */}
              <div className="space-y-2.5">
                {previewIngredients.map((ing: any, i: number) => (
                  <IngredientCard key={i} ingredient={ing} />
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
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl mac-secondary-btn hover:text-emerald-800 text-slate-800 text-xs font-bold flex items-center justify-center space-x-2 shadow-xs border-slate-200 hover:border-emerald-300 transition-all"
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
              title="Full Ingredients & Additives Breakdown"
              subtitle={`Complete list of all ${allIngredients.length} ingredients for ${product.name}`}
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
                    filteredIngredients.map((ing: any, i: number) => (
                      <IngredientCard key={i} ingredient={ing} />
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
                Serving: <strong className="text-slate-800">{product.serving_size || '100g'}</strong>
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">Nutrition Quick Summary</h2>
            <p className="text-xs text-slate-500">
              Laboratory measured values against standard daily recommended ceilings.
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
              {product.nutrition_per_100g?.calories ?? '--'} <span className="text-xs font-normal text-slate-500">kcal</span>
            </div>
            <span className="text-[10px] text-slate-500 block">per 100g</span>
          </div>

          {/* Added Sugars */}
          <div
            className={`p-4 rounded-2xl border space-y-1 ${
              (product.nutrition_per_100g?.added_sugar ?? 0) > 10
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : (product.nutrition_per_100g?.added_sugar ?? 0) > 5
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-75 block">Added Sugar</span>
            <div className="text-xl font-black font-mono">
              {product.nutrition_per_100g?.added_sugar ?? product.nutrition_per_100g?.total_sugar ?? '--'}{' '}
              <span className="text-xs font-normal">g</span>
            </div>
            <span className="text-[10px] font-semibold block">
              {(product.nutrition_per_100g?.added_sugar ?? 0) > 10 ? '⚠️ High Concern' : '✓ Within Limit'}
            </span>
          </div>

          {/* Sodium */}
          <div
            className={`p-4 rounded-2xl border space-y-1 ${
              (product.nutrition_per_100g?.sodium ?? 0) > 600
                ? 'bg-rose-50 border-rose-200 text-rose-900'
                : (product.nutrition_per_100g?.sodium ?? 0) > 300
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-emerald-50 border-emerald-200 text-emerald-900'
            }`}
          >
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-75 block">Sodium</span>
            <div className="text-xl font-black font-mono">
              {product.nutrition_per_100g?.sodium ?? '--'} <span className="text-xs font-normal">mg</span>
            </div>
            <span className="text-[10px] font-semibold block">
              {(product.nutrition_per_100g?.sodium ?? 0) > 600 ? '⚠️ High Salt' : '✓ Normal'}
            </span>
          </div>

          {/* Protein */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Protein</span>
            <div className="text-xl font-black font-mono text-slate-900">
              {product.nutrition_per_100g?.protein ?? '--'} <span className="text-xs font-normal text-slate-500">g</span>
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
        subtitle={`${product.name} · Laboratory Reference Standards`}
        badge="NUTRITIONAL MATRIX"
        maxWidth="max-w-3xl"
      >
        <NutritionTable
          nutrition100g={product.nutrition_per_100g || {}}
          nutritionServing={product.nutrition_per_serving}
          servingSize={product.serving_size}
          sourceConfidence={product.data_confidence}
        />
      </UniversalModal>

      {/* Explainable Food Score Modal */}
      <ExplainableScoreModal
        isOpen={isExplainModalOpen}
        onClose={() => setIsExplainModalOpen(false)}
        product={product}
      />
    </div>
  );
};
