import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleCard from '@/components/articles/ArticleCard'
import { searchArticles } from '@/lib/articles'
import { CATEGORIES, type Article } from '@/types'
import { Search, SlidersHorizontal, AlertCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Search Articles — NewsDigest',
  description: 'Search and filter daily current affairs articles by category, relevance, and keyword.',
}

interface PageProps {
  searchParams: Promise<{
    q?: string
    category?: string
  }>
}

export default async function SearchPage(props: PageProps) {
  const searchParams = await props.searchParams
  const query = searchParams.q || ''
  const activeCategory = searchParams.category || ''

  let articles: Article[] = []
  if (query || activeCategory) {
    articles = await searchArticles(query, {
      category: activeCategory || undefined,
    })
  }

  return (
    <div style={{ padding: '2rem 1.5rem 4rem' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Search Current Affairs
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Find UPSC relevant topics, background files, and questions from our repository.
          </p>
        </div>

        {/* Search bar + Filters */}
        <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {/* Search Form */}
          <form method="GET" action="/search" style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search headlines, keywords, or topics..."
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 2.75rem',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  outline: 'none',
                }}
              />
            </div>
            {activeCategory && <input type="hidden" name="category" value={activeCategory} />}
            <button type="submit" className="btn btn-primary" style={{ padding: '0 1.75rem' }}>
              Search
            </button>
          </form>

          {/* Category Filters */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginRight: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
              <SlidersHorizontal size={14} /> Filter:
            </span>
            <Link
              href={{ pathname: '/search', query: query ? { q: query } : {} }}
              style={{
                padding: '0.375rem 0.875rem',
                borderRadius: '9999px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                background: !activeCategory ? 'var(--accent)' : 'var(--bg-elevated)',
                color: !activeCategory ? 'white' : 'var(--text-secondary)',
                textDecoration: 'none',
              }}
            >
              All Categories
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={{
                  pathname: '/search',
                  query: {
                    ...(query ? { q: query } : {}),
                    category: cat.slug,
                  },
                }}
                style={{
                  padding: '0.375rem 0.875rem',
                  borderRadius: '9999px',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  background: activeCategory === cat.slug ? cat.color : 'var(--bg-elevated)',
                  color: activeCategory === cat.slug ? 'white' : 'var(--text-secondary)',
                  textDecoration: 'none',
                }}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Results */}
        <div>
          {query || activeCategory ? (
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                {articles.length} {articles.length === 1 ? 'Result' : 'Results'} found
              </h2>
              {articles.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <AlertCircle size={36} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
                  <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No results match your search</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Try different keywords or check another category filter.</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '1.25rem' }}>
                  {articles.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', borderStyle: 'dashed' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Start Searching
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', maxWidth: '400px', margin: '0 auto' }}>
                Enter a search term above or select a category to browse specific current affairs topics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
