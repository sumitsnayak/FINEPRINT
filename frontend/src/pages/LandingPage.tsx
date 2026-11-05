import React, { useState } from 'react';
import {
  Scan,
  ShieldCheck,
  Scale,
  Sparkles,
  CheckCircle2,
  FileSearch,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { FoodLabelXRay } from '../components/FoodLabelXRay';
import { InteractiveSafetySimulator } from '../components/InteractiveSafetySimulator';
import { FrontPageBarcodeScanner } from '../components/FrontPageBarcodeScanner';
import { FoodScanResultModal } from '../components/FoodScanResultModal';
import { FoodSafetyArticles } from '../components/FoodSafetyArticles';
import { sounds } from '../utils/soundEffects';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
  onSelectProduct?: (productId: number) => void;
  onAnalyzeText?: (text: string) => void;
  onOpenLogModal?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigate,
  onSelectProduct = () => {},
  onAnalyzeText = () => {},
}) => {
  const [popupResult, setPopupResult] = useState<any | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState<boolean>(false);

  const handleScanResult = (result: any) => {
    setPopupResult(result);
    setIsPopupOpen(true);
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 animate-in fade-in duration-300 relative overflow-hidden">
      {/* Ambient macOS Glass Glow Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-emerald-400/20 via-teal-300/15 to-emerald-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[45%] right-[-120px] w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-6 sm:pt-10 max-w-4xl mx-auto px-4 text-center">
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full mac-secondary-btn border-emerald-500/30 text-emerald-800 text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <span className="font-extrabold text-emerald-900">FINEPRINT</span>
            <span>·</span>
            <span className="text-slate-500 font-semibold">Food Safety Standards</span>
          </div>

          {/* Headline */}
          <div className="space-y-2 max-w-2xl mx-auto">
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Scan Any Food Barcode. <br />
              <span className="text-emerald-600 drop-shadow-[0_0_20px_rgba(16,185,129,0.25)]">
                Instant Safety Verdict.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-500 max-w-md mx-auto">
              Scan barcode or food label to see if it's safe (Green), average (Yellow), or high concern (Red).
            </p>
          </div>

          {/* Front Page Barcode & Food Scanner */}
          <div className="pt-2">
            <FrontPageBarcodeScanner onScanResult={handleScanResult} />
          </div>

          {/* Clean Minimal Chips */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3 text-xs font-semibold text-slate-600">
            <span className="flex items-center space-x-1.5 mac-secondary-btn px-3 py-1 rounded-full text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Green: Safe</span>
            </span>
            <span className="flex items-center space-x-1.5 mac-secondary-btn px-3 py-1 rounded-full text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>Yellow: Average</span>
            </span>
            <span className="flex items-center space-x-1.5 mac-secondary-btn px-3 py-1 rounded-full text-xs">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span>Red: High Concern</span>
            </span>
          </div>
        </div>
      </section>

      {/* Eye-Catching New-Gen Food Safety Editorial Section */}
      <FoodSafetyArticles />

      {/* Interactive Food Label X-Ray */}
      <section className="max-w-5xl mx-auto px-4 relative z-10">
        <FoodLabelXRay onScanClick={() => onNavigate('scanner')} />
      </section>

      {/* Interactive Food Safety Simulator */}
      <section className="max-w-5xl mx-auto px-4 relative z-10">
        <InteractiveSafetySimulator />
      </section>

      {/* Core Safety Pillars - macOS Glass Cards */}
      <section className="max-w-6xl mx-auto px-4 relative z-10">
        <div className="text-center max-w-lg mx-auto space-y-1 mb-8">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            How FINEPRINT Evaluates Food
          </h2>
          <p className="text-xs text-slate-500">
            Laboratory standards behind every packaged food rating.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card hover:glass-card-glow rounded-[26px] p-5 space-y-2 transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center font-bold shadow-xs">
              <Scan className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Instant Label OCR</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Extracts and verifies ingredients, allergens, and additives from back-of-pack labels.
            </p>
          </div>

          <div className="glass-card hover:glass-card-glow rounded-[26px] p-5 space-y-2 transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Dual-Vector Rating (0–10)</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              45% Regulatory Food Safety (FSSAI additive caps) + 55% Nutritional Quality.
            </p>
          </div>

          <div className="glass-card hover:glass-card-glow rounded-[26px] p-5 space-y-2 transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center font-bold shadow-xs">
              <FileSearch className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Chemical Additive Decoder</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Translates INS numbers (preservatives, colors, emulsifiers) into plain English.
            </p>
          </div>

          <div className="glass-card hover:glass-card-glow rounded-[26px] p-5 space-y-2 transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/15 text-blue-700 flex items-center justify-center font-bold shadow-xs">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Side-by-Side Comparison</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Compare 2 products to spot fewer chemical additives and cleaner ingredients.
            </p>
          </div>

          <div className="glass-card hover:glass-card-glow rounded-[26px] p-5 space-y-2 transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Clean Alternatives</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Discovers verified swaps with zero artificial preservatives or trans-fats.
            </p>
          </div>

          <div className="glass-card hover:glass-card-glow rounded-[26px] p-5 space-y-2 transition-all hover:-translate-y-1">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/15 text-rose-700 flex items-center justify-center font-bold shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Consumer Grievance</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Log reports for expired products, missing dates, or misleading claims.
            </p>
          </div>
        </div>
      </section>

      {/* The Glossy Food Scan Result Popup Modal (Green / Yellow / Red) */}
      <FoodScanResultModal
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        result={popupResult}
        onViewDetails={(productId) => {
          setIsPopupOpen(false);
          onSelectProduct(productId);
        }}
        onViewAlternatives={() => {
          setIsPopupOpen(false);
          onNavigate('alternatives');
        }}
      />
    </div>
  );
};
