import React, { useState, useEffect } from 'react';
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
  Globe2
} from 'lucide-react';
import { api } from '../services/api';
import { sounds } from '../utils/soundEffects';

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
      // Fallback articles will be retained if network drops
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

  const openArticle = (article: NewsArticle) => {
    sounds.playClick();
    setActiveArticle(article);
  };

  return (
    <section className="max-w-6xl mx-auto px-4 py-8 relative z-10">
      {/* Live Radar Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full mac-secondary-btn text-emerald-800 text-xs font-bold shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="tracking-wide">LIVE INDIA FOOD RADAR · DAILY UPDATES</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Live Food Safety Updates <br className="hidden sm:inline" />
            <span className="text-emerald-600">Across India & The World.</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            Real-time regulatory alerts, FSSAI quality drives, ingredient deception reports, and dietary guidelines updating daily.
          </p>
        </div>

        {/* Live Controls: Refresh & Categories */}
        <div className="flex flex-col sm:items-end gap-2.5">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={refreshing}
              onClick={() => fetchNews(true)}
              className="py-1.5 px-3 rounded-full mac-secondary-btn text-xs font-bold text-slate-700 flex items-center space-x-1.5 hover:text-emerald-700 transition-all disabled:opacity-50"
              title="Refresh live feeds"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-emerald-600' : ''}`} />
              <span>{refreshing ? 'Fetching Live...' : 'Refresh Feed'}</span>
            </button>

            <span className="text-[11px] font-mono text-slate-400 bg-slate-100/80 px-2.5 py-1 rounded-full border border-slate-200/60">
              {lastUpdated}
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 self-start sm:self-end">
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setSelectedCategory('all');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'apple-pill-btn text-white'
                  : 'mac-secondary-btn text-slate-600 hover:text-slate-900'
              }`}
            >
              All Live ({articles.length})
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setSelectedCategory('fssai');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === 'fssai'
                  ? 'apple-pill-btn text-white'
                  : 'mac-secondary-btn text-slate-600 hover:text-slate-900'
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
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === 'labeling'
                  ? 'apple-pill-btn text-white'
                  : 'mac-secondary-btn text-slate-600 hover:text-slate-900'
              }`}
            >
              Label Deceptions
            </button>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setSelectedCategory('health');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                selectedCategory === 'health'
                  ? 'apple-pill-btn text-white'
                  : 'mac-secondary-btn text-slate-600 hover:text-slate-900'
              }`}
            >
              Health Warnings
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && articles.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="glass-card rounded-[32px] p-6 space-y-4 animate-pulse h-80 flex flex-col justify-between"
            >
              <div className="h-44 bg-slate-200/70 rounded-2xl w-full" />
              <div className="space-y-2">
                <div className="h-4 bg-slate-200/80 rounded w-1/3" />
                <div className="h-5 bg-slate-200/90 rounded w-4/5" />
                <div className="h-3 bg-slate-200/60 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Real-Time Bento Grid News Cards */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredArticles.map((article) => (
            <div
              key={article.id}
              onClick={() => openArticle(article)}
              className="glass-card hover:glass-card-glow rounded-[32px] overflow-hidden group cursor-pointer transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between border border-white/80 shadow-md"
            >
              {/* Visual Thumbnail & Badges */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

                {/* Specular Top Reflection */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

                {/* Badges on Top */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-emerald-300 font-mono text-[10px] font-bold">
                    {article.tag}
                  </span>

                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] flex items-center space-x-1 font-semibold">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>{article.published_at}</span>
                  </span>
                </div>

                {/* Live Source & Stat Badge on Image Bottom */}
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="px-3.5 py-2 rounded-2xl bg-white/92 backdrop-blur-md border border-white/50 flex items-center justify-between shadow-lg">
                    <div className="min-w-0 pr-2">
                      <span className="font-mono font-black text-xs text-emerald-700 block leading-tight truncate">
                        {article.source}
                      </span>
                      <span className="text-[10px] text-slate-600 block truncate font-medium mt-0.5">
                        {article.stat_label}
                      </span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform shadow-xs">
                      <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Details */}
              <div className="p-5 sm:p-6 space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                      {article.category_label}
                    </span>
                    <span className="text-slate-300">·</span>
                    <span className="text-[10px] font-medium text-slate-400">
                      {article.source}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-emerald-800 transition-colors mt-0.5 leading-snug line-clamp-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                    {article.summary}
                  </p>
                </div>

                {/* Key Takeaway Chip */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 flex items-center space-x-1.5 truncate pr-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span className="truncate">{article.key_takeaway}</span>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 flex-shrink-0 group-hover:underline">
                    Read Brief
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Live Article Brief Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white/95 backdrop-blur-3xl rounded-[36px] p-6 sm:p-8 space-y-6 border border-white/80 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Specular Top Reflection */}
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-white/90 to-transparent pointer-events-none" />

            {/* Apple Circle Dismiss Button */}
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                setActiveArticle(null);
              }}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100/90 hover:bg-slate-200/90 border border-slate-200/60 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all hover:scale-105 active:scale-95 z-20 shadow-xs"
              aria-label="Close"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Header info */}
            <div className="space-y-2 relative z-10 pr-8">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold">
                  {activeArticle.tag}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {activeArticle.published_at} · Verified Source
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                {activeArticle.title}
              </h2>

              <div className="flex items-center space-x-2 text-xs text-emerald-800 font-bold">
                <Globe2 className="w-3.5 h-3.5" />
                <span>Published by {activeArticle.source}</span>
              </div>
            </div>

            {/* Stat Callout Banner */}
            <div className="p-4 rounded-3xl bg-emerald-50/80 border border-emerald-200/90 flex items-center space-x-3.5 relative z-10">
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
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed relative z-10">
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

            {/* Footer action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100 relative z-10">
              {activeArticle.link && (
                <a
                  href={activeArticle.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto py-2.5 px-4 rounded-2xl mac-secondary-btn text-emerald-800 text-xs font-bold inline-flex items-center justify-center space-x-1.5 hover:text-emerald-900 shadow-xs"
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
                className="w-full sm:w-auto py-2.5 px-6 rounded-2xl apple-pill-btn text-white text-xs font-bold"
              >
                Close Brief
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
