import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'

export type Theme = 'light' | 'dark' | 'system'
export type ResolvedTheme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

const THEME_STORAGE_KEY = 'resolution_theme_preference'

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as Theme
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        return saved
      }
    } catch {
      // Fallback to system
    }
    return 'system'
  })

  // Detect system preference
  const [systemIsDark, setSystemIsDark] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemIsDark(e.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const resolvedTheme: ResolvedTheme = useMemo(() => {
    if (theme === 'system') {
      return systemIsDark ? 'dark' : 'light'
    }
    return theme
  }, [theme, systemIsDark])

  // Update DOM classes & attributes
  useEffect(() => {
    const root = document.documentElement
    if (resolvedTheme === 'dark') {
      root.classList.add('dark')
      root.setAttribute('data-theme', 'dark')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      root.setAttribute('data-theme', 'light')
      root.style.colorScheme = 'light'
    }
  }, [resolvedTheme])

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    } catch (e) {
      console.warn('Failed to save theme preference:', e)
    }
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
