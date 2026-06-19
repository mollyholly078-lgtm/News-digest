'use client'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setMounted(true)
      const attr = document.documentElement.getAttribute('data-theme')
      if (attr === 'light' || attr === 'dark') setTheme(attr)
    }, 0)
  }, [])

  function toggle() {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem('nd-theme', next)
  }

  if (!mounted) {
    return (
      <button
        id="theme-toggle"
        className="btn btn-ghost"
        style={{ padding: '0.5rem', borderRadius: '0.5rem', visibility: 'hidden' }}
        aria-hidden="true"
        tabIndex={-1}
      >
        <Moon size={18} />
      </button>
    )
  }

  return (
    <button
      id="theme-toggle"
      onClick={toggle}
      className="btn btn-ghost"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      style={{ padding: '0.5rem', borderRadius: '0.5rem' }}
    >
      {theme === 'light' ? (
        <Moon size={18} style={{ color: 'var(--text-muted)' }} />
      ) : (
        <Sun size={18} style={{ color: 'var(--text-muted)' }} />
      )}
    </button>
  )
}
