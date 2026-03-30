export interface Article {
  id: string;
  title: string;
  summary: string | null;
  image: unknown[] | null;
  category: string | null;
  country: string | null;
  source: string | null;
  original_url: string | null;
  keywords: unknown[] | null;
  topics: unknown[] | null;
  slug: string | null;
  status: string;
  published_sites: string | null;
  content_blocks: string | null;
  author: string | null;
  published_at: string | null;
  views_count: number;
  created_at: string | null;
  updated_at: string | null;
  image_url: string;
}
