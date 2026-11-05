import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getPlatform, PlatformType } from '../utils/deviceDetect';
import { Download, Smartphone, Monitor, Apple, Check, X } from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { lockScroll, unlockScroll } from '../utils/scrollLock';

export const PlatformInstallBanner: React.FC = () => {
  const [platformInfo, setPlatformInfo] = useState(getPlatform());
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [installed, setInstalled] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    setPlatformInfo(getPlatform());

    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setDeferredPrompt(null);
      sounds.playSafeChime();
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    sounds.playClick();
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowModal(true);
    }
  };

  useEffect(() => {
    if (showModal) {
      lockScroll();
      return () => {
        unlockScroll();
      };
    }
  }, [showModal]);

  if (platformInfo.isPWA || installed || dismissed) {
    return null;
  }

  const getPlatformIcon = (type: PlatformType) => {
    switch (type) {
      case 'ios':
        return <Apple className="w-4 h-4 text-emerald-700" />;
      case 'android':
        return <Smartphone className="w-4 h-4 text-emerald-700" />;
      case 'mac':
        return <Apple className="w-4 h-4 text-emerald-700" />;
      case 'windows':
        return <Monitor className="w-4 h-4 text-emerald-700" />;
      default:
        return <Download className="w-4 h-4 text-emerald-700" />;
    }
  };

  return (
    <>
      {/* Sleek Floating Cross-Platform App Pill */}
      <aside aria-label="App installation banner" className="sticky top-16 z-30 bg-emerald-50/95 backdrop-blur-md border-b border-emerald-200/80 py-2 px-4 animate-in slide-in-from-top duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm">
              {getPlatformIcon(platformInfo.platform)}
            </div>
            <span className="font-semibold text-slate-700">
              Install <strong className="text-emerald-900">FINEPRINT</strong> on {platformInfo.label}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleInstallClick}
              className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1 shadow-sm shadow-emerald-600/20 transition-all"
            >
              <Download className="w-3 h-3" />
              <span>Install App</span>
            </button>

            <button
              onClick={() => setDismissed(true)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Cross-Platform Guidance Modal */}
      {showModal && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200 select-text"
          onClick={() => setShowModal(false)}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => {
            if (e.target === e.currentTarget) e.preventDefault();
          }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 text-slate-900 relative z-10 max-h-[92dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ overscrollBehavior: 'contain' }}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm">
                  {getPlatformIcon(platformInfo.platform)}
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">Install FINEPRINT</h3>
                  <p className="text-xs text-slate-500">{platformInfo.label}</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs leading-relaxed">
              <p className="font-bold text-emerald-700 uppercase text-[10px] tracking-wider">
                Installation Instructions:
              </p>
              <p className="text-slate-700">{platformInfo.installInstructions}</p>
            </div>

            {/* Platform Feature Checklist */}
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-800">Fast Camera OCR for packaged food ingredients</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-800">Compatible with Android, iOS, macOS & Windows</span>
              </div>
              <div className="flex items-center space-x-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-800">FSSAI food safety and chemical additive ratings</span>
              </div>
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/25 cursor-pointer"
            >
              Got it, let's scan!
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
