import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  CheckCircle2,
  MessageSquare,
  AlertTriangle,
  CreditCard,
  Sparkles,
  X,
  Trash2,
  ExternalLink,
  Check,
  Inbox,
  Settings,
  Circle,
} from 'lucide-react'
import { useNotifications, type ExtendedNotification } from '@/context/NotificationContext'
import { formatRelativeTime, cn } from '@/lib/utils'

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const {
    notifications,
    unreadCount,
    filter,
    setFilter,
    markAsRead,
    toggleReadStatus,
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications()

  const [focusedIndex, setFocusedIndex] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read
    return true
  })

  // Reset focused index when filter changes
  useEffect(() => {
    setFocusedIndex(0)
  }, [filter])

  // Scroll focused item into view
  useEffect(() => {
    if (listRef.current) {
      const el = listRef.current.querySelector('[data-focused="true"]')
      if (el) {
        el.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [focusedIndex])

  // Handle outside click & keyboard shortcuts
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (!isOpen) return

      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusedIndex((prev) =>
          filteredNotifications.length === 0 ? 0 : (prev + 1) % filteredNotifications.length
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusedIndex((prev) =>
          filteredNotifications.length === 0
            ? 0
            : (prev - 1 + filteredNotifications.length) % filteredNotifications.length
        )
      } else if (e.key === 'Enter') {
        const item = filteredNotifications[focusedIndex]
        if (item) {
          e.preventDefault()
          handleNotificationClick(item)
        }
      } else if (e.key === 'm' || e.key === 'M') {
        const item = filteredNotifications[focusedIndex]
        if (item) {
          e.preventDefault()
          toggleReadStatus(item.id)
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        const item = filteredNotifications[focusedIndex]
        if (item) {
          e.preventDefault()
          deleteNotification(item.id)
        }
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
  }, [isOpen, onClose, filteredNotifications, focusedIndex, toggleReadStatus, deleteNotification])

  if (!isOpen) return null

  const handleNotificationClick = (item: ExtendedNotification) => {
    markAsRead(item.id)
    if (item.url) {
      navigate(item.url)
      onClose()
    }
  }

  const getIcon = (type: ExtendedNotification['type']) => {
    switch (type) {
      case 'ticket':
        return <MessageSquare className="w-4 h-4 text-violet-600" />
      case 'ai':
        return <Sparkles className="w-4 h-4 text-amber-500" />
      case 'system':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case 'billing':
        return <CreditCard className="w-4 h-4 text-blue-500" />
      default:
        return <Bell className="w-4 h-4 text-slate-500" />
    }
  }

  const getBadgeBg = (type: ExtendedNotification['type']) => {
    switch (type) {
      case 'ticket':
        return 'bg-violet-50 dark:bg-violet-950/60 border-violet-100 dark:border-violet-900/60'
      case 'ai':
        return 'bg-amber-50 dark:bg-amber-950/60 border-amber-100 dark:border-amber-900/60'
      case 'system':
        return 'bg-orange-50 dark:bg-orange-950/60 border-orange-100 dark:border-orange-900/60'
      case 'billing':
        return 'bg-blue-50 dark:bg-blue-950/60 border-blue-100 dark:border-blue-900/60'
      default:
        return 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700'
    }
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Notification Center"
      className="absolute right-0 top-12 w-80 sm:w-96 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-modal border border-slate-200/90 dark:border-slate-800 overflow-hidden z-50 animate-scale-in"
    >
      {/* Header */}
      <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/70">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-violet-100/70 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300">
              <Bell size={16} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">Notifications</h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-violet-700 dark:text-violet-300 hover:text-violet-900 dark:hover:text-violet-100 hover:bg-violet-100/60 dark:hover:bg-violet-950/60 rounded-lg transition-colors cursor-pointer"
                title="Mark all notifications as read"
              >
                <Check size={13} />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Close panel (Esc)"
              aria-label="Close notification panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 bg-slate-200/60 dark:bg-slate-800 p-0.5 rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer',
                filter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={cn(
                'px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 cursor-pointer',
                filter === 'unread'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-semibold shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              Unread
              {unreadCount > 0 && (
                <span className="w-4 h-4 text-[10px] font-bold rounded-full bg-violet-600 text-white flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-[11px] text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1 cursor-pointer font-medium"
              title="Clear all notification history"
            >
              <Trash2 size={11} />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Notifications Scroll List */}
      <div
        ref={listRef}
        role="list"
        className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800"
      >
        {filteredNotifications.length === 0 ? (
          <div className="py-12 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Inbox size={22} />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No notifications</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 max-w-xs mx-auto">
              {filter === 'unread'
                ? "You don't have any unread alerts right now."
                : 'All notification feeds are clear.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((item, index) => {
            const isFocused = index === focusedIndex

            return (
              <div
                key={item.id}
                role="listitem"
                data-focused={isFocused}
                onClick={() => handleNotificationClick(item)}
                onMouseEnter={() => setFocusedIndex(index)}
                className={cn(
                  'p-3.5 flex items-start gap-3 transition-colors cursor-pointer group relative text-left',
                  !item.read ? 'bg-violet-50/40 dark:bg-violet-950/20' : 'bg-transparent',
                  isFocused ? 'bg-violet-50/70 dark:bg-violet-950/40 border-l-4 border-l-violet-600' : 'border-l-4 border-l-transparent'
                )}
              >
                {/* Type Icon Badge */}
                <div
                  className={cn(
                    'p-2 rounded-xl border shadow-xs shrink-0 mt-0.5',
                    getBadgeBg(item.type)
                  )}
                >
                  {getIcon(item.type)}
                </div>

                {/* Notification Content */}
                <div className="flex-1 min-w-0 pr-12">
                  <div className="flex items-center gap-1.5">
                    <p
                      className={cn(
                        'text-xs truncate group-hover:text-violet-900 dark:group-hover:text-violet-300 transition-colors',
                        !item.read ? 'text-slate-900 dark:text-slate-100 font-bold' : 'text-slate-700 dark:text-slate-300 font-medium'
                      )}
                    >
                      {item.title}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                    {item.body}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400 dark:text-slate-500">
                    <span className="font-medium">{formatRelativeTime(item.time)}</span>
                    <span>&bull;</span>
                    <span className="capitalize font-mono">{item.type}</span>
                    {item.url && (
                      <span className="text-violet-600 dark:text-violet-400 opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity font-semibold">
                        Open <ExternalLink size={10} />
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Controls on right */}
                <div className="absolute right-3 top-3.5 flex items-center gap-1">
                  {/* Toggle Read/Unread Status */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleReadStatus(item.id)
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-violet-700 dark:hover:text-violet-300 hover:bg-violet-100/70 dark:hover:bg-violet-950/50 transition-colors cursor-pointer"
                    title={item.read ? 'Mark as unread' : 'Mark as read'}
                    aria-label={item.read ? 'Mark as unread' : 'Mark as read'}
                  >
                    {!item.read ? (
                      <span className="w-2.5 h-2.5 rounded-full bg-violet-600 block ring-2 ring-violet-200 dark:ring-violet-800" />
                    ) : (
                      <Circle size={13} className="text-slate-300 dark:text-slate-600 hover:text-violet-600 dark:hover:text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </button>

                  {/* Dismiss / Delete button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNotification(item.id)
                    }}
                    className="p-1 rounded-md text-slate-300 dark:text-slate-600 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                    title="Dismiss notification"
                    aria-label="Dismiss notification"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Footer bar with keyboard hints */}
      <div className="p-2.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-850/70 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <button
          onClick={() => {
            navigate('/settings')
            onClose()
          }}
          className="flex items-center gap-1.5 hover:text-slate-800 dark:hover:text-slate-200 transition-colors font-medium px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-xs"
        >
          <Settings size={13} />
          Notification Settings
        </button>

        <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
          <span className="hidden sm:inline">
            <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-300 font-mono">↑↓</kbd> Select
          </span>
          <span className="hidden sm:inline">
            <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-300 font-mono">M</kbd> Read
          </span>
          <span>
            <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-600 dark:text-slate-300 font-mono">Esc</kbd> Close
          </span>
        </div>
      </div>
    </div>
  )
}
