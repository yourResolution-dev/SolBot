import { Search, Filter, Sparkles, AlertCircle } from 'lucide-react'
import type { Conversation, ConversationStatus, ConversationPriority } from '@/lib/inboxData'
import { ChannelIcon } from '@/components/ui/Avatar'
import { PriorityBadge, TicketStatusBadge } from '@/components/ui/Badge'
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
}: ConversationListProps) {
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
    <div className="w-full md:w-80 lg:w-96 border-r border-slate-200/80 bg-white flex flex-col h-full shrink-0">
      {/* Search Header */}
      <div className="p-3.5 border-b border-slate-100 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">Support Inbox</h2>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-violet-100 text-violet-700 rounded-full">
              {conversations.length} Active
            </span>
          </div>
          <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            WhatsApp Live
          </span>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tickets, customers, messages..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {['all', 'open', 'pending', 'resolved'].map((s) => (
            <button
              key={s}
              onClick={() => onStatusFilterChange(s)}
              className={cn(
                'px-2.5 py-1 text-[11px] font-medium rounded-lg capitalize whitespace-nowrap transition-colors',
                statusFilter === s
                  ? 'bg-violet-600 text-white font-semibold shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              )}
            >
              {s}
            </button>
          ))}
          <div className="h-4 w-px bg-slate-200 mx-1 shrink-0" />
          <select
            value={priorityFilter}
            onChange={(e) => onPriorityFilterChange(e.target.value)}
            className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-600 outline-none cursor-pointer"
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
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
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
                    ? 'bg-violet-50/70 border-l-4 border-l-violet-600'
                    : 'hover:bg-slate-50/80 border-l-4 border-l-transparent'
                )}
              >
                {/* Header row: Customer name, channel, time, unread */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 text-white font-semibold flex items-center justify-center text-xs shrink-0 shadow-xs">
                      {conv.customer.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-slate-900 truncate">
                          {conv.customer.name}
                        </span>
                        <ChannelIcon channel={conv.channel} />
                      </div>
                      <span className="text-[10px] font-mono text-violet-600 font-medium">
                        {conv.ticketNumber}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {conv.lastMessageTime}
                    </span>
                    {conv.unreadCount > 0 && (
                      <span className="mt-0.5 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-violet-600 rounded-full shadow-xs">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>

                {/* Subject & Last message snippet */}
                <div className="mt-0.5">
                  <p className="text-xs font-medium text-slate-800 truncate leading-snug">
                    {conv.subject}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {conv.lastMessage}
                  </p>
                </div>

                {/* Footer tags: AI status, priority, assignee */}
                <div className="flex items-center justify-between gap-2 pt-1 mt-0.5 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    {conv.aiActive ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60">
                        <Sparkles size={10} className="text-emerald-500" /> AI Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 font-semibold border border-amber-200/60">
                        Human Takeover
                      </span>
                    )}
                    <PriorityBadge priority={conv.priority} />
                  </div>

                  <span className="text-slate-400 truncate max-w-[100px]">
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
