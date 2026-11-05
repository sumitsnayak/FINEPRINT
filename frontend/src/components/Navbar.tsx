import React from 'react';

interface NavbarProps {
  currentTab?: string;
  onNavigate?: (tab: string) => void;
  onOpenLogModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onNavigate }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-2xl border-b border-white/70 shadow-[0_4px_25px_rgba(0,0,0,0.03),inset_0_1px_0_rgba(255,255,255,0.95)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div
          onClick={() => onNavigate && onNavigate('landing')}
          className="cursor-pointer select-none"
        >
          <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            FINE<span className="text-emerald-600">PRINT</span>
          </span>
        </div>
      </div>
    </header>
  );
};
