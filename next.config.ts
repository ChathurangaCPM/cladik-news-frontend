import type { NextConfig } from "next";

// Robustly normalize backend API URL environment variables at startup
if (process.env.NEWS_AGGREGATOR_URL) {
  let url = process.env.NEWS_AGGREGATOR_URL;
  if (!url.endsWith("/api") && !url.endsWith("/api/")) {
    process.env.NEWS_AGGREGATOR_URL = url.endsWith("/") ? `${url}api` : `${url}/api`;
  }
}
if (process.env.NEXT_PUBLIC_NEWS_AGGREGATOR_URL) {
  let url = process.env.NEXT_PUBLIC_NEWS_AGGREGATOR_URL;
  if (!url.endsWith("/api") && !url.endsWith("/api/")) {
    process.env.NEXT_PUBLIC_NEWS_AGGREGATOR_URL = url.endsWith("/") ? `${url}api` : `${url}/api`;
  }
}

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/a/**",
      },
      {
        protocol: "https",
        hostname: "cladikstorage.site",
      },
      {
        protocol: "https",
        hostname: "cladikstorage.infinitude.lk",
      },
      {
        protocol: "https",
        hostname: "dummyimage.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "google.com",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
      {
        protocol: "https",
        hostname: "ui-avatars.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
