import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Footer from '@/components/custom/landing/Footer'
import { ThemeToggle } from '@/components/custom/news/ThemeToggle'
import { BookOpen, Calendar, User, ArrowRight, Rss } from 'lucide-react'
import { Metadata } from 'next'

// Prevent route caching so new posts show up instantly
export const revalidate = 0

export const metadata: Metadata = {
  title: 'NeuralPress Insights | AI-Native News API Blog',
  description: 'Technical articles on semantic news retrieval, Vector search, LLM-grounding context, and Model Context Protocol (MCP) integrations.',
  keywords: ['AI News API', 'Latest News API', 'Vector Search News', 'AI Grounding', 'Model Context Protocol', 'NeuralPress'],
  openGraph: {
    title: 'NeuralPress Insights | AI-Native News API Blog',
    description: 'Technical articles on semantic news retrieval, Vector search, LLM-grounding context, and Model Context Protocol (MCP) integrations.',
    url: 'https://neuralpress.site/blog',
    siteName: 'NeuralPress Insights',
    images: [
      {
        url: 'https://neuralpress.site/ogImage.webp',
        width: 1200,
        height: 630,
        alt: 'NeuralPress Insights Blog',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeuralPress Insights | AI-Native News API Blog',
    description: 'Technical articles on semantic news retrieval, Vector search, LLM-grounding context, and Model Context Protocol (MCP) integrations.',
    images: ['https://neuralpress.site/ogImage.webp'],
  },
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function BlogListingPage() {
  const payload = await getPayload({ config })
  
  // Fetch posts from PostgreSQL local database
  const postsData = await payload.find({
    collection: 'posts',
    sort: '-publishedDate',
    depth: 1, // populate featuredImage and relationships
  })

  const posts = postsData.docs
  const baseUrl = 'https://neuralpress.site'

  // Dynamic schema JSON-LD for the blog listing page
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'NeuralPress Insights',
    description: 'Technical articles on semantic news retrieval, Vector search, LLM-grounding context, and Model Context Protocol (MCP) integrations.',
    url: `${baseUrl}/blog`,
    publisher: {
      '@type': 'Organization',
      name: 'NeuralPress',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/main-logo.png`,
      },
    },
    blogPost: posts.map((post: any) => {
      const postImageUrl = typeof post.featuredImage === 'object' && post.featuredImage !== null
        ? (post.featuredImage.url.startsWith('http') ? post.featuredImage.url : `${baseUrl}${post.featuredImage.url}`)
        : `${baseUrl}/ogImage.webp`
      
      return {
        '@type': 'BlogPosting',
        '@id': `${baseUrl}/blog/${post.slug}`,
        headline: post.title,
        description: post.summary,
        datePublished: post.publishedDate,
        image: postImageUrl,
        url: `${baseUrl}/blog/${post.slug}`,
      }
    }),
  }

  return (
    <div className="min-h-screen bg-[#fafbfe] dark:bg-[#07090e] text-slate-800 dark:text-neutral-100 transition-colors duration-300 overflow-x-hidden selection:bg-indigo-500/30 pb-20 relative font-sans">
      {/* Dynamic SEO JSON-LD schema injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Glow backgrounds */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#2b86ff]/10 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-lime-400/5 rounded-full blur-[100px] pointer-events-none z-0" />

      {/* Capsule Navigation bar */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <header className="bg-white/70 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/[0.05] shadow-[0_10px_30px_rgba(0,0,0,0.02)] backdrop-blur-xl h-20 rounded-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/main-logo.png"
                width={36}
                height={36}
                className="w-8 h-8 object-contain logo-light"
                alt="NeuralPress"
              />
              <Image
                src="/main-logo-white.png"
                width={36}
                height={36}
                className="w-8 h-8 object-contain logo-dark"
                alt="NeuralPress"
              />
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Neural<span className="text-indigo-600 dark:text-indigo-400">Press</span>
              </span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-600 dark:text-neutral-300 font-medium">
            <Link
              href="/developer/news"
              className="hover:text-indigo-600 dark:hover:text-white transition font-light"
            >
              Discovery Feed
            </Link>
            <Link
              href="/how-it-works"
              className="hover:text-indigo-600 dark:hover:text-white transition font-light"
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              className="hover:text-indigo-600 dark:hover:text-white transition font-light"
            >
              Free API
            </Link>
            <Link
              href="/blog"
              className="text-indigo-600 dark:text-white transition font-bold"
            >
              Blog
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            {/* <ThemeToggle /> */}
            <Link
              href="/developer"
              className="px-5 py-2.5 rounded-full text-xs bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/10 hover:scale-[1.02] transition-all"
            >
              Get Access
            </Link>
          </div>
        </header>
      </div>

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        
        {/* Blog Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-4 tracking-wider uppercase">
            <Rss className="w-3.5 h-3.5" /> Insights & News
          </span>
          <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-slate-900 dark:text-white leading-tight">
            NeuralPress <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-[#2b86ff]">Insights</span>
          </h1>
          <p className="text-slate-500 dark:text-neutral-400 text-base sm:text-lg mt-4 font-light leading-relaxed">
            Deep-dives into conceptual news indexing, vector search, LLM-friendly APIs, and building next-generation AI agents.
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length === 0 ? (
          <div className="bg-white/40 dark:bg-white/[0.01] border border-slate-200/50 dark:border-white/[0.05] rounded-3xl p-16 text-center backdrop-blur-xl max-w-lg mx-auto">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-neutral-200">No Articles Yet</h3>
            <p className="text-slate-500 dark:text-neutral-400 text-sm mt-2">
              Our engineering team is drafting articles. Sign in to the CMS to publish the first one!
            </p>
            <Link
              href="/admin"
              className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-semibold hover:opacity-90 transition"
            >
              Go to CMS Admin
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post: any) => {
              // Extract featured image details
              const imageUrl = typeof post.featuredImage === 'object' && post.featuredImage !== null
                ? post.featuredImage.url
                : '/ogImage.webp'
              const imageAlt = typeof post.featuredImage === 'object' && post.featuredImage !== null
                ? post.featuredImage.alt
                : post.title

              return (
                <article
                  key={post.id}
                  className="group bg-white/50 dark:bg-white/[0.01] hover:bg-white dark:hover:bg-white/[0.02] border border-slate-200/60 dark:border-white/[0.04] rounded-[2rem] overflow-hidden transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] backdrop-blur-xl flex flex-col h-full"
                >
                  {/* Image container */}
                  <Link href={`/blog/${post.slug}`} className="block overflow-hidden relative aspect-[16/10] bg-slate-100 dark:bg-zinc-900">
                    <img
                      src={imageUrl || '/ogImage.webp'}
                      alt={imageAlt}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>

                  {/* Body Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-neutral-500 font-light">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(post.publishedDate)}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-zinc-800" />
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5" />
                        Engineering
                      </span>
                    </div>

                    {/* Title */}
                    <Link href={`/blog/${post.slug}`} className="block mt-4 group/title">
                      <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-snug group-hover/title:text-indigo-600 dark:group-hover/title:text-indigo-400 transition-colors duration-200 line-clamp-2">
                        {post.title}
                      </h2>
                    </Link>

                    {/* Summary */}
                    <p className="text-slate-500 dark:text-neutral-400 text-sm mt-3 font-light leading-relaxed line-clamp-3">
                      {post.summary}
                    </p>

                    {/* Read action */}
                    <div className="mt-auto pt-6 border-t border-slate-100 dark:border-white/[0.02] flex items-center justify-between">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 transition-colors"
                      >
                        Read Article <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
