import React, { useState } from 'react';
import { NutritionFacts } from '../types';

interface NutritionTableProps {
  nutrition100g: NutritionFacts;
  nutritionServing?: NutritionFacts;
  servingSize?: string;
  sourceConfidence?: string;
}

export const NutritionTable: React.FC<NutritionTableProps> = ({
  nutrition100g,
  nutritionServing,
  servingSize = '100g',
  sourceConfidence = 'High (Verified Label)',
}) => {
  const [viewMode, setViewMode] = useState<'100g' | 'serving'>('100g');

  const currentData = viewMode === 'serving' && nutritionServing && Object.keys(nutritionServing).length > 0
    ? nutritionServing
    : nutrition100g;

  const dailyBenchmarks = {
    calories: 2000,
    protein: 60,
    carbs: 250,
    total_sugar: 25,
    added_sugar: 20,
    total_fat: 65,
    saturated_fat: 20,
    trans_fat: 2,
    fiber: 30,
    sodium: 2000,
  };

  const getPercentDaily = (nutrient: keyof typeof dailyBenchmarks, val: number | undefined) => {
    if (val === undefined || val === null) return null;
    const bench = dailyBenchmarks[nutrient];
    return Math.min(Math.round((val / bench) * 100), 100);
  };

  const rows = [
    { label: 'Energy / Calories', key: 'calories', unit: 'kcal', benchKey: 'calories' },
    { label: 'Protein', key: 'protein', unit: 'g', benchKey: 'protein' },
    { label: 'Carbohydrates', key: 'carbs', unit: 'g', benchKey: 'carbs' },
    { label: '  — Total Sugars', key: 'total_sugar', unit: 'g', benchKey: 'total_sugar', indent: true },
    { label: '  — Added Sugars', key: 'added_sugar', unit: 'g', benchKey: 'added_sugar', indent: true, alertHigh: true },
    { label: 'Total Fat', key: 'total_fat', unit: 'g', benchKey: 'total_fat' },
    { label: '  — Saturated Fat', key: 'saturated_fat', unit: 'g', benchKey: 'saturated_fat', indent: true },
    { label: '  — Trans Fat', key: 'trans_fat', unit: 'g', benchKey: 'trans_fat', indent: true, alertHigh: true },
    { label: 'Dietary Fiber', key: 'fiber', unit: 'g', benchKey: 'fiber' },
    { label: 'Sodium', key: 'sodium', unit: 'mg', benchKey: 'sodium', alertHigh: true },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="p-4 sm:p-5 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-slate-900 text-sm sm:text-base">Nutritional Facts</h3>
          <p className="text-[11px] text-slate-500">
            Source: <span className="font-semibold text-emerald-700">{sourceConfidence}</span>
          </p>
        </div>

        {nutritionServing && Object.keys(nutritionServing).length > 0 && (
          <div className="inline-flex rounded-full border border-slate-200 p-0.5 bg-white text-xs font-bold shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('100g')}
              className={`px-3 py-1 rounded-full transition-all ${
                viewMode === '100g' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Per 100g
            </button>
            <button
              type="button"
              onClick={() => setViewMode('serving')}
              className={`px-3 py-1 rounded-full transition-all ${
                viewMode === 'serving' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Per Serving ({servingSize})
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-bold bg-slate-50/50">
              <th className="py-2.5 px-4">Nutrient</th>
              <th className="py-2.5 px-4 text-right">Amount</th>
              <th className="py-2.5 px-4 text-right">% Daily Value*</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {rows.map((row) => {
              const val = currentData[row.key as keyof NutritionFacts];
              const percent = row.benchKey ? getPercentDaily(row.benchKey as any, val) : null;
              const isDefined = val !== undefined && val !== null;

              return (
                <tr key={row.key} className="hover:bg-slate-50/60 transition-colors">
                  <td className={`py-2 px-4 ${row.indent ? 'pl-8 text-slate-500' : 'font-medium text-slate-800'}`}>
                    {row.label}
                  </td>
                  <td className="py-2 px-4 text-right font-mono font-semibold text-slate-900">
                    {isDefined ? `${val} ${row.unit}` : <span className="text-slate-400 italic">—</span>}
                  </td>
                  <td className="py-2 px-4 text-right">
                    {percent !== null ? (
                      <div className="flex items-center justify-end space-x-2">
                        <span className="font-mono text-[11px] font-bold text-slate-600">{percent}%</span>
                        <div className="w-12 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              row.alertHigh && percent > 50
                                ? 'bg-rose-500'
                                : row.alertHigh && percent > 25
                                ? 'bg-amber-500'
                                : 'bg-emerald-600'
                            }`}
                            style={{ width: `${Math.min(percent, 100)}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-3 bg-slate-50/80 border-t border-slate-200 text-[10px] text-slate-500">
        *Percent Daily Values are based on ICMR-NIN recommended dietary allowances (2,000 kcal diet).
      </div>
    </div>
  );
};
