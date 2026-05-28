"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  MapPin,
  Cpu,
  Bot,
  Coins,
  Briefcase,
  Landmark,
  Trophy,
  Clapperboard,
  HeartPulse,
  FlaskConical,
  Globe,
  Leaf,
  ShieldAlert,
  MessageSquare,
  CheckCircle2,
  Palmtree,
  Plane,
  Utensils,
  LayoutGrid,
} from "lucide-react";

export interface CategoryItem {
  name: string;
  icon: React.ComponentType<any>;
  image: string;
}

export const CATEGORIES: CategoryItem[] = [
  {
    name: "All",
    icon: LayoutGrid,
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Local News",
    icon: MapPin,
    image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Technology",
    icon: Cpu,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "AI & Future",
    icon: Bot,
    image: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Crypto",
    icon: Coins,
    image: "https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Business",
    icon: Briefcase,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Politics",
    icon: Landmark,
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Sports",
    icon: Trophy,
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Entertainment",
    icon: Clapperboard,
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Health",
    icon: HeartPulse,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Science",
    icon: FlaskConical,
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "World News",
    icon: Globe,
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Climate",
    icon: Leaf,
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Investigations",
    icon: ShieldAlert,
    image: "https://images.unsplash.com/photo-1453847668080-482ed755ff9f?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Opinion",
    icon: MessageSquare,
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Fact Check",
    icon: CheckCircle2,
    image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Lifestyle",
    icon: Palmtree,
    image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Travel",
    icon: Plane,
    image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=300&q=80",
  },
  {
    name: "Food",
    icon: Utensils,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80",
  },
];

interface CategorySelectorProps {
  selectedCategory: string;
}

export function CategorySelector({ selectedCategory }: CategorySelectorProps) {
  return (
    <div className="w-full py-4 mb-10 sticky top-0 border-b border-neutral-250/20 dark:border-white/[0.04] backdrop-blur-2xl bg-white/60 dark:bg-[#07090e]/60 z-30 transition-colors duration-300">
      <div className="relative max-w-[1400px] mx-auto overflow-hidden">
        {/* Fading cues on scroll overflow for premium native visual indicator */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white dark:from-[#07090e] via-white/40 dark:via-[#07090e]/40 to-transparent pointer-events-none z-20" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white dark:from-[#07090e] via-white/40 dark:via-[#07090e]/40 to-transparent pointer-events-none z-20" />

        {/* Categories Horizontal Carousel Container */}
        <div className="flex items-center gap-3.5 py-1 px-8 overflow-x-auto scrollbar-none scroll-smooth -mx-4">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            const Icon = cat.icon;
            const href =
              cat.name === "All"
                ? "/news"
                : `/news/${encodeURIComponent(cat.name.toLowerCase().replace(/ /g, "-"))}`;

            return (
              <Link
                key={cat.name}
                href={href}
                className={cn(
                  "group relative flex flex-col justify-end w-36 h-20 sm:w-44 sm:h-24 rounded-2xl overflow-hidden shrink-0 border transition-all duration-500 ease-out shadow-sm hover:shadow-md cursor-pointer",
                  isActive
                    ? "border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/30 scale-[1.03] z-10"
                    : "border-slate-200/60 dark:border-zinc-800/80 hover:border-slate-350 dark:hover:border-zinc-700",
                )}
              >
                {/* Visual Category Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out scale-100 group-hover:scale-110"
                  style={{ backgroundImage: `url('${cat.image}')` }}
                />

                {/* Harmonious Dark Overlay Shield for text legibility */}
                <div
                  className={cn(
                    "absolute inset-0 transition-opacity duration-500",
                    isActive
                      ? "bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-900/30 opacity-90"
                      : "bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/20 opacity-80 group-hover:opacity-75",
                  )}
                />

                {/* Active Indicator Top Glow */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse" />
                )}

                {/* Content Block */}
                <div className="relative z-10 p-3 flex flex-col justify-between h-full">
                  {/* Category Pill Icon */}
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-500",
                      isActive
                        ? "bg-indigo-500 text-white shadow-sm"
                        : "bg-white/10 dark:bg-black/30 backdrop-blur-md text-white/90 group-hover:bg-white/20 group-hover:text-white",
                    )}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Category Title */}
                  <span className="text-xs font-semibold tracking-tight text-white font-inter">
                    {cat.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
