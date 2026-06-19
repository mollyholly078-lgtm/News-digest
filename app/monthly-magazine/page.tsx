import type { Metadata } from 'next'
import { getMonthlyArticles } from '@/lib/articles'
import { CATEGORIES } from '@/types'
import { categoryColor } from '@/lib/utils'
import Link from 'next/link'
import { BookText, Calendar } from 'lucide-react'
import DownloadPdfButton from '@/components/magazine/DownloadPdfButton'

export const metadata: Metadata = {
  title: 'Monthly Magazine — Complete Current Affairs Compilation',
  description: 'Download the complete monthly current affairs PDF. Category-wise compilation for UPSC, PCS, SSC and banking exams.',
}

export default async function MonthlyMagazinePage() {
  const articles = await getMonthlyArticles()
  const now = new Date()
  const monthName = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })

  const byCategory = CATEGORIES.map((cat) => ({
    ...cat,
    articles: articles.filter((a) => a.category === cat.slug),
  })).filter((c) => c.articles.length > 0)

  return (
    <div style={{ padding: '2rem 1.5rem 4rem' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent-light)', borderRadius: '9999px', padding: '0.375rem 0.875rem', marginBottom: '1rem', border: '1px solid var(--accent)' }}>
            <Calendar size={14} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent)' }}>{monthName}</span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Monthly Current Affairs Magazine
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1.5rem' }}>
            {articles.length} articles compiled across {byCategory.length} categories this month.
          </p>
          <DownloadPdfButton monthName={monthName} />
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
          {byCategory.map((cat) => (
            <a key={cat.slug} href={`#cat-${cat.slug}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ padding: '1.25rem', textAlign: 'center', borderTop: `3px solid ${cat.color}` }}>
                <p style={{ fontSize: '2rem', fontWeight: 900, color: cat.color }}>{cat.articles.length}</p>
                <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{cat.label}</p>
              </div>
            </a>
          ))}
        </div>

        {/* Category sections */}
        {byCategory.map((cat) => (
          <section key={cat.slug} id={`cat-${cat.slug}`} style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: `2px solid ${cat.color}` }}>
              <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: cat.color }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{cat.label}</h2>
              <span style={{ marginLeft: 'auto', fontSize: '0.8125rem', color: 'var(--text-muted)', background: 'var(--bg-elevated)', padding: '0.25rem 0.625rem', borderRadius: '9999px' }}>
                {cat.articles.length} articles
              </span>
            </div>

            <div style={{ display: 'grid', gap: '0.875rem' }}>
              {cat.articles.map((article, i) => (
                <div key={article.id} style={{ display: 'flex', gap: '1rem', padding: '1rem 1.25rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', borderLeft: `3px solid ${cat.color}` }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-muted)', minWidth: '1.5rem' }}>{i + 1}.</span>
                  <div style={{ flex: 1 }}>
                    <Link href={`/article/${article.slug}`} style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9375rem', lineHeight: 1.4, display: 'block', marginBottom: '0.375rem' }}>
                      {article.headline}
                    </Link>
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      {article.summary.slice(0, 120)}…
                    </p>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: categoryColor(article.category), background: categoryColor(article.category) + '20', padding: '0.25rem 0.5rem', borderRadius: '9999px', height: 'fit-content', whiteSpace: 'nowrap' }}>
                    {article.upscScore}/10
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}

        {articles.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <BookText size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No articles this month yet</h3>
            <p style={{ color: 'var(--text-muted)' }}>Check back as articles get approved through the admin panel.</p>
          </div>
        )}
      </div>
    </div>
  )
}
