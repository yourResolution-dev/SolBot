import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
}

export function Modal({
  open,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md',
  className,
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/70 backdrop-blur-sm animate-fade-in" />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative z-10 w-full bg-white dark:bg-slate-900 rounded-2xl shadow-modal border border-slate-200/90 dark:border-slate-800 animate-scale-in overflow-hidden',
          sizeMap[size],
          className,
        )}
      >
        {/* Header */}
        {(title || subtitle) && (
          <div className="flex items-start justify-between gap-4 p-5 border-b border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-850/40">
            <div>
              {title && <h2 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h2>}
              {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-5 text-slate-700 dark:text-slate-200">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  confirmLabel?: string
  variant?: 'danger' | 'primary'
  loading?: boolean
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  variant = 'danger',
  loading,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button variant={variant} size="sm" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{description}</p>
    </Modal>
  )
}
