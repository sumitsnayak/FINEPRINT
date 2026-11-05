import React, { useState } from 'react';
import {
  Scan,
  Flame,
  Plus,
  X,
  Upload,
  Camera,
  Barcode,
  Search,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface PhoneMockupShowcaseProps {
  onNavigate: (tab: string) => void;
  onSelectProduct?: (productId: number) => void;
  onOpenLogModal?: () => void;
}

export const PhoneMockupShowcase: React.FC<PhoneMockupShowcaseProps> = ({
  onNavigate,
  onOpenLogModal,
}) => {
  const [activeDevice, setActiveDevice] = useState<number>(1); // 0: Welcome, 1: Dashboard, 2: Sheet
  const [activeTimeframe, setActiveTimeframe] = useState<'today' | 'weekly'>('today');
  const [selectedDay, setSelectedDay] = useState<number>(3); // Thu 12
  const [waterCount, setWaterCount] = useState<number>(5);
  const [isModalOpenInScreen3, setIsModalOpenInScreen3] = useState<boolean>(true);

  const days = [
    { day: 'Mon', date: 9, hasFlame: true },
    { day: 'Tue', date: 10, hasFlame: true },
    { day: 'Wed', date: 11, hasFlame: true },
    { day: 'Thu', date: 12, hasFlame: true },
    { day: 'Fri', date: 13, hasFlame: false },
    { day: 'Sat', date: 14, hasFlame: false },
    { day: 'Sun', date: 15, hasFlame: false },
  ];

  return (
    <div className="space-y-4">
      {/* Clean Header */}
      <div className="text-center max-w-xl mx-auto space-y-1">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          FINEPRINT Experience
        </h2>
        <p className="text-xs text-slate-400">
          Interactive preview of mobile & desktop screens.
        </p>

        {/* Mobile Screen Switcher */}
        <div className="flex sm:hidden items-center justify-center space-x-1.5 pt-2">
          {['1. Welcome', '2. Dashboard', '3. Scan Sheet'].map((title, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setActiveDevice(i);
                sounds.playClick();
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                activeDevice === i
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              {title}
            </button>
          ))}
        </div>
      </div>

      {/* 3-Device Mockup Presentation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start justify-center max-w-5xl mx-auto pt-2">
        {/* SCREEN 1: WELCOME SCREEN */}
        <div className={`transition-all ${activeDevice === 0 ? 'block' : 'hidden md:block'}`}>
          <div className="w-full max-w-[320px] mx-auto bg-white rounded-[40px] p-4 shadow-xl border-2 border-slate-200 relative overflow-hidden flex flex-col justify-between min-h-[600px]">
            {/* Status Bar */}
            <div className="flex items-center justify-between px-3 pt-1 pb-2 text-[10px] font-bold text-slate-700">
              <span>9:41</span>
              <div className="w-16 h-3.5 bg-slate-900 rounded-full mx-auto" />
              <span>100%</span>
            </div>

            {/* Clean Typographic Header */}
            <div className="pt-4 pb-2 text-center">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">FINEPRINT</h3>
            </div>

            {/* Collage Cards */}
            <div className="px-1 py-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl overflow-hidden border border-slate-200 h-24 relative">
                  <img
                    src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=300&q=80"
                    alt="Salad"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 bg-emerald-600 text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full">
                    9.6 Safe
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden border border-slate-200 h-24 relative">
                  <img
                    src="https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=300&q=80"
                    alt="Noodles"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-1 left-1 bg-amber-500 text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full">
                    6 Additives
                  </div>
                </div>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-1 text-center px-2">
              <h2 className="text-xl font-black text-slate-900 leading-tight">
                Decode Food <br />
                <span className="text-emerald-600">Every Single Day.</span>
              </h2>
              <p className="text-xs text-slate-400">
                Transparent food safety ratings.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-3 px-1">
              <button
                type="button"
                onClick={() => {
                  sounds.playScanBeep();
                  onNavigate('scanner');
                }}
                className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/30 transition-all active:scale-95"
              >
                Scan Label
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onNavigate('login');
                }}
                className="w-full py-2.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-all"
              >
                I have an account
              </button>
            </div>
          </div>
          <p className="text-center text-xs font-bold text-slate-400 mt-2">1. Welcome</p>
        </div>

        {/* SCREEN 2: MAIN DASHBOARD */}
        <div className={`transition-all ${activeDevice === 1 ? 'block' : 'hidden md:block'}`}>
          <div className="w-full max-w-[320px] mx-auto bg-white rounded-[40px] p-4 shadow-xl border-2 border-emerald-500/40 relative overflow-hidden flex flex-col justify-between min-h-[600px]">
            {/* Status Bar */}
            <div className="flex items-center justify-between px-3 pt-1 pb-2 text-[10px] font-bold text-slate-700">
              <span>9:41</span>
              <div className="w-16 h-3.5 bg-slate-900 rounded-full mx-auto" />
              <span>100%</span>
            </div>

            {/* User Greeting & Switcher */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs text-white">
                  G
                </div>
                <div>
                  <p className="text-[9px] text-slate-400">Good Morning ☀️</p>
                  <p className="text-xs font-black text-slate-900">Gabriel .K</p>
                </div>
              </div>

              <div className="flex items-center bg-slate-100 p-0.5 rounded-full border border-slate-200 text-[9px] font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTimeframe('today')}
                  className={`px-2 py-0.5 rounded-full ${
                    activeTimeframe === 'today' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTimeframe('weekly')}
                  className={`px-2 py-0.5 rounded-full ${
                    activeTimeframe === 'weekly' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                  }`}
                >
                  Weekly
                </button>
              </div>
            </div>

            {/* 12-Day Streak */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 space-y-1.5 mt-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-1">
                  <span className="font-black text-slate-900">12</span>
                  <span className="text-slate-600 font-semibold text-[10px]">day streak</span>
                  <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                </div>
                <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                  Clean
                </span>
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map((d, idx) => {
                  const isSelected = selectedDay === idx;
                  return (
                    <button
                      key={d.day}
                      type="button"
                      onClick={() => {
                        setSelectedDay(idx);
                        sounds.playClick();
                      }}
                      className={`py-1 rounded-lg flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-white text-slate-700 border border-slate-200/60'
                      }`}
                    >
                      <span className={`text-[7px] ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                        {d.day}
                      </span>
                      <span className={`text-[9px] font-black ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                        {d.date}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Circular Gauge Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 my-1.5 flex items-center justify-between">
              <div>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Safety Score</p>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-black text-slate-900 font-mono">8.8</span>
                  <span className="text-[9px] text-slate-400 font-mono">/ 10</span>
                </div>
                <span className="text-[9px] font-bold text-emerald-700">FSSAI Standard</span>
              </div>

              {/* Radial Dial */}
              <div className="relative flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="26" stroke="#e2e8f0" strokeWidth="5" fill="none" />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    stroke="#059669"
                    strokeWidth="5"
                    strokeDasharray={163}
                    strokeDashoffset={20}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-black text-slate-900 font-mono">88%</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    sounds.playScanBeep();
                    if (onOpenLogModal) onOpenLogModal();
                    else onNavigate('scanner');
                  }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs"
                >
                  <Plus className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Food Carousel */}
            <div className="flex space-x-1.5 overflow-x-auto pb-1">
              <div className="w-16 bg-slate-50 border border-slate-200 rounded-lg p-1 flex-shrink-0 text-center">
                <img
                  src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=150&q=80"
                  alt="Yogurt"
                  className="w-full h-10 object-cover rounded mb-0.5"
                />
                <p className="text-[8px] font-bold text-slate-800 truncate">Yogurt</p>
                <p className="text-[7px] text-emerald-600 font-mono">9.2</p>
              </div>
              <div className="w-16 bg-slate-50 border border-slate-200 rounded-lg p-1 flex-shrink-0 text-center">
                <img
                  src="https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=150&q=80"
                  alt="Biscuits"
                  className="w-full h-10 object-cover rounded mb-0.5"
                />
                <p className="text-[8px] font-bold text-slate-800 truncate">Biscuits</p>
                <p className="text-[7px] text-amber-600 font-mono">6.2</p>
              </div>
              <div className="w-16 bg-slate-50 border border-slate-200 rounded-lg p-1 flex-shrink-0 text-center">
                <img
                  src="https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=150&q=80"
                  alt="Noodles"
                  className="w-full h-10 object-cover rounded mb-0.5"
                />
                <p className="text-[8px] font-bold text-slate-800 truncate">Noodles</p>
                <p className="text-[7px] text-rose-600 font-mono">4.8</p>
              </div>
            </div>

            {/* 3 Progress Bars */}
            <div className="grid grid-cols-3 gap-1.5 text-[8px] py-1 border-t border-slate-100">
              <div>
                <span className="text-slate-400 block">Additives</span>
                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-0.5">
                  <div className="bg-emerald-600 h-full w-1/4 rounded-full" />
                </div>
              </div>
              <div>
                <span className="text-slate-400 block">NOVA 2</span>
                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-0.5">
                  <div className="bg-teal-600 h-full w-1/2 rounded-full" />
                </div>
              </div>
              <div>
                <span className="text-slate-400 block">Sugar 18g</span>
                <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mt-0.5">
                  <div className="bg-amber-500 h-full w-1/3 rounded-full" />
                </div>
              </div>
            </div>

            {/* Clean Shield */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-1.5 flex items-center justify-between">
              <span className="text-[9px] font-bold text-slate-800">Clean Shield</span>
              <div className="flex items-center space-x-0.5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-[9px] ${i < waterCount ? 'opacity-100' : 'opacity-25'}`}
                  >
                    🛡️
                  </span>
                ))}
              </div>
            </div>

            {/* Floating Dock */}
            <div className="bg-white border border-slate-200 rounded-full px-3 py-1.5 flex items-center justify-between text-slate-400 text-xs">
              <span className="text-emerald-600">🏠</span>
              <span>📅</span>
              <button
                type="button"
                onClick={() => {
                  sounds.playScanBeep();
                  if (onOpenLogModal) onOpenLogModal();
                  else onNavigate('scanner');
                }}
                className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center -my-1 shadow-xs"
              >
                <Scan className="w-3.5 h-3.5" />
              </button>
              <span>📊</span>
              <span>👤</span>
            </div>
          </div>
          <p className="text-center text-xs font-bold text-emerald-700 mt-2">2. Dashboard</p>
        </div>

        {/* SCREEN 3: SCAN BOTTOM SHEET */}
        <div className={`transition-all ${activeDevice === 2 ? 'block' : 'hidden md:block'}`}>
          <div className="w-full max-w-[320px] mx-auto bg-slate-900/60 rounded-[40px] p-4 shadow-xl border-2 border-slate-200 relative overflow-hidden flex flex-col justify-between min-h-[600px]">
            {/* Status Bar */}
            <div className="flex items-center justify-between px-3 pt-1 pb-2 text-[10px] font-bold text-white">
              <span>9:41</span>
              <div className="w-16 h-3.5 bg-slate-800 rounded-full mx-auto" />
              <span>100%</span>
            </div>

            {/* Dimmed Background */}
            <div className="opacity-30 filter blur-[1px] space-y-2 px-1 pointer-events-none">
              <div className="w-full h-8 bg-white/20 rounded-lg" />
              <div className="w-full h-16 bg-white/20 rounded-xl" />
              <div className="w-full h-20 bg-white/20 rounded-xl" />
            </div>

            {/* Floating Close Button */}
            <div className="flex justify-center -mb-2 z-10">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setIsModalOpenInScreen3(!isModalOpenInScreen3);
                }}
                className="w-8 h-8 rounded-full bg-white text-slate-800 shadow-md flex items-center justify-center border border-slate-200"
              >
                <X className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Elevated White Sheet */}
            <div className="bg-white rounded-[28px] p-3.5 space-y-2.5 shadow-xl border border-slate-100 animate-in slide-in-from-bottom duration-300">
              <div className="text-center">
                <h4 className="text-sm font-black text-slate-900">Scan & Log</h4>
              </div>

              {/* 3 Buttons */}
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => onNavigate('scanner')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-center flex flex-col items-center justify-center"
                >
                  <Upload className="w-3.5 h-3.5 text-slate-700 mb-0.5" />
                  <span className="text-[9px] font-bold text-slate-800">Import</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('scanner')}
                  className="p-2 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 text-center flex flex-col items-center justify-center"
                >
                  <Camera className="w-3.5 h-3.5 text-slate-700 mb-0.5" />
                  <span className="text-[9px] font-bold text-slate-800">Capture</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('scanner')}
                  className="p-2 rounded-xl bg-emerald-600 text-white text-center flex flex-col items-center justify-center"
                >
                  <Barcode className="w-3.5 h-3.5 text-white mb-0.5" />
                  <span className="text-[9px] font-bold text-white">Scan</span>
                </button>
              </div>

              {/* 2 Quick Rows */}
              <div className="space-y-1">
                <button
                  type="button"
                  onClick={() => onNavigate('assistant')}
                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    <span>AI Question</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('products')}
                  className="w-full p-2 rounded-xl bg-slate-50 border border-slate-200 text-[10px] font-bold text-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-1.5">
                    <Search className="w-3 h-3 text-emerald-600" />
                    <span>Search Foods</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </button>
              </div>

              {/* Bottom CTA */}
              <button
                type="button"
                onClick={() => onNavigate('scanner')}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-600/30 flex items-center justify-center space-x-1"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Launch Scanner</span>
              </button>
            </div>
          </div>
          <p className="text-center text-xs font-bold text-slate-400 mt-2">3. Scan Sheet</p>
        </div>
      </div>
    </div>
  );
};
