import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "API Pricing Plans",
  description: "Explore flexible developer plans for NeuralPress. Choose between our Free sandbox, Business, or Advanced tiers for real-time AI news streams, semantic vector search, and custom webhook deliveries.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
