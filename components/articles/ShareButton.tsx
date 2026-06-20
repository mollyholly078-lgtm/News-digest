'use client'
import { useState, useCallback } from 'react'
import { Share2, Check, ExternalLink, MessageCircle } from 'lucide-react'

interface ShareButtonProps {
  url: string
  title: string
}

export default function ShareButton({ url, title }: ShareButtonProps) {
  const [copied, setCopied] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  const getFullUrl = useCallback(() => {
    if (url.startsWith('http')) return url
    if (typeof window === 'undefined') return url
    return `${window.location.origin}${url}`
  }, [url])

  const copyLink = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(getFullUrl())
      setCopied(true)
      setShowMenu(false)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      console.error('Failed to copy link')
    }
  }

  const shareToTwitter = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const fullUrl = getFullUrl()
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`, '_blank', 'noopener,noreferrer')
    setShowMenu(false)
  }

  const shareToWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const fullUrl = getFullUrl()
    window.open(`https://wa.me/?text=${encodeURIComponent(`${title} ${fullUrl}`)}`, '_blank', 'noopener,noreferrer')
    setShowMenu(false)
  }

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setShowMenu(!showMenu)
        }}
        className="btn btn-ghost"
        style={{ padding: '0.375rem 0.625rem', fontSize: '0.8125rem', gap: '0.375rem', display: 'inline-flex', alignItems: 'center', color: 'var(--text-secondary)' }}
        aria-label="Share article"
      >
        {copied ? <Check size={14} style={{ color: '#16A34A' }} /> : <Share2 size={14} />}
        {copied ? 'Copied!' : 'Share'}
      </button>

      {showMenu && (
        <>
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 98 }}
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowMenu(false) }}
          />
          <div style={{
            position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '0.5rem', zIndex: 99,
            display: 'flex', gap: '0.25rem', marginBottom: '0.5rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}>
            <button
              onClick={copyLink}
              style={{ padding: '0.5rem', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Copy link"
              className="hover-bg"
            >
              {copied ? <Check size={16} style={{ color: '#16A34A' }} /> : <Share2 size={16} />}
            </button>
            <button
              onClick={shareToTwitter}
              style={{ padding: '0.5rem', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Share on Twitter"
              className="hover-bg"
            >
              <ExternalLink size={16} />
            </button>
            <button
              onClick={shareToWhatsApp}
              style={{ padding: '0.5rem', border: 'none', background: 'transparent', cursor: 'pointer', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Share on WhatsApp"
              className="hover-bg"
            >
              <MessageCircle size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  )
}
