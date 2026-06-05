import React from "react";
import { NewsCard, EnrichedSource } from "./NewsCard";
import moment from "moment";
import { isSameSiteNews, getNewsAggregatorUrl } from "@/lib/utils";

const NEWS_API_URL = getNewsAggregatorUrl();

interface ProcessedNewsArticle {
  _id?: string;
  id?: string;
  title?: string;
  sinhalaTitle?: string;
  summary?: string;
  sinhalaSummary?: string;
  content?: string;
  sinhalaContent?: string;
  ogImage?: string | null;
  dynamicOgImage?: string | null;
  imageUrl?: string;
  pubDate?: string;
  createdAt?: string;
  publishDate?: string;
  categories?: string[];
  source?: string;
  url?: string;
  dynamicSourceUrl?: string;
  references?: EnrichedSource[] | null;
  aiEnrichedContent?: string | null;
  structuredData?: {
    searchResults?: EnrichedSource[];
  };
  slug?: string;
}

export async function RelatedNews({
  articleId,
  currentSlug,
}: {
  articleId: string;
  currentSlug: string;
}) {
  if (!articleId) return null;

  let relatedItems: ProcessedNewsArticle[] = [];

  try {
    const res = await fetch(
      `${NEWS_API_URL}/news/${articleId}/similar?limit=4`,
      {
        headers: {
          "x-service-api-key": process.env.SERVICE_API_KEY || "",
        },
        next: { revalidate: 3600 },
      },
    );

    if (res.ok) {
      const allNews = (await res.json()) as ProcessedNewsArticle[];
      // Filter out current, exclude same-site articles, and map to 3 grid cards
      relatedItems = allNews
        .filter((item) => item.slug !== currentSlug && !isSameSiteNews(item))
        .slice(0, 3);
    }
  } catch (err) {
    console.warn("Failed to fetch related news", err);
  }

  if (relatedItems.length === 0) return null;

  return (
    <div className="max-w-5xl mx-auto lg:px-4  pb-24 mt-8">
      <div className="pt-12 border-t border-slate-200/60 dark:border-slate-800">
        <h3 className="text-2xl font-heading mb-8 text-slate-900 tracking-tight">
          Related News
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {relatedItems.map((raw, index: number) => {
            const sourceLower = (raw.source || "").toLowerCase();
            const showImage = [
              "techcrunch",
              "wired",
              "aljazeera",
              "techcrunch.com",
              "wired.com",
              "aljazeera.com",
            ].some((s) => sourceLower.includes(s));

            const imageUrl = (showImage && raw.ogImage) ? raw.ogImage : undefined;

            let enrichedData: EnrichedSource[] = [];
            if (Array.isArray(raw.references)) {
              enrichedData = raw.references;
            } else if (raw.references && typeof raw.references === "object") {
              const primary = Array.isArray((raw.references as any).primary) ? (raw.references as any).primary : [];
              const others = Array.isArray((raw.references as any).others) ? (raw.references as any).others : [];
              enrichedData = [...primary, ...others];
            } else {
              try {
                if (raw.aiEnrichedContent) {
                  const parsed = typeof raw.aiEnrichedContent === "string"
                    ? JSON.parse(raw.aiEnrichedContent)
                    : raw.aiEnrichedContent;
                  if (Array.isArray(parsed)) {
                    enrichedData = parsed;
                  } else if (parsed && Array.isArray(parsed.searchResults)) {
                    enrichedData = parsed.searchResults;
                  }
                }
              } catch {
                // Safe catch
              }
            }

            const favicons = enrichedData
              .slice(0, 3)
              .map((d) => {
                try {
                  const url = new URL(d.url);
                  return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
                } catch {
                  return null;
                }
              })
              .filter((url): url is string => Boolean(url));

            const mapped = {
              id: raw._id,
              variant: "grid" as const,
              title: raw.title || raw.sinhalaTitle || "Untitled News",
              sinhalaTitle: raw.sinhalaTitle,
              snippet: raw.summary || raw.sinhalaSummary,
              sinhalaSummary: raw.sinhalaSummary,
              imageUrl: imageUrl || undefined,
              publishedAt: raw.createdAt
                ? moment(raw.createdAt).format("MMMM DD, YYYY") +
                  " - " +
                  moment(raw.createdAt).fromNow()
                : "Just now",
              sourcesCount: enrichedData.length || 0,
              favicons,
              category:
                Array.isArray(raw.categories) && raw.categories.length > 0
                  ? raw.categories[0]
                  : raw.source || "General",
              originalSource: raw.source,
              url: raw.url || undefined,
              dynamicOgImage: raw.dynamicOgImage || undefined,
              dynamicSourceUrl: raw.dynamicSourceUrl || undefined,
              referenceUrls: enrichedData
                .map((d) => d.url)
                .filter(Boolean),
              enrichedSources: enrichedData,
              structuredDataSearchResults:
                raw.structuredData?.searchResults || [],
              slug: raw.slug,
            };

            return (
              <div key={raw._id || index} className="w-full h-full flex">
                <NewsCard {...mapped} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
