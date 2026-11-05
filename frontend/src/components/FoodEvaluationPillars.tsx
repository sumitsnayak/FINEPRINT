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
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  Layers,
  Cpu
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { UniversalModal } from './UniversalModal';

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
  const [activePillar, setActivePillar] = useState<PillarItem | null>(null);

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

  const handlePillarClick = (pillar: PillarItem) => {
    sounds.playClick();
    setActivePillar(pillar);
  };

  const handleCloseModal = () => {
    sounds.playClick();
    setActivePillar(null);
  };

  const handleAction = (tab: string) => {
    setActivePillar(null);
    if (tab === 'simulator' && onOpenSimulator) {
      onOpenSimulator();
    } else {
      onNavigate(tab);
    }
  };

  return (
    <section className="max-w-6xl mx-auto px-4 relative z-10">
      {/* Section Header (Compact & Clean) */}
      <div className="text-center max-w-lg mx-auto space-y-1 mb-6">
        <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full mac-secondary-btn text-emerald-800 text-[10px] font-black uppercase tracking-wider shadow-xs mb-1">
          <Cpu className="w-3 h-3 text-emerald-600" />
          <span>SCIENTIFIC EVALUATION METHODOLOGY</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          How FINEPRINT Evaluates Food
        </h2>
        <p className="text-xs text-slate-500">
          6 laboratory standards behind every safety rating. Tap any card to inspect the methodology.
        </p>
      </div>

      {/* COMPACT & ATTRACTIVE 6-PILLAR BENTO GRID (Takes minimal space, looks ultra-modern) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-3.5">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          const { iconBg, iconColor, badgeBg, badgeText, borderHover } = pillar.colorScheme;

          return (
            <div
              key={pillar.id}
              onClick={() => handlePillarClick(pillar)}
              className={`glass-card ${borderHover} hover:glass-card-glow rounded-[22px] p-3.5 sm:p-4 transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between group border border-white/80 shadow-xs hover:shadow-md relative overflow-hidden`}
            >
              {/* Top ambient specular highlight */}
              <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />

              <div className="space-y-2 relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-8 h-8 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4 stroke-[2.2]" />
                    </div>
                    <div>
                      <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-emerald-800 transition-colors leading-tight">
                        {pillar.title}
                      </h3>
                      <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${badgeBg} ${badgeText}`}>
                        {pillar.tag}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-emerald-600 transition-colors">
                    #{pillar.number}
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                  {pillar.shortDesc}
                </p>
              </div>

              {/* Bottom micro-pill indicator */}
              <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 group-hover:text-emerald-700 transition-colors relative z-10">
                <span>Tap to View Standard</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* THE PILLAR DETAILS POP-UP MODAL */}
      {activePillar && (
        <UniversalModal
          isOpen={!!activePillar}
          onClose={handleCloseModal}
          title={activePillar.title}
          subtitle={activePillar.details.headline}
          badge={`PILLAR ${activePillar.number} · ${activePillar.details.category}`}
          badgeColor={`${activePillar.colorScheme.badgeBg} ${activePillar.colorScheme.badgeText}`}
          icon={React.createElement(activePillar.icon, { className: 'w-5 h-5 text-emerald-600' })}
          maxWidth="max-w-2xl"
          footer={
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => handleAction(activePillar.details.actionTab)}
                className="w-full sm:w-auto py-2.5 px-5 rounded-2xl apple-pill-btn text-white text-xs font-bold inline-flex items-center justify-center space-x-2 shadow-xs hover:scale-105 active:scale-95 transition-all"
              >
                <span>{activePillar.details.actionText}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={handleCloseModal}
                className="w-full sm:w-auto py-2.5 px-5 rounded-2xl mac-secondary-btn text-slate-700 text-xs font-bold"
              >
                Close Standard
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Algorithm Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <span className="font-extrabold text-slate-900 flex items-center space-x-1.5 text-xs text-emerald-800">
                <Cpu className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                <span>FINEPRINT Laboratory Methodology</span>
              </span>
              <p className="text-slate-600 leading-relaxed text-xs">
                {activePillar.details.algorithm}
              </p>
            </div>

            {/* Regulatory Standard */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center space-x-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span className="text-xs font-semibold text-emerald-900">
                Regulatory Compliance: {activePillar.details.regulatoryStandard}
              </span>
            </div>

            {/* Real World Case Study */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
              <span className="font-extrabold text-amber-900 flex items-center space-x-1.5 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>Real-World Tested Case Study</span>
              </span>
              <div className="space-y-1 text-xs text-slate-700">
                <div>
                  <span className="font-bold text-slate-900">Product Tested: </span>
                  <span>{activePillar.details.caseStudy.product}</span>
                </div>
                <div>
                  <span className="font-bold text-slate-900">Detected Concern: </span>
                  <span className="text-rose-800 font-semibold">{activePillar.details.caseStudy.detectedIssue}</span>
                </div>
                <div className="pt-1 text-emerald-900 font-bold">
                  <span>FINEPRINT Output: </span>
                  <span>{activePillar.details.caseStudy.fineprintVerdict}</span>
                </div>
              </div>
            </div>
          </div>
        </UniversalModal>
      )}
    </section>
  );
};

