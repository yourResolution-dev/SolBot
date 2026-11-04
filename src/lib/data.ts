// ─── Mock business data for Resolution Support AI ────────────────────────────

export type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type Channel = 'whatsapp' | 'email' | 'chat' | 'phone'

export interface Ticket {
  id: string
  subject: string
  customer: string
  avatar?: string
  status: TicketStatus
  priority: TicketPriority
  channel: Channel
  assignee: string
  createdAt: string
  updatedAt: string
  tags: string[]
  aiScore: number
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  plan: 'starter' | 'growth' | 'enterprise'
  status: 'active' | 'inactive' | 'churned'
  ticketsTotal: number
  satisfactionScore: number
  joinedAt: string
  lastContact: string
  avatar?: string
}

export interface Automation {
  id: string
  name: string
  trigger: string
  actions: number
  status: 'active' | 'paused' | 'draft'
  runs: number
  successRate: number
  lastRun: string
  channel: Channel
}

export interface Notification {
  id: string
  type: 'ticket' | 'message' | 'system' | 'ai' | 'billing'
  title: string
  body: string
  time: string
  read: boolean
  avatar?: string
  icon?: string
}

export interface DashboardMetric {
  label: string
  value: string | number
  change: number
  changeLabel: string
  icon: string
  color: string
  sparkline: number[]
}

// ─── Tickets ────────────────────────────────────────────────────────────────

export const tickets: Ticket[] = [
  {
    id: 'TKT-1041',
    subject: 'WhatsApp bot not responding to order status queries',
    customer: 'Priya Sharma',
    status: 'open',
    priority: 'urgent',
    channel: 'whatsapp',
    assignee: 'Alex Rivera',
    createdAt: '2026-11-04T18:12:00Z',
    updatedAt: '2026-11-04T20:45:00Z',
    tags: ['bot', 'whatsapp', 'orders'],
    aiScore: 94,
  },
  {
    id: 'TKT-1040',
    subject: 'Billing discrepancy on November invoice — extra seats charged',
    customer: 'Daniel Koch',
    status: 'pending',
    priority: 'high',
    channel: 'email',
    assignee: 'Sarah Chen',
    createdAt: '2026-11-04T14:30:00Z',
    updatedAt: '2026-11-04T16:00:00Z',
    tags: ['billing', 'invoice'],
    aiScore: 87,
  },
  {
    id: 'TKT-1039',
    subject: 'Request to integrate Shopify webhooks with existing flows',
    customer: 'TechNova Ltd.',
    status: 'open',
    priority: 'medium',
    channel: 'chat',
    assignee: 'Marcus Obi',
    createdAt: '2026-11-04T10:15:00Z',
    updatedAt: '2026-11-04T10:15:00Z',
    tags: ['integration', 'shopify', 'webhooks'],
    aiScore: 72,
  },
  {
    id: 'TKT-1038',
    subject: 'AI replies misidentifying product names in Arabic messages',
    customer: 'Layla Hassan',
    status: 'open',
    priority: 'high',
    channel: 'whatsapp',
    assignee: 'Sarah Chen',
    createdAt: '2026-11-03T22:40:00Z',
    updatedAt: '2026-11-04T08:00:00Z',
    tags: ['ai', 'nlp', 'arabic'],
    aiScore: 91,
  },
  {
    id: 'TKT-1037',
    subject: 'Handoff to live agent not triggering correctly',
    customer: 'Bright Homes Inc.',
    status: 'resolved',
    priority: 'medium',
    channel: 'whatsapp',
    assignee: 'Marcus Obi',
    createdAt: '2026-11-03T16:00:00Z',
    updatedAt: '2026-11-04T09:30:00Z',
    tags: ['handoff', 'automation'],
    aiScore: 83,
  },
  {
    id: 'TKT-1036',
    subject: 'API rate limit errors during peak hours (500 responses)',
    customer: 'CloudRetail Co.',
    status: 'resolved',
    priority: 'urgent',
    channel: 'email',
    assignee: 'Alex Rivera',
    createdAt: '2026-11-03T08:00:00Z',
    updatedAt: '2026-11-04T07:00:00Z',
    tags: ['api', 'rate-limit', 'performance'],
    aiScore: 97,
  },
  {
    id: 'TKT-1035',
    subject: 'Need CSV export for all conversation logs — GDPR request',
    customer: 'Nexus Finance GmbH',
    status: 'pending',
    priority: 'low',
    channel: 'email',
    assignee: 'Sarah Chen',
    createdAt: '2026-11-02T14:00:00Z',
    updatedAt: '2026-11-03T12:00:00Z',
    tags: ['gdpr', 'export', 'compliance'],
    aiScore: 65,
  },
  {
    id: 'TKT-1034',
    subject: 'Custom greeting messages not saving in flow editor',
    customer: 'Ravi Patel',
    status: 'closed',
    priority: 'low',
    channel: 'chat',
    assignee: 'Marcus Obi',
    createdAt: '2026-11-01T11:00:00Z',
    updatedAt: '2026-11-02T15:00:00Z',
    tags: ['editor', 'bug'],
    aiScore: 60,
  },
]

