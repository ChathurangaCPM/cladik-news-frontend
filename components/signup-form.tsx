"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signupAction } from "@/app/actions/auth";
import { Key, Mail, User, Phone, Lock, Eye, EyeOff, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    contactNumber: "",
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

    // Validate inputs
    if (!formData.firstName || !formData.email || !formData.password) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    try {
      const result = await signupAction(formData);

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
            router.push("/developer/dashboard");
          }
        }
      } else {
        setError(result.error || "Failed to create account. Please check your inputs.");
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="bg-white/80 backdrop-blur-3xl border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.02),0_30px_60px_rgba(0,0,0,0.03)] p-8 rounded-[2rem] w-full text-center relative overflow-hidden group transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.03),0_30px_60px_rgba(0,0,0,0.05)] hover:border-slate-200">
        
        {/* Soft ambient glows */}
        <div className="absolute -top-12 -left-12 w-24 h-24 bg-indigo-100/50 rounded-full blur-2xl group-hover:scale-150 transition duration-700 pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-blue-100/50 rounded-full blur-2xl group-hover:scale-150 transition duration-700 pointer-events-none" />

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Header branding info */}
          <div className="flex flex-col items-center gap-2">
            <Link href="/" className="flex items-center gap-2 mb-2">
              <Image src="/main-logo.png" width={36} height={36} className="w-9 h-9 object-contain" alt="NeuralPress" />
              <span className="text-xl tracking-tight text-slate-900 font-bold">
                Neural<span className="text-[#2b86ff]">Press</span>
              </span>
            </Link>
            <h1 className="text-xl tracking-tight text-slate-900 flex items-center gap-1.5 justify-center">
              Developer Account
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            </h1>
            <p className="text-xs text-slate-500 font-light max-w-xs mx-auto">
              Get immediate access to conceptual news streams, Sinhala translation matrices, and webhooks.
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-3.5 text-xs text-rose-600 font-semibold text-left flex items-start gap-2.5 animate-shake">
              <span className="text-base leading-none">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields grid layout */}
          <div className="space-y-4">
            
            {/* First & Last Name double column */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left">
                <label htmlFor="firstName" className="text-[10px] uppercase tracking-wider text-slate-400 block ml-0.5">First Name *</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-[#2b86ff]" />
                  <Input
                    id="firstName"
                    type="text"
                    required
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="bg-slate-50/50 border-slate-200/80 focus:border-[#2b86ff]/80 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-xl pl-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none w-full h-11 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label htmlFor="lastName" className="text-[10px] uppercase tracking-wider text-slate-400 block ml-0.5">Last Name</label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-[#2b86ff]" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="bg-slate-50/50 border-slate-200/80 focus:border-[#2b86ff]/80 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-xl pl-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none w-full h-11 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="email" className="text-[10px] uppercase tracking-wider text-slate-400 block ml-0.5">Email Address *</label>
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

            {/* Contact Number Field */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="contactNumber" className="text-[10px] uppercase tracking-wider text-slate-400 block ml-0.5">Contact Phone</label>
              <div className="relative group">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-[#2b86ff]" />
                <Input
                  id="contactNumber"
                  type="tel"
                  placeholder="+94 77 123 4567"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="bg-slate-50/50 border-slate-200/80 focus:border-[#2b86ff]/80 focus:bg-white focus:ring-4 focus:ring-blue-500/10 rounded-xl pl-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none w-full h-11 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="password" className="text-[10px] uppercase tracking-wider text-slate-400 block ml-0.5">Password * (Min 8 chars)</label>
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

          {/* Submit Action */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2b86ff] hover:bg-[#1e76ed] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider rounded-xl h-11 shadow-lg shadow-blue-500/15 hover:shadow-blue-500/20 active:scale-[0.99] transition duration-200"
          >
            {loading ? (
              <span className="flex items-center gap-1.5 justify-center">
                <Loader2 className="w-4 h-4 animate-spin" /> Provisioning Node...
              </span>
            ) : (
              "Initialize Developer Suite"
            )}
          </Button>

          {/* Switch to login option */}
          <div className="text-center text-xs text-slate-500 mt-4 font-light">
            Already have an account?{" "}
            <Link 
              href={`/login${searchParams.toString() ? `?${searchParams.toString()}` : ""}`} 
              className="text-[#2b86ff] hover:text-[#1e76ed] hover:underline font-bold font-sans transition"
            >
              Sign In
            </Link>
          </div>

        </form>

        <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto mt-6 flex items-center justify-center gap-1.5 border-t border-slate-100 pt-4">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Secure production connection encrypted via TLS.
        </p>

      </div>
    </div>
  );
}
