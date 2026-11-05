import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  Clock,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  X,
  BookOpen,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Radio,
  Globe2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Layers,
  SlidersHorizontal
} from 'lucide-react';
import { api } from '../services/api';
import { sounds } from '../utils/soundEffects';
import { UniversalModal } from './UniversalModal';

interface NewsArticle {
  id: string;
  title: string;
  clean_title?: string;
  source: string;
  published_at: string;
  published_iso?: string;
  link: string;
  category: string;
  category_label: string;
  tag: string;
  image: string;
  stat_number: string;
  stat_label: string;
  summary: string;
  key_takeaway: string;
}

export const FoodSafetyArticles: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<NewsArticle | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('Just now');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'swipe' | 'grid'>('swipe');

  // Touch swipe handling
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const fetchNews = async (forceRefresh: boolean = false) => {
    if (forceRefresh) {
      setRefreshing(true);
      sounds.playScanBeep();
    } else {
      setLoading(true);
    }

    try {
      const data = await api.getFoodNews(forceRefresh);
      if (data && data.articles && data.articles.length > 0) {
        setArticles(data.articles);
        setLastUpdated('Updated Today');
      }
    } catch {
      // Fallback articles retained
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews(false);
  }, []);

  const filteredArticles =
    selectedCategory === 'all'
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  // Keep index in bounds when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory]);

  const handleNext = () => {
    sounds.playClick();
    if (filteredArticles.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredArticles.length);
  };

  const handlePrev = () => {
    sounds.playClick();
    if (filteredArticles.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredArticles.length) % filteredArticles.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (distance > minSwipeDistance) {
      // Swiped Left -> Move to Next
      handleNext();
    } else if (distance < -minSwipeDistance) {
      // Swiped Right -> Move to Previous
      handlePrev();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const openArticle = (article: NewsArticle) => {
    sounds.playClick();
    setActiveArticle(article);
  };

  const currentArticle = filteredArticles[currentIndex] || filteredArticles[0];

  return (
    <section className="max-w-5xl mx-auto px-4 py-4 relative z-10">
      {/* Live Radar Header (Compact & Crisp) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full mac-secondary-btn text-emerald-800 text-[10px] font-black uppercase tracking-wider shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span>LIVE INDIA FOOD RADAR · DAILY UPDATES</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Food Safety Updates <span className="text-emerald-600">Across India</span>
          </h2>
        </div>

        {/* Live Controls: Category Pills & Refresh */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Chips */}
          <div className="flex items-center space-x-1 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setSelectedCategory('all');
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({articles.length})
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setSelectedCategory('fssai');
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'fssai'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              FSSAI Orders
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setSelectedCategory('labeling');
              }}
              className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'labeling'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Deceptions
            </button>
          </div>

          {/* Refresh Button */}
          <button
            type="button"
            disabled={refreshing}
            onClick={() => fetchNews(true)}
            className="p-1.5 rounded-xl mac-secondary-btn text-slate-600 hover:text-emerald-700 transition-colors shadow-xs cursor-pointer"
            title="Refresh news feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && articles.length === 0 ? (
        <div className="glass-card rounded-[24px] p-5 h-44 animate-pulse flex items-center space-x-4">
          <div className="w-28 h-28 bg-slate-200/80 rounded-2xl flex-shrink-0" />
          <div className="flex-1 space-y-2.5">
            <div className="h-4 bg-slate-200 rounded w-1/4" />
            <div className="h-5 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-200 rounded w-full" />
          </div>
        </div>
      ) : filteredArticles.length > 0 ? (
        /* SWIPE-STYLE MATRIMONY CARD DECK (Compact, Swipeable, Sleek) */
        <div className="space-y-3">
          {/* Top Story Progress Pills */}
          <div className="flex items-center space-x-1.5 px-1">
            {filteredArticles.slice(0, 10).map((_, idx) => (
              <div
                key={idx}
                onClick={() => {
                  sounds.playClick();
                  setCurrentIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx
                    ? 'flex-1 bg-emerald-600 shadow-xs'
                    : 'w-3 bg-slate-200 hover:bg-slate-300'
                }`}
              />
            ))}
          </div>

          {/* The Active Swipe Card */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="glass-card hover:glass-card-glow rounded-[26px] overflow-hidden border border-white/95 shadow-md relative transition-all duration-300 select-none"
          >
            {/* Specular sheen */}
            <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center p-3 sm:p-4 gap-4">
              {/* Left: Compact Image Thumbnail */}
              <div
                onClick={() => openArticle(currentArticle)}
                className="relative w-full sm:w-44 h-36 sm:h-36 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner group cursor-pointer"
              >
                <img
                  src={currentArticle.image}
                  alt={currentArticle.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                {/* Floating Tag */}
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-emerald-300 font-mono text-[9px] font-bold">
                  {currentArticle.tag}
                </span>

                {/* Stat Pill on Image */}
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-white/95 text-emerald-900 font-mono font-black text-[10px] shadow-xs">
                    {currentArticle.stat_number}
                  </span>
                  <span className="text-[10px] text-white/90 font-medium">
                    {currentArticle.published_at}
                  </span>
                </div>
              </div>

              {/* Right: Headline & Key Takeaway */}
              <div className="flex-1 min-w-0 space-y-1.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-400">
                    <span className="text-emerald-700 uppercase tracking-wider font-extrabold">
                      {currentArticle.category_label}
                    </span>
                    <span>·</span>
                    <span>{currentArticle.source}</span>
                  </div>

                  <h3
                    onClick={() => openArticle(currentArticle)}
                    className="text-sm sm:text-base font-black text-slate-900 hover:text-emerald-800 transition-colors cursor-pointer line-clamp-2 leading-snug"
                  >
                    {currentArticle.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {currentArticle.summary}
                  </p>
                </div>

                {/* Key Takeaway Pill & Read Button */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-700 truncate min-w-0">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{currentArticle.key_takeaway}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => openArticle(currentArticle)}
                    className="py-1.5 px-3 rounded-full mac-secondary-btn hover:bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center space-x-1 flex-shrink-0 cursor-pointer shadow-xs"
                  >
                    <span>Read Brief</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Swipe Controls Bar (Matrimony / Card Deck Swipe Controls) */}
          <div className="flex items-center justify-between px-2 pt-1">
            <button
              type="button"
              onClick={handlePrev}
              className="py-1.5 px-3 rounded-full mac-secondary-btn hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center space-x-1 shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <span className="text-xs font-mono font-bold text-slate-500">
              Swipe or tap arrows · <strong className="text-slate-800">{currentIndex + 1}</strong> / {filteredArticles.length}
            </span>

            <button
              type="button"
              onClick={handleNext}
              className="py-1.5 px-4 rounded-full apple-pill-btn text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-xs text-slate-500">
          No food safety stories found in this category.
        </div>
      )}

      {/* Comprehensive Food Safety Article Pop-Up Modal (Real Image Story News) */}
      {activeArticle && (
        <UniversalModal
          isOpen={Boolean(activeArticle)}
          onClose={() => setActiveArticle(null)}
          title="Food Safety Investigation"
          subtitle={`By ${activeArticle.source} · ${activeArticle.published_at}`}
          badge={activeArticle.category_label.toUpperCase()}
          icon={<Globe2 className="w-5 h-5 text-emerald-600" />}
          maxWidth="max-w-2xl"
          footer={
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {activeArticle.link && (
                <a
                  href={activeArticle.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-2.5 px-4 rounded-2xl mac-secondary-btn text-emerald-800 text-xs font-bold inline-flex items-center justify-center space-x-1.5 hover:text-emerald-900 shadow-xs cursor-pointer"
                >
                  <span>Read Full Article on {activeArticle.source}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setActiveArticle(null);
                }}
                className="w-full sm:w-auto py-2.5 px-6 rounded-2xl apple-pill-btn text-white text-xs font-bold cursor-pointer"
              >
                Close Story
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Real Image Story Hero Banner */}
            <div className="relative w-full h-56 sm:h-64 rounded-3xl overflow-hidden shadow-lg border border-slate-200">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover"
              />
              {/* Deep Cinematic Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-black/30" />

              {/* Top Floating Story Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-mono text-[10px] font-black uppercase tracking-wider shadow-sm">
                  {activeArticle.category_label}
                </span>

                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-semibold flex items-center space-x-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>{activeArticle.published_at}</span>
                </span>
              </div>

              {/* Bottom Headline & Tag Overlay on Image */}
              <div className="absolute bottom-3 left-4 right-4 space-y-1.5">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur-md text-emerald-300 font-mono text-[9px] font-bold">
                    {activeArticle.tag}
                  </span>
                  <span className="text-[11px] font-bold text-slate-300">
                    Source: {activeArticle.source}
                  </span>
                </div>

                <h3 className="text-base sm:text-xl font-black text-white leading-snug drop-shadow-md">
                  {activeArticle.title}
                </h3>
              </div>
            </div>

            {/* Big Regulatory Intelligence Callout Banner */}
            <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center space-x-4 shadow-xs">
              <div className="px-4 py-2.5 rounded-2xl bg-emerald-600 text-white font-mono font-black text-lg sm:text-xl shadow-md flex-shrink-0">
                {activeArticle.stat_number}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-black text-emerald-800 uppercase tracking-wider block">
                  Key Regulatory Statistic:
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-800 block leading-tight mt-0.5">
                  {activeArticle.stat_label}
                </span>
              </div>
            </div>

            {/* Story Investigation Narrative */}
            <div className="space-y-3">
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
                <span className="font-extrabold text-slate-900 flex items-center space-x-2 text-xs text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Verified Regulatory Investigation</span>
                </span>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-medium">
                  {activeArticle.summary}
                </p>
              </div>

              {/* Actionable Consumer Food Safety Directive */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white space-y-1.5 shadow-md shadow-emerald-700/20">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-200 flex-shrink-0" />
                  <span className="font-black text-xs uppercase tracking-wider text-emerald-100">
                    What Consumers Should Check on the Label:
                  </span>
                </div>
                <p className="text-white text-xs sm:text-sm leading-relaxed font-semibold pl-6">
                  {activeArticle.key_takeaway}
                </p>
              </div>
            </div>
          </div>
        </UniversalModal>
      )}
    </section>
  );
};
