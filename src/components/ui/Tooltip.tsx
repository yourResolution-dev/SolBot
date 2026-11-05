import { useState, useRef, type ReactNode } from 'react'
import { HelpCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
  placement?: TooltipPlacement
  className?: string
  delay?: number
}

export function Tooltip({
  content,
  children,
  placement = 'top',
  className = '',
  delay = 150,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setIsVisible(false)
  }

  const placementClasses: Record<TooltipPlacement, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  const arrowClasses: Record<TooltipPlacement, string> = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-900 border-x-transparent border-b-transparent border-[5px]',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-900 border-x-transparent border-t-transparent border-[5px]',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-900 border-y-transparent border-r-transparent border-[5px]',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-900 border-y-transparent border-l-transparent border-[5px]',
  }

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={cn(
            'absolute z-50 px-2.5 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg shadow-lg pointer-events-none whitespace-normal max-w-xs transition-opacity duration-150 animate-scale-in text-center',
            placementClasses[placement],
            className
          )}
        >
          {content}
          <div className={cn('absolute w-0 h-0', arrowClasses[placement])} />
        </div>
      )}
    </div>
  )
}

interface InfoTooltipProps {
  content: ReactNode
  placement?: TooltipPlacement
  className?: string
  iconClassName?: string
}

export function InfoTooltip({
  content,
  placement = 'top',
  className = '',
  iconClassName = 'w-3.5 h-3.5 text-slate-400 hover:text-slate-600 transition-colors',
}: InfoTooltipProps) {
  return (
    <Tooltip content={content} placement={placement} className={className}>
      <button
        type="button"
        className="inline-flex items-center justify-center cursor-help focus:outline-none"
        aria-label="More information"
      >
        <HelpCircle className={iconClassName} />
      </button>
    </Tooltip>
  )
}
