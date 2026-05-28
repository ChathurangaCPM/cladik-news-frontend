"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/custom/news/ThemeToggle";
import {
  ArrowLeft,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Layers,
  CheckCircle,
  XCircle,
  EyeOff,
  Clock,
  ExternalLink,
  Shield,
  FileText
} from "lucide-react";

interface ProcessedNewsItem {
  id: string;
  title: string;
  sinhalaTitle?: string;
  slug: string;
  url: string;
  source: string;
  pubDate: string;
  categories: string[];
  ogImage?: string;
  dynamicOgImage?: string;
  status: string;
  importantForSriLanka: boolean;
  priority: string;
  createdAt: string;
}

export default function NewsManagerDashboard() {
  const [items, setItems] = useState<ProcessedNewsItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [blacklist, setBlacklist] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/news/settings")
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        if (data && Array.isArray(data.blacklistedOgDomains)) {
          setBlacklist(data.blacklistedOgDomains);
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

  // Trigger loading when search, filter, page or limit changes
  useEffect(() => {
    async function loadNewsList() {
      setLoading(true);
      try {
        const skip = (currentPage - 1) * pageSize;
        const queryParams = new URLSearchParams({
          limit: pageSize.toString(),
          skip: skip.toString(),
          status: statusFilter,
        });
        if (search.trim()) {
          queryParams.set("search", search.trim());
        }

        const res = await fetch(`/api/news/admin/list?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setItems(data.items || []);
          setTotal(data.total || 0);
        }
      } catch (err) {
        console.error("Failed to load news list:", err);
      } finally {
        setLoading(false);
      }
    }

    loadNewsList();
  }, [currentPage, pageSize, statusFilter, search]);

  const totalPages = Math.ceil(total / pageSize) || 1;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full w-fit">
            <CheckCircle className="w-3 h-3 shrink-0" />
            Active
          </span>
        );
      case "deactive":
        return (
          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full w-fit">
            <XCircle className="w-3 h-3 shrink-0" />
            Deactive
          </span>
        );
      case "hidden":
        return (
          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full w-fit">
            <EyeOff className="w-3 h-3 shrink-0" />
            Hidden
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 bg-neutral-500/10 border border-neutral-500/20 px-2.5 py-1 rounded-full w-fit">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#07090e] text-neutral-800 dark:text-neutral-100 font-inter pb-24 overflow-x-hidden transition-colors duration-300">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-sky-500/5 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/news" className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
              <ArrowLeft className="w-4 h-4" /> Back to News
            </Link>
            <div className="w-[1px] h-6 bg-neutral-200 dark:bg-white/10" />
            <Link href="/news" className="block">
              <Image src="/main-logo.png" width={40} height={40} className="w-8 h-8 object-contain" alt="Cladik" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-500 dark:from-white dark:via-neutral-200 dark:to-neutral-500 bg-clip-text text-transparent">
                News Manager
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">Moderate, Filter, and Curate Discovered News Articles</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1.5 bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-0.5 rounded-xl backdrop-blur-md">
            <Link
              href="/dashboard"
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              Process Discovery
            </Link>
            <Link
              href="/dashboard/news"
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition bg-white dark:bg-white/10 text-neutral-900 dark:text-white shadow-sm border border-neutral-200 dark:border-white/5"
            >
              News Manager
            </Link>
            <Link
              href="/dashboard/settings"
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              Settings
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={async () => {
                const { logoutAction } = await import("../login/actions");
                await logoutAction();
                window.location.href = "/news";
              }}
              className="flex items-center gap-1.5 text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 px-3 py-1.5 rounded-full cursor-pointer transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* FILTERS & SEARCH BAR */}
        <div className="bg-white/60 dark:bg-white/[0.01] border border-neutral-200/80 dark:border-white/[0.05] rounded-2xl p-4 mb-8 backdrop-blur-xl shadow-sm dark:shadow-none flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search news by title, slug, source..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-neutral-50 dark:bg-black/10 border border-neutral-200 dark:border-white/[0.04] focus:border-sky-500/50 dark:focus:border-sky-500/30 text-sm pl-10 pr-4 py-2 rounded-xl focus:outline-none transition"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 shrink-0">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-neutral-50 dark:bg-[#0c0f17] border border-neutral-200 dark:border-white/[0.04] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-sky-500/50 transition cursor-pointer text-neutral-700 dark:text-neutral-300"
              >
                <option value="all">All News</option>
                <option value="active">Active Only</option>
                <option value="deactive">Deactive Only</option>
                <option value="hidden">Hidden Only</option>
              </select>
            </div>

            {/* Page Size selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500 shrink-0">Show:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-neutral-50 dark:bg-[#0c0f17] border border-neutral-200 dark:border-white/[0.04] text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-sky-500/50 transition cursor-pointer text-neutral-700 dark:text-neutral-300"
              >
                <option value={10}>10 Items</option>
                <option value={20}>20 Items</option>
                <option value={50}>50 Items</option>
              </select>
            </div>
          </div>
        </div>

        {/* ARTICLES MANAGING TABLE */}
        <div className="bg-white/60 dark:bg-white/[0.01] border border-neutral-200/80 dark:border-white/[0.05] rounded-3xl overflow-hidden backdrop-blur-xl shadow-sm dark:shadow-none flex flex-col mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-white/[0.05] bg-neutral-50/50 dark:bg-white/[0.005]">
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-neutral-500 tracking-wider w-[100px]">Preview</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-neutral-500 tracking-wider">News Headline & Details</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-neutral-500 tracking-wider w-[120px]">Source</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-neutral-500 tracking-wider w-[130px]">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-neutral-500 tracking-wider w-[150px]">Date Ingested</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase text-neutral-500 tracking-wider text-right w-[120px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-24 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
                        <span className="text-sm text-neutral-500 font-light">Loading news items...</span>
                      </div>
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-24 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-neutral-500">
                        <FileText className="w-10 h-10 text-neutral-400 dark:text-neutral-600 mb-2" />
                        <h4 className="text-sm font-semibold">No News Articles Found</h4>
                        <p className="text-xs font-light">Try adjusting your filters or search keywords.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  items.map((item) => {
                    const isBlacklisted = isImageBlacklisted(item.ogImage || item.dynamicOgImage);
                    const previewImage = (!isBlacklisted && (item.ogImage || item.dynamicOgImage)) || "/main-logo.png";
                    const isImportant = item.importantForSriLanka;

                    return (
                      <tr
                        key={item.id}
                        className="border-b border-neutral-200 dark:border-white/[0.03] hover:bg-neutral-50/50 dark:hover:bg-white/[0.008] transition duration-200 group"
                      >
                        {/* Image Preview */}
                        <td className="px-6 py-4 align-middle">
                          <div className="relative w-16 h-12 rounded-lg overflow-hidden bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/[0.05]">
                            <img
                              src={previewImage}
                              alt=""
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/main-logo.png";
                              }}
                            />
                          </div>
                        </td>

                        {/* Title & metadata details */}
                        <td className="px-6 py-4 align-middle max-w-[450px]">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-sm font-semibold text-neutral-900 dark:text-white leading-snug line-clamp-2">
                                {item.title}
                              </h4>
                              {isImportant && (
                                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase shrink-0">
                                  Lanka Focus
                                </span>
                              )}
                            </div>
                            {item.sinhalaTitle && (
                              <h5 className="text-xs text-neutral-500 dark:text-neutral-400 leading-snug line-clamp-1 italic font-light">
                                {item.sinhalaTitle}
                              </h5>
                            )}
                            <div className="flex items-center gap-3 text-[10px] font-mono text-neutral-500 pt-1">
                              <span>ID: {item.id}</span>
                              <span>•</span>
                              <span className="capitalize">Priority: {item.priority || "medium"}</span>
                            </div>
                          </div>
                        </td>

                        {/* Source domain */}
                        <td className="px-6 py-4 align-middle">
                          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 font-mono">
                            {item.source}
                          </span>
                        </td>

                        {/* Glowing Status Badge */}
                        <td className="px-6 py-4 align-middle">
                          {getStatusBadge(item.status)}
                        </td>

                        {/* Created At */}
                        <td className="px-6 py-4 align-middle">
                          <div className="text-xs text-neutral-600 dark:text-neutral-400 flex flex-col gap-0.5">
                            <span className="font-medium font-mono">
                              {new Date(item.pubDate || item.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-light font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3 shrink-0" />
                              {new Date(item.pubDate || item.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 align-middle text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-neutral-500 hover:text-neutral-800 dark:hover:text-white bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 hover:border-neutral-300 dark:hover:border-white/20 rounded-xl transition"
                              title="Open original url"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <Link
                              href={`/dashboard/news/${item.id}`}
                              className="flex items-center gap-1 text-xs font-medium text-sky-600 dark:text-sky-400 bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20 px-3 py-2 rounded-xl transition"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                              Edit
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* TABLE FOOTER / PAGINATION */}
          {total > 0 && (
            <div className="border-t border-neutral-200 dark:border-white/[0.05] px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 bg-neutral-50/20 dark:bg-white/[0.002]">
              <span className="text-xs text-neutral-500 font-light">
                Showing <span className="font-semibold font-mono">{(currentPage - 1) * pageSize + 1}</span> to{" "}
                <span className="font-semibold font-mono">{Math.min(currentPage * pageSize, total)}</span> of{" "}
                <span className="font-semibold font-mono">{total}</span> total articles
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                  className="p-2 border border-neutral-200 dark:border-white/[0.05] rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition text-neutral-600 dark:text-neutral-400 shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Draw compact page numbers */}
                {(() => {
                  const pages = [];
                  const range = 2; // display currentPage - range to currentPage + range
                  for (let i = 1; i <= totalPages; i++) {
                    if (
                      i === 1 ||
                      i === totalPages ||
                      (i >= currentPage - range && i <= currentPage + range)
                    ) {
                      pages.push(i);
                    } else if (
                      pages[pages.length - 1] !== "..." &&
                      (i < currentPage - range || i > currentPage + range)
                    ) {
                      pages.push("...");
                    }
                  }

                  return pages.map((p, idx) => {
                    if (p === "...") {
                      return (
                        <span key={`dots-${idx}`} className="px-2 text-xs text-neutral-500 font-mono">
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={`page-${p}`}
                        onClick={() => handlePageChange(p as number)}
                        disabled={loading}
                        className={`w-9 h-9 rounded-xl border text-xs font-mono font-medium transition ${
                          currentPage === p
                            ? "bg-sky-500 border-sky-500 text-white shadow-sm"
                            : "border-neutral-200 dark:border-white/[0.05] text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-white/5"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  });
                })()}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                  className="p-2 border border-neutral-200 dark:border-white/[0.05] rounded-xl hover:bg-neutral-100 dark:hover:bg-white/5 disabled:opacity-40 disabled:hover:bg-transparent transition text-neutral-600 dark:text-neutral-400 shrink-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
