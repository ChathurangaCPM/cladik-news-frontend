import { ImageResponse } from "next/og";
import { convertToLegacy } from "@/lib/unicodeToLegacy";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export const alt = "NeuralPress Article";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

import { getNewsAggregatorUrl } from "@/lib/utils";

const NEWS_API_URL = getNewsAggregatorUrl();

// Helper to render mixed English and Sinhala text properly in Satori
function renderMixedText(text: string, isSinhala: boolean) {
  if (!text) return null;
  if (!isSinhala) return <span style={{ fontFamily: "Ubuntu, sans-serif" }}>{text}</span>;
  
  // Convert the entire text to legacy and apply the custom calligraphy Sinhala font.
  // Satori renders spaces perfectly since it's a single contiguous string inside one span!
  return <span style={{ fontFamily: "Emanee, sans-serif" }}>{convertToLegacy(text)}</span>;
}

export default async function Image({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  let fontData: any = null;
  let englishFontData: any = null;
  try {
    const emaneeFontPath = path.join(process.cwd(), "public/fonts/4u-emanee.ttf");
    fontData = fs.readFileSync(emaneeFontPath);
  } catch (e) {
    console.error("Sinhala font loading error:", e);
  }

  try {
    const ubuntuFontPath = path.join(process.cwd(), "public/fonts/Ubuntu-Regular.ttf");
    englishFontData = fs.readFileSync(ubuntuFontPath);
  } catch (e) {
    console.error("English font loading error:", e);
  }

  try {
    const { slug } = await params;
    const search = searchParams ? (await searchParams) : {};
    const customTitle = search && typeof search.title === "string" ? search.title : undefined;
    const customSinhalaTitle = search && typeof search.sinhalaTitle === "string" ? search.sinhalaTitle : undefined;
    const customSummary = search && typeof search.summary === "string" ? search.summary : undefined;

    let article: any = null;
    try {
      const res = await fetch(`${NEWS_API_URL}/news/slug/${slug}`, {
        headers: {
          "x-service-api-key": process.env.SERVICE_API_KEY || "",
        },
      });
      if (res.ok) {
        article = await res.json();
      }
    } catch (err) {
      console.error("Failed to fetch article inside OG Image:", err);
    }

    if (!article) {
      // Elegant, high-fidelity placeholder if article is not found or fetch fails
      article = {
        title: customTitle || "Stay Connected with Real-Time Global Neural Intelligence",
        sinhalaTitle: customSinhalaTitle || "ලෝක ව්‍යාප්ත ගෝලීය ස්නායුක බුද්ධි තොරතුරු සජීවීව",
        summary: customSummary || "NeuralPress aggregates and synthesizes breaking reports, semantic research events, and high-impact hyper-local community narratives from across the world.",
        categories: ["GlobalNews"],
        originalSource: "NeuralPress",
        pubDate: new Date().toISOString(),
      };
    } else {
      if (customTitle) article.title = customTitle;
      if (customSinhalaTitle) article.sinhalaTitle = customSinhalaTitle;
      if (customSummary) article.summary = customSummary;
    }

    // Resolve the active language: si for Sinhala, en/default for English
    const lang = search && typeof search.lang === "string" ? search.lang : "en";
    const isSinhala = lang === "si";

    const title = isSinhala
      ? (article.sinhalaTitle || article.title || "Untitled News")
      : (article.title || article.sinhalaTitle || "Untitled News");

    const siteTitle = isSinhala ? "NeuralPress පුවත්" : "NeuralPress";
    const bgImage = article.dynamicOgImage || article.ogImage || "";

    const rawSummary = isSinhala
      ? (article.sinhalaSummary || article.summary || "")
      : (article.summary || article.sinhalaSummary || "");
      
    const displaySummary = rawSummary.length > 180 ? rawSummary.slice(0, 180) + "..." : rawSummary;

    const dateStr = article.pubDate || article.createdAt
      ? new Date(article.pubDate || article.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "";

    const mainCategory = article.categories && article.categories.length > 0
      ? `#${article.categories[0]}`
      : "#GlobalNews";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#ffffff",
            padding: "0 80px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Main Content Column: Focused Full to the News */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "100%",
            }}
          >
            {/* Header / Brand Badge */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              {/* Connected NP Logo representation in Satori */}
              <div
                style={{
                  background: "linear-gradient(to right, #6366f1, #10b981)",
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "12px",
                  fontWeight: "950",
                  color: "#000000",
                  fontSize: "18px",
                  letterSpacing: "-1px",
                }}
              >
                NP
              </div>
              <span
                style={{
                  color: "#000000",
                  fontSize: "24px",
                  fontWeight: "800",
                  fontFamily: "sans-serif",
                }}
              >
                Neural<span style={{ color: "#4f46e5" }}>Press</span>
              </span>
            </div>

            {/* Category Tag */}
            <div style={{ display: "flex", marginBottom: "16px" }}>
              <div
                style={{
                  background: "rgba(79, 70, 229, 0.1)",
                  color: "#4f46e5",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  border: "1px solid rgba(79, 70, 229, 0.2)",
                  fontWeight: "700",
                  fontSize: "16px",
                  display: "flex",
                }}
              >
                {renderMixedText(mainCategory.toUpperCase(), false)}
              </div>
            </div>

            {/* Main Article Title */}
            <div
              style={{
                fontSize: "46px",
                fontWeight: "900",
                color: "#000000",
                lineHeight: "1.2",
                marginBottom: "20px",
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {renderMixedText(title, isSinhala)}
            </div>

            {/* Excerpt Summary Snippet */}
            <div
              style={{
                fontSize: "20px",
                color: "#374151",
                lineHeight: "1.5",
                marginBottom: "32px",
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {renderMixedText(displaySummary, isSinhala)}
            </div>

            {/* Footer with publisher details */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                fontSize: "16px",
                color: "#4b5563",
                fontWeight: "600",
              }}
            >
              <span style={{ marginRight: "8px", display: "flex" }}>
                {renderMixedText(article.originalSource || "Global Report", isSinhala)}
              </span>
              <span style={{ marginRight: "8px" }}>•</span>
              <span>{dateStr}</span>
            </div>
          </div>
        </div>
      ),
      {
        ...size,
        fonts: [
          ...(englishFontData
            ? [
                {
                  name: "Ubuntu",
                  data: englishFontData,
                  style: "normal" as const,
                },
              ]
            : []),
          ...(fontData
            ? [
                {
                  name: "Emanee",
                  data: fontData,
                  style: "normal" as const,
                },
              ]
            : []),
        ],
      },
    );
  } catch (e) {
    console.error("OG Image generation error:", e);
    return new ImageResponse(
      (
        <div
          style={{
            fontSize: 64,
            background: "white",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {renderMixedText("NeuralPress News", false)}
        </div>
      ),
      {
        ...size,
        fonts: [
          ...(englishFontData
            ? [
                {
                  name: "Ubuntu",
                  data: englishFontData,
                  style: "normal" as const,
                },
              ]
            : []),
          ...(fontData
            ? [
                {
                  name: "Emanee",
                  data: fontData,
                  style: "normal" as const,
                },
              ]
            : []),
        ],
      },
    );
  }
}
