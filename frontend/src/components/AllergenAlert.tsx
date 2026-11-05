import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface AllergenAlertProps {
  alerts: Array<{
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    title: string;
    message: string;
  }>;
}

export const AllergenAlert: React.FC<AllergenAlertProps> = ({ alerts }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="space-y-2 mb-6">
      {alerts.map((alert, idx) => {
        const isCritical = alert.severity === 'CRITICAL';
        const isWarning = alert.severity === 'WARNING';

        return (
          <div
            key={idx}
            className={`p-4 rounded-2xl border flex items-start space-x-3 transition-all shadow-sm ${
              isCritical
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : isWarning
                ? 'bg-amber-50 border-amber-300 text-amber-900'
                : 'bg-emerald-50 border-emerald-300 text-emerald-900'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {isCritical ? (
                <AlertCircle className="w-5 h-5 text-rose-600 animate-pulse" />
              ) : isWarning ? (
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              ) : (
                <Info className="w-5 h-5 text-emerald-600" />
              )}
            </div>
            <div className="flex-1 text-sm">
              <h4 className="font-bold mb-0.5 text-slate-900">{alert.title}</h4>
              <p className="opacity-90 text-xs sm:text-sm text-slate-700">{alert.message}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
