export interface Article {
  id: string;
  article_id: string | null;
  title: string;
  original_title: string | null;
  summary: string | null;
  content: string | null;
  image: string | null;
  category: string | null;
  country: string | null;
  source: string | null;
  original_url: string | null;
  keywords: unknown[] | null;
  topics: unknown[] | null;
  status: string;
  is_featured: number | null;
  is_live: number | null;
  published_sites: string | null;
  custom_titles: unknown[] | null;
  views_count: number;
  created_at: string | null;
  updated_at: string | null;
  site_id: number | null;
  image_url: string;
}