// ─── Customers ───────────────────────────────────────────────────────────────

export const customers: Customer[] = [
  {
    id: 'CUST-001',
    name: 'TechNova Ltd.',
    email: 'support@technova.io',
    phone: '+44 20 7946 0012',
    company: 'TechNova Ltd.',
    plan: 'enterprise',
    status: 'active',
    ticketsTotal: 42,
    satisfactionScore: 4.8,
    joinedAt: '2024-03-10T00:00:00Z',
    lastContact: '2026-11-04T10:15:00Z',
  },
  {
    id: 'CUST-002',
    name: 'Priya Sharma',
    email: 'priya@sharmafashion.in',
    phone: '+91 98765 43210',
    company: 'Sharma Fashion',
    plan: 'growth',
    status: 'active',
    ticketsTotal: 7,
    satisfactionScore: 4.5,
    joinedAt: '2025-07-22T00:00:00Z',
    lastContact: '2026-11-04T18:12:00Z',
  },
  {
    id: 'CUST-003',
    name: 'CloudRetail Co.',
    email: 'ops@cloudretail.com',
    phone: '+1 415 555 0123',
    company: 'CloudRetail Co.',
    plan: 'enterprise',
    status: 'active',
    ticketsTotal: 128,
    satisfactionScore: 4.2,
    joinedAt: '2023-11-01T00:00:00Z',
    lastContact: '2026-11-04T07:00:00Z',
  },
  {
    id: 'CUST-004',
    name: 'Daniel Koch',
    email: 'd.koch@nexusinvest.de',
    phone: '+49 30 12345678',
    company: 'Nexus Finance GmbH',
    plan: 'growth',
    status: 'active',
    ticketsTotal: 15,
    satisfactionScore: 3.9,
    joinedAt: '2025-02-14T00:00:00Z',
    lastContact: '2026-11-04T14:30:00Z',
  },
  {
    id: 'CUST-005',
    name: 'Layla Hassan',
    email: 'layla@arabstore.ae',
    phone: '+971 50 123 4567',
    company: 'ArabStore FZCO',
    plan: 'starter',
    status: 'active',
    ticketsTotal: 3,
    satisfactionScore: 4.7,
    joinedAt: '2026-08-01T00:00:00Z',
    lastContact: '2026-11-04T08:00:00Z',
  },
  {
    id: 'CUST-006',
    name: 'Bright Homes Inc.',
    email: 'info@brighthomes.ca',
    phone: '+1 604 555 0199',
    company: 'Bright Homes Inc.',
    plan: 'growth',
    status: 'inactive',
    ticketsTotal: 21,
    satisfactionScore: 4.1,
    joinedAt: '2024-09-05T00:00:00Z',
    lastContact: '2026-11-04T09:30:00Z',
  },
]

// ─── Automations ─────────────────────────────────────────────────────────────

