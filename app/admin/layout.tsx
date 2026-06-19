import Link from 'next/link'
import { LayoutDashboard, FileText, Home } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-grid">
      {/* Sidebar */}
      <aside style={{ borderRight: 'none', borderBottom: '1px solid var(--border)', background: 'var(--bg-card)', padding: '0.75rem 1rem', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
        <div style={{ flexShrink: 0 }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            NewsDigest Admin
          </h2>
        </div>

        <nav style={{ display: 'flex', gap: '0.25rem', flex: 1, overflowX: 'auto' }}>
          <Link
            href="/admin"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.8125rem', fontWeight: 600, whiteSpace: 'nowrap' }}
          >
            <LayoutDashboard size={16} /> Dashboard
          </Link>
          <Link
            href="/admin/articles"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.8125rem', fontWeight: 600, whiteSpace: 'nowrap' }}
          >
            <FileText size={16} /> Review Queue
          </Link>
          <Link
            href="/"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.8125rem', whiteSpace: 'nowrap', marginLeft: 'auto' }}
          >
            <Home size={16} /> Site
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        {children}
      </main>
    </div>
  )
}
