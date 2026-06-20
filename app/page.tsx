import type { Metadata } from 'next'
import HeroSection from '@/components/home/HeroSection'
import ArticleCard from '@/components/articles/ArticleCard'
import { getTodaysTopStories, getApprovedArticles } from '@/lib/articles'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES, type Article } from '@/types'

export const metadata: Metadata = {
  title: 'NewsDigest — Daily Current Affairs for Competitive Exams',
  description: 'Read the most important current affairs in 15 minutes. AI-curated news for UPSC, PCS, SSC, Banking & Defence aspirants.',
}

export default async function HomePage() {
  const [topStories, recentArticles]: [Article[], Article[]] = await Promise.all([
    getTodaysTopStories(6),
    getApprovedArticles({ limit: 8 }),
  ])

  const featuredStory = topStories.find((a) => a.featured) ?? topStories[0]
  const gridStories = topStories.filter((a) => a.id !== featuredStory?.id).slice(0, 5)

  return (
    <>
      <HeroSection />

      {/* Category Quick Nav */}
      <section style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)', padding: '0.75rem 0', overflowX: 'auto' }}>
        <div className="container" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', flexShrink: 0 }}>Jump to:</span>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              style={{
                padding: '0.375rem 0.875rem',
                borderRadius: '9999px',
                fontSize: '0.8125rem',
                fontWeight: 600,
                background: cat.color + '18',
                color: cat.color,
                whiteSpace: 'nowrap',
                transition: 'all 0.2s',
                flexShrink: 0,
              }}
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Top Stories */}
      <section id="top-stories" style={{ padding: 'clamp(1.5rem, 4vw, 3rem) 0' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Today&apos;s Top Stories
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                The {topStories.length} most important stories ranked by exam relevance
              </p>
            </div>
            <Link href="/search" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent)' }}>
              View all <ArrowRight size={16} />
            </Link>
          </div>

          {topStories.length === 0 ? (
            <EmptyState />
          ) : (
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Featured story */}
              {featuredStory && <ArticleCard article={featuredStory} variant="featured" />}

              {/* Grid */}
              {gridStories.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
                  {gridStories.map((article) => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Category Sections */}
      <section style={{ padding: '0 0 clamp(1.5rem, 4vw, 3rem)', background: 'var(--bg-card)', borderTop: '1px solid var(--border)' }}>
        <div className="container" style={{ paddingTop: '3rem' }}>
          <h2 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '2rem' }}>
            Browse by Category
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="card" style={{ padding: '1.5rem', borderLeft: `4px solid ${cat.color}` }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.375rem' }}>
                    {cat.label}
                  </h3>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.875rem' }}>
                    {cat.description}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                    {cat.topics.slice(0, 3).map((topic) => (
                      <span key={topic} style={{ fontSize: '0.6875rem', background: cat.color + '15', color: cat.color, padding: '0.2rem 0.5rem', borderRadius: '9999px', fontWeight: 600 }}>
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Articles */}
      {recentArticles.length > 0 && (
        <section style={{ padding: 'clamp(1.5rem, 4vw, 3rem) 0' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 style={{ fontSize: 'clamp(1.25rem, 4vw, 1.5rem)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Recent Articles
              </h2>
              <Link href="/search" style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent)' }}>
                View all <ArrowRight size={16} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
              {recentArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Exam Corner CTA */}
      <section style={{ padding: 'clamp(1.5rem, 4vw, 3rem) 0', background: 'linear-gradient(135deg, #1E40AF, #1D4ED8, #2563EB)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.35rem, 4vw, 1.75rem)', fontWeight: 800, color: 'white', marginBottom: '0.75rem' }}>
            Ready to Test Your Knowledge?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '1.75rem', fontSize: '1rem' }}>
            Take today&apos;s quiz based on the latest current affairs.
          </p>
          <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/daily-quiz" id="home-quiz-btn" style={{
              background: 'white', color: '#1D4ED8', fontWeight: 700,
              padding: '0.875rem 1.75rem', borderRadius: '0.625rem', fontSize: '1rem',
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem', transition: 'transform 0.2s',
            }}>
              Start Daily Quiz <ArrowRight size={18} />
            </Link>
            <Link href="/weekly-revision" style={{
              background: 'rgba(255,255,255,0.15)', color: 'white', fontWeight: 600,
              padding: '0.875rem 1.75rem', borderRadius: '0.625rem', fontSize: '1rem',
              display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              border: '1px solid rgba(255,255,255,0.3)',
            }}>
              Weekly Revision
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function EmptyState() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📰</div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
        Stories Loading Soon
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
        Our AI pipeline is fetching and processing the latest news. Check back shortly or seed sample data via the admin panel.
      </p>
      <Link href="/admin" className="btn btn-primary">
        Open Admin Panel
      </Link>
    </div>
  )
}
