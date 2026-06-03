"use client";

import React from "react";
import { Terminal, Minus, Plus, Play, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ApiKey {
  id: string;
  name: string;
  key: string;
}

interface RequestConfigurationProps {
  selectedPlaygroundKey: string;
  setSelectedPlaygroundKey: (key: string) => void;
  apiKeys: ApiKey[];
  endpoint: string;
  setEndpoint: (endpoint: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  limit: number;
  setLimit: (limit: number | ((prev: number) => number)) => void;
  activePlan: string;
  loading: boolean;
  handleRunPlayground: () => void;
}

export default function RequestConfiguration({
  selectedPlaygroundKey,
  setSelectedPlaygroundKey,
  apiKeys,
  endpoint,
  setEndpoint,
  searchQuery,
  setSearchQuery,
  limit,
  setLimit,
  activePlan,
  loading,
  handleRunPlayground,
}: RequestConfigurationProps) {
  return (
    <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 space-y-6 text-left">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
        <Terminal className="w-4.5 h-4.5 text-indigo-650 animate-pulse" />
        <h3 className="text-slate-850 text-sm tracking-tight">
          Request Configuration
        </h3>
      </div>

      <div className="space-y-5">
        {/* 1. API Key Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase text-slate-400 block ">
            Select Authorization Key
          </label>
          <Select
            value={selectedPlaygroundKey}
            onValueChange={(value) => setSelectedPlaygroundKey(value)}
          >
            <SelectTrigger className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-650 transition cursor-pointer">
              <SelectValue placeholder={selectedPlaygroundKey} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {apiKeys.map((key) => (
                  <SelectItem key={key.id} value={key.id}>
                    {key.name} ({key.key})
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <span className="text-[9px] text-slate-400 font-light block">
            Key tier matches sandbox rate-limits & payload constraints
          </span>
        </div>

        {/* 2. Endpoint Selector */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase text-slate-400 block">
            API Request Endpoint
          </label>
          <div className="flex gap-2 w-full">
            <span className="bg-sky-50 text-sky-700 border border-sky-100 px-3 py-2.5 rounded-xl text-xs shrink-0 flex items-center ">
              GET
            </span>
            <Select
              value={endpoint}
              onValueChange={(value) => setEndpoint(value)}
            >
              <SelectTrigger className="bg-white flex-1 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-650 transition cursor-pointer">
                <SelectValue placeholder="/api/v1/access/news" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="/api/v1/access/news">
                    /api/v1/access/news (Dynamic Ingestion Feed)
                  </SelectItem>
                  <SelectItem value="/api/v1/access/news/search">
                    /api/v1/access/news/search (Semantic Match Engine)
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 3. Dynamic search query parameter */}
        <AnimatePresence mode="wait">
          {endpoint.endsWith("/search") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-1.5"
            >
              <label className="text-[10px] uppercase text-slate-400 block">
                Search Query Parameter (`q`)
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="e.g. inflation, central bank, LPL cricket..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-850 focus:outline-none focus:ring-2 focus:ring-indigo-650 transition font-medium"
              />
              <span className="text-[9px] text-slate-400 block font-light">
                Semantic search computes query vector similarity ranks
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 4. Limit parameter */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[10px] uppercase text-slate-400 block">
              Record Limits (`limit`)
            </label>
            <span className="text-[9px] text-indigo-655">
              {activePlan === "free"
                ? "Free Tier Capped Max 3"
                : `Configured: ${limit}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-[38px] w-[38px] shrink-0 rounded-2xl flex items-center justify-center p-0 cursor-pointer border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95 transition"
              onClick={() => setLimit((prev) => Math.max(1, prev - 1))}
              disabled={limit <= 1}
            >
              <Minus className="w-3.5 h-3.5" />
            </Button>

            <input
              type="number"
              min={1}
              max={activePlan === "free" ? 3 : 10}
              value={limit}
              onChange={(e) =>
                setLimit(
                  Math.max(
                    1,
                    Math.min(
                      activePlan === "free" ? 3 : 10,
                      parseInt(e.target.value, 10) || 1,
                    ),
                  ),
                )
              }
              className="w-full h-[38px] text-center bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-650 transition font-medium"
            />

            <Button
              type="button"
              variant="outline"
              className="h-[38px] w-[38px] shrink-0 rounded-2xl flex items-center justify-center p-0 cursor-pointer border-slate-200 text-slate-600 hover:bg-slate-50 active:scale-95 transition"
              onClick={() =>
                setLimit((prev) =>
                  Math.min(activePlan === "free" ? 3 : 10, prev + 1),
                )
              }
              disabled={limit >= (activePlan === "free" ? 3 : 10)}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </div>

          <span className="text-[9px] text-slate-400 block font-light leading-snug">
            {activePlan === "free"
              ? "Free Plan is hard capped at a maximum of 3 items per transaction. Upgrade plan to expand sandbox size."
              : "Premium subscription allows pulling larger payloads up to 10 nodes."}
          </span>
        </div>

        {/* Submit Trigger Button */}
        <Button
          onClick={handleRunPlayground}
          disabled={loading}
          className="w-full cursor-pointer"
        >
          {loading ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-slate-400 border-t-indigo-600 rounded-full animate-spin" />
              Executing Sandbox Query...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" /> Execute Request
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
