import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  HardDrive, 
  Moon, 
  Check, 
  AlertTriangle,
  Zap,
  Calendar
} from 'lucide-react';
import { SchedulerConfig } from '../types';
import { formatBytes } from '../utils/formatters';

interface SchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SchedulerConfig;
  onSaveConfig: (newConfig: SchedulerConfig) => void;
  totalDownloadedToday: number;
  quotaSavedMidnight: number;
}

const DAYS_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export const SchedulerModal: React.FC<SchedulerModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
  totalDownloadedToday,
  quotaSavedMidnight,
}) => {
  const [enabled, setEnabled] = useState(config.enabled);
  const [startHour, setStartHour] = useState(config.startHour);
  const [startMinute, setStartMinute] = useState(config.startMinute);
  const [endHour, setEndHour] = useState(config.endHour);
  const [endMinute, setEndMinute] = useState(config.endMinute);
  const [quotaLimitMb, setQuotaLimitMb] = useState(config.quotaLimitMb);
  const [autoPauseOnBattery, setAutoPauseOnBattery] = useState(config.autoPauseOnBattery);
  const [pauseAfterSchedule, setPauseAfterSchedule] = useState(config.pauseAfterSchedule);
  const [activeDays, setActiveDays] = useState<number[]>(config.activeDays || [0, 1, 2, 3, 4, 5, 6]);

  if (!isOpen) return null;

  const handleToggleDay = (dayIndex: number) => {
    if (activeDays.includes(dayIndex)) {
      if (activeDays.length > 1) {
        setActiveDays(activeDays.filter(d => d !== dayIndex));
      }
    } else {
      setActiveDays([...activeDays, dayIndex].sort());
    }
  };

  const handleSave = () => {
    onSaveConfig({
      enabled,
      startHour,
      startMinute,
      endHour,
      endMinute,
      quotaLimitMb,
      autoPauseOnBattery,
      pauseAfterSchedule,
      activeDays,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Sistem Penjadwalan & Penghemat Kuota
              </h2>
              <p className="text-xs text-neutral-500">
                Otomatiskan unduhan pada jam kuota malam dan batasi pemakaian data harian
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
        <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          
          {/* Main Toggle Switch */}
          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Moon className="w-4 h-4 text-indigo-500" />
                Aktifkan Jam Hemat Kuota Otomatis
              </div>
              <div className="text-neutral-500 text-[11px]">
                Mulai dan jeda unduhan otomatis sesuai rentang waktu yang ditentukan
              </div>
            </div>

            <button
              onClick={() => setEnabled(!enabled)}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                enabled ? 'bg-blue-600' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  enabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Time Window Config */}
          <div className="space-y-3">
            <label className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              Rentang Jam Unduhan (Jam Malam / Midnight Quota)
            </label>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <span className="text-[11px] text-neutral-500 block mb-1">Mulai Unduhan (Jam):</span>
                <div className="flex items-center gap-1 font-mono">
                  <select
                    value={startHour}
                    onChange={(e) => setStartHour(Number(e.target.value))}
                    className="p-1 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600"
                  >
                    {Array.from({ length: 24 }).map((_, i) => (
                      <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                  <span>:</span>
                  <select
                    value={startMinute}
                    onChange={(e) => setStartMinute(Number(e.target.value))}
                    className="p-1 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600"
                  >
                    {[0, 15, 30, 45].map((m) => (
                      <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <span className="text-[11px] text-neutral-500 block mb-1">Berhenti / Jeda (Jam):</span>
                <div className="flex items-center gap-1 font-mono">
                  <select
                    value={endHour}
                    onChange={(e) => setEndHour(Number(e.target.value))}
                    className="p-1 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600"
                  >
                    {Array.from({ length: 24 }).map((_, i) => (
                      <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                  <span>:</span>
                  <select
                    value={endMinute}
                    onChange={(e) => setEndMinute(Number(e.target.value))}
                    className="p-1 rounded bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-600"
                  >
                    {[0, 15, 30, 45].map((m) => (
                      <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500">
              Contoh jam umum kuota malam murah: 00:00 s/d 06:00. Unduhan Anda tidak akan menyedot kuota utama siang hari.
            </p>
          </div>

          {/* Active Days */}
          <div className="space-y-2">
            <label className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              Hari Operasi Penjadwalan
            </label>
            <div className="flex items-center gap-1.5">
              {DAYS_NAMES.map((name, idx) => {
                const isSelected = activeDays.includes(idx);
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => handleToggleDay(idx)}
                    className={`flex-1 py-1.5 text-center text-xs font-medium rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'
                    }`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quota Limiter */}
          <div className="space-y-2.5 pt-3 border-t border-neutral-200 dark:border-neutral-800">
            <label className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <HardDrive className="w-3.5 h-3.5 text-indigo-500" />
                Batas Kuota Penggunaan Data Harian
              </span>
              <span className="font-mono text-blue-600 dark:text-blue-400">
                {quotaLimitMb === 0 ? 'Tanpa Batas' : `${quotaLimitMb} MB (${(quotaLimitMb / 1024).toFixed(1)} GB)`}
              </span>
            </label>

            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="20480"
                step="512"
                value={quotaLimitMb}
                onChange={(e) => setQuotaLimitMb(Number(e.target.value))}
                className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-400">
              <span>0 (Bebas)</span>
              <span>5 GB</span>
              <span>10 GB</span>
              <span>20 GB</span>
            </div>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
              <span>
                Ketika batas kuota harian tercapai, semua unduhan otomatis dijeda untuk melindungi kuota internet Anda.
              </span>
            </div>
          </div>

          {/* Additional Smart Switches */}
          <div className="space-y-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={pauseAfterSchedule}
                onChange={(e) => setPauseAfterSchedule(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-neutral-700 dark:text-neutral-300">
                Otomatis jeda semua unduhan saat jendela jam hemat kuota berakhir
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoPauseOnBattery}
                onChange={(e) => setAutoPauseOnBattery(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="text-neutral-700 dark:text-neutral-300">
                Tunda jadwal otomatis jika laptop tidak sedang diisi daya (Mode Baterai)
              </span>
            </label>
          </div>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Simpan Pengaturan Jadwal</span>
          </button>
        </div>

      </div>
    </div>
  );
};
