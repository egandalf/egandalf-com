import type { Metadata } from 'next'
import Image from 'next/image'
import { client, urlFor } from '@/lib/sanity'
import { authorQuery, siteSettingsQuery } from '@/lib/queries'
import type { Author, SiteSettings } from '@/lib/types'

export const metadata: Metadata = {
  title: 'About',
}

export default async function AboutPage() {
  const [author, settings] = await Promise.all([
    client.fetch<Author>(authorQuery),
    client.fetch<SiteSettings>(siteSettingsQuery),
  ])

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">About</h1>

      {author ? (
        <div className="flex flex-col sm:flex-row gap-8">
          {author.avatar && (
            <div className="flex-shrink-0">
              <Image
                src={urlFor(author.avatar).width(200).height(200).url()}
                alt={author.name}
                width={200}
                height={200}
                className="rounded-full"
              />
            </div>
          )}
          <div>
            <h2 className="text-2xl font-semibold mb-4">{author.name}</h2>
            {author.bio && (
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {author.bio}
              </p>
            )}
            {author.socialLinks && author.socialLinks.length > 0 && (
              <div className="mt-6 flex gap-4">
                {author.socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-gray-900 capitalize"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Author information coming soon.</p>
      )}

      {settings?.siteDescription && (
        <div className="mt-12 pt-8 border-t">
          <h2 className="text-xl font-semibold mb-4">About This Site</h2>
          <p className="text-gray-600 leading-relaxed">{settings.siteDescription}</p>
        </div>
      )}
    </div>
  )
}
