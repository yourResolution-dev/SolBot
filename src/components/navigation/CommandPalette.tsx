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
  Compass,
  Database,
  Sliders,
  Zap,
  Sun,
  Moon,
  Laptop,
} from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ChannelIcon } from '@/components/ui/Avatar'
import { initialConversations, type Conversation } from '@/lib/inboxData'
import { initialContacts, type ContactRecord } from '@/lib/crmData'
import { initialWorkflows, type AutomationWorkflow } from '@/lib/workflowData'
import { useNotifications } from '@/context/NotificationContext'
import { useOnboarding } from '@/context/OnboardingContext'
import { useTheme, type Theme } from '@/context/ThemeContext'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

export type PaletteCategory =
  | 'all'
  | 'actions'
  | 'pages'
  | 'conversations'
  | 'contacts'
  | 'automations'

export interface PaletteItem {
  id: string
  category: 'pages' | 'actions' | 'conversations' | 'contacts' | 'automations'
  title: string
  subtitle: string
  keywords?: string[]
  icon: React.ReactNode
  badge?: string
  badgeVariant?: 'violet' | 'green' | 'yellow' | 'blue' | 'red' | 'slate'
  shortcut?: string
  onSelect: () => void
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onOpenShortcuts?: () => void
  onToggleSidebar?: () => void
}

