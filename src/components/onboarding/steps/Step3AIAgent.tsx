import { useState } from 'react'
import {
  Bot,
  Sparkles,
  Sliders,
  CheckCircle2,
  FileText,
  SlidersHorizontal,
  Send,
} from 'lucide-react'
import { AIAgentSetupIllustration } from '../OnboardingIllustrations'
import { Input, FormGroup, Label, Textarea } from '@/components/ui/FormControls'
import { InfoTooltip } from '@/components/ui/Tooltip'
import { useOnboarding } from '@/context/OnboardingContext'

const tonePresets = [
  {
    id: 'empathetic',
    title: 'Empathetic & Warm',
    badge: 'Recommended for E-Commerce',
    preview:
      '“I completely understand how stressful a delivery delay can be, Sarah! Let me check the courier dispatch for you immediately.”',
  },
  {
    id: 'professional',
    title: 'Professional & Crisp',
    badge: 'Ideal for B2B & Finance',
    preview:
      '“Good morning. Your order #9821-X has cleared customs and is scheduled for courier delivery today by 14:00.”',
  },
  {
    id: 'casual',
    title: 'Casual & Friendly',
    badge: 'Great for Direct-to-Consumer',
    preview:
      '“Hey Sarah! 📦 Got your order pulled up right now. Tracking shows it will be at your doorstep in just a couple hours!”',
  },
  {
    id: 'concise',
    title: 'Concise & Technical',
    badge: 'High-speed operations',
    preview:
      '“Order #9821-X: Malpensa DHL Hub -> Van #41. Status: Out for delivery. ETA: 13:00 - 14:30.”',
  },
]

const availableKnowledgeDocs = [
  { id: 'kb-1', name: 'Returns & Refund Policy (30-day window)', size: '24 KB' },
  { id: 'kb-2', name: 'DHL / FedEx Live Courier Tracking Guidelines', size: '18 KB' },
  { id: 'kb-3', name: 'Warranty Terms & Damaged In Transit Protocol', size: '32 KB' },
  { id: 'kb-4', name: 'WhatsApp Billing, Invoice PDF & Payment Queries', size: '15 KB' },
]

