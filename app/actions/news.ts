"use server";

const NEWS_API_URL =
  process.env.NEWS_AGGREGATOR_URL ||
  process.env.NEXT_PUBLIC_NEWS_AGGREGATOR_URL ||
  "http://localhost:5005/api";

export async function getNewsById(id: string) {
  if (!id) {
    throw new Error("News ID is required.");
  }

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
      throw new Error(errText || `Failed to fetch news (Status: ${res.status})`);
    }

    return await res.json();
  } catch (err: any) {
    console.error(`getNewsById server action error for ID ${id}:`, err);
    throw new Error(err.message || "Failed to retrieve news from database");
  }
}

export async function uploadImageToR2(filename: string, base64Image: string) {
  if (!base64Image) {
    throw new Error("Image data is required.");
  }

  const targetUrl = `${NEWS_API_URL}/news/upload-image`;

  try {
    const res = await fetch(targetUrl, {
      method: "POST",
      headers: {
        "x-service-api-key": process.env.SERVICE_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename,
        image: base64Image,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `Failed to upload image (Status: ${res.status})`);
    }

    return await res.json();
  } catch (err: any) {
    console.error("uploadImageToR2 server action error:", err);
    throw new Error(err.message || "Failed to upload image to R2");
  }
}

export async function updateNewsOgImage(id: string, imageUrl: string) {
  if (!id || !imageUrl) {
    throw new Error("ID and Image URL are required.");
  }

  const targetUrl = `${NEWS_API_URL}/news/admin/${id}`;

  try {
    const res = await fetch(targetUrl, {
      method: "PATCH",
      headers: {
        "x-service-api-key": process.env.SERVICE_API_KEY || "",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        dynamicOgImage: imageUrl,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `Failed to update news OG image (Status: ${res.status})`);
    }

    return await res.json();
  } catch (err: any) {
    console.error(`updateNewsOgImage server action error for ID ${id}:`, err);
    throw new Error(err.message || "Failed to update article record in database");
  }
}
