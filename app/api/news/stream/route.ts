import { NextRequest, NextResponse } from "next/server";
import http from "http";
import https from "https";

export const dynamic = "force-dynamic";

async function getBlacklistedDomains(): Promise<string[]> {
  try {
    const NEWS_API_URL =
      process.env.NEXT_PUBLIC_NEWS_AGGREGATOR_URL ||
      process.env.NEWS_AGGREGATOR_URL ||
      "http://localhost:5005/api";
    const res = await fetch(`${NEWS_API_URL}/news/settings`, {
      method: "GET",
      headers: {
        "x-service-api-key": process.env.SERVICE_API_KEY || "",
        "Content-Type": "application/json",
      },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.blacklistedOgDomains) ? data.blacklistedOgDomains : [];
  } catch (e) {
    console.error("Error fetching blacklist in stream:", e);
    return [];
  }
}

export async function GET(req: NextRequest) {
  const NEWS_API_URL =
    process.env.NEXT_PUBLIC_NEWS_AGGREGATOR_URL ||
    process.env.NEWS_AGGREGATOR_URL ||
    "http://localhost:5005/api";

  const targetUrl = `${NEWS_API_URL}/news/stream`;
  
  let parsedUrl;
  try {
    parsedUrl = new URL(targetUrl);
  } catch (e) {
    console.error("Invalid NEWS_API_URL:", targetUrl);
    return new NextResponse("Invalid backend URL", { status: 500 });
  }

  const client = parsedUrl.protocol === "https:" ? https : http;

  const options: http.RequestOptions = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || (parsedUrl.protocol === "https:" ? 443 : 80),
    path: parsedUrl.pathname + parsedUrl.search,
    method: "GET",
    headers: {
      "x-service-api-key": process.env.SERVICE_API_KEY || "",
      "Accept": "text/event-stream",
    },
    timeout: 0, // Disable connection and read timeouts for long-lived streams
  };

  // Buffer to accumulate chunks of data
  let buffer = "";

  // Create a ReadableStream to stream the data chunk-by-chunk to the client,
  // completely bypassing Undici/Next.js fetch BodyTimeoutError limits.
  const stream = new ReadableStream({
    start(controller) {
      const request = client.request(options, async (response) => {
        const blacklist = await getBlacklistedDomains();

        response.on("data", (chunk) => {
          buffer += chunk.toString("utf8");
          
          // Split by SSE message separator (\n\n)
          const parts = buffer.split("\n\n");
          // Keep the last partial message in the buffer
          buffer = parts.pop() || "";

          for (const part of parts) {
            if (part.trim() === "") continue;

            let transformedPart = part;
            // Parse event data if it is a data line
            if (part.startsWith("data:")) {
              try {
                const dataJsonStr = part.replace(/^data:\s*/, "").trim();
                const rawNewItem = JSON.parse(dataJsonStr);

                // Scrub blacklisted domains server-side!
                if (rawNewItem) {
                  const isImageBlacklisted = (urlStr: string | undefined): boolean => {
                    if (!urlStr) return false;
                    try {
                      const hostname = new URL(urlStr).hostname.toLowerCase();
                      return blacklist.some((domain) => {
                        const cleanDomain = domain.toLowerCase().trim();
                        return hostname === cleanDomain || hostname.endsWith("." + cleanDomain);
                      });
                    } catch (e) {
                      return false;
                    }
                  };

                  if (isImageBlacklisted(rawNewItem.ogImage)) {
                    rawNewItem.ogImage = null;
                  }
                  if (isImageBlacklisted(rawNewItem.dynamicOgImage)) {
                    rawNewItem.dynamicOgImage = null;
                  }
                  transformedPart = `data: ${JSON.stringify(rawNewItem)}`;
                }
              } catch (e) {
                // Keep original part if JSON parsing fails
              }
            }

            controller.enqueue(new TextEncoder().encode(transformedPart + "\n\n"));
          }
        });

        response.on("end", () => {
          if (buffer.trim() !== "") {
            controller.enqueue(new TextEncoder().encode(buffer + "\n\n"));
          }
          controller.close();
        });

        response.on("error", (err) => {
          console.error("Backend stream response error:", err);
          controller.error(err);
        });
      });

      request.on("error", (err) => {
        console.error("Backend stream connection request error:", err);
        controller.error(err);
      });

      request.end();

      // Clean up backend request immediately if the client disconnects/aborts
      req.signal.addEventListener("abort", () => {
        request.destroy();
      });
    },
  });

  const headers = new Headers();
  headers.set("Content-Type", "text/event-stream");
  headers.set("Cache-Control", "no-cache, no-transform");
  headers.set("Connection", "keep-alive");
  headers.set("Content-Encoding", "none");

  return new NextResponse(stream, { headers });
}
