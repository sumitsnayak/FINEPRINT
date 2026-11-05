import React, { useState } from 'react';
import {
  Scan,
  ShieldCheck,
  FileSearch,
  Scale,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  Layers
} from 'lucide-react';
import { UniversalModal } from './UniversalModal';
import { sounds } from '../utils/soundEffects';

interface PillarItem {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  tag: string;
  icon: any;
  colorScheme: {
    iconBg: string;
    iconColor: string;
    badgeBg: string;
    badgeText: string;
    borderHover: string;
    pillBg: string;
  };
  details: {
    category: string;
    headline: string;
    algorithm: string;
    regulatoryStandard: string;
    caseStudy: {
      product: string;
      detectedIssue: string;
      fineprintVerdict: string;
    };
    actionText: string;
    actionTab: string;
  };
}

interface FoodEvaluationPillarsProps {
  onNavigate: (tab: string) => void;
  onOpenSimulator?: () => void;
}

export const FoodEvaluationPillars: React.FC<FoodEvaluationPillarsProps> = ({
  onNavigate,
  onOpenSimulator
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [activePillarIndex, setActivePillarIndex] = useState<number>(0);

  const pillars: PillarItem[] = [
    {
      id: 'ocr',
      number: '01',
      title: 'Instant Label OCR',
      shortDesc: 'Extracts ingredients, allergens & micro-print additives from back-of-pack labels.',
      tag: 'VISION OCR',
      icon: Scan,
      colorScheme: {
        iconBg: 'bg-emerald-500/15',
        iconColor: 'text-emerald-700',
        badgeBg: 'bg-emerald-50 border-emerald-200',
        badgeText: 'text-emerald-800',
        borderHover: 'hover:border-emerald-500/40',
        pillBg: 'bg-emerald-600',
      },
      details: {
        category: 'OPTICAL COMPUTER VISION & PARSING',
        headline: 'Automated Extraction of Hidden Fine Print',
        algorithm:
          'High-speed neural OCR trained specifically on Indian packaged food typography. Detects micro-print text (< 1mm) frequently used on back panels to obscure hydrogenated vegetable oils and chemical sweeteners.',
        regulatoryStandard: 'Complies with FSSAI (Packaging & Labelling) Regulation 2020 minimum font size mandates.',
        caseStudy: {
          product: 'Multi-Grain "Pure Butter" Cookies',
          detectedIssue: 'Front claimed "Pure Butter", but back label fine print listed 82% Palm Olein with only 1.2% butter.',
          fineprintVerdict: 'Flagged as Misleading Claims (Section 24, FSS Act) with immediate Red Alert.',
        },
        actionText: 'Try Live Label Scanner',
        actionTab: 'scanner',
      },
    },
    {
      id: 'rating',
      number: '02',
      title: 'Dual-Vector Rating (0–10)',
      shortDesc: '45% FSSAI Regulatory Safety caps + 55% Nutritional Quality balance.',
      tag: 'DUAL ENGINE',
      icon: ShieldCheck,
      colorScheme: {
        iconBg: 'bg-teal-500/15',
        iconColor: 'text-teal-700',
        badgeBg: 'bg-teal-50 border-teal-200',
        badgeText: 'text-teal-800',
        borderHover: 'hover:border-teal-500/40',
        pillBg: 'bg-teal-600',
      },
      details: {
        category: 'SCIENTIFIC SCORING FORMULA',
        headline: 'Dual-Vector Mathematical Safety Matrix',
        algorithm:
          'Vector 1 calculates regulatory safety violations (banned azo dyes, heavy metal limits, trans-fat thresholds). Vector 2 evaluates nutritional density (protein-to-carb ratio, added sugars, dietary fiber, sodium per 100g).',
        regulatoryStandard: 'ICMR-NIN 2024 Dietary Guidelines & WHO Maximum Tolerable Nutrient Intake limits.',
        caseStudy: {
          product: 'Packaged Breakfast Energy Bar',
          detectedIssue: 'Advertised as "High Protein", but contained 34g of Maltodextrin and Liquid Invert Sugar per 100g.',
          fineprintVerdict: 'Score penalized from 8.5 down to 3.8 (Grade D - High Sugar Spike Risk).',
        },
        actionText: 'Explore Rated Food Catalog',
        actionTab: 'products',
      },
    },
    {
      id: 'decoder',
      number: '03',
      title: 'Additive INS Decoder',
      shortDesc: 'Translates 450+ cryptic INS numbers into plain English safety verdicts.',
      tag: '450+ INS CODES',
      icon: FileSearch,
      colorScheme: {
        iconBg: 'bg-amber-500/15',
        iconColor: 'text-amber-700',
        badgeBg: 'bg-amber-50 border-amber-200',
        badgeText: 'text-amber-800',
        borderHover: 'hover:border-amber-500/40',
        pillBg: 'bg-amber-600',
      },
      details: {
        category: 'CHEMICAL TOXICOLOGY DATABASE',
        headline: 'Decoding International Numbering Codes',
        algorithm:
          'Cross-references 450+ INS numbers (preservatives, stabilizers, artificial colors, bleaching agents). Maps each chemical to peer-reviewed toxicological studies and international regulatory bans.',
        regulatoryStandard: 'Codex Alimentarius & FSSAI Table 3 Permitted Food Additives list.',
        caseStudy: {
          product: 'Bright Yellow Lemon Namkeen',
          detectedIssue: 'Contained Tartrazine (INS 102) above 80 ppm without mandatory packaging label allergen notice.',
          fineprintVerdict: 'Decoded as Azo Dye Allergen known to trigger hyperactivity and asthma in sensitive children.',
        },
        actionText: 'Open Additives Simulator',
        actionTab: 'simulator',
      },
    },
    {
      id: 'compare',
      number: '04',
      title: 'Side-by-Side Comparison',
      shortDesc: 'Compare 2 packaged foods to spot hidden sugars and chemical differences.',
      tag: 'DELTA ENGINE',
      icon: Scale,
      colorScheme: {
        iconBg: 'bg-blue-500/15',
        iconColor: 'text-blue-700',
        badgeBg: 'bg-blue-50 border-blue-200',
        badgeText: 'text-blue-800',
        borderHover: 'hover:border-blue-500/40',
        pillBg: 'bg-blue-600',
      },
      details: {
        category: 'DIFFERENTIAL COMPARISON MATRIX',
        headline: 'Instant Supermarket A/B Decision Making',
        algorithm:
          'Computes exact deltas across 12 nutritional and chemical parameters between two competing brands in the same aisle, highlighting which brand uses cleaner fats and zero artificial additives.',
        regulatoryStandard: 'Standardized per 100g / 100ml reference serving for fair scientific comparison.',
        caseStudy: {
          product: 'Brand A Peanut Butter vs. Brand B',
          detectedIssue: 'Brand B added 18g refined sugar and hydrogenated palm oil. Brand A contained 100% roasted peanuts.',
          fineprintVerdict: 'Brand A scored 9.4 (Grade A Clean); Brand B scored 4.2 (Grade C Palm Fat Warning).',
        },
        actionText: 'Compare Two Products Now',
        actionTab: 'compare',
      },
    },
    {
      id: 'alternatives',
      number: '05',
      title: 'Clean Alternatives',
      shortDesc: 'Discovers verified clean swaps with zero artificial preservatives or palm oil.',
      tag: 'NOVA-4 FREE',
      icon: Sparkles,
      colorScheme: {
        iconBg: 'bg-purple-500/15',
        iconColor: 'text-purple-700',
        badgeBg: 'bg-purple-50 border-purple-200',
        badgeText: 'text-purple-800',
        borderHover: 'hover:border-purple-500/40',
        pillBg: 'bg-purple-600',
      },
      details: {
        category: 'CLEAN FOOD RECOMMENDATION ENGINE',
        headline: 'NOVA-4 Ultra-Processed Replacements',
        algorithm:
          'Identifies clean, real-food replacements in the same culinary and budget category that eliminate industrial palm olein, TBHQ preservatives, and artificial emulsifiers that erode gut health.',
        regulatoryStandard: 'Prioritizes minimally processed whole foods (NOVA Class 1 & 2).',
        caseStudy: {
          product: 'Deep-Fried Instant Noodles',
          detectedIssue: 'Ultra-processed noodles deep-fried in palm oil with INS 621 MSG and 1,280mg sodium.',
          fineprintVerdict: 'Recommended Clean Swap: Steamed Foxtail Millet Noodles with cold-pressed sesame oil.',
        },
        actionText: 'Explore Healthier Alternatives',
        actionTab: 'alternatives',
      },
    },
    {
      id: 'grievance',
      number: '06',
      title: 'Consumer Grievance',
      shortDesc: 'Log reports for expired products, missing licenses, or misleading claims.',
      tag: 'FSS ACT 2006',
      icon: ShieldAlert,
      colorScheme: {
        iconBg: 'bg-rose-500/15',
        iconColor: 'text-rose-700',
        badgeBg: 'bg-rose-50 border-rose-200',
        badgeText: 'text-rose-800',
        borderHover: 'hover:border-rose-500/40',
        pillBg: 'bg-rose-600',
      },
      details: {
        category: 'LEGAL PROTECTIONS & COMPLAINT FILING',
        headline: 'Direct Consumer Redressal Dossier',
        algorithm:
          'Structures consumer photographic evidence into formal grievance dockets formatted for immediate filing with the National Consumer Helpline (1915) and FSSAI FoSCoS portal.',
        regulatoryStandard: 'Section 23, 24, 31 & 51 of Food Safety & Standards Act 2006 & Legal Metrology Rules 2011.',
        caseStudy: {
          product: 'Expired Infant Food Sold at Supermarket',
          detectedIssue: 'Manufacturing and expiry date stamp was intentionally wiped off with chemical solvent.',
          fineprintVerdict: 'Consumer complaint docket generated with Reference ID FP-2026-092 for NCH escalation.',
        },
        actionText: 'File a Complaint Now',
        actionTab: 'report',
      },
    },
  ];

  const handleOpenModal = (index: number = 0) => {
    sounds.playClick();
    setActivePillarIndex(index);
    setIsModalOpen(true);
  };

  const handleAction = (tab: string) => {
    setIsModalOpen(false);
    if (tab === 'simulator' && onOpenSimulator) {
      onOpenSimulator();
    } else {
      onNavigate(tab);
    }
  };

  const currentPillar = pillars[activePillarIndex] || pillars[0];
  const CurrentIcon = currentPillar.icon;

  return (
    <section className="max-w-6xl mx-auto px-4 py-4 relative z-10">
      {/* COMPACT & SHORT EVALUATION TEASER CARD (Matches other compact sections) */}
      <div className="glass-card hover:glass-card-glow rounded-[28px] p-5 sm:p-6 border border-white/90 shadow-md relative overflow-hidden transition-all duration-300">
        {/* Specular sheen */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          {/* Left Title & Summary */}
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full mac-secondary-btn text-emerald-800 text-[10px] font-black uppercase tracking-wider shadow-xs">
              <Cpu className="w-3.5 h-3.5 text-emerald-600" />
              <span>SCIENTIFIC STANDARDS · DUAL ENGINE MATRIX</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              How FINEPRINT Evaluates Food
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              6 laboratory standards behind every safety rating—from neural label OCR to dual-vector math, toxicological INS decoding, and clean supermarket swaps.
            </p>
          </div>

          {/* Center/Right 6 Quick Pills & View Details Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] font-bold text-slate-700">
              {pillars.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleOpenModal(idx)}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 text-slate-700 hover:text-emerald-900 flex items-center space-x-1.5 transition-all shadow-xs text-left cursor-pointer"
                >
                  <span className="text-[10px] font-mono font-black text-emerald-600">#{p.number}</span>
                  <span className="truncate">{p.title}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => handleOpenModal(0)}
              className="py-3 px-5 rounded-2xl apple-pill-btn text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer"
            >
              <span>Explore All 6 Scientific Standards (See Details)</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE 6-PILLAR LABORATORY STANDARDS POP-UP MODAL */}
      <UniversalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Scientific Food Evaluation Standards"
        subtitle="The 6 Laboratory Methodologies Behind Every FINEPRINT Rating"
        badge="LABORATORY METHODOLOGY DOSSIER"
        icon={<Cpu className="w-5 h-5 text-emerald-600" />}
        maxWidth="max-w-4xl"
        footer={
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => handleAction(currentPillar.details.actionTab)}
              className="w-full sm:w-auto py-2.5 px-6 rounded-2xl apple-pill-btn text-white text-xs font-bold inline-flex items-center justify-center space-x-2 shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>{currentPillar.details.actionText}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-full sm:w-auto py-2.5 px-5 rounded-2xl mac-secondary-btn text-slate-700 text-xs font-bold cursor-pointer"
            >
              Close Standards
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          {/* Pillar Selector Pills */}
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              const isSelected = activePillarIndex === idx;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    setActivePillarIndex(idx);
                  }}
                  className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80 ring-1 ring-emerald-500/20'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span className="truncate">{pillar.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Pillar Detail View */}
          <div className="p-5 sm:p-6 rounded-[28px] bg-slate-50 border border-slate-200/90 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/70 pb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-11 h-11 rounded-2xl ${currentPillar.colorScheme.iconBg} ${currentPillar.colorScheme.iconColor} flex items-center justify-center flex-shrink-0 shadow-xs`}>
                  <CurrentIcon className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.2 rounded text-[9px] font-mono font-bold border ${currentPillar.colorScheme.badgeBg} ${currentPillar.colorScheme.badgeText}`}>
                      PILLAR #{currentPillar.number} · {currentPillar.tag}
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-slate-900 leading-tight mt-0.5">
                    {currentPillar.title}
                  </h4>
                  <p className="text-xs text-emerald-700 font-semibold">
                    {currentPillar.details.headline}
                  </p>
                </div>
              </div>
            </div>

            {/* Methodology & Regulatory Compliance */}
            <div className="space-y-3.5 text-xs text-slate-700">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/80 space-y-1.5 shadow-xs">
                <span className="font-extrabold text-slate-900 flex items-center space-x-1.5 text-xs text-emerald-800">
                  <Cpu className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>FINEPRINT Laboratory Methodology</span>
                </span>
                <p className="text-slate-600 leading-relaxed text-xs">
                  {currentPillar.details.algorithm}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center space-x-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span className="text-xs font-semibold text-emerald-900">
                  Regulatory Compliance Standard: {currentPillar.details.regulatoryStandard}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <span className="font-extrabold text-amber-900 flex items-center space-x-1.5 text-xs">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>Real-World Tested Case Study</span>
                </span>
                <div className="space-y-1 text-xs text-slate-700">
                  <div>
                    <span className="font-bold text-slate-900">Product Tested: </span>
                    <span>{currentPillar.details.caseStudy.product}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">Detected Concern: </span>
                    <span className="text-rose-800 font-semibold">{currentPillar.details.caseStudy.detectedIssue}</span>
                  </div>
                  <div className="pt-1 text-emerald-900 font-bold">
                    <span>FINEPRINT Output: </span>
                    <span>{currentPillar.details.caseStudy.fineprintVerdict}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </UniversalModal>
    </section>
  );
};
