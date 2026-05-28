"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Bot,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLangContext } from "@/providers/langProvider";

const getOnboardingSteps = (lang: string) => [
  {
    id: "welcome",
    title:
      lang === "si"
        ? "NeuralPress වෙත සාදරයෙන් පිළිගන්නවා!"
        : "Welcome to NeuralPress",
    subtitle:
      lang === "si"
        ? "පුවත් දැනගන්න අලුත්ම විදිහ"
        : "The future of news discovery",
    description:
      lang === "si"
        ? "ලෝකය පුරා සිදුවන දේවල් ඉක්මනින්ම දැනගන්න. අපේ AI තාක්ෂණය මගින් විවිධ පුවත් දහස් ගණනක් අතරින් වැදගත්ම දේ විතරක් සාරාංශ කරලා ඔබට ලබා දෙනවා."
        : "Experience the next generation of knowledge discovery. Our AI agents continuously curate, summarize, and verify thousands of global articles.",
    icon: Sparkles,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    solidBg: "bg-indigo-500",
  },
  {
    id: "search",
    title:
      lang === "si" ? "ඔබට අවශ්‍ය දේ ක්ෂණිකව සොයන්න" : "Semantic Discovery",
    subtitle:
      lang === "si" ? "පහසුවෙන් ඕනෑම දෙයක් අසන්න" : "Search conceptually",
    description:
      lang === "si"
        ? "Keywords විතරක්ම නෙවෙයි, ඔබට අවශ්‍ය දේ විස්තර කරලා ලියන්න නැත්නම් ප්‍රශ්නයක් අසන්න. අපේ AI එක ඒකට ගැළපෙන පුවත් මොහොතකින් හොයලා දෙයි."
        : "Don't just search for keywords. Describe a concept or ask a question, and our AI will find deeply relevant matching events instantly.",
    icon: Search,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    solidBg: "bg-emerald-500",
  },
  {
    id: "realtime",
    title: lang === "si" ? "සජීවී පුවත් ප්‍රවාහය" : "Live Knowledge Stream",
    subtitle: lang === "si" ? "වෙනස් වෙන පුවත් එසැණින්" : "Watch news unfold",
    description:
      lang === "si"
        ? "ලෝකය පුරා පුවත් සිදුවෙන වේගයෙන්ම ඔබේ තිරයට එනවා බලන්න. Refresh කරන්න අවශ්‍ය නැහැ, සියලුම දේ ස්වයංක්‍රීයව යාවත්කාලීන වෙනවා."
        : "Watch as news arrives on your screen exactly as it unfolds globally. No need to refresh, the feed updates automatically.",
    icon: Zap,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    solidBg: "bg-amber-500",
  },
  {
    id: "enriched",
    title: lang === "si" ? "පැහැදිලි තොරතුරු" : "Enriched Context",
    subtitle: lang === "si" ? "ඇත්ත තත්ත්වය දැනගන්න" : "Deep dive into facts",
    description:
      lang === "si"
        ? "සාරාංශයක් මත ක්ලික් කරලා ඒ ගැන තව විස්තර දැනගන්න. විවිධ මූලාශ්‍ර හරහා ලැබෙන තොරතුරු මගින් පුවතක ඇත්ත නැත්ත හොඳින් තේරුම් ගන්න පුළුවන්."
        : "Click on any summary to dive deeper into multi-source fact-checking and structured data, ensuring you get the full picture.",
    icon: CheckCircle2,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    solidBg: "bg-blue-500",
  },
  {
    id: "ai-generated",
    title: lang === "si" ? "AI මගින් නිර්මාණය කළ පුවත්" : "AI Curated Content",
    subtitle: lang === "si" ? "විශේෂ දැනුම් දීමක්" : "Important disclosure",
    description:
      lang === "si"
        ? "මෙය සම්පූර්ණයෙන්ම ස්වයංක්‍රීය AI පද්ධතියකි. මෙහි ඇති ලිපි අපගේ AI මගින් ස්වයංක්‍රීයව සකස් කර ඇත. සමහර අවස්ථාවල ලිපියට අදාළව නිර්මාණය වන ඡායාරූප සුළු වශයෙන් වෙනස් විය හැකි බව කරුණාවෙන් සලකන්න."
        : "This is a fully automated AI news aggregator. All articles are autonomously written by our AI agents. Please note that occasionally, dynamically generated images may not perfectly align with the exact article content.",
    icon: Bot,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    solidBg: "bg-purple-500",
  },
];

