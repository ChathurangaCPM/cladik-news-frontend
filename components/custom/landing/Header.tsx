"use client";

import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <header className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative z-20">
      <div className="flex items-center gap-3">
        <img
          src="/main-logo-white.png"
          width={100}
          height={100}
          className="w-9 lg:w-[40px] transition-transform duration-700"
          alt="NeuralPress"
        />
        <span className="text-xl tracking-tight text-white">
          Neural<span className="text-white/80">Press</span>
        </span>
      </div>

      {/* <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-white/90">
        <Link href="/news" className="hover:text-white transition duration-200">
          Discovery Feed
        </Link>
        <Link href="/pricing" className="hover:text-white transition duration-200">
          API Pricing
        </Link>
        <Link href="/developer/dashboard" className="hover:text-white transition duration-200">
          Developer Portal
        </Link>
      </nav> */}

      <div className="flex items-center gap-4">
        <Link
          href="/news"
          className="px-6 py-3 rounded-full text-sm bg-white text-[#2b86ff] hover:bg-slate-50 shadow-lg shadow-black/10 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
        >
          Discovery Feed
        </Link>
      </div>
    </header>
  );
}
