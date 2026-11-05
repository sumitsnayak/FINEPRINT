import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, X, CornerDownLeft } from 'lucide-react';
import { api } from '../services/api';
import { sounds } from '../utils/soundEffects';
import { ScoreBadge } from './ScoreBadge';

interface SpotlightFoodSearchProps {
  onSelectProduct: (productId: number) => void;
  onAnalyzeRawText: (text: string) => void;
}

export const SpotlightFoodSearch: React.FC<SpotlightFoodSearchProps> = ({
  onSelectProduct,
  onAnalyzeRawText,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const popularQuickSearches = [
    { label: 'Maggi Noodles', score: 6.8 },
    { label: 'Slurrp Farm Millets', score: 8.8 },
    { label: 'Parle-G', score: 5.2 },
    { label: 'INS 621 (MSG)', score: null },
    { label: 'Palm Oil', score: null },
  ];

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const items = await api.getProducts({ q: query.trim() });
        setResults(items.slice(0, 5));
      } catch (err) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (results.length > 0) {
      sounds.playSafeChime();
      onSelectProduct(results[0].id);
    } else {
      sounds.playScanBeep();
      onAnalyzeRawText(query);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input Box */}
      <form
        onSubmit={handleSubmit}
        className={`relative flex items-center bg-white border rounded-3xl p-2 transition-all duration-300 shadow-lg ${
          isFocused
            ? 'border-emerald-600 ring-4 ring-emerald-500/15 shadow-emerald-600/10'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="pl-4 pr-2 text-emerald-600 flex-shrink-0">
          <Search className="w-5 h-5" />
        </div>

        <input
          type="text"
          value={query}
          onFocus={() => {
            setIsFocused(true);
            sounds.playClick();
          }}
          onBlur={() => setTimeout(() => setIsFocused(false), 250)}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type any food brand, ingredient or chemical... (e.g. Maggi, Palm oil, INS 621)"
          className="flex-1 bg-transparent py-2 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
        />

        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 mr-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        <button
          type="submit"
          className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center space-x-1.5 transition-all flex-shrink-0 active:scale-95"
        >
          <span>Check Safety</span>
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </form>

      {/* Popular Chips Row */}
      {!query && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-3 text-xs">
          <span className="text-slate-500 text-[11px] font-bold">Trending Audits:</span>
          {popularQuickSearches.map((item, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setQuery(item.label);
                sounds.playClick();
              }}
              className="px-3 py-1 rounded-full bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 text-slate-700 hover:text-emerald-800 transition-all text-xs font-semibold flex items-center space-x-1.5 shadow-sm"
            >
              <span>{item.label}</span>
              {item.score && (
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full">
                  {item.score}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Live Dropdown Results */}
      {query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-3xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {loading ? (
            <div className="p-4 text-center text-xs text-slate-500">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-ping mr-2" />
              Searching verified food standards database...
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 px-3 py-1 block">
                Matching Verified Packaged Foods:
              </span>
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    sounds.playSafeChime();
                    onSelectProduct(product.id);
                  }}
                  className="p-3 rounded-2xl hover:bg-emerald-50/50 border border-transparent hover:border-emerald-100 transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <h5 className="font-bold text-slate-900 text-sm">{product.name}</h5>
                    <p className="text-xs text-slate-500">
                      {product.brand} · {product.category}
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <ScoreBadge score={product.overall_score} size="sm" />
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center space-y-2">
              <p className="text-xs text-slate-700 font-bold">
                "{query}" is not yet in our pre-indexed verified database.
              </p>
              <button
                type="button"
                onClick={() => {
                  sounds.playScanBeep();
                  onAnalyzeRawText(query);
                }}
                className="px-5 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors"
              >
                Run AI Food Safety Analysis on "{query}" →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
