import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Footer from '@/components/custom/landing/Footer'
import { ThemeToggle } from '@/components/custom/news/ThemeToggle'
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react'
import { Metadata } from 'next'
import Script from 'next/script'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

// Prevent route caching so changes update instantly
export const revalidate = 0

type Props = {
  params: Promise<{ slug: string }>
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

// Calculate approximate reading time
function getReadingTime(text: string) {
  const wordsPerMinute = 200
  const noOfWords = text.split(/\s+/).length
  const minutes = Math.ceil(noOfWords / wordsPerMinute)
  return `${minutes} min read`
}

// Dynamically generate SEO Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })
  
  const postData = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  const post = postData.docs[0] as any

  if (!post) {
    return {
      title: 'Article Not Found | NeuralPress',
    }
  }

  const baseUrl = 'https://neuralpress.site'
  const imageUrl = typeof post.featuredImage === 'object' && post.featuredImage !== null
    ? (post.featuredImage.url.startsWith('http') ? post.featuredImage.url : `${baseUrl}${post.featuredImage.url}`)
    : `${baseUrl}/ogImage.webp`

  return {
    title: `${post.title} | NeuralPress Insights`,
    description: post.summary,
    keywords: ['NeuralPress', 'AI News API', 'Developer Blog', 'Vector Search', post.title],
    openGraph: {
      title: post.title,
      description: post.summary,
      type: 'article',
      publishedTime: post.publishedDate,
      authors: ['NeuralPress Engineering'],
      images: [
        {
          url: imageUrl,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: [imageUrl],
    },
  }
}

// Lexical node TypeScript schema
type LexicalNode = {
  type: string
  text?: string
  format?: number
  style?: string
  children?: LexicalNode[]
  tag?: string
  listType?: 'bullet' | 'number'
  url?: string
  fields?: any
  value?: any
}

// Custom Lexical JSON to React JSX node serializer
function serializeLexical(nodes: LexicalNode[]): React.ReactNode[] {
  if (!nodes) return []

  return nodes.map((node, i) => {
    if (node.type === 'text') {
      let text = node.text || ''
      let isBold = node.format ? (node.format & 1) !== 0 : false
      let isItalic = node.format ? (node.format & 2) !== 0 : false
      let isStrikethrough = node.format ? (node.format & 4) !== 0 : false
      let isUnderline = node.format ? (node.format & 8) !== 0 : false
      let isCode = node.format ? (node.format & 16) !== 0 : false

      let element: React.ReactNode = text

      if (isBold) element = <strong key={i}>{element}</strong>
      if (isItalic) element = <em key={i}>{element}</em>
      if (isStrikethrough) element = <span key={i} className="line-through">{element}</span>
      if (isUnderline) element = <span key={i} className="underline">{element}</span>
      if (isCode) {
        element = (
          <code key={i} className="bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-xs text-indigo-600 dark:text-indigo-400 font-mono">
            {element}
          </code>
        )
      }

      return <React.Fragment key={i}>{element}</React.Fragment>
    }

    const children = node.children ? serializeLexical(node.children) : null

    switch (node.type) {
      case 'paragraph':
        return (
          <p key={i} className="text-slate-700 dark:text-neutral-300 leading-relaxed text-base md:text-lg mb-6 font-light">
            {children}
          </p>
        )
      case 'heading':
        const tag = node.tag || 'h2'
        const headingClasses: Record<string, string> = {
          h1: 'text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white mt-12 mb-4 leading-tight',
          h2: 'text-2xl md:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-10 mb-4 leading-tight',
          h3: 'text-xl md:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white mt-8 mb-3 leading-tight',
          h4: 'text-lg md:text-xl font-semibold tracking-tight text-slate-900 dark:text-white mt-6 mb-2 leading-tight',
        }
        const HeadingTag = tag as keyof JSX.IntrinsicElements
        return (
          <HeadingTag key={i} className={headingClasses[tag] || headingClasses.h2}>
            {children}
          </HeadingTag>
        )
      case 'list':
        if (node.listType === 'number') {
          return (
            <ol key={i} className="list-decimal pl-6 mb-6 text-slate-700 dark:text-neutral-300 space-y-2.5 font-light text-base md:text-lg">
              {children}
            </ol>
          )
        } else {
          return (
            <ul key={i} className="list-disc pl-6 mb-6 text-slate-700 dark:text-neutral-300 space-y-2.5 font-light text-base md:text-lg">
              {children}
            </ul>
          )
        }
      case 'listitem':
        return <li key={i} className="leading-relaxed">{children}</li>
      case 'quote':
        return (
          <blockquote key={i} className="border-l-4 border-indigo-500 pl-4 py-2 my-8 italic text-slate-500 dark:text-neutral-400 bg-indigo-50/20 dark:bg-indigo-500/[0.01] rounded-r-lg font-light text-base md:text-lg">
            {children}
          </blockquote>
        )
      case 'link':
        const linkUrl = node.fields?.url || node.url
        return (
          <a
            key={i}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-normal cursor-pointer"
          >
            {children}
          </a>
        )
      case 'upload':
        const value = node.value
        if (value && typeof value === 'object' && value.url) {
          return (
            <figure key={i} className="my-10 overflow-hidden rounded-2xl border border-slate-200/50 dark:border-white/[0.03] shadow-lg bg-slate-50 dark:bg-zinc-950">
              <img
                src={value.url}
                alt={value.alt || 'Media upload'}
                className="w-full h-auto object-cover max-h-[600px] mx-auto"
              />
              {value.alt && (
                <figcaption className="p-4 text-center text-xs text-slate-400 dark:text-neutral-500 font-light border-t border-slate-200/30 dark:border-white/[0.01] bg-slate-50/50 dark:bg-white/[0.01]">
                  {value.alt}
                </figcaption>
              )}
            </figure>
          )
        }
        return null
      case 'autolink':
        return (
          <a
            key={i}
            href={node.fields?.url || node.url}
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-normal"
          >
            {children}
          </a>
        )
      case 'block':
        const blockFields = node.fields
        if (blockFields && blockFields.blockType === 'Code') {
          const codeLanguage = blockFields.language || 'typescript'
          const codeString = blockFields.code || ''
          
          let highlighted = codeString
          try {
            highlighted = hljs.getLanguage(codeLanguage)
              ? hljs.highlight(codeString, { language: codeLanguage }).value
              : hljs.highlightAuto(codeString).value
          } catch (err) {
            console.error('Syntax highlighting error:', err)
          }

          return (
            <div key={i} className="my-8 rounded-2xl overflow-hidden border border-slate-200/60 dark:border-white/[0.04] shadow-lg bg-[#0d1117] dark:bg-zinc-950/80 text-neutral-100 font-mono text-sm leading-relaxed">
              <div className="bg-[#161b22] dark:bg-zinc-900/60 px-4 py-2 border-b border-slate-700/30 dark:border-white/[0.02] flex items-center justify-between text-xs text-slate-400">
                <span className="uppercase font-bold tracking-wider text-indigo-400 font-sans">{codeLanguage}</span>
                <button
                  data-code={encodeURIComponent(codeString)}
                  className="copy-btn hover:text-white transition cursor-pointer flex items-center gap-1 font-sans text-xs bg-white/5 dark:bg-white/[0.02] hover:bg-white/10 dark:hover:bg-white/5 border border-slate-700/40 dark:border-white/[0.05] rounded-md px-2.5 py-1"
                >
                  Copy
                </button>
              </div>
              <pre className="p-5 overflow-x-auto text-left bg-transparent">
                <code
                  className={`hljs language-${codeLanguage}`}
                  dangerouslySetInnerHTML={{ __html: highlighted }}
                />
              </pre>
            </div>
          )
        }
        return null
      default:
        return <React.Fragment key={i}>{children}</React.Fragment>
    }
  })
}

function LexicalRenderer({ content }: { content: any }) {
  if (!content || !content.root || !content.root.children) return null
  return <>{serializeLexical(content.root.children)}</>
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config })
  
  // Query article by slug
  const postData = await payload.find({
    collection: 'posts',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 1,
  })

  const post = postData.docs[0] as any

  if (!post) {
    notFound()
  }

  // Get raw text representation to compute reading time
  let rawText = ''
  const accumulateText = (nodes: LexicalNode[]) => {
    if (!nodes) return
    for (const node of nodes) {
      if (node.type === 'text' && node.text) {
        rawText += node.text + ' '
      } else if (node.children) {
        accumulateText(node.children)
      }
    }
  }
  if (post.content && post.content.root && post.content.root.children) {
    accumulateText(post.content.root.children)
  }
  const readingTime = getReadingTime(rawText)

  const baseUrl = 'https://neuralpress.site'
  const imageUrl = typeof post.featuredImage === 'object' && post.featuredImage !== null
    ? (post.featuredImage.url.startsWith('http') ? post.featuredImage.url : `${baseUrl}${post.featuredImage.url}`)
    : `${baseUrl}/ogImage.webp`
  const imageAlt = typeof post.featuredImage === 'object' && post.featuredImage !== null
    ? post.featuredImage.alt
    : post.title

  // Dynamic schema JSON-LD for Google Rich snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    image: imageUrl,
    datePublished: post.publishedDate,
    dateModified: post.updatedAt || post.publishedDate,
    author: {
      '@type': 'Organization',
      name: 'NeuralPress Engineering',
      url: baseUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'NeuralPress',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/main-logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${baseUrl}/blog/${post.slug}`,
    },
  }

  return (
    <div className="min-h-screen bg-[#fafbfe] dark:bg-[#07090e] text-slate-800 dark:text-neutral-100 transition-colors duration-300 overflow-x-hidden selection:bg-indigo-500/30 pb-20 relative font-sans">
      {/* Dynamic SEO JSON-LD schema injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Inline Reading Progress bar */}
      <div id="scroll-progress" className="fixed top-0 left-0 h-1 bg-indigo-600 dark:bg-indigo-500 z-50 transition-all duration-100" style={{ width: '0%' }}></div>
      <Script id="blog-article-interactive-logic" strategy="afterInteractive">
        {`
          window.addEventListener('scroll', () => {
            const winScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
            const progressEl = document.getElementById('scroll-progress');
            if (progressEl) {
              progressEl.style.width = scrolled + '%';
            }
          });

          document.addEventListener('click', (e) => {
            const btn = e.target.closest('.copy-btn');
            if (btn) {
              const code = decodeURIComponent(btn.getAttribute('data-code'));
              
              const doVisualTransition = () => {
                const originalText = btn.innerText;
                btn.innerText = 'Copied!';
                btn.classList.add('text-emerald-400');
                setTimeout(() => {
                  btn.innerText = originalText;
                  btn.classList.remove('text-emerald-400');
                }, 1500);
              };

              if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(code)
                  .then(doVisualTransition)
                  .catch((err) => {
                    console.warn('Clipboard writeText failed, using fallback:', err);
                    runFallbackCopy(code, doVisualTransition);
                  });
              } else {
                runFallbackCopy(code, doVisualTransition);
              }
            }
          });

          function runFallbackCopy(text, callback) {
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
              document.execCommand('copy');
              callback();
            } catch (e) {
              console.error('Fallback copy command failed:', e);
            }
            document.body.removeChild(textArea);
          }
        `}
      </Script>

      {/* Glow ambient spots */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-[#2b86ff]/10 via-transparent to-transparent pointer-events-none z-0" />
      <div className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-indigo-500/5 rounded-full blur-[130px] pointer-events-none z-0" />

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
              className="hover:text-indigo-600 dark:hover:text-white transition"
            >
              Discovery Feed
            </Link>
            <Link
              href="/how-it-works"
              className="hover:text-indigo-600 dark:hover:text-white transition"
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              className="hover:text-indigo-600 dark:hover:text-white transition"
            >
              API Pricing
            </Link>
            <Link
              href="/blog"
              className="hover:text-indigo-600 dark:hover:text-white transition font-bold"
            >
              Blog
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/developer"
              className="px-5 py-2.5 rounded-full text-xs bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/10 hover:scale-[1.02] transition-all"
            >
              Get Access
            </Link>
          </div>
        </header>
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-8 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to blog list
        </Link>

        {/* Article Metadata Header */}
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-slate-900 dark:text-white leading-tight mb-6 text-wrap:pretty">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-neutral-400 font-light pb-6 border-b border-slate-200/50 dark:border-white/[0.04]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500" />
              <span>{formatDate(post.publishedDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-500" />
              <span>By NeuralPress Engineering</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-500" />
              <span>{readingTime}</span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="aspect-[21/10] relative rounded-[2rem] overflow-hidden mb-12 shadow-lg border border-slate-200/50 dark:border-white/[0.03] bg-slate-100 dark:bg-zinc-900">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Rich Text Body Content */}
        <article className="prose prose-slate dark:prose-invert max-w-none">
          {post.content && (
            <LexicalRenderer content={post.content} />
          )}
        </article>
      </main>

      <Footer />
    </div>
  )
}
