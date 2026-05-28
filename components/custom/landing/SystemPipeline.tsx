"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Brain,
  Globe2,
  Languages,
  Flame,
  ShieldCheck,
  CheckCircle2,
  Activity,
  Cpu,
  Sparkles
} from "lucide-react";

// Premium non-technical simulated log updates
const SIMULATED_LOGS = [
  { text: "Scanning global publications for fresh updates..." },
  { text: "Identified new breaking stories regarding clean energy achievements." },
  { text: "Connecting related news coverage from multiple international publishers..." },
  { text: "Filtering out duplicate stories to isolate unique viewpoints." },
  { text: "Translating international reports to high-quality Sinhala automatically..." },
  { text: "Indexing story concepts to build our intelligent search directory." },
  { text: "Linking updates to our live story discovery catalog." },
  { text: "Verified, formatted, and published on the live feed." }
];

export default function SystemPipeline() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [logIndex, setLogIndex] = useState(0);
  const [activeLogs, setActiveLogs] = useState<{ id: string; text: string }[]>([]);
  const [langFlip, setLangFlip] = useState("en");
  const consoleContainerRef = useRef<HTMLDivElement | null>(null);

  // Stepper workflow interval timer for system overview
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Simulated live console feed rotation
  useEffect(() => {
    setActiveLogs([{ id: "init-0", text: SIMULATED_LOGS[0].text }]);

    const interval = setInterval(() => {
      setLogIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % SIMULATED_LOGS.length;
        setActiveLogs((prevLogs) => {
          const nextId = `${Date.now()}-${Math.random()}`;
          const updated = [...prevLogs, { id: nextId, text: SIMULATED_LOGS[nextIndex].text }];
          // Keep only the last 6 logs
          if (updated.length > 6) updated.shift();
          return updated;
        });
        return nextIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Language auto-flip preview for the feature block card
  useEffect(() => {
    const interval = setInterval(() => {
      setLangFlip((prev) => (prev === "en" ? "si" : "en"));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Safe, container-only scroll (keeps browser viewport fixed!)
  useEffect(() => {
    if (consoleContainerRef.current) {
      consoleContainerRef.current.scrollTop = consoleContainerRef.current.scrollHeight;
    }
  }, [activeLogs]);

  const steps = [
    {
      icon: <Search className="w-4 h-4" />,
      tagEn: "Stage 1",
      tagSi: "පියවර 1",
      titleEn: "Intelligent Search",
      titleSi: "බුද්ධිමත් සෙවුම් පද්ධතිය",
      descEn: "NeuralPress crawls the global web using our own independent search engine to discover fresh breaking updates.",
      descSi: "NeuralPress අපගේ ස්වාධීන සෙවුම් එන්ජිම භාවිතයෙන් ගෝලීය වෙබ් අඩවි නිරන්තරයෙන් ගවේෂණය කරමින් නැවුම් පුවත් සොයා ගනී.",
      badgeEn: "Search Engine",
      badgeSi: "සෙවුම් එන්ජිම"
    },
    {
      icon: <Brain className="w-4 h-4" />,
      tagEn: "Stage 2",
      tagSi: "පියවර 2",
      titleEn: "Contextual Analysis",
      titleSi: "සන්දර්භීය විශ්ලේෂණය",
      descEn: "Our intelligence parsing layer normalizes layout noise, filters false correlations, and extracts event relevance.",
      descSi: "අපගේ බුද්ධිමත් පෙරහන් මඟින් පුවත්පත්වල ව්‍යාජ තොරතුරු සහ අනවශ්‍ය දෑ ඉවත් කර සත්‍ය සන්දර්භය පමණක් උකහා ගනී.",
      badgeEn: "Parsing & Vetting",
      badgeSi: "පිරික්සීම සහ තහවුරු කිරීම"
    },
    {
      icon: <Globe2 className="w-4 h-4" />,
      tagEn: "Stage 3",
      tagSi: "පියවර 3",
      titleEn: "Consensus Clustering",
      titleSi: "එකඟතා පොකුරුගත කිරීම",
      descEn: "We merge duplicate signals and group multiple regional reports together to identify solid, objective core stories.",
      descSi: "එකම පුවත විවිධ මාධ්‍ය වාර්තා කර ඇති ආකාරය සංසන්දනය කර පොදු සත්‍යය හඳුනාගෙන අදාළ පුවත් පොකුරුගත කරයි.",
      badgeEn: "Core Consensus",
      badgeSi: "පොදු එකඟතාව"
    },
    {
      icon: <Languages className="w-4 h-4" />,
      tagEn: "Stage 4",
      tagSi: "පියවර 4",
      titleEn: "Bilingual Translation",
      titleSi: "ද්විභාෂා පරිවර්තනය",
      descEn: "Our neural translation models translate global articles into premium, grammatically sound, high-fidelity Sinhala.",
      descSi: "අපගේ ස්නායුක පරිවර්තන ආකෘති මඟින් ගෝලීය ලිපි උසස්, ව්‍යාකරණානුකූල සහ කියවීමට පහසු සිංහල භාෂාවට පරිවර්තනය කරයි.",
      badgeEn: "Premium Sinhala",
      badgeSi: "උසස් සිංහල"
    },
    {
      icon: <Flame className="w-4 h-4" />,
      tagEn: "Stage 5",
      tagSi: "පියවර 5",
      titleEn: "Vetted Delivery",
      titleSi: "සත්‍යාපිත බෙදාහැරීම",
      descEn: "Clean, objective news is published directly into the feed, accompanied by consensus scores and direct source verification links.",
      descSi: "සියලු මූලාශ්‍ර සහ විශ්වාසනීයත්ව දර්ශකයන් සමඟින් සත්‍යාපනය කළ පුවත් සෘජුවම පරිශීලක පුවත් සංග්‍රහය වෙත නිකුත් කෙරේ.",
      badgeEn: "Live Feed",
      badgeSi: "සජීවී පුවත්"
    }
  ];

  return (
    <section id="engine" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 relative z-10 text-center">
      <span className="text-xs uppercase text-indigo-600 font-mono tracking-wider font-bold">
        OPERATIONAL FLOW
      </span>
      <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mt-3 text-slate-900 leading-tight">
        How our intelligent news system works
      </h2>
      <p className="text-slate-500 max-w-xl mx-auto mt-4 text-sm font-normal">
        Track our real-time flow from independent search to verified consensus stories.
      </p>

      {/* Split Screen Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-16 max-w-5xl mx-auto items-stretch">
        {/* Left Side: Step Stepper List */}
        <div
          className="md:col-span-5 relative flex flex-col justify-between py-2 space-y-6 animate-fade-in"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Flow Line */}
          <div className="absolute left-[19px] top-[20px] bottom-[20px] w-[2px] border-l border-dashed border-slate-200/80 pointer-events-none hidden md:block">
            {/* Active fill segment */}
            <motion.div
              className="absolute top-0 left-[-1px] w-[3px] bg-gradient-to-b from-[#2b86ff] to-indigo-600 rounded-full"
              animate={{ height: `${(activeStep / 4) * 100}%` }}
              transition={{ type: "spring", stiffness: 80, damping: 15 }}
            >
              {/* Glowing Tip Indicator */}
              <motion.div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#2b86ff] shadow-[0_0_12px_#2b86ff] border border-white"
                animate={{ scale: [1, 1.4, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>

          {steps.map((step, idx) => {
            const isActive = idx === activeStep;
            const title = step.titleEn;
            const desc = step.descEn;
            const badge = step.badgeEn;
            const tag = step.tagEn;

            return (
              <div
                key={idx}
                className={`relative z-10 flex gap-5 cursor-pointer text-left group/step transition-all duration-300 ${
                  isActive ? "opacity-100 scale-[1.01]" : "opacity-50 hover:opacity-85"
                }`}
                onClick={() => setActiveStep(idx)}
              >
                {/* Step Indicator Dot */}
                <div
                  className={`w-10 h-10 rounded-full shrink-0 flex items-center justify-center border transition-all duration-500 shadow-sm ${
                    isActive
                      ? "bg-[#2b86ff] border-[#2b86ff] text-white shadow-[0_0_15px_rgba(43,134,255,0.4)] scale-110"
                      : "bg-white border-slate-200 text-slate-400 group-hover/step:border-slate-300"
                  }`}
                >
                  {isActive ? step.icon : <span className="text-xs font-bold font-mono">{idx + 1}</span>}
                </div>

                {/* Step Text Info */}
                <div className="flex-1">
                  <span
                    className={`text-[9px] font-bold font-mono tracking-widest block uppercase transition-all duration-300 ${
                      isActive ? "text-[#2b86ff]" : "text-slate-400"
                    }`}
                  >
                    {tag} • {badge}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1 mb-1.5 transition-all duration-300">
                    {title}
                  </h4>
                  <p className="text-xs text-slate-500 font-light leading-relaxed transition-all duration-300 font-inter">
                    {desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: High-fidelity Live Simulated Dashboard Widget Mockups */}
        <div className="md:col-span-7 bg-white rounded-[2.5rem] border border-slate-200/80 shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-6 min-h-[380px] flex flex-col justify-between overflow-hidden relative group/mockup">
          {/* Subtle spotlight back-lighting */}
          <div className="absolute -inset-px transition duration-300 pointer-events-none bg-[radial-gradient(400px_circle_at_center,rgba(43,134,255,0.02),transparent_80%)]" />

          {/* Simulated Window Control Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 select-none text-slate-700">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-mono text-slate-400 ml-4">
                neuralpress://engine/pipeline-preview
              </span>
            </div>
            <span className="text-[9px] uppercase font-bold tracking-widest font-mono text-slate-400 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-md">
              ACTIVE STAGE
            </span>
          </div>

          {/* Mockup Dynamic Content */}
          <div className="flex-1 flex items-center justify-center p-4 min-h-[260px] relative">
            {activeStep === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full space-y-4"
              >
                {/* Simulated Search bar input */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between shadow-inner">
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-[#2b86ff] animate-pulse" />
                    <span className="text-xs font-mono text-slate-700">
                      search: consensus-verified energy breakthroughs...
                    </span>
                  </div>
                  <div className="w-2 h-4 bg-[#2b86ff] animate-ping shrink-0" />
                </div>

                {/* Mock parsing outputs */}
                <div className="space-y-2 font-mono text-[10px] text-slate-500 text-left">
                  <div className="flex items-center justify-between py-1 px-3 bg-blue-50/40 rounded-xl border border-blue-100/50">
                    <span className="text-[#2b86ff] font-bold">[200 OK]</span>
                    <span className="truncate flex-1 ml-3 text-slate-600">stateofsurveillance.org</span>
                    <span className="text-slate-400 ml-2">14ms</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-3 bg-lime-50/40 rounded-xl border border-lime-100/50">
                    <span className="text-lime-600 font-bold">[200 OK]</span>
                    <span className="truncate flex-1 ml-3 text-slate-600">globalrenewables.net</span>
                    <span className="text-slate-400 ml-2">22ms</span>
                  </div>
                  <div className="flex items-center justify-between py-1 px-3 bg-purple-50/40 rounded-xl border border-purple-100/50">
                    <span className="text-purple-600 font-bold">[200 OK]</span>
                    <span className="truncate flex-1 ml-3 text-slate-600">powertech-insight.org</span>
                    <span className="text-slate-400 ml-2">18ms</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeStep === 1 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full grid grid-cols-2 gap-4"
              >
                {/* Dirty Raw Inputs */}
                <div className="bg-rose-50/40 border border-rose-100 rounded-2xl p-4 text-[9px] font-mono text-rose-800 text-left relative overflow-hidden select-none">
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[8px] font-bold">
                    RAW JUNK
                  </div>
                  <p className="line-through opacity-55 leading-normal mt-3">
                    {"<!-- AD SPONSOR BLOCK -->"}
                    <br />
                    Buy premium coins now! 1536-dimensional vectors embeddings generated in PostgreSQL raw
                    pipeline index crawls...
                  </p>
                </div>

                {/* Clean Filtered summary */}
                <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-4 text-[9px] font-mono text-emerald-800 text-left relative overflow-hidden">
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[8px] font-bold">
                    VETTED DATA
                  </div>
                  <p className="leading-relaxed mt-3 font-semibold text-emerald-900">
                    Extracted core factual summary detailing localized active clean grid performance metrics.
                  </p>
                </div>
              </motion.div>
            )}

            {activeStep === 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full flex flex-col items-center justify-center"
              >
                {/* Connection cluster map visual */}
                <div className="relative w-64 h-36 flex items-center justify-center select-none text-slate-800">
                  {/* Central Consensus Node */}
                  <div className="w-14 h-14 rounded-full bg-emerald-500 border border-white shadow-[0_0_20px_rgba(16,185,129,0.4)] flex flex-col items-center justify-center text-white z-10 animate-pulse">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-[8px] font-bold mt-0.5">99.2%</span>
                  </div>

                  {/* Peripheral Source Node 1 */}
                  <div className="absolute top-2 left-6 w-9 h-9 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-500 shadow-sm text-[8px] font-bold">
                    US
                  </div>
                  {/* Connecting Line 1 */}
                  <svg className="absolute left-[38px] top-[24px] w-24 h-16 pointer-events-none">
                    <line x1="0" y1="0" x2="80" y2="50" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                  </svg>

                  {/* Peripheral Source Node 2 */}
                  <div className="absolute bottom-2 left-10 w-9 h-9 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-500 shadow-sm text-[8px] font-bold">
                    EU
                  </div>
                  {/* Connecting Line 2 */}
                  <svg className="absolute left-[44px] bottom-[28px] w-20 h-12 pointer-events-none">
                    <line x1="0" y1="40" x2="70" y2="0" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                  </svg>

                  {/* Peripheral Source Node 3 */}
                  <div className="absolute top-10 right-6 w-9 h-9 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 shadow-sm text-[8px] font-bold">
                    LK
                  </div>
                  {/* Connecting Line 3 */}
                  <svg className="absolute right-[44px] top-[46px] w-20 h-12 pointer-events-none">
                    <line x1="70" y1="0" x2="0" y2="20" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                  </svg>
                </div>
              </motion.div>
            )}

            {activeStep === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full space-y-3 text-left font-mono text-[10px]"
              >
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between min-h-[100px] shadow-sm">
                  <div className="border-b border-slate-200/50 pb-2 flex items-center justify-between">
                    <span className="text-slate-400 text-[8px]">ORIGINAL (ENGLISH)</span>
                    <span className="text-xs">🇺🇸</span>
                  </div>
                  <p className="text-slate-700 leading-normal mt-2">
                    “Advanced grid arrays have successfully delivered sustainable clean energy across localized
                    regions.”
                  </p>
                </div>

                <div className="bg-indigo-50/80 border border-indigo-200/50 rounded-2xl p-4 flex flex-col justify-between min-h-[100px] shadow-[0_10px_25px_rgba(99,102,241,0.04)] relative group">
                  <div className="absolute top-0 right-4 h-5 w-12 bg-indigo-500 text-white text-[8px] font-bold flex items-center justify-center rounded-b-lg animate-pulse uppercase tracking-wider">
                    NEURAL
                  </div>
                  <div className="border-b border-indigo-100 pb-2 flex items-center justify-between">
                    <span className="text-indigo-400 text-[8px]">BILINGUAL SYNTHESIS</span>
                    <span className="text-xs">🇱🇰</span>
                  </div>
                  <p className="text-indigo-900 leading-relaxed text-xs mt-2 font-medium">
                    “නවීන විදුලිබල පද්ධති මඟින් දේශීය ප්‍රදේශ පුරා තිරසාර පිරිසිදු බලශක්තිය සාර්ථකව ලබා දී ඇත.”
                  </p>
                </div>
              </motion.div>
            )}

            {activeStep === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-sm"
              >
                {/* Vetted live card layout */}
                <div className="bg-white border border-slate-200 shadow-[0_15px_30px_rgba(0,0,0,0.06)] rounded-3xl p-5 text-left relative overflow-hidden group">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="text-[10px] text-emerald-500 font-bold font-mono flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> NEURALPRESS AI VERIFIED
                    </span>
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-3 mb-2">
                    Dynamic growth of clean sustainable energy arrays
                  </h4>
                  <p className="text-slate-500 text-[11px] leading-relaxed font-light">
                    Vetted across 14 trusted international sources. Consensus verified with zero false duplicate
                    references.
                  </p>
                  <div className="mt-4 flex items-center justify-between text-[9px] font-mono text-slate-400">
                    <span>Confidence Score: 99%</span>
                    <span className="text-emerald-500 font-bold">CONSENSUS MATCH OK</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Mockup footer progress bar indicating pipeline cycle */}
          <div className="border-t border-slate-100 pt-4 flex items-center justify-between text-[10px] text-slate-400 font-mono select-none">
            <span>Pipeline Cycle: Autonomous Swarm</span>
            <div className="w-32 bg-slate-100 h-1 rounded-full overflow-hidden">
              <motion.div
                className="bg-[#2b86ff] h-full rounded-full"
                animate={{ width: `${((activeStep + 1) / 5) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Console log terminal view (System pipeline log stream) */}
      <div id="performance" className="max-w-3xl mx-auto mt-20 relative bg-white border border-slate-200/80 rounded-[2rem] shadow-sm overflow-hidden select-none">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
            <span className="text-[10px] font-mono text-slate-400 font-semibold tracking-wider">
              neuralpress@engine:~
            </span>
          </div>
          <span className="text-[10px] font-mono font-semibold uppercase bg-indigo-50 text-indigo-600 border border-indigo-100 px-2.5 py-0.5 rounded-full">
            Live Index
          </span>
        </div>

        <div
          ref={consoleContainerRef}
          className="p-6 bg-slate-50/30 rounded-b-[1.75rem] h-[220px] font-mono text-xs overflow-y-auto space-y-3 scroll-smooth custom-scrollbar border border-slate-100/50"
        >
          <AnimatePresence mode="popLayout">
            {activeLogs.map((log, index) => {
              let colorClass = "text-slate-600";
              const text = log.text;
              const logKey = `${log.id}-${index}`;

              if (text.startsWith("Filtering")) colorClass = "text-emerald-600 font-semibold";
              if (text.startsWith("Translating")) colorClass = "text-indigo-600 font-semibold";
              if (text.startsWith("Verified")) colorClass = "text-cyan-600 font-bold";

              return (
                <motion.div
                  key={logKey}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-start gap-3 border-l border-slate-200 pl-3 py-0.5 text-left"
                >
                  <span className="text-indigo-500 font-bold">➔</span>
                  <span className={colorClass}>{text}</span>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Feature blocks (Comprehensive consulting and intelligent innovation) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto">
        <div className="bg-white border border-slate-200/60 rounded-[2rem] p-8 text-left shadow-sm flex flex-col justify-between min-h-[220px]">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-6">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading mb-2 text-slate-900">AI Accuracy</h3>
            <p className="text-slate-500 text-xs font-normal leading-relaxed">
              Smart indexing models read and cluster stories conceptually, giving you semantic matching maps.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-[2rem] p-8 text-left shadow-sm flex flex-col justify-between min-h-[220px] relative overflow-hidden group">
          {/* Bilingual translation active preview */}
          <div className="absolute top-4 right-4 bg-indigo-50 border border-indigo-100 rounded-lg p-2 font-mono text-[9px] text-indigo-500 h-9 flex items-center justify-center font-bold">
            {langFlip === "en" ? "EN: Clean Energy" : "SI: පිරිසිදු බලශක්තිය"}
          </div>
          <div className="w-10 h-10 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 mb-6">
            <Languages className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading mb-2 text-slate-900">Bilingual Reading</h3>
            <p className="text-slate-500 text-xs font-normal leading-relaxed">
              We automatically translate global news to premium, high-quality Sinhala automatically.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-[2rem] p-8 text-left shadow-sm flex flex-col justify-between min-h-[220px]">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-6">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-heading mb-2">Vetted Catalog</h3>
            <p className="text-slate-500 text-xs font-normal leading-relaxed">
              We keep unique story coverage angles while removing duplicates and ensuring strict safety standards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
