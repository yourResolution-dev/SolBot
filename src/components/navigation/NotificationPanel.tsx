import { useEffect, useRef, useState } from 'react'
import { Bell, CheckCircle2, MessageSquare, AlertTriangle, CreditCard, Sparkles, X } from 'lucide-react'
import { notifications as initialNotifications, type Notification } from '@/lib/data'
import { formatRelativeTime } from '@/lib/utils'

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [items, setItems] = useState<Notification[]>(initialNotifications)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const markAllAsRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })))
  }

  const markAsRead = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: true } : item)))
  }

  const getIcon = (type: Notification['type']) => {
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

  const unreadCount = items.filter((n) => !n.read).length

  return (
    <div
      ref={panelRef}
      className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-dropdown border border-slate-100 overflow-hidden z-50 animate-scale-in"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-semibold text-slate-800">Notifications</h4>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 text-[11px] font-semibold bg-violet-100 text-violet-700 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-violet-600 hover:text-violet-800 font-medium"
            >
              Mark all read
            </button>
          )}
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
        {items.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">No notifications right now.</div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              onClick={() => markAsRead(item.id)}
              className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 transition-colors cursor-pointer ${
                !item.read ? 'bg-violet-50/40' : ''
              }`}
            >
              <div className="p-2 rounded-xl bg-white border border-slate-100 shadow-sm shrink-0">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className={`text-xs font-medium truncate ${!item.read ? 'text-slate-900 font-semibold' : 'text-slate-700'}`}>
                    {item.title}
                  </p>
                  {!item.read && <span className="w-1.5 h-1.5 rounded-full bg-violet-600 shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                  {item.body}
                </p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {formatRelativeTime(item.time)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-2 border-t border-slate-100 bg-slate-50 text-center">
        <button className="text-xs text-slate-500 hover:text-slate-800 font-medium py-1">
          View notification settings
        </button>
      </div>
    </div>
  )
}
