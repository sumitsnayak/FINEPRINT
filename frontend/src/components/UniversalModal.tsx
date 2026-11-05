import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, X } from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export interface UniversalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  icon?: React.ReactNode;
  backText?: string;
  onBack?: () => void;
  maxWidth?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export const UniversalModal: React.FC<UniversalModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200',
  icon,
  backText = 'Back',
  onBack,
  maxWidth = 'max-w-3xl',
  children,
  footer,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle ESC key to close
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

  if (!isOpen || !mounted) return null;

  const handleBack = () => {
    sounds.playClick();
    if (onBack) {
      onBack();
    } else {
      onClose();
    }
  };

  const handleClose = () => {
    sounds.playClick();
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-slate-950/70 backdrop-blur-xl flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full ${maxWidth} h-[92vh] sm:h-auto sm:max-h-[88vh] bg-white rounded-[28px] sm:rounded-[36px] flex flex-col shadow-2xl border border-slate-200/90 overflow-hidden animate-in zoom-in-95 duration-200 relative z-10`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Specular top sheen */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/70 to-transparent pointer-events-none z-10" />

        {/* Modal Header ALWAYS at top with sticky / fixed positioning */}
        <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-3.5 border-b border-slate-200 bg-white sticky top-0 z-30 flex-shrink-0 shadow-sm">
          {/* Top-Left Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center space-x-1 px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs font-black text-slate-800 hover:text-emerald-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-all hover:scale-105 active:scale-95 shadow-xs flex-shrink-0 cursor-pointer"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-700 stroke-[3]" />
            <span className="font-bold">{backText}</span>
          </button>

          {/* Title & Info */}
          <div className="flex-1 min-w-0 px-2 sm:px-4 text-center sm:text-left">
            {badge && (
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-black border mb-0.5 ${badgeColor}`}
              >
                {badge}
              </span>
            )}
            <div className="flex items-center justify-center sm:justify-start space-x-1.5 sm:space-x-2">
              {icon}
              <h2 className="text-sm sm:text-lg font-black text-slate-900 truncate tracking-tight">
                {title}
              </h2>
            </div>
            {subtitle && (
              <p className="text-[10px] sm:text-xs text-slate-500 truncate hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>

          {/* Top-Right Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 hover:text-slate-950 transition-all hover:scale-105 active:scale-95 shadow-xs flex-shrink-0 cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-slate-900 relative z-10 space-y-5">
          {children}
        </div>

        {/* Optional Modal Footer */}
        {footer && (
          <div className="p-4 sm:px-6 border-t border-slate-100 bg-slate-50/90 backdrop-blur-md relative z-20 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
