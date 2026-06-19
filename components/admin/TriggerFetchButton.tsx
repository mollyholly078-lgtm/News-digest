'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { triggerNewsFetch } from '@/app/admin/actions'
import { RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react'

export default function TriggerFetchButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleFetch = async () => {
    setLoading(true)
    setMessage('')
    setError('')

    const res = await triggerNewsFetch()

    setLoading(false)
    if (res?.error) {
      setError(res.error)
    } else if (res?.message) {
      setMessage(res.message)
      router.refresh()
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
      <button
        onClick={handleFetch}
        disabled={loading}
        className="btn btn-primary"
        style={{ gap: '0.5rem', display: 'inline-flex', alignItems: 'center' }}
      >
        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        {loading ? 'Running Pipeline...' : 'Run News Fetch Pipeline'}
      </button>

      {message && (
        <span style={{ fontSize: '0.75rem', color: '#16A34A', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
          <CheckCircle size={12} /> {message}
        </span>
      )}
      {error && (
        <span style={{ fontSize: '0.75rem', color: '#B91C1C', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}>
          <AlertTriangle size={12} /> {error}
        </span>
      )}
    </div>
  )
}
