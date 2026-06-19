import Link from 'next/link'
import { LayoutDashboard, FileText, Home } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{ borderRight: '1px solid var(--border)', background: 'var(--bg-card)', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            NewsDigest Admin
          </h2>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Control Center
          </span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          <Link
            href="/admin"
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9375rem', fontWeight: 600 }}
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link
            href="/admin/articles"
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.9375rem', fontWeight: 600 }}
          >
            <FileText size={18} /> Review Queue
          </Link>
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.875rem' }}
          >
            <Home size={16} /> Exit to Site
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ padding: '2.5rem 3rem', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
