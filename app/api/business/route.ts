import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // business-service is active on port 5001 (direct microservice url)
  const BUSINESS_SERVICE_URL =
    process.env.BUSINESS_SERVICE_URL || "http://localhost:5001/api";

  try {
    const res = await fetch(`${BUSINESS_SERVICE_URL}/business`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      return new NextResponse(
        JSON.stringify({ success: false, businesses: [], message: `Failed: ${res.statusText}` }),
        { status: res.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("Error fetching businesses proxy:", err);
    // Return gracefully so the client component can fallback to high-fidelity mock vendors
    return NextResponse.json({ success: false, businesses: [] });
  }
}
