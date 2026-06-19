export default function QuizLoading() {
  return (
    <div style={{ padding: '2rem 1.5rem 4rem', textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto 1rem' }} />
      <p style={{ color: 'var(--text-muted)' }}>Loading quiz questions...</p>
    </div>
  )
}
