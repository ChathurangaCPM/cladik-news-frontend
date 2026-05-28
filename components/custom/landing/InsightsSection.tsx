"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, ShieldCheck, Cpu } from "lucide-react";

export default function InsightsSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-slate-200/80 pb-6 max-w-5xl mx-auto text-left">
        <div>
          <span className="text-xs uppercase text-indigo-600 font-mono tracking-wider font-bold">
            Resource Center
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold font-heading text-slate-900 mt-2">
            Latest insights and trends
          </h2>
        </div>
        <Link
          href="/news"
          className="px-5 py-2.5 bg-slate-950 text-white rounded-full text-xs font-bold hover:bg-slate-900 transition flex items-center gap-1"
        >
          View feed <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 3 blog/story cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-12 text-left">
        {/* Card 1 */}
        <div className="bg-white border border-slate-200/60 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
          <div className="aspect-video bg-gradient-to-tr from-blue-100 via-indigo-50 to-purple-100 flex items-center justify-center border-b border-slate-100">
            <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
          </div>
          <div className="p-6 space-y-3">
            <span className="text-[10px] uppercase font-bold text-indigo-500 font-mono">Bilingual Model</span>
            <h3 className="text-base font-bold text-slate-900 hover:text-indigo-600 transition cursor-pointer">
              Bilingual Story Translation Optimization
            </h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              How advanced engines automatically transform global publications to premium Sinhala.
            </p>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-slate-200/60 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
          <div className="aspect-video bg-gradient-to-tr from-emerald-100 via-teal-50 to-emerald-50 flex items-center justify-center border-b border-slate-100">
            <ShieldCheck className="w-8 h-8 text-emerald-400 animate-pulse" />
          </div>
          <div className="p-6 space-y-3">
            <span className="text-[10px] uppercase font-bold text-emerald-500 font-mono">Consensus Index</span>
            <h3 className="text-base font-bold text-slate-900 hover:text-emerald-600 transition cursor-pointer">
              Bilingual Consensus Indexing Verification
            </h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              Understanding our consensus-based verification and automated indexing frameworks.
            </p>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-slate-200/60 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
          <div className="aspect-video bg-gradient-to-tr from-purple-100 via-pink-50 to-purple-50 flex items-center justify-center border-b border-slate-100">
            <Cpu className="w-8 h-8 text-purple-400 animate-pulse" />
          </div>
          <div className="p-6 space-y-3">
            <span className="text-[10px] uppercase font-bold text-purple-500 font-mono">Operations</span>
            <h3 className="text-base font-bold text-slate-900 hover:text-purple-600 transition cursor-pointer">
              Continuous Web Scanning & Consensus Index
            </h3>
            <p className="text-xs text-slate-400 font-light leading-relaxed">
              A detailed breakdown of how our automated scanning pipeline maps concepts instantly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
