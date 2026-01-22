import {
  ArticlesFeedResponse,
  ArticlesListResponse,
  LatestArticlesResponse,
  SearchArticlesResponse,
  CountriesResponse,
  CategoriesResponse,
  ArticleStatsResponse,
} from "./types";

export const fake_landing_page_articles: ArticlesFeedResponse = {
  latest_global: [
    {
      id: "1",
      title: "Latest Global News",
      content: "Latest Global News",
      category: "Global",
      country: "Global",
      image_url: "https://placehold.co/600x400?text=Global+News",
      timestamp: "2024-01-22T00:00:00Z",
      keywords: "Global, News",
      original_url: "https://example.com/global-news"
    },
    {
      id: "2",
      title: "Latest Global News 2",
      content: "Latest Global News 2",
      category: "Global",
      country: "Global",
      image_url: "https://placehold.co/600x400?text=Global+News",
      timestamp: "2024-01-22T00:00:00Z",
      keywords: "Global, News",
      original_url: "https://example.com/global-news"
    }
  ],
  trending: [
    {
      id: "1",
      title: "Trending News",
      content: "Trending News",
      category: "Trending",
      country: "Trending",
      image_url: "https://placehold.co/600x400?text=Trending+News",
      timestamp: "2024-01-22T00:00:00Z",
      keywords: "Trending, News",
      original_url: "https://example.com/trending-news"
    },
    {
      id: "2",
      title: "Trending News 2",
      content: "Trending News 2",
      category: "Trending",
      country: "Trending",
      image_url: "https://placehold.co/600x400?text=Trending+News",
      timestamp: "2024-01-22T00:00:00Z",
      keywords: "Trending, News",
      original_url: "https://example.com/trending-news"
    }
  ],
  most_read: [
    {
      id: "1",
      title: "Most Read News",
      content: "Most Read News",
      category: "Most Read",
      country: "Most Read",
      image_url: "https://placehold.co/600x400?text=Most+Read+News",
      timestamp: "2024-01-22T00:00:00Z",
      keywords: "Most Read, News",
      original_url: "https://example.com/most-read-news"
    }
  ]
};

export const fake_articles_list_response: ArticlesListResponse = {
  data: [
    {
      id: "1",
      title: "Article List Item 1",
      category: "Business",
      country: "Philippines",
      image_url: "https://placehold.co/600x400?text=Article+1"
    },
    {
      id: "2",
      title: "Article List Item 2",
      category: "Real Estate",
      country: "Canada",
      image_url: "https://placehold.co/600x400?text=Article+2"
    },
    {
      id: "3",
      title: "Article List Item 3",
      category: "Technology",
      country: "USA",
      image_url: "https://placehold.co/600x400?text=Article+3"
    }
  ],
  meta: {
    total: 150,
    limit: 10,
    offset: 0,
    filters: {
      country: "Philippines",
      category: "Business"
    }
  }
};

export const fake_latest_articles: LatestArticlesResponse = {
  data: [
    {
      id: "latest-1",
      title: "Latest Article 1",
      content: "This is the latest article content",
      category: "Technology",
      country: "USA",
      image_url: "https://placehold.co/600x400?text=Latest+1",
      timestamp: "2024-01-22T10:00:00Z",
      keywords: "Technology, Innovation",
      original_url: "https://example.com/latest-1"
    },
    {
      id: "latest-2",
      title: "Latest Article 2",
      content: "Another latest article",
      category: "Business",
      country: "Philippines",
      image_url: "https://placehold.co/600x400?text=Latest+2",
      timestamp: "2024-01-22T09:30:00Z",
      keywords: "Business, Economy",
      original_url: "https://example.com/latest-2"
    },
    {
      id: "latest-3",
      title: "Latest Article 3",
      content: "Yet another latest article",
      category: "Real Estate",
      country: "Canada",
      image_url: "https://placehold.co/600x400?text=Latest+3",
      timestamp: "2024-01-22T09:00:00Z",
      keywords: "Real Estate, Property",
      original_url: "https://example.com/latest-3"
    }
  ]
};

export const fake_search_results: SearchArticlesResponse = {
  data: [
    {
      id: "search-1",
      title: "Search Result Article 1",
      content: "This article matches the search query",
      category: "Technology",
      country: "USA",
      image_url: "https://placehold.co/600x400?text=Search+1",
      timestamp: "2024-01-21T12:00:00Z",
      keywords: "Search, Technology",
      original_url: "https://example.com/search-1"
    },
    {
      id: "search-2",
      title: "Search Result Article 2",
      content: "Another article matching the search",
      category: "Business",
      country: "Philippines",
      image_url: "https://placehold.co/600x400?text=Search+2",
      timestamp: "2024-01-21T11:00:00Z",
      keywords: "Search, Business",
      original_url: "https://example.com/search-2"
    }
  ]
};

export const fake_countries: CountriesResponse = {
  data: [
    { name: "Philippines", count: 45 },
    { name: "Canada", count: 32 },
    { name: "USA", count: 28 },
    { name: "Singapore", count: 15 },
    { name: "Dubai", count: 12 },
    { name: "Europe", count: 18 }
  ]
};

export const fake_categories: CategoriesResponse = {
  data: [
    { name: "Real Estate", count: 52 },
    { name: "Business", count: 38 },
    { name: "Technology", count: 25 },
    { name: "Politics", count: 20 },
    { name: "Economy", count: 18 },
    { name: "Tourism", count: 12 }
  ]
};

export const fake_stats: ArticleStatsResponse = {
  total_articles: 150,
  total_countries: 6,
  total_categories: 6
};