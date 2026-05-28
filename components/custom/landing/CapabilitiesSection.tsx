"use client";

import React from "react";
import { CheckCircle2, Activity } from "lucide-react";

export default function CapabilitiesSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 relative z-10 text-center">
      <span className="text-xs uppercase text-indigo-600 font-mono tracking-wider font-bold">
        Capabilities
      </span>
      <h2 className="text-4xl font-extrabold font-heading text-slate-900 mt-2">
        Where human insight meets
        <br />
        intelligent technology
      </h2>
      <p className="text-slate-500 max-w-xl mx-auto mt-4 text-sm">
        Aeline-styled visual components detailing our core story indexing capabilities.
      </p>

      {/* 2x2 Visual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mt-16 text-left">
        {/* Block 1: Automatic Consensus */}
        <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <h3 className="text-xl font-bold font-heading text-slate-900">Automatic consensus</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              We map coverage from multiple publications to a single clean consensus report, highlighting
              unique angles and removing duplicates.
            </p>
          </div>
          <div className="w-[180px] h-[130px] rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 flex flex-col justify-between shadow-inner shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase font-bold text-emerald-500">CONSENSUS STATUS</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            </div>
            <div className="space-y-1.5">
              <div className="w-full bg-slate-200 h-1.5 rounded-full" />
              <div className="w-[70%] bg-slate-200 h-1.5 rounded-full" />
            </div>
            <span className="text-[9px] text-slate-400 font-mono">Consolidated: 14 publications</span>
          </div>
        </div>

        {/* Block 2: Professional translation */}
        <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <h3 className="text-xl font-bold font-heading text-slate-900">Bilingual translation</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Seamless and professional bilingual translations automatically created by advanced generative
              language models.
            </p>
          </div>
          <div className="w-[180px] h-[130px] rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 flex flex-col justify-between shadow-inner shrink-0 text-center items-center justify-center font-mono">
            <div className="text-[10px] text-indigo-500 font-bold bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">
              ENGLISH SOURCE
            </div>
            <div className="w-full text-slate-400 my-1">➔</div>
            <div className="text-[10px] text-purple-500 font-bold bg-purple-50 px-2 py-1 rounded-lg border border-purple-100">
              SINHALA TARGET
            </div>
          </div>
        </div>

        {/* Block 3: Dynamic Ingestion */}
        <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <h3 className="text-xl font-bold font-heading text-slate-900">Concept Discovery</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Search story concepts conceptually, letting you locate updates based on matching subjects and
              thoughts rather than exact keywords.
            </p>
          </div>
          <div className="w-[180px] h-[130px] rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 flex flex-col justify-between shadow-inner shrink-0 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-slate-400 flex-wrap gap-1 p-2">
              <span className="bg-slate-100 border px-1.5 py-0.5 rounded">Climate</span>
              <span className="bg-slate-100 border px-1.5 py-0.5 rounded">Policy</span>
              <span className="bg-indigo-50 text-indigo-500 border border-indigo-200 px-1.5 py-0.5 rounded">
                Energy
              </span>
            </div>
          </div>
        </div>

        {/* Block 4: Ingest Pipeline radar */}
        <div className="bg-white border border-slate-200/60 rounded-[2.5rem] p-8 shadow-sm flex flex-col md:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <h3 className="text-xl font-bold font-heading text-slate-900">Real-time system scanning</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Continual scanning and indexing operations tracking worldwide publications 24/7.
            </p>
          </div>
          <div className="w-[180px] h-[130px] rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 flex items-center justify-center shadow-inner shrink-0 relative">
            <div className="w-16 h-16 rounded-full border-[3px] border-slate-200 flex items-center justify-center relative animate-pulse">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center">
                <Activity className="w-4 h-4 text-indigo-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
