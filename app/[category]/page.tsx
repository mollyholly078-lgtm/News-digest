import type { Metadata } from 'next'
import { getApprovedArticles } from '@/lib/articles'
import ArticleCard from '@/components/articles/ArticleCard'
import { CATEGORIES } from '@/types'
import Link from 'next/link'

const VALID = ['india', 'world', 'economy', 'science-technology', 'environment', 'polity-governance']

export async function generateMetadata(props: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await props.params
  const info = CATEGORIES.find((c) => c.slug === category)
  return {
    title: info ? `${info.label} News` : 'Category',
    description: info?.description,
  }
}

export default async function CategoryPage(props: { params: Promise<{ category: string }>; searchParams?: Promise<{ topic?: string }> }) {
  const { category } = await props.params
  if (!VALID.includes(category)) return <div>Category not found</div>

  const info = CATEGORIES.find((c) => c.slug === category)!
  let articles = await getApprovedArticles({ category, limit: 30 })

  // Filter by topic keyword if specified
  const searchParams = await props.searchParams
  const activeTopic = searchParams?.topic
  if (activeTopic) {
    const q = activeTopic.toLowerCase()
    articles = articles.filter((a) =>
      a.keywords.some((k) => k.toLowerCase().includes(q)) ||
      a.headline.toLowerCase().includes(q)
    )
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      {/* Header */}
      <div style={{ borderLeft: `4px solid ${info.color}`, paddingLeft: '1rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {info.label}
        </h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem' }}>{info.description}</p>
      </div>

      {/* Topic filters */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <span style={{ padding: '0.375rem 0.875rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 600, background: info.color, color: 'white' }}>
          All
        </span>
        {info.topics.map((topic) => {
          const isActive = activeTopic === topic
          return (
            <Link
              key={topic}
              href={isActive ? `/${category}` : `/${category}?topic=${encodeURIComponent(topic)}`}
              style={{
                padding: '0.375rem 0.875rem', borderRadius: '9999px', fontSize: '0.8125rem', fontWeight: 600,
                background: isActive ? info.color : 'var(--bg-elevated)',
                color: isActive ? 'white' : 'var(--text-muted)',
                textDecoration: 'none', transition: 'all 0.2s',
              }}
            >
              {topic}
            </Link>
          )
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(0, 280px)', gap: '2rem', alignItems: 'start' }}>
        {/* Articles */}
        <div>
          {articles.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <p style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{activeTopic ? 'No matching articles' : 'No articles yet'}</p>
              <p style={{ color: 'var(--text-muted)' }}>{activeTopic ? `No articles match the topic "${activeTopic}". Try a different filter.` : 'Articles in this category will appear here once approved.'}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: '80px' }}>
          <div className="card" style={{ padding: '1.25rem' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Other Categories
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {CATEGORIES.filter((c) => c.slug !== category).map((c) => (
                <Link key={c.slug} href={`/${c.slug}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.625rem', borderRadius: 'var(--radius-sm)', fontSize: '0.875rem', color: 'var(--text-secondary)', transition: 'all 0.2s' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                  {c.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="card" style={{ padding: '1.25rem', marginTop: '1rem', background: 'linear-gradient(135deg, var(--accent-light), var(--bg-card))' }}>
            <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '0.5rem' }}>
              📝 Daily Quiz
            </h3>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: '0.875rem', lineHeight: 1.5 }}>
              Test your knowledge of today&apos;s current affairs.
            </p>
            <Link href="/daily-quiz" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: '0.875rem' }}>
              Take Quiz
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
