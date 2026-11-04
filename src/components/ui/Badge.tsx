import { cn } from '@/lib/utils'

type BadgeVariant = 'green' | 'red' | 'yellow' | 'blue' | 'violet' | 'slate'

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  dot?: boolean
  className?: string
}

export function Badge({ variant = 'slate', dot, children, className }: BadgeProps) {
  return (
    <span className={cn('badge', `badge-${variant}`, className)}>
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full', {
          'bg-emerald-500': variant === 'green',
          'bg-red-500':     variant === 'red',
          'bg-amber-500':   variant === 'yellow',
          'bg-blue-500':    variant === 'blue',
          'bg-violet-500':  variant === 'violet',
          'bg-slate-400':   variant === 'slate',
        })} />
      )}
      {children}
    </span>
  )
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

type TicketStatus = 'open' | 'pending' | 'resolved' | 'closed'
type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
type CustomerStatus = 'active' | 'inactive' | 'churned'
type AgentStatus = 'online' | 'away' | 'offline'
type AutomationStatus = 'active' | 'paused' | 'draft'

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  const map: Record<TicketStatus, { v: BadgeVariant; label: string }> = {
    open:     { v: 'blue', label: 'Open' },
    pending:  { v: 'yellow', label: 'Pending' },
    resolved: { v: 'green', label: 'Resolved' },
    closed:   { v: 'slate', label: 'Closed' },
  }
  const { v, label } = map[status]
  return <Badge variant={v} dot>{label}</Badge>
}

export function PriorityBadge({ priority }: { priority: TicketPriority }) {
  const map: Record<TicketPriority, { v: BadgeVariant; label: string }> = {
    low:    { v: 'slate',  label: 'Low' },
    medium: { v: 'blue',   label: 'Medium' },
    high:   { v: 'yellow', label: 'High' },
    urgent: { v: 'red',    label: 'Urgent' },
  }
  const { v, label } = map[priority]
  return <Badge variant={v}>{label}</Badge>
}

export function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  const map: Record<CustomerStatus, { v: BadgeVariant; label: string }> = {
    active:   { v: 'green', label: 'Active' },
    inactive: { v: 'yellow', label: 'Inactive' },
    churned:  { v: 'red', label: 'Churned' },
  }
  const { v, label } = map[status]
  return <Badge variant={v} dot>{label}</Badge>
}

export function AgentStatusBadge({ status }: { status: AgentStatus }) {
  const map: Record<AgentStatus, { v: BadgeVariant; label: string }> = {
    online:  { v: 'green', label: 'Online' },
    away:    { v: 'yellow', label: 'Away' },
    offline: { v: 'slate', label: 'Offline' },
  }
  const { v, label } = map[status]
  return <Badge variant={v} dot>{label}</Badge>
}

export function AutomationStatusBadge({ status }: { status: AutomationStatus }) {
  const map: Record<AutomationStatus, { v: BadgeVariant; label: string }> = {
    active: { v: 'green', label: 'Active' },
    paused: { v: 'yellow', label: 'Paused' },
    draft:  { v: 'slate', label: 'Draft' },
  }
  const { v, label } = map[status]
  return <Badge variant={v} dot>{label}</Badge>
}
