import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Building2, 
  Check, 
  ShieldCheck, 
  Layers, 
  Info, 
  Clock, 
  CheckCircle2, 
  Zap, 
  ChevronRight,
  Download,
  Lock,
  Globe2
} from 'lucide-react';
import { LicenseTier } from '../types';
import { 
  APP_VERSION, 
  APP_BUILD, 
  APP_RELEASE_DATE, 
  APP_AUTHOR,
  APP_COPYRIGHT,
  TIERS_CONFIG, 
  COMPARISON_MATRIX, 
  CHANGELOG_V1 
} from '../data/tierConfig';

interface VersionPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: LicenseTier;
  onSelectTier: (tier: LicenseTier) => void;
  initialTab?: 'pricing' | 'comparison' | 'about';
}

export const VersionPricingModal: React.FC<VersionPricingModalProps> = ({
  isOpen,
  onClose,
  currentTier,
  onSelectTier,
  initialTab = 'pricing'
}) => {
  const [activeTab, setActiveTab] = useState<'pricing' | 'comparison' | 'about'>(initialTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  UnduhKilat Manager {APP_VERSION}
                </h2>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200/50 dark:border-blue-800/40">
                  {TIERS_CONFIG[currentTier].name}
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Pilihan Edisi: Gratis, Pro, dan Perusahaan untuk berbagai skala kebutuhan
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

        {/* Tab Controls */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900">
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'pricing'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pilihan Paket & Lisensi</span>
          </button>

          <button
            onClick={() => setActiveTab('comparison')}
            className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'comparison'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Matriks Perbandingan Fitur</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'about'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Info Versi & Catatan Rilis</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-xs">
          
          {/* TAB 1: 3-TIER PRICING CARDS */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <div className="text-center max-w-lg mx-auto space-y-1">
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Sesuaikan Edisi dengan Kebutuhan Unduhan Anda
                </h3>
                <p className="text-xs text-neutral-500">
                  Anda dapat beralih langsung antar-edisi untuk menguji fitur akselerasi kecepatan, batas thread, dan integrasi perusahaan.
                </p>
              </div>

              {/* 3 Tier Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. GRATIS (FREE) */}
                <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  currentTier === 'free'
                    ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-50/80 dark:bg-neutral-800/80 shadow-md ring-1 ring-neutral-900 dark:ring-neutral-100'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300'
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                        {TIERS_CONFIG.free.name}
                      </span>
                      {currentTier === 'free' && (
                        <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300 bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 rounded">
                          Aktif
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 min-h-[32px]">
                      {TIERS_CONFIG.free.tagline}
                    </p>

                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="text-lg font-bold text-neutral-900 dark:text-white font-mono">
                        {TIERS_CONFIG.free.price}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {TIERS_CONFIG.free.billing}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                        Batasan & Fitur:
                      </div>
                      {TIERS_CONFIG.free.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-neutral-600 dark:text-neutral-400">
                          <Check className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectTier('free')}
                    className={`mt-5 w-full py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                      currentTier === 'free'
                        ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 cursor-default'
                        : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200'
                    }`}
                  >
                    {currentTier === 'free' ? 'Sedang Digunakan' : 'Gunakan Edisi Gratis'}
                  </button>
                </div>

                {/* 2. PRO (POPULAR) */}
                <div className={`p-4 rounded-xl border relative flex flex-col justify-between transition-all ${
                  currentTier === 'pro'
                    ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 shadow-lg ring-1 ring-blue-600'
                    : 'border-blue-200 dark:border-blue-900/60 bg-white dark:bg-neutral-900 hover:border-blue-400'
                }`}>
                  <div className="absolute -top-2.5 right-4 bg-blue-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-sm">
                    Paling Populer
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        {TIERS_CONFIG.pro.name}
                      </span>
                      {currentTier === 'pro' && (
                        <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded">
                          Aktif
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 min-h-[32px]">
                      {TIERS_CONFIG.pro.tagline}
                    </p>

                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="text-lg font-bold text-neutral-900 dark:text-white font-mono">
                        {TIERS_CONFIG.pro.price}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {TIERS_CONFIG.pro.billing}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                        Kelebihan Edisi Pro:
                      </div>
                      {TIERS_CONFIG.pro.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-neutral-700 dark:text-neutral-300">
                          <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectTier('pro')}
                    className={`mt-5 w-full py-2 px-3 rounded-lg text-xs font-semibold transition-colors shadow-sm ${
                      currentTier === 'pro'
                        ? 'bg-blue-600 text-white cursor-default'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {currentTier === 'pro' ? 'Edisi Pro Aktif' : 'Aktifkan Edisi Pro'}
                  </button>
                </div>

                {/* 3. PERUSAHAAN (ENTERPRISE) */}
                <div className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                  currentTier === 'enterprise'
                    ? 'border-purple-600 bg-purple-50/40 dark:bg-purple-950/30 shadow-lg ring-1 ring-purple-600'
                    : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-purple-400'
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                        <Building2 className="w-4 h-4" />
                        {TIERS_CONFIG.enterprise.name}
                      </span>
                      {currentTier === 'enterprise' && (
                        <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/60 px-2 py-0.5 rounded">
                          Aktif
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-500 min-h-[32px]">
                      {TIERS_CONFIG.enterprise.tagline}
                    </p>

                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="text-lg font-bold text-neutral-900 dark:text-white font-mono">
                        {TIERS_CONFIG.enterprise.price}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        {TIERS_CONFIG.enterprise.billing}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                      <div className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300">
                        Fitur Kelas Korporat:
                      </div>
                      {TIERS_CONFIG.enterprise.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-neutral-700 dark:text-neutral-300">
                          <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectTier('enterprise')}
                    className={`mt-5 w-full py-2 px-3 rounded-lg text-xs font-semibold transition-colors shadow-sm ${
                      currentTier === 'enterprise'
                        ? 'bg-purple-600 text-white cursor-default'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    {currentTier === 'enterprise' ? 'Edisi Perusahaan Aktif' : 'Aktifkan Edisi Perusahaan'}
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: DETAILED COMPARISON MATRIX */}
          {activeTab === 'comparison' && (
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  Matriks Perbandingan Spesifikasi Teknis
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Perbandingan batas konkret antar-edisi tanpa tanda centang abstrak.
                </p>
              </div>

              <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 dark:bg-neutral-800/70 border-b border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold">
                    <tr>
                      <th className="py-2.5 px-4 w-1/3">Kemampuan & Spesifikasi</th>
                      <th className="py-2.5 px-4 w-1/5">Versi Gratis</th>
                      <th className="py-2.5 px-4 w-1/4 text-blue-600 dark:text-blue-400">Versi Pro</th>
                      <th className="py-2.5 px-4 w-1/4 text-purple-600 dark:text-purple-400">Versi Perusahaan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800/70 font-mono text-[11px]">
                    {COMPARISON_MATRIX.map((row, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40">
                        <td className="py-2.5 px-4 font-sans font-medium text-neutral-800 dark:text-neutral-200">
                          {row.feature}
                        </td>
                        <td className="py-2.5 px-4 text-neutral-600 dark:text-neutral-400">
                          {row.free}
                        </td>
                        <td className="py-2.5 px-4 text-blue-700 dark:text-blue-300 font-semibold">
                          {row.pro}
                        </td>
                        <td className="py-2.5 px-4 text-purple-700 dark:text-purple-300 font-semibold">
                          {row.enterprise}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ABOUT & V1.0 CHANGELOG */}
          {activeTab === 'about' && (
            <div className="space-y-5">
              
              {/* App Identity Banner */}
              <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md">
                    UK
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-neutral-900 dark:text-white">
                      UnduhKilat Manager
                    </h3>
                    <div className="text-[11px] text-neutral-500 font-mono flex items-center gap-2 mt-0.5">
                      <span>Versi {APP_VERSION}</span>
                      <span>·</span>
                      <span>Build {APP_BUILD}</span>
                      <span>·</span>
                      <span>{APP_RELEASE_DATE}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 block">Lisensi Saat Ini</span>
                  <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100 font-mono">
                    {TIERS_CONFIG[currentTier].name}
                  </span>
                </div>
              </div>

              {/* Copyright & Ownership Notice */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                      Hak Cipta & Kepemilikan Resmi
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold">
                      Terdaftar
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-0.5">
                    Aplikasi ini secara resmi berada di bawah hak cipta dan kepemilikan penuh <strong>{APP_AUTHOR}</strong>.
                  </p>
                </div>
                <div className="font-mono text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm shrink-0">
                  © 2026 {APP_AUTHOR}
                </div>
              </div>

              {/* Changelog Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-500" />
                    Catatan Rilis (Changelog)
                  </h4>
                  <span className="font-mono text-[11px] text-neutral-400">
                    Versi Terkini: {APP_VERSION}
                  </span>
                </div>

                {CHANGELOG_V1.map((cl, i) => (
                  <div key={i} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-neutral-800 dark:text-neutral-200">
                        {cl.title}
                      </span>
                      <span className="font-mono text-[10px] text-neutral-400">
                        {cl.date}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-neutral-600 dark:text-neutral-400">
                      {cl.highlights.map((h, hIdx) => (
                        <div key={hIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/40">
          <div className="text-[11px] text-neutral-500 font-mono">
            Lisensi: <strong className="text-neutral-800 dark:text-neutral-200">{TIERS_CONFIG[currentTier].name}</strong> · © 2026 {APP_AUTHOR}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg transition-colors"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
};
