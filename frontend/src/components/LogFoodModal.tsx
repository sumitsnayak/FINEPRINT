import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  ArrowLeft,
  Upload,
  Camera,
  Barcode,
  Search,
  Sparkles,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { lockScroll, unlockScroll } from '../utils/scrollLock';

interface LogFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (action: 'scan' | 'capture' | 'import' | 'describe' | 'search') => void;
}

export const LogFoodModal: React.FC<LogFoodModalProps> = ({
  isOpen,
  onClose,
  onSelectAction,
}) => {
  useEffect(() => {
    if (isOpen) {
      lockScroll();
      return () => {
        unlockScroll();
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        sounds.playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 select-text animate-in fade-in duration-200"
      onClick={onClose}
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
      role="dialog"
      aria-modal="true"
    >
      {/* Floating Close Button */}
      <button
        type="button"
        onClick={onClose}
        className="w-10 h-10 rounded-full bg-white hover:bg-slate-100 text-slate-800 shadow-xl border border-slate-200 flex items-center justify-center transition-all hover:scale-110 mb-3 z-10 active:scale-95 cursor-pointer"
        aria-label="Close"
      >
        <X className="w-5 h-5 stroke-[2.5]" />
      </button>

      {/* Main Elevated White Sheet */}
      <div
        className="w-full sm:max-w-md max-h-[92dvh] sm:max-h-[88vh] bg-white text-slate-900 rounded-t-[36px] sm:rounded-[36px] p-6 sm:p-7 space-y-4 shadow-2xl border border-slate-200 relative animate-in slide-in-from-bottom duration-300 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Top Header bar with Back button */}
        <div className="flex items-center justify-between pb-1">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200/60 transition-all hover:scale-105 active:scale-95 shadow-xs"
            aria-label="Back"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-slate-600" />
            <span>Back</span>
          </button>

          <div className="w-12 h-1.5 bg-slate-200 rounded-full sm:hidden" />

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 sm:hidden"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Modal Title */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            <ShieldCheck className="w-3 h-3 text-emerald-600" />
            <span>FINEPRINT Intelligence</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Scan & Log Food</h2>
        </div>

        {/* 3 Top Action Buttons */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectAction('import');
            }}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 transition-all group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-700 group-hover:text-emerald-700 shadow-xs border border-slate-200 mb-1.5">
              <Upload className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-xs font-bold text-slate-800">Import</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectAction('capture');
            }}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 transition-all group shadow-xs"
          >
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-700 group-hover:text-emerald-700 shadow-xs border border-slate-200 mb-1.5">
              <Camera className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-xs font-bold text-slate-800">Capture</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectAction('scan');
            }}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/30 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white mb-1.5">
              <Barcode className="w-5 h-5 stroke-[2]" />
            </div>
            <span className="text-xs font-bold text-white">Scan</span>
          </button>
        </div>

        {/* 2 Middle Row Buttons */}
        <div className="space-y-1.5 pt-1">
          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectAction('describe');
            }}
            className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 text-xs font-bold text-slate-800 flex items-center justify-between transition-all group shadow-xs"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-emerald-600">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-900 text-xs">AI Safety Query</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onSelectAction('search');
            }}
            className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 text-xs font-bold text-slate-800 flex items-center justify-between transition-all group shadow-xs"
          >
            <div className="flex items-center space-x-2.5">
              <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-emerald-600">
                <Search className="w-3.5 h-3.5" />
              </div>
              <span className="font-bold text-slate-900 text-xs">Search Foods</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Big Bottom Action Button */}
        <button
          type="button"
          onClick={() => {
            onClose();
            onSelectAction('scan');
          }}
          className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all active:scale-[0.98]"
        >
          <Camera className="w-4 h-4" />
          <span>Launch Scanner</span>
        </button>
      </div>
    </div>,
    document.body
  );
};
