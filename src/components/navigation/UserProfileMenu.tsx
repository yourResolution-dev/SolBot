import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Settings,
  ShieldCheck,
  LogOut,
  ExternalLink,
  HelpCircle,
  Sparkles,
  Compass,
  RotateCcw,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react'
import { useOnboarding } from '@/context/OnboardingContext'
import { useTheme, type Theme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

interface UserProfileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function UserProfileMenu({ isOpen, onClose }: UserProfileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { openOnboardingModal, resetOnboarding, startTour } = useOnboarding()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
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

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-12 w-64 bg-white dark:bg-slate-900 rounded-2xl shadow-dropdown border border-slate-100 dark:border-slate-800 overflow-hidden z-50 animate-scale-in"
    >
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-violet-50/50 to-indigo-50/30 dark:from-violet-950/40 dark:to-indigo-950/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-600 text-white font-semibold flex items-center justify-center text-sm shadow-sm ring-2 ring-violet-200 dark:ring-violet-800">
            JS
          </div>
          <div className="min-w-0">
            <h5 className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">Julian Sterling</h5>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">julian@resolutionsupport.ai</p>
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-medium text-slate-600 dark:text-slate-300">Enterprise Workspace Admin</span>
        </div>
      </div>

      {/* Theme selection toggle group */}
      <div className="p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
        <div className="flex items-center justify-between px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          <span>Theme</span>
          <span className="capitalize text-violet-600 dark:text-violet-400">{theme}</span>
        </div>
        <div className="grid grid-cols-3 gap-1 mt-1 p-0.5 bg-slate-200/60 dark:bg-slate-800 rounded-xl text-xs">
          {(
            [
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Laptop },
            ] as const
          ).map((t) => {
            const Icon = t.icon
            const isActive = theme === t.id
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as Theme)}
                className={cn(
                  'flex items-center justify-center gap-1.5 py-1.5 rounded-lg font-medium transition-all cursor-pointer',
                  isActive
                    ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 shadow-2xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                )}
              >
                <Icon size={13} />
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="p-2 space-y-0.5">
        <button
          onClick={() => {
            openOnboardingModal()
            onClose()
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-violet-700 dark:text-violet-300 bg-violet-50/70 dark:bg-violet-950/40 hover:bg-violet-100 dark:hover:bg-violet-950/70 transition-colors cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          Workspace Setup Wizard
        </button>

        <button
          onClick={() => {
            startTour()
            onClose()
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-violet-950/40 hover:text-violet-700 dark:hover:text-violet-300 transition-colors cursor-pointer"
        >
          <Compass className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          Interactive Product Tour
        </button>

        <button
          onClick={() => {
            resetOnboarding()
            onClose()
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
          Reset Demo & Restart Setup
        </button>

        <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

        <button
          onClick={() => {
            navigate('/settings')
            onClose()
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-violet-950/40 hover:text-violet-700 dark:hover:text-violet-300 transition-colors cursor-pointer"
        >
          <User className="w-4 h-4 text-slate-400" />
          Account Profile
        </button>

        <button
          onClick={() => {
            navigate('/settings')
            onClose()
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-violet-950/40 hover:text-violet-700 dark:hover:text-violet-300 transition-colors cursor-pointer"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          Workspace Settings
        </button>

        <button
          onClick={() => {
            navigate('/settings')
            onClose()
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-violet-950/40 hover:text-violet-700 dark:hover:text-violet-300 transition-colors cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          Security & API Keys
        </button>

        <a
          href="https://whatsapp.com"
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-violet-950/40 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
        >
          <span className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            Documentation
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>

      <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
        <button
          onClick={() => onClose()}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
