import { DownloadTask } from '../types';

export const INITIAL_DOWNLOADS: DownloadTask[] = [
  {
    id: 'dl-1',
    filename: 'Ubuntu-24.04-desktop-amd64.iso',
    url: 'https://releases.ubuntu.com/24.04/ubuntu-24.04-desktop-amd64.iso',
    category: 'archive',
    totalBytes: 5976883200, // ~5.56 GB
    downloadedBytes: 3884974080, // ~65%
    status: 'downloading',
    speed: 12450000, // ~11.8 MB/s
    eta: 168,
    priority: 'high',
    isEncrypted: false,
    checksumSha256: 'a1b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcdef0',
    createdAt: Date.now() - 1200000,
    segments: [
      { id: 1, startByte: 0, endByte: 1494220800, downloadedBytes: 1494220800, progress: 100, active: false },
      { id: 2, startByte: 1494220800, endByte: 2988441600, downloadedBytes: 1494220800, progress: 100, active: false },
      { id: 3, startByte: 2988441600, endByte: 4482662400, downloadedBytes: 896532480, progress: 60, active: true },
      { id: 4, startByte: 4482662400, endByte: 5976883200, downloadedBytes: 0, progress: 0, active: true },
    ]
  },
  {
    id: 'dl-2',
    filename: 'Blender-4.2-LTS-windows-x64.msi',
    url: 'https://download.blender.org/release/Blender4.2/blender-4.2.0-windows-x64.msi',
    category: 'program',
    totalBytes: 365850000, // ~348 MB
    downloadedBytes: 182925000,
    status: 'paused',
    speed: 0,
    eta: 0,
    priority: 'normal',
    isEncrypted: false,
    createdAt: Date.now() - 3600000,
    segments: [
      { id: 1, startByte: 0, endByte: 91462500, downloadedBytes: 91462500, progress: 100, active: false },
      { id: 2, startByte: 91462500, endByte: 182925000, downloadedBytes: 91462500, progress: 100, active: false },
      { id: 3, startByte: 182925000, endByte: 274387500, downloadedBytes: 0, progress: 0, active: false },
      { id: 4, startByte: 274387500, endByte: 365850000, downloadedBytes: 0, progress: 0, active: false },
    ]
  },
  {
    id: 'dl-3',
    filename: 'Nature_4K_HDR_Cinematic_Wildlife.mp4',
    url: 'https://archive.org/download/NatureWildlife4K/Nature_4K_HDR_Cinematic_Wildlife.mp4',
    category: 'video',
    totalBytes: 1845493760, // ~1.71 GB
    downloadedBytes: 0,
    status: 'scheduled',
    speed: 0,
    eta: 0,
    priority: 'normal',
    scheduledTime: '01:00',
    isEncrypted: false,
    createdAt: Date.now() - 7200000,
    segments: [
      { id: 1, startByte: 0, endByte: 461373440, downloadedBytes: 0, progress: 0, active: false },
      { id: 2, startByte: 461373440, endByte: 922746880, downloadedBytes: 0, progress: 0, active: false },
      { id: 3, startByte: 922746880, endByte: 1384120320, downloadedBytes: 0, progress: 0, active: false },
      { id: 4, startByte: 1384120320, endByte: 1845493760, downloadedBytes: 0, progress: 0, active: false },
    ]
  },
  {
    id: 'dl-4',
    filename: 'Dokumen_Laporan_Keuangan_Kuartal3.pdf',
    url: 'https://example.com/vault/Dokumen_Laporan_Keuangan_Kuartal3.pdf',
    category: 'document',
    totalBytes: 25480000, // ~24.3 MB
    downloadedBytes: 25480000,
    status: 'completed',
    speed: 0,
    eta: 0,
    priority: 'high',
    isEncrypted: true,
    encryptionPassword: 'admin',
    checksumSha256: '9f837fc8d73b22b0c36b42b109121666ec483f23a5cf6e0fae74011cb1e13e11',
    createdAt: Date.now() - 86400000,
    completedAt: Date.now() - 3600000,
    segments: [
      { id: 1, startByte: 0, endByte: 25480000, downloadedBytes: 25480000, progress: 100, active: false }
    ]
  },
  {
    id: 'dl-5',
    filename: 'Master_Soundtrack_Orchestra_FLAC.zip',
    url: 'https://example.com/audio/Master_Soundtrack_Orchestra_FLAC.zip',
    category: 'audio',
    totalBytes: 524288000, // ~500 MB
    downloadedBytes: 524288000,
    status: 'completed',
    speed: 0,
    eta: 0,
    priority: 'normal',
    isEncrypted: false,
    checksumSha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    createdAt: Date.now() - 172800000,
    completedAt: Date.now() - 86400000,
    segments: [
      { id: 1, startByte: 0, endByte: 524288000, downloadedBytes: 524288000, progress: 100, active: false }
    ]
  }
];

export const PRESET_DOWNLOADS = [
  {
    name: 'Arch Linux ISO (Direct Mirror)',
    url: 'https://geo.mirror.pkgbuild.com/iso/latest/archlinux-x86_64.iso',
    size: 1100000000,
    category: 'archive' as const
  },
  {
    name: 'Big Buck Bunny 4K (Open Source Video)',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    size: 158008374,
    category: 'video' as const
  },
  {
    name: 'Git SCM Setup Installer (v2.46.0)',
    url: 'https://github.com/git-for-windows/git/releases/download/v2.46.0.windows.1/Git-2.46.0-64-bit.exe',
    size: 61865984,
    category: 'program' as const
  },
  {
    name: 'Vivaldi Browser Source Code',
    url: 'https://downloads.vivaldi.com/source/vivaldi-source_6.8.3381.50.tar.xz',
    size: 420000000,
    category: 'archive' as const
  },
  {
    name: 'Debian Minimal Network Boot ISO',
    url: 'https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-12.7.0-amd64-netinst.iso',
    size: 650000000,
    category: 'archive' as const
  }
];
