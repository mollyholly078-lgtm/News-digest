import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { fetchNewsFromRSS } from '@/lib/news-fetcher'
import { slugify } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET() {
  try {
    const start = Date.now()

    // Fetch fresh news from RSS feeds (already filtered to last 48h in news-fetcher)
    const rawItems = await fetchNewsFromRSS()

    let created = 0
    let skipped = 0

    for (const item of rawItems.slice(0, 30)) {
      // Upsert keyed on guid — re-fetching the same item NEVER bumps createdAt or creates duplicates.
      // We only update headline + publishedAt in case the RSS feed corrected the entry.
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
          publishedAt: item.publishedAt, // actual RSS pubDate — never now()
        },
        update: {
          // Safe to re-run: only refresh volatile fields
          headline: item.headline,
          publishedAt: item.publishedAt,
        },
      })

      // Prisma upsert doesn't tell us create vs update directly, so we track via
      // whether createdAt == updatedAt (new row) vs not. Simpler: count by checking
      // if the row was just created within the last 5 seconds.
      const isNew = result.createdAt.getTime() > Date.now() - 5000
      if (isNew) created++
      else skipped++
    }

    revalidatePath('/')
    revalidatePath('/breaking-news')

    const elapsed = ((Date.now() - start) / 1000).toFixed(1)

    return NextResponse.json({
      success: true,
      message: `Refreshed in ${elapsed}s. Created ${created} new, updated/skipped ${skipped}.`,
      stats: {
        created,
        skipped,
        total: await prisma.article.count(),
        fetchedFromFeeds: rawItems.length,
      },
    })
  } catch (error) {
    console.error('News refresh error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
