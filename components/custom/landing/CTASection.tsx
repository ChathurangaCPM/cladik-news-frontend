"use client";

import React from "react";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="max-w-5xl mx-auto px-4 mt-36 relative z-10 text-center">
      <div className="bg-gradient-to-b from-[#2b86ff] to-[#1e70e0] border border-blue-400/20 rounded-[2.5rem] p-8 md:p-16 shadow-2xl relative overflow-hidden group text-white">
        {/* Drifting Clouds overlay */}
        <div className="absolute top-[-30%] left-[-20%] w-72 h-72 bg-white/20 rounded-full blur-[80px] pointer-events-none group-hover:scale-125 transition-transform duration-500" />
        <div className="absolute bottom-[-30%] right-[-20%] w-72 h-72 bg-white/20 rounded-full blur-[80px] pointer-events-none group-hover:scale-125 transition-transform duration-500" />

        <h2 className="text-3xl md:text-5xl tracking-[-2px] leading-tight">
          Build the next-generation
          <br />
          <span className="capitalize font-heading italic">
            of AI applications.
          </span>
        </h2>
        <p className="mt-4 text-white/85 text-sm md:text-base font-light max-w-xl mx-auto">
          Get your free developer API key now with 100 free daily requests, and experience vector search, structured JSON payloads, and real-time news streams powered by our own proprietary search engine indexing news worldwide.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 relative z-10">
          <Link
            href="/signup"
            className="px-8 py-4 bg-lime-400 text-slate-900 hover:bg-lime-300 text-sm font-semibold rounded-full shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shrink-0"
          >
            Create Developer Account
          </Link>
          {/* <Link
            href="/dashboard"
            className="px-8 py-4 bg-slate-950 hover:bg-slate-900 text-sm font-semibold rounded-full shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shrink-0 text-white"
          >
            Access System Dashboard
          </Link> */}
        </div>
      </div>
    </section>
  );
}
