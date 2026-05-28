import React from "react";
import { fetchNews, searchNewsAction } from "./actions";
import { NewsFeed } from "@/components/custom/news/NewsFeed";
import NewsSearchBar from "@/components/custom/news/NewsSearchBar";
import Link from "next/link";
import Image from "next/image";

import { NewsOnboarding } from "@/components/custom/news/NewsOnboarding";
import { TextAnimate } from "@/components/ui/text-animate";

export const dynamic = "force-dynamic";

export default async function NewsMainPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const rawNews = q
    ? await searchNewsAction(q, 20)
    : await fetchNews(0, 20, "All");

  // Deduplicate by slug
  const initialNews = rawNews.filter(
    (news, index, self) =>
      index === self.findIndex((n) => n.slug === news.slug),
  );

  return (
    <>
      <div className="w-full font-inter relative z-10">
        <div className="mb-10 mt-4 px-4 flex flex-col gap-3 justify-center">
          <Link href={"/news"} className="w-[90px] mx-auto block">
            <Image
              src="/main-logo.png"
              width={100}
              height={100}
              className="w-9 lg:w-[90px] transition-transform duration-700 "
              alt="Cladik"
            />
          </Link>
          <TextAnimate
            animation="blurInUp"
            by="word"
            className={`text-5xl font-heading sm:text-7xl lg:text-7xl tracking-tighter leading-[0.95] text-center`}
          >
            News Discovery
          </TextAnimate>
          <TextAnimate
            animation="blurInUp"
            by="word"
            className="text-neutral-400 text-center text-sm font-light mb-8 max-w-xl mx-auto"
          >
            Search conceptually to instantly find matching events across
            thousands of published articles.
          </TextAnimate>
          <NewsSearchBar />
        </div>
        {initialNews.length === 0 && q ? (
          <div className="flex flex-col items-center justify-center p-12 text-center text-neutral-400">
            <span className="text-6xl mb-4">📭</span>
            <h2 className="text-xl font-bold text-white mb-2">
              No Matching Signals
            </h2>
            <p>We couldn't conceptualize any reports matching "{q}".</p>
          </div>
        ) : (
          <NewsFeed
            initialNews={initialNews}
            searchQuery={q}
            initialCategory="All"
          />
        )}
      </div>
      <NewsOnboarding />
    </>
  );
}
