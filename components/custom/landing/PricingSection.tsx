"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Sparkles, Building2, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import { NumberTicker } from "@/components/ui/number-ticker";

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  const plans = [
    {
      id: "free",
      name: "Free Plan",
      description: "Perfect for hobbyists, testing integration, and small personal apps.",
      priceMonthly: 0,
      priceAnnual: 0,
      icon: <Sparkles className="w-5 h-5 text-indigo-500" />,
      features: [
        "100 API requests/day (Max 5 RPM limit)",
        "Standard Ingestion Feed (5h old news, no real-time push)",
        "Basic keyword search parameters",
        "1 Active API Key",
        "Public Documentation access",
      ],
      cta: "Start Free",
      color: "bg-white border-slate-200 text-slate-900 dark:bg-white/[0.02] dark:border-white/[0.05]",
      btnColor: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100",
      badgeColor: "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-neutral-300",
    },
    {
      id: "business",
      name: "Business Plan",
      description: "Built for scaling startups, news portals, and production applications.",
      priceMonthly: 19,
      priceAnnual: 15,
      icon: <Building2 className="w-5 h-5 text-slate-950" />,
      features: [
        "100,000 API requests/month",
        "Real-time news streaming via SSE",
        "Full bilingual English-Sinhala synthesis",
        "AI Key Metrics (What Happened, Why It Matters)",
        "Advanced filters (sentiment, isBreakingNews)",
        "Up to 5 active API Keys",
        "Webhooks for real-time match delivery",
      ],
      cta: "Go Business",
      color: "bg-lime-400 border-lime-300 text-slate-900 shadow-xl scale-[1.03] relative z-10",
      btnColor: "bg-slate-950 text-white hover:bg-slate-900",
      badgeColor: "bg-slate-950 text-white",
      popular: true,
    },
    {
      id: "advanced",
      name: "Advanced Plan",
      description: "For professional data science, vector analysis, and custom automated pipelines.",
      priceMonthly: 49,
      priceAnnual: 39,
      icon: <Cpu className="w-5 h-5 text-indigo-500" />,
      features: [
        "1,000,000+ API requests/month",
        "Real-time SSE + raw socket streams",
        "Under 5s pipeline webhook ingestion",
        "AI Key Metrics, Historical Context & Key Actors",
        "Sentiment analysis & Importance score metrics",
        "Unlimited active API Keys",
        "Custom Topic Mappings & Webhooks",
      ],
      cta: "Get Advanced",
      color: "bg-white border-slate-200 text-slate-900 dark:bg-white/[0.02] dark:border-white/[0.05]",
      btnColor: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100",
      badgeColor: "bg-slate-100 text-indigo-600 dark:bg-white/10 dark:text-neutral-300",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 relative z-10 text-center">
      <span className="text-xs uppercase text-indigo-600 font-mono tracking-wider font-bold">
        Membership Plans
      </span>
      <h2 className="text-4xl font-extrabold font-heading text-slate-900 dark:text-white mt-2">
        Flexible plans built for
        <br />
        every stage of growth
      </h2>
      <p className="text-slate-500 max-w-xl mx-auto mt-4 text-sm font-normal">
        Explore premium developer plans to match your automated news aggregation needs.
      </p>

      {/* Monthly / Annual Toggle */}
      <div className="flex justify-center items-center gap-3 mt-10">
        <span className={`text-xs font-semibold ${billingPeriod === "monthly" ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
          Monthly Billing
        </span>
        <button
          onClick={() => setBillingPeriod(prev => prev === "monthly" ? "annual" : "monthly")}
          className="w-12 h-6 bg-slate-200 dark:bg-slate-850 rounded-full relative p-1 transition-colors duration-300 focus:outline-none"
        >
          <div
            className={`w-4 h-4 bg-indigo-600 rounded-full transition-transform duration-300 ${
              billingPeriod === "annual" ? "translate-x-6" : ""
            }`}
          />
        </button>
        <span className={`text-xs font-semibold flex items-center gap-1.5 ${billingPeriod === "annual" ? "text-indigo-600" : "text-slate-400"}`}>
          Annual Billing
          <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
            Save 20%
          </span>
        </span>
      </div>

      {/* 3 Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16 text-left items-stretch">
        {plans.map((plan) => {
          const price = billingPeriod === "monthly" ? plan.priceMonthly : plan.priceAnnual;
          return (
            <div
              key={plan.id}
              className={`border rounded-[2rem] p-8 flex flex-col justify-between min-h-[460px] transition-all duration-300 hover:shadow-2xl ${plan.color}`}
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${plan.badgeColor}`}>
                    {plan.name}
                  </span>
                  {plan.popular && (
                    <span className="bg-slate-950 text-lime-400 border border-lime-400 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                      Most Popular
                    </span>
                  )}
                </div>
                <p className={`text-xs font-normal leading-relaxed ${plan.id === "business" ? "text-slate-800" : "text-slate-400"}`}>
                  {plan.description}
                </p>
                
                <div className="mt-6 flex items-baseline">
                  <span className={`text-4xl font-extrabold tracking-tight ${plan.id === "business" ? "text-slate-950" : "text-slate-900 dark:text-white"}`}>
                    $
                  </span>
                  <NumberTicker
                    value={price}
                    className={`text-4xl font-extrabold tracking-tight ${
                      plan.id === "business" 
                        ? "text-slate-950 dark:text-slate-950" 
                        : "text-slate-900 dark:text-white"
                    }`}
                  />
                  <span className={`ml-1 text-xs font-normal ${plan.id === "business" ? "text-slate-800" : "text-slate-400"}`}>
                    /month
                  </span>
                </div>

                <ul className="mt-8 space-y-3.5 text-xs font-medium">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${plan.id === "business" ? "text-slate-950" : "text-indigo-500"}`} />
                      <span className={plan.id === "business" ? "text-slate-900" : "text-slate-500 dark:text-neutral-300"}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={`/checkout?plan=${plan.id}&billing=${billingPeriod}`}
                className={`w-full py-3 mt-8 rounded-full text-xs font-bold text-center transition ${plan.btnColor}`}
              >
                {plan.cta}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
