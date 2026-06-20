import { prisma } from '@/lib/prisma'
import type { Article } from '@prisma/client'
import ArticleQueue from '@/components/admin/ArticleQueue'

export const metadata = {
  title: 'Review Queue — NewsDigest Admin',
}

export default async function AdminArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
  })

  // Format articles for the client component (dates to ISO strings)
  const formattedArticles = articles.map((art: Article) => ({
    id: art.id,
    headline: art.headline,
    category: art.category,
    upscScore: art.upscScore,
    sourceName: art.sourceName,
    sourceUrl: art.sourceUrl,
    publishedAt: art.publishedAt.toISOString(),
    approved: art.approved,
    slug: art.slug,
  }))

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          Article Review Queue
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
          Approve articles compiled by the AI pipeline to publish them on the frontend, or delete irrelevant feeds.
        </p>
      </div>

      <ArticleQueue initialArticles={formattedArticles} />
    </div>
  )
}
