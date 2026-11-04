import { useState } from 'react'
import {
  LifeBuoy,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Sparkles,
  CheckCircle2,
  Clock,
  MoreVertical,
  MessageSquare,
  LayoutList,
  Inbox,
} from 'lucide-react'
import { initialConversations, type Conversation, type ChatMessage, type InternalNote } from '@/lib/inboxData'
import { ConversationList } from '@/components/inbox/ConversationList'
import { ChatArea } from '@/components/inbox/ChatArea'
import { CustomerDetailsPanel } from '@/components/inbox/CustomerDetailsPanel'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

export function TicketsPage() {
  const { toast } = useToast()
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations)
  const [selectedId, setSelectedId] = useState<string>(initialConversations[0].id)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [showDetails, setShowDetails] = useState(true)

  const selectedConversation =
    conversations.find((c) => c.id === selectedId) || conversations[0]

  // Handler for sending a new message
  const handleSendMessage = (text: string) => {
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

  // Toggle AI Copilot vs Human Takeover
  const handleToggleAI = () => {
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

  // Resolve Ticket
  const handleResolve = () => {
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

  // Re-assign specialist
  const handleAssignChange = (newAssignee: string) => {
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
    <div className="h-[calc(100vh-6.5rem)] -m-4 sm:-m-6 lg:-m-8 bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      {/* 3-Panel Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Panel 1: Searchable Conversation Queue */}
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          onSelect={(conv) => {
            setSelectedId(conv.id)
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
        />

        {/* Panel 2: Interactive Chat Area & Composer */}
        <ChatArea
          conversation={selectedConversation}
          onSendMessage={handleSendMessage}
          onToggleAI={handleToggleAI}
          onResolve={handleResolve}
          onAssignChange={handleAssignChange}
          onToggleDetails={() => setShowDetails((prev) => !prev)}
          showDetails={showDetails}
        />

        {/* Panel 3: Collapsible Customer Profile & Order History */}
        {showDetails && (
          <CustomerDetailsPanel
            customer={selectedConversation.customer}
            notes={selectedConversation.notes}
            onAddNote={handleAddNote}
            assignedTo={selectedConversation.assignedTo}
            onAssignChange={handleAssignChange}
            onClose={() => setShowDetails(false)}
          />
        )}
      </div>
    </div>
  )
}
