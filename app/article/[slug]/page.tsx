import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArticleBySlug, getRelatedArticles } from '@/lib/articles'
import { categoryColor, categoryLabel, formatDate } from '@/lib/utils'
import ArticleCard from '@/components/articles/ArticleCard'
import { Clock, ExternalLink, Star, ArrowLeft, CheckCircle } from 'lucide-react'

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params
  const article = await getArticleBySlug(slug)
  if (!article) return { title: 'Article Not Found' }
  return {
    title: article.headline,
    description: article.summary.slice(0, 160),
    openGraph: {
      title: article.headline,
      description: article.summary.slice(0, 160),
      type: 'article',
      publishedTime: article.publishedAt.toISOString(),
    },
  }
}

export default async function ArticlePage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const article = await getArticleBySlug(slug)
  if (!article) notFound()

  const related = await getRelatedArticles(article.id, article.category, 3)
  const color = categoryColor(article.category)
  const label = categoryLabel(article.category)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.headline,
    description: article.summary,
    datePublished: article.publishedAt.toISOString(),
    publisher: { '@type': 'Organization', name: 'NewsDigest' },
    author: { '@type': 'Organization', name: article.sourceName || 'NewsDigest' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container" style={{ maxWidth: '860px', padding: '2rem 1.5rem 4rem' }}>
        {/* Back */}
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.5rem', transition: 'color 0.2s' }}>
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Header */}
        <header style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <span className="badge" style={{ background: color + '20', color }}>{label}</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{formatDate(article.publishedAt)}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <Clock size={14} /> {article.readingTime} min read
            </span>
          </div>

          <h1 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: '1.25rem' }}>
            {article.headline}
          </h1>

          {/* UPSC Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1rem 1.25rem', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={16} style={{ color: '#F59E0B', fill: '#F59E0B' }} />
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>
                UPSC Relevance: {article.upscScore}/10
              </span>
            </div>
            <div style={{ flex: 1, minWidth: '120px' }}>
              <div className="score-bar">
                <div className="score-fill" style={{ width: `${article.upscScore * 10}%` }} />
              </div>
            </div>
            {article.sourceUrl && (
              <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.8125rem', color: 'var(--accent)', fontWeight: 600 }}>
                <ExternalLink size={14} /> {article.sourceName || 'Source'}
              </a>
            )}
          </div>
        </header>

        <div className="prose-article" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Summary */}
          <Section title="Summary" accent>
            <p style={{ fontSize: '1.0625rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>{article.summary}</p>
          </Section>

          {/* Background */}
          {article.background && (
            <Section title="Background">
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{article.background}</p>
            </Section>
          )}

          {/* Why It Matters */}
          {article.whyItMatters && (
            <Section title="Why It Matters">
              <div style={{ background: 'var(--accent-light)', borderLeft: '4px solid var(--accent)', padding: '1rem 1.25rem', borderRadius: '0 var(--radius-sm) var(--radius-sm) 0' }}>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{article.whyItMatters}</p>
              </div>
            </Section>
          )}

          {/* Key Facts */}
          {article.keyFacts?.length > 0 && (
            <Section title="Key Facts">
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {article.keyFacts.map((fact, i) => (
                  <li key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <CheckCircle size={18} style={{ color: '#16A34A', flexShrink: 0, marginTop: '2px' }} />
                    <span style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{fact}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {/* MCQ Question */}
          {article.mcqQuestion?.question && (
            <Section title="Possible Prelims Question">
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                  Q. {article.mcqQuestion.question}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(article.mcqQuestion.options ?? []).map((opt, i) => (
                    <div key={i} style={{
                      padding: '0.625rem 1rem', borderRadius: 'var(--radius-sm)',
                      background: i === article.mcqQuestion.correct ? '#F0FDF4' : 'var(--bg)',
                      border: `1px solid ${i === article.mcqQuestion.correct ? '#16A34A' : 'var(--border)'}`,
                      color: i === article.mcqQuestion.correct ? '#16A34A' : 'var(--text-secondary)',
                      fontSize: '0.9375rem', fontWeight: i === article.mcqQuestion.correct ? 600 : 400,
                    }}>
                      {String.fromCharCode(65 + i)}. {opt}
                      {i === article.mcqQuestion.correct && ' ✓'}
                    </div>
                  ))}
                </div>
                {article.mcqQuestion.explanation && (
                  <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: 'var(--accent-light)', borderRadius: 'var(--radius-sm)' }}>
                    <span style={{ fontWeight: 600, color: 'var(--accent)', fontSize: '0.8125rem' }}>Explanation: </span>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{article.mcqQuestion.explanation}</span>
                  </div>
                )}
              </div>
            </Section>
          )}

          {/* Mains Question */}
          {article.mainsQuestion && (
            <Section title="Possible Mains Question">
              <div style={{ background: 'linear-gradient(135deg, #EFF6FF, #F0FDF4)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem' }}>
                <p style={{ fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  {article.mainsQuestion}
                </p>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                  Tip: Structure your answer with Introduction → Key Points → Analysis → Conclusion
                </p>
              </div>
            </Section>
          )}

          {/* Keywords */}
          {article.keywords?.length > 0 && (
            <Section title="Keywords">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {article.keywords.map((kw) => (
                  <span key={kw} style={{ padding: '0.375rem 0.75rem', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 500 }}>
                    #{kw}
                  </span>
                ))}
              </div>
            </Section>
          )}

          {/* Source */}
          {article.sourceUrl && (
            <Section title="Sources">
              <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent)', fontWeight: 600, fontSize: '0.9375rem' }}>
                <ExternalLink size={16} /> {article.sourceName || article.sourceUrl}
              </a>
            </Section>
          )}
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
              Related Topics
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} variant="compact" />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function Section({ title, children, accent }: { title: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <div>
      <h2 style={{
        fontSize: '1.0625rem', fontWeight: 700, color: accent ? 'var(--accent)' : 'var(--text-primary)',
        marginBottom: '0.875rem', paddingBottom: '0.5rem',
        borderBottom: `2px solid ${accent ? 'var(--accent)' : 'var(--border)'}`,
        display: 'inline-block',
      }}>
        {title}
      </h2>
      {children}
    </div>
  )
}
