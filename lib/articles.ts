import { prisma } from './prisma'
import { parseJsonField, slugify } from './utils'
import type { Article } from '@/types'

const RECENCY_HOURS = 48
function recentCutoff() {
  return new Date(Date.now() - RECENCY_HOURS * 60 * 60 * 1000)
}

export async function getApprovedArticles(options?: {
  category?: string
  limit?: number
  skip?: number
  featured?: boolean
  allTime?: boolean
}): Promise<Article[]> {
  const { category, limit = 20, skip = 0, featured, allTime = false } = options ?? {}

  const where: Record<string, unknown> = { approved: true }
  if (category) where.category = category
  if (featured !== undefined) where.featured = featured
  if (!allTime) where.publishedAt = { gte: recentCutoff() }

  const articles = await prisma.article.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
    take: limit,
    skip,
  })

  return articles.map(parseArticle)
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const article = await prisma.article.findUnique({ where: { slug } })
  if (!article) return null
  return parseArticle(article)
}

export async function getRelatedArticles(articleId: string, category: string, limit = 4): Promise<Article[]> {
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

export async function searchArticles(query: string, filters?: { category?: string }): Promise<Article[]> {
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

export async function getTodaysTopStories(limit = 10): Promise<Article[]> {
  const recent = await prisma.article.findMany({
    where: {
      approved: true,
      publishedAt: { gte: recentCutoff() },
    },
    orderBy: [{ featured: 'desc' }, { upscScore: 'desc' }, { publishedAt: 'desc' }],
    take: limit,
  })

  if (recent.length > 0) return recent.map(parseArticle)

  const fallback = await prisma.article.findMany({
    where: { approved: true },
    orderBy: [{ featured: 'desc' }, { upscScore: 'desc' }, { publishedAt: 'desc' }],
    take: limit,
  })
  return fallback.map(parseArticle)
}

export async function getWeeklyTopArticles(): Promise<Article[]> {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const articles = await prisma.article.findMany({
    where: { approved: true, publishedAt: { gte: weekAgo } },
    orderBy: [{ upscScore: 'desc' }, { publishedAt: 'desc' }],
    take: 30,
  })
  return articles.map(parseArticle)
}

export async function getMonthlyArticles(): Promise<Article[]> {
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
