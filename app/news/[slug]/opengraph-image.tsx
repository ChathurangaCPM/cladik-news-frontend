import { ImageResponse } from "next/og";
import { convertToLegacy } from "@/lib/unicodeToLegacy";

export const runtime = "edge";

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
  if (!isSinhala) return <span style={{ fontFamily: "sans-serif" }}>{text}</span>;
  
  // Split text by English words, numbers, and basic punctuation to separate them from Sinhala
  const parts = text.split(/([a-zA-Z0-9\s]+)/g);
  return (
    <span style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
      {parts.map((part, i) => {
        if (!part) return null;
        if (/[a-zA-Z0-9]/.test(part)) {
          return <span key={i} style={{ fontFamily: "sans-serif" }}>{part}</span>;
        }
        // Convert to legacy and apply the Sinhala font
        return <span key={i} style={{ fontFamily: '"Bindu", sans-serif' }}>{convertToLegacy(part)}</span>;
      })}
    </span>
  );
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  let fontData: ArrayBuffer | null = null;
  try {
    const fontRes = await fetch(
      new URL(
        "../../../public/fonts/bindu_sinhala_only.ttf",
        import.meta.url,
      ),
    );
    if (!fontRes.ok) throw new Error("Failed to fetch Sinhala font");
    fontData = await fontRes.arrayBuffer();
  } catch (e) {
    console.error("Font loading error:", e);
  }

  try {
    const { slug } = await params;
    const res = await fetch(`${NEWS_API_URL}/news/slug/${slug}`);

    if (!res.ok) {
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
            {renderMixedText("NeuralPress පුවත්", true)}
          </div>
        ),
        {
          ...size,
          fonts: fontData
            ? [{ name: "Bindu", data: fontData, style: "normal" }]
            : undefined,
        },
      );
    }

    const article = await res.json();
    const title = article.sinhalaTitle || article.title;
    const isSinhala = !!article.sinhalaTitle || /[අ-ෆ]/.test(title);
    const siteTitle = isSinhala ? "NeuralPress පුවත්" : "NeuralPress";
    const bgImage = article.dynamicOgImage || article.ogImage || "";

    const rawSummary = (isSinhala ? article.sinhalaSummary : article.summary) || article.summary || "";
    const displaySummary = rawSummary.length > 130 ? rawSummary.slice(0, 130) + "..." : rawSummary;

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
                {renderMixedText(mainCategory.toUpperCase(), isSinhala)}
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
                  {/* Article Hero Image with dynamic URL */}
                  {bgImage ? (
                    <div
                      style={{
                        width: "100%",
                        height: "150px",
                        backgroundImage: `url(${bgImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: "16px",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        marginBottom: "12px",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "150px",
                        background: "linear-gradient(to bottom, #1e1b4b, #0c0a09)",
                        borderRadius: "16px",
                        marginBottom: "12px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                      }}
                    >
                      <span style={{ fontSize: "12px", color: "#4f46e5" }}>NeuralPress</span>
                    </div>
                  )}

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
                    {renderMixedText(mainCategory, isSinhala)}
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
        fonts: fontData
          ? [
              {
                name: "Bindu",
                data: fontData,
                style: "normal",
              },
            ]
          : undefined,
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
          {renderMixedText("NeuralPress පුවත්", true)}
        </div>
      ),
      {
        ...size,
        fonts: fontData
          ? [{ name: "Bindu", data: fontData, style: "normal" }]
          : undefined,
      },
    );
  }
}
