"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative z-20">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-white p-[1.5px] shadow-[0_4px_15px_rgba(0,0,0,0.15)]">
          <div className="w-full h-full rounded-[14px] bg-[#2b86ff] flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
        <span className="text-xl font-bold tracking-tight text-white">
          Neural<span className="text-white/80">Press</span>
        </span>
      </div>

      <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-white/90">
        <Link href="/news" className="hover:text-white transition duration-200">
          Discovery Feed
        </Link>
        <a href="#engine" className="hover:text-white transition duration-200">
          Our Technology
        </a>
        <a href="#performance" className="hover:text-white transition duration-200">
          Operations
        </a>
      </nav>

      <div className="flex items-center gap-4">
        <Link
          href="/news"
          className="px-6 py-3 rounded-full text-xs font-semibold bg-white text-[#2b86ff] hover:bg-slate-50 shadow-lg shadow-black/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          Launch Portal
        </Link>
      </div>
    </header>
  );
}
