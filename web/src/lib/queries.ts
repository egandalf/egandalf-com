import { groq } from 'next-sanity'

// Site Settings
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteTitle,
    siteDescription,
    logo,
    logoDark,
    defaultOgImage,
    socialLinks,
    googleAnalyticsId
  }
`

// Author
export const authorQuery = groq`
  *[_type == "author"][0] {
    name,
    bio,
    avatar,
    socialLinks
  }
`

// Categories
export const categoriesQuery = groq`
  *[_type == "category"] | order(name asc) {
    _id,
    name,
    slug,
    description,
    "parent": parent->{ _id, name, slug }
  }
`

export const categoryBySlugQuery = groq`
  *[_type == "category" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    description,
    "parent": parent->{ _id, name, slug }
  }
`

// Tags
export const tagsQuery = groq`
  *[_type == "tag"] | order(name asc) {
    _id,
    name,
    slug
  }
`

export const tagBySlugQuery = groq`
  *[_type == "tag" && slug.current == $slug][0] {
    _id,
    name,
    slug
  }
`

// Posts
export const postsQuery = groq`
  *[_type == "post" && defined(publishedAt)] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    updatedAt,
    featured,
    featuredImage,
    "category": category->{ _id, name, slug },
    "tags": tags[]->{ _id, name, slug },
    "author": author->{ name, avatar }
  }
`

export const featuredPostsQuery = groq`
  *[_type == "post" && defined(publishedAt) && featured == true] | order(publishedAt desc) [0...5] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    featuredImage,
    "category": category->{ _id, name, slug }
  }
`

export const postsByCategoryQuery = groq`
  *[_type == "post" && defined(publishedAt) && category->slug.current == $categorySlug] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    updatedAt,
    featuredImage,
    "category": category->{ _id, name, slug },
    "tags": tags[]->{ _id, name, slug },
    "author": author->{ name, avatar }
  }
`

export const postsByTagQuery = groq`
  *[_type == "post" && defined(publishedAt) && $tagSlug in tags[]->slug.current] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    updatedAt,
    featuredImage,
    "category": category->{ _id, name, slug },
    "tags": tags[]->{ _id, name, slug },
    "author": author->{ name, avatar }
  }
`

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    body,
    publishedAt,
    updatedAt,
    featured,
    featuredImage,
    "category": category->{ _id, name, slug, "parent": parent->{ _id, name, slug } },
    "tags": tags[]->{ _id, name, slug },
    "author": author->{ name, bio, avatar, socialLinks },
    seo,
    cta,
    resources
  }
`

// Related posts: same category + shared tags
export const relatedPostsQuery = groq`
  *[_type == "post" && defined(publishedAt) && _id != $currentId && (
    category._ref == $categoryId ||
    count((tags[]._ref)[@ in $tagIds]) > 0
  )] | order(publishedAt desc) [0...4] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    featuredImage,
    "category": category->{ _id, name, slug },
    "sharedTagCount": count((tags[]._ref)[@ in $tagIds])
  }
`

// For RSS feeds
export const postsForRSSQuery = groq`
  *[_type == "post" && defined(publishedAt)] | order(publishedAt desc) [0...50] {
    title,
    slug,
    excerpt,
    publishedAt,
    "categorySlug": category->slug.current,
    "categoryName": category->name
  }
`

export const postsByCategoryForRSSQuery = groq`
  *[_type == "post" && defined(publishedAt) && category->slug.current == $categorySlug] | order(publishedAt desc) [0...50] {
    title,
    slug,
    excerpt,
    publishedAt,
    "categorySlug": category->slug.current,
    "categoryName": category->name
  }
`

// For sitemap
export const allSlugsQuery = groq`{
  "posts": *[_type == "post" && defined(publishedAt)] { slug, publishedAt, updatedAt, "categorySlug": category->slug.current },
  "categories": *[_type == "category"] { slug },
  "tags": *[_type == "tag"] { slug }
}`
