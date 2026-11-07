import { useState, useRef } from 'react'
import {
  Zap,
  GitBranch,
  Send,
  Bot,
  UserCheck,
  Settings,
  Trash2,
  Plus,
  Play,
  Save,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import type { AutomationWorkflow, WorkflowNode, WorkflowConnection, NodeType } from '@/lib/workflowData'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { cn } from '@/lib/utils'

interface VisualWorkflowCanvasProps {
  workflow: AutomationWorkflow
  onUpdateWorkflow: (updated: AutomationWorkflow) => void
  onClose: () => void
}

export function VisualWorkflowCanvas({
  workflow,
  onUpdateWorkflow,
  onClose,
}: VisualWorkflowCanvasProps) {
  const { toast } = useToast()
  const [nodes, setNodes] = useState<WorkflowNode[]>(workflow.nodes)
  const [connections, setConnections] = useState<WorkflowConnection[]>(workflow.connections)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(workflow.nodes[0]?.id || null)
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const canvasRef = useRef<HTMLDivElement>(null)

  const selectedNode = nodes.find((n) => n.id === selectedNodeId)

  // Dragging handlers
  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedNodeId(nodeId)
    const node = nodes.find((n) => n.id === nodeId)
    if (!node || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    setDraggingNodeId(nodeId)
    setDragOffset({
      x: e.clientX - rect.left - node.x,
      y: e.clientY - rect.top - node.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNodeId || !canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const newX = Math.max(20, Math.min(rect.width - 240, e.clientX - rect.left - dragOffset.x))
    const newY = Math.max(20, Math.min(rect.height - 140, e.clientY - rect.top - dragOffset.y))

    setNodes((prev) =>
      prev.map((n) => (n.id === draggingNodeId ? { ...n, x: newX, y: newY } : n))
    )
  }

  const handleMouseUp = () => {
    setDraggingNodeId(null)
  }

  // Node operations
  const handleAddNode = (type: NodeType) => {
    const id = `node-${Date.now()}`
    const titles: Record<NodeType, { title: string; subtitle: string }> = {
      trigger: { title: 'New Trigger Event', subtitle: 'WhatsApp keyword or Webhook' },
      condition: { title: 'Condition Filter', subtitle: 'Evaluate user attributes' },
      action: { title: 'Send Message / Card', subtitle: 'Dispatch WhatsApp template' },
      ai_agent: { title: 'AI Copilot Step', subtitle: 'Contextual LLM reasoning' },
      handover: { title: 'Escalate to Specialist', subtitle: 'Route to human queue' },
    }

    const newNode: WorkflowNode = {
      id,
      type,
      title: titles[type].title,
      subtitle: titles[type].subtitle,
      x: 350,
      y: 150,
      config: {},
    }

    setNodes((prev) => [...prev, newNode])
    setSelectedNodeId(id)
    toast({
      type: 'success',
      title: 'Node Added to Canvas',
      description: `Drag node to reposition and connect.`,
    })
  }

  const handleDeleteNode = (id: string) => {
    if (nodes.length <= 1) {
      toast({ type: 'error', title: 'Cannot Delete', description: 'Flow must have at least one trigger node.' })
      return
    }
    setNodes((prev) => prev.filter((n) => n.id !== id))
    setConnections((prev) => prev.filter((c) => c.fromNodeId !== id && c.toNodeId !== id))
    setSelectedNodeId(nodes.filter((n) => n.id !== id)[0]?.id || null)
  }

  const handleSave = () => {
    const updated: AutomationWorkflow = {
      ...workflow,
      nodes,
      connections,
      updatedAt: new Date().toISOString().split('T')[0],
    }
    onUpdateWorkflow(updated)
    toast({
      type: 'success',
      title: 'Workflow Saved & Published',
      description: `Changes to "${workflow.name}" are live on WhatsApp Cloud webhook.`,
    })
  }

  const handleTestFlow = () => {
    toast({
      type: 'info',
      title: 'Simulating Flow Execution',
      description: 'Trigger payload sent to sandbox phone #+1 555 0199. All condition branches verified.',
    })
  }

  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case 'trigger':
        return <Zap size={14} className="text-amber-500" />
      case 'condition':
        return <GitBranch size={14} className="text-blue-500" />
      case 'action':
        return <Send size={14} className="text-emerald-500" />
      case 'ai_agent':
        return <Bot size={14} className="text-violet-500" />
      case 'handover':
        return <UserCheck size={14} className="text-rose-500" />
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] -m-4 sm:-m-6 lg:-m-8 bg-slate-100 dark:bg-slate-950 overflow-hidden select-none">
      {/* Canvas Top Bar */}
      <div className="min-h-16 py-2 px-4 bg-white dark:bg-slate-900 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="xs" onClick={onClose}>
            &larr; Back to Flows
          </Button>
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-700" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">{workflow.name}</h2>
              <Badge variant={workflow.status === 'active' ? 'green' : 'slate'} dot>
                {workflow.status}
              </Badge>
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">
              {nodes.length} nodes &bull; {connections.length} branches &bull; {workflow.channel} Cloud API
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Quick Node Add Dropdown */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 p-1 rounded-xl">
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 px-2">Add:</span>
            <button
              onClick={() => handleAddNode('condition')}
              className="px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700/70 rounded-lg transition-colors flex items-center gap-1"
            >
              <GitBranch size={12} className="text-blue-500" /> Branch
            </button>
            <button
              onClick={() => handleAddNode('action')}
              className="px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700/70 rounded-lg transition-colors flex items-center gap-1"
            >
              <Send size={12} className="text-emerald-500" /> Action
            </button>
            <button
              onClick={() => handleAddNode('ai_agent')}
              className="px-2 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-700/70 rounded-lg transition-colors flex items-center gap-1"
            >
              <Bot size={12} className="text-violet-500" /> AI Step
            </button>
          </div>

          <Button variant="secondary" size="xs" leftIcon={<Play size={12} />} onClick={handleTestFlow}>
            Test Flow
          </Button>

          <Button variant="primary" size="xs" leftIcon={<Save size={12} />} onClick={handleSave}>
            Publish Changes
          </Button>
        </div>
      </div>

      {/* Canvas Workspace & Inspector Split */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Canvas Area */}
        <div
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="flex-1 relative overflow-hidden bg-slate-50/70 dark:bg-slate-950 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px]"
        >
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="6"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#8b5cf6" />
              </marker>
            </defs>
            {connections.map((conn) => {
              const from = nodes.find((n) => n.id === conn.fromNodeId)
              const to = nodes.find((n) => n.id === conn.toNodeId)
              if (!from || !to) return null

              const fromX = from.x + 220
              const fromY = from.y + 40
              const toX = to.x
              const toY = to.y + 40
              const midX = (fromX + toX) / 2

              const d = `M ${fromX} ${fromY} C ${midX} ${fromY}, ${midX} ${toY}, ${toX} ${toY}`

              return (
                <g key={conn.id}>
                  <path
                    d={d}
                    fill="none"
                    stroke="#a78bfa"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    markerEnd="url(#arrowhead)"
                  />
                  {conn.label && (
                    <text
                      x={midX}
                      y={(fromY + toY) / 2 - 6}
                      fill="#8b5cf6"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="fill-violet-600 dark:fill-violet-400"
                    >
                      {conn.label}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>

          {/* Interactive Draggable Nodes */}
          {nodes.map((node) => {
            const isSelected = node.id === selectedNodeId
            const isDragging = node.id === draggingNodeId

            return (
              <div
                key={node.id}
                onMouseDown={(e) => handleMouseDown(node.id, e)}
                style={{ transform: `translate(${node.x}px, ${node.y}px)` }}
                className={cn(
                  'absolute w-56 rounded-2xl bg-white dark:bg-slate-900 border p-3.5 shadow-sm transition-shadow duration-150 cursor-grab active:cursor-grabbing z-10',
                  isSelected
                    ? 'border-violet-600 dark:border-violet-500 ring-2 ring-violet-500/20 shadow-md'
                    : 'border-slate-200/90 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700',
                  isDragging && 'shadow-lg opacity-90'
                )}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shrink-0">
                      {getNodeIcon(node.type)}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500">
                      {node.type}
                    </span>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{node.title}</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {node.subtitle}
                </p>

                {/* Ports */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full border border-violet-400 bg-white dark:bg-slate-900" /> In
                  </span>
                  <span className="flex items-center gap-1">
                    Out <span className="w-2 h-2 rounded-full bg-violet-600" />
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Right Node Configuration Inspector */}
        {selectedNode && (
          <div className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200/80 dark:border-slate-800 p-4 space-y-4 overflow-y-auto shrink-0 z-20 animate-fade-in shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                  {getNodeIcon(selectedNode.type)}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 capitalize">
                    {selectedNode.type} Settings
                  </h3>
                  <span className="text-[10px] font-mono text-violet-600 dark:text-violet-400 font-semibold">
                    {selectedNode.id}
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleDeleteNode(selectedNode.id)}
                className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg transition-colors"
                title="Delete node"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {/* Editable Fields */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Node Title
                </label>
                <input
                  type="text"
                  value={selectedNode.title}
                  onChange={(e) => {
                    const next = e.target.value
                    setNodes((prev) =>
                      prev.map((n) => (n.id === selectedNode.id ? { ...n, title: next } : n))
                    )
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Description / Subtitle
                </label>
                <textarea
                  rows={2}
                  value={selectedNode.subtitle}
                  onChange={(e) => {
                    const next = e.target.value
                    setNodes((prev) =>
                      prev.map((n) => (n.id === selectedNode.id ? { ...n, subtitle: next } : n))
                    )
                  }}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              {/* Conditional node fields */}
              {selectedNode.type === 'condition' && (
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    Branch Condition
                  </span>
                  <select
                    value={selectedNode.config.conditionOperator || 'contains'}
                    onChange={(e) => {
                      const next = e.target.value as any
                      setNodes((prev) =>
                        prev.map((n) =>
                          n.id === selectedNode.id
                            ? { ...n, config: { ...n.config, conditionOperator: next } }
                            : n
                        )
                      )
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-violet-500/20"
                  >
                    <option value="contains">Contains phrase</option>
                    <option value="equals">Exact match</option>
                    <option value="greater_than">Numeric value &gt;</option>
                  </select>
                  <input
                    type="text"
                    value={selectedNode.config.conditionValue || ''}
                    placeholder="Match value e.g. #SC-"
                    onChange={(e) => {
                      const next = e.target.value
                      setNodes((prev) =>
                        prev.map((n) =>
                          n.id === selectedNode.id
                            ? { ...n, config: { ...n.config, conditionValue: next } }
                            : n
                        )
                      )
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              )}

              {/* Action node template editor */}
              {selectedNode.type === 'action' && (
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                    WhatsApp Message Template
                  </span>
                  <textarea
                    rows={4}
                    value={
                      selectedNode.config.templateText ||
                      'Hello {{customer_name}}, this is an automated dispatch from Resolution AI.'
                    }
                    onChange={(e) => {
                      const next = e.target.value
                      setNodes((prev) =>
                        prev.map((n) =>
                          n.id === selectedNode.id
                            ? { ...n, config: { ...n.config, templateText: next } }
                            : n
                        )
                      )
                    }}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-100 outline-none leading-relaxed font-mono focus:ring-2 focus:ring-violet-500/20"
                  />
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block">
                    Available variables: {"{{first_name}}"}, {"{{order_id}}"}, {"{{tracking_url}}"}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
