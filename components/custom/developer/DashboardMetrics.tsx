"use client";

import React from "react";
import { useDeveloper } from "@/app/(app)/developer/layout";
import { Activity, Database, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardMetrics() {
  const { metrics, loadingTelemetry } = useDeveloper();

  const formatLocalTimestamp = (isoStr: string | undefined | null) => {
    if (!isoStr) return "Never";
    try {
      const date = new Date(isoStr);
      if (isNaN(date.getTime())) return isoStr;
      return date.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (_) {
      return isoStr;
    }
  };

  if (loadingTelemetry) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between"
          >
            <div className="space-y-2">
              <Skeleton className="h-3 w-32 bg-slate-100 rounded-md" />
              <Skeleton className="h-7 w-20 bg-slate-150 rounded-md" />
              <Skeleton className="h-2.5 w-24 bg-slate-100 rounded-md" />
            </div>
            <Skeleton className="w-10 h-10 rounded-xl bg-slate-100 shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans">
      {/* Card 1: Total API Requests */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between transition-all hover:shadow-md">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-tight text-slate-400 block font-sans">
            Total Allowed API Requests
          </span>
          <h4 className="text-2xl font-black text-slate-800 leading-none font-sans">
            {metrics?.totalRequests.toLocaleString() || "0"}
          </h4>
          <span className="text-[9px] text-slate-400 block font-light font-sans">
            All-time queries count
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-655 border border-indigo-100 shrink-0">
          <Activity className="w-5 h-5" />
        </div>
      </div>

      {/* Card 2: Daily Requests Meter */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between transition-all hover:shadow-md">
        <div className="space-y-1">
          <span className="text-[10px] uppercase text-slate-400 block font-sans">
            Queries Today (Daily Cap)
          </span>
          <h4 className="text-2xl font-black text-slate-800 leading-none font-sans">
            {metrics?.requestsToday.toLocaleString() || "0"}
            <span className="text-xs font-normal text-slate-400 font-sans">
              {" "}
              / {metrics?.maxDailyLimit.toLocaleString() || "100"}
            </span>
          </h4>
          <span className="text-[9px] text-slate-400 block font-light truncate max-w-[185px] font-sans">
            Last Hit: {formatLocalTimestamp(metrics?.lastRequestAt)}
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-lime-50 flex items-center justify-center text-lime-655 border border-lime-100 shrink-0">
          <Database className="w-5 h-5" />
        </div>
      </div>

      {/* Card 3: Remaining Requests */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between transition-all hover:shadow-md">
        <div className="space-y-1">
          <span className="text-[10px] uppercase text-slate-400 block font-sans">
            Remaining API Allowance
          </span>
          <h4
            className={`text-2xl font-black leading-none font-sans ${
              metrics && metrics.remainingRequestsToday < 10
                ? "text-rose-650 animate-pulse font-sans"
                : "text-emerald-600 font-sans"
            }`}
          >
            {metrics?.remainingRequestsToday.toLocaleString() || "100"}
          </h4>
          <span className="text-[9px] text-slate-400 block font-light font-sans">
            Resets at midnight automatically
          </span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-655 border border-emerald-100 shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
