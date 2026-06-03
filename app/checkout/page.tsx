"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  CreditCard,
  Building,
  CheckCircle,
  Loader2,
  Sparkles,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
  updateSubscriptionPlanAction,
  getDeveloperSession,
  createDeveloperKeyAction,
} from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Read plan parameters
  const planParam = searchParams.get("plan") || "free";
  const billingParam = searchParams.get("billing") || "monthly";

  // Form states
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [activeField, setActiveField] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(0);

  // Fetch session on mount to auto-fill developer email and name
  useEffect(() => {
    async function loadSession() {
      try {
        const session = await getDeveloperSession();
        if (session) {
          setEmail(session.email || "");
          const fullName = [session.firstName, session.lastName]
            .filter(Boolean)
            .join(" ");
          setName(fullName || "");
        }
      } catch (e) {
        console.error("Failed to load session on checkout page:", e);
      }
    }
    loadSession();
  }, []);

  // Sub-stages text during payment simulation
  const loadStages = [
    "Establishing secure payment tunnel...",
    "Validating simulated account credentials...",
    "Provisioning Developer news cluster...",
    "Activating plan API Key...",
    "Syncing sandbox rate-limits...",
    "Registration complete! Opening portal...",
  ];

  // Pricing definitions
  const planTitles: Record<string, string> = {
    free: "Free Plan",
    business: "Business Plan",
    advanced: "Advanced Plan",
  };

  const planBasePrices: Record<string, number> = {
    free: 0,
    business: 19,
    advanced: 49,
  };

  const isAnnual = billingParam === "annual";
  const basePrice = planBasePrices[planParam] || 0;
  // Apply 20% off for annual
  const monthlyPrice = isAnnual ? Math.round(basePrice * 0.8) : basePrice;
  const totalPrice = isAnnual ? monthlyPrice * 12 : monthlyPrice;

  // Spacing helper for Card Number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.substring(0, 16);
    const matched = value.match(/.{1,4}/g);
    setCardNumber(matched ? matched.join(" ") : value);
  };

  // Slasher helper for Expiry Date
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.substring(0, 4);
    if (value.length >= 3) {
      setExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setExpiry(value);
    }
  };

  // Handler for CVC input
  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setCvc(value);
    }
  };

  // Multi-step loading triggers
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isProcessing) {
      interval = setInterval(() => {
        setProcessingStage((prev) => {
          if (prev >= loadStages.length - 1) {
            clearInterval(interval);

            // Call actual database update before redirecting
            updateSubscriptionPlanAction(
              planParam as "free" | "business" | "advanced",
            )
              .then(async () => {
                localStorage.setItem("userPlan", planParam);
                localStorage.setItem("billingInterval", billingParam);
                localStorage.setItem(
                  "billingEmail",
                  email || "developer@neuralpress.io",
                );
                localStorage.setItem("billingName", name || "Nexus Developer");

                try {
                  const keyRes = await createDeveloperKeyAction(
                    `Primary ${planParam.toUpperCase()} Key`,
                  );
                  if (keyRes.success && keyRes.data) {
                    localStorage.setItem("apiKeySecret", keyRes.data.key);
                    localStorage.setItem("justCheckedOut", "true");
                  } else {
                    const randKey = `np_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
                    localStorage.setItem("apiKeySecret", randKey);
                  }
                } catch (err) {
                  console.error(
                    "Failed to automatically generate API key in DB:",
                    err,
                  );
                  const randKey = `np_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
                  localStorage.setItem("apiKeySecret", randKey);
                }

                setTimeout(() => {
                  router.push("/developer/dashboard");
                }, 600);
              })
              .catch(async (err) => {
                console.error(
                  "DB update error, falling back to local storage:",
                  err,
                );
                localStorage.setItem("userPlan", planParam);
                localStorage.setItem("billingInterval", billingParam);
                localStorage.setItem(
                  "billingEmail",
                  email || "developer@neuralpress.io",
                );
                localStorage.setItem("billingName", name || "Nexus Developer");

                try {
                  const keyRes = await createDeveloperKeyAction(
                    `Primary ${planParam.toUpperCase()} Key`,
                  );
                  if (keyRes.success && keyRes.data) {
                    localStorage.setItem("apiKeySecret", keyRes.data.key);
                    localStorage.setItem("justCheckedOut", "true");
                  } else {
                    const randKey = `np_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
                    localStorage.setItem("apiKeySecret", randKey);
                  }
                } catch (err2) {
                  const randKey = `np_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
                  localStorage.setItem("apiKeySecret", randKey);
                }

                setTimeout(() => {
                  router.push("/developer/dashboard");
                }, 600);
              });
            return prev;
          }
          return prev + 1;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isProcessing]);

  // Handle Checkout submission
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (planParam === "free") {
      try {
        await updateSubscriptionPlanAction("free");
        const keyRes = await createDeveloperKeyAction("Primary Free Key");
        if (keyRes.success && keyRes.data) {
          localStorage.setItem("apiKeySecret", keyRes.data.key);
          localStorage.setItem("justCheckedOut", "true");
        } else {
          const randKey = `np_free_${Math.random().toString(36).substring(2, 10)}`;
          localStorage.setItem("apiKeySecret", randKey);
        }
      } catch (err) {
        console.error("Error setting free plan in DB:", err);
        const randKey = `np_free_${Math.random().toString(36).substring(2, 10)}`;
        localStorage.setItem("apiKeySecret", randKey);
      }
      localStorage.setItem("userPlan", "free");
      localStorage.setItem("billingInterval", "monthly");
      localStorage.setItem("billingEmail", email || "guest@neuralpress.io");
      localStorage.setItem("billingName", name || "Guest Developer");
      router.push("/developer/dashboard");
    } else {
      setIsProcessing(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#07090e] text-slate-800 dark:text-neutral-100 flex flex-col justify-between transition-colors duration-300 font-inter selection:bg-lime-400/30 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-[#2b86ff]/5 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-lime-400/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Modern Top Header bar */}
      <header className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between w-full border-b border-slate-200/50 dark:border-white/[0.05]">
        <div className="flex items-center gap-3">
          <Link
            href="/pricing"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400" />
            <Image
              src="/main-logo.png"
              width={32}
              height={32}
              className="w-7 h-7 object-contain"
              alt="NeuralPress"
            />
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              Neural<span className="text-indigo-600 font-normal">Press</span>
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>SECURE SANDBOX TRANSACTION</span>
        </div>
      </header>

      {/* Main Checkout container */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start w-full">
        {/* Left Column: Order details summary */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <span className="text-xs uppercase text-indigo-600 dark:text-indigo-400 font-mono tracking-wider">
              Testing out NeuralPress
            </span>
            <h1 className="text-3xl tracking-tight text-slate-900 dark:text-white mt-1 leading-tight">
              Checkout & Activation
            </h1>
            <p className="text-slate-500 dark:text-neutral-400 text-xs font-normal mt-2 leading-relaxed">
              Review your developer sandbox specifications. Payment methods are
              fully simulated—no actual money will be charged.
            </p>
          </div>

          {/* Plan Recap Card */}
          <div className="bg-white dark:bg-white/[0.01] border border-slate-200/80 dark:border-white/[0.05] rounded-3xl p-6 dark:shadow-none backdrop-blur-xl">
            <div className="flex justify-between items-start border-b border-slate-100 dark:border-white/[0.05] pb-4">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Selected Tier
                </span>
                <span className="text-lg text-slate-900 dark:text-white flex items-center gap-2 mt-0.5">
                  {planTitles[planParam] || "Custom API Plan"}
                  <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full text-[9px] font-bold">
                    {billingParam === "annual" ? "Annual Save 20%" : "Monthly"}
                  </span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  Price
                </span>
                <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  ${monthlyPrice}
                  <span className="text-xs font-normal text-slate-400">
                    /mo
                  </span>
                </span>
              </div>
            </div>

            {/* Dynamic details listing */}
            <div className="py-4 border-b border-slate-100 dark:border-white/[0.05] space-y-3.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-neutral-400">
                  API Requests Allowance
                </span>
                <span className="text-slate-800 dark:text-white font-mono">
                  {planParam === "free"
                    ? "100 / day (5 RPM Limit)"
                    : planParam === "business"
                      ? "100,000 / mo"
                      : "1,000,000+ / mo"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-neutral-400">
                  Bilingual translations
                </span>
                <span className="text-slate-800 dark:text-white">
                  {planParam === "free"
                    ? "English basic only (5h old news)"
                    : "Full English-Sinhala"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-neutral-400">
                  Markdown format retrieval
                </span>
                <span className="text-slate-800 dark:text-white">
                  {planParam === "free" ? "Not Available" : "Available"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-neutral-400">
                  Webhooks & Streaming
                </span>
                <span className="text-slate-800 dark:text-white font-mono">
                  {planParam === "free"
                    ? "No real-time push"
                    : planParam === "business"
                      ? "Webhooks + Live SSE Stream"
                      : "Webhooks + Real-Time SSE + Sockets"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500 dark:text-neutral-400">
                  Topic & Sentiment Filters
                </span>
                <span className="text-slate-800 dark:text-white">
                  {planParam === "advanced" ? "Fully active" : "Locked"}
                </span>
              </div>
            </div>

            {/* Total pricing section */}
            <div className="pt-4 flex justify-between items-center text-sm text-slate-900 dark:text-white">
              <span>Today's Total Charges</span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                ${totalPrice}
                {isAnnual && (
                  <span className="text-[10px] font-normal text-slate-400 font-sans block text-right mt-0.5">
                    Billed Annually
                  </span>
                )}
              </span>
            </div>
          </div>

          {/* Secure Trust indicators */}
          <div className="bg-emerald-500/[0.03] border border-emerald-500/10 rounded-2xl p-4 flex gap-3.5 items-start">
            <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h5 className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                Simulated Sandbox Environment
              </h5>
              <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/60 leading-normal mt-0.5 font-light">
                NeuralPress Sandbox simulates real subscription integrations.
                Fill out card fields with any fake data to immediately
                experience how the dashboard dynamically adapts features.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Stripe details Form & Interactive holographic Visa Card */}
        <div className="lg:col-span-7 bg-white dark:bg-white/[0.01] border border-slate-200/80 dark:border-white/[0.05] rounded-3xl p-6 sm:p-8 dark:shadow-none backdrop-blur-xl space-y-8 relative">
          {/* Holographic 3D credit card display (interactive card simulator) */}
          {planParam !== "free" && (
            <div className="perspective-1000 w-full h-[200px] relative select-none">
              <motion.div
                initial={false}
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="w-full h-full preserve-3d absolute rounded-[1.5rem] shadow-xl text-white font-mono bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-950 overflow-hidden border border-white/10"
              >
                {/* CARD FRONT SIDE */}
                <div className="absolute w-full h-full backface-hidden p-6 flex flex-col justify-between z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono block">
                        News API Sandbox Key
                      </span>
                      <span className="text-xs font-bold tracking-tight text-white mt-0.5">
                        NeuralPress Dev
                      </span>
                    </div>
                    {/* Glowing holographic simulated chip */}
                    <div className="w-10 h-7 bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 rounded-md border border-amber-400/30 opacity-80" />
                  </div>

                  {/* Card Number display */}
                  <div className="text-lg md:text-xl font-bold tracking-widest font-mono text-center my-4 font-semibold select-all text-white drop-shadow-md">
                    {cardNumber || "•••• •••• •••• ••••"}
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[8px] text-slate-400 uppercase font-mono block">
                        Cardholder Name
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-wider truncate max-w-[150px] block mt-0.5">
                        {name || "DEVELOPER NEXUS"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 uppercase font-mono block text-right">
                        Expires
                      </span>
                      <span className="text-xs font-semibold tracking-wider block text-right mt-0.5">
                        {expiry || "MM/YY"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* CARD BACK SIDE */}
                <div className="absolute w-full h-full backface-hidden rotateY-180 p-6 flex flex-col justify-between z-10">
                  <div className="w-full h-10 bg-black absolute top-5 left-0" />
                  <div className="w-full h-1.5 bg-slate-800/20 absolute top-15 left-0" />

                  <div className="my-8 flex justify-end items-center gap-3">
                    <span className="text-[8px] text-slate-400 font-mono">
                      SIGNATURE
                    </span>
                    <div className="w-[140px] h-8 bg-white/10 rounded flex justify-end items-center pr-3 border border-white/5 font-mono italic font-bold text-sm tracking-wider text-slate-300 select-none">
                      {cvc || "•••"}
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[8px] text-slate-400">
                    <span>MOCK PRODUCTION TEST KEY ONLY</span>
                    <span>100% SECURE</span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Form details wrapper */}
          <form onSubmit={handleCheckoutSubmit} className="space-y-5">
            <h3 className="text-sm uppercase tracking-tight text-slate-400">
              Account & Billing details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-neutral-300">
                  Billing Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-neutral-300">
                  Developer Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Cardholder name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => {
                    setIsFlipped(false);
                    setActiveField("name");
                  }}
                  className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {planParam !== "free" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 dark:text-neutral-300 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                    Credit Card Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="4000 1234 5678 9010"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    onFocus={() => {
                      setIsFlipped(false);
                      setActiveField("cardNumber");
                    }}
                    className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-xl px-4 py-3 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-neutral-300">
                      Expiration Date
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      value={expiry}
                      onChange={handleExpiryChange}
                      onFocus={() => {
                        setIsFlipped(false);
                        setActiveField("expiry");
                      }}
                      className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-xl px-4 py-3 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 dark:text-neutral-300">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="3-4 digits"
                      value={cvc}
                      onChange={handleCvcChange}
                      onFocus={() => {
                        setIsFlipped(true);
                        setActiveField("cvc");
                      }}
                      className="w-full bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/[0.05] rounded-xl px-4 py-3 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full py-6">
              {planParam === "free"
                ? "Activate Free Account"
                : `Activate ${planTitles[planParam]} • $${totalPrice}`}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </main>

      {/* Modern footer details */}
      <footer className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 border-t border-slate-200/50 dark:border-white/[0.05] flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <span>© 2026 NEURALPRESS NEWS API SYSTEMS INC.</span>
        <span>SANDBOX ENCRYPTION ACTIVE • 256-BIT MOCK SSL</span>
      </footer>

      {/* Stripe payment provisioning full screen dialog loader */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex flex-col justify-center items-center text-white"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0f172a] border border-white/10 rounded-[2rem] p-10 max-w-md w-full mx-4 text-center shadow-2xl relative overflow-hidden space-y-6"
            >
              <div className="absolute top-0 left-0 w-full h-[6px] bg-indigo-600" />
              <div className="absolute top-0 left-0 w-[40%] h-[6px] bg-lime-400 animate-pulse" />

              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto" />

              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white tracking-tight">
                  Activating API Credentials
                </h4>
                <p className="text-xs text-slate-400 font-normal">
                  Your sandbox credentials are being securely generated and
                  allocated.
                </p>
              </div>

              {/* Dynamic steps tracer logs console */}
              <div className="bg-black/40 border border-white/5 rounded-2xl p-4 font-mono text-[10px] text-left text-indigo-400/80 h-16 flex items-center relative overflow-hidden">
                <div className="absolute left-4 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping" />
                <span className="ml-6 block truncate">
                  {loadStages[processingStage]}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#07090e] flex items-center justify-center text-sm font-semibold">
          Loading Checkout Sandbox...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
