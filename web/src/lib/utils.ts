import type { PortableTextBlock } from '@portabletext/types'

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateShort(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function calculateReadingTime(blocks: PortableTextBlock[]): number {
  const wordsPerMinute = 200
  let wordCount = 0

  for (const block of blocks) {
    if (block._type === 'block' && block.children) {
      for (const child of block.children) {
        if (child._type === 'span' && typeof child.text === 'string') {
          wordCount += child.text.split(/\s+/).filter(Boolean).length
        }
      }
    }
  }

  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

export function absoluteUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  return `${baseUrl}${path}`
}
