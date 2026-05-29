"use client";

import React from "react";
import InteractiveBackground from "@/components/custom/landing/InteractiveBackground";
import Hero from "@/components/custom/landing/Hero";
import StatsSection from "@/components/custom/landing/StatsSection";
import SystemPipeline from "@/components/custom/landing/SystemPipeline";
import CapabilitiesSection from "@/components/custom/landing/CapabilitiesSection";
import PricingSection from "@/components/custom/landing/PricingSection";
import TestimonialsSection from "@/components/custom/landing/TestimonialsSection";
import InsightsSection from "@/components/custom/landing/InsightsSection";
import CTASection from "@/components/custom/landing/CTASection";
import Footer from "@/components/custom/landing/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen text-slate-800 overflow-x-hidden font-inter bg-[#fafbfe] pb-16 select-none">
      {/* Light Mesh background grid */}
      <InteractiveBackground />

      {/* Hero section with incorporated Header capsule navbar */}
      <Hero />

      {/* Statistics & Ingestion dashboard grid */}
      <StatsSection />

      {/* Animated system pipeline stepper and console log terminal */}
      <SystemPipeline />

      {/* Visual capability blocks */}
      <CapabilitiesSection />

      {/* Flexible membership plans */}
      {/* <PricingSection /> */}

      {/* Verified user testimonials grid */}
      {/* <TestimonialsSection /> */}

      {/* Latest resource center insights cards */}
      {/* <InsightsSection /> */}

      {/* Sky blue bottom CTA portal */}
      <CTASection />

      {/* Clean system footer */}
      <Footer />
    </div>
  );
}
