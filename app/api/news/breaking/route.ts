import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const where: Record<string, unknown> = {
      approved: true,
      publishedAt: { gte: oneDayAgo },
    }
    if (category) where.category = category

    const articles = await prisma.article.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: 50,
      select: {
        id: true,
        slug: true,
        headline: true,
        summary: true,
        category: true,
        sourceName: true,
        sourceUrl: true,
        publishedAt: true,
      },
    })

    return NextResponse.json({ articles, total: articles.length, since: oneDayAgo.toISOString(), now: new Date().toISOString() })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
