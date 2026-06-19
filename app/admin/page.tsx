import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import TriggerFetchButton from '@/components/admin/TriggerFetchButton'
import { FileCheck, Hourglass, Users, Target } from 'lucide-react'

export const metadata = {
  title: 'Admin Dashboard — NewsDigest',
}

export default async function AdminDashboardPage() {
  const [approvedCount, pendingCount, usersCount, attemptsCount] = await Promise.all([
    prisma.article.count({ where: { approved: true } }),
    prisma.article.count({ where: { approved: false } }),
    prisma.user.count(),
    prisma.quizAttempt.count(),
  ])

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            System Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Real-time status overview of NewsDigest database and operations.
          </p>
        </div>
        <TriggerFetchButton />
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard
          icon={FileCheck}
          iconColor="#16A34A"
          bgColor="#F0FDF4"
          title="Approved Articles"
          value={approvedCount}
          link="/admin/articles"
          linkLabel="Manage articles"
        />
        <StatCard
          icon={Hourglass}
          iconColor="#D97706"
          bgColor="#FFFBEB"
          title="Pending Review"
          value={pendingCount}
          link="/admin/articles"
          linkLabel="Open review queue"
        />
        <StatCard
          icon={Users}
          iconColor="#2563EB"
          bgColor="#EFF6FF"
          title="Registered Users"
          value={usersCount}
        />
        <StatCard
          icon={Target}
          iconColor="#7C3AED"
          bgColor="#F5F3FF"
          title="Quiz Attempts"
          value={attemptsCount}
        />
      </div>

      {/* Quick Tips */}
      <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent)' }}>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          💡 Testing the AI News Pipeline
        </h3>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Clicking the <strong>&quot;Run News Fetch Pipeline&quot;</strong> button triggers a request to fetch news from RSS feeds. The pipeline parses headlines, removes entertainment news, translates relevance for competitive exams, and prompts the Google Gemini AI engine to produce summaries, context background, Prelims MCQs, and Mains practice questions. Articles appear in the <strong>Review Queue</strong> as pending until you approve them.
        </p>
      </div>
    </div>
  )
}

interface StatCardProps {
  icon: React.ComponentType<{ size: number }>
  iconColor: string
  bgColor: string
  title: string
  value: number
  link?: string
  linkLabel?: string
}

function StatCard({ icon: Icon, iconColor, bgColor, title, value, link, linkLabel }: StatCardProps) {
  return (
    <div className="card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>{title}</span>
        <div style={{ padding: '0.5rem', borderRadius: 'var(--radius-sm)', background: bgColor, color: iconColor, display: 'inline-flex' }}>
          <Icon size={18} />
        </div>
      </div>
      <div>
        <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{value}</span>
      </div>
      {link && (
        <Link href={link} style={{ fontSize: '0.8125rem', color: 'var(--accent)', fontWeight: 600, textDecoration: 'none', marginTop: 'auto' }}>
          {linkLabel || 'View details'} →
        </Link>
      )}
    </div>
  )
}
