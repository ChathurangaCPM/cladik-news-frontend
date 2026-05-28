"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/custom/news/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  Cpu,
  Database,
  Terminal,
  RefreshCw,
  CheckCircle,
  XCircle,
  FileText,
  Search,
  Key,
  Shield,
  Clock,
  Layers,
  ArrowLeft,
  ChevronRight
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface TokenStats {
  promptTokens: number;
  candidateTokens: number;
  totalTokens: number;
}

interface OverviewStats {
  totalNews: number;
  todayNews: number;
  graphData: Array<{ name: string; date: string; count: number }>;
  tokenStats: TokenStats;
}

interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  enqueuedJobs?: Array<{ id: string; title: string; timestamp: number }>;
}

interface ActiveJob {
  jobId: string;
  title: string;
  stage: "rss_fetch" | "readability" | "dedupe_check" | "search" | "title_gen" | "content_gen" | "saving";
  status: "pending" | "active" | "success" | "failed" | "skipped";
  timestamp: number;
  meta?: any;
}

interface LogLine {
  id: string;
  message: string;
  level: "info" | "warn" | "error";
  timestamp: number;
}

interface VectorLogLine {
  id: string;
  message: string;
  actionStatus: "searching" | "found" | "skipped" | "info";
  timestamp: number;
}

