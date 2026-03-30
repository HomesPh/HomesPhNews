export interface Article {
  id: string;
  title: string;
  summary: string;
  image: string;
  category: string;
  country: string;
  source: string;
  original_url: string;
  keywords: (string | null)[];
  topics: (string | null)[];
  status: string;
  published_sites: string;
  views_count: number;
  created_at: string;
  updated_at: string;
  image_url: string;
}
