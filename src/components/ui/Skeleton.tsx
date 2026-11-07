import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/lib/utils'

// ─── Skeleton primitives ──────────────────────────────────────────────────────

interface SkeletonProps { className?: string; rounded?: string }

export function Skeleton({ className, rounded = 'rounded-lg' }: SkeletonProps) {
  return <div className={cn('skeleton', rounded, className)} />
}

export function SkeletonText({ lines = 1, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-3', i === lines - 1 && lines > 1 ? 'w-4/5' : 'w-full')}
        />
      ))}
    </div>
  )
}

// ─── Skeleton Cards ───────────────────────────────────────────────────────────

export function StatCardSkeleton() {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-8 rounded-xl" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3.5 border-b border-slate-50 dark:border-slate-800">
          <Skeleton className={cn('h-4', i === 0 ? 'w-32' : 'w-20')} />
        </td>
      ))}
    </tr>
  )
}

export function TicketListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card divide-y divide-slate-50 dark:divide-slate-800 overflow-hidden">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 flex items-center gap-4">
          <Skeleton className="w-8 h-8 rounded-full shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <Skeleton className="h-6 w-16 shrink-0" />
        </div>
      ))}
    </div>
  )
}

// ─── Empty State ─────────────────────────────────────────────────────────────

interface EmptyStateProps {
  illustration?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ illustration, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      {illustration && (
        <div className="mb-5 text-slate-300 dark:text-slate-600">{illustration}</div>
      )}
      <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs leading-relaxed">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

// ─── Error State ─────────────────────────────────────────────────────────────

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'An error occurred while loading this data. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
  className,
}: ErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12 px-6 text-center', className)}>
      <div className="w-12 h-12 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-500 dark:text-red-400 flex items-center justify-center mb-4 border border-red-200/60 dark:border-red-900/60 shadow-xs">
        <AlertCircle size={24} />
      </div>
      <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">{title}</h3>
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {onRetry && (
        <div className="mt-5">
          <Button size="sm" variant="secondary" onClick={onRetry} leftIcon={<RefreshCw size={14} />}>
            {retryLabel}
          </Button>
        </div>
      )}
    </div>
  )
}
