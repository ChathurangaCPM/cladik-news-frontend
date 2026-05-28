"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Heart,
  MoreHorizontal,
  ExternalLink,
  Globe,
  Flag,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Fuse from "fuse.js";
import { useRouter } from "next/navigation";
import { SourcesPanel } from "./SourcesPanel";
import { cn } from "@/lib/utils";
import { ReportButton } from "./ReportButton";
import { useLangContext } from "@/providers/langProvider";

export interface EnrichedSource {
  title?: string;
  url: string;
  content?: string;
  engine?: string;
}

export interface NewsItemProps {
  id?: string;
  variant: "featured" | "grid" | "horizontal";
  title: string;
  sinhalaTitle?: string;
  sinhalaContent?: string;
  sinhalaSummary?: string;
  snippet?: string;
  imageUrl?: string;
  publishedAt: string;
  sourcesCount: number;
  category?: string;
  favicons?: string[];
  url?: string;
  dynamicOgImage?: string;
  dynamicSourceUrl?: string;
  referenceUrls?: string[];
  originalSource?: string;
  enrichedSources?: EnrichedSource[];
  structuredDataSearchResults?: EnrichedSource[];
  slug?: string;
}

export function NewsCard({
  id,
  variant,
  title,
  sinhalaTitle,
  sinhalaContent,
  sinhalaSummary,
  snippet,
  imageUrl,
  publishedAt,
  sourcesCount,
  category = "World",
  favicons = [],
  url,
  dynamicOgImage,
  dynamicSourceUrl,
  originalSource,
  enrichedSources = [],
  structuredDataSearchResults = [],
  slug,
}: NewsItemProps) {
  const { lang, dictionary } = useLangContext();
  const router = useRouter();

  let dynamicDomain = null;
  if (dynamicSourceUrl) {
    try {
      dynamicDomain = new URL(dynamicSourceUrl).hostname.replace(/^www\./i, "");
    } catch (e) { }
  }

  const [imageError, setImageError] = useState(false);
  const [blacklist, setBlacklist] = useState<string[]>([]);
  const currentImageUrl = imageUrl || dynamicOgImage;

  useEffect(() => {
    setImageError(false);
  }, [currentImageUrl]);

  useEffect(() => {
    const cached = localStorage.getItem("news_blacklisted_domains");
    if (cached) {
      try {
        setBlacklist(JSON.parse(cached));
      } catch (e) {}
    }

    fetch("/api/news/settings")
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.blacklistedOgDomains)) {
          setBlacklist(data.blacklistedOgDomains);
          localStorage.setItem("news_blacklisted_domains", JSON.stringify(data.blacklistedOgDomains));
        }
      })
      .catch(() => {});
  }, []);

  const isImageBlacklisted = (urlStr: string | undefined): boolean => {
    if (!urlStr) return false;
    try {
      const hostname = new URL(urlStr).hostname.toLowerCase();
      return blacklist.some((domain) => {
        const cleanDomain = domain.toLowerCase().trim();
        return hostname === cleanDomain || hostname.endsWith("." + cleanDomain);
      });
    } catch (e) {
      return false;
    }
  };

  const isBlacklisted = isImageBlacklisted(currentImageUrl);
  const activeImageUrl = (!imageError && currentImageUrl && !isBlacklisted) ? currentImageUrl : null;

  const handleCardClick = () => {
    if (slug) {
      router.push(`/news/${slug}`);
    } else if (url) {
      window.open(url, "_blank");
    }
  };

  const Actions = () => (
    <div className="flex items-center space-x-1 text-slate-400">
      {id && <ReportButton id={id} />}
    </div>
  );

  const CategoryBadge = () => (
    <div className="inline-flex items-center rounded-full border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 px-2.5 py-0.5 text-xs text-slate-800 dark:text-zinc-200 transition-colors hover:bg-slate-100 dark:hover:bg-zinc-850 mb-4">
      {category}
    </div>
  );

  if (variant === "featured") {
    return (
      <div className="group flex flex-col lg:flex-row gap-8 lg:gap-14 items-center w-full cursor-pointer">
        <div
          className={cn(
            "flex-1 space-y-4 pr-0 lg:pr-4 order-2 lg:order-1 pt-6 lg:pt-0",
            !activeImageUrl ? "lg:mr-auto" : "",
          )}
        >
          <CategoryBadge />
          <Link href={slug ? `/news/${slug}` : url || "#"}>
            <h2
              className={`text-3xl md:text-[42px] leading-[1.15] tracking-tight ${lang === "si" ? "font-sinhala" : "font-heading"} text-slate-900 dark:text-zinc-50 group-hover:text-slate-700 dark:group-hover:text-zinc-300 transition-colors`}
            >
              {lang === "si" ? sinhalaTitle : title}.
            </h2>
          </Link>
          <Link href={slug ? `/news/${slug}` : url || "#"}>
            <div className="flex items-center text-slate-400 text-sm py-2 space-x-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs">{publishedAt}</span>
            </div>
          </Link>
          <Link href={slug ? `/news/${slug}` : url || "#"}>
            {(lang === "si" ? sinhalaSummary : snippet) && (
              <p
                className={cn(
                  "text-slate-600 dark:text-zinc-300 leading-relaxed font-light",
                  !activeImageUrl ? "max-w-3xl" : "max-w-xl",
                  lang === "si" ? "font-sinhala tracking-normal" : "",
                )}
              >
                {lang === "si" ? sinhalaSummary : snippet}
              </p>
            )}
          </Link>
 
          <div className="flex items-center justify-between pt-6 max-w-sm border-t border-slate-100 dark:border-zinc-800/80 !pb-2">
            <SourcesPanel
              title={title}
              url={url}
              originalSource={originalSource}
              structuredDataSearchResults={structuredDataSearchResults}
              enrichedSources={enrichedSources}
              sourcesCount={sourcesCount}
              favicons={favicons}
            />
            <Actions />
          </div>
        </div>
 
        {activeImageUrl && (
          <div className="w-full lg:w-[55%] aspect-[4/3] relative rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] order-1 lg:order-2 transform transition-transform duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.1)] dark:hover:shadow-[0_20px_40px_rgb(0,0,0,0.4)] group/img">
            <Link
              href={slug ? `/news/${slug}` : url || "#"}
              className="block relative aspect-[4/3] z-10"
            >
              <img
                src={activeImageUrl}
                alt={title}
                width={600}
                height={600}
                className="object-cover w-full h-full transform transition-transform duration-700 group-hover/img:scale-[1.03]"
                onError={() => setImageError(true)}
              />
            </Link>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500 z-60" />
 
            {dynamicSourceUrl && !imageUrl && (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(dynamicSourceUrl, "_blank");
                }}
                className="absolute bottom-4 right-4 bg-black/70 hover:bg-black/90 backdrop-blur-md text-white border border-white/20 text-xs px-3 py-1.5 rounded-full transition-all flex items-center space-x-1.5 shadow-xl z-20 cursor-pointer"
              >
                <span>Image Credit : {dynamicDomain}</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
 
  if (variant === "grid") {
    return (
      <div className="group flex flex-col h-full overflow-hidden border border-slate-100 dark:border-zinc-800/80 shadow-[0_2px_15px_rgb(0,0,0,0.03)] dark:shadow-[0_2px_15px_rgb(0,0,0,0.2)] rounded-[24px] cursor-pointer transition-all duration-300 hover:shadow-[0_15px_35px_rgb(0,0,0,0.08)] dark:hover:shadow-[0_15px_35px_rgb(0,0,0,0.3)] bg-white dark:bg-zinc-900/40">
        {activeImageUrl && (
          <div className="relative aspect-[3/2] w-full bg-slate-50 dark:bg-zinc-950/40 overflow-hidden group/img">
            <div className="absolute top-4 left-4 z-20">
              <span className="inline-flex items-center rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm px-2.5 py-1 text-xs text-slate-900 dark:text-zinc-100 shadow-sm border border-slate-100/50 dark:border-zinc-800/50">
                {category}
              </span>
            </div>
            <Link href={slug ? `/news/${slug}` : url || "#"}>
              <img
                src={activeImageUrl}
                alt={title}
                className="object-cover w-full h-full transform transition-transform duration-700 group-hover/img:scale-[1.05]"
                onError={() => setImageError(true)}
              />
            </Link>
 
            {dynamicSourceUrl && !imageUrl && (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(dynamicSourceUrl, "_blank");
                }}
                className="absolute bottom-4 right-4 bg-black/70 hover:bg-black/90 backdrop-blur-md text-white border border-white/20 text-[11px] px-3 py-1.5 rounded-full transition-all flex items-center space-x-1.5 shadow-xl z-20 cursor-pointer"
              >
                <span>Image Source : {dynamicDomain}</span>
              </div>
            )}
          </div>
        )}
        <div
          className={cn(
            "flex flex-col flex-1 pb-5",
            activeImageUrl ? "p-6" : "p-8",
          )}
        >
          {!activeImageUrl && (
            <div className="mb-4">
              <CategoryBadge />
            </div>
          )}
          <Link href={slug ? `/news/${slug}` : url || "#"}>
            <h3
              className={cn(
                "tracking-tight text-slate-900 dark:text-zinc-50 leading-[1.3] mb-6 flex-1 pr-2 group-hover:text-slate-800 dark:group-hover:text-zinc-300 transition-colors",
                lang === "si" ? "font-sinhala tracking-normal" : "font-heading",
                activeImageUrl ? "text-[22px]" : "text-[28px]",
              )}
            >
              {lang === "si" ? sinhalaTitle : title}.
            </h3>
            {(lang === "si" ? sinhalaSummary : snippet) && !activeImageUrl && (
              <p
                className={cn(
                  "text-slate-600 dark:text-zinc-300 leading-relaxed mb-6",
                  lang === "si"
                    ? "font-sinhala tracking-normal md:text-[15px]"
                    : "font-inter font-light ",
                )}
              >
                {lang === "si" ? sinhalaSummary : snippet}
              </p>
            )}
            <div className="flex items-center text-slate-400 text-sm py-2 space-x-2">
              <Clock className="w-4 h-4" />
              <span className="text-xs">{publishedAt}</span>
            </div>
          </Link>
 
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-zinc-800/80">
            <SourcesPanel
              title={title}
              url={url}
              originalSource={originalSource}
              structuredDataSearchResults={structuredDataSearchResults}
              enrichedSources={enrichedSources}
              sourcesCount={sourcesCount}
              favicons={favicons}
            />
            <Actions />
          </div>
        </div>
      </div>
    );
  }
 
  if (variant === "horizontal") {
    return (
      <div className="group flex flex-col lg:flex-row gap-6 lg:gap-10 items-center w-full cursor-pointer p-2 rounded-[28px] transition-colors hover:bg-slate-50/50 dark:hover:bg-zinc-900/20">
        {activeImageUrl && (
          <div className="w-full lg:w-[35%] aspect-[16/10] relative rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.04)] bg-slate-50 dark:bg-zinc-950/40 group/img">
            <Link href={slug ? `/news/${slug}` : url || "#"}>
              <img
                src={activeImageUrl}
                alt={title}
                className="object-cover w-full h-full transform transition-transform duration-700 group-hover/img:scale-[1.05]"
                onError={() => setImageError(true)}
              />
            </Link>
            {dynamicSourceUrl && !imageUrl && (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  window.open(dynamicSourceUrl, "_blank");
                }}
                className="absolute bottom-3 left-3 bg-black/70 hover:bg-black/90 backdrop-blur-md text-white border border-white/20 text-[11px] px-2 py-1 rounded-full transition-all flex items-center space-x-1 shadow-xl z-20 cursor-pointer"
              >
                <span>Image Source : {dynamicDomain}</span>
              </div>
            )}
          </div>
        )}
        <div className="flex-1 space-y-3 lg:pr-8 py-2">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[11px] text-slate-500 dark:text-zinc-400">{category}</span>
            <span className="text-slate-300 dark:text-zinc-700">•</span>
            <Link href={slug ? `/news/${slug}` : url || "#"}>
              <div className="flex items-center text-slate-400 text-xs">
                <Clock className="w-3.5 h-3.5 mr-1.5" />
                <span>{publishedAt}</span>
              </div>
            </Link>
          </div>
          <Link
            href={slug ? `/news/${slug}` : url || "#"}
            className="space-y-3"
          >
            <h2
              className={cn(
                "text-2xl md:text-[28px] tracking-tight text-slate-900 dark:text-zinc-50 leading-[1.25] group-hover:text-slate-850 dark:group-hover:text-zinc-300 transition-colors",
                lang === "si" ? "font-sinhala tracking-normal" : "font-heading",
              )}
            >
              {lang === "si" ? sinhalaTitle : title}.
            </h2>
 
            {(lang === "si" ? sinhalaSummary : snippet) && (
              <p
                className={cn(
                  "text-slate-600 dark:text-zinc-300 leading-relaxed pt-1",
                  !activeImageUrl ? "max-w-4xl" : "max-w-2xl",
                  lang === "si" ? "font-sinhala tracking-normal" : "font-light",
                )}
              >
                {lang === "si" ? sinhalaSummary : snippet}
              </p>
            )}
          </Link>
 
          <div className="flex items-center justify-between pt-5 mt-2 border-t border-slate-100 dark:border-zinc-800/80">
            <SourcesPanel
              title={title}
              url={url}
              originalSource={originalSource}
              structuredDataSearchResults={structuredDataSearchResults}
              enrichedSources={enrichedSources}
              sourcesCount={sourcesCount}
              favicons={favicons}
            />
            <Actions />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
