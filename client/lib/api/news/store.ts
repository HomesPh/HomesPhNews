import { create } from "zustand";
import { Article, NewsStore } from "./types";

/**
 * News API hook that handles fetching news data from the api
 * @example
 * // This is a react component.
 * export function NewsCard() {
 *  const { articles, fetchArticles } = useNews();
 *  return (
 *    <>
 *    </>
 *  );
 * }
 */
export const useNews = create<NewsStore>((set) => ({
  // Articles that are fetched are stored here.
  articles: [],

  // Fetches data from the api.
  // Doesn't require authentication.
  // TODO: Implement cache to prevent unnecessary api calls.
  fetchArticles: async () => {
    const dummyArticles: Article[] = [];

    // TODO: replace this with actual fetch when the api is ready.
    set({
      articles: dummyArticles
    });
  }
}));