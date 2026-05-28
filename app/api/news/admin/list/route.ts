import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get("limit") || "20";
  const skip = searchParams.get("skip") || "0";
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";

  const NEWS_API_URL =
    process.env.NEXT_PUBLIC_NEWS_AGGREGATOR_URL ||
    process.env.NEWS_AGGREGATOR_URL ||
    "http://localhost:5005/api";
  const targetUrl = new URL(`${NEWS_API_URL}/news/admin/list`);
  targetUrl.searchParams.set("limit", limit);
  targetUrl.searchParams.set("skip", skip);
  if (search) targetUrl.searchParams.set("search", search);
  if (status) targetUrl.searchParams.set("status", status);

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
    console.error("Proxy admin/list error:", err);
    return new NextResponse(err.message || "Internal Server Error", { status: 500 });
  }
}
