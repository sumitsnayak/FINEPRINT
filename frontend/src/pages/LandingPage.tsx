import React, { useState } from 'react';
import { FoodLabelXRay } from '../components/FoodLabelXRay';
import { InteractiveSafetySimulator } from '../components/InteractiveSafetySimulator';
import { FrontPageBarcodeScanner } from '../components/FrontPageBarcodeScanner';
import { FoodScanResultModal } from '../components/FoodScanResultModal';
import { FoodSafetyArticles } from '../components/FoodSafetyArticles';
import { DailyHealthAdoptionGuide } from '../components/DailyHealthAdoptionGuide';
import { FoodEvaluationPillars } from '../components/FoodEvaluationPillars';
import { ConsumerComplaintZone } from '../components/ConsumerComplaintZone';
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

      {/* Daily Health & Nutrition Requirements Intake Adoption Guide */}
      <DailyHealthAdoptionGuide />

      {/* Interactive Food Label X-Ray */}
      <section className="max-w-5xl mx-auto px-4 relative z-10">
        <FoodLabelXRay onScanClick={() => onNavigate('scanner')} />
      </section>

      {/* Interactive Food Safety Simulator (Compact Bar + Pop-Up Modal) */}
      <section className="max-w-5xl mx-auto px-4 relative z-10">
        <InteractiveSafetySimulator />
      </section>

      {/* Core Safety Pillars - Compact Bento Cards with Interactive Pop-Up */}
      <FoodEvaluationPillars onNavigate={onNavigate} />

      {/* Consumer Grievance Zone - How to Complaint from this App */}
      <ConsumerComplaintZone onNavigate={onNavigate} />

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
