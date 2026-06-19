'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'

export async function saveQuizAttempts(attempts: {
  questionId: string
  selected: number
  correct: boolean
}[]) {
  const session = await getSession()
  if (!session) return { error: 'Not authenticated' }

  try {
    for (const attempt of attempts) {
      const existing = await prisma.quizAttempt.findFirst({
        where: { userId: session.userId, questionId: attempt.questionId },
      })
      if (!existing) {
        await prisma.quizAttempt.create({
          data: {
            userId: session.userId,
            questionId: attempt.questionId,
            selectedAnswer: attempt.selected,
            correct: attempt.correct,
          },
        })
      }
    }
    return { success: true }
  } catch (err) {
    console.error('Save quiz attempts error:', err)
    return { error: 'Failed to save results.' }
  }
}
