import { useState, useRef, useEffect } from 'react'
import {
  Send,
  Bot,
  User,
  Sparkles,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Info,
  Zap,
} from 'lucide-react'
import type { AIAgent } from '@/lib/agentsData'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface TestingPlaygroundProps {
  agent: AIAgent
  className?: string
}

interface TestMessage {
  id: string
  sender: 'user' | 'agent'
  text: string
  confidence?: number
  latencyMs?: number
  retrievedSources?: string[]
}

export function TestingPlayground({ agent, className }: TestingPlaygroundProps) {
  const [messages, setMessages] = useState<TestMessage[]>([
    {
      id: 'init-1',
      sender: 'agent',
      text: `Hello! I am ${agent.name}. How can I help you test our knowledge base and reply guidelines today?`,
      confidence: 98,
      latencyMs: 320,
      retrievedSources: agent.knowledgeSources.map((s) => s.name).slice(0, 1),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const generateMockReply = (userText: string) => {
    setIsTyping(true)
    const lower = userText.toLowerCase()

    setTimeout(() => {
      let replyText = `I have received your message regarding "${userText}". Based on our ${agent.tone} guidelines and ${agent.knowledgeSources.length} indexed documents, here is the verified information.`

      if (lower.includes('track') || lower.includes('order') || lower.includes('shipping')) {
        replyText = `I looked up your order. Packages placed before 3:00 PM are dispatched on the same business day with express courier tracking. Please provide your order number (e.g. #SC-99201) to view real-time delivery coordinates.`
      } else if (lower.includes('return') || lower.includes('refund')) {
        replyText = `Under our 30-day return policy, items must be in original condition with tags attached. Once returned items arrive at our fulfillment hub, full refunds are processed within 2-3 business days to your original payment method.`
      } else if (lower.includes('price') || lower.includes('discount') || lower.includes('bulk')) {
        replyText = `For wholesale orders over 50 units, we offer volume tier discounts up to 25%. Our sales desk can issue an official pro-forma invoice directly to your WhatsApp.`
      } else if (lower.includes('human') || lower.includes('agent') || lower.includes('help')) {
        replyText = `I understand you would like to speak to a human specialist. In live production, this message immediately triggers our handover rule to transfer the conversation to a ${agent.handoffRules[0]?.targetRole || 'Human Support Specialist'}.`
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'agent',
          text: replyText,
          confidence: Math.floor(Math.random() * 12) + 88,
          latencyMs: Math.floor(Math.random() * 400) + 650,
          retrievedSources: agent.knowledgeSources.map((s) => s.name).slice(0, 2),
        },
      ])
      setIsTyping(false)
    }, 850)
  }

  const handleSend = () => {
    if (!input.trim() || isTyping) return
    const userMsg: TestMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: input,
    }
    setMessages((prev) => [...prev, userMsg])
    const prompt = input
    setInput('')
    generateMockReply(prompt)
  }

  const handleReset = () => {
    setMessages([
      {
        id: 'reset-1',
        sender: 'agent',
        text: `Playground reset. Ready to test ${agent.name} with fresh context.`,
        confidence: 99,
        latencyMs: 120,
      },
    ])
  }

  return (
    <div className={cn('flex flex-col h-full bg-slate-50/60 dark:bg-slate-950/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden', className)}>
      {/* Header */}
      <div className="p-3.5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${agent.avatarColor} text-white flex items-center justify-center shadow-xs`}>
            <Bot size={15} />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{agent.name} Playground</h4>
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              {agent.model} &bull; Temp: {agent.temperature} &bull; Tone: {agent.tone}
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          title="Reset conversation test session"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn('flex flex-col max-w-[88%]', {
              'ml-auto items-end': m.sender === 'user',
              'mr-auto items-start': m.sender === 'agent',
            })}
          >
            <div
              className={cn('p-3 rounded-2xl text-xs leading-relaxed', {
                'bg-violet-600 text-white rounded-tr-xs': m.sender === 'user',
                'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs shadow-xs': m.sender === 'agent',
              })}
            >
              {m.text}
            </div>

            {m.sender === 'agent' && m.confidence && (
              <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-slate-400 dark:text-slate-500">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                  <CheckCircle2 size={10} /> {m.confidence}% confidence
                </span>
                <span>&bull;</span>
                <span>{m.latencyMs}ms</span>
                {m.retrievedSources && m.retrievedSources.length > 0 && (
                  <>
                    <span>&bull;</span>
                    <span className="truncate max-w-[140px] text-violet-600 dark:text-violet-400">
                      RAG: {m.retrievedSources[0]}
                    </span>
                  </>
                )}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-24">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce" />
            <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce [animation-delay:0.2s]" />
            <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-bounce [animation-delay:0.4s]" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Test Queries */}
      <div className="p-2 bg-violet-50/60 dark:bg-violet-950/30 border-t border-violet-100/60 dark:border-violet-900/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-violet-700 dark:text-violet-400 shrink-0">Sample prompts:</span>
        {['Track package #SC-99201', 'What is your refund policy?', 'Transfer to a human'].map((chip) => (
          <button
            key={chip}
            onClick={() => {
              setInput(chip)
            }}
            className="text-[10px] bg-white dark:bg-slate-900 border border-violet-200 dark:border-violet-800 text-violet-900 dark:text-violet-300 px-2 py-0.5 rounded-md shrink-0 hover:bg-violet-100 dark:hover:bg-slate-800 transition-colors"
          >
            "{chip}"
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Test prompt ${agent.name}...`}
          className="flex-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400"
        />
        <Button variant="primary" size="xs" onClick={handleSend} disabled={!input.trim() || isTyping}>
          <Send size={13} />
        </Button>
      </div>
    </div>
  )
}
