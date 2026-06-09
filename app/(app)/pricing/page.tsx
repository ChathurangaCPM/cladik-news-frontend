import { Metadata } from "next";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Developer Pricing Plans - AI News API | NeuralPress",
  description: "Compare pricing plans for our AI News API. Find developer-friendly plans with vector search endpoints, structured JSON payloads, high rate limits, and real-time news streaming.",
  openGraph: {
    title: "AI News API for Developers - Pricing Plans | NeuralPress",
    description: "Compare developer subscription tiers for the NeuralPress AI News API. Get access to vector search endpoints, semantic summaries, and webhook alerting.",
  },
};

export default function PricingPage() {
  return <PricingClient />;
}
