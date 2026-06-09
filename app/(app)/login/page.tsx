import { Metadata } from "next";
import LoginClient from "./LoginClient";

export const metadata: Metadata = {
  title: "Developer Dashboard Sign In - AI News API | NeuralPress",
  description: "Log in to the NeuralPress developer portal. Manage your active API keys, track ingestion metrics, test schemas, and configure webhooks.",
};

export default function LoginPage() {
  return <LoginClient />;
}
