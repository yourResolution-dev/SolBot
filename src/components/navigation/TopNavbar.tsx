import { useState } from 'react'
import {
  Search,
  Bell,
  Menu,
  Sparkles,
  Command,
  HelpCircle,
  Keyboard,
} from 'lucide-react'
import { CommandPalette } from './CommandPalette'
import { NotificationPanel } from './NotificationPanel'
import { UserProfileMenu } from './UserProfileMenu'
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal'
import { useNotifications } from '@/context/NotificationContext'
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts'
import { cn } from '@/lib/utils'

interface TopNavbarProps {
  onOpenMobileSidebar: () => void
  onToggleSidebar?: () => void
}

export function TopNavbar({ onOpenMobileSidebar, onToggleSidebar }: TopNavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  const { unreadCount } = useNotifications()

  const { chordPending } = useGlobalShortcuts({
    onOpenCommandPalette: () => {
      setSearchOpen((prev) => !prev)
      setNotificationsOpen(false)
      setProfileOpen(false)
    },
    onOpenShortcutsCheatsheet: () => {
      setShortcutsOpen((prev) => !prev)
      setSearchOpen(false)
      setNotificationsOpen(false)
    },
    onToggleNotifications: () => {
      setNotificationsOpen((prev) => !prev)
      setProfileOpen(false)
    },
    onToggleSidebar,
  })

  return (
    <header className="h-16 bg-white/85 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between transition-all">
      {/* Left side: Mobile burger & Fast Search Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden transition-colors cursor-pointer"
          aria-label="Open mobile navigation"
        >
          <Menu size={20} />
        </button>

        {/* Global Search trigger pill */}
        <button
          onClick={() => {
            setSearchOpen(true)
            setNotificationsOpen(false)
            setProfileOpen(false)
          }}
          className="group flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:border-violet-300 hover:shadow-xs text-slate-400 hover:text-slate-700 transition-all duration-200 text-xs w-48 sm:w-80 justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          aria-label="Search or type a command (Ctrl+K or Cmd+K)"
          title="Open Command Palette (Ctrl+K or Cmd+K)"
        >
          <span className="flex items-center gap-2 truncate">
            <Search size={14} className="text-slate-400 group-hover:text-violet-600 transition-colors" />
            <span className="truncate">Search tickets, customers, commands...</span>
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-500 bg-white border border-slate-200 rounded-md shadow-2xs group-hover:border-violet-200 group-hover:text-violet-700 transition-colors">
            <Command size={10} /> K
          </kbd>
        </button>
      </div>

      {/* Right side: AI pill, Keyboard shortcuts help, Notification badge, User Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Quick status pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50/90 border border-violet-100 text-violet-700 text-xs font-semibold shadow-2xs">
          <Sparkles size={12} className="text-violet-600 animate-spin-slow" />
          <span>Resolution Copilot v2.4</span>
        </div>

        {/* Keyboard Shortcuts Trigger Button */}
        <button
          onClick={() => {
            setShortcutsOpen(true)
            setNotificationsOpen(false)
            setProfileOpen(false)
          }}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100/80 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          title="Keyboard shortcuts (?)"
          aria-label="View keyboard shortcuts"
        >
          <HelpCircle size={18} />
        </button>

        {/* Notifications Trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setNotificationsOpen((prev) => !prev)
              setProfileOpen(false)
            }}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            title="Notification Center (Alt+N)"
            aria-label={`Notifications, ${unreadCount} unread`}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
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
            className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-violet-300 transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            aria-label="User Profile"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white font-semibold flex items-center justify-center text-xs shadow-xs">
              JS
            </div>
          </button>

          <UserProfileMenu
            isOpen={profileOpen}
            onClose={() => setProfileOpen(false)}
          />
        </div>
      </div>

      {/* Floating Chord indicator toast */}
      {chordPending && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs px-4 py-2 rounded-xl shadow-2xl backdrop-blur-md border border-slate-700/80 flex items-center gap-3 animate-scale-in">
          <div className="flex items-center gap-1 font-mono font-bold text-violet-300">
            <span>Press key:</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-300">
            <span><kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-white font-bold">D</kbd> Dash</span>
            <span><kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-white font-bold">T</kbd> Tickets</span>
            <span><kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-white font-bold">C</kbd> Customers</span>
            <span><kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-white font-bold">A</kbd> Automations</span>
            <span><kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-white font-bold">P</kbd> AI</span>
            <span><kbd className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-white font-bold">S</kbd> Settings</span>
          </div>
        </div>
      )}

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpenShortcuts={() => setShortcutsOpen(true)}
        onToggleSidebar={onToggleSidebar}
      />

      {/* Keyboard Shortcuts Cheatsheet Modal */}
      <KeyboardShortcutsModal
        isOpen={shortcutsOpen}
        onClose={() => setShortcutsOpen(false)}
      />
    </header>
  )
}
