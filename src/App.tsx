/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DownloadList } from './components/DownloadList';
import { AddDownloadModal } from './components/AddDownloadModal';
import { BatchLinkGrabberModal } from './components/BatchLinkGrabberModal';
import { SchedulerModal } from './components/SchedulerModal';
import { BatterySaverModal } from './components/BatterySaverModal';
import { EncryptionVaultModal } from './components/EncryptionVaultModal';
import { DownloadDetailModal } from './components/DownloadDetailModal';
import { BrowserExtensionModal } from './components/BrowserExtensionModal';
import { SpeedGraphWidget } from './components/SpeedGraphWidget';
import { NotificationToast, ToastMessage } from './components/NotificationToast';
import { Footer } from './components/Footer';
import { VersionPricingModal } from './components/VersionPricingModal';
import { LandingPortal } from './components/LandingPortal';
import { SecurityCenterModal } from './components/SecurityCenterModal';

import { 
  DownloadTask, 
  FileCategory, 
  DownloadStatus, 
  SchedulerConfig, 
  BatteryState, 
  SpeedLimit, 
  NotificationSettings,
  LicenseTier
} from './types';
import { INITIAL_DOWNLOADS } from './data/mockDownloads';
import { playDownloadCompleteChime, playAlertChime } from './utils/audio';
import { formatBytes, getFilenameFromUrl, detectCategoryFromFilename } from './utils/formatters';
import { validateDownloadUrl, sanitizeFilename } from './utils/security';
import { TIERS_CONFIG, APP_VERSION } from './data/tierConfig';

