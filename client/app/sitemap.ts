import type { MetadataRoute } from "next";

/**
 * Client-side sitemap only. Admin routes (/admin/*) are intentionally excluded.
 */
const BASE_URL = "https://news.homes.ph";

async function getArticleSlugs(): Promise<Array<{ slug: string; updatedAt?: string }>> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const all: Array<{ slug: string; updatedAt?: string }> = [];
  let page = 1;
  const perPage = 100;
  try {
    for (;;) {
      const res = await fetch(
        `${apiUrl}/articles?per_page=${perPage}&page=${page}&status=published&sort_by=created_at&sort_direction=desc`,
        { next: { revalidate: 3600 } }
      );
      if (!res.ok) break;
      const data = await res.json();
      const items = data?.data?.data ?? data?.data ?? [];
      if (!Array.isArray(items) || items.length === 0) break;
      for (const a of items) {
        all.push({
          slug: a.slug || a.id,
          updatedAt: a.updated_at ?? a.created_at,
        });
      }
      const total = data?.data?.total ?? 0;
      if (items.length < perPage || all.length >= total) break;
      page += 1;
    }
  } catch {
    // ignore
  }
  return all;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = BASE_URL;

  // Static client routes only — NO admin routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/article`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/search`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/restaurants`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/subscribe`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/subscribe/edit`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/subscription/plans`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/subscription/payment`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/cookie-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/privacy-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/terms-and-policy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const articles = await getArticleSlugs();
  const articleRoutes: MetadataRoute.Sitemap = articles.map(({ slug, updatedAt }) => ({
    url: `${baseUrl}/article/${encodeURIComponent(slug)}`,
    lastModified: updatedAt ? new Date(updatedAt) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...articleRoutes];
}
