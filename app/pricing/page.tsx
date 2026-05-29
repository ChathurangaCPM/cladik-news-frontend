"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import PricingSection from "@/components/custom/landing/PricingSection";
import { ThemeToggle } from "@/components/custom/news/ThemeToggle";
import {
  HelpCircle,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  Database,
  Code2,
  Sparkles,
  Network,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What is a conceptual news search?",
    answer: "Unlike traditional keyword searches, conceptual searches use semantic embeddings and LLMs to understand the contextual meaning of your query. For instance, searching 'rising food costs in Colombo' will find articles matching inflation, crop damage, import restrictions, or supermarket price hikes even if the exact words 'rising food costs' do not appear in the text.",
  },
  {
    question: "How are bilingual articles managed?",
    answer: "Our pipeline ingests news from multiple English and Sinhala publications. For Business and Advanced tiers, the platform automatically synthesizes translated summaries and matched concepts using Gemini, making all ingested Sri Lankan event reports accessible in English and Sinhala seamlessly.",
  },
  {
    question: "Is there a rate limit on the Free Plan?",
    answer: "Yes, the Free Plan is limited to 100 requests per day and has a rate limit constraint of 3 requests per 10 seconds in our sandbox. This is designed for testing and learning the API structure before scaling to production.",
  },
  {
    question: "Can I cancel or change my plan anytime?",
    answer: "Absolutely! You can upgrade, downgrade, or cancel your plan at any time directly through the Billing section of the Developer Dashboard. Changes take effect immediately, and any annual pricing is prorated.",
  },
  {
    question: "How do webhook deliveries work?",
    answer: "On the Business and Advanced tiers, you can configure webhook endpoints. Whenever our engine processes, deduplicates, and validates a new news event, a JSON payload is immediately POSTed to your server. Business delivers under 60s; Advanced delivers under 5s.",
  },
];

