"use client";

import React from "react";
import PlanCapGauge from "./charts/PlanCapGauge";
import RequestVolumeChart from "./charts/RequestVolumeChart";
import LatencyTrendChart from "./charts/LatencyTrendChart";
import StatusCodeRatesChart from "./charts/StatusCodeRatesChart";
import HourlyVolumeChart from "./charts/HourlyVolumeChart";
import EndpointDispositionChart from "./charts/EndpointDispositionChart";

export default function DashboardCharts() {
  return (
    <div className="space-y-6 font-sans">
      {/* Row 1: Plan Cap Gauge & 7-Day Request Volume */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div className="md:col-span-4">
          <PlanCapGauge />
        </div>
        <div className="md:col-span-8">
          <RequestVolumeChart />
        </div>
      </div>

      {/* Row 2: Response Latency Curve & Response Status Code Rates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LatencyTrendChart />
        <StatusCodeRatesChart />
      </div>

      {/* Row 3: Hourly Request Volume & Endpoint Disposition */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        <div className="md:col-span-8">
          <HourlyVolumeChart />
        </div>
        <div className="md:col-span-4">
          <EndpointDispositionChart />
        </div>
      </div>
    </div>
  );
}
