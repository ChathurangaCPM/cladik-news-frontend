"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/custom/landing/Footer";
import { ThemeToggle } from "@/components/custom/news/ThemeToggle";
import {
  ArrowRight,
  Database,
  Brain,
  Network,
  Share2,
  Cpu,
  Terminal,
  Code2,
  Layers,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const pipelineSteps = [
    {
      id: 0,
      title: "1. Real-Time Ingestion",
      shortTitle: "Ingestion",
      icon: <Database className="w-5 h-5 text-blue-500" />,
      tagline: "Loading clean article text at the source",
      description:
        "Our own proprietary search engine continuously crawls and monitors over 150 global publications and official feeds. We load the article contents and automatically filter out cookie banners, ads, sidebars, and navigation noise, keeping only the main news content.",
      details: [
        "Automated web loaders managed by our proprietary search engine",
        "Pure content extraction to isolate the main story text",
        "Support for diverse global news sites and digital publications",
        "Automatic language detection and metadata tagging during crawling",
      ],
      codeSnippet: `// Ingestion Output
{
  "source": "Global Tech News",
  "url": "https://example.com/energy-milestone",
  "status": "success",
  "cleanTextCharacters": 14200,
  "language": "en"
}`,
    },
    {
      id: 1,
      title: "2. AI Content Enrichment",
      shortTitle: "Enrichment",
      icon: <Brain className="w-5 h-5 text-purple-500" />,
      tagline: "AI-powered article enrichment",
      description:
        "Once the clean text is retrieved, we pass it through our AI enrichment pipeline using advanced language models like Gemini. The engine automatically extracts key actors, locations, organizations, and sentiment, generating high-quality summaries in multiple languages.",
      details: [
        "Categorizing topics and setting search priorities automatically",
        "Dual-language summaries and translations (English and Sinhala)",
        "Identifying key entities (people, companies, and organizations)",
        "Tagging high-importance breaking news based on contextual signals",
      ],
      codeSnippet: `// AI Enrichment Output
{
  "sentiment": "positive",
  "importanceScore": 88,
  "isBreakingNews": true,
  "summary": {
    "en": "Major grid networks integrated record levels of solar capacity...",
    "si": "ප්‍රධාන බලශක්ති ජාලයන් වාර්තාගත සූර්ය බලශක්ති ප්‍රමාණයක් ඒකාබද්ධ කර ඇත..."
  }
}`,
    },
    {
      id: 2,
      title: "3. Semantic Connections",
      shortTitle: "Smart Mapping",
      icon: <Network className="w-5 h-5 text-emerald-500" />,
      tagline: "Mapping related themes conceptually",
      description:
        "To enable smart searches that go beyond simple keywords, our pipeline converts text into semantic mathematical representations. This lets our search index determine how stories relate to each other, so you can find relevant articles by concept even if they use different words.",
      details: [
        "AI-powered theme mapping for conceptual matching",
        "Low-latency index matching for instant results",
        "Concept linking (e.g., a search for 'energy shortage' matches 'power grid blackouts')",
        "Smart grouping to keep related stories organized together",
      ],
      codeSnippet: `// Semantic AI Mapping
{
  "searchConcept": "clean energy transitions",
  "relatedThemes": [
    "solar capacity",
    "grid storage standards",
    "battery expansion"
  ],
  "matchConfidence": "94.5%"
}`,
    },
    {
      id: 3,
      title: "4. Citation & Deduplication",
      shortTitle: "Citation",
      icon: <Share2 className="w-5 h-5 text-amber-500" />,
      tagline: "Grouping reports into a single news event",
      description:
        "Different publications crawled by our own proprietary search engine write about the same events. Our system calculates cross-article similarities, clustering duplicates. We build a citation graph mapping secondary reporting back to primary coverage, with direct links and confidence scores.",
      details: [
        "Grouping similar stories automatically",
        "Deduplicating feeds to keep articles unique",
        "Mapping secondary sources back to primary coverage",
        "Clean reference lists with source URLs and crawler timestamps",
      ],
      codeSnippet: `// Citation Grouping
{
  "primarySource": {
    "title": "Grid Storage Integration Standards",
    "url": "https://example.com/grid-standards"
  },
  "additionalSourcesCount": 3,
  "citationUrls": [
    "https://example.com/battery-expansion",
    "https://example.com/solar-integration"
  ]
}`,
    },
    {
      id: 4,
      title: "5. Real-Time Streaming",
      shortTitle: "Streaming",
      icon: <Cpu className="w-5 h-5 text-indigo-500" />,
      tagline: "Server-Sent Events & Webhooks",
      description:
        "The finalized structured JSON indexed by our own proprietary search engine is dispatched instantly. Developers can subscribe to our low-latency Server-Sent Events (SSE) stream for real-time reads, or configure custom webhooks to receive payloads automatically when specific topic filters trigger.",
      details: [
        "Live data stream for instant feed updates",
        "Custom webhook configurations for immediate notifications",
        "Interactive developer sandbox for testing API responses",
        "Secure API key access and rate-limiting options",
      ],
      codeSnippet: `// Real-Time Event Payload
{
  "eventId": "news_event_8f4b23a9d71c",
  "title": "Grid Decarbonization Milestones",
  "publishDate": "2026-06-03T17:15:00Z",
  "type": "technology"
}`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#fafbfe] dark:bg-[#07090e] text-slate-800 dark:text-neutral-100 transition-colors duration-300 overflow-x-hidden selection:bg-indigo-500/30 pb-20 relative">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#2b86ff]/10 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-lime-400/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Modern Capsule Navigation bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <header className="bg-white/70 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/[0.05] shadow-[0_10px_30px_rgba(0,0,0,0.02)] backdrop-blur-xl h-20 rounded-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/main-logo.png"
                width={36}
                height={36}
                className="w-8 h-8 object-contain logo-light"
                alt="NeuralPress"
              />
              <Image
                src="/main-logo-white.png"
                width={36}
                height={36}
                className="w-8 h-8 object-contain logo-dark"
                alt="NeuralPress"
              />
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Neural<span className="text-indigo-600">Press</span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-600 dark:text-neutral-300">
            <Link
              href="/developer/news"
              className="hover:text-indigo-600 dark:hover:text-white transition"
            >
              Discovery Feed
            </Link>
            <Link
              href="/how-it-works"
              className="text-indigo-600 dark:text-white transition font-bold"
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              className="hover:text-indigo-600 dark:hover:text-white transition"
            >
              API Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/developer"
              className="px-5 py-2.5 rounded-full text-xs bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/10 hover:scale-[1.02] transition-all"
            >
              Developer Dashboard
            </Link>
          </div>
        </header>
      </div>

      {/* Hero Headline content */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 text-center">
        <span className="text-xs uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
          Technical Architecture
        </span>
        <h1 className="text-3xl md:text-5xl tracking-[-3px] mt-3 text-slate-900 leading-tight">
          Behind the{" "}
          <span className="font-light font-heading italic text-[#2b86ff]">
            News Pipeline
          </span>
        </h1>
        <p className="text-slate-500 dark:text-neutral-400 text-base max-w-2xl mx-auto mt-6 font-light leading-relaxed">
          NeuralPress indexes global news worldwide using our own proprietary
          search engine, automating the ingestion, AI enrichment, semantic
          indexing, and deduplication to deliver high-precision structured data
          for LLM and agent applications.
        </p>
      </section>

      {/* Main Interactive Timeline Section */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        {/* Step Tabs selector */}
        <div className="flex justify-center border-b border-slate-200/50 dark:border-white/[0.05] pb-px overflow-x-auto gap-4 md:gap-8 no-scrollbar">
          {pipelineSteps.map((step) => (
            <button
              key={step.id}
              onClick={() => setActiveTab(step.id)}
              className={`pb-4 text-xs md:text-sm font-semibold transition-all relative shrink-0 flex items-center gap-2 cursor-pointer ${
                activeTab === step.id
                  ? "text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-600 dark:border-indigo-400"
                  : "text-slate-400 dark:text-zinc-500 hover:text-slate-600 dark:hover:text-neutral-300"
              }`}
            >
              {step.icon}
              {step.shortTitle}
            </button>
          ))}
        </div>

        {/* Tab content viewer */}
        <div className="mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
            >
              {/* Left Side details */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="text-xs font-mono uppercase text-slate-400 dark:text-zinc-500">
                    {pipelineSteps[activeTab].tagline}
                  </span>
                  <h3 className="text-xl md:text-3xl tracking-tight mt-3 text-slate-900 leading-tight">
                    {pipelineSteps[activeTab].title}
                  </h3>
                  <p className="text-slate-500 dark:text-neutral-400 text-sm leading-relaxed font-light">
                    {pipelineSteps[activeTab].description}
                  </p>
                </div>

                <div className="bg-white/60 dark:bg-white/[0.01] border border-slate-200/50 dark:border-white/[0.05] rounded-3xl p-6 space-y-4 backdrop-blur-xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Technical Specifications
                  </h4>
                  <ul className="space-y-2.5 text-xs text-slate-500 dark:text-neutral-400 font-medium">
                    {pipelineSteps[activeTab].details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Zap className="w-3.5 h-3.5 text-indigo-500 mt-0.5 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Side Simulated code screen */}
              <div className="lg:col-span-5 flex">
                <div className="w-full bg-[#0d1117] border border-zinc-800 rounded-[2rem] p-6 shadow-xl flex flex-col justify-between relative overflow-hidden font-mono min-h-[300px]">
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="w-4 h-4 text-slate-400" />
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                        JSON PAYLOAD ENGINE
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                  </div>
                  <pre className="text-[10px] text-zinc-300 overflow-x-auto whitespace-pre leading-relaxed flex-1 select-none no-scrollbar">
                    {pipelineSteps[activeTab].codeSnippet}
                  </pre>
                  <div className="absolute bottom-2 right-4 text-[9px] text-zinc-600">
                    NeuralPress Pipeline v1.0
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Grid of System Capabilities & Integrity */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-36">
        <div className="text-center mb-16">
          <span className="text-xs uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">
            Data Engineering
          </span>
          <h2 className="text-xl md:text-3xl tracking-tight mt-3 text-slate-900 leading-tight">
            Standardizing unstructured news
          </h2>
          <p className="text-slate-500 dark:text-neutral-400 text-sm max-w-lg mx-auto mt-3 font-light">
            We handle the complexities of scraping, parsing, translating, and
            deduplicating so you get clean structured feeds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-200/60 dark:bg-white/[0.01] dark:border-white/[0.05] rounded-[2rem] p-8 text-left backdrop-blur-xl">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/5 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-xl md:text-2xl tracking-tight mt-3 text-slate-900 leading-tight mb-2 text-slate-900 dark:text-white">
              Pruning boilerplate
            </h3>
            <p className="text-slate-500 dark:text-neutral-400 text-xs leading-relaxed font-light">
              Powered by our own proprietary search engine, we filter cookie
              banners, popups, script blocks, and navigation grids to store only
              the authentic content body, saving tokens for LLM generation.
            </p>
          </div>

          <div className="bg-white border border-slate-200/60 dark:bg-white/[0.01] dark:border-white/[0.05] rounded-[2rem] p-8 text-left backdrop-blur-xl">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-500/5 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-xl md:text-2xl tracking-tight mt-3 text-slate-900 leading-tight mb-2 text-slate-900 dark:text-white">
              Bilingual alignment
            </h3>
            <p className="text-slate-500 dark:text-neutral-400 text-xs leading-relaxed font-light">
              Our proprietary search engine pipelines feeds into Gemini to
              automatically synthesize Sinhala translations, tags, and
              categories alongside English feeds, enabling cross-language
              querying.
            </p>
          </div>

          <div className="bg-white border border-slate-200/60 dark:bg-white/[0.01] dark:border-white/[0.05] rounded-[2rem] p-8 text-left backdrop-blur-xl">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/5 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="text-xl md:text-2xl tracking-tight mt-3 text-slate-900 leading-tight mb-2 text-slate-900 dark:text-white">
              Smart AI mappings
            </h3>
            <p className="text-slate-500 dark:text-neutral-400 text-xs leading-relaxed font-light">
              Our proprietary search engine maps articles into a conceptual
              search index, supporting smart matches even if the exact keywords
              do not match.
            </p>
          </div>
        </div>
      </section>

      {/* Elegant Bottom Call to Action Portal */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-36 text-center">
        <div className="bg-gradient-to-r from-indigo-600 to-[#2b86ff] rounded-[3rem] p-10 md:p-16 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition duration-700" />
          <h4 className="text-3xl md:text-3xl font-light text-white leading-tight">
            Ready to integrate global news conceptual feeds?
          </h4>
          <p className="text-white/80 max-w-xl mx-auto mt-4 text-xs md:text-sm font-light leading-relaxed">
            Get your instant API token in under 2 minutes. Start querying news
            indexed worldwide by our own proprietary search engine conceptually
            for free, then scale up as your user base expands.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/checkout?plan=free"
              className="px-8 py-4 bg-white text-indigo-600 hover:bg-slate-50 text-xs md:text-sm font-bold rounded-full shadow-lg transition"
            >
              Sign Up Free
            </Link>
            <Link
              href="/developer"
              className="px-8 py-4 bg-indigo-950/40 text-white hover:bg-indigo-950/60 border border-white/20 text-xs md:text-sm font-semibold rounded-full transition flex items-center gap-2"
            >
              Open Sandbox <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
