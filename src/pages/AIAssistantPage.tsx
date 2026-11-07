import { useState } from 'react'
import {
  Bot,
  Plus,
  Copy,
  Trash2,
  Play,
  Pause,
  Edit3,
  Sparkles,
  Sliders,
  Database,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Zap,
} from 'lucide-react'
import {
  initialAIAgents,
  type AIAgent,
  type AgentTone,
  type AgentModel,
  type AgentRoleType,
} from '@/lib/agentsData'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ChannelIcon } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { TestingPlayground } from '@/components/agents/TestingPlayground'
import { KnowledgeBaseManager } from '@/components/agents/KnowledgeBaseManager'
import { HandoverRulesManager } from '@/components/agents/HandoverRulesManager'
import { useToast } from '@/components/ui/Toast'

export function AIAssistantPage() {
  const { toast } = useToast()
  const [agents, setAgents] = useState<AIAgent[]>(initialAIAgents)
  const [selectedAgentId, setSelectedAgentId] = useState<string>(initialAIAgents[0].id)
  const [activeTab, setActiveTab] = useState<'prompt' | 'knowledge' | 'handover' | 'playground'>('prompt')

  // Create/Edit Agent Modal State
  const [agentModalOpen, setAgentModalOpen] = useState(false)
  const [editingAgent, setEditingAgent] = useState<AIAgent | null>(null)

  // Form states for create/edit
  const [formName, setFormName] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formRole, setFormRole] = useState<AgentRoleType>('support')
  const [formTone, setFormTone] = useState<AgentTone>('empathetic')
  const [formModel, setFormModel] = useState<AgentModel>('Resolution Native-70B')
  const [formTemp, setFormTemp] = useState(0.4)
  const [formPrompt, setFormPrompt] = useState('')

  const activeAgent = agents.find((a) => a.id === selectedAgentId) || agents[0]

  // Handlers for agent list actions
  const toggleAgentStatus = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextStatus = a.status === 'active' ? 'paused' : 'active'
          toast({
            type: nextStatus === 'active' ? 'success' : 'info',
            title: `Agent ${nextStatus === 'active' ? 'Activated' : 'Paused'}`,
            description: `${a.name} is now ${nextStatus} for incoming webhooks.`,
          })
          return { ...a, status: nextStatus }
        }
        return a
      })
    )
  }

  const duplicateAgent = (agent: AIAgent, e?: React.MouseEvent) => {
    e?.stopPropagation()
    const copy: AIAgent = {
      ...agent,
      id: `agent-${Date.now()}`,
      name: `${agent.name} (Copy)`,
      slug: `${agent.slug}-copy`,
      status: 'paused',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    }
    setAgents((prev) => [copy, ...prev])
    setSelectedAgentId(copy.id)
    toast({
      type: 'success',
      title: 'Agent Duplicated',
      description: `Created clone "${copy.name}". Configure settings before activating.`,
    })
  }

  const deleteAgent = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    if (agents.length <= 1) {
      toast({
        type: 'error',
        title: 'Action Prohibited',
        description: 'You must maintain at least one default support agent.',
      })
      return
    }
    setAgents((prev) => prev.filter((a) => a.id !== id))
    setSelectedAgentId(agents.filter((a) => a.id !== id)[0].id)
    toast({
      type: 'info',
      title: 'Agent Deleted',
      description: 'Agent configuration purged from router.',
    })
  }

  const openCreateModal = () => {
    setEditingAgent(null)
    setFormName('')
    setFormDesc('')
    setFormRole('support')
    setFormTone('empathetic')
    setFormModel('Resolution Native-70B')
    setFormTemp(0.4)
    setFormPrompt(
      'You are Resolution Support AI. Answer customer queries with empathy and accuracy based on indexed documents.'
    )
    setAgentModalOpen(true)
  }

  const openEditModal = (agent: AIAgent) => {
    setEditingAgent(agent)
    setFormName(agent.name)
    setFormDesc(agent.description)
    setFormRole(agent.role)
    setFormTone(agent.tone)
    setFormModel(agent.model)
    setFormTemp(agent.temperature)
    setFormPrompt(agent.systemPrompt)
    setAgentModalOpen(true)
  }

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) {
      toast({ type: 'error', title: 'Validation', description: 'Agent name is required.' })
      return
    }

    if (editingAgent) {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === editingAgent.id
            ? {
                ...a,
                name: formName,
                description: formDesc,
                role: formRole,
                tone: formTone,
                model: formModel,
                temperature: formTemp,
                systemPrompt: formPrompt,
                updatedAt: new Date().toISOString().split('T')[0],
              }
            : a
        )
      )
      toast({
        type: 'success',
        title: 'Agent Updated',
        description: `Changes saved for ${formName}.`,
      })
    } else {
      const newAgent: AIAgent = {
        id: `agent-${Date.now()}`,
        name: formName,
        slug: formName.toLowerCase().replace(/\s+/g, '-'),
        description: formDesc || 'Custom Resolution AI Agent',
        role: formRole,
        avatarColor: 'from-violet-600 to-indigo-600',
        model: formModel,
        tone: formTone,
        temperature: formTemp,
        maxTokens: 512,
        status: 'active',
        systemPrompt: formPrompt,
        handoffConfidenceThreshold: 75,
        channels: ['whatsapp', 'chat'],
        knowledgeSources: [],
        handoffRules: [],
        metrics: {
          totalResolved: 0,
          resolutionRate: 100,
          avgLatencySec: 1.1,
          csat: 5.0,
        },
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      }
      setAgents([newAgent, ...agents])
      setSelectedAgentId(newAgent.id)
      toast({
        type: 'success',
        title: 'New AI Agent Provisioned',
        description: `${newAgent.name} is ready for knowledge indexing and testing.`,
      })
    }
    setAgentModalOpen(false)
  }

  // Update prompt directly from editor
  const handleDirectPromptSave = (prompt: string) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === activeAgent.id ? { ...a, systemPrompt: prompt } : a))
    )
    toast({
      type: 'success',
      title: 'Prompt Instructions Updated',
      description: 'System instructions saved to active session memory.',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">AI Agents & Copilots</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300 border border-violet-200/50 dark:border-violet-800/50 text-xs font-semibold">
              {agents.filter((a) => a.status === 'active').length} Online
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure conversational system prompts, RAG vector stores, handover thresholds, and test in real-time
          </p>
        </div>

        <Button variant="primary" size="sm" leftIcon={<Plus size={15} />} onClick={openCreateModal}>
          Create New Agent
        </Button>
      </div>

      {/* Main Two-Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Agents Roster (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Active Agents Roster
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500">{agents.length} configured</span>
          </div>

          <div className="space-y-2.5">
            {agents.map((agent) => {
              const isSelected = agent.id === activeAgent.id

              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgentId(agent.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-violet-400 dark:border-violet-500 shadow-glass ring-2 ring-violet-500/10 dark:ring-violet-500/20'
                      : 'bg-white dark:bg-slate-900/80 border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${agent.avatarColor} text-white flex items-center justify-center shrink-0 shadow-xs`}
                      >
                        <Bot size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">{agent.name}</h4>
                          <span
                            className={`w-2 h-2 rounded-full ${
                              agent.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300 dark:bg-slate-600'
                            }`}
                          />
                        </div>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{agent.model}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        onClick={(e) => toggleAgentStatus(agent.id, e)}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title={agent.status === 'active' ? 'Pause Agent' : 'Activate Agent'}
                      >
                        {agent.status === 'active' ? <Pause size={12} /> : <Play size={12} />}
                      </button>
                      <button
                        onClick={(e) => duplicateAgent(agent, e)}
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        title="Duplicate Agent"
                      >
                        <Copy size={12} />
                      </button>
                      <button
                        onClick={(e) => deleteAgent(agent.id, e)}
                        className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        title="Delete Agent"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {agent.description}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500">
                    <div className="flex items-center gap-1">
                      {agent.channels.map((ch) => (
                        <ChannelIcon key={ch} channel={ch} />
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        {agent.metrics.resolutionRate}% resolved
                      </span>
                      <span>&bull;</span>
                      <span>{agent.metrics.totalResolved.toLocaleString()} solved</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Configuration & Testing Tabs (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Active Agent Sub-Header Card */}
          <Card className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${activeAgent.avatarColor} text-white flex items-center justify-center text-xl shadow-sm`}
                >
                  <Bot size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{activeAgent.name}</h3>
                    <Badge variant={activeAgent.status === 'active' ? 'green' : 'slate'} dot>
                      {activeAgent.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{activeAgent.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button variant="secondary" size="xs" leftIcon={<Edit3 size={13} />} onClick={() => openEditModal(activeAgent)}>
                  Edit Specs
                </Button>
                <Button
                  variant={activeAgent.status === 'active' ? 'ghost' : 'primary'}
                  size="xs"
                  onClick={(e) => toggleAgentStatus(activeAgent.id, e)}
                >
                  {activeAgent.status === 'active' ? 'Pause Agent' : 'Activate Agent'}
                </Button>
              </div>
            </div>

            {/* Micro stats banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/80">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-medium">Model</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 truncate block mt-0.5">{activeAgent.model}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/80">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-medium">Tone</span>
                <span className="font-bold text-violet-700 dark:text-violet-400 capitalize block mt-0.5">{activeAgent.tone}</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/80">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-medium">Avg Latency</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 block mt-0.5">{activeAgent.metrics.avgLatencySec}s</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/80">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-medium">CSAT Rating</span>
                <span className="font-bold text-amber-600 dark:text-amber-400 block mt-0.5">{activeAgent.metrics.csat} / 5</span>
              </div>
            </div>
          </Card>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200/80 dark:border-slate-800 gap-6 px-2 text-xs font-semibold overflow-x-auto no-scrollbar">
            {[
              { key: 'prompt', label: 'Prompt & Persona', count: undefined },
              { key: 'knowledge', label: 'Knowledge Base', count: activeAgent.knowledgeSources.length },
              { key: 'handover', label: 'Handover Rules', count: activeAgent.handoffRules.length },
              { key: 'playground', label: 'Interactive Playground', count: 'Live' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as any)}
                className={`py-2.5 border-b-2 transition-all flex items-center gap-1.5 shrink-0 ${
                  activeTab === t.key
                    ? 'border-violet-600 dark:border-violet-400 text-violet-700 dark:text-violet-300 font-bold'
                    : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <span>{t.label}</span>
                {t.count !== undefined && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      t.count === 'Live' ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Tab Views */}
          <Card className="p-5">
            {/* Tab 1: System Prompt */}
            {activeTab === 'prompt' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">System Instruction Prompt</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Governs tone, output formatting, safety guardrails, and WhatsApp formatting rules.
                    </p>
                  </div>
                </div>

                <textarea
                  rows={8}
                  value={activeAgent.systemPrompt}
                  onChange={(e) => {
                    const nextVal = e.target.value
                    setAgents((prev) =>
                      prev.map((a) => (a.id === activeAgent.id ? { ...a, systemPrompt: nextVal } : a))
                    )
                  }}
                  className="w-full text-xs font-mono p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-slate-50/50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-100 leading-relaxed"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs">
                  <span className="text-slate-400 dark:text-slate-500">
                    Supports context tokens: {"{{customer_name}}"}, {"{{order_id}}"}, {"{{tracking_link}}"}
                  </span>
                  <Button
                    variant="primary"
                    size="xs"
                    onClick={() => handleDirectPromptSave(activeAgent.systemPrompt)}
                  >
                    Save Prompt Instructions
                  </Button>
                </div>
              </div>
            )}

            {/* Tab 2: Knowledge Base Manager */}
            {activeTab === 'knowledge' && (
              <KnowledgeBaseManager
                sources={activeAgent.knowledgeSources}
                onAddSource={(src) => {
                  setAgents((prev) =>
                    prev.map((a) =>
                      a.id === activeAgent.id ? { ...a, knowledgeSources: [src, ...a.knowledgeSources] } : a
                    )
                  )
                }}
                onRemoveSource={(id) => {
                  setAgents((prev) =>
                    prev.map((a) =>
                      a.id === activeAgent.id
                        ? { ...a, knowledgeSources: a.knowledgeSources.filter((s) => s.id !== id) }
                        : a
                    )
                  )
                }}
              />
            )}

            {/* Tab 3: Handover Rules */}
            {activeTab === 'handover' && (
              <HandoverRulesManager
                rules={activeAgent.handoffRules}
                cutoffThreshold={activeAgent.handoffConfidenceThreshold}
                onThresholdChange={(val) => {
                  setAgents((prev) =>
                    prev.map((a) => (a.id === activeAgent.id ? { ...a, handoffConfidenceThreshold: val } : a))
                  )
                }}
                onAddRule={(rule) => {
                  setAgents((prev) =>
                    prev.map((a) =>
                      a.id === activeAgent.id ? { ...a, handoffRules: [rule, ...a.handoffRules] } : a
                    )
                  )
                }}
                onRemoveRule={(id) => {
                  setAgents((prev) =>
                    prev.map((a) =>
                      a.id === activeAgent.id
                        ? { ...a, handoffRules: a.handoffRules.filter((r) => r.id !== id) }
                        : a
                    )
                  )
                }}
              />
            )}

            {/* Tab 4: Interactive Testing Playground */}
            {activeTab === 'playground' && (
              <div className="h-[480px]">
                <TestingPlayground agent={activeAgent} />
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* ─── Create / Edit Agent Modal ───────────────────────────────────────── */}
      <Modal
        open={agentModalOpen}
        onClose={() => setAgentModalOpen(false)}
        title={editingAgent ? `Edit ${editingAgent.name}` : 'Provision New AI Agent'}
        subtitle="Configure foundational foundation model, persona, and channel routing"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setAgentModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSaveModal}>
              {editingAgent ? 'Save Changes' : 'Create Agent'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveModal} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Agent Name</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. VIP Concierge Bot"
              className="input-base text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Purpose / Description</label>
            <input
              type="text"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              placeholder="Brief summary of agent scope"
              className="input-base text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Foundation Model</label>
              <select
                value={formModel}
                onChange={(e) => setFormModel(e.target.value as any)}
                className="input-base text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              >
                <option value="Resolution Native-70B">Resolution Native-70B</option>
                <option value="GPT-4o Omnichannel">GPT-4o Omnichannel</option>
                <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                <option value="Gemini 1.5 Pro">Gemini 1.5 Pro</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Response Tone</label>
              <select
                value={formTone}
                onChange={(e) => setFormTone(e.target.value as any)}
                className="input-base text-xs dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
              >
                <option value="empathetic">Empathetic & Warm</option>
                <option value="professional">Professional & Direct</option>
                <option value="casual">Casual & Friendly</option>
                <option value="concise">Concise & Ultra-Fast</option>
                <option value="technical">Technical & Detailed</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-700 dark:text-slate-300">Creativity / Temperature</span>
              <span className="text-violet-700 dark:text-violet-400">{formTemp}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={formTemp}
              onChange={(e) => setFormTemp(Number(e.target.value))}
              className="w-full accent-violet-600 cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Initial System Prompt</label>
            <textarea
              rows={4}
              value={formPrompt}
              onChange={(e) => setFormPrompt(e.target.value)}
              className="input-base text-xs font-mono dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100"
            />
          </div>
        </form>
      </Modal>
    </div>
  )
}
