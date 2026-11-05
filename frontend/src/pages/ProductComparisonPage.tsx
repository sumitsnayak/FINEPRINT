import React, { useEffect, useState } from 'react';
import { useScan } from '../context/ScanContext';
import { api } from '../services/api';
import { ScoreBadge } from '../components/ScoreBadge';
import { Scale, Trash2, Award } from 'lucide-react';

interface ProductComparisonPageProps {
  onNavigate: (tab: string) => void;
}

export const ProductComparisonPage: React.FC<ProductComparisonPageProps> = ({ onNavigate }) => {
  const { compareList, removeFromCompare, clearCompare } = useScan();
  const [comparisonData, setComparisonData] = useState<any | null>(null);

  useEffect(() => {
    const fetchComparison = async () => {
      if (compareList.length >= 2) {
        try {
          const ids = compareList.map((p) => p.id);
          const res = await api.compareProducts(ids);
          setComparisonData(res);
        } catch (err) {
          console.error('Failed to compare products:', err);
        }
      } else {
        setComparisonData(null);
      }
    };
    fetchComparison();
  }, [compareList]);

  if (compareList.length < 2) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-700 mx-auto flex items-center justify-center shadow-sm">
          <Scale className="w-8 h-8" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Side-by-Side Product Comparison</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Add at least 2 packaged food products to your comparison list to inspect differences in sugar, sodium, protein, additives, and safety scores.
        </p>
        <div className="pt-2">
          <button
            onClick={() => onNavigate('products')}
            className="px-6 py-3 rounded-2xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
          >
            Browse Products to Compare
          </button>
        </div>
      </div>
    );
  }

  const products = comparisonData?.products || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2 shadow-xs">
            <span>🌿</span>
            <span>Comparative Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Product Nutritional Comparison
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Comparing {compareList.length} products side-by-side using scientific benchmarks.
          </p>
        </div>

        <button
          onClick={clearCompare}
          className="text-xs font-bold text-rose-700 hover:text-rose-800 self-start sm:self-auto flex items-center space-x-1.5 bg-rose-50 px-3 py-2 rounded-xl border border-rose-200 shadow-xs"
        >
          <Trash2 className="w-4 h-4" />
          <span>Clear Comparison</span>
        </button>
      </div>

      {/* AI Comparative Insights */}
      {comparisonData?.insights && (
        <div className="bg-gradient-to-br from-emerald-50 via-teal-50/50 to-white border border-emerald-200 rounded-3xl p-6 space-y-3 shadow-sm">
          <div className="flex items-center space-x-2 text-slate-900">
            <Award className="w-5 h-5 text-emerald-600" />
            <h2 className="font-bold text-base uppercase tracking-wider">Comparative Insights</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
            {comparisonData.insights.map((insight: string, idx: number) => (
              <div key={idx} className="flex items-start space-x-2 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <span className="text-emerald-600 font-bold">•</span>
                <span dangerouslySetInnerHTML={{ __html: insight.replace(/\*\*(.*?)\*\*/g, '<strong class="text-slate-950 font-bold">$1</strong>') }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Matrix Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-x-auto text-slate-900">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80">
              <th className="py-4 px-6 text-xs uppercase tracking-wider text-slate-500 font-bold w-48">
                Feature / Nutrient
              </th>
              {products.map((p: any) => (
                <th key={p.id} className="py-4 px-6 text-left">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-400 block">
                        {p.brand || 'Brand'}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm line-clamp-1">{p.name}</h3>
                    </div>
                    <button
                      onClick={() => removeFromCompare(p.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                      title="Remove product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
            {/* Overall Rating */}
            <tr className="bg-slate-50/50">
              <td className="py-3 px-6 font-bold text-slate-900">Overall Score</td>
              {products.map((p: any) => (
                <td key={p.id} className="py-3 px-6">
                  <ScoreBadge score={p.overall_score} size="md" />
                </td>
              ))}
            </tr>

            {/* Safety Score */}
            <tr>
              <td className="py-3 px-6 font-medium text-slate-500">Safety Score</td>
              {products.map((p: any) => (
                <td key={p.id} className="py-3 px-6 font-mono font-bold text-slate-900">
                  {p.safety_score.toFixed(1)} / 10
                </td>
              ))}
            </tr>

            {/* Nutrition Quality */}
            <tr>
              <td className="py-3 px-6 font-medium text-slate-500">Nutritional Quality</td>
              {products.map((p: any) => (
                <td key={p.id} className="py-3 px-6 font-mono font-bold text-slate-900">
                  {p.nutrition_score.toFixed(1)} / 10
                </td>
              ))}
            </tr>

            {/* Calories */}
            <tr>
              <td className="py-3 px-6 font-medium text-slate-500">Calories (per 100g)</td>
              {products.map((p: any) => (
                <td key={p.id} className="py-3 px-6 font-mono text-slate-800">
                  {p.nutrition_per_100g?.calories || 0} kcal
                </td>
              ))}
            </tr>

            {/* Total Sugars */}
            <tr>
              <td className="py-3 px-6 font-medium text-slate-500">Total Sugars</td>
              {products.map((p: any) => {
                const sugar = p.nutrition_per_100g?.total_sugar || 0;
                return (
                  <td key={p.id} className="py-3 px-6 font-mono">
                    <span className={sugar > 15 ? 'text-rose-600 font-bold' : 'text-slate-800'}>
                      {sugar} g
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Sodium */}
            <tr>
              <td className="py-3 px-6 font-medium text-slate-500">Sodium (mg)</td>
              {products.map((p: any) => {
                const sod = p.nutrition_per_100g?.sodium || 0;
                return (
                  <td key={p.id} className="py-3 px-6 font-mono">
                    <span className={sod > 600 ? 'text-amber-600 font-bold' : 'text-slate-800'}>
                      {sod} mg
                    </span>
                  </td>
                );
              })}
            </tr>

            {/* Protein */}
            <tr>
              <td className="py-3 px-6 font-medium text-slate-500">Protein</td>
              {products.map((p: any) => (
                <td key={p.id} className="py-3 px-6 font-mono font-semibold text-emerald-700">
                  {p.nutrition_per_100g?.protein || 0} g
                </td>
              ))}
            </tr>

            {/* Declared Allergens */}
            <tr>
              <td className="py-3 px-6 font-medium text-slate-500">Declared Allergens</td>
              {products.map((p: any) => (
                <td key={p.id} className="py-3 px-6">
                  {p.allergens_declared && p.allergens_declared.length > 0 ? (
                    <span className="text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-semibold">
                      {p.allergens_declared.join(', ')}
                    </span>
                  ) : (
                    <span className="text-slate-400">None declared</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Primary Ingredients */}
            <tr>
              <td className="py-3 px-6 font-medium text-slate-500">Top Ingredients</td>
              {products.map((p: any) => (
                <td key={p.id} className="py-3 px-6 text-slate-600 leading-relaxed max-w-xs">
                  {p.ingredients_text ? p.ingredients_text.slice(0, 120) + '...' : 'N/A'}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
