import Link from 'next/link'
import { ArrowRight, Zap, Clock, Shield } from 'lucide-react'

export default function HeroSection() {
  return (
    <section
      className="hero-gradient"
      style={{ padding: '5rem 0 4rem' }}
      aria-label="Hero section"
    >
      <div className="container" style={{ textAlign: 'center' }}>
        {/* Live badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: '9999px', padding: '0.375rem 0.875rem', marginBottom: '1.5rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#16A34A', animation: 'pulse-dot 2s infinite' }} />
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent)' }}>Updated Hourly · Verified Sources</span>
        </div>

        {/* Headline */}
        <h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '1.25rem' }}>
          Current Affairs,{' '}
          <span style={{ color: 'var(--accent)' }}>Simplified</span>
          <br />for Exam Success
        </h1>

        {/* Tagline */}
        <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: '560px', margin: '0 auto 2.5rem' }}>
          Daily Current Affairs for Competitive Exams — Read in 15 Minutes.
          <br />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9375rem' }}>Designed for UPSC, PCS, SSC, Banking & Defence aspirants.</span>
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '0.875rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3.5rem' }}>
          <Link
            href="#top-stories"
            id="hero-start-reading"
            className="btn btn-primary"
            style={{ padding: '0.875rem 1.75rem', fontSize: '1rem', gap: '0.5rem' }}
          >
            Start Reading <ArrowRight size={18} />
          </Link>
          <Link
            href="/daily-quiz"
            id="hero-daily-quiz"
            className="btn btn-secondary"
            style={{ padding: '0.875rem 1.75rem', fontSize: '1rem' }}
          >
            Take Today&apos;s Quiz
          </Link>
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { icon: Zap, label: "Today's Top Stories", desc: 'AI-curated importance' },
            { icon: Clock, label: 'Updated Automatically', desc: 'Fresh every hour' },
            { icon: Shield, label: 'Verified Sources Only', desc: 'PIB · The Hindu · BBC' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0.75rem 1.25rem', boxShadow: 'var(--shadow)' }}>
              <div style={{ width: '36px', height: '36px', background: 'var(--accent-light)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} style={{ color: 'var(--accent)' }} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{label}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
