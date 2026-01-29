export interface SiteResource {
  id: number;
  name: string;
  domain: string;
  status: string;
  image: string | null;
  contact_name: string | null;
  contact_email: string | null;
  description: string | null;
  categories: unknown[] | null;
  requested: string;
  articles_count: number;
  monthly_views: number;
}

