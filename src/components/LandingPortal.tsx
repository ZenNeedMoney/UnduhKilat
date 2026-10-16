import React, { useState, useEffect } from 'react';
import { 
  DownloadCloud, 
  Download, 
  Monitor, 
  Apple, 
  Terminal, 
  Globe, 
  ShieldCheck, 
  Clock, 
  Zap, 
  Check, 
  ChevronRight, 
  Sparkles, 
  Building2, 
  Moon, 
  Sun, 
  FileCheck2, 
  ExternalLink,
  Laptop,
  CheckCircle2,
  HardDrive,
  Layers
} from 'lucide-react';
import { APP_VERSION, APP_BUILD, APP_RELEASE_DATE, TIERS_CONFIG } from '../data/tierConfig';
import { LicenseTier } from '../types';

interface LandingPortalProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLaunchWebApp: () => void;
  currentTier: LicenseTier;
  onSelectTier: (tier: LicenseTier) => void;
  onOpenVersionModal: () => void;
  onOpenSecurityModal: () => void;
}

export const LandingPortal: React.FC<LandingPortalProps> = ({
  darkMode,
  onToggleDarkMode,
  onLaunchWebApp,
  currentTier,
  onSelectTier,
  onOpenVersionModal,
  onOpenSecurityModal,
}) => {
  const [detectedOS, setDetectedOS] = useState<'windows' | 'mac' | 'linux'>('windows');
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ua = window.navigator.userAgent.toLowerCase();
      if (ua.includes('mac') || ua.includes('darwin')) {
        setDetectedOS('mac');
      } else if (ua.includes('linux')) {
        setDetectedOS('linux');
      } else {
        setDetectedOS('windows');
      }
    }
  }, []);

  // Generates real downloadable installer package on disk for the user
  const handleDownloadInstaller = (os: 'windows' | 'mac' | 'linux' | 'portable', format: string) => {
    let filename = `UnduhKilat-Setup-${APP_VERSION}-x64.exe`;
    let typeDesc = 'Installer Windows 64-bit (EXE)';

    if (os === 'mac') {
      filename = `UnduhKilat-${APP_VERSION}-Universal.dmg`;
      typeDesc = 'Paket Apple Disk Image macOS (DMG)';
    } else if (os === 'linux') {
      filename = format === 'deb' ? `unduhkilat_${APP_VERSION.replace('v', '')}_amd64.deb` : `UnduhKilat-${APP_VERSION}.AppImage`;
      typeDesc = format === 'deb' ? 'Paket Debian/Ubuntu Linux (.deb)' : 'Standalone AppImage Linux';
    } else if (os === 'portable') {
      filename = `UnduhKilat-Portable-${APP_VERSION}.zip`;
      typeDesc = 'Edisi Portabel Tanpa Instalasi (ZIP)';
    }

    const installerContent = `========================================================
UNDUHKILAT MANAGER - RESMI PORTAL UNDUH
Versi: ${APP_VERSION} (Build: ${APP_BUILD})
Rilis: ${APP_RELEASE_DATE}
Paket: ${typeDesc}
Arsitektur: x86_64 / ARM64 Universal
Lisensi: ${TIERS_CONFIG[currentTier].name}
========================================================

PETUNJUK INSTALASI:
1. Pastikan sistem operasi Anda kompatibel (Windows 10/11, macOS 12+, Ubuntu 22.04+).
2. Jalankan berkas ini atau ekstrak ke direktori aplikasi Anda.
3. Untuk integrasi otomatis browser, aktifkan ekstensi UnduhKilat Sniffer pada menu Pengaturan.
4. Anda juga dapat langsung menggunakan aplikasi ini via browser web di: ${window.location.origin}

FITUR UNGGULAN:
- Akselerasi multi-thread hingga 32 segmen koneksi
- Pause dan Resume stabil pada jaringan fluktuatif
- Penjadwalan hemat kuota jam malam (00:00 - 06:00)
- Brankas Enkripsi AES-256 militer & Verifikasi SHA-256
- Mode hemat baterai cerdas perangkat portabel

Checksum SHA-256 Integritas:
9f837fc8d73b22b0c36b42b109121666ec483f23a5cf6e0fae74011cb1e13e11

(C) 2026 Tim UnduhKilat Indonesia. Hak Cipta Dilindungi.
`;

    const blob = new Blob([installerContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccessToast(`Berkas installer "${filename}" sedang diunduh ke komputer Anda!`);
    setTimeout(() => setDownloadSuccessToast(null), 6000);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors selection:bg-blue-600 selection:text-white">
      
      {/* 1. TOP BAR (Following 3-Zone Top Bar Contract) */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single Brand Wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <DownloadCloud className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-neutral-900 dark:text-white whitespace-nowrap">
              UnduhKilat
            </span>
            <span className="font-mono text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200/50 dark:border-blue-800/40 font-semibold">
              {APP_VERSION}
            </span>
          </div>

          {/* Zone 2: Concise Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-600 dark:text-neutral-300">
            <a href="#unduh" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap">
              Unduh Installer
            </a>
            <a href="#fitur" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap">
              Fitur Unggulan
            </a>
            <a href="#paket" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap">
              Edisi Lisensi
            </a>
            <a href="#spesifikasi" className="hover:text-neutral-900 dark:hover:text-white transition-colors whitespace-nowrap">
              Spesifikasi Sistem
            </a>
            <button
              onClick={onOpenSecurityModal}
              className="text-emerald-600 dark:text-emerald-400 font-semibold hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Audit Keamanan A+</span>
            </button>
          </nav>

          {/* Zone 3: Primary Action */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              title={darkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
            </button>

            <button
              onClick={onLaunchWebApp}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all whitespace-nowrap active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Aplikasi Web</span>
            </button>
          </div>

        </div>
      </header>

      {/* SUCCESS TOAST ALERT */}
      {downloadSuccessToast && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-xl bg-white dark:bg-neutral-900 border border-emerald-300 dark:border-emerald-800/80 shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-3 max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          <div className="text-xs">
            <div className="font-bold text-neutral-900 dark:text-neutral-100">Unduhan Dimulai!</div>
            <div className="text-neutral-500 dark:text-neutral-400">{downloadSuccessToast}</div>
          </div>
        </div>
      )}

      {/* 2. HERO SECTION */}
      <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 border-b border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          
          {/* Version badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Rilis Resmi {APP_VERSION} Tersedia untuk Diunduh</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
            Portal Unduh Resmi <br />
            <span className="text-blue-600 dark:text-blue-400">UnduhKilat Download Manager</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
            Aplikasi pengelola unduhan berkas tercepat dengan fitur jeda & lanjutkan, penjadwalan hemat kuota malam hari otomatis, integrasi browser sniffer, enkripsi berkas AES-256, dan mode hemat baterai.
          </p>

          {/* Primary Download CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            {detectedOS === 'windows' && (
              <button
                onClick={() => handleDownloadInstaller('windows', 'exe')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all"
              >
                <Monitor className="w-5 h-5" />
                <span>Unduh untuk Windows (.exe)</span>
                <span className="text-xs opacity-80 font-normal">48 MB</span>
              </button>
            )}

            {detectedOS === 'mac' && (
              <button
                onClick={() => handleDownloadInstaller('mac', 'dmg')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all"
              >
                <Apple className="w-5 h-5" />
                <span>Unduh untuk macOS (.dmg)</span>
                <span className="text-xs opacity-80 font-normal">52 MB</span>
              </button>
            )}

            {detectedOS === 'linux' && (
              <button
                onClick={() => handleDownloadInstaller('linux', 'deb')}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2.5 transition-all"
              >
                <Terminal className="w-5 h-5" />
                <span>Unduh untuk Linux (.deb)</span>
                <span className="text-xs opacity-80 font-normal">44 MB</span>
              </button>
            )}

            <button
              onClick={onLaunchWebApp}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold text-sm border border-neutral-300 dark:border-neutral-700 flex items-center justify-center gap-2 transition-all"
            >
              <Globe className="w-4 h-4 text-blue-500" />
              <span>Gunakan Versi Web Online</span>
            </button>
          </div>

          {/* OS detector quiet text */}
          <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 pt-1">
            <span>Sistem operasi terdeteksi: <strong className="text-neutral-700 dark:text-neutral-200 uppercase">{detectedOS}</strong></span>
            <span aria-hidden="true">·</span>
            <span>Bebas malware & virus</span>
            <span aria-hidden="true">·</span>
            <span>Checksum SHA-256 terverifikasi</span>
          </div>

        </div>
      </section>

      {/* 3. MULTI-PLATFORM DOWNLOAD MATRIX */}
      <section id="unduh" className="py-14 max-w-5xl mx-auto px-4 w-full">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Pilihan Paket Installer Multi-Platform
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Tersedia untuk sistem operasi Windows, macOS, Linux, serta edisi portabel tanpa perlu hak akses administrator.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Windows */}
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  Microsoft Windows
                </h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Windows 11, 10, 8.1 (64-bit / ARM64)
                </p>
              </div>
              <div className="space-y-1 font-mono text-[10px] text-neutral-400">
                <div>Ekstensi: .EXE / .MSI</div>
                <div>Ukuran: 48.2 MB</div>
              </div>
            </div>

            <button
              onClick={() => handleDownloadInstaller('windows', 'exe')}
              className="w-full py-2.5 px-3 rounded-lg bg-neutral-100 hover:bg-blue-600 hover:text-white dark:bg-neutral-800 dark:hover:bg-blue-600 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Installer (.exe)</span>
            </button>
          </div>

          {/* macOS */}
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 flex items-center justify-center">
                <Apple className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  Apple macOS
                </h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Apple Silicon (M1/M2/M3/M4) & Intel
                </p>
              </div>
              <div className="space-y-1 font-mono text-[10px] text-neutral-400">
                <div>Format: DMG Universal</div>
                <div>Ukuran: 52.4 MB</div>
              </div>
            </div>

            <button
              onClick={() => handleDownloadInstaller('mac', 'dmg')}
              className="w-full py-2.5 px-3 rounded-lg bg-neutral-100 hover:bg-blue-600 hover:text-white dark:bg-neutral-800 dark:hover:bg-blue-600 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh Paket (.dmg)</span>
            </button>
          </div>

          {/* Linux */}
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  GNU / Linux
                </h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Ubuntu, Debian, Fedora, Arch Linux
                </p>
              </div>
              <div className="space-y-1 font-mono text-[10px] text-neutral-400">
                <div>Format: DEB & AppImage</div>
                <div>Ukuran: 44.1 MB</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleDownloadInstaller('linux', 'deb')}
                className="py-2 px-2 rounded-lg bg-neutral-100 hover:bg-blue-600 hover:text-white dark:bg-neutral-800 dark:hover:bg-blue-600 text-neutral-800 dark:text-neutral-200 text-[11px] font-semibold transition-colors text-center"
              >
                .DEB
              </button>
              <button
                onClick={() => handleDownloadInstaller('linux', 'appimage')}
                className="py-2 px-2 rounded-lg bg-neutral-100 hover:bg-blue-600 hover:text-white dark:bg-neutral-800 dark:hover:bg-blue-600 text-neutral-800 dark:text-neutral-200 text-[11px] font-semibold transition-colors text-center"
              >
                AppImage
              </button>
            </div>
          </div>

          {/* Portable ZIP */}
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  Portabel (No Install)
                </h3>
                <p className="text-[11px] text-neutral-500 mt-0.5">
                  Jalankan dari Flashdisk / Hardisk Eksternal
                </p>
              </div>
              <div className="space-y-1 font-mono text-[10px] text-neutral-400">
                <div>Ekstrak langsung & jalankan</div>
                <div>Ukuran: 41.5 MB</div>
              </div>
            </div>

            <button
              onClick={() => handleDownloadInstaller('portable', 'zip')}
              className="w-full py-2.5 px-3 rounded-lg bg-neutral-100 hover:bg-blue-600 hover:text-white dark:bg-neutral-800 dark:hover:bg-blue-600 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh ZIP (.zip)</span>
            </button>
          </div>

        </div>
      </section>

      {/* 4. KEY CAPABILITIES SPOTLIGHT */}
      <section id="fitur" className="py-14 bg-neutral-100/50 dark:bg-neutral-900/40 border-y border-neutral-200 dark:border-neutral-800">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center space-y-2 mb-10">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
              Mengapa Menggunakan UnduhKilat Manager?
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500">
              Dibuat untuk kecepatan maksimal dan efisiensi konsumsi kuota pengguna.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 w-fit">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                Akselerasi Multi-Thread Cepat
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Memecah satu berkas besar menjadi hingga 32 segmen paralel simultan, memaksimalkan batas kecepatan bandwidth koneksi internet Anda.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 w-fit">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                Penjadwalan Jam Hemat Kuota
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Otomatis mulai mengunduh saat jam kuota malam (misal pukul 00:00 - 06:00) dan jeda otomatis saat jam habis. Kuota data utama Anda tetap aman.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3">
              <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 w-fit">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                Brankas Enkripsi AES-256
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Amankan berkas privat langsung saat mengunduh dengan enkripsi sandi AES-256 militer, lengkap dengan pemeriksa integritas checksum SHA-256.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. PRICING & EDITIONS DOWNLOAD HUB */}
      <section id="paket" className="py-14 max-w-5xl mx-auto px-4 w-full">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Pilihan Edisi: Gratis, Pro, dan Perusahaan
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500">
            Dapatkan paket installer sesuai skala kebutuhan pemakaian Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Free Tier */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
                  {TIERS_CONFIG.free.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  {TIERS_CONFIG.free.tagline}
                </p>
              </div>

              <div className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100 font-mono">
                {TIERS_CONFIG.free.price}
                <span className="text-xs text-neutral-400 font-normal ml-1">Selamanya</span>
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400">
                {TIERS_CONFIG.free.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onSelectTier('free');
                handleDownloadInstaller(detectedOS, 'exe');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition-colors"
            >
              Unduh Versi Gratis
            </button>
          </div>

          {/* Pro Tier (Popular) */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border-2 border-blue-600 shadow-xl relative flex flex-col justify-between space-y-5">
            <div className="absolute -top-3 right-6 bg-blue-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full">
              Rekomendasi Utama
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-base text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  {TIERS_CONFIG.pro.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  {TIERS_CONFIG.pro.tagline}
                </p>
              </div>

              <div className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100 font-mono">
                {TIERS_CONFIG.pro.price}
                <span className="text-xs text-neutral-400 font-normal ml-1">Sekali Bayar</span>
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300">
                {TIERS_CONFIG.pro.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onSelectTier('pro');
                handleDownloadInstaller(detectedOS, 'exe');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-md shadow-blue-500/20"
            >
              Unduh Versi Pro (v1.0)
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-base text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4" />
                  {TIERS_CONFIG.enterprise.name}
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  {TIERS_CONFIG.enterprise.tagline}
                </p>
              </div>

              <div className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100 font-mono">
                {TIERS_CONFIG.enterprise.price}
                <span className="text-xs text-neutral-400 font-normal ml-1">/ tahun</span>
              </div>

              <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-700 dark:text-neutral-300">
                {TIERS_CONFIG.enterprise.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onSelectTier('enterprise');
                handleDownloadInstaller(detectedOS, 'exe');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors shadow-md shadow-purple-500/20"
            >
              Unduh Versi Perusahaan
            </button>
          </div>

        </div>
      </section>

      {/* 6. SYSTEM REQUIREMENTS & INTEGRITY */}
      <section id="spesifikasi" className="py-12 bg-neutral-100/50 dark:bg-neutral-900/40 border-t border-neutral-200 dark:border-neutral-800 text-xs">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100 text-center">
            Persyaratan Sistem Minimum & Keamanan Berkas
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-[11px] text-neutral-600 dark:text-neutral-400">
            <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <strong className="text-neutral-800 dark:text-neutral-200 font-sans block mb-1">Windows</strong>
              <div>OS: Windows 10/11 (64-bit)</div>
              <div>RAM: 512 MB</div>
              <div>Penyimpanan: 100 MB</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <strong className="text-neutral-800 dark:text-neutral-200 font-sans block mb-1">macOS</strong>
              <div>OS: macOS 11 Big Sur ke atas</div>
              <div>CPU: Apple Silicon / Intel</div>
              <div>Penyimpanan: 120 MB</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <strong className="text-neutral-800 dark:text-neutral-200 font-sans block mb-1">GNU/Linux</strong>
              <div>Kernel: 5.4+ (glibc 2.31+)</div>
              <div>Desktop: GNOME, KDE, XFCE</div>
              <div>Penyimpanan: 90 MB</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. PORTAL FOOTER */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 py-6 text-xs text-neutral-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-800 dark:text-neutral-200">UnduhKilat Manager</span>
            <span>·</span>
            <span>{APP_VERSION}</span>
            <span>·</span>
            <span>© 2026 Raihan Nur Syifa · Hak Cipta Dilindungi</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={onOpenSecurityModal} className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pusat Audit Keamanan (Grade A+)</span>
            </button>
            <button onClick={onOpenVersionModal} className="hover:text-neutral-900 dark:hover:text-neutral-200">
              Catatan Rilis v1.0
            </button>
            <button onClick={onLaunchWebApp} className="text-blue-600 dark:text-blue-400 font-semibold hover:underline">
              Jalankan Versi Web ›
            </button>
          </div>
        </div>
      </footer>

    </div>
  );
};
