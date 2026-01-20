export interface Author {
  name: string;
  imageUrl: string;
}

export interface RelatedArticle {
  id: string;
  title: string;
  category: string;
  image: string;
  href: string;
}

export interface Article {
  id: string | number;
  country: string;
  category: string;
  title: string;
  subtitle: string;
  author: Author;
  featuredImageUrl: string;
  createdAt: string; // ISO Date string
  views: number;
  content: string;
  topics: string[];
  relatedArticles: RelatedArticle[];
}

export interface NewsState {
  articles: Article[];
}

export interface NewsActions {
  fetchArticles: () => Promise<void>;
}

export interface NewsStore extends NewsState, NewsActions { }