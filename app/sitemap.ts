import { MetadataRoute } from "next";

const NEWS_API_URL =
  process.env.NEWS_AGGREGATOR_URL ||
  process.env.NEXT_PUBLIC_NEWS_AGGREGATOR_URL ||
  "http://localhost:5005/api";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let newsList: any[] = [];
  try {
    const res = await fetch(`${NEWS_API_URL}/news?limit=20`, {
      headers: {
        "x-service-api-key": process.env.SERVICE_API_KEY || "",
      },
      next: { revalidate: 3600 }, // Cache sitemap for 1 hour
    });
    if (res.ok) {
      const data = await res.json();
      newsList = Array.isArray(data) ? data : [];
    }
  } catch (e) {
    console.error("Failed to fetch news for sitemap:", e);
  }

  // 1. Core Static Pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "always" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "always" as const,
      priority: 0.9,
    },
  ];

  // 2. Dynamic News Pages (20 most recent items)
  const newsPages = newsList
    .filter((item: any) => item && item.slug)
    .map((item: any) => ({
      url: `${baseUrl}/news/${item.slug}`,
      lastModified: item.updatedAt
        ? new Date(item.updatedAt)
        : new Date(item.pubDate || item.createdAt || Date.now()),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }));

  return [...staticPages, ...newsPages];
}
