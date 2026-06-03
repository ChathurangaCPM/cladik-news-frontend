"use client";

import React from "react";
import { useDeveloper } from "@/app/developer/layout";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export default function PlanCapGauge() {
  const { activePlan, metrics, loadingTelemetry } = useDeveloper();

  // Circular plan cap gauge parameters
  const getPlanRequestData = () => {
    if (metrics) {
      return {
        used: metrics.requestsToday,
        max: metrics.maxDailyLimit,
        name: `Requests Today (${activePlan === "free" ? "5 RPM Cap" : activePlan === "business" ? "300 RPM Limit" : "Unlimited RPM"})`,
      };
    }
    if (activePlan === "free")
      return { used: 0, max: 100, name: "Requests Today (5 RPM Cap)" };
    if (activePlan === "business")
      return { used: 0, max: 3300, name: "Requests Today (300 RPM Limit)" };
    return { used: 0, max: 1000000, name: "Requests Today (Unlimited)" };
  };

  const reqData = getPlanRequestData();
  const usagePercentage =
    reqData.max > 0
      ? Math.min(100, Math.round((reqData.used / reqData.max) * 100))
      : 0;

  if (loadingTelemetry) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-between text-center min-h-[300px]">
        <div className="w-full flex justify-between">
          <Skeleton className="h-3 w-24 bg-slate-100 rounded-md" />
          <Skeleton className="h-3 w-12 bg-slate-100 rounded-md" />
        </div>
        <div className="relative w-44 h-44 my-4 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
          </svg>
          <div className="absolute text-center space-y-2">
            <Skeleton className="h-8 w-16 mx-auto bg-slate-150 rounded-md" />
            <Skeleton className="h-3 w-20 mx-auto bg-slate-100 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-4 w-36 bg-slate-100 rounded-md" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-between text-center min-h-[300px]">
      <div className="w-full flex justify-between text-[10px] text-slate-400 tracking-tight">
        <span>PLAN CAP INDEX</span>
        <span className="text-indigo-650 uppercase font-sans font-bold">{activePlan}</span>
      </div>

      {/* SVG Gauge */}
      <div className="relative w-44 h-44 my-4 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="#f1f5f9"
            strokeWidth="8"
            fill="transparent"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            stroke={
              activePlan === "free"
                ? "#a3e635"
                : activePlan === "business"
                  ? "#2b86ff"
                  : "#8b5cf6"
            }
            strokeWidth="8"
            fill="transparent"
            strokeDasharray="251.2"
            initial={{ strokeDashoffset: 251.2 }}
            animate={{
              strokeDashoffset: 251.2 - (251.2 * usagePercentage) / 100,
            }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-3xl font-black tracking-tighter text-slate-800 block font-sans">
            {usagePercentage}%
          </span>
          <span className="text-[9px] text-slate-400 block uppercase font-bold font-sans">
            DAILY UTILIZED
          </span>
        </div>
      </div>

      <div className="w-full text-xs font-sans">
        <span className="text-slate-450">Usage Trace:</span>{" "}
        <span className="text-slate-800 font-black">
          {reqData.used.toLocaleString()} /{" "}
          {reqData.max === 1000000 ? "1M+" : reqData.max.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
