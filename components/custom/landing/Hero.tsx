"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Languages,
  Activity,
  CheckCircle2,
  Compass,
  ShieldCheck,
} from "lucide-react";
import { fetchNews } from "@/app/news/actions";
import Header from "./Header";

// Helper to detect Sinhala unicode characters to apply the custom font
const isSinhalaText = (text: string) => {
  if (typeof text !== "string") return false;
  return /[\u0d80-\u0dff]/.test(text);
};

export default function Hero() {
  const [latestNews, setLatestNews] = useState<any[]>([]);
  const [langFlip, setLangFlip] = useState("en");

  // Fetch the latest 5 news articles for the dynamic hero deck
  useEffect(() => {
    async function loadLatestNews() {
      try {
        const news = await fetchNews(0, 5);
        if (news && news.length > 0) {
          setLatestNews(news);
        }
      } catch (err) {
        console.error("Error loading news in hero:", err);
      }
    }
    loadLatestNews();
  }, []);

  // Language auto-flip preview
  useEffect(() => {
    const interval = setInterval(() => {
      setLangFlip((prev) => (prev === "en" ? "si" : "en"));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // We populate our cards list by merging latest fetched news with default fallbacks
  const getHeroCardData = (index: number) => {
    const isSinhala = langFlip === "si";
    const article = latestNews[index];

    if (article) {
      const category =
        article.categories?.[0] ||
        article.originalSource ||
        (isSinhala ? "නවතම පුවත්" : "LATEST NEWS");
      const title = isSinhala
        ? article.sinhalaTitle || article.title
        : article.title;
      // Truncate the title nicely to fit the small card dimensions
      const truncatedTitle =
        title.length > 55 ? title.substring(0, 52) + "..." : title;
      const slug = article.slug || "";
      const path = slug ? `/news/${slug}` : "/news";

      return {
        tag: category.toUpperCase(),
        text: truncatedTitle,
        icon: <Sparkles className="w-3.5 h-3.5" />,
        isDynamic: true,
        path,
        tagColor:
          index === 0
            ? "text-[#2b86ff]"
            : index === 1
              ? "text-lime-600"
              : index === 2
                ? "text-emerald-500"
                : index === 3
                  ? "text-purple-500"
                  : "text-amber-500",
        iconBg:
          index === 0
            ? "bg-blue-50 text-[#2b86ff]"
            : index === 1
              ? "bg-lime-50 text-lime-600"
              : index === 2
                ? "bg-emerald-50 text-emerald-500"
                : index === 3
                  ? "bg-purple-50 text-purple-500"
                  : "bg-amber-50 text-amber-500",
      };
    }

    const fallbacks = [
      {
        tag: isSinhala ? "ද්විභාෂා කියවීම" : "BILINGUAL READ",
        text: isSinhala
          ? "ගෝලීය පුවත් ක්ෂණිකව සිංහල භාෂාවෙන්."
          : "Instant translation to premium Sinhala.",
        icon: <Languages className="w-3 h-3" />,
        path: "/news",
        tagColor: "text-[#2b86ff]",
        iconBg: "bg-blue-50 text-[#2b86ff]",
      },
      {
        tag: isSinhala ? "නිරන්තර දර්ශකය" : "CONTINUOUS INDEX",
        text: isSinhala
          ? "අපගේ තාක්ෂණය නිරන්තරයෙන් පුවත් දර්ශකගත කරයි."
          : "Our engine continuously indexes search maps.",
        icon: <Activity className="w-3.5 h-3.5" />,
        path: "/news",
        tagColor: "text-lime-600",
        iconBg: "bg-lime-50 text-lime-600",
      },
      {
        tag: isSinhala ? "ප්‍රකාශිත එකඟතාවය" : "Consensus OK",
        text: isSinhala
          ? "ගෝලීය පුවත් ප්‍රභවයන් 14ක් එකඟතාවයකට ගෙන ඇත."
          : "Consolidated 14 global story duplicate signals.",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        path: "/news",
        tagColor: "text-emerald-500",
        iconBg: "bg-emerald-50 text-emerald-500",
      },
      {
        tag: isSinhala ? "සෙවුම් දිශාව" : "SEARCH DIRECTION",
        text: isSinhala
          ? "පුවත් සංකල්ප සිතියම්කරණය සක්‍රීයයි..."
          : "Tracing concept concept mappings...",
        icon: <Compass className="w-3.5 h-3.5" />,
        path: "/news",
        tagColor: "text-purple-500",
        iconBg: "bg-purple-50 text-purple-500",
      },
      {
        tag: isSinhala ? "සත්‍යාපිත පුවත්" : "VETTED ACTIVE",
        text: isSinhala
          ? "සත්‍යාපනය කරන ලද සක්‍රීය පුවත් වාර්තා."
          : "Consensus-verified active story.",
        icon: <ShieldCheck className="w-3 h-3" />,
        path: "/news",
        tagColor: "text-amber-500",
        iconBg: "bg-amber-50 text-amber-500",
      },
    ];

    return { ...fallbacks[index], isDynamic: false };
  };

  return (
    <div className="relative bg-gradient-to-b from-[#2b86ff] via-[#489cff] to-[#fafbfe] pt-6 pb-28 overflow-hidden text-white">
      {/* Animated Blurry Clouds */}
      <div
        className="absolute top-[20%] left-[-10%] w-[45%] h-[40%] bg-white/20 rounded-full blur-[110px] pointer-events-none animate-pulse"
        style={{ animationDuration: "8s" }}
      />
      <div
        className="absolute top-[10%] right-[-10%] w-[45%] h-[45%] bg-white/20 rounded-full blur-[110px] pointer-events-none animate-pulse"
        style={{ animationDuration: "10s" }}
      />

      {/* Floating Capsule Header Navbar (Aeline style) */}
      <Header />

      {/* Hero Headline content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-16 md:mt-24 relative z-10 md:pt-[40px]">
        <h1 className="text-5xl md:text-5xl tracking-[-2px] leading-[1.05] max-w-5xl mx-auto text-white">
          Bridging global news with conceptual clarity
          <br />
          <span className="font-heading italic font-extralight">
            And Bilingual AI.
          </span>
        </h1>
        <p className="mt-8 text-base text-white/85 font-light max-w-2xl mx-auto leading-relaxed">
          Discover a smarter, conceptual way to navigate global news.
          NeuralPress aggregates multiple perspectives, translates articles
          seamlessly, and ensures complete clarity.
        </p>

        {/* Action buttons */}
        {/* <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/news"
            className="px-8 py-4 bg-lime-400 text-slate-900 hover:bg-lime-300 text-sm font-semibold rounded-full shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div> */}

        {/* Curved Floating Card Deck (Aeline signature visual) */}
        <div className="mt-20 max-w-5xl mx-auto relative flex items-center justify-center h-[220px] select-none">
          {/* Card 1 */}
          <Link
            href={getHeroCardData(0).path}
            className="absolute left-[2%] z-10 block"
          >
            <motion.div
              initial={{ x: 16, y: 32, rotate: -12 }}
              animate={{ y: [32, 22, 32] }}
              whileHover={{ scale: 1.05, y: 12, rotate: -6, zIndex: 50 }}
              transition={{
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 0.3 },
                rotate: { duration: 0.3 },
              }}
              className="w-[180px] h-[120px] bg-white rounded-2xl border border-slate-200/50 shadow-[0_15px_30px_rgba(0,0,0,0.06)] flex flex-col justify-between p-4 opacity-70 cursor-pointer text-left"
            >
              <span
                className={`text-[10px] font-semibold ${
                  getHeroCardData(0).tagColor
                } ${
                  isSinhalaText(getHeroCardData(0).tag)
                    ? "font-sinhala text-[11px] tracking-normal"
                    : "font-mono"
                }`}
              >
                {getHeroCardData(0).tag}
              </span>
              <p
                className={`text-xs font-bold text-slate-800 leading-snug line-clamp-3 ${
                  isSinhalaText(getHeroCardData(0).text)
                    ? "font-sinhala tracking-normal text-sm font-medium leading-relaxed"
                    : ""
                }`}
              >
                {getHeroCardData(0).text}
              </p>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  getHeroCardData(0).iconBg
                }`}
              >
                {getHeroCardData(0).icon}
              </div>
            </motion.div>
          </Link>

          {/* Card 2 */}
          <Link
            href={getHeroCardData(1).path}
            className="absolute left-[22%] z-10 block"
          >
            <motion.div
              initial={{ x: 8, y: 8, rotate: -6 }}
              animate={{ y: [8, -2, 8] }}
              whileHover={{ scale: 1.05, y: -12, rotate: -2, zIndex: 50 }}
              transition={{
                y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 0.3 },
                rotate: { duration: 0.3 },
              }}
              className="w-[180px] h-[130px] bg-white rounded-2xl border border-slate-200/50 shadow-[0_15px_30px_rgba(0,0,0,0.06)] flex flex-col justify-between p-4 opacity-90 cursor-pointer text-left"
            >
              <span
                className={`text-[10px] font-semibold ${
                  getHeroCardData(1).tagColor
                } ${
                  isSinhalaText(getHeroCardData(1).tag)
                    ? "font-sinhala text-[11px] tracking-normal"
                    : "font-mono"
                }`}
              >
                {getHeroCardData(1).tag}
              </span>
              <p
                className={`text-xs font-bold text-slate-800 leading-snug line-clamp-3 ${
                  isSinhalaText(getHeroCardData(1).text)
                    ? "font-sinhala tracking-normal text-sm font-medium leading-relaxed"
                    : ""
                }`}
              >
                {getHeroCardData(1).text}
              </p>
              {getHeroCardData(1).isDynamic ? (
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    getHeroCardData(1).iconBg
                  }`}
                >
                  {getHeroCardData(1).icon}
                </div>
              ) : (
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#2b86ff] w-[80%] h-full rounded-full" />
                </div>
              )}
            </motion.div>
          </Link>

          {/* Card 3 (Center showcase) */}
          <Link href={getHeroCardData(2).path} className="absolute z-20 block">
            <motion.div
              initial={{ x: 0, y: -16, rotate: 0 }}
              animate={{ y: [-16, -26, -16] }}
              whileHover={{ scale: 1.08, y: -36, rotate: 2, zIndex: 50 }}
              transition={{
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 0.3 },
                rotate: { duration: 0.3 },
              }}
              className="w-[200px] h-[150px] bg-white rounded-2xl border border-slate-200 shadow-[0_20px_40px_rgba(0,0,0,0.1)] flex flex-col justify-between p-5 cursor-pointer text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span
                  className={`text-[10px] font-bold uppercase ${
                    getHeroCardData(2).tagColor
                  } ${
                    isSinhalaText(getHeroCardData(2).tag)
                      ? "font-sinhala text-[11px] tracking-normal"
                      : "font-mono"
                  }`}
                >
                  {getHeroCardData(2).tag}
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <p
                className={`text-xs font-extrabold text-slate-800 leading-normal line-clamp-3 ${
                  isSinhalaText(getHeroCardData(2).text)
                    ? "font-sinhala tracking-normal text-sm font-medium leading-relaxed"
                    : ""
                }`}
              >
                {getHeroCardData(2).text}
              </p>
              {getHeroCardData(2).isDynamic ? (
                <span className="text-[10px] text-slate-400 font-mono">
                  Confidence: 98%
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-mono">
                  Confidence: 99%
                </span>
              )}
            </motion.div>
          </Link>

          {/* Card 4 */}
          <Link
            href={getHeroCardData(3).path}
            className="absolute right-[22%] z-10 block"
          >
            <motion.div
              initial={{ x: -8, y: 8, rotate: 6 }}
              animate={{ y: [8, -2, 8] }}
              whileHover={{ scale: 1.05, y: -12, rotate: 2, zIndex: 50 }}
              transition={{
                y: { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 0.3 },
                rotate: { duration: 0.3 },
              }}
              className="w-[180px] h-[130px] bg-white rounded-2xl border border-slate-200/50 shadow-[0_15px_30px_rgba(0,0,0,0.06)] flex flex-col justify-between p-4 opacity-90 cursor-pointer text-left"
            >
              <span
                className={`text-[10px] font-semibold ${
                  getHeroCardData(3).tagColor
                } ${
                  isSinhalaText(getHeroCardData(3).tag)
                    ? "font-sinhala text-[11px] tracking-normal"
                    : "font-mono"
                }`}
              >
                {getHeroCardData(3).tag}
              </span>
              <p
                className={`text-xs font-bold text-slate-800 leading-snug line-clamp-3 ${
                  isSinhalaText(getHeroCardData(3).text)
                    ? "font-sinhala tracking-normal text-sm font-medium leading-relaxed"
                    : ""
                }`}
              >
                {getHeroCardData(3).text}
              </p>
              {getHeroCardData(3).isDynamic ? (
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    getHeroCardData(3).iconBg
                  }`}
                >
                  {getHeroCardData(3).icon}
                </div>
              ) : (
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-100" />
                </div>
              )}
            </motion.div>
          </Link>

          {/* Card 5 */}
          <Link
            href={getHeroCardData(4).path}
            className="absolute right-[2%] z-10 block"
          >
            <motion.div
              initial={{ x: -16, y: 32, rotate: 12 }}
              animate={{ y: [32, 22, 32] }}
              whileHover={{ scale: 1.05, y: 12, rotate: 6, zIndex: 50 }}
              transition={{
                y: { duration: 4.8, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 0.3 },
                rotate: { duration: 0.3 },
              }}
              className="w-[180px] h-[120px] bg-white rounded-2xl border border-slate-200/50 shadow-[0_15px_30px_rgba(0,0,0,0.06)] flex flex-col justify-between p-4 opacity-70 cursor-pointer text-left"
            >
              <span
                className={`text-[10px] font-semibold ${
                  getHeroCardData(4).tagColor
                } ${
                  isSinhalaText(getHeroCardData(4).tag)
                    ? "font-sinhala text-[11px] tracking-normal"
                    : "font-mono"
                }`}
              >
                {getHeroCardData(4).tag}
              </span>
              <p
                className={`text-xs font-bold text-slate-800 leading-snug line-clamp-3 ${
                  isSinhalaText(getHeroCardData(4).text)
                    ? "font-sinhala tracking-normal text-sm font-medium leading-relaxed"
                    : ""
                }`}
              >
                {getHeroCardData(4).text}
              </p>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  getHeroCardData(4).iconBg
                }`}
              >
                {getHeroCardData(4).icon}
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}
