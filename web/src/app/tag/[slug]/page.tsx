import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { tagBySlugQuery, postsByTagQuery, tagsQuery } from '@/lib/queries'
import type { Tag, PostListItem } from '@/lib/types'
import PostCard from '@/components/PostCard'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const tags = await client.fetch<Tag[]>(tagsQuery)
  return tags.map((tag) => ({
    slug: tag.slug.current,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tag = await client.fetch<Tag>(tagBySlugQuery, { slug })

  if (!tag) return {}

  return {
    title: `Posts tagged "${tag.name}"`,
    description: `All posts tagged with ${tag.name}`,
  }
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params
  const [tag, posts] = await Promise.all([
    client.fetch<Tag>(tagBySlugQuery, { slug }),
    client.fetch<PostListItem[]>(postsByTagQuery, { tagSlug: slug }),
  ])

  if (!tag) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-12">
        <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Tag</p>
        <h1 className="text-3xl font-bold">{tag.name}</h1>
        <p className="mt-2 text-gray-600">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
      </header>

      {posts.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-12">
          No posts with this tag yet.
        </p>
      )}
    </div>
  )
}
