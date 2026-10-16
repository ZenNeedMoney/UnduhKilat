import { LicenseTier, TierConfig } from '../types';

export const APP_VERSION = 'v1.0.0';
export const APP_BUILD = '2026.10.15-STABLE';
export const APP_RELEASE_DATE = '15 Oktober 2026';
export const APP_AUTHOR = 'Raihan Nur Syifa';
export const APP_COPYRIGHT = '© 2026 Raihan Nur Syifa. Hak cipta dilindungi undang-undang.';

export const TIERS_CONFIG: Record<LicenseTier, TierConfig> = {
  free: {
    id: 'free',
    name: 'Versi Gratis',
    badgeLabel: 'GRATIS',
    tagline: 'Ideal untuk kebutuhan unduhan dasar harian',
    price: 'Rp 0',
    billing: 'Gratis Selamanya',
    maxConcurrentDownloads: 2,
    maxThreadsPerTask: 4,
    maxDailyQuotaMb: 5120, // 5GB limit
    allowedSpeedLimit: 'Hingga 5 MB/s',
    features: [
      'Maksimal 2 tugas unduhan simultan',
      '4 segmen koneksi multi-thread per berkas',
      'Kontrol Jeda & Lanjutkan manual',
      'Penjadwalan 1 jendela waktu hemat kuota',
      'Detektor link clipboard & bookmarklet standar',
      'Enkripsi berkas dasar dengan kata sandi',
      'Pemantauan kuota harian hingga 5 GB'
    ]
  },
  pro: {
    id: 'pro',
    name: 'Versi Pro',
    badgeLabel: 'PRO',
    tagline: 'Untuk pengguna aktif & pengunduh berkas besar tanpa batas',
    price: 'Rp 49.000',
    billing: 'Lisensi Seumur Hidup (Lifetime)',
    maxConcurrentDownloads: 10,
    maxThreadsPerTask: 16,
    maxDailyQuotaMb: 0, // unlimited
    allowedSpeedLimit: 'Kecepatan Penuh Tanpa Batas',
    features: [
      'Unduhan simultan tak terbatas',
      '16 segmen koneksi multi-thread (Akselerasi Turbo)',
      'Kecepatan unduhan maksimum tanpa batas (*Uncapped*)',
      'Sistem Penjadwalan Cerdas Multi-Waktu otomatis',
      'Mode Hemat Baterai Cerdas dengan pengaturan sensitif',
      'Brankas Terenkripsi AES-256 militer + Verifikasi SHA-256',
      'Link Grabber pemindai halaman web massal tanpa batas',
      'Notifikasi suara chime & desktop tanpa gangguan iklan'
    ]
  },
  enterprise: {
    id: 'enterprise',
    name: 'Versi Perusahaan',
    badgeLabel: 'ENTERPRISE',
    tagline: 'Untuk tim TI, kantor, server workstation, dan kepatuhan korporat',
    price: 'Rp 199.000',
    billing: 'per lisensi / tahun (SLA Resmi)',
    maxConcurrentDownloads: 50,
    maxThreadsPerTask: 32,
    maxDailyQuotaMb: 0, // unlimited
    allowedSpeedLimit: 'Jalur Prioritas VIP Dedicated',
    features: [
      'Semua fitur lengkap Versi Pro',
      'Hingga 32 segmen paralel ekstrem (*High-Throughput Trunking*)',
      'Dukungan Proxy SOCKS5, HTTP/HTTPS, dan bypass VPN kantor',
      'Sinkronisasi antrean tugas antar-perangkat tim terpusat',
      'Audit log & riwayat integritas unduhan korporat',
      'Pencadangan otomatis ke Brankas Terenkripsi terjadwal',
      'Manajemen kuota bandwidth terdistribusi per divisi',
      'Dukungan teknis prioritas 24/7 & jaminan uptime SLA 99.9%'
    ]
  }
};

export const COMPARISON_MATRIX = [
  {
    feature: 'Unduhan Simultan Bersamaan',
    free: '2 Berkas Aktif',
    pro: 'Tak Terbatas (10+)',
    enterprise: 'Tak Terbatas (50+ Jalur Tim)',
  },
  {
    feature: 'Segmen Multi-Thread per Berkas',
    free: '4 Thread',
    pro: '16 Thread (Akselerasi Turbo)',
    enterprise: '32 Thread (VIP Trunking)',
  },
  {
    feature: 'Batas Kecepatan Bandwidth',
    free: 'Maks. 5 MB/s',
    pro: 'Tanpa Batas (Gigabit)',
    enterprise: 'Prioritas Tertinggi (Dedicated)',
  },
  {
    feature: 'Penjadwalan Hemat Kuota',
    free: '1 Jadwal Tunggal',
    pro: 'Otomatisasi Multi-Jadwal',
    enterprise: 'Jadwal Terpusat & Sinkronisasi Tim',
  },
  {
    feature: 'Enkripsi & Keamanan Berkas',
    free: 'Enkripsi Standar',
    pro: 'AES-256-GCM + SHA-256 Checksum',
    enterprise: 'AES-256-GCM + Audit Log + Auto-Backup',
  },
  {
    feature: 'Mode Hemat Baterai Cerdas',
    free: 'Pemberitahuan Manual',
    pro: 'Auto-Throttle & Auto-Pause Dinamis',
    enterprise: 'Profil Daya Kustom & Optimasi Server',
  },
  {
    feature: 'Integrasi Browser & Grabber',
    free: 'Bookmarklet Dasar',
    pro: 'Link Grabber Massal & Sniffer Clipboard',
    enterprise: 'API Integrasi Tim & Ekstensi Korporat',
  },
  {
    feature: 'Dukungan & Lisensi',
    free: 'Komunitas',
    pro: 'Pembaruan Seumur Hidup',
    enterprise: 'Manajer Akun Dedicated & SLA 24/7',
  },
];

export const CHANGELOG_V1 = [
  {
    version: 'v1.0.0',
    date: '15 Oktober 2026',
    title: 'Rilis Perdana Resmi (Release 1.0)',
    highlights: [
      'Mesin unduhan multi-thread dengan visualisasi segmen real-time.',
      'Sistem jeda (pause) dan lanjutkan (resume) berkas yang andal.',
      'Sistem penjadwalan jam hemat kuota (off-peak midnight schedule).',
      'Integrasi browser: Bookmarklet 1-klik dan deteksi tautan clipboard otomatis.',
      'Mode hemat baterai cerdas dengan integrasi Battery Status API.',
      'Brankas enkripsi file berstandar militer AES-256-GCM dan verifikasi SHA-256.',
      'Pemisahan lisensi: Edisi Gratis, Pro, dan Perusahaan.',
      'Antarmuka bersih bebas distraksi dengan dukungan Mode Gelap (Dark Mode).'
    ]
  }
];
