import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

interface NavbarProps {
  currentTab?: string;
  onNavigate?: (tab: string) => void;
  onOpenLogModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab = 'landing', onNavigate }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-2xl border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {currentTab !== 'landing' && onNavigate && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onNavigate('landing');
              }}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-emerald-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all hover:scale-105 active:scale-95 shadow-xs cursor-pointer mr-1"
              aria-label="Back to Home"
            >
              <ArrowLeft className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
              <span>Back to Home</span>
            </button>
          )}

          <div
            onClick={() => {
              sounds.playClick();
              onNavigate && onNavigate('landing');
            }}
            className="cursor-pointer select-none flex items-center space-x-2"
          >
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              FINE<span className="text-emerald-600">PRINT</span>
            </span>
          </div>
        </div>

        {/* Quick Back to Home link on right side if not on landing */}
        {currentTab !== 'landing' && onNavigate && (
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onNavigate('landing');
            }}
            className="text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors hidden sm:inline-flex items-center space-x-1"
          >
            <span>Return to Home</span>
          </button>
        )}
      </div>
    </header>
  );
};
