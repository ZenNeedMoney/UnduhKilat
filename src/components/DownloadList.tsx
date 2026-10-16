import React from 'react';
import { 
  Play, 
  Pause, 
  Trash2, 
  Download, 
  Lock, 
  Info, 
  RotateCcw, 
  FileText, 
  Film, 
  Music, 
  Cpu, 
  Archive, 
  File, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Shield,
  Layers
} from 'lucide-react';
import { DownloadTask, DownloadStatus } from '../types';
import { formatBytes, formatSpeed, formatDuration, getExtension } from '../utils/formatters';

interface DownloadListProps {
  tasks: DownloadTask[];
  onPauseTask: (id: string) => void;
  onResumeTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onOpenDetail: (task: DownloadTask) => void;
  onSaveToDisk: (task: DownloadTask) => void;
  onEncryptTask: (task: DownloadTask) => void;
  onPauseAll: () => void;
  onResumeAll: () => void;
  onClearCompleted: () => void;
  onOpenAddModal: () => void;
}

export const DownloadList: React.FC<DownloadListProps> = ({
  tasks,
  onPauseTask,
  onResumeTask,
  onDeleteTask,
  onOpenDetail,
  onSaveToDisk,
  onEncryptTask,
  onPauseAll,
  onResumeAll,
  onClearCompleted,
  onOpenAddModal,
}) => {
  const getCategoryIcon = (category: DownloadTask['category']) => {
    switch (category) {
      case 'video':
        return <Film className="w-4 h-4 text-purple-500" />;
      case 'audio':
        return <Music className="w-4 h-4 text-emerald-500" />;
      case 'archive':
        return <Archive className="w-4 h-4 text-amber-500" />;
      case 'program':
        return <Cpu className="w-4 h-4 text-rose-500" />;
      case 'document':
        return <FileText className="w-4 h-4 text-blue-500" />;
      default:
        return <File className="w-4 h-4 text-neutral-400" />;
    }
  };

  const getStatusBadge = (status: DownloadStatus, scheduledTime?: string) => {
    switch (status) {
      case 'downloading':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Mengunduh
          </span>
        );
      case 'paused':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Dijeda
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Selesai
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:indigo-400">
            <Clock className="w-3.5 h-3.5" />
            Jadwal {scheduledTime || '01:00'}
          </span>
        );
      case 'queued':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500">
            <Layers className="w-3.5 h-3.5" />
            Antrean
          </span>
        );
      case 'error':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-3.5 h-3.5" />
            Gagal
          </span>
        );
    }
  };

  const hasDownloading = tasks.some(t => t.status === 'downloading');
  const hasPaused = tasks.some(t => t.status === 'paused');
  const hasCompleted = tasks.some(t => t.status === 'completed');

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-neutral-50 dark:bg-neutral-950 overflow-hidden">
      
      {/* Action Strip Above Table */}
      <div className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur">
        <div className="flex items-center gap-2">
          {hasDownloading && (
            <button
              onClick={onPauseAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 transition-colors"
            >
              <Pause className="w-3.5 h-3.5 text-amber-500" />
              <span>Jeda Semua</span>
            </button>
          )}

          {hasPaused && (
            <button
              onClick={onResumeAll}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700 transition-colors"
            >
              <Play className="w-3.5 h-3.5 text-emerald-500" />
              <span>Lanjutkan Semua</span>
            </button>
          )}

          {hasCompleted && (
            <button
              onClick={onClearCompleted}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan Selesai</span>
            </button>
          )}
        </div>

        <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono tabular-nums">
          {tasks.length} item {tasks.length > 0 && `· ${tasks.filter(t => t.status === 'downloading').length} aktif`}
        </div>
      </div>

      {/* Main Content Viewport */}
      <div className="flex-1 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="h-full min-h-[360px] flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/80 flex items-center justify-center text-neutral-400 mb-4">
              <Download className="w-7 h-7 text-blue-500" />
            </div>
            <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
              Tidak Ada Unduhan
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mb-5">
              Belum ada tugas unduhan dalam kategori ini. Salin URL file atau gunakan detektor link untuk memulai.
            </p>
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Tambah Unduhan Pertama</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800/80">
            {tasks.map((task) => {
              const percent = task.totalBytes > 0 
                ? Math.min(100, Math.round((task.downloadedBytes / task.totalBytes) * 100))
                : 0;

              return (
                <div
                  key={task.id}
                  className="group px-4 lg:px-6 py-3.5 hover:bg-white dark:hover:bg-neutral-900/60 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    
                    {/* File Info */}
                    <div className="flex items-start gap-3 min-w-0 lg:w-1/3">
                      <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 shrink-0 mt-0.5">
                        {getCategoryIcon(task.category)}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onOpenDetail(task)}
                            className="font-semibold text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 hover:text-blue-600 dark:hover:text-blue-400 truncate text-left transition-colors"
                            title={task.filename}
                          >
                            {task.filename}
                          </button>
                          
                          {task.isEncrypted && (
                            <span 
                              className="shrink-0 p-0.5 rounded text-amber-500 hover:text-amber-600" 
                              title="File terenkripsi dengan sandi AES-256"
                            >
                              <Lock className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </div>

                        {/* Unboxed Metadata with · separator */}
                        <div className="flex items-center flex-wrap gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                          <span>{getExtension(task.filename)}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">
                            {formatBytes(task.downloadedBytes)} / {formatBytes(task.totalBytes)}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{getStatusBadge(task.status, task.scheduledTime)}</span>
                          <span aria-hidden="true">·</span>
                          {task.url.startsWith('https://') ? (
                            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold" title="Koneksi Terenkripsi TLS/HTTPS Resmi">
                              HTTPS
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-semibold" title="Koneksi Tidak Terenkripsi (HTTP Polos)">
                              HTTP
                            </span>
                          )}
                          {/\.(exe|scr|bat|cmd|vbs|ps1|apk|msi)$/i.test(task.filename) && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium" title="Berkas program eksekutabel: Uji checksum sebelum eksekusi">
                                Biner
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Visual Segments */}
                    <div className="lg:w-1/3 flex flex-col justify-center space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono font-medium text-neutral-800 dark:text-neutral-200 tabular-nums">
                          {percent}%
                        </span>
                        
                        <div className="flex items-center gap-2 font-mono text-neutral-500 dark:text-neutral-400 tabular-nums">
                          {task.status === 'downloading' && (
                            <>
                              <span className="text-blue-600 dark:text-blue-400 font-semibold">
                                {formatSpeed(task.speed)}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>ETA {formatDuration(task.eta)}</span>
                            </>
                          )}
                          {task.status === 'completed' && (
                            <span className="text-emerald-600 dark:text-emerald-400">
                              Unduhan Berhasil
                            </span>
                          )}
                          {task.status === 'paused' && (
                            <span>Dijeda</span>
                          )}
                        </div>
                      </div>

                      {/* Continuous Progress Bar */}
                      <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden flex">
                        <div
                          className={`h-full transition-all duration-300 ${
                            task.status === 'completed'
                              ? 'bg-emerald-500'
                              : task.status === 'paused'
                              ? 'bg-amber-500'
                              : task.status === 'error'
                              ? 'bg-rose-500'
                              : 'bg-blue-600'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      {/* Multi-thread IDM-style segment chunks visualizer */}
                      {task.segments && task.segments.length > 0 && task.status !== 'completed' && (
                        <div className="flex items-center gap-1 pt-0.5">
                          {task.segments.map((seg) => (
                            <div 
                              key={seg.id}
                              className="flex-1 h-1 rounded-sm bg-neutral-200 dark:bg-neutral-800 overflow-hidden"
                              title={`Thread ${seg.id}: ${seg.progress}%`}
                            >
                              <div 
                                className={`h-full ${seg.active ? 'bg-blue-500 animate-pulse' : 'bg-neutral-400 dark:bg-neutral-600'}`}
                                style={{ width: `${seg.progress}%` }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions Strip */}
                    <div className="flex items-center justify-end gap-1.5 lg:w-1/4 shrink-0 pt-2 lg:pt-0">
                      
                      {/* Play / Pause Toggle */}
                      {task.status === 'downloading' ? (
                        <button
                          onClick={() => onPauseTask(task.id)}
                          className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
                          title="Jeda Unduhan"
                        >
                          <Pause className="w-4 h-4 text-amber-500" />
                        </button>
                      ) : task.status === 'completed' ? (
                        <button
                          onClick={() => onSaveToDisk(task)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-medium transition-colors"
                          title="Simpan File ke Disk / Unduh Nyata"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Buka / Simpan</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onResumeTask(task.id)}
                          className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors"
                          title="Lanjutkan Unduhan"
                        >
                          <Play className="w-4 h-4 text-emerald-500" />
                        </button>
                      )}

                      {/* File Encryption Button */}
                      {!task.isEncrypted && (
                        <button
                          onClick={() => onEncryptTask(task)}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                          title="Enkripsi file ini dengan kata sandi AES-256"
                        >
                          <Lock className="w-4 h-4" />
                        </button>
                      )}

                      {/* Detail Modal */}
                      <button
                        onClick={() => onOpenDetail(task)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Detail Segmen & Hash"
                      >
                        <Info className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Hapus dari Daftar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
