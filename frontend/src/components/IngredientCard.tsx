import React, { useState } from 'react';
import { IngredientDetail } from '../types';
import { ChevronDown, ChevronUp, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';

interface IngredientCardProps {
  ingredient: IngredientDetail;
}

export const IngredientCard: React.FC<IngredientCardProps> = ({ ingredient }) => {
  const [expanded, setExpanded] = useState(false);

  const getSafetyBadge = (level: string) => {
    switch (level) {
      case 'high_concern':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-50 text-rose-700 border border-rose-200 shadow-sm">
            <ShieldAlert className="w-3 h-3 text-rose-600" />
            <span>High Concern</span>
          </span>
        );
      case 'moderate_concern':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>Moderate Concern</span>
          </span>
        );
      case 'safe':
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>Permitted / Safe</span>
          </span>
        );
    }
  };

  return (
    <div className="border border-slate-200 rounded-2xl bg-white overflow-hidden transition-all duration-200 shadow-sm hover:shadow">
      <div
        className="p-4 cursor-pointer flex items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 pr-3">
          <div className="flex items-center flex-wrap gap-2 mb-1">
            <h4 className="font-bold text-slate-900 text-sm">{ingredient.matched_name}</h4>
            {ingredient.ins_number && (
              <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded font-mono font-medium border border-slate-200">
                {ingredient.ins_number}
              </span>
            )}
            {getSafetyBadge(ingredient.safety_level)}
          </div>
          <p className="text-xs text-slate-500 line-clamp-1">{ingredient.purpose}</p>
        </div>

        <button
          type="button"
          className="text-slate-400 hover:text-slate-700 p-1"
          aria-label="Toggle details"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-slate-100 bg-slate-50/70 text-xs space-y-3">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
              Plain Explanation
            </span>
            <p className="text-slate-700 leading-relaxed">{ingredient.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                Category & Function
              </span>
              <p className="text-slate-900 font-medium">{ingredient.category}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{ingredient.purpose}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block mb-1">
                Dietary & Allergen Profile
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    ingredient.dietary_compatibility.vegetarian
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {ingredient.dietary_compatibility.vegetarian ? 'Vegetarian' : 'Non-Vegetarian'}
                </span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    ingredient.dietary_compatibility.vegan
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {ingredient.dietary_compatibility.vegan ? 'Vegan' : 'Non-Vegan'}
                </span>
                {ingredient.allergens && ingredient.allergens.length > 0 && (
                  <span className="text-[11px] px-2 py-0.5 rounded-full font-bold bg-rose-50 text-rose-700 border border-rose-200">
                    Allergen: {ingredient.allergens.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 text-slate-700 space-y-1 text-[11px] shadow-sm">
            <div>
              <strong className="text-slate-900">Regulatory Status:</strong> {ingredient.regulatory_status}
            </div>
            {ingredient.daily_intake_limit && (
              <div>
                <strong className="text-slate-900">Safe Intake Limit (ADI):</strong> {ingredient.daily_intake_limit}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
