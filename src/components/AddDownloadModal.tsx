import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Download, 
  Link2, 
  Clock, 
  Lock, 
  Sparkles, 
  Check, 
  FolderDown,
  Layers,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  LockKeyhole
} from 'lucide-react';
import { DownloadTask, PriorityLevel } from '../types';
import { detectCategoryFromFilename, getFilenameFromUrl, formatBytes } from '../utils/formatters';
import { PRESET_DOWNLOADS } from '../data/mockDownloads';
import { validateDownloadUrl, sanitizeFilename, scanDownloadSecurity, evaluatePasswordStrength } from '../utils/security';

interface AddDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddDownload: (task: Partial<DownloadTask>, startImmediately: boolean) => void;
  initialUrl?: string;
}

export const AddDownloadModal: React.FC<AddDownloadModalProps> = ({
  isOpen,
  onClose,
  onAddDownload,
  initialUrl = ''
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [filename, setFilename] = useState('');
  const [category, setCategory] = useState<DownloadTask['category']>('other');
  const [priority, setPriority] = useState<PriorityLevel>('normal');
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('01:00');
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [password, setPassword] = useState('');
  const [estimatedSize, setEstimatedSize] = useState<number>(150000000); // 150 MB default
  const [urlValidationError, setUrlValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (initialUrl) {
      setUrl(initialUrl);
    }
  }, [initialUrl]);

  useEffect(() => {
    if (url.trim()) {
      const validation = validateDownloadUrl(url.trim());
      if (!validation.isValid) {
        setUrlValidationError(validation.error || 'URL tidak valid');
      } else {
        setUrlValidationError(null);
      }

      const parsedName = sanitizeFilename(getFilenameFromUrl(url.trim()));
      setFilename(parsedName);
      setCategory(detectCategoryFromFilename(parsedName));
    } else {
      setUrlValidationError(null);
    }
  }, [url]);

  // Live security scan of url and filename
  const securityScan = useMemo(() => {
    if (!url.trim()) return null;
    return scanDownloadSecurity(url.trim(), filename || 'file.bin');
  }, [url, filename]);

  // Password strength meter
  const passwordStrength = useMemo(() => {
    return evaluatePasswordStrength(password);
  }, [password]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent, startImmediately: boolean) => {
    e.preventDefault();
    if (!url.trim()) return;

    // Strict validation
    const validation = validateDownloadUrl(url.trim());
    if (!validation.isValid) {
      setUrlValidationError(validation.error || 'URL tidak valid');
      return;
    }

    const cleanName = sanitizeFilename(filename.trim() || getFilenameFromUrl(url.trim()));

    const newTask: Partial<DownloadTask> = {
      url: validation.sanitizedUrl,
      filename: cleanName,
      category,
      priority,
      totalBytes: estimatedSize,
      downloadedBytes: 0,
      status: isScheduled ? 'scheduled' : startImmediately ? 'downloading' : 'queued',
      scheduledTime: isScheduled ? scheduledTime : undefined,
      isEncrypted,
      encryptionPassword: isEncrypted ? password : undefined,
      createdAt: Date.now(),
    };

    onAddDownload(newTask, startImmediately && !isScheduled);
    onClose();
  };

  const handleSelectPreset = (preset: typeof PRESET_DOWNLOADS[0]) => {
    setUrl(preset.url);
    const cleanName = sanitizeFilename(getFilenameFromUrl(preset.url));
    setFilename(cleanName);
    setCategory(preset.category);
    setEstimatedSize(preset.size);
    setUrlValidationError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Tambah Unduhan Baru
              </h2>
              <p className="text-xs text-neutral-500">
                Masukkan tautan file atau pilih berkas pengujian
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

        {/* Form Body */}
        <form onSubmit={(e) => handleSubmit(e, true)} className="p-6 space-y-4 overflow-y-auto">
          
          {/* Quick Presets Strip */}
          <div>
            <div className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Contoh Berkas Pengujian Cepat:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_DOWNLOADS.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => handleSelectPreset(preset)}
                  className="px-2.5 py-1 text-xs rounded-md bg-neutral-100 dark:bg-neutral-800 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/50 dark:hover:text-blue-300 text-neutral-700 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-700/80 transition-colors"
                >
                  {preset.name.split(' (')[0]} ({formatBytes(preset.size)})
                </button>
              ))}
            </div>
          </div>

          {/* URL Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-blue-500" />
              URL Tautan File
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/files/archive.zip"
              className={`w-full px-3 py-2 text-xs rounded-lg bg-neutral-50 dark:bg-neutral-800 border ${
                urlValidationError 
                  ? 'border-rose-500 focus:ring-rose-500' 
                  : 'border-neutral-300 dark:border-neutral-700 focus:ring-blue-500'
              } text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2`}
            />

            {urlValidationError && (
              <div className="flex items-center gap-1.5 text-[11px] text-rose-600 dark:text-rose-400 font-medium pt-0.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{urlValidationError}</span>
              </div>
            )}
          </div>

          {/* Filename & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Nama File Simpan
              </label>
              <input
                type="text"
                required
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                placeholder="nama_file.ext"
                className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DownloadTask['category'])}
                className="w-full px-3 py-2 text-xs rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="document">Dokumen (.pdf, .docx, .xlsx)</option>
                <option value="video">Video (.mp4, .mkv, .webm)</option>
                <option value="audio">Musik & Audio (.mp3, .flac)</option>
                <option value="archive">Arsip / Disk (.zip, .rar, .iso)</option>
                <option value="program">Program (.exe, .dmg, .apk)</option>
                <option value="other">Lainnya</option>
              </select>
            </div>
          </div>

          {/* Live Security & Threat Scanner Box */}
          {securityScan && (
            <div className={`p-3 rounded-xl border text-xs space-y-1.5 ${
              securityScan.riskLevel === 'danger'
                ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800/80 text-rose-900 dark:text-rose-200'
                : securityScan.riskLevel === 'caution'
                ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/80 text-amber-900 dark:text-amber-200'
                : 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200'
            }`}>
              <div className="flex items-center justify-between font-semibold text-[11px]">
                <div className="flex items-center gap-1.5">
                  {securityScan.riskLevel === 'danger' ? (
                    <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  ) : securityScan.riskLevel === 'caution' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  )}
                  <span>
                    {securityScan.riskLevel === 'danger'
                      ? 'Peringatan Keamanan Tinggi'
                      : securityScan.riskLevel === 'caution'
                      ? 'Pemeriksaan Keamanan: Perlu Perhatian'
                      : 'Audit Keamanan: Tervalidasi Aman'}
                  </span>
                </div>

                <span className="font-mono text-[10px] uppercase font-bold">
                  Protokol: {securityScan.protocol.toUpperCase()}
                </span>
              </div>

              {securityScan.warnings.length > 0 && (
                <div className="space-y-1 text-[11px] pt-1">
                  {securityScan.warnings.map((w, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="font-bold">•</span>
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              )}

              {securityScan.recommendations.length > 0 && (
                <div className="text-[10px] opacity-80 pt-0.5">
                  Saran: {securityScan.recommendations.join(' ')}
                </div>
              )}
            </div>
          )}

          {/* Priority & Scheduling Strip */}
          <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 space-y-3">
            
            {/* Priority Selector */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                Prioritas Antrean:
              </span>
              <div className="flex items-center gap-1">
                {(['low', 'normal', 'high'] as PriorityLevel[]).map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded capitalize transition-colors ${
                      priority === p 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    {p === 'low' ? 'Rendah' : p === 'normal' ? 'Normal' : 'Tinggi'}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule Option */}
            <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-700/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isScheduled}
                    onChange={(e) => setIsScheduled(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <Clock className="w-3.5 h-3.5 text-indigo-500" />
                  Jadwalkan di Jam Hemat Kuota
                </label>
                {isScheduled && (
                  <input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="px-2 py-0.5 text-xs rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 font-mono"
                  />
                )}
              </div>
              {isScheduled && (
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 pl-5">
                  Unduhan akan menunggu di antrean dan otomatis mulai pada pukul {scheduledTime} saat kuota malam aktif.
                </p>
              )}
            </div>

            {/* AES-256 Encryption Option */}
            <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-700/60">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isEncrypted}
                    onChange={(e) => setIsEncrypted(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <Lock className="w-3.5 h-3.5 text-amber-500" />
                  Enkripsi File dengan Sandi (AES-256-GCM)
                </label>
              </div>

              {isEncrypted && (
                <div className="pl-5 space-y-2">
                  <input
                    type="password"
                    required={isEncrypted}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi pengaman file..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100"
                  />

                  {/* Password Strength Meter */}
                  {password && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-neutral-500">Kekuatan Sandi:</span>
                        <span className={`font-semibold ${passwordStrength.color}`}>
                          {passwordStrength.label} ({passwordStrength.feedback})
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordStrength.score >= 80 
                              ? 'bg-emerald-500' 
                              : passwordStrength.score >= 50 
                              ? 'bg-blue-500' 
                              : passwordStrength.score >= 30 
                              ? 'bg-amber-500' 
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${passwordStrength.score}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <p className="text-[11px] text-amber-600 dark:text-amber-400">
                    File dienkripsi lokal dengan kunci AES 256-bit dan PBKDF2 250,000 iterasi. Hanya dapat dibuka dengan sandi ini.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={(e) => handleSubmit(e, false)}
              className="px-4 py-2 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Masukkan Antrean</span>
            </button>

            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Sekarang</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
