"use client";

import React, { useState, useTransition, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { loginAction } from "./actions";
import { cn } from "@/lib/utils";
import { Shield, Key, Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Suspense } from "react";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromPath = searchParams.get("from") || "/dashboard";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    startTransition(async () => {
      try {
        const result = await loginAction(password);
        if (result.success) {
          router.push(fromPath);
          router.refresh();
        } else {
          setError(result.error || "Authentication failed");
        }
      } catch (err) {
        setError("An unexpected error occurred");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-zinc-100 flex flex-col items-center justify-center p-4 relative overflow-hidden font-inter select-none">
      {/* Sleek Deep Stacking Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Main Glassmorphic Login Container */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Navigation Action back */}
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6 cursor-pointer backdrop-blur-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to News Feed
        </Link>

        {/* Form Card */}
        <div className="bg-zinc-950/40 backdrop-blur-3xl border border-white/[0.08] rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative">
          
          {/* Top Decorative bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-sky-500 via-indigo-500 to-emerald-500" />

          {/* Logo & Headline */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 shadow-inner">
              <Shield className="w-7 h-7 text-indigo-400 animate-pulse" strokeWidth={1.5} />
            </div>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-white leading-tight">
              Superuser Login
            </h2>
            <p className="text-xs text-zinc-400 font-light mt-1 max-w-[280px]">
              Access dashboard settings and news moderation pipelines.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Password Input Block */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300 ml-1 block tracking-wider uppercase">
                Secure Key
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-indigo-400 transition-colors">
                  <Key className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  placeholder="Enter superuser password..."
                  className="w-full pl-11 pr-4 rounded-2xl h-[56px] bg-black/40 border border-white/[0.06] outline-none shadow-inner focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all font-geist-mono text-white text-center text-sm"
                  disabled={isPending}
                />
              </div>
            </div>

            {/* Error Message Section */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="flex items-center gap-2 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-light"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Glowing Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className={cn(
                "w-full h-[56px] rounded-2xl font-semibold transition-all duration-300 text-sm text-white flex items-center justify-center gap-2 shadow-lg bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 hover:from-indigo-500 hover:to-indigo-500 active:scale-[0.98] cursor-pointer relative overflow-hidden group",
                isPending && "opacity-80 pointer-events-none"
              )}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Verify Credentials
                </>
              )}
              {/* Glowing hover state overlay */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default function DashboardLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#07090e] text-zinc-100 flex items-center justify-center font-inter">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
