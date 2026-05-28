import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDomainName(urlStr: string): string {
  try {
    if (!urlStr) return "";
    let target = urlStr.trim();
    if (!/^https?:\/\//i.test(target)) {
      target = "https://" + target;
    }
    const url = new URL(target);
    return url.hostname.replace(/^www\./i, "").toLowerCase().trim();
  } catch (e) {
    return "";
  }
}

export function isSameSiteNews(article: {
  url?: string;
  aiEnrichedContent?: string | any[];
  structuredData?: { searchResults?: any[] };
  structuredDataSearchResults?: any[];
}): boolean {
  if (!article) return true;
  
  const domains = new Set<string>();
  if (article.url) {
    const d = getDomainName(article.url);
    if (d) domains.add(d);
  }

  // Parse aiEnrichedContent
  let enriched: any[] = [];
  try {
    if (article.aiEnrichedContent) {
      const parsed = typeof article.aiEnrichedContent === "string"
        ? JSON.parse(article.aiEnrichedContent)
        : article.aiEnrichedContent;
      if (Array.isArray(parsed)) {
        enriched = parsed;
      } else if (parsed && Array.isArray(parsed.searchResults)) {
        enriched = parsed.searchResults;
      }
    }
  } catch (e) {}

  for (const item of enriched) {
    if (item?.url) {
      const d = getDomainName(item.url);
      if (d) domains.add(d);
    }
  }

  // Parse structuredData searchResults
  const rawStructured = article.structuredData?.searchResults || article.structuredDataSearchResults || [];
  for (const item of rawStructured) {
    if (item?.url) {
      const d = getDomainName(item.url);
      if (d) domains.add(d);
    }
  }

  return domains.size <= 1;
}
