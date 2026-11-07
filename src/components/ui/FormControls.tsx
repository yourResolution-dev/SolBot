import { cn } from '@/lib/utils'
import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react'

// ─── Label ──────────────────────────────────────────────────────────────────

interface LabelProps {
  htmlFor?: string
  children: ReactNode
  required?: boolean
  className?: string
}

export function Label({ htmlFor, children, required, className }: LabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1.5', className)}
    >
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}

// ─── Helper / Error text ─────────────────────────────────────────────────────

export function HelperText({ children, error }: { children: ReactNode; error?: boolean }) {
  return (
    <p className={cn('text-xs mt-1.5', error ? 'text-red-500' : 'text-slate-500 dark:text-slate-400')}>{children}</p>
  )
}

// ─── Input ───────────────────────────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  leftElement?: ReactNode
  rightElement?: ReactNode
}

export function Input({ error, leftElement, rightElement, className, ...props }: InputProps) {
  if (leftElement || rightElement) {
    return (
      <div className="relative flex items-center">
        {leftElement && (
          <div className="absolute left-3 text-slate-400 pointer-events-none flex items-center">{leftElement}</div>
        )}
        <input
          className={cn(
            'input-base',
            leftElement && 'pl-9',
            rightElement && 'pr-9',
            error && 'border-red-400 focus:border-red-400 focus:ring-red-500/30',
            className,
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 text-slate-400 flex items-center">{rightElement}</div>
        )}
      </div>
    )
  }

  return (
    <input
      className={cn(
        'input-base',
        error && 'border-red-400 focus:border-red-400 focus:ring-red-500/30',
        className,
      )}
      {...props}
    />
  )
}

// ─── Textarea ─────────────────────────────────────────────────────────────────

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean
}

export function Textarea({ error, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        'input-base resize-none',
        error && 'border-red-400 focus:border-red-400 focus:ring-red-500/30',
        className,
      )}
      {...props}
    />
  )
}

// ─── Select ───────────────────────────────────────────────────────────────────

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
}

export function Select({ error, options, placeholder, children, className, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        'input-base appearance-none cursor-pointer pr-10 bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")] bg-no-repeat bg-[right_12px_center]',
        error && 'border-red-400 focus:border-red-400 focus:ring-red-500/30',
        className,
      )}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {children || options?.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

// ─── Checkbox ─────────────────────────────────────────────────────────────────

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function Checkbox({ label, id, className, ...props }: CheckboxProps) {
  return (
    <label className={cn('flex items-center gap-2 cursor-pointer select-none group', className)} htmlFor={id}>
      <input
        type="checkbox"
        id={id}
        className="w-4 h-4 rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-violet-600 focus:ring-violet-500/30 cursor-pointer"
        {...props}
      />
      {label && <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-slate-100">{label}</span>}
    </label>
  )
}

// ─── Form Group ───────────────────────────────────────────────────────────────

export function FormGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('space-y-1', className)}>{children}</div>
}
