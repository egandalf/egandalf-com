'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark'
type Contrast = 'normal' | 'high'
type Font = 'default' | 'dyslexic'

interface AccessibilitySettings {
  theme: Theme
  contrast: Contrast
  font: Font
}

const defaultSettings: AccessibilitySettings = {
  theme: 'light',
  contrast: 'normal',
  font: 'default',
}

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)
  const [mounted, setMounted] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('accessibility-settings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSettings(parsed)
        applySettings(parsed)
      } catch {
        applySettings(defaultSettings)
      }
    }
  }, [])

  // Apply settings to document
  function applySettings(s: AccessibilitySettings) {
    const root = document.documentElement

    // Theme
    if (s.theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }

    // Contrast
    if (s.contrast === 'high') {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Font
    if (s.font === 'dyslexic') {
      root.classList.add('dyslexic-font')
    } else {
      root.classList.remove('dyslexic-font')
    }
  }

  function updateSetting<K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings))
    applySettings(newSettings)
  }

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" aria-label="Accessibility settings">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        aria-label="Accessibility settings"
        aria-expanded={isOpen}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Accessibility</h3>

            {/* Theme Toggle */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Theme
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => updateSetting('theme', 'light')}
                  className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                    settings.theme === 'light'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Light
                </button>
                <button
                  onClick={() => updateSetting('theme', 'dark')}
                  className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                    settings.theme === 'dark'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Dark
                </button>
              </div>
            </div>

            {/* Contrast Toggle */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Contrast
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => updateSetting('contrast', 'normal')}
                  className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                    settings.contrast === 'normal'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Normal
                </button>
                <button
                  onClick={() => updateSetting('contrast', 'high')}
                  className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                    settings.contrast === 'high'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  High
                </button>
              </div>
            </div>

            {/* Font Toggle */}
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                Font
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => updateSetting('font', 'default')}
                  className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                    settings.font === 'default'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Default
                </button>
                <button
                  onClick={() => updateSetting('font', 'dyslexic')}
                  className={`flex-1 px-3 py-2 text-sm rounded-md transition-colors ${
                    settings.font === 'dyslexic'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  Dyslexic
                </button>
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                setSettings(defaultSettings)
                localStorage.removeItem('accessibility-settings')
                applySettings(defaultSettings)
              }}
              className="mt-4 w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Reset to defaults
            </button>
          </div>
        </>
      )}
    </div>
  )
}
