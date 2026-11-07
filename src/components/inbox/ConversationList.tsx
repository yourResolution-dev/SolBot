import { Search, Filter, Sparkles, AlertCircle, CheckCircle, Bot, Copy, Phone, Mail, MoreVertical } from 'lucide-react'
import type { Conversation, ConversationStatus, ConversationPriority } from '@/lib/inboxData'
import { ChannelIcon } from '@/components/ui/Avatar'
import { PriorityBadge, TicketStatusBadge } from '@/components/ui/Badge'
import { ActionMenu } from '@/components/ui/ActionMenu'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

interface ConversationListProps {
  conversations: Conversation[]
  selectedId: string
  onSelect: (conv: Conversation) => void
  search: string
  onSearchChange: (val: string) => void
  statusFilter: string
  onStatusFilterChange: (val: string) => void
  priorityFilter: string
  onPriorityFilterChange: (val: string) => void
  onToggleAIForConv?: (conv: Conversation) => void
  onResolveConv?: (conv: Conversation) => void
  onMarkUnreadConv?: (conv: Conversation) => void
}

export function ConversationList({
  conversations,
  selectedId,
  onSelect,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  onToggleAIForConv,
  onResolveConv,
  onMarkUnreadConv,
}: ConversationListProps) {
  const { toast } = useToast()

  const filtered = conversations.filter((c) => {
    const matchesSearch =
      c.customer.name.toLowerCase().includes(search.toLowerCase()) ||
      c.ticketNumber.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase())

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || c.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  return (
    <div
      data-tour="tickets-queue"
      className="w-full md:w-80 lg:w-96 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full shrink-0"
    >
      {/* Search Header */}
      <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">Support Inbox</h2>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 rounded-full">
              {conversations.length} Active
            </span>
          </div>
          <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            WhatsApp Live
          </span>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tickets, customers, messages..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {['all', 'open', 'pending', 'resolved'].map((s) => (
            <button
              key={s}
              onClick={() => onStatusFilterChange(s)}
              className={cn(
                'px-2.5 py-1 text-[11px] font-medium rounded-lg capitalize whitespace-nowrap transition-colors cursor-pointer',
                statusFilter === s
                  ? 'bg-violet-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              )}
            >
              {s}
            </button>
          ))}
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1 shrink-0" />
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value)}
            className="text-[11px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-slate-600 dark:text-slate-300 outline-none cursor-pointer"
          >
            <option value="all">Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Conversation Cards Scroll List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">
            No conversations match your filter criteria.
          </div>
        ) : (
          filtered.map((conv) => {
            const isSelected = conv.id === selectedId

            return (
              <div
                key={conv.id}
                onClick={() => onSelect(conv)}
                className={cn(
                  'p-3.5 transition-all cursor-pointer relative group flex flex-col gap-1.5',
                  isSelected
                    ? 'bg-violet-50/70 dark:bg-violet-950/30 border-l-4 border-l-violet-600'
                    : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40 border-l-4 border-l-transparent'
                )}
              >
                {/* Header row: Customer name, channel, time, unread, contextual menu */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 text-white font-semibold flex items-center justify-center text-xs shrink-0 shadow-xs">
                      {conv.customer.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-slate-900 dark:text-slate-100 truncate">
                          {conv.customer.name}
                        </span>
                        <ChannelIcon channel={conv.channel} />
                      </div>
                      <span className="text-[10px] font-mono text-violet-600 dark:text-violet-400 font-medium">
                        {conv.ticketNumber}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-medium">
                        {conv.lastMessageTime}
                      </span>
                      {conv.unreadCount > 0 && (
                        <span className="mt-0.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-violet-600 rounded-full shadow-xs">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>

                    {/* Contextual Action Menu */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <ActionMenu
                        items={[
                          {
                            id: 'resolve',
                            label: conv.status === 'resolved' ? 'Reopen Ticket' : 'Mark Resolved',
                            icon: <CheckCircle size={14} className="text-emerald-600 dark:text-emerald-400" />,
                            shortcut: 'Alt+R',
                            onClick: () => onResolveConv?.(conv),
                          },
                          {
                            id: 'toggle-ai',
                            label: conv.aiActive ? 'Pause AI Copilot' : 'Resume AI Copilot',
                            icon: <Bot size={14} className="text-violet-600 dark:text-violet-400" />,
                            shortcut: 'Alt+A',
                            onClick: () => onToggleAIForConv?.(conv),
                          },
                          {
                            id: 'copy-id',
                            label: `Copy ${conv.ticketNumber}`,
                            icon: <Copy size={14} className="text-slate-500 dark:text-slate-400" />,
                            onClick: () => {
                              navigator.clipboard?.writeText(conv.ticketNumber)
                              toast({
                                type: 'info',
                                title: 'Copied',
                                description: `${conv.ticketNumber} copied to clipboard.`,
                              })
                            },
                          },
                          {
                            id: 'copy-phone',
                            label: 'Copy Customer Phone',
                            icon: <Phone size={14} className="text-slate-500 dark:text-slate-400" />,
                            onClick: () => {
                              navigator.clipboard?.writeText(conv.customer.phone)
                              toast({
                                type: 'info',
                                title: 'Copied',
                                description: `${conv.customer.phone} copied to clipboard.`,
                              })
                            },
                          },
                          {
                            id: 'mark-unread',
                            label: 'Mark as Unread',
                            icon: <Mail size={14} className="text-blue-500 dark:text-blue-400" />,
                            onClick: () => onMarkUnreadConv?.(conv),
                          },
                        ]}
                        buttonClassName="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 rounded-md transition-opacity"
                      />
                    </div>
                  </div>
                </div>

                {/* Subject & Last message snippet */}
                <div className="mt-0.5">
                  <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate leading-snug">
                    {conv.subject}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {conv.lastMessage}
                  </p>
                </div>

                {/* Footer tags: AI status, priority, assignee */}
                <div className="flex items-center justify-between gap-2 pt-1 mt-0.5 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    {conv.aiActive ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200/60 dark:border-emerald-800/60">
                        <Sparkles size={10} className="text-emerald-500" /> AI Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200/60 dark:border-amber-800/60">
                        Human Takeover
                      </span>
                    )}
                    <PriorityBadge priority={conv.priority} />
                  </div>

                  <span className="text-slate-400 dark:text-slate-500 truncate max-w-[100px]">
                    {conv.assignedTo}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
