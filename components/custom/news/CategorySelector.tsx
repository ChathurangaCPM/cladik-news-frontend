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

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export interface CategoryItem {
  name: string;
  icon: React.ComponentType<any>;
  image: string;
  path: string;
}

export const CATEGORIES: CategoryItem[] = [
  {
    name: "All",
    icon: LayoutGrid,
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=300&q=80",
    path: "/news",
  },
  {
    name: "Sri Lanka",
    icon: MapPin,
    image:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=300&q=80",
    path: "/news/sri-lanka",
  },
  {
    name: "Technology",
    icon: Cpu,
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300&q=80",
    path: "/news/technology",
  },
  {
    name: "AI & Future",
    icon: Bot,
    image:
      "https://plus.unsplash.com/premium_photo-1683121718643-fb18d2668d53?q=80&w=300&auto=format&fit=crop",
    path: "/news/ai-technology",
  },
  {
    name: "Crypto",
    icon: Coins,
    image:
      "https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&w=300&q=80",
    path: "/news/crypto",
  },
  {
    name: "Business",
    icon: Briefcase,
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=300&q=80",
    path: "/news/business",
  },
  {
    name: "Politics",
    icon: Landmark,
    image:
      "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=300&q=80",
    path: "/news/politics",
  },
  {
    name: "Sports",
    icon: Trophy,
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=300&q=80",
    path: "/news/sports",
  },
  {
    name: "Entertainment",
    icon: Clapperboard,
    image:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=300&q=80",
    path: "/news/entertainment",
  },
  {
    name: "Health",
    icon: HeartPulse,
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=300&q=80",
    path: "/news/health",
  },
  {
    name: "Science",
    icon: FlaskConical,
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=300&q=80",
    path: "/news/science",
  },
  {
    name: "World News",
    icon: Globe,
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=300&q=80",
    path: "/news/world-news",
  },
  {
    name: "Climate",
    icon: Leaf,
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=300&q=80",
    path: "/news/climate",
  },
  {
    name: "Investigations",
    icon: ShieldAlert,
    image:
      "https://images.unsplash.com/photo-1453847668080-482ed755ff9f?auto=format&fit=crop&w=300&q=80",
    path: "/news/investigations",
  },
  {
    name: "Opinion",
    icon: MessageSquare,
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&q=80",
    path: "/news/opinion",
  },
  {
    name: "Fact Check",
    icon: CheckCircle2,
    image:
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=300&q=80",
    path: "/news/fact-check",
  },
  {
    name: "Lifestyle",
    icon: Palmtree,
    image:
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=300&q=80",
    path: "/news/lifestyle",
  },
  {
    name: "Travel",
    icon: Plane,
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=300&q=80",
    path: "/news/travel",
  },
  {
    name: "Food",
    icon: Utensils,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80",
    path: "/news/food",
  },
];

interface CategorySelectorProps {
  selectedCategory: string;
}

export function CategorySelector({ selectedCategory }: CategorySelectorProps) {
  return (
    <div className="w-full py-4 mb-10 sticky top-0 border-b border-neutral-250/20 dark:border-white/[0.04] backdrop-blur-2xl bg-white/60 dark:bg-[#07090e]/60 z-10 transition-colors duration-300">
      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <Carousel
          opts={{
            align: "start",
            dragFree: true,
          }}
          className="w-full group"
        >
          {/* Fading cues on scroll overflow for premium native visual indicator */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white dark:from-[#07090e] via-white/20 dark:via-[#07090e]/20 to-transparent pointer-events-none z-20" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white dark:from-[#07090e] via-white/20 dark:via-[#07090e]/20 to-transparent pointer-events-none z-20" />

          {/* Categories embla scroll track */}
          <CarouselContent className="flex gap-1 py-1">
            {CATEGORIES.map((cat) => {
              const isActive =
                selectedCategory.toLowerCase() === cat.name.toLowerCase();
              const Icon = cat.icon;
              const href = cat.path;

              return (
                <CarouselItem
                  key={cat.name}
                  className="basis-auto shrink-0 pl-3.5"
                >
                  <Link
                    href={href}
                    className={cn(
                      "group/btn relative flex flex-col justify-end w-36 h-20 sm:w-44 sm:h-24 rounded-2xl overflow-hidden border transition-all duration-500 ease-out shadow-sm hover:shadow-md cursor-pointer",
                      isActive
                        ? "border-indigo-500 dark:border-indigo-400 ring-2 ring-indigo-500/30 scale-[1.03] z-10"
                        : "border-slate-200/60 dark:border-zinc-800/80 hover:border-slate-350 dark:hover:border-zinc-700",
                    )}
                  >
                    {/* Visual Category Background Image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out scale-100 group-hover/btn:scale-110"
                      style={{ backgroundImage: `url('${cat.image}')` }}
                    />

                    {/* Harmonious Dark Overlay Shield for text legibility */}
                    <div
                      className={cn(
                        "absolute inset-0 transition-opacity duration-500",
                        isActive
                          ? "bg-gradient-to-t from-slate-950 via-slate-900/70 to-slate-900/30 opacity-90"
                          : "bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/20 opacity-80 group-hover/btn:opacity-75",
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
                            : "bg-white/10 dark:bg-black/30 backdrop-blur-md text-white/90 group-hover/btn:bg-white/20 group-hover/btn:text-white",
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
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Premium Hover Navigation Arrows on Desktop */}
          <div className="hidden lg:block">
            <CarouselPrevious className="absolute left-[-22px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 text-slate-800 dark:text-zinc-200 shadow-md cursor-pointer hover:bg-white dark:hover:bg-zinc-900 w-8 h-8 rounded-full flex items-center justify-center" />
            <CarouselNext className="absolute right-[-22px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border border-slate-200/80 dark:border-zinc-800/80 text-slate-800 dark:text-zinc-200 shadow-md cursor-pointer hover:bg-white dark:hover:bg-zinc-900 w-8 h-8 rounded-full flex items-center justify-center" />
          </div>
        </Carousel>
      </div>
    </div>
  );
}
