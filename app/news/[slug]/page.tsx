import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { isSameSiteNews } from "@/lib/utils";
import NewsArticleContent from "@/components/custom/news/NewsArticleContent";
import { RelatedNews } from "@/components/custom/news/RelatedNews";
import { searchNewsAction, fetchNews } from "../actions";
import { NewsFeed } from "@/components/custom/news/NewsFeed";
import NewsSearchBar from "@/components/custom/news/NewsSearchBar";
import Link from "next/link";
import Image from "next/image";

const NEWS_API_URL =
  process.env.NEXT_PUBLIC_NEWS_AGGREGATOR_URL ||
  process.env.NEWS_AGGREGATOR_URL ||
  "http://localhost:5005/api";

async function getArticle(slug: string) {
  try {
    const res = await fetch(`${NEWS_API_URL}/news/slug/${slug}`, {
      headers: {
        "x-service-api-key": process.env.SERVICE_API_KEY || "",
      },
      next: { revalidate: 3600 }, // Cache for an hour
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("Failed to fetch article:", err);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).replace(/-/g, " ");

  const article = await getArticle(slug);

  if (!article || isSameSiteNews(article)) {
    // Fallback to Category/Keyword metadata
    const capitalizedTopic =
      decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1);
    return {
      title: `${capitalizedTopic} News | NeuralPress`,
      description: `Read the latest news and updates related to ${capitalizedTopic}. Discover articles, analysis, and comprehensive coverage.`,
      keywords: `${decodedSlug}, news, updates, NeuralPress`,
    };
  }

  const title = article.seo?.metaTitle || article.title;
  const description = article.seo?.metaDescription || article.summary;

  return {
    title,
    description,
    keywords: article.categories?.join(", "),
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: article.pubDate,
      authors: [article.source || "NeuralPress"],
      // The `opengraph-image.tsx` will automatically intercept the default OG image since it's in the same directory!
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

const NewsArticlePage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug).replace(/-/g, " ");

  const article = await getArticle(slug);

  if (article && isSameSiteNews(article)) {
    notFound();
  }

  if (!article) {
    const KNOWN_CATEGORIES = [
      "all",
      "local news",
      "technology",
      "business",
      "politics",
      "sports",
      "entertainment",
      "health",
      "science",
      "world news",
      "lifestyle",
      "travel",
      "food",
      "ai & future",
      "crypto",
      "climate",
      "investigations",
      "opinion",
      "fact check",
    ];

    // Attempt standard category normalization e.g. "local news" -> "Local News"
    const isKnownCategory = KNOWN_CATEGORIES.includes(
      decodedSlug.toLowerCase(),
    );

    const capitalizedTopic = isKnownCategory
      ? decodedSlug
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
      : decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1);

    const initialNews = isKnownCategory
      ? await fetchNews(0, 20, capitalizedTopic)
      : await searchNewsAction(decodedSlug, 20);

    if (initialNews.length === 0) {
      notFound();
    }

    return (
      <main className="min-h-screen">
        <div className="w-full font-inter pt-8 relative z-10">
          <div className="mb-10 mt-4 px-4 flex flex-col gap-3 justify-center">
            <Link href={"/"} className="w-[90px] mx-auto block">
              <Image
                src="/main-logo.png"
                width={100}
                height={100}
                className="w-9 lg:w-[90px] transition-transform duration-700 "
                alt="NeuralPress"
              />
            </Link>
            <h1 className="text-4xl md:text-6xl font-heading tracking-tight text-center capitalize">
              {capitalizedTopic.replace(/\\bnews\\b/i, "").trim()}{" "}
              <span className="text-primary">News</span>
            </h1>
            <p className="text-neutral-400 text-center text-sm font-light mb-8 max-w-xl mx-auto">
              Latest conceptually matching events and reports for{" "}
              <strong>{capitalizedTopic}</strong>.
            </p>
            <NewsSearchBar />
          </div>
          <NewsFeed
            initialNews={initialNews}
            searchQuery={isKnownCategory ? undefined : decodedSlug}
            initialCategory={capitalizedTopic}
          />
        </div>
      </main>
    );
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.seo?.metaTitle || article.title,
    description: article.seo?.metaDescription || article.summary,
    image: "",
    datePublished: article.pubDate,
    dateModified: article.updatedAt || article.pubDate,
    author: {
      "@type": "Organization",
      name: "NeuralPress",
    },
    publisher: {
      "@type": "Organization",
      name: "NeuralPress - AI News Aggregator",
      logo: {
        "@type": "ImageObject",
        url: "https://neuralpress.com/main-logo.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://neuralpress.com/news/${slug}`,
    },
  };

  return (
    <main className="min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NewsArticleContent article={article} />

      {/* Render related semantic news cards */}
      <RelatedNews articleId={article._id} currentSlug={slug} />
    </main>
  );
};

export default NewsArticlePage;