export default function PricingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#fafbfe] dark:bg-[#07090e] text-slate-800 dark:text-neutral-100 transition-colors duration-300 overflow-x-hidden selection:bg-indigo-500/30 pb-20 relative">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#2b86ff]/10 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-lime-400/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Modern Capsule Navigation bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <header className="bg-white/70 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/[0.05] shadow-[0_10px_30px_rgba(0,0,0,0.02)] backdrop-blur-xl h-20 rounded-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/main-logo.png" width={36} height={36} className="w-8 h-8 object-contain logo-light" alt="NeuralPress" />
              <Image src="/main-logo-white.png" width={36} height={36} className="w-8 h-8 object-contain logo-dark" alt="NeuralPress" />
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Neural<span className="text-indigo-600">Press</span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-neutral-300">
            <Link href="/news" className="hover:text-indigo-600 dark:hover:text-white transition">
              Discovery Feed
            </Link>
            <Link href="/pricing" className="text-indigo-600 dark:text-white transition font-bold">
              API Pricing
            </Link>
            <Link href="/developer/dashboard" className="hover:text-indigo-600 dark:hover:text-white transition">
              Developer Portal
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/developer/dashboard"
              className="px-5 py-2.5 rounded-full text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/10 hover:scale-[1.02] transition-all"
            >
              Developer Dashboard
            </Link>
          </div>
        </header>
      </div>

      {/* Main Pricing Section Component */}
      <div className="relative z-10 mt-12">
        <PricingSection />
      </div>

      {/* Technical Feature Matrix Grid */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
        <div className="text-center mb-16">
          <span className="text-xs uppercase text-indigo-600 dark:text-indigo-400 font-mono tracking-wider font-bold">
            Technical Specification
          </span>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Compare developer capabilities
          </h3>
          <p className="text-slate-500 dark:text-neutral-400 text-sm max-w-lg mx-auto mt-3">
            Choose the right level of database access, translations, and custom parameters for your app.
          </p>
        </div>

        <div className="bg-white/60 dark:bg-white/[0.01] border border-slate-200/80 dark:border-white/[0.05] rounded-3xl overflow-hidden shadow-sm dark:shadow-none backdrop-blur-xl">
          <div className="p-6 sm:p-8 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-white/[0.05] pb-4">
                  <th className="py-4 text-xs uppercase font-bold text-slate-400 font-mono">Capabilities</th>
                  <th className="py-4 text-xs uppercase font-bold text-slate-900 dark:text-white font-mono text-center">Free</th>
                  <th className="py-4 text-xs uppercase font-bold text-indigo-600 dark:text-indigo-400 font-mono text-center bg-indigo-50/50 dark:bg-indigo-500/[0.02]">Business</th>
                  <th className="py-4 text-xs uppercase font-bold text-slate-900 dark:text-white font-mono text-center">Advanced</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.03] text-xs font-medium text-slate-600 dark:text-neutral-300">
                <tr>
                  <td className="py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-slate-400" /> Daily Requests Limit
                  </td>
                  <td className="py-4 text-center font-mono">100 / day</td>
                  <td className="py-4 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/[0.02]">3,300 / day avg</td>
                  <td className="py-4 text-center font-mono">Unlimited daily</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-slate-400" /> Monthly Requests Limit
                  </td>
                  <td className="py-4 text-center font-mono">3,000 / mo max</td>
                  <td className="py-4 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/[0.02]">100,000 / mo</td>
                  <td className="py-4 text-center font-mono">1,000,000+ / mo</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="w-4 h-4 text-slate-400" /> RPM (Requests Per Minute) Limit
                  </td>
                  <td className="py-4 text-center font-mono font-bold text-amber-500">5 RPM cap</td>
                  <td className="py-4 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/[0.02]">300 RPM limit</td>
                  <td className="py-4 text-center font-mono">Unlimited RPM</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Network className="w-4 h-4 text-slate-400" /> Ingestion Latency / Stream
                  </td>
                  <td className="py-4 text-center text-slate-400">5h Old News Feed (No Real-Time)</td>
                  <td className="py-4 text-center font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/[0.02]">Real-Time with SSE</td>
                  <td className="py-4 text-center">Real-Time SSE + Sockets</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-slate-400" /> Maximum Active API Keys
                  </td>
                  <td className="py-4 text-center font-mono">1 Key</td>
                  <td className="py-4 text-center font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/[0.02]">5 Keys</td>
                  <td className="py-4 text-center font-mono">Unlimited Keys</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-slate-400" /> Bilingual Synthesis Translation
                  </td>
                  <td className="py-4 text-center text-slate-400">Basic English Only</td>
                  <td className="py-4 text-center font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/[0.02]">Full English & Sinhala</td>
                  <td className="py-4 text-center">Full + Raw Gemini Embeddings</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-slate-400" /> AI Key Metrics & Sentiment
                  </td>
                  <td className="py-4 text-center text-slate-400">Not Available</td>
                  <td className="py-4 text-center font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/[0.02]">What Happened & Why It Matters</td>
                  <td className="py-4 text-center font-bold text-emerald-500">Full Metrics, Context & Sentiment</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-slate-400" /> High-Priority Breaking News Filter
                  </td>
                  <td className="py-4 text-center text-slate-400">Not Available</td>
                  <td className="py-4 text-center font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/[0.02]">Standard Filtering</td>
                  <td className="py-4 text-center font-bold text-emerald-500">Real-time Priority Flagging</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-slate-400" /> Markdown Content Format Option
                  </td>
                  <td className="py-4 text-center text-slate-400">Not Available</td>
                  <td className="py-4 text-center font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/[0.02]">Available</td>
                  <td className="py-4 text-center">Available</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Network className="w-4 h-4 text-slate-400" /> Webhook Latency Deliveries
                  </td>
                  <td className="py-4 text-center text-slate-400">Not Available</td>
                  <td className="py-4 text-center font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/[0.02]">Priority Delivery (&lt;60s)</td>
                  <td className="py-4 text-center">Real-Time Instancy (&lt;5s)</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-slate-400" /> Fine-Grained Sentiment & Topic Filtering
                  </td>
                  <td className="py-4 text-center text-slate-400">Locked</td>
                  <td className="py-4 text-center text-slate-400 bg-indigo-50/50 dark:bg-indigo-500/[0.02]">Locked</td>
                  <td className="py-4 text-center font-bold text-emerald-500">Fully Unlocked</td>
                </tr>

                {/* Section Header Row */}
                <tr className="bg-slate-50/50 dark:bg-white/[0.01]">
                  <td colSpan={4} className="py-3 px-4 text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-mono">
                    AI JSON Payload Parameters
                  </td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-500" /> <code className="text-xs bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono">whatHappened</code>
                  </td>
                  <td className="py-4 text-center text-slate-400 font-mono">Locked</td>
                  <td className="py-4 text-center font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/[0.02] font-mono">en / si objects</td>
                  <td className="py-4 text-center font-mono">en / si objects</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-500" /> <code className="text-xs bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono">whyItMatters</code>
                  </td>
                  <td className="py-4 text-center text-slate-400 font-mono">Locked</td>
                  <td className="py-4 text-center font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/[0.02] font-mono">en / si objects</td>
                  <td className="py-4 text-center font-mono">en / si objects</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-500" /> <code className="text-xs bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono">historicalContext</code>
                  </td>
                  <td className="py-4 text-center text-slate-400 font-mono">Locked</td>
                  <td className="py-4 text-center text-slate-400 bg-indigo-50/50 dark:bg-indigo-500/[0.02] font-mono">Locked</td>
                  <td className="py-4 text-center font-bold text-emerald-500 font-mono">en / si objects</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-500" /> <code className="text-xs bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono">peopleInvolved</code>
                  </td>
                  <td className="py-4 text-center text-slate-400 font-mono">Locked</td>
                  <td className="py-4 text-center text-slate-400 bg-indigo-50/50 dark:bg-indigo-500/[0.02] font-mono">Locked</td>
                  <td className="py-4 text-center font-bold text-emerald-500 font-mono">string[] array</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-500" /> <code className="text-xs bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono">importance</code>
                  </td>
                  <td className="py-4 text-center text-slate-400 font-mono">Locked</td>
                  <td className="py-4 text-center text-slate-400 bg-indigo-50/50 dark:bg-indigo-500/[0.02] font-mono">Locked</td>
                  <td className="py-4 text-center font-bold text-emerald-500 font-mono">number (0-100)</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-500" /> <code className="text-xs bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono">sentiment</code>
                  </td>
                  <td className="py-4 text-center text-slate-400 font-mono">Locked</td>
                  <td className="py-4 text-center font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/[0.02] font-mono">string label</td>
                  <td className="py-4 text-center font-mono">string label</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-indigo-500" /> <code className="text-xs bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono">isBreakingNews</code>
                  </td>
                  <td className="py-4 text-center text-slate-400 font-mono">Locked</td>
                  <td className="py-4 text-center font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/[0.02] font-mono">boolean</td>
                  <td className="py-4 text-center font-mono">boolean</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Interactive Accordion FAQs */}
      <section className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-32">
        <div className="text-center mb-12">
          <HelpCircle className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h3>
          <p className="text-slate-500 dark:text-neutral-400 text-sm mt-2">
            Got questions about our news API? We have answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-white/[0.02] border border-slate-200/80 dark:border-white/[0.05] rounded-2xl overflow-hidden transition-all duration-300 shadow-sm dark:shadow-none"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-bold text-slate-800 dark:text-neutral-100 text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-indigo-600" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-0 text-slate-500 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed border-t border-slate-100 dark:border-white/[0.02] pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Elegant Bottom Call to Action Portal */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 text-center">
        <div className="bg-gradient-to-r from-indigo-600 to-[#2b86ff] rounded-[3rem] p-10 md:p-16 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition duration-700" />
          <h4 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            Ready to integrate global news conceptual feeds?
          </h4>
          <p className="text-white/80 max-w-xl mx-auto mt-4 text-xs md:text-sm font-light leading-relaxed">
            Get your instant API token in under 2 minutes. Start query sandboxing conceptually for free, then scale up as your user base expands.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/checkout?plan=free"
              className="px-8 py-4 bg-white text-indigo-600 hover:bg-slate-50 text-xs md:text-sm font-bold rounded-full shadow-lg transition"
            >
              Sign Up Free
            </Link>
            <Link
              href="/developer/dashboard"
              className="px-8 py-4 bg-indigo-950/40 text-white hover:bg-indigo-950/60 border border-white/20 text-xs md:text-sm font-semibold rounded-full transition flex items-center gap-2"
            >
              Open Sandbox <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
