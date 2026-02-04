'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'

interface SearchResult {
  url: string
  meta: {
    title: string
  }
  excerpt: string
}

interface Pagefind {
  search: (query: string) => Promise<{ results: Array<{ data: () => Promise<SearchResult> }> }>
}

declare global {
  interface Window {
    pagefind?: Pagefind
  }
}

export default function Search() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagefindLoaded, setPagefindLoaded] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load Pagefind script dynamically
    if (typeof window !== 'undefined' && !window.pagefind && !pagefindLoaded) {
      const script = document.createElement('script')
      script.src = '/pagefind/pagefind.js'
      script.async = true
      script.onload = () => setPagefindLoaded(true)
      script.onerror = () => console.log('Pagefind not available - run build first')
      document.head.appendChild(script)
    }
  }, [pagefindLoaded])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === 'Escape') {
        setIsOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearch = useCallback(async (searchQuery: string) => {
    setQuery(searchQuery)
    if (!searchQuery.trim() || !window.pagefind) {
      setResults([])
      return
    }

    setIsLoading(true)
    try {
      const search = await window.pagefind.search(searchQuery)
      const data = await Promise.all(search.results.slice(0, 5).map((r) => r.data()))
      setResults(data)
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    }
    setIsLoading(false)
  }, [])

  function handleResultClick() {
    setIsOpen(false)
    setQuery('')
    setResults([])
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 border border-gray-200 rounded-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline text-xs bg-gray-100 px-1.5 py-0.5 rounded">⌘K</kbd>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />
          <div className="relative min-h-screen flex items-start justify-center pt-[20vh] px-4">
            <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg">
              <div className="flex items-center border-b px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search posts..."
                  className="flex-1 px-4 py-4 text-lg outline-none"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  ESC
                </button>
              </div>

              {isLoading && (
                <div className="p-4 text-center text-gray-500">Searching...</div>
              )}

              {!isLoading && results.length > 0 && (
                <ul className="max-h-96 overflow-y-auto p-2">
                  {results.map((result, index) => (
                    <li key={index}>
                      <Link
                        href={result.url}
                        onClick={handleResultClick}
                        className="block p-3 rounded-lg hover:bg-gray-100"
                      >
                        <div className="font-medium">{result.meta.title}</div>
                        <div
                          className="text-sm text-gray-500 mt-1 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: result.excerpt }}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {!isLoading && query && results.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  No results found for &quot;{query}&quot;
                </div>
              )}

              {!query && (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Start typing to search...
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
