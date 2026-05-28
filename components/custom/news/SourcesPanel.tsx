"use client";

import React, { useState } from "react";
import Image from "next/image";
import Fuse from "fuse.js";
import { Globe, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { EnrichedSource } from "./NewsCard";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

interface SourcesPanelProps {
  title: string;
  url?: string;
  originalSource?: string;
  structuredDataSearchResults?: EnrichedSource[];
  enrichedSources?: EnrichedSource[];
  sourcesCount?: number;
  favicons?: string[];
  customTrigger?: React.ReactNode;
}

export function SourcesPanel({
  title,
  url,
  originalSource,
  structuredDataSearchResults = [],
  enrichedSources = [],
  sourcesCount = 0,
  favicons = [],
  customTrigger,
}: SourcesPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  // 1. Combine and fuzzy search using Fuse.js to filter out unrelated sources
  const allSources = [...structuredDataSearchResults, ...enrichedSources];
  const uniqueAllSources = Array.from(
    new Map(allSources.map((s) => [s.url, s])).values()
  );

  const sourceScores = new Map<string, number>();

  if (title && uniqueAllSources.length > 0) {
    const fuse = new Fuse(uniqueAllSources, {
      keys: [
        { name: "title", weight: 0.7 },
        { name: "content", weight: 0.3 }
      ],
      threshold: 0.6, // Only show related sources (0 is perfect match, 1 is mismatch)
      includeScore: true,
      ignoreLocation: true,
    });

    const searchResults = fuse.search(title);
    searchResults.forEach((res) => {
      if (res.score !== undefined) {
        sourceScores.set(res.item.url, res.score);
      }
    });
  }

  // 2. Filter top coverage and related coverage, keeping only the ones deemed related by Fuse.js
  const filteredStructuredResults = structuredDataSearchResults.filter(
    (s) => sourceScores.has(s.url)
  );
  const filteredEnrichedSources = enrichedSources.filter(
    (s) => sourceScores.has(s.url)
  );

  // 3. Deduplicate lists based on URL
  const topCoverageUrls = new Set(
    filteredStructuredResults.map((s) => s.url)
  );

  if (url) topCoverageUrls.add(url);

  let relatedCoverage = filteredEnrichedSources.filter(
    (s) => !topCoverageUrls.has(s.url)
  );
  const allTopSources = filteredStructuredResults.map((s) => s);

  // Find if the primary URL already exists in the search results or enriched sources to use its original raw title
  const matchingSource = [...filteredStructuredResults, ...filteredEnrichedSources].find(
    (s) => s.url === url
  );
  const primaryTitle = matchingSource?.title || title;

  // Deduplicate the top coverage itself just in case
  let uniqueTopSources = Array.from(
    new Map(allTopSources.map((s) => [s.url, s])).values(),
  );

  // Rank uniqueTopSources strictly by similarity to the card title using Fuse scores
  if (uniqueTopSources.length > 0) {
    uniqueTopSources.sort((a, b) => {
      const scoreA = sourceScores.get(a.url) ?? 1;
      const scoreB = sourceScores.get(b.url) ?? 1;
      return scoreA - scoreB;
    });
  }

  // Rank relatedCoverage strictly by similarity to the card title using Fuse scores
  if (relatedCoverage.length > 0) {
    relatedCoverage.sort((a, b) => {
      const scoreA = sourceScores.get(a.url) ?? 1;
      const scoreB = sourceScores.get(b.url) ?? 1;
      return scoreA - scoreB;
    });
  }

  // Organize top sources up to 4 items and fill from relatedCoverage if needed (exactly matching mobile layout)
  const topSourcesBase = uniqueTopSources.slice(0, 4);
  let finalTopSources = topSourcesBase;
  let finalRelatedCoverage = relatedCoverage;
  if (finalTopSources.length < 4 && relatedCoverage.length > 0) {
    const needed = 4 - finalTopSources.length;
    const extra = relatedCoverage.slice(0, needed);
    finalTopSources = [...finalTopSources, ...extra];
    finalRelatedCoverage = relatedCoverage.slice(needed);
  }

  uniqueTopSources = finalTopSources;
  relatedCoverage = finalRelatedCoverage;

  // Combine and rank all sources by similarity to compute the absolute top 3 most match related favicons
  const allAvailableSources = [...uniqueTopSources, ...relatedCoverage];
  if (allAvailableSources.length > 0) {
    allAvailableSources.sort((a, b) => {
      const scoreA = sourceScores.get(a.url) ?? 1;
      const scoreB = sourceScores.get(b.url) ?? 1;
      return scoreA - scoreB;
    });
  }

  // Compute favicons dynamically based on the top 3 most related sources
  const dynamicFavicons = allAvailableSources.slice(0, 3).map((s) => {
    let domain = s.engine || "News";
    try {
      domain = new URL(s.url).hostname.replace(/^www\./i, "");
    } catch (e) { }
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  });

  const activeFavicons = dynamicFavicons.length > 0 ? dynamicFavicons : favicons;
  const activeSourcesCount = allAvailableSources.length || sourcesCount;

  const SourceAvatars = () => (
    <div className="flex items-center space-x-3">
      <div className="flex -space-x-2">
        {activeFavicons && activeFavicons.length > 0
          ? activeFavicons.map((favicon, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full bg-white border-2 border-white flex items-center justify-center shadow-sm relative overflow-hidden z-0"
              style={{ zIndex: 30 - i }}
            >
              <Image
                src={favicon}
                alt={`Source ${i + 1}`}
                className="w-full h-full object-contain z-0 relative"
                width={20}
                height={20}
                unoptimized
              />
            </div>
          ))
          : null}
      </div>
      <span className="text-sm text-slate-500 tracking-tight transition-colors group-hover/source:text-slate-900">
        {activeSourcesCount} sources
      </span>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {customTrigger ? (
          <div 
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="inline-block cursor-pointer"
          >
            {customTrigger}
          </div>
        ) : (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="cursor-pointer group/source transition-opacity hover:opacity-80 inline-block"
          >
            <SourceAvatars />
          </div>
        )}
      </SheetTrigger>

      <SheetContent 
        side="right" 
        className="w-full sm:max-w-md h-full overflow-y-auto bg-white dark:bg-zinc-950 border-l border-slate-200/50 dark:border-zinc-800/80 p-6 text-slate-900 dark:text-zinc-100"
      >
        <SheetHeader className="mb-8 border-b border-slate-100 dark:border-zinc-800 pb-6 text-left flex flex-col gap-1.5 p-0">
          <SheetTitle className="text-2xl font-inter font-semibold tracking-tight text-slate-900 dark:text-zinc-50">
            News Coverage
          </SheetTitle>
          <SheetDescription className="text-sm text-slate-500 dark:text-zinc-400 font-inter font-light">
            This article was intelligently aggregated from{" "}
            {activeSourcesCount} premium sources.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-8 font-inter text-left">
          {/* Primary Coverage */}
          {uniqueTopSources.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-4 px-1">
                Primary Coverage
              </h4>
              <div className="space-y-3">
                {uniqueTopSources.map((source, i) => {
                  let domain = source.engine || "News";
                  try {
                    domain = new URL(source.url).hostname.replace(
                      /^www\./i,
                      "",
                    );
                  } catch (e) { }

                  if (!source?.content) {
                    return null;
                  }

                  return (
                    <div
                      key={i}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(source.url, "_blank");
                      }}
                      className="cursor-pointer group flex gap-4 p-4 rounded-2xl border border-slate-100 dark:border-zinc-900 bg-white dark:bg-zinc-900/40 transition-all hover:border-slate-200 dark:hover:border-zinc-800 hover:shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
                    >
                      <div className="w-6 h-6 overflow-hidden rounded-full flex items-center justify-center shrink-0 border bg-slate-50 dark:bg-zinc-800 border-slate-100 dark:border-zinc-700">
                        <Image
                          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                          alt={domain}
                          className="w-full h-full object-contain"
                          width={30}
                          height={30}
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-slate-900 dark:text-zinc-100 text-sm leading-snug font-medium transition-colors mb-1 line-clamp-2 group-hover:text-primary dark:group-hover:text-primary-400">
                          {source.title || "Reference article"}
                        </h5>
                        <p className="text-xs text-muted-foreground truncate line-clamp-2 mb-1">
                          {source?.content}
                        </p>
                        <div className="flex items-center gap-2">
                          <Globe className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
                          <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 truncate">
                            {domain}
                          </span>
                          <ExternalLink className="w-3 h-3 text-slate-300 dark:text-zinc-600 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Related Coverage */}
          {relatedCoverage.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-zinc-500 mb-4 px-1">
                Related Coverage
              </h4>
              <div className="space-y-3 pb-10">
                {relatedCoverage.map((source, i) => {
                  let domain = source.engine || "News";
                  try {
                    domain = new URL(source.url).hostname.replace(
                      /^www\./i,
                      "",
                    );
                  } catch (e) { }

                  return (
                    <div
                      key={i}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(source.url, "_blank");
                      }}
                      className="cursor-pointer group flex gap-4 p-4 rounded-2xl border border-slate-100 dark:border-zinc-900 bg-white dark:bg-zinc-900/40 transition-all hover:border-slate-200 dark:hover:border-zinc-800 hover:shadow-[0_4px_20px_rgb(0,0,0,0.03)]"
                    >
                      <div className="w-6 h-6 overflow-hidden rounded-full flex items-center justify-center shrink-0 border bg-slate-50 dark:bg-zinc-800 border-slate-100 dark:border-zinc-700">
                        <Image
                          src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                          alt={domain}
                          className="w-full h-full object-contain"
                          width={30}
                          height={30}
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="text-slate-900 dark:text-zinc-100 text-sm leading-snug font-medium transition-colors mb-1 line-clamp-2 group-hover:text-primary dark:group-hover:text-primary-400">
                          {source.title || "Reference article"}
                        </h5>
                        <p className="text-xs text-muted-foreground truncate line-clamp-2 mb-1">
                          {source?.content}
                        </p>
                        <div className="flex items-center gap-2">
                          <Globe className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
                          <span className="text-[11px] font-medium text-slate-500 dark:text-zinc-400 truncate">
                            {domain}
                          </span>
                          <ExternalLink className="w-3 h-3 text-slate-300 dark:text-zinc-600 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