export function Step3AIAgent() {
  const { state, updateAIAgent } = useOnboarding()
  const { aiAgent } = state

  const toggleKnowledge = (docName: string) => {
    const current = aiAgent.preloadedKnowledge
    const next = current.includes(docName)
      ? current.filter((k) => k !== docName)
      : [...current, docName]
    updateAIAgent({ preloadedKnowledge: next })
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto py-2">
      {/* Header with illustration */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-gradient-to-r from-violet-50/70 via-purple-50/40 to-white border border-violet-100">
        <AIAgentSetupIllustration className="shrink-0" />
        <div className="text-left space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[11px] font-semibold">
            Step 3 of 4 • AI Copilot Tuning
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Tune your AI Support Copilot
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Personalize your copilot name, brand conversational tone, handoff confidence triggers, and knowledge base.
          </p>
        </div>
      </div>

      {/* Main Agent Settings Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 text-left">
        {/* Agent Name & LLM Engine Model */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormGroup>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Label htmlFor="agentName">AI Copilot Name</Label>
              <InfoTooltip content="Identifies your AI agent internally and on customer WhatsApp intro cards." />
            </div>
            <Input
              id="agentName"
              value={aiAgent.name}
              onChange={(e) => updateAIAgent({ name: e.target.value })}
              placeholder="e.g. Resolution Support Copilot"
              required
            />
          </FormGroup>

          <FormGroup>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Label htmlFor="aiModel">Underlying AI Engine</Label>
              <InfoTooltip content="Resolution Native-70B offers ultra-low latency & zero hallucinations on WhatsApp customer orders." />
            </div>
            <select
              id="aiModel"
              value={aiAgent.model}
              onChange={(e) => updateAIAgent({ model: e.target.value as any })}
              className="input-base"
            >
              <option value="Resolution Native-70B">Resolution Native-70B (Fastest & Accurate)</option>
              <option value="GPT-4o Omnichannel">GPT-4o Omnichannel</option>
              <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
            </select>
          </FormGroup>
        </div>

        {/* Tone Selection Cards */}
        <div>
          <div className="flex items-center gap-1.5 mb-2.5">
            <Label>Brand Tone & Persona</Label>
            <InfoTooltip content="Select how the AI phrases greetings, apologies, and order tracking responses." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tonePresets.map((tone) => {
              const isSelected = aiAgent.tone === tone.id
              return (
                <div
                  key={tone.id}
                  onClick={() => updateAIAgent({ tone: tone.id as any })}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-violet-600 bg-violet-50/70 shadow-xs ring-1 ring-violet-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{tone.title}</span>
                    {isSelected && <CheckCircle2 size={14} className="text-violet-600 shrink-0" />}
                  </div>
                  <span className="inline-block text-[10px] font-semibold text-violet-700 bg-violet-100/70 px-1.5 py-0.5 rounded mb-2">
                    {tone.badge}
                  </span>
                  <p className="text-[11px] text-slate-600 italic leading-snug">
                    {tone.preview}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Handover Confidence Threshold Slider */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <Label htmlFor="threshold">Human Handover Confidence Threshold</Label>
              <InfoTooltip content="If the AI confidence score drops below this threshold, the ticket automatically pauses auto-reply and alerts human agents with full context." />
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
              {aiAgent.handoverThreshold}%
            </span>
          </div>

          <input
            id="threshold"
            type="range"
            min={50}
            max={95}
            step={5}
            value={aiAgent.handoverThreshold}
            onChange={(e) => updateAIAgent({ handoverThreshold: Number(e.target.value) })}
            className="w-full accent-violet-600 cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>50% (More Autonomous)</span>
            <span className="text-violet-600 font-semibold">Recommended: 75%</span>
            <span>95% (Frequent Escalations)</span>
          </div>
        </div>

        {/* Live WhatsApp Greeting Bubble Preview */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 mb-2">
            <Label htmlFor="greeting">Automated WhatsApp Welcome Greeting</Label>
            <InfoTooltip content="The first message sent when a customer initiates contact with your WhatsApp business number." />
          </div>

          <Textarea
            id="greeting"
            rows={2}
            value={aiAgent.greetingMessage}
            onChange={(e) => updateAIAgent({ greetingMessage: e.target.value })}
            placeholder="Type greeting message..."
            className="text-xs"
          />

          {/* Interactive Chat bubble visual */}
          <div className="mt-3 p-3 rounded-xl bg-slate-900/5 border border-slate-200/80">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Live WhatsApp Customer View Preview:
            </div>
            <div className="max-w-md bg-[#005c4b] text-[#e9edef] p-3 rounded-2xl rounded-tr-xs shadow-sm text-xs leading-relaxed">
              <div className="font-semibold text-emerald-300 text-[11px] flex items-center gap-1 mb-1">
                <Sparkles size={11} /> {aiAgent.name}
              </div>
              <p>{aiAgent.greetingMessage}</p>
              <div className="text-right text-[10px] text-emerald-200/70 mt-1">
                10:45 AM • ✓✓
              </div>
            </div>
          </div>
        </div>

        {/* Preloaded Knowledge Base Seed */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 mb-2">
            <Label>Pre-seed AI Knowledge Base</Label>
            <InfoTooltip content="Selected documentation will be indexed into vector embeddings for instant query resolution." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {availableKnowledgeDocs.map((doc) => {
              const isChecked = aiAgent.preloadedKnowledge.includes(doc.name)
              return (
                <label
                  key={doc.id}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isChecked
                      ? 'border-violet-300 bg-violet-50/50 text-slate-900'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleKnowledge(doc.name)}
                    className="accent-violet-600 rounded"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{doc.name}</p>
                    <span className="text-[10px] text-slate-400">{doc.size}</span>
                  </div>
                </label>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
