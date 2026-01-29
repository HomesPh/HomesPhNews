"use client";

import AXIOS_INSTANCE_PUBLIC from "../../axios-instance";

/**
 * Increment article view count (POST /articles/{id}/view).
 * @param id article id (uuid)
 */
export async function incrementArticleViews(id: string): Promise<void> {
  try {
    // Note: We use the public axios instance. 
    // If it's a client-side call, axios-instance should handle it.
    await AXIOS_INSTANCE_PUBLIC.post(`/articles/${id}/view`);
  } catch (error) {
    console.error(`Error incrementing views for article ${id}:`, error);
  }
}
