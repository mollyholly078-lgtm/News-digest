import Link from 'next/link'
import { BookOpen } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-card)',
      marginTop: '4rem',
      padding: '3rem 0 1.5rem',
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <div style={{ width: '28px', height: '28px', background: 'var(--accent)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={16} color="white" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                News<span style={{ color: 'var(--accent)' }}>Digest</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '220px' }}>
              Daily current affairs for competitive exam aspirants. Read smarter, not harder.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Categories</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                  ['India', '/india'],
                  ['World', '/world'],
                  ['Economy', '/economy'],
                  ['Science & Technology', '/science-technology'],
                  ['Environment', '/environment'],
                  ['Polity & Governance', '/polity-governance'],
                ].map(([label, href]) => (
                  <Link key={href} href={href} style={{ fontSize: '0.875rem', color: 'var(--text-muted)', transition: 'color 0.2s' }}
                    className="footer-link">
                    {label}
                  </Link>
                ))}
            </div>
          </div>

          {/* Exam Prep */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Exam Prep</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                  ['Daily Quiz', '/daily-quiz'],
                  ['Weekly Revision', '/weekly-revision'],
                  ['Monthly Magazine', '/monthly-magazine'],
                  ['Bookmarks', '/bookmarks'],
                  ['Search', '/search'],
                ].map(([label, href]) => (
                  <Link key={href} href={href} style={{ fontSize: '0.875rem', color: 'var(--text-muted)', transition: 'color 0.2s' }}
                    className="footer-link">
                    {label}
                  </Link>
                ))}
            </div>
          </div>

          {/* Mission */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Our Mission</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '1rem' }}>
              We curate the most important current affairs from trusted sources so you can stay informed in 15 minutes a day.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <a href="#" aria-label="Twitter X" style={{ padding: '0.5rem', borderRadius: '0.5rem', color: 'var(--text-muted)', border: '1px solid var(--border)', display: 'flex', transition: 'all 0.2s' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="#" aria-label="Github" style={{ padding: '0.5rem', borderRadius: '0.5rem', color: 'var(--text-muted)', border: '1px solid var(--border)', display: 'flex', transition: 'all 0.2s' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
            © {year} NewsDigest. Built for competitive exam aspirants.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>No ads · No popups · No distractions</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
