import React, { useState } from 'react';
import {
  Eye,
  ArrowRight,
  Zap,
  Sparkles,
  ChevronRight,
  AlertTriangle,
  ShieldCheck,
  Flame,
  Droplets,
  Layers,
  Activity,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Sliders,
  Scan,
  Scale
} from 'lucide-react';
import { UniversalModal } from './UniversalModal';
import { sounds } from '../utils/soundEffects';

interface FoodLabelXRayProps {
  onScanClick: () => void;
}

interface XRayProduct {
  id: string;
  name: string;
  category: string;
  portion: string;
  image: string;
  frontClaim: string;
  frontMarketingBullets: string[];
  realityVerdict: string;
  labScore: number;
  grade: string;
  gradeColor: string;
  satFatGrams: number;
  sodiumMg: number;
  addedSugarGrams: number;
  hotspots: {
    id: string;
    name: string;
    claim: string;
    truth: string;
    penalty: string;
    severity: 'danger' | 'caution' | 'warning';
    amount: string;
    safeLimit: string;
    hazardTags: string[];
    description: string;
  }[];
  cleanAlternative: {
    name: string;
    whyBetter: string;
    score: number;
  };
}

export const FoodLabelXRay: React.FC<FoodLabelXRayProps> = ({ onScanClick }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activeProductId, setActiveProductId] = useState<string>('noodles');
  const [viewMode, setViewMode] = useState<'marketing' | 'xray'>('xray');
  const [activeHotspotId, setActiveHotspotId] = useState<string>('palmoil');

  const products: Record<string, XRayProduct> = {
    noodles: {
      id: 'noodles',
      name: 'Instant Masala Noodles',
      category: 'Packaged Noodles / Snacks',
      portion: '70g Single Pack',
      image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=600&q=80',
      frontClaim: 'Made with 100% Atta / Wheat! Goodness of Iron & Fiber for Growing Kids',
      frontMarketingBullets: [
        '✨ "Wholesome Wheat Power" on front label',
        '✨ "Rich Indian Spices & Vitamins" for taste',
        '✨ "Zero Artificial Colors" commercial claim'
      ],
      realityVerdict: 'Only 22% wheat flour. The cake is deep-fried in 34% palm olein oil with 850mg sodium & INS 635 flavor hacker.',
      labScore: 4.2,
      grade: 'Grade D · High Concern',
      gradeColor: 'text-rose-600 bg-rose-50 border-rose-200',
      satFatGrams: 6.8,
      sodiumMg: 850,
      addedSugarGrams: 3.2,
      hotspots: [
        {
          id: 'palmoil',
          name: 'Refined Palmolein Oil (34% by weight)',
          claim: 'Front Banner: "Wholesome Wheat Power"',
          truth: 'Deep-fried in cheap hydrogenated palm olein packing 6.8g saturated fat in 1 serving.',
          penalty: '-2.0 pts',
          severity: 'danger',
          amount: '6.8g Saturated Fat',
          safeLimit: 'Daily Ceiling: 20g/day (34% reached in 1 bowl)',
          hazardTags: ['#PalmOilLoophole', '#ArteryPlaqueRisk', '#UltraProcessed'],
          description: 'Refined palmolein is chemically extracted palm fat rich in palmitic acid. Ingestion triggers rapid elevation of small-dense LDL particles and visceral fat.'
        },
        {
          id: 'sodium',
          name: 'Sodium Salt Shock (850mg per 70g)',
          claim: 'Front Banner: "Balanced Spice Blend"',
          truth: 'Hides 850mg of sodium—over 42% of an adult WHO maximum daily allowance in a quick snack.',
          penalty: '-1.8 pts',
          severity: 'danger',
          amount: '850mg Sodium',
          safeLimit: 'WHO Ceiling: 2,000mg/day (42% in single portion)',
          hazardTags: ['#HypertensionSpike', '#KidneyStrain', '#WaterRetention'],
          description: 'Excess sodium chloride in ultra-processed matrices blunts microvascular endothelial elasticity within 30 minutes of digestion.'
        },
        {
          id: 'ins635',
          name: 'Disodium 5-Ribonucleotides (INS 635)',
          claim: 'Front Banner: "Authentic Indian Spices"',
          truth: 'Chemical synergy amplifier that multiplies tongue umami receptors by 8x to induce craving and bingeing.',
          penalty: '-1.2 pts',
          severity: 'caution',
          amount: 'Synthetic Nucleotide',
          safeLimit: 'Restricted under Codex Alimentarius',
          hazardTags: ['#ChemicalFlavorHack', '#PalateHijack', '#HyperPalatability'],
          description: 'A synthetic combination of disodium inosinate and disodium guanylate used to mask dull, oxidized flour taste.'
        }
      ],
      cleanAlternative: {
        name: 'Organic Foxtail Millet Noodles (Sun-Dried, Cold-Pressed Oil)',
        whyBetter: 'Sun-dried rather than deep-fried in palm oil. 4x more dietary fiber and 0g hydrogenated industrial fat.',
        score: 9.1
      }
    },
    chips: {
      id: 'chips',
      name: 'Cream & Onion Potato Chips',
      category: 'Crisps & Savory Snacks',
      portion: '50g Snack Bag',
      image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80',
      frontClaim: 'Selected Farm-Fresh Potatoes & Delicate Sour Cream and Herbs',
      frontMarketingBullets: [
        '✨ "100% Farm-Fresh Potatoes" front banner',
        '✨ "Real Cream & Delicate Onion Herbs"',
        '✨ "Finest Himalayan Salt Seasoning"'
      ],
      realityVerdict: 'Re-fried at high temperatures in industrial palm olein with MSG, maltodextrin, and artificial cheese essence.',
      labScore: 3.8,
      grade: 'Grade E · Severe Concern',
      gradeColor: 'text-rose-600 bg-rose-50 border-rose-200',
      satFatGrams: 8.4,
      sodiumMg: 620,
      addedSugarGrams: 4.8,
      hotspots: [
        {
          id: 'palmoil_chips',
          name: 'Thermally Oxidized Palm Olein (36%)',
          claim: 'Front Banner: "Crisped to Perfection"',
          truth: 'Repeatedly heated vegetable oil produces lipid peroxides and acrylamide compounds.',
          penalty: '-2.2 pts',
          severity: 'danger',
          amount: '8.4g Saturated Fat / bag',
          safeLimit: 'Exceeds 40% of daily saturated fat limit',
          hazardTags: ['#ThermalOxidation', '#AcrylamideRisk', '#ArteryClogging'],
          description: 'Industrial batch-frying breaks down natural fatty acids into toxic aldehydes, causing acute systemic gut barrier inflammation.'
        },
        {
          id: 'msg_chips',
          name: 'Monosodium Glutamate & INS 627 (MSG)',
          claim: 'Front Banner: "Natural Cream & Herbs"',
          truth: 'Disguises lack of real dairy cream with synthetic free glutamate chemical flavor crystals.',
          penalty: '-1.5 pts',
          severity: 'caution',
          amount: 'Synthetic Glutamate',
          safeLimit: 'Banned in baby foods & sensitive formulations',
          hazardTags: ['#AppetiteDisregulation', '#DopamineSpike', '#UltraProcessed'],
          description: 'Free glutamate overstimulates hypothalamic hunger neurons, preventing normal leptin satiety signaling.'
        },
        {
          id: 'maltodextrin',
          name: 'Carrier Powder: Maltodextrin (GI 110)',
          claim: 'Front Banner: "Light Crispy Texture"',
          truth: 'Stealth glycemic carbohydrate with higher glycemic impact than pure white table sugar.',
          penalty: '-1.1 pts',
          severity: 'warning',
          amount: 'Glycemic Index: 110 (Pure sugar is 65)',
          safeLimit: 'Triggers instant pancreatic insulin spike',
          hazardTags: ['#InsulinSurge', '#VisceralFat', '#HiddenGlycemicBomb'],
          description: 'A heavily hydrolyzed starch powder used to bind seasoning powders onto greasy chip surfaces.'
        }
      ],
      cleanAlternative: {
        name: 'Air-Popped Fox Nuts (Makhana) with Cold-Pressed Ghee & Rock Salt',
        whyBetter: 'Zero palm oil, roasted instead of fried, rich in natural magnesium, potassium, and zero artificial INS enhancers.',
        score: 9.4
      }
    },
    biscuits: {
      id: 'biscuits',
      name: '"100% Digestive" Whole Wheat Biscuits',
      category: 'Bakery & Tea-Time Cookies',
      portion: '100g Pack (4 Biscuits)',
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80',
      frontClaim: '100% Digestive Whole Wheat Biscuits with Natural Dietary Fiber',
      frontMarketingBullets: [
        '✨ "100% Whole Wheat & Fiber" front banner',
        '✨ "Recommended for Tea Time & Digestion"',
        '✨ "Goodness of Natural Golden Grains"'
      ],
      realityVerdict: 'First ingredient is Refined Maida (68%), followed by 22% Invert Sugar Syrup and bakery vanaspati shortening.',
      labScore: 4.8,
      grade: 'Grade C · Deceptive Health Claim',
      gradeColor: 'text-amber-600 bg-amber-50 border-amber-200',
      satFatGrams: 5.6,
      sodiumMg: 410,
      addedSugarGrams: 24.0,
      hotspots: [
        {
          id: 'maida_disguise',
          name: 'Refined Maida Disguise (68% of Flour)',
          claim: 'Front Banner: "100% Whole Wheat"',
          truth: 'Whole wheat flour is only 8%. The bulk is refined maida with bran and wheat germ removed.',
          penalty: '-2.0 pts',
          severity: 'danger',
          amount: 'Only 3.8g real fiber / 100g',
          safeLimit: 'Less than 15% of true whole-grain threshold',
          hazardTags: ['#MaidaLoophole', '#FiberFaking', '#BloodSugarCrash'],
          description: 'Brands use caramel color (INS 150d) to tint refined white maida into a wholesome brown whole-wheat illusion.'
        },
        {
          id: 'invert_sugar',
          name: 'Invert Sugar Syrup & Liquid Glucose',
          claim: 'Front Banner: "Healthy Daily Nutrition"',
          truth: 'Pack delivers 24g of free sugar—matching your entire recommended maximum daily intake in 4 biscuits.',
          penalty: '-1.8 pts',
          severity: 'danger',
          amount: '24g Free Sugars / 100g',
          safeLimit: 'ICMR-NIN Max: 25g/day (Nearly 100% consumed)',
          hazardTags: ['#StealthSugar', '#FattyLiverRisk', '#GlycemicSpike'],
          description: 'Invert sugar is broken down into 50% free fructose, which metabolizes directly in the liver into triglycerides.'
        },
        {
          id: 'ins503',
          name: 'Chemical Raising Agent (INS 503ii)',
          claim: 'Front Banner: "Crispy Oven Baked"',
          truth: 'Ammonium bicarbonate releases gaseous ammonia during baking to create artificial airy crunch.',
          penalty: '-0.8 pts',
          severity: 'caution',
          amount: 'Synthetic Leavening Chemical',
          safeLimit: 'Restricted industrial baking chemical',
          hazardTags: ['#SyntheticBakingChemical', '#MicrobiomeAlteration'],
          description: 'Cheap commercial chemical replacement for traditional slow fermentation yeast or sourdough starters.'
        }
      ],
      cleanAlternative: {
        name: '100% Sprouted Ragi & Jowar Millet Cookies (Zero Palm Oil, Sweetened with Raw Jaggery)',
        whyBetter: 'Real whole grains with genuine 12g dietary fiber, cold-pressed coconut oil, zero maida, and zero artificial INS chemicals.',
        score: 8.9
      }
    }
  };

  const currentProduct = products[activeProductId] || products.noodles;
  const activeHotspot =
    currentProduct.hotspots.find((h) => h.id === activeHotspotId) || currentProduct.hotspots[0];

  const handleOpenModal = (productId: string = 'noodles', hotspotId?: string) => {
    sounds.playClick();
    setActiveProductId(productId);
    if (hotspotId) {
      setActiveHotspotId(hotspotId);
    } else {
      setActiveHotspotId(products[productId].hotspots[0].id);
    }
    setIsModalOpen(true);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-4 relative z-10">
      {/* STYLISH NEW-GEN FORENSIC FOOD X-RAY TEASER CARD ON LANDING PAGE */}
      <div className="glass-card hover:glass-card-glow rounded-[28px] p-5 sm:p-7 border border-white/95 shadow-md relative overflow-hidden transition-all duration-300">
        {/* Subtle Specular Sheen */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          {/* Left: Title & Forensic Badge */}
          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full mac-secondary-btn text-rose-800 text-[10px] font-black uppercase tracking-wider shadow-xs">
              <Zap className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span>FORENSIC FOOD DECEPTION DETECTOR · LAB X-RAY</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              The Packaged Food X-Ray: Marketing vs Reality
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Front packaging claims vs what brands hide in the fine print. See how 34% palm olein, 850mg sodium, and synthetic flavour enhancers masquerade behind healthy labels.
            </p>

            {/* Quick Product Switcher Chips on Landing Page */}
            <div className="flex items-center space-x-2 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inspect:</span>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setActiveProductId('noodles');
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeProductId === 'noodles'
                    ? 'bg-rose-100 text-rose-900 border border-rose-300 shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🍜 Masala Noodles
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setActiveProductId('chips');
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeProductId === 'chips'
                    ? 'bg-rose-100 text-rose-900 border border-rose-300 shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🥔 Potato Chips
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setActiveProductId('biscuits');
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeProductId === 'biscuits'
                    ? 'bg-rose-100 text-rose-900 border border-rose-300 shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🍪 Digestive Biscuits
              </button>
            </div>
          </div>

          {/* Center/Right: Stylish Real Food Card with Contrast Meter & Open Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Visual Real Food Preview Card */}
            <div
              onClick={() => handleOpenModal(activeProductId)}
              className="group flex items-center space-x-3.5 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all cursor-pointer hover:border-rose-300 relative overflow-hidden"
            >
              {/* Real Food Image Thumbnail with Glow Badge */}
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-inner">
                <img
                  src={currentProduct.image}
                  alt={currentProduct.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-rose-600 text-white font-mono font-black text-[9px] shadow-xs">
                  {currentProduct.labScore}/10
                </span>
              </div>

              {/* Text Highlights */}
              <div className="space-y-1 min-w-[190px]">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-black text-rose-700 uppercase tracking-wider">
                    {currentProduct.grade}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm line-clamp-1 group-hover:text-rose-700 transition-colors">
                  {currentProduct.name}
                </h4>
                <div className="text-[11px] text-slate-500 font-medium line-clamp-1">
                  Claim: <span className="line-through text-slate-400">100% Healthy</span> ➔{' '}
                  <strong className="text-rose-600">{currentProduct.hotspots[0].name.split('(')[0]}</strong>
                </div>
              </div>
            </div>

            {/* Prominent "Open Food X-Ray Lab" Button (Changed from Launch to Open) */}
            <button
              type="button"
              onClick={() => handleOpenModal(activeProductId)}
              className="py-3.5 px-6 rounded-2xl apple-pill-btn text-white text-xs font-black flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/25 hover:scale-[1.03] active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Open Food X-Ray Lab</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE NEW-GEN FORENSIC X-RAY LAB POP-UP MODAL */}
      <UniversalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Forensic Food Label X-Ray Lab"
        subtitle="Deconstructing Marketing Claims vs Actual Laboratory Realities"
        badge="DECEPTION DETECTOR 2.0"
        badgeColor="bg-rose-50 text-rose-800 border-rose-200"
        icon={<Zap className="w-5 h-5 text-rose-600" />}
        maxWidth="max-w-4xl"
        footer={
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Don't be fooled by front packaging claims. Inspect any barcode or label in 3 seconds.
            </span>
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                onScanClick();
              }}
              className="w-full sm:w-auto py-2.5 px-6 rounded-2xl apple-pill-btn text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Scan Your Packaged Food Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Top Product Selector Switcher in Modal */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-2 rounded-2xl bg-slate-100 border border-slate-200">
            <div className="flex items-center space-x-1.5 overflow-x-auto">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-2 pr-1 hidden sm:inline">
                Case Study:
              </span>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setActiveProductId('noodles');
                  setActiveHotspotId(products.noodles.hotspots[0].id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeProductId === 'noodles'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200 ring-1 ring-rose-500/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🍜 Masala Noodles
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setActiveProductId('chips');
                  setActiveHotspotId(products.chips.hotspots[0].id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeProductId === 'chips'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200 ring-1 ring-rose-500/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🥔 Potato Chips
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setActiveProductId('biscuits');
                  setActiveHotspotId(products.biscuits.hotspots[0].id);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeProductId === 'biscuits'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200 ring-1 ring-rose-500/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🍪 Digestive Biscuits
              </button>
            </div>

            {/* Mode Capsule Switcher: Marketing Illusion vs Forensic X-Ray */}
            <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 shadow-xs">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setViewMode('marketing');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'marketing'
                    ? 'bg-amber-100 text-amber-900 shadow-xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                ✨ Front Marketing
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setViewMode('xray');
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  viewMode === 'xray'
                    ? 'bg-rose-600 text-white shadow-xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>⚠️ Forensic X-Ray</span>
              </button>
            </div>
          </div>

          {/* Interactive Forensic Hero Visual Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column (5 Cols): Real Food Photo with Scan Hologram & Live Score */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div
                className={`relative w-full rounded-3xl overflow-hidden border transition-all duration-300 shadow-xl ${
                  viewMode === 'marketing'
                    ? 'border-amber-300 bg-gradient-to-b from-amber-500/10 to-amber-50'
                    : 'border-rose-400 bg-slate-950 text-white'
                }`}
              >
                {/* Real Food Image Header */}
                <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                  <img
                    src={currentProduct.image}
                    alt={currentProduct.name}
                    loading="lazy"
                    decoding="async"
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      viewMode === 'xray' ? 'filter contrast-125 saturate-150' : 'filter brightness-105'
                    }`}
                  />
                  <div
                    className={`absolute inset-0 ${
                      viewMode === 'marketing'
                        ? 'bg-gradient-to-t from-white via-transparent to-black/20'
                        : 'bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/50'
                    }`}
                  />

                  {/* Forensic Scan Laser Beam (Active in X-Ray mode) */}
                  {viewMode === 'xray' && (
                    <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_15px_#f43f5e] animate-pulse top-1/2 pointer-events-none" />
                  )}

                  {/* Top Floating Badge */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ${
                        viewMode === 'marketing' ? 'bg-white/90 text-amber-900' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {viewMode === 'marketing' ? '✨ Front Packaging' : '🔬 Laboratory Forensic Scan'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white font-mono text-[10px] font-bold">
                      {currentProduct.portion}
                    </span>
                  </div>

                  {/* Score Indicator Overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <h4
                        className={`text-lg font-black tracking-tight drop-shadow-md ${
                          viewMode === 'marketing' ? 'text-slate-900' : 'text-white'
                        }`}
                      >
                        {currentProduct.name}
                      </h4>
                      <span
                        className={`text-[11px] font-semibold ${
                          viewMode === 'marketing' ? 'text-amber-800' : 'text-rose-400'
                        }`}
                      >
                        {currentProduct.category}
                      </span>
                    </div>

                    <div
                      className={`px-3 py-1 rounded-2xl flex items-center space-x-1.5 shadow-md ${
                        viewMode === 'marketing'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-rose-600 text-white shadow-rose-600/30'
                      }`}
                    >
                      <span className="text-sm font-black font-mono">
                        {viewMode === 'marketing' ? '10 / 10' : `${currentProduct.labScore} / 10`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Body: Illusion vs Reality Details */}
                <div
                  className={`p-4 sm:p-5 space-y-3 ${
                    viewMode === 'marketing' ? 'bg-white text-slate-900' : 'bg-slate-900/90 text-slate-100'
                  }`}
                >
                  {viewMode === 'marketing' ? (
                    <div className="space-y-2 animate-in fade-in duration-200">
                      <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                          Front Packaging Marketing Pitch:
                        </span>
                        <p className="text-xs font-bold text-slate-800 italic">"{currentProduct.frontClaim}"</p>
                      </div>

                      <div className="space-y-1 text-xs text-slate-600">
                        {currentProduct.frontMarketingBullets.map((bullet, idx) => (
                          <div key={idx} className="flex items-center space-x-1.5">
                            <span>{bullet}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 animate-in fade-in duration-200">
                      <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-800/60 space-y-1">
                        <div className="flex items-center space-x-1.5 text-rose-400 text-xs font-black">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Forensic Lab Verdict:</span>
                        </div>
                        <p className="text-xs text-rose-200 leading-relaxed font-medium">
                          {currentProduct.realityVerdict}
                        </p>
                      </div>

                      {/* Chemical Penalty Meter Bar */}
                      <div className="space-y-1.5 text-[11px]">
                        <div className="flex justify-between items-center text-slate-400 font-mono">
                          <span>Saturated Fat (6.8g):</span>
                          <span className="text-rose-400 font-bold">34% of Day's Cap</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500 rounded-full w-[34%]" />
                        </div>

                        <div className="flex justify-between items-center text-slate-400 font-mono pt-1">
                          <span>Sodium Content (850mg):</span>
                          <span className="text-rose-400 font-bold">42% of Day's Cap</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-rose-500 rounded-full w-[42%]" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column (7 Cols): New-Style Interactive Chemical Dossier */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
                  <Scan className="w-3.5 h-3.5 text-rose-600" />
                  <span>Tap Any Chemical Deception to Inspect Evidence:</span>
                </span>
                <span className="text-[10px] font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                  {currentProduct.hotspots.length} Violations
                </span>
              </div>

              {/* Chemical Hotspots List */}
              <div className="space-y-2.5">
                {currentProduct.hotspots.map((hotspot, idx) => {
                  const isSelected = activeHotspotId === hotspot.id;
                  return (
                    <div
                      key={hotspot.id}
                      onClick={() => {
                        sounds.playClick();
                        setActiveHotspotId(hotspot.id);
                      }}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-rose-50/90 border-rose-400 ring-2 ring-rose-500/20 shadow-md'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-black text-xs ${
                              isSelected ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            0{idx + 1}
                          </div>
                          <div>
                            <h5 className="font-extrabold text-slate-900 text-sm">{hotspot.name}</h5>
                            <span className="text-[11px] text-slate-500">{hotspot.claim}</span>
                          </div>
                        </div>

                        <span className="text-xs font-mono font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded-md border border-rose-200">
                          {hotspot.penalty}
                        </span>
                      </div>

                      {/* Expanded Evidence Dossier */}
                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-rose-200/80 space-y-2.5 text-xs animate-in fade-in duration-200">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                            <div className="p-2.5 rounded-xl bg-white border border-rose-200 space-y-0.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">
                                Measured Lab Quantity:
                              </span>
                              <p className="font-black text-slate-900">{hotspot.amount}</p>
                            </div>

                            <div className="p-2.5 rounded-xl bg-white border border-rose-200 space-y-0.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase">
                                Regulatory Safety Ceiling:
                              </span>
                              <p className="font-bold text-rose-700">{hotspot.safeLimit}</p>
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-rose-100/70 border border-rose-200 space-y-1 text-rose-950">
                            <span className="font-black flex items-center space-x-1 text-xs">
                              <span>💥 The Forensic Reality:</span>
                            </span>
                            <p className="leading-relaxed text-xs">{hotspot.truth}</p>
                            <p className="text-[11px] text-slate-600 pt-1 leading-normal">
                              {hotspot.description}
                            </p>

                            <div className="flex flex-wrap gap-1.5 pt-2 text-[10px] font-mono">
                              {hotspot.hazardTags.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-2 py-0.5 rounded-md bg-white text-rose-800 font-bold border border-rose-200"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Verified Clean Swap Alternative Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-emerald-900 font-extrabold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verified Clean Alternative Swap:</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-mono font-black text-[10px]">
                    Score: {currentProduct.cleanAlternative.score}/10
                  </span>
                </div>
                <h5 className="font-black text-slate-900 text-sm">
                  {currentProduct.cleanAlternative.name}
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {currentProduct.cleanAlternative.whyBetter}
                </p>
              </div>
            </div>
          </div>
        </div>
      </UniversalModal>
    </section>
  );
};
