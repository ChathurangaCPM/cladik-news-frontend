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

export default function HowItWorksClient() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const pipelineSteps = [
    {
      id: 0,
      title: "1. Automated News Discovery",
      shortTitle: "News Search",
      icon: <Database className="w-5 h-5 text-blue-500" />,
      tagline: "Continuously searching for news events",
      description:
        "Our own custom search engine continuously scans global publications and official feeds around the clock. Rather than relying on simple feeds or general aggregators, we search directly for breaking events and new stories the moment they publish.",
      details: [
        "Proprietary search engine constantly scanning online sources",
        "Immediate detection of news headlines and breaking alerts",
        "Broad, automated discovery across digital news publications",
        "Noise reduction filters focusing only on relevant stories",
      ],
      codeSnippet: `// Discovery Scan Status
{
  "discoveryEngine": "NeuralPress Search Engine",
  "status": "scanning",
  "discoveredHeadlinesToday": 412,
  "activeSourcesSearched": 150
}`,
    },
    {
      id: 1,
      title: "2. Source Verification & Validation",
      shortTitle: "Validation",
      icon: <Brain className="w-5 h-5 text-purple-500" />,
      tagline: "Verifying facts across trusted publications",
      description:
        "Whenever a news event is found, we check trusted, authoritative sources for that same news. By cross-checking multiple verified publications, our system determines if the news is valid, accurate, and confirmed, filtering out rumors or unverified reports.",
      details: [
        "Instant validation across a database of authoritative sources",
        "Strict verification check to verify if the event is valid",
        "Filtering out low-confidence, unconfirmed, or rumor-based sources",
        "Factual alignment verification between multiple reports",
      ],
      codeSnippet: `// Source Verification & Validation
{
  "eventHeadline": "Grid Storage Integration Standards",
  "trustedMatchesFound": [
    "TechAuthority",
    "GlobalChronicle",
    "ScienceDaily"
  ],
  "isValidated": true,
  "confidenceScore": 0.98
}`,
    },
    {
      id: 2,
      title: "3. Information Synthesis",
      shortTitle: "Synthesis",
      icon: <Network className="w-5 h-5 text-emerald-500" />,
      tagline: "Gathering information from trusted sources",
      description:
        "Once verified, we gather all the necessary facts, details, and context from multiple trusted sources. This consolidates different perspectives and ensures that we have a complete and balanced record of the news event.",
      details: [
        "Collecting necessary information from multiple verified articles",
        "Consolidating varying details to build a complete picture",
        "Extracting core statements, figures, and verified timelines",
        "Structuring multi-source insights into a unified data profile",
      ],
      codeSnippet: `// Information Synthesis
{
  "event": "Grid Storage Integration Standards",
  "verifiedSourcesCount": 3,
  "extractedFactsCount": 12,
  "locations": ["Texas", "California"]
}`,
    },
    {
      id: 3,
      title: "4. Primary Point Generation",
      shortTitle: "Generation",
      icon: <Share2 className="w-5 h-5 text-amber-500" />,
      tagline: "Synthesizing trusted news focusing on key takeaways",
      description:
        "Using our advanced language models, we generate a final, trust-focused news summary. This process synthesizes all gathered facts and presents the primary point of the news clearly and concisely, removing repetitive details and opinionated bias.",
      details: [
        "Synthesizing gathered details into a clean, factual report",
        "Focusing strictly on primary takeaways and key news points",
        "Bilingual generation (English and Sinhala summaries)",
        "Zero boilerplate, promotional links, or editorial bias",
      ],
      codeSnippet: `// Primary Point Extraction
{
  "primaryPoints": [
    "Grid networks integrated record levels of solar capacity.",
    "New battery storage standards went into effect."
  ],
  "summary": {
    "en": "Major grid networks integrated record levels of solar capacity...",
    "si": "ප්‍රධාන බලශක්ති ජාලයන් වාර්තාගත සූර්ය බලශක්ති ප්‍රමාණයක් ඒකාබද්ධ කර ඇත..."
  }
}`,
    },
    {
      id: 4,
      title: "5. Vector Storage & Indexing",
      shortTitle: "Vector Indexing",
      icon: <Cpu className="w-5 h-5 text-indigo-500" />,
      tagline: "Storing verified news with semantic vector embeddings",
      description:
        "Finally, the generated, verified news article is saved directly to our secure database. Along with the text, we generate and store vector data for the story, allowing for concept-based semantic search and future discovery.",
      details: [
        "Storing clean, verified news data in our database",
        "Generating high-dimensional vector embeddings for each document",
        "Enabling semantic search based on meaning rather than simple keywords",
        "Readying data for downstream AI search and developer queries",
      ],
      codeSnippet: `// Database & Vector Storage
{
  "documentId": "news_8f4b23a9d71c",
  "status": "saved",
  "vectorDimensions": 1536,
  "searchIndexing": "completed",
  "semanticCategory": "clean_energy"
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
              Free API
            </Link>
             <Link
              href="/blog"
              className="hover:text-white transition duration-200"
            >
              Blog
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/developer"
              className="px-5 py-2.5 rounded-full text-xs bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/10 hover:scale-[1.02] transition-all"
            >
              Get Access
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
          NeuralPress indexes global news worldwide using our own search
          engine, automating news search, verification, facts synthesis, primary
          point generation, and database vector storage to deliver high-precision
          and trustworthy structured data.
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
            We handle the complexities of searching, validating, synthesizing,
            and vector indexing so you get clean, trustworthy structured feeds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white border border-slate-200/60 dark:bg-white/[0.01] dark:border-white/[0.05] rounded-[2rem] p-8 text-left backdrop-blur-xl">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-500/5 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-xl md:text-2xl tracking-tight mt-3 text-slate-900 leading-tight mb-2 text-slate-900 dark:text-white">
              Continuous Search
            </h3>
            <p className="text-slate-500 dark:text-neutral-400 text-xs leading-relaxed font-light">
              Our own search engine continuously searches the news, discovering
              breaking updates and events the moment they are published online.
            </p>
          </div>

          <div className="bg-white border border-slate-200/60 dark:bg-white/[0.01] dark:border-white/[0.05] rounded-[2rem] p-8 text-left backdrop-blur-xl">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 dark:bg-purple-500/5 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
              <Brain className="w-5 h-5" />
            </div>
            <h3 className="text-xl md:text-2xl tracking-tight mt-3 text-slate-900 leading-tight mb-2 text-slate-900 dark:text-white">
              Trust Validation
            </h3>
            <p className="text-slate-500 dark:text-neutral-400 text-xs leading-relaxed font-light">
              Whenever news is discovered, our system immediately checks and
              cross-references multiple trusted sources to validate authenticity
              before saving.
            </p>
          </div>

          <div className="bg-white border border-slate-200/60 dark:bg-white/[0.01] dark:border-white/[0.05] rounded-[2rem] p-8 text-left backdrop-blur-xl">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/5 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6">
              <Network className="w-5 h-5" />
            </div>
            <h3 className="text-xl md:text-2xl tracking-tight mt-3 text-slate-900 leading-tight mb-2 text-slate-900 dark:text-white">
              Vector Mappings
            </h3>
            <p className="text-slate-500 dark:text-neutral-400 text-xs leading-relaxed font-light">
              Synthesized news is stored alongside its high-dimensional vector
              embeddings, enabling conceptual searching for future retrieval.
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
            indexed by our own search engine conceptually for free, then scale
            up as your user base expands.
          </p>
          <div className="mt-8 flex justify-center md:flex-row flex-col flex-wrap items-center gap-4">
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
