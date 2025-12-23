'use client'

import React, { useState, useEffect } from 'react'
import { GdsTheme } from '@sebgroup/green-core/react'
import { ThemeContext, type Theme } from './themeContext'

const STORAGE_KEY = 'gds-theme'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === 'dark') return 'dark'
  } catch {
    // ignore
  }
  return 'light'
}

export const ThemeProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setTheme(getInitialTheme())
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // ignore localStorage write errors
    }
  }, [theme, mounted])

  const toggleTheme = () => setTheme((t: Theme) => (t === 'dark' ? 'light' : 'dark'))

  const setThemeDirect = (t: Theme) => setTheme(t)

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme: setThemeDirect }}>
      <GdsTheme color-scheme={theme === 'dark' ? 'dark' : 'light'} design-version="2023">
        {children}
      </GdsTheme>
    </ThemeContext.Provider>
  )
}

export default ThemeProvider
