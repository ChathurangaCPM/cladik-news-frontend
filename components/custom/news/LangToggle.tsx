"use client";

import React from "react";
import { useLangContext } from "@/providers/langProvider";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

export function LangToggle() {
  const { lang, setLanguage, isLoadingLangData } = useLangContext();

  return (
    <button
      onClick={() => setLanguage(lang === "si" ? "en" : "si")}
      disabled={isLoadingLangData}
      className={cn(
        "p-2 rounded-full border border-slate-200/50 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 hover:bg-slate-100 dark:hover:bg-zinc-850 hover:text-slate-900 dark:hover:text-white transition-all flex items-center gap-1.5 text-xs font-medium font-inter shadow-sm outline-none shrink-0 cursor-pointer",
        isLoadingLangData && "opacity-50 cursor-not-allowed"
      )}
      title={lang === "si" ? "Switch to English" : "සිංහල භාෂාවට මාරු වන්න"}
    >
      <Languages className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
      <span className="font-semibold uppercase tracking-wider text-slate-700 dark:text-zinc-200">
        {lang === "si" ? "සිංහල" : "EN"}
      </span>
    </button>
  );
}
