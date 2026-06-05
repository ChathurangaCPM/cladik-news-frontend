"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Streamdown } from "streamdown";
import {
  Sparkles,
  Calendar,
  Hash,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Lock,
  Globe,
  ExternalLink,
  Link2,
} from "lucide-react";
import moment from "moment";

interface Reference {
  title?: string;
  url?: string;
  content?: string;
  engine?: string;
}

interface Article {
  id?: string;
  title: string;
  source?: string;
  categories?: string[];
  publishDate?: string;
  keywords?: string[];
  imageUrl?: string;
  content?: string;
  summary?: string;
  sinhalaTitle?: string;
  sinhalaSummary?: string;
  references?: {
    primary?: Reference[];
    others?: Reference[];
  };
}

interface StreamVisualizerProps {
  response: {
    payload?: Article[];
  } | null;
  activePlan: string;
}

export default function StreamVisualizer({
  response,
  activePlan,
}: StreamVisualizerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (
    !response?.payload ||
    !Array.isArray(response.payload) ||
    response.payload.length === 0
  ) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="col-span-full space-y-6 pt-8 border-t border-slate-200"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-655 animate-pulse" />
            <h3 className="text-lg text-slate-805 tracking-tight">
              Ingested News Stream Payload
            </h3>
            {/* <span className="text-[10px] uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-105 px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live Ingested
            </span> */}
          </div>
          <p className="text-xs text-slate-500 leading-relaxed font-light">
            Visual representation of the sandbox JSON response payloads.
            Enforces the pipeline filters configured for your active{" "}
            <span className="font-semibold text-indigo-600 uppercase ">
              {activePlan}
            </span>{" "}
            tier.
          </p>
        </div>

        <div className="text-xs text-slate-400 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-xl self-start sm:self-auto">
          Total Stream Nodes:{" "}
          <span className="font-bold text-slate-700">
            {response.payload.length}
          </span>
        </div>
      </div>

      {/* List of Ingested Articles */}
      <div className="space-y-8">
        {response.payload.map((article, index) => (
          <StreamNodeCard
            key={article.id || index}
            article={article}
            index={index}
            activePlan={activePlan}
            mounted={mounted}
          />
        ))}
      </div>
    </motion.div>
  );
}

interface StreamNodeCardProps {
  article: Article;
  index: number;
  activePlan: string;
  mounted: boolean;
}

