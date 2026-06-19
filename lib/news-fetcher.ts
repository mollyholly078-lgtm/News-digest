import Parser from 'rss-parser'
import { NEWS_SOURCES, type NewsSource } from './news-sources'

export interface RawNewsItem {
  guid: string        // RSS item GUID/link — used as dedup key
  headline: string
  content: string
  sourceUrl: string
  sourceName: string
  publishedAt: Date
  category: string
}

const parser = new Parser()

const BLOCKED_KEYWORDS = [
  'celebrity', 'bollywood', 'cricket match', 'film', 'movie', 'actress', 'actor',
  'box office', 'wedding', 'divorce', 'dating', 'gossip', 'entertainment',
  'ipl score', 'fashion', 'beauty', 'lifestyle',
]

export function isRelevantNews(headline: string): boolean {
  const lower = headline.toLowerCase()
  return !BLOCKED_KEYWORDS.some((kw) => lower.includes(kw))
}

export function classifyCategory(headline: string, defaultCategory: string): string {
  const lower = headline.toLowerCase()
  if (lower.includes('rbi') || lower.includes('gdp') || lower.includes('inflation') || lower.includes('budget') || lower.includes('economy') || lower.includes('fiscal')) return 'economy'
  if (lower.includes('isro') || lower.includes('space') || lower.includes('ai ') || lower.includes('technology') || lower.includes('cyber') || lower.includes('satellite')) return 'science-technology'
  if (lower.includes('climate') || lower.includes('forest') || lower.includes('wildlife') || lower.includes('pollution') || lower.includes('biodiversity') || lower.includes('environment')) return 'environment'
  if (lower.includes('parliament') || lower.includes('supreme court') || lower.includes('constitution') || lower.includes('election commission') || lower.includes('governance')) return 'polity-governance'
  if (lower.includes('un ') || lower.includes('nato') || lower.includes('g20') || lower.includes('bilateral') || lower.includes('summit') || lower.includes('treaty') || lower.includes('world')) return 'world'
  return defaultCategory
}

/**
 * Parse pubDate from an RSS item.
 * rss-parser provides both `isoDate` (ISO-8601, most reliable) and `pubDate` (raw string).
 * We try isoDate first, then pubDate. If both are missing/invalid we return null so the
 * caller can skip truly undated articles rather than stamping them with now().
 */
export function parsePubDate(item: { isoDate?: string; pubDate?: string }): Date | null {
  // isoDate is already ISO-8601 — most reliable
  if (item.isoDate) {
    const d = new Date(item.isoDate)
    if (!isNaN(d.getTime())) return d
  }
  // Fall back to raw pubDate string
  if (item.pubDate) {
    const d = new Date(item.pubDate)
    if (!isNaN(d.getTime())) return d
  }
  return null
}

/**
 * Fetch and parse a single RSS feed, returning normalized article objects.
 * Wraps the entire operation in try/catch so a single failing feed never
 * crashes the caller — returns an empty array on error.
 */
export async function fetchFeed(source: NewsSource): Promise<RawNewsItem[]> {
  const items: RawNewsItem[] = []
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000)

  try {
    const parsed = await parser.parseURL(source.url)

    for (const item of (parsed.items ?? []).slice(0, 10)) {
      const headline = item.title ?? ''
      if (!headline || !isRelevantNews(headline)) continue

      const publishedAt = parsePubDate(item)

      if (!publishedAt) {
        console.log(`[news-fetcher] [${source.name}] Skipping (no pubDate): "${headline}"`)
        continue
      }

      if (publishedAt < cutoff) {
        console.log(`[news-fetcher] [${source.name}] Skipping (too old, ${publishedAt.toISOString()}): "${headline}"`)
        continue
      }

      const guid = item.guid ?? item.link ?? `${source.name}::${headline.slice(0, 80)}`

      items.push({
        guid,
        headline,
        content: item.contentSnippet ?? item.content ?? item.summary ?? '',
        sourceUrl: item.link ?? source.url,
        sourceName: source.name,
        publishedAt,
        category: classifyCategory(headline, source.category),
      })
    }
  } catch (err) {
    console.warn(`[news-fetcher] [${source.name}] Feed failed (${source.url}):`, err)
  }

  return items
}

/**
 * Fetch all configured RSS sources in parallel, merge, deduplicate, and log
 * per-source statistics. Uses Promise.allSettled so one failed feed never
 * blocks the others.
 */
export async function fetchNewsFromRSS(): Promise<RawNewsItem[]> {
  const results = await Promise.allSettled(
    NEWS_SOURCES.map((source) => fetchFeed(source))
  )

  const perSource: { name: string; count: number; failed: boolean }[] = []
  const allItems: RawNewsItem[] = []

  for (let i = 0; i < results.length; i++) {
    const source = NEWS_SOURCES[i]
    const result = results[i]

    if (result.status === 'fulfilled') {
      allItems.push(...result.value)
      perSource.push({ name: source.name, count: result.value.length, failed: false })
    } else {
      perSource.push({ name: source.name, count: 0, failed: true })
    }
  }

  const deduped = deduplicateNews(allItems)

  const logLine = perSource
    .map((s) => `${s.name}: ${s.count} articles${s.failed ? ' (failed)' : ''}`)
    .join(' | ')

  console.log(`[news-fetcher] ${logLine}`)
  console.log(`[news-fetcher] Total fetched: ${allItems.length}, after dedup: ${deduped.length}`)

  return deduped
}

function deduplicateNews(items: RawNewsItem[]): RawNewsItem[] {
  const seenGuids = new Set<string>()
  const seenHeadlines = new Set<string>()
  return items.filter((item) => {
    if (seenGuids.has(item.guid)) return false
    const headlineKey = item.headline.toLowerCase().slice(0, 60)
    if (seenHeadlines.has(headlineKey)) return false
    seenGuids.add(item.guid)
    seenHeadlines.add(headlineKey)
    return true
  })
}
