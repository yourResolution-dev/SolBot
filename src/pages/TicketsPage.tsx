import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Sparkles,
  MessageSquare,
  Compass,
  Trash2,
} from 'lucide-react'
import { type Conversation, type ChatMessage, type InternalNote } from '@/lib/inboxData'
import { ConversationList } from '@/components/inbox/ConversationList'
import { ChatArea } from '@/components/inbox/ChatArea'
import { CustomerDetailsPanel } from '@/components/inbox/CustomerDetailsPanel'
import { EmptyTicketsQueueIllustration } from '@/components/onboarding/OnboardingIllustrations'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useOnboarding } from '@/context/OnboardingContext'
import { cn } from '@/lib/utils'

export function TicketsPage() {
  const { toast } = useToast()
  const [searchParams] = useSearchParams()
  const {
    conversations,
    setConversations,
    demoMode,
    loadDemoConversations,
    clearConversations,
    simulateIncomingMessage,
    openOnboardingModal,
    startTour,
  } = useOnboarding()

  const [selectedId, setSelectedId] = useState<string>(() => conversations[0]?.id || '')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [showDetails, setShowDetails] = useState(true)
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list')

  // Keep selectedId valid when conversations list changes
  useEffect(() => {
    if (conversations.length > 0 && !conversations.some((c) => c.id === selectedId)) {
      setSelectedId(conversations[0].id)
    }
  }, [conversations, selectedId])

  // Listen for search params from Command Palette or Notifications
  useEffect(() => {
    const ticketParam = searchParams.get('ticket')
    if (ticketParam) {
      const match = conversations.find(
        (c) =>
          c.id.toLowerCase() === ticketParam.toLowerCase() ||
          c.ticketNumber.toLowerCase() === ticketParam.toLowerCase()
      )
      if (match) {
        setSelectedId(match.id)
      }
    }
  }, [searchParams, conversations])

  const selectedConversation =
    conversations.find((c) => c.id === selectedId) || conversations[0]

  // Handler for sending a new message
  const handleSendMessage = (text: string) => {
    if (!selectedConversation) return
    const newMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      sender: 'agent',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedConversation.id) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: 'Just now',
            unreadCount: 0,
            aiActive: false, // Switch to human takeover on agent reply
            messages: [...c.messages, newMessage],
          }
        }
        return c
      })
    )

    toast({
      type: 'success',
      title: 'WhatsApp Message Sent',
      description: `Delivered to ${selectedConversation.customer.phone} via Cloud API.`,
    })
  }

  // Toggle AI Copilot vs Human Takeover for active conversation
  const handleToggleAI = () => {
    if (!selectedConversation) return
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedConversation.id) {
          const nextAI = !c.aiActive
          toast({
            type: nextAI ? 'info' : 'warning',
            title: nextAI ? 'AI Copilot Resumed' : 'Human Agent Takeover',
            description: nextAI
              ? 'Resolution AI will auto-dispatch suggested replies.'
              : 'AI auto-responses paused for this conversation.',
          })
          return { ...c, aiActive: nextAI }
        }
        return c
      })
    )
  }

  // Contextual toggle for specific conversation card
  const handleToggleAIForConv = (conv: Conversation) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conv.id) {
          const nextAI = !c.aiActive
          toast({
            type: nextAI ? 'info' : 'warning',
            title: nextAI ? 'AI Copilot Resumed' : 'Human Agent Takeover',
            description: `Updated for ${c.ticketNumber}.`,
          })
          return { ...c, aiActive: nextAI }
        }
        return c
      })
    )
  }

  // Resolve Ticket
  const handleResolve = () => {
    if (!selectedConversation) return
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedConversation.id) {
          return { ...c, status: 'resolved' as const }
        }
        return c
      })
    )
    toast({
      type: 'success',
      title: 'Ticket Marked Resolved',
      description: `Customer survey dispatched to ${selectedConversation.customer.name}.`,
    })
  }

  // Keyboard shortcut listeners for Tickets page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        handleToggleAI()
      } else if (e.altKey && e.key.toLowerCase() === 'r') {
        e.preventDefault()
        handleResolve()
      } else if (e.altKey && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        setShowDetails((prev) => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedConversation])

  // Contextual resolve / reopen for specific conversation card
  const handleResolveConv = (conv: Conversation) => {
    const nextStatus = conv.status === 'resolved' ? ('open' as const) : ('resolved' as const)
    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, status: nextStatus } : c))
    )
    toast({
      type: 'success',
      title: nextStatus === 'resolved' ? 'Ticket Marked Resolved' : 'Ticket Reopened',
      description: `Status updated for ${conv.ticketNumber}.`,
    })
  }

  // Contextual mark unread
  const handleMarkUnreadConv = (conv: Conversation) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: (c.unreadCount || 0) + 1 } : c))
    )
    toast({
      type: 'info',
      title: 'Marked as Unread',
      description: `${conv.ticketNumber} marked with unread indicator.`,
    })
  }

  // Re-assign specialist
  const handleAssignChange = (newAssignee: string) => {
    if (!selectedConversation) return
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedConversation.id) {
          return { ...c, assignedTo: newAssignee }
        }
        return c
      })
    )
    toast({
      type: 'info',
      title: 'Ticket Re-assigned',
      description: `Assigned to ${newAssignee}.`,
    })
  }

  // Add internal note
  const handleAddNote = (text: string) => {
    if (!selectedConversation) return
    const newNote: InternalNote = {
      id: `note-${Date.now()}`,
      author: 'Julian Sterling',
      text,
      time: 'Just now',
    }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedConversation.id) {
          return { ...c, notes: [newNote, ...c.notes] }
        }
        return c
      })
    )
  }

  return (
    <div className="h-[calc(100vh-6.5rem)] -m-4 sm:-m-6 lg:-m-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      {/* Top Demo Context Bar */}
      <div className="px-4 py-2.5 bg-gradient-to-r from-slate-50 via-violet-50/30 to-slate-50 dark:from-slate-900 dark:via-violet-950/20 dark:to-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {demoMode ? 'Realistic Demo Workspace' : 'WhatsApp Production Queue'}
          </span>
          <span className="text-slate-400 dark:text-slate-500">&bull;</span>
          <span className="text-slate-500 dark:text-slate-400">
            {conversations.length} {conversations.length === 1 ? 'ticket' : 'tickets'} active
          </span>
          {demoMode && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-[10px] font-semibold">
              Meta Cloud API Simulator
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="xs"
            onClick={simulateIncomingMessage}
            leftIcon={<MessageSquare size={12} className="text-emerald-600 dark:text-emerald-400" />}
            title="Simulate a new inbound customer WhatsApp message"
          >
            + Inbound Message
          </Button>

          {conversations.length > 0 ? (
            <Button
              variant="ghost"
              size="xs"
              onClick={clearConversations}
              leftIcon={<Trash2 size={12} className="text-slate-400" />}
              title="Clear all tickets to inspect empty-state illustration"
            >
              Clear Queue
            </Button>
          ) : (
            <Button
              variant="primary"
              size="xs"
              onClick={loadDemoConversations}
              leftIcon={<Sparkles size={12} />}
            >
              Load Demo Threads
            </Button>
          )}

          <Button
            variant="ghost"
            size="xs"
            onClick={startTour}
            leftIcon={<Compass size={12} className="text-violet-600 dark:text-violet-400" />}
            title="Start Interactive Product Tour"
          >
            Tour
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {conversations.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-50/50 dark:bg-slate-950/50">
          <EmptyTicketsQueueIllustration className="mb-4 drop-shadow-sm" />
          <div className="max-w-md space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Your WhatsApp Support Inbox is Empty
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              No pending customer conversations in the queue! In real operations, Meta Cloud API webhooks route customer WhatsApp chats here automatically with instant Native-70B AI resolution.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <Button
                size="sm"
                onClick={loadDemoConversations}
                leftIcon={<Sparkles size={14} className="text-violet-300" />}
              >
                Load 5 Demo Conversations
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={simulateIncomingMessage}
                leftIcon={<MessageSquare size={14} className="text-emerald-600 dark:text-emerald-400" />}
              >
                Simulate Inbound Message
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openOnboardingModal(0)}
              >
                Launch Setup Wizard
              </Button>
            </div>
          </div>
        </div>
      ) : (
        /* 3-Panel Main Layout with Responsive Tablet & Mobile Support */
        <div className="flex-1 flex overflow-hidden">
          {/* Panel 1: Searchable Conversation Queue (Hidden on mobile when chat is active) */}
          <div className={cn('h-full shrink-0', mobileView === 'chat' ? 'hidden md:flex' : 'flex w-full md:w-auto')}>
            <ConversationList
              conversations={conversations}
              selectedId={selectedId}
              onSelect={(conv) => {
                setSelectedId(conv.id)
                setMobileView('chat')
                // clear unread
                setConversations((prev) =>
                  prev.map((c) => (c.id === conv.id ? { ...c, unreadCount: 0 } : c))
                )
              }}
              search={search}
              onSearchChange={setSearch}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
              onToggleAIForConv={handleToggleAIForConv}
              onResolveConv={handleResolveConv}
              onMarkUnreadConv={handleMarkUnreadConv}
            />
          </div>

          {/* Panel 2: Interactive Chat Area & Composer */}
          {selectedConversation && (
            <div className={cn('flex-1 h-full min-w-0', mobileView === 'list' ? 'hidden md:flex' : 'flex')}>
              <ChatArea
                conversation={selectedConversation}
                onSendMessage={handleSendMessage}
                onToggleAI={handleToggleAI}
                onResolve={handleResolve}
                onAssignChange={handleAssignChange}
                onToggleDetails={() => setShowDetails((prev) => !prev)}
                showDetails={showDetails}
                onBackToList={() => setMobileView('list')}
              />
            </div>
          )}

          {/* Panel 3: Collapsible Customer Profile & Order History */}
          {showDetails && selectedConversation && (
            <div className="hidden xl:flex h-full shrink-0">
              <CustomerDetailsPanel
                customer={selectedConversation.customer}
                notes={selectedConversation.notes}
                onAddNote={handleAddNote}
                assignedTo={selectedConversation.assignedTo}
                onAssignChange={handleAssignChange}
                onClose={() => setShowDetails(false)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