const RECENT_SEARCHES_KEY = 'resolution_recent_searches_v2'
const MAX_RECENT = 6

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
      return saved
        ? JSON.parse(saved)
        : ['Sofia Rossi', 'DHL Tracking', 'WhatsApp Cloud API', 'Refund']
    } catch {
      return ['Sofia Rossi', 'DHL Tracking', 'WhatsApp Cloud API', 'Refund']
    }
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const itemsContainerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { markAllAsRead } = useNotifications()
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme()
  const { toast } = useToast()

  // Grab active dynamic onboarding state (conversations, demo mode, wizard triggers)
  const onboarding = useOnboarding()
  const activeConversations =
    onboarding?.conversations && onboarding.conversations.length > 0
      ? onboarding.conversations
      : initialConversations

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

  // 1. Navigation Pages
  const pagesItems: PaletteItem[] = useMemo(
    () => [
      {
        id: 'page-dash',
        category: 'pages',
        title: 'Dashboard Overview',
        subtitle: 'Live resolution metrics, KPIs, SLA velocity & agent stats',
        keywords: ['overview', 'home', 'stats', 'analytics', 'kpi', 'dashboard'],
        icon: <LayoutDashboard className="w-4 h-4 text-violet-600" />,
        badge: 'Page',
        badgeVariant: 'violet',
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
        subtitle: 'Multi-channel WhatsApp queue, active chats & SLA tags',
        keywords: ['tickets', 'inbox', 'messages', 'chat', 'whatsapp', 'support', 'queue'],
        icon: <LifeBuoy className="w-4 h-4 text-blue-600" />,
        badge: 'Page',
        badgeVariant: 'blue',
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
        subtitle: 'Customer profiles, order timeline & VIP client segments',
        keywords: ['customers', 'contacts', 'crm', 'clients', 'directory', 'vip'],
        icon: <Users className="w-4 h-4 text-emerald-600" />,
        badge: 'Page',
        badgeVariant: 'green',
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
        subtitle: 'WhatsApp triggers, event workflows & automated replies',
        keywords: ['automations', 'workflows', 'triggers', 'bot', 'flows', 'builder'],
        icon: <Cpu className="w-4 h-4 text-indigo-600" />,
        badge: 'Page',
        badgeVariant: 'violet',
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
        subtitle: 'Native-70B model tuning, prompts playground & vector docs',
        keywords: ['ai', 'copilot', 'assistant', 'prompts', 'native-70b', 'gpt', 'bot'],
        icon: <Sparkles className="w-4 h-4 text-amber-500" />,
        badge: 'Page',
        badgeVariant: 'yellow',
        shortcut: 'G P',
        onSelect: () => {
          navigate('/ai')
          onClose()
        },
      },
      {
        id: 'page-reports',
        category: 'pages',
        title: 'Performance Reports & CSAT',
        subtitle: 'Resolution velocity, SLA tracking & CSAT analytics',
        keywords: ['reports', 'analytics', 'csat', 'sla', 'metrics', 'velocity', 'export'],
        icon: <BarChart3 className="w-4 h-4 text-sky-600" />,
        badge: 'Page',
        badgeVariant: 'blue',
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
        subtitle: 'Meta WhatsApp Cloud API, webhooks, team roles & tokens',
        keywords: ['settings', 'config', 'whatsapp api', 'webhooks', 'account', 'team', 'tokens'],
        icon: <Settings className="w-4 h-4 text-slate-600" />,
        badge: 'Page',
        badgeVariant: 'slate',
        shortcut: 'G S',
        onSelect: () => {
          navigate('/settings')
          onClose()
        },
      },
    ],
    [navigate, onClose]
  )

  // 2. Quick Actions
  const actionItems: PaletteItem[] = useMemo(
    () => [
      {
        id: 'act-new-ticket',
        category: 'actions',
        title: 'Compose New Support Message',
        subtitle: 'Initiate outbound WhatsApp or Email message to customer',
        keywords: ['new ticket', 'compose', 'message', 'send', 'create', 'outbound'],
        icon: <PlusCircle className="w-4 h-4 text-violet-600" />,
        badge: 'Action',
        badgeVariant: 'violet',
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
        keywords: ['add customer', 'create contact', 'new client', 'crm', 'register'],
        icon: <UserPlus className="w-4 h-4 text-emerald-600" />,
        badge: 'Action',
        badgeVariant: 'green',
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
        id: 'act-tour',
        category: 'actions',
        title: 'Start Interactive Product Tour',
        subtitle: 'Launch interactive walkthrough of support inbox, AI & queue',
        keywords: ['tour', 'walkthrough', 'guide', 'tutorial', 'help', 'product tour'],
        icon: <Compass className="w-4 h-4 text-violet-600" />,
        badge: 'Tour',
        badgeVariant: 'violet',
        onSelect: () => {
          onClose()
          setTimeout(() => onboarding?.startTour(), 120)
        },
      },
      {
        id: 'act-onboarding',
        category: 'actions',
        title: 'Open Workspace Onboarding Wizard',
        subtitle: 'Review business profile, WhatsApp WABA token & AI setup',
        keywords: ['onboarding', 'wizard', 'setup', 'workspace', 'whatsapp setup', 'configure'],
        icon: <Sliders className="w-4 h-4 text-indigo-600" />,
        badge: 'Setup',
        badgeVariant: 'violet',
        onSelect: () => {
          onClose()
          setTimeout(() => onboarding?.openOnboardingModal(0), 120)
        },
      },
      {
        id: 'act-simulate-msg',
        category: 'actions',
        title: 'Simulate Inbound WhatsApp Webhook',
        subtitle: 'Generate realistic incoming customer WhatsApp inquiry',
        keywords: ['simulate', 'incoming', 'webhook', 'meta', 'test ticket', 'inbound'],
        icon: <MessageSquare className="w-4 h-4 text-emerald-600" />,
        badge: 'Simulation',
        badgeVariant: 'green',
        onSelect: () => {
          onboarding?.simulateIncomingMessage()
          navigate('/tickets')
          toast({
            type: 'success',
            title: 'WhatsApp Message Simulated',
            description: 'Incoming customer chat delivered via Meta Cloud webhook.',
          })
          onClose()
        },
      },
      {
        id: 'act-toggle-demo',
        category: 'actions',
        title: onboarding?.demoMode ? 'Switch to Clean Inbox (Empty State)' : 'Load Realistic Demo Conversations',
        subtitle: onboarding?.demoMode ? 'Clear demo queue to test empty-state illustration' : 'Load 5 realistic high-stakes WhatsApp threads',
        keywords: ['demo mode', 'sample data', 'clean queue', 'empty state', 'sample conversations'],
        icon: <Database className="w-4 h-4 text-amber-500" />,
        badge: 'Data',
        badgeVariant: 'yellow',
        onSelect: () => {
          onboarding?.toggleDemoMode()
          toast({
            type: 'info',
            title: onboarding?.demoMode ? 'Clean Queue Activated' : 'Demo Workspace Loaded',
            description: onboarding?.demoMode ? 'All sample conversations cleared.' : '5 realistic demo conversations populated.',
          })
          navigate('/tickets')
          onClose()
        },
      },
      {
        id: 'act-mark-all-read',
        category: 'actions',
        title: 'Mark All Notifications as Read',
        subtitle: 'Clear all unread alerts across tickets and system triggers',
        keywords: ['notifications', 'mark read', 'clear alerts', 'unread', 'clear badge'],
        icon: <CheckCircle2 className="w-4 h-4 text-blue-600" />,
        badge: 'Action',
        badgeVariant: 'blue',
        onSelect: () => {
          markAllAsRead()
          onClose()
        },
      },
      {
        id: 'act-toggle-sidebar',
        category: 'actions',
        title: 'Toggle Navigation Sidebar',
        subtitle: 'Expand or collapse sidebar for maximum canvas space',
        keywords: ['toggle sidebar', 'collapse', 'expand', 'layout', 'sidebar'],
        icon: <PanelLeftClose className="w-4 h-4 text-slate-600" />,
        badge: 'Action',
        badgeVariant: 'slate',
        shortcut: 'Alt+B',
        onSelect: () => {
          onToggleSidebar?.()
          onClose()
        },
      },
      {
        id: 'act-shortcuts',
        category: 'actions',
        title: 'Keyboard Shortcuts Cheatsheet',
        subtitle: 'View all keyboard navigation shortcuts & chord combinations',
        keywords: ['shortcuts', 'cheatsheet', 'keys', 'hotkeys', 'help', 'chords'],
        icon: <Keyboard className="w-4 h-4 text-purple-600" />,
        badge: 'Help',
        badgeVariant: 'violet',
        shortcut: '?',
        onSelect: () => {
          onClose()
          setTimeout(() => onOpenShortcuts?.(), 100)
        },
      },
      {
        id: 'act-theme-toggle',
        category: 'actions',
        title: `Toggle Color Theme (Currently ${resolvedTheme})`,
        subtitle: 'Quickly toggle between light and dark visual presentation',
        keywords: ['theme', 'dark mode', 'light mode', 'color', 'appearance', 'toggle theme'],
        icon: resolvedTheme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />,
        badge: 'Theme',
        badgeVariant: 'violet',
        shortcut: 'Alt+T',
        onSelect: () => {
          toggleTheme()
          toast({
            type: 'info',
            title: 'Theme Toggled',
            description: `Switched appearance to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode.`,
          })
          onClose()
        },
      },
      {
        id: 'act-theme-dark',
        category: 'actions',
        title: 'Switch to Dark Mode',
        subtitle: 'Apply dark color palette optimized for low-light environments',
        keywords: ['dark', 'night mode', 'black', 'theme dark'],
        icon: <Moon className="w-4 h-4 text-indigo-400" />,
        badge: 'Theme',
        badgeVariant: 'violet',
        onSelect: () => {
          setTheme('dark')
          toast({
            type: 'info',
            title: 'Dark Theme Active',
            description: 'Persistent dark mode preference saved.',
          })
          onClose()
        },
      },
      {
        id: 'act-theme-light',
        category: 'actions',
        title: 'Switch to Light Mode',
        subtitle: 'Apply clean high-contrast daytime interface',
        keywords: ['light', 'day mode', 'white', 'theme light'],
        icon: <Sun className="w-4 h-4 text-amber-500" />,
        badge: 'Theme',
        badgeVariant: 'yellow',
        onSelect: () => {
          setTheme('light')
          toast({
            type: 'info',
            title: 'Light Theme Active',
            description: 'Persistent light mode preference saved.',
          })
          onClose()
        },
      },
      {
        id: 'act-theme-system',
        category: 'actions',
        title: 'Sync with System Theme',
        subtitle: 'Automatically follow operating system dark/light mode preference',
        keywords: ['system theme', 'auto theme', 'os theme', 'adaptive'],
        icon: <Laptop className="w-4 h-4 text-slate-500" />,
        badge: 'Theme',
        badgeVariant: 'slate',
        onSelect: () => {
          setTheme('system')
          toast({
            type: 'info',
            title: 'System Theme Synced',
            description: 'Following operating system color scheme.',
          })
          onClose()
        },
      },
    ],
    [navigate, markAllAsRead, onClose, onOpenShortcuts, onToggleSidebar, onboarding, toast, resolvedTheme, toggleTheme, setTheme]
  )

  // 3. Conversation items from dynamic active conversations
  const conversationItems: PaletteItem[] = useMemo(() => {
    return activeConversations.map((conv) => ({
      id: `conv-${conv.id}`,
      category: 'conversations' as const,
      title: `${conv.ticketNumber}: ${conv.subject}`,
      subtitle: `${conv.customer.name} · ${conv.customer.company} · "${conv.lastMessage}"`,
      keywords: [
        conv.ticketNumber,
        conv.customer.name,
        conv.customer.email,
        conv.customer.phone,
        conv.subject,
        conv.channel,
        conv.status,
        conv.priority,
        ...conv.customer.tags,
      ],
      icon: <ChannelIcon channel={conv.channel as 'whatsapp' | 'email' | 'chat'} className="w-4 h-4" />,
      badge: conv.priority.toUpperCase(),
      badgeVariant:
        conv.priority === 'urgent'
          ? 'red'
          : conv.priority === 'high'
          ? 'yellow'
          : 'blue',
      onSelect: () => {
        saveRecentSearch(conv.customer.name)
        navigate(`/tickets?ticket=${conv.id}`)
        onClose()
      },
    }))
  }, [activeConversations, navigate, onClose])

  // 4. Contact items from crmData
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
        <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
          {contact.avatarInitials}
        </div>
      ),
      badge: contact.tier,
      badgeVariant: contact.tier === 'Enterprise' ? 'violet' : 'green',
      onSelect: () => {
        saveRecentSearch(contact.name)
        navigate(`/customers?contact=${contact.id}`)
        onClose()
      },
    }))
  }, [navigate, onClose])

  // 5. Automation workflows from workflowData
  const workflowItems: PaletteItem[] = useMemo(() => {
    return initialWorkflows.map((flow) => ({
      id: `flow-${flow.id}`,
      category: 'automations' as const,
      title: flow.name,
      subtitle: `${flow.description} · ${flow.category.toUpperCase()} (${flow.channel})`,
      keywords: [flow.name, flow.description, flow.category, flow.channel, flow.status],
      icon: <Zap className="w-4 h-4 text-indigo-500" />,
      badge: flow.status.toUpperCase(),
      badgeVariant: flow.status === 'active' ? 'green' : 'slate',
      onSelect: () => {
        saveRecentSearch(flow.name)
        navigate('/automations')
        toast({
          type: 'info',
          title: 'Automations Studio',
          description: `Loaded ${flow.name}.`,
        })
        onClose()
      },
    }))
  }, [navigate, onClose, toast])

  // Combine pools and counts
  const categoryCounts = useMemo(() => {
    return {
      all: pagesItems.length + actionItems.length + conversationItems.length + contactItems.length + workflowItems.length,
      actions: actionItems.length,
      pages: pagesItems.length,
      conversations: conversationItems.length,
      contacts: contactItems.length,
      automations: workflowItems.length,
    }
  }, [pagesItems, actionItems, conversationItems, contactItems, workflowItems])

  // Filter based on query & activeCategory
  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()

    let pool: PaletteItem[] = []
    if (activeCategory === 'all') {
      pool = [...actionItems, ...pagesItems, ...conversationItems, ...contactItems, ...workflowItems]
    } else if (activeCategory === 'pages') {
      pool = pagesItems
    } else if (activeCategory === 'actions') {
      pool = actionItems
    } else if (activeCategory === 'conversations') {
      pool = conversationItems
    } else if (activeCategory === 'contacts') {
      pool = contactItems
    } else if (activeCategory === 'automations') {
      pool = workflowItems
    }

    if (!q) {
      if (activeCategory === 'all') {
        return [...actionItems.slice(0, 4), ...pagesItems.slice(0, 4), ...conversationItems.slice(0, 2)]
      }
      return pool.slice(0, 8)
    }

    return pool.filter((item) => {
      const matchTitle = item.title.toLowerCase().includes(q)
      const matchSub = item.subtitle.toLowerCase().includes(q)
      const matchKeywords = item.keywords?.some((k) => k.toLowerCase().includes(q))
      return matchTitle || matchSub || matchKeywords
    })
  }, [query, activeCategory, actionItems, pagesItems, conversationItems, contactItems, workflowItems])

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
      }, 50)
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
      const categories: PaletteCategory[] = [
        'all',
        'actions',
        'pages',
        'conversations',
        'contacts',
        'automations',
      ]
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
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-3 sm:px-4 bg-slate-950/60 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Global Command Palette"
        className="relative w-full max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-modal border border-slate-200/90 dark:border-slate-800 overflow-hidden z-10 animate-scale-in flex flex-col max-h-[86vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 gap-3 bg-white/80 dark:bg-slate-900/80 shrink-0">
          <Search className="w-5 h-5 text-violet-600 dark:text-violet-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, search tickets, contacts, or pages... (Tab to switch filter)"
            className="flex-1 bg-transparent border-0 outline-none text-sm sm:text-base text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 font-normal focus:ring-0"
          />

          {query && (
            <button
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Clear search query"
            >
              <X size={15} />
            </button>
          )}

          <div className="flex items-center gap-1.5 shrink-0">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md">
              ESC
            </kbd>
          </div>
        </div>

        {/* Category Filter Tabs with Live Count Badges */}
        <div className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-slate-50/70 dark:bg-slate-850/70 border-b border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar shrink-0">
          {(
            [
              { key: 'all', label: 'All', count: categoryCounts.all },
              { key: 'actions', label: 'Actions', count: categoryCounts.actions },
              { key: 'pages', label: 'Pages', count: categoryCounts.pages },
              { key: 'conversations', label: 'Conversations', count: categoryCounts.conversations },
              { key: 'contacts', label: 'Contacts', count: categoryCounts.contacts },
              { key: 'automations', label: 'Flows', count: categoryCounts.automations },
            ] as const
          ).map((tab) => {
            const isActive = activeCategory === tab.key
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveCategory(tab.key)
                  inputRef.current?.focus()
                }}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap select-none',
                  isActive
                    ? 'bg-violet-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800'
                )}
              >
                <span>{tab.label}</span>
                <span
                  className={cn(
                    'text-[10px] px-1.5 py-0.2 rounded-full font-semibold',
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-200/80 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                  )}
                >
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Recent Searches section when query is empty */}
        {query.trim() === '' && recentSearches.length > 0 && activeCategory === 'all' && (
          <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/40 shrink-0">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Clock size={11} />
                Recent Searches
              </span>
              <button
                onClick={clearAllRecent}
                className="text-[10px] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 font-medium cursor-pointer"
              >
                Clear all
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {recentSearches.map((term) => (
                <div
                  key={term}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-violet-300 dark:hover:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-950/40 transition-colors shadow-2xs group"
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

        {/* Results Scroll List */}
        <div
          ref={itemsContainerRef}
          role="listbox"
          className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-50 dark:divide-slate-800/60 min-h-[220px]"
        >
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-2 text-slate-400 dark:text-slate-500">
                <Search size={18} />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No results found</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
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
                    'w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-150 group text-left select-none',
                    isSelected
                      ? 'bg-violet-50/90 dark:bg-violet-950/50 text-violet-950 dark:text-violet-100 border-l-4 border-violet-600 shadow-xs'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-200 border-l-4 border-transparent'
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1 mr-3">
                    <div
                      className={cn(
                        'p-2 rounded-xl transition-colors shrink-0 shadow-2xs',
                        isSelected
                          ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400'
                          : 'bg-slate-100/90 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 text-slate-500 dark:text-slate-400'
                      )}
                    >
                      {item.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p
                          className={cn(
                            'text-xs sm:text-sm font-semibold truncate',
                            isSelected ? 'text-violet-950 dark:text-violet-100' : 'text-slate-800 dark:text-slate-200'
                          )}
                        >
                          {item.title}
                        </p>
                        {item.badge && (
                          <Badge
                            variant={item.badgeVariant || 'slate'}
                            className="text-[10px] px-1.5 py-0 capitalize shrink-0 font-medium"
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5 leading-tight">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {item.shortcut && (
                      <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-2xs">
                        {item.shortcut}
                      </kbd>
                    )}
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-violet-600 dark:text-violet-400 animate-fade-in">
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
        <div className="px-4 py-2.5 bg-slate-50/80 dark:bg-slate-850/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 shrink-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-[9px] text-slate-600 dark:text-slate-300">
                ↑↓
              </kbd>{' '}
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-[9px] text-slate-600 dark:text-slate-300">
                ↵
              </kbd>{' '}
              Select
            </span>
            <span className="hidden sm:flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded font-mono text-[9px] text-slate-600 dark:text-slate-300">
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
              className="hover:text-slate-700 dark:hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer font-medium"
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
