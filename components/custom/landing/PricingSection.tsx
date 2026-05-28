"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function PricingSection() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 relative z-10 text-center">
      <span className="text-xs uppercase text-indigo-600 font-mono tracking-wider font-bold">
        Membership Plans
      </span>
      <h2 className="text-4xl font-extrabold font-heading text-slate-900 mt-2">
        Flexible plans built for
        <br />
        every stage of growth
      </h2>
      <p className="text-slate-500 max-w-xl mx-auto mt-4 text-sm font-normal">
        Explore different membership levels to match your story discovery needs.
      </p>

      {/* 3 Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16 text-left">
        {/* Card 1: Discoverer Plan */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between min-h-[400px]">
          <div>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 mb-6">
              Discoverer Plan
            </span>
            <p className="text-xs text-slate-400 font-normal leading-relaxed">
              Perfect for getting started and casual conceptual story searches.
            </p>
            <div className="mt-6 flex items-baseline">
              <span className="text-4xl font-extrabold tracking-tight">$2,500</span>
              <span className="ml-1 text-xs text-slate-400 font-normal">/month</span>
            </div>
            <ul className="mt-8 space-y-3.5 text-xs text-slate-500 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" /> Daily index scanning updates
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" /> Basic conceptual search
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" /> Bilingual English-Sinhala viewing
              </li>
            </ul>
          </div>
          <Link
            href="/news"
            className="w-full py-3 mt-8 bg-slate-900 text-white rounded-full text-xs font-bold text-center hover:bg-slate-800 transition"
          >
            Get started
          </Link>
        </div>

        {/* Card 2: Analyst Plan ( Lime green spotlight card ) */}
        <div className="bg-lime-400 border border-lime-300 rounded-[2rem] p-8 shadow-md flex flex-col justify-between min-h-[400px] text-slate-900">
          <div>
            <span className="inline-flex items-center rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white mb-6">
              Analyst Plan
            </span>
            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              Our most popular tier. Complete coverage analysis and high-speed translations.
            </p>
            <div className="mt-6 flex items-baseline">
              <span className="text-4xl font-extrabold tracking-tight">$5,500</span>
              <span className="ml-1 text-xs text-slate-800 font-semibold">/month</span>
            </div>
            <ul className="mt-8 space-y-3.5 text-xs text-slate-900 font-semibold">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-950" /> Live instant pipeline updates
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-950" /> High-speed conceptual mapping
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-950" /> Complete bilingual synthesis feed
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-slate-950" /> Live activity dashboard access
              </li>
            </ul>
          </div>
          <Link
            href="/dashboard"
            className="w-full py-3 mt-8 bg-slate-950 text-white rounded-full text-xs font-bold text-center hover:bg-slate-900 transition"
          >
            Get started
          </Link>
        </div>

        {/* Card 3: Enterprise Plan */}
        <div className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm flex flex-col justify-between min-h-[400px]">
          <div>
            <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 mb-6">
              Enterprise Plan
            </span>
            <p className="text-xs text-slate-400 font-normal leading-relaxed">
              For organisations requiring customized pipeline APIs and tools.
            </p>
            <div className="mt-6 flex items-baseline">
              <span className="text-4xl font-extrabold tracking-tight">$10,500</span>
              <span className="ml-1 text-xs text-slate-400 font-normal">/month</span>
            </div>
            <ul className="mt-8 space-y-3.5 text-xs text-slate-500 font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" /> Dedicated continuous indexing cluster
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" /> Raw backend system API feeds
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" /> Custom consolidation parameters
              </li>
            </ul>
          </div>
          <Link
            href="/news"
            className="w-full py-3 mt-8 bg-slate-900 text-white rounded-full text-xs font-bold text-center hover:bg-slate-800 transition"
          >
            Get started
          </Link>
        </div>
      </div>
    </section>
  );
}
