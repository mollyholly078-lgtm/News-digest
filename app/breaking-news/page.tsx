'use client'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { CATEGORIES } from '@/types'

interface BreakingArticle {
  id: string
  slug: string
  headline: string
  summary: string
  category: string
  sourceName: string
  sourceUrl: string
  publishedAt: string
}

const REFRESH_INTERVAL = 30 * 60 * 1000

const categoryColors: Record<string, string> = {}
for (const cat of CATEGORIES) {
  categoryColors[cat.slug] = cat.color
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export default function BreakingNewsPage() {
  const [articles, setArticles] = useState<BreakingArticle[]>([])
  const [lastRefresh, setLastRefresh] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL)

  const fetchArticles = useCallback(async () => {
    try {
      const res = await fetch('/api/news/breaking')
      const data = await res.json()
      if (data.articles) {
        setArticles(data.articles)
        setLastRefresh(new Date().toLocaleTimeString())
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setTimeout(() => {
      fetchArticles()
    }, 0)
    const interval = setInterval(fetchArticles, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchArticles])

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev <= 1000 ? REFRESH_INTERVAL : prev - 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const formatCountdown = (ms: number) => {
    const mins = Math.floor(ms / 60000)
    const secs = Math.floor((ms % 60000) / 1000)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Breaking News</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Loading latest headlines…</p>
      </div>
    )
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.375rem',
            background: '#DC2626', color: 'white', padding: '0.25rem 0.75rem',
            borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white', display: 'inline-block' }} />
            Live
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>Breaking News</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          <span>Refreshes in {formatCountdown(countdown)}</span>
          <span>|</span>
          <span>Last: {lastRefresh || '—'}</span>
          <button onClick={fetchArticles} style={{
            background: 'var(--accent)', color: 'white', border: 'none',
            padding: '0.25rem 0.75rem', borderRadius: '0.375rem',
            fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer',
          }}>
            Refresh Now
          </button>
        </div>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '2rem' }}>
        Auto-updates every 30 minutes. {articles.length} stories from across the web.
      </p>

      {articles.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)' }}>No breaking news yet</p>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>News will appear here once fetched from RSS feeds.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {articles.map((article, i) => {
            const color = categoryColors[article.category] || '#6B7280'
            return (
              <Link
                key={article.id}
                href={`/article/${article.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  display: 'flex', gap: '1rem', padding: '1rem 1.25rem',
                  background: 'var(--bg-card)', borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)', transition: 'all 0.2s',
                  cursor: 'pointer', position: 'relative', overflow: 'hidden',
                }}>
                  {/* Timestamp line */}
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    minWidth: '48px', paddingTop: '0.125rem',
                  }}>
                    <span style={{
                      fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)',
                      whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums',
                    }}>
                      {timeAgo(article.publishedAt)}
                    </span>
                    {i < 3 && (
                      <span style={{
                        marginTop: '0.25rem', fontSize: '0.625rem',
                        background: '#DC2626', color: 'white', padding: '0.125rem 0.375rem',
                        borderRadius: '0.25rem', fontWeight: 700,
                      }}>
                        NEW
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: '0.6875rem', fontWeight: 600, color: 'white',
                        background: color, padding: '0.125rem 0.5rem',
                        borderRadius: '0.25rem',
                      }}>
                        {CATEGORIES.find((c) => c.slug === article.category)?.label || article.category}
                      </span>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                        {article.sourceName}
                      </span>
                    </div>
                    <h3 style={{
                      fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)',
                      lineHeight: 1.4, marginBottom: '0.25rem',
                    }}>
                      {article.headline}
                    </h3>
                    <p style={{
                      fontSize: '0.8125rem', color: 'var(--text-secondary)',
                      lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box',
                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                    }}>
                      {article.summary}
                    </p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
