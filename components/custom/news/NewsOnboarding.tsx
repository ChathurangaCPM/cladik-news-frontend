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
  Languages,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useLangContext } from "@/providers/langProvider";
import {
  AlertDialog,
  AlertDialogContent,
} from "@/components/ui/alert-dialog";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

// Prepend Language Selection Step as the very first step
const getOnboardingSteps = (lang: string) => [
  {
    id: "language",
    title: lang === "si" ? "භාෂාව තෝරන්න" : "Choose Language",
    subtitle: lang === "si" ? "ඔබ කැමති භාෂාව තෝරන්න" : "Select your preferred language",
    description: lang === "si"
      ? "ඔබට මෙම පද්ධතිය සිංහලෙන් හෝ ඉංග්‍රීසියෙන් භාවිතා කළ හැක. පසුව වුවද මෙය වෙනස් කළ හැක."
      : "You can read articles and use all search features in either Sinhala or English. You can switch this at any time.",
    icon: Languages,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    solidBg: "bg-indigo-500",
  },
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
  const { lang, setLanguage } = useLangContext();
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const isMobile = useIsMobile();

  const STEPS = getOnboardingSteps(lang || "si"); // Default fallback to Sinhala "si"

  useEffect(() => {
    // Add forced onboarding bypass flag (?onboarding=true) for instant testing
    const urlParams = new URLSearchParams(window.location.search);
    const forceOnboarding = urlParams.get("onboarding") === "true";
    const hasSeen = localStorage.getItem("neuralpress-onboarding-seen");

    if (!hasSeen || forceOnboarding) {
      // Force Sinhala as default language selection immediately as requested
      setLanguage("si");
      const timer = setTimeout(() => setOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

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

  const renderOnboardingContent = () => (
    <div className="relative w-full text-slate-900 dark:text-zinc-100 font-inter text-left">
      <div className="relative animate-in fade-in-50 duration-200">
        {/* Header Graphic Section */}
        <div className="overflow-hidden px-1 pt-6 py-0 pb-4 text-center relative">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={step.id}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className={cn(
                "flex items-center mb-5 justify-center mx-auto w-20 h-20 rounded-full",
                step.bg,
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
                  className={cn(
                    "mb-2 leading-tight",
                    lang === "si"
                      ? "font-sinhala text-2xl font-semibold"
                      : "font-heading text-3xl font-semibold",
                  )}
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
              "w-[60%] h-[80px] rounded-full mx-auto blur-2xl absolute left-1/2 -translate-x-1/2 opacity-20 top-10 pointer-events-none",
              step.solidBg,
            )}
          />
          <div
            className={cn(
              "w-[60%] h-[1px] blur-sm rounded-full mx-auto absolute left-1/2 -translate-x-1/2 opacity-30 bottom-0 pointer-events-none",
              step.solidBg,
            )}
          />
        </div>

        {/* Content Section: Language Selector Cards or Description Text */}
        <div className="px-1 pt-6 text-center relative min-h-[140px] flex flex-col justify-center">
          {step.id === "language" ? (
            <div className="grid grid-cols-2 gap-4 w-full">
              {/* Sinhala Option Card */}
              <button
                type="button"
                onClick={() => setLanguage("si")}
                className={cn(
                  "flex flex-col items-center gap-3 p-5 rounded-2xl border text-center transition-all duration-300 cursor-pointer outline-none relative overflow-hidden group/opt",
                  lang === "si"
                    ? "border-indigo-500 dark:border-indigo-400 bg-indigo-500/5 dark:bg-indigo-500/10 ring-2 ring-indigo-500/20"
                    : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 hover:border-slate-350 dark:hover:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-900/40",
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    lang === "si"
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-100 dark:bg-zinc-900 text-slate-650 dark:text-zinc-400 group-hover/opt:bg-slate-200 dark:group-hover/opt:bg-zinc-800",
                  )}
                >
                  <span className="font-bold text-sm font-sinhala">සිං</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-sm font-semibold tracking-tight block font-sinhala">
                    සිංහල
                  </span>
                  <span className="text-[10px] text-muted-foreground block font-mono">
                    Sinhala
                  </span>
                </div>
                {lang === "si" && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500" />
                )}
              </button>

              {/* English Option Card */}
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={cn(
                  "flex flex-col items-center gap-3 p-5 rounded-2xl border text-center transition-all duration-300 cursor-pointer outline-none relative overflow-hidden group/opt",
                  lang === "en"
                    ? "border-indigo-500 dark:border-indigo-400 bg-indigo-500/5 dark:bg-indigo-500/10 ring-2 ring-indigo-500/20"
                    : "border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950/40 hover:border-slate-350 dark:hover:border-zinc-700 hover:bg-slate-50/50 dark:hover:bg-zinc-900/40",
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                    lang === "en"
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-100 dark:bg-zinc-900 text-slate-650 dark:text-zinc-400 group-hover/opt:bg-slate-200 dark:group-hover/opt:bg-zinc-800",
                  )}
                >
                  <span className="font-bold text-sm font-inter">EN</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-sm font-semibold tracking-tight block font-inter">
                    English
                  </span>
                  <span className="text-[10px] text-muted-foreground block font-mono font-light">
                    English
                  </span>
                </div>
                {lang === "en" && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500" />
                )}
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "text-center flex flex-col justify-center text-sm text-slate-600 dark:text-zinc-350 leading-relaxed",
                  lang === "si"
                    ? "font-sinhala text-base"
                    : "font-inter font-light",
                )}
              >
                {step.description}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Footer Actions Section */}
        <div className="relative mt-8 pt-6 border-t border-slate-100 dark:border-zinc-800/60">
          <div className="flex items-center justify-between">
            {/* Step Indicators */}
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

            {/* Nav Control Actions */}
            <div className="flex items-center gap-1.5">
              {currentStep > 0 && (
                <button
                  className={cn(
                    "text-slate-400 hover:text-slate-655 dark:text-zinc-500 dark:hover:text-zinc-355 rounded-full text-xs font-semibold px-4 py-2 hover:bg-slate-50 dark:hover:bg-zinc-900/40 transition-colors cursor-pointer",
                    lang === "si" ? "font-sinhala text-sm" : "",
                  )}
                  onClick={handlePrevious}
                >
                  {lang === "si" ? "පෙර පියවර" : "Back"}
                </button>
              )}
              <button
                onClick={handleNext}
                className={cn(
                  "rounded-full font-semibold transition-all duration-300 px-5 py-2 text-xs text-white flex items-center gap-1 shadow-sm hover:opacity-95 cursor-pointer",
                  lang === "si" ? "font-sinhala text-sm" : "",
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
  );

  return (
    <>
      {isMobile ? (
        <Drawer open={open} onOpenChange={() => setOpen(true)} dismissible={false}>
          <DrawerContent className="p-5 outline-none">
            {open && renderOnboardingContent()}
          </DrawerContent>
        </Drawer>
      ) : (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent
            onEscapeKeyDown={(e) => e.preventDefault()}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl overflow-hidden relative text-slate-900 dark:text-zinc-100 outline-none"
          >
            {open && renderOnboardingContent()}
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
