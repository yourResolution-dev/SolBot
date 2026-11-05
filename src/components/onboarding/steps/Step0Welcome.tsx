import { Sparkles, MessageSquare, ShieldCheck, ArrowRight, Play, Database } from 'lucide-react'
import { OnboardingHeroIllustration } from '../OnboardingIllustrations'
import { ResolutionLogo } from '@/components/ui/Illustrations'
import { Button } from '@/components/ui/Button'
import { useOnboarding } from '@/context/OnboardingContext'

export function Step0Welcome() {
  const { nextStep, toggleDemoMode, demoMode, startTour } = useOnboarding()

  return (
    <div className="space-y-8 animate-fade-in text-center max-w-3xl mx-auto py-2">
      {/* Brand Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-50 border border-violet-200/80 text-violet-700 text-xs font-semibold shadow-xs">
        <Sparkles size={14} className="text-violet-600 animate-pulse" />
        <span>Resolution Support AI • Meta Cloud API Edition</span>
      </div>

      {/* Main Title & Subtitle */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Supercharge your customer support with{' '}
          <span className="text-gradient">Autonomous AI</span> on WhatsApp
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Welcome to Resolution Support AI. Resolve order questions, issue tracking, and courier escalations in seconds with our omnichannel copilot, enterprise SLA triage, and human-in-the-loop takeover.
        </p>
      </div>

      {/* Hero Illustration */}
      <div className="py-2 flex justify-center">
        <OnboardingHeroIllustration className="max-w-md sm:max-w-lg drop-shadow-md" />
      </div>

      {/* Value Pillars Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-violet-300 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold mb-3">
            <Sparkles size={18} />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Native-70B Copilot</h4>
          <p className="text-xs text-slate-500 mt-1 leading-normal">
            Autonomous answers for shipping, returns, order lookups, and multilingual WhatsApp inquiries.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3">
            <MessageSquare size={18} />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Official WhatsApp Cloud</h4>
          <p className="text-xs text-slate-500 mt-1 leading-normal">
            Meta WABA webhook integration with high-throughput tier management and instant message receipts.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-colors">
          <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold mb-3">
            <ShieldCheck size={18} />
          </div>
          <h4 className="text-sm font-bold text-slate-900">Smart Human Triage</h4>
          <p className="text-xs text-slate-500 mt-1 leading-normal">
            Seamless one-click handoff to human agents when confidence slips or customer requests a specialist.
          </p>
        </div>
      </div>

      {/* Action CTA Bar */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          onClick={nextStep}
          size="lg"
          className="w-full sm:w-auto shadow-md"
          rightIcon={<ArrowRight size={18} />}
        >
          Quick 3-Minute Workspace Setup
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={startTour}
          className="w-full sm:w-auto"
          leftIcon={<Play size={16} className="text-violet-600 fill-violet-600" />}
        >
          Interactive Product Tour
        </Button>
      </div>

      {/* Bottom helper metadata */}
      <div className="flex items-center justify-center gap-4 text-xs text-slate-400 font-medium">
        <span>⏱️ Estimated time: ~3 mins</span>
        <span>•</span>
        <span>🔒 Meta Cloud API Sandbox Ready</span>
        <span>•</span>
        <button
          onClick={toggleDemoMode}
          className="text-violet-600 hover:text-violet-700 font-semibold underline underline-offset-2 flex items-center gap-1"
        >
          <Database size={12} />
          {demoMode ? 'Demo Workspace Active' : 'Enable Demo Mode'}
        </button>
      </div>
    </div>
  )
}
