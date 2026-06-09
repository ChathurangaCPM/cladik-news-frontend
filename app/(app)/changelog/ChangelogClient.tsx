"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  GitBranch,
  Sparkles,
  Wrench,
  CheckCircle,
  ChevronRight,
  TrendingUp,
  Tag,
  Clock,
  ArrowLeft,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Fully dynamic Changelog data structure
export interface ChangeItem {
  type: "feature" | "improvement" | "fix";
  text: string;
}

export interface Release {
  version: string;
  date: string;
  title: string;
  tagline: string;
  type: "major" | "minor" | "patch";
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  changes: ChangeItem[];
}

const RELEASES: Release[] = [
  {
    version: "v1.3.0",
    date: "May 28, 2026",
    title: "Embla Visual Carousels & Dynamic Citations",
    tagline: "Unveiling visually immersive category cover decks, shadcn UI Embla carousel streams, dynamic web reference inline citations, and comprehensive dark mode styling.",
    type: "minor",
    author: {
      name: "Alex Vance",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80",
      role: "Lead Frontend Engineer",
    },
    changes: [
      { type: "feature", text: "Integrated shadcn UI Embla Carousel (momentum-driven swipe navigation) across 20 distinct news categories." },
      { type: "feature", text: "Added dynamic cover backgrounds for each category featuring curated, high-contrast Unsplash landscape imagery." },
      { type: "feature", text: "Injected AI-Elements InlineCitation badge trigger (e.g. nytimes.com +3) with custom hover-card carousel reference lookups." },
      { type: "improvement", text: "Optimized Next.js generateMetadata dynamic routing parameters for dynamic Category and Keyword search pages, generating rich OpenGraph cards." },
      { type: "improvement", text: "Added high-fidelity light & dark theme styling for dynamic Recharts news feeds, charts, and detail views." },
      { type: "improvement", text: "Migrated custom drawer sidebars to official @/components/ui/drawer responsive overlays." },
      { type: "fix", text: "Resolved Next.js Turbopack hydration failures and string-to-span tooltip forwarding ref compilation issues." }
    ]
  },
  {
    version: "v1.2.0",
    date: "April 9, 2026",
    title: "FastAPI Adaptive Crawler & Token Purging",
    tagline: "Upgraded ingestion pipeline with FastAPI gateways, Crawl4AI adaptive scraping strategies, and LLM token-optimized markdown extraction.",
    type: "minor",
    author: {
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80",
      role: "Platform Architect",
    },
    changes: [
      { type: "feature", text: "Migrated ingestion crawlers from Flask to high-concurrency async FastAPI endpoints." },
      { type: "feature", text: "Implemented 'Content-Only' markdown filters aggressively stripping out headers, track scripts, advertisements, and images." },
      { type: "improvement", text: "Configured Crawl4AI v0.7+ adaptive crawling algorithms to bypass rate-limits and optimize crawler footprints." },
      { type: "improvement", text: "Dramatically reduced LLM context window ingestion cost by purging duplicate token boundaries." },
      { type: "fix", text: "Fixed Playwright execution failures and sandboxed browser binary resolution under MacOS/Linux runtimes." }
    ]
  },
  {
    version: "v1.1.0",
    date: "March 5, 2026",
    title: "SVG Insights & Wellness Graphs",
    tagline: "Revising data dashboards with high-performance responsive SVGs and polar area segment visualizations.",
    type: "minor",
    author: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80",
      role: "Data Visualization Specialist",
    },
    changes: [
      { type: "feature", text: "Created dynamic SVG Polar Area charts mapping data categories beautifully with custom curvatures." },
      { type: "improvement", text: "Added interactive segments with smooth state highlights and color gradients." },
      { type: "improvement", text: "Optimized mobile layout displaying discrete recommendation decks dynamically matching polar scores." },
      { type: "fix", text: "Resolved label text overlapping issue by calculating coordinates dynamically using trigonometric angle functions." }
    ]
  },
  {
    version: "v1.0.0",
    date: "February 4, 2026",
    title: "Production Release & SSE Ingestion",
    tagline: "The official debut of the NeuralPress AI News Aggregator! Incorporates distributed NestJS services, TypeORM relations, and live streaming SSE pipelines.",
    type: "major",
    author: {
      name: "Marcus Vance",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80",
      role: "Platform Architect",
    },
    changes: [
      { type: "feature", text: "Provisioned NestJS ingestion engine with comprehensive scheduler loops." },
      { type: "feature", text: "Implemented real-time Server-Sent Events (SSE) `/news/stream` channel forwarding updates to TanStack UI instantly." },
      { type: "feature", text: "Added full TypeORM database orchestration with Cloud PostgreSQL connection pooling." },
      { type: "improvement", text: "Injected fuzzy title lookup indexes using Fuse.js for related news groupings." },
      { type: "improvement", text: "Created responsive dashboard displaying crawler latency charts and active scrapers status." }
    ]
  }
];

