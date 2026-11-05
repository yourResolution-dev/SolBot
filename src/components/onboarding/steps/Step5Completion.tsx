import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Sparkles,
  CheckCircle2,
  Play,
  MessageSquare,
  LayoutDashboard,
  Copy,
  Check,
  ExternalLink,
  Bot,
  Users,
} from 'lucide-react'
import { CelebrationIllustration } from '../OnboardingIllustrations'
import { Button } from '@/components/ui/Button'
import { useOnboarding } from '@/context/OnboardingContext'
import { useToast } from '@/components/ui/Toast'

export function Step5Completion() {
  const { state, finishOnboarding, startTour } = useOnboarding()
  const { workspace, whatsapp, aiAgent, team } = state
  const { toast } = useToast()
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  const workspaceUrl = `https://${workspace.subdomain}.resolutionsupport.ai`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(workspaceUrl)
    setCopied(true)
    toast({
      type: 'success',
      title: 'Link Copied',
      description: `${workspaceUrl} copied to your clipboard.`,
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGoToTickets = () => {
    finishOnboarding()
    navigate('/tickets')
  }

  const handleGoToDashboard = () => {
    finishOnboarding()
    navigate('/')
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto py-2 text-center">
      {/* Celebration Header */}
      <div className="flex justify-center">
        <CelebrationIllustration />
      </div>

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <CheckCircle2 size={14} className="text-emerald-600" /> Setup Complete • Workspace Ready
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Congratulations! {workspace.companyName} is live.
        </h2>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          Your Meta WhatsApp Cloud API endpoint is connected, Resolution Copilot is trained, and your demo queue is primed with realistic customer scenarios.
        </p>
      </div>

      {/* Summary Matrix Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
        {/* Workspace details */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900">Workspace Endpoint</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-semibold">
              Live
            </span>
          </div>
          <div className="text-xs text-slate-600 font-mono font-medium truncate mb-2">
            {workspaceUrl}
          </div>
          <button
            onClick={handleCopyLink}
            className="text-[11px] text-violet-600 hover:text-violet-700 font-semibold flex items-center gap-1"
          >
            {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
            {copied ? 'Copied to clipboard' : 'Copy workspace link'}
          </button>
        </div>

        {/* WhatsApp Channel */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900">Official WhatsApp Cloud</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold flex items-center gap-1">
              <CheckCircle2 size={10} /> Verified
            </span>
          </div>
          <p className="text-xs text-slate-800 font-semibold">{whatsapp.phoneNumber}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{whatsapp.verifiedName}</p>
        </div>

        {/* AI Copilot */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Bot size={14} className="text-violet-600" /> AI Copilot
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-semibold capitalize">
              {aiAgent.tone}
            </span>
          </div>
          <p className="text-xs text-slate-800 font-semibold">{aiAgent.name}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {aiAgent.model} • Escalates at &lt;{aiAgent.handoverThreshold}% confidence
          </p>
        </div>

        {/* Team */}
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Users size={14} className="text-indigo-600" /> Team Seats
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
              {team.length} Ready
            </span>
          </div>
          <div className="flex -space-x-1.5 overflow-hidden py-1">
            {team.map((m) => (
              <div
                key={m.id}
                title={`${m.name} (${m.role})`}
                className="w-7 h-7 rounded-full bg-violet-600 text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white"
              >
                {m.name.slice(0, 2).toUpperCase()}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-500">Auto-assignment rules activated</p>
        </div>
      </div>

      {/* Launch Actions */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          size="lg"
          onClick={startTour}
          className="w-full sm:w-auto shadow-md"
          leftIcon={<Play size={16} className="fill-white" />}
        >
          Start Interactive Product Tour
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={handleGoToTickets}
          className="w-full sm:w-auto"
          leftIcon={<MessageSquare size={16} className="text-emerald-600" />}
        >
          Open Support Queue (Demo Data)
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={handleGoToDashboard}
          className="w-full sm:w-auto"
          leftIcon={<LayoutDashboard size={16} className="text-slate-500" />}
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  )
}
