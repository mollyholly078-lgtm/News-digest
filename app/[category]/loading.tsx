export default function CategoryLoading() {
  return (
    <div className="container" style={{ padding: '2rem 1.5rem 4rem' }}>
      <div style={{ width: '200px', height: '24px', background: 'var(--border)', borderRadius: '4px', marginBottom: '2rem' }} />
      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} style={{ height: '120px', background: 'var(--border)', borderRadius: 'var(--radius)', opacity: 0.5 }} />
        ))}
      </div>
    </div>
  )
}
