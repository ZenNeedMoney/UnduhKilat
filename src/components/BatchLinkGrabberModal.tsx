import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  Search, 
  CheckSquare, 
  Square, 
  Plus, 
  Film, 
  Music, 
  Archive, 
  Cpu, 
  FileText, 
  File, 
  DownloadCloud,
  Sparkles
} from 'lucide-react';
import { extractLinksFromText, DetectedLink } from '../utils/browserSniffer';
import { DownloadTask } from '../types';

interface BatchLinkGrabberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMultiple: (tasks: Partial<DownloadTask>[]) => void;
}

const SAMPLE_PAGE_SOURCE = `
<!-- Contoh Tautan Halaman Arsip & Rilis -->
<a href="https://releases.ubuntu.com/24.04/ubuntu-24.04-live-server-amd64.iso">Download Server ISO</a>
<a href="https://example.com/media/sample_presentation_2026.pdf">Panduan Lengkap PDF</a>
<a href="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4">HD Movie Sample</a>
<a href="https://example.org/dist/tools_v3_bundle.zip">Paket Arsip Zip</a>
<a href="https://example.org/audio/podcast_episode_104.mp3">Podcast MP3 Audio</a>
<a href="https://github.com/app/releases/download/v1.0/setup-installer.exe">Installer App</a>
`;

export const BatchLinkGrabberModal: React.FC<BatchLinkGrabberModalProps> = ({
  isOpen,
  onClose,
  onAddMultiple,
}) => {
  const [inputText, setInputText] = useState('');
  const [detectedLinks, setDetectedLinks] = useState<DetectedLink[]>([]);
  const [selectedUrls, setSelectedUrls] = useState<Set<string>>(new Set());
  const [filterExt, setFilterExt] = useState<string>('all');
  const [hasScanned, setHasScanned] = useState(false);

  if (!isOpen) return null;

  const handleScan = () => {
    if (!inputText.trim()) return;
    const links = extractLinksFromText(inputText);
    setDetectedLinks(links);
    setSelectedUrls(new Set(links.map(l => l.url)));
    setHasScanned(true);
  };

  const handleLoadSample = () => {
    setInputText(SAMPLE_PAGE_SOURCE.trim());
  };

  const toggleSelectUrl = (url: string) => {
    const next = new Set(selectedUrls);
    if (next.has(url)) next.delete(url);
    else next.add(url);
    setSelectedUrls(next);
  };

  const toggleSelectAll = () => {
    if (selectedUrls.size === filteredLinks.length) {
      setSelectedUrls(new Set());
    } else {
      setSelectedUrls(new Set(filteredLinks.map(l => l.url)));
    }
  };

  const filteredLinks = detectedLinks.filter(item => {
    if (filterExt === 'all') return true;
    return item.category === filterExt;
  });

  const handleImportSelected = () => {
    const toImport = detectedLinks.filter(l => selectedUrls.has(l.url));
    const newTasks: Partial<DownloadTask>[] = toImport.map(item => ({
      url: item.url,
      filename: item.filename,
      category: item.category,
      totalBytes: item.category === 'video' ? 450000000 : item.category === 'archive' ? 850000000 : 35000000,
      downloadedBytes: 0,
      status: 'queued',
      priority: 'normal',
      isEncrypted: false,
      createdAt: Date.now(),
    }));

    onAddMultiple(newTasks);
    onClose();
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'video': return <Film className="w-3.5 h-3.5 text-purple-500" />;
      case 'audio': return <Music className="w-3.5 h-3.5 text-emerald-500" />;
      case 'archive': return <Archive className="w-3.5 h-3.5 text-amber-500" />;
      case 'program': return <Cpu className="w-3.5 h-3.5 text-rose-500" />;
      case 'document': return <FileText className="w-3.5 h-3.5 text-blue-500" />;
      default: return <File className="w-3.5 h-3.5 text-neutral-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Pendeteksi & Penjaring Link Web (Link Grabber)
              </h2>
              <p className="text-xs text-neutral-500">
                Pindai teks atau kode sumber halaman web untuk mengekstrak semua tautan berkas otomatis
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
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          
          {/* Input Textarea Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Tempel Sumber Halaman, Teks, atau Daftar URL:
              </label>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                Coba Contoh Teks Halaman
              </button>
            </div>

            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tempel tautan HTML, daftar link, atau teks dari browser di sini..."
              className="w-full p-2.5 text-xs font-mono rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleScan}
              disabled={!inputText.trim()}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-colors flex items-center gap-2"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Pindai Tautan Unduhan</span>
            </button>
          </div>

          {/* Results Area */}
          {hasScanned && (
            <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    Ditemukan {detectedLinks.length} Tautan Berkas
                  </span>
                  
                  {/* Category Filter */}
                  <select
                    value={filterExt}
                    onChange={(e) => setFilterExt(e.target.value)}
                    className="px-2 py-1 text-xs rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                  >
                    <option value="all">Semua Tipe</option>
                    <option value="video">Hanya Video</option>
                    <option value="audio">Hanya Audio</option>
                    <option value="archive">Hanya Arsip / ISO</option>
                    <option value="program">Hanya Program (.exe)</option>
                    <option value="document">Hanya Dokumen</option>
                  </select>
                </div>

                <button
                  onClick={toggleSelectAll}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  {selectedUrls.size === filteredLinks.length ? (
                    <>
                      <Square className="w-3.5 h-3.5" />
                      <span>Batal Pilih Semua</span>
                    </>
                  ) : (
                    <>
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>Pilih Semua</span>
                    </>
                  )}
                </button>
              </div>

              {filteredLinks.length === 0 ? (
                <div className="p-6 text-center text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                  Tidak ada tautan berkas yang cocok dengan filter yang dipilih.
                </div>
              ) : (
                <div className="max-h-56 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-neutral-50 dark:bg-neutral-800/40">
                  {filteredLinks.map((item) => {
                    const isSelected = selectedUrls.has(item.url);
                    return (
                      <div
                        key={item.url}
                        onClick={() => toggleSelectUrl(item.url)}
                        className="px-3 py-2 flex items-center justify-between gap-3 text-xs hover:bg-white dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}} // handled by row
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <div className="shrink-0">{getCategoryIcon(item.category)}</div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                              {item.filename}
                            </div>
                            <div className="text-[10px] text-neutral-400 truncate font-mono">
                              {item.url}
                            </div>
                          </div>
                        </div>

                        <span className="font-mono text-[10px] text-neutral-400 uppercase shrink-0">
                          {item.extension}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
          <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono tabular-nums">
            {selectedUrls.size} tautan dipilih
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            >
              Tutup
            </button>
            <button
              onClick={handleImportSelected}
              disabled={selectedUrls.size === 0}
              className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <DownloadCloud className="w-4 h-4" />
              <span>Impor {selectedUrls.size} ke Antrean</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
