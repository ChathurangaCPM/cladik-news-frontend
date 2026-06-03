"use client";

import React from "react";
import { useDeveloper } from "@/app/developer/layout";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

export default function EndpointDispositionChart() {
  const { endpointChartData, loadingTelemetry } = useDeveloper();

  if (loadingTelemetry) {
    return (
      <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between min-h-[300px]">
        <div className="w-full flex justify-between items-center mb-4">
          <Skeleton className="h-4 w-32 bg-slate-100 rounded-md" />
          <Skeleton className="h-4 w-8 bg-slate-100 rounded-full" />
        </div>
        <div className="relative w-full h-[140px] flex items-center justify-center my-2">
          {/* Circular donut outline skeleton */}
          <div className="w-28 h-28 rounded-full border-[8px] border-slate-100 flex items-center justify-center">
            <div className="space-y-1.5 text-center">
              <Skeleton className="h-5 w-10 mx-auto bg-slate-150 rounded-md" />
              <Skeleton className="h-2.5 w-14 mx-auto bg-slate-100 rounded-md" />
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <div className="flex items-center gap-1.5 w-1/2">
                <Skeleton className="w-2.5 h-2.5 rounded-full bg-slate-100 shrink-0" />
                <Skeleton className="h-3 w-28 bg-slate-100 rounded-md" />
              </div>
              <Skeleton className="h-3 w-12 bg-slate-150 rounded-md" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const COLORS = ["#6366f1", "#10b981", "#a855f7", "#f59e0b"];
  const total = endpointChartData
    ? endpointChartData.reduce((acc, curr) => acc + curr.value, 0)
    : 0;

  const validChartData =
    endpointChartData && endpointChartData.filter((d) => d.value > 0).length > 0
      ? endpointChartData.filter((d) => d.value > 0)
      : [
          { name: "/api/v1/access/news", value: 1 },
          { name: "/api/v1/access/news/search", value: 0 },
        ];

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col justify-between min-h-[300px]">
      <div className="w-full flex justify-between items-center text-sm text-slate-400 tracking-normal mb-4 font-sans">
        <span>Endpoint Disposition</span>
        <span className="text-emerald-600 font-bold">LIVE</span>
      </div>

      <div className="relative w-full h-[140px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={validChartData}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={60}
              paddingAngle={3}
              dataKey="value"
            >
              {validChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                color: "#1e293b",
                fontSize: "11px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute text-center font-sans">
          <span className="text-lg font-black tracking-tighter text-slate-800 block font-sans">
            {total}
          </span>
          <span className="text-[7px] text-slate-400 block uppercase tracking-wider font-bold font-sans">
            TOTAL HITS
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-1.5 text-xs font-sans">
        {endpointChartData &&
          endpointChartData.map((entry, index) => {
            const percent =
              total > 0 ? Math.round((entry.value / total) * 100) : 0;
            return (
              <div
                key={entry.name}
                className="flex justify-between items-center"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-[10px] text-slate-655 truncate max-w-[145px]">
                    {entry.name}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-800 shrink-0">
                  {entry.value} ({percent}%)
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
