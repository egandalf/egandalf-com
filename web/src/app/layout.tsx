import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import { client } from '@/lib/sanity'
import { siteSettingsQuery } from '@/lib/queries'
import type { SiteSettings } from '@/lib/types'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

async function getSettings() {
  return client.fetch<SiteSettings>(siteSettingsQuery)
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()

  return {
    title: {
      default: settings?.siteTitle || 'Blog',
      template: `%s | ${settings?.siteTitle || 'Blog'}`,
    },
    description: settings?.siteDescription,
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const settings = await getSettings()

  return (
    <html lang="en" className="bg-white">
      <body className={`${inter.variable} font-sans antialiased bg-white text-gray-900`}>
        <GoogleAnalytics gaId={settings?.googleAnalyticsId} />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 bg-white">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
