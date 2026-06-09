"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/custom/news/ThemeToggle";
import {
  ArrowLeft,
  Settings,
  ShieldAlert,
  Calendar,
  Layers,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Globe,
  Loader2,
  Check,
} from "lucide-react";

interface RssFeedConfig {
  url: string;
  isActive: boolean;
}

interface NewsSettingsData {
  id: string;
  isGatherCronActive: boolean;
  feeds: RssFeedConfig[];
  blacklistedOgDomains: string[];
}

export default function SettingsDashboard() {
  const [settings, setSettings] = useState<NewsSettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingCron, setSavingCron] = useState(false);
  const [savingFeed, setSavingFeed] = useState<string | null>(null);
  const [newDomain, setNewDomain] = useState("");
  const [savingDomain, setSavingDomain] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/news/settings");
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleToggleCron = async () => {
    if (!settings) return;
    setSavingCron(true);
    const targetState = !settings.isGatherCronActive;
    try {
      const res = await fetch("/api/news/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cronActive: targetState }),
      });
      if (res.ok) {
        setSettings({ ...settings, isGatherCronActive: targetState });
        showToast(`Master scheduler successfully ${targetState ? "activated" : "paused"}.`);
      } else {
        throw new Error("Failed to toggle cron status");
      }
    } catch (e) {
      showToast("Failed to update scheduler status.", "error");
    } finally {
      setSavingCron(false);
    }
  };

  const handleToggleFeed = async (url: string, currentActive: boolean) => {
    if (!settings) return;
    setSavingFeed(url);
    const targetState = !currentActive;
    try {
      const res = await fetch("/api/news/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, active: targetState }),
      });
      if (res.ok) {
        const updatedFeeds = settings.feeds.map((f) =>
          f.url === url ? { ...f, isActive: targetState } : f
        );
        setSettings({ ...settings, feeds: updatedFeeds });
        showToast(`Feed status updated successfully.`);
      } else {
        throw new Error("Failed to update feed status");
      }
    } catch (e) {
      showToast("Failed to update feed status.", "error");
    } finally {
      setSavingFeed(null);
    }
  };

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings || !newDomain.trim()) return;

    let domain = newDomain.trim().toLowerCase();
    // Basic validation / clean domain extraction
    try {
      if (domain.startsWith("http://") || domain.startsWith("https://")) {
        domain = new URL(domain).hostname;
      }
      domain = domain.replace(/^www\./i, "");
    } catch (err) {}

    if (settings.blacklistedOgDomains.includes(domain)) {
      showToast("Domain is already blacklisted.", "error");
      return;
    }

    setSavingDomain(true);
    const updatedList = [...settings.blacklistedOgDomains, domain];
    try {
      const res = await fetch("/api/news/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domains: updatedList }),
      });
      if (res.ok) {
        setSettings({ ...settings, blacklistedOgDomains: updatedList });
        setNewDomain("");
        showToast(`Domain "${domain}" added to blacklist.`);
      } else {
        throw new Error("Failed to add domain to blacklist");
      }
    } catch (e) {
      showToast("Failed to add domain to blacklist.", "error");
    } finally {
      setSavingDomain(false);
    }
  };

  const handleRemoveDomain = async (domain: string) => {
    if (!settings) return;
    const updatedList = settings.blacklistedOgDomains.filter((d) => d !== domain);
    try {
      const res = await fetch("/api/news/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domains: updatedList }),
      });
      if (res.ok) {
        setSettings({ ...settings, blacklistedOgDomains: updatedList });
        showToast(`Domain "${domain}" removed from blacklist.`);
      } else {
        throw new Error("Failed to remove domain");
      }
    } catch (e) {
      showToast("Failed to remove domain from blacklist.", "error");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#07090e] text-neutral-800 dark:text-neutral-100 font-inter pb-24 overflow-x-hidden transition-colors duration-300">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-sky-500/5 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/news" className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
              <ArrowLeft className="w-4 h-4" /> Back to News
            </Link>
            <div className="w-[1px] h-6 bg-neutral-200 dark:bg-white/10" />
            <Link href="/news" className="block">
              <Image src="/main-logo.png" width={40} height={40} className="w-8 h-8 object-contain" alt="NeuralPress" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-500 dark:from-white dark:via-neutral-200 dark:to-neutral-500 bg-clip-text text-transparent">
                News Settings
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">Configure Aggregator Feeds, Cron Engines, and Image Filters</p>
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
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              News Manager
            </Link>
            <Link
              href="/dashboard/settings"
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition bg-white dark:bg-white/10 text-neutral-900 dark:text-white shadow-sm border border-neutral-200 dark:border-white/5"
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

        {/* FEEDBACK TOAST CONTAINER */}
        {feedback && (
          <div
            className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border backdrop-blur-xl shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
              feedback.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                : "bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400"
            }`}
          >
            <Check className="w-4 h-4 shrink-0" />
            <span className="text-xs font-medium">{feedback.message}</span>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
            <span className="text-sm text-neutral-500 font-light">Loading core settings...</span>
          </div>
        ) : !settings ? (
          <div className="bg-white/60 dark:bg-white/[0.01] border border-neutral-200/80 dark:border-white/[0.05] rounded-3xl p-12 text-center backdrop-blur-xl">
            <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold">Failed to Fetch Settings</h3>
            <p className="text-sm text-neutral-500 mt-1 max-w-sm mx-auto">Please confirm the aggregator NestJS microservice is active and reachable.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* INGESTION CRON SETTINGS & FEED LISTINGS */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Cron Settings Card */}
              <div className="bg-white/60 dark:bg-white/[0.01] border border-neutral-200/80 dark:border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl shadow-sm dark:shadow-none">
                <div className="flex justify-between items-center gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-neutral-900 dark:text-white">Master Ingestion Scheduler</h3>
                      <p className="text-xs text-neutral-500 font-light">Toggle periodic gathering execution</p>
                    </div>
                  </div>

                  <button
                    onClick={handleToggleCron}
                    disabled={savingCron}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      settings.isGatherCronActive ? "bg-sky-500" : "bg-neutral-200 dark:bg-neutral-800"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        settings.isGatherCronActive ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed">
                  When active, the core news harvester automatically runs in the background at regular intervals. Pausing this halts feed gathering.
                </p>
              </div>

              {/* Feed Control Settings Card */}
              <div className="bg-white/60 dark:bg-white/[0.01] border border-neutral-200/80 dark:border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white">RSS Feed Channels</h3>
                    <p className="text-xs text-neutral-500 font-light">Configure individual active ingestion streams</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {settings.feeds.map((feed) => (
                    <div
                      key={feed.url}
                      className="flex items-center justify-between gap-4 p-4 bg-neutral-50/50 dark:bg-white/[0.005] border border-neutral-200/50 dark:border-white/[0.03] rounded-2xl transition hover:border-neutral-300 dark:hover:border-white/10"
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-xs text-neutral-500 font-mono block truncate">{feed.url}</span>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {feed.isActive ? (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full">
                            <CheckCircle className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 rounded-full">
                            <XCircle className="w-3 h-3" /> Paused
                          </span>
                        )}

                        <button
                          onClick={() => handleToggleFeed(feed.url, feed.isActive)}
                          disabled={savingFeed === feed.url}
                          className={`text-xs px-3 py-1 rounded-xl transition ${
                            feed.isActive
                              ? "bg-neutral-250 dark:bg-white/5 hover:bg-rose-500/10 hover:text-rose-500 text-neutral-600 dark:text-neutral-400"
                              : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                          }`}
                        >
                          {savingFeed === feed.url ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : feed.isActive ? (
                            "Pause"
                          ) : (
                            "Activate"
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* BLACKLISTED DOMAINS PANEL */}
            <div className="lg:col-span-1">
              <div className="bg-white/60 dark:bg-white/[0.01] border border-neutral-200/80 dark:border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl shadow-sm dark:shadow-none flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400">
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white">OG Image Blacklist</h3>
                    <p className="text-xs text-neutral-500 font-light">Block specific image sources</p>
                  </div>
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light leading-relaxed mb-6">
                  Enter domains (e.g. <code>hirunews.lk</code>) to automatically block and hide their preview images inside the client-facing feed.
                </p>

                {/* Add domain form */}
                <form onSubmit={handleAddDomain} className="flex gap-2 mb-6">
                  <input
                    type="text"
                    required
                    placeholder="e.g. hirunews.lk"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="flex-1 min-w-0 bg-neutral-50 dark:bg-black/10 border border-neutral-200 dark:border-white/[0.04] focus:border-rose-500/50 dark:focus:border-rose-500/30 text-xs px-3.5 py-2.5 rounded-xl focus:outline-none transition font-mono"
                  />
                  <button
                    type="submit"
                    disabled={savingDomain || !newDomain.trim()}
                    className="flex items-center justify-center p-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-md transition disabled:opacity-40"
                  >
                    {savingDomain ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </button>
                </form>

                {/* Domains list */}
                <div className="flex-1 space-y-2.5 overflow-y-auto max-h-[350px] pr-1">
                  {settings.blacklistedOgDomains.length === 0 ? (
                    <div className="text-center py-12 border border-dashed border-neutral-200 dark:border-white/[0.04] rounded-2xl text-neutral-400 dark:text-neutral-600">
                      <Globe className="w-8 h-8 mx-auto mb-2 opacity-55" />
                      <span className="text-xs font-light">No blacklisted domains</span>
                    </div>
                  ) : (
                    settings.blacklistedOgDomains.map((domain) => (
                      <div
                        key={domain}
                        className="flex items-center justify-between gap-3 p-3 bg-rose-500/[0.02] border border-rose-500/10 dark:border-rose-500/5 rounded-2xl hover:border-rose-500/20 transition group"
                      >
                        <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 font-mono truncate">
                          {domain}
                        </span>
                        
                        <button
                          onClick={() => handleRemoveDomain(domain)}
                          className="p-1 text-neutral-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                          title="Remove from blacklist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