export function NewsOnboarding() {
  const { lang, isLoadingLangData } = useLangContext();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const STEPS = getOnboardingSteps(lang || "en");

  useEffect(() => {
    if (isLoadingLangData) return;
    const hasSeen = localStorage.getItem("neuralpress-onboarding-seen");
    if (!hasSeen) {
      const timer = setTimeout(() => setOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoadingLangData]);

  const handleComplete = () => {
    localStorage.setItem("neuralpress-onboarding-seen", "true");
    setOpen(false);
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const step = STEPS[currentStep];
  const Icon = step.icon;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-inter">
      <div 
        className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200 overflow-hidden relative text-slate-900 dark:text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleComplete}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-850 text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 outline-none transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative">
          {/* Header Graphic */}
          <div className="overflow-hidden px-5 pt-6 py-0 pb-4 text-center relative">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className={cn(
                  "flex items-center mb-5 justify-center mx-auto w-20 h-20 rounded-full",
                  step.bg
                )}
              >
                <Icon className={cn("w-10 h-10", step.color)} strokeWidth={1.5} />
              </motion.div>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="text-center flex flex-col justify-center"
              >
                <div className="mx-auto">
                  <h2
                    className={`${lang === "si" ? "font-sinhala text-2xl font-semibold" : "font-heading text-3xl font-semibold"} mb-2 leading-tight`}
                  >
                    {step.title}
                  </h2>
                  <span
                    className={cn(
                      "text-sm font-medium",
                      lang === "si" ? "font-sinhala text-base" : "",
                      step.color,
                    )}
                  >
                    {step.subtitle}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            <div
              className={cn(
                "w-[60%] h-[80px] rounded-full mx-auto blur-2xl absolute left-1/2 -translate-x-1/2 opacity-20 top-10",
                step.solidBg,
              )}
            ></div>
            <div
              className={cn(
                "w-[60%] h-[1px] blur-sm rounded-full mx-auto absolute left-1/2 -translate-x-1/2 opacity-30 bottom-0",
                step.solidBg,
              )}
            ></div>
          </div>

          <div className="px-5 pt-8 text-center relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className={`text-center flex flex-col justify-center text-sm text-slate-600 dark:text-zinc-350 leading-relaxed ${lang === "si" ? "font-sinhala text-base" : "font-inter font-light"}`}
              >
                {step.description}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="relative mt-8 pt-6 border-t border-slate-100 dark:border-zinc-800/80">
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5 ml-2">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === currentStep
                        ? cn("w-6", step.solidBg)
                        : "w-1.5 bg-slate-200 dark:bg-zinc-800",
                    )}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                {currentStep > 0 && (
                  <button
                    className={`text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-350 rounded-full text-sm font-medium px-4 py-2 hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors ${lang === "si" ? "font-sinhala" : ""}`}
                    onClick={handlePrevious}
                  >
                    {lang === "si" ? "පෙර පියවර" : "Back"}
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className={cn(
                    `rounded-full font-medium transition-all duration-300 px-5 py-2 text-sm text-white flex items-center gap-1 shadow-sm hover:opacity-95 ${lang === "si" ? "font-sinhala" : ""}`,
                    step.solidBg,
                  )}
                >
                  {currentStep === STEPS.length - 1
                    ? lang === "si"
                      ? "ආරම්භ කරන්න"
                      : "Get Started"
                    : lang === "si"
                      ? "ඊළඟට"
                      : "Next"}
                  {currentStep < STEPS.length - 1 && (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
