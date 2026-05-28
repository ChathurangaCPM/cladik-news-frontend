import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ ogImage: null });
  }

  const NEWS_API_URL =
    process.env.NEXT_PUBLIC_NEWS_AGGREGATOR_URL ||
    process.env.NEWS_AGGREGATOR_URL ||
    "http://localhost:5005/api";
  const targetUrl = new URL(`${NEWS_API_URL}/news/scrape-image`);
  targetUrl.searchParams.set("url", url);

  try {
    const res = await fetch(targetUrl.toString(), {
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
    console.error("Proxy scrape-image error:", err);
    return new NextResponse(err.message || "Internal Server Error", { status: 500 });
  }
}
