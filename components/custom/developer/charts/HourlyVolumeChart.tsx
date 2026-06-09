"use client";

import React from "react";
import { useDeveloper } from "@/app/(app)/developer/layout";
import { Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export default function HourlyVolumeChart() {
  const { hourlyChartData, loadingTelemetry } = useDeveloper();

  if (loadingTelemetry) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between min-h-[300px]">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4.5 h-4.5 rounded-full bg-slate-100" />
            <Skeleton className="h-4 w-36 bg-slate-150 rounded-md" />
          </div>
          <Skeleton className="h-4.5 w-24 bg-slate-100 rounded-full" />
        </div>
        <div className="w-full h-[180px] flex items-end gap-3 pt-6">
          <Skeleton className="w-full h-[30%] bg-slate-50 rounded-lg animate-pulse" />
          <Skeleton className="w-full h-[55%] bg-slate-100/70 rounded-lg animate-pulse" />
          <Skeleton className="w-full h-[40%] bg-slate-50 rounded-lg animate-pulse" />
          <Skeleton className="w-full h-[70%] bg-slate-100/70 rounded-lg animate-pulse" />
          <Skeleton className="w-full h-[60%] bg-slate-50 rounded-lg animate-pulse" />
          <Skeleton className="w-full h-[85%] bg-slate-100/70 rounded-lg animate-pulse" />
          <Skeleton className="w-full h-[65%] bg-slate-50 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 min-h-[300px] flex flex-col justify-between">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Activity className="w-4.5 h-4.5 text-indigo-650 animate-pulse" />
          <h3 className="text-slate-800 text-sm font-sans">
            Hourly Request Volume
          </h3>
        </div>
        <span className="text-[10px] uppercase tracking-normal text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 font-sans">
          Last 24 Hours
        </span>
      </div>

      <div className="w-full h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={
              hourlyChartData && hourlyChartData.length > 0
                ? hourlyChartData
                : [{ name: "00:00", queries: 0, success: 0, errors: 0 }]
            }
            margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="hourlyQueryGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="name"
              stroke="#94a3b8"
              fontSize={9}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={9}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                color: "#1e293b",
                fontSize: "11px",
              }}
            />
            <Area
              type="monotone"
              dataKey="queries"
              stroke="#4f46e5"
              strokeWidth={2.5}
              fill="url(#hourlyQueryGrad)"
              name="Queries"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
