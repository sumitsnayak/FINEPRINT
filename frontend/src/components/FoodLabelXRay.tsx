import React, { useState } from 'react';
import { Eye, ArrowRight, Zap, Sparkles, ChevronRight, AlertTriangle, ShieldCheck, Flame, Droplets } from 'lucide-react';
import { UniversalModal } from './UniversalModal';
import { sounds } from '../utils/soundEffects';

interface FoodLabelXRayProps {
  onScanClick: () => void;
}

export const FoodLabelXRay: React.FC<FoodLabelXRayProps> = ({ onScanClick }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'marketing' | 'xray'>('xray');
  const [activeHotspot, setActiveHotspot] = useState<string>('palmoil');

  const handleToggle = (mode: 'marketing' | 'xray') => {
    sounds.playClick();
    setViewMode(mode);
  };

  const selectHotspot = (id: string) => {
    sounds.playClick();
    setActiveHotspot(id);
  };

  const handleOpenModal = (hotspotId?: string) => {
    sounds.playClick();
    if (hotspotId) setActiveHotspot(hotspotId);
    setIsModalOpen(true);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-4 relative z-10">
      {/* COMPACT & MODERN NEW-GEN TEASER CARD ON LANDING PAGE */}
      <div className="glass-card hover:glass-card-glow rounded-[28px] p-5 sm:p-6 border border-white/90 shadow-md relative overflow-hidden transition-all duration-300">
        {/* Specular sheen */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative z-10">
          {/* Left Title & Summary */}
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full mac-secondary-btn text-rose-800 text-[10px] font-black uppercase tracking-wider shadow-xs">
              <Zap className="w-3.5 h-3.5 text-rose-600" />
              <span>NEW-GEN DECEPTION DETECTOR · PACKAGED FOOD X-RAY</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              The Packaged Food X-Ray: Marketing vs Fine Print
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              What brands advertise on the front vs what they disguise in the fine print. Tap to inspect how 34% palm olein, synthetic umami, and salt bombs are hidden behind "healthy" claims.
            </p>
          </div>

          {/* Center/Right 3 Quick Comparison Pills & Launch Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex flex-col gap-1.5 text-[11px] font-bold text-slate-700">
              <button
                type="button"
                onClick={() => handleOpenModal('palmoil')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200/80 hover:border-rose-300 text-slate-700 hover:text-rose-900 flex items-center justify-between space-x-2 transition-all shadow-xs text-left cursor-pointer"
              >
                <span>🍜 Claim: "Made with Wheat"</span>
                <span className="text-rose-600 font-mono font-black">➔ 34% Palm Oil (-2.0)</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenModal('ins635')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200/80 hover:border-amber-300 text-slate-700 hover:text-amber-900 flex items-center justify-between space-x-2 transition-all shadow-xs text-left cursor-pointer"
              >
                <span>🌶️ Claim: "Natural Spices"</span>
                <span className="text-amber-600 font-mono font-black">➔ Flavor Hack INS 635 (-1.2)</span>
              </button>
              <button
                type="button"
                onClick={() => handleOpenModal('sodium')}
                className="p-2 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200/80 hover:border-rose-300 text-slate-700 hover:text-rose-900 flex items-center justify-between space-x-2 transition-all shadow-xs text-left cursor-pointer"
              >
                <span>🧂 Claim: "Energy for Kids"</span>
                <span className="text-rose-600 font-mono font-black">➔ 850mg Salt Bomb (-1.8)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleOpenModal('palmoil')}
              className="py-3 px-5 rounded-2xl apple-pill-btn text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all whitespace-nowrap cursor-pointer"
            >
              <span>Launch Full Food X-Ray Lab (See Details) ⚡</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* COMPREHENSIVE NEW-GEN FOOD X-RAY POP-UP MODAL */}
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
          {/* Mode Capsule Switcher */}
          <div className="flex items-center justify-between flex-wrap gap-3 bg-slate-100 p-2 rounded-2xl border border-slate-200">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleToggle('marketing')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  viewMode === 'marketing'
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ✨ What Brands Sell You (Front Marketing)
              </button>
              <button
                type="button"
                onClick={() => handleToggle('xray')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  viewMode === 'xray'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>⚠️ What You Actually Eat (Forensic X-Ray)</span>
              </button>
            </div>
            <span className="text-[11px] font-mono text-slate-500 font-bold hidden sm:inline">
              {viewMode === 'marketing' ? 'Retail Illusion Mode' : 'Lab Truth Mode'}
            </span>
          </div>

          {/* Interactive Package Display + Hotspot Dossiers */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Interactive Product Card Mockup */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div
                className={`relative w-full max-w-xs rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between border ${
                  viewMode === 'marketing'
                    ? 'bg-gradient-to-br from-amber-50 via-orange-50/40 to-white border-amber-300 shadow-lg'
                    : 'bg-gradient-to-br from-rose-50 via-red-50/40 to-white border-rose-300 shadow-lg'
                }`}
              >
                {/* Header Badge */}
                <div className="flex justify-between items-start">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      viewMode === 'marketing' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {viewMode === 'marketing' ? '✨ Front Packaging' : '⚠️ Forensic Lab Scan'}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-400">70g Pack</span>
                </div>

                {/* Center Content */}
                <div className="text-center space-y-3 py-6">
                  <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-sm bg-white border border-slate-200">
                    🍜
                  </div>
                  <h4 className="text-xl font-black text-slate-900">Instant Masala Noodles</h4>

                  {viewMode === 'marketing' ? (
                    <div className="space-y-1 animate-in fade-in duration-200">
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                        "Goodness of Wheat!"
                      </span>
                      <p className="text-[11px] text-slate-500">"Rich Indian Spices & Energy for Kids"</p>
                    </div>
                  ) : (
                    <div className="space-y-1 animate-in fade-in duration-200">
                      <span className="inline-block px-3 py-1 rounded-full bg-rose-600 text-white text-xs font-black shadow-xs">
                        Score: 4.2 / 10 · High Concern
                      </span>
                      <p className="text-[11px] text-rose-700 font-bold">Deep-fried in Palm Oil · 850mg Sodium</p>
                    </div>
                  )}
                </div>

                {/* Bottom Stats */}
                <div className="text-center border-t border-slate-200/80 pt-3">
                  {viewMode === 'marketing' ? (
                    <span className="text-[10px] text-slate-500">Commercial Supermarket Presentation</span>
                  ) : (
                    <div className="flex items-center justify-center space-x-1.5 text-[10px] font-mono text-rose-700 font-bold">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span>3 High-Concern Lab Violations Flagged</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: 3 New-Gen Deception Dossiers */}
            <div className="lg:col-span-7 space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                Tap Any Chemical Hotspot to Inspect Evidence:
              </span>

              {/* Hotspot 1: Refined Palmolein Oil */}
              <div
                onClick={() => selectHotspot('palmoil')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeHotspot === 'palmoil'
                    ? 'bg-rose-50/90 border-rose-300 ring-2 ring-rose-400/20 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                      01
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">Refined Palmolein Oil (34% by weight)</h5>
                      <span className="text-[11px] text-rose-600 font-bold">The Front Claim: "Made with Wheat"</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded">
                    -2.0 pts
                  </span>
                </div>

                {activeHotspot === 'palmoil' && (
                  <div className="mt-3 pt-3 border-t border-rose-200/70 space-y-2 text-xs animate-in fade-in duration-200">
                    <div className="p-3 rounded-xl bg-white border border-rose-200 space-y-1">
                      <div className="text-slate-900 font-bold flex items-center space-x-1">
                        <span>🤥 The Marketing Trap:</span>
                      </div>
                      <p className="text-slate-600">Front banner shouts "Wholesome Wheat Power!" to appeal to parents.</p>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-100/70 border border-rose-200 space-y-1 text-rose-950">
                      <div className="font-bold flex items-center space-x-1">
                        <span>💥 The Forensic Reality:</span>
                      </div>
                      <p className="leading-relaxed">
                        Wheat is only 22%. The noodle cakes are deep-fried in 34% cheap palmolein oil, packing 6.8g of artery-clogging saturated fat in a single serving.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono">
                        <span className="px-2 py-0.5 rounded-md bg-white text-rose-800 font-bold">#PalmOilLoophole</span>
                        <span className="px-2 py-0.5 rounded-md bg-white text-rose-800 font-bold">#ArteryPlaqueRisk</span>
                        <span className="px-2 py-0.5 rounded-md bg-white text-rose-800 font-bold">#UltraProcessed</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Hotspot 2: INS 635 / Flavor Enhancer */}
              <div
                onClick={() => selectHotspot('ins635')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeHotspot === 'ins635'
                    ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-400/20 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                      02
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">Disodium 5'-Ribonucleotides (INS 635)</h5>
                      <span className="text-[11px] text-amber-700 font-bold">The Front Claim: "Natural Indian Spices"</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                    -1.2 pts
                  </span>
                </div>

                {activeHotspot === 'ins635' && (
                  <div className="mt-3 pt-3 border-t border-amber-200/70 space-y-2 text-xs animate-in fade-in duration-200">
                    <div className="p-3 rounded-xl bg-white border border-amber-200 space-y-1">
                      <div className="text-slate-900 font-bold flex items-center space-x-1">
                        <span>🤥 The Marketing Trap:</span>
                      </div>
                      <p className="text-slate-600">Front shows pictures of whole cloves, red chilies, and farm tomatoes.</p>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-100/70 border border-amber-200 space-y-1 text-amber-950">
                      <div className="font-bold flex items-center space-x-1">
                        <span>💥 The Forensic Reality:</span>
                      </div>
                      <p className="leading-relaxed">
                        A chemical flavor enhancer 4x stronger than MSG. Synergizes with hydrolysed protein to trick the palate into perceiving umami richness from lab chemicals instead of real vegetables.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono">
                        <span className="px-2 py-0.5 rounded-md bg-white text-amber-800 font-bold">#FlavorHacking</span>
                        <span className="px-2 py-0.5 rounded-md bg-white text-amber-800 font-bold">#SyntheticUmami</span>
                        <span className="px-2 py-0.5 rounded-md bg-white text-amber-800 font-bold">#PalateDeception</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Hotspot 3: Hidden Sodium */}
              <div
                onClick={() => selectHotspot('sodium')}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  activeHotspot === 'sodium'
                    ? 'bg-rose-50/90 border-rose-300 ring-2 ring-rose-400/20 shadow-md'
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                      03
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">850mg Sodium per 100g (Salt Bomb)</h5>
                      <span className="text-[11px] text-rose-600 font-bold">The Front Claim: "Evening Energy for Kids"</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-black text-rose-600 bg-rose-100 px-2 py-0.5 rounded">
                    -1.8 pts
                  </span>
                </div>

                {activeHotspot === 'sodium' && (
                  <div className="mt-3 pt-3 border-t border-rose-200/70 space-y-2 text-xs animate-in fade-in duration-200">
                    <div className="p-3 rounded-xl bg-white border border-rose-200 space-y-1">
                      <div className="text-slate-900 font-bold flex items-center space-x-1">
                        <span>🤥 The Marketing Trap:</span>
                      </div>
                      <p className="text-slate-600">Promoted as a light, fun tea-time snack for growing children.</p>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-100/70 border border-rose-200 space-y-1 text-rose-950">
                      <div className="font-bold flex items-center space-x-1">
                        <span>💥 The Forensic Reality:</span>
                      </div>
                      <p className="leading-relaxed">
                        One small packet dumps 850mg sodium into the bloodstream—over 45% of WHO's total daily adult ceiling, spiking pediatric blood pressure and stressing kidney filtration.
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-mono">
                        <span className="px-2 py-0.5 rounded-md bg-white text-rose-800 font-bold">#SaltBomb</span>
                        <span className="px-2 py-0.5 rounded-md bg-white text-rose-800 font-bold">#BloodPressureSpike</span>
                        <span className="px-2 py-0.5 rounded-md bg-white text-rose-800 font-bold">#WHOCeilingBreached</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </UniversalModal>
    </section>
  );
};
