"use server";

import { getNewsAggregatorUrl } from "@/lib/utils";

const NEWS_API_URL = getNewsAggregatorUrl();

async function getBlacklistedDomains(): Promise<string[]> {
  try {
    const res = await fetch(`${NEWS_API_URL}/news/settings`, {
      method: "GET",
      headers: {
        "x-service-api-key": process.env.SERVICE_API_KEY || "",
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 }, // Cache settings for 60 seconds server-side
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.blacklistedOgDomains) ? data.blacklistedOgDomains : [];
  } catch (e) {
    console.error("Error fetching blacklist server-side:", e);
    return [];
  }
}

interface ArticleData {
  ogImage?: string | null;
  dynamicOgImage?: string | null;
  [key: string]: unknown;
}

function scrubBlacklistedImages(articles: ArticleData[], blacklist: string[]) {
  if (!Array.isArray(articles) || articles.length === 0 || blacklist.length === 0) {
    return articles;
  }
  return articles.map((article) => {
    const scrubbed = { ...article };

    const isImageBlacklisted = (urlStr: string | null | undefined): boolean => {
      if (!urlStr) return false;
      try {
        const hostname = new URL(urlStr).hostname.toLowerCase();
        return blacklist.some((domain) => {
          const cleanDomain = domain.toLowerCase().trim();
          return hostname === cleanDomain || hostname.endsWith("." + cleanDomain);
        });
      } catch {
        return false;
      }
    };

    if (isImageBlacklisted(scrubbed.ogImage)) {
      scrubbed.ogImage = null;
    }
    if (isImageBlacklisted(scrubbed.dynamicOgImage)) {
      scrubbed.dynamicOgImage = null;
    }
    return scrubbed;
  });
}

export async function fetchNews(
  skip: number,
  limit: number = 10,
  category?: string,
) {
  try {
    let url = `${NEWS_API_URL}/v1/access/news?limit=${limit}&skip=${skip}`;
    if (category && category !== "All") {
      url += `&category=${encodeURIComponent(category)}`;
    }
    const res = await fetch(url, {
      headers: {
        "x-service-api-key": process.env.SERVICE_API_KEY || "",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`Failed to fetch news: ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    const articles = Array.isArray(data) ? data : [];
    const blacklist = await getBlacklistedDomains();
    return scrubBlacklistedImages(articles, blacklist);
  } catch (err) {
    console.error("Error fetching news:", err);
    return [];
  }
}

export async function searchNewsAction(query: string, limit: number = 20) {
  try {
    const url = `${NEWS_API_URL}/v1/access/news/search?q=${encodeURIComponent(query)}&limit=${limit}`;
    const res = await fetch(url, {
      headers: {
        "x-service-api-key": process.env.SERVICE_API_KEY || "",
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`Failed to search news: ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    const articles = Array.isArray(data) ? data : [];
    const blacklist = await getBlacklistedDomains();
    return scrubBlacklistedImages(articles, blacklist);
  } catch (err) {
    console.error("Error searching news:", err);
    return [];
  }
}

export async function incrementViewCountAction(slug: string) {
  try {
    const url = `${NEWS_API_URL}/news/slug/${slug}/view`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "x-service-api-key": process.env.SERVICE_API_KEY || "",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error incrementing view count:", err);
    return null;
  }
}

export async function reportNewsItem(id: string) {
  try {
    const res = await fetch(`${NEWS_API_URL}/news/${id}/report`, {
      method: "POST",
      headers: {
        "x-service-api-key": process.env.SERVICE_API_KEY || "",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      return { success: false };
    }
    const data = await res.json();
    return { success: data.success };
  } catch (err) {
    console.error("Error reporting news:", err);
    return { success: false };
  }
}
