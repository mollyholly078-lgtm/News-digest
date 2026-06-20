import Link from 'next/link'
import { Clock, ExternalLink, Star, TrendingUp } from 'lucide-react'
import { categoryColor, categoryLabel, formatRelativeDate } from '@/lib/utils'
import type { Article } from '@/types'
import BookmarkButton from './BookmarkButton'
import ShareButton from './ShareButton'

interface ArticleCardProps {
  article: Article
  variant?: 'default' | 'featured' | 'compact'
}

export default function ArticleCard({ article, variant = 'default' }: ArticleCardProps) {
  const color = categoryColor(article.category)
  const label = categoryLabel(article.category)

  if (variant === 'compact') {
    return (
      <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none' }}>
        <div className="card animate-fade-in" style={{ padding: '1rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{
            width: '4px', borderRadius: '2px', flexShrink: 0, alignSelf: 'stretch',
            background: color,
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem', flexWrap: 'wrap' }}>
              <span className="badge" style={{ background: color + '20', color }}>{label}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatRelativeDate(article.publishedAt)}</span>
            </div>
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
              {article.headline}
            </h3>
          </div>
        </div>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <div className="card animate-fade-in" style={{ padding: '2rem', background: 'linear-gradient(135deg, var(--accent-light), var(--bg-card))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <span className="badge" style={{ background: color + '20', color }}>{label}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600 }}>
            <TrendingUp size={12} /> Featured
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
            {formatRelativeDate(article.publishedAt)}
          </span>
        </div>

        <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none' }}>
          <h2 style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: '0.875rem' }}>
            {article.headline}
          </h2>
        </Link>

        <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
          {article.summary.slice(0, 200)}…
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              <Clock size={14} /> {article.readingTime} min read
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Star size={13} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
              <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                UPSC {article.upscScore}/10
              </span>
            </div>
          </div>
          <Link href={`/article/${article.slug}`} className="btn btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
            Read More
          </Link>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className="card animate-fade-in" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <span className="badge" style={{ background: color + '20', color }}>{label}</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
          {formatRelativeDate(article.publishedAt)}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <Clock size={12} /> {article.readingTime} min
        </span>
      </div>

      {/* Headline */}
      <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none' }}>
        <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, lineHeight: 1.4 }}
          className="article-title-hover">
          {article.headline}
        </h3>
      </Link>

      {/* Summary */}
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
        {article.summary.slice(0, 160)}…
      </p>

      {/* Why it matters */}
      {article.whyItMatters && (
        <div style={{ background: 'var(--accent-light)', borderLeft: '3px solid var(--accent)', padding: '0.625rem 0.875rem', borderRadius: '0 0.5rem 0.5rem 0' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            <span style={{ fontWeight: 700, color: 'var(--accent)' }}>Why it matters: </span>
            {article.whyItMatters.slice(0, 120)}…
          </p>
        </div>
      )}

      {/* UPSC Score bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>UPSC Relevance</span>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{article.upscScore}/10</span>
        </div>
        <div className="score-bar">
          <div className="score-fill" style={{ width: `${article.upscScore * 10}%` }} />
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.25rem', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {article.sourceUrl && (
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', color: 'var(--text-muted)', transition: 'color 0.2s' }}
              className="footer-link"
            >
              <ExternalLink size={12} /> {article.sourceName || 'Source'}
            </a>
          )}
        </div>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <ShareButton url={`/article/${article.slug}`} title={article.headline} />
          <BookmarkButton articleId={article.id} />
        </div>
      </div>
    </div>
  )
}
