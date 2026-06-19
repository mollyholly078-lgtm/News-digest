import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { parseJsonField } from '@/lib/utils'
import QuizEngine from '@/components/quiz/QuizEngine'
import type { QuizQuestion } from '@/types'
import { Brain, Clock, Target } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Daily Quiz — Test Your Current Affairs',
  description: 'Take today\'s current affairs quiz. MCQs based on the latest news with instant results and explanations.',
}

export default async function DailyQuizPage() {
  const rawQuestions = await prisma.quizQuestion.findMany({
    orderBy: { createdAt: 'desc' },
    take: 15,
  })

  const questions: QuizQuestion[] = rawQuestions.map((q) => ({
    id: q.id,
    articleId: q.articleId ?? undefined,
    question: q.question,
    options: parseJsonField<string[]>(q.options, []),
    correctAnswer: q.correctAnswer,
    explanation: q.explanation,
    type: q.type as QuizQuestion['type'],
  }))

  return (
    <div style={{ padding: '2rem 1.5rem 4rem', minHeight: '80vh' }}>
      {/* Header */}
      <div className="container" style={{ maxWidth: '900px', marginBottom: '2.5rem', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: '9999px', padding: '0.375rem 0.875rem', marginBottom: '1rem' }}>
          <Brain size={14} style={{ color: 'var(--accent)' }} />
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--accent)' }}>Daily Quiz</span>
        </div>
        <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
          Test Your Knowledge
        </h1>
        <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
          {questions.length} questions based on today&apos;s current affairs. Timer: 15 minutes.
        </p>
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[
            { icon: Brain, label: `${questions.length} Questions` },
            { icon: Clock, label: '15 Min Timer' },
            { icon: Target, label: 'Instant Results' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <Icon size={15} style={{ color: 'var(--accent)' }} /> {label}
            </div>
          ))}
        </div>
      </div>

      <div className="container" style={{ maxWidth: '900px' }}>
        <QuizEngine questions={questions} />
      </div>
    </div>
  )
}
