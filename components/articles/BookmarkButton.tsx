'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toggleBookmark, isArticleBookmarked } from '@/app/actions'
import { Bookmark, BookmarkPlus, Loader2 } from 'lucide-react'

interface BookmarkButtonProps {
  articleId: string
}

export default function BookmarkButton({ articleId }: BookmarkButtonProps) {
  const router = useRouter()
  const [bookmarked, setBookmarked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    // Check initial bookmarked state on mount
    const checkState = async () => {
      try {
        const state = await isArticleBookmarked(articleId)
        setBookmarked(state)
      } catch (err) {
        console.error('Error checking bookmark state:', err)
      } finally {
        setChecking(false)
      }
    }
    checkState()
  }, [articleId])

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (loading || checking) return
    setLoading(true)

    const res = await toggleBookmark(articleId)

    setLoading(false)
    if (res?.error === 'UNAUTHORIZED') {
      router.push(`/login?redirect=${window.location.pathname}`)
    } else if (res?.success) {
      setBookmarked(res.bookmarked || false)
    }
  }

  if (checking) {
    return (
      <div style={{ width: '60px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={12} className="animate-spin" style={{ color: 'var(--text-muted)' }} />
      </div>
    )
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="btn btn-ghost"
      style={{ padding: '0.375rem 0.625rem', fontSize: '0.8125rem', gap: '0.375rem', display: 'inline-flex', alignItems: 'center', color: bookmarked ? 'var(--accent)' : 'var(--text-secondary)', background: bookmarked ? 'var(--accent-light)' : 'transparent' }}
      aria-label={bookmarked ? "Remove bookmark" : "Bookmark article"}
    >
      {loading ? (
        <Loader2 size={12} className="animate-spin" />
      ) : bookmarked ? (
        <Bookmark size={14} style={{ fill: 'var(--accent)' }} />
      ) : (
        <BookmarkPlus size={14} />
      )}
      {bookmarked ? 'Saved' : 'Save'}
    </button>
  )
}
