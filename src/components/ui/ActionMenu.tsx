import React, { useState, useRef, useEffect, useId } from 'react'
import { MoreVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ActionMenuItem {
  id: string
  label: string
  icon?: React.ReactNode
  shortcut?: string
  danger?: boolean
  disabled?: boolean
  onClick: () => void
}

interface ActionMenuProps {
  items: ActionMenuItem[]
  trigger?: React.ReactNode
  align?: 'left' | 'right'
  className?: string
  buttonClassName?: string
}

export function ActionMenu({
  items,
  trigger,
  align = 'right',
  className,
  buttonClassName,
}: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const menuId = useId()

  // Find first enabled item index
  const getFirstEnabledIndex = () => items.findIndex((i) => !i.disabled)

  // Open / Close handlers
  const openMenu = () => {
    setIsOpen(true)
    setFocusedIndex(getFirstEnabledIndex())
  }

  const closeMenu = (refocus = true) => {
    setIsOpen(false)
    setFocusedIndex(-1)
    if (refocus) {
      buttonRef.current?.focus()
    }
  }

  // Handle outside click & escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        closeMenu(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Handle keyboard navigation within the menu
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        openMenu()
      }
      return
    }

    if (e.key === 'Escape') {
      e.preventDefault()
      closeMenu(true)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      let nextIndex = focusedIndex + 1
      while (nextIndex < items.length && items[nextIndex].disabled) {
        nextIndex++
      }
      if (nextIndex < items.length) {
        setFocusedIndex(nextIndex)
      } else {
        // wrap to first enabled
        setFocusedIndex(getFirstEnabledIndex())
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      let prevIndex = focusedIndex - 1
      while (prevIndex >= 0 && items[prevIndex].disabled) {
        prevIndex--
      }
      if (prevIndex >= 0) {
        setFocusedIndex(prevIndex)
      } else {
        // wrap to last enabled
        for (let i = items.length - 1; i >= 0; i--) {
          if (!items[i].disabled) {
            setFocusedIndex(i)
            break
          }
        }
      }
    } else if (e.key === 'Home') {
      e.preventDefault()
      setFocusedIndex(getFirstEnabledIndex())
    } else if (e.key === 'End') {
      e.preventDefault()
      for (let i = items.length - 1; i >= 0; i--) {
        if (!items[i].disabled) {
          setFocusedIndex(i)
          break
        }
      }
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const activeItem = items[focusedIndex]
      if (activeItem && !activeItem.disabled) {
        closeMenu(true)
        activeItem.onClick()
      }
    } else if (e.key === 'Tab') {
      closeMenu(false)
    }
  }

  return (
    <div
      className={cn('relative inline-block text-left', className)}
      ref={menuRef}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={isOpen ? menuId : undefined}
        onClick={(e) => {
          e.stopPropagation()
          if (isOpen) closeMenu(false)
          else openMenu()
        }}
        className={cn(
          'p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 cursor-pointer',
          isOpen ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200' : '',
          buttonClassName
        )}
        title="More actions"
      >
        {trigger || <MoreVertical size={16} />}
      </button>

      {isOpen && (
        <div
          id={menuId}
          role="menu"
          aria-orientation="vertical"
          tabIndex={-1}
          className={cn(
            'absolute top-full mt-1.5 min-w-[210px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 rounded-xl shadow-dropdown z-50 py-1.5 animate-scale-in text-xs outline-none divide-y divide-slate-50 dark:divide-slate-800',
            align === 'right' ? 'right-0' : 'left-0'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item, idx) => {
            const isFocused = idx === focusedIndex

            return (
              <button
                key={item.id}
                role="menuitem"
                tabIndex={-1}
                disabled={item.disabled}
                onMouseEnter={() => !item.disabled && setFocusedIndex(idx)}
                onClick={() => {
                  if (item.disabled) return
                  closeMenu(true)
                  item.onClick()
                }}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2 text-left font-medium transition-colors cursor-pointer select-none',
                  item.disabled
                    ? 'opacity-40 cursor-not-allowed text-slate-400 dark:text-slate-600'
                    : item.danger
                    ? isFocused
                      ? 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                      : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-700 dark:hover:text-red-300'
                    : isFocused
                    ? 'bg-violet-50/90 dark:bg-violet-950/60 text-violet-900 dark:text-violet-200'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-violet-50/70 dark:hover:bg-violet-950/40 hover:text-violet-900 dark:hover:text-violet-200'
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {item.icon && (
                    <span
                      className={cn(
                        'shrink-0 transition-colors',
                        item.danger ? 'text-red-500' : isFocused ? 'text-violet-600 dark:text-violet-400' : 'text-slate-500 dark:text-slate-400'
                      )}
                    >
                      {item.icon}
                    </span>
                  )}
                  <span className="truncate">{item.label}</span>
                </div>

                {item.shortcut && (
                  <kbd className="ml-3 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shrink-0">
                    {item.shortcut}
                  </kbd>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
