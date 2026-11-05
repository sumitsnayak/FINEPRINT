import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

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
    if (val >= 8.0) return { label: 'Clean & Safe Food', color: 'text-emerald-700', grade: 'Grade A', bg: 'bg-emerald-50 border-emerald-300' };
    if (val >= 6.0) return { label: 'Moderate Concern', color: 'text-amber-700', grade: 'Grade B', bg: 'bg-amber-50 border-amber-300' };
    return { label: 'High Harm / Risk Detected', color: 'text-rose-700', grade: 'Grade D', bg: 'bg-rose-50 border-rose-300' };
  };

  const verdict = getVerdict(finalScore);

  return (
    <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full mb-1">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            <span>Interactive Simulator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Food Safety & Additives Laboratory
          </h2>
          <p className="text-xs text-slate-500">
            Tap ingredients & adjust sodium/sugar sliders to see how food standards calculate safety ratings in real time.
          </p>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          className="self-start sm:self-center px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-300 text-xs font-bold text-slate-700 flex items-center space-x-1.5 transition-colors shadow-sm"
          title="Toggle scan sound effects"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-emerald-600" />
              <span>Audio On</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-400" />
              <span>Audio Muted</span>
            </>
          )}
        </button>
      </div>

      {/* Main Dynamic Safety Gauge Dial */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-50/80 p-6 rounded-2xl border border-slate-200/90">
        {/* Animated Speedometer / Circle Gauge */}
        <div className="flex flex-col items-center justify-center text-center space-y-2">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Ring with live needle */}
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

            {/* Inner Center Score Display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black font-mono text-slate-900 tracking-tight">
                {finalScore.toFixed(1)}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">/ 10 Rating</span>
            </div>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-black border shadow-sm ${verdict.bg} ${verdict.color}`}>
            {verdict.grade} · {verdict.label}
          </div>
        </div>

        {/* Live Vector Penalty Breakdown */}
        <div className="md:col-span-2 space-y-4 text-xs">
          <div className="space-y-1.5">
            <div className="flex justify-between font-bold">
              <span className="text-slate-700">Sodium Threshold (Max 500mg):</span>
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
              <span className="text-slate-700">Added Sugar (Max 10g/serving):</span>
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

      {/* Interactive Chemical Additives Grid */}
      <div className="space-y-3">
        <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block">
          Select or Deselect Additives to Test Food Safety Impact:
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {PRESET_ADDITIVES.map((item) => {
            const isSelected = selectedIds.includes(item.id);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleAdditive(item.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between shadow-sm ${
                  isSelected
                    ? item.safetyLevel === 'danger'
                      ? 'bg-rose-50 border-rose-300 shadow-sm'
                      : item.safetyLevel === 'caution'
                      ? 'bg-amber-50 border-amber-300 shadow-sm'
                      : 'bg-emerald-50 border-emerald-300 shadow-sm'
                    : 'bg-white border-slate-200 opacity-75 hover:opacity-100 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
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

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
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
    </div>
  );
};
