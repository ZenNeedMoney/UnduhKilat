import React from 'react';
import { ShieldCheck, Sparkles, Building2, HelpCircle, Layers, CheckCircle2 } from 'lucide-react';
import { LicenseTier } from '../types';
import { APP_VERSION, APP_BUILD, TIERS_CONFIG } from '../data/tierConfig';

interface FooterProps {
  currentTier: LicenseTier;
  onOpenVersionModal: () => void;
  onOpenChangelogModal: () => void;
  onSwitchToPortal?: () => void;
  onOpenSecurityModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentTier,
  onOpenVersionModal,
  onOpenChangelogModal,
  onSwitchToPortal,
  onOpenSecurityModal,
}) => {
  const tierInfo = TIERS_CONFIG[currentTier];

  const getTierIcon = () => {
    switch (currentTier) {
      case 'enterprise':
        return <Building2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
      case 'pro':
        return <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-neutral-500" />;
    }
  };

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 text-xs px-4 lg:px-6 py-2.5 transition-colors">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
        
        {/* Left: App Version & Copyright with unboxed dot separators */}
        <div className="flex items-center flex-wrap gap-2 text-[11px]">
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            UnduhKilat Manager
          </span>
          <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">·</span>
          <button
            onClick={onOpenChangelogModal}
            className="font-mono font-medium text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
            title="Klik untuk melihat catatan rilis v1.0.0"
          >
            <span>{APP_VERSION}</span>
            <span className="text-[10px] text-neutral-400">({APP_BUILD})</span>
          </button>
          <span className="text-neutral-500">
            © 2026 Raihan Nur Syifa · Hak Cipta Dilindungi
          </span>
        </div>

        {/* Right: Active License Tier Selector & Quick Links */}
        <div className="flex items-center gap-3 text-[11px]">
          
          {/* License Tier Indicator Button */}
          <button
            onClick={onOpenVersionModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border transition-all ${
              currentTier === 'enterprise'
                ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-800/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100'
                : currentTier === 'pro'
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100'
                : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200'
            }`}
            title="Kelola Lisensi & Bandingkan Versi Gratis, Pro, dan Perusahaan"
          >
            {getTierIcon()}
            <span>{tierInfo.name}</span>
            <span className="text-[10px] opacity-75 font-normal">
              {currentTier === 'free' ? '(Upgrade)' : '(Aktif)'}
            </span>
          </button>

          <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">·</span>

          {/* Version notes button */}
          <button
            onClick={onOpenChangelogModal}
            className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors hidden sm:inline"
          >
            Catatan Rilis
          </button>

          {onSwitchToPortal && (
            <>
              <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">·</span>
              <button
                onClick={onSwitchToPortal}
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline transition-colors hidden sm:inline"
              >
                Portal Unduh Installer
              </button>
            </>
          )}

          {onOpenSecurityModal && (
            <>
              <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">·</span>
              <button
                onClick={onOpenSecurityModal}
                className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline flex items-center gap-1 transition-colors"
                title="Buka Pusat Keamanan & Audit (Grade A+)"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Audit Keamanan A+</span>
              </button>
            </>
          )}

          <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700 hidden sm:inline">·</span>

          {/* System readiness */}
          <div className="flex items-center gap-1 text-[11px] text-neutral-500">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>Sistem Siap</span>
          </div>

        </div>

      </div>
    </footer>
  );
};
