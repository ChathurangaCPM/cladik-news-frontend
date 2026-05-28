"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/custom/news/ThemeToggle";
import {
  ArrowLeft,
  Save,
  X,
  FileText,
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  EyeOff,
  Link as LinkIcon,
  Image as ImageIcon,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Check,
  RefreshCw
} from "lucide-react";

interface ProcessedNewsItem {
  id: string;
  title: string;
  sinhalaTitle?: string;
  slug: string;
  url: string;
  summary: string;
  sinhalaSummary?: string;
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

export default function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [item, setItem] = useState<ProcessedNewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  interface SearchResultItem {
    title: string;
    url: string;
    content: string;
    ogImage?: string | null;
    loadingImage?: boolean;
  }

  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);

  // Form states
  const [title, setTitle] = useState("");
  const [sinhalaTitle, setSinhalaTitle] = useState("");
  const [url, setUrl] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [summary, setSummary] = useState("");
  const [sinhalaSummary, setSinhalaSummary] = useState("");
  const [status, setStatus] = useState("active");
  const [importantForSriLanka, setImportantForSriLanka] = useState(false);
  const [priority, setPriority] = useState("medium");
  const [dynamicOgImage, setDynamicOgImage] = useState("");
  const [dynamicSourceUrl, setDynamicSourceUrl] = useState("");

  const fetchOGImage = async (searchUrl: string, index: number) => {
    try {
      const res = await fetch(`/api/news/admin/scrape-image?url=${encodeURIComponent(searchUrl)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(prev => {
          const updated = [...prev];
          if (updated[index]) {
            updated[index] = {
              ...updated[index],
              ogImage: data.ogImage,
              loadingImage: false
            };
          }
          return updated;
        });
      } else {
        setSearchResults(prev => {
          const updated = [...prev];
          if (updated[index]) {
            updated[index] = { ...updated[index], ogImage: null, loadingImage: false };
          }
          return updated;
        });
      }
    } catch (e) {
      console.error("Failed to fetch OG image for search reference:", e);
      setSearchResults(prev => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index] = { ...updated[index], ogImage: null, loadingImage: false };
        }
        return updated;
      });
    }
  };

  // Load initial single news details
  useEffect(() => {
    async function loadNewsDetails() {
      setLoading(true);
      try {
        const res = await fetch(`/api/news/admin/${id}`);
        if (res.ok) {
          const data = await res.json();
          setItem(data);

          // Hydrate forms
          setTitle(data.title || "");
          setSinhalaTitle(data.sinhalaTitle || "");
          setUrl(data.url || "");
          setOgImage(data.dynamicOgImage || "");
          setSummary(data.summary || "");
          setSinhalaSummary(data.sinhalaSummary || "");
          setStatus(data.status || "active");
          setImportantForSriLanka(data.importantForSriLanka || false);
          setPriority(data.priority || "medium");
          setDynamicOgImage(data.dynamicOgImage || "");
          setDynamicSourceUrl(data.dynamicSourceUrl || "");

          // Parse search results from aiEnrichedContent
          let parsedSearch: SearchResultItem[] = [];
          try {
            if (data.aiEnrichedContent) {
              const rawData = JSON.parse(data.aiEnrichedContent);
              if (Array.isArray(rawData)) {
                parsedSearch = rawData.map(r => ({
                  title: r.title || "",
                  url: r.url || "",
                  content: r.content || "",
                  ogImage: undefined,
                  loadingImage: true
                }));
              }
            }
          } catch (e) {
            console.error("Failed to parse search results:", e);
          }
          setSearchResults(parsedSearch);

          // Scrape images in background
          parsedSearch.forEach((item, index) => {
            if (item.url) {
              fetchOGImage(item.url, index);
            }
          });
        } else {
          setErrorMsg("Could not fetch article details from server.");
        }
      } catch (err) {
        console.error("Load news edit error:", err);
        setErrorMsg("Network error trying to fetch article details.");
      } finally {
        setLoading(false);
      }
    }

    loadNewsDetails();
  }, [id]);

  // Handle Form submit updates
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/news/admin/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          sinhalaTitle,
          url,
          ogImage,
          summary,
          sinhalaSummary,
          status,
          importantForSriLanka,
          priority,
          dynamicOgImage,
          dynamicSourceUrl,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        // Refresh details
        const updated = await res.json();
        if (updated.success && updated.data) {
          setItem(updated.data);
        }

        // Return to news manager list after a small feedback timeout
        setTimeout(() => {
          router.push("/dashboard/news");
        }, 1500);
      } else {
        const text = await res.text();
        setErrorMsg(text || "Failed to update article details.");
      }
    } catch (err: any) {
      console.error("Update news error:", err);
      setErrorMsg(err.message || "Network error. Failed to save changes.");
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case "active":
        return <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full uppercase font-mono">Active</span>;
      case "deactive":
        return <span className="flex items-center gap-1 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/25 px-2 py-0.5 rounded-full uppercase font-mono">Deactive</span>;
      case "hidden":
        return <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-full uppercase font-mono">Hidden</span>;
      default:
        return <span className="text-xs text-neutral-400 font-mono">{s}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#07090e] text-neutral-800 dark:text-neutral-100 font-inter pb-24 overflow-x-hidden transition-colors duration-300">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-sky-500/5 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">

        {/* Navigation & Header */}
        <div className="flex justify-between items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/news"
              className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md"
            >
              <ArrowLeft className="w-4 h-4" /> Cancel & Back
            </Link>
            <div className="w-[1px] h-6 bg-neutral-200 dark:bg-white/10" />
            <div>
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-500 dark:from-white dark:via-neutral-200 dark:to-neutral-500 bg-clip-text text-transparent">
                Edit Article Details
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">Moderate or refine processed news parameters</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>

        {/* FEEDBACK STATUS */}
        {success && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3 text-sm text-emerald-600 dark:text-emerald-400 animate-pulse">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>Changes successfully saved! Redirecting to dashboard news list...</span>
          </div>
        )}
        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 mb-6 flex items-center gap-3 text-sm text-rose-600 dark:text-rose-400">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {loading ? (
          <div className="bg-white/60 dark:bg-white/[0.01] border border-neutral-200/80 dark:border-white/[0.05] rounded-3xl p-24 text-center backdrop-blur-xl">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
              <span className="text-sm text-neutral-500 font-light">Loading article edit details...</span>
            </div>
          </div>
        ) : !item ? (
          <div className="bg-white/60 dark:bg-white/[0.01] border border-rose-200 dark:border-rose-500/20 rounded-3xl p-16 text-center backdrop-blur-xl">
            <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">Article Not Found</h3>
            <p className="text-sm text-neutral-500 font-light mb-6">The article ID might be invalid or deleted from the server database.</p>
            <Link href="/dashboard/news" className="text-xs font-semibold px-4 py-2 bg-neutral-200 dark:bg-white/5 border border-neutral-300 dark:border-white/10 rounded-xl hover:bg-neutral-300 dark:hover:bg-white/10 transition">
              Back to List
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

            {/* FORM EDITOR COLUMN */}
            {/* LEFT COLUMN: FORM & REFERENCE IMAGES CURATOR */}
            <div className="lg:col-span-8 space-y-6">

              <form onSubmit={handleSave} className="bg-white/60 dark:bg-white/[0.01] border border-neutral-200/80 dark:border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl shadow-sm dark:shadow-none space-y-6">

                <div className="border-b border-neutral-200 dark:border-white/[0.05] pb-4">
                  <h3 className="font-semibold text-neutral-900 dark:text-white tracking-tight">Article Ingest Fields</h3>
                  <p className="text-xs text-neutral-500 font-light mt-0.5">Edit information fetched by process pipeline</p>
                </div>

                {/* Title Inputs */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Headline Title (English)</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-black/10 border border-neutral-200 dark:border-white/[0.04] focus:border-sky-500/50 dark:focus:border-sky-500/30 text-sm px-4 py-2.5 rounded-xl focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Headline Title (Sinhala translation)</label>
                    <input
                      type="text"
                      value={sinhalaTitle}
                      onChange={(e) => setSinhalaTitle(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-black/10 border border-neutral-200 dark:border-white/[0.04] focus:border-sky-500/50 dark:focus:border-sky-500/30 text-sm px-4 py-2.5 rounded-xl focus:outline-none transition font-light"
                    />
                  </div>
                </div>

                {/* Source URL & OG Image URL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                      <LinkIcon className="w-3.5 h-3.5 text-neutral-400" />
                      Original Source URL
                    </label>
                    <input
                      type="url"
                      required
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-black/10 border border-neutral-200 dark:border-white/[0.04] focus:border-sky-500/50 dark:focus:border-sky-500/30 text-xs font-mono px-4 py-2.5 rounded-xl focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-neutral-400" />
                      OG Image URL (Preview asset)
                    </label>
                    <input
                      type="text"
                      value={ogImage}
                      onChange={(e) => setOgImage(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-black/10 border border-neutral-200 dark:border-white/[0.04] focus:border-sky-500/50 dark:focus:border-sky-500/30 text-xs font-mono px-4 py-2.5 rounded-xl focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Summary Areas */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Brief Summary (English)</label>
                    <textarea
                      rows={4}
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-black/10 border border-neutral-200 dark:border-white/[0.04] focus:border-sky-500/50 dark:focus:border-sky-500/30 text-xs px-4 py-2.5 rounded-xl focus:outline-none transition resize-none leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Brief Summary (Sinhala translation)</label>
                    <textarea
                      rows={4}
                      value={sinhalaSummary}
                      onChange={(e) => setSinhalaSummary(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-black/10 border border-neutral-200 dark:border-white/[0.04] focus:border-sky-500/50 dark:focus:border-sky-500/30 text-xs px-4 py-2.5 rounded-xl focus:outline-none transition resize-none leading-relaxed font-light"
                    />
                  </div>
                </div>

                {/* Control Dropdowns & Toggles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-neutral-200 dark:border-white/[0.05]">

                  {/* Status selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Moderation Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-[#0c0f17] border border-neutral-200 dark:border-white/[0.04] text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-sky-500/50 transition cursor-pointer text-neutral-700 dark:text-neutral-300"
                    >
                      <option value="active">Active (Visible)</option>
                      <option value="deactive">Deactive (Flagged)</option>
                      <option value="hidden">Hidden (Moderator Only)</option>
                    </select>
                  </div>

                  {/* Priority Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Ingest priority</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-[#0c0f17] border border-neutral-200 dark:border-white/[0.04] text-xs px-3 py-2.5 rounded-xl focus:outline-none focus:border-sky-500/50 transition cursor-pointer text-neutral-700 dark:text-neutral-300"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  {/* Sri Lanka Toggle */}
                  <div className="flex items-center gap-3 pt-6">
                    <input
                      type="checkbox"
                      id="lankaFocus"
                      checked={importantForSriLanka}
                      onChange={(e) => setImportantForSriLanka(e.target.checked)}
                      className="w-4.5 h-4.5 text-sky-500 bg-neutral-100 dark:bg-black/20 border-neutral-300 dark:border-white/[0.04] rounded-lg focus:ring-sky-500 focus:ring-2 cursor-pointer transition"
                    />
                    <label htmlFor="lankaFocus" className="text-xs font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer select-none">
                      Important for Sri Lanka
                    </label>
                  </div>

                </div>

                {/* SAVE / CANCEL BUTTONS */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-neutral-200 dark:border-white/[0.05]">
                  <Link
                    href="/dashboard/news"
                    className="px-5 py-2.5 rounded-xl bg-neutral-200/50 dark:bg-white/5 border border-neutral-300 dark:border-white/10 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-white/10 hover:text-neutral-900 dark:hover:text-white transition flex items-center gap-1.5"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-5 py-2.5 rounded-xl bg-sky-500 border border-sky-500 text-xs font-semibold text-white hover:bg-sky-600 shadow-[0_0_15px_rgba(14,165,233,0.2)] hover:shadow-[0_0_20px_rgba(14,165,233,0.3)] transition disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                  >
                    {saving ? (
                      <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save Changes
                  </button>
                </div>

              </form>

              {/* SEARCH REFERENCE METADATA */}
              <div className="bg-white/60 dark:bg-white/[0.01] border border-neutral-200/80 dark:border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl shadow-sm dark:shadow-none space-y-6">
                <div className="border-b border-neutral-200 dark:border-white/[0.05] pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-violet-500" />
                      Discovered Search References
                    </h3>
                    <p className="text-xs text-neutral-500 font-light mt-0.5">Reference websites and snippets crawled during news enrichment</p>
                  </div>
                  <span className="text-[10px] uppercase text-neutral-400 dark:text-neutral-500 font-mono tracking-wider bg-neutral-100 dark:bg-white/5 px-2.5 py-1 rounded-lg w-fit">
                    {searchResults.length} references
                  </span>
                </div>

                <div className="space-y-4">
                  {searchResults.length === 0 ? (
                    <div className="border border-neutral-200 dark:border-white/[0.03] bg-neutral-50/50 dark:bg-white/[0.005] rounded-2xl p-8 text-center text-neutral-500 text-xs font-light italic">
                      No verified search references were stored during processing for this article.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {searchResults.map((ref, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-neutral-50/50 dark:bg-black/20 border border-neutral-200 dark:border-white/[0.04] rounded-2xl flex flex-col gap-2"
                        >
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div className="space-y-1">
                              <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 leading-snug">
                                {ref.title}
                              </h4>
                              <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-normal font-light">
                                {ref.content}
                              </p>
                            </div>
                            <a
                              href={ref.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[9px] font-mono text-neutral-500 hover:text-sky-500 dark:hover:text-sky-400 flex items-center gap-1 mt-2 transition hover:underline w-fit"
                            >
                              <LinkIcon className="w-2.5 h-2.5" />
                              <span className="truncate max-w-[300px] sm:max-w-[450px]">{ref.url}</span>
                              <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* PREVIEW COLUMN */}
            <div className="lg:col-span-4 space-y-6">

              {/* Asset Live Preview */}
              <div className="bg-white/60 dark:bg-white/[0.01] border border-neutral-200/80 dark:border-white/[0.05] rounded-3xl p-5 backdrop-blur-xl shadow-sm dark:shadow-none space-y-4">
                <span className="text-[10px] uppercase text-neutral-400 dark:text-neutral-500 font-mono tracking-wider block">OG Image Asset Preview</span>
                <div className="relative w-full aspect-video bg-neutral-100 dark:bg-black/20 border border-neutral-200 dark:border-white/[0.04] rounded-2xl overflow-hidden flex items-center justify-center text-neutral-500">
                  {ogImage ? (
                    <img
                      src={ogImage}
                      alt="Asset preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/main-logo.png";
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-center p-4">
                      <ImageIcon className="w-8 h-8 text-neutral-400" />
                      <span className="text-[10px] font-light">No image URL specified</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Image Asset Selection Grid */}
              <div className="bg-white/60 dark:bg-white/[0.01] border border-neutral-200/80 dark:border-white/[0.05] rounded-3xl p-5 backdrop-blur-xl shadow-sm dark:shadow-none space-y-4">
                <span className="text-[10px] uppercase text-neutral-400 dark:text-neutral-500 font-mono tracking-wider block font-medium">Available Image Assets</span>
                {searchResults.filter(r => r.ogImage || r.loadingImage).length === 0 ? (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light italic">No alternative image assets discovered.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {searchResults.map((ref, idx) => {
                      if (!ref.ogImage && !ref.loadingImage) return null;
                      const isCurrentlySelected = ogImage === ref.ogImage && ref.ogImage !== null && ref.ogImage !== undefined;

                      return (
                        <button
                          key={idx}
                          type="button"
                          disabled={ref.loadingImage || !ref.ogImage}
                          onClick={() => {
                            if (ref.ogImage) {
                              setOgImage(ref.ogImage);
                              setDynamicOgImage(ref.ogImage);
                              setDynamicSourceUrl(ref.url || "");
                            }
                          }}
                          className={`relative aspect-square rounded-xl overflow-hidden bg-neutral-100 dark:bg-white/5 border flex items-center justify-center transition-all ${ref.ogImage
                              ? "cursor-pointer hover:ring-2 hover:ring-sky-500 hover:ring-offset-2 dark:hover:ring-offset-[#07090e]"
                              : "cursor-default"
                            } ${isCurrentlySelected
                              ? "ring-2 ring-sky-500 ring-offset-2 dark:ring-offset-[#07090e] border-sky-500"
                              : "border-neutral-200 dark:border-white/[0.05]"
                            }`}
                          title={ref.ogImage ? "Click to apply image" : "Loading..."}
                        >
                          {ref.loadingImage ? (
                            <RefreshCw className="w-4 h-4 text-sky-500 animate-spin" />
                          ) : ref.ogImage ? (
                            <>
                              <img
                                src={ref.ogImage}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = "/main-logo.png";
                                }}
                              />
                              {isCurrentlySelected && (
                                <div className="absolute inset-0 bg-sky-500/20 backdrop-blur-[1px] flex items-center justify-center">
                                  <Check className="w-4 h-4 text-white filter drop-shadow" />
                                </div>
                              )}
                            </>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Status information */}
              <div className="bg-white/60 dark:bg-white/[0.01] border border-neutral-200/80 dark:border-white/[0.05] rounded-3xl p-5 backdrop-blur-xl shadow-sm dark:shadow-none space-y-4">
                <span className="text-[10px] uppercase text-neutral-400 dark:text-neutral-500 font-mono tracking-wider block font-medium">Article Stats</span>
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-xs pb-2.5 border-b border-neutral-200 dark:border-white/[0.03]">
                    <span className="text-neutral-500">Status</span>
                    {getStatusBadge(item.status)}
                  </div>
                  <div className="flex items-center justify-between text-xs pb-2.5 border-b border-neutral-200 dark:border-white/[0.03]">
                    <span className="text-neutral-500">Source domain</span>
                    <span className="font-semibold font-mono">{item.source}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pb-2.5 border-b border-neutral-200 dark:border-white/[0.03]">
                    <span className="text-neutral-500">Sri Lanka Focus</span>
                    <span className={`font-mono text-xs ${item.importantForSriLanka ? "text-emerald-500 font-bold" : "text-neutral-500"}`}>
                      {item.importantForSriLanka ? "YES" : "NO"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs pb-2.5 border-b border-neutral-200 dark:border-white/[0.03]">
                    <span className="text-neutral-500">Priority level</span>
                    <span className="capitalize font-medium">{item.priority || "medium"}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500">Published</span>
                    <span className="font-mono">{new Date(item.pubDate || item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
}
