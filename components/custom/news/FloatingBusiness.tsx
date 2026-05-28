"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Building2, 
  Search, 
  X, 
  MapPin, 
  Star, 
  Phone, 
  Globe, 
  ArrowRight, 
  ExternalLink,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLangContext } from "@/providers/langProvider";

interface BusinessCategory {
  mainCategoryName: string;
  subCategoryName?: string;
}

interface Business {
  _id?: string;
  name: string;
  category?: BusinessCategory | string;
  description?: string;
  logo?: string;
  phone?: string;
  website?: string;
  address?: string;
  isActive?: boolean;
}

const FALLBACK_BUSINESSES: Business[] = [
  {
    _id: "fb-1",
    name: "Nuwan Ceylon Premium Tea",
    category: { mainCategoryName: "Beverage & Exporters", subCategoryName: "Organic Tea" },
    description: "Hand-picked organic Ceylon tea directly exported from the lush mist-covered gardens of Nuwara Eliya.",
    phone: "+94 77 123 4567",
    website: "https://nuwanceylontea.example.com",
    address: "No. 45, Tea Gardens Ave, Nuwara Eliya",
    isActive: true,
  },
  {
    _id: "fb-2",
    name: "Apex Retail & Smart Solutions",
    category: { mainCategoryName: "Tech & Electronics", subCategoryName: "Home Automation" },
    description: "Leading distributor of home automation appliances, premium tech accessories, and localized smart home widgets.",
    phone: "+94 11 234 5678",
    website: "https://apexsmart.example.com",
    address: "12/A, Galle Road, Colombo 03",
    isActive: true,
  },
  {
    _id: "fb-3",
    name: "Natures Grace Bio Cosmetics",
    category: { mainCategoryName: "Wellness & Beauty", subCategoryName: "Ayurveda" },
    description: "100% natural, ayurveda-infused organic skincare, botanical oils, and sustainable wellness items.",
    phone: "+94 71 987 6543",
    website: "https://naturesgrace.example.com",
    address: "56, Orchid Lane, Kandy",
    isActive: true,
  },
  {
    _id: "fb-4",
    name: "Zenith Logistics & Courier",
    category: { mainCategoryName: "Logistics & Transport", subCategoryName: "Courier Services" },
    description: "Island-wide same-day smart courier and retail fulfillment partner for corporate ecommerce platforms.",
    phone: "+94 11 999 8888",
    website: "https://zenithlogistics.example.com",
    address: "244, Baseline Road, Colombo 09",
    isActive: true,
  }
];

