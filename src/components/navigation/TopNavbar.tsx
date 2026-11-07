import { useState } from 'react'
import {
  Search,
  Bell,
  Menu,
  Sparkles,
  Command,
  HelpCircle,
  Keyboard,
  Compass,
  Database,
  CheckCircle2,
  Sun,
  Moon,
} from 'lucide-react'
import { CommandPalette } from './CommandPalette'
import { NotificationPanel } from './NotificationPanel'
import { UserProfileMenu } from './UserProfileMenu'
import { KeyboardShortcutsModal } from './KeyboardShortcutsModal'
import { useNotifications } from '@/context/NotificationContext'
import { useGlobalShortcuts } from '@/hooks/useGlobalShortcuts'
import { useOnboarding } from '@/context/OnboardingContext'
import { useTheme } from '@/context/ThemeContext'
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

  const { theme, resolvedTheme, toggleTheme } = useTheme()
  const { unreadCount } = useNotifications()
  const { state, openOnboardingModal, demoMode, toggleDemoMode, startTour } = useOnboarding()

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
    onToggleTheme: toggleTheme,
  })

  return (
    <header className="h-16 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between transition-all">
      {/* Left side: Mobile burger & Fast Search Trigger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800 lg:hidden transition-colors cursor-pointer"
          aria-label="Open mobile navigation"
        >
          <Menu size={20} />
        </button>

        {/* Global Search trigger pill */}
        <button
          data-tour="search"
          aria-haspopup="dialog"
          aria-expanded={searchOpen}
          onClick={() => {
            setSearchOpen(true)
            setNotificationsOpen(false)
            setProfileOpen(false)
          }}
          className="group flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-800 hover:border-violet-300 dark:hover:border-violet-500 hover:shadow-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-all duration-200 text-xs w-48 sm:w-72 lg:w-80 justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          aria-label="Search or type a command (Ctrl+K or Cmd+K)"
          title="Open Command Palette (Ctrl+K or Cmd+K)"
        >
          <span className="flex items-center gap-2 truncate">
            <Search size={14} className="text-slate-400 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors" />
            <span className="truncate">Search tickets, customers, commands...</span>
          </span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 rounded-md shadow-2xs group-hover:border-violet-200 dark:group-hover:border-violet-500 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
            <Command size={10} /> K
          </kbd>
        </button>
      </div>

      {/* Right side: Onboarding status, Demo mode, Tour, AI pill, Keyboard shortcuts help, Notification badge, User Profile */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Onboarding Wizard Trigger */}
        {!state.isCompleted ? (
          <button
            onClick={() => openOnboardingModal()}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-semibold shadow-xs hover:shadow-md hover:from-violet-700 hover:to-indigo-700 transition-all cursor-pointer animate-pulse"
            title="Complete Workspace Onboarding"
          >
            <Sparkles size={12} className="animate-spin-slow" />
            <span className="hidden sm:inline">Setup Progress</span>
            <span className="bg-white/20 px-1.5 py-0.2 rounded-full text-[10px]">
              {state.completedSteps.length}/4
            </span>
          </button>
        ) : (
          <button
            onClick={() => openOnboardingModal(0)}
            className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/80 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all cursor-pointer"
            title="Review Workspace Onboarding & Settings"
          >
            <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
            <span>Setup Complete</span>
          </button>
        )}

        {/* Demo Mode Toggle Chip */}
        <button
          onClick={toggleDemoMode}
          className={cn(
            'hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border',
            demoMode
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100/70'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200/70 dark:hover:bg-slate-700'
          )}
          title={demoMode ? 'Demo Workspace Active with 5 sample WhatsApp threads. Click to switch to clean inbox.' : 'Clean inbox active. Click to load sample realistic conversations.'}
        >
          <Database size={12} className={demoMode ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'} />
          <span>{demoMode ? 'Demo Workspace' : 'Clean State'}</span>
        </button>

        {/* Interactive Tour Trigger Button */}
        <button
          onClick={startTour}
          className="p-2 rounded-xl text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          title="Start Interactive Product Tour"
          aria-label="Start Product Tour"
        >
          <Compass size={18} />
        </button>

        {/* Quick status pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50/90 dark:bg-violet-950/60 border border-violet-100 dark:border-violet-900/60 text-violet-700 dark:text-violet-300 text-xs font-semibold shadow-2xs">
          <Sparkles size={12} className="text-violet-600 dark:text-violet-400 animate-spin-slow" />
          <span>Resolution Copilot v2.4</span>
        </div>

        {/* Color Theme Quick Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          title={`Color theme: ${theme} (currently ${resolvedTheme}). Click to toggle (Alt+T)`}
          aria-label={`Toggle color theme (currently ${resolvedTheme})`}
        >
          {resolvedTheme === 'dark' ? (
            <Sun size={18} className="text-amber-400" />
          ) : (
            <Moon size={18} className="text-slate-500" />
          )}
        </button>

        {/* Keyboard Shortcuts Trigger Button */}
        <button
          aria-haspopup="dialog"
          aria-expanded={shortcutsOpen}
          onClick={() => {
            setShortcutsOpen(true)
            setNotificationsOpen(false)
            setProfileOpen(false)
          }}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
          title="Keyboard shortcuts (?)"
          aria-label="View keyboard shortcuts"
        >
          <HelpCircle size={18} />
        </button>

        {/* Notifications Trigger */}
        <div className="relative">
          <button
            aria-haspopup="dialog"
            aria-expanded={notificationsOpen}
            onClick={() => {
              setNotificationsOpen((prev) => !prev)
              setProfileOpen(false)
            }}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            title="Notification Center (Alt+N)"
            aria-label={`Notifications, ${unreadCount} unread`}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
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
            aria-haspopup="menu"
            aria-expanded={profileOpen}
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
