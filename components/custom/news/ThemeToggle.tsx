"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration flash
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-800 animate-pulse border border-slate-200/50 dark:border-zinc-700/50" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center justify-center w-9 h-9 rounded-full bg-slate-50 dark:bg-zinc-900 border border-slate-200/60 dark:border-zinc-800/80 hover:bg-slate-100 dark:hover:bg-zinc-800/80 transition-all duration-300 shadow-sm cursor-pointer group"
      aria-label="Toggle theme"
    >
      <div className="relative w-5 h-5 flex items-center justify-center overflow-hidden">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-500 transition-all duration-500 transform rotate-0 scale-100 group-hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-500 transition-all duration-500 transform rotate-0 scale-100 group-hover:-rotate-12" />
        )}
      </div>
    </button>
  );
}
