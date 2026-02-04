import type { PortableTextBlock } from '@portabletext/types'

export interface SanitySlug {
  _type: 'slug'
  current: string
}

export interface SanityImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
  caption?: string
}

export interface SocialLink {
  platform: string
  url: string
}

export interface Category {
  _id: string
  name: string
  slug: SanitySlug
  description?: string
  parent?: {
    _id: string
    name: string
    slug: SanitySlug
  }
}

export interface Tag {
  _id: string
  name: string
  slug: SanitySlug
}

export interface Author {
  name: string
  bio?: string
  avatar?: SanityImage
  socialLinks?: SocialLink[]
}

export interface PostSEO {
  metaDescription?: string
  ogImage?: SanityImage
  canonicalUrl?: string
}

export interface PostCTA {
  text?: string
  url?: string
}

export interface PostResource {
  label: string
  url: string
}

export interface Post {
  _id: string
  title: string
  slug: SanitySlug
  excerpt: string
  body?: PortableTextBlock[]
  publishedAt: string
  updatedAt?: string
  featured?: boolean
  featuredImage?: SanityImage
  category: Category
  tags?: Tag[]
  author: Author
  seo?: PostSEO
  cta?: PostCTA
  resources?: PostResource[]
}

export interface PostListItem {
  _id: string
  title: string
  slug: SanitySlug
  excerpt: string
  publishedAt: string
  updatedAt?: string
  featured?: boolean
  featuredImage?: SanityImage
  category: {
    _id: string
    name: string
    slug: SanitySlug
  }
  tags?: Tag[]
  author: {
    name: string
    avatar?: SanityImage
  }
}

export interface RelatedPost {
  _id: string
  title: string
  slug: SanitySlug
  excerpt: string
  publishedAt: string
  featuredImage?: SanityImage
  category: {
    _id: string
    name: string
    slug: SanitySlug
  }
  sharedTagCount?: number
}

export interface SiteSettings {
  siteTitle: string
  siteDescription: string
  logo?: SanityImage
  logoDark?: SanityImage
  defaultOgImage?: SanityImage
  socialLinks?: SocialLink[]
  googleAnalyticsId?: string
}
