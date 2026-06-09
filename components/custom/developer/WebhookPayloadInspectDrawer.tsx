"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";
import { WebhookDeliveryLog } from "@/app/(app)/developer/webhooks/page";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface WebhookPayloadInspectDrawerProps {
  triggerLogInspect: WebhookDeliveryLog | null;
  setTriggerLogInspect: (log: WebhookDeliveryLog | null) => void;
  formatLocalTimestamp: (isoStr: string | undefined | null) => string;
}

export default function WebhookPayloadInspectDrawer({
  triggerLogInspect,
  setTriggerLogInspect,
  formatLocalTimestamp,
}: WebhookPayloadInspectDrawerProps) {
  return (
    <Sheet
      open={!!triggerLogInspect}
      onOpenChange={(open) => {
        if (!open) {
          setTriggerLogInspect(null);
        }
      }}
    >
      <SheetContent
        side="right"
        className="sm:max-w-lg bg-white h-full flex flex-col p-6 space-y-5 border-l border-slate-200 select-text overflow-y-auto text-slate-800 text-left font-sans"
        showCloseButton={true}
      >
        {triggerLogInspect && (
          <>
            <SheetHeader className="border-b border-slate-100 pb-3 p-0">
              <SheetTitle className="text-[10px] uppercase text-slate-400 font-black tracking-widest font-sans">
                Webhook Payload Logs Inspect
              </SheetTitle>
            </SheetHeader>

            <div className="space-y-4 flex-1">
              <div className="bg-slate-50 border border-slate-150 rounded-xl divide-y divide-slate-150 text-[11px] font-sans">
                <div className="flex justify-between p-3 break-all gap-4">
                  <span className="text-slate-450 font-sans shrink-0 w-24">
                    Target Stream
                  </span>
                  <code className="text-slate-800 font-bold text-right break-all">
                    {triggerLogInspect.url}
                  </code>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-slate-455 font-sans">Event Code</span>
                  <span className="font-extrabold text-slate-800">
                    {triggerLogInspect.event}
                  </span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-slate-455 font-sans">
                    Transaction Time
                  </span>
                  <span className="text-slate-600">
                    {formatLocalTimestamp(triggerLogInspect.timestamp)}
                  </span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-slate-455 font-sans">
                    Status / Latency
                  </span>
                  <span className="font-bold flex gap-2">
                    <span
                      className={
                        triggerLogInspect.statusCode >= 200 &&
                        triggerLogInspect.statusCode < 300
                          ? "text-emerald-600"
                          : "text-rose-600"
                      }
                    >
                      {triggerLogInspect.statusCode}
                    </span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-700">
                      {triggerLogInspect.latency}ms
                    </span>
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 font-sans">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Dispatched Payload JSON
                </h4>
                <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 text-[10px] text-lime-400 max-h-[350px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap select-all font-mono">
                    {triggerLogInspect.payload}
                  </pre>
                </div>
              </div>

              {triggerLogInspect.statusCode !== 200 && (
                <div className="p-3.5 bg-rose-50 border border-rose-100 rounded-xl flex gap-3 text-rose-700 text-xs font-sans">
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-rose-500 animate-bounce" />
                  <div className="space-y-0.5">
                    <span className="font-bold uppercase text-[9.5px] tracking-wide">
                      Automatic Retries Initiated
                    </span>
                    <p className="text-[10px] text-rose-600 leading-relaxed font-light">
                      Delivery returned a failed code. BullMQ scheduler will
                      fire backup retries using exponential delay backoff
                      offsets inside the queue corridor.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
