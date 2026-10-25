import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { AlertState } from '../types/database';

interface AlertBannerProps {
  alert: AlertState | null;
  onDismiss: () => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ alert, onDismiss }) => {
  if (!alert) return null;

  const isSuccess = alert.type === 'success';
  const isError = alert.type === 'error';
  const isWarning = alert.type === 'warning';

  return (
    <div
      role="alert"
      className={`relative w-full rounded-xl p-4 transition-all duration-300 shadow-lg border ${
        isSuccess
          ? 'bg-teal-950/70 border-teal-500/50 text-teal-100 shadow-teal-950/30'
          : isError
          ? 'bg-rose-950/70 border-rose-500/50 text-rose-100 shadow-rose-950/30'
          : isWarning
          ? 'bg-amber-950/70 border-amber-500/50 text-amber-100 shadow-amber-950/30'
          : 'bg-slate-900/80 border-slate-700 text-slate-100 shadow-slate-950/30'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div className="mt-0.5 shrink-0">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-teal-400" />}
          {isError && <XCircle className="w-5 h-5 text-rose-400" />}
          {isWarning && <AlertTriangle className="w-5 h-5 text-amber-400" />}
          {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-blue-400" />}
        </div>

        <div className="flex-1 pr-6">
          <h4 className="text-sm font-semibold tracking-wide">
            {alert.title}
            {alert.id && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-mono bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Ref #{alert.id}
              </span>
            )}
          </h4>
          <p className="mt-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
            {alert.message}
          </p>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
