import React from 'react';
import { CheckCircle2, AlertTriangle, X, Download, ShieldCheck } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'complete' | 'warning' | 'info' | 'encrypted';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface NotificationToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl shadow-black/10 flex items-start justify-between gap-3 animate-in slide-in-from-bottom-3 duration-300"
        >
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 shrink-0">
              {toast.type === 'complete' && (
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              )}
              {toast.type === 'warning' && (
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              )}
              {toast.type === 'encrypted' && (
                <ShieldCheck className="w-5 h-5 text-blue-500" />
              )}
              {toast.type === 'info' && (
                <Download className="w-5 h-5 text-blue-500" />
              )}
            </div>

            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                {toast.title}
              </h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {toast.description}
              </p>

              {toast.actionLabel && toast.onAction && (
                <button
                  onClick={() => {
                    toast.onAction?.();
                    onDismiss(toast.id);
                  }}
                  className="mt-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {toast.actionLabel}
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
