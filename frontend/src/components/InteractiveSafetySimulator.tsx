import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  RefreshCw,
  X,
  SlidersHorizontal,
  ChevronRight,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Droplets
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { UniversalModal } from './UniversalModal';

interface AdditiveItem {
  id: string;
  name: string;
  ins: string;
  category: string;
  penalty: number;
  safetyLevel: 'safe' | 'caution' | 'danger';
  fssaiRule: string;
  whyUsed: string;
}

const PRESET_ADDITIVES: AdditiveItem[] = [
  {
    id: 'ins621',
    name: 'Monosodium Glutamate (MSG)',
    ins: 'INS 621',
    category: 'Flavor Enhancer',
    penalty: 1.2,
    safetyLevel: 'caution',
    fssaiRule: 'Permitted under GMP; strictly prohibited in infant food (<12 mos).',
    whyUsed: 'Amplifies umami/savory taste in instant noodles & soups.',
  },
  {
    id: 'palm_oil',
    name: 'Refined Palmolein Oil',
    ins: 'Fat Extract',
    category: 'Saturated Fat',
    penalty: 1.8,
    safetyLevel: 'danger',
    fssaiRule: 'FSSAI mandates industrial trans-fat must remain below 2%.',
    whyUsed: 'Cheap, heat-stable deep-frying oil for chips and instant ramen.',
  },
  {
    id: 'ins102',
    name: 'Tartrazine (Synthetic Yellow)',
    ins: 'INS 102',
    category: 'Azo Colorant',
    penalty: 2.0,
    safetyLevel: 'danger',
    fssaiRule: 'Max 100 ppm limit with mandatory packaging label warning.',
    whyUsed: 'Imparts intense lemon-yellow color to namkeens and drinks.',
  },
  {
    id: 'ins211',
    name: 'Sodium Benzoate',
    ins: 'INS 211',
    category: 'Chemical Preservative',
    penalty: 1.1,
    safetyLevel: 'caution',
    fssaiRule: 'Max permitted limit 750 ppm under FSSAI Table 3.',
    whyUsed: 'Inhibits bacterial/fungal decay in tomato ketchups and squashes.',
  },
  {
    id: 'invert_sugar',
    name: 'Invert Sugar Syrup / HFCS',
    ins: 'Added Sugars',
    category: 'Simple Sugar',
    penalty: 1.5,
    safetyLevel: 'danger',
    fssaiRule: 'ICMR recommends added free sugars stay under 25g/day.',
    whyUsed: 'Cheaper than cane sugar; enhances browning and shelf-life in biscuits.',
  },
  {
    id: 'ins322',
    name: 'Soy Lecithin (Natural)',
    ins: 'INS 322(i)',
    category: 'Emulsifier',
    penalty: 0.1,
    safetyLevel: 'safe',
    fssaiRule: 'Naturally derived plant compound; approved worldwide without limit.',
    whyUsed: 'Keeps cocoa butter & liquids uniformly blended in chocolates.',
  },
  {
    id: 'ins412',
    name: 'Guar Gum (Plant Fiber)',
    ins: 'INS 412',
    category: 'Stabilizer / Fiber',
    penalty: 0.1,
    safetyLevel: 'safe',
    fssaiRule: 'Derived from Indian guar cluster beans. Safe natural thickener.',
    whyUsed: 'Provides viscous body and prevents water separation in dairy & gravies.',
  },
];

