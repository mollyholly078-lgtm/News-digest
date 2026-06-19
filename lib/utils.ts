import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatRelativeDate(date: Date | string): string {
  const now = new Date()
  const d = new Date(date)
  const diff = now.getTime() - d.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function estimateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const words = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

export function parseJsonField<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T
  } catch {
    return fallback
  }
}

export function categoryColor(category: string): string {
  const colors: Record<string, string> = {
    india: '#FF6B35',
    world: '#2563EB',
    economy: '#059669',
    'science-technology': '#7C3AED',
    environment: '#16A34A',
    'polity-governance': '#D97706',
  }
  return colors[category] ?? '#6B7280'
}

export function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    india: 'India',
    world: 'World',
    economy: 'Economy',
    'science-technology': 'Science & Technology',
    environment: 'Environment',
    'polity-governance': 'Polity & Governance',
  }
  return labels[category] ?? category
}
