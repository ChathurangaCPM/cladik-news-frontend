"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-40 border-t border-slate-200/50 dark:border-white/[0.05] text-xs text-slate-500 dark:text-neutral-400 relative z-10 transition-colors duration-300">
      <div className="pt-12 flex flex-col gap-10">
        {/* Top Minimal Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Brand Signature */}
          <div className="flex items-center gap-3">
            <Image
              src="/main-logo.png"
              width={60}
              height={60}
              className="w-8 h-8 object-contain opacity-90 dark:opacity-100 dark:hidden"
              alt="NeuralPress"
            />
            <Image
              src="/main-logo-white.png"
              width={60}
              height={60}
              className="w-8 h-8 object-contain opacity-90 dark:opacity-100 hidden dark:block"
              alt="NeuralPress"
            />
            <div className="flex flex-col">
              <span className="font-bold text-[16px] tracking-tight text-slate-900 dark:text-white">
                Neural
                <span className="text-indigo-600 dark:text-indigo-400">
                  Press
                </span>
              </span>
              <span className="text-[10px] text-slate-400 dark:text-neutral-500 mt-0.5">
                AI News Aggregator
              </span>
            </div>
          </div>

          {/* Minimal Navigation Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-mono tracking-tight">
            <Link
              href="/news"
              className="hover:text-indigo-600 dark:hover:text-white transition duration-200"
            >
              Discovery Feed
            </Link>
            {/* <Link
              href="/pricing"
              className="hover:text-indigo-600 dark:hover:text-white transition duration-200"
            >
              API Pricing
            </Link>
            <Link
              href="/developer/dashboard"
              className="hover:text-indigo-600 dark:hover:text-white transition duration-200"
            >
              Developer Portal
            </Link> */}
          </nav>
        </div>

        {/* Bottom Sub-Row */}
        <div className="pt-8 border-t border-slate-100 dark:border-white/[0.02] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[10px] tracking-wide text-slate-400 dark:text-neutral-500">
          <div>
            <p>
              © {new Date().getFullYear()} NeuralPress. Sri Lankan news index.
              All rights reserved.
            </p>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/[0.02] border border-slate-200/40 dark:border-white/[0.03] px-3 py-1.5 rounded-full shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