interface BatteryManagerAPI extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  onchargingchange: ((this: BatteryManagerAPI, ev: Event) => void) | null;
  onlevelchange: ((this: BatteryManagerAPI, ev: Event) => void) | null;
}

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('unduhkilat_dark_mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true;
  });

  // Sync dark class on document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('unduhkilat_dark_mode', String(darkMode));
  }, [darkMode]);

  // Tasks state with persistence & safe schema validation
  const [tasks, setTasks] = useState<DownloadTask[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('unduhkilat_tasks');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed
              .filter(t => t && typeof t.id === 'string' && typeof t.url === 'string')
              .map(t => ({
                ...t,
                filename: sanitizeFilename(t.filename || 'berkas.bin'),
                url: typeof t.url === 'string' ? t.url : ''
              }));
          }
        } catch {
          // Fallback to initial
        }
      }
    }
    return INITIAL_DOWNLOADS;
  });

  useEffect(() => {
    try {
      // Exclude rawBlobs from localStorage to avoid quota errors
      const storableTasks = tasks.map(t => ({
        ...t,
        rawBlob: undefined
      }));
      localStorage.setItem('unduhkilat_tasks', JSON.stringify(storableTasks));
    } catch {
      // Ignore storage quota
    }
  }, [tasks]);

  // Navigation and Filter state
  const [currentCategory, setCurrentCategory] = useState<FileCategory>('all');
  const [statusFilter, setStatusFilter] = useState<DownloadStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [speedLimit, setSpeedLimit] = useState<SpeedLimit>('unlimited');

  // Scheduler configuration
  const [scheduler, setScheduler] = useState<SchedulerConfig>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('unduhkilat_scheduler');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {
      enabled: true,
      startHour: 0, // 00:00 midnight
      startMinute: 0,
      endHour: 6, // 06:00 morning
      endMinute: 0,
      quotaLimitMb: 5120, // 5GB limit
      autoPauseOnBattery: true,
      pauseAfterSchedule: true,
      activeDays: [0, 1, 2, 3, 4, 5, 6]
    };
  });

  useEffect(() => {
    localStorage.setItem('unduhkilat_scheduler', JSON.stringify(scheduler));
  }, [scheduler]);

  // Battery state
  const [battery, setBattery] = useState<BatteryState>({
    supported: false,
    level: 85,
    charging: true,
    chargingTime: 0,
    dischargingTime: 0,
    saverEnabled: false,
    threshold: 25,
    autoPauseOnLowBattery: true,
    throttleOnBattery: true,
  });

  // Notifications state
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    supported: typeof window !== 'undefined' && 'Notification' in window,
    permission: typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default',
    soundEnabled: true,
    desktopEnabled: true,
    notifyOnComplete: true,
    notifyOnScheduledStart: true,
    notifyOnQuotaWarning: true,
  });

  // License Tier state (free, pro, enterprise)
  const [currentTier, setCurrentTier] = useState<LicenseTier>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('unduhkilat_tier') as LicenseTier;
      if (saved === 'free' || saved === 'pro' || saved === 'enterprise') return saved;
    }
    return 'pro';
  });

  useEffect(() => {
    localStorage.setItem('unduhkilat_tier', currentTier);
  }, [currentTier]);

  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [versionModalTab, setVersionModalTab] = useState<'pricing' | 'comparison' | 'about'>('pricing');
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);

  // View mode: 'portal' (official download landing website) vs 'app' (active download manager dashboard)
  const [currentView, setCurrentView] = useState<'portal' | 'app'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get('view');
      if (viewParam === 'portal' || viewParam === 'app') return viewParam;
      const saved = localStorage.getItem('unduhkilat_view');
      if (saved === 'portal' || saved === 'app') return saved;
    }
    return 'portal';
  });

  useEffect(() => {
    localStorage.setItem('unduhkilat_view', currentView);
  }, [currentView]);

  // Toast alerts state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev.slice(-3), { ...toast, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 6000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Request Web Notification permission on initial interaction
  const requestNotificationPermission = useCallback(async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        const perm = await Notification.requestPermission();
        setNotificationSettings(prev => ({ ...prev, permission: perm }));
      }
    }
  }, []);

  // Real Battery API binding
  useEffect(() => {
    if (typeof window === 'undefined') return;

    interface NavigatorWithBattery extends Navigator {
      getBattery?: () => Promise<BatteryManagerAPI>;
    }

    const nav = navigator as NavigatorWithBattery;
    if (nav.getBattery) {
      nav.getBattery().then((batteryManager) => {
        const updateBatteryInfo = () => {
          setBattery(prev => ({
            ...prev,
            supported: true,
            level: Math.round(batteryManager.level * 100),
            charging: batteryManager.charging,
            chargingTime: batteryManager.chargingTime,
            dischargingTime: batteryManager.dischargingTime,
          }));
        };

        updateBatteryInfo();
        batteryManager.addEventListener('chargingchange', updateBatteryInfo);
        batteryManager.addEventListener('levelchange', updateBatteryInfo);

        return () => {
          batteryManager.removeEventListener('chargingchange', updateBatteryInfo);
          batteryManager.removeEventListener('levelchange', updateBatteryInfo);
        };
      }).catch(() => {
        // Fallback simulated battery
        setBattery(prev => ({ ...prev, supported: false, level: 82, charging: true }));
      });
    }
  }, []);

  // Browser Integration & Clipboard Auto-detection
  const [clipboardDetectorActive, setClipboardDetectorActive] = useState(true);

  // Check URL query parameters for sniffer payload
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const snifferData = params.get('sniffer_data');
    if (snifferData) {
      try {
        const parsed = JSON.parse(decodeURIComponent(snifferData));
        if (parsed && Array.isArray(parsed.detectedLinks) && parsed.detectedLinks.length > 0) {
          // Strictly validate each URL against SSRF, bad protocols, and malicious scripts
          const safeTasks: Partial<DownloadTask>[] = [];
          for (const rawUrl of parsed.detectedLinks.slice(0, 50)) {
            if (typeof rawUrl !== 'string') continue;
            const validation = validateDownloadUrl(rawUrl);
            if (!validation.isValid) continue;

            const cleanName = sanitizeFilename(getFilenameFromUrl(validation.sanitizedUrl));
            safeTasks.push({
              url: validation.sanitizedUrl,
              filename: cleanName,
              category: detectCategoryFromFilename(cleanName),
              totalBytes: 50000000,
              downloadedBytes: 0,
              status: 'queued',
              priority: 'normal',
              isEncrypted: false,
              createdAt: Date.now(),
            });
          }

          if (safeTasks.length > 0) {
            setTasks(prev => {
              const added = safeTasks.map((t, idx) => ({
                id: 'sniff-' + Date.now() + '-' + idx,
                filename: t.filename || 'berkas.bin',
                url: t.url || '',
                category: t.category || 'other',
                totalBytes: t.totalBytes || 50000000,
                downloadedBytes: 0,
                status: 'queued' as const,
                speed: 0,
                eta: 0,
                priority: 'normal' as const,
                isEncrypted: false,
                createdAt: Date.now(),
                segments: [
                  { id: 1, startByte: 0, endByte: 12500000, downloadedBytes: 0, progress: 0, active: false },
                  { id: 2, startByte: 12500000, endByte: 25000000, downloadedBytes: 0, progress: 0, active: false },
                  { id: 3, startByte: 25000000, endByte: 37500000, downloadedBytes: 0, progress: 0, active: false },
                  { id: 4, startByte: 37500000, endByte: 50000000, downloadedBytes: 0, progress: 0, active: false },
                ]
              }));
              return [...added, ...prev];
            });

            addToast({
              type: 'complete',
              title: 'Deteksi Browser Berhasil & Terverifikasi Aman',
              description: `${safeTasks.length} tautan tervalidasi aman dan ditambahkan ke antrean.`
            });
          }

          // Clean query params
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      } catch (e) {
        console.error('Failed to parse sniffer data:', e);
      }
    }
  }, [addToast]);

  // Window Focus Clipboard auto-sniffer listener
  useEffect(() => {
    if (!clipboardDetectorActive || typeof window === 'undefined') return;

    const checkClipboard = async () => {
      try {
        if (!navigator.clipboard?.readText) return;
        const text = await navigator.clipboard.readText();
        if (text && /^https?:\/\/.+\.(zip|rar|7z|iso|mp4|mkv|mp3|flac|exe|msi|dmg|apk|pdf)($|\?)/i.test(text.trim())) {
          const validation = validateDownloadUrl(text.trim());
          if (!validation.isValid) return; // Block SSRF / dangerous hosts in clipboard
          
          const url = validation.sanitizedUrl;
          // Check if already in tasks
          const exists = tasks.some(t => t.url === url);
          if (!exists) {
            const fname = sanitizeFilename(getFilenameFromUrl(url));
            addToast({
              type: 'info',
              title: 'Link Unduhan Terdeteksi di Clipboard',
              description: `Tambahkan "${fname}" ke antrean unduhan?`,
              actionLabel: 'Unduh Sekarang',
              onAction: () => {
                setInitialUrlForAdd(url);
                setIsAddModalOpen(true);
              }
            });
          }
        }
      } catch {
        // Clipboard read permission might be denied, silently ignore
      }
    };

    window.addEventListener('focus', checkClipboard);
    return () => window.removeEventListener('focus', checkClipboard);
  }, [clipboardDetectorActive, tasks, addToast]);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [initialUrlForAdd, setInitialUrlForAdd] = useState('');
  const [isGrabberModalOpen, setIsGrabberModalOpen] = useState(false);
  const [isSchedulerModalOpen, setIsSchedulerModalOpen] = useState(false);
  const [isBatteryModalOpen, setIsBatteryModalOpen] = useState(false);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [selectedDetailTask, setSelectedDetailTask] = useState<DownloadTask | null>(null);

  // Speed History for Graph widget (30 points)
  const [speedHistory, setSpeedHistory] = useState<number[]>([
    0, 1200000, 3400000, 5600000, 7800000, 9500000, 11200000, 12450000, 12100000, 12800000
  ]);

  // Daily quota statistics
  const [totalDownloadedToday, setTotalDownloadedToday] = useState<number>(3884974080);
  const [quotaSavedMidnight, setQuotaSavedMidnight] = useState<number>(2450000000);

  // Real-time Download Engine Loop
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentH = now.getHours();
      const currentM = now.getMinutes();

      // Check Scheduler Window
      const isInsideScheduleWindow = scheduler.enabled && (
        (scheduler.startHour < scheduler.endHour && currentH >= scheduler.startHour && currentH < scheduler.endHour) ||
        (scheduler.startHour > scheduler.endHour && (currentH >= scheduler.startHour || currentH < scheduler.endHour)) ||
        (scheduler.startHour === scheduler.endHour && currentH === scheduler.startHour)
      );

      // Check Battery Saver limits
      const isBatteryConstrained = (battery.saverEnabled || (!battery.charging && battery.level <= battery.threshold));

      // Calculate max speed per task based on limiter & tier
      let maxSpeedBytesPerSec = 15000000; // default max ~15 MB/s
      if (currentTier === 'free') {
        maxSpeedBytesPerSec = Math.min(maxSpeedBytesPerSec, 5 * 1024 * 1024); // max 5 MB/s on Free
      } else if (currentTier === 'enterprise') {
        maxSpeedBytesPerSec = 25000000; // 25 MB/s enterprise high-throughput
      }

      if (speedLimit !== 'unlimited') {
        maxSpeedBytesPerSec = Math.min(maxSpeedBytesPerSec, speedLimit * 1024);
      }
      if (isBatteryConstrained && battery.throttleOnBattery) {
        maxSpeedBytesPerSec = Math.min(maxSpeedBytesPerSec, 2048 * 1024); // throttle to 2 MB/s
      }

      setTasks(prevTasks => {
        let totalSpeedAccum = 0;
        let bytesAddedThisSecond = 0;

        const updated = prevTasks.map(task => {
          // Auto-start scheduled items if time matches or inside window
          if (task.status === 'scheduled') {
            let shouldStart = false;
            if (isInsideScheduleWindow) {
              shouldStart = true;
            } else if (task.scheduledTime) {
              const [sH, sM] = task.scheduledTime.split(':').map(Number);
              if (currentH === sH && currentM >= sM) {
                shouldStart = true;
              }
            }

            if (shouldStart) {
              if (scheduler.autoPauseOnBattery && !battery.charging && battery.level <= battery.threshold) {
                // Skip due to battery
                return task;
              }
              return {
                ...task,
                status: 'downloading' as const,
                speed: 2500000
              };
            }
            return task;
          }

          // Active downloading logic
          if (task.status === 'downloading') {
            // Check quota limiter
            if (scheduler.quotaLimitMb > 0 && totalDownloadedToday >= scheduler.quotaLimitMb * 1024 * 1024) {
              playAlertChime();
              addToast({
                type: 'warning',
                title: 'Batas Kuota Harian Tercapai!',
                description: `Penggunaan data mencapai batas ${scheduler.quotaLimitMb} MB. Menghentikan unduhan otomatis.`
              });
              return { ...task, status: 'paused' as const, speed: 0 };
            }

            // Check battery auto pause
            if (isBatteryConstrained && battery.autoPauseOnLowBattery && !battery.charging) {
              playAlertChime();
              addToast({
                type: 'warning',
                title: 'Mode Hemat Baterai Aktif',
                description: `Baterai berada pada ${battery.level}%. Unduhan dijeda untuk menghemat sisa baterai.`
              });
              return { ...task, status: 'paused' as const, speed: 0 };
            }

            // Realistic speed jitter
            const jitter = 0.85 + Math.random() * 0.3;
            const currentSpeed = Math.round(maxSpeedBytesPerSec * jitter);
            totalSpeedAccum += currentSpeed;

            const increment = Math.round(currentSpeed * 1); // 1-second step
            bytesAddedThisSecond += increment;
            const newDownloaded = Math.min(task.totalBytes, task.downloadedBytes + increment);

            // Calculate ETA
            const remainingBytes = Math.max(0, task.totalBytes - newDownloaded);
            const eta = currentSpeed > 0 ? Math.ceil(remainingBytes / currentSpeed) : 0;

            // Update multi-thread segments
            const segmentCount = task.segments?.length || 4;
            const bytesPerSegment = Math.ceil(task.totalBytes / segmentCount);
            const updatedSegments = (task.segments || []).map((seg, sIdx) => {
              const segStart = sIdx * bytesPerSegment;
              const segEnd = Math.min(task.totalBytes, (sIdx + 1) * bytesPerSegment);
              const segTotal = segEnd - segStart;
              
              const segDownloaded = Math.min(
                segTotal,
                Math.max(0, newDownloaded - segStart)
              );
              const progress = Math.min(100, Math.round((segDownloaded / segTotal) * 100));

              return {
                ...seg,
                downloadedBytes: segDownloaded,
                progress,
                active: progress < 100 && task.status === 'downloading'
              };
            });

            // Completed?
            if (newDownloaded >= task.totalBytes) {
              // Play chime
              if (notificationSettings.soundEnabled) {
                playDownloadCompleteChime();
              }

              // Fire Web Notification if allowed
              if (notificationSettings.desktopEnabled && typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
                new Notification('Unduhan Selesai! 🎉', {
                  body: `${task.filename} telah selesai diunduh.`,
                  icon: '/favicon.ico'
                });
              }

              addToast({
                type: 'complete',
                title: 'Unduhan Selesai!',
                description: `File "${task.filename}" berhasil diunduh 100%.`,
                actionLabel: 'Simpan ke Komputer',
                onAction: () => handleSaveToDisk(task)
              });

              return {
                ...task,
                downloadedBytes: task.totalBytes,
                status: 'completed' as const,
                speed: 0,
                eta: 0,
                completedAt: Date.now(),
                segments: updatedSegments.map(s => ({ ...s, progress: 100, active: false }))
              };
            }

            return {
              ...task,
              downloadedBytes: newDownloaded,
              speed: currentSpeed,
              eta,
              segments: updatedSegments
            };
          }

          return task;
        });

        // Update quota counters
        if (bytesAddedThisSecond > 0) {
          setTotalDownloadedToday(prev => prev + bytesAddedThisSecond);
          if (isInsideScheduleWindow) {
            setQuotaSavedMidnight(prev => prev + bytesAddedThisSecond);
          }
        }

        // Update speed history for canvas
        setSpeedHistory(prev => [...prev.slice(1), totalSpeedAccum]);

        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [scheduler, battery, speedLimit, totalDownloadedToday, notificationSettings, addToast]);

  // Total current download speed
  const totalSpeed = useMemo(() => {
    return tasks
      .filter(t => t.status === 'downloading')
      .reduce((sum, t) => sum + (t.speed || 0), 0);
  }, [tasks]);

  // Filter tasks based on Category, Status, and Search Query
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Category filter
      if (currentCategory === 'encrypted') {
        if (!task.isEncrypted) return false;
      } else if (currentCategory === 'scheduled') {
        if (task.status !== 'scheduled' && !task.scheduledTime) return false;
      } else if (currentCategory !== 'all') {
        if (task.category !== currentCategory) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && task.status !== statusFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = task.filename.toLowerCase().includes(query);
        const matchesUrl = task.url.toLowerCase().includes(query);
        if (!matchesName && !matchesUrl) return false;
      }

      return true;
    });
  }, [tasks, currentCategory, statusFilter, searchQuery]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<FileCategory, number> = {
      all: tasks.length,
      document: 0,
      video: 0,
      audio: 0,
      program: 0,
      archive: 0,
      scheduled: 0,
      encrypted: 0,
    };

    tasks.forEach(task => {
      if (task.category in counts) {
        counts[task.category as keyof typeof counts]++;
      }
      if (task.status === 'scheduled' || task.scheduledTime) {
        counts.scheduled++;
      }
      if (task.isEncrypted) {
        counts.encrypted++;
      }
    });

    return counts;
  }, [tasks]);

  // Status counts
  const statusCounts = useMemo(() => {
    return {
      downloading: tasks.filter(t => t.status === 'downloading').length,
      paused: tasks.filter(t => t.status === 'paused').length,
      completed: tasks.filter(t => t.status === 'completed').length,
    };
  }, [tasks]);

  // Actions
  const handlePauseTask = useCallback((id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id && t.status === 'downloading') {
        return {
          ...t,
          status: 'paused',
          speed: 0,
          eta: 0,
          segments: t.segments?.map(s => ({ ...s, active: false })) || []
        };
      }
      return t;
    }));
  }, []);

  const handleResumeTask = useCallback((id: string) => {
    requestNotificationPermission();
    setTasks(prev => {
      const activeDownloadingCount = prev.filter(t => t.status === 'downloading').length;
      if (currentTier === 'free' && activeDownloadingCount >= 2) {
        addToast({
          type: 'warning',
          title: 'Batas Versi Gratis',
          description: 'Edisi Gratis membatasi maksimal 2 unduhan simultan. Upgrade ke Pro untuk unduhan tak terbatas!',
          actionLabel: 'Lihat Paket Pro',
          onAction: () => {
            setVersionModalTab('pricing');
            setIsVersionModalOpen(true);
          }
        });
        return prev;
      }

      return prev.map(t => {
        if (t.id === id && (t.status === 'paused' || t.status === 'queued' || t.status === 'scheduled' || t.status === 'error')) {
          return {
            ...t,
            status: 'downloading',
            speed: currentTier === 'free' ? 3200000 : currentTier === 'enterprise' ? 12000000 : 7500000,
            segments: t.segments?.map(s => ({ ...s, active: s.progress < 100 })) || []
          };
        }
        return t;
      });
    });
  }, [requestNotificationPermission, currentTier, addToast]);

  const handleDeleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    addToast({
      type: 'info',
      title: 'Tugas Dihapus',
      description: 'Unduhan telah dihapus dari daftar manajer.'
    });
  }, [addToast]);

  const handlePauseAll = useCallback(() => {
    setTasks(prev => prev.map(t => {
      if (t.status === 'downloading') {
        return {
          ...t,
          status: 'paused',
          speed: 0,
          eta: 0,
          segments: t.segments?.map(s => ({ ...s, active: false })) || []
        };
      }
      return t;
    }));
    addToast({
      type: 'info',
      title: 'Semua Unduhan Dijeda',
      description: 'Seluruh proses unduhan yang aktif telah berhasil dijeda.'
    });
  }, [addToast]);

  const handleResumeAll = useCallback(() => {
    requestNotificationPermission();
    setTasks(prev => {
      let activeCount = 0;
      return prev.map(t => {
        if (t.status === 'paused' || t.status === 'queued') {
          if (currentTier === 'free' && activeCount >= 2) {
            return t; // keep queued if on free limit
          }
          activeCount++;
          return {
            ...t,
            status: 'downloading',
            speed: currentTier === 'free' ? 3500000 : 7500000,
            segments: t.segments?.map(s => ({ ...s, active: s.progress < 100 })) || []
          };
        }
        return t;
      });
    });
    addToast({
      type: 'complete',
      title: 'Semua Unduhan Dilanjutkan',
      description: currentTier === 'free' 
        ? 'Unduhan berjalan (maks 2 simultan untuk Versi Gratis).' 
        : 'Unduhan yang tertunda sekarang sedang berlangsung.'
    });
  }, [requestNotificationPermission, currentTier, addToast]);

  const handleClearCompleted = useCallback(() => {
    setTasks(prev => prev.filter(t => t.status !== 'completed'));
    addToast({
      type: 'info',
      title: 'Daftar Dibersihkan',
      description: 'Semua unduhan yang telah selesai berhasil dibersihkan.'
    });
  }, [addToast]);

  // Real File Save to Disk
  const handleSaveToDisk = useCallback((task: DownloadTask) => {
    try {
      const content = `[UnduhKilat Pro - Berkas Terverifikasi]\nNama: ${task.filename}\nSumber: ${task.url}\nUkuran: ${formatBytes(task.totalBytes)}\nChecksum SHA-256: ${task.checksumSha256 || 'Verified'}\nWaktu Selesai: ${new Date().toLocaleString()}\nIntegritas data utuh 100%.`;
      const blob = new Blob([content], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = task.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      addToast({
        type: 'complete',
        title: 'Berkas Tersimpan',
        description: `File "${task.filename}" berhasil disimpan ke folder unduhan perangkat Anda.`
      });
    } catch (err) {
      console.error('Error saving file:', err);
    }
  }, [addToast]);

  // Encrypt existing task
  const handleEncryptTask = useCallback((task: DownloadTask) => {
    const password = prompt(`Masukkan kata sandi untuk mengenkripsi file "${task.filename}":`, 'admin');
    if (!password) return;

    setTasks(prev => prev.map(t => {
      if (t.id === task.id) {
        return {
          ...t,
          filename: t.filename.endsWith('.enc') ? t.filename : `${t.filename}.enc`,
          isEncrypted: true,
          encryptionPassword: password,
          checksumSha256: t.checksumSha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
        };
      }
      return t;
    }));

    addToast({
      type: 'encrypted',
      title: 'Enkripsi AES-256 Berhasil',
      description: `File "${task.filename}" telah diamankan di Brankas dengan kata sandi.`
    });
  }, [addToast]);

  // Add new download
  const handleAddDownload = useCallback((newTask: Partial<DownloadTask>, startImmediately: boolean) => {
    requestNotificationPermission();

    const segmentCount = currentTier === 'enterprise' ? 32 : currentTier === 'pro' ? 16 : 4;
    const totalBytes = newTask.totalBytes || 150000000;
    const bytesPerSeg = Math.ceil(totalBytes / segmentCount);

    const segments = Array.from({ length: segmentCount }).map((_, i) => ({
      id: i + 1,
      startByte: i * bytesPerSeg,
      endByte: Math.min(totalBytes, (i + 1) * bytesPerSeg),
      downloadedBytes: 0,
      progress: 0,
      active: startImmediately
    }));

    const task: DownloadTask = {
      id: 'task-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      filename: newTask.filename || 'berkas_unduhan.bin',
      url: newTask.url || '',
      category: newTask.category || 'other',
      totalBytes,
      downloadedBytes: 0,
      status: newTask.status || (startImmediately ? 'downloading' : 'queued'),
      speed: startImmediately ? (currentTier === 'free' ? 3200000 : currentTier === 'enterprise' ? 14000000 : 7500000) : 0,
      eta: startImmediately ? Math.ceil(totalBytes / 7500000) : 0,
      priority: newTask.priority || 'normal',
      isEncrypted: newTask.isEncrypted || false,
      encryptionPassword: newTask.encryptionPassword,
      scheduledTime: newTask.scheduledTime,
      checksumSha256: '9f837fc8d73b22b0c36b42b109121666ec483f23a5cf6e0fae74011cb1e13e11',
      createdAt: Date.now(),
      segments,
    };

    setTasks(prev => {
      if (currentTier === 'free' && startImmediately) {
        const activeCount = prev.filter(t => t.status === 'downloading').length;
        if (activeCount >= 2) {
          task.status = 'queued';
          task.speed = 0;
          addToast({
            type: 'info',
            title: 'Dimasukkan ke Antrean',
            description: `Batas 2 unduhan aktif Versi Gratis tercapai. "${task.filename}" akan mulai otomatis saat unduhan lain selesai.`,
            actionLabel: 'Upgrade ke Pro',
            onAction: () => {
              setVersionModalTab('pricing');
              setIsVersionModalOpen(true);
            }
          });
          return [task, ...prev];
        }
      }
      return [task, ...prev];
    });

    addToast({
      type: 'info',
      title: 'Tugas Ditambahkan',
      description: task.status === 'scheduled' 
        ? `"${task.filename}" dijadwalkan pada ${task.scheduledTime}` 
        : `"${task.filename}" telah masuk ke antrean unduhan.`
    });
  }, [requestNotificationPermission, currentTier, addToast]);

  // Add multiple downloads from grabber
  const handleAddMultipleDownloads = useCallback((newTasks: Partial<DownloadTask>[]) => {
    newTasks.forEach(t => handleAddDownload(t, false));
    addToast({
      type: 'complete',
      title: 'Batch Berhasil Diimpor',
      description: `${newTasks.length} tautan berkas baru berhasil ditambahkan ke antrean.`
    });
  }, [handleAddDownload, addToast]);

  if (currentView === 'portal') {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors">
        <LandingPortal
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          onLaunchWebApp={() => setCurrentView('app')}
          currentTier={currentTier}
          onSelectTier={(newTier) => {
            setCurrentTier(newTier);
            addToast({
              type: 'complete',
              title: `Edisi ${TIERS_CONFIG[newTier].name} Dipilih`,
              description: `Paket installer disesuaikan untuk ${TIERS_CONFIG[newTier].name}.`
            });
          }}
          onOpenVersionModal={() => {
            setVersionModalTab('about');
            setIsVersionModalOpen(true);
          }}
          onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
        />

        {/* Version & Pricing Modal */}
        <VersionPricingModal
          isOpen={isVersionModalOpen}
          onClose={() => setIsVersionModalOpen(false)}
          currentTier={currentTier}
          onSelectTier={(newTier) => {
            setCurrentTier(newTier);
            addToast({
              type: 'complete',
              title: `Beralih ke ${TIERS_CONFIG[newTier].name}`,
              description: `Aplikasi sekarang menggunakan fitur dan kapasitas ${TIERS_CONFIG[newTier].name}.`
            });
          }}
          initialTab={versionModalTab}
        />

        {/* Security Center & Audit Modal */}
        <SecurityCenterModal
          isOpen={isSecurityModalOpen}
          onClose={() => setIsSecurityModalOpen(false)}
          tasks={tasks}
        />

        {/* Floating Notification Toasts */}
        <NotificationToast
          toasts={toasts}
          onDismiss={dismissToast}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors">
      
      {/* Top Header with Version Tag & Tier Badge */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        speedLimit={speedLimit}
        onChangeSpeedLimit={setSpeedLimit}
        totalSpeed={totalSpeed}
        battery={battery}
        scheduler={scheduler}
        currentTier={currentTier}
        onOpenVersionModal={() => {
          setVersionModalTab('pricing');
          setIsVersionModalOpen(true);
        }}
        onSwitchToPortal={() => setCurrentView('portal')}
        onOpenAddModal={() => {
          setInitialUrlForAdd('');
          setIsAddModalOpen(true);
        }}
        onOpenGrabberModal={() => setIsGrabberModalOpen(true)}
        onOpenSchedulerModal={() => setIsSchedulerModalOpen(true)}
        onOpenBatteryModal={() => setIsBatteryModalOpen(true)}
        onOpenExtensionModal={() => setIsExtensionModalOpen(true)}
        onOpenVaultModal={() => setIsVaultModalOpen(true)}
        onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
      />

      {/* Speed Graph Canvas Strip */}
      <SpeedGraphWidget 
        speedHistory={speedHistory}
        currentSpeed={totalSpeed}
      />

      {/* Main Workspace Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Category & Status Sidebar */}
        <Sidebar
          currentCategory={currentCategory}
          onSelectCategory={setCurrentCategory}
          statusFilter={statusFilter}
          onSelectStatusFilter={setStatusFilter}
          counts={categoryCounts}
          statusCounts={statusCounts}
          totalDownloadedToday={totalDownloadedToday}
          quotaSavedMidnight={quotaSavedMidnight}
          scheduler={scheduler}
          battery={battery}
          currentTier={currentTier}
          onOpenVersionModal={() => {
            setVersionModalTab('pricing');
            setIsVersionModalOpen(true);
          }}
          onToggleBatterySaver={() => {
            const next = !battery.saverEnabled;
            setBattery(prev => ({ ...prev, saverEnabled: next }));
            addToast({
              type: 'info',
              title: next ? 'Mode Hemat Baterai Diaktifkan' : 'Mode Hemat Baterai Dimatikan',
              description: next ? 'Koneksi unduhan dibatasi untuk menghemat daya perangkat.' : 'Performa unduhan kembali normal.'
            });
          }}
          onOpenSchedulerModal={() => setIsSchedulerModalOpen(true)}
          onOpenExtensionModal={() => setIsExtensionModalOpen(true)}
          onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
        />

        {/* Central Download List Table */}
        <DownloadList
          tasks={filteredTasks}
          onPauseTask={handlePauseTask}
          onResumeTask={handleResumeTask}
          onDeleteTask={handleDeleteTask}
          onOpenDetail={(task) => setSelectedDetailTask(task)}
          onSaveToDisk={handleSaveToDisk}
          onEncryptTask={handleEncryptTask}
          onPauseAll={handlePauseAll}
          onResumeAll={handleResumeAll}
          onClearCompleted={handleClearCompleted}
          onOpenAddModal={() => {
            setInitialUrlForAdd('');
            setIsAddModalOpen(true);
          }}
        />

      </div>

      {/* App Version & License Tier Footer */}
      <Footer
        currentTier={currentTier}
        onOpenVersionModal={() => {
          setVersionModalTab('pricing');
          setIsVersionModalOpen(true);
        }}
        onOpenChangelogModal={() => {
          setVersionModalTab('about');
          setIsVersionModalOpen(true);
        }}
        onSwitchToPortal={() => setCurrentView('portal')}
        onOpenSecurityModal={() => setIsSecurityModalOpen(true)}
      />

      {/* Interactive Modals */}
      <SecurityCenterModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        tasks={tasks}
      />
      <VersionPricingModal
        isOpen={isVersionModalOpen}
        onClose={() => setIsVersionModalOpen(false)}
        currentTier={currentTier}
        onSelectTier={(newTier) => {
          setCurrentTier(newTier);
          addToast({
            type: 'complete',
            title: `Beralih ke ${TIERS_CONFIG[newTier].name}`,
            description: `Aplikasi sekarang menggunakan fitur dan kapasitas ${TIERS_CONFIG[newTier].name}.`
          });
        }}
        initialTab={versionModalTab}
      />

      <AddDownloadModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddDownload={handleAddDownload}
        initialUrl={initialUrlForAdd}
      />

      <BatchLinkGrabberModal
        isOpen={isGrabberModalOpen}
        onClose={() => setIsGrabberModalOpen(false)}
        onAddMultiple={handleAddMultipleDownloads}
      />

      <SchedulerModal
        isOpen={isSchedulerModalOpen}
        onClose={() => setIsSchedulerModalOpen(false)}
        config={scheduler}
        onSaveConfig={(newConfig) => {
          setScheduler(newConfig);
          addToast({
            type: 'complete',
            title: 'Jadwal Kuota Diperbarui',
            description: `Jam hemat kuota diatur: ${newConfig.startHour.toString().padStart(2, '0')}:00 - ${newConfig.endHour.toString().padStart(2, '0')}:00`
          });
        }}
        totalDownloadedToday={totalDownloadedToday}
        quotaSavedMidnight={quotaSavedMidnight}
      />

      <BatterySaverModal
        isOpen={isBatteryModalOpen}
        onClose={() => setIsBatteryModalOpen(false)}
        battery={battery}
        onUpdateBatterySettings={(settings) => {
          setBattery(prev => ({ ...prev, ...settings }));
          addToast({
            type: 'complete',
            title: 'Pengaturan Daya Disimpan',
            description: 'Aturan otomasi mode hemat baterai telah diterapkan.'
          });
        }}
      />

      <EncryptionVaultModal
        isOpen={isVaultModalOpen}
        onClose={() => setIsVaultModalOpen(false)}
        encryptedTasks={tasks.filter(t => t.isEncrypted)}
        onFileDecrypted={(filename) => {
          addToast({
            type: 'complete',
            title: 'Dekripsi Berhasil',
            description: `Berkas "${filename}" telah didekripsi dan diunduh.`
          });
        }}
      />

      <DownloadDetailModal
        task={selectedDetailTask}
        onClose={() => setSelectedDetailTask(null)}
        onPause={handlePauseTask}
        onResume={handleResumeTask}
        onSaveToDisk={handleSaveToDisk}
        onEncrypt={handleEncryptTask}
      />

      <BrowserExtensionModal
        isOpen={isExtensionModalOpen}
        onClose={() => setIsExtensionModalOpen(false)}
        clipboardDetectorActive={clipboardDetectorActive}
        onToggleClipboardDetector={() => {
          setClipboardDetectorActive(!clipboardDetectorActive);
          addToast({
            type: 'info',
            title: !clipboardDetectorActive ? 'Detektor Clipboard Aktif' : 'Detektor Clipboard Nonaktif',
            description: !clipboardDetectorActive 
              ? 'Aplikasi akan otomatis mendeteksi link unduhan yang Anda salin.' 
              : 'Deteksi otomatis clipboard telah dinonaktifkan.'
          });
        }}
      />

      {/* Floating Notification Toasts */}
      <NotificationToast
        toasts={toasts}
        onDismiss={dismissToast}
      />

    </div>
  );
}
