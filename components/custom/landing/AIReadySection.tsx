"use client";

import React from "react";
import { Cpu, Terminal, CheckCircle2, Zap, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AIReadySection() {
  const markdownSample = `# Global Energy Transition Milestones
*Published: June 9, 2026 | Verified Sources: 3*

### Executive Summary
Major power grids have successfully integrated record levels of solar storage capacity this quarter. The integration was backed by new regional standardization frameworks.

### Key Points
- **Solar Capacity:** Increase of 14.2% across local grids.
- **Battery Standards:** New standards went into effect to balance grid fluctuations.
- **Cross-Source Consensus:** Confirmed by multiple tech publications.

### Primary Citations
1. [TechAuthority](https://example.com/grid-standards)
2. [GlobalChronicle](https://example.com/battery-expansion)`;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 relative z-10">
      <div className="text-center mb-16">
        <span className="text-xs uppercase text-indigo-600 font-mono tracking-wider font-bold bg-indigo-50 dark:bg-indigo-950/30 px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/50">
          AI-Ready Data Output
        </span>
        <h2 className="text-4xl font-normal tracking-tighter text-slate-900 dark:text-white mt-2">
          LLM-Ready News Delivery in{" "}
          <span className="font-heading italic text-[#2b86ff]">
            Markdown Format
          </span>
        </h2>
        <p className="text-slate-500 dark:text-neutral-400 max-w-2xl mx-auto mt-4 text-sm font-light">
          Say goodbye to complex HTML scraping and regex cleaning. NeuralPress
          delivers clean, structured news text formatted directly in
          Markdown—optimized for token-efficiency, prompt engineering, and RAG
          pipelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-5xl mx-auto items-stretch">
        {/* Left Side: Why Markdown is perfect for AI */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-8">
          <div className="space-y-4">
            <h3 className="text-2xl tracking-[-1px] text-slate-900 dark:text-white">
              Optimized for Large Language Models
            </h3>
            <p className="text-slate-500 dark:text-neutral-400 text-sm leading-relaxed font-light">
              AI Agents and LLMs process structural text format far more
              effectively than bloated HTML or nested JSON objects. Returning
              clean Markdown helps your agent comprehend context immediately.
            </p>
          </div>

          <div className="space-y-4">
            {/* Feature 1 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm text-slate-800 dark:text-neutral-200">
                  Save up to 80% on Token Overhead
                </h4>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 font-light leading-relaxed">
                  By filtering cookie banners, popups, and navigational
                  sidebars, we only pass clean markdown text, saving expensive
                  tokens during LLM ingestion.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm text-slate-800 dark:text-neutral-200">
                  Ready for RAG & Embeddings
                </h4>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 font-light leading-relaxed">
                  Clean headers, lists, and reference tables map directly to
                  vector chunks, improving semantic search indexing retrieval
                  rates for agents.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm text-slate-800 dark:text-neutral-200">
                  Structured Citation Links
                </h4>
                <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 font-light leading-relaxed">
                  Citations are natively embedded as standard Markdown links,
                  making it easy for models to reference exact sources in final
                  summaries.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Markdown Editor Preview */}
        <div className="lg:col-span-6 flex">
          <div className="w-full bg-[#0d1117] border border-zinc-800 rounded-[2.5rem] p-6 shadow-xl flex flex-col justify-between relative overflow-hidden font-mono min-h-[380px] group/editor">
            {/* Window controls */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-4 select-none">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-slate-400" />
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                  MARKDOWN OUTPUT VIEW
                </span>
              </div>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
            </div>

            {/* Markdown Text Area */}
            <ScrollArea className="flex-1 text-[11px] text-zinc-300 whitespace-pre leading-relaxed select-all">
              <span className="text-purple-400">
                {markdownSample.split("\n")[0]}
              </span>
              <br />
              <span className="text-slate-500">
                {markdownSample.split("\n")[1]}
              </span>
              <br />
              <br />
              <span className="text-indigo-400">
                {markdownSample.split("\n")[3]}
              </span>
              <br />
              <span className="text-zinc-300">
                {markdownSample.split("\n")[4]}
              </span>
              <br />
              <br />
              <span className="text-indigo-400">
                {markdownSample.split("\n")[6]}
              </span>
              <br />
              <span className="text-zinc-300">
                {markdownSample.split("\n")[7]}
              </span>
              <br />
              <span className="text-zinc-300">
                {markdownSample.split("\n")[8]}
              </span>
              <br />
              <span className="text-zinc-300">
                {markdownSample.split("\n")[9]}
              </span>
              <br />
              <br />
              <span className="text-indigo-400">
                {markdownSample.split("\n")[11]}
              </span>
              <br />
              <span className="text-emerald-400">
                {markdownSample.split("\n")[12]}
              </span>
              <br />
              <span className="text-emerald-400">
                {markdownSample.split("\n")[13]}
              </span>
            </ScrollArea>

            <div className="absolute bottom-3 right-5 text-[9px] text-zinc-600 select-none">
              neuralpress-markdown-engine v1.0
            </div>

            {/* Sparkles effect */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none group-hover/editor:scale-150 transition duration-700" />
          </div>
        </div>
      </div>
    </section>
  );
}
