export interface ArticleResource {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: string;
  country: string;
  status: string;
  views_count: number;
  topics: string[] | null;
  keywords: string;
  source: string;
  original_url: string;
  created_at: string;
  published_sites: string;
  image_url?: string;
}