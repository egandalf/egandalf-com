import Link from 'next/link'
import { client, urlFor } from '@/lib/sanity'
import { siteSettingsQuery, categoriesQuery } from '@/lib/queries'
import type { SiteSettings, Category } from '@/lib/types'
import Search from './Search'
import AccessibilityMenu from './AccessibilityMenu'
import Logo from './Logo'

async function getHeaderData() {
  const [settings, categories] = await Promise.all([
    client.fetch<SiteSettings>(siteSettingsQuery),
    client.fetch<Category[]>(categoriesQuery),
  ])
  return { settings, categories }
}

export default async function Header() {
  const { settings, categories } = await getHeaderData()
  const topLevelCategories = categories.filter((c) => !c.parent)

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex flex-col items-center hover:opacity-80 transition-opacity">
            {settings?.logo ? (
              <Logo
                lightSrc={urlFor(settings.logo).width(80).height(80).url()}
                darkSrc={urlFor(settings.logoDark || settings.logo).width(80).height(80).url()}
                alt={settings.logo.alt || settings.siteTitle || 'Logo'}
                siteTitle={settings.siteTitle}
              />
            ) : (
              <span className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                {settings?.siteTitle || 'Blog'}
              </span>
            )}
          </Link>
          <div className="flex flex-wrap items-center gap-6">
            <nav className="flex flex-wrap gap-6">
              {topLevelCategories.map((category) => (
                <Link
                  key={category._id}
                  href={`/${category.slug.current}`}
                  className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
                >
                  {category.name}
                </Link>
              ))}
              <Link href="/about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                About
              </Link>
            </nav>
            <Search />
            <AccessibilityMenu />
          </div>
        </div>
      </div>
    </header>
  )
}
