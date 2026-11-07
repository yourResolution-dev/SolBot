import { useEffect, useRef } from 'react'
import {
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  Building2,
  MessageSquare,
  Bot,
  Users,
} from 'lucide-react'
import { useOnboarding } from '@/context/OnboardingContext'
import { Step0Welcome } from './steps/Step0Welcome'
import { Step1BusinessProfile } from './steps/Step1BusinessProfile'
import { Step2WhatsAppConnect } from './steps/Step2WhatsAppConnect'
import { Step3AIAgent } from './steps/Step3AIAgent'
import { Step4TeamInvite } from './steps/Step4TeamInvite'
import { Step5Completion } from './steps/Step5Completion'
import { ResolutionLogo } from '@/components/ui/Illustrations'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const wizardSteps = [
  { step: 1, label: 'Workspace', icon: Building2, desc: 'Profile & SLAs' },
  { step: 2, label: 'WhatsApp', icon: MessageSquare, desc: 'Cloud API' },
  { step: 3, label: 'AI Copilot', icon: Bot, desc: 'Model & Voice' },
  { step: 4, label: 'Team', icon: Users, desc: 'Roles & Invites' },
]

export function OnboardingModal() {
  const {
    state,
    isOnboardingModalOpen,
    closeOnboardingModal,
    setStep,
    nextStep,
    prevStep,
    skipStep,
    skipAll,
  } = useOnboarding()

  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Scroll content to top whenever step changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }, [state.currentStep])

  // Escape key handler to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOnboardingModalOpen) {
        closeOnboardingModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOnboardingModalOpen, closeOnboardingModal])

  if (!isOnboardingModalOpen) return null

  const isWizardStep = state.currentStep >= 1 && state.currentStep <= 4
  const progressPercent =
    state.currentStep === 0
      ? 5
      : state.currentStep === 5
      ? 100
      : Math.round((state.currentStep / 4) * 100)

  const getStepButtonLabel = () => {
    switch (state.currentStep) {
      case 1:
        return 'Continue to WhatsApp Connection'
      case 2:
        return 'Continue to AI Copilot Setup'
      case 3:
        return 'Continue to Team Invites'
      case 4:
        return 'Finish & Launch Workspace'
      default:
        return 'Continue'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Premium Backdrop with Blur */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
        onClick={closeOnboardingModal}
      />

      {/* Main Modal Card */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label="Resolution Support AI Onboarding"
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden z-10 flex flex-col max-h-[92vh] animate-scale-in"
      >
        {/* Top Header Bar */}
        <div className="p-4 sm:px-6 sm:py-4 bg-gradient-to-r from-violet-50/80 via-indigo-50/40 to-white border-b border-slate-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <ResolutionLogo className="w-8 h-8 shrink-0" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm tracking-tight">
                  ReSolution Support AI
                </span>
                <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[10px] font-bold">
                  Onboarding
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                {state.currentStep === 0 && 'Welcome & Quick Setup'}
                {state.currentStep === 1 && 'Step 1 of 4 • Workspace Foundation'}
                {state.currentStep === 2 && 'Step 2 of 4 • Meta Cloud API Channel'}
                {state.currentStep === 3 && 'Step 3 of 4 • AI Copilot Tuning'}
                {state.currentStep === 4 && 'Step 4 of 4 • Support Team Collaboration'}
                {state.currentStep === 5 && 'Setup Completed • Workspace Ready'}
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2">
            {state.currentStep > 0 && state.currentStep < 5 && (
              <button
                type="button"
                onClick={skipAll}
                className="hidden sm:inline-flex text-xs font-semibold text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                title="Skip onboarding and explore workspace immediately"
              >
                Skip setup
              </button>
            )}

            <button
              type="button"
              onClick={closeOnboardingModal}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Close setup modal"
              title="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Stepper Progress Indicator (shown on steps 1-4) */}
        {isWizardStep && (
          <div className="px-4 sm:px-8 py-3 bg-slate-50/70 border-b border-slate-100 shrink-0">
            {/* Visual Step Pills */}
            <div className="grid grid-cols-4 gap-2 sm:gap-4">
              {wizardSteps.map((ws) => {
                const isCurrent = state.currentStep === ws.step
                const isPast = state.completedSteps.includes(ws.step) || state.currentStep > ws.step
                const Icon = ws.icon

                return (
                  <button
                    key={ws.step}
                    type="button"
                    onClick={() => setStep(ws.step)}
                    className={cn(
                      'flex items-center gap-2 p-1.5 sm:p-2 rounded-xl text-left transition-all cursor-pointer',
                      isCurrent
                        ? 'bg-white shadow-xs border border-violet-200 ring-1 ring-violet-500/20'
                        : isPast
                        ? 'hover:bg-white/60'
                        : 'opacity-60 hover:opacity-90'
                    )}
                  >
                    <div
                      className={cn(
                        'w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 transition-all',
                        isCurrent
                          ? 'bg-violet-600 text-white shadow-xs'
                          : isPast
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 text-slate-600'
                      )}
                    >
                      {isPast ? <Check size={14} className="stroke-[3]" /> : <Icon size={14} />}
                    </div>
                    <div className="min-w-0 hidden sm:block">
                      <p
                        className={cn(
                          'text-xs font-bold truncate leading-tight',
                          isCurrent
                            ? 'text-violet-900'
                            : isPast
                            ? 'text-slate-800'
                            : 'text-slate-500'
                        )}
                      >
                        {ws.label}
                      </p>
                      <span className="text-[10px] text-slate-400 block truncate leading-none mt-0.5">
                        {ws.desc}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Linear Progress Bar */}
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-violet-600 via-indigo-600 to-emerald-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Scrollable Step Body */}
        <div
          ref={contentRef}
          className="flex-1 overflow-y-auto px-4 sm:px-8 py-5 sm:py-6"
        >
          {state.currentStep === 0 && <Step0Welcome />}
          {state.currentStep === 1 && <Step1BusinessProfile />}
          {state.currentStep === 2 && <Step2WhatsAppConnect />}
          {state.currentStep === 3 && <Step3AIAgent />}
          {state.currentStep === 4 && <Step4TeamInvite />}
          {state.currentStep === 5 && <Step5Completion />}
        </div>

        {/* Footer Navigation Bar for Steps 1-4 */}
        {isWizardStep && (
          <div className="p-4 sm:px-8 sm:py-3.5 bg-slate-50/90 border-t border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevStep}
                leftIcon={<ChevronLeft size={16} />}
                className="text-slate-600 hover:text-slate-900"
              >
                Back
              </Button>

              <button
                type="button"
                onClick={skipStep}
                className="text-xs text-slate-400 hover:text-slate-600 font-medium px-2 py-1 rounded hover:bg-slate-200/50 transition-colors"
              >
                Skip this step
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">
                Step {state.currentStep} of 4
              </span>

              <Button
                size="md"
                onClick={nextStep}
                rightIcon={<ChevronRight size={16} />}
                className="shadow-md"
              >
                {getStepButtonLabel()}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
