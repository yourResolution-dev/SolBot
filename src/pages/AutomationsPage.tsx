import { useState } from 'react'
import {
  Cpu,
  Play,
  Pause,
  Plus,
  Zap,
  CheckCircle2,
  Clock,
  Settings2,
  Sparkles,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Copy,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { initialWorkflows, type AutomationWorkflow } from '@/lib/workflowData'
import { Card, CardHeader } from '@/components/ui/Card'
import { AutomationStatusBadge, Badge } from '@/components/ui/Badge'
import { ChannelIcon } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { VisualWorkflowCanvas } from '@/components/automations/VisualWorkflowCanvas'
import { useToast } from '@/components/ui/Toast'

export function AutomationsPage() {
  const { toast } = useToast()
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>(initialWorkflows)
  const [activeWorkflow, setActiveWorkflow] = useState<AutomationWorkflow | null>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  // Create modal states
  const [createModal, setCreateModal] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newCategory, setNewCategory] = useState<AutomationWorkflow['category']>('ecommerce')

  const filtered = workflows.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(search.toLowerCase()) ||
      w.description.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || w.status === statusFilter
    const matchesCategory = categoryFilter === 'all' || w.category === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const toggleStatus = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setWorkflows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const next = w.status === 'active' ? 'paused' : 'active'
          toast({
            type: next === 'active' ? 'success' : 'info',
            title: `Workflow ${next === 'active' ? 'Activated' : 'Paused'}`,
            description: `"${w.name}" webhook listener is now ${next}.`,
          })
          return { ...w, status: next }
        }
        return w
      })
    )
  }

  const handleDuplicate = (w: AutomationWorkflow, e?: React.MouseEvent) => {
    e?.stopPropagation()
    const copy: AutomationWorkflow = {
      ...w,
      id: `wf-${Date.now()}`,
      name: `${w.name} (Clone)`,
      status: 'paused',
      executionsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    }
    setWorkflows([copy, ...workflows])
    toast({
      type: 'success',
      title: 'Workflow Cloned',
      description: `Created copy "${copy.name}".`,
    })
  }

  const handleDelete = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setWorkflows((prev) => prev.filter((w) => w.id !== id))
    toast({
      type: 'info',
      title: 'Workflow Removed',
      description: 'Automation unlinked from Meta webhook queue.',
    })
  }

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim()) return

    const newWf: AutomationWorkflow = {
      id: `wf-${Date.now()}`,
      name: newName,
      description: newDesc || 'Custom automated WhatsApp workflow',
      channel: 'whatsapp',
      status: 'active',
      category: newCategory,
      executionsCount: 0,
      successRate: 100,
      lastExecuted: 'Never',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      nodes: [
        {
          id: 'node-init',
          type: 'trigger',
          title: 'Incoming WhatsApp Message',
          subtitle: 'Webhook receives customer payload',
          x: 60,
          y: 90,
          config: {},
        },
        {
          id: 'node-action',
          type: 'action',
          title: 'Send Auto-Greeting',
          subtitle: 'Dispatch interactive template',
          x: 360,
          y: 90,
          config: {
            actionType: 'send_message',
            templateText: 'Hello {{customer_name}}, how can we assist you today?',
          },
        },
      ],
      connections: [
        { id: 'c-init', fromNodeId: 'node-init', toNodeId: 'node-action', label: 'Next' },
      ],
      executionLogs: [],
    }

    setWorkflows([newWf, ...workflows])
    setCreateModal(false)
    setActiveWorkflow(newWf)
    setNewName('')
    setNewDesc('')
    toast({
      type: 'success',
      title: 'Workflow Initialized',
      description: 'Opening visual canvas to build trigger nodes.',
    })
  }

  // If viewing visual canvas
  if (activeWorkflow) {
    return (
      <VisualWorkflowCanvas
        workflow={activeWorkflow}
        onUpdateWorkflow={(updated) => {
          setWorkflows((prev) => prev.map((w) => (w.id === updated.id ? updated : w)))
          setActiveWorkflow(updated)
        }}
        onClose={() => setActiveWorkflow(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              WhatsApp Automations & Flows
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50 text-xs font-semibold">
              {workflows.filter((w) => w.status === 'active').length} Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Build conversational triggers, Shopify sync logic, cart reminders, and human takeover rules
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          leftIcon={<Plus size={15} />}
          onClick={() => setCreateModal(true)}
        >
          Create Workflow
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
        <div className="w-full sm:w-72 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search automation flows..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-violet-500/20"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="paused">Paused Only</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-violet-500/20"
          >
            <option value="all">All Categories</option>
            <option value="ecommerce">E-Commerce</option>
            <option value="support">Customer Care</option>
            <option value="onboarding">Onboarding</option>
          </select>
        </div>
      </div>

      {/* Grid of Automation Workflow Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
        {filtered.map((wf) => (
          <Card
            key={wf.id}
            onClick={() => setActiveWorkflow(wf)}
            className="p-5 flex flex-col justify-between hover:border-violet-300 dark:hover:border-violet-600/60 hover:shadow-md transition-all cursor-pointer group dark:bg-slate-900/90 dark:border-slate-800"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <ChannelIcon channel={wf.channel} />
                  <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">{wf.id}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <AutomationStatusBadge status={wf.status} />
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={(e) => toggleStatus(wf.id, e)}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title={wf.status === 'active' ? 'Pause' : 'Activate'}
                    >
                      {wf.status === 'active' ? <Pause size={12} /> : <Play size={12} />}
                    </button>
                    <button
                      onClick={(e) => handleDuplicate(wf, e)}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Duplicate"
                    >
                      <Copy size={12} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(wf.id, e)}
                      className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              </div>

              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                {wf.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {wf.description}
              </p>

              {/* Visual preview of nodes in workflow */}
              <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300 overflow-x-auto no-scrollbar">
                {wf.nodes.map((node, i) => (
                  <div key={node.id} className="flex items-center gap-1 shrink-0">
                    <span className="font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md border border-slate-200 dark:border-slate-700 shadow-2xs">
                      {node.title.split(' ')[0]}
                    </span>
                    {i < wf.nodes.length - 1 && (
                      <ArrowRight size={10} className="text-violet-400 dark:text-violet-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {wf.executionsCount.toLocaleString()} <span className="font-normal text-slate-400 dark:text-slate-500">runs</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{wf.successRate}% success</span>
              </div>

              <span className="text-violet-600 dark:text-violet-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                Open Canvas &rarr;
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Workflow Modal */}
      <Modal
        open={createModal}
        onClose={() => setCreateModal(false)}
        title="Create New Automation Flow"
        subtitle="Set up an automated WhatsApp or Omnichannel workflow canvas"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setCreateModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreate}>
              Launch Visual Canvas
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Workflow Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. VIP Order Status Dispatch"
              className="input-base text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              rows={2}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="What does this flow trigger and resolve?"
              className="input-base text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="input-base text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
            >
              <option value="ecommerce">E-Commerce & Orders</option>
              <option value="support">Customer Support & Triage</option>
              <option value="onboarding">Customer Onboarding</option>
              <option value="sales">Sales & Lead Qualification</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  )
}
