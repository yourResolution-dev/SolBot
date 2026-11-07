import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  ChevronRight,
  ChevronLeft,
  X,
  Compass,
  CheckCircle2,
} from 'lucide-react'
import { useOnboarding } from '@/context/OnboardingContext'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface TourStepDef {
  selector: string
  title: string
  description: string
  placement: 'top' | 'bottom' | 'left' | 'right' | 'center'
  route?: string
}

const tourSteps: TourStepDef[] = [
  {
    selector: '[data-tour="sidebar"]',
    title: 'Unified Navigation Hub',
    description:
      'Quickly switch between Support Tickets, Customer 360 Profiles, WhatsApp Flow Automations, AI Tuning, and SLA Reports.',
    placement: 'right',
  },
  {
    selector: '[data-tour="search"]',
    title: 'Global Search & Command Palette',
    description:
      'Press Ctrl+K (or Cmd+K) anywhere to instantly lookup tickets, find customers, trigger AI actions, or jump across views.',
    placement: 'bottom',
  },
  {
    selector: '[data-tour="tickets-queue"]',
    title: 'Live WhatsApp Support Queue',
    description:
      'Incoming customer chats are prioritized automatically with SLA tags, unread counts, and Meta Cloud API delivery statuses.',
    placement: 'right',
    route: '/tickets',
  },
  {
    selector: '[data-tour="ai-copilot"]',
    title: 'Native-70B AI Autonomous Copilot',
    description:
      'Resolution AI generates verified answers with 94%+ confidence. Agents can pause AI for 1-click human takeover at any moment.',
    placement: 'left',
    route: '/tickets',
  },
  {
    selector: '[data-tour="customer-panel"]',
    title: 'Customer 360 & Internal Collaboration',
    description:
      'View customer lifetime spend, past shipments, WhatsApp phone verification, and share internal private team notes.',
    placement: 'left',
    route: '/tickets',
  },
]

export function ProductTour() {
  const { isTourActive, tourStep, nextTourStep, prevTourStep, skipTour } = useOnboarding()
  const navigate = useNavigate()
  const location = useLocation()
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null)
  const currentStep = tourSteps[tourStep] || tourSteps[0]

  // If the step needs a specific route (e.g. /tickets), navigate there
  useEffect(() => {
    if (isTourActive && currentStep.route && location.pathname !== currentStep.route) {
      navigate(currentStep.route)
    }
  }, [isTourActive, tourStep, currentStep.route, location.pathname, navigate])

  // Track target element bounding rect
  useEffect(() => {
    const updateRect = () => {
      if (!isTourActive) {
        setTargetRect(null)
        return
      }
      const el = document.querySelector(currentStep.selector)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' })
        setTargetRect(el.getBoundingClientRect())
      } else {
        setTargetRect(null)
      }
    }

    // Give a short delay for route transitions / layout settle
    const timer = setTimeout(updateRect, 200)
    window.addEventListener('resize', updateRect)
    window.addEventListener('scroll', updateRect, true)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect, true)
    }
  }, [isTourActive, tourStep, currentStep.selector, location.pathname])

  if (!isTourActive) return null

  const isFirst = tourStep === 0
  const isLast = tourStep === tourSteps.length - 1

  // Compute position for the tooltip card
  let cardStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 60,
  }

  if (targetRect) {
    const margin = 16
    const cardWidth = 360
    const cardHeight = 220

    if (currentStep.placement === 'right') {
      const left = Math.min(targetRect.right + margin, window.innerWidth - cardWidth - margin)
      const top = Math.max(margin, Math.min(targetRect.top, window.innerHeight - cardHeight - margin))
      cardStyle = { ...cardStyle, left: `${left}px`, top: `${top}px` }
    } else if (currentStep.placement === 'left') {
      const left = Math.max(margin, targetRect.left - cardWidth - margin)
      const top = Math.max(margin, Math.min(targetRect.top, window.innerHeight - cardHeight - margin))
      cardStyle = { ...cardStyle, left: `${left}px`, top: `${top}px` }
    } else if (currentStep.placement === 'bottom') {
      const left = Math.max(margin, Math.min(targetRect.left, window.innerWidth - cardWidth - margin))
      const top = Math.min(targetRect.bottom + margin, window.innerHeight - cardHeight - margin)
      cardStyle = { ...cardStyle, left: `${left}px`, top: `${top}px` }
    } else {
      // Top or Center
      const left = Math.max(margin, Math.min(targetRect.left, window.innerWidth - cardWidth - margin))
      const top = Math.max(margin, targetRect.top - cardHeight - margin)
      cardStyle = { ...cardStyle, left: `${left}px`, top: `${top}px` }
    }
  } else {
    // Center of screen fallback
    cardStyle = {
      ...cardStyle,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    }
  }

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Semi-transparent dark overlay */}
      <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-[2px] pointer-events-auto transition-opacity" onClick={skipTour} />

      {/* Target Element Spotlight Highlight Box */}
      {targetRect && (
        <div
          className="fixed rounded-2xl pointer-events-none transition-all duration-300 ease-out"
          style={{
            top: `${Math.max(0, targetRect.top - 6)}px`,
            left: `${Math.max(0, targetRect.left - 6)}px`,
            width: `${targetRect.width + 12}px`,
            height: `${targetRect.height + 12}px`,
            boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.55), 0 0 25px rgba(139, 92, 246, 0.8)',
            border: '2px solid rgba(139, 92, 246, 0.9)',
            zIndex: 55,
          }}
        />
      )}

      {/* Floating Tour Step Card */}
      <div
        style={cardStyle}
        className="pointer-events-auto w-[340px] sm:w-[380px] bg-white rounded-2xl shadow-2xl border border-violet-100 p-5 space-y-4 animate-scale-in"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-violet-100 text-violet-700">
              <Compass size={14} className="animate-spin-slow" />
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-violet-700">
              Tour • Step {tourStep + 1} of {tourSteps.length}
            </span>
          </div>

          <button
            onClick={skipTour}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            title="End tour"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-1.5">
          <h4 className="text-sm font-bold text-slate-900 leading-snug">
            {currentStep.title}
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            {currentStep.description}
          </p>
        </div>

        {/* Step Indicator Dots & Navigation Actions */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {tourSteps.map((_, i) => (
              <span
                key={i}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === tourStep ? 'w-5 bg-violet-600' : 'w-1.5 bg-slate-200'
                )}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!isFirst && (
              <Button
                variant="ghost"
                size="sm"
                onClick={prevTourStep}
                leftIcon={<ChevronLeft size={14} />}
                className="text-xs h-8 px-2.5"
              >
                Back
              </Button>
            )}

            <Button
              size="sm"
              onClick={nextTourStep}
              rightIcon={isLast ? <CheckCircle2 size={14} /> : <ChevronRight size={14} />}
              className="text-xs h-8 px-3 shadow-xs"
            >
              {isLast ? 'Finish Tour' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
