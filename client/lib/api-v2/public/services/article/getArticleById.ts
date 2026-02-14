"use server";

import AXIOS_INSTANCE_PUBLIC from "../../axios-instance";
import type { ArticleResource } from "../../../types/ArticleResource";
import { DUMMY_ARTICLES } from "../../../mock/mockArticles";

export type ArticleByIdResponse = ArticleResource;

/**
 * Fetch a single article by ID
 * Returns only the article data, not the entire Axios response
 */
export async function getArticleById(id: string): Promise<ArticleByIdResponse> {
  // 1. Check if we have a specific mock for this ID
  if (DUMMY_ARTICLES[id]) {
    return DUMMY_ARTICLES[id];
  }

  // 2. Handle generated dummy IDs (dummy-gen-X or dummy-fill-X)
  if (id.startsWith('dummy-')) {
    // Extract ID number for consistent generation
    const match = id.match(/(\d+)$/);
    const num = match ? parseInt(match[1], 10) : 0;

    const baseArticle: Partial<ArticleResource> = {
      id,
      article_id: id,
      slug: id,
      views_count: 0,
      published_sites: [],
      sites: [],
      galleryImages: [],
      is_deleted: false,
      is_redis: false,
      created_at: new Date().toISOString(),
      original_url: "#",
      source: "HomesTV",
      status: "published" as string
    };

    // Logic for DashboardFeed generated items
    if (id.includes('gen')) {
      const topics = [
        "Infrastructure Boom: New Transit Lines Boost Property Values",
        "Retail Evolution: Malls Transform into Lifestyle Centers",
        "The rise of Co-Living Spaces in Urban Centers",
        "Industrial Real Estate: Logistics Warehouses in High Demand"
      ];
      const selectedTopic = topics[num % topics.length];
      const images = [
        'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80'
      ];

      return {
        ...baseArticle,
        title: `${selectedTopic} (Part ${Math.floor(num / 4) + 1})`,
        summary: "An in-depth look at how infrastructure projects and changing consumer behaviors are reshaping the Philippine real estate landscape.",
        content: `
                <p><strong>${selectedTopic}</strong></p>
                <p>The landscape of real estate is shifting rapidly. This article explores the key drivers behind this trend, from government infrastructure spending to evolving consumer preferences.</p>
                <p>Analysts predict this sector will continue to grow by 5-7% annually over the next decade.</p>
            `,
        image: images[num % 4],
        image_url: images[num % 4],
        category: num % 2 === 0 ? "Business & Economy" : "Real Estate",
        country: ["Qatar", "Kuwait", "Hong Kong", "Canada"][num % 4] || "Global",
        views_count: 200 + num * 45,
        topics: ["General", "News", "Generated"],
        keywords: "news, general",
      } as ArticleResource;
    }

    // Logic for Restaurant generated items
    if (id.includes('fill')) {
      const images = [
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80'
      ];
      return {
        ...baseArticle,
        title: `Culinary Discovery ${num + 6}: Exploring Regional Filipino Flavors`,
        summary: "A deep dive into the diverse regional cuisines of the Philippines...",
        content: `
                <p>The Philippines has over 7,000 islands, and almost as many variations of adobo. Regional cuisine is a treasure trove of flavors waiting to be discovered.</p>
                <h3>Highlighting Region ${num + 1}</h3>
                <p>From the spicy dishes of Bicol to the savory soups of Visayas, every region offers a unique story on a plate.</p>
            `,
        image: images[num % 2],
        image_url: images[num % 2],
        category: "Restaurant",
        country: "Global",
        views_count: 100 + num * 5,
        topics: ["Food", "Regional"],
        keywords: "food, regional",
      } as ArticleResource;
    }

    // Fallback for any other dummy ID
    return {
      ...baseArticle,
      title: 'Preview Article: ' + id,
      summary: 'This is a preview of the dummy article content. Real content is not stored in the database.',
      content: `
        <h2>Article Preview</h2>
        <p>You are viewing a dummy article generated for demonstration purposes. This content does not exist on the server.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
      `,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80',
      image_url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80',
      category: "Preview",
      country: "Global",
      views_count: 100,
      topics: ["Preview", "Demo"],
      keywords: "preview, demo",
    } as ArticleResource;
  }

  const response = await AXIOS_INSTANCE_PUBLIC.get<ArticleByIdResponse>(`/v1/articles/${id}`);
  // Return only the data to avoid serializing Axios response objects with circular references
  return response.data;
}