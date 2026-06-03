"use client";

import React from "react";
import { useDeveloper } from "@/app/developer/layout";
import { ShieldAlert } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const defaultDailyData = [
  { name: "Mon", queries: 0, latency: 0, success: 0, errors: 0 },
  { name: "Tue", queries: 0, latency: 0, success: 0, errors: 0 },
  { name: "Wed", queries: 0, latency: 0, success: 0, errors: 0 },
  { name: "Thu", queries: 0, latency: 0, success: 0, errors: 0 },
  { name: "Fri", queries: 0, latency: 0, success: 0, errors: 0 },
  { name: "Sat", queries: 0, latency: 0, success: 0, errors: 0 },
  { name: "Sun", queries: 0, latency: 0, success: 0, errors: 0 },
];

export default function StatusCodeRatesChart() {
  const { realChartData, loadingTelemetry } = useDeveloper();

  if (loadingTelemetry) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 min-h-[260px] flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Skeleton className="w-4 h-4 rounded-full bg-slate-100" />
            <Skeleton className="h-4 w-40 bg-slate-150 rounded-md" />
          </div>
          <Skeleton className="h-4 w-16 bg-slate-100 rounded-full" />
        </div>
        <div className="w-full h-[150px] flex items-end gap-4 pt-4">
          <Skeleton className="w-full h-[20%] bg-slate-50 rounded-lg animate-pulse" />
          <Skeleton className="w-full h-[45%] bg-slate-100/70 rounded-lg animate-pulse" />
          <Skeleton className="w-full h-[35%] bg-slate-50 rounded-lg animate-pulse" />
          <Skeleton className="w-full h-[80%] bg-slate-100/70 rounded-lg animate-pulse" />
          <Skeleton className="w-full h-[50%] bg-slate-50 rounded-lg animate-pulse" />
          <Skeleton className="w-full h-[65%] bg-slate-100/70 rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 min-h-[260px] flex flex-col justify-between">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4.5 h-4.5 text-rose-505 animate-pulse" />
          <h3 className="text-slate-800 text-sm font-sans">
            Response Status Code Rates
          </h3>
        </div>
        <span className="text-[9px] uppercase text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100 font-sans">
          Diagnostics
        </span>
      </div>

      <div className="w-full h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={
              realChartData && realChartData.length > 0
                ? realChartData
                : defaultDailyData
            }
            margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
          >
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
            <Bar
              dataKey="success"
              stackId="a"
              fill="#10b981"
              radius={[0, 0, 0, 0]}
              name="Succeeded (2xx)"
            />
            <Bar
              dataKey="errors"
              stackId="a"
              fill="#f43f5e"
              radius={[4, 4, 0, 0]}
              name="Failed / Blocked"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
