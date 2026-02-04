import { client } from '@/lib/sanity'
import { postsQuery, featuredPostsQuery } from '@/lib/queries'
import type { PostListItem } from '@/lib/types'
import PostCard from '@/components/PostCard'

export const revalidate = 60

async function getPosts() {
  const [posts, featuredPosts] = await Promise.all([
    client.fetch<PostListItem[]>(postsQuery),
    client.fetch<PostListItem[]>(featuredPostsQuery),
  ])
  return { posts, featuredPosts }
}

export default async function HomePage() {
  const { posts, featuredPosts } = await getPosts()

  const featuredPost = featuredPosts[0]
  const recentPosts = posts.filter((p) => p._id !== featuredPost?._id).slice(0, 6)

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 bg-white">
      {featuredPost && (
        <section className="mb-16">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
            Featured
          </h2>
          <PostCard post={featuredPost} featured />
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">
          Recent Posts
        </h2>
        <div className="grid gap-8 sm:grid-cols-2">
          {recentPosts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </section>

      {posts.length === 0 && (
        <p className="text-gray-500 text-center py-12">
          No posts yet. Check back soon!
        </p>
      )}
    </div>
  )
}
