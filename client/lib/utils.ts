import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Decodes HTML entities (e.g. &lt; to <)
 */
export function decodeHtml(html: string | null | undefined): string {
  if (!html) return "";
  let current = html;
  let prev = "";

  // Handle up to 5 levels of escaping (e.g. &amp;lt;u&amp;gt; -> &lt;u&gt; -> <u>)
  for (let i = 0; i < 5; i++) {
    prev = current;
    current = current
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&rsquo;/g, "'")
      .replace(/&lsquo;/g, "'")
      .replace(/&rdquo;/g, '"')
      .replace(/&ldquo;/g, '"');

    if (current === prev) break;
  }

  return current;
}

/**
 * Safely strips HTML tags from a string.
 * Used for creating plain-text snippets from rich-text content.
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return "";

  // 1. Decode entities (handles potential double-escaping)
  const decoded = decodeHtml(html);

  // 2. Replace common block elements with spaces to prevent words from sticking together
  const withSpaces = decoded.replace(/<(p|br|div|li|h[1-6])[^>]*>/gi, ' ');

  // 3. Then remove all tags
  const stripped = withSpaces.replace(/<[^>]*>/g, '');

  // 4. Clean up extra whitespace
  return stripped.replace(/\s+/g, ' ').trim();
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

/**
 * Calculates the estimated read time for a given text content.
 * Assumes an average reading speed of 200 words per minute.
 * Returns a string like "5 min read".
 */
export function calculateReadTime(content: string | null | undefined): string {
  if (!content) return "1 min read";

  const strippedContent = stripHtml(content);
  const wordCount = strippedContent.trim().split(/\s+/).length;
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  // Ensure at least 1 min read is shown
  const readTime = minutes < 1 ? 1 : minutes;

  return `${readTime} min read`;
}

/**
 * Formats view count with correct pluralization.
 * @param count The number of views
 * @returns Formatted string (e.g. "1 view", "12 views", "1.5k views")
 */
export function formatViews(count: number | undefined | null): string {
  if (count === undefined || count === null) return "0 views";

  // Format large numbers (e.g. 1500 -> 1.5k)
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k views';
  }

  // Pluralization logic
  return `${count} ${count === 1 ? 'view' : 'views'}`;
}
