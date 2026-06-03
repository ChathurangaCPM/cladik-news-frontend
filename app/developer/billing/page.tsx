"use client";

import React, { useState, useEffect } from "react";
import { useDeveloper } from "@/app/developer/layout";
import {
  CreditCard,
  Check,
  Sparkles,
  HelpCircle,
  FileText,
  Download,
  AlertCircle,
  ShieldCheck,
  Zap,
  Star,
  Activity,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "pending";
  plan: string;
}

export default function DeveloperBilling() {
  const router = useRouter();
  const { activePlan, handleSimulatedPlanSwitch, loadingPlan } = useDeveloper();

  useEffect(() => {
    router.replace("/developer");
  }, [router]);

  // Simulated credit card states
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [checkoutTargetPlan, setCheckoutTargetPlan] = useState<
    "free" | "business" | "advanced"
  >("business");
  const [cardFlipped, setCardFlipped] = useState(false);

  // Checkout triggers
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Mock Invoice History
  const [invoices] = useState<Invoice[]>([
    {
      id: "INV-2026-0042",
      date: "2026-05-15T08:00:00.000Z",
      amount: "$49.00",
      status: "paid",
      plan: "Business Plan Sandbox",
    },
    {
      id: "INV-2026-0011",
      date: "2026-04-15T08:00:00.000Z",
      amount: "$49.00",
      status: "paid",
      plan: "Business Plan Sandbox",
    },
    {
      id: "INV-2026-0002",
      date: "2026-03-15T08:00:00.000Z",
      amount: "$0.00",
      status: "paid",
      plan: "Free Plan Sandbox",
    },
  ]);

  const formatLocalInvoiceDate = (isoStr: string | undefined | null) => {
    if (!isoStr) return "-";
    try {
      const date = new Date(isoStr);
      if (isNaN(date.getTime())) return isoStr;
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (_) {
      return isoStr;
    }
  };

  // Handle simulated card checkout submission
  const handleSimulatedPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulated network processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Update global DeveloperContext subscription plan type
    await handleSimulatedPlanSwitch(checkoutTargetPlan);

    setSubmitting(false);
    setCheckoutSuccess(true);
    setTimeout(() => {
      setCheckoutSuccess(false);
      setCardNumber("");
      setCardName("");
      setCardExpiry("");
      setCardCvv("");
    }, 4000);
  };

  const pricingPlans = [
    {
      id: "free" as const,
      name: "Free Sandbox",
      price: "$0",
      period: "forever",
      description: "Ideal for local prototype validation and sandbox testing.",
      features: [
        "1 active API Key",
        "100 daily requests limit",
        "5 Requests Per Minute cap",
        "No multi-dimension vector plots",
        "Pull API only (No Webhooks push)",
      ],
      icon: <Star className="w-5 h-5 text-indigo-500" />,
      color: "border-slate-200 hover:border-slate-350",
    },
    {
      id: "business" as const,
      name: "Developer Business",
      price: "$49",
      period: "month",
      description: "Scale high-frequency integrations and automated systems.",
      features: [
        "Up to 5 active API Keys",
        "3,300 daily requests limit",
        "300 Requests Per Minute limit",
        "Webhooks and BullMQ Streaming",
        "99.9% queue delivery SLA guarantee",
      ],
      icon: <Zap className="w-5 h-5 text-amber-500 animate-bounce" />,
      color:
        "border-indigo-400 bg-indigo-50/10 shadow-lg shadow-indigo-600/[0.03]",
    },
    {
      id: "advanced" as const,
      name: "Developer Advanced",
      price: "$199",
      period: "month",
      description: "Ultimate capacity for advanced AI LLM indexes training.",
      features: [
        "Unlimited active API Keys",
        "1,000,000+ requests limit",
        "Unlimited Requests Per Minute",
        "Vector Coordinate Matrix mapping",
        "AI Topic Sentiment Filter custom rules",
      ],
      icon: <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />,
      color:
        "border-purple-400 bg-purple-50/10 shadow-lg shadow-purple-600/[0.03]",
    },
  ];

  return (
    <div className="space-y-8 font-sans">
      {/* Title Header Section */}
      <div className="space-y-1.5">
        <h2 className="text-xl md:text-2xl text-slate-800 tracking-tight">
          Billing & Sandbox Plan Manager
        </h2>
        <p className="text-xs text-slate-500 max-w-2xl leading-relaxed font-light">
          Upgrade sandbox rates and unlock premium BullMQ push streams or NLP
          vector parameters instantly. Use our interactive credit card checkout
          simulator to instantly test the transitions without actual merchant
          fees.
        </p>
      </div>

      {/* Pricing matrices grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {pricingPlans.map((plan) => {
          const isActive = activePlan === plan.id;
          return (
            <div
              key={plan.id}
              className={`bg-white border rounded-3xl p-6 flex flex-col justify-between transition-all relative ${plan.color}`}
            >
              {isActive && (
                <span className="absolute -top-3 left-6 px-3 py-1 bg-indigo-600 border border-indigo-500 text-white rounded-full text-[9px] uppercase tracking-wider shadow">
                  Active Sandbox License
                </span>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-center mt-2">
                  <span className="text-slate-800 text-sm tracking-tight flex items-center gap-2">
                    {plan.icon} {plan.name}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl text-slate-800 tracking-tighter">
                    {plan.price}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    / {plan.period}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-normal font-light">
                  {plan.description}
                </p>

                <div className="w-full h-[1px] bg-slate-100 my-4" />

                {/* Features checklists */}
                <ul className="space-y-2.5 text-xs text-slate-600">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-snug font-light">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Checkout activation button */}
              <div className="pt-6 mt-6 border-t border-slate-100">
                {isActive ? (
                  <div className="w-full py-2.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-center rounded-xl text-xs">
                    CURRENT PLAN
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setCheckoutTargetPlan(plan.id);
                      // Smooth scroll down to checkout card container
                      const checkoutSec = document.getElementById(
                        "checkout-simulator-form",
                      );
                      if (checkoutSec) {
                        checkoutSec.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="w-full py-2.5 hover:bg-slate-100 border border-slate-200 hover:border-slate-350 text-slate-750 text-center rounded-xl text-xs font-normal transition cursor-pointer"
                  >
                    Select {plan.name}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Payment card details simulator */}
      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4"
        id="checkout-simulator-form"
      >
        {/* Left checkout card form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 shadow-sm rounded-3xl p-6 space-y-6 relative overflow-hidden">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-indigo-650 animate-pulse" />
              <h3 className="font-bold text-slate-800 text-sm tracking-tight">
                Credit Card Checkout Simulator
              </h3>
            </div>

            <span className="text-[8px] font-mono font-black uppercase text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded flex items-center gap-1">
              SANDBOX PAYMENT
            </span>
          </div>

          <form onSubmit={handleSimulatedPaymentSubmit} className="space-y-4">
            {/* Plan selection within checkout */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono block">
                Upgrade Destination Package
              </label>
              <select
                value={checkoutTargetPlan}
                onChange={(e) => setCheckoutTargetPlan(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-650 transition cursor-pointer"
              >
                <option value="free">Free Sandbox Plan ($0/mo)</option>
                <option value="business">Developer Business ($49/mo)</option>
                <option value="advanced">Developer Advanced ($199/mo)</option>
              </select>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono block">
                  Cardholder Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Nexus Dev Team"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-650 transition font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono block">
                  Card Number (Any Mock Number)
                </label>
                <input
                  type="text"
                  required
                  placeholder="4242 •••• •••• 4242"
                  value={cardNumber}
                  onChange={(e) => {
                    // Simple formatting
                    const v = e.target.value
                      .replace(/\s+/g, "")
                      .replace(/[^0-9]/gi, "");
                    const matches = v.match(/\d{4,16}/g);
                    const match = (matches && matches[0]) || "";
                    const parts = [];

                    for (let i = 0, len = match.length; i < len; i += 4) {
                      parts.push(match.substring(i, i + 4));
                    }

                    if (parts.length > 0) {
                      setCardNumber(parts.join(" "));
                    } else {
                      setCardNumber(v);
                    }
                  }}
                  maxLength={19}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-650 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono block">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={(e) => {
                      const v = e.target.value.replace(/[^0-9/]/g, "");
                      if (v.length === 2 && !v.includes("/")) {
                        setCardExpiry(v + "/");
                      } else {
                        setCardExpiry(v);
                      }
                    }}
                    maxLength={5}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-650 transition text-center"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono block">
                    Security Code (CVV)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="•••"
                    value={cardCvv}
                    onChange={(e) =>
                      setCardCvv(e.target.value.replace(/[^0-9]/g, ""))
                    }
                    onFocus={() => setCardFlipped(true)}
                    onBlur={() => setCardFlipped(false)}
                    maxLength={4}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-650 transition text-center"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || !cardName || cardNumber.length < 15}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 py-3.5 rounded-2xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-[0.98] transition cursor-pointer"
              >
                {submitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-indigo-600 rounded-full animate-spin" />
                    Simulating Merchant Handshake...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" /> Finalize Simulated
                    Subscription
                  </>
                )}
              </button>
            </div>

            {/* Success Animation Banner */}
            <AnimatePresence>
              {checkoutSuccess && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 bg-emerald-50 border border-emerald-150 rounded-2xl text-center space-y-2 text-emerald-800"
                >
                  <div className="flex items-center justify-center gap-2 font-mono font-black text-xs uppercase text-emerald-600 tracking-wider">
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Transaction Approved
                  </div>
                  <p className="text-[10.5px] font-sans font-light leading-normal max-w-sm mx-auto">
                    Mock payment processed. Your sandbox account is updated to
                    the **{checkoutTargetPlan.toUpperCase()} Plan**. API
                    Playground limits, telemetry trackers, and webhooks logs are
                    refetched.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Right card visual projection & mock invoices */}
        <div className="lg:col-span-5 space-y-6">
          {/* Stunning 3D projections card layout visual */}
          <div className="relative w-full h-[200px] rounded-2xl overflow-hidden group select-none shadow-xl border border-slate-100 flex items-center justify-center font-mono">
            {/* Front Card rendering */}
            <div
              className={`absolute inset-0 bg-gradient-to-tr from-indigo-750 via-indigo-600 to-indigo-500 p-6 flex flex-col justify-between text-white transition-all duration-500 ${
                cardFlipped
                  ? "rotate-y-180 opacity-0 pointer-events-none"
                  : "opacity-100"
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="text-[8px] uppercase tracking-wider text-indigo-200">
                    Sandbox Authorization
                  </span>
                  <div className="font-extrabold text-sm tracking-tight font-sans">
                    NeuralPress API Console
                  </div>
                </div>
                {/* Simulated Chip */}
                <div className="w-9 h-7 rounded-md bg-gradient-to-br from-amber-200 to-amber-400 border border-amber-350 opacity-80" />
              </div>

              <div className="space-y-3">
                {/* Number */}
                <div className="text-base font-medium tracking-widest text-indigo-50 drop-shadow">
                  {cardNumber || "4242 •••• •••• 4242"}
                </div>

                <div className="flex justify-between items-end">
                  <div className="space-y-0.5">
                    <span className="text-[7px] uppercase tracking-wider text-indigo-300">
                      Cardholder
                    </span>
                    <div className="text-[10.5px] uppercase font-bold tracking-wider truncate max-w-[160px]">
                      {cardName || "Nexus Developer"}
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[7px] uppercase tracking-wider text-indigo-300">
                      Expires
                    </span>
                    <div className="text-[10.5px] font-bold tracking-wider">
                      {cardExpiry || "12/28"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Card rendering */}
            <div
              className={`absolute inset-0 bg-gradient-to-tl from-indigo-800 to-slate-900 p-6 flex flex-col justify-between text-white transition-all duration-500 ${
                cardFlipped
                  ? "opacity-100"
                  : "-rotate-y-180 opacity-0 pointer-events-none"
              }`}
            >
              <div className="w-full h-8 bg-black/80 absolute top-4 left-0" />
              <div className="w-full flex justify-between items-center mt-6">
                <div className="w-[75%] h-6 bg-slate-350 rounded flex items-center justify-end px-2 text-slate-800 text-[8px] italic">
                  Signature Strip Mockup
                </div>
                <div className="w-[20%] h-6 bg-white rounded text-slate-950 font-bold text-center flex items-center justify-center text-xs">
                  {cardCvv || "•••"}
                </div>
              </div>
              <div className="text-[7px] text-neutral-400 leading-normal text-right">
                Simulated Sandbox Checkout Card. Valid for NeuralPress API hub
                sandbox environments only.
              </div>
            </div>
          </div>

          {/* Invoice History list */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-3xl p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="w-4.5 h-4.5 text-indigo-650" />
              <h3 className="font-bold text-slate-800 text-sm tracking-tight">
                Invoice History Matrix
              </h3>
            </div>

            <div className="divide-y divide-slate-100 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-3.5 flex justify-between items-center gap-4 hover:bg-slate-50/50 transition"
                >
                  <div className="space-y-1 font-mono text-[9px]">
                    <span className="font-bold text-slate-800 block text-[10.5px]">
                      {inv.id}
                    </span>
                    <span className="text-slate-450 block">{inv.plan}</span>
                    <span className="text-slate-400 block">
                      {formatLocalInvoiceDate(inv.date)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded-full">
                      PAID
                    </span>
                    <button
                      onClick={() =>
                        alert(
                          `Simulating invoice PDF download for ${inv.id} receipt.`,
                        )
                      }
                      className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 p-2 rounded-lg border border-transparent hover:border-indigo-100 transition cursor-pointer"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
