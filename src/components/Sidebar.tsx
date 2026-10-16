import React from 'react';
import { 
  FolderDown, 
  FileText, 
  Film, 
  Music, 
  Cpu, 
  Archive, 
  Clock, 
  Lock, 
  PlayCircle, 
  PauseCircle, 
  CheckCircle2, 
  Zap,
  Globe2,
  HardDrive,
  ShieldCheck
} from 'lucide-react';
import { FileCategory, DownloadStatus, BatteryState, SchedulerConfig, LicenseTier } from '../types';
import { formatBytes } from '../utils/formatters';
import { APP_VERSION, TIERS_CONFIG } from '../data/tierConfig';

interface SidebarProps {
  currentCategory: FileCategory;
  onSelectCategory: (cat: FileCategory) => void;
  statusFilter: DownloadStatus | 'all';
  onSelectStatusFilter: (status: DownloadStatus | 'all') => void;
  counts: Record<FileCategory, number>;
  statusCounts: {
    downloading: number;
    paused: number;
    completed: number;
  };
  totalDownloadedToday: number;
  quotaSavedMidnight: number;
  scheduler: SchedulerConfig;
  battery: BatteryState;
  currentTier: LicenseTier;
  onOpenVersionModal: () => void;
  onToggleBatterySaver: () => void;
  onOpenSchedulerModal: () => void;
  onOpenExtensionModal: () => void;
  onOpenSecurityModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentCategory,
  onSelectCategory,
  statusFilter,
  onSelectStatusFilter,
  counts,
  statusCounts,
  totalDownloadedToday,
  quotaSavedMidnight,
  scheduler,
  battery,
  currentTier,
  onOpenVersionModal,
  onToggleBatterySaver,
  onOpenSchedulerModal,
  onOpenExtensionModal,
  onOpenSecurityModal,
}) => {
  const tierInfo = TIERS_CONFIG[currentTier];
  const categories: { id: FileCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Semua Unduhan', icon: <FolderDown className="w-4 h-4" /> },
    { id: 'document', label: 'Dokumen', icon: <FileText className="w-4 h-4" /> },
    { id: 'video', label: 'Video', icon: <Film className="w-4 h-4" /> },
    { id: 'audio', label: 'Musik & Audio', icon: <Music className="w-4 h-4" /> },
    { id: 'program', label: 'Program & Aplikasi', icon: <Cpu className="w-4 h-4" /> },
    { id: 'archive', label: 'Arsip & Disk ISO', icon: <Archive className="w-4 h-4" /> },
    { id: 'scheduled', label: 'Terjadwal (Hemat Kuota)', icon: <Clock className="w-4 h-4" /> },
    { id: 'encrypted', label: 'Brankas Terenkripsi', icon: <Lock className="w-4 h-4" /> },
  ];

  const quotaPercent = scheduler.quotaLimitMb > 0
    ? Math.min(100, Math.round((totalDownloadedToday / (scheduler.quotaLimitMb * 1024 * 1024)) * 100))
    : null;

  return (
    <aside className="w-64 lg:w-72 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col shrink-0 overflow-y-auto h-[calc(100vh-4rem)]">
      
      {/* Category Section */}
      <div className="p-4 space-y-1">
        <div className="px-2 py-1.5 text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
          Kategori File
        </div>

        {categories.map((cat) => {
          const isActive = currentCategory === cat.id;
          const count = counts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                  : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={isActive ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-400 dark:text-neutral-500'}>
                  {cat.icon}
                </span>
                <span>{cat.label}</span>
              </div>
              
              {/* Unboxed clean metadata number */}
              <span className={`font-mono text-[11px] tabular-nums ${isActive ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-neutral-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Status Filter Section */}
      <div className="px-4 py-2 border-t border-neutral-100 dark:border-neutral-800/80">
        <div className="px-2 py-1.5 text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
          Status Unduhan
        </div>

        <div className="space-y-1">
          <button
            onClick={() => onSelectStatusFilter('downloading')}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'downloading'
                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <PlayCircle className="w-4 h-4 text-emerald-500" />
              <span>Sedang Berjalan</span>
            </div>
            <span className="font-mono text-[11px] tabular-nums text-neutral-400">
              {statusCounts.downloading}
            </span>
          </button>

          <button
            onClick={() => onSelectStatusFilter('paused')}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'paused'
                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <PauseCircle className="w-4 h-4 text-amber-500" />
              <span>Dijeda</span>
            </div>
            <span className="font-mono text-[11px] tabular-nums text-neutral-400">
              {statusCounts.paused}
            </span>
          </button>

          <button
            onClick={() => onSelectStatusFilter('completed')}
            className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === 'completed'
                ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              <span>Selesai</span>
            </div>
            <span className="font-mono text-[11px] tabular-nums text-neutral-400">
              {statusCounts.completed}
            </span>
          </button>
        </div>
      </div>

      <div className="mt-auto p-4 space-y-3 border-t border-neutral-100 dark:border-neutral-800">
        
        {/* Data Quota Card */}
        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-neutral-700 dark:text-neutral-200 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-blue-500" />
              Kuota Data Hari Ini
            </span>
            <button
              onClick={onOpenSchedulerModal}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
            >
              Atur
            </button>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="font-mono font-bold text-sm text-neutral-900 dark:text-white tabular-nums">
              {formatBytes(totalDownloadedToday)}
            </span>
            <span className="text-[11px] text-neutral-500">
              {scheduler.quotaLimitMb > 0 ? `dari ${formatBytes(scheduler.quotaLimitMb * 1024 * 1024)}` : 'Tanpa batas'}
            </span>
          </div>

          {quotaPercent !== null && (
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${quotaPercent > 85 ? 'bg-rose-500' : quotaPercent > 60 ? 'bg-amber-500' : 'bg-blue-600'}`}
                style={{ width: `${quotaPercent}%` }}
              />
            </div>
          )}

          {quotaSavedMidnight > 0 && (
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 pt-0.5">
              Hemat {formatBytes(quotaSavedMidnight)} di jam malam
            </div>
          )}
        </div>

        {/* Battery Saver Mini Control */}
        <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/60 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className={`w-4 h-4 ${battery.saverEnabled ? 'text-amber-500' : 'text-neutral-400'}`} />
            <div>
              <div className="font-medium text-neutral-800 dark:text-neutral-200">Mode Hemat Baterai</div>
              <div className="text-[10px] text-neutral-400">
                {battery.charging ? 'Tersambung adaptor daya' : `Baterai ${battery.level}%`}
              </div>
            </div>
          </div>
          <button
            onClick={onToggleBatterySaver}
            className={`w-9 h-5 rounded-full transition-colors relative focus:outline-none ${
              battery.saverEnabled ? 'bg-emerald-600' : 'bg-neutral-300 dark:bg-neutral-700'
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                battery.saverEnabled ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Browser Bookmarklet Banner */}
        <button
          onClick={onOpenExtensionModal}
          className="w-full text-left p-2.5 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-500 text-xs transition-colors flex items-center gap-2 text-neutral-600 dark:text-neutral-300 group"
        >
          <Globe2 className="w-4 h-4 text-blue-500 shrink-0" />
          <div className="truncate">
            <div className="font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-blue-500">
              Integrasi Browser
            </div>
            <div className="text-[10px] text-neutral-400 truncate">
              Tarik bookmarklet untuk deteksi otomatis
            </div>
          </div>
        </button>

        {/* Security Audit & Shield Quick Card */}
        <button
          onClick={onOpenSecurityModal}
          className="w-full text-left p-2.5 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40 text-xs transition-colors flex items-center justify-between group"
        >
          <div className="flex items-center gap-2 min-w-0">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="truncate">
              <div className="font-semibold text-emerald-900 dark:text-emerald-200">
                Pusat Keamanan
              </div>
              <div className="text-[10px] text-emerald-700/80 dark:text-emerald-400/80 truncate">
                CSP · Anti-SSRF · AES-256
              </div>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/80 text-emerald-800 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-700 shrink-0">
            A+
          </span>
        </button>

        {/* Version & License Card */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
          <button
            onClick={onOpenVersionModal}
            className="w-full p-2.5 rounded-xl bg-neutral-100/70 dark:bg-neutral-800/50 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/60 text-left transition-colors group"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-neutral-800 dark:text-neutral-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {tierInfo.name}
              </span>
              <span className="font-mono text-[10px] text-neutral-400">
                {APP_VERSION}
              </span>
            </div>
            <div className="text-[10px] text-neutral-500 mt-0.5 flex items-center justify-between">
              <span>{tierInfo.allowedSpeedLimit}</span>
              <span className="text-blue-600 dark:text-blue-400 font-medium group-hover:underline">Kelola ›</span>
            </div>
            <div className="mt-1.5 pt-1.5 border-t border-neutral-200/60 dark:border-neutral-700/50 flex items-center justify-between text-[9px] text-neutral-400 dark:text-neutral-500 font-mono">
              <span>© 2026 Raihan Nur Syifa</span>
              <span>Hak Cipta</span>
            </div>
          </button>
        </div>

      </div>
    </aside>
  );
};
