import React, { useState } from 'react';
import { ScoreBadge } from '../components/ScoreBadge';
import { UniversalModal } from '../components/UniversalModal';
import { Sparkles, ArrowRight, CheckCircle2, ChevronRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface HealthierAlternativesPageProps {
  onNavigate: (tab: string) => void;
}

export const HealthierAlternativesPage: React.FC<HealthierAlternativesPageProps> = ({ onNavigate }) => {
  const [selectedAlt, setSelectedAlt] = useState<any | null>(null);

  const alternatives = [
    {
      category: 'Instant Noodles & Quick Meals',
      insteadOf: 'Refined Maida Fried Noodles (e.g. Maggi)',
      name: 'Slurrp Farm Foxtail Millet Noodles',
      brand: 'Slurrp Farm',
      score: 8.4,
      why: '100% whole millets instead of refined maida. Air-dried rather than deep-fried in palm oil. Contains 50% less fat and 3x more dietary fiber.',
      tags: ['No Palm Oil', 'Air Dried', 'High Fiber'],
      details: {
        badNutrients: '34% Palm Olein, 1,280mg Sodium, TBHQ chemical preservative',
        goodNutrients: '100% Foxtail Millet, Cold-pressed sesame oil, 0g trans fat, 450mg sodium',
        benefit: 'Prevents postprandial glucose spikes and eliminates carcinogenic lipid peroxidation from reheated frying oils.',
      }
    },
    {
      category: 'Savory Chips & Crisps',
      insteadOf: 'Deep-Fried Palmolein Potato Chips',
      name: 'Farmley Roasted Peri Peri Makhana',
      brand: 'Farmley',
      score: 8.8,
      why: 'Slow-roasted fox nuts. Zero trans fat, 70% less saturated fat than potato crisps, rich in magnesium and essential minerals.',
      tags: ['Slow Roasted', 'Zero Trans Fat', 'Rich in Minerals'],
      details: {
        badNutrients: 'Deep-fried in cheap hydrogenated vegetable fat, high glycemic index (GI 85+)',
        goodNutrients: 'Clean popped lotus seeds, raw spice seasonings, 10g protein per 100g',
        benefit: 'Lowers glycemic load and provides bioavailable antioxidants without clogging microvascular capillaries.',
      }
    },
    {
      category: 'Tea-Time Biscuits',
      insteadOf: 'Maida Biscuits with Invert Sugar Syrup (e.g. Parle-G)',
      name: 'Early Foods Organic Ragi & Almond Cookies',
      brand: 'Early Foods',
      score: 8.6,
      why: '100% organic ragi (finger millet) and real butter. Sweetened with natural unrefined jaggery. Zero refined white sugar and no chemical preservatives.',
      tags: ['Zero Refined Sugar', 'Organic Millets', 'No Vanaspati'],
      details: {
        badNutrients: '28g Refined Sugar, Invert Syrup, Palmolein fat, INS 503(ii)',
        goodNutrients: 'Sprouted Ragi Flour, Unrefined Organic Jaggery, Real Cow Ghee, Roasted Almonds',
        benefit: 'Provides natural calcium for bone density and slow-release dietary fiber that maintains sustained energy.',
      }
    },
    {
      category: 'Packaged Drinks & Juices',
      insteadOf: 'Concentrate Juice with 25g+ Added Sugar',
      name: 'Raw Pressery Tender Coconut Water (100% Pure)',
      brand: 'Raw Pressery',
      score: 9.4,
      why: 'Naturally isotonic with zero added sugar, no artificial colors, no preservatives, and naturally rich in potassium and electrolytes.',
      tags: ['Zero Added Sugar', 'Cold-Crafted', 'Isotonic'],
      details: {
        badNutrients: 'De-pectinized fruit concentrate, 32g liquid fructose, INS 211 preservative',
        goodNutrients: '100% Pure Tender Coconut Water, Natural Electrolytes (Potassium & Magnesium)',
        benefit: 'Restores intracellular hydration, balances sodium-potassium ATPase pump, and protects kidney nephrons.',
      }
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Healthier Food Alternatives
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Science-backed swaps with cleaner ingredients and superior nutrient profiles.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('scanner')}
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20 self-start sm:self-auto"
        >
          Scan Food to Find Swaps
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alternatives.map((alt, idx) => (
          <div
            key={idx}
            className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  {alt.category}
                </span>
                <ScoreBadge score={alt.score} size="md" />
              </div>

              <div>
                <span className="text-xs text-rose-700 font-semibold block mb-1">
                  Instead of: {alt.insteadOf}
                </span>
                <h3 className="text-xl font-black text-slate-900">{alt.name}</h3>
                <span className="text-xs text-slate-500 font-medium">{alt.brand}</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed shadow-inner">
                <strong className="text-emerald-700 block mb-1">Nutritional Advantage:</strong>
                {alt.why}
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {alt.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setSelectedAlt(alt);
                }}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1"
              >
                <span>View Full Swap Details (See Details)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('scanner')}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center space-x-1"
              >
                <span>Scan similar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Alternative Swap Details Modal */}
      {selectedAlt && (
        <UniversalModal
          isOpen={!!selectedAlt}
          onClose={() => setSelectedAlt(null)}
          title={selectedAlt.name}
          subtitle={`Healthier Swap for ${selectedAlt.insteadOf}`}
          badge="VERIFIED HEALTH SWAP"
          icon={<Sparkles className="w-5 h-5 text-emerald-600" />}
          maxWidth="max-w-2xl"
          footer={
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedAlt(null)}
                className="py-2.5 px-6 rounded-2xl apple-pill-btn text-white text-xs font-bold"
              >
                Close Details
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Category</span>
                <span className="font-bold text-slate-900 text-sm">{selectedAlt.category}</span>
              </div>
              <ScoreBadge score={selectedAlt.score} size="md" />
            </div>

            <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-1">
              <span className="font-bold text-rose-800 text-xs flex items-center space-x-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                <span>What Conventional Foods Contain (Avoid):</span>
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">{selectedAlt.details.badNutrients}</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1">
              <span className="font-bold text-emerald-900 text-xs flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Why This Clean Alternative Wins (Adopt):</span>
              </span>
              <p className="text-xs text-slate-700 leading-relaxed">{selectedAlt.details.goodNutrients}</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 text-xs flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Clinical Metabolic Impact:</span>
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">{selectedAlt.details.benefit}</p>
            </div>
          </div>
        </UniversalModal>
      )}
    </div>
  );
};
