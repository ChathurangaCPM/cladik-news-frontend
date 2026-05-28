import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const NEWS_API_URL =
    process.env.NEXT_PUBLIC_NEWS_AGGREGATOR_URL ||
    process.env.NEWS_AGGREGATOR_URL ||
    "http://localhost:5005/api";

  const targetUrl = `${NEWS_API_URL}/news/stats/overview`;

  try {
    const res = await fetch(targetUrl, {
      headers: {
        "x-service-api-key": process.env.SERVICE_API_KEY || "",
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return new NextResponse(
        JSON.stringify({ success: false, message: `Failed: ${res.statusText}` }),
        { status: res.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Error fetching stats overview:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
