"use client";

import React from "react";
import { Link2, Plus, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface WebhookConfiguratorProps {
  newUrl: string;
  setNewUrl: (url: string) => void;
  selectedEvents: string[];
  handleToggleEvent: (event: string) => void;
  handleAddEndpoint: (e: React.FormEvent) => void;
  activePlan: string;
  maxEndpoints: number;
  endpointsCount: number;
  stats: {
    pendingJobs: number;
    globalCompleted: number;
    userTotal: number;
    userSuccess: number;
    userFailed: number;
  };
}

export default function WebhookConfigurator({
  newUrl,
  setNewUrl,
  selectedEvents,
  handleToggleEvent,
  handleAddEndpoint,
  activePlan,
  maxEndpoints,
  endpointsCount,
  stats,
}: WebhookConfiguratorProps) {
  const isLimitReached = endpointsCount >= maxEndpoints;

  return (
    <div className="space-y-6">
      {/* Create Webhook Target */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Link2 className="w-4.5 h-4.5 text-indigo-655" />
          <h3 className="text-slate-800 text-sm tracking-tight">
            Add Target Endpoint
          </h3>
        </div>

        <form onSubmit={handleAddEndpoint} className="space-y-4">
          {isLimitReached && (
            <div className="p-3.5 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-2.5 text-amber-800 text-[10.5px] leading-relaxed shadow-sm">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <strong className="uppercase text-[9px] tracking-wider block mb-0.5">
                  Capacity Limit Reached
                </strong>
                You have configured {endpointsCount} out of {maxEndpoints}{" "}
                webhooks allowed under your{" "}
                <span className="uppercase text-[9.5px] text-amber-900">
                  {activePlan}
                </span>{" "}
                subscription. Delete an active target or upgrade your plan to
                register new webhooks.
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] uppercase text-slate-400 block">
              Webhook Destination URL
            </label>
            <Input
              type="url"
              required
              disabled={isLimitReached}
              placeholder={
                isLimitReached
                  ? "Capacity tier limits reached"
                  : "https://api.domain.com/v1/news-hook"
              }
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full bg-slate-50 disabled:bg-slate-100/50 disabled:cursor-not-allowed border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-650 transition font-sans"
            />
            <span className="text-[9px] text-slate-400 block font-light">
              Destination must accept HTTP POST requests with JSON payloads
            </span>
          </div>

          {/* Event types checkboxes */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase text-slate-400 block">
              Subscribe Event Topics
            </label>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
              <div className="flex items-center gap-3 w-full justify-between text-xs text-slate-700">
                <div className="space-y-0.5">
                  <span className="text-[10.5px] text-slate-800">
                    news.posted
                  </span>
                  <p className="text-[9px] text-slate-400 font-light font-sans">
                    Dispatched instantly in real-time as soon as a brand new
                    news article is created.
                  </p>
                </div>
                <Switch checked={true} disabled={true} />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!newUrl || isLimitReached}
            className="w-full font-bold uppercase text-[10px] tracking-wider py-3.5 rounded-xl cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Save Webhook Listener
          </Button>
        </form>
      </div>

      {/* Simulated worker metrics */}
      <div className="bg-[#0f172a] rounded-3xl p-5 text-white border border-slate-850 space-y-4">
        <div className="flex justify-between items-center text-[10px] text-neutral-450">
          <span>QUEUE CONTROLLER STATS</span>
          <span className="text-emerald-400 uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
            BullMQ POOL ONLINE
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
            <span className="text-[8px] text-neutral-500 uppercase block">
              Pending Jobs
            </span>
            <span className="text-lg font-bold tracking-tighter text-[#38bdf8]">
              {stats.pendingJobs}
            </span>
          </div>
          <div className="p-3 bg-white/5 border border-white/10 rounded-2xl">
            <span className="text-[8px] text-neutral-500 uppercase block">
              Completed Workers
            </span>
            <span className="text-lg font-bold tracking-tighter text-emerald-400">
              {stats.globalCompleted.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="text-[9.5px] text-neutral-400 leading-relaxed font-light font-sans">
          Our background thread runners guarantee a retry window of 72 hours for
          unacknowledged endpoints using backoff delays.
        </div>
      </div>
    </div>
  );
}
