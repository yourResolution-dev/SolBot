import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Command, ArrowRight, LifeBuoy, Users, Cpu, FileText } from 'lucide-react'
import { searchAll, type SearchResult } from '@/lib/data'
import { Badge } from '@/components/ui/Badge'

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
      setResults([])
    }
  }, [isOpen])

  useEffect(() => {
    const res = searchAll(query)
    setResults(res)
  }, [query])

  if (!isOpen) return null

  const handleSelect = (url: string) => {
    navigate(url)
    onClose()
  }

  const getTypeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'ticket':
        return <LifeBuoy className="w-4 h-4 text-violet-500" />
      case 'customer':
        return <Users className="w-4 h-4 text-blue-500" />
      case 'automation':
        return <Cpu className="w-4 h-4 text-emerald-500" />
      default:
        return <FileText className="w-4 h-4 text-slate-400" />
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-modal border border-slate-100 overflow-hidden z-10 animate-scale-in">
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tickets, customers, automations, or pages... (Esc to close)"
            className="flex-1 bg-transparent border-0 outline-none text-sm text-slate-800 placeholder:text-slate-400"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold text-slate-500 bg-slate-100 rounded">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Type keywords to quickly navigate through tickets, customers, and flows.
            </div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No results found for <span className="font-semibold text-slate-600">"{query}"</span>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((res) => (
                <button
                  key={res.id + res.type}
                  onClick={() => handleSelect(res.url)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-violet-50 text-left transition-colors group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-slate-100 group-hover:bg-violet-100 group-hover:text-violet-600 transition-colors">
                      {getTypeIcon(res.type)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-800 truncate group-hover:text-violet-900">
                        {res.title}
                      </p>
                      <p className="text-xs text-slate-400 truncate">{res.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="slate" className="capitalize text-[10px]">
                      {res.type}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-violet-600 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Quick actions & universal lookup</span>
          <span className="flex items-center gap-1">
            <Command className="w-3 h-3" /> + K anywhere
          </span>
        </div>
      </div>
    </div>
  )
}
