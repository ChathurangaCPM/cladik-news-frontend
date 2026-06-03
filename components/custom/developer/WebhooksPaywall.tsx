"use client";

import React from "react";
import { Lock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface WebhooksPaywallProps {
  isFreePlan: boolean;
  handleSimulatedPlanSwitch: (
    tier: "free" | "business" | "advanced",
  ) => Promise<void>;
}

export default function WebhooksPaywall({
  isFreePlan,
  handleSimulatedPlanSwitch,
}: WebhooksPaywallProps) {
  return (
    <AnimatePresence>
      {isFreePlan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute -inset-4 bg-slate-900/[0.03] backdrop-blur-[7px] z-30 flex flex-col items-center justify-center p-8 text-center rounded-3xl min-h-[500px]"
        >
          <div className="bg-[#0f172a] border border-white/10 p-8 rounded-3xl max-w-md w-full shadow-2xl space-y-5 text-white">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-base tracking-tight">
                Real-Time Webhooks is a Premium Feature
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Free accounts only allow pull-based sandboxed playground
                requests. Unlock instant background BullMQ queue streaming
                notifications to power downstream pipelines.
              </p>
            </div>

            {/* Simulated upgrade button triggers the plan simulator switch! */}
            <div className="pt-2 space-y-3">
              <Button
                onClick={() => handleSimulatedPlanSwitch("business")}
                className="w-full cursor-pointer"
              >
                Activate Business Sandbox
              </Button>
              <div className="text-[10px] text-neutral-500 font-light">
                Or toggle the <span className="font-bold">PLAN TESTER</span>{" "}
                pill at the top of the screen anytime.
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
