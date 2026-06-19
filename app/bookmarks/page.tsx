import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleCard from '@/components/articles/ArticleCard'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/session'
import { parseJsonField } from '@/lib/utils'
import { Bookmark, Lock } from 'lucide-react'
import type { Article } from '@/types'

export const metadata: Metadata = {
  title: 'My Bookmarks — NewsDigest',
  description: 'Your saved articles and current affairs revision notes.',
}

// Helper to parse database Article representation into TypeScript Article interface
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseArticle(raw: any): Article {
  return {
    ...raw,
    keyFacts: parseJsonField<string[]>(raw.keyFacts, []),
    mcqQuestion: parseJsonField(raw.mcqQuestion, { question: '', options: [], correct: 0, explanation: '' }),
    keywords: parseJsonField<string[]>(raw.keywords, []),
  }
}

export default async function BookmarksPage() {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', maxWidth: '600px', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3rem 2rem' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', background: 'var(--accent-light)', borderRadius: '50%', color: 'var(--accent)', marginBottom: '1.5rem' }}>
            <Lock size={32} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Access Restricted
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', marginBottom: '2rem', lineHeight: 1.5 }}>
            Please sign in to your account to view your bookmarked articles, revision checklist, and saved notes.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/login?redirect=/bookmarks" className="btn btn-primary">
              Log In
            </Link>
            <Link href="/register" className="btn btn-outline" style={{ border: '1px solid var(--border)', padding: '0.625rem 1.25rem', borderRadius: 'var(--radius-sm)', textDecoration: 'none', color: 'var(--text-secondary)' }}>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Fetch Bookmarks
  const bookmarksData = await prisma.bookmark.findMany({
    where: { userId: currentUser.id },
    include: {
      article: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  const savedArticles = bookmarksData
    .filter((b) => b.article.approved)
    .map((b) => parseArticle(b.article))

  return (
    <div style={{ padding: '2rem 1.5rem 4rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.75rem', background: 'var(--accent-light)', borderRadius: 'var(--radius-sm)', color: 'var(--accent)' }}>
            <Bookmark size={24} style={{ fill: 'var(--accent)' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              My Bookmarks
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Saved summaries, background notes, and revision questions for {currentUser.name}.
            </p>
          </div>
        </div>

        {/* Saved List */}
        <div>
          {savedArticles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', borderStyle: 'dashed' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔖</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Your Bookmark Shelf is Empty
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', maxWidth: '420px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
                When reading articles, click the bookmark button to save them here for quick revision later.
              </p>
              <Link href="/" className="btn btn-primary">
                Browse Articles
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Saved Summaries ({savedArticles.length})
              </h2>
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                {savedArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