export default function ProcessDashboard() {
  // Connections and statistics state
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "error">("connecting");
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [queueStats, setQueueStats] = useState<QueueStats>({ waiting: 0, active: 0, completed: 0, failed: 0 });
  const [activeJobs, setActiveJobs] = useState<Record<string, ActiveJob>>({});
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [vectorLogs, setVectorLogs] = useState<VectorLogLine[]>([]);
  const [activeTab, setActiveTab] = useState<"logs" | "vector">("logs");
  const [currentKeyIndex, setCurrentKeyIndex] = useState<number>(0);
  const [geminiState, setGeminiState] = useState<{ waitingCount: number; activeSource: string | null; delayMs: number }>({
    waitingCount: 0,
    activeSource: null,
    delayMs: 25000
  });
  const [geminiErrors, setGeminiErrors] = useState<Array<{ id: string; message: string; code: string; keyIndex: number; timestamp: number }>>([]);
  const [activeGeminiError, setActiveGeminiError] = useState<{ message: string; code: string; keyIndex: number; timestamp: number } | null>(null);

  const consoleRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll logs container directly without triggering window scrolls
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [logs, vectorLogs, activeTab]);

  // Initial Fetch of Statistics
  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/news/stats/overview");
        if (res.ok) {
          const data = await res.json();
          setOverview(data);
        }
      } catch (err) {
        console.error("Failed to load initial overview stats:", err);
      }
    }
    loadStats();
  }, []);

  // Connect to SSE event stream
  useEffect(() => {
    setConnectionStatus("connecting");
    const eventSource = new EventSource("/api/news/processor-events");

    eventSource.onopen = () => {
      setConnectionStatus("connected");
    };

    eventSource.onerror = () => {
      setConnectionStatus("error");
    };

    eventSource.onmessage = (event) => {
      try {
        const rawEvent = JSON.parse(event.data);
        const { type, data, timestamp } = rawEvent;

        if (type === "log") {
          setLogs((prev) => [
            ...prev.slice(-99), // Keep last 100 logs
            {
              id: `${timestamp}-${Math.random()}`,
              message: data.message,
              level: data.level || "info",
              timestamp
            }
          ]);
        } else if (type === "vector_log") {
          setVectorLogs((prev) => [
            ...prev.slice(-99), // Keep last 100 vector logs
            {
              id: `${timestamp}-${Math.random()}`,
              message: data.message,
              actionStatus: data.actionStatus || "info",
              timestamp
            }
          ]);
        } else if (type === "stats") {
          setQueueStats({
            waiting: data.waiting || 0,
            active: data.active || 0,
            completed: data.completed || 0,
            failed: data.failed || 0,
            enqueuedJobs: data.enqueuedJobs || []
          });
        } else if (type === "overview_stats") {
          setOverview((prev) => (prev ? { ...prev, ...data } : data));
        } else if (type === "tokens") {
          // Dynamically increment real-time tokens in state
          setOverview((prev) => {
            if (!prev) return null;
            const updatedTokenStats = {
              promptTokens: prev.tokenStats.promptTokens + (data.promptTokens || 0),
              candidateTokens: prev.tokenStats.candidateTokens + (data.candidateTokens || 0),
              totalTokens: prev.tokenStats.totalTokens + (data.totalTokens || 0)
            };
            return { ...prev, tokenStats: updatedTokenStats };
          });
        } else if (type === "stage") {
          const { jobId, title, stage, status, meta } = data;
          
          // Look for key rotation logs inside processor log text or simulate rotation
          if (meta?.keyIndex !== undefined) {
            setCurrentKeyIndex(meta.keyIndex);
          }

          setActiveJobs((prev) => {
            const updated = { ...prev };
            
            // Clean up completed/failed jobs from active panel after 8 seconds
            if (status === "success" || status === "failed" || status === "skipped") {
              setTimeout(() => {
                setActiveJobs((current) => {
                  const cleaned = { ...current };
                  delete cleaned[jobId];
                  return cleaned;
                });
              }, 8000);
            }

            updated[jobId] = {
              jobId,
              title: title || updated[jobId]?.title || "Aggregator Job",
              stage,
              status,
              timestamp,
              meta: meta || updated[jobId]?.meta
            };
            return updated;
          });
        } else if (type === "gemini_state") {
          setGeminiState({
            waitingCount: data.waitingCount || 0,
            activeSource: data.activeSource || null,
            delayMs: data.delayMs || 25000
          });
        } else if (type === "gemini_error") {
          const newErr = {
            id: `${timestamp}-${Math.random()}`,
            message: data.message,
            code: data.code,
            keyIndex: data.keyIndex,
            timestamp
          };
          setGeminiErrors((prev) => [newErr, ...prev.slice(0, 9)]); // Keep last 10 errors
          setActiveGeminiError(newErr);
          
          // Auto-clear active top-level error banner after 12 seconds
          setTimeout(() => {
            setActiveGeminiError((current) => {
              if (current && current.timestamp === timestamp) {
                return null;
              }
              return current;
            });
          }, 12000);
        }
      } catch (err) {
        console.error("Error parsing processor event SSE:", err);
      }
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "failed": return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      case "active": return "bg-sky-500/20 text-sky-400 border-sky-500/30 animate-pulse";
      case "skipped": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default: return "bg-neutral-500/10 text-neutral-400 border-neutral-500/20";
    }
  };

  const stages: Array<{ name: string; label: string }> = [
    { name: "rss_fetch", label: "RSS Fetch" },
    { name: "readability", label: "Readability" },
    { name: "dedupe_check", label: "Dedupe Check" },
    { name: "search", label: "News Search" },
    { name: "title_gen", label: "Title Gen" },
    { name: "content_gen", label: "Content Gen" },
    { name: "saving", label: "DB Saving" }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#07090e] text-neutral-800 dark:text-neutral-100 font-inter pb-24 overflow-x-hidden selection:bg-emerald-500/30 transition-colors duration-300">
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
              <Image src="/main-logo.png" width={40} height={40} className="w-8 h-8 object-contain" alt="NeuralPress" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-500 dark:from-white dark:via-neutral-200 dark:to-neutral-500 bg-clip-text text-transparent">
                Process Discovery
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">Real-Time Telemetry and Core Engine State</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1.5 bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-0.5 rounded-xl backdrop-blur-md">
            <Link
              href="/dashboard"
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition bg-white dark:bg-white/10 text-neutral-900 dark:text-white shadow-sm border border-neutral-200 dark:border-white/5"
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
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              Settings
            </Link>
          </div>

          {/* SSE Connection Health Status & ThemeToggle */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="w-[1px] h-6 bg-neutral-200 dark:bg-white/10" />
            {connectionStatus === "connected" && (
              <span className="flex items-center gap-2 text-xs font-normal text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-ping animate-duration-1000" />
                SSE Connected
              </span>
            )}
            {connectionStatus === "connecting" && (
              <span className="flex items-center gap-2 text-xs font-normal text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-3 py-1.5 rounded-full backdrop-blur-md animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                SSE Reconnecting
              </span>
            )}
            {connectionStatus === "error" && (
              <span className="flex items-center gap-2 text-xs font-normal text-rose-600 dark:text-rose-400 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-full backdrop-blur-md">
                <XCircle className="w-3.5 h-3.5" />
                Connection Lost
              </span>
            )}
          </div>
        </div>

        {/* Real-time Gemini Error Alert Banner */}
        <AnimatePresence>
          {activeGeminiError && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative overflow-hidden mb-8 p-5 rounded-3xl bg-rose-500/10 dark:bg-rose-950/20 border border-rose-500/30 dark:border-rose-500/20 shadow-lg backdrop-blur-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 group z-20"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-rose-500" />
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700 pointer-events-none" />
              
              <div className="flex gap-4 items-start relative z-10 pl-2">
                <div className="p-3 bg-rose-500/20 rounded-2xl text-rose-500 dark:text-rose-400 border border-rose-500/30 animate-pulse mt-0.5">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs uppercase font-bold text-rose-600 dark:text-rose-400 tracking-wider font-mono">
                      Gemini API Rate Limit & Error Detected
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-medium bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                      {activeGeminiError.code}
                    </span>
                    <span className="text-[10px] font-mono text-neutral-500">
                      Key index #{activeGeminiError.keyIndex}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-rose-200 mt-1 select-all leading-snug">
                    {activeGeminiError.message}
                  </h4>
                  <p className="text-[10px] text-neutral-500 dark:text-rose-400/60 font-light mt-1 font-mono">
                    Occurred at {new Date(activeGeminiError.timestamp).toLocaleTimeString()} • Engine will automatically rotate key or enforce cooldown spacing
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 relative z-10 self-end md:self-center">
                <button
                  onClick={() => {
                    setActiveGeminiError(null);
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-medium bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition shadow-sm"
                >
                  Acknowledge
                </button>
                <button
                  onClick={() => setActiveGeminiError(null)}
                  className="p-1.5 rounded-lg text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5 transition"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOP STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          <div className="relative group overflow-hidden bg-white/60 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.05] hover:border-neutral-300 dark:hover:border-white/[0.1] rounded-2xl p-6 transition-all duration-300 backdrop-blur-xl shadow-sm dark:shadow-none">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-sky-500/10 to-transparent rounded-bl-full pointer-events-none" />
            <div className="flex justify-between items-start mb-4">
              <span className="text-neutral-500 dark:text-neutral-400 text-sm font-normal">News Database</span>
              <div className="p-2 bg-sky-500/10 rounded-xl text-sky-600 dark:text-sky-400 border border-sky-500/20">
                <Database className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white mb-1">
              {overview?.totalNews?.toLocaleString() || "—"}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-sky-400" />
              Total parsed articles in database
            </p>
          </div>

          <div className="relative group overflow-hidden bg-white/60 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.05] hover:border-neutral-300 dark:hover:border-white/[0.1] rounded-2xl p-6 transition-all duration-300 backdrop-blur-xl shadow-sm dark:shadow-none">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none" />
            <div className="flex justify-between items-start mb-4">
              <span className="text-neutral-500 dark:text-neutral-400 text-sm font-normal">Ingested Today</span>
              <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400 mb-1">
              +{overview?.todayNews?.toLocaleString() || "—"}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
              Articles discovered in past 24 hours
            </p>
          </div>

          <div className="relative group overflow-hidden bg-white/60 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.05] hover:border-neutral-300 dark:hover:border-white/[0.1] rounded-2xl p-6 transition-all duration-300 backdrop-blur-xl shadow-sm dark:shadow-none">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none" />
            <div className="flex justify-between items-start mb-4">
              <span className="text-neutral-500 dark:text-neutral-400 text-sm font-normal">Gemini Tokens</span>
              <div className="p-2 bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <Cpu className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white mb-1">
              {overview?.tokenStats?.totalTokens ? `${(overview.tokenStats.totalTokens / 1000000).toFixed(2)}M` : "—"}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 dark:bg-amber-400" />
              Input & completion token count
            </p>
          </div>

          <div className="relative group overflow-hidden bg-white/60 dark:bg-white/[0.02] border border-neutral-200/80 dark:border-white/[0.05] hover:border-neutral-300 dark:hover:border-white/[0.1] rounded-2xl p-6 transition-all duration-300 backdrop-blur-xl shadow-sm dark:shadow-none">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-500/10 to-transparent rounded-bl-full pointer-events-none" />
            <div className="flex justify-between items-start mb-4">
              <span className="text-neutral-500 dark:text-neutral-400 text-sm font-normal">Active Key Rotation</span>
              <div className="p-2 bg-violet-500/10 rounded-xl text-violet-600 dark:text-violet-400 border border-violet-500/20">
                <Key className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-bold font-mono tracking-tight text-neutral-900 dark:text-white mb-1">
              Index #{currentKeyIndex}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-500 dark:bg-violet-400" />
              Distributing load across keys pool
            </p>
          </div>

        </div>

        {/* MIDDLE ROW: QUEUES & INGESTION GRAPH */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Queues Status */}
          <div className="lg:col-span-3 bg-white/60 dark:bg-white/[0.01] border border-neutral-200/80 dark:border-white/[0.05] rounded-3xl p-6 flex flex-col justify-between backdrop-blur-xl shadow-sm dark:shadow-none">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                  <h3 className="font-semibold text-neutral-900 dark:text-white tracking-tight">BullMQ Stats</h3>
                </div>
                <span className="text-[10px] uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">BullMQ</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                
                <div className="bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.04] p-4 rounded-2xl flex flex-col justify-between">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">Active</span>
                  <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white mt-2 flex items-baseline gap-1.5">
                    {queueStats.active}
                    {queueStats.active > 0 && <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400 animate-ping inline-block" />}
                  </div>
                </div>

                <div className="bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.04] p-4 rounded-2xl flex flex-col justify-between">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">Waiting</span>
                  <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-white mt-2">
                    {queueStats.waiting}
                  </div>
                </div>

                <div className="bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.04] p-4 rounded-2xl flex flex-col justify-between">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">Completed</span>
                  <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-2">
                    {queueStats.completed}
                  </div>
                </div>

                <div className="bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.04] p-4 rounded-2xl flex flex-col justify-between">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 font-normal">Failed</span>
                  <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-500 mt-2">
                    {queueStats.failed}
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-6 border-t border-neutral-200 dark:border-white/[0.05] pt-4">
              <div className="flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-500 font-light font-mono">
                <span>Lock: 1 singleton</span>
                <span>Active: {queueStats.active}</span>
              </div>
            </div>
          </div>

          {/* Gemini Core Live Telemetry */}
          <div className="lg:col-span-3 bg-white/60 dark:bg-white/[0.01] border border-neutral-200/80 dark:border-white/[0.05] rounded-3xl p-6 flex flex-col justify-between backdrop-blur-xl shadow-sm dark:shadow-none">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <h3 className="font-semibold text-neutral-900 dark:text-white tracking-tight">Gemini Limits</h3>
                </div>
                <span className="text-[10px] uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">Telemetry</span>
              </div>

              <div className="space-y-4">
                <div className="bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.04] p-3 rounded-xl">
                  <span className="text-[10px] text-neutral-500 block">LLM Processing Status</span>
                  {geminiState.activeSource ? (
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono truncate">
                        ACTIVE: {geminiState.activeSource}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="inline-flex rounded-full h-2 w-2 bg-neutral-400"></span>
                      <span className="text-xs font-medium text-neutral-500 dark:text-neutral-500 font-mono">
                        IDLE (Rate Limit Free)
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.04] p-3 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-neutral-500 block">Cooldown Spacing Queue</span>
                    <span className="text-sm font-bold font-mono text-neutral-900 dark:text-white mt-1 block">
                      {geminiState.waitingCount} request(s) waiting
                    </span>
                  </div>
                  {geminiState.waitingCount > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 animate-pulse font-mono">
                      QUEUED
                    </span>
                  )}
                </div>

                <div className="bg-neutral-50 dark:bg-white/[0.02] border border-neutral-200 dark:border-white/[0.04] p-3 rounded-xl">
                  <span className="text-[10px] text-neutral-500 block">Rate Limit spacing</span>
                  <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mt-1 block font-mono">
                    {geminiState.delayMs / 1000}s space lock spacing
                  </span>
                </div>

                {geminiErrors.length > 0 && (
                  <div className="bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                    <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold block mb-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block" />
                      Recent API Exceptions ({geminiErrors.length})
                    </span>
                    <div className="space-y-1.5 max-h-[120px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/10 text-[10px] font-mono">
                      {geminiErrors.map((err) => (
                        <div key={err.id} className="border-b border-rose-500/10 pb-1.5 last:border-b-0 last:pb-0">
                          <div className="flex justify-between text-neutral-500">
                            <span>#{err.keyIndex} [{err.code}]</span>
                            <span>{new Date(err.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-neutral-700 dark:text-neutral-300 truncate mt-0.5" title={err.message}>
                            {err.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 border-t border-neutral-200 dark:border-white/[0.05] pt-3">
              <div className="text-[10px] text-neutral-500 dark:text-neutral-500 font-light font-mono truncate">
                Locked globally: {geminiState.activeSource || "None"}
              </div>
            </div>
          </div>

          {/* Ingestion graph */}
          <div className="lg:col-span-6 bg-white/60 dark:bg-white/[0.01] border border-neutral-200/80 dark:border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <h3 className="font-semibold text-neutral-900 dark:text-white tracking-tight">Ingestion Rates</h3>
              </div>
              <span className="text-[10px] uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">Weekly Load</span>
            </div>

            <div className="w-full h-[220px]">
              {overview?.graphData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={overview.graphData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="name" stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#525252" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(10, 15, 25, 0.9)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "12px",
                        color: "#fff",
                        fontSize: "12px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                        backdropFilter: "blur(12px)"
                      }}
                      cursor={{ stroke: "rgba(255,255,255,0.05)" }}
                    />
                    <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-neutral-500 font-light">
                  Loading Ingestion Rates...
                </div>
              )}
            </div>
          </div>

        </div>

        {/* CORE PROCESSOR LIVE FOCUS CARD */}
        {(() => {
          const activeJobList = Object.values(activeJobs);
          const currentJob = activeJobList.find((job) => job.status === "active") || activeJobList.find((job) => job.status === "success" || job.status === "failed") || null;
          
          if (!currentJob) {
            return (
              <div className="bg-white/60 dark:bg-white/[0.01] border border-neutral-200/80 dark:border-white/[0.05] rounded-3xl p-6 mb-8 backdrop-blur-xl shadow-sm dark:shadow-none flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white text-sm">Aggregator Pipeline Active</h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">Idle. Monitoring RSS feeds for new Sri Lankan events...</p>
                  </div>
                </div>
                <div className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
                  Engine: v0.9.5-Sequential
                </div>
              </div>
            );
          }

          const hasSearchMeta = currentJob.meta?.query !== undefined;

          return (
            <div className="bg-white/60 dark:bg-white/[0.01] border border-neutral-200/80 dark:border-white/[0.05] rounded-3xl p-6 mb-8 backdrop-blur-xl shadow-sm dark:shadow-none">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-neutral-200 dark:border-white/[0.05] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-sky-500"></span>
                    </span>
                    <h3 className="font-semibold text-neutral-900 dark:text-white tracking-tight">Core Ingestion Focus</h3>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Currently analyzing and generating news summary</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 border rounded-full uppercase tracking-wider ${getStatusColor(currentJob.status)}`}>
                  {currentJob.status === "active" ? `Active: ${stages.find(s => s.name === currentJob.stage)?.label || currentJob.stage}` : currentJob.status}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-white leading-tight">
                    {currentJob.title}
                  </h4>
                  <span className="text-[10px] font-mono text-neutral-500 block mt-1">
                    Ingestion ID: {currentJob.jobId}
                  </span>
                </div>

                {/* Search Metadata Results Viewer */}
                {hasSearchMeta && (
                  <div className="bg-neutral-50 dark:bg-black/20 border border-neutral-200 dark:border-white/[0.04] p-5 rounded-2xl space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 dark:border-white/[0.04] pb-3">
                      <div>
                        <span className="text-[10px] text-neutral-500 block font-mono uppercase tracking-wider">Factual Search Query</span>
                        <code className="text-xs font-bold text-sky-600 dark:text-sky-400 mt-1 block">
                          "{currentJob.meta.query}"
                        </code>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono font-medium">
                        <span className="text-neutral-500">Creation Sources:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          {currentJob.meta.verifiedCount} verified
                        </span>
                        <span className="text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                          {currentJob.meta.rejectedCount} rejected
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] text-neutral-500 block font-mono uppercase tracking-wider mb-2">Discovered Search Candidates ({currentJob.meta.totalFound})</span>
                      <div className="max-h-[180px] overflow-y-auto space-y-2 pr-1.5 scrollbar-thin scrollbar-thumb-white/5">
                        {currentJob.meta.results && currentJob.meta.results.map((res: any, rIdx: number) => (
                          <div 
                            key={rIdx} 
                            className={`p-3 rounded-xl border flex flex-col gap-1 transition ${
                              res.verified 
                                ? "bg-emerald-500/[0.02] border-emerald-500/10 hover:border-emerald-500/20" 
                                : "bg-neutral-200/20 dark:bg-white/[0.005] border-neutral-300 dark:border-white/[0.03] hover:border-neutral-400 dark:hover:border-white/[0.05]"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <a 
                                href={res.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs font-medium text-neutral-800 dark:text-neutral-200 hover:text-sky-500 dark:hover:text-sky-400 transition hover:underline line-clamp-1 flex items-center gap-1.5"
                              >
                                {res.title}
                                <ChevronRight className="w-3 h-3 text-neutral-500 shrink-0" />
                              </a>
                              <span className={`text-[9px] font-mono font-medium px-2 py-0.5 rounded-full border shrink-0 ${
                                res.verified 
                                  ? "text-emerald-500 bg-emerald-500/5 border-emerald-500/15" 
                                  : "text-rose-400 bg-rose-500/5 border-rose-500/15"
                              }`}>
                                {res.verified ? "VERIFIED" : "REJECTED"}
                              </span>
                            </div>
                            <p className={`text-[10px] ${res.verified ? "text-emerald-600 dark:text-emerald-400 font-light" : "text-neutral-500 dark:text-neutral-500"}`}>
                              {res.verified ? "Genuine Sri Lankan event match verified by Gemini correlation agent." : `Rejected correlation: ${res.reason}`}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* ACTIVE PIPELINE & QUEUE TELEMETRY GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
          
          {/* Active Ingestion Pipelines */}
          <div className="lg:col-span-8 bg-white/60 dark:bg-white/[0.01] border border-neutral-200/80 dark:border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-violet-500 dark:text-violet-400" />
                <h3 className="font-semibold text-neutral-900 dark:text-white tracking-tight">Active Ingestion Pipelines</h3>
              </div>
              <span className="text-[10px] uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">Live Processing Steps</span>
            </div>

            <div className="space-y-6">
              {Object.keys(activeJobs).length === 0 ? (
                <div className="border border-neutral-200 dark:border-white/[0.03] bg-neutral-50/50 dark:bg-white/[0.005] rounded-2xl p-8 text-center text-neutral-500 text-sm font-light">
                  No active ingestion pipelines detected. Waiting for newly discovered feeds...
                </div>
              ) : (
                <AnimatePresence>
                  {Object.values(activeJobs).map((job) => {
                    const currentIdx = stages.findIndex((s) => s.name === job.stage);
                    
                    return (
                      <motion.div
                        key={job.jobId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="border border-neutral-200/80 dark:border-white/[0.05] bg-white/40 dark:bg-white/[0.007] hover:bg-neutral-50 dark:hover:bg-white/[0.015] p-5 rounded-2xl transition"
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-4">
                          <div className="max-w-[70%]">
                            <h4 className="font-medium text-sm text-neutral-900 dark:text-white tracking-tight truncate">
                              {job.title}
                            </h4>
                            <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-500 block truncate mt-1">
                              JOB ID: {job.jobId}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-medium border px-2.5 py-1 rounded-full uppercase tracking-wider ${getStatusColor(job.status)}`}>
                              {job.status === "active" ? `Active: ${stages[currentIdx]?.label || job.stage}` : job.status}
                            </span>
                            <span className="text-[10px] text-neutral-500 font-light font-mono">
                              {new Date(job.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>

                        {/* HORIZONTAL TIMELINE PROCESS STEPS */}
                        <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 mt-4">
                          {stages.map((st, idx) => {
                            let stepStatus: "pending" | "active" | "success" | "failed" | "skipped" = "pending";

                            if (idx < currentIdx) {
                              stepStatus = "success";
                            } else if (idx === currentIdx) {
                              stepStatus = job.status === "success" || job.status === "failed" || job.status === "skipped"
                                ? (job.status as any)
                                : "active";
                            }

                            const stepColor = () => {
                              switch (stepStatus) {
                                case "success": return "bg-emerald-500 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.3)]";
                                case "failed": return "bg-rose-500 border-rose-500/50 shadow-[0_0_10px_rgba(244,63,94,0.3)]";
                                case "active": return "bg-sky-500 border-sky-500/50 animate-pulse shadow-[0_0_15px_rgba(56,189,248,0.5)]";
                                case "skipped": return "bg-amber-500 border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.3)]";
                                default: return "bg-neutral-200 dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700/50";
                              }
                            };

                            return (
                              <div key={st.name} className="relative flex flex-col gap-1.5">
                                {/* Horizontal connector line */}
                                {idx < stages.length - 1 && (
                                  <div className="hidden sm:block absolute top-2 right-[-50%] w-full h-[2px] bg-neutral-200 dark:bg-neutral-800 z-0">
                                    <div
                                      className={`h-full transition-all duration-500 ${
                                        idx < currentIdx ? "bg-emerald-500" : idx === currentIdx && job.status === "success" ? "bg-emerald-500" : "bg-transparent"
                                      }`}
                                      style={{ width: idx < currentIdx ? "100%" : "0%" }}
                                    />
                                  </div>
                                )}
                                
                                <div className="flex sm:flex-col items-center gap-3 sm:gap-2 relative z-10">
                                  <div className={`w-4.5 h-4.5 rounded-full border transition-all duration-500 ${stepColor()}`} />
                                  <span className={`text-[11px] font-normal tracking-tight ${idx <= currentIdx ? "text-neutral-800 dark:text-neutral-200" : "text-neutral-400 dark:text-neutral-500"}`}>
                                    {st.label}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>

          {/* QUEUE INGESTION PIPELINE / ENQUEUED ITEMS */}
          <div className="lg:col-span-4 bg-white/60 dark:bg-white/[0.01] border border-neutral-200/80 dark:border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl shadow-sm dark:shadow-none flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                <h3 className="font-semibold text-neutral-900 dark:text-white tracking-tight">Queue Pipeline</h3>
              </div>
              <span className="text-[10px] uppercase text-neutral-400 dark:text-neutral-500 tracking-wider">Enqueued & Next</span>
            </div>

            {/* NEXT ITEM TO PROCESS */}
            <div className="mb-6">
              <span className="text-[10px] uppercase text-neutral-400 dark:text-neutral-500 font-mono tracking-wider block mb-2">Next Item to Process</span>
              {queueStats.enqueuedJobs && queueStats.enqueuedJobs.length > 0 ? (
                <div className="relative group overflow-hidden bg-gradient-to-r from-sky-500/10 to-emerald-500/10 border border-sky-500/30 dark:border-sky-500/20 hover:border-sky-500/40 rounded-2xl p-4 transition-all duration-300 backdrop-blur-xl shadow-[0_0_15px_rgba(56,189,248,0.1)]">
                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-sky-500/20 to-transparent rounded-bl-full pointer-events-none" />
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="text-[9px] font-mono font-medium px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-500 border border-sky-500/20 animate-pulse uppercase tracking-wider shrink-0">
                      Up Next
                    </span>
                    <span className="text-[10px] text-neutral-500 font-light font-mono">
                      {new Date(queueStats.enqueuedJobs[0].timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-neutral-900 dark:text-white leading-snug line-clamp-2 mb-2 group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">
                    {queueStats.enqueuedJobs[0].title}
                  </h4>
                  <div className="text-[9px] font-mono text-neutral-500 flex justify-between items-center border-t border-neutral-200 dark:border-white/[0.05] pt-2 mt-2">
                    <span className="truncate max-w-[150px]">ID: {queueStats.enqueuedJobs[0].id}</span>
                    <span className="text-emerald-500 dark:text-emerald-400 font-medium">Ready to Ingest</span>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-neutral-300 dark:border-white/[0.1] bg-neutral-50/50 dark:bg-white/[0.002] rounded-2xl p-5 text-center text-neutral-500 text-xs font-light italic">
                  No upcoming items enqueued.
                </div>
              )}
            </div>

            {/* WAITING QUEUE LIST */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase text-neutral-400 dark:text-neutral-500 font-mono tracking-wider">Waiting In Queue ({Math.max(0, (queueStats.enqueuedJobs?.length || 0) - 1)})</span>
                <span className="text-[9px] font-mono text-neutral-500 font-light">Showing top 15</span>
              </div>
              
              <div className="flex-1 overflow-y-auto max-h-[280px] space-y-2 pr-1.5 scrollbar-thin scrollbar-thumb-white/5 min-h-[150px]">
                {!queueStats.enqueuedJobs || queueStats.enqueuedJobs.length <= 1 ? (
                  <div className="border border-neutral-200 dark:border-white/[0.03] bg-neutral-50/30 dark:bg-white/[0.001] rounded-2xl p-6 text-center text-neutral-400 dark:text-neutral-600 text-xs font-light italic h-full flex items-center justify-center">
                    Queue list is empty.
                  </div>
                ) : (
                  queueStats.enqueuedJobs.slice(1).map((job, idx) => (
                    <div 
                      key={job.id}
                      className="group p-3 bg-neutral-100/50 dark:bg-white/[0.005] hover:bg-neutral-100 dark:hover:bg-white/[0.015] border border-neutral-200 dark:border-white/[0.03] hover:border-neutral-300 dark:hover:border-white/[0.05] rounded-xl flex items-start gap-3 transition"
                    >
                      <div className="w-5 h-5 rounded-lg bg-neutral-200/50 dark:bg-white/5 border border-neutral-300 dark:border-white/[0.05] text-[10px] font-mono font-medium text-neutral-500 dark:text-neutral-400 flex items-center justify-center shrink-0">
                        #{idx + 1}
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <h4 className="text-[11px] font-medium text-neutral-800 dark:text-neutral-200 leading-tight group-hover:text-neutral-900 dark:group-hover:text-white transition-colors truncate">
                          {job.title}
                        </h4>
                        <div className="flex justify-between items-center text-[9px] font-mono text-neutral-500 font-light">
                          <span className="truncate max-w-[120px]">ID: {job.id}</span>
                          <span>{new Date(job.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

        {/* LOG TERMINAL CONSOLE */}
        <div className="bg-[#090b11] border border-neutral-200 dark:border-white/[0.05] rounded-3xl overflow-hidden backdrop-blur-xl flex flex-col h-[480px] shadow-sm dark:shadow-none">
          
          {/* Header tabs */}
          <div className="border-b border-white/[0.05] px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/[0.01]">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-neutral-800/50 rounded-lg text-neutral-400">
                <Terminal className="w-4 h-4" />
              </div>
              <div className="flex gap-2 bg-neutral-900 border border-white/[0.05] p-0.5 rounded-xl">
                <button
                  onClick={() => setActiveTab("logs")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-normal transition ${
                    activeTab === "logs" ? "bg-white/5 text-white shadow-sm" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Aggregator Engine Logs
                </button>
                <button
                  onClick={() => setActiveTab("vector")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-normal transition ${
                    activeTab === "vector" ? "bg-white/5 text-white shadow-sm" : "text-neutral-400 hover:text-white"
                  }`}
                >
                  Vector Database Logs
                </button>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-neutral-500 font-light font-mono">
              {activeTab === "logs" ? (
                <span>Buffer: {logs.length}/100 logs</span>
              ) : (
                <span>Buffer: {vectorLogs.length}/100 actions</span>
              )}
            </div>
          </div>

          {/* Console Screen */}
          <div ref={consoleRef} className="flex-1 overflow-y-auto p-6 font-mono text-[11px] leading-relaxed space-y-2.5 selection:bg-neutral-800 scrollbar-thin scrollbar-thumb-white/10">
            
            {activeTab === "logs" ? (
              logs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-neutral-600 font-light italic">
                  Aggregator logger initialized. Streaming pipeline triggers...
                </div>
              ) : (
                logs.map((log) => {
                  const getLogLevelStyle = () => {
                    switch (log.level) {
                      case "error": return "text-rose-400 font-bold";
                      case "warn": return "text-amber-400";
                      default: return "text-emerald-400";
                    }
                  };

                  return (
                    <div key={log.id} className="flex gap-4 hover:bg-white/[0.01] px-2 py-0.5 rounded transition">
                      <span className="text-neutral-600 select-none">
                        [{new Date(log.timestamp).toLocaleTimeString()}]
                      </span>
                      <span className={`select-none uppercase w-12 font-medium ${getLogLevelStyle()}`}>
                        {log.level}
                      </span>
                      <span className="text-neutral-300 select-all">
                        {log.message}
                      </span>
                    </div>
                  );
                })
              )
            ) : (
              vectorLogs.length === 0 ? (
                <div className="h-full flex items-center justify-center text-neutral-600 font-light italic">
                  Vector log listener active. Streaming semantic indexes...
                </div>
              ) : (
                vectorLogs.map((log) => {
                  const getVectorActionColor = () => {
                    switch (log.actionStatus) {
                      case "searching": return "text-sky-400";
                      case "found": return "text-emerald-400 font-bold";
                      case "skipped": return "text-amber-400";
                      default: return "text-neutral-400";
                    }
                  };

                  return (
                    <div key={log.id} className="flex gap-4 hover:bg-white/[0.01] px-2 py-0.5 rounded transition">
                      <span className="text-neutral-600 select-none">
                        [{new Date(log.timestamp).toLocaleTimeString()}]
                      </span>
                      <span className={`select-none uppercase w-20 font-medium ${getVectorActionColor()}`}>
                        {log.actionStatus}
                      </span>
                      <span className="text-neutral-300 select-all">
                        {log.message}
                      </span>
                    </div>
                  );
                })
              )
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
