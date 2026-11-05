import { useEffect, useRef } from 'react'
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
    markAllAsRead,
    deleteNotification,
    clearAll,
  } = useNotifications()

  const panelRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
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
  }, [isOpen, onClose])

  if (!isOpen) return null

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'unread') return !n.read
    return true
  })

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
        return 'bg-violet-50 border-violet-100'
      case 'ai':
        return 'bg-amber-50 border-amber-100'
      case 'system':
        return 'bg-orange-50 border-orange-100'
      case 'billing':
        return 'bg-blue-50 border-blue-100'
      default:
        return 'bg-slate-50 border-slate-100'
    }
  }

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label="Notification Center"
      className="absolute right-0 top-12 w-80 sm:w-96 bg-white/95 backdrop-blur-xl rounded-2xl shadow-dropdown border border-slate-200/90 overflow-hidden z-50 animate-scale-in"
    >
      {/* Header */}
      <div className="p-3.5 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-violet-100/70 text-violet-700">
              <Bell size={16} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 leading-tight">Notifications</h4>
              <p className="text-[11px] text-slate-400">
                {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-1 px-2 py-1 text-xs font-semibold text-violet-700 hover:text-violet-900 hover:bg-violet-100/60 rounded-lg transition-colors cursor-pointer"
                title="Mark all notifications as read"
              >
                <Check size={13} />
                <span>Mark all read</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors cursor-pointer"
              title="Close panel (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5 bg-slate-200/60 p-0.5 rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'px-2.5 py-1 text-xs font-medium rounded-md transition-all cursor-pointer',
                filter === 'all'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              )}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={cn(
                'px-2.5 py-1 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 cursor-pointer',
                filter === 'unread'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
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
              className="text-[11px] text-slate-400 hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
              title="Clear all notification history"
            >
              <Trash2 size={11} />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100">
        {filteredNotifications.length === 0 ? (
          <div className="py-12 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Inbox size={22} />
            </div>
            <p className="text-sm font-semibold text-slate-700">No notifications</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
              {filter === 'unread'
                ? "You don't have any unread alerts right now."
                : 'All notification feeds are clear.'}
            </p>
          </div>
        ) : (
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              onClick={() => handleNotificationClick(item)}
              className={cn(
                'p-3.5 flex items-start gap-3 hover:bg-slate-50/90 transition-colors cursor-pointer group relative',
                !item.read ? 'bg-violet-50/40' : 'bg-transparent'
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
              <div className="flex-1 min-w-0 pr-8">
                <div className="flex items-center gap-1.5">
                  <p
                    className={cn(
                      'text-xs truncate group-hover:text-violet-900 transition-colors',
                      !item.read ? 'text-slate-900 font-bold' : 'text-slate-700 font-medium'
                    )}
                  >
                    {item.title}
                  </p>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                  {item.body}
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-400">
                  <span className="font-medium">{formatRelativeTime(item.time)}</span>
                  <span>&bull;</span>
                  <span className="capitalize font-mono">{item.type}</span>
                  {item.url && (
                    <span className="text-violet-600 opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity font-medium">
                      Open <ExternalLink size={10} />
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons on right */}
              <div className="absolute right-3 top-3.5 flex items-center gap-1">
                {!item.read ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      markAsRead(item.id)
                    }}
                    className="p-1 rounded-md text-slate-400 hover:text-violet-700 hover:bg-violet-100/70 transition-colors"
                    title="Mark as read"
                  >
                    <span className="w-2 h-2 rounded-full bg-violet-600 block group-hover:hidden" />
                    <Check size={14} className="hidden group-hover:block" />
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteNotification(item.id)
                    }}
                    className="p-1 rounded-md text-slate-300 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                    title="Dismiss"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-2.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500">
        <button
          onClick={() => {
            navigate('/settings')
            onClose()
          }}
          className="flex items-center gap-1.5 hover:text-slate-800 transition-colors font-medium px-2 py-1 rounded-lg hover:bg-slate-100 cursor-pointer text-xs"
        >
          <Settings size={13} />
          Notification Settings
        </button>
        <span className="text-[11px] text-slate-400">Esc to close</span>
      </div>
    </div>
  )
}
