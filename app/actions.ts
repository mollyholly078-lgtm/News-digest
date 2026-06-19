'use server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

export async function toggleBookmark(articleId: string) {
  const session = await getSession()
  if (!session) {
    return { error: 'UNAUTHORIZED' }
  }

  try {
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_articleId: {
          userId: session.userId,
          articleId,
        },
      },
    })

    if (existing) {
      await prisma.bookmark.delete({
        where: { id: existing.id },
      })
      revalidatePath('/bookmarks')
      return { success: true, bookmarked: false }
    } else {
      await prisma.bookmark.create({
        data: {
          userId: session.userId,
          articleId,
        },
      })
      revalidatePath('/bookmarks')
      return { success: true, bookmarked: true }
    }
  } catch (err) {
    console.error('Toggle bookmark error:', err)
    return { error: 'Failed to update bookmark.' }
  }
}

export async function isArticleBookmarked(articleId: string) {
  const session = await getSession()
  if (!session) return false

  const bookmark = await prisma.bookmark.findUnique({
    where: {
      userId_articleId: {
        userId: session.userId,
        articleId,
      },
    },
  })

  return !!bookmark
}
