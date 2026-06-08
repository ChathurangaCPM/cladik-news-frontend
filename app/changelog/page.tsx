import { Metadata } from "next";
import ChangelogClient from "./ChangelogClient";

export const metadata: Metadata = {
  title: "Changelog & API Releases - AI News API | NeuralPress",
  description: "Track system updates, API schema versions, web crawler optimizations, and developer feature rollouts for our AI News API.",
  openGraph: {
    title: "AI News API Changelog & Releases | NeuralPress",
    description: "Follow the latest updates for NeuralPress's semantic news crawler, database relations, and API endpoint optimizations.",
  },
};

export default function ChangelogPage() {
  return <ChangelogClient />;
}
