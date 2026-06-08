"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginAction } from "@/app/actions/auth";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.email || !formData.password) {
      setError("Please fill out all fields.");
      setLoading(false);
      return;
    }

    try {
      const result = await loginAction(formData);

      if (result.success) {
        const from = searchParams.get("from");
        if (from) {
          router.push(from);
        } else {
          const plan = searchParams.get("plan");
          const billing = searchParams.get("billing") || "monthly";
          if (plan) {
            router.push(`/checkout?plan=${plan}&billing=${billing}`);
          } else {
            router.push("/developer");
          }
        }
      } else {
        setError(
          result.error ||
            "Invalid credentials. Please verify your email and password.",
        );
      }
    } catch {
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8fafc] p-6 md:p-10 relative overflow-hidden font-inter selection:bg-blue-100 selection:text-blue-900">
      {/* Immersive mesh grid and spots */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808006_1px,transparent_1px),linear-gradient(to_bottom,#80808006_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-50/50 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-blue-100/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-0 w-[450px] h-[450px] bg-indigo-100/15 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02),0_30px_60px_rgba(0,0,0,0.03)] p-8 rounded-[2rem] w-full text-center relative overflow-hidden group transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03),0_30px_60px_rgba(0,0,0,0.05)] hover:border-slate-200">
          {/* Soft ambient glows */}
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-indigo-100/50 rounded-full blur-2xl group-hover:scale-150 transition duration-700 pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-blue-100/50 rounded-full blur-2xl group-hover:scale-150 transition duration-700 pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Logo and title */}
            <div className="flex flex-col items-center gap-2">
              <Link href="/" className="flex items-center gap-2 mb-8">
                <Image
                  src="/main-logo.png"
                  width={36}
                  height={36}
                  className="w-9 h-9 object-contain"
                  alt="NeuralPress"
                />
                <span className="text-xl tracking-tight text-slate-900">
                  Neural<span className="text-[#2b86ff]">Press</span>
                </span>
              </Link>
              <h1 className="text-xl tracking-tight text-slate-900 flex items-center gap-1.5 justify-center">
                Developer Sign In
              </h1>
              <p className="text-xs text-slate-500 font-light max-w-xs mx-auto">
                Sign in to manage API keys, configure webhooks, and query
                discovery feeds.
              </p>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 rounded-xl p-3.5 text-xs text-rose-600 font-semibold text-left flex items-start gap-2.5 animate-shake">
                <span className="text-base leading-none">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Inputs */}
            <div className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="email"
                  className="text-[10px] uppercase tracking-wider text-slate-400 block ml-0.5"
                >
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-[#2b86ff]" />
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-slate-50/50 border-slate-200/80 focus:border-[#2b86ff]/80 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-xl pl-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none w-full h-11 transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5 text-left">
                <div className="flex justify-between items-center mb-0.5 px-0.5">
                  <label
                    htmlFor="password"
                    className="text-[10px] uppercase tracking-wider text-slate-400 block"
                  >
                    Password
                  </label>
                  <Link
                    href="#"
                    className="text-[10px] text-slate-400 hover:text-[#2b86ff] transition"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-[#2b86ff]" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-slate-50/50 border-slate-200/80 focus:border-[#2b86ff]/80 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-xl pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none w-full h-11 transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit */}
            <Button type="submit" disabled={loading} className="w-full ">
              {loading ? (
                <span className="flex items-center gap-1.5 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying
                  Credentials...
                </span>
              ) : (
                "Authorize Account"
              )}
            </Button>

            {/* Signup option */}
            <div className="text-center text-xs text-slate-500 mt-4 font-light">
              Don&apos;t have a developer account?{" "}
              <Link
                href={`/signup${searchParams.toString() ? `?${searchParams.toString()}` : ""}`}
                className="text-[#2b86ff] hover:text-[#1e76ed] hover:underline font-bold font-sans transition"
              >
                Sign Up
              </Link>
            </div>
          </form>

          <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto mt-6 flex items-center justify-center gap-1.5 border-t border-slate-100 pt-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure
            production connection encrypted via TLS.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center text-sm text-slate-500 font-semibold font-inter">
          Loading Developer Portal...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
