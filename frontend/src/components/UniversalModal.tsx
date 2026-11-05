import React, { useEffect } from 'react';
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

  if (!isOpen) return null;

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

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full ${maxWidth} h-full sm:h-auto sm:max-h-[90vh] bg-white/95 backdrop-blur-2xl sm:rounded-[32px] flex flex-col shadow-2xl border border-white/80 overflow-hidden animate-in zoom-in-95 duration-200 relative`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Specular top sheen */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-white/70 to-transparent pointer-events-none z-10" />

        {/* Modal Header with Back Button (Left), Title (Center), Close Button (Right) */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-md relative z-20 flex-shrink-0">
          {/* Top-Left Back Button */}
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100/90 hover:bg-slate-200 border border-slate-200/80 transition-all hover:scale-105 active:scale-95 shadow-xs flex-shrink-0"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>{backText}</span>
          </button>

          {/* Title & Info */}
          <div className="flex-1 min-w-0 px-3 sm:px-5 text-center sm:text-left">
            {badge && (
              <span
                className={`inline-block px-2 py-0.2 rounded-full text-[10px] font-mono font-bold border mb-0.5 ${badgeColor}`}
              >
                {badge}
              </span>
            )}
            <div className="flex items-center justify-center sm:justify-start space-x-2">
              {icon}
              <h2 className="text-base sm:text-lg font-black text-slate-900 truncate tracking-tight">
                {title}
              </h2>
            </div>
            {subtitle && (
              <p className="text-[11px] sm:text-xs text-slate-500 truncate hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>

          {/* Top-Right Close Button */}
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100/90 hover:bg-slate-200 border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all hover:scale-105 active:scale-95 shadow-xs flex-shrink-0"
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
    </div>
  );
};
