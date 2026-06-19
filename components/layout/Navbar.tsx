'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import {
  BookOpen, Search, Menu, X, Bookmark, Home,
  Globe, TrendingUp, Cpu, Leaf, Scale, GraduationCap,
  Brain, RotateCcw, BookText, ChevronDown
} from 'lucide-react'
import ThemeToggle from '@/components/ui/ThemeToggle'

const NAV_LINKS = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/india', label: 'India', icon: Globe },
  { href: '/world', label: 'World', icon: Globe },
  { href: '/economy', label: 'Economy', icon: TrendingUp },
  { href: '/science-technology', label: 'Science & Tech', icon: Cpu },
  { href: '/environment', label: 'Environment', icon: Leaf },
  { href: '/polity-governance', label: 'Polity', icon: Scale },
]

const EXAM_LINKS = [
  { href: '/exam-corner', label: 'Exam Corner', icon: GraduationCap },
  { href: '/daily-quiz', label: 'Daily Quiz', icon: Brain },
  { href: '/weekly-revision', label: 'Weekly Revision', icon: RotateCcw },
  { href: '/monthly-magazine', label: 'Monthly Magazine', icon: BookText },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const [examOpen, setExamOpen] = useState(false)
  const examRef = useRef<HTMLDivElement>(null)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const activeStyle = {
    background: 'rgba(59,130,246,0.18)',
    color: '#60a5fa',
    border: '1px solid rgba(96,165,250,0.35)',
    boxShadow: '0 0 12px rgba(96,165,250,0.15)',
  }

  const activeStyleMobile = {
    background: 'rgba(59,130,246,0.18)',
    color: '#60a5fa',
    border: '1px solid rgba(96,165,250,0.35)',
    boxShadow: '0 0 12px rgba(96,165,250,0.15)',
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (examRef.current && !examRef.current.contains(e.target as Node)) {
        setExamOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Main navigation">
        <div className="container" style={{ display: 'flex', alignItems: 'center', height: '64px', gap: '1rem' }}>
          {/* Logo */}
          <Link href="/" id="nav-logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: '32px', height: '32px', background: 'var(--accent)',
              borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <BookOpen size={18} color="white" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              News<span style={{ color: 'var(--accent)' }}>Digest</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1, overflowX: 'auto' }} className="hide-mobile">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    padding: '0.375rem 0.625rem',
                    borderRadius: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    color: active ? '#60a5fa' : 'var(--text-secondary)',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.25s ease',
                    ...(active ? activeStyle : {}),
                  }}
                  className={`nav-link ${active ? 'active' : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              )
            })}

            {/* Exam Dropdown */}
            <div ref={examRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setExamOpen(!examOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.25rem',
                  padding: '0.375rem 0.625rem', borderRadius: '0.5rem',
                  fontSize: '0.875rem', fontWeight: 500,
                  color: 'var(--accent)', background: 'var(--accent-light)',
                  border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
                }}
              >
                Exam Corner <ChevronDown size={14} />
              </button>
              {examOpen && (
                <div style={{
                  position: 'absolute', top: '110%', left: 0,
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-lg)',
                  minWidth: '200px', zIndex: 50, padding: '0.5rem',
                }}>
                  {EXAM_LINKS.map((link) => {
                    const active = isActive(link.href)
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setExamOpen(false)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.625rem',
                          padding: '0.625rem 0.75rem', borderRadius: '0.5rem',
                          fontSize: '0.875rem', fontWeight: 500,
                          color: active ? '#60a5fa' : 'var(--text-secondary)',
                          transition: 'all 0.25s ease',
                          ...(active ? activeStyle : {}),
                        }}
                        className={`nav-link ${active ? 'active' : ''}`}
                        aria-current={active ? 'page' : undefined}
                      >
                        <link.icon size={16} />
                        {link.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Breaking News */}
          <Link
            href="/breaking-news"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.375rem',
              padding: '0.375rem 0.625rem', borderRadius: '0.5rem',
              fontSize: '0.8125rem', fontWeight: 600,
              color: '#DC2626', whiteSpace: 'nowrap',
              transition: 'all 0.2s',
            }}
            className="nav-link"
          >
            <span style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: '#DC2626', display: 'inline-block',
              animation: 'pulse 2s infinite',
            }} />
            Breaking
          </Link>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto', flexShrink: 0 }}>
            <Link href="/search" id="nav-search" style={{ display: 'flex', padding: '0.5rem', borderRadius: '0.5rem', color: 'var(--text-muted)', transition: 'all 0.2s' }}>
              <Search size={18} />
            </Link>
            <Link href="/bookmarks" id="nav-bookmarks" style={{ display: 'flex', padding: '0.5rem', borderRadius: '0.5rem', color: 'var(--text-muted)', transition: 'all 0.2s' }}>
              <Bookmark size={18} />
            </Link>
            <ThemeToggle />
            <Link href="/login" id="nav-login" className="btn btn-primary hide-mobile" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
              Sign In
            </Link>
            <button
              id="nav-menu-btn"
              onClick={() => setMenuOpen(true)}
              className="btn btn-ghost show-mobile"
              style={{ padding: '0.5rem' }}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`mobile-menu ${menuOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
            News<span style={{ color: 'var(--accent)' }}>Digest</span>
          </span>
          <button onClick={() => setMenuOpen(false)} className="btn btn-ghost" style={{ padding: '0.5rem' }}>
            <X size={20} />
          </button>
        </div>
        <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Categories</p>
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem', borderRadius: 'var(--radius-sm)',
                  fontSize: '1rem', fontWeight: 500,
                  color: active ? '#60a5fa' : 'var(--text-secondary)',
                  transition: 'all 0.25s ease',
                  ...(active ? activeStyleMobile : {}),
                }}
                className={active ? 'active' : ''}
                aria-current={active ? 'page' : undefined}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            )
          })}
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '1rem 0 0.5rem' }}>Exam Prep</p>
          {EXAM_LINKS.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem', borderRadius: 'var(--radius-sm)',
                  fontSize: '1rem', fontWeight: 500,
                  color: active ? '#60a5fa' : 'var(--accent)',
                  transition: 'all 0.25s ease',
                  ...(active ? activeStyleMobile : {}),
                }}
                className={active ? 'active' : ''}
                aria-current={active ? 'page' : undefined}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            )
          })}
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '1rem 0 0.5rem' }}>Live</p>
          <Link
            href="/breaking-news"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.75rem', borderRadius: 'var(--radius-sm)',
              fontSize: '1rem', fontWeight: 600, color: '#DC2626',
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#DC2626', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            Breaking News
          </Link>
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="btn btn-primary"
            style={{ marginTop: '1rem', justifyContent: 'center' }}
          >
            Sign In
          </Link>
        </div>
      </div>

    </>
  )
}
