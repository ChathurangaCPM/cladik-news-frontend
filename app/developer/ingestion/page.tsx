"use client";

import React, { useState } from "react";
import { useDeveloper } from "@/app/developer/layout";
import {
  Cpu,
  Sparkles,
  Lock,
  Plus,
  X,
  Check,
  HelpCircle,
  TrendingUp,
  BrainCircuit,
  Sliders,
  SlidersHorizontal,
  Tags,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DeveloperIngestion() {
  const { activePlan, handleSimulatedPlanSwitch } = useDeveloper();

  // Ingestion configuration states
  const [promptGuidance, setPromptGuidance] = useState(
    "Synthesize neural causal timelines highlighting economic policy, foreign reserve metrics, IMF allocations, and national grid updates. Systematically filter out generic tabloid updates or localized minor incidents unless they pose broader macro-economic significance.",
  );
  const [keywords, setKeywords] = useState<string[]>([
    "Inflation",
    "IMF Loan Tranche",
    "Central Bank Rates",
    "Colombo Port City",
    "LPL Cricket Ingestion",
    "Sovereign Debt Restructuring",
  ]);
  const [newKeyword, setNewKeyword] = useState("");

  // Sliders
  const [relevanceThreshold, setRelevanceThreshold] = useState(75); // 0-100%
  const [sentimentCap, setSentimentCap] = useState(0.2); // -1.0 to 1.0 slider
  const [strictGeoFilter, setStrictGeoFilter] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Add keyword pill
  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword("");
    }
  };

  // Remove keyword pill
  const handleRemoveKeyword = (kw: string) => {
    setKeywords(keywords.filter((k) => k !== kw));
  };

  // Simulated save configuration call
  const handleSaveConfig = async () => {
    setSaveLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaveLoading(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Restrict feature access unless user is on the Advanced plan
  const isLocked = activePlan !== "advanced";

  return (
    <div className="space-y-8 font-sans relative">
      <div className="flex items-center justify-center h-[55vh] w-full">
        Coming soon
      </div>

      {/* Title Header Section */}
      {/* <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 bg-cyan-50 border border-cyan-150 text-cyan-700 rounded-full font-black">
            AI Cognitive Ingestion Core
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] text-slate-400 font-mono">
            Parser Engine Configuration
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
          AI Topic & Sentiment Filters
        </h2>
        <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
          Instruct our neural parsing cluster on how to filter, analyze, and
          enrich incoming raw stream reports before database injection. Modify
          core sentiment thresholds, vector extraction guidelines, and priority
          keywords in real-time.
        </p>
      </div> */}

      <div className="relative">
        {/* <AnimatePresence>
          {isLocked && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute -inset-4 bg-slate-900/[0.03] backdrop-blur-[7px] z-30 flex flex-col items-center justify-center p-8 text-center rounded-3xl min-h-[500px]"
            >
              <div className="bg-[#0f172a] border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-5 text-white">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                  <Lock className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-black tracking-tight">
                    Parser Ingestion Rules Locked
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Custom parser prompt directives and sentiment filtering
                    parameters are premium configurations. Upgrade to our
                    high-capacity **Advanced Plan** to fine-tune our background
                    neural ingestion pipeline.
                  </p>
                </div>

                <div className="pt-2 space-y-3">
                  <button
                    onClick={() => handleSimulatedPlanSwitch("advanced")}
                    className="w-full flex items-center justify-center gap-2 text-xs font-extrabold uppercase bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl shadow-lg shadow-indigo-600/25 transition hover:scale-[1.02] cursor-pointer"
                  >
                    Activate Advanced Sandbox{" "}
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                  <div className="text-[10px] text-neutral-500 font-mono">
                    Or toggle the{" "}
                    <span className="text-indigo-400 font-bold">
                      PLAN TESTER
                    </span>{" "}
                    pill at the top of the screen anytime.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence> */}

        {/* Content sections */}
        {/* <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-start ${isLocked ? "pointer-events-none opacity-20 filter blur-[1px]" : ""}`}
        > */}
        {/* <div className="lg:col-span-7 space-y-6">
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <BrainCircuit className="w-4.5 h-4.5 text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-sm tracking-tight">
                  AI Neural Prompt Ingestion Guidance
                </h3>
              </div>

              <div className="space-y-3">
                <p className="text-[11.5px] text-slate-500 leading-relaxed">
                  Provide descriptive parameters in plain English. Our LLM-based
                  background ingestion workers parse incoming streams against
                  these guidelines before saving vectors or translating titles.
                </p>
                <textarea
                  value={promptGuidance}
                  onChange={(e) => setPromptGuidance(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-650 transition font-medium"
                  placeholder="Direct our neural AI models on how to filter topics..."
                />
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>Characters: {promptGuidance.length}</span>
                  <span className="text-indigo-650 font-bold uppercase">
                    Dynamic instruction weight: 1.25x
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Tags className="w-4.5 h-4.5 text-cyan-600 animate-pulse" />
                <h3 className="font-bold text-slate-800 text-sm tracking-tight">
                  Priority Semantic Keywords
                </h3>
              </div>

              <div className="space-y-4">
                <p className="text-[11.5px] text-slate-500 leading-relaxed">
                  Articles possessing explicit semantic associations with these
                  keywords bypass typical threshold limits, triggering real-time
                  webhooks deliveries instantly.
                </p>

                <form onSubmit={handleAddKeyword} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter keyword (e.g. IMF Tranche, Colombo Exchange)"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-650 transition font-semibold"
                  />
                  <button
                    type="submit"
                    disabled={!newKeyword}
                    className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-755 disabled:bg-slate-100 text-white disabled:text-slate-400 px-4 rounded-xl transition cursor-pointer"
                  >
                    Add
                  </button>
                </form>

                <div className="flex flex-wrap gap-2 pt-2">
                  {keywords.map((kw) => (
                    <span
                      key={kw}
                      className="inline-flex items-center gap-1.5 text-xs font-bold font-mono bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1.5 rounded-full transition hover:border-slate-350 hover:bg-slate-100"
                    >
                      {kw}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(kw)}
                        className="text-slate-400 hover:text-rose-600 transition focus:outline-none shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div> */}

        {/* <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sliders className="w-4.5 h-4.5 text-indigo-650 animate-pulse" />
                <h3 className="font-bold text-slate-800 text-sm tracking-tight">
                  Fine-Tuning Parameters
                </h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">
                      Relevance Confidence Threshold
                    </span>
                    <span className="font-mono font-black text-indigo-650">
                      {relevanceThreshold}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={40}
                    max={95}
                    step={5}
                    value={relevanceThreshold}
                    onChange={(e) =>
                      setRelevanceThreshold(parseInt(e.target.value, 10))
                    }
                    className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>40% (Broad Ingest)</span>
                    <span>95% (Extreme Confident)</span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-light leading-snug">
                    Incoming reports with neural correlation index scores under
                    this threshold are rejected before DB storage.
                  </p>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-700">
                      Neutral Sentiment Bias Cap
                    </span>
                    <span className="font-mono font-black text-indigo-650">
                      ±{sentimentCap.toFixed(2)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0.05}
                    max={0.8}
                    step={0.05}
                    value={sentimentCap}
                    onChange={(e) =>
                      setSentimentCap(parseFloat(e.target.value))
                    }
                    className="w-full accent-indigo-600 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                    <span>±0.05 (Absolute Neutral)</span>
                    <span>±0.80 (Allow Polarized)</span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-light leading-snug">
                    Restricts ingestion of highly sensational or biased tabloid
                    editorial reports, ensuring clean news summaries.
                  </p>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <label className="flex items-center justify-between cursor-pointer text-xs font-semibold text-slate-700">
                    <span>Strict Sri Lanka Geo-Relevance</span>
                    <input
                      type="checkbox"
                      checked={strictGeoFilter}
                      onChange={(e) => setStrictGeoFilter(e.target.checked)}
                      className="rounded text-indigo-650 focus:ring-indigo-650 w-4.5 h-4.5"
                    />
                  </label>
                  <p className="text-[9px] text-slate-400 font-light leading-snug">
                    Force immediate evaluation of regional geographic indices to
                    prioritize Sri Lankan economic relevance first.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-5 space-y-4">
              <div className="flex gap-3 text-left">
                <HelpCircle className="w-4 h-4 text-indigo-650 shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-slate-600">
                  <span className="text-[9px] font-extrabold uppercase font-mono block">
                    Real-time Deployment
                  </span>
                  <p className="text-[9.5px] leading-relaxed font-light">
                    Saving config pushes values into redis cache, refreshing
                    parameters on all active neural processors within 5 seconds.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  onClick={handleSaveConfig}
                  disabled={saveLoading}
                  className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 py-3 rounded-xl transition shadow-md active:scale-98 cursor-pointer"
                >
                  {saveLoading
                    ? "Deploying Parameters..."
                    : "Save & Sync Configuration"}
                </button>

                <AnimatePresence>
                  {savedSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-center text-[10.5px] text-emerald-700 font-mono font-bold flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" /> Neural Config Deployed
                      Successfully!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div> */}
        {/* </div> */}
      </div>
    </div>
  );
}
