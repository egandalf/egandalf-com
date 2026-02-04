# Project Overview

Blog site with 2+ top-level categories (MarTech, Electrification), built with Sanity CMS and Next.js.

## Tech Stack

- **CMS:** Sanity (hosted studio at sanity.studio)
- **Front-end:** Next.js + Tailwind CSS (based on Sanity Blog Starter)
- **Hosting:** Vercel (front-end)
- **Search:** Pagefind (static, free)
- **Analytics:** Google Analytics

## Project Structure

```
/
├── studio/          # Sanity CMS studio
└── web/             # Next.js front-end
```

## Content Architecture

### Taxonomy (hierarchical categories)
- Categories have optional parent reference for nesting
- One category per post

### Folksonomy (flat tags)
- Tags are flat, user-driven
- Multiple tags per post

### Schemas
- **Category** - name, slug, description, parent
- **Tag** - name, slug
- **Post** - title, slug, category, tags, excerpt, body, featuredImage, publishedAt, updatedAt, featured, seo, author, cta, resources
- **Author** - single document (not multi-author)
- **Site Settings** - singleton for global config

## Computed Values (not stored in Sanity)

- **readingTime** - Calculate from body content at build/render time
- **relatedPosts** - Algorithm: same category + shared tags, weighted by tag overlap
- **canonicalUrl** - Defaults to page URL, Sanity field is override only

## Features

| Feature | Status |
|---------|--------|
| RSS feeds (per category) | Yes |
| Sitemap | Yes |
| OpenGraph meta | Yes |
| Google Analytics | Yes |
| Search (Pagefind) | Yes |
| Contact form | No |
| Comments | No |
| Newsletter | No |

## Development Commands

```bash
# Sanity studio
cd studio && npm run dev

# Next.js front-end
cd web && npm run dev

# Build (includes Pagefind indexing)
cd web && npm run build
```

## URL Structure

- `/` - Homepage (featured + recent posts)
- `/[category]` - Category listing
- `/[category]/[slug]` - Individual post
- `/[category]/feed.xml` - Category RSS feed
- `/tag/[slug]` - Tag listing
- `/about` - About page
- `/feed.xml` - Main RSS feed
- `/sitemap.xml` - Auto-generated sitemap

## Environment Variables

Required in `web/.env.local`:
- `NEXT_PUBLIC_SANITY_PROJECT_ID` - Sanity project ID (gwk4ooy2)
- `NEXT_PUBLIC_SANITY_DATASET` - Dataset name (production)
- `NEXT_PUBLIC_SANITY_API_VERSION` - API version
- `NEXT_PUBLIC_SITE_URL` - Full site URL for RSS/sitemap/OG

## Deployment

- **Front-end:** Push to main branch triggers Vercel deploy
- **Sanity Studio:** Deploy via `cd studio && sanity deploy`

## Key Files

- `studio/schemaTypes/` - Sanity schema definitions
- `web/src/lib/queries.ts` - GROQ queries
- `web/src/lib/types.ts` - TypeScript types
- `web/src/components/` - React components
- `web/src/app/` - Next.js App Router pages