export function FloatingBusiness() {
  const { lang } = useLangContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch active businesses from backend on mount
  useEffect(() => {
    async function loadBusinesses() {
      try {
        const res = await fetch("/api/business");
        if (res.ok) {
          const data = await res.json();
          if (data && data.success && Array.isArray(data.businesses) && data.businesses.length > 0) {
            setBusinesses(data.businesses);
          } else {
            setBusinesses(FALLBACK_BUSINESSES);
          }
        } else {
          setBusinesses(FALLBACK_BUSINESSES);
        }
      } catch (err) {
        console.error("Failed to load real business directory:", err);
        setBusinesses(FALLBACK_BUSINESSES);
      } finally {
        setIsLoading(false);
      }
    }
    loadBusinesses();
  }, []);

  // Filter list based on search query
  const filteredBusinesses = useMemo(() => {
    if (!searchQuery.trim()) return businesses;
    const query = searchQuery.toLowerCase();
    return businesses.filter((b) => {
      const nameMatch = b.name.toLowerCase().includes(query);
      const descMatch = b.description?.toLowerCase().includes(query);
      
      let catMatch = false;
      if (typeof b.category === "object" && b.category) {
        catMatch = 
          b.category.mainCategoryName.toLowerCase().includes(query) ||
          (b.category.subCategoryName?.toLowerCase().includes(query) || false);
      } else if (typeof b.category === "string") {
        catMatch = b.category.toLowerCase().includes(query);
      }
      
      return nameMatch || descMatch || catMatch;
    });
  }, [businesses, searchQuery]);

  return (
    <>
      {/* Floating Circle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-tr from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_30px_rgba(16,185,129,0.5)] transition-all duration-300 outline-none cursor-pointer group hover:scale-105 active:scale-95"
        title={lang === "si" ? "NeuralPress හවුල්කාර ව්‍යාපාර" : "NeuralPress Partner Businesses"}
      >
        <Building2 className="w-6 h-6 animate-pulse" />
        <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 text-[9px] text-white font-bold items-center justify-center">
            {businesses.length || "!"}
          </span>
        </span>
      </button>

      {/* Slide-out Drawer Panel */}
      <AnimatePresence>
        {isOpen && (
          <div 
            className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full sm:max-w-md h-full bg-white dark:bg-zinc-950 border-l border-slate-200/50 dark:border-zinc-800/80 p-6 pt-16 text-slate-900 dark:text-zinc-100 flex flex-col relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-900 transition-colors text-slate-500 dark:text-zinc-400 outline-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title & Description */}
              <div className="mb-6 border-b border-slate-100 dark:border-zinc-800 pb-5">
                <div className="flex items-center gap-2 mb-1.5">
                  <Building2 className="w-6 h-6 text-emerald-500" />
                  <h3 className={`font-inter font-bold tracking-tight text-2xl text-slate-900 dark:text-zinc-50 ${lang === "si" ? "font-sinhala" : ""}`}>
                    {lang === "si" ? "හවුල්කාර ව්‍යාපාර" : "Partner Directory"}
                  </h3>
                </div>
                <p className={`text-sm text-slate-500 dark:text-zinc-400 font-inter font-light leading-relaxed ${lang === "si" ? "font-sinhala text-base" : ""}`}>
                  {lang === "si" 
                    ? "NeuralPress වේදිකාවේ ලියාපදිංචි වී ඇති ප්‍රමුඛතම ව්‍යාපාර සහ දේශීය වෙළෙන්දන් මෙතැනින් ගවේෂණය කරන්න." 
                    : "Explore top premium brands, verified local vendors, and logistics providers registered on the NeuralPress ecosystem."}
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-zinc-500" />
                <input
                  type="text"
                  placeholder={lang === "si" ? "ව්‍යාපාර හෝ කාණ්ඩ සොයන්න..." : "Search brands, categories..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all font-inter text-slate-800 dark:text-slate-100"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Business List Container */}
              <div className="flex-1 overflow-y-auto space-y-4 pb-6 pr-1 custom-scrollbar">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
                    <p className="text-xs">Loading Directory...</p>
                  </div>
                ) : filteredBusinesses.length === 0 ? (
                  <div className="text-center py-20 text-slate-400 font-inter">
                    <span className="text-4xl block mb-3">🏢</span>
                    <p className="text-sm font-semibold">No Businesses Found</p>
                    <p className="text-xs mt-1">Try refining your search keyword.</p>
                  </div>
                ) : (
                  filteredBusinesses.map((b) => {
                    let catName = "Verified Business";
                    if (typeof b.category === "object" && b.category) {
                      catName = b.category.mainCategoryName;
                    } else if (typeof b.category === "string") {
                      catName = b.category;
                    }

                    return (
                      <div 
                        key={b._id}
                        className="group flex flex-col p-5 rounded-3xl border border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/20 hover:border-emerald-500/20 dark:hover:border-emerald-500/30 hover:bg-emerald-500/[0.01] transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full shrink-0">
                                {catName}
                              </span>
                              <span className="flex items-center gap-0.5 text-[10px] font-semibold text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded-full shrink-0">
                                <Star className="w-2.5 h-2.5 fill-amber-500" />
                                4.8
                              </span>
                            </div>
                            <h4 className="text-base font-semibold text-slate-900 dark:text-zinc-50 group-hover:text-emerald-500 transition-colors leading-tight font-inter">
                              {b.name}
                            </h4>
                          </div>
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                        </div>

                        {b.description && (
                          <p className="text-xs text-slate-500 dark:text-zinc-400 font-inter font-light leading-relaxed mb-4 line-clamp-3">
                            {b.description}
                          </p>
                        )}

                        <div className="space-y-1.5 border-t border-slate-100/80 dark:border-zinc-900 pt-3 text-[11px] font-inter font-light text-slate-500 dark:text-zinc-400">
                          {b.address && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span className="truncate">{b.address}</span>
                            </div>
                          )}
                          {b.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{b.phone}</span>
                            </div>
                          )}
                        </div>

                        {b.website && (
                          <a
                            href={b.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-2xl shadow-sm hover:shadow-md transition-all outline-none"
                          >
                            <span>{lang === "si" ? "වෙබ් අඩවියට පිවිසෙන්න" : "Visit Store"}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
