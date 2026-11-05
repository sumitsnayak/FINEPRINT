import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ScoreBadge } from '../components/ScoreBadge';
import { NutritionTable } from '../components/NutritionTable';
import { IngredientCard } from '../components/IngredientCard';
import { useScan } from '../context/ScanContext';
import { ArrowLeft, Calendar, Scale, Sparkles, Check } from 'lucide-react';

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
            <ScoreBadge score={product.overall_score} size="ring" />
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

      {/* Ingredients breakdown */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Ingredients & Additives Analysis</h2>
        <div className="space-y-2.5">
          {product.ingredient_analysis?.ingredients?.map((ing: any, i: number) => (
            <IngredientCard key={i} ingredient={ing} />
          ))}
        </div>
      </div>

      {/* Nutrition Facts */}
      <NutritionTable
        nutrition100g={product.nutrition_per_100g || {}}
        nutritionServing={product.nutrition_per_serving}
        servingSize={product.serving_size}
        sourceConfidence={product.data_confidence}
      />
    </div>
  );
};
