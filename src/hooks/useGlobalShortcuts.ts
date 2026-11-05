import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface UseGlobalShortcutsOptions {
  onOpenCommandPalette: () => void
  onOpenShortcutsCheatsheet: () => void
  onToggleNotifications: () => void
  onToggleSidebar?: () => void
}

export function useGlobalShortcuts({
  onOpenCommandPalette,
  onOpenShortcutsCheatsheet,
  onToggleNotifications,
  onToggleSidebar,
}: UseGlobalShortcutsOptions) {
  const navigate = useNavigate()
  const [chordPending, setChordPending] = useState<string | null>(null)
  const chordTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase()
      const isInput =
        activeTag === 'input' ||
        activeTag === 'textarea' ||
        activeTag === 'select' ||
        (document.activeElement as HTMLElement)?.isContentEditable

      // Global Command Palette: Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onOpenCommandPalette()
        return
      }

      // Alt+N for notifications
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault()
        onToggleNotifications()
        return
      }

      // Alt+B for sidebar toggle
      if (e.altKey && e.key.toLowerCase() === 'b') {
        e.preventDefault()
        onToggleSidebar?.()
        return
      }

      // If user is focused on an input element, do not hijack typing keys
      if (isInput) return

      // Shortcuts modal: '?'
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault()
        onOpenShortcutsCheatsheet()
        return
      }

      // Handling chord keys: 'g' then destination
      if (chordPending === 'g') {
        const dest = e.key.toLowerCase()
        if (dest === 'd') {
          e.preventDefault()
          navigate('/')
        } else if (dest === 't') {
          e.preventDefault()
          navigate('/tickets')
        } else if (dest === 'c') {
          e.preventDefault()
          navigate('/customers')
        } else if (dest === 'a') {
          e.preventDefault()
          navigate('/automations')
        } else if (dest === 'p') {
          e.preventDefault()
          navigate('/ai')
        } else if (dest === 'r') {
          e.preventDefault()
          navigate('/reports')
        } else if (dest === 's') {
          e.preventDefault()
          navigate('/settings')
        }

        setChordPending(null)
        if (chordTimeoutRef.current) clearTimeout(chordTimeoutRef.current)
        return
      }

      // Initiate 'g' chord
      if (e.key.toLowerCase() === 'g' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        setChordPending('g')
        if (chordTimeoutRef.current) clearTimeout(chordTimeoutRef.current)
        chordTimeoutRef.current = setTimeout(() => {
          setChordPending(null)
        }, 1500)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (chordTimeoutRef.current) clearTimeout(chordTimeoutRef.current)
    }
  }, [
    navigate,
    chordPending,
    onOpenCommandPalette,
    onOpenShortcutsCheatsheet,
    onToggleNotifications,
    onToggleSidebar,
  ])

  return { chordPending }
}