export const automations: Automation[] = [
  {
    id: 'AUTO-001',
    name: 'Order Status Auto-Reply',
    trigger: 'Message contains "order status"',
    actions: 3,
    status: 'active',
    runs: 14820,
    successRate: 98.4,
    lastRun: '2026-11-04T23:10:00Z',
    channel: 'whatsapp',
  },
  {
    id: 'AUTO-002',
    name: 'Business Hours Greeting',
    trigger: 'First message outside business hours',
    actions: 2,
    status: 'active',
    runs: 8730,
    successRate: 100,
    lastRun: '2026-11-04T22:00:00Z',
    channel: 'whatsapp',
  },
  {
    id: 'AUTO-003',
    name: 'Ticket Escalation to Human',
    trigger: 'Sentiment score < 0.3 OR message contains "speak to agent"',
    actions: 5,
    status: 'active',
    runs: 2340,
    successRate: 96.7,
    lastRun: '2026-11-04T21:30:00Z',
    channel: 'whatsapp',
  },
  {
    id: 'AUTO-004',
    name: 'Post-Resolution CSAT Survey',
    trigger: 'Ticket resolved',
    actions: 2,
    status: 'active',
    runs: 6210,
    successRate: 94.2,
    lastRun: '2026-11-04T20:00:00Z',
    channel: 'email',
  },
  {
    id: 'AUTO-005',
    name: 'VIP Customer Fast-Track',
    trigger: 'Customer plan = enterprise AND priority = urgent',
    actions: 4,
    status: 'paused',
    runs: 540,
    successRate: 100,
    lastRun: '2026-11-02T14:00:00Z',
    channel: 'whatsapp',
  },
  {
    id: 'AUTO-006',
    name: 'Multilingual FAQ Bot',
    trigger: 'Incoming message detected in non-English language',
    actions: 6,
    status: 'draft',
    runs: 0,
    successRate: 0,
    lastRun: '—',
    channel: 'whatsapp',
  },
]

// ─── Notifications ───────────────────────────────────────────────────────────

export const notifications: Notification[] = [
  {
    id: 'N-001',
    type: 'ticket',
    title: 'New urgent ticket from Priya Sharma',
    body: 'WhatsApp bot not responding to order status queries — requires immediate attention.',
    time: '2026-11-04T20:45:00Z',
    read: false,
  },
  {
    id: 'N-002',
    type: 'ai',
    title: 'AI confidence below threshold',
    body: 'TKT-1038: AI replied with 61% confidence. Consider human review.',
    time: '2026-11-04T18:30:00Z',
    read: false,
  },
  {
    id: 'N-003',
    type: 'system',
    title: 'WhatsApp API rate limit warning',
    body: 'You have used 87% of your monthly messaging quota.',
    time: '2026-11-04T16:00:00Z',
    read: false,
  },
  {
    id: 'N-004',
    type: 'billing',
    title: 'Invoice #INV-2026-11 generated',
    body: 'Your November invoice of $1,290 is ready. Due Dec 1, 2026.',
    time: '2026-11-04T10:00:00Z',
    read: true,
  },
  {
    id: 'N-005',
    type: 'message',
    title: 'Daniel Koch replied to TKT-1040',
    body: '"Please escalate this — finance team is waiting."',
    time: '2026-11-04T16:12:00Z',
    read: true,
  },
  {
    id: 'N-006',
    type: 'system',
    title: 'Automation AUTO-005 paused',
    body: 'VIP Customer Fast-Track was automatically paused due to 3 consecutive failures.',
    time: '2026-11-04T14:00:00Z',
    read: true,
  },
]

// ─── Dashboard metrics ────────────────────────────────────────────────────────

export const dashboardMetrics: DashboardMetric[] = [
  {
    label: 'Open Tickets',
    value: 48,
    change: -12,
    changeLabel: 'vs last week',
    icon: 'ticket',
    color: 'violet',
    sparkline: [60, 55, 70, 50, 62, 48, 48],
  },
  {
    label: 'AI Resolution Rate',
    value: '84.2%',
    change: 3.1,
    changeLabel: 'vs last month',
    icon: 'bot',
    color: 'emerald',
    sparkline: [78, 80, 81, 79, 82, 84, 84.2],
  },
  {
    label: 'Avg Response Time',
    value: '1m 42s',
    change: -18,
    changeLabel: 'vs last week',
    icon: 'clock',
    color: 'blue',
    sparkline: [130, 125, 140, 118, 122, 102, 102],
  },
  {
    label: 'CSAT Score',
    value: '4.6 / 5',
    change: 0.2,
    changeLabel: 'vs last month',
    icon: 'star',
    color: 'amber',
    sparkline: [4.1, 4.2, 4.3, 4.4, 4.4, 4.5, 4.6],
  },
]

// ─── Recent activity feed ─────────────────────────────────────────────────────

