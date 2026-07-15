"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/components/custom/news/ThemeToggle";
import {
  ArrowLeft,
  Key,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Loader2,
  Lock,
  EyeOff,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GeminiKeysDashboard() {
  const [keys, setKeys] = useState<string[]>([]);
  const [newKey, setNewKey] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    async function loadKeys() {
      try {
        const res = await fetch("/api/news/settings");
        if (res.ok) {
          const data = await res.json();
          setKeys(data.geminiApiKeys || []);
        }
      } catch (err) {
        console.error("Failed to load Gemini keys:", err);
      } finally {
        setLoading(false);
      }
    }
    loadKeys();
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleAddKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const keyVal = newKey.trim();
    if (!keyVal) return;

    if (!keyVal.startsWith("AIzaSy") && !keyVal.startsWith("AQ.")) {
      showToast("Invalid key format. Gemini API keys typically start with 'AIzaSy' or 'AQ.'.", "error");
      return;
    }

    if (keys.includes(keyVal)) {
      showToast("This API key is already in the list.", "error");
      return;
    }

    const updatedKeys = [...keys, keyVal];
    setSaving(true);
    try {
      const res = await fetch("/api/news/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys: updatedKeys }),
      });

      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys || updatedKeys);
        setNewKey("");
        showToast("Gemini API key added successfully.");
      } else {
        throw new Error("Failed to add Gemini API key");
      }
    } catch (err) {
      showToast("Failed to save new API key.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveKey = async (keyToRemove: string) => {
    const updatedKeys = keys.filter(k => k !== keyToRemove);
    setSaving(true);
    try {
      const res = await fetch("/api/news/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keys: updatedKeys }),
      });

      if (res.ok) {
        const data = await res.json();
        setKeys(data.keys || updatedKeys);
        showToast("Gemini API key removed successfully.");
      } else {
        throw new Error("Failed to remove Gemini API key");
      }
    } catch (err) {
      showToast("Failed to remove API key.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#07090e] text-neutral-800 dark:text-neutral-100 font-inter pb-24 overflow-x-hidden transition-colors duration-300">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-sky-500/5 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-sky-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/news" className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 px-3 py-1.5 rounded-full backdrop-blur-md">
              <ArrowLeft className="w-4 h-4" /> Back to News
            </Link>
            <div className="w-[1px] h-6 bg-neutral-200 dark:bg-white/10" />
            <Link href="/news" className="block">
              <Image src="/main-logo.png" width={40} height={40} className="w-8 h-8 object-contain" alt="NeuralPress" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-500 dark:from-white dark:via-neutral-200 dark:to-neutral-500 bg-clip-text text-transparent">
                Gemini API Keys
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-light">Secure rotation & credentials storage for Gemini translation & processing</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1.5 bg-neutral-100 dark:bg-white/5 border border-neutral-200 dark:border-white/10 p-0.5 rounded-xl backdrop-blur-md">
            <Link
              href="/dashboard"
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              Process Discovery
            </Link>
            <Link
              href="/dashboard/news"
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              News Manager
            </Link>
            <Link
              href="/dashboard/settings"
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            >
              Settings
            </Link>
            <Link
              href="/dashboard/gemini"
              className="px-4 py-1.5 rounded-lg text-xs font-medium transition bg-white dark:bg-white/10 text-neutral-900 dark:text-white shadow-sm border border-neutral-200 dark:border-white/5"
            >
              Gemini Keys
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>

        {/* Feedback Messages */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex items-center gap-3 p-4 rounded-xl border mb-6 shadow-md backdrop-blur-md ${
                feedback.type === "success"
                  ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-800 dark:text-emerald-300"
                  : "bg-rose-500/10 border-rose-500/25 text-rose-800 dark:text-rose-300"
              }`}
            >
              {feedback.type === "success" ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <XCircle className="w-5 h-5 flex-shrink-0" />}
              <span className="text-sm font-medium">{feedback.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            <p className="text-sm text-neutral-500 font-light">Loading key configurations...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left and Middle sections: Keys list & addition */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Add Key Form */}
              <div className="bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <h2 className="text-lg font-bold flex items-center gap-2 mb-2 text-neutral-900 dark:text-white">
                  <Key className="w-5 h-5 text-sky-500" /> Register Gemini API Key
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 font-light">
                  Input a Google Gemini API key to register it into the automatic load-balancer rotation engine.
                </p>

                <form onSubmit={handleAddKey} className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-grow">
                    <input
                      type="password"
                      placeholder="AIzaSy..."
                      value={newKey}
                      onChange={(e) => setNewKey(e.target.value)}
                      disabled={saving}
                      className="w-full bg-white dark:bg-[#07090e] border border-neutral-200 dark:border-white/10 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all font-mono"
                    />
                    <EyeOff className="w-4 h-4 text-neutral-400 absolute right-3.5 top-3.5 pointer-events-none" />
                  </div>
                  <button
                    type="submit"
                    disabled={saving || !newKey.trim()}
                    className="flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50 shadow-lg shadow-sky-500/10 cursor-pointer"
                  >
                    {saving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Plus className="w-4 h-4" /> Add Key
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Active Keys Rotation List */}
              <div className="bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-6 shadow-xl transition-all duration-300">
                <h2 className="text-lg font-bold mb-2 text-neutral-900 dark:text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-500" /> Active Keys in Rotation ({keys.length})
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 font-light">
                  These keys are dynamically distributed and rotated at runtime to bypass API rate limits.
                </p>

                {keys.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-neutral-200 dark:border-white/5 rounded-2xl bg-neutral-50/50 dark:bg-white/5 flex flex-col items-center justify-center gap-3">
                    <AlertCircle className="w-8 h-8 text-neutral-400" />
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 font-light">No Gemini API keys registered in database storage. Falling back to environment variables.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {keys.map((key, idx) => (
                      <motion.div
                        key={key}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex justify-between items-center bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 px-4 py-3 rounded-xl transition-all hover:bg-neutral-50 dark:hover:bg-white/10"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs bg-neutral-100 dark:bg-white/5 text-neutral-500 border border-neutral-200 dark:border-white/10 w-6 h-6 rounded-full flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span className="font-mono text-sm tracking-wider text-neutral-700 dark:text-neutral-200">
                            {key}
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveKey(key)}
                          disabled={saving}
                          className="text-neutral-400 hover:text-rose-500 dark:hover:text-rose-400 p-1.5 rounded-lg hover:bg-rose-500/10 cursor-pointer transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

            </div>

            {/* Right section: Instruction Card */}
            <div className="lg:col-span-1">
              <div className="bg-white/40 dark:bg-neutral-900/40 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-6 shadow-xl relative overflow-hidden transition-all duration-300">
                <h3 className="text-sm font-bold uppercase tracking-wider text-sky-500 mb-4">Security Protocol</h3>
                <ul className="space-y-4 text-xs text-neutral-600 dark:text-neutral-300 font-light">
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-1.5 flex-shrink-0" />
                    <p><strong>Encryption at Rest:</strong> Keys are symmetrically encrypted using AES-256-CBC directly inside MongoDB. If your database is exported or leaked, the keys remain completely safe.</p>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-1.5 flex-shrink-0" />
                    <p><strong>Zero Client Exposure:</strong> The frontend receives only masked versions (e.g., <code>AIzaSy...0Q4E</code>). Fully decrypted keys are only accessible to server-side workers.</p>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 bg-sky-500 rounded-full mt-1.5 flex-shrink-0" />
                    <p><strong>Load Balancing:</strong> Requests to scrape, extract, verify, and translate are distributed round-robin. If one key hits a rate limit (429), it rotates to the next key automatically.</p>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
