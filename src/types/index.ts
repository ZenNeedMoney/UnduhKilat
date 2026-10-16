export type FileCategory = 
  | 'all'
  | 'document'
  | 'video'
  | 'audio'
  | 'program'
  | 'archive'
  | 'encrypted'
  | 'scheduled';

export type DownloadStatus = 
  | 'downloading'
  | 'paused'
  | 'completed'
  | 'queued'
  | 'scheduled'
  | 'error';

export type PriorityLevel = 'high' | 'normal' | 'low';

export interface DownloadSegment {
  id: number;
  startByte: number;
  endByte: number;
  downloadedBytes: number;
  progress: number; // 0 to 100
  active: boolean;
}

export interface DownloadTask {
  id: string;
  filename: string;
  url: string;
  category: 'document' | 'video' | 'audio' | 'program' | 'archive' | 'other';
  totalBytes: number;
  downloadedBytes: number;
  status: DownloadStatus;
  speed: number; // bytes per second
  eta: number; // seconds remaining
  priority: PriorityLevel;
  segments: DownloadSegment[];
  createdAt: number;
  completedAt?: number;
  scheduledTime?: string; // HH:mm format e.g. "01:30"
  scheduledDate?: string; // YYYY-MM-DD
  isEncrypted: boolean;
  encryptionPassword?: string;
  checksumSha256?: string;
  checksumMd5?: string;
  blobUrl?: string;
  rawBlob?: Blob;
  mimeType?: string;
  errorMessage?: string;
  retryCount?: number;
  autoSaveToDisk?: boolean;
}

export interface SchedulerConfig {
  enabled: boolean;
  startHour: number; // e.g. 0 (00:00)
  startMinute: number;
  endHour: number; // e.g. 6 (06:00)
  endMinute: number;
  quotaLimitMb: number; // 0 for unlimited, e.g. 2048 for 2GB
  autoPauseOnBattery: boolean;
  pauseAfterSchedule: boolean;
  activeDays: number[]; // 0 = Sun, 1 = Mon ...
}

export interface BatteryState {
  supported: boolean;
  level: number; // 0 - 100
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  saverEnabled: boolean;
  threshold: number; // e.g. 25%
  autoPauseOnLowBattery: boolean;
  throttleOnBattery: boolean;
}

export interface NotificationSettings {
  supported: boolean;
  permission: NotificationPermission;
  soundEnabled: boolean;
  desktopEnabled: boolean;
  notifyOnComplete: boolean;
  notifyOnScheduledStart: boolean;
  notifyOnQuotaWarning: boolean;
}

export interface BandwidthStats {
  currentDownloadSpeed: number; // bytes/sec
  totalDownloadedToday: number; // bytes
  quotaSavedMidnight: number; // bytes
  speedHistory: number[]; // last 30 data points for live chart
}

export type SpeedLimit = 'unlimited' | 512 | 1024 | 2048 | 5120 | 10240; // in KB/s

export type LicenseTier = 'free' | 'pro' | 'enterprise';

export interface TierConfig {
  id: LicenseTier;
  name: string;
  badgeLabel: string;
  tagline: string;
  price: string;
  billing: string;
  maxConcurrentDownloads: number;
  maxThreadsPerTask: number;
  maxDailyQuotaMb: number; // 0 for unlimited
  allowedSpeedLimit: string;
  features: string[];
}
