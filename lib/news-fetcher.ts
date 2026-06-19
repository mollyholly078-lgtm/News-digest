import Parser from 'rss-parser'

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

const RSS_FEEDS: { url: string; name: string; category: string }[] = [
  { url: 'https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3', name: 'PIB', category: 'india' },
  { url: 'https://www.thehindu.com/news/national/feeder/default.rss', name: 'The Hindu', category: 'india' },
  { url: 'https://feeds.feedburner.com/ndtvnews-india-news', name: 'NDTV', category: 'india' },
  { url: 'https://feeds.bbci.co.uk/news/world/asia/india/rss.xml', name: 'BBC India', category: 'india' },
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', name: 'BBC World', category: 'world' },
  { url: 'https://feeds.reuters.com/reuters/INbusinessNews', name: 'Reuters Business', category: 'economy' },
  { url: 'https://feeds.feedburner.com/ndtvnews-latest', name: 'NDTV Latest', category: 'india' },
]

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

export async function fetchNewsFromRSS(): Promise<RawNewsItem[]> {
  const items: RawNewsItem[] = []
  // Only accept articles published within the last 48 hours
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000)

  for (const feed of RSS_FEEDS) {
    try {
      const parsed = await parser.parseURL(feed.url)
      for (const item of (parsed.items ?? []).slice(0, 10)) {
        const headline = item.title ?? ''
        if (!headline || !isRelevantNews(headline)) continue

        const publishedAt = parsePubDate(item)

        if (!publishedAt) {
          // Skip articles with no parseable date — we cannot trust their freshness
          console.log(`[news-fetcher] Skipping (no pubDate): "${headline}"`)
          continue
        }

        if (publishedAt < cutoff) {
          // Skip articles older than 48 hours
          console.log(`[news-fetcher] Skipping (too old, ${publishedAt.toISOString()}): "${headline}"`)
          continue
        }

        // Use guid first, fall back to link, then headline+sourceName as last resort
        const guid = item.guid ?? item.link ?? `${feed.name}::${headline.slice(0, 80)}`

        console.log(`[news-fetcher] Accepted (${publishedAt.toISOString()}): "${headline}"`)

        items.push({
          guid,
          headline,
          content: item.contentSnippet ?? item.content ?? item.summary ?? '',
          sourceUrl: item.link ?? feed.url,
          sourceName: feed.name,
          publishedAt,
          category: classifyCategory(headline, feed.category),
        })
      }
    } catch (err) {
      // Feed may be unavailable — skip silently in production, log in dev
      console.warn(`[news-fetcher] Feed failed (${feed.url}):`, err)
    }
  }

  return deduplicateNews(items)
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
