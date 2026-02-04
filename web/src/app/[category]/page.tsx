import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { client } from '@/lib/sanity'
import { categoryBySlugQuery, postsByCategoryQuery, categoriesQuery } from '@/lib/queries'
import type { Category, PostListItem } from '@/lib/types'
import PostCard from '@/components/PostCard'

interface Props {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  const categories = await client.fetch<Category[]>(categoriesQuery)
  return categories.map((category) => ({
    category: category.slug.current,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: categorySlug } = await params
  const category = await client.fetch<Category>(categoryBySlugQuery, { slug: categorySlug })

  if (!category) return {}

  return {
    title: category.name,
    description: category.description || `Posts about ${category.name}`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category: categorySlug } = await params
  const [category, posts] = await Promise.all([
    client.fetch<Category>(categoryBySlugQuery, { slug: categorySlug }),
    client.fetch<PostListItem[]>(postsByCategoryQuery, { categorySlug }),
  ])

  if (!category) {
    notFound()
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <header className="mb-12">
        <h1 className="text-3xl font-bold">{category.name}</h1>
        {category.description && (
          <p className="mt-4 text-lg text-gray-600">{category.description}</p>
        )}
      </header>

      {posts.length > 0 ? (
        <div className="grid gap-8 sm:grid-cols-2">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-12">
          No posts in this category yet.
        </p>
      )}
    </div>
  )
}
