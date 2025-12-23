'use client'

import { useContext } from 'react'
import { ThemeContext } from './themeContext'

export function useTheme() {
  const ctx = useContext(ThemeContext)
  // Return default values if not in ThemeProvider (e.g., during SSG)
  if (!ctx) {
    return { theme: 'light' as const, toggleTheme: () => {} }
  }
  return ctx
}

export default useTheme
