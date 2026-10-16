import { validateDownloadUrl, sanitizeFilename } from './security';

export interface DetectedLink {
  url: string;
  filename: string;
  category: 'document' | 'video' | 'audio' | 'program' | 'archive' | 'other';
  extension: string;
}

const EXTENSION_REGEX = /\.(zip|rar|7z|tar|gz|iso|mp4|mkv|webm|avi|mov|mp3|flac|wav|ogg|exe|msi|dmg|pkg|apk|pdf|docx|xlsx|pptx|csv|epub|torrent)($|\?|#)/i;

export function extractLinksFromText(rawText: string): DetectedLink[] {
  if (!rawText) return [];

  // Look for http / https links or src/href attributes in raw text or HTML
  const urlRegex = /https?:\/\/[^\s"'<>]+/gi;
  const matches = rawText.match(urlRegex) || [];

  const uniqueUrls = Array.from(new Set(matches.map(u => u.trim())));
  const results: DetectedLink[] = [];

  for (const url of uniqueUrls) {
    try {
      const cleanUrl = url.replace(/["')\];]+$/, '');
      const validation = validateDownloadUrl(cleanUrl);
      if (!validation.isValid) continue;

      const parsed = new URL(validation.sanitizedUrl);
      const pathname = parsed.pathname;
      const parts = pathname.split('/').filter(Boolean);
      const lastPart = parts[parts.length - 1] || '';

      const extMatch = lastPart.match(/\.([a-z0-9]+)$/i) || cleanUrl.match(EXTENSION_REGEX);
      const ext = extMatch ? extMatch[1].toLowerCase() : '';

      // Determine category
      let category: DetectedLink['category'] = 'other';
      if (['mp4', 'mkv', 'webm', 'avi', 'mov'].includes(ext)) category = 'video';
      else if (['mp3', 'flac', 'wav', 'ogg'].includes(ext)) category = 'audio';
      else if (['zip', 'rar', '7z', 'tar', 'gz', 'iso'].includes(ext)) category = 'archive';
      else if (['exe', 'msi', 'dmg', 'apk', 'pkg'].includes(ext)) category = 'program';
      else if (['pdf', 'docx', 'xlsx', 'pptx', 'csv', 'epub'].includes(ext)) category = 'document';

      const rawName = lastPart ? decodeURIComponent(lastPart) : `unduhan_${Date.now()}.${ext || 'bin'}`;
      const filename = sanitizeFilename(rawName);

      results.push({
        url: validation.sanitizedUrl,
        filename,
        category,
        extension: ext.toUpperCase() || 'LINK'
      });
    } catch {
      // Skip invalid URLs
    }
  }

  return results;
}

// Generates a self-contained Bookmarklet code for browser bookmark bar
export function generateBookmarkletCode(appUrl: string): string {
  const targetUrl = appUrl.startsWith('http') ? appUrl : window.location.origin;
  return `javascript:(function(){
    try {
      var links = Array.from(document.querySelectorAll('a[href]'))
        .map(function(a){ return a.href; })
        .filter(function(h){ return /\\.(zip|rar|7z|tar|gz|iso|mp4|mkv|webm|mp3|flac|wav|exe|dmg|apk|pdf|docx|xlsx)($|\\?)/i.test(h); });
      var payload = encodeURIComponent(JSON.stringify({
        source: window.location.href,
        title: document.title,
        detectedLinks: links.slice(0, 50)
      }));
      window.open('${targetUrl}?sniffer_data=' + payload, '_blank');
    } catch(e) {
      alert('UnduhKilat Sniffer: Gagal menangkap link - ' + e.message);
    }
  })();`.replace(/\s+/g, ' ');
}
