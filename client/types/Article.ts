export interface Article {
  id: string;
  article_id: string;
  title: string;
  original_title: string;
  summary: string;
  content: string;
  image: string;
  category: string;
  country: string;
  source: string;
  original_url: string;
  keywords: (string | null)[];
  topics: (string | null)[];
  status: string;
  is_featured: number;
  is_live: number;
  published_sites: string;
  custom_titles: (string | null)[];
  views_count: number;
  created_at: string;
  updated_at: string;
  site_id: number;
  image_url: string;
}
