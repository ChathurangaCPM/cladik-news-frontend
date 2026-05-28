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

// Curated Category specific layouts & details for premium look and high-quality SEO metadata
export interface CategoryMetaDetails {
  image: string;
  tagline: string;
  accentColor: string;
}

export const CATEGORY_DETAILS: Record<string, CategoryMetaDetails> = {
  all: {
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=85",
    tagline:
      "Explore the complete global spectrum of real-time intelligence, breaking reports, and conceptual trends.",
    accentColor: "from-indigo-500 to-purple-600",
  },
  "sri lanka": {
    image:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1200&q=85",
    tagline:
      "Stay connected with high-impact events, community updates, and neighborhood narratives in Sri Lanka.",
    accentColor: "from-emerald-500 to-teal-600",
  },
  technology: {
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85",
    tagline:
      "Insightful perspective on deep tech breakthroughs, silicon developments, and digital transformation.",
    accentColor: "from-blue-500 to-indigo-600",
  },
  "ai & future": {
    image:
      "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=85",
    tagline:
      "Frontier investigations into synthetic intelligence, artificial neural networks, and humanity's horizon.",
    accentColor: "from-purple-500 to-pink-600",
  },
  crypto: {
    image:
      "https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&w=1200&q=85",
    tagline:
      "Decentralized consensus updates, token economy research, and global cryptographic market insights.",
    accentColor: "from-amber-500 to-orange-600",
  },
  business: {
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=85",
    tagline:
      "Macroeconomic analysis, startup fundraising events, corporate restructuring, and global fiscal trends.",
    accentColor: "from-slate-755 to-slate-900",
  },
  politics: {
    image:
      "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=85",
    tagline:
      "Unbiased legislative policies, geopolitical election reports, and bilateral diplomatic coverage.",
    accentColor: "from-blue-600 to-red-600",
  },
  sports: {
    image:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=85",
    tagline:
      "Live athletic achievements, championship statistics, physical wellness records, and global leagues.",
    accentColor: "from-orange-500 to-red-650",
  },
  entertainment: {
    image:
      "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1200&q=85",
    tagline:
      "Cinematic arts features, pop-culture updates, theatrical critiques, and digital media dynamics.",
    accentColor: "from-rose-500 to-pink-600",
  },
  health: {
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=85",
    tagline:
      "Clinical medical findings, mental wellbeing guidelines, preventive healthcare, and organic living.",
    accentColor: "from-teal-400 to-emerald-500",
  },
  science: {
    image:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=85",
    tagline:
      "Cosmology discoveries, fundamental physics research, quantum mechanics, and empirical explorations.",
    accentColor: "from-violet-500 to-purple-700",
  },
  "world news": {
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=85",
    tagline:
      "Global cross-border reports, human interest profiles, and geopolitical cooperation narratives.",
    accentColor: "from-cyan-500 to-blue-600",
  },
  climate: {
    image:
      "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=85",
    tagline:
      "Ecological biodiversity records, clean energy transition milestones, and environmental preservation updates.",
    accentColor: "from-emerald-600 to-green-700",
  },
  investigations: {
    image:
      "https://images.unsplash.com/photo-1453847668080-482ed755ff9f?auto=format&fit=crop&w=1200&q=85",
    tagline:
      "Rigorous deep-dives, anti-corruption exposes, whistleblowing accounts, and systemic policy audits.",
    accentColor: "from-zinc-700 to-neutral-900",
  },
  opinion: {
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85",
    tagline:
      "Thought-provoking essays, intellectual debates, philosophical columns, and visionary critiques.",
    accentColor: "from-sky-500 to-indigo-600",
  },
  "fact check": {
    image:
      "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=85",
    tagline:
      "Rigorous information auditing, debunking misinformation, verifying claims, and restoring truth.",
    accentColor: "from-red-500 to-rose-600",
  },
  lifestyle: {
    image:
      "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=85",
    tagline:
      "Minimal interior designs, mind-body balance routines, work-life design, and modern cultural trends.",
    accentColor: "from-amber-500 to-orange-500",
  },
  travel: {
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=85",
    tagline:
      "Geographic expedition accounts, off-grid destination guides, cultural photography, and global routes.",
    accentColor: "from-blue-400 to-cyan-500",
  },
  food: {
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=85",
    tagline:
      "Gastronomic culture, recipes from legendary kitchens, agriculture ethics, and culinary sciences.",
    accentColor: "from-red-500 to-orange-500",
  },
};

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
    // Fallback to Curated Category/Keyword SEO metadata
    const capitalizedTopic =
      decodedSlug.charAt(0).toUpperCase() + decodedSlug.slice(1);
    const key = decodedSlug.toLowerCase();

    const details = CATEGORY_DETAILS[key] || {
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85",
      tagline: `Read the latest conceptual news, semantic research events, and dynamic neural aggregations for ${capitalizedTopic}.`,
      accentColor: "from-indigo-500 to-purple-600",
    };

    return {
      title: `${capitalizedTopic} News | NeuralPress AI News`,
      description: details.tagline,
      keywords: `${decodedSlug}, news, updates, NeuralPress, conceptual news, ${key}`,
      openGraph: {
        title: `${capitalizedTopic} News Coverage - NeuralPress`,
        description: details.tagline,
        images: [
          {
            url: details.image,
            width: 1200,
            height: 630,
            alt: `${capitalizedTopic} Cover`,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${capitalizedTopic} News Coverage | NeuralPress`,
        description: details.tagline,
        images: [details.image],
      },
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
      "sri lanka",
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

    const detailsKey = decodedSlug.toLowerCase();
    const details = CATEGORY_DETAILS[detailsKey] || {
      image:
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=85",
      tagline: `Latest conceptually matching events, reports, and analytical insights for ${capitalizedTopic}.`,
      accentColor: "from-indigo-500 via-purple-500 to-pink-500",
    };

    return (
      <main className="min-h-screen bg-slate-50/30 dark:bg-[#07090e] pb-12 transition-colors duration-300">
        <div className="max-w-[1400px] mx-auto px-0 sm:px-6 lg:px-8 pt-6">
          {/* Visual Category Hero Panel */}
          <div className="relative w-full h-[280px] sm:h-[350px] md:h-[400px] rounded-[2rem] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] mb-10 group">
            {/* Background Cover Image with Zoom Transition */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out scale-100 group-hover:scale-105"
              style={{ backgroundImage: `url('${details.image}')` }}
            />
            {/* Elegant Double Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 via-transparent to-black/30" />

            {/* Floating Top Header (Home navigation & Branding) */}
            <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
              <Link
                href="/news"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 dark:bg-black/30 backdrop-blur-md border border-white/20 text-white text-xs font-inter font-medium tracking-tight hover:bg-white/20 transition-all cursor-pointer shadow-sm"
              >
                ← Back to News
              </Link>
              {/* <Link href="/" className="transition-transform hover:scale-105">
                <Image
                  src="/main-logo.png"
                  width={90}
                  height={90}
                  className="w-8 sm:w-[90px] brightness-0 invert"
                  alt="NeuralPress"
                />
              </Link> */}
            </div>

            {/* Bottom Left Hero Content Grid */}
            <div className="absolute bottom-8 left-6 right-6 sm:left-10 sm:right-10 z-10 flex flex-col justify-end h-full">
              <div className="space-y-3 max-w-2xl">
                {/* Visual Category Badge Tag */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 backdrop-blur-md border border-indigo-400/30 text-[10px] sm:text-xs font-semibold tracking-wider text-indigo-300 uppercase font-geist-mono">
                  ✨ NeuralPress Insight
                </div>
                {/* Dynamic Title with accent gradient */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl">
                  <span className="font-heading text-white tracking-tight leading-tight capitalize">
                    {capitalizedTopic.replace(/\bnews\b/i, "").trim()}{" "}
                  </span>
                  <span className="italic text-white bg-clip-text tracking-tighter">
                    News
                  </span>
                </h1>
                {/* Curated Tagline description */}
                <p className="text-white/85 text-xs sm:text-sm md:text-base font-light tracking-wide max-w-xl font-inter leading-relaxed">
                  {details.tagline}
                </p>
              </div>
            </div>
          </div>

          {/* Centered Floating Search Bar */}
          <div className="relative -mt-16 mb-12 z-20 max-w-2xl mx-auto px-4">
            <NewsSearchBar />
          </div>

          {/* Primary News Listing Feed */}
          <section
            aria-label={`${capitalizedTopic} news articles`}
            className="w-full"
          >
            <NewsFeed
              initialNews={initialNews}
              searchQuery={isKnownCategory ? undefined : decodedSlug}
              initialCategory={capitalizedTopic}
            />
          </section>
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
