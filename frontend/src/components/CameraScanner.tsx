import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Barcode, RefreshCw, Sparkles, SwitchCamera, Zap, CameraOff, X } from 'lucide-react';
import { api } from '../services/api';
import { Html5Qrcode } from 'html5-qrcode';
import { sounds } from '../utils/soundEffects';

interface CameraScannerProps {
  onOcrComplete: (extractedData: any, rawText: string, imageUrl?: string) => void;
  onBarcodeFound: (barcode: string) => void;
  initialMode?: 'label' | 'barcode' | 'upload';
  hideHeader?: boolean;
  onClose?: () => void;
  isLensPaused?: boolean;
  onLensPausedChange?: (paused: boolean) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({
  onOcrComplete,
  onBarcodeFound,
  initialMode = 'label',
  hideHeader = false,
  onClose,
  isLensPaused: isLensPausedProp,
  onLensPausedChange,
}) => {
  const [scanMode, setScanMode] = useState<'label' | 'barcode' | 'upload'>(initialMode);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [internalLensPaused, setInternalLensPaused] = useState<boolean>(false);
  const isPaused = isLensPausedProp !== undefined ? isLensPausedProp : internalLensPaused;

  const setPaused = (paused: boolean) => {
    if (onLensPausedChange) {
      onLensPausedChange(paused);
    } else {
      setInternalLensPaused(paused);
    }
  };
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const barcodeScannerRef = useRef<Html5Qrcode | null>(null);

  const startCamera = async (facing: 'environment' | 'user' = facingMode) => {
    setCameraError(null);
    try {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraActive(true);
      }
    } catch {
      // Fallback for laptop / Mac / Windows webcams if environment facingMode fails
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
        mediaStreamRef.current = fallbackStream;
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.play();
          setIsCameraActive(true);
        }
      } catch {
        setCameraError('Camera access not granted. You can upload an image or test with quick presets.');
        setIsCameraActive(false);
      }
    }
  };

  const flipCamera = () => {
    sounds.playClick();
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    startCamera(nextFacing);
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (barcodeScannerRef.current) {
      try {
        barcodeScannerRef.current.stop();
      } catch {}
      barcodeScannerRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleTurnOffCamera = () => {
    sounds.playClick();
    stopCamera();
    setPaused(true);
  };

  useEffect(() => {
    if (isPaused) {
      stopCamera();
      return;
    }

    if (scanMode === 'label') {
      startCamera(facingMode);
    } else if (scanMode === 'barcode') {
      startBarcodeScanner();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [scanMode, isPaused]);

  const startBarcodeScanner = async () => {
    stopCamera();
    try {
      const scanner = new Html5Qrcode('barcode-reader');
      barcodeScannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 180 } },
        (decodedText) => {
          sounds.playScanBeep();
          scanner.stop();
          onBarcodeFound(decodedText);
        },
        () => {}
      );
      setIsCameraActive(true);
    } catch {
      setCameraError('Barcode scanner could not access camera.');
      setIsCameraActive(false);
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    sounds.playScanBeep();

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 1280;
    canvas.height = videoRef.current.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'captured_label.jpg', { type: 'image/jpeg' });
      await processImageFile(file);
    }, 'image/jpeg', 0.95);
  };

  const processImageFile = async (file: File) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.uploadOcrImage(formData);
      stopCamera();
      sounds.playSafeChime();
      onOcrComplete(res.extracted_data, res.raw_text, res.image_url);
    } catch {
      sounds.playWarningBuzz();
      alert('Error extracting text from label image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerDemoPreset = (presetType: 'maggi' | 'lays' | 'parle' | 'butter') => {
    sounds.playScanBeep();
    let presetData: any = {};
    let rawText = '';

    if (presetType === 'maggi') {
      rawText = `MAGGI 2-MINUTE NOODLES - MASALA
Ingredients: Refined wheat flour (Maida), Palm oil, Iodised salt, Wheat gluten, Mineral (Calcium carbonate), Thickeners (508 & 412), Acidity regulators (501(i) & 500(i)) and Humectant (451(i)).
Masala Tastemaker: Hydrolysed groundnut protein, Mixed spices, Noodle powder, Sugar, Edible starch, Flavour enhancer (635), Palm oil, Thickener (508).
CONTAINS WHEAT AND NUT. MAY CONTAIN MILK AND SOYA.
Nutrition per 100g: Energy 427 kcal, Protein 8.0g, Carbohydrate 63.5g, Total Sugars 2.2g, Total Fat 15.7g, Saturated Fat 6.8g, Trans Fat 0.1g, Sodium 850mg.
FSSAI Lic. No. 10012011000168`;

      presetData = {
        product_name: 'Maggi 2-Minute Masala Instant Noodles',
        ingredients_text:
          'Refined wheat flour (Maida), Palm oil, Iodised salt, Wheat gluten, Mineral (Calcium carbonate), Thickeners (INS 508 & INS 412), Acidity regulators (INS 501(i) & INS 500(i)), Humectant (INS 451(i)), Hydrolysed groundnut protein, Spices, Flavour enhancer (INS 635)',
        allergens_declared: 'Contains Wheat and Nut. May contain Milk and Soya.',
        nutrition_facts: {
          calories: 427,
          protein: 8.0,
          carbs: 63.5,
          total_sugar: 2.2,
          added_sugar: 1.0,
          total_fat: 15.7,
          saturated_fat: 6.8,
          trans_fat: 0.1,
          sodium: 850,
        },
        fssai_license: '10012011000168',
      };
    } else if (presetType === 'lays') {
      presetData = {
        product_name: "Lay's India's Magic Masala Potato Chips",
        ingredients_text:
          'Potato, Edible Vegetable Oil (Palmolein, Rice Bran Oil), Seasoning, Iodised Salt, Sugar, Acidity Regulators (INS 330, INS 296), Flavour Enhancers (INS 627, INS 631), Antioxidant (INS 319)',
        allergens_declared: 'May contain Milk and Soy.',
        nutrition_facts: {
          calories: 544,
          protein: 6.9,
          carbs: 52.8,
          total_sugar: 3.5,
          added_sugar: 1.5,
          total_fat: 33.7,
          saturated_fat: 15.0,
          trans_fat: 0.1,
          sodium: 790,
        },
        fssai_license: '10014064000435',
      };
      rawText = "LAY'S MAGIC MASALA\nIngredients: Potato, Vegetable Oil, Seasoning";
    } else if (presetType === 'parle') {
      presetData = {
        product_name: 'Parle-G Original Gluco Biscuits',
        ingredients_text:
          'Refined Wheat Flour (Maida), Sugar, Refined Palm Oil, Invert Sugar Syrup, Raising Agents (INS 503(ii), INS 500(ii)), Iodised Salt, Milk Solids, Emulsifiers (INS 322 from Soy)',
        allergens_declared: 'Contains Wheat, Milk, Soy.',
        nutrition_facts: {
          calories: 465,
          protein: 6.5,
          carbs: 78.0,
          total_sugar: 26.5,
          added_sugar: 24.0,
          total_fat: 14.0,
          saturated_fat: 6.5,
          trans_fat: 0.0,
          sodium: 280,
        },
        fssai_license: '10013022002253',
      };
      rawText = 'PARLE-G GLUCO BISCUITS\nIngredients: Maida, Sugar, Palm Oil';
    } else {
      presetData = {
        product_name: 'Amul Pasteurised Salted Butter',
        ingredients_text: 'Butter (Milk Fat 80%), Common Salt, Permitted Natural Colour (INS 160a(i) Annatto)',
        allergens_declared: 'Contains Milk.',
        nutrition_facts: {
          calories: 722,
          protein: 0.5,
          carbs: 0.0,
          total_sugar: 0.0,
          added_sugar: 0.0,
          total_fat: 80.0,
          saturated_fat: 51.0,
          trans_fat: 1.8,
          sodium: 830,
        },
        fssai_license: '10012021000071',
      };
      rawText = 'AMUL SALTED BUTTER\nIngredients: Butter, Salt, Annatto\nContains Milk';
    }

    onOcrComplete(presetData, rawText);
  };

  return (
    <div className={`overflow-hidden ${hideHeader ? '' : 'glass-card rounded-[32px] p-5 space-y-4'}`}>
      {/* Mode Switcher (only shown if not embedded) */}
      {!hideHeader && (
        <div className="apple-segmented-track max-w-sm mx-auto flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setScanMode('label');
            }}
            className={`flex-1 py-1.5 px-3 rounded-full text-xs transition-all ${
              scanMode === 'label'
                ? 'apple-segmented-active'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            Label Camera
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setScanMode('barcode');
            }}
            className={`flex-1 py-1.5 px-3 rounded-full text-xs transition-all ${
              scanMode === 'barcode'
                ? 'apple-segmented-active'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            Barcode
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setScanMode('upload');
            }}
            className={`flex-1 py-1.5 px-3 rounded-full text-xs transition-all ${
              scanMode === 'upload'
                ? 'apple-segmented-active'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            Upload
          </button>
        </div>
      )}

      {/* Main View Area */}
      <div className={hideHeader ? '' : 'pt-2'}>
        {scanMode === 'label' && (
          isPaused ? (
            <div className="relative aspect-[4/3] sm:aspect-video bg-slate-950 rounded-3xl overflow-hidden flex flex-col items-center justify-center text-white border border-slate-800 p-6 text-center space-y-3.5 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shadow-inner">
                <CameraOff className="w-8 h-8 text-rose-400" />
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-sm sm:text-base text-white">Live Camera Lens Turned Off</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Camera hardware stream is paused. Click below to resume scanning.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setPaused(false);
                }}
                className="px-6 py-2.5 rounded-full apple-pill-btn text-white text-xs font-bold inline-flex items-center space-x-2 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Turn On Lens</span>
              </button>
            </div>
          ) : (
            <div className="relative aspect-[4/3] sm:aspect-video bg-slate-900 rounded-3xl overflow-hidden flex flex-col items-center justify-center text-white border border-slate-200">
              {isCameraActive ? (
                <>
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />

                  {/* Animated Holographic Laser Scanning Line */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div
                      className="w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_15px_#10b981] animate-pulse"
                      style={{
                        animation: 'bounce 2.5s infinite alternate ease-in-out'
                      }}
                    />
                  </div>

                  {/* Camera Viewfinder Overlay */}
                  <div className="absolute inset-8 sm:inset-12 border-2 border-emerald-400/90 rounded-2xl pointer-events-none flex flex-col justify-between p-4 shadow-[inset_0_0_20px_rgba(16,185,129,0.25)]">
                    <div className="flex justify-between items-center text-emerald-300 text-[10px] font-mono font-bold">
                      <span className="bg-black/60 px-2.5 py-0.5 rounded backdrop-blur-sm">[ ALIGN INGREDIENT LIST ]</span>
                      <span className="flex items-center space-x-1 bg-emerald-500/30 text-white px-2.5 py-0.5 rounded backdrop-blur-sm">
                        <Zap className="w-3 h-3 text-emerald-300" />
                        <span>FSSAI OCR</span>
                      </span>
                    </div>
                    <div className="text-center text-[11px] text-white/90 bg-black/75 py-1 px-4 rounded-full backdrop-blur-md self-center border border-white/10">
                      Hold steady under clear lighting
                    </div>
                  </div>

                  {/* Floating Controls: Flip Camera & Quick Lens Off */}
                  <div className="absolute top-4 right-4 flex items-center space-x-2 z-20">
                    <button
                      type="button"
                      onClick={flipCamera}
                      className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all shadow-md cursor-pointer"
                      title="Flip camera (front / rear)"
                    >
                      <SwitchCamera className="w-4 h-4" />
                    </button>
                    {!hideHeader && (
                      <button
                        type="button"
                        onClick={handleTurnOffCamera}
                        className="h-10 px-3 rounded-full bg-black/75 hover:bg-rose-950/90 text-rose-300 hover:text-white backdrop-blur-md border border-rose-500/50 hover:border-rose-400 flex items-center space-x-1.5 transition-all shadow-md cursor-pointer text-xs font-bold"
                        title="Turn off camera lens"
                        aria-label="Turn off camera lens"
                      >
                        <CameraOff className="w-4 h-4 text-rose-400" />
                        <span className="text-[11px] font-bold">Turn Off Lens</span>
                      </button>
                    )}
                  </div>

                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <button
                      type="button"
                      onClick={capturePhoto}
                      disabled={isProcessing}
                      className="w-16 h-16 rounded-full border-4 border-white/90 p-1 bg-white/20 backdrop-blur-md flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/50 cursor-pointer"
                      title="Capture photo and analyze ingredients"
                    >
                      <div className="w-full h-full rounded-full bg-emerald-500 flex items-center justify-center">
                        <Camera className="w-6 h-6 text-white" />
                      </div>
                    </button>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center max-w-sm space-y-4">
                  <div className="w-14 h-14 rounded-3xl bg-slate-800 text-emerald-400 mx-auto flex items-center justify-center shadow-md">
                    <Camera className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-black text-white mb-1 text-base">Camera Stream Ready</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {cameraError || 'Allow camera permission or test instantly with verified sample foods below.'}
                    </p>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      type="button"
                      onClick={() => startCamera(facingMode)}
                      className="px-6 py-3 apple-pill-btn text-white rounded-2xl text-xs font-bold inline-flex items-center space-x-2 cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4" />
                      <span>Start Camera</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        )}

        {scanMode === 'barcode' && (
          isPaused ? (
            <div className="relative aspect-[4/3] sm:aspect-video bg-slate-950 rounded-3xl overflow-hidden flex flex-col items-center justify-center text-white border border-slate-800 p-6 text-center space-y-3.5 animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 shadow-inner">
                <CameraOff className="w-8 h-8 text-rose-400" />
              </div>

              <div className="space-y-1">
                <h4 className="font-black text-sm sm:text-base text-white">Live Camera Lens Turned Off</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Camera hardware stream is paused. Click below to resume scanning food barcodes.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setPaused(false);
                }}
                className="px-6 py-2.5 rounded-full apple-pill-btn text-white text-xs font-bold inline-flex items-center space-x-2 shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Turn On Lens</span>
              </button>
            </div>
          ) : (
            <div className="relative aspect-[4/3] sm:aspect-video bg-black rounded-3xl overflow-hidden flex flex-col items-center justify-center text-white border border-slate-800 animate-in fade-in duration-200">
              <div id="barcode-reader" className="w-full h-full" />
              <div className="absolute top-4 text-center z-10 bg-black/80 px-4 py-1.5 rounded-full text-xs text-emerald-300 border border-emerald-500/30">
                Point camera at packaging 13-digit EAN barcode
              </div>

              {/* Quick Lens Off / Close Button (Only when standalone / no external header) */}
              {!hideHeader && (
                <button
                  type="button"
                  onClick={handleTurnOffCamera}
                  className="absolute top-3 right-3 z-30 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-black/80 hover:bg-rose-950/90 text-rose-300 hover:text-white border border-rose-500/50 hover:border-rose-400 backdrop-blur-md shadow-lg transition-all hover:scale-105 active:scale-95 text-xs font-bold cursor-pointer group"
                  title="Turn off camera lens"
                  aria-label="Turn off camera lens"
                >
                  <CameraOff className="w-3.5 h-3.5 text-rose-400 group-hover:text-rose-200" />
                  <span className="text-[11px] font-bold">Turn Off Lens</span>
                </button>
              )}
            </div>
          )
        )}

        {scanMode === 'upload' && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-emerald-500/30 hover:border-emerald-500/60 rounded-[30px] p-8 sm:p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-4 bg-slate-50/70 hover:bg-emerald-50/30"
          >
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-emerald-600 flex items-center justify-center shadow-sm">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Drop packaging label photo here</h4>
              <p className="text-xs text-slate-500 mt-1">Supports PNG, JPG, HEIC, WEBP from Android, iPhone, Mac & PC</p>
            </div>
            <button
              type="button"
              className="px-6 py-2.5 rounded-2xl text-xs font-bold apple-pill-btn text-white shadow-md shadow-emerald-600/20"
            >
              Browse Photo Library
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) processImageFile(file);
              }}
            />
          </div>
        )}

        {isProcessing && (
          <div className="mt-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-300 flex items-center space-x-3 text-slate-900 animate-pulse">
            <RefreshCw className="w-5 h-5 animate-spin text-emerald-600" />
            <div className="text-xs">
              <p className="font-bold text-emerald-900">Extracting label text with OCR...</p>
              <p className="text-slate-600">Decoding chemical additives, allergens, and FSSAI license</p>
            </div>
          </div>
        )}

        {/* 1-Click Instant Demo Presets */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Or Test Instantly with Verified Indian Packaged Foods:</span>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              type="button"
              onClick={() => triggerDemoPreset('maggi')}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-left group shadow-xs"
            >
              <span className="block font-bold text-xs text-slate-900 group-hover:text-emerald-700">Maggi Masala</span>
              <span className="block text-[10px] text-slate-500 mt-0.5">Rating: 6.8/10 (INS 635)</span>
            </button>

            <button
              type="button"
              onClick={() => triggerDemoPreset('lays')}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-left group shadow-xs"
            >
              <span className="block font-bold text-xs text-slate-900 group-hover:text-emerald-700">Lay's Chips</span>
              <span className="block text-[10px] text-slate-500 mt-0.5">Rating: 5.5/10 (Palmolein)</span>
            </button>

            <button
              type="button"
              onClick={() => triggerDemoPreset('parle')}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-left group shadow-xs"
            >
              <span className="block font-bold text-xs text-slate-900 group-hover:text-emerald-700">Parle-G Gluco</span>
              <span className="block text-[10px] text-slate-500 mt-0.5">Rating: 5.2/10 (Invert Sugar)</span>
            </button>

            <button
              type="button"
              onClick={() => triggerDemoPreset('butter')}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-left group shadow-xs"
            >
              <span className="block font-bold text-xs text-slate-900 group-hover:text-emerald-700">Amul Butter</span>
              <span className="block text-[10px] text-slate-500 mt-0.5">Rating: 8.0/10 (Clean 2 Ing.)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
