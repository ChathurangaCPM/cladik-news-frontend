"use client";

import React, { useState, useEffect, useRef } from "react";
import { Streamdown } from "streamdown";
import Image from "next/image";
import Fuse from "fuse.js";
import { useLangContext } from "@/providers/langProvider";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";

import {
  ExternalLink,
  Globe,
  Sparkles,
  AlertCircle,
  ChevronLeft,
  Eye,
  Link2,
} from "lucide-react";
import { incrementViewCountAction } from "@/app/news/actions";
import { ReportButton } from "./ReportButton";
import moment from "moment";
import { DynamicNewsChart } from "@/components/news/DynamicNewsChart";
import { SourcesPanel } from "./SourcesPanel";
import { useRouter } from "next/navigation";
export interface EnrichedSource {
  title?: string;
  url: string;
  content?: string;
  engine?: string;
}

interface NewsArticleProps {
  article: {
    keywords: any;
    createdAt: string;
    _id?: string;
    title: string;
    sinhalaTitle?: string;
    url?: string;
    content: string;
    sinhalaContent?: string;
    pubDate: string;
    categories: string[];
    ogImage?: string;
    dynamicSourceUrl?: string;
    dynamicOgImage?: string;
    summary?: string;
    sinhalaSummary?: string;
    structuredDataSearchResults?: EnrichedSource[];
    aiEnrichedContent?: EnrichedSource[];
    originalSource?: string;
    slug?: string;
    chart?: any;
    views?: number;
  };
}

