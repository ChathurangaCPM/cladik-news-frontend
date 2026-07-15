"use client";

import React, { useState } from "react";
import { Copy, Check, Lock } from "lucide-react";
import Link from "next/link";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ApiKey {
  id: string;
  name: string;
  key: string;
}

interface ConsoleTerminalProps {
  loading: boolean;
  error: string | null;
  response: {
    status?: string;
    statusCode?: number;
    headers?: Record<string, string>;
    payload?: any;
  } | null;
  activePlan: string;
  activeKeyObj?: ApiKey;
  latestRawKey?: string;
  endpoint: string;
  searchQuery: string;
  limit: number;
}

export default function ConsoleTerminal({
  loading,
  error,
  response,
  activePlan,
  activeKeyObj,
  latestRawKey,
  endpoint,
  searchQuery,
  limit,
}: ConsoleTerminalProps) {
  const baseApiUrl =
    process.env.NEXT_PUBLIC_NEWS_AGGREGATOR_URL || "http://localhost:5005/api";
  let hostDisplay = "http://localhost:5005";
  try {
    const parsed = new URL(baseApiUrl);
    hostDisplay = `${parsed.protocol}//${parsed.host}`;
  } catch (_) {}
  const [activeTerminalTab, setActiveTerminalTab] = useState<
    "payload" | "headers" | "curl"
  >("payload");
  const [activeCodeLang, setActiveCodeLang] = useState<
    "curl" | "javascript" | "python" | "go" | "java"
  >("curl");
  const [copied, setCopied] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);

  // Calculate dynamic Daily Cap Display based on active database telemetry remaining allowance
  const limitStr =
    response?.headers?.["x-rate-limit-limit"] ||
    response?.headers?.["X-Rate-Limit-Limit"];
  const remainingStr =
    response?.headers?.["x-rate-limit-remaining"] ||
    response?.headers?.["X-Rate-Limit-Remaining"];
  let capDisplay =
    limitStr ||
    (activePlan === "free"
      ? "100"
      : activePlan === "business"
        ? "3300"
        : "Unlimited");

  if (limitStr && remainingStr) {
    const limitVal = parseInt(limitStr, 10);
    const remainingVal = parseInt(remainingStr, 10);
    if (!isNaN(limitVal) && !isNaN(remainingVal)) {
      const used = Math.max(0, limitVal - remainingVal);
      capDisplay = `${used} / ${limitVal}`;
    }
  }

  const copyToClipboard = (text: string, isPayload: boolean = false) => {
    navigator.clipboard.writeText(text);
    if (isPayload) {
      setCopiedPayload(true);
      setTimeout(() => setCopiedPayload(false), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const highlightCode = (code: string, lang: string) => {
    if (!code) return "";
    try {
      const hlLang =
        lang === "javascript"
          ? "javascript"
          : lang === "python"
            ? "python"
            : lang === "go"
              ? "go"
              : lang === "java"
                ? "java"
                : lang === "curl"
                  ? "bash"
                  : lang === "json"
                    ? "json"
                    : "plaintext";
      return hljs.highlight(code, { language: hlLang }).value;
    } catch (_) {
      return code
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
  };

  const getCodeSnippet = (lang: string) => {
    const rawKeyVal =
      latestRawKey || activeKeyObj?.key || "np_free_your_raw_api_key_here";
    const cleanBaseApiUrl = baseApiUrl.endsWith("/")
      ? baseApiUrl.slice(0, -1)
      : baseApiUrl;
    const relativePath = endpoint.startsWith("/api")
      ? endpoint.slice(4)
      : endpoint;
    const queryParams = endpoint.endsWith("/search")
      ? `?q=${encodeURIComponent(searchQuery)}&limit=${limit}`
      : endpoint.endsWith("/trending")
        ? ""
        : `?limit=${limit}`;
    const fullRealUrl = `${cleanBaseApiUrl}${relativePath}${queryParams}`;

    switch (lang) {
      case "javascript":
        return `fetch("${fullRealUrl}", {
  method: "GET",
  headers: {
    "x-api-key": "${rawKeyVal}",
    "Accept": "application/json"
  }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));`;
      case "python":
        return `import requests

url = "${fullRealUrl}"
headers = {
    "x-api-key": "${rawKeyVal}",
    "Accept": "application/json"
}

response = requests.get(url, headers=headers)
if response.status_code == 200:
    print(response.json())
else:
    print(f"Error {response.status_code}: {response.text}")`;
      case "go":
        return `package main

import (
	"fmt"
	"io"
	"net/http"
)

func main() {
	url := "${fullRealUrl}"
	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Add("x-api-key", "${rawKeyVal}")
	req.Header.Add("Accept", "application/json")

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	defer res.Body.Close()
	body, _ := io.ReadAll(res.Body)

	fmt.Println(string(body))
}`;
      case "java":
        return `import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
            .url("${fullRealUrl}")
            .get()
            .addHeader("x-api-key", "${rawKeyVal}")
            .addHeader("Accept", "application/json")
            .build();

        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful()) {
                System.out.println(response.body().string());
            } else {
                System.err.println("Error: " + response.code());
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}`;
      case "curl":
      default:
        return `curl -X GET "${fullRealUrl}" \\
  -H "x-api-key: ${rawKeyVal}" \\
  -H "Accept: application/json"`;
    }
  };

  return (
    <div className="terminal-dark-view bg-[#0d1117] rounded-3xl border border-[#30363d] shadow-2xl text-[#c9d1d9] overflow-hidden flex flex-col relative min-h-[480px] transition-all hover:shadow-xl text-left ">
      {/* Terminal Window Chrome Title Bar */}
      <div className="flex justify-between items-center bg-[#161b22] px-5 py-3.5 border-b border-[#30363d] shrink-0 font-sans">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 bg-rose-500 rounded-full shadow-sm" />
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full shadow-sm" />
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-sm" />
          </div>
          <span className="text-[10.5px]  text-[#8b949e]  ml-2">
            sandbox-console-terminal
          </span>
        </div>

        <div className="flex items-center gap-2">
          {response && activeTerminalTab === "payload" && (
            <button
              onClick={() =>
                copyToClipboard(JSON.stringify(response.payload, null, 2), true)
              }
              className="text-[9.5px]   text-[#c9d1d9] hover:text-white bg-[#21262d] hover:bg-[#30363d] px-3 py-1.5 rounded-lg border border-[#30363d] shadow-sm transition flex items-center gap-1.5 focus:outline-none cursor-pointer"
            >
              {copiedPayload ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> COPIED
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> COPY JSON
                </>
              )}
            </button>
          )}

          {activeTerminalTab === "curl" && (
            <button
              onClick={() => {
                copyToClipboard(getCodeSnippet(activeCodeLang), false);
              }}
              className="text-[9.5px]   text-[#c9d1d9] hover:text-white bg-[#21262d] hover:bg-[#30363d] px-3 py-1.5 rounded-lg border border-[#30363d] shadow-sm transition flex items-center gap-1.5 focus:outline-none cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" /> COPIED CODE
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> COPY CODE
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* REQUEST URL & METHOD BAR - High Visibility */}
      <div className="bg-[#0d1117] px-5 py-3 border-b border-[#30363d] flex items-center gap-3 text-[11px] ">
        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[9px] uppercase tracking-wider shrink-0 ">
          POST
        </span>
        <span className="text-[#c9d1d9] truncate max-w-full">
          {typeof window !== "undefined"
            ? `${window.location.origin}/developer/playground/run`
            : "https://neuralpress.io/developer/playground/run"}
        </span>
      </div>

      {/* INTERACTIVE NAVIGATION TABS */}
      {response && (
        <div className="bg-[#161b22] px-5 border-b border-[#30363d] flex gap-2 shrink-0 font-sans">
          {(["payload", "headers", "curl"] as const).map((tab) => {
            const label =
              tab === "payload"
                ? "JSON Response"
                : tab === "headers"
                  ? "Response Headers"
                  : "cURL & Request Details";
            const isTabActive = activeTerminalTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTerminalTab(tab)}
                className={`px-4 py-2.5 text-[10px]   tracking-tight border-b-2 transition duration-150 cursor-pointer ${
                  isTabActive
                    ? " bg-[#0d1117]"
                    : "border-transparent text-[#8b949e] hover:text-[#c9d1d9] hover:bg-[#30363d]/30"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}

      {/* TERMINAL CONTENT SCREEN */}
      <div className="flex-1 p-5 overflow-y-auto select-text  text-[10.5px] leading-relaxed flex flex-col justify-between bg-[#0d1117] text-[#c9d1d9]">
        {/* 1. INITIAL READY STATE */}
        {!loading && !error && !response && (
          <div className="flex-1 flex flex-col justify-center py-10 space-y-3">
            <div className="text-slate-400 space-y-1">
              <div className="flex items-center gap-1.5 ">
                <span className="text-emerald-400">
                  guest-dev@neuralpress:~$
                </span>
                <span className="text-white">./execute-news-pipeline.sh</span>
              </div>
              <div className="text-slate-500 pl-4 font-light leading-relaxed ">
                [READY] Secure console pipeline connection verified.
                <br />
                [READY] Sandbox key mapping:{" "}
                <span className="text-indigo-450 font-semibold">
                  "{activeKeyObj?.name || "Active Sandbox Key"}"
                </span>
                .<br />
                [READY] Target resource endpoint:{" "}
                <span className="text-indigo-400 font-semibold">
                  {endpoint}
                </span>
                .<br />
                [ACTION] Complete query configurations on the left panel, and
                click{" "}
                <span className="text-indigo-400 font-extrabold font-sans">
                  "Execute Request"
                </span>{" "}
                to launch.
              </div>
            </div>
            <div className="flex items-center gap-1 text-slate-655 animate-pulse pl-4">
              <span>_</span>
            </div>
          </div>
        )}

        {/* 2. LOADING STATE */}
        {loading && (
          <div className="flex-1 flex flex-col justify-center py-10 space-y-2 text-slate-400">
            <div className="flex items-center gap-1.5 ">
              <span className="text-emerald-400">guest-dev@neuralpress:~$</span>
              <span>./execute-news-pipeline.sh --run</span>
            </div>
            <div className="space-y-1.5 pl-4 font-light text-slate-500 ">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                <span>
                  [CONNECTING] Establishing handshakes to dynamic REST
                  corridors...
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"
                  style={{ animationDelay: "200ms" }}
                />
                <span>
                  [INGESTING] Querying TypeORM database collections & Pinecone
                  matrices...
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-indigo-455 animate-ping"
                  style={{ animationDelay: "400ms" }}
                />
                <span>
                  [PROCESSING] Enforcing billing rate limitations & data
                  masks...
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3. ERROR RESPONSE STATE */}
        {error && (
          <div className="flex-1 flex flex-col justify-center py-6 space-y-3">
            <div className="flex items-center gap-1.5  text-slate-400">
              <span className="text-emerald-400">guest-dev@neuralpress:~$</span>
              <span>./execute-news-pipeline.sh --run</span>
            </div>
            <div className="p-4 bg-rose-950/20 border-l-2 border-rose-500 text-rose-400 rounded-xl space-y-1 pl-4">
              <span className="font-extrabold uppercase text-[9px] tracking-wider block text-rose-500">
                Pipeline Connection Rejected
              </span>
              <p className="font-sans text-[11px] font-light leading-normal">
                {error}
              </p>
            </div>
          </div>
        )}

        {/* 4. ACTIVE SUCCESS LOG PANEL */}
        {!loading && response && (
          <div className="flex-1 flex flex-col space-y-4">
            {/* Diagnostic Summary Header */}
            <div className="flex flex-wrap gap-2 text-[9px] pb-3 border-b border-[#30363d]">
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-extrabold ">
                {response.status || "SUCCESS"}
              </span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20  ">
                LATENCY:{" "}
                {response.headers?.["x-response-time"] ||
                  response.headers?.["X-Response-Time"] ||
                  "42ms"}
              </span>
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase  ">
                TIER:{" "}
                {response.headers?.["x-subscription-tier"] ||
                  response.headers?.["X-Subscription-Tier"] ||
                  activePlan.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase  ">
                RATE LIMIT:{" "}
                {activePlan === "free"
                  ? "5 RPM"
                  : activePlan === "business"
                    ? "300 RPM"
                    : "Unlimited RPM"}
              </span>
              <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase  ">
                DAILY CAP: {capDisplay}
              </span>
              {(response.headers?.["x-rate-limit-remaining"] ||
                response.headers?.["X-Rate-Limit-Remaining"]) && (
                <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase font-bold ">
                  REMAINING CALLS:{" "}
                  {response.headers?.["x-rate-limit-remaining"] ||
                    response.headers?.["X-Rate-Limit-Remaining"]}
                </span>
              )}
            </div>

            {/* Paywalled plan limitations warning pill */}
            {/* {activePlan !== "advanced" && activeTerminalTab === "payload" && (
              <div className="p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-start gap-3 text-[10px] leading-relaxed font-sans">
                <Lock className="w-4 h-4 shrink-0 text-amber-500 mt-0.5 animate-pulse" />
                <div className="space-y-1">
                  <span className=" uppercase text-[10px]  text-amber-400 block">
                    Sandbox Paywall Applied
                  </span>
                  <p className="text-slate-400 leading-snug">
                    {activePlan === "free"
                      ? "Sinhala translations, ogImage overlays, and semantic coordinate matrices have been dynamically masked. Upgrade to Business Plan to read Sinhala streams."
                      : "Multi-dimensional vector trace indices have been paywalled. Upgrade to Advanced Plan to retrieve raw coordinates."}
                  </p>
                </div>
              </div>
            )} */}

            {/* TAB PANEL 1: JSON PAYLOAD VIEW */}
            {activeTerminalTab === "payload" && (
              <div className="flex-1 relative">
                <ScrollArea className="border border-[#30363d] bg-[#161b22] rounded-2xl p-0 h-[380px] pr-12">
                  <pre className="text-[#c9d1d9] whitespace-pre-wrap select-all  text-[10.5px] p-6 leading-relaxed">
                    <code
                      dangerouslySetInnerHTML={{
                        __html: highlightCode(
                          JSON.stringify(response.payload, null, 2),
                          "json",
                        ),
                      }}
                    />
                  </pre>
                </ScrollArea>

                {/* Floating Copy Button */}
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      JSON.stringify(response.payload, null, 2),
                      true,
                    )
                  }
                  className="absolute top-3 right-3 bg-[#21262d] border border-[#30363d] rounded-xl p-2 hover:bg-[#30363d] shadow-sm transition duration-150 cursor-pointer text-[#c9d1d9] hover:text-white focus:outline-none"
                  title="Copy JSON Payload"
                >
                  {copiedPayload ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            )}

            {/* TAB PANEL 2: RESPONSE HEADERS TABLE */}
            {activeTerminalTab === "headers" && (
              <div className="flex-1 space-y-3 font-sans">
                <span className="text-[9px] uppercase  text-slate-500 tracking-wider ">
                  HTTP/1.1 Response Headers
                </span>
                <div className="border border-[#30363d] rounded-2xl overflow-hidden bg-[#161b22]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#161b22] border-b border-[#30363d] text-[#8b949e]  text-[8.5px] uppercase tracking-wider font-extrabold">
                        <th className="p-3">Header Name</th>
                        <th className="p-3">Header Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#30363d] text-[10px] text-slate-350  bg-[#0d1117]">
                      {Object.entries({
                        "Content-Type":
                          response.headers?.["Content-Type"] ||
                          response.headers?.["content-type"] ||
                          "application/json; charset=utf-8",
                        "x-rate-limit-remaining":
                          response.headers?.["x-rate-limit-remaining"] ||
                          response.headers?.["X-Rate-Limit-Remaining"] ||
                          "Capped",
                        "x-rate-limit-limit":
                          response.headers?.["x-rate-limit-limit"] ||
                          response.headers?.["X-Rate-Limit-Limit"] ||
                          (activePlan === "free"
                            ? "100"
                            : activePlan === "business"
                              ? "3300"
                              : "1000000"),
                        "x-subscription-tier":
                          response.headers?.["x-subscription-tier"] ||
                          response.headers?.["X-Subscription-Tier"] ||
                          activePlan.toUpperCase(),
                        "x-response-time":
                          response.headers?.["x-response-time"] ||
                          response.headers?.["X-Response-Time"] ||
                          "42ms",
                        Connection:
                          response.headers?.["Connection"] ||
                          response.headers?.["connection"] ||
                          "keep-alive",
                        "Cache-Control":
                          response.headers?.["Cache-Control"] ||
                          response.headers?.["cache-control"] ||
                          "no-store, must-revalidate",
                        ...Object.fromEntries(
                          Object.entries(response.headers || {}).filter(
                            ([k]) =>
                              ![
                                "Content-Type",
                                "content-type",
                                "x-rate-limit-remaining",
                                "X-Rate-Limit-Remaining",
                                "x-rate-limit-limit",
                                "X-Rate-Limit-Limit",
                                "x-subscription-tier",
                                "X-Subscription-Tier",
                                "x-response-time",
                                "X-Response-Time",
                                "Connection",
                                "connection",
                                "Cache-Control",
                                "cache-control",
                              ].includes(k),
                          ),
                        ),
                      }).map(([key, val]) => {
                        let colorClass = "text-slate-550";
                        const lowerKey = key.toLowerCase();
                        if (lowerKey === "content-type")
                          colorClass = "text-cyan-400";
                        else if (lowerKey === "x-rate-limit-remaining")
                          colorClass = "text-emerald-400 font-medium";
                        else if (lowerKey === "x-rate-limit-limit")
                          colorClass = "text-blue-400 font-medium";
                        else if (lowerKey === "x-subscription-tier")
                          colorClass = "text-purple-400 font-medium";
                        else if (lowerKey === "x-response-time")
                          colorClass = "text-indigo-400 font-medium";
                        else if (lowerKey.startsWith("x-"))
                          colorClass = "text-slate-400";

                        const isMainHeader = [
                          "content-type",
                          "x-rate-limit-remaining",
                          "x-rate-limit-limit",
                          "x-subscription-tier",
                          "x-response-time",
                        ].includes(lowerKey);
                        const labelClass = isMainHeader
                          ? "font-semibold text-slate-400"
                          : "font-semibold text-slate-500";

                        return (
                          <tr
                            key={key}
                            className="hover:bg-[#161b22]/50 transition-colors duration-100"
                          >
                            <td className={`p-3 ${labelClass}`}>{key}</td>
                            <td
                              className={`p-3 ${colorClass} font-mono text-[9.5px]`}
                            >
                              {val}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB PANEL 3: LANGUAGE SAMPLES & REQUEST DETAILS */}
            {activeTerminalTab === "curl" && (
              <div className="flex-1 space-y-4 font-sans">
                {/* Language Selection Row */}
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase  text-slate-550 tracking-wider block">
                    Select Language Code Sample
                  </span>
                  <div className="flex flex-wrap gap-1 bg-[#161b22] p-1 rounded-xl border border-[#30363d]">
                    {(
                      [
                        { id: "curl", name: "cURL" },
                        { id: "javascript", name: "JavaScript" },
                        { id: "python", name: "Python" },
                        { id: "go", name: "Go" },
                        { id: "java", name: "Java" },
                      ] as const
                    ).map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => setActiveCodeLang(lang.id)}
                        className={`px-3 py-1 rounded-lg text-[10px]  transition cursor-pointer ${
                          activeCodeLang === lang.id
                            ? "border border-[#30363d]"
                            : "text-[#8b949e] hover:text-[#c9d1d9] border border-transparent"
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Code example display box */}
                <div className="space-y-1.5 relative group">
                  <div className="flex justify-between items-center text-[9px] uppercase  text-slate-500 tracking-wider">
                    <span>
                      {activeCodeLang.toUpperCase()} GET Request Example
                    </span>
                    <span className="text-emerald-500  ">REAL ENDPOINT</span>
                  </div>

                  <div className="relative">
                    <ScrollArea className="bg-[#161b22] border border-[#30363d] rounded-2xl p-0 text-[#c9d1d9]  text-[9.5px] h-[220px] pr-12">
                      <pre className="select-all whitespace-pre leading-relaxed p-4">
                        <code
                          dangerouslySetInnerHTML={{
                            __html: highlightCode(
                              getCodeSnippet(activeCodeLang),
                              activeCodeLang,
                            ),
                          }}
                        />
                      </pre>
                    </ScrollArea>

                    {/* Floating Copy Button */}
                    <button
                      type="button"
                      onClick={() =>
                        copyToClipboard(getCodeSnippet(activeCodeLang), false)
                      }
                      className="absolute top-3 right-3 bg-[#21262d] border border-[#30363d] rounded-xl p-2 hover:bg-[#30363d] shadow-sm transition duration-150 cursor-pointer text-[#c9d1d9] hover:text-white focus:outline-none"
                      title="Copy Code"
                    >
                      {copied ? (
                        <Check className="w-3.5 h-3.5 text-emerald-455" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  <span className="text-[9px] text-slate-500 block font-light leading-snug">
                    Queries the live news pipeline directly at{" "}
                    <code className="text-indigo-400  ">{hostDisplay}</code>{" "}
                    using your secure token.
                  </span>
                </div>

                {/* Request parameters outline */}
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase  text-[#8b949e] tracking-wider block">
                    GET Query Parameters Description
                  </span>
                  <div className="bg-[#161b22] border border-[#30363d] rounded-2xl divide-y divide-[#30363d] text-[10px] text-slate-350 p-1 ">
                    <div className="flex justify-between p-2.5">
                      <span className="text-slate-450 font-semibold">
                        x-api-key (Header)
                      </span>
                      <code className="text-indigo-400 text-[9px] ">
                        {latestRawKey ||
                          activeKeyObj?.key ||
                          "np_free_your_raw_api_key_here"}
                      </code>
                    </div>
                    <div className="flex justify-between p-2.5">
                      <span className="text-slate-455 font-semibold">
                        Endpoint Route
                      </span>
                      <code className="text-indigo-400 ">
                        {endpoint.replace("/api", "")}
                      </code>
                    </div>
                    {endpoint.endsWith("/search") && (
                      <div className="flex justify-between p-2.5">
                        <span className="text-slate-455 font-semibold">
                          q (Query Parameter)
                        </span>
                        <code className="text-indigo-400 ">
                          "{searchQuery}"
                        </code>
                      </div>
                    )}
                    <div className="flex justify-between p-2.5">
                      <span className="text-slate-455 font-semibold">
                        limit (Query Parameter)
                      </span>
                      <code className="text-indigo-400  ">{limit}</code>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
