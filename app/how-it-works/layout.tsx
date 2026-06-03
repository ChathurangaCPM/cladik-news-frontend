import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works",
  description: "Learn about the NeuralPress technical pipeline. See how we ingest news, enrich it with Gemini, generate 384-dimensional semantic embeddings, build citation graphs, and stream raw JSON via SSE and webhooks.",
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
