import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stripHtml(html: string | undefined | null): string {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Sanitize an image URL that may be stored as a JSON-encoded array.
 * Some articles have image stored as '["https://..."]' instead of plain 'https://...'.
 * This extracts the actual URL string.
 */
export function sanitizeImageUrl(url: string | string[] | undefined | null, fallback = ''): string {
  if (!url) return fallback;
  // If it's already an array, grab the first element
  if (Array.isArray(url)) {
    return (url[0] as string) || fallback;
  }
  const str = String(url).trim();
  // Detect JSON array wrapper: ["url"]
  if (str.startsWith('["') && str.endsWith('"]')) {
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return String(parsed[0]);
      }
    } catch {
      // Not valid JSON, fall through
    }
  }
  return str || fallback;
}
