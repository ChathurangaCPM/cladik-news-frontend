"use client";

import React, { useState } from "react";
import { useDeveloper } from "@/app/developer/layout";
import {
  createDeveloperKeyAction,
  revokeDeveloperKeyAction,
  getDeveloperKeysAction,
} from "@/app/actions/auth";
import { Key, Plus, Copy, Check, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import DeveloperApiLogs from "@/components/custom/developer/DeveloperApiLogs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function APIKeysManager() {
  const {
    activePlan,
    apiKeys,
    refreshTelemetry,
    latestRawKey,
    setLatestRawKey,
    showRawKeyModal,
    setShowRawKeyModal,
    selectedPlaygroundKey,
    setSelectedPlaygroundKey,
  } = useDeveloper();

  // Local component UI states
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [revokeTargetKeyId, setRevokeTargetKeyId] = useState<string | null>(
    null,
  );

  const formatLocalKeyDate = (isoStr: string | undefined | null) => {
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

  // Generate new key in Postgres database
  const handleGenerateApiKey = async () => {
    if (!newKeyName) return;

    const currentKeysCount = apiKeys.length;
    if (activePlan === "free" && currentKeysCount >= 1) {
      alert(
        "Plan Limit Reached: You are allowed a maximum of 1 active API Key on the Free Plan. Please upgrade to a premium plan.",
      );
      setShowNewKeyModal(false);
      setNewKeyName("");
      return;
    }

    if (activePlan === "business" && currentKeysCount >= 5) {
      alert(
        "Plan Limit Reached: You are allowed a maximum of 5 active API Keys on the Business Plan. Please upgrade to the Advanced plan.",
      );
      setShowNewKeyModal(false);
      setNewKeyName("");
      return;
    }

    const res = await createDeveloperKeyAction(newKeyName);
    if (res.success && res.data) {
      localStorage.setItem(`raw_key_${res.data.id}`, res.data.key);
      setLatestRawKey(res.data.key);
      setShowRawKeyModal(true);
      await refreshTelemetry();
      setSelectedPlaygroundKey(res.data.id);
    } else {
      alert(res.error || "Failed to generate API Key");
    }
    setNewKeyName("");
    setShowNewKeyModal(false);
  };

  // Revoke key in Postgres database
  const handleRevokeKey = async (keyId: string) => {
    const res = await revokeDeveloperKeyAction(keyId);
    if (res.success) {
      await refreshTelemetry();
      if (selectedPlaygroundKey === keyId) {
        const refreshedKeys = await getDeveloperKeysAction();
        setSelectedPlaygroundKey(refreshedKeys[0]?.id || "");
      }
    } else {
      alert(res.error || "Failed to revoke API key");
    }
  };

  // Copy Key Helper
  const handleCopyKey = (keyString: string, keyId: string) => {
    const fullKey = localStorage.getItem(`raw_key_${keyId}`) || keyString;
    navigator.clipboard.writeText(fullKey);
    setCopiedKeyId(keyId);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const isKeyLimitReached =
    (activePlan === "free" && apiKeys.length >= 1) ||
    (activePlan === "business" && apiKeys.length >= 5);

  return (
    <div className="space-y-8 font-sans p-6 md:p-8 max-w-7xl mx-auto ">
      {/* Title Header Section */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] text-slate-400">
            Security & Authentication
          </span>
        </div>
        <h2 className="text-xl md:text-2xl text-slate-800 tracking-tight font-sans">
          Secure API Credentials
        </h2>
        <p className="text-xs text-slate-500 max-w-2xl leading-relaxed font-light">
          Manage secure credentials to authenticate downstream sandbox requests.
          API keys grant secure pull-access under configured rate limit caps,
          supporting custom ingestion integrations, semantic queries, and
          advanced multidimensional vector map lookups.
        </p>
      </div>

      {/* API KEYS MANAGER LIST */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Key className="w-4.5 h-4.5 text-indigo-550 animate-pulse" />
            <h3 className="text-slate-800 tracking-tight text-sm font-sans">
              Active API Credentials
            </h3>
          </div>
          <Button
            onClick={() => {
              if (isKeyLimitReached) {
                alert(
                  `Plan Limit Reached: You have reached the limit of ${activePlan === "free" ? "1 key" : "5 keys"} allowed on the ${activePlan.toUpperCase()} Plan. Please upgrade your sandbox plan in the Billing tab.`,
                );
                return;
              }
              setShowNewKeyModal(true);
            }}
            disabled={isKeyLimitReached}
            className="text-[10px] font-bold uppercase tracking-wider px-3.5 py-2.5 rounded-xl cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Generate Key{" "}
            {isKeyLimitReached && "(Limit Reached)"}
          </Button>
        </div>

        {apiKeys.length === 0 ? (
          <div className="p-8 border border-dashed border-slate-200 rounded-2xl text-center text-slate-450 text-xs space-y-2 bg-slate-50">
            <Key className="w-8 h-8 mx-auto text-slate-350 animate-pulse" />
            <p className="font-semibold text-slate-700">
              No Active Credentials Found
            </p>
            <p className="text-[10px] max-w-xs mx-auto text-slate-450 leading-relaxed font-sans font-light">
              Generate your first secure API key using the button above to begin
              querying live conceptual news streams in the sandbox environment.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden border border-slate-200 rounded-2xl bg-white">
            <div className="divide-y divide-slate-100 bg-white">
              {apiKeys.map((keyObj) => (
                <div
                  key={keyObj.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/20 transition animate-fade-in"
                >
                  <div className="space-y-1.5 max-w-[80%]">
                    <span className="text-xs font-bold text-slate-800 block font-sans">
                      {keyObj.name}
                    </span>
                    <div className="flex items-center gap-2 text-[10.5px] text-slate-655 bg-slate-50 px-2 py-1 rounded border border-slate-200 max-w-full overflow-x-auto font-mono">
                      <span>{keyObj.key}</span>
                      <Button
                        variant={"ghost"}
                        onClick={() => handleCopyKey(keyObj.key, keyObj.id)}
                        className="text-indigo-650 hover:text-indigo-850 transition shrink-0 ml-1.5 p-1 h-auto cursor-pointer focus:outline-none"
                      >
                        {copiedKeyId === keyObj.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </div>
                    <span className="text-[9.5px] text-slate-400 block font-light font-sans">
                      Created: {formatLocalKeyDate(keyObj.created)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[9.5px] bg-emerald-50 text-emerald-700 border border-emerald-100 px-2.5 py-0.5 rounded-full font-bold font-sans">
                      ACTIVE
                    </span>
                    <button
                      onClick={() => setRevokeTargetKeyId(keyObj.id)}
                      className="text-[10px] font-bold text-rose-600 hover:text-rose-500 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg border border-rose-100 transition cursor-pointer"
                    >
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Developer API Activity Logs Card */}
      <DeveloperApiLogs />

      {/* MODAL FOR NEW KEY GENERATION */}
      <AnimatePresence>
        {showNewKeyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0f172a] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative space-y-4 font-sans text-left"
            >
              <h4 className="text-white text-base">Generate API Sandbox Key</h4>
              <p className="text-xs text-neutral-400 leading-relaxed font-light">
                Give your token a descriptive name so you can track request
                allocations.
              </p>
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-normal text-neutral-500 block">
                  Key Reference Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Test Sandbox Environment"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#2b86ff]"
                />
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setShowNewKeyModal(false)}
                  className="px-3.5 py-2 hover:bg-white/5 rounded-xl text-xs text-neutral-400 transition cursor-pointer"
                >
                  Cancel
                </button>
                <Button
                  onClick={handleGenerateApiKey}
                  disabled={!newKeyName}
                  className="px-6 font-bold cursor-pointer"
                >
                  Generate
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL FOR SECURE RAW KEY COPY-PASTE (ONE TIME) */}
      <AnimatePresence>
        {showRawKeyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[60] flex items-center justify-center p-4 font-sans"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0b0f19] border border-white/[0.08] rounded-[2rem] p-8 max-w-md w-full shadow-2xl relative space-y-6 text-left"
            >
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                  <span className="text-xl">
                    <CheckCheck />
                  </span>
                </div>
                <h4 className="text-white text-lg font-bold">
                  API Key Generated
                </h4>
                <p className="text-xs text-neutral-400 font-light leading-relaxed">
                  Copy this token now. For your security,{" "}
                  <span className="text-amber-400 font-medium">
                    it will not be shown again
                  </span>{" "}
                  once you close this window.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-normal text-neutral-500 block">
                  Raw API Key
                </label>
                <div className="flex items-center gap-2 bg-black/40 border border-white/[0.08] rounded-xl p-3 text-xs text-[#a3e635] overflow-x-auto relative group font-mono">
                  <span className="truncate pr-8 select-all">
                    {latestRawKey}
                  </span>
                  <button
                    onClick={() => {
                      if (latestRawKey) {
                        navigator.clipboard.writeText(latestRawKey);
                        alert("API Key copied to clipboard!");
                      }
                    }}
                    className="absolute right-3 text-[#2b86ff] hover:text-white transition focus:outline-none cursor-pointer"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <Button
                onClick={() => setShowRawKeyModal(false)}
                className="w-full font-bold cursor-pointer"
              >
                I have copied the key
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ALERT DIALOG FOR KEY REVOCATION */}
      <AlertDialog
        open={!!revokeTargetKeyId}
        onOpenChange={(open) => !open && setRevokeTargetKeyId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action is permanent and will break active integrations. Any
              applications using this API Key will no longer be able to query
              NeuralPress services.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (revokeTargetKeyId) {
                  handleRevokeKey(revokeTargetKeyId);
                  setRevokeTargetKeyId(null);
                }
              }}
              className="cursor-pointer"
            >
              Revoke Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