export const InteractiveSafetySimulator: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(['ins621', 'palm_oil']);
  const [sodiumMg, setSodiumMg] = useState<number>(650);
  const [addedSugarG, setAddedSugarG] = useState<number>(14);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sounds.enabled = next;
    if (next) sounds.playClick();
  };

  const toggleAdditive = (id: string) => {
    sounds.playClick();
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Compute live safety score (10.0 base)
  let score = 10.0;
  const selectedAdditives = PRESET_ADDITIVES.filter((a) => selectedIds.includes(a.id));

  selectedAdditives.forEach((a) => {
    score -= a.penalty;
  });

  // Sodium penalty (> 500mg)
  if (sodiumMg > 500) {
    score -= ((sodiumMg - 500) / 500) * 1.5;
  }

  // Sugar penalty (> 10g)
  if (addedSugarG > 10) {
    score -= ((addedSugarG - 10) / 20) * 1.5;
  }

  const finalScore = Math.max(1.0, Math.min(10.0, Number(score.toFixed(1))));

  const getVerdict = (val: number) => {
    if (val >= 8.0) return { label: 'Clean & Safe Food', color: 'text-emerald-700', grade: 'Grade A', bg: 'bg-emerald-50 border-emerald-300', dot: 'bg-emerald-500' };
    if (val >= 6.0) return { label: 'Moderate Concern', color: 'text-amber-700', grade: 'Grade B', bg: 'bg-amber-50 border-amber-300', dot: 'bg-amber-500' };
    return { label: 'High Harm / Risk Detected', color: 'text-rose-700', grade: 'Grade D', bg: 'bg-rose-50 border-rose-300', dot: 'bg-rose-500' };
  };

  const verdict = getVerdict(finalScore);

  const openModal = () => {
    sounds.playScanBeep();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    sounds.playClick();
    setIsModalOpen(false);
  };

  return (
    <>
      {/* COMPACT & ATTRACTIVE TEASER CARD ON THE MAIN PAGE (Takes ~100px instead of ~700px) */}
      <div
        onClick={openModal}
        className="glass-card hover:glass-card-glow rounded-[28px] p-4 sm:p-5 border border-white/90 shadow-md group cursor-pointer transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
      >
        {/* Subtle Specular Glow */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          {/* Left: Mini Gauge & Title */}
          <div className="flex items-center space-x-3.5 sm:space-x-4">
            {/* Live Interactive Mini Gauge */}
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="12"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="48"
                  fill="none"
                  stroke={finalScore >= 8 ? '#059669' : finalScore >= 6 ? '#d97706' : '#e11d48'}
                  strokeWidth="12"
                  strokeDasharray={`${(finalScore / 10) * 301.59} 301.59`}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xs sm:text-sm font-black font-mono text-slate-900 leading-none">
                  {finalScore.toFixed(1)}
                </span>
                <span className="text-[8px] font-bold text-slate-400">/ 10</span>
              </div>
            </div>

            {/* Title & Micro-Pills */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold tracking-wide">
                  <Sparkles className="w-2.5 h-2.5 text-emerald-600" />
                  <span>INTERACTIVE LAB</span>
                </span>
                <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${verdict.bg} ${verdict.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${verdict.dot}`} />
                  <span>{verdict.grade} · {verdict.label}</span>
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-emerald-800 transition-colors">
                Food Safety & Additives Laboratory
              </h3>

              <p className="text-[11px] text-slate-500 max-w-xl leading-relaxed hidden sm:block">
                Simulate how INS additives, refined palm olein & sugar spikes impact safety scores in real time.
              </p>
            </div>
          </div>

          {/* Right: CTA Pill Button to POP UP the Modal */}
          <div className="flex items-center space-x-2 self-end sm:self-center flex-shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openModal();
              }}
              className="py-2.5 px-4 rounded-2xl apple-pill-btn text-white text-xs font-black flex items-center space-x-2 shadow-md group-hover:scale-105 active:scale-95 transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Launch Simulator Lab ⚡</span>
            </button>
          </div>
        </div>
      </div>

      {/* THE INTERACTIVE POP-UP MODAL */}
      <UniversalModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Food Safety & Additives Laboratory"
        subtitle="Tap additives & adjust sodium/sugar sliders to test real-time regulatory safety scores"
        badge="INTERACTIVE SIMULATOR LAB"
        icon={<Sparkles className="w-5 h-5 text-emerald-600" />}
        maxWidth="max-w-3xl"
        footer={
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={toggleSound}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-bold text-slate-700 flex items-center space-x-1.5 transition-colors shadow-xs"
              title="Toggle sound effects"
            >
              {soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-600" />
                  <span>Audio On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4 text-slate-400" />
                  <span>Muted</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={closeModal}
              className="w-full sm:w-auto py-2.5 px-6 rounded-2xl apple-pill-btn text-white text-xs font-bold shadow-xs hover:scale-105 active:scale-95 transition-all"
            >
              Apply & Close Simulator
            </button>
          </div>
        }
      >

            {/* Dynamic Gauge & Sliders */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-50/90 p-5 sm:p-6 rounded-[28px] border border-slate-200/90 relative z-10">
              {/* Dial Gauge */}
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="10"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="48"
                      fill="none"
                      stroke={finalScore >= 8 ? '#059669' : finalScore >= 6 ? '#d97706' : '#e11d48'}
                      strokeWidth="10"
                      strokeDasharray={`${(finalScore / 10) * 301.59} 301.59`}
                      strokeLinecap="round"
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black font-mono text-slate-900 tracking-tight">
                      {finalScore.toFixed(1)}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">/ 10 Rating</span>
                  </div>
                </div>

                <div className={`px-3 py-1 rounded-full text-xs font-black border shadow-xs ${verdict.bg} ${verdict.color}`}>
                  {verdict.grade} · {verdict.label}
                </div>
              </div>

              {/* Sliders */}
              <div className="md:col-span-2 space-y-4 text-xs">
                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-700 flex items-center space-x-1">
                      <Droplets className="w-3.5 h-3.5 text-blue-500" />
                      <span>Sodium Threshold (Max 500mg):</span>
                    </span>
                    <span className={`font-mono ${sodiumMg > 500 ? 'text-amber-600 font-black' : 'text-emerald-600'}`}>
                      {sodiumMg} mg {sodiumMg > 500 ? '⚠️ High' : '✓ Safe'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="1500"
                    step="50"
                    value={sodiumMg}
                    onChange={(e) => {
                      setSodiumMg(Number(e.target.value));
                      if (Number(e.target.value) > 1000) sounds.playWarningBuzz();
                      else sounds.playClick();
                    }}
                    className="w-full accent-emerald-600 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between font-bold">
                    <span className="text-slate-700 flex items-center space-x-1">
                      <Flame className="w-3.5 h-3.5 text-rose-500" />
                      <span>Added Sugar (Max 10g/serving):</span>
                    </span>
                    <span className={`font-mono ${addedSugarG > 10 ? 'text-rose-600 font-black' : 'text-emerald-600'}`}>
                      {addedSugarG} g {addedSugarG > 10 ? '⚠️ High' : '✓ Low'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="45"
                    step="1"
                    value={addedSugarG}
                    onChange={(e) => {
                      setAddedSugarG(Number(e.target.value));
                      if (Number(e.target.value) > 25) sounds.playWarningBuzz();
                      else sounds.playClick();
                    }}
                    className="w-full accent-emerald-600 bg-slate-200 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-200">
                  <span>Active Penalties: {selectedAdditives.length} additives selected</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIds([]);
                      setSodiumMg(200);
                      setAddedSugarG(2);
                      sounds.playSafeChime();
                    }}
                    className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center space-x-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset to Clean Food</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Chemical Additives Grid */}
            <div className="space-y-2.5 relative z-10">
              <span className="text-xs uppercase font-extrabold text-slate-600 tracking-wider block">
                Tap Additives to Toggle Deductions:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {PRESET_ADDITIVES.map((item) => {
                  const isSelected = selectedIds.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleAdditive(item.id)}
                      className={`p-3 rounded-2xl border text-left transition-all flex flex-col justify-between shadow-xs ${
                        isSelected
                          ? item.safetyLevel === 'danger'
                            ? 'bg-rose-50/90 border-rose-300 ring-2 ring-rose-400/30 shadow-sm'
                            : item.safetyLevel === 'caution'
                            ? 'bg-amber-50/90 border-amber-300 ring-2 ring-amber-400/30 shadow-sm'
                            : 'bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-400/30 shadow-sm'
                          : 'bg-white border-slate-200/80 opacity-70 hover:opacity-100 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {item.ins}
                          </span>
                          <span
                            className={`text-[9px] uppercase font-black px-1.5 py-0.5 rounded ${
                              item.safetyLevel === 'danger'
                                ? 'bg-rose-100 text-rose-800'
                                : item.safetyLevel === 'caution'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {item.safetyLevel}
                          </span>
                        </div>

                        <h4 className="font-bold text-xs text-slate-900 leading-snug">{item.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-1 leading-normal line-clamp-2">
                          {item.whyUsed}
                        </p>
                      </div>

                      <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-medium">{item.category}</span>
                        <span className={isSelected ? 'text-rose-600 font-bold' : 'text-slate-400'}>
                          {isSelected ? `-${item.penalty} pts` : 'Inactive'}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
      </UniversalModal>
    </>
  );
};