function StreamNodeCard({
  article,
  index,
  activePlan,
  mounted,
}: StreamNodeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cleanContent = article.content || "";
  const shouldTruncate = cleanContent.length > 300;
  const displayContent = isExpanded ? cleanContent : cleanContent.slice(0, 300);

  const isSummaryLocked =
    typeof article.summary === "string" && article.summary.includes("LOCKED");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 relative overflow-hidden group text-left"
    >
      {/* Article Index & Header Badge */}
      <div className="absolute top-0 right-0 bg-indigo-550/10 border-l border-b border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-bl-2xl text-[10px] uppercase">
        Node #{String(index + 1).padStart(2, "0")}
      </div>

      <div className="space-y-6">
        {/* Top Row: Meta Tags & Time */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-medium">
          <span className="bg-indigo-550/10 text-slate-900  px-2.5 py-1 rounded-xl text-xs flex items-center gap-1 border border-indigo-500/10">
            {article.source || "NeuralPress"}
          </span>

          {/* Display Categories */}
          {Array.isArray(article.categories) &&
            article.categories.map((cat) => (
              <span
                key={cat}
                className="bg-slate-50 border border-slate-200 text-slate-655 px-2.5 py-1 rounded-xl text-xs uppercase"
              >
                {cat}
              </span>
            ))}

          {mounted && article.publishDate && (
            <span className="flex items-center gap-1 text-[11.5px] text-slate-400 font-light ml-auto">
              <Calendar className="w-3.5 h-3.5" />
              {moment(article.publishDate).fromNow()} |{" "}
              {new Date(article.publishDate).toLocaleString(undefined, {
                timeZoneName: "short",
                hour12: true,
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>

        {/* Main Title Row */}
        <div className="pr-16">
          <h4 className="text-xl md:text-2xl text-slate-805 tracking-tight leading-snug group-hover:text-indigo-650 transition-colors duration-250">
            {article.title}
          </h4>

          {/* Keywords hashtags */}
          {Array.isArray(article.keywords) && article.keywords.length > 0 && (
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              <span className="text-[10px]  text-slate-400  uppercase flex items-center gap-0.5">
                <Hash className="w-3 h-3" /> Top Keywords:
              </span>
              {article.keywords.map((kw) => (
                <span
                  key={kw}
                  className="text-xs text-indigo-650 bg-indigo-50/50 hover:bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100 transition cursor-pointer"
                >
                  #{kw}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Ingested Content Column Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Body Content */}
          <div
            className={`space-y-3 ${article.imageUrl ? "lg:col-span-8" : "lg:col-span-12"}`}
          >
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <BookOpen className="w-4 h-4 text-slate-500" />
              <h5 className="text-slate-800 text-xs  uppercase tracking-wide">
                Ingested Stream Content (English)
              </h5>
            </div>

            <div className="relative">
              <div
                style={
                  !isExpanded && shouldTruncate
                    ? {
                        WebkitMaskImage:
                          "linear-gradient(to bottom, black 60%, transparent 100%)",
                        maskImage:
                          "linear-gradient(to bottom, black 60%, transparent 100%)",
                      }
                    : undefined
                }
                className="text-slate-655 text-sm font-light leading-relaxed select-text pr-2 prose prose-sm max-w-none dark:prose-invert"
              >
                <Streamdown
                  isAnimating={false}
                  className="font-sans"
                  // components={{
                  //   a: ({ children, href }) => (
                  //     <Link
                  //       href={href || ""}
                  //       target="_blank"
                  //       rel="noopener noreferrer"
                  //       className="text-indigo-650 hover:underline inline-flex items-center gap-0.5"
                  //     >
                  //       {children} <ExternalLink className="w-3 h-3 inline" />
                  //     </Link>
                  //   ),
                  // }}

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
                    ul: ({ children }) => (
                      <ul className="ml-5 list-disc list-outside">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="ml-5 list-decimal list-outside">
                        {children}
                      </ol>
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
                  {displayContent}
                </Streamdown>
              </div>

              {shouldTruncate && (
                <button
                  id={`btn-expand-${article.id || index}`}
                  onClick={() => setIsExpanded((prev) => !prev)}
                  className="mt-3 inline-flex items-center gap-1 text-xs text-indigo-655 hover:text-indigo-750 transition cursor-pointer"
                >
                  {isExpanded ? (
                    <>
                      Show Less <ChevronUp className="w-3.5 h-3.5" />
                    </>
                  ) : (
                    <>
                      Read Full Content <ChevronDown className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Image Preview */}
          {article.imageUrl && (
            <div className="lg:col-span-4 rounded-2xl border border-slate-200 overflow-hidden relative shadow-sm aspect-video md:aspect-square bg-slate-50 flex items-center justify-center shrink-0">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="object-cover w-full h-full group-hover:scale-105 transition duration-500 ease-out"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* AI-Enriched Summaries Section */}
        <div className="bg-indigo-950/[0.02] border border-indigo-950/[0.06] rounded-2.5xl p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-indigo-950/[0.06] pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-indigo-650" />
              <h5 className="text-slate-800 text-xs  uppercase tracking-wide">
                NLP AI Translation & Synthetics
              </h5>
            </div>
            <span className="text-[9px]  uppercase bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded ">
              L3 Model Engine
            </span>
          </div>

          {isSummaryLocked ? (
            /* Paywalled Glassmorphism Mask Overlay */
            <div className="relative rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center overflow-hidden min-h-[220px]">
              {/* Blurred placeholder text backing */}
              <div className="select-none pointer-events-none filter blur-sm opacity-25 space-y-3 text-left">
                <h6 className="font-bold text-sm text-slate-800">
                  Mock article synthesis
                </h6>
                <p className="text-xs text-slate-600 leading-relaxed">
                  This news node undergoes automated pipeline enrichment using
                  NeuralPress LLM models, delivering real-time translation
                  vectors and multi-sentence structural outlines. Ingestion
                  indices automatically partition context arrays to form
                  detailed summaries.
                </p>
              </div>

              {/* Center lock details */}
              <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 space-y-3 z-10">
                <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 shadow-sm animate-pulse">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="space-y-1 max-w-md">
                  <h6 className="text-xs text-slate-800 tracking-tight">
                    Synthesized NLP Outlines Locked
                  </h6>
                  <p className="text-[10px] text-slate-500 leading-normal max-w-sm mx-auto font-light">
                    Sinhala translation streams, multi-paragraph conceptual
                    synopses, and social overlays require standard commercial
                    licensing.
                  </p>
                </div>
                <Link
                  id={`lnk-unlock-${article.id || index}`}
                  href="/developer/billing"
                  className="px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl text-[10px] uppercase  shadow-sm transition hover:scale-[1.02] cursor-pointer"
                >
                  Upgrade Subscription Plan
                </Link>
              </div>
            </div>
          ) : (
            /* Unlocked Premium side-by-side translation layout */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* English Summary */}
              <div className="space-y-2">
                <span className="text-[10px]  text-slate-400  uppercase block">
                  Synthesized Summary
                </span>
                <div className="text-slate-655 text-sm leading-relaxed select-text bg-white border border-slate-100 rounded-xl p-4 shadow-sm prose prose-sm max-w-none dark:prose-invert">
                  <Streamdown isAnimating={false} className="font-sans">
                    {article.summary}
                  </Streamdown>
                </div>
              </div>

              {/* Sinhala Translation block */}
              <div className="space-y-2">
                <span className="text-[10px]  text-slate-400  uppercase block flex items-center gap-1">
                  Sinhala Translation Stream{" "}
                  <Globe className="w-3.5 h-3.5 text-indigo-500" />
                </span>
                <div className="bg-slate-50 border border-slate-150 rounded-xl p-4 shadow-sm space-y-2 select-text prose prose-sm max-w-none dark:prose-invert">
                  <h6 className="text-sm text-slate-800 leading-snug font-sinhala">
                    <Streamdown isAnimating={false} className="font-sinhala">
                      {article.sinhalaTitle}
                    </Streamdown>
                  </h6>
                  <div className="text-slate-655 text-xs font-light leading-relaxed font-sinhala">
                    <Streamdown isAnimating={false} className="font-sinhala">
                      {article.sinhalaSummary}
                    </Streamdown>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* References Tracker / Coverage Network */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            <h5 className="text-slate-800 text-xs  uppercase tracking-wide">
              Comparative Reference Coverage Map
            </h5>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Primary Coverage Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px]  text-indigo-650  uppercase block">
                  Primary Coverage Network
                </span>
                <span className="text-[9px]  bg-indigo-50 text-indigo-600 border border-indigo-150 px-2 py-0.5 rounded">
                  {article.references?.primary?.length || 0} Links
                </span>
              </div>

              <div className="space-y-3">
                {article.references?.primary &&
                article.references.primary.length > 0 ? (
                  article.references.primary.map((ref, refIdx) => (
                    <div
                      key={refIdx}
                      className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 space-y-1.5 shadow-sm hover:border-slate-300 transition-colors text-left"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[8.5px]  bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-wide">
                          {ref.engine || "NeuralPress Search"}
                        </span>
                        {ref.url && (
                          <a
                            id={`lnk-ref-primary-${index}-${refIdx}`}
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-indigo-600 transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <h6 className="text-[12.5px] text-slate-800 leading-snug line-clamp-2">
                        {ref.title || "No Title"}
                      </h6>
                      {ref.content && (
                        <div className="text-slate-500 text-[11px] font-light leading-relaxed line-clamp-3 prose prose-xs max-w-none dark:prose-invert">
                          <Streamdown isAnimating={false} className="font-sans">
                            {ref.content}
                          </Streamdown>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-50/50 border border-slate-150 rounded-xl p-6 text-center text-slate-400 font-light text-xs">
                    No primary coverage nodes linked in this matrix.
                  </div>
                )}
              </div>
            </div>

            {/* 2. Related/Other Coverage Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px]  text-emerald-655  uppercase block">
                  Related Enriched Environs
                </span>
                <span className="text-[9px]  bg-emerald-50 text-emerald-600 border border-emerald-150 px-2 py-0.5 rounded">
                  {article.references?.others?.length || 0} Links
                </span>
              </div>

              <div className="space-y-3">
                {article.references?.others &&
                article.references.others.length > 0 ? (
                  article.references.others.map((ref, refIdx) => (
                    <div
                      key={refIdx}
                      className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 space-y-1.5 shadow-sm hover:border-slate-300 transition-colors text-left"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[8.5px]  bg-white border border-slate-200 text-slate-500 px-1.5 py-0.5 rounded uppercase tracking-wide">
                          {ref.engine || "NeuralPress Search"}
                        </span>
                        {ref.url && (
                          <a
                            id={`lnk-ref-other-${index}-${refIdx}`}
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-emerald-650 transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                      <h6 className="text-[12.5px] text-slate-800 leading-snug line-clamp-2">
                        {ref.title || "No Title"}
                      </h6>
                      {ref.content && (
                        <div className="text-slate-500 text-[11px] font-light leading-relaxed line-clamp-3 prose prose-xs max-w-none dark:prose-invert">
                          <Streamdown isAnimating={false} className="font-sans">
                            {ref.content}
                          </Streamdown>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="bg-slate-50/50 border border-slate-150 rounded-xl p-6 text-center text-slate-400 font-light text-xs">
                    No secondary enrichment layers associated.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
