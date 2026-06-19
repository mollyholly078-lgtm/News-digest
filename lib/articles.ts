import { prisma } from './prisma'
import { parseJsonField, slugify } from './utils'
import type { Article } from '@/types'

// Articles older than this are excluded from all "current" feeds.
// The home page, category pages, breaking news, etc. only show recent content.
// Seeded/admin-approved articles are exempt via the `featured` flag bypass.
const RECENCY_HOURS = 48
function recentCutoff() {
  return new Date(Date.now() - RECENCY_HOURS * 60 * 60 * 1000)
}

export async function getApprovedArticles(options?: {
  category?: string
  limit?: number
  skip?: number
  featured?: boolean
  /** Pass true to bypass the recency cutoff (e.g. search, bookmarks) */
  allTime?: boolean
}) {
  const { category, limit = 20, skip = 0, featured, allTime = false } = options ?? {}

  const where: Record<string, unknown> = { approved: true }
  if (category) where.category = category
  if (featured !== undefined) where.featured = featured
  // Only show articles published within the recency window unless allTime is requested
  if (!allTime) where.publishedAt = { gte: recentCutoff() }

  const articles = await prisma.article.findMany({
    where,
    orderBy: { publishedAt: 'desc' }, // sort by actual RSS pubDate, not scrape time
    take: limit,
    skip,
  })

  return articles.map(parseArticle)
}

export async function getArticleBySlug(slug: string) {
  const article = await prisma.article.findUnique({ where: { slug } })
  if (!article) return null
  return parseArticle(article)
}

export async function getRelatedArticles(articleId: string, category: string, limit = 4) {
  const articles = await prisma.article.findMany({
    where: {
      approved: true,
      category,
      NOT: { id: articleId },
      publishedAt: { gte: recentCutoff() },
    },
    orderBy: { publishedAt: 'desc' },
    take: limit,
  })
  return articles.map(parseArticle)
}

export async function searchArticles(query: string, filters?: { category?: string }) {
  // Search is allTime — users may want to find older articles explicitly
  const where: Record<string, unknown> = {
    approved: true,
    OR: [
      { headline: { contains: query } },
      { summary: { contains: query } },
      { keywords: { contains: query } },
    ],
  }
  if (filters?.category) where.category = filters.category

  const articles = await prisma.article.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
    take: 30,
  })
  return articles.map(parseArticle)
}

export async function getTodaysTopStories(limit = 10) {
  // First try: approved articles within the recency window ranked by upscScore
  const recent = await prisma.article.findMany({
    where: {
      approved: true,
      publishedAt: { gte: recentCutoff() },
    },
    orderBy: [{ featured: 'desc' }, { upscScore: 'desc' }, { publishedAt: 'desc' }],
    take: limit,
  })

  // Fall back to all-time top stories if no recent articles exist (e.g. fresh install)
  if (recent.length > 0) return recent.map(parseArticle)

  const fallback = await prisma.article.findMany({
    where: { approved: true },
    orderBy: [{ featured: 'desc' }, { upscScore: 'desc' }, { publishedAt: 'desc' }],
    take: limit,
  })
  return fallback.map(parseArticle)
}

export async function getWeeklyTopArticles() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const articles = await prisma.article.findMany({
    where: { approved: true, publishedAt: { gte: weekAgo } },
    orderBy: [{ upscScore: 'desc' }, { publishedAt: 'desc' }],
    take: 30,
  })
  return articles.map(parseArticle)
}

export async function getMonthlyArticles() {
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const articles = await prisma.article.findMany({
    where: { approved: true, publishedAt: { gte: monthAgo } },
    orderBy: [{ category: 'asc' }, { upscScore: 'desc' }],
  })
  return articles.map(parseArticle)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseArticle(raw: any): Article {
  return {
    ...raw,
    keyFacts: parseJsonField<string[]>(raw.keyFacts, []),
    mcqQuestion: parseJsonField(raw.mcqQuestion, { question: '', options: [], correct: 0, explanation: '' }),
    keywords: parseJsonField<string[]>(raw.keywords, []),
  }
}

export async function createArticle(data: Partial<Article> & { headline: string; summary: string; category: string }) {
  const slug = slugify(data.headline) + '-' + Date.now()
  return prisma.article.create({
    data: {
      slug,
      headline: data.headline,
      summary: data.summary,
      background: data.background ?? '',
      whyItMatters: data.whyItMatters ?? '',
      keyFacts: JSON.stringify(data.keyFacts ?? []),
      mcqQuestion: JSON.stringify(data.mcqQuestion ?? {}),
      mainsQuestion: data.mainsQuestion ?? '',
      keywords: JSON.stringify(data.keywords ?? []),
      category: data.category,
      upscScore: data.upscScore ?? 5,
      readingTime: data.readingTime ?? 3,
      sourceUrl: data.sourceUrl ?? '',
      sourceName: data.sourceName ?? '',
      imageUrl: data.imageUrl ?? '',
      approved: data.approved ?? false,
      featured: data.featured ?? false,
    },
  })
}
