"use client";

import React from "react";
import { Globe, Play, Trash2, Loader2, AlertCircle } from "lucide-react";
import { WebhookEndpoint } from "@/app/(app)/developer/webhooks/page";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface WebhookActiveTargetsProps {
  endpoints: WebhookEndpoint[];
  simulating: boolean;
  handleSimulatePush: (url: string, event: string) => Promise<void>;
  handleToggleStatus: (id: string) => void;
  handleDeleteEndpoint: (id: string) => void;
  formatLocalWebhookDate: (isoStr: string | undefined | null) => string;
  activePlan: string;
  maxEndpoints: number;
}

export default function WebhookActiveTargets({
  endpoints,
  simulating,
  handleSimulatePush,
  handleToggleStatus,
  handleDeleteEndpoint,
  formatLocalWebhookDate,
  activePlan,
  maxEndpoints,
}: WebhookActiveTargetsProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Globe className="w-4.5 h-4.5 text-pink-655 animate-pulse" />
          <h3 className="text-slate-800 text-sm tracking-tight">
            Active Target Streams
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full font-medium shadow-sm">
            Capacity: {endpoints.length} / {maxEndpoints} endpoints
          </span>
        </div>
      </div>

      {endpoints.length === 0 ? (
        <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-xs">
          No active webhook target links mapped. Add a destination URL to begin
          streaming.
        </div>
      ) : (
        <div className="bg-white border border-slate-250 rounded-2xl overflow-hidden">
          {endpoints.map((ep) => {
            const isSuspended =
              ep.status === "inactive" && ep.consecutiveFailures >= 50;
            return (
              <div
                key={ep.id}
                className={`p-4 sm:p-5 flex flex-col justify-between gap-4 border-b border-slate-100 last:border-0 hover:bg-slate-50/20 transition ${
                  isSuspended
                    ? "border-l-4 border-l-rose-500 bg-rose-50/10 shadow-[0_0_15px_-3px_rgba(244,63,94,0.08)]"
                    : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
                  <div className="space-y-1.5 max-w-[75%]">
                    <div className="flex items-center gap-2">
                      <code className="text-[10.5px] text-slate-800 break-all bg-slate-50 border border-slate-150 px-2 py-0.5 rounded font-mono">
                        {ep.url}
                      </code>
                      {isSuspended && (
                        <span className="text-[8px] uppercase tracking-wider font-extrabold bg-rose-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm select-none animate-pulse">
                          <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                          Auto-Suspended
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {ep.events.map((ev) => (
                        <span
                          key={ev}
                          className="text-[8px] font-sans bg-slate-150 text-slate-700 border border-slate-200 px-1.5 py-0.5 rounded font-semibold"
                        >
                          {ev}
                        </span>
                      ))}
                      {ep.consecutiveFailures > 0 && (
                        <span
                          className={`text-[8.5px] font-sans px-2 py-0.5 rounded border font-semibold flex items-center gap-1 ${
                            ep.consecutiveFailures >= 50
                              ? "bg-rose-50 border-rose-100 text-rose-700"
                              : "bg-amber-50 border-amber-100 text-amber-700"
                          }`}
                        >
                          <span
                            className={`w-1 h-1 rounded-full ${ep.consecutiveFailures >= 50 ? "bg-rose-500 animate-pulse" : "bg-amber-500"}`}
                          />
                          {ep.consecutiveFailures} consecutive{" "}
                          {ep.consecutiveFailures === 1
                            ? "failure"
                            : "failures"}
                        </span>
                      )}
                    </div>
                    <span className="text-[9.5px] text-slate-400 block font-light font-sans">
                      Configured: {formatLocalWebhookDate(ep.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {/* Simulation event trigger button */}
                    <button
                      onClick={() =>
                        handleSimulatePush(
                          ep.url,
                          ep.events[0] || "news.posted",
                        )
                      }
                      disabled={simulating || ep.status === "inactive"}
                      className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-sans bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-200 transition cursor-pointer"
                    >
                      {simulating ? (
                        <Loader2 className="w-3 h-3 animate-spin text-slate-500" />
                      ) : (
                        <Play className="w-3 h-3 fill-slate-700" />
                      )}
                      {simulating ? "Dispatching..." : "Test Dispatch"}
                    </button>

                    <button
                      onClick={() => handleToggleStatus(ep.id)}
                      className={`text-[9.5px] font-sans px-3 py-1 rounded-lg border cursor-pointer font-bold tracking-tight transition ${
                        ep.status === "active"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
                          : isSuspended
                            ? "bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100 hover:border-rose-300 font-extrabold"
                            : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {isSuspended ? "REACTIVATE" : ep.status.toUpperCase()}
                    </button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button className="text-slate-400 hover:text-rose-655 hover:bg-rose-50 p-2 rounded-lg border border-transparent hover:border-rose-100 transition cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl max-w-md">
                        <AlertDialogHeader className="space-y-2 text-left">
                          <AlertDialogTitle className="text-slate-800 font-sans tracking-tight">
                            Delete Webhook Destination?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-xs text-slate-500 leading-relaxed font-sans">
                            This action will permanently delete the stream
                            listener target mapping for:
                            <code className="block mt-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] text-slate-700 font-mono break-all font-bold">
                              {ep.url}
                            </code>
                            You will instantly stop receiving real-time event
                            updates at this address. This cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-4 flex justify-end gap-2">
                          <AlertDialogCancel className="text-xs px-4 py-2 border rounded-xl hover:bg-slate-50 cursor-pointer">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteEndpoint(ep.id)}
                            className="text-xs px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-lg shadow-rose-600/10 cursor-pointer font-bold"
                          >
                            Delete Target
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>

                {isSuspended && (
                  <div className="mt-2 p-3.5 bg-rose-50 border border-rose-100 rounded-xl text-[10.5px] text-rose-700 font-sans flex items-start gap-2.5 leading-relaxed shadow-sm">
                    <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-extrabold uppercase text-[9px] tracking-wider block mb-0.5">
                        Callback Delivery Suspended
                      </strong>
                      This endpoint has failed 50 consecutive delivery attempts
                      (timeouts, DNS validation blocks, or server 5xx errors).
                      Outbound streaming has been auto-disabled to protect
                      pipeline latency. Click{" "}
                      <strong className="font-extrabold text-rose-800">
                        REACTIVATE
                      </strong>{" "}
                      above to clear the failure count and resume webhook
                      services.
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
