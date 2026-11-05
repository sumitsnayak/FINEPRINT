import React, { useState } from 'react';
import {
  Barcode,
  Camera,
  Upload,
  ArrowRight,
  AlertCircle,
  Loader2,
  Sparkles,
  Search,
  X,
  ScanLine,
  CameraOff
} from 'lucide-react';
import { api } from '../services/api';
import { CameraScanner } from './CameraScanner';
import { sounds } from '../utils/soundEffects';

interface FrontPageBarcodeScannerProps {
  onScanResult: (result: any) => void;
}

export const FrontPageBarcodeScanner: React.FC<FrontPageBarcodeScannerProps> = ({
  onScanResult,
}) => {
  const [activeMode, setActiveMode] = useState<'camera' | 'barcode' | 'upload'>('barcode');
  const [barcodeInput, setBarcodeInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Apple-grade 1-click sample foods for Green, Yellow, and Red
  const sampleFoods = [
    {
      name: 'True Elements Oats',
      code: '8906074710014',
      badge: '9.4 Safe',
      type: 'green',
      dotColor: 'bg-emerald-400',
      ringColor: 'ring-emerald-400/40',
    },
    {
      name: 'Epigamia Greek Yogurt',
      code: '8906079980123',
      badge: '8.5 Clean',
      type: 'green',
      dotColor: 'bg-emerald-400',
      ringColor: 'ring-emerald-400/40',
    },
    {
      name: 'Parle-G Biscuits',
      code: '8901719101018',
      badge: '5.5 Average',
      type: 'yellow',
      dotColor: 'bg-amber-400',
      ringColor: 'ring-amber-400/40',
    },
    {
      name: 'Kurkure Masala',
      code: '8901491101833',
      badge: '4.2 Concern',
      type: 'red',
      dotColor: 'bg-rose-400',
      ringColor: 'ring-rose-400/40',
    },
    {
      name: 'Sting Energy Drink',
      code: '8902080000018',
      badge: '3.4 High Risk',
      type: 'red',
      dotColor: 'bg-rose-400',
      ringColor: 'ring-rose-400/40',
    },
  ];

  const handleLookup = async (codeToSearch: string) => {
    const cleanCode = codeToSearch.trim();
    if (!cleanCode) return;

    setError(null);
    setLoading(true);
    sounds.playScanBeep();

    try {
      const product = await api.getProductByBarcode(cleanCode);
      onScanResult(product);
    } catch (err: any) {
      setError(
        err.response?.data?.detail ||
          `No product found for barcode ${cleanCode}. Try one of the verified sample foods below.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCameraBarcodeFound = (barcode: string) => {
    sounds.playScanBeep();
    handleLookup(barcode);
  };

  const handleOcrExtracted = async (extractedData: any, rawText: string) => {
    setLoading(true);
    sounds.playScanBeep();
    try {
      const result = await api.analyzeLabel({
        product_name: extractedData?.product_name || 'Scanned Food Product',
        ingredients_text: extractedData?.ingredients_text || rawText,
        nutrition_facts: extractedData?.nutrition_facts,
        fssai_license: extractedData?.fssai_license,
      });
      onScanResult(result);
    } catch {
      setError('Could not inspect the uploaded label. Please try entering a barcode.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Apple-Grade Glossy Lens Container */}
      <div className="glass-card-glow rounded-[36px] p-5 sm:p-7 space-y-5 relative overflow-hidden shadow-2xl">
        {/* Specular Top-Light Gloss Highlight */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/80 via-white/30 to-transparent pointer-events-none" />

        {/* Apple iOS Mode Segmented Switcher: Live Lens first, then Barcode, then Upload */}
        <div className="apple-segmented-track max-w-xs mx-auto relative z-10 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              setActiveMode('camera');
              sounds.playClick();
            }}
            className={`flex-1 py-1.5 px-3 rounded-full text-xs transition-all duration-200 ${
              activeMode === 'camera'
                ? 'apple-segmented-active'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            Live Lens
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMode('barcode');
              sounds.playClick();
            }}
            className={`flex-1 py-1.5 px-3 rounded-full text-xs transition-all duration-200 ${
              activeMode === 'barcode'
                ? 'apple-segmented-active'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            Barcode
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveMode('upload');
              sounds.playClick();
            }}
            className={`flex-1 py-1.5 px-3 rounded-full text-xs transition-all duration-200 ${
              activeMode === 'upload'
                ? 'apple-segmented-active'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            Upload
          </button>
        </div>

        {/* Tab 1: Apple Barcode Viewfinder & Direct Search */}
        {activeMode === 'barcode' && (
          <div className="space-y-4 relative z-10 animate-in fade-in duration-200">
            {/* Apple Camera Viewfinder Visualizer */}
            <div className="apple-scanner-viewport relative w-full h-48 sm:h-52 rounded-[30px] flex items-center justify-center overflow-hidden">
              {/* Subtle Optical Micro-Grid (Apple Camera & LiDAR Sensor Style) */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none" />

              {/* Apple Sweeping Luminous Laser Beam */}
              <div className="apple-laser-beam" />

              {/* Top Camera HUD: Optical Sensor Status */}
              <div className="absolute top-3 inset-x-5 flex items-center justify-between pointer-events-none z-10">
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="tracking-wider">OPTICAL AI · MACRO</span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                  1x · 24mm
                </div>
              </div>

              {/* 4 Apple Precision Viewfinder Corner Brackets */}
              <div className="absolute inset-6 pointer-events-none">
                {/* Top-Left */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-emerald-400 rounded-tl-2xl shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
                {/* Top-Right */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-emerald-400 rounded-tr-2xl shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
                {/* Bottom-Left */}
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-emerald-400 rounded-bl-2xl shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
                {/* Bottom-Right */}
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-emerald-400 rounded-br-2xl shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
              </div>

              {/* Center Aiming Reticle (Apple Camera Focus Style) */}
              <div className="relative z-10 flex flex-col items-center justify-center space-y-2 text-center px-4">
                <div className="relative apple-reticle-pulse">
                  {/* Outer Focus Ring */}
                  <div className="w-16 h-16 rounded-full border border-emerald-400/40 flex items-center justify-center bg-emerald-950/20 backdrop-blur-sm shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    {/* Micro Crosshair Ticks */}
                    <div className="absolute top-0 w-0.5 h-1.5 bg-emerald-400" />
                    <div className="absolute bottom-0 w-0.5 h-1.5 bg-emerald-400" />
                    <div className="absolute left-0 w-1.5 h-0.5 bg-emerald-400" />
                    <div className="absolute right-0 w-1.5 h-0.5 bg-emerald-400" />

                    {/* Center Icon */}
                    <Barcode className="w-7 h-7 text-emerald-400 stroke-[1.75]" />
                  </div>
                </div>

                {/* Bottom Guidance Pill */}
                <div className="px-3.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium text-emerald-300 flex items-center space-x-1.5 shadow-sm">
                  <ScanLine className="w-3 h-3 text-emerald-400" />
                  <span>Align barcode within viewfinder</span>
                </div>
              </div>
            </div>

            {/* Apple-Grade Input & Action Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLookup(barcodeInput);
              }}
              className="flex flex-col sm:flex-row gap-2 pt-1"
            >
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
                  <Search className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  placeholder="Enter 13-digit barcode (e.g. 8901058852345)..."
                  className="w-full pl-10 pr-9 py-3 rounded-2xl bg-white/95 border border-slate-200/90 text-slate-900 placeholder:text-slate-400 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] transition-all"
                />
                {barcodeInput && (
                  <button
                    type="button"
                    onClick={() => setBarcodeInput('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || !barcodeInput.trim()}
                className="py-3 px-6 rounded-2xl apple-pill-btn text-white font-extrabold text-xs flex items-center justify-center space-x-1.5 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Scan Barcode</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Error Message */}
            {error && (
              <div className="p-3.5 rounded-2xl bg-rose-50/90 border border-rose-200/90 text-rose-700 text-xs flex items-center space-x-2 animate-in fade-in shadow-xs">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            {/* Apple 1-Click Food Sample Chips */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
                Tap to Inspect Sample Foods:
              </span>

              <div className="flex flex-wrap items-center justify-center gap-1.5">
                {sampleFoods.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => {
                      setBarcodeInput(item.code);
                      handleLookup(item.code);
                    }}
                    className="py-1.5 px-3 rounded-full mac-secondary-btn text-xs font-semibold text-slate-800 flex items-center space-x-1.5 hover:scale-105 active:scale-95 transition-all shadow-xs group"
                  >
                    <span className={`w-2 h-2 rounded-full ${item.dotColor} ring-2 ${item.ringColor}`} />
                    <span className="truncate max-w-[130px] group-hover:text-emerald-700 transition-colors">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">· {item.badge}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Live Camera Viewfinder */}
        {activeMode === 'camera' && (
          <div className="relative z-10 animate-in fade-in duration-200 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="flex items-center space-x-1.5 text-xs font-bold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Optical Scanner Active</span>
              </span>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setActiveMode('barcode');
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 hover:text-rose-900 border border-rose-200 text-xs font-bold transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95"
                title="Turn off camera lens"
              >
                <CameraOff className="w-3.5 h-3.5 text-rose-600" />
                <span>Turn Off Lens</span>
              </button>
            </div>

            <CameraScanner
              initialMode="barcode"
              hideHeader={true}
              onBarcodeFound={handleCameraBarcodeFound}
              onOcrComplete={handleOcrExtracted}
              onClose={() => {
                sounds.playClick();
                setActiveMode('barcode');
              }}
            />
          </div>
        )}

        {/* Tab 3: Upload Food Packaging Photo */}
        {activeMode === 'upload' && (
          <div className="relative z-10 animate-in fade-in duration-200 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-slate-700">
                Upload Food Packaging Image
              </span>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setActiveMode('barcode');
                }}
                className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer hover:scale-105 active:scale-95"
              >
                <X className="w-3.5 h-3.5" />
                <span>Back to Barcode</span>
              </button>
            </div>

            <CameraScanner
              initialMode="upload"
              hideHeader={true}
              onBarcodeFound={handleCameraBarcodeFound}
              onOcrComplete={handleOcrExtracted}
              onClose={() => {
                sounds.playClick();
                setActiveMode('barcode');
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
