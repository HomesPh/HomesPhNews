import type { MetadataRoute } from "next";

const BASE_URL = "https://news.homes.ph";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/test/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
