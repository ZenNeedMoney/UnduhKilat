import React, { useState } from 'react';
import { 
  X, 
  Globe2, 
  Bookmark, 
  ClipboardCheck, 
  ExternalLink, 
  Check, 
  Copy, 
  Sparkles,
  Zap,
  MousePointer
} from 'lucide-react';
import { generateBookmarkletCode } from '../utils/browserSniffer';

interface BrowserExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  clipboardDetectorActive: boolean;
  onToggleClipboardDetector: () => void;
}

export const BrowserExtensionModal: React.FC<BrowserExtensionModalProps> = ({
  isOpen,
  onClose,
  clipboardDetectorActive,
  onToggleClipboardDetector,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const appOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const bookmarkletCode = generateBookmarkletCode(appOrigin);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(bookmarkletCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Integrasi Browser & Deteksi Link Otomatis
              </h2>
              <p className="text-xs text-neutral-500">
                Tangkap link unduhan langsung dari Chrome, Edge, Firefox, dan Safari
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

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          
          {/* Method 1: Clipboard Auto-Detection */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-blue-500 shrink-0" />
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Deteksi Otomatis Clipboard (URL Sniffer)
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Otomatis menawarkan unduhan setiap kali Anda menyalin link berkas
                  </div>
                </div>
              </div>

              <button
                onClick={onToggleClipboardDetector}
                className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none shrink-0 ${
                  clipboardDetectorActive ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                    clipboardDetectorActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="text-[11px] text-neutral-500 bg-white dark:bg-neutral-900 p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-700/60">
              Setiap kali Anda menekan <kbd className="px-1 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 border font-mono">Ctrl+C</kbd> pada tautan (.mp4, .zip, .exe, .iso, .pdf), aplikasi akan otomatis menampilkan pop-up konfirmasi unduh cepat.
            </div>
          </div>

          {/* Method 2: 1-Click Bookmarklet */}
          <div className="space-y-3">
            <div className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <Bookmark className="w-4 h-4 text-amber-500" />
              Tombol Cepat Bookmarklet (IDM Browser Sniffer)
            </div>

            <p className="text-[11px] text-neutral-500">
              Tarik tombol di bawah ini langsung ke <strong>Bilah Bookmark (Bookmarks Bar)</strong> browser Anda:
            </p>

            {/* Draggable Bookmarklet Button */}
            <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-950/30 border-2 border-dashed border-blue-300 dark:border-blue-800/80 text-center space-y-2">
              <div className="inline-block">
                <a
                  href={bookmarkletCode}
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Tarik tombol ini ke bilah bookmark (Ctrl+Shift+B) di atas browser Anda.');
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 cursor-grab active:cursor-grabbing transition-all select-none"
                  title="Tarik tombol ini ke Bookmark Bar browser"
                >
                  <MousePointer className="w-4 h-4" />
                  <span>📥 Unduh dengan UnduhKilat</span>
                </a>
              </div>
              <p className="text-[10px] text-neutral-500">
                Klik dan tahan lalu geser tombol ke atas ke bilah bookmark Anda
              </p>
            </div>

            {/* Manual Code Option */}
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-500">Atau salin kode JavaScript bookmarklet:</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  {copiedCode ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCode ? 'Tersalin!' : 'Salin Kode'}</span>
                </button>
              </div>

              <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 font-mono text-[10px] text-neutral-600 dark:text-neutral-300 truncate">
                {bookmarkletCode}
              </div>
            </div>
          </div>

          {/* Supported Formats */}
          <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 space-y-1">
            <span className="font-semibold text-neutral-700 dark:text-neutral-300 text-[11px] block">
              Format yang dideteksi otomatis oleh ekstensi:
            </span>
            <div className="text-[10px] text-neutral-500 font-mono">
              .zip, .rar, .7z, .iso, .mp4, .mkv, .webm, .mp3, .flac, .exe, .dmg, .apk, .pdf, .docx, .xlsx
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
          >
            Mengerti
          </button>
        </div>

      </div>
    </div>
  );
};
