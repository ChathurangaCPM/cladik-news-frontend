"use server";

const NEWS_API_URL =
  process.env.NEXT_PUBLIC_NEWS_AGGREGATOR_URL ||
  process.env.NEWS_AGGREGATOR_URL ||
  "http://localhost:5005/api";

export async function fetchNews(
  skip: number,
  limit: number = 10,
  category?: string,
) {
  try {
    let url = `${NEWS_API_URL}/news?limit=${limit}&skip=${skip}`;
    if (category && category !== "All") {
      url += `&category=${encodeURIComponent(category)}`;
    }
    const res = await fetch(url, {
      headers: {
        "x-service-api-key": process.env.SERVICE_API_KEY || "",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`Failed to fetch news: ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Error fetching news:", err);
    return [];
  }
}

export async function searchNewsAction(query: string, limit: number = 20) {
  try {
    const url = `${NEWS_API_URL}/news/search?q=${encodeURIComponent(query)}&limit=${limit}`;
    const res = await fetch(url, {
      headers: {
        "x-service-api-key": process.env.SERVICE_API_KEY || "",
      },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`Failed to search news: ${res.statusText}`);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : [];
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
