'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface LogoProps {
  lightSrc: string
  darkSrc: string
  alt: string
  siteTitle: string
}

export default function Logo({ lightSrc, darkSrc, alt, siteTitle }: LogoProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check initial state
    const checkDarkMode = () => {
      const html = document.documentElement
      const isDark = html.classList.contains('dark')
      setIsDarkMode(isDark)
    }

    checkDarkMode()

    // Watch for class changes on html element
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDarkMode()
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => observer.disconnect()
  }, [])

  const currentSrc = isDarkMode ? darkSrc : lightSrc

  return (
    <>
      <Image
        src={currentSrc}
        alt={alt}
        width={80}
        height={80}
        className="object-contain"
        priority
      />
      <span className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-1 text-center">
        {siteTitle}
      </span>
    </>
  )
}
