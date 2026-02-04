import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import { formatDateShort } from '@/lib/utils'
import type { PostListItem } from '@/lib/types'

interface PostCardProps {
  post: PostListItem
  featured?: boolean
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const postUrl = `/${post.category.slug.current}/${post.slug.current}`

  return (
    <article className={`group ${featured ? 'col-span-full' : ''}`}>
      <Link href={postUrl} className="block">
        {post.featuredImage && (
          <div className={`relative overflow-hidden rounded-lg bg-gray-100 ${featured ? 'aspect-[2/1]' : 'aspect-[3/2]'}`}>
            <Image
              src={urlFor(post.featuredImage).width(featured ? 1200 : 600).height(featured ? 600 : 400).url()}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <div className="mt-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-blue-600 font-medium">{post.category.name}</span>
            <span className="text-gray-400">&middot;</span>
            <time dateTime={post.publishedAt} className="text-gray-500">{formatDateShort(post.publishedAt)}</time>
          </div>
          <h2 className={`mt-2 font-bold text-gray-900 group-hover:text-blue-600 transition-colors ${featured ? 'text-2xl' : 'text-lg'}`}>
            {post.title}
          </h2>
          <p className="mt-2 text-gray-600 line-clamp-2">{post.excerpt}</p>
        </div>
      </Link>
      {post.tags && post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <Link
              key={tag._id}
              href={`/tag/${tag.slug.current}`}
              className="text-xs text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      )}
    </article>
  )
}
