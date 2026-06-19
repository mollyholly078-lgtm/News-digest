'use client'

export default function CategoryError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem', textAlign: 'center' }}>
      <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚠️</p>
      <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Failed to load articles</h2>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>Something went wrong fetching this category.</p>
      <button onClick={reset} className="btn btn-primary">Try Again</button>
    </div>
  )
}
