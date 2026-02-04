import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { client, urlFor } from '@/lib/sanity'
import { postBySlugQuery, relatedPostsQuery, postsQuery } from '@/lib/queries'
import type { Post, RelatedPost, PostListItem } from '@/lib/types'
import { formatDate, calculateReadingTime, absoluteUrl } from '@/lib/utils'
import PortableText from '@/components/PortableText'

interface Props {
  params: Promise<{ category: string; slug: string }>
}

export async function generateStaticParams() {
  const posts = await client.fetch<PostListItem[]>(postsQuery)
  return posts.map((post) => ({
    category: post.category.slug.current,
    slug: post.slug.current,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await client.fetch<Post>(postBySlugQuery, { slug })

  if (!post) return {}

  const ogImage = post.seo?.ogImage || post.featuredImage
  const description = post.seo?.metaDescription || post.excerpt
  const canonical = post.seo?.canonicalUrl || absoluteUrl(`/${post.category.slug.current}/${post.slug.current}`)

  return {
    title: post.title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: ogImage
        ? [
            {
              url: urlFor(ogImage).width(1200).height(630).url(),
              width: 1200,
              height: 630,
            },
          ]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
    },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await client.fetch<Post>(postBySlugQuery, { slug })

  if (!post) {
    notFound()
  }

  const relatedPosts = await client.fetch<RelatedPost[]>(relatedPostsQuery, {
    currentId: post._id,
    categoryId: post.category._id,
    tagIds: post.tags?.map((t) => t._id) || [],
  })

  const readingTime = post.body ? calculateReadingTime(post.body) : 0

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 bg-white">
      <header className="mb-8">
        <div className="flex items-center gap-2 text-sm mb-4">
          <Link
            href={`/${post.category.slug.current}`}
            className="text-blue-600 font-medium hover:underline"
          >
            {post.category.name}
          </Link>
          <span className="text-gray-400">&middot;</span>
          <time dateTime={post.publishedAt} className="text-gray-500">{formatDate(post.publishedAt)}</time>
          {readingTime > 0 && (
            <>
              <span className="text-gray-400">&middot;</span>
              <span className="text-gray-500">{readingTime} min read</span>
            </>
          )}
        </div>
        <h1 className="text-4xl font-bold leading-tight text-gray-900">{post.title}</h1>
        {post.updatedAt && post.updatedAt !== post.publishedAt && (
          <p className="text-sm text-gray-500 mt-2">
            Updated {formatDate(post.updatedAt)}
          </p>
        )}
      </header>

      {post.featuredImage && (
        <div className="relative aspect-[2/1] overflow-hidden rounded-lg mb-8">
          <Image
            src={urlFor(post.featuredImage).width(1200).height(600).url()}
            alt={post.featuredImage.alt || post.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {post.body && (
        <div className="prose prose-lg max-w-none">
          <PortableText value={post.body} />
        </div>
      )}

      {post.cta?.text && post.cta?.url && (
        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <a
            href={post.cta.url}
            className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {post.cta.text} &rarr;
          </a>
        </div>
      )}

      {post.resources && post.resources.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-4">Resources</h2>
          <ul className="space-y-2">
            {post.resources.map((resource, index) => (
              <li key={index}>
                <a
                  href={resource.url}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {resource.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {post.tags && post.tags.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Tags
          </h2>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Link
                key={tag._id}
                href={`/tag/${tag.slug.current}`}
                className="text-gray-600 bg-gray-100 px-3 py-1 rounded-full text-sm hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {relatedPosts.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Related Posts</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost._id}
                href={`/${relatedPost.category.slug.current}/${relatedPost.slug.current}`}
                className="group"
              >
                {relatedPost.featuredImage && (
                  <div className="relative aspect-[3/2] overflow-hidden rounded-lg mb-3">
                    <Image
                      src={urlFor(relatedPost.featuredImage).width(400).height(267).url()}
                      alt={relatedPost.featuredImage.alt || relatedPost.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {relatedPost.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {relatedPost.category.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
