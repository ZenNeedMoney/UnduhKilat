import React, { useState } from 'react';
import { 
  X, 
  Info, 
  Copy, 
  Check, 
  Download, 
  Pause, 
  Play, 
  Lock, 
  Layers, 
  CheckCircle2, 
  Hash, 
  HardDrive,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { DownloadTask } from '../types';
import { formatBytes, formatSpeed, formatDuration } from '../utils/formatters';

interface DownloadDetailModalProps {
  task: DownloadTask | null;
  onClose: () => void;
  onPause: (id: string) => void;
  onResume: (id: string) => void;
  onSaveToDisk: (task: DownloadTask) => void;
  onEncrypt: (task: DownloadTask) => void;
}

export const DownloadDetailModal: React.FC<DownloadDetailModalProps> = ({
  task,
  onClose,
  onPause,
  onResume,
  onSaveToDisk,
  onEncrypt,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  if (!task) return null;

  const percent = task.totalBytes > 0 
    ? Math.min(100, Math.round((task.downloadedBytes / task.totalBytes) * 100))
    : 0;

  const handleCopy = (text: string, type: 'url' | 'hash') => {
    navigator.clipboard.writeText(text);
    if (type === 'url') {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedHash(true);
      setTimeout(() => setCopiedHash(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
              <Info className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 truncate">
                {task.filename}
              </h2>
              <p className="text-xs text-neutral-500">
                Detail Segmen & Integritas Unduhan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Progress Header Box */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Status: {task.status.toUpperCase()}
                </span>
                {task.isEncrypted && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                    <Lock className="w-3 h-3" />
                    Terenkripsi AES
                  </span>
                )}
              </div>
              <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                {percent}%
              </span>
            </div>

            <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${
                  task.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-600'
                }`}
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="flex items-center justify-between font-mono text-[11px] text-neutral-500 tabular-nums">
              <span>{formatBytes(task.downloadedBytes)} / {formatBytes(task.totalBytes)}</span>
              {task.status === 'downloading' && (
                <span>{formatSpeed(task.speed)} · ETA {formatDuration(task.eta)}</span>
              )}
            </div>
          </div>

          {/* Multi-thread IDM-Style Segments Breakdown */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-semibold text-neutral-800 dark:text-neutral-200">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                Segmen Koneksi Simultan (Multi-Thread Chunks)
              </span>
              <span className="text-[11px] text-neutral-400 font-mono">
                {task.segments.length} Jalur
              </span>
            </div>

            <div className="space-y-1.5">
              {task.segments.map((seg) => (
                <div 
                  key={seg.id}
                  className="p-2 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-700/60 flex items-center justify-between gap-3 text-[11px]"
                >
                  <div className="flex items-center gap-2 min-w-[70px]">
                    <span className="font-mono font-medium text-neutral-700 dark:text-neutral-300">
                      Jalur #{seg.id}
                    </span>
                    {seg.active && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${seg.active ? 'bg-blue-500' : 'bg-neutral-400 dark:bg-neutral-500'}`}
                        style={{ width: `${seg.progress}%` }}
                      />
                    </div>
                  </div>

                  <span className="font-mono tabular-nums text-neutral-500 min-w-[40px] text-right">
                    {seg.progress}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* URL & Source Info */}
          <div className="space-y-1.5">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-blue-500" />
              Tautan Sumber Unduhan
            </span>
            <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between gap-2">
              <span className="font-mono text-[11px] text-neutral-600 dark:text-neutral-300 truncate">
                {task.url}
              </span>
              <button
                onClick={() => handleCopy(task.url, 'url')}
                className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 shrink-0"
                title="Salin Tautan"
              >
                {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Checksum SHA-256 */}
          {task.checksumSha256 && (
            <div className="space-y-1.5">
              <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-purple-500" />
                Checksum Integritas Berkas (SHA-256)
              </span>
              <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] text-neutral-600 dark:text-neutral-300 truncate">
                  {task.checksumSha256}
                </span>
                <button
                  onClick={() => handleCopy(task.checksumSha256!, 'hash')}
                  className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 shrink-0"
                  title="Salin Hash SHA-256"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer with Actions */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
          <div className="flex items-center gap-2">
            {task.status === 'downloading' ? (
              <button
                onClick={() => onPause(task.id)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 transition-colors flex items-center gap-1.5"
              >
                <Pause className="w-3.5 h-3.5 text-amber-500" />
                <span>Jeda Unduhan</span>
              </button>
            ) : task.status === 'paused' ? (
              <button
                onClick={() => onResume(task.id)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-300 transition-colors flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 text-emerald-500" />
                <span>Lanjutkan</span>
              </button>
            ) : null}

            {task.status === 'completed' && (
              <button
                onClick={() => onSaveToDisk(task)}
                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Simpan Berkas ke Disk</span>
              </button>
            )}

            {!task.isEncrypted && (
              <button
                onClick={() => {
                  onClose();
                  onEncrypt(task);
                }}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800/80 text-amber-700 dark:text-amber-400 hover:bg-amber-100 transition-colors flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Enkripsi Sekarang</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
