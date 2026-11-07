import { useEffect, useRef } from 'react'
import {
  Keyboard,
  X,
  Command,
  ArrowRight,
  LifeBuoy,
  Users,
  Cpu,
  Sparkles,
  BarChart3,
  Settings,
  LayoutDashboard,
  MessageSquare,
  Bot,
  CheckCircle,
  Bell,
  PanelLeftClose,
} from 'lucide-react'

interface KeyboardShortcutsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ShortcutGroup {
  category: string
  items: {
    keys: string[]
    description: string
    icon?: React.ReactNode
  }[]
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    category: 'Global & Search',
    items: [
      {
        keys: ['Ctrl', 'K'],
        description: 'Open Global Command Palette & universal search',
        icon: <Command className="w-3.5 h-3.5 text-violet-600" />,
      },
      {
        keys: ['?'],
        description: 'Open this Keyboard Shortcuts Cheatsheet',
        icon: <Keyboard className="w-3.5 h-3.5 text-purple-600" />,
      },
      {
        keys: ['Esc'],
        description: 'Close active dialog, palette, or dropdown',
      },
      {
        keys: ['Alt', 'N'],
        description: 'Toggle Notification Center panel',
        icon: <Bell className="w-3.5 h-3.5 text-amber-500" />,
      },
      {
        keys: ['Alt', 'B'],
        description: 'Expand or collapse navigation sidebar',
        icon: <PanelLeftClose className="w-3.5 h-3.5 text-slate-500" />,
      },
      {
        keys: ['Alt', 'T'],
        description: 'Toggle Light, Dark, or System color theme',
        icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
      },
    ],
  },
  {
    category: 'Two-Key Navigation Chords (Press G then letter)',
    items: [
      {
        keys: ['G', 'D'],
        description: 'Navigate to Dashboard Overview',
        icon: <LayoutDashboard className="w-3.5 h-3.5 text-violet-600" />,
      },
      {
        keys: ['G', 'T'],
        description: 'Navigate to Support Inbox & Tickets',
        icon: <LifeBuoy className="w-3.5 h-3.5 text-blue-600" />,
      },
      {
        keys: ['G', 'C'],
        description: 'Navigate to Customers Directory & CRM',
        icon: <Users className="w-3.5 h-3.5 text-emerald-600" />,
      },
      {
        keys: ['G', 'A'],
        description: 'Navigate to Automations Studio',
        icon: <Cpu className="w-3.5 h-3.5 text-indigo-600" />,
      },
      {
        keys: ['G', 'P'],
        description: 'Navigate to AI Copilot Assistant',
        icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
      },
      {
        keys: ['G', 'R'],
        description: 'Navigate to Performance Reports',
        icon: <BarChart3 className="w-3.5 h-3.5 text-sky-600" />,
      },
      {
        keys: ['G', 'S'],
        description: 'Navigate to Workspace Settings',
        icon: <Settings className="w-3.5 h-3.5 text-slate-600" />,
      },
    ],
  },
  {
    category: 'Conversation & Support Inbox',
    items: [
      {
        keys: ['Enter'],
        description: 'Send chat message to WhatsApp / live channel',
        icon: <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />,
      },
      {
        keys: ['Shift', 'Enter'],
        description: 'Insert new line in message composer',
      },
      {
        keys: ['Alt', 'A'],
        description: 'Toggle AI Copilot auto-replies vs Human Takeover',
        icon: <Bot className="w-3.5 h-3.5 text-amber-500" />,
      },
      {
        keys: ['Alt', 'R'],
        description: 'Mark selected conversation as Resolved',
        icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />,
      },
      {
        keys: ['Alt', 'D'],
        description: 'Toggle customer details & orders drawer',
      },
    ],
  },
  {
    category: 'Command Palette & Notifications Navigation',
    items: [
      {
        keys: ['↑', '↓'],
        description: 'Navigate through search results or notification alerts',
      },
      {
        keys: ['Enter'],
        description: 'Execute highlighted action or open conversation / contact',
      },
      {
        keys: ['Tab'],
        description: 'Cycle category filter tabs (Actions, Pages, Chats, Contacts, Flows)',
      },
      {
        keys: ['M'],
        description: 'Toggle notification read / unread status (inside notification panel)',
      },
      {
        keys: ['Del'],
        description: 'Dismiss / delete notification (inside notification panel)',
      },
    ],
  },
]

export function KeyboardShortcutsModal({ isOpen, onClose }: KeyboardShortcutsModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard Shortcuts"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-modal border border-slate-200/90 dark:border-slate-800 overflow-hidden z-10 animate-scale-in max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300">
              <Keyboard size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
                Keyboard Shortcuts Cheatsheet
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500">Power navigation and fast agent workflows</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.category} className="space-y-2">
              <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">
                {group.category}
              </h4>
              <div className="bg-slate-50/60 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 divide-y divide-slate-100/80 dark:divide-slate-800/80">
                {group.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-3.5 py-2.5 hover:bg-white dark:hover:bg-slate-800/80 transition-colors text-xs"
                  >
                    <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-200 font-medium">
                      {item.icon && <span className="shrink-0">{item.icon}</span>}
                      <span>{item.description}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {item.keys.map((k, i) => (
                        <kbd
                          key={i}
                          className="px-2 py-0.5 text-[11px] font-mono font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md shadow-2xs"
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 shrink-0">
          <span>Press any combination to trigger instantly</span>
          <kbd className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-500 dark:text-slate-400">
            Esc to dismiss
          </kbd>
        </div>
      </div>
    </div>
  )
}
