'use client'
import { useState } from 'react'
import { approveArticle, deleteArticle } from '@/app/admin/actions'
import { Check, Trash2, ExternalLink, Calendar, Star, Loader2 } from 'lucide-react'
import { categoryColor, categoryLabel, formatDate } from '@/lib/utils'

interface Article {
  id: string
  headline: string
  category: string
  upscScore: number
  sourceName: string
  sourceUrl: string
  publishedAt: string
  approved: boolean
  slug: string
}

interface ArticleQueueProps {
  initialArticles: Article[]
}

export default function ArticleQueue({ initialArticles }: ArticleQueueProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleApprove = async (id: string) => {
    setLoadingId(id)
    const res = await approveArticle(id)
    setLoadingId(null)

    if (res.success) {
      setArticles((prev) =>
        prev.map((art) => (art.id === id ? { ...art, approved: true } : art))
      )
    } else {
      alert(res.error || 'Failed to approve article.')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return

    setLoadingId(id)
    const res = await deleteArticle(id)
    setLoadingId(null)

    if (res.success) {
      setArticles((prev) => prev.filter((art) => art.id !== id))
    } else {
      alert(res.error || 'Failed to delete article.')
    }
  }

  const pending = articles.filter((a) => !a.approved)
  const approved = articles.filter((a) => a.approved)

  return (
    <div style={{ display: 'grid', gap: '2.5rem' }}>
      {/* Pending Queue */}
      <section>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Pending Review
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '0.2rem 0.625rem', borderRadius: '9999px' }}>
            {pending.length}
          </span>
        </h2>

        {pending.length === 0 ? (
          <div style={{ padding: '3rem 2rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', borderStyle: 'dashed' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>No articles pending review. Run the news pipeline to fetch more!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {pending.map((art) => (
              <QueueCard
                key={art.id}
                art={art}
                onApprove={handleApprove}
                onDelete={handleDelete}
                loading={loadingId === art.id}
              />
            ))}
          </div>
        )}
      </section>

      {/* Approved List */}
      <section>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Approved Articles
          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '0.2rem 0.625rem', borderRadius: '9999px' }}>
            {approved.length}
          </span>
        </h2>

        {approved.length === 0 ? (
          <div style={{ padding: '3rem 2rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', borderStyle: 'dashed' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>No approved articles in database yet.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {approved.slice(0, 15).map((art) => (
              <QueueCard
                key={art.id}
                art={art}
                onDelete={handleDelete}
                loading={loadingId === art.id}
              />
            ))}
            {approved.length > 15 && (
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
                Showing the 15 most recent approved articles.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

interface QueueCardProps {
  art: Article
  onApprove?: (id: string) => void
  onDelete: (id: string) => void
  loading: boolean
}

function QueueCard({ art, onApprove, onDelete, loading }: QueueCardProps) {
  const color = categoryColor(art.category)
  const label = categoryLabel(art.category)

  return (
    <div className="card" style={{ padding: '1.25rem', display: 'flex', gap: '1.5rem', alignItems: 'center', borderLeft: `4px solid ${color}`, opacity: loading ? 0.6 : 1, transition: 'opacity 0.2s' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Category + Date */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
          <span className="badge" style={{ background: color + '18', color, fontSize: '0.75rem' }}>{label}</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Calendar size={12} /> {formatDate(art.publishedAt)}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Star size={12} style={{ color: '#F59E0B', fill: '#F59E0B' }} /> UPSC Relevance: {art.upscScore}/10
          </span>
        </div>

        {/* Headline */}
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.375rem', lineHeight: 1.4 }}>
          {art.approved ? (
            <a href={`/article/${art.slug}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              {art.headline} <ExternalLink size={12} style={{ color: 'var(--accent)' }} />
            </a>
          ) : (
            art.headline
          )}
        </h3>

        {/* Source */}
        {art.sourceUrl && (
          <a href={art.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.75rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            Source: {art.sourceName || 'Source Link'} <ExternalLink size={10} />
          </a>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
        {onApprove && !art.approved && (
          <button
            onClick={() => onApprove(art.id)}
            disabled={loading}
            className="btn btn-primary"
            style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: '#16A34A', color: 'white', border: 'none', minWidth: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Approve article"
          >
            {loading ? <Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> : <Check size={16} />}
          </button>
        )}
        <button
          onClick={() => onDelete(art.id)}
          disabled={loading}
          className="btn btn-outline"
          style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', borderColor: '#EF4444', color: '#EF4444', minWidth: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          title="Delete article"
        >
          {loading ? <Loader2 size={16} style={{ animation: 'spin 0.7s linear infinite' }} /> : <Trash2 size={16} />}
        </button>
      </div>
    </div>
  )
}
