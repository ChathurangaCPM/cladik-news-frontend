"use client";

import React, { useState, useEffect } from "react";
import { useDeveloper } from "@/app/(app)/developer/layout";
import { getDeveloperLogsAction } from "@/app/actions/auth";
import { Activity, Copy, Check } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function DeveloperApiLogs() {
  const { activityLogs } = useDeveloper();

  // Selected log for detailed sheet inspector
  const [selectedInspectLog, setSelectedInspectLog] = useState<any | null>(
    null,
  );

  // Pagination states
  const [logsPage, setLogsPage] = useState(1);
  const [logsLimit, setLogsLimit] = useState(10);
  const [paginatedLogs, setPaginatedLogs] = useState<any[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const fetchPaginatedLogs = async (page: number, limit: number) => {
    setLoadingLogs(true);
    try {
      const res = await getDeveloperLogsAction(page, limit);
      if (res) {
        setPaginatedLogs(res.data || []);
        setTotalLogs(res.total || 0);
        setTotalPages(res.totalPages || 0);
      }
    } catch (e) {
      console.error("Error fetching paginated logs:", e);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchPaginatedLogs(logsPage, logsLimit);
  }, [activityLogs, logsPage, logsLimit]);

  const formatLocalTimestamp = (isoStr: string | undefined | null) => {
    if (!isoStr) return "Never";
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

  return (
    <div className="space-y-6">
      {/* Developer API Activity Logs Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4.5 h-4.5 text-indigo-650 animate-pulse" />
            <h3 className="text-slate-800 tracking-tight text-sm  font-sans">
              API Request Activity Logs
            </h3>
          </div>
          <span className="text-[9px] uppercase text-indigo-655 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 font-sans">
            Telemetry Feed
          </span>
        </div>

        {loadingLogs ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="p-4 border border-slate-100 rounded-xl flex items-center justify-between bg-slate-50/30"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-16 bg-slate-100 rounded-lg" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-4 w-44 bg-slate-150 rounded-md" />
                    <Skeleton className="h-3 w-32 bg-slate-100 rounded-md" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-3.5 w-12 bg-slate-100 rounded-full" />
                  <Skeleton className="h-3.5 w-8 bg-slate-100 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : paginatedLogs.length === 0 ? (
          <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center text-slate-450 text-xs space-y-2 bg-slate-50">
            <Activity className="w-8 h-8 mx-auto text-slate-350 animate-pulse" />
            <p className=" text-slate-700">No API Transactions Found</p>
            <p className="text-[10px] max-w-xs mx-auto text-slate-450 leading-relaxed font-sans font-light">
              Make outbound requests from your developer sandbox integration
              using your secure credentials to record telemetry log traces here.
            </p>
          </div>
        ) : (
          <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-[9px] uppercase tracking-wider font-extrabold font-sans">
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Key Name</th>
                    <th className="p-4">Method</th>
                    <th className="p-4">Endpoint</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-center">Latency</th>
                    <th className="p-4 text-center">IP Address</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-600 font-sans">
                  {paginatedLogs.map((log) => {
                    const isSuccess =
                      log.statusCode >= 200 && log.statusCode < 300;
                    const isRateLimit = log.statusCode === 429;
                    const statusColor = isSuccess
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : isRateLimit
                        ? "bg-amber-50 text-amber-700 border-amber-100"
                        : "bg-rose-50 text-rose-700 border-rose-100";

                    return (
                      <tr
                        key={log.id}
                        onClick={() => setSelectedInspectLog(log)}
                        className="cursor-pointer hover:bg-slate-50/50 transition"
                      >
                        <td className="p-4 text-[10.5px] font-medium text-slate-500 whitespace-nowrap">
                          {formatLocalTimestamp(log.createdAt)}
                        </td>
                        <td className="p-4 font-bold text-slate-800 whitespace-nowrap">
                          {log.keyName}
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.method === "GET"
                                ? "bg-sky-50 text-sky-750 border border-sky-100"
                                : "bg-purple-50 text-purple-750 border border-purple-100"
                            }`}
                          >
                            {log.method}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[10.5px] text-slate-500 truncate max-w-[180px]">
                          {log.endpoint}
                        </td>
                        <td className="p-4 text-center whitespace-nowrap">
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${statusColor}`}
                          >
                            {log.statusCode}
                          </span>
                        </td>
                        <td className="p-4 text-center font-bold text-slate-700 whitespace-nowrap">
                          {log.responseTime}ms
                        </td>
                        <td className="p-4 text-center text-slate-500 whitespace-nowrap">
                          {log.ipAddress}
                        </td>
                        <td className="p-4 text-right whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedInspectLog(log);
                            }}
                            className="text-[10px] font-bold text-indigo-650 hover:text-indigo-850 focus:outline-none cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        {!loadingLogs && totalPages > 1 && (
          <Pagination className="pt-2">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setLogsPage((p) => Math.max(1, p - 1))}
                  className={
                    logsPage === 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1;
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      isActive={logsPage === pageNum}
                      onClick={() => setLogsPage(pageNum)}
                      className="cursor-pointer"
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setLogsPage((p) => Math.min(totalPages, p + 1))
                  }
                  className={
                    logsPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      {/* Telemetry Inspect Sheet */}
      <Sheet
        open={!!selectedInspectLog}
        onOpenChange={(open) => {
          if (!open) setSelectedInspectLog(null);
        }}
      >
        <SheetContent className="sm:max-w-md md:max-w-lg lg:max-w-xl bg-white border-l border-slate-200 overflow-y-auto flex flex-col h-full font-sans">
          <SheetHeader className="pb-4 border-b border-slate-100">
            <div className="flex justify-between items-center pr-8">
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-normal">
                API Request Details
              </span>
              <span className="text-[10px] font-bold text-slate-450 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                ID: {selectedInspectLog?.id.substring(0, 8)}
              </span>
            </div>
            <SheetTitle className="text-lg font-sans text-slate-800 tracking-tight flex items-center gap-2 mt-1 font-bold">
              <span
                className={`px-2 py-0.5 rounded text-xs font-bold ${
                  selectedInspectLog?.method === "GET"
                    ? "bg-sky-50 text-sky-750 border border-sky-100"
                    : "bg-purple-50 text-purple-750 border border-purple-100"
                }`}
              >
                {selectedInspectLog?.method}
              </span>
              <span className="truncate max-w-[260px]">
                {selectedInspectLog?.endpoint.split("?")[0]}
              </span>
            </SheetTitle>
            <SheetDescription className="text-xs text-slate-450 mt-1 leading-relaxed">
              Executed on {formatLocalTimestamp(selectedInspectLog?.createdAt)}{" "}
              via credential **
              {selectedInspectLog?.keyName}**.
            </SheetDescription>
          </SheetHeader>

          {/* Inspector body */}
          <div className="flex-1 py-6 space-y-6 px-5">
            {/* Diagnostic badges grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center space-y-0.5">
                <span className="text-[8px] text-slate-400 font-bold uppercase block">
                  STATUS
                </span>
                <span
                  className={`text-xs font-black px-2 py-0.5 rounded-full inline-block ${
                    selectedInspectLog?.statusCode >= 200 &&
                    selectedInspectLog?.statusCode < 300
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-150"
                      : selectedInspectLog?.statusCode === 429
                        ? "bg-amber-50 text-amber-700 border border-amber-150"
                        : "bg-rose-50 text-rose-700 border border-rose-150"
                  }`}
                >
                  {selectedInspectLog?.statusCode}
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center space-y-0.5">
                <span className="text-[8px] text-slate-400 font-bold uppercase block">
                  LATENCY
                </span>
                <span className="text-xs font-black text-slate-700">
                  {selectedInspectLog?.responseTime}ms
                </span>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center space-y-0.5">
                <span className="text-[8px] text-slate-400 font-bold uppercase block">
                  CLIENT IP
                </span>
                <span className="text-xs font-black text-slate-700 truncate block max-w-full px-1">
                  {selectedInspectLog?.ipAddress}
                </span>
              </div>
            </div>

            {/* Header details list */}
            <div className="space-y-2">
              <h4 className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                Telemetry Details
              </h4>
              <div className="bg-slate-50 border border-slate-150 rounded-xl divide-y divide-slate-150 text-xs">
                <div className="flex justify-between p-3">
                  <span className="text-slate-450">Timestamp (Local)</span>
                  <span className=" text-slate-750">
                    {formatLocalTimestamp(selectedInspectLog?.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-slate-450">Request Path</span>
                  <code className="text-slate-800 text-[10px] max-w-[240px] truncate">
                    {selectedInspectLog?.endpoint}
                  </code>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-slate-450">Credential Used</span>
                  <span className=" text-slate-750">
                    {selectedInspectLog?.keyName}
                  </span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-slate-450">Browser User-Agent</span>
                  <span className=" text-slate-750 truncate max-w-[200px]">
                    {selectedInspectLog?.userAgent || "Standard Browser"}
                  </span>
                </div>
                <div className="flex justify-between p-3">
                  <span className="text-slate-450">Response Type</span>
                  <span className=" text-slate-750">application/json</span>
                </div>
              </div>
            </div>

            {/* Response payload editor viewer */}
            <div className="space-y-2 flex-1 flex flex-col">
              <div className="flex justify-between items-center">
                <h4 className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  Response Payload JSON
                </h4>
                <button
                  onClick={() => {
                    if (selectedInspectLog?.responseBody) {
                      navigator.clipboard.writeText(
                        selectedInspectLog.responseBody,
                      );
                      alert("Response JSON copied to clipboard!");
                    }
                  }}
                  className="text-[10px] text-indigo-655 hover:text-indigo-700 cursor-pointer flex items-center gap-1 focus:outline-none"
                >
                  <Copy className="w-3 h-3" /> Copy Raw JSON
                </button>
              </div>

              <ScrollArea className="bg-[#0f172a] rounded-xl border border-slate-800 p-4 text-[10px] text-lime-400 max-h-[300px] overflow-y-auto pr-2">
                {selectedInspectLog?.responseBody ? (
                  <pre className="whitespace-pre-wrap select-all font-mono">
                    {(() => {
                      try {
                        const parsed = JSON.parse(
                          selectedInspectLog.responseBody,
                        );
                        return JSON.stringify(parsed, null, 2);
                      } catch (_) {
                        return selectedInspectLog.responseBody;
                      }
                    })()}
                  </pre>
                ) : (
                  <div className="text-slate-500 italic py-8 text-center text-xs font-sans">
                    No response body recorded.
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
