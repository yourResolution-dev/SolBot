import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MessageSquare,
  Bot,
  Zap,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowUpRight,
  Filter,
  Plus,
  ArrowRight,
  Star,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Users,
  ShieldCheck,
} from 'lucide-react'
import { tickets, activityFeed, automations } from '@/lib/data'
import { analyticsByRange, datePresets, type DateRangeKey } from '@/lib/analyticsData'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { TicketStatusBadge, PriorityBadge } from '@/components/ui/Badge'
import { ChannelIcon } from '@/components/ui/Avatar'
import { formatRelativeTime } from '@/lib/utils'
import { Modal } from '@/components/ui/Modal'
import { Input, Select, FormGroup, Label, Textarea } from '@/components/ui/FormControls'
import { useToast } from '@/components/ui/Toast'
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart'
import { ChannelPerformance } from '@/components/dashboard/ChannelPerformance'
import { AgentPerformanceWidget } from '@/components/dashboard/AgentPerformanceWidget'

export function DashboardOverview() {
  const { toast } = useToast()
  const navigate = useNavigate()

  // Date range state
  const [selectedRange, setSelectedRange] = useState<DateRangeKey>('7d')
  const currentAnalytics = analyticsByRange[selectedRange]
  const currentPreset = datePresets.find((p) => p.key === selectedRange)!

  // New Ticket Modal State
  const [newTicketModal, setNewTicketModal] = useState(false)
  const [newSubject, setNewSubject] = useState('')
  const [newCustomer, setNewCustomer] = useState('')
  const [newPriority, setNewPriority] = useState('medium')
  const [newChannel, setNewChannel] = useState('whatsapp')

  // Inspect Ticket Modal State
  const [inspectTicket, setInspectTicket] = useState<typeof tickets[0] | null>(null)

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubject || !newCustomer) {
      toast({
        type: 'error',
        title: 'Validation Failed',
        description: 'Please provide both customer name and ticket subject.',
      })
      return
    }

    toast({
      type: 'success',
      title: 'Ticket Created & Queued',
      description: `Support ticket for ${newCustomer} has been scheduled for AI dispatch on WhatsApp.`,
    })
    setNewTicketModal(false)
    setNewSubject('')
    setNewCustomer('')
  }

  return (
    <div className="space-y-6">
      {/* ─── Top Controls: Welcome Header + Date Filter ──────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Executive Overview
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 text-xs font-semibold">
              <Sparkles size={12} className="text-violet-600 dark:text-violet-400 animate-spin-slow" /> Live AI Engine
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time analytics across WhatsApp Cloud API, AI Copilot resolutions, and support operations
          </p>
        </div>

        {/* Date Filter & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Interactive Date Filter Selector */}
          <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-1 shadow-xs">
            {datePresets.map((preset) => (
              <button
                key={preset.key}
                onClick={() => {
                  setSelectedRange(preset.key)
                  toast({
                    type: 'info',
                    title: `Showing ${preset.label}`,
                    description: `Data range updated to ${preset.label.toLowerCase()}.`,
                  })
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                  selectedRange === preset.key
                    ? 'bg-violet-600 text-white shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            size="sm"
            leftIcon={<Plus size={15} />}
            onClick={() => setNewTicketModal(true)}
          >
            New Ticket
          </Button>
        </div>
      </div>

      {/* ─── Hero Welcome Glass Banner ───────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 p-6 sm:p-8 text-white shadow-glass">
        {/* Soft Background Accents */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/15 via-white/5 to-transparent pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide text-violet-100 mb-3 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Meta WhatsApp Cloud API &bull; 99.98% SLA
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-2">
            Welcome back, Julian Sterling
          </h2>
          <p className="text-violet-100 text-sm leading-relaxed max-w-2xl">
            In the <strong className="text-white">{currentPreset.label.toLowerCase()}</strong>, your automated flows handled{' '}
            <strong className="text-white">{currentAnalytics.summary.totalConversations.toLocaleString()} conversations</strong> with an AI resolution rate of{' '}
            <strong className="text-emerald-300 font-semibold">{currentAnalytics.summary.aiResolutionRate}%</strong>, slashing average customer wait times down to{' '}
            <strong className="text-white">{currentAnalytics.summary.avgResponseTime}</strong>.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Sparkles size={15} className="text-violet-700" />}
              onClick={() => navigate('/ai')}
              className="bg-white text-violet-900 border-none hover:bg-violet-50 font-semibold"
            >
              Tune AI Models
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RefreshCw size={14} />}
              className="text-white hover:bg-white/15 border border-white/20"
              onClick={() =>
                toast({
                  type: 'success',
                  title: 'Metrics Synchronized',
                  description: 'Queried latest WhatsApp webhook telemetry and CSAT feeds.',
                })
              }
            >
              Sync Webhook Feed
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<ShieldCheck size={14} />}
              className="text-violet-200 hover:text-white"
              onClick={() => navigate('/settings')}
            >
              WABA Security
            </Button>
          </div>
        </div>
      </div>

      {/* ─── 4 Interactive KPI Cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Conversations */}
        <Card
          hover
          onClick={() => navigate('/tickets')}
          className="p-5 flex flex-col justify-between hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Total Conversations
            </span>
            <span className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 group-hover:bg-violet-600 group-hover:text-white transition-colors">
              <MessageSquare size={16} />
            </span>
          </div>
          <div className="my-2.5">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {currentAnalytics.summary.totalConversations.toLocaleString()}
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
              +{currentAnalytics.summary.totalChange}%
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-[11px]">{currentPreset.periodLabel}</span>
          </div>
        </Card>

        {/* AI Resolution Rate */}
        <Card
          hover
          onClick={() => navigate('/ai')}
          className="p-5 flex flex-col justify-between hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              AI Resolution Rate
            </span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Bot size={16} />
            </span>
          </div>
          <div className="my-2.5">
            <div className="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-400 tracking-tight">
              {currentAnalytics.summary.aiResolutionRate}%
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
              +{currentAnalytics.summary.aiRateChange}%
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-[11px]">{currentPreset.periodLabel}</span>
          </div>
        </Card>

        {/* Average Response Time */}
        <Card
          hover
          onClick={() => navigate('/reports')}
          className="p-5 flex flex-col justify-between hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Avg Response Time
            </span>
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Clock size={16} />
            </span>
          </div>
          <div className="my-2.5">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {currentAnalytics.summary.avgResponseTime}
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
              {currentAnalytics.summary.avgResponseChange}% faster
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-[11px]">{currentPreset.periodLabel}</span>
          </div>
        </Card>

        {/* Customer Satisfaction */}
        <Card
          hover
          onClick={() => navigate('/customers')}
          className="p-5 flex flex-col justify-between hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-md transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Customer CSAT
            </span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Star size={16} />
            </span>
          </div>
          <div className="my-2.5">
            <div className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight flex items-baseline gap-1">
              <span>{currentAnalytics.summary.csatScore}</span>
              <span className="text-slate-400 dark:text-slate-500 text-sm font-normal">/ 5.0</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-0.5">
              +{currentAnalytics.summary.csatChange} pts
            </span>
            <span className="text-slate-400 dark:text-slate-500 text-[11px]">{currentPreset.periodLabel}</span>
          </div>
        </Card>
      </div>

      {/* ─── Analytics Chart & Channel Performance Split ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Resolution Analytics Chart */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <CardHeader
              title="Automated vs Human Handled Volume"
              subtitle={`Resolution breakdown across ${currentPreset.label.toLowerCase()}`}
              action={
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => navigate('/reports')}
                  rightIcon={<ArrowRight size={12} />}
                >
                  Full Report
                </Button>
              }
            />
            <AnalyticsChart data={currentAnalytics.chart} />
          </Card>
        </div>

        {/* Channel Performance Breakdown */}
        <div>
          <ChannelPerformance />
        </div>
      </div>

      {/* ─── Middle Section: Recent Conversations & Automations Activity ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Conversations / Active Support Queue */}
        <div className="lg:col-span-2 space-y-4">
          <Card padding="none" className="overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">Recent Conversations</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Latest customer inquiries prioritized by AI confidence score
                </p>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => navigate('/tickets')}
                rightIcon={<ArrowRight size={12} />}
              >
                View All Queue
              </Button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {tickets.slice(0, 5).map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setInspectTicket(ticket)}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <ChannelIcon channel={ticket.channel} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold text-violet-700 dark:text-violet-400 group-hover:underline">
                          {ticket.id}
                        </span>
                        <PriorityBadge priority={ticket.priority} />
                        <TicketStatusBadge status={ticket.status} />
                      </div>
                      <h4 className="text-sm font-medium text-slate-800 dark:text-slate-200 mt-1 truncate group-hover:text-violet-900 dark:group-hover:text-violet-300">
                        {ticket.subject}
                      </h4>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 flex items-center gap-2">
                        <span className="font-medium text-slate-600 dark:text-slate-300">{ticket.customer}</span>
                        <span>&bull;</span>
                        <span>Assignee: {ticket.assignee}</span>
                        <span>&bull;</span>
                        <span>{formatRelativeTime(ticket.createdAt)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                    <div className="text-right hidden sm:block">
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-medium">
                        AI Confidence
                      </span>
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {ticket.aiScore}%
                      </span>
                    </div>
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        setInspectTicket(ticket)
                      }}
                    >
                      Inspect
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Live Automations Activity */}
        <div>
          <Card className="h-full flex flex-col justify-between">
            <div>
              <CardHeader
                title="Active WhatsApp Automations"
                subtitle="High-frequency event triggers & bots"
                action={
                  <button
                    onClick={() => navigate('/automations')}
                    className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-800 dark:hover:text-violet-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    View Flows <ArrowRight size={12} />
                  </button>
                }
              />

              <div className="space-y-3 mt-2">
                {automations.slice(0, 4).map((auto) => (
                  <div
                    key={auto.id}
                    onClick={() => navigate('/automations')}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-violet-200 dark:hover:border-violet-700 hover:bg-violet-50/40 dark:hover:bg-violet-950/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-violet-900 dark:group-hover:text-violet-300">
                          {auto.name}
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 shrink-0">
                        {auto.runs.toLocaleString()} runs
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{auto.trigger}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-2 pt-1.5 border-t border-slate-100/80 dark:border-slate-800/80">
                      <span>Success: <strong className="text-emerald-600 dark:text-emerald-400">{auto.successRate}%</strong></span>
                      <span className="capitalize">{auto.channel} Cloud</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">6 workflows deployed</span>
              <button
                onClick={() => navigate('/automations')}
                className="text-violet-600 dark:text-violet-400 font-semibold hover:text-violet-800 dark:hover:text-violet-300 transition-colors cursor-pointer"
              >
                Create New Flow &rarr;
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* ─── Bottom Section: Agent Performance & Recent Activity Feed ───────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Support Agent Performance Specialist */}
        <div className="lg:col-span-2">
          <AgentPerformanceWidget />
        </div>

        {/* Live Activity Feed */}
        <div>
          <Card className="h-full flex flex-col justify-between">
            <div>
              <CardHeader
                title="Live Operations Feed"
                subtitle="Real-time events from AI & specialists"
                action={
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                    Streaming
                  </span>
                }
              />

              <div className="space-y-4 mt-2">
                {activityFeed.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-violet-600 mt-1.5 shrink-0 ring-4 ring-violet-100 dark:ring-violet-950" />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 dark:text-slate-200 leading-snug">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">{act.actor}</span>{' '}
                        {act.action}{' '}
                        <span className="font-semibold text-violet-700 dark:text-violet-400">{act.target}</span>
                      </p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">{act.detail}</p>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 block">
                        {formatRelativeTime(act.time)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
              <button
                onClick={() =>
                  toast({
                    type: 'info',
                    title: 'Audit Logs Export',
                    description: 'Full event stream exported for SOC2 compliance.',
                  })
                }
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 font-medium py-1 transition-colors cursor-pointer"
              >
                Download Audit Trail
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* ─── New Ticket Modal ─────────────────────────────────────────────────── */}
      <Modal
        open={newTicketModal}
        onClose={() => setNewTicketModal(false)}
        title="Create Customer Support Ticket"
        subtitle="Route direct inquiry into the AI dispatch flow"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setNewTicketModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleCreateTicket}>
              Dispatch Ticket
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreateTicket} className="space-y-4">
          <FormGroup>
            <Label required>Customer Name / Business</Label>
            <Input
              value={newCustomer}
              onChange={(e) => setNewCustomer(e.target.value)}
              placeholder="e.g. Acme Retail or Jane Doe"
            />
          </FormGroup>

          <FormGroup>
            <Label required>Subject / Inconvenience</Label>
            <Input
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Brief description of the customer issue"
            />
          </FormGroup>

          <div className="grid grid-cols-2 gap-3">
            <FormGroup>
              <Label>Channel</Label>
              <Select
                value={newChannel}
                onChange={(e) => setNewChannel(e.target.value)}
                options={[
                  { value: 'whatsapp', label: 'WhatsApp Cloud' },
                  { value: 'email', label: 'Email Desk' },
                  { value: 'chat', label: 'Website Live Chat' },
                ]}
              />
            </FormGroup>

            <FormGroup>
              <Label>Priority</Label>
              <Select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                options={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                  { value: 'urgent', label: 'Urgent' },
                ]}
              />
            </FormGroup>
          </div>

          <FormGroup>
            <Label>Initial Inquiry Details</Label>
            <Textarea rows={3} placeholder="Paste conversation transcript or customer context..." />
          </FormGroup>
        </form>
      </Modal>

      {/* ─── Inspect Ticket Modal ────────────────────────────────────────────── */}
      {inspectTicket && (
        <Modal
          open={!!inspectTicket}
          onClose={() => setInspectTicket(null)}
          title={`Ticket ${inspectTicket.id}`}
          subtitle={`Raised by ${inspectTicket.customer}`}
          footer={
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-400">
                Created: {new Date(inspectTicket.createdAt).toLocaleDateString()}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setInspectTicket(null)}>
                  Close
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    navigate('/tickets')
                    setInspectTicket(null)
                  }}
                >
                  Manage in Tickets Queue
                </Button>
              </div>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-violet-50/70 dark:bg-violet-950/40 border border-violet-100 dark:border-violet-900/60">
              <span className="text-[10px] uppercase font-bold tracking-wider text-violet-600 dark:text-violet-400">
                AI Suggestion Engine
              </span>
              <p className="text-xs text-violet-900 dark:text-violet-200 font-medium mt-1">
                Confidence: {inspectTicket.aiScore}% &bull; Intent match confirmed
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                "Hello {inspectTicket.customer}, we have synced your query regarding '{inspectTicket.subject}' with our order management systems."
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Channel</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize flex items-center gap-1.5 mt-0.5">
                  <ChannelIcon channel={inspectTicket.channel} /> {inspectTicket.channel}
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Status</span>
                <span className="mt-1 inline-block">
                  <TicketStatusBadge status={inspectTicket.status} />
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Priority</span>
                <span className="mt-1 inline-block">
                  <PriorityBadge priority={inspectTicket.priority} />
                </span>
              </div>
              <div>
                <span className="text-slate-400 dark:text-slate-500 block">Assignee</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 mt-0.5 block">
                  {inspectTicket.assignee}
                </span>
              </div>
            </div>

            <div>
              <h5 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Inquiry Subject</h5>
              <p className="text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-850 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                {inspectTicket.subject}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
