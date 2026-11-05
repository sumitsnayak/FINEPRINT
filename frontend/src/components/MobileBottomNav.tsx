import React from 'react';
import { Home, BookOpen, Barcode, Scale, AlertTriangle } from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  onOpenLogModal?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onNavigate,
  onOpenLogModal,
}) => {
  return (
    <nav className="md:hidden fixed bottom-3 left-4 right-4 z-40 mac-dock rounded-full px-4 py-2">
      <div className="flex items-center justify-around">
        {/* Home */}
        <button
          onClick={() => onNavigate('landing')}
          className={`flex flex-col items-center py-1 px-2.5 transition-colors ${
            currentTab === 'landing' ? 'text-emerald-700' : 'text-slate-500 hover:text-emerald-600'
          }`}
        >
          <Home className={`w-5 h-5 ${currentTab === 'landing' ? 'stroke-[2.5px] text-emerald-700' : 'stroke-2'}`} />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Home</span>
        </button>

        {/* Food Database */}
        <button
          onClick={() => onNavigate('products')}
          className={`flex flex-col items-center py-1 px-2.5 transition-colors ${
            currentTab === 'products' ? 'text-emerald-700' : 'text-slate-500 hover:text-emerald-600'
          }`}
        >
          <BookOpen className={`w-5 h-5 ${currentTab === 'products' ? 'stroke-[2.5px] text-emerald-700' : 'stroke-2'}`} />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Foods</span>
        </button>

        {/* Center Elevated Food Scanner Button with macOS Glass Glow */}
        <button
          onClick={() => {
            if (onOpenLogModal) {
              onOpenLogModal();
            } else {
              onNavigate('scanner');
            }
          }}
          className="flex flex-col items-center -mt-6 group focus:outline-none"
        >
          <div className="w-13 h-13 p-3 rounded-full mac-gloss-btn text-white shadow-[0_0_20px_rgba(16,185,129,0.45)] ring-4 ring-white/90 group-active:scale-95 transition-transform flex items-center justify-center">
            <Barcode className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-[10px] font-black text-emerald-700 mt-1">Scan</span>
        </button>

        {/* Compare Safety */}
        <button
          onClick={() => onNavigate('compare')}
          className={`flex flex-col items-center py-1 px-2.5 transition-colors ${
            currentTab === 'compare' ? 'text-emerald-700' : 'text-slate-500 hover:text-emerald-600'
          }`}
        >
          <Scale className={`w-5 h-5 ${currentTab === 'compare' ? 'stroke-[2.5px] text-emerald-700' : 'stroke-2'}`} />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Compare</span>
        </button>

        {/* Report Unsafe Food */}
        <button
          onClick={() => onNavigate('report')}
          className={`flex flex-col items-center py-1 px-2.5 transition-colors ${
            currentTab === 'report' ? 'text-rose-600' : 'text-slate-500 hover:text-rose-600'
          }`}
        >
          <AlertTriangle className={`w-5 h-5 ${currentTab === 'report' ? 'stroke-[2.5px] text-rose-600' : 'stroke-2'}`} />
          <span className="text-[10px] font-bold tracking-tight mt-0.5">Report</span>
        </button>
      </div>
    </nav>
  );
};