export const activityFeed = [
  {
    id: 'A1',
    actor: 'AI Agent',
    action: 'resolved',
    target: 'TKT-1037',
    detail: 'Handoff to live agent not triggering correctly',
    time: '2026-11-04T09:30:00Z',
    type: 'resolve' as const,
  },
  {
    id: 'A2',
    actor: 'Sarah Chen',
    action: 'assigned',
    target: 'TKT-1040',
    detail: 'Billing discrepancy on November invoice',
    time: '2026-11-04T14:35:00Z',
    type: 'assign' as const,
  },
  {
    id: 'A3',
    actor: 'System',
    action: 'triggered automation',
    target: 'Order Status Auto-Reply',
    detail: '14,820 successful runs today',
    time: '2026-11-04T23:10:00Z',
    type: 'automation' as const,
  },
  {
    id: 'A4',
    actor: 'Alex Rivera',
    action: 'escalated',
    target: 'TKT-1041',
    detail: 'Marked as urgent — WhatsApp bot unresponsive',
    time: '2026-11-04T20:45:00Z',
    type: 'escalate' as const,
  },
  {
    id: 'A5',
    actor: 'AI Agent',
    action: 'replied to',
    target: 'Layla Hassan',
    detail: 'Product availability query in Arabic — 71% confidence',
    time: '2026-11-04T19:00:00Z',
    type: 'ai' as const,
  },
]

// ─── Agents ───────────────────────────────────────────────────────────────────

export const agents = [
  {
    id: 'AGT-001',
    name: 'Alex Rivera',
    role: 'Senior Support Engineer',
    status: 'online' as const,
    ticketsOpen: 12,
    ticketsResolved: 48,
    csat: 4.9,
    avatar: 'AR',
  },
  {
    id: 'AGT-002',
    name: 'Sarah Chen',
    role: 'Customer Success Manager',
    status: 'online' as const,
    ticketsOpen: 8,
    ticketsResolved: 61,
    csat: 4.7,
    avatar: 'SC',
  },
  {
    id: 'AGT-003',
    name: 'Marcus Obi',
    role: 'Integration Specialist',
    status: 'away' as const,
    ticketsOpen: 5,
    ticketsResolved: 34,
    csat: 4.5,
    avatar: 'MO',
  },
  {
    id: 'AGT-004',
    name: 'Fatima Al-Rashid',
    role: 'AI Trainer & QA Lead',
    status: 'offline' as const,
    ticketsOpen: 0,
    ticketsResolved: 22,
    csat: 4.8,
    avatar: 'FA',
  },
]

// ─── Search results mock ───────────────────────────────────────────────────────

export type SearchResultType = 'ticket' | 'customer' | 'automation' | 'page'

export interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  subtitle: string
  url: string
}

export function searchAll(query: string): SearchResult[] {
  if (!query.trim()) return []
  const q = query.toLowerCase()

  const results: SearchResult[] = []

  tickets.forEach((t) => {
    if (t.id.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q) || t.customer.toLowerCase().includes(q)) {
      results.push({ id: t.id, type: 'ticket', title: t.subject, subtitle: `${t.id} · ${t.customer}`, url: `/tickets/${t.id}` })
    }
  })

  customers.forEach((c) => {
    if (c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.company.toLowerCase().includes(q)) {
      results.push({ id: c.id, type: 'customer', title: c.name, subtitle: `${c.company} · ${c.email}`, url: `/customers/${c.id}` })
    }
  })

  automations.forEach((a) => {
    if (a.name.toLowerCase().includes(q)) {
      results.push({ id: a.id, type: 'automation', title: a.name, subtitle: `Automation · ${a.channel}`, url: `/automations/${a.id}` })
    }
  })

  const pages = [
    { id: 'pg-dash', title: 'Dashboard', subtitle: 'Overview & metrics', url: '/' },
    { id: 'pg-tickets', title: 'Tickets', subtitle: 'Support queue', url: '/tickets' },
    { id: 'pg-customers', title: 'Customers', subtitle: 'Customer directory', url: '/customers' },
    { id: 'pg-automations', title: 'Automations', subtitle: 'WhatsApp flows', url: '/automations' },
    { id: 'pg-ai', title: 'AI Assistant', subtitle: 'AI training & insights', url: '/ai' },
    { id: 'pg-reports', title: 'Reports', subtitle: 'Analytics & exports', url: '/reports' },
    { id: 'pg-settings', title: 'Settings', subtitle: 'Account & integrations', url: '/settings' },
  ]
  pages.forEach((p) => {
    if (p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q)) {
      results.push({ ...p, type: 'page' })
    }
  })

  return results.slice(0, 8)
}
