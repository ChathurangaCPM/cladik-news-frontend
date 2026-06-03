"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Sparkles, Loader2 } from "lucide-react";
import {
  getDeveloperSession,
  getDeveloperKeysAction,
  updateSubscriptionPlanAction,
  logoutAction,
  getDeveloperMetricsAction,
  getDeveloperLogsAction,
  getDeveloperChartDataAction,
} from "@/app/actions/auth";

interface DeveloperContextType {
  activePlan: "free" | "business" | "advanced";
  developerEmail: string;
  developerName: string;
  apiKeys: any[];
  metrics: any;
  activityLogs: any[];
  realChartData: any[];
  hourlyChartData: any[];
  endpointChartData: any[];
  refreshTelemetry: () => Promise<void>;
  handleSimulatedPlanSwitch: (
    tier: "free" | "business" | "advanced",
  ) => Promise<void>;
  loadingPlan: boolean;
  loadingTelemetry: boolean;
  latestRawKey: string | null;
  setLatestRawKey: (key: string | null) => void;
  showRawKeyModal: boolean;
  setShowRawKeyModal: (show: boolean) => void;
  playgroundKey: string;
  setPlaygroundKey: (key: string) => void;
  selectedPlaygroundKey: string;
  setSelectedPlaygroundKey: (key: string) => void;
}

const DeveloperContext = createContext<DeveloperContextType | undefined>(
  undefined,
);

export function useDeveloper() {
  const context = useContext(DeveloperContext);
  if (!context) {
    throw new Error("useDeveloper must be used within a DeveloperProvider");
  }
  return context;
}

