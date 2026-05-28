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

const NEWS_API_URL =
  process.env.NEXT_PUBLIC_NEWS_AGGREGATOR_URL ||
  process.env.NEWS_AGGREGATOR_URL ||
  "http://localhost:5005/api";

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
            backgroundColor: "#07090e",
            backgroundImage: "radial-gradient(circle at 10% 10%, rgba(99, 102, 241, 0.15) 0%, transparent 60%), radial-gradient(circle at 90% 90%, rgba(16, 185, 129, 0.08) 0%, transparent 60%)",
            padding: "0 60px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {/* Left Column: Metadata & Summary */}
          <div
            style={{
              width: "600px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              marginRight: "40px",
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
                  color: "#000",
                  fontSize: "18px",
                  letterSpacing: "-1px",
                }}
              >
                NP
              </div>
              <span
                style={{
                  color: "white",
                  fontSize: "24px",
                  fontWeight: "800",
                  fontFamily: "sans-serif",
                }}
              >
                Neural<span style={{ color: "#6366f1" }}>Press</span>
              </span>
            </div>

            {/* Category Tag */}
            <div style={{ display: "flex", marginBottom: "16px" }}>
              <div
                style={{
                  background: "rgba(99, 102, 241, 0.15)",
                  color: "#818cf8",
                  padding: "6px 14px",
                  borderRadius: "20px",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
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
                fontSize: "38px",
                fontWeight: "900",
                color: "white",
                lineHeight: "1.25",
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
                fontSize: "18px",
                color: "#94a3b8",
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
                fontSize: "14px",
                color: "#64748b",
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

          {/* Right Column: Premium Mobile Screenshot Mockup */}
          <div
            style={{
              width: "440px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Outer Device Chassis Bezel */}
            <div
              style={{
                width: "330px",
                height: "540px",
                backgroundColor: "#07090e",
                borderRadius: "44px",
                border: "12px solid #1e293b",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
              }}
            >
              {/* Dynamic Island Notch */}
              <div
                style={{
                  position: "absolute",
                  top: "12px",
                  left: "50%",
                  marginLeft: "-55px",
                  width: "110px",
                  height: "26px",
                  backgroundColor: "#000",
                  borderRadius: "13px",
                  zIndex: 20,
                }}
              />

              {/* Mobile Browser Window Body */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#07090e",
                  position: "relative",
                }}
              >
                {/* Simulated Mobile OS Status Bar */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "16px 24px 6px",
                    fontSize: "11px",
                    fontWeight: "700",
                    color: "rgba(255, 255, 255, 0.8)",
                    fontFamily: "sans-serif",
                    zIndex: 10,
                  }}
                >
                  <span>9:41</span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <span>📶</span>
                    <span>🛜</span>
                    <span>🔋</span>
                  </div>
                </div>

                {/* Simulated App Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "8px 20px",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    zIndex: 10,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        background: "linear-gradient(to right, #6366f1, #10b981)",
                        width: "18px",
                        height: "18px",
                        borderRadius: "5px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: "6px",
                        fontWeight: "950",
                        color: "#000",
                        fontSize: "9px",
                      }}
                    >
                      NP
                    </div>
                    <span
                      style={{
                        color: "white",
                        fontSize: "12px",
                        fontWeight: "800",
                        fontFamily: "sans-serif",
                      }}
                    >
                      Neural<span style={{ color: "#6366f1" }}>Press</span>
                    </span>
                  </div>
                  {/* Three Lines Burger Icon */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "8px",
                      width: "14px",
                    }}
                  >
                    <div style={{ height: "1.5px", width: "100%", backgroundColor: "white" }} />
                    <div style={{ height: "1.5px", width: "100%", backgroundColor: "white" }} />
                  </div>
                </div>

                {/* Simulated Article Body View */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "16px",
                    height: "100%",
                  }}
                >
                  {/* Premium Glowing Neural Sentiment Line Chart (Satori SVG) */}
                  <div
                    style={{
                      width: "100%",
                      height: "150px",
                      background: "#030712",
                      borderRadius: "16px",
                      border: "1px solid rgba(99, 102, 241, 0.2)",
                      marginBottom: "12px",
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      padding: "12px",
                    }}
                  >
                    {/* Background Subtle Grid Lines */}
                    <div style={{ position: "absolute", top: "30px", left: 0, right: 0, height: "1px", backgroundColor: "rgba(255, 255, 255, 0.04)" }} />
                    <div style={{ position: "absolute", top: "60px", left: 0, right: 0, height: "1px", backgroundColor: "rgba(255, 255, 255, 0.04)" }} />
                    <div style={{ position: "absolute", top: "90px", left: 0, right: 0, height: "1px", backgroundColor: "rgba(255, 255, 255, 0.04)" }} />
                    <div style={{ position: "absolute", top: "120px", left: 0, right: 0, height: "1px", backgroundColor: "rgba(255, 255, 255, 0.04)" }} />
                    <div style={{ position: "absolute", left: "70px", top: 0, bottom: 0, width: "1px", backgroundColor: "rgba(255, 255, 255, 0.04)" }} />
                    <div style={{ position: "absolute", left: "140px", top: 0, bottom: 0, width: "1px", backgroundColor: "rgba(255, 255, 255, 0.04)" }} />
                    <div style={{ position: "absolute", left: "210px", top: 0, bottom: 0, width: "1px", backgroundColor: "rgba(255, 255, 255, 0.04)" }} />

                    {/* Chart Header Badges */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        zIndex: 5,
                        width: "100%",
                      }}
                    >
                      <div
                        style={{
                          background: "rgba(99, 102, 241, 0.2)",
                          border: "1px solid rgba(99, 102, 241, 0.4)",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          color: "#a5b4fc",
                          fontSize: "8px",
                          fontWeight: "700",
                          textTransform: "uppercase",
                          fontFamily: "Ubuntu, sans-serif",
                        }}
                      >
                        AI Trend Model
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          background: "rgba(16, 185, 129, 0.15)",
                          border: "1px solid rgba(16, 185, 129, 0.3)",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          color: "#34d399",
                          fontSize: "8px",
                          fontWeight: "700",
                          fontFamily: "Ubuntu, sans-serif",
                        }}
                      >
                        <span style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: "#10b981", marginRight: "4px", display: "flex" }} />
                        Accuracy: 99.4%
                      </div>
                    </div>

                    {/* SVG Chart Graphics */}
                    <svg
                      width="270"
                      height="110"
                      viewBox="0 0 270 110"
                      style={{
                        position: "absolute",
                        bottom: "5px",
                        left: "10px",
                        zIndex: 2,
                      }}
                    >
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="50%" stopColor="#8b5cf6" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                        </linearGradient>
                      </defs>

                      {/* Area Fill */}
                      <path
                        d="M 0 100 Q 40 40 80 80 T 160 30 T 230 50 T 270 10 L 270 110 L 0 110 Z"
                        fill="url(#areaGrad)"
                      />

                      {/* Line Path */}
                      <path
                        d="M 0 100 Q 40 40 80 80 T 160 30 T 230 50 T 270 10"
                        fill="none"
                        stroke="url(#chartGrad)"
                        strokeWidth="3.5"
                      />

                      {/* Data Point Nodes */}
                      <circle cx="80" cy="80" r="4" fill="#8b5cf6" stroke="#030712" strokeWidth="1.5" />
                      <circle cx="160" cy="30" r="4" fill="#6366f1" stroke="#030712" strokeWidth="1.5" />
                      <circle cx="230" cy="50" r="4" fill="#a78bfa" stroke="#030712" strokeWidth="1.5" />
                      
                      {/* Pulsing end node representation */}
                      <circle cx="270" cy="10" r="6" fill="#10b981" />
                      <circle cx="270" cy="10" r="3" fill="#ffffff" />
                    </svg>

                    {/* Chart Bottom Label Info */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: "8px",
                        left: "12px",
                        display: "flex",
                        alignItems: "center",
                        fontSize: "8px",
                        color: "rgba(255, 255, 255, 0.4)",
                        fontWeight: "600",
                        fontFamily: "Ubuntu, sans-serif",
                        zIndex: 5,
                      }}
                    >
                      Real-time Neural Analysis
                    </div>
                  </div>

                  {/* Category Tag on screen */}
                  <span
                    style={{
                      color: "#818cf8",
                      fontSize: "10px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                      display: "flex",
                    }}
                  >
                    {renderMixedText(mainCategory, false)}
                  </span>

                  {/* Article Title on screen */}
                  <div
                    style={{
                      color: "white",
                      fontSize: "18px",
                      fontWeight: "800",
                      lineHeight: "1.3",
                      marginBottom: "8px",
                      display: "flex",
                      flexWrap: "wrap",
                    }}
                  >
                    {renderMixedText(title.length > 55 ? title.slice(0, 55) + "..." : title, isSinhala)}
                  </div>

                  {/* Tiny text snippet */}
                  <div
                    style={{
                      color: "rgba(255, 255, 255, 0.5)",
                      fontSize: "11px",
                      lineHeight: "1.4",
                      display: "flex",
                      flexWrap: "wrap",
                    }}
                  >
                    {renderMixedText(displaySummary.length > 90 ? displaySummary.slice(0, 90) + "..." : displaySummary, isSinhala)}
                  </div>
                </div>

                {/* Mobile Bottom OS Home Indicator Bar */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "6px",
                    left: "50%",
                    marginLeft: "-50px",
                    width: "100px",
                    height: "4px",
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    borderRadius: "2px",
                    zIndex: 10,
                  }}
                />
              </div>
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
