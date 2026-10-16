import React from 'react';
import { 
  DownloadCloud, 
  Plus, 
  Search, 
  Moon, 
  Sun, 
  Battery, 
  BatteryCharging, 
  BatteryLow, 
  Globe, 
  Clock, 
  Gauge, 
  ShieldCheck,
  FolderDown,
  Lock
} from 'lucide-react';
import { BatteryState, SchedulerConfig, SpeedLimit, LicenseTier } from '../types';
import { formatSpeed } from '../utils/formatters';
import { APP_VERSION, TIERS_CONFIG } from '../data/tierConfig';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  speedLimit: SpeedLimit;
  onChangeSpeedLimit: (limit: SpeedLimit) => void;
  totalSpeed: number;
  battery: BatteryState;
  scheduler: SchedulerConfig;
  currentTier: LicenseTier;
  onOpenVersionModal: () => void;
  onSwitchToPortal: () => void;
  onOpenAddModal: () => void;
  onOpenGrabberModal: () => void;
  onOpenSchedulerModal: () => void;
  onOpenBatteryModal: () => void;
  onOpenExtensionModal: () => void;
  onOpenVaultModal: () => void;
  onOpenSecurityModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  searchQuery,
  onSearchChange,
  darkMode,
  onToggleDarkMode,
  speedLimit,
  onChangeSpeedLimit,
  totalSpeed,
  battery,
  scheduler,
  currentTier,
  onOpenVersionModal,
  onSwitchToPortal,
  onOpenAddModal,
  onOpenGrabberModal,
  onOpenSchedulerModal,
  onOpenBatteryModal,
  onOpenExtensionModal,
  onOpenVaultModal,
  onOpenSecurityModal,
}) => {
  const tierInfo = TIERS_CONFIG[currentTier];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div className="flex items-center justify-between gap-4 px-4 lg:px-6 h-16">
        
        {/* Brand Lockup */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <DownloadCloud className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-neutral-900 dark:text-white">
                UnduhKilat
              </span>
              
              {/* Clickable Version & Tier Tag */}
              <button
                onClick={onOpenVersionModal}
                className={`text-[11px] font-semibold px-2 py-0.5 rounded border transition-all flex items-center gap-1 ${
                  currentTier === 'enterprise'
                    ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200/60 dark:border-purple-800/60 hover:bg-purple-100'
                    : currentTier === 'pro'
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-800/60 hover:bg-blue-100'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200'
                }`}
                title="Klik untuk melihat Info Versi & Lisensi (Gratis, Pro, Perusahaan)"
              >
                <span className="font-mono">{APP_VERSION}</span>
                <span>·</span>
                <span>{tierInfo.badgeLabel}</span>
              </button>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 hidden sm:block">
              Manajer Unduhan Cerdas {tierInfo.name}
            </p>
          </div>
        </div>

        {/* Center Search & Live Speed Telemetry */}
        <div className="flex-1 max-w-md hidden md:flex items-center gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari unduhan berdasarkan nama atau link..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg bg-neutral-100 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700/80 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Live Speed Display */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/70 text-xs">
            <Gauge className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-neutral-500 dark:text-neutral-400">Total:</span>
            <span className="font-mono font-medium text-neutral-900 dark:text-neutral-100 tabular-nums">
              {formatSpeed(totalSpeed)}
            </span>
          </div>

          {/* Speed Limiter Dropdown */}
          <div className="hidden sm:block">
            <select
              value={speedLimit}
              onChange={(e) => {
                const val = e.target.value === 'unlimited' ? 'unlimited' : Number(e.target.value) as SpeedLimit;
                onChangeSpeedLimit(val);
              }}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/80 text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
              title="Batas Kecepatan Unduhan"
            >
              <option value="unlimited">Kecepatan: Maks</option>
              <option value={10240}>Batas: 10 MB/s</option>
              <option value={5120}>Batas: 5 MB/s</option>
              <option value={2048}>Batas: 2 MB/s</option>
              <option value={1024}>Batas: 1 MB/s</option>
              <option value={512}>Batas: 512 KB/s</option>
            </select>
          </div>

          {/* Scheduler Status Quick Button */}
          <button
            onClick={onOpenSchedulerModal}
            className={`p-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              scheduler.enabled 
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800/60 text-amber-700 dark:text-amber-400'
                : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700/80 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
            title="Jadwal Hemat Kuota"
          >
            <Clock className="w-4 h-4" />
            <span className="hidden xl:inline">
              {scheduler.enabled ? `Jadwal ${scheduler.startHour.toString().padStart(2, '0')}:00` : 'Jadwal'}
            </span>
          </button>

          {/* Battery Status Quick Button */}
          <button
            onClick={onOpenBatteryModal}
            className={`p-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              battery.saverEnabled || (!battery.charging && battery.level <= battery.threshold)
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400'
                : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700/80 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
            title="Mode Hemat Baterai"
          >
            {battery.charging ? (
              <BatteryCharging className="w-4 h-4 text-emerald-500" />
            ) : battery.level <= battery.threshold ? (
              <BatteryLow className="w-4 h-4 text-rose-500" />
            ) : (
              <Battery className="w-4 h-4" />
            )}
            <span className="font-mono tabular-nums text-xs hidden xl:inline">
              {battery.level}%
            </span>
          </button>

          {/* Browser Link Grabber */}
          <button
            onClick={onOpenGrabberModal}
            className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/80 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            title="Tangkap Link Web / Sniffer"
          >
            <Globe className="w-4 h-4" />
          </button>

          {/* Encrypted Vault Access */}
          <button
            onClick={onOpenVaultModal}
            className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/80 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            title="Brankas File Terenkripsi"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Security Center & Audit */}
          <button
            onClick={onOpenSecurityModal}
            className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 transition-colors flex items-center gap-1.5"
            title="Pusat Keamanan & Diagnostik Web/Aplikasi (Grade A+)"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-[11px] font-mono font-bold hidden xl:inline">A+</span>
          </button>

          {/* Official Download Web Portal Link */}
          <button
            onClick={onSwitchToPortal}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 border border-neutral-200 dark:border-neutral-700/80 text-xs font-medium text-neutral-700 dark:text-neutral-300 transition-colors"
            title="Buka Website Resmi & Tempat Unduh Installer Aplikasi"
          >
            <DownloadCloud className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden md:inline">Portal Web Resmi</span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700/80 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
          </button>

          {/* Primary CTA: Add Download */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all whitespace-nowrap active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Unduhan</span>
          </button>
        </div>

      </div>
    </header>
  );
};
