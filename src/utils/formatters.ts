import { DownloadTask } from '../types';

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0 || !Number.isFinite(bytes)) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(Math.max(1, bytes)) / Math.log(k));
  const safeI = Math.min(i, sizes.length - 1);
  return `${parseFloat((bytes / Math.pow(k, safeI)).toFixed(dm))} ${sizes[safeI]}`;
}

export function formatSpeed(bytesPerSec: number): string {
  if (!bytesPerSec || bytesPerSec <= 0 || !Number.isFinite(bytesPerSec)) return '0 KB/s';
  if (bytesPerSec >= 1024 * 1024) {
    return `${(bytesPerSec / (1024 * 1024)).toFixed(1)} MB/s`;
  }
  return `${(bytesPerSec / 1024).toFixed(0)} KB/s`;
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0 || !Number.isFinite(seconds)) return '--';
  if (seconds >= 3600) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hours}j ${mins}m`;
  }
  if (seconds >= 60) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}d`;
  }
  return `${Math.floor(seconds)}d`;
}

export function detectCategoryFromFilename(filename: string): DownloadTask['category'] {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  
  const videoExts = ['mp4', 'mkv', 'avi', 'mov', 'webm', 'flv', 'wmv', 'm4v'];
  const audioExts = ['mp3', 'flac', 'wav', 'aac', 'ogg', 'm4a', 'wma'];
  const archiveExts = ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'iso', 'xz'];
  const programExts = ['exe', 'msi', 'dmg', 'pkg', 'deb', 'rpm', 'apk', 'appimage'];
  const documentExts = ['pdf', 'docx', 'doc', 'xlsx', 'xls', 'pptx', 'ppt', 'txt', 'csv', 'epub'];

  if (videoExts.includes(ext)) return 'video';
  if (audioExts.includes(ext)) return 'audio';
  if (archiveExts.includes(ext)) return 'archive';
  if (programExts.includes(ext)) return 'program';
  if (documentExts.includes(ext)) return 'document';
  return 'other';
}

export function getFilenameFromUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    const segments = pathname.split('/').filter(Boolean);
    const last = segments[segments.length - 1];
    if (last && last.includes('.')) {
      return decodeURIComponent(last);
    }
    // Fallback if URL ends in query params
    const queryFilename = parsed.searchParams.get('filename') || parsed.searchParams.get('file');
    if (queryFilename) return decodeURIComponent(queryFilename);
    
    return last ? decodeURIComponent(last) : 'unduhan_file_' + Date.now().toString().slice(-4);
  } catch {
    const parts = url.split('/');
    const last = parts[parts.length - 1]?.split('?')[0];
    return last || 'unduhan_file_' + Date.now().toString().slice(-4);
  }
}

export function getExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()?.toUpperCase() || '' : 'FILE';
}

export function formatTime24(hours: number, minutes: number): string {
  const h = hours.toString().padStart(2, '0');
  const m = minutes.toString().padStart(2, '0');
  return `${h}:${m}`;
}
