import { MetadataRoute } from "next";
import { getPayload } from "payload";
import config from "@/payload.config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    ? process.env.NEXT_PUBLIC_BASE_URL
    : process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "http://localhost:3000";

  const staticRoutes = [
    "",
    "/how-it-works",
    "/pricing",
    "/login",
    "/signup",
    "/blog",
  ];

  const staticSitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? ("always" as const) : ("daily" as const),
    priority: route === "" ? 1.0 : route === "/login" || route === "/signup" ? 0.5 : 0.8,
  }));

  try {
    const payload = await getPayload({ config });
    const postsData = await payload.find({
      collection: "posts",
      limit: 100,
      select: {
        slug: true,
        publishedDate: true,
        updatedAt: true,
      },
    });

    const blogSitemap = postsData.docs.map((post: any) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.publishedDate || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...staticSitemap, ...blogSitemap];
  } catch (err) {
    console.error("Failed to generate sitemap for blog posts:", err);
    return staticSitemap;
  }
}
