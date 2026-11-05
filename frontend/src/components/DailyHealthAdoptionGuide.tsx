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
  Leaf,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { UniversalModal } from './UniversalModal';
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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
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

  const handleOpenModal = (tab?: 'plate' | 'limits' | 'swaps' | 'rules') => {
    sounds.playClick();
    if (tab) setActiveTab(tab);
    setIsModalOpen(true);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-4 relative z-10">
      {/* COMPACT & ATTRACTIVE TEASER CARD ON LANDING PAGE */}
      <div className="glass-card hover:glass-card-glow rounded-[28px] p-5 sm:p-6 border border-white/90 shadow-md relative overflow-hidden transition-all duration-300">
        {/* Subtle Specular Glow */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          {/* Left Title & Summary */}
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full mac-secondary-btn text-emerald-800 text-[10px] font-black uppercase tracking-wider shadow-xs">
              <Apple className="w-3.5 h-3.5 text-emerald-600" />
              <span>ICMR-NIN 2024 STANDARDS · HEALTH INTAKE BLUEPRINT</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              How to Adopt Good Health & Best Food Intake
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Scientifically balanced nutrition standards by the National Institute of Nutrition (ICMR-NIN).
              Learn the 50% plate ratio, safe daily sugar & sodium thresholds, and clean supermarket swaps.
            </p>
          </div>

          {/* Center/Right 4 Quick Compact Pills & View More Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-700">
              <div
                onClick={() => handleOpenModal('plate')}
                className="p-2.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center space-x-2 cursor-pointer hover:bg-emerald-100/70 transition-colors shadow-xs"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>50% Veggies & Greens</span>
              </div>
              <div
                onClick={() => handleOpenModal('limits')}
                className="p-2.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-center space-x-2 cursor-pointer hover:bg-amber-100/70 transition-colors shadow-xs"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Sugar &lt; 25g/day</span>
              </div>
              <div
                onClick={() => handleOpenModal('limits')}
                className="p-2.5 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-center space-x-2 cursor-pointer hover:bg-blue-100/70 transition-colors shadow-xs"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Sodium &lt; 2000mg</span>
              </div>
              <div
                onClick={() => handleOpenModal('swaps')}
                className="p-2.5 rounded-2xl bg-purple-50/80 border border-purple-200/80 flex items-center space-x-2 cursor-pointer hover:bg-purple-100/70 transition-colors shadow-xs"
              >
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                <span>Clean Swaps</span>
              </div>
            </div>

            {/* Prominent "View More / See Details" Action Button */}
            <button
              type="button"
              onClick={() => handleOpenModal('plate')}
              className="py-3 px-5 rounded-2xl apple-pill-btn text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap"
            >
              <BookOpen className="w-4 h-4" />
              <span>View Full Health Guide (See Details)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE HEALTH ADOPTION GUIDE POP-UP MODAL */}
      <UniversalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Daily Health & Food Intake Adoption Guide"
        subtitle="National Institute of Nutrition (ICMR-NIN 2024) Clinical Guidelines"
        badge="CLINICAL NUTRITION BLUEPRINT"
        icon={<Apple className="w-5 h-5 text-emerald-600" />}
        maxWidth="max-w-4xl"
      >
        <div className="space-y-6">
          {/* Modal Tab Switcher */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveTab('plate');
              }}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                activeTab === 'plate'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🥗 Daily Plate Method
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveTab('limits');
              }}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                activeTab === 'limits'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⚡ Safe Intake Ceilings
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveTab('swaps');
              }}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                activeTab === 'swaps'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🔄 Smart Health Swaps
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveTab('rules');
              }}
              className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all text-center ${
                activeTab === 'rules'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📜 Supermarket Rules
            </button>
          </div>

          {/* TAB 1: DAILY PLATE METHOD */}
          {activeTab === 'plate' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-5 sm:p-6 rounded-[28px] bg-slate-50 border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                      National Institute of Nutrition (ICMR) Formula
                    </span>
                    <h4 className="text-lg font-black text-slate-900">
                      The Ideal "My Plate for the Day"
                    </h4>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                    100% Real Food Ratio
                  </span>
                </div>

                {/* Visual segmented bar */}
                <div className="space-y-2">
                  <div className="h-6 w-full rounded-full overflow-hidden flex shadow-inner border border-slate-200 p-0.5 bg-white">
                    <div
                      className="h-full bg-emerald-500 rounded-l-full flex items-center justify-center text-[10px] font-black text-white px-2"
                      style={{ width: '50%' }}
                    >
                      50% Veg & Fruits
                    </div>
                    <div
                      className="h-full bg-amber-500 flex items-center justify-center text-[10px] font-black text-white px-2"
                      style={{ width: '25%' }}
                    >
                      25% Cereals/Millets
                    </div>
                    <div
                      className="h-full bg-teal-500 flex items-center justify-center text-[10px] font-black text-white px-2"
                      style={{ width: '15%' }}
                    >
                      15% Pulses/Eggs
                    </div>
                    <div
                      className="h-full bg-purple-500 rounded-r-full flex items-center justify-center text-[10px] font-black text-white px-1"
                      style={{ width: '10%' }}
                    >
                      10% Dairy/Nuts
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                    <div className="p-3 rounded-2xl bg-white border border-emerald-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block mr-1.5" />
                      <strong className="text-emerald-900 block">50% Veg & Fruits</strong>
                      <span className="text-[11px] text-slate-500">Min. 400g daily green vegetables & fruits.</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white border border-amber-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block mr-1.5" />
                      <strong className="text-amber-900 block">25% Millets & Whole Grains</strong>
                      <span className="text-[11px] text-slate-500">Jowar, Bajra, Ragi, or Single-polished Rice.</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white border border-teal-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block mr-1.5" />
                      <strong className="text-teal-900 block">15% Pulses & Plant Proteins</strong>
                      <span className="text-[11px] text-slate-500">Sprouted Moong, Chana, Paneer, or Eggs.</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-white border border-purple-200">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block mr-1.5" />
                      <strong className="text-purple-900 block">10% Clean Fats & Nuts</strong>
                      <span className="text-[11px] text-slate-500">Almonds, Walnuts, Seeds, Cold-pressed Oils.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Nutrient Profiles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nutrientCards.map((nc, idx) => {
                  const Icon = nc.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <h5 className="font-bold text-slate-900 text-sm">{nc.title}</h5>
                            <span className="text-[10px] text-slate-400 font-mono">{nc.target}</span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-mono font-bold">
                          {nc.dailyAmount}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600">{nc.why}</p>

                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px] space-y-1">
                        <strong className="text-slate-800 block text-[10px] uppercase font-bold">Top Verified Sources:</strong>
                        <ul className="list-disc list-inside text-slate-600 space-y-0.5">
                          {nc.topSources.map((s, i) => (
                            <li key={i}>{s}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: SAFE INTAKE CEILINGS */}
          {activeTab === 'limits' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1">
                <div className="flex items-center space-x-1.5 text-amber-900 font-black text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Critical Maximum Safe Intake Ceilings (ICMR-NIN 2024 / WHO)</span>
                </div>
                <p className="text-xs text-slate-600">
                  Consuming above these daily thresholds directly increases arterial inflammation, visceral fatty liver, and hypertension.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900">Added Free Sugars</span>
                    <span className="text-xs font-mono font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Max 25g/day (5 tsp)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Includes sucrose, invert sugar, HFCS, maltodextrin, and fruit juice concentrates. Packaged sweets and soft drinks easily exceed 35g in a single portion.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900">Sodium (Salt)</span>
                    <span className="text-xs font-mono font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      Max 2,000mg/day (5g salt)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Indian adults consume an average of 8–10g daily. Packaged namkeens, chips, instant noodles, and ketchups hide large amounts of sodium.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900">Saturated Fat</span>
                    <span className="text-xs font-mono font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      &lt; 8–10% total daily energy
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Keep under 20–22g daily. Avoid products containing hydrogenated palm olein, vanaspati, and re-fried commercial oils.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900">Industrial Trans Fats</span>
                    <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      0.0g (Zero Tolerance)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    FSSAI mandates trans-fat must remain under 2% by weight in fats/oils. Avoid bakery shortening and fried street snacks.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SMART FOOD SWAPS */}
          {activeTab === 'swaps' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {smartSwaps.map((swap) => (
                  <div
                    key={swap.id}
                    className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs flex flex-col justify-between"
                  >
                    <div className="p-3 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-slate-600 uppercase">
                        {swap.category}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Verified Clean Swap
                      </span>
                    </div>

                    <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                      {/* Unhealthy choice */}
                      <div className="p-3 rounded-xl bg-rose-50/80 border border-rose-200/80 space-y-1">
                        <div className="flex items-center space-x-1.5 text-rose-800 font-bold text-xs">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Avoid: {swap.badFood.name}</span>
                        </div>
                        <p className="text-[11px] text-rose-900/80 font-mono">{swap.badFood.culprit}</p>
                        <p className="text-[11px] text-slate-600">{swap.badFood.warning}</p>
                      </div>

                      <div className="flex justify-center -my-1">
                        <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                          <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>

                      {/* Healthy choice */}
                      <div className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-200/80 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center space-x-1.5 text-emerald-900 font-bold text-xs">
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
          )}

          {/* TAB 4: SUPERMARKET RULES */}
          {activeTab === 'rules' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                    01
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm">The Top 3 Ingredients Rule</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    By law, food labels must list ingredients in descending order of weight. The first 3 ingredients represent 70% to 85% of what's inside. If sugar, refined palm oil, or maida appears in the top 3, it is not health food.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                    02
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm">The 5-Ingredient Threshold</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Natural, gut-friendly food has short ingredient lists. When an item has more than 5 multi-syllable chemical ingredients (e.g. INS 471, INS 319, INS 150d), it is classified as Nova-4 Ultra Processed Food.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-xs">
                    03
                  </div>
                  <h5 className="font-bold text-slate-900 text-sm">Verify FSSAI License & Dates</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Always verify the 14-digit FSSAI license number on the back of the pack. Check that the "Best Before" and "Date of Manufacture" are clearly printed, not smudged or covered by price stickers.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </UniversalModal>
    </section>
  );
};
