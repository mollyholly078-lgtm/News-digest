export default function ArticleLoading() {
  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem', maxWidth: '800px' }}>
      <div style={{ width: '60%', height: '32px', background: 'var(--border)', borderRadius: '4px', marginBottom: '1rem' }} />
      <div style={{ width: '40%', height: '16px', background: 'var(--border)', borderRadius: '4px', marginBottom: '2rem' }} />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{ width: `${[100, 95, 90, 100, 85, 92, 88, 96][i]}%`, height: '12px', background: 'var(--border)', borderRadius: '4px', marginBottom: '0.75rem', opacity: 0.4 }} />
      ))}
    </div>
  )
}
