import { useState, useRef, useEffect } from 'react'
import {
  Send,
  Paperclip,
  Smile,
  Bot,
  UserCheck,
  CheckCircle,
  Sparkles,
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  Info,
  Clock,
  Check,
  CheckCheck,
  MoreVertical,
  AlertTriangle,
  Copy,
  Download,
  FileText,
} from 'lucide-react'
import type { Conversation, ChatMessage } from '@/lib/inboxData'
import { ChannelIcon } from '@/components/ui/Avatar'
import { PriorityBadge, TicketStatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ActionMenu } from '@/components/ui/ActionMenu'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

interface ChatAreaProps {
  conversation: Conversation
  onSendMessage: (text: string) => void
  onToggleAI: () => void
  onResolve: () => void
  onAssignChange: (newAssignee: string) => void
  onToggleDetails: () => void
  showDetails: boolean
  onEscalatePriority?: () => void
  onBackToList?: () => void
}

export function ChatArea({
  conversation,
  onSendMessage,
  onToggleAI,
  onResolve,
  onAssignChange,
  onToggleDetails,
  showDetails,
  onEscalatePriority,
  onBackToList,
}: ChatAreaProps) {
  const { toast } = useToast()
  const [inputText, setInputText] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const emojis = ['👍', '👋', '🙏', '✨', '📦', '✅', '❤️', '😊']

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation.messages])

  const handleSend = () => {
    if (!inputText.trim()) return
    onSendMessage(inputText)
    setInputText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInsertCanned = (text: string) => {
    setInputText((prev) => (prev ? `${prev} ${text}` : text))
    toast({
      type: 'info',
      title: 'Template Inserted',
      description: 'Canned response added to reply composer.',
    })
  }

  const handleExportTranscript = () => {
    const transcript = [
      `Resolution Support AI - Conversation Transcript`,
      `Ticket: ${conversation.ticketNumber}`,
      `Customer: ${conversation.customer.name} (${conversation.customer.phone})`,
      `Channel: ${conversation.channel.toUpperCase()}`,
      `Status: ${conversation.status.toUpperCase()}`,
      `---------------------------------------------`,
      ...conversation.messages.map(
        (m) => `[${m.time}] [${m.sender.toUpperCase()}]: ${m.text}`
      ),
    ].join('\n')

    const blob = new Blob([transcript], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `transcript-${conversation.ticketNumber}.txt`
    a.click()
    URL.revokeObjectURL(url)

    toast({
      type: 'success',
      title: 'Transcript Exported',
      description: `Downloaded conversation transcript for ${conversation.ticketNumber}.`,
    })
  }

  return (
    <div data-tour="ai-copilot" className="flex-1 flex flex-col h-full bg-slate-50/50 dark:bg-slate-950/50 min-w-0">
      {/* Top Header Bar */}
      <div className="h-16 px-4 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onBackToList && (
            <button
              onClick={onBackToList}
              className="md:hidden p-1.5 -ml-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
              title="Back to conversation list"
              aria-label="Back to tickets list"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 text-white font-semibold flex items-center justify-center text-xs shrink-0 shadow-xs">
            {conversation.customer.avatar}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 truncate">
                {conversation.customer.name}
              </h3>
              <ChannelIcon channel={conversation.channel} />
              <TicketStatusBadge status={conversation.status} />
              <PriorityBadge priority={conversation.priority} />
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
              {conversation.customer.company} &bull; {conversation.ticketNumber} &bull;{' '}
              <span className="text-violet-600 dark:text-violet-400 font-medium">{conversation.customer.phone}</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* AI Toggle Button */}
          <Button
            variant={conversation.aiActive ? 'primary' : 'secondary'}
            size="xs"
            leftIcon={conversation.aiActive ? <Pause size={12} /> : <Bot size={12} />}
            onClick={onToggleAI}
            title="Toggle AI Copilot vs Human Takeover (Alt+A)"
          >
            {conversation.aiActive ? 'AI Copilot Active' : 'Human Takeover'}
          </Button>

          {/* Resolve Ticket Button */}
          {conversation.status !== 'resolved' && (
            <Button
              variant="success"
              size="xs"
              leftIcon={<CheckCircle size={12} />}
              onClick={onResolve}
              title="Mark ticket resolved (Alt+R)"
            >
              Resolve
            </Button>
          )}

          {/* Toggle Customer Info Panel */}
          <Button
            variant="ghost"
            size="xs"
            onClick={onToggleDetails}
            className={showDetails ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100' : ''}
            title="Toggle customer details panel (Alt+D)"
          >
            <Info size={16} />
          </Button>

          {/* Contextual Action Menu */}
          <ActionMenu
            items={[
              {
                id: 'template-order',
                label: 'Insert: Order Status Update',
                icon: <FileText size={14} className="text-violet-600 dark:text-violet-400" />,
                onClick: () =>
                  handleInsertCanned(
                    `Hello ${conversation.customer.name}, your order has been verified and our fulfillment team is tracking dispatch.`
                  ),
              },
              {
                id: 'template-survey',
                label: 'Insert: Satisfaction Follow-up',
                icon: <Smile size={14} className="text-amber-500" />,
                onClick: () =>
                  handleInsertCanned(
                    `Thank you for contacting Resolution Support! Please rate your experience on a scale of 1-5.`
                  ),
              },
              {
                id: 'copy-link',
                label: 'Copy Ticket Link',
                icon: <Copy size={14} className="text-slate-500 dark:text-slate-400" />,
                onClick: () => {
                  navigator.clipboard?.writeText(window.location.href)
                  toast({
                    type: 'info',
                    title: 'Copied',
                    description: 'Direct link copied to clipboard.',
                  })
                },
              },
              {
                id: 'export-transcript',
                label: 'Export Conversation File',
                icon: <Download size={14} className="text-emerald-600 dark:text-emerald-400" />,
                onClick: handleExportTranscript,
              },
            ]}
          />
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map((msg) => {
          const isCustomer = msg.sender === 'customer'
          const isAI = msg.sender === 'ai'
          const isSystem = msg.sender === 'system'

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-2">
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100/80 dark:bg-slate-800/80 px-3 py-1 rounded-full border border-slate-200/50 dark:border-slate-700/50">
                  {msg.text}
                </span>
              </div>
            )
          }

          return (
            <div
              key={msg.id}
              className={cn('flex flex-col', isCustomer ? 'items-start' : 'items-end')}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-400 dark:text-slate-500">
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  {isCustomer
                    ? conversation.customer.name
                    : isAI
                    ? 'Resolution Copilot (AI)'
                    : 'Julian Sterling (You)'}
                </span>
                <span>&bull;</span>
                <span>{msg.time}</span>
                {isAI && (
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-[9px] font-bold">
                    <Sparkles size={8} /> Auto-Reply
                  </span>
                )}
              </div>

              <div
                className={cn(
                  'max-w-md sm:max-w-lg rounded-2xl p-3.5 shadow-card text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words',
                  isCustomer
                    ? 'bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs'
                    : isAI
                    ? 'bg-violet-50/90 dark:bg-violet-950/40 border border-violet-200/80 dark:border-violet-900/60 text-violet-950 dark:text-violet-200 rounded-tr-xs'
                    : 'bg-violet-600 text-white rounded-tr-xs'
                )}
              >
                {msg.text}

                {/* Message delivery status icons */}
                {!isCustomer && (
                  <div
                    className={cn(
                      'flex items-center justify-end gap-1 mt-1 text-[10px]',
                      isAI ? 'text-violet-500 dark:text-violet-400' : 'text-violet-200'
                    )}
                  >
                    <span>Delivered</span>
                    <CheckCheck size={12} />
                  </div>
                )}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested AI Replies Bar */}
      {conversation.suggestedReplies && conversation.suggestedReplies.length > 0 && (
        <div className="px-4 py-2 bg-violet-50/50 dark:bg-violet-950/30 border-t border-violet-100/60 dark:border-violet-900/40 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-violet-700 dark:text-violet-300 shrink-0">
            <Sparkles size={12} className="text-violet-600 dark:text-violet-400" />
            <span>AI Suggestions:</span>
          </div>
          {conversation.suggestedReplies.map((reply, i) => (
            <button
              key={i}
              onClick={() => handleInsertCanned(reply)}
              className="text-[11px] bg-white dark:bg-slate-850 hover:bg-violet-100/80 dark:hover:bg-violet-950/60 text-slate-700 dark:text-slate-300 hover:text-violet-900 dark:hover:text-violet-200 border border-violet-200/70 dark:border-violet-900/60 rounded-full px-3 py-1 transition-all shrink-0 shadow-2xs font-medium cursor-pointer"
            >
              "{reply}"
            </button>
          ))}
        </div>
      )}

      {/* Composer Section */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 relative">
        {/* Emoji picker simple flyout */}
        {showEmojiPicker && (
          <div className="absolute bottom-full left-4 mb-2 bg-white dark:bg-slate-850 rounded-xl shadow-dropdown border border-slate-200 dark:border-slate-700 p-2 flex gap-1 z-20 animate-scale-in">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setInputText((prev) => prev + emoji)
                  setShowEmojiPicker(false)
                }}
                className="w-8 h-8 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-base cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-2.5 focus-within:ring-2 focus-within:ring-violet-500/20 focus-within:border-violet-400 bg-slate-50/30 dark:bg-slate-850/40 transition-all">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              conversation.aiActive
                ? 'Type your reply (typing will switch conversation to human takeover)...'
                : 'Write your reply via WhatsApp Business API...'
            }
            rows={2}
            className="w-full bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none resize-none"
          />

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-1 text-slate-400 dark:text-slate-500">
              <button
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="p-1.5 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Add emoji"
              >
                <Smile size={16} />
              </button>

              <button
                onClick={() =>
                  toast({
                    type: 'info',
                    title: 'Attachment Upload',
                    description: 'WhatsApp Cloud API document & image attachment ready.',
                  })
                }
                className="p-1.5 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                title="Attach media or PDF"
              >
                <Paperclip size={16} />
              </button>

              <span className="hidden sm:inline-block text-[10px] text-slate-400 dark:text-slate-500 ml-2">
                Press <strong>Enter</strong> to send &bull; <strong>Shift+Enter</strong> for new line
              </span>
            </div>

            <Button
              variant="primary"
              size="sm"
              rightIcon={<Send size={14} />}
              onClick={handleSend}
              disabled={!inputText.trim()}
            >
              Send WhatsApp Reply
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
