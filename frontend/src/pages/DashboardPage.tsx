import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import {
  Scan,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  Scale,
  Sparkles,
  ChevronRight,
  Plus,
  Flame,
} from 'lucide-react';
import { ScoreBadge } from '../components/ScoreBadge';
import { InteractiveSafetySimulator } from '../components/InteractiveSafetySimulator';
import { SpotlightFoodSearch } from '../components/SpotlightFoodSearch';
import { sounds } from '../utils/soundEffects';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
  onSelectProduct: (productId: number) => void;
  onSelectScan: (scanId: number) => void;
  onOpenLogModal?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onSelectProduct,
  onOpenLogModal,
}) => {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'all' | 'safe' | 'flagged'>('all');
  const [viewTimeframe, setViewTimeframe] = useState<'today' | 'weekly'>('today');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(3); // Thu 12 default
  const [safeMealsCount, setSafeMealsCount] = useState<number>(5);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const items = await api.getProducts({ limit: 10 });
        setProducts(items);
      } catch (err) {
        console.error('Error loading products for dashboard:', err);
      }
    };
    loadData();
  }, []);

  const daysOfWeek = [
    { day: 'Mon', date: 9, hasFlame: true },
    { day: 'Tue', date: 10, hasFlame: true },
    { day: 'Wed', date: 11, hasFlame: true },
    { day: 'Thu', date: 12, hasFlame: true },
    { day: 'Fri', date: 13, hasFlame: false },
    { day: 'Sat', date: 14, hasFlame: false },
    { day: 'Sun', date: 15, hasFlame: false },
  ];

  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'safe') return p.overall_score >= 7.5;
    if (activeFilter === 'flagged') return p.overall_score < 7.5;
    return true;
  });

  const avgSafetyScore = products.length > 0
    ? (products.reduce((acc, p) => acc + (p.safety_score || p.overall_score), 0) / products.length).toFixed(1)
    : '8.8';

  // SVG Radial Gauge
  const scoreNum = Number(avgSafetyScore);
  const gaugePercent = (scoreNum / 10) * 100;
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * gaugePercent) / 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-6 animate-in fade-in pb-24 md:pb-12">
      {/* Top Header Bar with macOS Window Indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-full mac-gloss-btn p-0.5 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <div className="w-full h-full rounded-full bg-white/95 flex items-center justify-center font-black text-sm text-emerald-800">
                {user?.full_name ? user.full_name[0].toUpperCase() : 'G'}
              </div>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center shadow-xs">
              <span className="text-[7px] text-white font-bold">✓</span>
            </div>
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold">Good Morning ☀️</p>
            <h1 className="text-base font-black text-slate-900 tracking-tight">
              {user?.full_name || 'Gabriel .K'}
            </h1>
          </div>
        </div>

        {/* macOS Glossy Today | Weekly Pill Switcher */}
        <div className="flex items-center mac-secondary-btn p-1 rounded-full text-xs font-bold">
          <button
            type="button"
            onClick={() => setViewTimeframe('today')}
            className={`px-3.5 py-1 rounded-full transition-all ${
              viewTimeframe === 'today'
                ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => setViewTimeframe('weekly')}
            className={`px-3.5 py-1 rounded-full transition-all ${
              viewTimeframe === 'weekly'
                ? 'bg-emerald-600 text-white shadow-sm font-extrabold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Weekly
          </button>
        </div>
      </div>

      {/* 12-Day Streak - macOS Glass Panel */}
      <div className="glass-card rounded-[28px] p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span className="text-base font-black text-slate-900">12</span>
            <span className="text-xs font-bold text-slate-600">day clean streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <span className="text-[10px] text-emerald-800 font-extrabold bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
            FSSAI Verified
          </span>
        </div>

        {/* 7 Days Row */}
        <div className="grid grid-cols-7 gap-1.5">
          {daysOfWeek.map((d, idx) => {
            const isSelected = selectedDayIndex === idx;
            return (
              <button
                key={d.day}
                type="button"
                onClick={() => {
                  setSelectedDayIndex(idx);
                  sounds.playClick();
                }}
                className={`py-2 rounded-2xl flex flex-col items-center justify-center space-y-0.5 transition-all ${
                  isSelected
                    ? 'mac-gloss-btn text-white scale-105 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                    : 'bg-white/70 hover:bg-white text-slate-700 border border-slate-200/60 shadow-2xs'
                }`}
              >
                <span className={`text-[9px] font-bold ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                  {d.day}
                </span>
                <span className={`text-xs font-black ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                  {d.date}
                </span>
                {d.hasFlame ? (
                  <Flame
                    className={`w-2.5 h-2.5 ${
                      isSelected ? 'text-white fill-white' : 'text-amber-500 fill-amber-500'
                    }`}
                  />
                ) : (
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Spotlight Search with Glass Polish */}
      <SpotlightFoodSearch
        onSelectProduct={onSelectProduct}
        onAnalyzeRawText={() => onNavigate('scanner')}
      />

      {/* Hero Food Safety Card - macOS Glass Glow & Specular Sheen */}
      <div className="glass-card-glow rounded-[32px] p-5 sm:p-7 space-y-5 relative overflow-hidden">
        {/* Ambient Emerald Glass Glow Orbs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)]">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Safety Rating</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Safety Index: <span className="text-emerald-600 font-mono drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">{avgSafetyScore}</span> / 10
            </h2>
            <p className="text-xs text-slate-500">
              Evaluated against FSSAI food additive standards & ICMR caps.
            </p>
          </div>

          {/* Radial Circular Dial with Glass Glow */}
          <div className="relative flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle cx="64" cy="64" r={radius} stroke="#e2e8f0" strokeWidth="9" fill="none" opacity="0.6" />
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke="#059669"
                strokeWidth="9"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-out"
                style={{ filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.45))' }}
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-black text-slate-900 font-mono leading-none">
                {avgSafetyScore}
              </span>
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                Rating
              </span>
            </div>

            {/* Quick (+) Scan Button with Glass Glow */}
            <button
              type="button"
              onClick={() => {
                sounds.playScanBeep();
                if (onOpenLogModal) onOpenLogModal();
                else onNavigate('scanner');
              }}
              className="absolute -top-1 -right-1 w-8 h-8 rounded-full mac-gloss-btn text-white shadow-[0_0_15px_rgba(16,185,129,0.5)] flex items-center justify-center transition-all hover:scale-110 active:scale-95 border-2 border-white"
              title="Scan or Log Food"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* A+ Score Badge with Glossy Sheen */}
            <div className="absolute -bottom-1 -left-1 px-2.5 py-0.5 rounded-full mac-secondary-btn border-emerald-300 text-emerald-800 text-[9px] font-black flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse" />
              <span>A+ Safe</span>
            </div>
          </div>
        </div>

        {/* Food Label Photos Carousel */}
        <div className="space-y-1.5 pt-2 border-t border-slate-200/60 relative z-10">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800">Recent Foods</span>
            <button
              type="button"
              onClick={() => onNavigate('products')}
              className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center space-x-0.5 text-xs"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex space-x-3 overflow-x-auto pb-1 pt-1 scrollbar-thin">
            {products.slice(0, 5).map((prod) => (
              <div
                key={prod.id}
                onClick={() => onSelectProduct(prod.id)}
                className="flex-shrink-0 w-32 mac-secondary-btn rounded-2xl p-2 cursor-pointer transition-all group hover:scale-[1.03]"
              >
                <div className="relative w-full h-20 rounded-xl overflow-hidden mb-1.5 bg-white shadow-inner">
                  <img
                    src={prod.image_url || 'https://images.unsplash.com/photo-1612927601601-6638404737ce?auto=format&fit=crop&w=300&q=80'}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-1 right-1">
                    <ScoreBadge score={prod.overall_score} size="sm" />
                  </div>
                </div>
                <p className="text-[11px] font-bold text-slate-900 truncate">{prod.name}</p>
                <p className="text-[9px] text-slate-400 truncate">{prod.brand}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3 Food Safety Vector Progress Bars with Glossy Fills */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/60 text-xs relative z-10">
          <div className="space-y-1">
            <div className="flex justify-between font-bold text-[11px]">
              <span className="text-slate-500">Chemical Additives</span>
              <span className="font-mono text-emerald-700">2 / 12</span>
            </div>
            <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden shadow-inner">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full shadow-[0_0_8px_rgba(16,185,129,0.4)]" style={{ width: '25%' }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-bold text-[11px]">
              <span className="text-slate-500">Processing (NOVA)</span>
              <span className="font-mono text-teal-700">Lvl 2 Minimal</span>
            </div>
            <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden shadow-inner">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-600 h-full rounded-full shadow-[0_0_8px_rgba(20,184,166,0.4)]" style={{ width: '50%' }} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between font-bold text-[11px]">
              <span className="text-slate-500">FSSAI Sugar/Salt Cap</span>
              <span className="font-mono text-amber-700">18g / 50g</span>
            </div>
            <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden shadow-inner">
              <div className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full shadow-[0_0_8px_rgba(245,158,11,0.4)]" style={{ width: '36%' }} />
            </div>
          </div>
        </div>

        {/* Clean Safety Shield with Glass Droplets */}
        <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between relative z-10">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-900">
              Clean Shield: {safeMealsCount} / 8 Safe
            </span>
            <div className="flex items-center space-x-1">
              {Array.from({ length: 8 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSafeMealsCount(i + 1);
                    sounds.playClick();
                  }}
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] transition-all ${
                    i < safeMealsCount
                      ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_0_8px_rgba(16,185,129,0.5)] scale-105'
                      : 'bg-white/60 text-slate-300 hover:bg-white'
                  }`}
                  title={`Food #${i + 1}`}
                >
                  🛡️
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (safeMealsCount < 8) setSafeMealsCount(safeMealsCount + 1);
              sounds.playClick();
            }}
            className="w-7 h-7 rounded-full mac-secondary-btn text-emerald-700 flex items-center justify-center transition-transform active:scale-95"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Packaged Food Audits */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">Food Safety Audits</h2>
            <p className="text-xs text-slate-400">Scores out of 10.</p>
          </div>

          <div className="flex items-center mac-secondary-btn p-0.5 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeFilter === 'all' ? 'mac-gloss-btn text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveFilter('safe')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeFilter === 'safe' ? 'mac-gloss-btn text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Safe (7.5+)
            </button>
            <button
              onClick={() => setActiveFilter('flagged')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeFilter === 'flagged' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600'
              }`}
            >
              Concern
            </button>
          </div>
        </div>

        {/* Product Cards with macOS Glossy Glass Sheen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredProducts.map((p) => {
            const isSafe = p.overall_score >= 7.5;
            const isModerate = p.overall_score >= 6.0 && p.overall_score < 7.5;

            return (
              <div
                key={p.id}
                onClick={() => onSelectProduct(p.id)}
                className="glass-card hover:glass-card-glow rounded-[24px] p-4 transition-all cursor-pointer flex flex-col justify-between group hover:-translate-y-0.5"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {p.brand} · {p.category}
                    </span>
                    <ScoreBadge score={p.overall_score} size="sm" />
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">
                    {p.name}
                  </h3>

                  <div className="mt-1.5 flex items-center space-x-2">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${
                        isSafe
                          ? 'bg-emerald-500/15 text-emerald-800 border-emerald-500/30'
                          : isModerate
                          ? 'bg-amber-500/15 text-amber-800 border-amber-500/30'
                          : 'bg-rose-500/15 text-rose-800 border-rose-500/30'
                      }`}
                    >
                      {isSafe ? 'Clean' : isModerate ? 'Moderate' : 'Concern'}
                    </span>
                    {p.is_verified && (
                      <span className="text-[9px] text-slate-400 font-medium">FSSAI Checked</span>
                    )}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono text-[11px]">
                    Safety: <strong className="text-slate-800">{p.safety_score}/10</strong>
                  </span>
                  <span className="text-emerald-700 font-bold flex items-center space-x-0.5 text-xs group-hover:translate-x-0.5 transition-transform">
                    <span>Audit</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulator */}
      <InteractiveSafetySimulator />

      {/* Clean Compact Additives Watchlist */}
      <div className="glass-card rounded-[28px] p-5 space-y-3">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          <h3 className="font-black text-slate-900 text-sm">FSSAI Additives Watchlist</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-3 rounded-2xl mac-secondary-btn space-y-1">
            <span className="font-bold text-slate-900 block text-xs truncate">INS 621 (MSG)</span>
            <span className="text-[10px] text-slate-500 block truncate">Flavor Enhancer</span>
            <span className="text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 inline-block">
              Infant Ban
            </span>
          </div>

          <div className="p-3 rounded-2xl mac-secondary-btn space-y-1">
            <span className="font-bold text-slate-900 block text-xs truncate">INS 102 (Tartrazine)</span>
            <span className="text-[10px] text-slate-500 block truncate">Synthetic Dye</span>
            <span className="text-rose-700 text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-50 inline-block">
              Mandatory Warning
            </span>
          </div>

          <div className="p-3 rounded-2xl mac-secondary-btn space-y-1">
            <span className="font-bold text-slate-900 block text-xs truncate">INS 211 (Benzoate)</span>
            <span className="text-[10px] text-slate-500 block truncate">Preservative</span>
            <span className="text-amber-700 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 inline-block">
              Safe &lt;100ppm
            </span>
          </div>

          <div className="p-3 rounded-2xl mac-secondary-btn space-y-1">
            <span className="font-bold text-slate-900 block text-xs truncate">Palmolein Oil</span>
            <span className="text-[10px] text-slate-500 block truncate">Saturated Fat</span>
            <span className="text-rose-700 text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-50 inline-block">
              Trans Fat &lt;2%
            </span>
          </div>
        </div>
      </div>

      {/* Quick Tools Strip with macOS Dock-like Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => onNavigate('scanner')}
          className="p-3.5 rounded-2xl glass-card hover:glass-card-glow text-center transition-all flex flex-col items-center justify-center space-y-1.5 group hover:scale-[1.03]"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center shadow-xs">
            <Scan className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900">Scan</span>
        </button>

        <button
          onClick={() => onNavigate('compare')}
          className="p-3.5 rounded-2xl glass-card hover:glass-card-glow text-center transition-all flex flex-col items-center justify-center space-y-1.5 group hover:scale-[1.03]"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-700 flex items-center justify-center shadow-xs">
            <Scale className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900">Compare</span>
        </button>

        <button
          onClick={() => onNavigate('alternatives')}
          className="p-3.5 rounded-2xl glass-card hover:glass-card-glow text-center transition-all flex flex-col items-center justify-center space-y-1.5 group hover:scale-[1.03]"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900">Swaps</span>
        </button>

        <button
          onClick={() => onNavigate('report')}
          className="p-3.5 rounded-2xl glass-card hover:glass-card-glow text-center transition-all flex flex-col items-center justify-center space-y-1.5 group hover:scale-[1.03]"
        >
          <div className="w-8 h-8 rounded-xl bg-rose-500/15 text-rose-700 flex items-center justify-center shadow-xs">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-900">Report</span>
        </button>
      </div>
    </div>
  );
};
