import { useState } from 'react'
import {
  Plus,
  Trash2,
  AlertTriangle,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  Sliders,
} from 'lucide-react'
import type { HandoverRule } from '@/lib/agentsData'
import { Button } from '@/components/ui/Button'
import { PriorityBadge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'

interface HandoverRulesManagerProps {
  rules: HandoverRule[]
  cutoffThreshold: number
  onThresholdChange: (val: number) => void
  onAddRule: (rule: HandoverRule) => void
  onRemoveRule: (id: string) => void
}

export function HandoverRulesManager({
  rules,
  cutoffThreshold,
  onThresholdChange,
  onAddRule,
  onRemoveRule,
}: HandoverRulesManagerProps) {
  const { toast } = useToast()
  const [condition, setCondition] = useState('')
  const [targetRole, setTargetRole] = useState('Senior Support Specialist')
  const [action, setAction] = useState<HandoverRule['action']>('escalate_human')
  const [priority, setPriority] = useState<HandoverRule['priority']>('high')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!condition.trim()) return

    const newRule: HandoverRule = {
      id: `rule-${Date.now()}`,
      condition,
      targetRole,
      action,
      priority,
    }

    onAddRule(newRule)
    setCondition('')
    toast({
      type: 'success',
      title: 'Handover Rule Saved',
      description: `Traffic matching condition will route to ${targetRole}.`,
    })
  }

  return (
    <div className="space-y-5">
      {/* Global Confidence Cutoff Slider */}
      <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-amber-950 flex items-center gap-1.5">
            <ShieldAlert size={14} className="text-amber-600" />
            AI Confidence Threshold Cutoff
          </span>
          <span className="font-bold text-amber-700 bg-white px-2 py-0.5 rounded-md border border-amber-200">
            {cutoffThreshold}%
          </span>
        </div>
        <p className="text-[11px] text-amber-800/80 leading-relaxed">
          If the model's confidence falls below {cutoffThreshold}%, the agent automatically dispatches a polite holding message and escalates to a live agent specialist.
        </p>
        <input
          type="range"
          min="50"
          max="95"
          step="1"
          value={cutoffThreshold}
          onChange={(e) => onThresholdChange(Number(e.target.value))}
          className="w-full accent-amber-600 cursor-pointer"
        />
      </div>

      {/* Add Custom Handover Rule Form */}
      <form onSubmit={handleAdd} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-3">
        <span className="text-xs font-bold text-slate-900 block">
          Add Custom Trigger & Escalation Route
        </span>
        <div className="space-y-2">
          <input
            type="text"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            placeholder="e.g. User asks for refund > $300 OR sentiment score < 0.25"
            className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500/20"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-2 py-2 outline-none"
            >
              <option value="Senior Support Specialist">Senior Support Specialist</option>
              <option value="B2B Wholesale Director">B2B Wholesale Director</option>
              <option value="Finance Operations Lead">Finance Operations Lead</option>
              <option value="Tier-2 Technical Integration">Tier-2 Technical Integration</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="text-xs bg-white border border-slate-200 rounded-xl px-2 py-2 outline-none"
            >
              <option value="urgent">Urgent Priority</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
            </select>

            <Button variant="secondary" size="xs" type="submit" className="w-full">
              <Plus size={13} /> Add Handover Rule
            </Button>
          </div>
        </div>
      </form>

      {/* Handover Rules List */}
      <div className="space-y-2">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="p-3 rounded-xl border border-slate-100 bg-white flex items-center justify-between gap-3 shadow-2xs"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <PriorityBadge priority={rule.priority} />
                <span className="text-xs font-semibold text-slate-800 truncate">
                  &rarr; Transfer to {rule.targetRole}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">{rule.condition}</p>
            </div>

            <button
              onClick={() => onRemoveRule(rule.id)}
              className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors shrink-0"
              title="Delete handover rule"
            >
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
