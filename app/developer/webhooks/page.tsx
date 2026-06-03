"use client";

import React, { useState, useEffect } from "react";
import { useDeveloper } from "@/app/developer/layout";

// Modular webhook components
import WebhooksPaywall from "@/components/custom/developer/WebhooksPaywall";
import WebhookConfigurator from "@/components/custom/developer/WebhookConfigurator";
import WebhookActiveTargets from "@/components/custom/developer/WebhookActiveTargets";
import WebhookTelemetryLogs from "@/components/custom/developer/WebhookTelemetryLogs";
import WebhookPayloadInspectDrawer from "@/components/custom/developer/WebhookPayloadInspectDrawer";

// Server Actions
import {
  getDeveloperWebhooksAction,
  createDeveloperWebhookAction,
  toggleDeveloperWebhookStatusAction,
  deleteDeveloperWebhookAction,
  getDeveloperWebhookLogsAction,
  testDeveloperWebhookAction,
  getDeveloperWebhookStatsAction,
} from "@/app/actions/auth";
import { redirect } from "next/navigation";

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: string[];
  status: "active" | "inactive";
  createdAt: string;
  consecutiveFailures: number;
}

export interface WebhookDeliveryLog {
  id: string;
  timestamp: string;
  url: string;
  event: string;
  statusCode: number;
  latency: number;
  attempts: number;
  payload: string;
}

