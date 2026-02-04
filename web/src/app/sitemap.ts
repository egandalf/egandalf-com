import type { MetadataRoute } from 'next'
import { client } from '@/lib/sanity'
import { allSlugsQuery } from '@/lib/queries'

interface SlugsData {
  posts: Array<{
    slug: { current: string }
    categorySlug: string
    publishedAt: string
    updatedAt?: string
  }>
  categories: Array<{
    slug: { current: string }
  }>
  tags: Array<{
    slug: { current: string }
  }>
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const data = await client.fetch<SlugsData>(allSlugsQuery)

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  const categoryPages: MetadataRoute.Sitemap = data.categories.map((category) => ({
    url: `${siteUrl}/${category.slug.current}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const tagPages: MetadataRoute.Sitemap = data.tags.map((tag) => ({
    url: `${siteUrl}/tag/${tag.slug.current}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  const postPages: MetadataRoute.Sitemap = data.posts.map((post) => ({
    url: `${siteUrl}/${post.categorySlug}/${post.slug.current}`,
    lastModified: new Date(post.updatedAt || post.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...categoryPages, ...tagPages, ...postPages]
}
