import { useEffect, useRef, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Command,
  ArrowRight,
  LifeBuoy,
  Users,
  Cpu,
  FileText,
  Sparkles,
  Settings,
  LayoutDashboard,
  BarChart3,
  CheckCircle2,
  PlusCircle,
  UserPlus,
  Bell,
  PanelLeftClose,
  Keyboard,
  Clock,
  X,
  MessageSquare,
  Building,
  Mail,
  Phone,
  CornerDownLeft,
  ArrowUpDown,
  Trash2,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ChannelIcon } from '@/components/ui/Avatar'
import { initialConversations, type Conversation } from '@/lib/inboxData'
import { initialContacts, type ContactRecord } from '@/lib/crmData'
import { tickets, customers, automations } from '@/lib/data'
import { useNotifications } from '@/context/NotificationContext'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

export type PaletteCategory = 'all' | 'pages' | 'actions' | 'conversations' | 'contacts'

export interface PaletteItem {
  id: string
  category: 'pages' | 'actions' | 'conversations' | 'contacts'
  title: string
  subtitle: string
  keywords?: string[]
  icon: React.ReactNode
  badge?: string
  shortcut?: string
  onSelect: () => void
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onOpenShortcuts?: () => void
  onToggleSidebar?: () => void
}

const RECENT_SEARCHES_KEY = 'resolution_recent_searches'
const MAX_RECENT = 5

