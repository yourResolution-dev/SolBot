import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Settings, ShieldCheck, LogOut, ExternalLink, HelpCircle } from 'lucide-react'

interface UserProfileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export function UserProfileMenu({ isOpen, onClose }: UserProfileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

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
      className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-dropdown border border-slate-100 overflow-hidden z-50 animate-scale-in"
    >
      <div className="p-4 border-b border-slate-100 bg-gradient-to-r from-violet-50/50 to-indigo-50/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-violet-600 text-white font-semibold flex items-center justify-center text-sm shadow-sm ring-2 ring-violet-200">
            JS
          </div>
          <div className="min-w-0">
            <h5 className="text-sm font-semibold text-slate-800 truncate">Julian Sterling</h5>
            <p className="text-xs text-slate-500 truncate">julian@resolutionsupport.ai</p>
          </div>
        </div>
        <div className="mt-2.5 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-medium text-slate-600">Enterprise Workspace Admin</span>
        </div>
      </div>

      <div className="p-2 space-y-0.5">
        <button
          onClick={() => {
            navigate('/settings')
            onClose()
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
        >
          <User className="w-4 h-4 text-slate-400" />
          Account Profile
        </button>

        <button
          onClick={() => {
            navigate('/settings')
            onClose()
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          Workspace Settings
        </button>

        <button
          onClick={() => {
            navigate('/settings')
            onClose()
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
        >
          <ShieldCheck className="w-4 h-4 text-slate-400" />
          Security & API Keys
        </button>

        <a
          href="https://whatsapp.com"
          target="_blank"
          rel="noreferrer"
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-700 transition-colors"
        >
          <span className="flex items-center gap-2.5">
            <HelpCircle className="w-4 h-4 text-slate-400" />
            Documentation
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>

      <div className="p-2 border-t border-slate-100 bg-slate-50">
        <button
          onClick={() => onClose()}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
}
