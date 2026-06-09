import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Providers from "@/providers/providers";
import { UserLangProvider } from "@/providers/langProvider";
import { getDictionary } from "../i18n/get-dictionary";

import "../globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import NextTopLoader from "@kfarwell/nextjs-toploader";
import ThirdPartyAnalytics from "@/components/custom/thirdPartyScripts";
import { Toaster } from "@/components/ui/sonner";

// Resolve the base URL dynamically for localhost, Vercel deployments, or custom production domains
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  ? process.env.NEXT_PUBLIC_BASE_URL
  : process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000";

// Metadata setup
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "AI News API for Developers | NeuralPress",
    template: "%s | NeuralPress",
  },
  description:
    "The ultimate real-time AI News API for developers. Query global news conceptually using semantic vector search with 100 free daily requests, structured JSON payloads, inline citation graphs, and live SSE streams.",
  keywords: [
    "AI News API",
    "News API for Developers",
    "Structured News Data API",
    "Semantic News Search API",
    "Vector Search News API",
    "Real-time News Stream API",
    "JSON News Feed for AI",
    "News Citation Graph",
    "NeuralPress API",
  ],
  openGraph: {
    title: "AI News API for Developers | NeuralPress",
    description:
      "Query global news conceptually using semantic vector search with 100 free daily requests, structured JSON payloads, inline citation graphs, and live SSE streams.",
    type: "website",
    locale: "en_US",
    siteName: "NeuralPress",
    images: [
      {
        url: "/ogImage.webp",
        width: 1200,
        height: 630,
        alt: "NeuralPress",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI News API for Developers | NeuralPress",
    description:
      "Query global news conceptually using semantic vector search with 100 free daily requests, structured JSON payloads, inline citation graphs, and live SSE streams.",
  },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const customFont = localFont({
  src: "../../public/fonts/FMBindumathi-x.ttf",
  variable: "--font-custom",
});

const customSinhalaFont = localFont({
  src: "../../public/fonts/bindu_sinhala_only.ttf",
  variable: "--font-sinhala-custom",
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Load default dictionary (en) on server side for instant hydration
  const initialDictionary = await getDictionary("en");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebAPI",
    name: "NeuralPress AI News API",
    description:
      "The ultimate real-time AI News API for developers. Query global news conceptually using semantic vector search with 100 free daily requests, retrieve structured JSON payloads, inline citation graphs, and live SSE streams for LLMs and AI agents.",
    url: baseUrl,
    documentation: `${baseUrl}/how-it-works`,
    provider: {
      "@type": "Organization",
      name: "NeuralPress",
      url: baseUrl,
      logo: `${baseUrl}/main-logo.png`,
    },
    offers: {
      "@type": "Offer",
      price: "0.00",
      priceCurrency: "USD",
      category: "Developer API",
    },
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", inter.variable)}
    >
      <body
        className={`${inter.variable} ${customSinhalaFont.variable} ${customFont.variable} ${playfair.variable} ${geistMono.variable} subpixel-antialiased`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextTopLoader color="#000" height={3} crawl={true} crawlSpeed={200} />
        <TooltipProvider>
          <Providers>
            <UserLangProvider
              initialLang="si"
              initialDictionary={initialDictionary}
            >
              <div className="leading-snug min-h-screen">{children}</div>
            </UserLangProvider>
            <Toaster />
          </Providers>
        </TooltipProvider>
        <ThirdPartyAnalytics
          GA_MEASUREMENT_ID="G-1QEJRQ99LK"
          GA_TRACKING_ID={"G-1QEJRQ99LK"}
          FB_PIXEL_ID=""
          CLARITY_ID={"wyb9qfv76w"}
        />
      </body>
    </html>
  );
}
