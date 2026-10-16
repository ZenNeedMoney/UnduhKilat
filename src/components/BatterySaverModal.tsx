import React, { useState } from 'react';
import { 
  X, 
  Battery, 
  BatteryCharging, 
  BatteryLow, 
  Zap, 
  Check, 
  ShieldAlert,
  Cpu,
  Gauge
} from 'lucide-react';
import { BatteryState } from '../types';

interface BatterySaverModalProps {
  isOpen: boolean;
  onClose: () => void;
  battery: BatteryState;
  onUpdateBatterySettings: (settings: Partial<BatteryState>) => void;
}

export const BatterySaverModal: React.FC<BatterySaverModalProps> = ({
  isOpen,
  onClose,
  battery,
  onUpdateBatterySettings,
}) => {
  const [saverEnabled, setSaverEnabled] = useState(battery.saverEnabled);
  const [threshold, setThreshold] = useState(battery.threshold || 25);
  const [autoPauseOnLowBattery, setAutoPauseOnLowBattery] = useState(battery.autoPauseOnLowBattery ?? true);
  const [throttleOnBattery, setThrottleOnBattery] = useState(battery.throttleOnBattery ?? true);

  if (!isOpen) return null;

  const handleSave = () => {
    onUpdateBatterySettings({
      saverEnabled,
      threshold,
      autoPauseOnLowBattery,
      throttleOnBattery,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Mode Hemat Baterai Cerdas
              </h2>
              <p className="text-xs text-neutral-500">
                Optimalkan konsumsi daya sistem saat mengunduh berkas besar
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
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Real-time Battery Status Card */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {battery.charging ? (
                  <BatteryCharging className="w-5 h-5 text-emerald-500" />
                ) : battery.level <= threshold ? (
                  <BatteryLow className="w-5 h-5 text-rose-500" />
                ) : (
                  <Battery className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                )}
                <div>
                  <div className="font-bold text-sm text-neutral-900 dark:text-white font-mono tabular-nums">
                    Status Daya: {battery.level}%
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    {battery.charging ? 'Tersambung adaptor pengisi daya' : 'Berjalan pada daya baterai'}
                  </div>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                saverEnabled 
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                  : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
              }`}>
                {saverEnabled ? 'Aktif' : 'Standar'}
              </span>
            </div>

            {/* Battery Progress Bar */}
            <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${
                  battery.level <= 20 ? 'bg-rose-500' : battery.level <= 40 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${battery.level}%` }}
              />
            </div>
          </div>

          {/* Master Toggle */}
          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 flex items-center justify-between">
            <div>
              <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                Aktifkan Mode Hemat Baterai
              </div>
              <div className="text-neutral-500 text-[11px]">
                Mengurangi beban CPU dan membatasi koneksi agresif
              </div>
            </div>

            <button
              onClick={() => setSaverEnabled(!saverEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none ${
                saverEnabled ? 'bg-emerald-600' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  saverEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Auto Threshold Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-neutral-800 dark:text-neutral-200">
                Batas Baterai Lemah Otomatis:
              </label>
              <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                {threshold}%
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="50"
              step="5"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-neutral-400 font-mono">
              <span>10%</span>
              <span>25% (Rekomendasi)</span>
              <span>50%</span>
            </div>
          </div>

          {/* Smart Rules List */}
          <div className="space-y-2.5 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <div className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
              Aturan Otomasi Penghemat Daya:
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
              <input
                type="checkbox"
                checked={autoPauseOnLowBattery}
                onChange={(e) => setAutoPauseOnLowBattery(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Jeda Otomatis Saat Baterai di Bawah {threshold}%
                </div>
                <div className="text-[11px] text-neutral-500">
                  Mencegah perangkat tiba-tiba mati di tengah pengunduhan berkas besar.
                </div>
              </div>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
              <input
                type="checkbox"
                checked={throttleOnBattery}
                onChange={(e) => setThrottleOnBattery(e.target.checked)}
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <div>
                <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                  Batasi Kecepatan & Thread Saat Menggunakan Baterai
                </div>
                <div className="text-[11px] text-neutral-500">
                  Membatasi segmen unduhan simultan untuk menjaga suhu CPU dan baterai tetap dingin.
                </div>
              </div>
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
            className="px-4 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Terapkan Pengaturan</span>
          </button>
        </div>

      </div>
    </div>
  );
};
