import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchNewsFromRSS } from '@/lib/news-fetcher'
import { slugify } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// This route is called by Vercel Cron (see vercel.json) every 20 minutes.
// It is also protected by a CRON_SECRET env var to prevent unauthorised triggers.
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  // In production, require the Vercel Cron secret header.
  // In development (no secret set) allow unauthenticated access.
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const start = Date.now()
    const rawItems = await fetchNewsFromRSS()

    let created = 0
    let skipped = 0

    for (const item of rawItems) {
      const result = await prisma.article.upsert({
        where: { guid: item.guid },
        create: {
          guid: item.guid,
          slug: slugify(item.headline) + '-' + Date.now().toString().slice(-6),
          headline: item.headline,
          summary: item.content
            ? item.content.replace(/\s+/g, ' ').trim().slice(0, 250) +
              (item.content.length > 250 ? '…' : '')
            : item.headline,
          background: '',
          whyItMatters: '',
          keyFacts: '[]',
          mcqQuestion: '{}',
          mainsQuestion: '',
          keywords: JSON.stringify([item.category]),
          category: item.category,
          upscScore: 5,
          readingTime: 2,
          sourceUrl: item.sourceUrl,
          sourceName: item.sourceName,
          approved: true,
          featured: false,
          publishedAt: item.publishedAt, // actual RSS pubDate
        },
        update: {
          headline: item.headline,
          publishedAt: item.publishedAt,
        },
      })

      const isNew = result.createdAt.getTime() > Date.now() - 5000
      if (isNew) created++
      else skipped++
    }

    revalidatePath('/')
    revalidatePath('/breaking-news')
    revalidatePath('/[category]')

    const elapsed = ((Date.now() - start) / 1000).toFixed(1)
    console.log(`[cron] Refresh complete in ${elapsed}s — ${created} new, ${skipped} existing`)

    return NextResponse.json({
      ok: true,
      elapsed: `${elapsed}s`,
      created,
      skipped,
      total: await prisma.article.count(),
    })
  } catch (error) {
    console.error('[cron] Refresh failed:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
