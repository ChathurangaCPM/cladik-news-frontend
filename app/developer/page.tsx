"use client";

import React from "react";
import DashboardMetrics from "@/components/custom/developer/DashboardMetrics";
import DashboardCharts from "@/components/custom/developer/DashboardCharts";

export default function DeveloperOverview() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Real-time System Metrics Cards Grid */}
      <DashboardMetrics />

      {/* Analytics Visualization and Telemetry Charts */}
      <DashboardCharts />
    </div>
  );
}