export default function DeveloperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  // Developer states
  const [activePlan, setActivePlan] = useState<
    "free" | "business" | "advanced"
  >("free");
  const [developerEmail, setDeveloperEmail] = useState(
    "developer@neuralpress.io",
  );
  const [developerName, setDeveloperName] = useState("Guest Developer");

  // API Keys state
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [latestRawKey, setLatestRawKey] = useState<string | null>(null);
  const [showRawKeyModal, setShowRawKeyModal] = useState(false);
  const [playgroundKey, setPlaygroundKey] = useState("");
  const [selectedPlaygroundKey, setSelectedPlaygroundKey] = useState("");
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingTelemetry, setLoadingTelemetry] = useState(true);

  // Telemetry states
  const [metrics, setMetrics] = useState<any>(null);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [realChartData, setRealChartData] = useState<any[]>([]);
  const [hourlyChartData, setHourlyChartData] = useState<any[]>([]);
  const [endpointChartData, setEndpointChartData] = useState<any[]>([]);

  // Telemetry loading logic
  const refreshTelemetry = async () => {
    try {
      const session = await getDeveloperSession();
      if (!session) {
        await logoutAction();
        router.push("/login");
        return;
      }

      const keys = await getDeveloperKeysAction();
      setApiKeys(keys);

      if (keys.length > 0 && !selectedPlaygroundKey) {
        setSelectedPlaygroundKey(keys[0].id);
      }

      const liveMetrics = await getDeveloperMetricsAction();
      if (liveMetrics) {
        setMetrics(liveMetrics);
      }

      const liveLogs = await getDeveloperLogsAction();
      setActivityLogs(liveLogs.data || []);

      const liveCharts = await getDeveloperChartDataAction();
      if (liveCharts) {
        setRealChartData(liveCharts.daily || []);
        setHourlyChartData(liveCharts.hourly || []);
        setEndpointChartData(liveCharts.endpoints || []);
      } else {
        setRealChartData([]);
        setHourlyChartData([]);
        setEndpointChartData([]);
      }
    } catch (err) {
      console.error("refreshTelemetry error:", err);
    }
  };

  // Mount session validation sequence
  useEffect(() => {
    async function loadData() {
      setLoadingTelemetry(true);
      const session = await getDeveloperSession();
      if (!session) {
        await logoutAction();
        router.push("/login");
        return;
      }

      const plan = session.subscriptionPlanType;
      if (!plan || plan === "none" || plan === "pending") {
        router.push("/pricing");
        return;
      }

      setDeveloperName(
        session.fullName || session.firstName || "Nexus Developer",
      );
      setDeveloperEmail(session.email);
      setActivePlan(plan);

      await refreshTelemetry();
      setLoadingTelemetry(false);

      // Hook up any checkout redirection state loads
      const justCheckedOut = localStorage.getItem("justCheckedOut");
      const apiKeySecret = localStorage.getItem("apiKeySecret");
      if (
        justCheckedOut === "true" &&
        apiKeySecret &&
        apiKeySecret.startsWith("np_")
      ) {
        setLatestRawKey(apiKeySecret);
        setPlaygroundKey(apiKeySecret);
        setShowRawKeyModal(true);
        localStorage.removeItem("justCheckedOut");
        localStorage.removeItem("apiKeySecret");

        const refreshedKeys = await getDeveloperKeysAction();
        setApiKeys(refreshedKeys);
        const match = refreshedKeys.find((k: any) =>
          apiKeySecret.endsWith(k.key.replace("...", "")),
        );
        if (match) {
          setSelectedPlaygroundKey(match.id);
          localStorage.setItem(`raw_key_${match.id}`, apiKeySecret);
        } else if (refreshedKeys.length > 0) {
          setSelectedPlaygroundKey(refreshedKeys[0].id);
        }
      }
    }
    loadData();
  }, [router]);

  // Billing tier switch proxy
  const handleSimulatedPlanSwitch = async (
    tier: "free" | "business" | "advanced",
  ) => {
    setLoadingPlan(true);
    const res = await updateSubscriptionPlanAction(tier);
    if (res.success) {
      setActivePlan(tier);
      await refreshTelemetry();
    } else {
      if (
        res.error === "Session expired" ||
        res.error?.toLowerCase().includes("unauthorized") ||
        res.error?.toLowerCase().includes("expired")
      ) {
        alert("Your session has expired. You will be logged out.");
        await logoutAction();
        router.push("/login");
        return;
      }
      alert(`Failed to update subscription plan: ${res.error}`);
    }
    setLoadingPlan(false);
  };

  return (
    <DeveloperContext.Provider
      value={{
        activePlan,
        developerEmail,
        developerName,
        apiKeys,
        metrics,
        activityLogs,
        realChartData,
        hourlyChartData,
        endpointChartData,
        refreshTelemetry,
        handleSimulatedPlanSwitch,
        loadingPlan,
        loadingTelemetry,
        latestRawKey,
        setLatestRawKey,
        showRawKeyModal,
        setShowRawKeyModal,
        playgroundKey,
        setPlaygroundKey,
        selectedPlaygroundKey,
        setSelectedPlaygroundKey,
      }}
    >
      <SidebarProvider>
        <AppSidebar
          developerName={developerName}
          developerEmail={developerEmail}
          activePlan={activePlan}
          onLogout={async () => {
            await logoutAction();
            router.push("/login");
          }}
        />
        <SidebarInset className="bg-[#f8fafc] text-slate-900 flex flex-col min-h-screen developer-hub-light font-sans">
          {/* Background light gradients */}
          <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-500/[0.03] via-transparent to-transparent pointer-events-none z-0" />
          <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-lime-500/[0.01] rounded-full blur-[140px] pointer-events-none z-0" />
          <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-sky-500/[0.01] rounded-full blur-[140px] pointer-events-none z-0" />

          {/* TOP LEVEL HEADER */}
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 px-6 border-b border-slate-200 bg-white/80 backdrop-blur-md relative">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-slate-500 hover:text-slate-800" />
              <div className="hidden sm:block w-[1px] h-6 bg-slate-200" />
              <div>
                <h1 className="text-sm tracking-tight text-slate-800 flex items-center gap-2">
                  Developer Console
                  <span className="text-[10px] uppercase px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100">
                    {activePlan.toUpperCase()}
                  </span>
                </h1>
              </div>
            </div>

            {/* SIMULATOR PLAN SWITCHER */}
            {/* <div className="hidden md:flex items-center gap-4 bg-slate-50 border border-slate-200 p-1.5 rounded-xl scale-90">
              <div className="flex items-center gap-1.5 pl-2 text-xs text-indigo-600 font-mono">
                {loadingPlan ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles
                    className="w-3 h-3"
                    style={{ animationDuration: "6s" }}
                  />
                )}
                <span>PLAN TESTER:</span>
              </div>

              <div className="flex gap-1">
                {["free", "business", "advanced"].map((tier) => (
                  <button
                    key={tier}
                    disabled={loadingPlan}
                    onClick={() => handleSimulatedPlanSwitch(tier as any)}
                    className={`px-2.5 py-1 rounded-lg text-[9px] uppercase tracking-wider transition cursor-pointer ${
                      activePlan === tier
                        ? "bg-indigo-600 text-white"
                        : "text-slate-550 hover:text-slate-900 hover:bg-slate-200"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div> */}

            {/* Connection Status Badge */}
            <div className="flex items-center gap-3 scale-95">
              <Link
                href="/pricing"
                className="text-[10px] font-extrabold bg-slate-100 border border-slate-200 hover:bg-slate-200 px-3 py-1.5 rounded-full cursor-pointer transition text-slate-700"
              >
                Plans Matrix
              </Link>
              <span className="flex items-center gap-1.5 text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full font-mono font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                ONLINE
              </span>
            </div>
          </header>

          {/* Render nested path content */}
          <div className="flex-1 w-full mx-auto space-y-8 relative z-10 overflow-y-auto">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </DeveloperContext.Provider>
  );
}
