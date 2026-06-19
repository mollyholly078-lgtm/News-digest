import type { Metadata } from 'next'
import Link from 'next/link'
import { Brain, RotateCcw, BookText, GraduationCap, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Exam Corner',
  description: 'Prepare for UPSC, PCS, SSC, Banking & Defence exams with daily quizzes, weekly revision, and monthly magazines.',
}

const features = [
  {
    icon: Brain,
    title: 'Daily Quiz',
    description: 'Test your knowledge with 15 MCQs based on the latest current affairs. Timed mode with instant explanations.',
    href: '/daily-quiz',
    color: '#7C3AED',
  },
  {
    icon: RotateCcw,
    title: 'Weekly Revision',
    description: 'Top 10 stories of the week ranked by UPSC relevance. Perfect for weekend revision.',
    href: '/weekly-revision',
    color: '#059669',
  },
  {
    icon: BookText,
    title: 'Monthly Magazine',
    description: 'Download a comprehensive monthly PDF compilation of all important current affairs.',
    href: '/monthly-magazine',
    color: '#D97706',
  },
]

export default function ExamCornerPage() {
  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem', maxWidth: '900px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--accent-light)', border: '1px solid var(--accent)',
          borderRadius: '9999px', padding: '0.375rem 0.875rem', marginBottom: '1rem',
        }}>
          <GraduationCap size={14} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent)' }}>Exam Corner</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 2.75rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          Your Complete Exam Prep Suite
        </h1>
        <p style={{ fontSize: '1.0625rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto', lineHeight: 1.7 }}>
          Everything you need to master current affairs for UPSC, PCS, SSC, Banking & Defence exams — all in one place.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {features.map((f) => (
          <Link key={f.href} href={f.href} style={{ textDecoration: 'none' }}>
            <div className="card" style={{
              padding: '1.75rem 2rem', display: 'flex', alignItems: 'center', gap: '1.5rem',
              transition: 'all 0.2s', cursor: 'pointer',
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '16px', background: `${f.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <f.icon size={28} style={{ color: f.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                  {f.title}
                </h2>
                <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', lineHeight: 1.6, margin: 0 }}>
                  {f.description}
                </p>
              </div>
              <ArrowRight size={20} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
            </div>
          </Link>
        ))}
      </div>

      <div className="card" style={{
        marginTop: '2.5rem', padding: '2rem', textAlign: 'center',
        background: 'linear-gradient(135deg, var(--accent-light), var(--bg-card))',
      }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Ready to start?
        </h2>
        <p style={{ fontSize: '0.9375rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          Begin with today&apos;s quiz or jump to the weekly revision.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/daily-quiz" className="btn btn-primary" style={{ gap: '0.5rem' }}>
            <Brain size={16} /> Take Daily Quiz
          </Link>
          <Link href="/weekly-revision" className="btn btn-secondary">
            Weekly Revision
          </Link>
        </div>
      </div>
    </div>
  )
}