export function CommandPalette({
  isOpen,
  onClose,
  onOpenShortcuts,
  onToggleSidebar,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<PaletteCategory>('all')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY)
      return saved ? JSON.parse(saved) : ['Priya Sharma', 'WhatsApp bot', 'Invoice']
    } catch {
      return ['Priya Sharma', 'WhatsApp bot', 'Invoice']
    }
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const itemsContainerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { markAllAsRead } = useNotifications()
  const { toast } = useToast()

  // Save recent searches to localStorage
  const saveRecentSearch = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.toLowerCase() !== trimmed.toLowerCase())
      const updated = [trimmed, ...filtered].slice(0, MAX_RECENT)
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
      } catch (e) {
        console.warn('Failed to save recent searches:', e)
      }
      return updated
    })
  }

  const removeRecentSearch = (text: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((s) => s !== text)
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
      } catch (e) {
        console.warn('Failed to save recent searches:', e)
      }
      return updated
    })
  }

  const clearAllRecent = () => {
    setRecentSearches([])
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY)
    } catch (e) {
      console.warn('Failed to clear recent searches:', e)
    }
  }

  // Pre-defined static items: Navigation Pages
  const pagesItems: PaletteItem[] = useMemo(
    () => [
      {
        id: 'page-dash',
        category: 'pages',
        title: 'Dashboard Overview',
        subtitle: 'Live resolution metrics, KPIs & agent performance',
        keywords: ['overview', 'home', 'stats', 'analytics', 'kpi'],
        icon: <LayoutDashboard className="w-4 h-4 text-violet-600" />,
        badge: 'Page',
        shortcut: 'G D',
        onSelect: () => {
          navigate('/')
          onClose()
        },
      },
      {
        id: 'page-tickets',
        category: 'pages',
        title: 'Support Inbox & Tickets',
        subtitle: 'Multi-channel conversation queue & live chat',
        keywords: ['tickets', 'inbox', 'messages', 'chat', 'whatsapp', 'support', 'queue'],
        icon: <LifeBuoy className="w-4 h-4 text-blue-600" />,
        badge: 'Page',
        shortcut: 'G T',
        onSelect: () => {
          navigate('/tickets')
          onClose()
        },
      },
      {
        id: 'page-customers',
        category: 'pages',
        title: 'Customers Directory & CRM',
        subtitle: 'Customer profiles, order timeline & VIP segments',
        keywords: ['customers', 'contacts', 'crm', 'clients', 'directory', 'vip'],
        icon: <Users className="w-4 h-4 text-emerald-600" />,
        badge: 'Page',
        shortcut: 'G C',
        onSelect: () => {
          navigate('/customers')
          onClose()
        },
      },
      {
        id: 'page-automations',
        category: 'pages',
        title: 'Automations Studio',
        subtitle: 'WhatsApp triggers, event flows & automated replies',
        keywords: ['automations', 'workflows', 'triggers', 'bot', 'flows'],
        icon: <Cpu className="w-4 h-4 text-indigo-600" />,
        badge: 'Page',
        shortcut: 'G A',
        onSelect: () => {
          navigate('/automations')
          onClose()
        },
      },
      {
        id: 'page-ai',
        category: 'pages',
        title: 'Resolution AI Copilot',
        subtitle: 'Prompt playground, bot confidence & agent training',
        keywords: ['ai', 'copilot', 'assistant', 'prompts', 'gpt', 'bot'],
        icon: <Sparkles className="w-4 h-4 text-amber-500" />,
        badge: 'Page',
        shortcut: 'G P',
        onSelect: () => {
          navigate('/ai')
          onClose()
        },
      },
      {
        id: 'page-reports',
        category: 'pages',
        title: 'Performance Reports',
        subtitle: 'Resolution velocity, SLA tracking & CSAT analytics',
        keywords: ['reports', 'analytics', 'csat', 'sla', 'metrics', 'velocity'],
        icon: <BarChart3 className="w-4 h-4 text-sky-600" />,
        badge: 'Page',
        shortcut: 'G R',
        onSelect: () => {
          navigate('/reports')
          onClose()
        },
      },
      {
        id: 'page-settings',
        category: 'pages',
        title: 'Settings & Integrations',
        subtitle: 'WhatsApp Cloud API, webhooks & workspace preferences',
        keywords: ['settings', 'config', 'whatsapp api', 'webhooks', 'account', 'team'],
        icon: <Settings className="w-4 h-4 text-slate-600" />,
        badge: 'Page',
        shortcut: 'G S',
        onSelect: () => {
          navigate('/settings')
          onClose()
        },
      },
    ],
    [navigate, onClose]
  )

  // Pre-defined Quick Actions
  const actionItems: PaletteItem[] = useMemo(
    () => [
      {
        id: 'act-new-ticket',
        category: 'actions',
        title: 'Compose New Support Message',
        subtitle: 'Initiate outbound WhatsApp or Email message to customer',
        keywords: ['new ticket', 'compose', 'message', 'send', 'create'],
        icon: <PlusCircle className="w-4 h-4 text-violet-600" />,
        badge: 'Action',
        shortcut: 'N',
        onSelect: () => {
          navigate('/tickets')
          toast({
            type: 'info',
            title: 'Support Composer',
            description: 'Select customer or type message to begin.',
          })
          onClose()
        },
      },
      {
        id: 'act-new-customer',
        category: 'actions',
        title: 'Add New Customer Profile',
        subtitle: 'Register customer contact in the CRM directory',
        keywords: ['add customer', 'create contact', 'new client', 'crm'],
        icon: <UserPlus className="w-4 h-4 text-emerald-600" />,
        badge: 'Action',
        onSelect: () => {
          navigate('/customers')
          toast({
            type: 'info',
            title: 'Add Customer',
            description: 'Opening customer creation directory.',
          })
          onClose()
        },
      },
      {
        id: 'act-mark-all-read',
        category: 'actions',
        title: 'Mark All Notifications as Read',
        subtitle: 'Clear all unread alerts across tickets and system triggers',
        keywords: ['notifications', 'mark read', 'clear alerts', 'unread'],
        icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />,
        badge: 'Action',
        onSelect: () => {
          markAllAsRead()
          onClose()
        },
      },
      {
        id: 'act-ai-playground',
        category: 'actions',
        title: 'Test AI Copilot Prompt',
        subtitle: 'Open AI Assistant playground to benchmark response accuracy',
        keywords: ['test prompt', 'ai test', 'copilot playground', 'benchmark'],
        icon: <Sparkles className="w-4 h-4 text-amber-500" />,
        badge: 'Action',
        onSelect: () => {
          navigate('/ai')
          toast({
            type: 'info',
            title: 'AI Playground',
            description: 'Evaluate custom prompt instructions & confidence scores.',
          })
          onClose()
        },
      },
      {
        id: 'act-toggle-sidebar',
        category: 'actions',
        title: 'Toggle Navigation Sidebar',
        subtitle: 'Expand or collapse sidebar for maximum canvas space',
        keywords: ['toggle sidebar', 'collapse', 'expand', 'layout'],
        icon: <PanelLeftClose className="w-4 h-4 text-slate-600" />,
        badge: 'Action',
        shortcut: 'Alt+B',
        onSelect: () => {
          onToggleSidebar?.()
          onClose()
        },
      },
      {
        id: 'act-export-reports',
        category: 'actions',
        title: 'Export SLA & CSAT Analytics',
        subtitle: 'Download customer satisfaction & ticket resolution summary',
        keywords: ['export', 'download', 'csv', 'sla', 'csat report'],
        icon: <BarChart3 className="w-4 h-4 text-sky-600" />,
        badge: 'Action',
        onSelect: () => {
          navigate('/reports')
          toast({
            type: 'success',
            title: 'Analytics Export Ready',
            description: 'Navigated to Reports view for export filters.',
          })
          onClose()
        },
      },
      {
        id: 'act-shortcuts',
        category: 'actions',
        title: 'Keyboard Shortcuts Cheatsheet',
        subtitle: 'View all keyboard navigation shortcuts & chord combinations',
        keywords: ['shortcuts', 'cheatsheet', 'keys', 'hotkeys', 'help'],
        icon: <Keyboard className="w-4 h-4 text-purple-600" />,
        badge: 'Help',
        shortcut: '?',
        onSelect: () => {
          onClose()
          setTimeout(() => onOpenShortcuts?.(), 100)
        },
      },
    ],
    [navigate, markAllAsRead, onClose, onOpenShortcuts, onToggleSidebar, toast]
  )

  // Conversation items from inboxData + tickets
  const conversationItems: PaletteItem[] = useMemo(() => {
    return initialConversations.map((conv) => ({
      id: `conv-${conv.id}`,
      category: 'conversations' as const,
      title: `${conv.ticketNumber}: ${conv.subject}`,
      subtitle: `${conv.customer.name} · ${conv.customer.company} · "${conv.lastMessage}"`,
      keywords: [
        conv.ticketNumber,
        conv.customer.name,
        conv.subject,
        conv.channel,
        conv.status,
        conv.priority,
        ...conv.customer.tags,
      ],
      icon: <ChannelIcon channel={conv.channel as 'whatsapp' | 'email' | 'chat'} className="w-4 h-4" />,
      badge: conv.status.toUpperCase(),
      onSelect: () => {
        saveRecentSearch(conv.customer.name)
        navigate(`/tickets?ticket=${conv.id}`)
        onClose()
      },
    }))
  }, [navigate, onClose])

  // Contact items from crmData + customers
  const contactItems: PaletteItem[] = useMemo(() => {
    return initialContacts.map((contact) => ({
      id: `contact-${contact.id}`,
      category: 'contacts' as const,
      title: contact.name,
      subtitle: `${contact.company} · ${contact.email} · ${contact.phone}`,
      keywords: [
        contact.name,
        contact.email,
        contact.phone,
        contact.company,
        contact.tier,
        contact.location,
        ...contact.tags,
      ],
      icon: (
        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
          {contact.avatarInitials}
        </div>
      ),
      badge: contact.tier,
      onSelect: () => {
        saveRecentSearch(contact.name)
        navigate(`/customers?contact=${contact.id}`)
        onClose()
      },
    }))
  }, [navigate, onClose])

  // Combine and filter items based on query & activeCategory
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()

    let pool: PaletteItem[] = []
    if (activeCategory === 'all') {
      pool = [...actionItems, ...pagesItems, ...conversationItems, ...contactItems]
    } else if (activeCategory === 'pages') {
      pool = pagesItems
    } else if (activeCategory === 'actions') {
      pool = actionItems
    } else if (activeCategory === 'conversations') {
      pool = conversationItems
    } else if (activeCategory === 'contacts') {
      pool = contactItems
    }

    if (!q) {
      // When query is empty, return priority suggestions: Actions and Pages
      if (activeCategory === 'all') {
        return [...actionItems.slice(0, 4), ...pagesItems.slice(0, 4)]
      }
      return pool.slice(0, 8)
    }

    return pool.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q)
      const matchSub = item.subtitle.toLowerCase().includes(q)
      const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q))
      return matchTitle || matchSub || matchKeywords
    })
  }, [query, activeCategory, actionItems, pagesItems, conversationItems, contactItems])

  // Reset selectedIndex whenever query or filteredItems change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query, activeCategory])

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setActiveCategory('all')
      setSelectedIndex(0)
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 60)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Scroll active item into view
  useEffect(() => {
    if (itemsContainerRef.current) {
      const activeEl = itemsContainerRef.current.querySelector('[data-selected="true"]')
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  // Handle keyboard events inside modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (filteredItems.length === 0 ? 0 : (prev + 1) % filteredItems.length))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) =>
        filteredItems.length === 0 ? 0 : (prev - 1 + filteredItems.length) % filteredItems.length
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredItems[selectedIndex]) {
        if (query.trim()) {
          saveRecentSearch(query)
        }
        filteredItems[selectedIndex].onSelect()
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    } else if (e.key === 'Tab') {
      // Cycle through categories
      e.preventDefault()
      const categories: PaletteCategory[] = ['all', 'pages', 'actions', 'conversations', 'contacts']
      const currentIdx = categories.indexOf(activeCategory)
      const nextIdx = e.shiftKey
        ? (currentIdx - 1 + categories.length) % categories.length
        : (currentIdx + 1) % categories.length
      setActiveCategory(categories[nextIdx])
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/40 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Global Command Palette"
        className="relative w-full max-w-2xl bg-white/95 backdrop-blur-xl rounded-2xl shadow-modal border border-slate-200/90 overflow-hidden z-10 animate-scale-in flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3 bg-white/80 shrink-0">
          <Search className="w-5 h-5 text-violet-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, search tickets, contacts, or pages... (Tab to switch filter)"
            className="flex-1 bg-transparent border-0 outline-none text-sm sm:text-base text-slate-800 placeholder:text-slate-400 font-normal focus:ring-0"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title="Clear input"
            >
              <X size={15} />
            </button>
          )}

          <div className="flex items-center gap-1.5 shrink-0">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 rounded-md">
              ESC
            </kbd>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1 px-4 py-2 bg-slate-50/70 border-b border-slate-100 overflow-x-auto no-scrollbar shrink-0">
          {(
            [
              { key: 'all', label: 'All' },
              { key: 'actions', label: 'Actions' },
              { key: 'pages', label: 'Pages' },
              { key: 'conversations', label: 'Conversations' },
              { key: 'contacts', label: 'Contacts' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveCategory(tab.key)
                inputRef.current?.focus()
              }}
              className={cn(
                'px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap',
                activeCategory === tab.key
                  ? 'bg-violet-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Recent Searches section when query is empty */}
        {query.trim() === '' && recentSearches.length > 0 && activeCategory === 'all' && (
          <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/40 shrink-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Clock size={11} />
                Recent Searches
              </span>
              <button
                onClick={clearAllRecent}
                className="text-[10px] text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {recentSearches.map((term) => (
                <div
                  key={term}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white border border-slate-200 text-slate-700 hover:border-violet-300 hover:bg-violet-50 transition-colors shadow-2xs group"
                >
                  <button
                    onClick={() => {
                      setQuery(term)
                      inputRef.current?.focus()
                    }}
                    className="cursor-pointer"
                  >
                    {term}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeRecentSearch(term)
                    }}
                    className="text-slate-400 hover:text-red-500 rounded-full"
                    title="Remove recent search"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div
          ref={itemsContainerRef}
          role="listbox"
          className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-50 min-h-[220px]"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-2 text-slate-400">
                <Search size={18} />
              </div>
              <p className="text-sm font-semibold text-slate-700">No results found</p>
              <p className="text-xs text-slate-400 mt-0.5">
                No matching actions, tickets, or contacts for "{query}"
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex

              return (
                <div
                  key={item.id}
                  role="option"
                  aria-selected={isSelected}
                  data-selected={isSelected}
                  onClick={() => {
                    if (query.trim()) saveRecentSearch(query)
                    item.onSelect()
                  }}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={cn(
                    'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 group text-left',
                    isSelected
                      ? 'bg-violet-50/90 text-violet-950 border-l-4 border-violet-600 shadow-xs'
                      : 'hover:bg-slate-50 text-slate-700 border-l-4 border-transparent'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                    <div
                      className={cn(
                        'p-2 rounded-xl transition-colors shrink-0 shadow-2xs',
                        isSelected
                          ? 'bg-white text-violet-600'
                          : 'bg-slate-100/90 group-hover:bg-white text-slate-500'
                      )}
                    >
                      {item.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={cn(
                            'text-xs sm:text-sm font-semibold truncate',
                            isSelected ? 'text-violet-950' : 'text-slate-800'
                          )}
                        >
                          {item.title}
                        </p>
                        {item.badge && (
                          <Badge
                            variant={item.category === 'conversations' ? 'yellow' : 'slate'}
                            className="text-[10px] px-1.5 py-0 capitalize shrink-0"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5 leading-tight">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.shortcut && (
                      <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-white border border-slate-200 rounded shadow-2xs">
                        {item.shortcut}
                      </kbd>
                    )}
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-violet-600 animate-fade-in">
                        <CornerDownLeft size={12} />
                      </span>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono text-[9px] text-slate-600">
                ↑↓
              </kbd>{' '}
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono text-[9px] text-slate-600">
                ↵
              </kbd>{' '}
              Select
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono text-[9px] text-slate-600">
                Tab
              </kbd>{' '}
              Category
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose()
                setTimeout(() => onOpenShortcuts?.(), 100)
              }}
              className="hover:text-slate-700 transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <Keyboard size={12} />
              <span>Shortcuts (?)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
