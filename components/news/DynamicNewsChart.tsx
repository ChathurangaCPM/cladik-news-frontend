"use client";

import React, { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface ChartSeries {
  dataKey: string;
  label: string;
  color: string;
}

export interface NewsChartData {
  type: "bar" | "line" | "pie" | "area" | "radar" | "radial";
  title: string;
  description?: string;
  xAxisKey: string;
  series: ChartSeries[];
  data: any[];
}

export function DynamicNewsChart({ chartObj }: { chartObj: NewsChartData }) {
  const styleVariables = useMemo(() => {
    const vars: Record<string, string> = {};
    if (chartObj && chartObj.series) {
      chartObj.series.forEach((s) => {
        vars[`--color-${s.dataKey}`] = s.color || "hsl(var(--primary))";
      });
    }
    return vars;
  }, [chartObj]);

  if (!chartObj || !chartObj.data || chartObj.data.length === 0) {
    return null;
  }

  // Beautiful Custom Tooltip Component (Responsive, Dark-Mode aware, premium design)
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 p-3 rounded-2xl shadow-xl text-xs font-inter text-left">
          <p className="font-semibold text-slate-800 dark:text-slate-200 mb-1.5">{label}</p>
          <div className="space-y-1">
            {payload.map((item: any) => (
              <div key={item.name || item.dataKey} className="flex items-center gap-2 text-slate-650 dark:text-zinc-400">
                <span 
                  className="w-2.5 h-2.5 rounded-full shrink-0" 
                  style={{ backgroundColor: item.color || item.fill }} 
                />
                <span className="font-light">{item.name || item.dataKey}:</span>
                <span className="font-semibold text-slate-950 dark:text-slate-50">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    let chartInstance = null;
    switch (chartObj.type) {
      case "area":
        chartInstance = (
          <AreaChart data={chartObj.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.3)" />
            <XAxis
              dataKey={chartObj.xAxisKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-[11px] fill-slate-400 dark:fill-zinc-500 font-inter"
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              className="text-[11px] fill-slate-400 dark:fill-zinc-500 font-inter"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} className="text-xs font-inter" />
            {chartObj.series.map((s) => (
              <Area
                key={s.dataKey}
                type="monotone"
                name={s.label}
                dataKey={s.dataKey}
                fill={`var(--color-${s.dataKey})`}
                stroke={`var(--color-${s.dataKey})`}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        );
        break;
      case "bar":
        chartInstance = (
          <BarChart data={chartObj.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.3)" />
            <XAxis
              dataKey={chartObj.xAxisKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-[11px] fill-slate-400 dark:fill-zinc-500 font-inter"
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              className="text-[11px] fill-slate-400 dark:fill-zinc-500 font-inter"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} className="text-xs font-inter" />
            {chartObj.series.map((s) => (
              <Bar
                key={s.dataKey}
                name={s.label}
                dataKey={s.dataKey}
                fill={`var(--color-${s.dataKey})`}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );
        break;
      case "line":
        chartInstance = (
          <LineChart data={chartObj.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(226, 232, 240, 0.3)" />
            <XAxis
              dataKey={chartObj.xAxisKey}
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-[11px] fill-slate-400 dark:fill-zinc-500 font-inter"
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              className="text-[11px] fill-slate-400 dark:fill-zinc-500 font-inter"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} className="text-xs font-inter" />
            {chartObj.series.map((s) => (
              <Line
                key={s.dataKey}
                name={s.label}
                type="monotone"
                dataKey={s.dataKey}
                stroke={`var(--color-${s.dataKey})`}
                strokeWidth={2.5}
                dot={{ r: 4, strokeWidth: 1.5 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );
        break;
      case "pie":
        const mainSeries = chartObj.series[0];
        if (mainSeries) {
          chartInstance = (
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={chartObj.data}
                dataKey={mainSeries.dataKey}
                nameKey={chartObj.xAxisKey}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="hsl(var(--primary))"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                className="text-[10px] font-medium font-inter"
              />
              <Legend verticalAlign="bottom" height={36} className="text-xs font-inter" />
            </PieChart>
          );
        }
        break;
      case "radar":
        chartInstance = (
          <RadarChart data={chartObj.data} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke="rgba(226, 232, 240, 0.2)" />
            <PolarAngleAxis dataKey={chartObj.xAxisKey} className="text-[10px] fill-slate-400 dark:fill-zinc-500 font-inter" />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} className="text-xs font-inter" />
            {chartObj.series.map((s) => (
              <Radar
                key={s.dataKey}
                name={s.label}
                dataKey={s.dataKey}
                stroke={`var(--color-${s.dataKey})`}
                fill={`var(--color-${s.dataKey})`}
                fillOpacity={0.4}
                strokeWidth={2}
              />
            ))}
          </RadarChart>
        );
        break;
      case "radial":
        chartInstance = (
          <RadialBarChart 
            innerRadius="20%" 
            outerRadius="100%" 
            data={chartObj.data} 
            cx="50%"
            cy="50%"
            startAngle={180} 
            endAngle={0}
          >
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="bottom" height={36} className="text-xs font-inter" />
            {chartObj.series.map((s) => (
              <RadialBar
                key={s.dataKey}
                name={s.label}
                label={{ position: 'insideStart', fill: '#fff', fontSize: 10, fontFamily: 'font-inter' }}
                background={{ fill: "rgba(226, 232, 240, 0.05)" }}
                dataKey={s.dataKey}
                fill={`var(--color-${s.dataKey})`}
              />
            ))}
          </RadialBarChart>
        );
        break;
      default:
        return null;
    }

    if (!chartInstance) return null;

    return (
      <div className="my-8 w-full bg-slate-50/50 dark:bg-zinc-900/30 border border-slate-100 dark:border-zinc-800/80 rounded-3xl p-6 shadow-[0_2px_15px_rgb(0,0,0,0.02)]">
        <div className="mb-6">
          <h4 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-zinc-50 font-inter mb-1">
            {chartObj.title}
          </h4>
          {chartObj.description && (
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-inter font-light">
              {chartObj.description}
            </p>
          )}
        </div>
        <div 
          style={styleVariables as React.CSSProperties}
          className="w-full h-[320px] font-inter text-slate-800 dark:text-zinc-200"
        >
          <ResponsiveContainer width="100%" height="100%">
            {chartInstance}
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  return renderChart();
}
