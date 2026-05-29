"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchNews, searchNewsAction } from "@/app/news/actions";
import { ThemeToggle } from "@/components/custom/news/ThemeToggle";
import {
  Key,
  Database,
  Code2,
  Terminal,
  Activity,
  Layers,
  ShieldAlert,
  Cpu,
  RefreshCw,
  Plus,
  Copy,
  Check,
  Send,
  Lock,
  PlusCircle,
  HelpCircle,
  TrendingUp,
  Settings,
  CreditCard,
  Sparkles,
  Search,
  CheckCircle,
  ChevronDown,
  Loader2
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

export default function DeveloperDashboard() {
  // Plan state (synced with localStorage or defaulted)
  const [activePlan, setActivePlan] = useState<"free" | "business" | "advanced">("free");
  const [billingInterval, setBillingInterval] = useState("monthly");
  const [developerEmail, setDeveloperEmail] = useState("developer@neuralpress.io");
  const [developerName, setDeveloperName] = useState("Guest Developer");
  
  // API Keys state
  const [apiKeys, setApiKeys] = useState<Array<{ id: string; key: string; name: string; created: string; active: boolean }>>([]);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Playground states
  const [selectedEndpoint, setSelectedEndpoint] = useState<"/api/news" | "/api/news/search">("/api/news");
  const [searchQuery, setSearchQuery] = useState("");
  const [newsLimit, setNewsLimit] = useState(3);
  const [langFilter, setLangFilter] = useState<"all" | "en" | "si">("all");
  const [isPlaying, setIsPlaying] = useState(false);
  const [playgroundResponse, setPlaygroundResponse] = useState<any>(null);
  const [playgroundError, setPlaygroundError] = useState<string | null>(null);
  const [rateLimitCounter, setRateLimitCounter] = useState(0);
  const [rateLimitTimer, setRateLimitTimer] = useState<number | null>(null);

  // Vector embeddings custom states (Advanced tier)
  const [selectedVectorIdx, setSelectedVectorIdx] = useState<number | null>(null);

  // Webhooks states
  const [webhookUrl, setWebhookUrl] = useState("https://api.myclient.com/neuralpress-receiver");
  const [registeredWebhooks, setRegisteredWebhooks] = useState<Array<{ id: string; url: string; events: string[]; created: string }>>([
    { id: "wh_1", url: "https://api.myclient.com/neuralpress-receiver", events: ["news.ingested", "translation.success"], created: "2026-05-29" }
  ]);
  const [selectedWebhookEvents, setSelectedWebhookEvents] = useState<string[]>(["news.ingested", "translation.success"]);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [webhookTestLogs, setWebhookTestLogs] = useState<string[]>([]);
  const [showWebhookAdd, setShowWebhookAdd] = useState(false);

  // Advanced ingestion customization states
  const [ingestionInterval, setIngestionInterval] = useState(15);
  const [topicGuidance, setTopicGuidance] = useState("Prioritize economic developments, policy changes, and central bank regulations. Group related treasury bond auctions and filter out duplicate press releases.");
  const [customFeedEndpoint, setCustomFeedEndpoint] = useState("https://api.srilankanews.lk/v1/feed");
  const [priorityTerms, setPriorityTerms] = useState<string>("Colombo, Inflation, Treasury Bonds, Election, CB Governor");
  const [sentimentThreshold, setSentimentThreshold] = useState<number>(0.65);

  // Global tab
  const [activeTab, setActiveTab] = useState<"overview" | "playground" | "webhooks" | "ingestion" | "billing">("overview");

  // Load persistence configurations client-side
  useEffect(() => {
    const savedPlan = localStorage.getItem("userPlan") as any;
    if (savedPlan) {
      setActivePlan(savedPlan);
    }
    const interval = localStorage.getItem("billingInterval") || "monthly";
    setBillingInterval(interval);
    const email = localStorage.getItem("billingEmail") || "developer@neuralpress.io";
    setDeveloperEmail(email);
    const name = localStorage.getItem("billingName") || "Nexus Developer";
    setDeveloperName(name);

    // Load or generate initial API Keys list
    const savedKeys = localStorage.getItem("apiKeysList");
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys));
    } else {
      const generated = [
        {
          id: "key_1",
          name: "Production Default Key",
          key: localStorage.getItem("apiKeySecret") || `np_live_sec_${Math.random().toString(36).substring(2, 10)}`,
          created: new Date().toISOString().split("T")[0],
          active: true
        }
      ];
      setApiKeys(generated);
      localStorage.setItem("apiKeysList", JSON.stringify(generated));
    }
  }, []);

  // Update keys in localStorage whenever keys change
  const saveKeysList = (updatedList: typeof apiKeys) => {
    setApiKeys(updatedList);
    localStorage.setItem("apiKeysList", JSON.stringify(updatedList));
  };

  // Switch sandbox active plans on the fly (Plan simulator)
  const handleSimulatedPlanSwitch = (tier: "free" | "business" | "advanced") => {
    setActivePlan(tier);
    localStorage.setItem("userPlan", tier);
  };

  // Generate new key
  const handleGenerateApiKey = () => {
    if (!newKeyName) return;
    const prefix = activePlan === "free" ? "np_free_" : "np_live_";
    const rand = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const newKeyItem = {
      id: `key_${Date.now()}`,
      name: newKeyName,
      key: `${prefix}${rand}`,
      created: new Date().toISOString().split("T")[0],
      active: true
    };
    const updated = [...apiKeys, newKeyItem];
    saveKeysList(updated);
    setNewKeyName("");
    setShowNewKeyModal(false);
  };

  // Delete/Revoke API key
  const handleRevokeKey = (keyId: string) => {
    const updated = apiKeys.filter((k) => k.id !== keyId);
    saveKeysList(updated);
  };

  // Copy Key Helper
  const handleCopyKey = (keyString: string, keyId: string) => {
    navigator.clipboard.writeText(keyString);
    setCopiedKeyId(keyId);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  // Execute Playground simulated or actual API call
  const handlePlaygroundSend = async () => {
    // 1. Check Rate Limit simulator for Free plan (5 RPM constraint)
    if (activePlan === "free") {
      setRateLimitCounter((prev) => {
        const nextVal = prev + 1;
        if (nextVal > 5) {
          setPlaygroundError("429 Too Many Requests - Sandbox rate limits exceeded. Free plan is limited to 5 RPM (Requests Per Minute).");
          setPlaygroundResponse(null);
          return nextVal;
        }
        return nextVal;
      });

      // Reset rate limit count after 60s (for RPM tracking)
      if (!rateLimitTimer) {
        const timer = setTimeout(() => {
          setRateLimitCounter(0);
          setRateLimitTimer(null);
        }, 60000) as any;
        setRateLimitTimer(timer);
      }
      
      if (rateLimitCounter >= 5) return;
    }

    setIsPlaying(true);
    setPlaygroundError(null);

    try {
      let results: any[] = [];
      if (selectedEndpoint === "/api/news/search") {
        const query = searchQuery || "Colombo";
        results = await searchNewsAction(query, newsLimit);
      } else {
        results = await fetchNews(0, newsLimit);
      }

      // Format response object dynamic layout based on active tier
      if (activePlan === "free") {
        // Truncate fields (Paywall display)
        const paywallScrubbed = results.map((article) => ({
          id: article.id || article._id,
          title: article.title,
          publishedAt: article.publishedAt || article.createdAt,
          originalSource: article.originalSource,
          sinhalaTitle: "[LOCKED - Upgrade to Business Plan to read Sinhala translation summary]",
          sinhalaContent: "[LOCKED - Upgrade to Business Plan to unlock full bilingual syntheses]",
          fullContent: "[LOCKED - Content summaries locked behind Business tier Paywall]",
          markdownContent: "[LOCKED - Upgrade to Business Plan to retrieve news in Markdown format]",
          url: article.url,
          conceptualScore: "[LOCKED - Upgrade to Advanced Plan to trace vector similarity scores]"
        }));
        setPlaygroundResponse({
          status: "200 OK",
          headers: {
            "Content-Type": "application/json",
            "x-rate-limit-remaining": `${Math.max(0, 5 - rateLimitCounter - 1)} / 5 (60s RPM window)`,
            "x-subscription-tier": "Free Plan (5h Old News Feed)",
            "x-realtime-connection": "SSE Disabled for Free tier"
          },
          payload: paywallScrubbed
        });
      } else if (activePlan === "business") {
        // Business returns fully parsed items
        const businessPayload = results.map((article) => ({
          id: article.id || article._id,
          title: article.title,
          publishedAt: article.publishedAt,
          originalSource: article.originalSource,
          categories: article.categories || ["General"],
          sinhalaTitle: article.sinhalaTitle || "මෘදුකාංග සිංහල සාරාංශය ලබා ගත නොහැක",
          sinhalaContent: article.sinhalaContent || "මෙම ලිපිය සඳහා සිංහල පරිවර්තන සාරාංශය සක්‍රීය නැත.",
          summary: article.summary || article.contentSnippet || "Full synthesized conceptual summarization",
          markdownContent: article.summary ? `### ${article.title}\n\n**Source:** ${article.originalSource}\n\n${article.summary}\n\n*Read more: [Original Article](${article.url})*` : "Markdown content retrieval failed",
          url: article.url,
          conceptualScore: "[LOCKED - Requires Advanced Plan for vector metadata]"
        }));
        setPlaygroundResponse({
          status: "200 OK",
          headers: {
            "Content-Type": "application/json",
            "x-rate-limit-remaining": "99,942 / 100,000 requests",
            "x-subscription-tier": "Business Plan (Real-Time SSE Stream active)",
            "x-delivery-latency": "145ms",
            "x-realtime-connection": "SSE Active (EventStream opened)"
          },
          payload: businessPayload
        });
      } else {
        // Advanced Plan unlocks everything + mock vector coordinates
        const advancedPayload = results.map((article, idx) => ({
          id: article.id || article._id,
          title: article.title,
          publishedAt: article.publishedAt,
          originalSource: article.originalSource,
          categories: article.categories || ["Economy"],
          sinhalaTitle: article.sinhalaTitle,
          sinhalaContent: article.sinhalaContent,
          summary: article.summary,
          markdownContent: article.summary ? `### ${article.title}\n\n**Source:** ${article.originalSource}\n\n${article.summary}\n\n*Read more: [Original Article](${article.url})*` : "Markdown content retrieval failed",
          url: article.url,
          vectorAnalysis: {
            dimensions: 768,
            embeddingsTrace: [0.0152, -0.0924, 0.4491, 0.1284, "...", -0.0451],
            similarityScore: parseFloat((0.85 + Math.random() * 0.14).toFixed(4)),
            coordinate2D: [Math.floor(Math.random() * 100), Math.floor(Math.random() * 100)]
          },
          pipelineTrace: {
            engineVersion: "v0.9.5-Advanced",
            ingestedVia: "BullMQ-Job-52",
            geminiTokenCost: article.summary ? 841 : 0
          }
        }));
        setPlaygroundResponse({
          status: "200 OK",
          headers: {
            "Content-Type": "application/json",
            "x-rate-limit-remaining": "Unlimited (Advanced Platform License)",
            "x-subscription-tier": "Advanced Plan",
            "x-delivery-latency": "42ms",
            "x-vector-search-engine": "Pinecone-Serverless"
          },
          payload: advancedPayload
        });
      }
    } catch (e: any) {
      setPlaygroundError(e.message || "Failed to contact database endpoint.");
    } finally {
      setIsPlaying(false);
    }
  };

  // Run a mock webhook test delivery
  const handleTestWebhookDelivery = () => {
    setIsTestingWebhook(true);
    setWebhookTestLogs([]);

    const steps = [
      "Queuing diagnostic task in BullMQ container...",
      `Connecting to target push url: ${webhookUrl}`,
      "Target host connected. Negotiating HTTPS handshake...",
      "Encoding standard JSON event payload [type: 'news.ingested']...",
      "Injecting signature security header 'x-neuralpress-signature'...",
      "Sending POST payload (2.4KB)...",
      "Response Received: [200 OK] in 184ms",
      "Webhooks diagnostic delivery verification complete! Diagnostic successful."
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setWebhookTestLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${step}`]);
        if (idx === steps.length - 1) {
          setIsTestingWebhook(false);
        }
      }, (idx + 1) * 400);
    });
  };

  // Calculate circular metric degrees
  const getPlanRequestData = () => {
    if (activePlan === "free") return { used: 42, max: 100, name: "Requests / day (5 RPM limit)" };
    if (activePlan === "business") return { used: 24512, max: 100000, name: "Requests / month (300 RPM limit)" };
    return { used: 358491, max: 1000000, name: "Requests / month (Unlimited)" };
  };

  const reqData = getPlanRequestData();
  const usagePercentage = Math.round((reqData.used / reqData.max) * 100);

  // Mock graph data for Recharts
  const chartData = [
    { name: "Mon", queries: activePlan === "free" ? 12 : activePlan === "business" ? 1420 : 12450, latency: 142 },
    { name: "Tue", queries: activePlan === "free" ? 18 : activePlan === "business" ? 2100 : 18900, latency: 138 },
    { name: "Wed", queries: activePlan === "free" ? 22 : activePlan === "business" ? 1980 : 19400, latency: 125 },
    { name: "Thu", queries: activePlan === "free" ? 14 : activePlan === "business" ? 2450 : 22100, latency: 154 },
    { name: "Fri", queries: activePlan === "free" ? 25 : activePlan === "business" ? 3120 : 25800, latency: 110 },
    { name: "Sat", queries: activePlan === "free" ? 38 : activePlan === "business" ? 1250 : 14200, latency: 98 },
    { name: "Sun", queries: activePlan === "free" ? 29 : activePlan === "business" ? 1421 : 16580, latency: 102 }
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-neutral-100 font-inter pb-24 overflow-x-hidden selection:bg-indigo-500/30 transition-colors duration-300">
      
      {/* Background neon glows */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-500/5 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-lime-400/5 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 relative z-10">
        
        {/* TOP LEVEL HEADER: Branding, Simulated Switcher Dropdown, Connection status */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-10 border-b border-white/[0.05] pb-6">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/main-logo-white.png" width={32} height={32} className="w-8 h-8 object-contain animate-pulse" alt="NeuralPress" />
              <span className="text-xl font-bold tracking-tight text-white">
                Neural<span className="text-[#2b86ff]">Press</span>
              </span>
            </Link>
            <div className="hidden sm:block w-[1px] h-6 bg-white/10" />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Developer Dashboard
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-[#2b86ff]/10 text-[#2b86ff] rounded border border-[#2b86ff]/20">
                  SANDBOX
                </span>
              </h1>
              <p className="text-xs text-neutral-400 font-light mt-0.5">Control API keys, query endpoints, and trace automated news pipelines.</p>
            </div>
          </div>

          {/* SIMULATOR PLAN SWITCHER PILL CAP */}
          <div className="flex flex-wrap items-center gap-4 bg-white/[0.02] border border-white/[0.05] p-2 rounded-2xl backdrop-blur-xl">
            <div className="flex items-center gap-1.5 pl-2 text-xs font-bold text-lime-400 font-mono">
              <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "6s" }} />
              <span>PLAN TESTER:</span>
            </div>
            
            <div className="flex gap-1">
              {["free", "business", "advanced"].map((tier) => (
                <button
                  key={tier}
                  onClick={() => handleSimulatedPlanSwitch(tier as any)}
                  className={`px-3 py-1.5 rounded-xl text-[10px] uppercase font-bold tracking-wider transition ${
                    activePlan === tier
                      ? "bg-indigo-600 text-white shadow"
                      : "text-neutral-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>

          {/* Connection tracers & Theme */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/pricing"
              className="text-[11px] font-bold bg-white/5 border border-white/10 hover:bg-white/10 px-4 py-2 rounded-full cursor-pointer transition text-neutral-300"
            >
              Plans Matrix
            </Link>
            <span className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              API Online
            </span>
          </div>
        </div>

        {/* DOUBLE COLUMN LAYOUT: LEFT SIDEBAR NAVIGATION & MAIN VIEW AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDEBAR CAP */}
          <div className="lg:col-span-3 bg-white/[0.01] border border-white/[0.05] rounded-3xl p-5 space-y-2 backdrop-blur-xl">
            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition ${
                activeTab === "overview"
                  ? "bg-[#2b86ff]/10 text-white border border-[#2b86ff]/20 font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <Key className="w-4 h-4 text-indigo-500" />
              Overview & API Keys
            </button>
            <button
              onClick={() => setActiveTab("playground")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition ${
                activeTab === "playground"
                  ? "bg-[#2b86ff]/10 text-white border border-[#2b86ff]/20 font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <span className="flex items-center gap-3">
                <Terminal className="w-4 h-4 text-lime-400" />
                API Playground
              </span>
              <span className="bg-lime-400/20 text-lime-400 text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded font-mono">
                LIVE
              </span>
            </button>
            <button
              onClick={() => setActiveTab("webhooks")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition ${
                activeTab === "webhooks"
                  ? "bg-[#2b86ff]/10 text-white border border-[#2b86ff]/20 font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <span className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-pink-500" />
                Webhooks Receiver
              </span>
              {activePlan === "free" && <Lock className="w-3 h-3 text-neutral-500 shrink-0" />}
            </button>
            <button
              onClick={() => setActiveTab("ingestion")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition ${
                activeTab === "ingestion"
                  ? "bg-[#2b86ff]/10 text-white border border-[#2b86ff]/20 font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <span className="flex items-center gap-3">
                <Cpu className="w-4 h-4 text-cyan-400" />
                Topic & Sentiment Filters
              </span>
              {activePlan !== "advanced" && <Lock className="w-3 h-3 text-neutral-500 shrink-0" />}
            </button>
            <button
              onClick={() => setActiveTab("billing")}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-semibold tracking-wide transition ${
                activeTab === "billing"
                  ? "bg-[#2b86ff]/10 text-white border border-[#2b86ff]/20 font-bold"
                  : "text-neutral-400 hover:text-white hover:bg-white/[0.02]"
              }`}
            >
              <span className="flex items-center gap-3">
                <CreditCard className="w-4 h-4 text-amber-500" />
                Billing & Sandbox Plan
              </span>
            </button>

            {/* Profile Recap Widget */}
            <div className="pt-4 mt-4 border-t border-white/5 space-y-1">
              <span className="text-[10px] font-mono text-neutral-500 block uppercase">DEVELOPER PROFILE</span>
              <p className="text-xs font-bold text-neutral-300 truncate">{developerName}</p>
              <p className="text-[10px] font-mono text-neutral-500 truncate">{developerEmail}</p>
            </div>
          </div>

          {/* MAIN WORKSPACE CONTENT PANEL */}
          <div className="lg:col-span-9 space-y-8">
            
            {/* ========================================================================= */}
            {/* TAB 1: OVERVIEW & API KEYS VIEW */}
            {/* ========================================================================= */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* 3 Metric Cards and Capped Requests chart */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                  
                  {/* Gauge circular cap chart */}
                  <div className="md:col-span-4 bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 flex flex-col items-center justify-between text-center backdrop-blur-xl">
                    <div className="w-full flex justify-between text-[10px] font-mono text-neutral-400 tracking-wider">
                      <span>PLAN CAP INDEX</span>
                      <span className="text-indigo-400 uppercase font-bold">{activePlan}</span>
                    </div>

                    {/* SVG Gauge */}
                    <div className="relative w-32 h-32 my-6 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                        <motion.circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke={activePlan === "free" ? "#a3e635" : activePlan === "business" ? "#2b86ff" : "#8b5cf6"}
                          strokeWidth="8"
                          fill="transparent"
                          strokeDasharray="251.2"
                          initial={{ strokeDashoffset: 251.2 }}
                          animate={{ strokeDashoffset: 251.2 - (251.2 * usagePercentage) / 100 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-2xl font-black font-mono tracking-tighter text-white">
                          {usagePercentage}%
                        </span>
                        <span className="text-[8px] text-neutral-500 block uppercase font-mono tracking-wider font-semibold">
                          OF TOTAL LIMIT
                        </span>
                      </div>
                    </div>

                    <div className="w-full text-xs font-medium">
                      <span className="text-neutral-400">Usage Trace:</span>{" "}
                      <span className="text-white font-mono font-bold">
                        {reqData.used.toLocaleString()} / {reqData.max === 1000000 ? "1M+" : reqData.max.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* API Usage Recharts graph */}
                  <div className="md:col-span-8 bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-[#2b86ff]" />
                        <h3 className="font-semibold text-white text-sm">Hourly Request Volume</h3>
                      </div>
                      <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-mono">
                        LATENCY: {activePlan === "free" ? "142ms" : activePlan === "business" ? "88ms" : "32ms"}
                      </span>
                    </div>

                    <div className="w-full h-[180px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="queryGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2b86ff" stopOpacity={0.2} />
                              <stop offset="95%" stopColor="#2b86ff" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" stroke="#6b7280" fontSize={9} tickLine={false} axisLine={false} />
                          <YAxis stroke="#6b7280" fontSize={9} tickLine={false} axisLine={false} />
                          <Tooltip
                            contentStyle={{
                              background: "rgba(10, 15, 25, 0.9)",
                              border: "1px solid rgba(255, 255, 255, 0.05)",
                              borderRadius: "12px",
                              color: "#fff",
                              fontSize: "11px",
                              boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
                            }}
                          />
                          <Area type="monotone" dataKey="queries" stroke="#2b86ff" strokeWidth={2} fill="url(#queryGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                </div>

                {/* API KEYS MANAGER LIST */}
                <div className="bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl space-y-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Key className="w-4.5 h-4.5 text-indigo-500 animate-pulse" />
                      <h3 className="font-bold text-white tracking-tight">Active API Credentials</h3>
                    </div>
                    <button
                      onClick={() => setShowNewKeyModal(true)}
                      className="flex items-center gap-1 bg-[#2b86ff] hover:bg-[#1e76ed] text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl transition"
                    >
                      <Plus className="w-3.5 h-3.5" /> Generate Key
                    </button>
                  </div>

                  <div className="overflow-hidden border border-white/5 rounded-2xl">
                    <div className="divide-y divide-white/5 bg-black/20">
                      {apiKeys.map((keyObj) => (
                        <div key={keyObj.id} className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-white/[0.01] transition">
                          <div className="space-y-1">
                            <span className="text-xs font-semibold text-white block">{keyObj.name}</span>
                            <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 bg-white/5 px-2 py-0.5 rounded border border-white/5 max-w-full overflow-x-auto">
                              <span>{keyObj.key}</span>
                              <button
                                onClick={() => handleCopyKey(keyObj.key, keyObj.id)}
                                className="text-[#2b86ff] hover:text-white transition shrink-0 ml-1.5 focus:outline-none"
                              >
                                {copiedKeyId === keyObj.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                            <span className="text-[9px] font-mono text-neutral-500 block">Created: {keyObj.created}</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-[9px] font-mono bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                              ACTIVE
                            </span>
                            <button
                              onClick={() => handleRevokeKey(keyObj.id)}
                              className="text-[10px] font-bold text-rose-500 hover:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 px-3 py-1.5 rounded-lg border border-rose-500/10 transition"
                            >
                              Revoke
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* MODAL FOR NEW KEY GENERATION */}
                <AnimatePresence>
                  {showNewKeyModal && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-[#0f172a] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative space-y-4"
                      >
                        <h4 className="font-bold text-white text-base">Generate API Sandbox Key</h4>
                        <p className="text-xs text-neutral-400">Give your token a descriptive name so you can track request allocations.</p>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block">Key Reference Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Test Sandbox Environment"
                            value={newKeyName}
                            onChange={(e) => setNewKeyName(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#2b86ff]"
                          />
                        </div>
                        <div className="flex gap-3 justify-end pt-2">
                          <button
                            onClick={() => setShowNewKeyModal(false)}
                            className="px-3.5 py-2 hover:bg-white/5 rounded-xl text-xs text-neutral-400 transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleGenerateApiKey}
                            disabled={!newKeyName}
                            className="px-4 py-2 bg-[#2b86ff] hover:bg-[#1e76ed] disabled:opacity-50 text-white text-xs font-bold rounded-xl transition"
                          >
                            Generate
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 2: INTERACTIVE API PLAYGROUND VIEW */}
            {/* ========================================================================= */}
            {activeTab === "playground" && (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                
                {/* Playground controller parameters (Left) */}
                <div className="xl:col-span-5 bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl space-y-5">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4.5 h-4.5 text-lime-400 animate-pulse" />
                    <h3 className="font-bold text-white tracking-tight">API Request Sandbox</h3>
                  </div>

                  {/* Endpoint Select */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block">Target Endpoint</label>
                    <select
                      value={selectedEndpoint}
                      onChange={(e) => setSelectedEndpoint(e.target.value as any)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none transition cursor-pointer"
                    >
                      <option value="/api/news">GET /news (Recent Ingestion Feed)</option>
                      <option value="/api/news/search">GET /news/search (Conceptual search query)</option>
                    </select>
                  </div>

                  {/* Query input (visible only on search) */}
                  {selectedEndpoint === "/api/news/search" && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block">Conceptual Query string</label>
                      <div className="relative">
                        <Search className="absolute left-3.5 top-3 w-4 h-4 text-neutral-500" />
                        <input
                          type="text"
                          placeholder="e.g. rising prices, inflation or fuel crisis..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Numerical limits */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block">Articles Limit</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={newsLimit}
                      onChange={(e) => setNewsLimit(parseInt(e.target.value) || 1)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none font-mono"
                    />
                  </div>

                  {/* Billing dependent restrictions indicators */}
                  <div className="space-y-1.5 border-t border-white/5 pt-4">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block mb-2">Filters Locked Status</span>
                    
                    {/* Bilingual toggle */}
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-neutral-400">Bilingual translations syntheses</span>
                      {activePlan === "free" ? (
                        <span className="flex items-center gap-1.5 text-amber-500 font-mono text-[9px] uppercase bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                          <Lock className="w-2.5 h-2.5" /> LOCKED
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[9px] uppercase bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                          <CheckCircle className="w-2.5 h-2.5" /> UNLOCKED
                        </span>
                      )}
                    </div>

                    {/* Markdown delivery */}
                    <div className="flex justify-between items-center text-xs font-semibold mt-3">
                      <span className="text-neutral-400">Markdown formatted delivery</span>
                      {activePlan === "free" ? (
                        <span className="flex items-center gap-1.5 text-amber-500 font-mono text-[9px] uppercase bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                          <Lock className="w-2.5 h-2.5" /> LOCKED
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[9px] uppercase bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                          <CheckCircle className="w-2.5 h-2.5" /> UNLOCKED
                        </span>
                      )}
                    </div>

                    {/* Vectors tracer */}
                    <div className="flex justify-between items-center text-xs font-semibold mt-3">
                      <span className="text-neutral-400">Semantic traces coordinates</span>
                      {activePlan !== "advanced" ? (
                        <span className="flex items-center gap-1.5 text-amber-500 font-mono text-[9px] uppercase bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-full">
                          <Lock className="w-2.5 h-2.5" /> LOCKED
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[#2b86ff] font-mono text-[9px] uppercase bg-[#2b86ff]/10 border border-[#2b86ff]/20 px-2.5 py-0.5 rounded-full">
                          <CheckCircle className="w-2.5 h-2.5" /> ADVANCED ACTIVE
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Send Query CTA */}
                  <button
                    onClick={handlePlaygroundSend}
                    disabled={isPlaying}
                    className="w-full py-3.5 bg-lime-400 text-slate-900 hover:bg-lime-300 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isPlaying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Execute Request
                  </button>
                </div>

                {/* Playground terminal response viewer (Right) */}
                <div className="xl:col-span-7 bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs uppercase font-bold text-neutral-400 font-mono">Response trace console</span>
                    {playgroundResponse && (
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded">
                        {playgroundResponse.status}
                      </span>
                    )}
                  </div>

                  <div className="bg-black/50 border border-white/5 rounded-2xl p-5 font-mono text-[11px] overflow-hidden min-h-[300px] flex flex-col justify-between relative">
                    
                    {/* Playground Output */}
                    <div className="flex-1 overflow-auto max-h-[360px] scrollbar-thin scrollbar-thumb-white/10 pr-2">
                      {isPlaying && (
                        <div className="h-full w-full flex flex-col items-center justify-center text-neutral-500 gap-3 py-16">
                          <Loader2 className="w-8 h-8 animate-spin text-lime-400" />
                          <span>Polling production news api server...</span>
                        </div>
                      )}

                      {playgroundError && (
                        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 flex gap-2">
                          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                          <p className="font-sans leading-relaxed">{playgroundError}</p>
                        </div>
                      )}

                      {!isPlaying && !playgroundError && !playgroundResponse && (
                        <div className="h-full w-full flex flex-col items-center justify-center text-neutral-500 gap-2 py-20 text-center font-sans">
                          <Terminal className="w-10 h-10 text-neutral-600 mb-2" />
                          <span className="font-semibold text-xs">Sandbox Inactive</span>
                          <span className="text-[10px] max-w-[250px]">Choose endpoints and parameters, then hit execute to verify standard API responses.</span>
                        </div>
                      )}

                      {!isPlaying && !playgroundError && playgroundResponse && (
                        <pre className="text-lime-400 whitespace-pre-wrap select-all">
                          {JSON.stringify(playgroundResponse, null, 2)}
                        </pre>
                      )}
                    </div>

                    {/* Integrated dynamic coordinates visualizer (Advanced coordinate map) */}
                    {activePlan === "advanced" && playgroundResponse && (
                      <div className="mt-4 pt-4 border-t border-white/5 bg-[#0b0e14] rounded-2xl p-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase font-mono tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-[#2b86ff]" />
                            Interactive Similarity Document Vector Coordinates Map
                          </span>
                          <span className="text-[8px] font-mono text-neutral-500 bg-neutral-900 border border-white/5 px-2 py-0.5 rounded">
                            Cosine Similarity (1.0 = exact match)
                          </span>
                        </div>

                        {/* Visual coordinates dot grids */}
                        <div className="w-full h-[120px] bg-black/60 rounded-xl border border-white/5 relative overflow-hidden flex items-center justify-center select-none">
                          <div className="absolute inset-0 grid grid-cols-10 grid-rows-6 pointer-events-none opacity-20">
                            {Array.from({ length: 60 }).map((_, idx) => (
                              <div key={idx} className="border-b border-r border-white/10" />
                            ))}
                          </div>

                          {/* Coordinates bubbles */}
                          {playgroundResponse.payload.map((article: any, idx: number) => {
                            const [x, y] = article.vectorAnalysis?.coordinate2D || [20, 30];
                            const isSelected = selectedVectorIdx === idx;
                            return (
                              <button
                                key={idx}
                                onClick={() => setSelectedVectorIdx(isSelected ? null : idx)}
                                className={`absolute rounded-full transition-all duration-300 ${
                                  isSelected 
                                    ? "w-7 h-7 bg-indigo-500 border-2 border-white ring-4 ring-indigo-500/30 z-20" 
                                    : "w-4 h-4 bg-[#2b86ff] hover:bg-[#5da0ff] border border-white/20 hover:scale-125 hover:z-10 cursor-pointer"
                                }`}
                                style={{ left: `${10 + (x % 80)}%`, top: `${15 + (y % 70)}%` }}
                              />
                            );
                          })}

                          {/* Float details panel */}
                          {selectedVectorIdx !== null && playgroundResponse.payload[selectedVectorIdx] && (
                            <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 backdrop-blur border border-white/10 rounded-lg p-2.5 z-30 font-sans text-[10px] leading-relaxed flex flex-col gap-0.5">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-white truncate max-w-[220px]">
                                  {playgroundResponse.payload[selectedVectorIdx].title}
                                </span>
                                <span className="font-mono text-[#2b86ff] font-bold">
                                  Similarity: {playgroundResponse.payload[selectedVectorIdx].vectorAnalysis?.similarityScore}
                                </span>
                              </div>
                              <code className="text-[9px] font-mono text-lime-400 block mt-0.5 truncate">
                                Embeddings Vector: [{playgroundResponse.payload[selectedVectorIdx].vectorAnalysis?.embeddingsTrace.join(", ")}]
                              </code>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 3: WEBHOOKS DIAGNOSTIC PANELS VIEW */}
            {/* ========================================================================= */}
            {activeTab === "webhooks" && (
              <div className="relative">
                {/* Paywall blur mask for Free Plan */}
                {activePlan === "free" && (
                  <div className="absolute inset-0 bg-[#07090e]/80 backdrop-blur-md rounded-3xl z-30 flex flex-col justify-center items-center p-8 text-center border border-white/[0.05]">
                    <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20 mb-4 animate-pulse">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Webhooks locked on Free Plan</h3>
                    <p className="text-xs text-neutral-400 max-w-sm mt-2 leading-relaxed">
                      Upgrade your subscription sandbox to Business or Advanced tier to configure webhook urls, push payloads conceptually, and execute delivery tests.
                    </p>
                    <button
                      onClick={() => handleSimulatedPlanSwitch("business")}
                      className="mt-6 px-6 py-3 bg-[#2b86ff] hover:bg-[#1e76ed] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer"
                    >
                      Instant Upgrade to Business Sandbox
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  
                  {/* Webhook endpoint configurations (Left) */}
                  <div className="xl:col-span-5 bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl space-y-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4.5 h-4.5 text-pink-500" />
                        <h3 className="font-bold text-white tracking-tight">Active Push Endpoints</h3>
                      </div>
                      <button
                        onClick={() => setShowWebhookAdd(true)}
                        className="p-1 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition"
                      >
                        <PlusCircle className="w-4 h-4 text-neutral-400 hover:text-white" />
                      </button>
                    </div>

                    {/* Listing existing webhook urls */}
                    <div className="space-y-3.5">
                      {registeredWebhooks.map((wh) => (
                        <div key={wh.id} className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-mono text-neutral-500 uppercase">SUBSCRIBED Webhook</span>
                            <button
                              onClick={() => setRegisteredWebhooks(registeredWebhooks.filter(w => w.id !== wh.id))}
                              className="text-[9px] font-bold text-rose-500 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                          <code className="text-xs text-white block font-mono truncate">{wh.url}</code>
                          
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {wh.events.map((ev) => (
                              <span key={ev} className="bg-white/5 border border-white/5 text-[9px] font-mono px-2 py-0.5 rounded text-neutral-400">
                                {ev}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Test delivery triggers controller */}
                    <div className="space-y-4 border-t border-white/5 pt-5">
                      <h4 className="text-xs uppercase font-bold text-neutral-400 font-mono">Test Delivery sandbox</h4>
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block">Deliver to URL</label>
                        <input
                          type="text"
                          value={webhookUrl}
                          onChange={(e) => setWebhookUrl(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none"
                        />
                      </div>

                      <button
                        onClick={handleTestWebhookDelivery}
                        disabled={isTestingWebhook}
                        className="w-full py-3.5 bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {isTestingWebhook ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Trigger Diagnostic Event
                      </button>
                    </div>
                  </div>

                  {/* Webhook live deliveries diagnostics logs (Right) */}
                  <div className="xl:col-span-7 bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl space-y-4">
                    <span className="text-xs uppercase font-bold text-neutral-400 font-mono">Real-Time Webhook diagnostic telemetry</span>
                    
                    <div className="bg-black/50 border border-white/5 rounded-2xl p-5 font-mono text-[10px] min-h-[300px] flex flex-col justify-between">
                      <div className="flex-1 overflow-auto max-h-[350px] space-y-2.5">
                        {webhookTestLogs.length === 0 && (
                          <div className="h-full w-full flex flex-col items-center justify-center text-neutral-500 gap-2 py-24 text-center font-sans">
                            <Activity className="w-10 h-10 text-neutral-600 mb-2" />
                            <span className="font-semibold text-xs">Diagnostic Console Idle</span>
                            <span className="text-[10px] max-w-[250px]">Click 'Trigger Diagnostic Event' to test webhook HTTP requests, header signatures, and response payloads.</span>
                          </div>
                        )}
                        
                        {webhookTestLogs.map((log, lIdx) => (
                          <div key={lIdx} className="text-lime-400/90 whitespace-pre-wrap leading-relaxed">
                            {log}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Webhook adding form modal */}
                <AnimatePresence>
                  {showWebhookAdd && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                      <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        className="bg-[#0f172a] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative space-y-4"
                      >
                        <h4 className="font-bold text-white text-base">Add Webhook Receiver</h4>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block">Payload Target URL</label>
                            <input
                              type="url"
                              value={webhookUrl}
                              onChange={(e) => setWebhookUrl(e.target.value)}
                              placeholder="https://api.domain.com/receiver"
                              className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 block">Triggering Events</label>
                            <div className="space-y-2 text-xs">
                              {["news.ingested", "translation.success", "aggregator.rate_limit_warning"].map(ev => {
                                const active = selectedWebhookEvents.includes(ev);
                                return (
                                  <label key={ev} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={active}
                                      onChange={() => {
                                        if (active) {
                                          setSelectedWebhookEvents(selectedWebhookEvents.filter(x => x !== ev));
                                        } else {
                                          setSelectedWebhookEvents([...selectedWebhookEvents, ev]);
                                        }
                                      }}
                                    />
                                    <span className="font-mono text-neutral-300">{ev}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3 justify-end pt-2">
                          <button
                            onClick={() => setShowWebhookAdd(false)}
                            className="px-3.5 py-2 hover:bg-white/5 rounded-xl text-xs text-neutral-400 transition"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              const newWhItem = {
                                id: `wh_${Date.now()}`,
                                url: webhookUrl,
                                events: selectedWebhookEvents,
                                created: new Date().toISOString().split("T")[0]
                              };
                              setRegisteredWebhooks([...registeredWebhooks, newWhItem]);
                              setShowWebhookAdd(false);
                            }}
                            className="px-4 py-2 bg-[#2b86ff] hover:bg-[#1e76ed] text-white text-xs font-bold rounded-xl transition"
                          >
                            Register Endpoint
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 4: CUSTOM INGESTION / TOPIC & SENTIMENT FILTERS (Advanced Plan) */}
            {/* ========================================================================= */}
            {activeTab === "ingestion" && (
              <div className="relative">
                {/* Paywall mask for Free & Business Plans */}
                {activePlan !== "advanced" && (
                  <div className="absolute inset-0 bg-[#07090e]/80 backdrop-blur-md rounded-3xl z-30 flex flex-col justify-center items-center p-8 text-center border border-white/[0.05]">
                    <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-500 border border-indigo-500/20 mb-4 animate-pulse">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Topic Mappings & Relevance Engine is Locked</h3>
                    <p className="text-xs text-neutral-400 max-w-sm mt-2 leading-relaxed">
                      Configuring live ingestion priority keywords, custom stream sources, and topic/sentiment relevance rules requires a licensed sandbox in the **Advanced Plan** tier.
                    </p>
                    <button
                      onClick={() => handleSimulatedPlanSwitch("advanced")}
                      className="mt-6 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer"
                    >
                      Instant Upgrade to Advanced Sandbox
                    </button>
                  </div>
                )}

                <div className="bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 sm:p-8 backdrop-blur-xl space-y-6">
                  <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                    <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <div>
                      <h3 className="font-bold text-white text-base">Topic Mappings & Relevance Engine</h3>
                      <p className="text-[11px] text-neutral-400 mt-0.5">Configure live ingestion priority keywords, custom stream sources, and sentiment thresholds.</p>
                    </div>
                  </div>

                  <div className="space-y-5">
                    
                    {/* Prompt instructions customized form */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-neutral-300 flex justify-between items-center">
                        <span>Topic Ingestion & Classification Guidance</span>
                        <span className="text-[9px] font-mono text-neutral-500 bg-neutral-900 border border-white/5 px-2 py-0.5 rounded">
                          System Ingestion Guidance
                        </span>
                      </label>
                      <textarea
                        rows={4}
                        value={topicGuidance}
                        onChange={(e) => setTopicGuidance(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#2b86ff] leading-relaxed font-mono"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      
                      {/* Ingestion Feed Target */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-300">Custom Ingestion Source URL</label>
                        <input
                          type="url"
                          value={customFeedEndpoint}
                          onChange={(e) => setCustomFeedEndpoint(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-mono focus:outline-none"
                        />
                      </div>

                      {/* Ingestion interval slider */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-300 flex justify-between">
                          <span>Ingestion Stream Poll Interval</span>
                          <span className="text-[#2b86ff] font-mono">{ingestionInterval} minutes</span>
                        </label>
                        <input
                          type="range"
                          min={1}
                          max={60}
                          value={ingestionInterval}
                          onChange={(e) => setIngestionInterval(parseInt(e.target.value) || 1)}
                          className="w-full accent-indigo-500 bg-white/5 rounded-lg h-2 mt-3 cursor-pointer"
                        />
                      </div>

                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {/* Focus Term keyword priority filters */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-300">Semantic Focus Key-Terms (Comma-separated)</label>
                        <input
                          type="text"
                          value={priorityTerms}
                          onChange={(e) => setPriorityTerms(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs text-white font-mono focus:outline-none"
                        />
                      </div>

                      {/* Sentiment Threshold Slider */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-neutral-300 flex justify-between">
                          <span>Sentiment Match Confidence Threshold</span>
                          <span className="text-lime-400 font-mono">{(sentimentThreshold * 100).toFixed(0)}% Match</span>
                        </label>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={sentimentThreshold * 100}
                          onChange={(e) => setSentimentThreshold(parseFloat(e.target.value) / 100 || 0)}
                          className="w-full accent-lime-400 bg-white/5 rounded-lg h-2 mt-3 cursor-pointer"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => alert("Ingestion priority and relevance parameters updated successfully! Processing pipeline has re-indexed.")}
                      className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition"
                    >
                      Apply Parameters Updates
                    </button>

                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* TAB 5: BILLING & INVOICES VIEW */}
            {/* ========================================================================= */}
            {activeTab === "billing" && (
              <div className="space-y-8">
                
                {/* Simulated Invoice parameters details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                  
                  {/* Current Active billing state */}
                  <div className="bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl flex flex-col justify-between">
                    <div className="space-y-4">
                      <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">CURRENT SUBSCRIPTION</span>
                      
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-2xl font-black text-white leading-none">
                            {activePlan === "free" ? "Free Tier License" : activePlan === "business" ? "Business Platform" : "Advanced Semantic Cloud"}
                          </h4>
                          <span className="text-xs font-mono text-neutral-400 block mt-2">
                            Interval: {billingInterval === "annual" ? "Annual Save 20%" : "Monthly recurring billing"}
                          </span>
                        </div>
                        <span className="bg-[#2b86ff]/10 text-[#2b86ff] border border-[#2b86ff]/20 text-[9px] uppercase font-mono px-3 py-1 rounded-full">
                          {activePlan === "free" ? "Free" : "Premium"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex gap-4 mt-6">
                      <Link
                        href="/pricing"
                        className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-50 text-xs font-bold rounded-xl transition"
                      >
                        Modify / Change Plan
                      </Link>
                      {activePlan !== "free" && (
                        <button
                          onClick={() => {
                            if (confirm("Cancel sandbox subscription? Plan features will reset back to Free tier.")) {
                              handleSimulatedPlanSwitch("free");
                            }
                          }}
                          className="px-5 py-2.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 hover:bg-rose-500/20 text-xs font-bold rounded-xl transition"
                        >
                          Cancel Subscription
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Payment Details simulator */}
                  <div className="bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl space-y-4">
                    <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider block">PAYMENT INFORMATION</span>
                    
                    <div className="flex items-center gap-4 bg-black/40 border border-white/5 p-4 rounded-2xl">
                      <div className="w-12 h-8 bg-slate-800 rounded flex items-center justify-center text-white font-mono font-bold text-xs border border-white/10 shrink-0">
                        VISA
                      </div>
                      <div>
                        <span className="text-xs font-semibold text-white block">Visa Ending in •••• 4242</span>
                        <span className="text-[10px] font-mono text-neutral-500">Exp: 12/29 • Holder: {developerName}</span>
                      </div>
                    </div>

                    <div className="text-xs text-neutral-400 font-light leading-relaxed bg-amber-500/[0.02] border border-amber-500/10 p-3.5 rounded-2xl">
                      <strong>Billing Notice:</strong> Automatic sandbox renewal invoices will execute on the 29th of each month. Invoices download as diagnostic mockup files.
                    </div>
                  </div>

                </div>

                {/* Mock Billing statements receipts */}
                <div className="bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 backdrop-blur-xl space-y-6">
                  <span className="text-xs uppercase font-bold text-neutral-400 font-mono tracking-wider">Invoices & Statements History</span>

                  <div className="overflow-hidden border border-white/5 rounded-2xl text-xs">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-black/35 border-b border-white/5 text-neutral-400 font-mono text-[9px] uppercase">
                          <th className="p-4">Invoice ID</th>
                          <th className="p-4">Billing Date</th>
                          <th className="p-4 text-center">Plan</th>
                          <th className="p-4 text-center">Total Paid</th>
                          <th className="p-4 text-right">Receipt</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 font-mono text-neutral-300">
                        <tr>
                          <td className="p-4 font-semibold text-white">#NP-INV-2026-0529</td>
                          <td className="p-4">May 29, 2026</td>
                          <td className="p-4 text-center uppercase font-bold">{activePlan}</td>
                          <td className="p-4 text-center font-bold text-emerald-400">
                            ${activePlan === "free" ? 0 : activePlan === "business" ? (billingInterval === "annual" ? 180 : 19) : (billingInterval === "annual" ? 468 : 49)}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => alert("Mock invoice PDF download complete.")}
                              className="text-[#2b86ff] hover:underline"
                            >
                              Download PDF
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
