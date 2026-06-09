"use client";

import React, { useState, useEffect } from "react";
import { useDeveloper } from "@/app/(app)/developer/layout";
import { runDeveloperPlaygroundAction } from "@/app/actions/auth";
import { Key, ArrowRight } from "lucide-react";
import Link from "next/link";

// Custom modular playground sub-components
import RequestConfiguration from "@/components/custom/developer/RequestConfiguration";
import ConsoleTerminal from "@/components/custom/developer/ConsoleTerminal";
import StreamVisualizer from "@/components/custom/developer/StreamVisualizer";

export default function DeveloperPlayground() {
  const {
    activePlan,
    apiKeys,
    selectedPlaygroundKey,
    setSelectedPlaygroundKey,
    refreshTelemetry,
    latestRawKey,
  } = useDeveloper();

  // Component states
  const [endpoint, setEndpoint] = useState("/api/v1/access/news");
  const [searchQuery, setSearchQuery] = useState("Colombo");
  const [limit, setLimit] = useState(1);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Vector plot states
  const [selectedVectorNode, setSelectedVectorNode] = useState<any | null>(
    null,
  );
  const [vectorNodes, setVectorNodes] = useState<any[]>([]);

  // Enforce selected key default if empty
  useEffect(() => {
    if (apiKeys.length > 0 && !selectedPlaygroundKey) {
      setSelectedPlaygroundKey(apiKeys[0].id);
    }
  }, [apiKeys, selectedPlaygroundKey, setSelectedPlaygroundKey]);

  // Sync vector nodes based on query payload response
  useEffect(() => {
    if (response?.payload && Array.isArray(response.payload)) {
      const nodes: any[] = [];
      response.payload.forEach((item: any, itemIdx: number) => {
        let concepts: any[] = [];
        try {
          if (item.aiConcepts && Array.isArray(item.aiConcepts)) {
            concepts = item.aiConcepts;
          } else if (
            item.aiEnrichedContent &&
            item.aiEnrichedContent.startsWith("[")
          ) {
            concepts = JSON.parse(item.aiEnrichedContent);
          }
        } catch (_) {}

        const title = item.title || `News #${itemIdx + 1}`;

        if (concepts.length > 0) {
          concepts.forEach((conceptObj: any, cIdx: number) => {
            let x = 50;
            let y = 50;
            const hasRealVectors =
              conceptObj.vectors && Array.isArray(conceptObj.vectors);

            if (hasRealVectors) {
              const vX = conceptObj.vectors[0] || 0;
              const vY = conceptObj.vectors[1] || 0;
              x = Math.round(((vX + 1) / 2) * 80 + 10);
              y = Math.round(((vY + 1) / 2) * 80 + 10);
            } else {
              const hash =
                (title.length * 7 +
                  conceptObj.concept.length * 13 +
                  cIdx * 31) %
                100;
              const angle = (hash * 3.6 * Math.PI) / 180;
              const distance = 15 + (hash % 30);
              x = Math.round(50 + distance * Math.cos(angle));
              y = Math.round(50 + distance * Math.sin(angle));
            }

            nodes.push({
              id: `${itemIdx}-${cIdx}`,
              label: conceptObj.concept,
              relevance: conceptObj.relevance || 0.8,
              articleTitle: title,
              x,
              y,
              real: hasRealVectors,
            });
          });
        } else {
          const hash = (title.length * 17 + itemIdx * 29) % 100;
          const angle = (hash * 3.6 * Math.PI) / 180;
          const distance = 20 + (hash % 20);
          nodes.push({
            id: `art-${itemIdx}`,
            label: title.split(" ").slice(0, 2).join(" ") + "...",
            relevance: 1.0,
            articleTitle: title,
            x: Math.round(50 + distance * Math.cos(angle)),
            y: Math.round(50 + distance * Math.sin(angle)),
            real: false,
          });
        }
      });
      setVectorNodes(nodes);
      if (nodes.length > 0) {
        setSelectedVectorNode(nodes[0]);
      } else {
        setSelectedVectorNode(null);
      }
    } else {
      setVectorNodes([
        {
          id: "mock1",
          label: "Artificial Intelligence",
          relevance: 0.95,
          articleTitle: "NeuralPress NLP Core Inception",
          x: 65,
          y: 35,
          real: false,
        },
        {
          id: "mock2",
          label: "Colombo Stock Exchange",
          relevance: 0.88,
          articleTitle: "Sri Lanka Inflationary Control Index",
          x: 28,
          y: 72,
          real: false,
        },
        {
          id: "mock3",
          label: "Monetary Policy",
          relevance: 0.74,
          articleTitle: "Central Bank Sri Lanka Framework",
          x: 42,
          y: 55,
          real: false,
        },
        {
          id: "mock4",
          label: "Cricket Stadiums",
          relevance: 0.82,
          articleTitle: "LPL Premium Vectors Ingestion",
          x: 80,
          y: 62,
          real: false,
        },
      ]);
      setSelectedVectorNode(null);
    }
  }, [response]);

  const handleRunPlayground = async () => {
    if (!selectedPlaygroundKey) {
      setError("Please generate and select an active API Key first.");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await runDeveloperPlaygroundAction(
        selectedPlaygroundKey,
        endpoint,
        searchQuery,
        limit,
      );

      if (res.success && res.data) {
        setResponse(res.data);
        await refreshTelemetry();
      } else {
        setError(res.error || "Execution failed in the sandbox corridor.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to establish sandbox pipeline link.");
    } finally {
      setLoading(false);
    }
  };

  const activeKeyObj = apiKeys.find((k) => k.id === selectedPlaygroundKey);

  return (
    <div className="space-y-8 font-sans p-6 md:p-8 max-w-7xl mx-auto ">
      {/* Title Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <h2 className="text-xl md:text-2xl text-slate-800 tracking-tight">
            API Sandbox Playground
          </h2>
          <p className="text-xs text-slate-500 max-w-2xl leading-relaxed font-light">
            Test and simulate GraphQL-style REST queries directly over our
            dynamic semantic streams. Securely run executions leveraging your
            console cookie session, avoiding raw credentials exposure in client
            JS scripts.
          </p>
        </div>

        <Link
          href="/developer/keys"
          className="flex items-center gap-1.5 text-xs text-indigo-600 hover:text-indigo-750 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-xl transition self-start md:self-auto shrink-0 cursor-pointer"
        >
          <Key className="w-4 h-4" /> Manage Credentials
        </Link>
      </div>

      {apiKeys.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center max-w-xl mx-auto space-y-5 shadow-sm">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-550">
            <Key className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base text-slate-800 tracking-tight">
              Generate Credentials to Start
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
              You must have at least one active API credentials pair to interact
              with the News Aggregator endpoints sandbox.
            </p>
          </div>
          <Link
            href="/developer/keys"
            className="inline-flex items-center gap-2 text-xs font-extrabold uppercase bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl shadow-lg shadow-indigo-600/25 transition hover:scale-[1.02] cursor-pointer"
          >
            Create API Key <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        /* Core Playground Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Config Panel */}
          <RequestConfiguration
            selectedPlaygroundKey={selectedPlaygroundKey}
            setSelectedPlaygroundKey={setSelectedPlaygroundKey}
            apiKeys={apiKeys}
            endpoint={endpoint}
            setEndpoint={setEndpoint}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            limit={limit}
            setLimit={setLimit}
            activePlan={activePlan}
            loading={loading}
            handleRunPlayground={handleRunPlayground}
          />

          {/* RIGHT: Console Output Terminal */}
          <div className="lg:col-span-7 space-y-6">
            <ConsoleTerminal
              loading={loading}
              error={error}
              response={response}
              activePlan={activePlan}
              activeKeyObj={activeKeyObj}
              latestRawKey={latestRawKey || undefined}
              endpoint={endpoint}
              searchQuery={searchQuery}
              limit={limit}
            />
            {/* <VectorMapProjection
              vectorNodes={vectorNodes}
              selectedVectorNode={selectedVectorNode}
              setSelectedVectorNode={setSelectedVectorNode}
              activePlan={activePlan}
            /> */}
          </div>

          {/* Ingested News Stream Visualizer */}
          <StreamVisualizer response={response} activePlan={activePlan} />
        </div>
      )}
    </div>
  );
}
