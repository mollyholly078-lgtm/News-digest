export type UserRole = 'USER' | 'ADMIN'

export interface Article {
  id: string
  slug: string
  headline: string
  summary: string
  background: string
  whyItMatters: string
  keyFacts: string[]
  mcqQuestion: MCQQuestion
  mainsQuestion: string
  keywords: string[]
  category: string
  upscScore: number
  readingTime: number
  sourceUrl: string
  sourceName: string
  imageUrl: string
  approved: boolean
  featured: boolean
  publishedAt: Date
  createdAt: Date
  updatedAt: Date
}

export interface MCQQuestion {
  question: string
  options: string[]
  correct: number
  explanation: string
}

export interface User {
  id: string
  email: string
  name?: string
  role: UserRole
  image?: string
  createdAt: Date
}

export interface Bookmark {
  id: string
  userId: string
  articleId: string
  createdAt: Date
  article?: Article
}

export interface QuizQuestion {
  id: string
  articleId?: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  type: 'MCQ' | 'FILL' | 'TRUEFALSE' | 'MATCH'
}

export interface QuizAttempt {
  id: string
  userId: string
  questionId: string
  selectedAnswer: number
  correct: boolean
  attemptedAt: Date
}

export type Category =
  | 'india'
  | 'world'
  | 'economy'
  | 'science-technology'
  | 'environment'
  | 'polity-governance'

export interface CategoryInfo {
  slug: Category
  label: string
  description: string
  color: string
  topics: string[]
}

export const CATEGORIES: CategoryInfo[] = [
  {
    slug: 'india',
    label: 'India',
    description: 'Government, Parliament, Elections & Governance',
    color: '#FF6B35',
    topics: ['Government Schemes', 'Parliament', 'Supreme Court', 'Elections', 'Governance', 'Social Issues'],
  },
  {
    slug: 'world',
    label: 'World',
    description: 'International Relations & Global Affairs',
    color: '#2563EB',
    topics: ['International Relations', 'Global Organizations', 'Geopolitics', 'Trade Agreements', 'Important Summits'],
  },
  {
    slug: 'economy',
    label: 'Economy',
    description: 'RBI, GDP, Budget & Financial Markets',
    color: '#059669',
    topics: ['RBI', 'Inflation', 'GDP', 'Budget', 'Banking', 'Taxation', 'Employment'],
  },
  {
    slug: 'science-technology',
    label: 'Science & Technology',
    description: 'AI, ISRO, Biotech & Emerging Tech',
    color: '#7C3AED',
    topics: ['Artificial Intelligence', 'ISRO', 'Space Research', 'Biotechnology', 'Cyber Security', 'Emerging Technologies'],
  },
  {
    slug: 'environment',
    label: 'Environment',
    description: 'Climate Change, Biodiversity & Conservation',
    color: '#16A34A',
    topics: ['Climate Change', 'Biodiversity', 'Conservation', 'International Environmental Agreements'],
  },
  {
    slug: 'polity-governance',
    label: 'Polity & Governance',
    description: 'Constitutional Law, Judiciary & Administration',
    color: '#D97706',
    topics: ['Constitution', 'Fundamental Rights', 'Judiciary', 'State Administration', 'Local Governance'],
  },
]
