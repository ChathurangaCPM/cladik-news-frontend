"use client";

import React from "react";
import { Database, RefreshCw } from "lucide-react";
import { WebhookDeliveryLog } from "@/app/(app)/developer/webhooks/page";

interface WebhookTelemetryLogsProps {
  deliveryLogs: WebhookDeliveryLog[];
  setDeliveryLogs: React.Dispatch<React.SetStateAction<WebhookDeliveryLog[]>>;
  setTriggerLogInspect: (log: WebhookDeliveryLog | null) => void;
  formatLocalWebhookTimeOnly: (isoStr: string | undefined | null) => string;
}

export default function WebhookTelemetryLogs({
  deliveryLogs,
  setDeliveryLogs,
  setTriggerLogInspect,
  formatLocalWebhookTimeOnly,
}: WebhookTelemetryLogsProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Database className="w-4.5 h-4.5 text-indigo-650" />
          <h3 className=" text-slate-800 text-sm tracking-tight">
            Delivery Telemetry Logs
          </h3>
        </div>
        <button
          onClick={() => setDeliveryLogs([])}
          className="text-[9.5px]  text-slate-400 hover:text-slate-700 transition flex items-center gap-1 focus:outline-none cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" /> Clear
        </button>
      </div>

      {deliveryLogs.length === 0 ? (
        <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-xs">
          No webhooks logs trace recorded. Run simulations or await processor
          updates.
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[9px] uppercase">
                <th className="p-3">Timestamp</th>
                <th className="p-3">Event</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-center">Latency</th>
                <th className="p-3 text-center">Attempts</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-650">
              {deliveryLogs.map((log) => {
                const isSuccess = log.statusCode >= 200 && log.statusCode < 300;
                const statusColor = isSuccess
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                  : "bg-rose-50 text-rose-700 border-rose-100";
                return (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition">
                    <td className="p-3 whitespace-nowrap text-slate-400 text-[10px]">
                      {formatLocalWebhookTimeOnly(log.timestamp)}
                    </td>
                    <td className="p-3 whitespace-nowrap text-slate-800 font-semibold text-[10.5px]">
                      {log.event}
                    </td>
                    <td className="p-3 text-center whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px]  border ${statusColor}`}
                      >
                        {log.statusCode}
                      </span>
                    </td>
                    <td className="p-3 text-center whitespace-nowrap text-slate-700 font-semibold">
                      {log.latency}ms
                    </td>
                    <td className="p-3 text-center whitespace-nowrap text-slate-400">
                      {log.attempts}x
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => setTriggerLogInspect(log)}
                        className="text-indigo-650 hover:text-indigo-800 font-sans  hover:underline transition cursor-pointer"
                      >
                        View Payload
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
