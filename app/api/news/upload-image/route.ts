import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const NEWS_API_URL =
  process.env.NEXT_PUBLIC_NEWS_AGGREGATOR_URL ||
  process.env.NEWS_AGGREGATOR_URL ||
  "http://localhost:5005/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.image) {
      return new NextResponse("Image data is required", { status: 400 });
    }

    const res = await fetch(`${NEWS_API_URL}/news/upload-image`, {
      method: "POST",
      headers: {
        "x-service-api-key": process.env.SERVICE_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: body.filename,
        image: body.image,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return new NextResponse(errText, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Proxy upload-image POST error:", err);
    return new NextResponse(err.message || "Internal Server Error", { status: 500 });
  }
}
