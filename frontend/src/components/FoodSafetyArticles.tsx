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
              className="py-1.5 px-3.5 rounded-full apple-pill-btn text-white text-xs font-bold flex items-center space-x-1 shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition-all"
            >
              <span>Next Story</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 text-center text-xs text-slate-500">
          No food safety stories found in this category.
        </div>
      )}

      {/* Comprehensive Food Safety Article Pop-Up Modal */}
      {activeArticle && (
        <UniversalModal
          isOpen={Boolean(activeArticle)}
          onClose={() => setActiveArticle(null)}
          title={activeArticle.title}
          subtitle={`Published by ${activeArticle.source} · ${activeArticle.published_at}`}
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
                  className="w-full sm:w-auto py-2 px-4 rounded-2xl mac-secondary-btn text-emerald-800 text-xs font-bold inline-flex items-center justify-center space-x-1.5 hover:text-emerald-900 shadow-xs"
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
                className="w-full sm:w-auto py-2 px-6 rounded-2xl apple-pill-btn text-white text-xs font-bold"
              >
                Close Brief
              </button>
            </div>
          }
        >
          <div className="space-y-4">
            {/* Stat Callout Banner */}
            <div className="p-4 rounded-3xl bg-emerald-50/80 border border-emerald-200/90 flex items-center space-x-3.5">
              <div className="px-3 py-2 rounded-2xl bg-emerald-600 text-white font-mono font-black text-sm shadow-sm flex-shrink-0">
                {activeArticle.stat_number}
              </div>
              <div>
                <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">
                  Regulatory Intelligence
                </span>
                <span className="text-xs font-semibold text-slate-800 block">
                  {activeArticle.stat_label}
                </span>
              </div>
            </div>

            {/* Article Sections */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <span className="font-extrabold text-slate-900 flex items-center space-x-1.5 text-xs text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span>Verified Regulatory Summary</span>
                </span>
                <p className="text-slate-600 text-xs leading-normal">
                  {activeArticle.summary}
                </p>
              </div>

              {/* Actionable Supermarket Rule */}
              <div className="p-4 rounded-2xl bg-emerald-500 text-white space-y-1 shadow-md shadow-emerald-600/30">
                <span className="font-black text-white flex items-center space-x-1.5 text-xs uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4 text-white flex-shrink-0" />
                  <span>Consumer Food Safety Directive</span>
                </span>
                <p className="text-white/90 text-xs leading-normal font-medium">
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
