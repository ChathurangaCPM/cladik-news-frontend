import { NextRequest, NextResponse } from "next/server";
import http from "http";
import https from "https";

export const dynamic = "force-dynamic";

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

  // Create a ReadableStream to stream the data chunk-by-chunk to the client,
  // completely bypassing Undici/Next.js fetch BodyTimeoutError limits.
  const stream = new ReadableStream({
    start(controller) {
      const request = client.request(options, (response) => {
        // Enqueue data chunk-by-chunk directly into the controller
        response.on("data", (chunk) => {
          controller.enqueue(chunk);
        });

        response.on("end", () => {
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
