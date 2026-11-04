import { useState } from 'react'
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Clock,
  Tag,
  ShoppingBag,
  FileText,
  Plus,
  ExternalLink,
  ChevronRight,
  Shield,
  Star,
} from 'lucide-react'
import type { CustomerProfile, InternalNote } from '@/lib/inboxData'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

interface CustomerDetailsPanelProps {
  customer: CustomerProfile
  notes: InternalNote[]
  onAddNote: (text: string) => void
  assignedTo: string
  onAssignChange: (agent: string) => void
  onClose: () => void
}

export function CustomerDetailsPanel({
  customer,
  notes,
  onAddNote,
  assignedTo,
  onAssignChange,
  onClose,
}: CustomerDetailsPanelProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'notes'>('profile')
  const [newNote, setNewNote] = useState('')

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return
    onAddNote(newNote)
    setNewNote('')
    toast({
      type: 'success',
      title: 'Internal Note Added',
      description: 'Saved to customer timeline for all assigned agents.',
    })
  }

  return (
    <div className="w-full sm:w-80 lg:w-88 border-l border-slate-200/80 bg-white flex flex-col h-full shrink-0">
      {/* Top Profile Summary */}
      <div className="p-4 border-b border-slate-100 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 text-white font-bold flex items-center justify-center text-xl shadow-md ring-4 ring-violet-50 mb-3">
          {customer.avatar}
        </div>
        <h3 className="font-bold text-sm text-slate-900">{customer.name}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{customer.company}</p>

        <div className="mt-2.5 flex items-center gap-1.5">
          <Badge
            variant={
              customer.tier === 'Enterprise'
                ? 'violet'
                : customer.tier === 'Growth'
                ? 'blue'
                : 'slate'
            }
          >
            {customer.tier} Tier
          </Badge>
          <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
            LTV: {customer.lifetimeValue}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 px-2 text-xs font-semibold">
        {(['profile', 'orders', 'notes'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 border-b-2 capitalize transition-colors text-center ${
              activeTab === tab
                ? 'border-violet-600 text-violet-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab}
            {tab === 'notes' && notes.length > 0 && (
              <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-violet-100 text-violet-700 rounded-full">
                {notes.length}
              </span>
            )}
            {tab === 'orders' && (
              <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded-full">
                {customer.orders.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-4">
            {/* Quick Contact items */}
            <div className="space-y-2.5 bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-slate-700">
                <Mail size={14} className="text-slate-400 shrink-0" />
                <span className="truncate">{customer.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Phone size={14} className="text-slate-400 shrink-0" />
                <span className="font-medium text-emerald-600">{customer.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin size={14} className="text-slate-400 shrink-0" />
                <span>{customer.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Clock size={14} className="text-slate-400 shrink-0" />
                <span>{customer.timezone}</span>
              </div>
            </div>

            {/* Conversation Assignment */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Assigned Specialist
              </span>
              <select
                value={assignedTo}
                onChange={(e) => onAssignChange(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-violet-500/20"
              >
                <option value="Alex Rivera">Alex Rivera (Senior Eng)</option>
                <option value="Sarah Chen">Sarah Chen (CSM)</option>
                <option value="Marcus Obi">Marcus Obi (Integrations)</option>
                <option value="Fatima Al-Rashid">Fatima Al-Rashid (AI Trainer)</option>
              </select>
            </div>

            {/* Tags */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Account Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {customer.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-lg bg-violet-50 text-violet-700 border border-violet-100 font-medium text-[11px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            {customer.orders.map((ord) => (
              <div
                key={ord.id}
                className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{ord.orderNumber}</span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      ord.status === 'Delivered'
                        ? 'bg-emerald-50 text-emerald-700'
                        : ord.status === 'In Transit'
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-1">{ord.items}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/50">
                  <span>{ord.date}</span>
                  <span className="font-bold text-slate-800">{ord.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Internal Notes Tab */}
        {activeTab === 'notes' && (
          <div className="space-y-3">
            <form onSubmit={handleAddNote} className="space-y-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add private note (only visible to support team)..."
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-violet-400 bg-slate-50/40"
              />
              <Button variant="secondary" size="xs" type="submit" className="w-full">
                Save Internal Note
              </Button>
            </form>

            <div className="space-y-2 pt-2">
              {notes.map((note) => (
                <div key={note.id} className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-amber-800 font-semibold">
                    <span>{note.author}</span>
                    <span className="font-normal text-slate-400">{note.time}</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
