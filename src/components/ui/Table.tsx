import { cn } from '@/lib/utils'
import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react'

export function TableWrapper({ children, className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('table-wrapper border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm', className)} {...props}>
      {children}
    </div>
  )
}

export function Table({ children, className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <table className={cn('data-table', className)} {...props}>
      {children}
    </table>
  )
}

export function TableHeader({ children, className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead className={cn('bg-slate-50/75 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800', className)} {...props}>
      {children}
    </thead>
  )
}

export function TableBody({ children, className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody className={cn('divide-y divide-slate-100/70 dark:divide-slate-800/60', className)} {...props}>
      {children}
    </tbody>
  )
}

export function TableRow({ children, className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn('hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors', className)} {...props}>
      {children}
    </tr>
  )
}

export function TableHead({ children, className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={cn('px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider', className)} {...props}>
      {children}
    </th>
  )
}

export function TableCell({ children, className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={cn('px-4 py-3.5 text-sm text-slate-700 dark:text-slate-200 align-middle', className)} {...props}>
      {children}
    </td>
  )
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const start = Math.min((currentPage - 1) * pageSize + 1, totalItems)
  const end = Math.min(currentPage * pageSize, totalItems)

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/40 text-xs text-slate-500 dark:text-slate-400">
      <div>
        Showing <span className="font-semibold text-slate-700 dark:text-slate-200">{totalItems === 0 ? 0 : start}</span> to{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-200">{end}</span> of{' '}
        <span className="font-semibold text-slate-700 dark:text-slate-200">{totalItems}</span> entries
      </div>
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          Previous
        </button>
        <div className="px-2 font-medium text-slate-700 dark:text-slate-300">
          Page {currentPage} of {Math.max(1, totalPages)}
        </div>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  )
}
