import React, { useState, useRef, useEffect } from 'react'
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
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <div className={cn('relative inline-block text-left', className)} ref={menuRef}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen((prev) => !prev)
        }}
        className={cn(
          'p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 cursor-pointer',
          buttonClassName
        )}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="More actions"
      >
        {trigger || <MoreVertical size={16} />}
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-orientation="vertical"
          className={cn(
            'absolute top-full mt-1.5 min-w-[200px] bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-xl shadow-dropdown z-50 py-1 animate-scale-in text-xs',
            align === 'right' ? 'right-0' : 'left-0'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {items.map((item) => (
            <button
              key={item.id}
              role="menuitem"
              disabled={item.disabled}
              onClick={() => {
                if (item.disabled) return
                setIsOpen(false)
                item.onClick()
              }}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 text-left font-medium transition-colors cursor-pointer',
                item.disabled
                  ? 'opacity-40 cursor-not-allowed'
                  : item.danger
                  ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                  : 'text-slate-700 hover:bg-violet-50 hover:text-violet-900'
              )}
            >
              <div className="flex items-center gap-2">
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                <span className="truncate">{item.label}</span>
              </div>
              {item.shortcut && (
                <kbd className="ml-3 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 border border-slate-200 rounded">
                  {item.shortcut}
                </kbd>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
