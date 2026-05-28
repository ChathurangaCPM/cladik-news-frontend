import React from "react";
import { NewsCard } from "./NewsCard";
import moment from "moment";
import { isSameSiteNews } from "@/lib/utils";

const NEWS_API_URL =
  process.env.NEXT_PUBLIC_NEWS_AGGREGATOR_URL ||
  process.env.NEWS_AGGREGATOR_URL ||
  "http://localhost:5005/api";

export async function RelatedNews({
  articleId,
  currentSlug,
}: {
  articleId: string;
  currentSlug: string;
}) {
  if (!articleId) return null;

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

    if (!res.ok) return null;
    const allNews = await res.json();

    // Filter out current, exclude same-site articles, and map to 3 grid cards
    const relatedItems = allNews
      .filter((item: any) => item.slug !== currentSlug && !isSameSiteNews(item))
      .slice(0, 3);

    if (relatedItems.length === 0) return null;

    return (
      <div className="max-w-5xl mx-auto px-4  pb-24 mt-8">
        <div className="pt-12 border-t border-slate-200/60 dark:border-slate-800">
          <h3 className="text-2xl font-heading mb-8 text-slate-900 tracking-tight">
            Related News
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {relatedItems.map((raw: any, index: number) => {
              const sourceLower = (raw.source || "").toLowerCase();
              const showImage = [
                "techcrunch",
                "wired",
                "aljazeera",
                "techcrunch.com",
                "wired.com",
                "aljazeera.com",
              ].some((s) => sourceLower.includes(s));

              const imageUrl = showImage ? raw.ogImage : undefined;

              let enrichedData: any[] = [];
              try {
                if (raw.aiEnrichedContent) {
                  enrichedData =
                    typeof raw.aiEnrichedContent === "string"
                      ? JSON.parse(raw.aiEnrichedContent)
                      : raw.aiEnrichedContent;
                }
              } catch (e) {}

              const favicons = enrichedData
                .slice(0, 3)
                .map((d: any) => {
                  try {
                    const url = new URL(d.url);
                    return `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
                  } catch (e) {
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
                imageUrl,
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
                url: raw.url,
                dynamicOgImage: raw.dynamicOgImage,
                dynamicSourceUrl: raw.dynamicSourceUrl,
                referenceUrls: enrichedData
                  .map((d: any) => d.url)
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
  } catch (err) {
    console.warn("Failed to fetch related news", err);
    return null;
  }
}
