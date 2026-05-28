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
    const bgImage = article.dynamicOgImage || article.ogImage || null;

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            backgroundColor: "#000",
            backgroundImage: bgImage ? `url(${bgImage})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Glassmorphism gradient overlay to make text readable */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.4), rgba(0,0,0,0))",
              width: "100%",
              padding: "60px 80px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", marginBottom: 24 }}
            >
              <div
                style={{
                  background: "#facc15", // Yellow accent
                  color: "#000",
                  padding: "8px 16px",
                  borderRadius: 24,
                  fontWeight: 800,
                  fontSize: 24,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  display: "flex",
                }}
              >
                {renderMixedText(siteTitle, isSinhala)}
              </div>
            </div>

            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                color: "white",
                lineHeight: 1.1,
                marginBottom: 20,
                letterSpacing: "-1px",
                textShadow: "0 4px 12px rgba(0,0,0,0.8)",
                display: "flex",
                flexWrap: "wrap",
              }}
            >
              {renderMixedText(title, isSinhala)}
            </div>

            {article.categories && article.categories.length > 0 && (
              <div style={{ display: "flex", gap: 16, marginTop: "auto" }}>
                {article.categories.map((cat: string, i: number) => (
                  <div
                    key={i}
                    style={{
                      color: "#a1a1aa",
                      fontSize: 24,
                      fontWeight: 500,
                      display: "flex"
                    }}
                  >
                    {renderMixedText(`#${cat}`, isSinhala)}
                  </div>
                ))}
              </div>
            )}
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
