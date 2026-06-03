"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Sparkles, Building2, Cpu } from "lucide-react";
import { motion } from "framer-motion";
import { NumberTicker } from "@/components/ui/number-ticker";
import { getDeveloperSession, joinWaitlistAction } from "@/app/actions/auth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">(
    "monthly",
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Dialog states
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedPlanName, setSelectedPlanName] = useState<string>("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await getDeveloperSession();
        setIsLoggedIn(!!session);
      } catch (e) {
        setIsLoggedIn(false);
      }
    }
    checkAuth();
  }, []);

  const plans = [
    {
      id: "free",
      name: "Free Plan",
      description:
        "Perfect for hobbyists, testing integration, and small personal apps.",
      priceMonthly: 0,
      priceAnnual: 0,
      icon: <Sparkles className="w-5 h-5 text-indigo-500" />,
      features: [
        "100 API requests/day (Max 5 RPM limit)",
        "Delayed Ingestion Feed (5h old news, no real-time stream)",
        "Semantic search with basic citations",
        "1 Active API Key",
        "Interactive playground & sandbox access",
      ],
      cta: "Start Free",
      color:
        "bg-white border-slate-200 text-slate-900 dark:bg-white/[0.02] dark:border-white/[0.05]",
      btnColor:
        "bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100",
      badgeColor:
        "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-neutral-300",
      popular: false,
    },
    {
      id: "business",
      name: "Business Plan",
      description:
        "Built for scaling startups, news portals, and production applications.",
      priceMonthly: 19,
      priceAnnual: 15,
      icon: (
        <Building2 className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
      ),
      features: [
        "100,000 API requests/month (300 RPM limit)",
        "Real-time news streaming via SSE",
        "Full bilingual English-Sinhala synthesis",
        "AI Key Metrics (What Happened, Why It Matters)",
        "Advanced filters (sentiment, breaking status, topics)",
        "Up to 5 active API Keys & webhook deliveries",
        "Full citation graph database metadata",
      ],
      cta: "Coming Soon",
      color:
        "bg-white border-slate-200 text-slate-900 dark:bg-white/[0.02] dark:border-white/[0.05] opacity-75",
      btnColor:
        "bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-neutral-500 cursor-not-allowed",
      badgeColor:
        "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-neutral-300",
      popular: true,
    },
    {
      id: "advanced",
      name: "Advanced Plan",
      description:
        "For professional data science, advanced search analysis, and custom automated pipelines.",
      priceMonthly: 49,
      priceAnnual: 39,
      icon: <Cpu className="w-5 h-5 text-indigo-500" />,
      features: [
        "1,000,000+ API requests/month",
        "Real-time SSE + raw socket streams",
        "Under 5s pipeline webhook delivery",
        "AI Key Metrics, Historical Context & Key Actors",
        "Raw AI Semantic Embeddings",
        "Unlimited active API Keys & custom webhooks",
        "Priority support & custom data retention",
      ],
      cta: "Coming Soon",
      color:
        "bg-white border-slate-200 text-slate-900 dark:bg-white/[0.02] dark:border-white/[0.05] opacity-75",
      btnColor:
        "bg-slate-100 text-slate-400 dark:bg-white/5 dark:text-neutral-500 cursor-not-allowed",
      badgeColor:
        "bg-slate-100 text-indigo-600 dark:bg-white/10 dark:text-neutral-300",
      popular: false,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-32 relative z-10 text-center">
      <span className="text-xs uppercase text-indigo-600 tracking-wider">
        Membership Plans
      </span>
      <h2 className="text-4xl font-normal tracking-tight text-slate-900 dark:text-white mt-2">
        Flexible plans built for
        <br />
        every stage of{" "}
        <span className="font-heading italic text-blue-500">growth</span>
      </h2>
      <p className="text-slate-500 max-w-xl mx-auto mt-4 text-sm font-light">
        Explore premium developer plans designed for building AI-driven agents,
        search applications, and semantic aggregation pipelines powered by our
        own proprietary search engine.
      </p>

      {/* Monthly / Annual Toggle */}
      {/* <div className="flex justify-center items-center gap-3 mt-10">
        <span
          className={`text-xs font-semibold ${billingPeriod === "monthly" ? "text-slate-900 dark:text-white" : "text-slate-400"}`}
        >
          Monthly Billing
        </span>
        <button
          onClick={() =>
            setBillingPeriod((prev) =>
              prev === "monthly" ? "annual" : "monthly",
            )
          }
          className="w-12 h-6 bg-slate-200 dark:bg-slate-850 rounded-full relative p-1 transition-colors duration-300 focus:outline-none"
        >
          <div
            className={`w-4 h-4 bg-indigo-600 rounded-full transition-transform duration-300 ${
              billingPeriod === "annual" ? "translate-x-6" : ""
            }`}
          />
        </button>
        <span
          className={`text-xs font-semibold flex items-center gap-1.5 ${billingPeriod === "annual" ? "text-indigo-600" : "text-slate-400"}`}
        >
          Annual Billing
          <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-full text-[10px] font-bold">
            Save 20%
          </span>
        </span>
      </div> */}

      {/* 3 Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-16 text-left items-stretch">
        {plans.map((plan) => {
          const price =
            billingPeriod === "monthly" ? plan.priceMonthly : plan.priceAnnual;
          return (
            <div
              key={plan.id}
              className={`border rounded-[2rem] p-8 flex flex-col justify-between min-h-[460px] transition-all duration-300 ${plan.color}`}
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${plan.badgeColor}`}
                  >
                    {plan.name}
                  </span>
                  {plan.popular && (
                    <span className="bg-slate-950 text-lime-400 border border-lime-400 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                      Most Popular
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs font-normal leading-relaxed ${plan.id === "business" ? "text-slate-800" : "text-slate-400"}`}
                >
                  {plan.description}
                </p>

                {plan.id === "free" ? (
                  <div className="mt-6 flex items-baseline">
                    <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      $
                    </span>
                    <NumberTicker
                      value={price}
                      className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white"
                    />
                    <span className="ml-1 text-xs font-normal text-slate-400">
                      /month
                    </span>
                  </div>
                ) : (
                  <div className="mt-6 flex items-center h-10">
                    <span className="bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 text-[9px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md">
                      Coming Soon
                    </span>
                  </div>
                )}

                <ul className="mt-8 space-y-3.5 text-xs font-medium">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-indigo-500" />
                      <span className="text-slate-500 dark:text-neutral-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              {plan.id === "free" ? (
                <Link
                  href={
                    isLoggedIn
                      ? `/checkout?plan=${plan.id}&billing=${billingPeriod}`
                      : `/login?plan=${plan.id}&billing=${billingPeriod}`
                  }
                  className={`w-full py-3 mt-8 rounded-full text-xs font-bold text-center transition ${plan.btnColor}`}
                >
                  {plan.cta}
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setSelectedPlanId(plan.id);
                    setSelectedPlanName(plan.name);
                    setIsOpen(true);
                  }}
                  className="w-full py-3 mt-8 rounded-full text-xs font-bold text-center bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-md transition"
                >
                  Notify Me
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Dialog for Waitlist Signup */}
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setSelectedPlanId(null);
            setSelectedPlanName("");
            setEmail("");
            setMessage(null);
            setSubmitted(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-md bg-white dark:bg-zinc-950 border border-slate-200/60 dark:border-white/10 rounded-3xl p-8">
          {!submitted ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-sans tracking-tight text-slate-900 dark:text-white">
                  Get notified when {selectedPlanName} launches
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 dark:text-neutral-400 mt-2">
                  Enter your email address below to join the waitlist. We will
                  notify you as soon as this plan is available for activation.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!email || !selectedPlanId) return;
                  setLoading(true);
                  setMessage(null);
                  try {
                    const res = await joinWaitlistAction(email, selectedPlanId);
                    if (res.success) {
                      setSubmitted(true);
                    } else {
                      setMessage({
                        text: res.error || "Failed to register.",
                        isError: true,
                      });
                    }
                  } catch (err: any) {
                    setMessage({
                      text: "Connection error. Please try again.",
                      isError: true,
                    });
                  } finally {
                    setLoading(false);
                  }
                }}
                className="space-y-4 mt-4"
              >
                <div className="space-y-2">
                  <input
                    required
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-full text-xs bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-850 dark:text-neutral-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                {message && (
                  <p
                    className={`text-xs text-center font-medium ${message.isError ? "text-rose-500" : "text-emerald-500"}`}
                  >
                    {message.text}
                  </p>
                )}
                <DialogFooter className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-neutral-300 rounded-full text-xs font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-xs font-bold transition disabled:opacity-50"
                  >
                    {loading ? "Registering..." : "Notify Me"}
                  </button>
                </DialogFooter>
              </form>
            </>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg text-slate-900 dark:text-white">
                Thank you for registering!
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
                We have saved your email address. We will update you as soon as
                the <b>{selectedPlanName}</b> goes live.
              </p>
              <div className="pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-white rounded-full text-xs font-bold transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
