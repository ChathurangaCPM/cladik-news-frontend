"use client";

import React, { useState, useEffect, useRef } from "react";
import { NewsCard } from "./NewsCard";
import { fetchNews } from "@/app/news/actions";
import { cn, isSameSiteNews } from "@/lib/utils";
import moment from "moment";
import Link from "next/link";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import {
  MapPin,
  Cpu,
  Briefcase,
  Landmark,
  Trophy,
  Clapperboard,
  HeartPulse,
  FlaskConical,
  Globe,
  Palmtree,
  Plane,
  Utensils,
  LayoutGrid,
  Bot,
  Coins,
  Leaf,
  ShieldAlert,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

const CATEGORIES = [
  { name: "All", icon: LayoutGrid },
  { name: "Local News", icon: MapPin },
  { name: "Technology", icon: Cpu },
  { name: "AI & Future", icon: Bot },
  { name: "Crypto", icon: Coins },
  { name: "Business", icon: Briefcase },
  { name: "Politics", icon: Landmark },
  { name: "Sports", icon: Trophy },
  { name: "Entertainment", icon: Clapperboard },
  { name: "Health", icon: HeartPulse },
  { name: "Science", icon: FlaskConical },
  { name: "World News", icon: Globe },
  { name: "Climate", icon: Leaf },
  { name: "Investigations", icon: ShieldAlert },
  { name: "Opinion", icon: MessageSquare },
  { name: "Fact Check", icon: CheckCircle2 },
  { name: "Lifestyle", icon: Palmtree },
  { name: "Travel", icon: Plane },
  { name: "Food", icon: Utensils },
];

// Reusable Skeleton Component for proper loading state
const NewsCardSkeleton = ({
  variant,
}: {
  variant: "featured" | "grid" | "horizontal";
}) => {
  if (variant === "featured") {
    return (
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 w-full animate-pulse">
        <div className="flex-1 space-y-4 pt-6 lg:pt-0 order-2 lg:order-1">
          <div className="h-6 w-24 bg-slate-200 rounded-full mb-4"></div>
          <div className="h-12 w-3/4 bg-slate-200 rounded-lg"></div>
          <div className="h-12 w-1/2 bg-slate-200 rounded-lg"></div>
          <div className="h-4 w-32 bg-slate-200 rounded mt-4"></div>
          <div className="space-y-2 mt-6">
            <div className="h-4 w-full bg-slate-200 rounded"></div>
            <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
            <div className="h-4 w-4/6 bg-slate-200 rounded"></div>
          </div>
        </div>
        <div className="w-full lg:w-[55%] aspect-[4/3] bg-slate-200 rounded-[2rem] order-1 lg:order-2"></div>
      </div>
    );
  }

  if (variant === "grid") {
    return (
      <div className="flex flex-col h-full border border-slate-100 rounded-[24px] bg-white animate-pulse">
        <div className="aspect-[3/2] w-full bg-slate-200 rounded-t-[24px]"></div>
        <div className="p-6 flex flex-col flex-1 space-y-4">
          <div className="h-4 w-20 bg-slate-200 rounded-full"></div>
          <div className="h-8 w-full bg-slate-200 rounded-lg"></div>
          <div className="h-8 w-3/4 bg-slate-200 rounded-lg"></div>
          <div className="space-y-2 mt-auto">
            <div className="h-3 w-full bg-slate-200 rounded"></div>
            <div className="h-3 w-4/5 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 w-full p-2 animate-pulse">
      <div className="w-full lg:w-[35%] aspect-[16/10] bg-slate-200 rounded-[24px]"></div>
      <div className="flex-1 space-y-3 lg:pr-8 py-2">
        <div className="h-4 w-24 bg-slate-200 rounded"></div>
        <div className="h-8 w-full bg-slate-200 rounded-lg"></div>
        <div className="h-8 w-2/3 bg-slate-200 rounded-lg"></div>
        <div className="space-y-2 pt-4">
          <div className="h-3 w-full bg-slate-200 rounded"></div>
          <div className="h-3 w-5/6 bg-slate-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export function NewsFeed({
  initialNews,
  searchQuery,
  initialCategory,
}: {
  initialNews: any[];
  searchQuery?: string;
  initialCategory?: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory || "All",
  );
  const observerTarget = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["news", "feed", selectedCategory, searchQuery || ""],
    queryFn: async ({ pageParam = 0 }) => {
      // If doing semantic search, the API might not truly paginate. Just fetch News if normal category.
      if (searchQuery) return [];

      const limit = pageParam === 0 ? 6 : 20;
      const offset = pageParam === 0 ? 0 : 6 + ((pageParam as number) - 1) * 20;

      const newItems = await fetchNews(offset, limit, selectedCategory);
      return newItems || [];
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (searchQuery) return undefined; // No pagination for search yet
      const expectedLength = allPages.length === 1 ? 6 : 20;
      return lastPage.length >= expectedLength ? allPages.length : undefined;
    },
    initialData: () => {
      // Inject SSR initialData allowing TanStack to handle everything
      if (initialNews?.length > 0) {
        if (searchQuery) {
          return { pages: [initialNews], pageParams: [0] };
        }
        if (selectedCategory === (initialCategory || "All")) {
          return { pages: [initialNews], pageParams: [0] };
        }
      }
      return undefined;
    },
    staleTime: 60000, // 1 minute client-side cache prevents duplicate refetches
    refetchOnWindowFocus: false, // Prevents cached server data from overwriting SSE updates on tab switch
    enabled: true, // Always enabled so TanStack manages the cache
  });

  // Flat map the infinite pages
  let items = data?.pages.flat() || [];

  // Deduplicate items by slug and _id, and filter out same-site articles
  items = items.filter(
    (item, index, self) =>
      index ===
      self.findIndex(
        (n) => n._id === item._id || (n.slug && item.slug && n.slug === item.slug)
      )
  ).filter((item) => !isSameSiteNews(item));

  // Setup Server-Sent Events for Real-Time UI Updates mapped into TanStack cache
  useEffect(() => {
    const NEWS_API_URL =
      process.env.NEXT_PUBLIC_NEWS_AGGREGATOR_URL || "http://localhost:5005/api";
    const eventSource = new EventSource(`/api/news/stream?t=${Date.now()}`);

    eventSource.onmessage = (event) => {
      try {
        const rawNewItem = JSON.parse(event.data);
        if (rawNewItem && rawNewItem._id) {
          // Verify SSE matches current category or search filter
          if (searchQuery) {
            const sq = searchQuery.toLowerCase();
            const matchesSearch =
              (rawNewItem.title || "").toLowerCase().includes(sq) ||
              (rawNewItem.summary || "").toLowerCase().includes(sq) ||
              (rawNewItem.sinhalaTitle || "").toLowerCase().includes(sq) ||
              (rawNewItem.categories || []).some((c: string) =>
                c.toLowerCase().includes(sq),
              );
            if (!matchesSearch) return;
          } else if (selectedCategory !== "All") {
            const matchesCategory =
              (rawNewItem.categories || []).some(
                (c: string) =>
                  c.toLowerCase() === selectedCategory.toLowerCase(),
              ) ||
              (rawNewItem.source || "").toLowerCase() ===
                selectedCategory.toLowerCase();
            if (!matchesCategory) return;
          }

          // Immutably inject the live streamed article into the TanStack cache!
          queryClient.setQueryData(
            ["news", "feed", selectedCategory, searchQuery || ""],
            (oldData: any) => {
              if (!oldData || !oldData.pages || oldData.pages.length === 0)
                return oldData;

              // Deduplication via ID
              const alreadyExists = oldData.pages
                .flat()
                .some((item: any) => item._id === rawNewItem._id);
              if (alreadyExists) return oldData;

              const newFirstPage = [rawNewItem, ...oldData.pages[0]];
              return {
                ...oldData,
                pages: [newFirstPage, ...oldData.pages.slice(1)],
              };
            },
          );
        }
      } catch (err) {
        console.error("Error parsing SSE data:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE connection error:", err);
    };

    return () => {
      eventSource.close();
    };
  }, [selectedCategory, queryClient]);

  // Infinite Scroll Trigger Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.7 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const formatPubDate = (pubDate: string): string => {
    const now = moment();
    const date = moment(pubDate);
    const diffHours = now.diff(date, "hours");

    if (diffHours < 24) {
      return date.fromNow(); // e.g. "3 hours ago"
    }

    const localDate = new Date(pubDate).toLocaleDateString("en-LK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    return `${localDate} at ${date.format("h:mm A")}`;
  };

  const mapItem = (raw: any, index: number) => {
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
        const parsed = JSON.parse(raw.aiEnrichedContent);
        if (Array.isArray(parsed)) {
          enrichedData = parsed;
        } else if (parsed && Array.isArray(parsed.searchResults)) {
          // Handle Next-Gen Structured Schema
          enrichedData = parsed.searchResults;
        }
      }
    } catch (e) {}

    const sourcesCount = enrichedData.length || 0;
    const referenceUrls = enrichedData.map((d: any) => d.url).filter(Boolean);
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
      .filter((f): f is string => f !== null);

    let variant: "featured" | "grid" | "horizontal" = "grid";
    const mod = index % 5;
    if (mod === 0) variant = "featured";
    else if (mod > 0 && mod < 4) variant = "grid";
    else variant = "horizontal";

    return {
      id: raw._id,
      variant,
      title: raw.title || raw.sinhalaTitle || "Untitled News",
      sinhalaTitle: raw.sinhalaTitle,
      snippet: raw.summary || raw.sinhalaSummary,
      sinhalaSummary: raw.sinhalaSummary,
      imageUrl,
      publishedAt: formatPubDate(raw.createdAt || raw.pubDate),
      sourcesCount,
      favicons,
      category:
        Array.isArray(raw.categories) && raw.categories.length > 0
          ? raw.categories[0]
          : raw.source || "General",
      originalSource: raw.source,
      url: raw.url,
      dynamicOgImage: raw.dynamicOgImage,
      dynamicSourceUrl: raw.dynamicSourceUrl,
      referenceUrls,
      enrichedSources: enrichedData,
      structuredDataSearchResults: raw.structuredData?.searchResults || [],
      slug: raw.slug,
    };
  };

  return (
    <div className="flex flex-col pb-24 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
      {/* Category Filter Pills */}
      <div className="w-full sticky top-0 py-4 mb-8 border-b border-neutral-200/50 dark:border-white/[0.04] backdrop-blur-xl bg-white/70 dark:bg-[#07090e]/70 z-10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="relative max-w-[1400px] mx-auto group">
          <div className="flex items-center justify-start md:justify-center gap-2 py-1 px-1 overflow-x-auto scrollbar-none scroll-smooth">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.name;
              const Icon = cat.icon;
              const href =
                cat.name === "All"
                  ? "/news"
                  : `/news/${encodeURIComponent(cat.name.toLowerCase().replace(/ /g, "-"))}`;
              return (
                <Link
                  key={cat.name}
                  href={href}
                  className={cn(
                    "group/btn flex items-center gap-2 px-4 py-2 rounded-full text-xs transition-all duration-300 ease-in-out whitespace-nowrap tracking-tight font-medium border",
                    isActive
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 border-slate-900 dark:border-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(255,255,255,0.05)] transform scale-[1.02]"
                      : "bg-white/60 dark:bg-white/[0.02] text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/[0.06] hover:text-neutral-900 dark:hover:text-white border-neutral-200 dark:border-white/[0.05] hover:border-neutral-300 dark:hover:border-white/[0.1] shadow-sm hover:shadow",
                  )}
                >
                  <Icon
                    className={cn(
                      "w-3.5 h-3.5 transition-transform duration-300",
                      isActive
                        ? "text-white dark:text-slate-950 scale-110"
                        : "text-neutral-400 dark:text-neutral-500 group-hover/btn:text-neutral-700 dark:group-hover/btn:text-neutral-300 group-hover/btn:scale-110",
                    )}
                  />
                  {cat.name}
                </Link>
              );
            })}
          </div>
          {/* Fading cues on scroll overflow */}
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white dark:from-[#07090e] to-transparent pointer-events-none z-10 md:hidden" />
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white dark:from-[#07090e] to-transparent pointer-events-none z-10 md:hidden" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mt-2">
        {/* Loading Initial States with Skeleton */}
        {status === "pending" && items.length === 0 ? (
          <>
            <div className="md:col-span-2 lg:col-span-3 w-full">
              <NewsCardSkeleton variant="featured" />
            </div>
            <div className="col-span-1 w-full">
              <NewsCardSkeleton variant="grid" />
            </div>
            <div className="col-span-1 w-full">
              <NewsCardSkeleton variant="grid" />
            </div>
            <div className="col-span-1 w-full">
              <NewsCardSkeleton variant="grid" />
            </div>
            <div className="md:col-span-2 lg:col-span-3 w-full">
              <NewsCardSkeleton variant="horizontal" />
            </div>
          </>
        ) : (
          items.map((raw: any, idx: number) => {
            const mapped = mapItem(raw, idx);
            const isFullWidth =
              mapped.variant === "featured" || mapped.variant === "horizontal";

            return (
              <div
                key={raw._id || idx}
                className={cn(
                  isFullWidth ? "md:col-span-2 lg:col-span-3" : "col-span-1",
                  "w-full h-full flex",
                )}
              >
                <NewsCard {...mapped} />
              </div>
            );
          })
        )}

        {/* Loading Next Page Skeletons */}
        {isFetchingNextPage && (
          <>
            <div className="col-span-1 w-full">
              <NewsCardSkeleton variant="grid" />
            </div>
            <div className="col-span-1 w-full">
              <NewsCardSkeleton variant="grid" />
            </div>
            <div className="col-span-1 w-full">
              <NewsCardSkeleton variant="grid" />
            </div>
          </>
        )}
      </div>

      {/* Infinite Scroll trigger (Disabled for Search Results) */}
      {!searchQuery && (
        <div
          ref={observerTarget}
          className="h-20 w-full flex items-center justify-center mt-8"
        >
          {!hasNextPage && items.length > 0 && !isFetching && (
            <span className="text-sm text-slate-400">
              You&apos;ve reached the end of the feed.
            </span>
          )}
        </div>
      )}
    </div>
  );
}
