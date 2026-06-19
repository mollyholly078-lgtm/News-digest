import type { Metadata } from 'next'
import { getWeeklyTopArticles } from '@/lib/articles'
import ArticleCard from '@/components/articles/ArticleCard'
import { CATEGORIES } from '@/types'
import Link from 'next/link'
import { RotateCcw, TrendingUp, BookOpen } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Weekly Revision — Top Current Affairs This Week',
  description: 'Revise the most important current affairs of the week. Categorized summaries, key topics, and a quick quiz.',
}

export default async function WeeklyRevisionPage() {
  const articles = await getWeeklyTopArticles()

  const byCategory = CATEGORIES.map((cat) => ({
    ...cat,
    articles: articles.filter((a) => a.category === cat.slug).slice(0, 5),
  })).filter((cat) => cat.articles.length > 0)

  const topArticles = articles.slice(0, 10)
  const now = new Date()
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - 7)

  return (
    <div style={{ padding: '2rem 1.5rem 4rem' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>
        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent-light)', borderRadius: '9999px', padding: '0.375rem 0.875rem', marginBottom: '1rem', border: '1px solid var(--accent)' }}>
            <RotateCcw size={14} style={{ color: 'var(--accent)' }} />
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent)' }}>
              Weekly Revision — {weekStart.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} to {now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            This Week in Current Affairs
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            {articles.length} stories curated from the past 7 days, ranked by UPSC relevance.
          </p>
        </div>

        <div className="sidebar-grid">
          {/* Main content */}
          <div>
            {/* Top 10 */}
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                <TrendingUp size={20} style={{ color: 'var(--accent)' }} />
                Most Important Stories
              </h2>
              {topArticles.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No articles this week yet. Check back daily!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {topArticles.map((article, i) => (
                    <div key={article.id} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--border)', minWidth: '2rem', lineHeight: 1 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <ArticleCard article={article} variant="compact" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* By category */}
            {byCategory.map((cat) => (
              <div key={cat.slug} style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.125rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: `2px solid ${cat.color}`, display: 'inline-block' }}>
                  {cat.label}
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {cat.articles.map((article) => (
                    <ArticleCard key={article.id} article={article} variant="compact" />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <aside className="sidebar-sticky" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BookOpen size={16} style={{ color: 'var(--accent)' }} /> Revision Checklist
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {['Read top 10 stories', 'Note key facts', 'Attempt weekly quiz', 'Revise MCQs', 'Review mains questions', 'Download PDF notes'].map((item, i) => (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.875rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                    <input type="checkbox" style={{ accentColor: 'var(--accent)' }} />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: '1.25rem', background: 'linear-gradient(135deg, #1E40AF, #2563EB)', border: 'none' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Monthly Magazine</h3>
              <p style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.8)', marginBottom: '0.875rem', lineHeight: 1.5 }}>
                Download this month&apos;s complete current affairs compilation.
              </p>
              <Link href="/monthly-magazine" style={{ display: 'block', background: 'white', color: '#1D4ED8', textAlign: 'center', padding: '0.625rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none' }}>
                Download PDF
              </Link>
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Weekly Quiz</h3>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.875rem', lineHeight: 1.5 }}>
                Test your knowledge from this week&apos;s articles.
              </p>
              <Link href="/daily-quiz" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem', textDecoration: 'none' }}>
                Start Quiz
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