export default function DeveloperWebhooks() {
  const { activePlan, handleSimulatedPlanSwitch } = useDeveloper();

  redirect("/developer");

  // State managers
  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([]);
  const [deliveryLogs, setDeliveryLogs] = useState<WebhookDeliveryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingJobs: 0,
    globalCompleted: 14295,
    userTotal: 0,
    userSuccess: 0,
    userFailed: 0,
  });

  // Form input & Simulation States
  const [newUrl, setNewUrl] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([
    "news.posted",
  ]);
  const [simulating, setSimulating] = useState(false);
  const [triggerLogInspect, setTriggerLogInspect] =
    useState<WebhookDeliveryLog | null>(null);

  // Load telemetry data from database
  const fetchWebhooksData = async () => {
    setLoading(true);
    try {
      const [eps, logs, initialStats] = await Promise.all([
        getDeveloperWebhooksAction(),
        getDeveloperWebhookLogsAction(30),
        getDeveloperWebhookStatsAction(),
      ]);

      setEndpoints(eps || []);
      setStats(
        initialStats || {
          pendingJobs: 0,
          globalCompleted: 14295,
          userTotal: 0,
          userSuccess: 0,
          userFailed: 0,
        },
      );

      const formattedLogs = (logs || []).map((l: any) => ({
        id: l.id,
        timestamp: l.createdAt || new Date().toISOString(),
        url: l.url,
        event: l.event,
        statusCode: l.statusCode,
        latency: l.latency,
        attempts: l.attempts,
        payload: l.payload,
      }));
      setDeliveryLogs(formattedLogs);
    } catch (err) {
      console.error("Failed to load webhooks telemetry:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activePlan !== "free") {
      fetchWebhooksData();

      // Poll stats every 5 seconds for real-time queue states and completions
      const interval = setInterval(async () => {
        try {
          const latestStats = await getDeveloperWebhookStatsAction();
          setStats(latestStats);
        } catch (err) {
          console.error("Failed to poll webhook stats:", err);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [activePlan]);

  // Time & date formatting helpers
  const formatLocalTimestamp = (isoStr: string | undefined | null) => {
    if (!isoStr) return "-";
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

  const formatLocalWebhookDate = (isoStr: string | undefined | null) => {
    if (!isoStr) return "-";
    try {
      const date = new Date(isoStr);
      if (isNaN(date.getTime())) return isoStr;
      return (
        date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        }) +
        " at " +
        date.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    } catch (_) {
      return isoStr;
    }
  };

  const formatLocalWebhookTimeOnly = (isoStr: string | undefined | null) => {
    if (!isoStr) return "-";
    try {
      const date = new Date(isoStr);
      if (isNaN(date.getTime())) return isoStr;
      return date.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (_) {
      return isoStr;
    }
  };

  // Toggle active subscribed events helper
  const handleToggleEvent = (event: string) => {
    if (selectedEvents.includes(event)) {
      setSelectedEvents(selectedEvents.filter((e) => e !== event));
    } else {
      setSelectedEvents([...selectedEvents, event]);
    }
  };

  // Add webhook endpoint
  const handleAddEndpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl || !newUrl.startsWith("http")) {
      alert("Please enter a valid HTTP/HTTPS endpoint URL.");
      return;
    }

    const res = await createDeveloperWebhookAction(newUrl, selectedEvents);
    if (res.success) {
      setNewUrl("");
      setSelectedEvents(["news.posted"]);
      await fetchWebhooksData();
    } else {
      alert(res.error || "Failed to configure webhook target.");
    }
  };

  // Delete webhook
  const handleDeleteEndpoint = async (id: string) => {
    const res = await deleteDeveloperWebhookAction(id);
    if (res.success) {
      await fetchWebhooksData();
    } else {
      alert(res.error || "Failed to delete webhook.");
    }
  };

  // Toggle active / inactive status of webhook endpoint
  const handleToggleStatus = async (id: string) => {
    const res = await toggleDeveloperWebhookStatusAction(id);
    if (res.success) {
      await fetchWebhooksData();
    } else {
      alert(res.error || "Failed to update webhook target status.");
    }
  };

  // Dispatch live sandbox test webhook execution
  const handleSimulatePush = async (endpointUrl: string, eventType: string) => {
    setSimulating(true);

    const res = await testDeveloperWebhookAction(endpointUrl, eventType);
    setSimulating(false);

    if (res.success && res.data?.log) {
      const newLog = res.data.log;
      const formattedLog: WebhookDeliveryLog = {
        id: newLog.id || `log_wh_${Date.now()}`,
        timestamp: newLog.createdAt || new Date().toISOString(),
        url: newLog.url,
        event: newLog.event,
        statusCode: newLog.statusCode,
        latency: newLog.latency,
        attempts: newLog.attempts,
        payload: newLog.payload,
      };

      setDeliveryLogs([formattedLog, ...deliveryLogs]);
      setTriggerLogInspect(formattedLog);
    } else {
      alert(res.error || "Failed to dispatch simulated sandbox webhook event.");
    }
  };

  const isFreePlan = activePlan === "free";
  const maxEndpoints =
    activePlan === "business" ? 3 : activePlan === "advanced" ? 10 : 0;

  return (
    <div className="space-y-8 font-sans relative">
      {/* Title Header Section */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-slate-400">
            Real-Time Dispatcher
          </span>
        </div>
        <h2 className="text-xl md:text-2xl text-slate-800 tracking-tight">
          Webhooks & Streaming
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed font-light">
          Configure secure HTTP POST callback receivers to subscribe to
          real-time events. Whenever our background neural processor ingests,
          translates, or categorizes news, we will immediately stream payload
          notifications to your custom servers using our isolated background
          queue threads.
        </p>
      </div>

      {/* Main layout wrapper */}
      <div className="relative">
        {/* Glassmorphic Locked Paywall Overlay */}
        <WebhooksPaywall
          isFreePlan={isFreePlan}
          handleSimulatedPlanSwitch={handleSimulatedPlanSwitch}
        />

        {/* Content sections */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-8 items-start ${
            isFreePlan ? "pointer-events-none opacity-20 filter blur-[1px]" : ""
          }`}
        >
          {/* LEFT: Configurator Panel */}
          <div className="lg:col-span-5">
            <WebhookConfigurator
              newUrl={newUrl}
              setNewUrl={setNewUrl}
              selectedEvents={selectedEvents}
              handleToggleEvent={handleToggleEvent}
              handleAddEndpoint={handleAddEndpoint}
              activePlan={activePlan}
              maxEndpoints={maxEndpoints}
              endpointsCount={endpoints.length}
              stats={stats}
            />
          </div>

          {/* RIGHT: Webhook endpoints list & Delivery Logs */}
          <div className="lg:col-span-7 space-y-6">
            <WebhookActiveTargets
              endpoints={endpoints}
              simulating={simulating}
              handleSimulatePush={handleSimulatePush}
              handleToggleStatus={handleToggleStatus}
              handleDeleteEndpoint={handleDeleteEndpoint}
              formatLocalWebhookDate={formatLocalWebhookDate}
              activePlan={activePlan}
              maxEndpoints={maxEndpoints}
            />

            <WebhookTelemetryLogs
              deliveryLogs={deliveryLogs}
              setDeliveryLogs={setDeliveryLogs}
              setTriggerLogInspect={setTriggerLogInspect}
              formatLocalWebhookTimeOnly={formatLocalWebhookTimeOnly}
            />
          </div>
        </div>
      </div>

      {/* Inspect payload side drawer */}
      <WebhookPayloadInspectDrawer
        triggerLogInspect={triggerLogInspect}
        setTriggerLogInspect={setTriggerLogInspect}
        formatLocalTimestamp={formatLocalTimestamp}
      />
    </div>
  );
}
