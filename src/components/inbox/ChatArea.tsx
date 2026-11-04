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
  Info,
  Clock,
  Check,
  CheckCheck,
} from 'lucide-react'
import type { Conversation, ChatMessage } from '@/lib/inboxData'
import { ChannelIcon } from '@/components/ui/Avatar'
import { PriorityBadge, TicketStatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
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
}

export function ChatArea({
  conversation,
  onSendMessage,
  onToggleAI,
  onResolve,
  onAssignChange,
  onToggleDetails,
  showDetails,
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

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 min-w-0">
      {/* Top Header Bar */}
      <div className="h-16 px-4 bg-white border-b border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 text-white font-semibold flex items-center justify-center text-xs shrink-0 shadow-xs">
            {conversation.customer.avatar}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-slate-900 truncate">
                {conversation.customer.name}
              </h3>
              <ChannelIcon channel={conversation.channel} />
              <TicketStatusBadge status={conversation.status} />
              <PriorityBadge priority={conversation.priority} />
            </div>
            <p className="text-xs text-slate-400 truncate">
              {conversation.customer.company} &bull; {conversation.ticketNumber} &bull;{' '}
              <span className="text-violet-600 font-medium">{conversation.customer.phone}</span>
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
            title={conversation.aiActive ? 'Pause AI Copilot to take over' : 'Resume AI Copilot'}
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
            >
              Resolve
            </Button>
          )}

          {/* Toggle Customer Info Panel */}
          <Button
            variant="ghost"
            size="xs"
            onClick={onToggleDetails}
            className={showDetails ? 'bg-slate-100 text-slate-900' : ''}
            title="Toggle customer details panel"
          >
            <Info size={16} />
          </Button>
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
                <span className="text-[11px] font-medium text-slate-400 bg-slate-100/80 px-3 py-1 rounded-full border border-slate-200/50">
                  {msg.text}
                </span>
              </div>
            )
          }

          return (
            <div
              key={msg.id}
              className={cn('flex flex-col max-w-[85%] sm:max-w-[70%]', {
                'mr-auto items-start': isCustomer,
                'ml-auto items-end': !isCustomer,
              })}
            >
              {/* Sender Pill */}
              <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-400">
                {isCustomer ? (
                  <span>{conversation.customer.name}</span>
                ) : isAI ? (
                  <span className="font-semibold text-violet-600 flex items-center gap-1">
                    <Sparkles size={11} /> Resolution AI Agent
                  </span>
                ) : (
                  <span className="font-semibold text-slate-700">
                    {conversation.assignedTo} (Agent)
                  </span>
                )}
                <span>&bull;</span>
                <span>{msg.time}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={cn('rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs relative', {
                  'bg-white text-slate-800 border border-slate-200/70 rounded-tl-xs': isCustomer,
                  'bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-tr-xs': !isCustomer && !isAI,
                  'bg-violet-50 border border-violet-200/80 text-violet-950 rounded-tr-xs shadow-xs': isAI,
                })}
              >
                {msg.text}

                {/* Status Ticks for WhatsApp messages */}
                {!isCustomer && (
                  <div className="flex justify-end mt-1 text-[10px] opacity-80 gap-1 items-center">
                    <span>Sent</span>
                    <CheckCheck size={12} className={isAI ? 'text-violet-600' : 'text-white'} />
                  </div>
                )}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested AI Replies (Quick Clicks) */}
      {conversation.suggestedReplies && conversation.suggestedReplies.length > 0 && (
        <div className="px-4 py-2 bg-violet-50/70 border-t border-violet-100 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-violet-800">
            <Sparkles size={12} className="text-violet-600" />
            <span>AI Suggested Next Responses ({conversation.aiConfidence}% confidence)</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {conversation.suggestedReplies.map((reply, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(reply)}
                className="text-left text-xs bg-white hover:bg-violet-100/60 border border-violet-200/60 hover:border-violet-300 text-slate-700 hover:text-violet-950 px-2.5 py-1.5 rounded-xl transition-all shadow-xs"
              >
                "{reply.length > 70 ? reply.slice(0, 70) + '…' : reply}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Message Composer Area */}
      <div className="p-3.5 bg-white border-t border-slate-200/80 shrink-0 relative">
        {/* Emoji bar popover */}
        {showEmojiPicker && (
          <div className="absolute bottom-20 left-4 bg-white p-2 rounded-2xl shadow-dropdown border border-slate-100 flex gap-1 z-30 animate-scale-in">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setInputText((prev) => prev + emoji)
                  setShowEmojiPicker(false)
                }}
                className="p-1.5 text-base hover:bg-violet-50 rounded-lg transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="border border-slate-200 rounded-2xl p-2.5 focus-within:ring-2 focus-within:ring-violet-500/20 focus-within:border-violet-400 bg-slate-50/30 transition-all">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              conversation.aiActive
                ? 'Type your reply (typing will switch conversation to human takeover)...'
                : 'Write your reply to Priya Sharma via WhatsApp Business API...'
            }
            rows={2}
            className="w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 outline-none resize-none"
          />

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="p-1.5 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
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
                className="p-1.5 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Attach media or PDF"
              >
                <Paperclip size={16} />
              </button>

              <span className="hidden sm:inline-block text-[10px] text-slate-400 ml-2">
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
