export interface NewsSource {
  name: string
  url: string
  category: string
}

export const NEWS_SOURCES: NewsSource[] = [
  { name: 'PIB', url: 'https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3', category: 'india' },
  { name: 'The Hindu', url: 'https://www.thehindu.com/news/national/feeder/default.rss', category: 'india' },
  { name: 'NDTV', url: 'https://feeds.feedburner.com/ndtvnews-india-news', category: 'india' },
  { name: 'BBC India', url: 'https://feeds.bbci.co.uk/news/world/asia/india/rss.xml', category: 'india' },
  { name: 'BBC World', url: 'https://feeds.bbci.co.uk/news/world/rss.xml', category: 'world' },
  { name: 'Reuters Business', url: 'https://feeds.reuters.com/reuters/INbusinessNews', category: 'economy' },
  { name: 'NDTV Latest', url: 'https://feeds.feedburner.com/ndtvnews-latest', category: 'india' },
  { name: 'Indian Express', url: 'https://indianexpress.com/feed/', category: 'india' },
  { name: 'Hindustan Times', url: 'https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml', category: 'india' },
  { name: 'Times of India', url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms', category: 'india' },
  { name: 'Business Standard', url: 'https://www.business-standard.com/rss/latest.rss', category: 'economy' },
  { name: 'Reuters World', url: 'https://www.reutersagency.com/feed/?best-topics=world&post_type=best', category: 'world' },
  { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'world' },
  { name: 'The Diplomat', url: 'https://thediplomat.com/feed/', category: 'world' },
  { name: 'UN News', url: 'https://news.un.org/feed/subscribe/en/news/all/rss.xml', category: 'world' },
]
