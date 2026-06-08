import { Metadata } from "next";
import HowItWorksClient from "./HowItWorksClient";

export const metadata: Metadata = {
  title: "Architecture & Data Pipeline - AI News API | NeuralPress",
  description: "Learn how our developer AI News API parses, enriches, and indexes global news. See how we use semantic vector embeddings and Gemini summaries for unstructured data retrieval.",
  openGraph: {
    title: "AI News API Architecture & Ingestion Pipeline | NeuralPress",
    description: "Technical overview of our 5-stage AI news pipeline: Real-time ingestion, Gemini AI enrichment, vector search indexing, citation parsing, and webhook streaming.",
  },
};

export default function HowItWorksPage() {
  return <HowItWorksClient />;
}