const NewsArticleContent: React.FC<NewsArticleProps> = ({ article }) => {
  const displayImage = article.dynamicOgImage || article.ogImage;

  const articleCategory = Array.from(
    new Set(
      [
        ...article.categories,
        ...(Array.isArray(article.keywords) ? article.keywords : []),
      ].filter(Boolean),
    ),
  );

  const { lang, dictionary } = useLangContext();
  const router = useRouter();

  const [viewCount, setViewCount] = React.useState(
    Math.max(article.views || 0, 1),
  );
  const [showSticky, setShowSticky] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const isContentInView = useInView(contentRef, {
    once: true,
    margin: "-100px",
  });
  const activeContent =
    lang === "si" ? article.sinhalaContent : article.content;

  // Orchestration Flow States
  // 0: Stream Title
  // 1: Stream Summary
  // 2: Reveal Meta/Image & Stream Main Content
  // 3: Reveal Chart/Sources Footer
  const [animationStage, setAnimationStage] = useState(0);

  const activeTitle =
    (lang === "si" ? article.sinhalaTitle : article.title) || "";
  const activeSummary =
    (lang === "si" ? article.sinhalaSummary : article.summary) || "";

  const [streamedTitleLen, setStreamedTitleLen] = useState(0);
  const [streamedSummaryLen, setStreamedSummaryLen] = useState(0);
  const [streamedLength, setStreamedLength] = useState(0);

  // Reset on language switch
  useEffect(() => {
    setStreamedLength(0);
    setStreamedTitleLen(0);
    setStreamedSummaryLen(0);
    setAnimationStage(0);
  }, [lang]);

  // Title Animation (Stage 0)
  useEffect(() => {
    if (animationStage === 0 && activeTitle) {
      if (streamedTitleLen < activeTitle.length) {
        const interval = setInterval(() => {
          setStreamedTitleLen((prev) => {
            const next = prev + 5;
            if (next >= activeTitle.length) {
              clearInterval(interval);
              setTimeout(() => setAnimationStage(1), 50);
              return activeTitle.length;
            }
            return next;
          });
        }, 10);
        return () => clearInterval(interval);
      } else {
        setAnimationStage(1);
      }
    } else if (animationStage === 0 && !activeTitle) {
      setAnimationStage(1);
    }
  }, [animationStage, activeTitle, streamedTitleLen]);

  // Summary Animation (Stage 1)
  useEffect(() => {
    if (animationStage === 1 && activeSummary) {
      if (streamedSummaryLen < activeSummary.length) {
        const interval = setInterval(() => {
          setStreamedSummaryLen((prev) => {
            const next = prev + 6;
            if (next >= activeSummary.length) {
              clearInterval(interval);
              setTimeout(() => setAnimationStage(2), 100);
              return activeSummary.length;
            }
            return next;
          });
        }, 10);
        return () => clearInterval(interval);
      } else {
        setAnimationStage(2);
      }
    } else if (animationStage === 1 && !activeSummary) {
      setAnimationStage(2);
    }
  }, [animationStage, activeSummary, streamedSummaryLen]);

  // Content Animation (Stage 2)
  useEffect(() => {
    if (!activeContent) return;

    // Start main content streaming ONLY when stage 2 is reached, BUT also wait for it to be in view!
    if (
      animationStage === 2 &&
      isContentInView &&
      streamedLength < activeContent.length
    ) {
      const interval = setInterval(() => {
        setStreamedLength((prev) => {
          const skipAmount = Math.max(
            25,
            Math.floor(activeContent.length / 40),
          );
          const next = prev + skipAmount;
          if (next >= activeContent.length) {
            clearInterval(interval);
            setTimeout(() => setAnimationStage(3), 200);
            return activeContent.length;
          }
          return next;
        });
      }, 10);
      return () => clearInterval(interval);
    } else if (
      animationStage === 2 &&
      isContentInView &&
      streamedLength >= activeContent.length
    ) {
      setAnimationStage(3);
    }
  }, [animationStage, isContentInView, activeContent, streamedLength]);

  const displayedContent = activeContent?.substring(0, streamedLength) || "";
  const isStreaming =
    animationStage === 2 &&
    isContentInView &&
    streamedLength < (activeContent?.length || 0);
  const displayedTitle = activeTitle.substring(0, streamedTitleLen);
  const displayedSummary = activeSummary.substring(0, streamedSummaryLen);

  useEffect(() => {
    const handleScroll = () => {
      if (titleRef.current) {
        const rect = titleRef.current.getBoundingClientRect();
        // Show sticky header when the title is mostly scrolled up
        setShowSticky(rect.top < -50);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    if (!article.slug) return;

    const viewedKey = `viewed_news_${article.slug}`;
    if (!localStorage.getItem(viewedKey)) {
      // Set synchronously first to prevent React 18 Strict Mode from double-firing the API
      localStorage.setItem(viewedKey, "1");
      incrementViewCountAction(article.slug)
        .then((data) => {
          if (data && data.success) {
            setViewCount(Math.max(data.views, 1));
          }
        })
        .catch((e) => {
          localStorage.removeItem(viewedKey);
        });
    }
  }, [article.slug]);

  const formatViews = (views: number) => {
    if (views <= 1) return "1 view";
    if (views < 1000) return views.toString() + " views";
    if (views < 1000000) return (views / 1000).toFixed(1) + "K views";
    return (views / 1000000).toFixed(1) + "M views";
  };

  let aiEnrichedData: EnrichedSource[] = [];
  try {
    if (typeof article.aiEnrichedContent === "string") {
      aiEnrichedData = JSON.parse(article.aiEnrichedContent);
    } else if (Array.isArray(article.aiEnrichedContent)) {
      aiEnrichedData = article.aiEnrichedContent;
    }
  } catch (e) {
    console.warn("Failed to parse aiEnrichedContent", e);
  }

  const rawStructuredData =
    article.structuredDataSearchResults ||
    (article as any).structuredData?.searchResults ||
    [];

  const allTopSources: EnrichedSource[] = rawStructuredData.map(
    (s: any) => s as EnrichedSource,
  );

  // Add original URL into the list silently if preferred
  if (article.url && article.originalSource) {
    allTopSources.unshift({
      url: article.url,
      title: article.title,
      engine: article.originalSource,
    });
  }

  // Deduplicate the top coverage itself just in case
  let uniqueTopSources = Array.from(
    new Map(allTopSources.map((s: EnrichedSource) => [s.url, s])).values(),
  );

  // Helper for Sørensen–Dice coefficient similarity
  const getSimilarity = (t1: string, t2: string) => {
    const s1 = (t1 || "").toLowerCase().trim();
    const s2 = (t2 || "").toLowerCase().trim();
    if (!s1 || !s2) return 0;
    if (s1 === s2) return 1;
    const b1 = new Set<string>();
    for (let i = 0; i < s1.length - 1; i++) b1.add(s1.substring(i, i + 2));
    const b2 = new Set<string>();
    for (let i = 0; i < s2.length - 1; i++) b2.add(s2.substring(i, i + 2));
    let intersection = 0;
    b1.forEach((b) => { if (b2.has(b)) intersection++; });
    return (2.0 * intersection) / (b1.size + b2.size || 1);
  };

  // Rank uniqueTopSources strictly by similarity to the article title, prioritizing original URL
  if (uniqueTopSources.length > 0) {
    uniqueTopSources.sort((a, b) => {
      const isAOriginal = a.url === article.url;
      const isBOriginal = b.url === article.url;
      if (isAOriginal && !isBOriginal) return -1;
      if (!isAOriginal && isBOriginal) return 1;

      const simA = getSimilarity(a.title || "", article.title || "");
      const simB = getSimilarity(b.title || "", article.title || "");
      return simB - simA;
    });
  }

  // Display only strictly matched primary sources to replicate the exact Primary Coverage logic
  const displaySources = [...uniqueTopSources].slice(0, 4);

  // Fallback visually only if the UI desperately lacks grid real estate
  if (displaySources.length < 4 && aiEnrichedData.length > 0) {
    // Sort aiEnrichedData strictly by similarity to the article title
    const sortedPad = [...aiEnrichedData].sort((a, b) => {
      const simA = getSimilarity(a.title || "", article.title || "");
      const simB = getSimilarity(b.title || "", article.title || "");
      return simB - simA;
    });

    for (const source of sortedPad) {
      if (
        !displaySources.some((s) => s.url === source.url) &&
        !uniqueTopSources.some((t) => t.url === source.url)
      ) {
        displaySources.push(source);
      }
      if (displaySources.length >= 4) break;
    }
  }

  let dynamicDomain = null;
  if (article?.dynamicSourceUrl) {
    try {
      dynamicDomain = new URL(article?.dynamicSourceUrl).hostname.replace(
        /^www\./i,
        "",
      );
    } catch (e) { }
  }

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

    return `${localDate} at ${date.format("h:mm A")} ${moment().format("[UTC]Z")}`;
  };

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 flex justify-between">
        <Link href={"/news"} className="flex items-center gap-2 cursor-pointer">
          <ChevronLeft />
          <Image
            src="/main-logo.png"
            width={100}
            height={100}
            className="w-9 lg:w-[40px] transition-transform duration-700 "
            alt="NeuralPress"
          />
          <div className="flex flex-col">
            <span className="font-light font-inter">Back to News</span>
            {/* <span className="font-light font-inter text-xs text-muted-foreground">
              Main news page
            </span> */}
          </div>
        </Link>
      </div>

      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full bg-white fixed top-0 left-0 lg:pl-[320px] z-50 shadow-sm border-b border-slate-100"
          >
            <div className="max-w-5xl mx-auto py-4 ">
              <div className="flex items-center gap-5">
                <Link
                  href={"/news"}
                  className="flex items-center gap-1 hover:text-primary transition-colors duration-300"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="font-inter font-light hidden sm:block">
                    Back
                  </span>
                </Link>
                <div className="flex-1 overflow-hidden">
                  <motion.h3
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: 0.2,
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className={`text-base md:text-lg ${lang === "si" ? "font-sinhala" : "font-heading"} text-center truncate line-clamp-1`}
                  >
                    {lang === "si" ? article.sinhalaTitle : article.title}
                  </motion.h3>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <article className="max-w-5xl mx-auto px-4 py-8 bg-transparent">
        <header className="mb-8">
          <motion.h1
            ref={titleRef}
            animate={{
              opacity: showSticky ? 0 : 1,
              y: showSticky ? -20 : 0,
              filter: showSticky ? "blur(4px)" : "blur(0px)",
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`text-3xl md:text-5xl mb-6 ${lang === "si" ? "font-sinhala" : "font-heading"}`}
          >
            {displayedTitle}
            {animationStage === 0 && <span className="animate-pulse"></span>}
            {!showSticky && animationStage > 0 && "."}
          </motion.h1>

          <div
            className={`font-light mb-6 text-lg ${lang === "si" ? "font-sinhala" : "font-inter"}`}
          >
            {displayedSummary}
            {animationStage === 1 && <span className="animate-pulse"></span>}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: animationStage >= 2 ? 1 : 0,
              y: animationStage >= 2 ? 0 : 10,
            }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground font-inter font-light"
          >
            <div className="flex items-center gap-2">
              <span>Published</span>


              <time dateTime={article.pubDate || article.createdAt}>
                {formatPubDate(article.pubDate || article.createdAt)}
              </time>
            </div>

            {viewCount > 0 && (
              <div className="flex items-center gap-1.5 border-l border-slate-100 pl-4 text-slate-500">
                <Eye className="w-4 h-4" />
                <span>{formatViews(viewCount)}</span>
              </div>
            )}

            {/* Show Source Avatars and Panel mapping right in the header row just like the card */}
            <div className="flex items-center border-l border-slate-100 pl-4 h-5">
              <SourcesPanel
                title={article.title}
                url={article.url}
                originalSource={article.originalSource}
                structuredDataSearchResults={rawStructuredData}
                enrichedSources={aiEnrichedData}
                sourcesCount={uniqueTopSources.length}
                favicons={displaySources.slice(0, 3).map((s) => {
                  let d = s.engine || "News";
                  try {
                    d = new URL(s.url).hostname.replace(/^www\./i, "");
                  } catch (e) { }
                  return `https://www.google.com/s2/favicons?domain=${d}&sz=64`;
                })}
              />
            </div>

            {articleCategory.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {articleCategory.map((cat, idx) => (
                  <Link
                    href={`/news/${encodeURIComponent(cat.toLowerCase().replace(/ /g, "-"))}`}
                    key={idx}
                    className="px-4 py-1 border bg-white border-gray-100 dark:border-gray-800 rounded-full text-xs font-normal transition-all duration-300 hover:bg-gray-50 hover:text-black"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            )}
            {article._id && (
              <div className="flex items-center ml-auto">
                <span className="text-xs mr-2 text-muted-foreground font-inter font-light">
                  Report
                </span>
                <ReportButton id={article._id.toString()} />
              </div>
            )}
          </motion.div>
        </header>

        {/* {displayImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{
              opacity: animationStage >= 2 ? 1 : 0,
              scale: animationStage >= 2 ? 1 : 0.98,
            }}
            transition={{ duration: 0.7 }}
          >
            <figure className="mb-0 w-full relative rounded-xl overflow-hidden shadow-sm group">
              <img
                src={displayImage}
                alt={article.title}
                className="object-cover w-full group-hover:scale-105 transition-all duration-300"
              />
              {article?.dynamicSourceUrl && (
                <Link
                  href={article?.dynamicSourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 bg-black/70 hover:bg-black/90 backdrop-blur-md text-white border border-white/20 text-[11px] px-3 py-1.5 rounded-full transition-all flex items-center space-x-1.5 shadow-xl z-20 cursor-pointer"
                >
                  <span>Image Source : {dynamicDomain}</span>
                </Link>
              )}
            </figure>
            <div className="text-xs text-muted-foreground font-inter font-light mb-10 text-center pt-2">
              Sometime the image may not fit to the this news
            </div>
          </motion.div>
        )} */}

        {/* Premium AI Insights Notice */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{
            opacity: animationStage >= 2 ? 1 : 0,
            y: animationStage >= 2 ? 0 : 15,
          }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-blue-50/30 via-indigo-50/20 to-purple-50/30 dark:from-blue-950/10 dark:via-indigo-950/5 dark:to-purple-950/10 border border-indigo-100/30 dark:border-white/5 backdrop-blur-sm relative overflow-hidden group"
        >
          <div className="absolute -top-6 -right-6 p-4 opacity-[0.2] dark:opacity-[0.05] group-hover:scale-110 transition-transform duration-700">
            <Sparkles
              className="w-32 h-32 text-primary dark:text-indigo-600"
              strokeWidth={0.5}
            />
          </div>
          <div className="flex flex-col gap-3 relative z-10">
            <div className="flex items-center gap-2 text-primary dark:text-indigo-400">
              <div className="p-1.5 rounded-lg bg-indigo-100/50 dark:bg-indigo-900/30">
                <Sparkles className="w-4 h-4" strokeWidth={1} />
              </div>
              <span className="text-[12px] font-semibold tracking-wide uppercase font-inter">
                {lang === "si" ? "NeuralPress AI සත්‍යාපනය" : "NeuralPress AI Verified Insights"}
              </span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-[15px] leading-relaxed max-w-2xl font-inter font-light">
              {lang === "si" ? (
                <>
                  මෙම පුවතෙහි නිරවද්‍යතාවය සහ අදාළත්වය තහවුරු කිරීම සඳහා{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    NeuralPress's Multi-Agent Verifier
                  </span>{" "}
                  තාක්ෂණය මඟින් පරීක්ෂාවට ලක් කර ඇත. කිසිදු අසත්‍ය හෝ නොමඟ යවන සුළු තොරතුරක් ඇතුළත් නොවීම සහතික කරමින් මෙම තොරතුරු සත්‍යාපනය කර සපයා ඇත.
                </>
              ) : (
                <>
                  Vetted by{" "}
                  <span className="font-semibold text-slate-900 dark:text-white">
                    NeuralPress's Multi-Agent Verifier
                  </span>{" "}
                  for strict factual validity and event relevance. Our compliance engine cross-checks and filters search results to ensure zero false correlations or misleading content.
                </>
              )}
            </p>
            {lang === "si" && (
              <div className="mt-2 flex items-center gap-2.5 py-2.5 px-4 rounded-xl bg-amber-50/80 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-900/20 text-amber-800 dark:text-amber-400 shadow-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="text-[13px] font-sinhala font-medium leading-normal">
                  සමහර සිංහල අක්ෂර වැරදි විය හැක (Some Sinhala characters may be wrong)
                </span>
              </div>
            )}
          </div>
        </motion.div>

        <div
          ref={contentRef}
          className="prose prose-lg dark:prose-invert max-w-none"
        >
          {lang === "si" ? (
            <div className="text-lg">
              <Streamdown
                isAnimating={isStreaming}
                className="font-sinhala"
                components={{
                  h1: ({ children }) => <h1 className="">{children}</h1>,
                  h2: ({ children }) => (
                    <h2 className=" text-2xl">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className=" text-xl">{children}</h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className=" text-lg">{children}</h4>
                  ),
                  h5: ({ children }) => (
                    <h5 className=" text-md">{children}</h5>
                  ),
                  h6: ({ children }) => (
                    <h6 className=" text-sm">{children}</h6>
                  ),
                  a: ({ children, href }) => (
                    <Link
                      href={href || ""}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary flex gap-2 hover:underline"
                    >
                      {children}
                      <Link2 className="w-4 h-4" />
                    </Link>
                  ),
                }}
              >
                {displayedContent}
              </Streamdown>
            </div>
          ) : (
            <div className="font-light">
              <Streamdown
                isAnimating={isStreaming}
                className="font-inter"
                components={{
                  h1: ({ children }) => (
                    <h1 className="font-heading">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="font-heading text-2xl">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="font-heading text-xl">{children}</h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="font-heading text-lg">{children}</h4>
                  ),
                  h5: ({ children }) => (
                    <h5 className="font-heading text-md">{children}</h5>
                  ),
                  h6: ({ children }) => (
                    <h6 className="font-heading text-sm">{children}</h6>
                  ),
                  a: ({ children, href }) => (
                    <Link
                      href={href || ""}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary flex gap-2 hover:underline"
                    >
                      {children}
                      <Link2 className="w-4 h-4" />
                    </Link>
                  ),
                }}
              >
                {displayedContent}
              </Streamdown>
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: animationStage >= 3 ? 1 : 0,
            y: animationStage >= 3 ? 0 : 20,
          }}
          transition={{ duration: 0.5 }}
        >
          {article.chart && <DynamicNewsChart chartObj={article.chart} />}

          <div className="mt-16 pt-8 border-t border-slate-100">
            <h3 className="text-xl font-heading mb-6 text-slate-900 tracking-tight">
              Primary Sources
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {displaySources.map((source, i) => {
                let domain = source.engine || "News";
                try {
                  domain = new URL(source.url).hostname.replace(/^www\./i, "");
                } catch (e) { }

                return (
                  <div
                    key={i}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      window.open(source.url, "_blank");
                    }}
                    className="cursor-pointer group flex gap-4 p-4 rounded-2xl border border-primary/10 bg-primary-50/20 transition-all hover:border-primary hover:bg-primary-50/40 hover:shadow-sm"
                  >
                    <div className="w-8 h-8 overflow-hidden rounded-full bg-white border border-primary/10 flex items-center justify-center shrink-0">
                      <Image
                        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                        alt={domain}
                        className="w-full h-full object-contain"
                        width={30}
                        height={30}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-slate-900 text-[15px] leading-snug group-hover:text-primary-700 transition-colors mb-1 line-clamp-2">
                        {source.title || "Reference article"}
                      </h5>
                      <p className="text-xs text-muted-foreground truncate line-clamp-2 mb-1">
                        {source?.content}
                      </p>
                      <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3" />
                        <span className="text-[11px] font-medium text-slate-500 truncate">
                          {domain}
                        </span>
                        <ExternalLink className="w-3 h-3 text-slate-300 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* View All Sources button and Sheet handled directly via proxy */}
            {uniqueTopSources && uniqueTopSources.length > 0 && (
              <div className="flex justify-center mt-6 h-12 relative w-full pb-10 mb-10">
                {/* Force the sheet inside here */}
                <SourcesPanel
                  title={article.title}
                  url={article.url}
                  originalSource={article.originalSource}
                  structuredDataSearchResults={rawStructuredData}
                  enrichedSources={aiEnrichedData}
                  customTrigger={
                    <button className="py-2.5 px-6 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-750 text-white rounded-full font-medium text-sm transition-all duration-300 shadow-sm outline-none">
                      View All Sources
                    </button>
                  }
                />
              </div>
            )}

            {/* {article.slug && (
              <NewsComments slug={article.slug} />
            )} */}
          </div>
        </motion.div>
      </article>
    </>
  );
};

export default NewsArticleContent;
