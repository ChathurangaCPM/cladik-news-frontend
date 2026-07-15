import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const NEWS_API_URL =
  process.env.NEXT_PUBLIC_NEWS_AGGREGATOR_URL ||
  process.env.NEWS_AGGREGATOR_URL ||
  "http://localhost:5005/api";

export async function GET() {
  try {
    const res = await fetch(`${NEWS_API_URL}/news/settings`, {
      method: "GET",
      headers: {
        "x-service-api-key": process.env.SERVICE_API_KEY || "",
        "Content-Type": "application/json",
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      const errText = await res.text();
      return new NextResponse(errText, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Proxy settings GET error:", err);
    return new NextResponse(err.message || "Internal Server Error", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let targetEndpoint = "";
    let requestBody = {};

    if ("active" in body && "url" in body) {
      // Toggle individual feed
      targetEndpoint = "/news/settings/feed";
      requestBody = { url: body.url, active: body.active };
    } else if ("cronActive" in body) {
      // Toggle cron status
      targetEndpoint = "/news/settings/cron";
      requestBody = { active: body.cronActive };
    } else if ("domains" in body) {
      // Update domain blacklist
      targetEndpoint = "/news/settings/blacklist";
      requestBody = { domains: body.domains };
    } else if ("keys" in body) {
      // Update Gemini API keys
      targetEndpoint = "/news/settings/gemini-keys";
      requestBody = { keys: body.keys };
    } else {
      return new NextResponse("Invalid action body", { status: 400 });
    }

    const res = await fetch(`${NEWS_API_URL}${targetEndpoint}`, {
      method: "POST",
      headers: {
        "x-service-api-key": process.env.SERVICE_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!res.ok) {
      const errText = await res.text();
      return new NextResponse(errText, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Proxy settings POST error:", err);
    return new NextResponse(err.message || "Internal Server Error", { status: 500 });
  }
}
