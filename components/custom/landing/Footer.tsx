"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-36 pt-8 border-t border-slate-200 text-center text-xs text-slate-500 font-mono relative z-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} NeuralPress. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/news" className="hover:text-slate-800">
            Discovery Portal
          </Link>
          {/* <Link href="/dashboard" className="hover:text-slate-800">
            System Dashboard
          </Link> */}
        </div>
      </div>
    </footer>
  );
}
