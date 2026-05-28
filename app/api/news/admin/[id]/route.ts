import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const NEWS_API_URL =
    process.env.NEXT_PUBLIC_NEWS_AGGREGATOR_URL ||
    process.env.NEWS_AGGREGATOR_URL ||
    "http://localhost:5005/api";
  const targetUrl = `${NEWS_API_URL}/news/${id}`;

  try {
    const res = await fetch(targetUrl, {
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
    console.error(`Proxy GET admin/${id} error:`, err);
    return new NextResponse(err.message || "Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const NEWS_API_URL =
    process.env.NEXT_PUBLIC_NEWS_AGGREGATOR_URL ||
    process.env.NEWS_AGGREGATOR_URL ||
    "http://localhost:5005/api";
  const targetUrl = `${NEWS_API_URL}/news/admin/${id}`;

  try {
    const res = await fetch(targetUrl, {
      method: "PATCH",
      headers: {
        "x-service-api-key": process.env.SERVICE_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      return new NextResponse(errText, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error(`Proxy PATCH admin/${id} error:`, err);
    return new NextResponse(err.message || "Internal Server Error", { status: 500 });
  }
}
