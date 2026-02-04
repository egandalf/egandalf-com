import Link from 'next/link'
import { client } from '@/lib/sanity'
import { siteSettingsQuery, categoriesQuery } from '@/lib/queries'
import type { SiteSettings, Category } from '@/lib/types'

async function getFooterData() {
  const [settings, categories] = await Promise.all([
    client.fetch<SiteSettings>(siteSettingsQuery),
    client.fetch<Category[]>(categoriesQuery),
  ])
  return { settings, categories }
}

export default async function Footer() {
  const { settings, categories } = await getFooterData()
  const topLevelCategories = categories.filter((c) => !c.parent)

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <p className="font-bold text-gray-900">{settings?.siteTitle || 'Blog'}</p>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {settings?.siteDescription}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-sm text-gray-900">Categories</p>
            {topLevelCategories.map((category) => (
              <Link
                key={category._id}
                href={`/${category.slug.current}`}
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                {category.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-sm text-gray-900">Subscribe</p>
            <Link href="/feed.xml" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
              RSS Feed
            </Link>
            {topLevelCategories.map((category) => (
              <Link
                key={category._id}
                href={`/${category.slug.current}/feed.xml`}
                className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
              >
                {category.name} RSS
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} {settings?.siteTitle || 'Blog'}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
