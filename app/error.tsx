'use client'

export default function RootError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', flexDirection: 'column', gap: '1rem', padding: '2rem', textAlign: 'center',
    }}>
      <p style={{ fontSize: '3rem', margin: 0 }}>⚠️</p>
      <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1.25rem' }}>
        Something went wrong
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', maxWidth: '400px' }}>
        {error.message || 'An unexpected error occurred.'}
      </p>
      <button
        onClick={reset}
        className="btn btn-primary"
        style={{ marginTop: '0.5rem' }}
      >
        Try Again
      </button>
    </div>
  )
}
