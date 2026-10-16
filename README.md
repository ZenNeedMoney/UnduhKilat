# ⚡ UnduhKilat Manager (v1.0.0)

[![Versi](https://img.shields.io/badge/version-v1.0.0-blue.svg?style=flat-square)](https://github.com)
[![Build](https://img.shields.io/badge/build-2026.10.15--STABLE-emerald.svg?style=flat-square)](https://github.com)
[![Keamanan](https://img.shields.io/badge/security-Grade%20A%2B%20(OWASP)-success.svg?style=flat-square)](https://github)
[![Lisensi](https://img.shields.io/badge/edisi-Gratis%20%7C%20Pro%20%7C%20Perusahaan-purple.svg?style=flat-square)](https://github)
[![Hak Cipta](https://img.shields.io/badge/hak%20cipta-%C2%A9%202026%20Raihan%20Nur%20Syifa-orange.svg?style=flat-square)](https://github)

**UnduhKilat Manager** adalah aplikasi pengelola unduhan berkas modern, cepat, aman, dan berkinerja tinggi. Dibangun dengan fokus pada keandalan transfer data, efisiensi bandwidth, privasi berkas berstandar militer, serta antarmuka pengguna responsif tanpa distraksi.

Aplikasi ini mencakup **Portal Web Pengunduhan Resmi** (tempat mengunduh installer desktop Windows, macOS, dan Linux) sekaligus **Aplikasi Web / Dashboard Manajer Unduhan Aktif**.

---

## 📌 Daftar Isi
- [Keunggulan Utama](#-keunggulan-utama)
- [Pilihan Lisensi & Tingkatan Edisi](#-pilihan-lisensi--tingkatan-edisi)
- [Portal Web Pengunduhan Resmi](#-portal-web-pengunduhan-resmi)
- [Arsitektur Keamanan Teruji (Grade A+)](#-arsitektur-keamanan-teruji-grade-a)
- [Teknologi yang Digunakan](#-teknologi-yang-digunakan)
- [Struktur Direktori](#-struktur-direktori)
- [Panduan Instalasi & Menjalankan](#-panduan-instalasi--menjalankan)
- [Hak Cipta & Kepemilikan](#-hak-cipta--kepemilikan)

---

## 🚀 Keunggulan Utama

### 1. Akselerasi Multi-Thread & Segmentasi Paralel
- Pembagian berkas menjadi beberapa segmen unduhan simultan (hingga 32 segmen paralel pada versi Enterprise).
- Pemanfaatan *HTTP Range Headers* untuk memaksimalkan kapasitas bandwidth ISP.
- Visualisasi progres per-segmen koneksi secara *real-time*.

### 2. Mesin Jeda (Pause) & Lanjutkan (Resume) Andal
- Mengatasi gangguan jaringan tanpa perlu mengulang proses unduh dari nol.
- Pemantauan status transfer byte demi byte dengan mekanisme *safe fallback*.

### 3. Penjadwalan Jam Hemat Kuota (Off-Peak Scheduler)
- Mengotomatiskan proses unduhan pada jam kalong/malam (misalnya pukul 00:00 - 06:00) saat kuota malam lebih murah atau kecepatan jaringan optimal.
- Menghitung akumulasi kuota yang berhasil dihemat setiap harinya.

### 4. Brankas Enkripsi Berkas Militer (AES-256-GCM + SHA-256)
- Perlindungan berkas sensitif dengan kata sandi langsung di sisi klien menggunakan **Web Crypto API (AES-256-GCM)**.
- Otentikasi integritas data dengan **SHA-256 Checksum** untuk mencegah manipulasi atau korupsi data.

### 5. Integrasi Browser & Detektor Tautan Cerdas
- **Bookmarklet 1-Klik**: Seret bookmarklet ke bilah bookmark browser Anda untuk menangkap tautan berkas dari situs mana pun.
- **Deteksi Tautan Clipboard Otomatis**: Secara cerdas mengenali tautan unduhan valid saat disalin ke clipboard pengguna.
- **Batch Link Grabber**: Ekstraksi massal puluhan berkas (gambar, audio, dokumen, video) dari kode sumber halaman web.

### 6. Mode Hemat Baterai Pintar (Battery Saver)
- Terintegrasi langsung dengan **Battery Status API**.
- Otomatis memperlambat atau menunda antrean unduhan berat saat perangkat menggunakan daya baterai di bawah ambang batas yang ditentukan.

---

## 💎 Pilihan Lisensi & Tingkatan Edisi

UnduhKilat Manager dirancang fleksibel untuk kebutuhan perorangan hingga instansi berskala besar:

| Fitur / Parameter | 🆓 Versi Gratis | ⚡ Versi Pro | 🏢 Versi Perusahaan (Enterprise) |
| :--- | :--- | :--- | :--- |
| **Harga** | **Rp 0** (Gratis Selamanya) | **Rp 49.000** (Lifetime) | **Rp 199.000** (Per Lisensi/Tahun) |
| **Unduhan Simultan** | Maksimal 2 tugas | Tak Terbatas (10+) | Tak Terbatas (50+ Jalur Tim) |
| **Segmen Koneksi** | 4 segmen paralel | 16 segmen (*Turbo*) | 32 segmen (*VIP Trunking*) |
| **Batas Kecepatan** | Hingga 5 MB/s | Kecepatan Penuh (*Uncapped*) | Jalur Prioritas Dedicated |
| **Batas Kuota Harian** | 5 GB / hari | Tanpa Batas Kuota | Tanpa Batas Kuota |
| **Penjadwalan Kuota** | 1 Jadwal Tunggal | Multi-Jadwal Otomatis | Penjadwalan Terpusat & Tim |
| **Enkripsi Brankas** | Enkripsi Sandi Dasar | AES-256-GCM + SHA-256 | AES-256-GCM + Audit Log + Auto Backup |
| **Link Grabber** | Bookmarklet Standar | Pemindai Massal Uncapped | Ekstensi & API Tim Korporat |
| **Dukungan** | Komunitas | Update Seumur Hidup | Dedicated SLA 24/7 Uptime 99.9% |

---

## 🌐 Portal Web Pengunduhan Resmi

Proyek ini telah dilengkapi dengan situs pendaratan resmi (*Download Landing Portal*) yang memudahkan distribusi aplikasi ke pengguna:

- **Installer Windows**: Paket instalasi `.exe` (x64) dan varian Portabel.
- **Installer macOS**: Paket instalasi `.dmg` yang dioptimalkan untuk Apple Silicon (M1/M2/M3/M4) serta Intel 64-bit.
- **Installer Linux**: Paket distribusi `.deb` (Ubuntu, Debian, Mint) dan format mandiri `.AppImage`.
- **Peluncur Versi Web (Web App)**: Tombol instan untuk menjalankan manajer unduhan langsung di browser tanpa perlu instalasi.

---

## 🛡️ Arsitektur Keamanan Teruji (Grade A+)

Keamanan web dan aplikasi diaudit secara berkala dengan standar tinggi:

1. **Content Security Policy (CSP) Ketat**:
   - Mencegah serangan *Cross-Site Scripting* (XSS) dan injeksi skrip eksternal tak berizin.
2. **Anti-SSRF & Intranet Shield**:
   - Memblokir permintaan ke alamat IP privat lokal (`127.0.0.1`, `localhost`, `10.0.0.0/8`, `192.168.0.0/16`, `172.16.0.0/12`), loopback IPv6 (`::1`), dan alamat metadata *cloud* (`169.254.169.254`).
   - Mencegah eksploitasi port berbahaya (SSH, Telnet, SMTP, dsb.).
3. **Penyaringan Nama Berkas & Path Traversal**:
   - Membersihkan karakter berbahaya (`../`, `..\`, null bytes, dll.) dari nama berkas unduhan.
4. **Deteksi Unicode RTL Spoofing**:
   - Mencegah manipulasi ekstensi menggunakan karakter terbalik (*Right-to-Left Override Trojan*).
5. **Kebijakan Header Browser Modern**:
   - Dilengkapi `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, dan `Permissions-Policy` pembatasan perangkat keras.

---

## 💻 Teknologi yang Digunakan

- **Frontend Core**: [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) (dengan palet warna Netral, Biru, Zamrud, dan Mode Gelap penuh)
- **Ikonografi**: [Lucide React](https://lucide.dev)
- **Kriptografi**: Web Cryptography API (`crypto.subtle`) untuk AES-GCM & SHA-256
- **Build Tool**: [Vite](https://vitejs.dev)
- **Backend / Proxy Ringan**: Node.js & Express

---

## 📂 Struktur Direktori

```text
├── index.html                   # Entry point HTML dengan CSP & metadata resmi
├── metadata.json                # Konfigurasi metadata aplikasi
├── package.json                 # Konfigurasi dependensi dan skrip proyek
├── vite.config.ts               # Konfigurasi Vite bundler
├── src/
│   ├── main.tsx                 # Titik masuk React root
│   ├── App.tsx                  # Komponen orkestrasi utama, manajemen state & router portal/app
│   ├── types.ts                 # Definisi antarmuka TypeScript
│   ├── components/
│   │   ├── Header.tsx           # Bilah navigasi atas, kecepatan real-time, aksi cepat
│   │   ├── Sidebar.tsx          # Navigasi kategori, filter status, pengatur baterai & lisensi
│   │   ├── DownloadList.tsx     # Tabel daftar unduhan aktif dengan kontrol per-tugas
│   │   ├── Footer.tsx           # Footer aplikasi dengan versi v1.0.0 & hak cipta
│   │   ├── LandingPortal.tsx    # Halaman landing portal unduhan resmi untuk Windows/Mac/Linux
│   │   ├── SecurityCenterModal.tsx # Pusat audit keamanan live, pemindai exploit, dan OWASP
│   │   ├── VersionPricingModal.tsx # Dialog perbandingan lisensi Gratis, Pro, & Perusahaan
│   │   ├── AddDownloadModal.tsx # Dialog tambah tautan dengan pemindaian keamanan instan
│   │   ├── BatchLinkGrabberModal.tsx # Pemindai & pengambil tautan massal dari website
│   │   ├── SchedulerModal.tsx   # Pengatur jadwal jam hemat kuota malam
│   │   ├── BatterySaverModal.tsx# Pengaturan otomasi hemat daya baterai
│   │   ├── EncryptionVaultModal.tsx # Brankas berkas terenkripsi AES-256
│   │   ├── DownloadDetailModal.tsx  # Rincian detail tugas, segmen koneksi, dan checksum
│   │   ├── BrowserExtensionModal.tsx# Panduan pemasangan bookmarklet browser
│   │   └── SpeedGraphWidget.tsx # Grafik canvas bandwidth unduhan real-time
│   ├── utils/
│   │   ├── security.ts          # Validasi URL, Anti-SSRF, sanitasi berkas, dan audit report
│   │   ├── crypto.ts            # Enkripsi/dekripsi AES-256-GCM & kalkulasi SHA-256
│   │   ├── formatters.ts        # Helper pemformatan bytes, waktu, kecepatan, dan ekstensi
│   │   ├── sounds.ts            # Generator audio chime Web Audio API untuk notifikasi
│   │   └── browserSniffer.ts    # Skrip bookmarklet sniffer tautan browser
│   └── data/
│       └── tierConfig.ts        # Konfigurasi lisensi (Gratis, Pro, Perusahaan), changelog & hak cipta
```

---

## 🛠️ Panduan Instalasi & Menjalankan

### Prasyarat
- [Node.js](https://nodejs.org) (versi 18 atau lebih tinggi)
- Pengelola paket `npm`

### Langkah-langkah

1. **Kloning Repositori**:
   ```bash
   git clone https://github.com/username/unduhkilat-manager.git
   cd unduhkilat-manager
   ```

2. **Pasang Dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Server Pengembangan (Dev Server)**:
   ```bash
   npm run dev
   ```
   Buka peramban dan akses alamat: `http://localhost:3000`

4. **Kompilasi & Pengecekan Tipe TypeScript**:
   ```bash
   npm run lint
   ```

5. **Membangun Versi Siap Produksi (Build Production)**:
   ```bash
   npm run build
   ```
   Hasil berkas build yang dioptimalkan akan tersimpan di direktori `dist/`.

---

## 📄 Hak Cipta & Kepemilikan

Seluruh kode sumber, desain antarmuka, dan dokumentasi aplikasi ini secara resmi berada di bawah kepemilikan dan hak cipta:

**© 2026 Raihan Nur Syifa. Seluruh Hak Cipta Dilindungi Undang-Undang.**

Untuk pertanyaan, kolaborasi, atau lisensi komersial perusahaan, silakan hubungi pemilik hak cipta melalui email:  
📫 **raihan.nurs123@gmail.com**

---

*Dibuat dengan dedikasi untuk menghadirkan pengalaman mengunduh berkas yang cepat, aman, dan tanpa hambatan.*
