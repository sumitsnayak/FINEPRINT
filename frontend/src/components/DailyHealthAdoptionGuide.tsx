import React, { useState } from 'react';
import {
  Apple,
  ShieldCheck,
  Flame,
  Droplets,
  HeartPulse,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Wheat,
  Activity,
  ArrowRight,
  TrendingDown,
  Info,
  Check,
  Zap,
  Leaf
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface SwapItem {
  id: string;
  category: string;
  badFood: {
    name: string;
    culprit: string;
    warning: string;
  };
  goodFood: {
    name: string;
    benefit: string;
    stats: string;
  };
}

export const DailyHealthAdoptionGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plate' | 'limits' | 'swaps' | 'rules'>('plate');
  const [activeNutrient, setActiveNutrient] = useState<number>(0);

  const nutrientCards = [
    {
      title: 'Clean Daily Protein',
      target: '0.8g – 1.0g / kg body weight',
      dailyAmount: '55g – 70g daily',
      color: 'emerald',
      bgGlow: 'from-emerald-500/10 to-teal-500/10',
      icon: Activity,
      why: 'Crucial for muscle mass, enzyme synthesis, immune antibodies, and blunting glycemic insulin spikes.',
      topSources: [
        'Sprouted Moong & Black Chana (15g protein / cup)',
        'Paneer / Low-fat Tofu (18g protein / 100g)',
        'Sattu Drink & Roasted Dal (20g protein / 100g)',
        'Organic Farm Eggs or Steamed Fish (12–22g / serving)',
      ],
      warning: 'Avoid ultra-processed soy protein isolates with chemical defoamers and artificial emulsifiers.'
    },
    {
      title: 'Dietary Fiber & Gut Flora',
      target: '30g – 35g / day minimum',
      dailyAmount: 'At least 30g daily',
      color: 'teal',
      bgGlow: 'from-teal-500/10 to-cyan-500/10',
      icon: Leaf,
      why: 'Feeds the gut microbiome, synthesizes short-chain fatty acids (SCFAs), and lowers LDL cholesterol.',
      topSources: [
        'Green Leafy Vegetables (Palak, Methi, Sarson)',
        'Unrefined Millets (Jowar, Bajra, Ragi, Foxtail)',
        'Whole Guava, Apples with skin, and Berries',
        'Soaked Chia Seeds & Flaxseeds (5g fiber / tbsp)',
      ],
      warning: 'Commercial "high-fiber" biscuits replace real fiber with chemically modified wheat dextrin and palm olein.'
    },
    {
      title: 'Unrefined Complex Carbs',
      target: 'Low Glycemic Index (GI < 55)',
      dailyAmount: '200g – 250g daily',
      color: 'amber',
      bgGlow: 'from-amber-500/10 to-orange-500/10',
      icon: Wheat,
      why: 'Provides steady mitochondrial ATP energy without causing rapid blood sugar crashes or visceral adiposity.',
      topSources: [
        'Whole Sorghum (Jowar) & Pearl Millet (Bajra)',
        'Rolled Oats & Steel-cut Groats',
        'Single-polished Brown or Hand-pounded Rice',
        'Boiled Sweet Potatoes & Lentil Dosas',
      ],
      warning: 'Refined Maida (White Flour) digests within 20 minutes, directly flooding the liver with excess glucose.'
    },
    {
      title: 'Pure Hydration & Electrolytes',
      target: '2.5L – 3.5L / day',
      dailyAmount: '8–12 glasses daily',
      color: 'blue',
      bgGlow: 'from-blue-500/10 to-indigo-500/10',
      icon: Droplets,
      why: 'Maintains optimal blood viscosity, kidney filtration, cellular hydration, and toxic byproduct clearance.',
      topSources: [
        'Clean filtered copper-vessel or spring water',
        'Traditional Mint & Jeera Chaas (Spiced Buttermilk)',
        'Fresh Tender Coconut Water (Rich in natural potassium)',
        'Warm Tulsi, Ginger, or Lemon Infusions',
      ],
      warning: 'Packaged sports drinks, colas, and sweetened iced teas pack up to 38g of liquid fructose per bottle.'
    },
  ];

  const smartSwaps: SwapItem[] = [
    {
      id: 'biscuits',
      category: 'Teatime Snacks',
      badFood: {
        name: 'Packaged "Digestive" Biscuits',
        culprit: 'Refined Maida + Palm Olein + Liquid Invert Sugar + INS 500(ii)',
        warning: 'Contains 28g sugar & 18g saturated palm fat per 100g disguised as "healthy".'
      },
      goodFood: {
        name: 'Roasted Spiced Makhana or Roasted Chana',
        benefit: 'Rich in clean plant protein, magnesium, and zero trans fats.',
        stats: '4x More Protein · 0g Hydrogenated Fat'
      }
    },
    {
      id: 'drinks',
      category: 'Cold Beverages',
      badFood: {
        name: 'Carbonated Colas & Energy Drinks',
        culprit: 'High-Fructose Corn Syrup (INS 150d caramel color, Phosphoric Acid)',
        warning: 'Single 300ml can delivers 36g liquid sugar—instantly exceeding your entire daily limit.'
      },
      goodFood: {
        name: 'Fresh Mint Chaas (Buttermilk) or Tender Coconut Water',
        benefit: 'Delivers live lactobacillus probiotics, natural potassium, and zero chemical colors.',
        stats: 'Live Gut Flora · Zero Added Sugar'
      }
    },
    {
      id: 'noodles',
      category: 'Quick Meals',
      badFood: {
        name: 'Instant Fried Noodles (2-Min Packs)',
        culprit: 'Deep-fried in Palm Olein + TBHQ (INS 319 preservative) + INS 621 (MSG)',
        warning: 'Up to 1,280mg sodium per cake with hydrogenated oil that clings to arterial walls.'
      },
      goodFood: {
        name: 'Home-steamed Foxtail Millet Noodles with Fresh Vegetables',
        benefit: 'Slow-burning complex carbohydrates with fresh carrots, peas, and cold-pressed sesame oil.',
        stats: 'Low Glycemic Index · Clean Cold-Pressed Fat'
      }
    },
    {
      id: 'juices',
      category: 'Breakfast Fluids',
      badFood: {
        name: 'Packaged Tetra-Pack "100% Real" Juice',
        culprit: 'De-pectinized fruit concentrate, added fruit syrup, zero intact dietary fiber.',
        warning: 'Liquid fructose bypasses satiety signals, directly burdening the liver.'
      },
      goodFood: {
        name: 'Whole Seasonal Guava, Orange, or Papaya',
        benefit: 'Preserves the complete cellular fiber matrix, active bioflavonoids, and vitamin C.',
        stats: '100% Intact Fiber · Natural Satiety'
      }
    }
  ];

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 relative z-10">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full mac-secondary-btn text-emerald-800 text-xs font-bold shadow-xs">
            <Apple className="w-3.5 h-3.5 text-emerald-600" />
            <span className="tracking-wide">ICMR-NIN 2024 STANDARDS · DAILY NUTRITION BLUEPRINT</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How to Adopt Good Health: <br className="hidden sm:inline" />
            <span className="text-emerald-600">Daily Food Requirements & Pure Intake Guide.</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
            Scientifically balanced nutrition standards by the National Institute of Nutrition (ICMR-NIN).
            Learn how to fulfill your daily micro and macronutrient requirements while dodging ultra-processed food traps.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 self-start sm:self-end">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveTab('plate');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'plate'
                ? 'apple-pill-btn text-white'
                : 'mac-secondary-btn text-slate-600 hover:text-slate-900'
            }`}
          >
            Daily Plate Method
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveTab('limits');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'limits'
                ? 'apple-pill-btn text-white'
                : 'mac-secondary-btn text-slate-600 hover:text-slate-900'
            }`}
          >
            Safe Intake Ceilings
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveTab('swaps');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'swaps'
                ? 'apple-pill-btn text-white'
                : 'mac-secondary-btn text-slate-600 hover:text-slate-900'
            }`}
          >
            Smart Food Swaps
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setActiveTab('rules');
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTab === 'rules'
                ? 'apple-pill-btn text-white'
                : 'mac-secondary-btn text-slate-600 hover:text-slate-900'
            }`}
          >
            Label Rules
          </button>
        </div>
      </div>

      {/* TAB 1: DAILY PLATE METHOD */}
      {activeTab === 'plate' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Visual Plate Ratio Bar */}
          <div className="glass-card rounded-[32px] p-6 sm:p-8 space-y-6 border border-white/80 shadow-md">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                  National Institute of Nutrition (ICMR) Formula
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  The Ideal "My Plate for the Day"
                </h3>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-bold border border-emerald-200">
                100% Real Food Ratio
              </span>
            </div>

            {/* Visual segmented bar */}
            <div className="space-y-2">
              <div className="h-5 sm:h-6 w-full rounded-full overflow-hidden flex shadow-inner border border-slate-200/60 p-0.5 bg-slate-100">
                <div
                  className="h-full bg-emerald-500 rounded-l-full flex items-center justify-center text-[10px] sm:text-xs font-black text-white px-2 transition-all hover:opacity-90 cursor-help"
                  style={{ width: '50%' }}
                  title="50% Protective Foods (Vegetables & Greens)"
                >
                  50% Veggies & Greens
                </div>
                <div
                  className="h-full bg-teal-500 flex items-center justify-center text-[10px] sm:text-xs font-black text-white px-2 transition-all hover:opacity-90 cursor-help"
                  style={{ width: '25%' }}
                  title="25% Clean Protein"
                >
                  25% Protein
                </div>
                <div
                  className="h-full bg-amber-500 rounded-r-full flex items-center justify-center text-[10px] sm:text-xs font-black text-white px-2 transition-all hover:opacity-90 cursor-help"
                  style={{ width: '25%' }}
                  title="25% Whole Grains & Millets"
                >
                  25% Millets
                </div>
              </div>

              <div className="flex justify-between text-[11px] font-semibold text-slate-500 px-1">
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Protective Foods (400–500g)</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <span>Repair & Muscle (55–70g)</span>
                </span>
                <span className="flex items-center space-x-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Slow Energy (200–250g)</span>
                </span>
              </div>
            </div>

            {/* 4 Interactive Nutrient Focus Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {nutrientCards.map((n, idx) => {
                const IconComponent = n.icon;
                const isSelected = activeNutrient === idx;

                return (
                  <div
                    key={n.title}
                    onClick={() => {
                      sounds.playClick();
                      setActiveNutrient(idx);
                    }}
                    className={`rounded-[26px] p-5 sm:p-6 transition-all duration-300 cursor-pointer border ${
                      isSelected
                        ? 'bg-white/95 border-emerald-500/50 shadow-lg ring-2 ring-emerald-500/20 -translate-y-1'
                        : 'bg-white/70 hover:bg-white/90 border-slate-200/70 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center flex-shrink-0 shadow-xs">
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-black text-slate-900">{n.title}</h4>
                          <span className="text-[11px] font-mono font-bold text-emerald-700">
                            {n.target}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700">
                        {n.dailyAmount}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {n.why}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                        Best Daily Indian Sources:
                      </span>
                      <ul className="text-xs text-slate-700 space-y-1 font-medium">
                        {n.topSources.map((source) => (
                          <li key={source} className="flex items-center space-x-1.5">
                            <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                            <span>{source}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-3.5 p-2.5 rounded-xl bg-amber-50/90 border border-amber-200/80 text-[11px] text-amber-900 flex items-start space-x-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>{n.warning}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SAFE INTAKE CEILINGS (PACKAGED FOOD DANGER LIMITS) */}
      {activeTab === 'limits' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="glass-card rounded-[32px] p-6 sm:p-8 space-y-6 border border-white/80 shadow-md">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-600">
                FSSAI & WHO Daily Ceilings
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Critical Daily Thresholds to Prevent Metabolic Disease
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                Most packaged snacks exceed 50% to 100% of these daily caps in a single serving. Stay below these limits.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Sugar Ceiling */}
              <div className="rounded-[28px] p-6 bg-gradient-to-b from-rose-50/70 to-white border border-rose-200/80 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 text-[10px] font-mono font-bold">
                      MAX CEILING
                    </span>
                    <Flame className="w-4 h-4 text-rose-500" />
                  </div>
                  <h4 className="text-base font-black text-slate-900">Added Sugar</h4>
                  <div className="text-3xl font-black text-rose-600 font-mono">
                    &lt; 25g <span className="text-xs font-sans text-slate-500 font-medium">/ day</span>
                  </div>
                  <p className="text-xs text-slate-500">Approximately 5 to 6 teaspoons total from all foods.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/90 border border-rose-100 text-xs text-slate-600 space-y-1">
                  <span className="font-extrabold text-rose-900 block text-[11px]">The Packaged Trap:</span>
                  <p>Disguised on ingredient lists under 56 aliases: Invert Sugar, Maltodextrin, High-Fructose Syrup, Corn Solids.</p>
                </div>
              </div>

              {/* Sodium Ceiling */}
              <div className="rounded-[28px] p-6 bg-gradient-to-b from-amber-50/70 to-white border border-amber-200/80 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-mono font-bold">
                      MAX CEILING
                    </span>
                    <HeartPulse className="w-4 h-4 text-amber-600" />
                  </div>
                  <h4 className="text-base font-black text-slate-900">Sodium (Salt)</h4>
                  <div className="text-3xl font-black text-amber-600 font-mono">
                    &lt; 2,000mg <span className="text-xs font-sans text-slate-500 font-medium">/ day</span>
                  </div>
                  <p className="text-xs text-slate-500">Equivalent to 5g (about 1 level teaspoon) of table salt.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/90 border border-amber-100 text-xs text-slate-600 space-y-1">
                  <span className="font-extrabold text-amber-900 block text-[11px]">The Packaged Trap:</span>
                  <p>1 packet of instant noodles or salted chips packs up to 1,200mg sodium—instantly consuming 60% of your daily limit.</p>
                </div>
              </div>

              {/* Saturated & Trans Fat Ceiling */}
              <div className="rounded-[28px] p-6 bg-gradient-to-b from-emerald-50/70 to-white border border-emerald-200/80 shadow-xs flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                      TARGET
                    </span>
                    <Droplets className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h4 className="text-base font-black text-slate-900">Cold-Pressed Healthy Fats</h4>
                  <div className="text-3xl font-black text-emerald-700 font-mono">
                    25g – 30g <span className="text-xs font-sans text-slate-500 font-medium">/ day</span>
                  </div>
                  <p className="text-xs text-slate-500">Prefer cold-pressed mustard, sesame, groundnut, or pure ghee.</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/90 border border-emerald-100 text-xs text-slate-600 space-y-1">
                  <span className="font-extrabold text-emerald-900 block text-[11px]">Zero Tolerance:</span>
                  <p>Zero hydrogenated vegetable fat (Vanaspati) and minimal Palm Olein (high in saturated palmitic acid).</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SMART FOOD SWAPS */}
      {activeTab === 'swaps' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="glass-card rounded-[32px] p-6 sm:p-8 space-y-6 border border-white/80 shadow-md">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                Actionable Kitchen Conversions
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                Replace High-Concern Packaged Foods with Clean Nutrition
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                Small swaps eliminate up to 80% of dietary chemical additives and prevent insulin resistance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {smartSwaps.map((swap) => (
                <div
                  key={swap.id}
                  className="rounded-[28px] overflow-hidden border border-slate-200/80 bg-white/80 shadow-xs flex flex-col justify-between"
                >
                  <div className="p-4 bg-slate-100/70 border-b border-slate-200/60 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-600 uppercase tracking-wider">
                      {swap.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Recommended Swap
                    </span>
                  </div>

                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    {/* Unhealthy choice */}
                    <div className="p-3.5 rounded-2xl bg-rose-50/80 border border-rose-200/60 space-y-1">
                      <div className="flex items-center space-x-1.5 text-rose-800 font-black text-xs">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        <span>Avoid: {swap.badFood.name}</span>
                      </div>
                      <p className="text-[11px] text-rose-900/80 font-mono">{swap.badFood.culprit}</p>
                      <p className="text-[11px] text-slate-600">{swap.badFood.warning}</p>
                    </div>

                    <div className="flex justify-center -my-1">
                      <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Healthy choice */}
                    <div className="p-3.5 rounded-2xl bg-emerald-50/90 border border-emerald-200/80 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center space-x-1.5 text-emerald-900 font-black text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Adopt: {swap.goodFood.name}</span>
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold">
                          {swap.goodFood.stats}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700">{swap.goodFood.benefit}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SUPERMARKET RULES */}
      {activeTab === 'rules' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="glass-card rounded-[32px] p-6 sm:p-8 space-y-6 border border-white/80 shadow-md">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700">
                Label Literacy Handbook
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                The 3 Golden Rules When Buying Packaged Food
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                Supermarket packaging is designed to fool you. Use these 3 laboratory-tested rules before putting any item in your cart.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-6 rounded-[28px] bg-slate-50/80 border border-slate-200/80 space-y-3">
                <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  1
                </div>
                <h4 className="text-base font-black text-slate-900">The Top 3 Ingredients Rule</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  By law, food labels must list ingredients in descending order of weight. The first 3 ingredients represent 70% to 85% of what's inside. If sugar, refined palm oil, or maida appears in the top 3, it is not health food.
                </p>
              </div>

              <div className="p-6 rounded-[28px] bg-slate-50/80 border border-slate-200/80 space-y-3">
                <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  2
                </div>
                <h4 className="text-base font-black text-slate-900">The 5-Ingredient Threshold</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Natural, gut-friendly food has short ingredient lists. When an item has more than 5 multi-syllable chemical ingredients (e.g. INS 471, INS 319, INS 150d), it is classified as Nova-4 Ultra Processed Food.
                </p>
              </div>

              <div className="p-6 rounded-[28px] bg-slate-50/80 border border-slate-200/80 space-y-3">
                <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                  3
                </div>
                <h4 className="text-base font-black text-slate-900">Inspect the FSSAI License & Dates</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Always verify the 14-digit FSSAI license number on the back of the pack. Check that the "Best Before" and "Date of Manufacture" are clearly printed, not smudged or covered by price stickers.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

