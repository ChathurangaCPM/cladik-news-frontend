import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import Providers from "@/providers/providers";
import { UserLangProvider } from "@/providers/langProvider";
import { getDictionary } from "./i18n/get-dictionary";

import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import NextTopLoader from "@kfarwell/nextjs-toploader";

// Metadata setup
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  title: {
    default: "News Discovery | NeuralPress",
    template: "%s | NeuralPress",
  },
  description:
    "Search conceptually to instantly find matching events across thousands of published articles.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "NeuralPress",
  },
  twitter: {
    card: "summary_large_image",
  },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const customFont = localFont({
  src: "../public/fonts/FMBindumathi-x.ttf",
  variable: "--font-custom",
});

const customSinhalaFont = localFont({
  src: "../public/fonts/bindu_sinhala_only.ttf",
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

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", inter.variable)}
    >
      <body
        className={`${inter.variable} ${customSinhalaFont.variable} ${customFont.variable} ${playfair.variable} ${geistMono.variable} subpixel-antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <NextTopLoader color="#000" height={3} crawl={true} crawlSpeed={200} />
        <TooltipProvider>
          <Providers>
            <UserLangProvider
              initialLang="en"
              initialDictionary={initialDictionary}
            >
              <div className="leading-snug min-h-screen">{children}</div>
            </UserLangProvider>
          </Providers>
        </TooltipProvider>
      </body>
    </html>
  );
}
