import { client } from '@/lib/sanity'
import { postsForRSSQuery, siteSettingsQuery } from '@/lib/queries'
import type { SiteSettings } from '@/lib/types'

interface RSSPost {
  title: string
  slug: { current: string }
  excerpt: string
  publishedAt: string
  categorySlug: string
  categoryName: string
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const [posts, settings] = await Promise.all([
    client.fetch<RSSPost[]>(postsForRSSQuery),
    client.fetch<SiteSettings>(siteSettingsQuery),
  ])

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const siteTitle = settings?.siteTitle || 'Blog'
  const siteDescription = settings?.siteDescription || ''

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteTitle)}</title>
    <link>${siteUrl}</link>
    <description>${escapeXml(siteDescription)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${posts
      .map(
        (post) => `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${siteUrl}/${post.categorySlug}/${post.slug.current}</link>
      <guid isPermaLink="true">${siteUrl}/${post.categorySlug}/${post.slug.current}</guid>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <category>${escapeXml(post.categoryName)}</category>
    </item>`
      )
      .join('')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
