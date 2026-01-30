export interface SiteResource {
  id: number;
  name: string;
  domain: string;
  apiKey?: string; // Missing in previous definition
  status: string;
  image: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact?: string | null; // Composite field from server
  description: string | null;
  categories: string[]; // Fixed from unknown[] to string[]
  requested: string;
  articles: number; // Renamed from articles_count (or rather, matches server)
  articles_count?: number; // Alias for backward compatibility if needed
  monthly_views: number;
  monthlyViews?: string; // String version from server
}

