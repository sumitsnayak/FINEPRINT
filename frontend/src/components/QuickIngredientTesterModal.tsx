import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { sounds } from '../utils/soundEffects';
import { ScoreBadge } from './ScoreBadge';

interface QuickIngredientTesterModalProps {
  isOpen: boolean;
  initialText?: string;
  onClose: () => void;
  onOpenFullReport: (scanResult: any) => void;
}

export const QuickIngredientTesterModal: React.FC<QuickIngredientTesterModalProps> = ({
  isOpen,
  initialText = '',
  onClose,
  onOpenFullReport,
}) => {
  const [inputText, setInputText] = useState(initialText);
  const [productName, setProductName] = useState('Custom Ingredient Audit');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleRunAnalysis = async () => {
    if (!inputText.trim()) return;
    setAnalyzing(true);
    sounds.playScanBeep();

    try {
      const data = await api.analyzeLabel({
        product_name: productName,
        ingredients_text: inputText,
        nutrition_facts: { calories: 350, protein: 6, total_fat: 14, total_sugar: 12, sodium: 620 },
      });
      setResult(data);
      if (data.overall_score >= 7.5) {
        sounds.playSafeChime();
      } else {
        sounds.playWarningBuzz();
      }
    } catch {
      alert('Analysis failed. Please check your ingredient text.');
    } finally {
      setAnalyzing(false);
    }
  };

  const sampleLists = [
    {
      title: 'Packaged Noodles',
      text: 'Refined wheat flour, Palm oil, Salt, INS 508, INS 412, Hydrolysed peanut protein, INS 635, Spices',
    },
    {
      title: 'Sweetened Biscuits',
      text: 'Maida, Sugar, Refined Palm Oil, Invert Sugar Syrup, INS 503(ii), Milk solids, Soy Lecithin',
    },
    {
      title: 'Millet Noodles (Clean)',
      text: 'Foxtail millet flour, Whole wheat flour, Salt, Cluster bean fiber, Turmeric, Cumin, Coriander',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-[32px] p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 text-slate-900 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900">Instant Food Safety Tester</h3>
              <p className="text-xs text-slate-500">Paste any ingredient list to calculate food safety in real time</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Text Area */}
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Ingredient List (Separated by commas)
            </label>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="e.g. Refined wheat flour, Palmolein oil, Sugar, Salt, INS 621, INS 102, Soy lecithin..."
              className="w-full p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 leading-relaxed"
            />
          </div>

          {/* Quick preset chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] text-slate-500 font-bold">Try Sample:</span>
            {sampleLists.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setInputText(s.text);
                  setProductName(s.title);
                  sounds.playClick();
                }}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-emerald-50 border border-slate-200 text-slate-700 hover:text-emerald-800 text-xs font-semibold transition-colors"
              >
                {s.title}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={analyzing || !inputText.trim()}
            onClick={handleRunAnalysis}
            className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/25 flex items-center justify-center space-x-2 disabled:opacity-50 transition-all active:scale-95"
          >
            {analyzing ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Consulting Food Safety Standards...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Calculate Safety Rating</span>
              </>
            )}
          </button>
        </div>

        {/* Analysis Results */}
        {result && (
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Food Safety Standard Score
                </span>
                <h4 className="text-xl font-black text-slate-900">{result.product_name}</h4>
                <p className="text-xs text-slate-500">Verdict: <strong className="text-emerald-700">{result.summary_verdict}</strong></p>
              </div>
              <ScoreBadge score={result.overall_score} size="ring" />
            </div>

            <p className="text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm">
              {result.ai_summary}
            </p>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenFullReport(result);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm"
              >
                <span>View Full Comprehensive Audit</span>
                <ArrowRight className="w-3.5 h-3.5 text-emerald-700" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
