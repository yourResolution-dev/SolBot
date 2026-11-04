import { useState, useEffect } from 'react'
import {
  Search,
  Bell,
  Menu,
  Sparkles,
  Command,
  HelpCircle,
  ExternalLink,
} from 'lucide-react'
import { GlobalSearch } from './GlobalSearch'
import { NotificationPanel } from './NotificationPanel'
import { UserProfileMenu } from './UserProfileMenu'
import { notifications } from '@/lib/data'

interface TopNavbarProps {
  onOpenMobileSidebar: () => void
}

export function TopNavbar({ onOpenMobileSidebar }: TopNavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
      {/* Left side: Mobile burger & Fast Search Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden transition-colors"
        >
          <Menu size={20} />
        </button>

        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100 hover:border-slate-300 text-slate-400 hover:text-slate-600 transition-all duration-200 text-xs w-48 sm:w-72 justify-between"
        >
          <span className="flex items-center gap-2 truncate">
            <Search size={14} className="text-slate-400" />
            <span>Search tickets, customers...</span>
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 bg-white border border-slate-200 rounded-md shadow-xs">
            <Command size={10} /> K
          </kbd>
        </button>
      </div>

      {/* Right side: AI pill, Notification badge, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick status pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 border border-violet-100 text-violet-700 text-xs font-medium">
          <Sparkles size={12} className="text-violet-600 animate-spin-slow" />
          <span>Resolution Copilot v2.4</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen((prev) => !prev)
              setProfileOpen(false)
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
            title="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-600 ring-2 ring-white" />
            )}
          </button>

          <NotificationPanel
            isOpen={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
          />
        </div>

        {/* User profile avatar trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen((prev) => !prev)
              setNotificationsOpen(false)
            }}
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-violet-200 transition-all"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 text-white font-semibold flex items-center justify-center text-xs shadow-sm">
              JS
            </div>
          </button>

          <UserProfileMenu
            isOpen={profileOpen}
            onClose={() => setProfileOpen(false)}
          />
        </div>
      </div>

      {/* Global Search Dialog Modal */}
      <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  )
}