export default function ChangelogClient() {
  const [filter, setFilter] = useState<"all" | "feature" | "improvement" | "fix">("all");
  const [search, setSearch] = useState("");

  // Statistics calculation for polished dashboard experience
  const stats = useMemo(() => {
    let featuresCount = 0;
    let improvementsCount = 0;
    let fixesCount = 0;
    RELEASES.forEach((r) => {
      r.changes.forEach((c) => {
        if (c.type === "feature") featuresCount++;
        if (c.type === "improvement") improvementsCount++;
        if (c.type === "fix") fixesCount++;
      });
    });
    return {
      releases: RELEASES.length,
      features: featuresCount,
      improvements: improvementsCount,
      fixes: fixesCount,
    };
  }, []);

  // Filtering releases by query and change types
  const filteredReleases = useMemo(() => {
    return RELEASES.map((release) => {
      const filteredChanges = release.changes.filter((change) => {
        const matchesFilter = filter === "all" || change.type === filter;
        const matchesSearch =
          search === "" ||
          change.text.toLowerCase().includes(search.toLowerCase()) ||
          release.title.toLowerCase().includes(search.toLowerCase()) ||
          release.version.toLowerCase().includes(search.toLowerCase());
        return matchesFilter && matchesSearch;
      });

      return {
        ...release,
        changes: filteredChanges,
      };
    }).filter((r) => r.changes.length > 0 || search === "");
  }, [filter, search]);

  return (
    <main className="min-h-screen bg-slate-50/40 dark:bg-[#07090e] pb-24 transition-colors duration-300 font-inter">
      {/* Decorative Blur Background Meshes */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 z-0" />
      <div className="absolute top-[30vh] right-1/4 w-[400px] h-[400px] bg-purple-500/10 dark:bg-purple-500/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Elegant Header Capsule Navbar */}
      <header className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 z-30">
        <div className="flex items-center justify-between p-4 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-zinc-800/80 shadow-[0_2px_15px_rgb(0,0,0,0.02)]">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group">
              <Image
                src="/main-logo.png"
                width={32}
                height={32}
                className="w-8 h-8 group-hover:rotate-12 transition-transform duration-500"
                alt="NeuralPress Logo"
              />
              <span className="text-sm font-semibold tracking-tighter text-slate-900 dark:text-zinc-50 font-heading">
                Neural<span className="text-indigo-500">Press</span>
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-zinc-400">
              <Link href="/news" className="hover:text-indigo-500 transition-colors">Aggregator</Link>
              <Link href="/dashboard" className="hover:text-indigo-500 transition-colors">Dashboard</Link>
              <span className="text-indigo-500 dark:text-indigo-400">Changelog</span>
            </nav>
          </div>
          <Link
            href="/news"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 dark:bg-zinc-50 hover:bg-slate-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 text-xs font-semibold shadow-sm transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to News
          </Link>
        </div>
      </header>

      {/* Main Page Layout */}
      <div className="relative w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 z-10">
        {/* Title Block */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-400/20 text-[10px] font-semibold tracking-wider text-indigo-500 dark:text-indigo-400 uppercase font-geist-mono">
            🔄 System Evolution
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-heading tracking-tight text-slate-900 dark:text-zinc-50 leading-[1.1]">
            Changelog & <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Releases</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-zinc-400 font-light max-w-xl mx-auto">
            Stay up to date with the latest architectural expansions, feature rollouts, and optimizations implemented on the NeuralPress engine.
          </p>
        </div>

        {/* Polished Metrics Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Total Releases", value: stats.releases, icon: GitBranch, color: "text-indigo-500 bg-indigo-500/10" },
            { label: "Features", value: stats.features, icon: Sparkles, color: "text-emerald-500 bg-emerald-500/10" },
            { label: "Improvements", value: stats.improvements, icon: TrendingUp, color: "text-blue-500 bg-blue-500/10" },
            { label: "System Fixes", value: stats.fixes, icon: Wrench, color: "text-rose-500 bg-rose-500/10" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white/60 dark:bg-zinc-950/40 backdrop-blur-md border border-slate-200/50 dark:border-zinc-800/80 shadow-sm flex items-center gap-4"
            >
              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", item.color)}>
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold font-geist-mono">{item.label}</p>
                <p className="text-2xl font-black text-slate-900 dark:text-zinc-50 leading-none mt-1">{item.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters and Search Bar Container */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-16 p-4 bg-white/40 dark:bg-zinc-950/20 backdrop-blur-sm rounded-2xl border border-slate-200/40 dark:border-zinc-800/40">
          {/* Pills Selector */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: "All Changes", icon: GitBranch, activeColor: "bg-indigo-500 text-white border-indigo-500" },
              { id: "feature", label: "Features", icon: Sparkles, activeColor: "bg-emerald-500 text-white border-emerald-500" },
              { id: "improvement", label: "Improvements", icon: TrendingUp, activeColor: "bg-blue-500 text-white border-blue-500" },
              { id: "fix", label: "System Fixes", icon: Wrench, activeColor: "bg-rose-500 text-white border-rose-500" },
            ].map((pill) => {
              const isActive = filter === pill.id;
              return (
                <button
                  key={pill.id}
                  onClick={() => setFilter(pill.id as any)}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold tracking-tight border transition-all duration-300 cursor-pointer",
                    isActive
                      ? pill.activeColor
                      : "bg-white dark:bg-zinc-950 text-slate-600 dark:text-zinc-400 border-slate-200 dark:border-zinc-850 hover:bg-slate-50 dark:hover:bg-zinc-900"
                  )}
                >
                  <pill.icon className="w-3.5 h-3.5" />
                  {pill.label}
                </button>
              );
            })}
          </div>

          {/* Search Inputs */}
          <div className="relative max-w-sm w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search changelog reports..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-850 outline-none text-xs text-slate-800 dark:text-zinc-100 placeholder-slate-400 focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Releases Vertical Interactive Timeline */}
        <div className="relative pl-6 md:pl-10 border-l border-slate-200 dark:border-zinc-850 space-y-16">
          {filteredReleases.map((release, rIdx) => (
            <article key={release.version} className="relative group">
              {/* Timeline indicator node */}
              <div className="absolute -left-[35px] md:-left-[51px] top-1.5 w-7 h-7 rounded-full bg-slate-50 dark:bg-[#07090e] border border-slate-200 dark:border-zinc-850 flex items-center justify-center transition-all group-hover:border-indigo-500 dark:group-hover:border-indigo-400 shadow-sm z-10">
                <div className={cn(
                  "w-2.5 h-2.5 rounded-full transition-transform duration-500 group-hover:scale-125 animate-pulse",
                  release.type === "major" ? "bg-gradient-to-r from-pink-500 to-indigo-500" : "bg-slate-400 dark:bg-zinc-700"
                )} />
              </div>

              {/* Version & Date floats (Absolute desktop block) */}
              <div className="absolute right-full mr-8 top-1.5 hidden md:block text-right w-44">
                <span className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-tight font-geist-mono border",
                  release.type === "major"
                    ? "bg-indigo-500/10 border-indigo-400/20 text-indigo-500 dark:text-indigo-400"
                    : "bg-slate-100 dark:bg-zinc-900 border-slate-200/50 dark:border-zinc-800/80 text-slate-700 dark:text-zinc-300"
                )}>
                  {release.version}
                </span>
                <p className="text-[10px] text-muted-foreground uppercase font-semibold font-geist-mono mt-2 tracking-wider flex items-center justify-end gap-1.5">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  {release.date}
                </p>
              </div>

              {/* Dynamic Changelog Release Card */}
              <div className="p-6 sm:p-8 rounded-[2rem] bg-white/70 dark:bg-zinc-950/45 backdrop-blur-md border border-slate-200/50 dark:border-zinc-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)] transition-all duration-300">
                {/* Mobile top meta header */}
                <div className="flex md:hidden items-center justify-between mb-4 border-b border-slate-100 dark:border-zinc-900 pb-3">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-black tracking-tight bg-indigo-500/10 border border-indigo-400/20 text-indigo-500 font-geist-mono">
                    {release.version}
                  </span>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold tracking-wider font-geist-mono flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {release.date}
                  </span>
                </div>

                {/* Release Main Meta */}
                <div className="mb-6 space-y-2">
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-50 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                    {release.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-light text-slate-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
                    {release.tagline}
                  </p>
                </div>

                {/* Changes List */}
                <div className="space-y-4 border-t border-slate-100 dark:border-zinc-900/60 pt-6">
                  {release.changes.map((change, cIdx) => (
                    <div key={cIdx} className="flex items-start gap-3 text-xs leading-relaxed">
                      {/* Pill Badge */}
                      <span className={cn(
                        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider font-geist-mono shrink-0 select-none border mt-0.5",
                        change.type === "feature" && "bg-emerald-500/10 border-emerald-450/20 text-emerald-600 dark:text-emerald-450",
                        change.type === "improvement" && "bg-blue-500/10 border-blue-450/20 text-blue-600 dark:text-blue-450",
                        change.type === "fix" && "bg-rose-500/10 border-rose-450/20 text-rose-600 dark:text-rose-450"
                      )}>
                        {change.type === "feature" && "Feature"}
                        {change.type === "improvement" && "Improvement"}
                        {change.type === "fix" && "Fix"}
                      </span>
                      {/* Bullet Text */}
                      <span className="text-slate-700 dark:text-zinc-300 font-light mt-0.5">
                        {change.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Author Block */}
                <div className="mt-8 border-t border-slate-100 dark:border-zinc-900/60 pt-6 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={release.author.avatar}
                      alt={release.author.name}
                      className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-zinc-800"
                    />
                    <div>
                      <h5 className="text-[11px] font-semibold text-slate-800 dark:text-zinc-300 leading-tight">{release.author.name}</h5>
                      <p className="text-[9px] text-muted-foreground font-light font-geist-mono">{release.author.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-geist-mono hidden sm:flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Verified deployment
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty Search Fallback */}
        {filteredReleases.length === 0 && (
          <div className="text-center py-16 bg-white/40 dark:bg-zinc-950/20 border border-slate-200/40 dark:border-zinc-800/40 rounded-3xl p-8 max-w-md mx-auto">
            <GitBranch className="w-12 h-12 text-slate-350 dark:text-zinc-650 mx-auto mb-4" />
            <h4 className="text-base font-bold text-slate-800 dark:text-zinc-200">No evolutions found</h4>
            <p className="text-xs text-muted-foreground font-light mt-1">
              We couldn't find any release reports matching "{search}". Try searching for categories like "carousel", "adaptive", or "wellness".
            </p>
          </div>
        )}
      </div>

      {/* Dynamic System Footer */}
      <footer className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-24 border-t border-slate-200/40 dark:border-zinc-850/60 pt-8 text-center text-[10px] text-muted-foreground">
        <p>© 2026 NeuralPress AI News Aggregator Ingestion Systems. All rights reserved.</p>
      </footer>
    </main>
  );
}
