import React, { useState } from 'react';
import { Eye, ArrowRight, Zap } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface FoodLabelXRayProps {
  onScanClick: () => void;
}

export const FoodLabelXRay: React.FC<FoodLabelXRayProps> = ({ onScanClick }) => {
  const [viewMode, setViewMode] = useState<'marketing' | 'xray'>('xray');
  const [activeHotspot, setActiveHotspot] = useState<string | null>('palmoil');

  const handleToggle = (mode: 'marketing' | 'xray') => {
    sounds.playClick();
    setViewMode(mode);
  };

  const selectHotspot = (id: string) => {
    sounds.playClick();
    setActiveHotspot(id);
  };

  return (
    <div className="relative glass-card border border-white/90 rounded-[28px] p-5 sm:p-7 shadow-md overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-1/4 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-black uppercase tracking-wider mb-1 shadow-xs">
            <Zap className="w-3 h-3 text-emerald-600" />
            <span>Interactive Deception Detector</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            The Packaged Food X-Ray
          </h3>
          <p className="text-xs text-slate-500">
            Compare front-of-pack marketing claims with actual back-of-pack ingredient realities.
          </p>
        </div>

        {/* Interactive Mode Capsule Switcher */}
        <div className="bg-slate-100 p-1.5 rounded-full border border-slate-200 flex items-center self-start sm:self-center shadow-inner">
          <button
            type="button"
            onClick={() => handleToggle('marketing')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              viewMode === 'marketing'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            What They Claim
          </button>
          <button
            type="button"
            onClick={() => handleToggle('xray')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === 'xray'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Ingredient X-Ray</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Comparison Display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-5">
        {/* Left Side: The Product Package Mockup */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div
            className={`relative w-full max-w-xs aspect-[3/4] rounded-3xl p-6 transition-all duration-500 flex flex-col justify-between border ${
              viewMode === 'marketing'
                ? 'bg-gradient-to-br from-amber-50 via-orange-50/50 to-white border-amber-200 shadow-lg'
                : 'bg-gradient-to-br from-rose-50 via-red-50/40 to-white border-rose-200 shadow-lg'
            }`}
          >
            {/* Package Header Badge */}
            <div className="flex justify-between items-start">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                viewMode === 'marketing'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose-100 text-rose-800'
              }`}>
                {viewMode === 'marketing' ? '✨ Front Packaging' : '⚠️ AI X-Ray Scan'}
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">70g Pack</span>
            </div>

            {/* Center Package Content */}
            <div className="text-center space-y-3 py-6">
              <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-md bg-white border border-slate-200">
                🍜
              </div>
              <h4 className="text-xl font-black text-slate-900">Instant Masala Noodles</h4>

              {viewMode === 'marketing' ? (
                <div className="space-y-1.5 animate-in fade-in duration-300">
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black border border-emerald-200">
                    "Goodness of Wheat!"
                  </span>
                  <p className="text-[11px] text-slate-600">"Rich Indian Spices & Energy for Kids"</p>
                </div>
              ) : (
                <div className="space-y-1.5 animate-in fade-in duration-300">
                  <span className="inline-block px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-black border border-rose-200">
                    Score: 4.5 / 10 · High Concern
                  </span>
                  <p className="text-[11px] text-rose-700 font-medium">Deep-fried in Palm Oil · 850mg Sodium</p>
                </div>
              )}
            </div>

            {/* Bottom Footer on Package */}
            <div className="text-center border-t border-slate-200/80 pt-3">
              {viewMode === 'marketing' ? (
                <span className="text-[10px] text-slate-500">Commercial Retail Presentation</span>
              ) : (
                <span className="text-[10px] font-mono text-rose-600 font-bold">
                  4 Hidden Chemical Additives Detected
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Breakdown Hotspots */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Tap any flagged ingredient to inspect laboratory evidence:
            </span>
          </div>

          <div className="space-y-3">
            {/* Hotspot 1: Palm Oil */}
            <div
              onClick={() => selectHotspot('palmoil')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeHotspot === 'palmoil'
                  ? 'bg-rose-50 border-rose-300 shadow-md'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Refined Palmolein Oil (34% by weight)</h5>
                    <span className="text-[10px] text-rose-600 font-semibold">Front claimed: "Made with Wheat"</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-rose-600">-2.0 pts</span>
              </div>

              {activeHotspot === 'palmoil' && (
                <p className="text-xs text-slate-700 mt-3 pt-3 border-t border-rose-200 leading-relaxed animate-in fade-in">
                  Manufacturers deep-fry the noodle cakes in cheap palmolein oil to cut costs. A single serving delivers 6.8g of saturated fat (over 35% of your recommended daily allowance) and trans-fat markers.
                </p>
              )}
            </div>

            {/* Hotspot 2: INS 635 / Flavor Enhancer */}
            <div
              onClick={() => selectHotspot('ins635')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeHotspot === 'ins635'
                  ? 'bg-amber-50 border-amber-300 shadow-md'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">Disodium 5'-Ribonucleotides (INS 635)</h5>
                    <span className="text-[10px] text-amber-700 font-semibold">Front claimed: "Natural Spices"</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-amber-700">-1.2 pts</span>
              </div>

              {activeHotspot === 'ins635' && (
                <p className="text-xs text-slate-700 mt-3 pt-3 border-t border-amber-200 leading-relaxed animate-in fade-in">
                  A high-potency chemical flavor synergy enhancer 4 times stronger than MSG. Synergizes with hydrolysed protein to trick the palate into perceiving deep umami richness from artificial extracts rather than whole vegetables.
                </p>
              )}
            </div>

            {/* Hotspot 3: Hidden Sodium */}
            <div
              onClick={() => selectHotspot('sodium')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                activeHotspot === 'sodium'
                  ? 'bg-rose-50 border-rose-300 shadow-md'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">850mg Sodium per 100g</h5>
                    <span className="text-[10px] text-rose-600 font-semibold">Nearly 45% of WHO Daily Salt Limit</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-rose-600">-1.8 pts</span>
              </div>

              {activeHotspot === 'sodium' && (
                <p className="text-xs text-slate-700 mt-3 pt-3 border-t border-rose-200 leading-relaxed animate-in fade-in">
                  Sodium chloride combined with mineral salts (INS 508 potassium chloride). Eating just one packet exceeds half your daily safe sodium ceiling, raising cardiovascular blood pressure.
                </p>
              )}
            </div>
          </div>

          {/* Direct CTA */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">Don't buy blind. Inspect any package in 3 seconds.</span>
            <button
              onClick={onScanClick}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-md shadow-emerald-600/25 transition-all active:scale-95"
            >
              <span>Scan Your Packaged Food</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
