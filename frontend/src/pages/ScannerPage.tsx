import React, { useState } from 'react';
import { CameraScanner } from '../components/CameraScanner';
import { api } from '../services/api';
import { useScan } from '../context/ScanContext';
import {
  Sparkles,
  AlertCircle,
  Barcode as BarcodeIcon,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

interface ScannerPageProps {
  onScanCompleted: (result: any) => void;
  onNavigate: (tab: string) => void;
}

export const ScannerPage: React.FC<ScannerPageProps> = ({
  onScanCompleted,
}) => {
  const { setActiveScan } = useScan();

  // Review & Correction state
  const [extractedOcr, setExtractedOcr] = useState<any | null>(null);
  const [productName, setProductName] = useState('');
  const [ingredientsText, setIngredientsText] = useState('');
  const [fssaiLicense, setFssaiLicense] = useState('');
  const [nutritionInputs, setNutritionInputs] = useState<Record<string, number>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [barcodeError, setBarcodeError] = useState<string | null>(null);

  const handleOcrExtracted = (extractedData: any, rawText: string) => {
    setExtractedOcr(extractedData);
    setProductName(extractedData?.product_name || 'Scanned Packaged Food');
    setIngredientsText(extractedData?.ingredients_text || rawText || '');
    setFssaiLicense(extractedData?.fssai_license || '');
    setNutritionInputs(extractedData?.nutrition_facts || {});
  };

  const handleBarcodeSearch = async (code: string) => {
    setBarcodeError(null);
    try {
      const product = await api.getProductByBarcode(code);
      onScanCompleted(product);
    } catch (err: any) {
      setBarcodeError(
        err.response?.data?.detail || `No product found for barcode ${code}. You can scan its ingredient label instead.`
      );
    }
  };

  const handleStartAnalysis = async () => {
    if (!ingredientsText.trim()) {
      alert('Please provide or confirm the ingredient list to start analysis.');
      return;
    }
    setIsAnalyzing(true);
    try {
      const result = await api.analyzeLabel({
        product_name: productName,
        ingredients_text: ingredientsText,
        nutrition_facts: nutritionInputs,
        fssai_license: fssaiLicense,
      });
      setActiveScan(result);
      onScanCompleted(result);
    } catch {
      alert('Analysis failed. Please verify the input and try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold mb-2 shadow-xs">
          <span>🌿</span>
          <span>Instant OCR & AI Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Instant Food Scanner</h1>
        <p className="text-sm text-slate-500">
          Point camera at any packaged food label, upload an image, or enter a barcode.
        </p>
      </div>

      {/* Manual Barcode Lookup Strip */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-md flex items-center gap-2">
        <div className="pl-2 text-emerald-600">
          <BarcodeIcon className="w-5 h-5" />
        </div>
        <input
          type="text"
          value={barcodeInput}
          onChange={(e) => setBarcodeInput(e.target.value)}
          placeholder="Enter 13-digit EAN/UPC barcode (e.g. 8901058852345 for Maggi)..."
          className="flex-1 bg-transparent text-sm text-slate-900 focus:outline-none placeholder:text-slate-400 font-mono"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && barcodeInput.trim()) {
              handleBarcodeSearch(barcodeInput.trim());
            }
          }}
        />
        <button
          type="button"
          onClick={() => barcodeInput.trim() && handleBarcodeSearch(barcodeInput.trim())}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors shadow-md shadow-emerald-600/20"
        >
          Lookup Barcode
        </button>
      </div>

      {barcodeError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center space-x-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>{barcodeError}</span>
        </div>
      )}

      {/* Camera and Upload Scanner */}
      {!extractedOcr ? (
        <CameraScanner
          onOcrComplete={handleOcrExtracted}
          onBarcodeFound={handleBarcodeSearch}
        />
      ) : (
        /* Review & Correct OCR Extraction Panel */
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in text-slate-900">
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-700 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Text Extracted via OCR — Review & Verify</span>
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Confirm Ingredients & Nutrition
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ensure scientific accuracy: review and edit any unclear words before AI scoring.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setExtractedOcr(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-3 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Scan Again
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Product Name
              </label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
                <span>Ingredient List (Separated by commas)</span>
                <span className="text-emerald-700 font-semibold text-[11px]">Editable</span>
              </label>
              <textarea
                rows={4}
                value={ingredientsText}
                onChange={(e) => setIngredientsText(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 leading-relaxed font-sans transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  FSSAI License (Optional)
                </label>
                <input
                  type="text"
                  value={fssaiLicense}
                  onChange={(e) => setFssaiLicense(e.target.value)}
                  placeholder="14-digit FSSAI number"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Energy / Calories (kcal per 100g)
                </label>
                <input
                  type="number"
                  value={nutritionInputs.calories || ''}
                  onChange={(e) =>
                    setNutritionInputs({
                      ...nutritionInputs,
                      calories: e.target.value ? Number(e.target.value) : 0,
                    })
                  }
                  placeholder="e.g. 427"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-mono text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors"
                />
              </div>
            </div>

            {/* Nutrition Key Macros Quick Review */}
            <div className="pt-2">
              <span className="text-xs uppercase tracking-wider font-bold text-slate-500 block mb-2">
                Nutrient Table Values (per 100g)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">Protein (g)</span>
                  <input
                    type="number"
                    value={nutritionInputs.protein || ''}
                    onChange={(e) =>
                      setNutritionInputs({
                        ...nutritionInputs,
                        protein: e.target.value ? Number(e.target.value) : 0,
                      })
                    }
                    placeholder="0"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">Total Sugar (g)</span>
                  <input
                    type="number"
                    value={nutritionInputs.total_sugar || ''}
                    onChange={(e) =>
                      setNutritionInputs({
                        ...nutritionInputs,
                        total_sugar: e.target.value ? Number(e.target.value) : 0,
                      })
                    }
                    placeholder="0"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">Total Fat (g)</span>
                  <input
                    type="number"
                    value={nutritionInputs.total_fat || ''}
                    onChange={(e) =>
                      setNutritionInputs({
                        ...nutritionInputs,
                        total_fat: e.target.value ? Number(e.target.value) : 0,
                      })
                    }
                    placeholder="0"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>

                <div>
                  <span className="text-[11px] text-slate-500 block mb-1">Sodium (mg)</span>
                  <input
                    type="number"
                    value={nutritionInputs.sodium || ''}
                    onChange={(e) =>
                      setNutritionInputs({
                        ...nutritionInputs,
                        sodium: e.target.value ? Number(e.target.value) : 0,
                      })
                    }
                    placeholder="0"
                    className="w-full px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setExtractedOcr(null)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isAnalyzing}
              onClick={handleStartAnalysis}
              className="px-7 py-3 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/25 flex items-center space-x-2 text-sm disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>{isAnalyzing ? 'Analyzing Product...' : 'Start AI Food Intelligence'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
