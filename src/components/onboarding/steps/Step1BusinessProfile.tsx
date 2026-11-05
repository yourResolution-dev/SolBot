import { useState } from 'react'
import { Building2, Globe, Mail, Clock, CheckCircle2 } from 'lucide-react'
import { BusinessProfileIllustration } from '../OnboardingIllustrations'
import { Input, Select, FormGroup, Label } from '@/components/ui/FormControls'
import { InfoTooltip } from '@/components/ui/Tooltip'
import { useOnboarding } from '@/context/OnboardingContext'

const industries = [
  'E-Commerce & Omnichannel Retail',
  'SaaS & Software Technology',
  'Logistics & Express Courier',
  'Travel, Airlines & Hospitality',
  'Healthcare & Telemedicine',
  'Financial Services & Fintech',
  'Consumer Electronics & Hardware',
]

const languages = [
  'English (US)',
  'English (UK)',
  'Spanish (Español)',
  'Portuguese (Português)',
  'German (Deutsch)',
  'French (Français)',
  'Italian (Italiano)',
  'Hindi (हिन्दी)',
  'Arabic (العربية)',
]

const timezones = [
  'America/New_York (UTC-5)',
  'America/Los_Angeles (UTC-8)',
  'America/Chicago (UTC-6)',
  'Europe/London (UTC+0)',
  'Europe/Berlin (UTC+1)',
  'Europe/Paris (UTC+1)',
  'Asia/Dubai (UTC+4)',
  'Asia/Kolkata (UTC+5:30)',
  'Asia/Singapore (UTC+8)',
  'Asia/Tokyo (UTC+9)',
  'Australia/Sydney (UTC+11)',
]

export function Step1BusinessProfile() {
  const { state, updateWorkspace } = useOnboarding()
  const { workspace } = state

  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
    updateWorkspace({ companyName: name, subdomain: slug || 'my-workspace' })
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto py-2">
      {/* Header with illustration */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-gradient-to-r from-violet-50/70 via-indigo-50/40 to-white border border-violet-100">
        <BusinessProfileIllustration className="shrink-0" />
        <div className="text-left space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700 text-[11px] font-semibold">
            Step 1 of 4 • Workspace Foundation
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Configure your Business Profile
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            These details calibrate your support domain, brand voice, and WhatsApp response time SLAs.
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 text-left">
        {/* Workspace Name & Subdomain */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormGroup>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Label htmlFor="companyName">Workspace / Company Name</Label>
              <InfoTooltip content="Your public company brand name shown on customer WhatsApp chats and email receipts." />
            </div>
            <Input
              id="companyName"
              placeholder="e.g. Acme Retail & Co."
              value={workspace.companyName}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
          </FormGroup>

          <FormGroup>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Label htmlFor="subdomain">Resolution Subdomain</Label>
              <InfoTooltip content="Your dedicated cloud agent endpoint where webhooks, team invites, and agent portals route." />
            </div>
            <div className="relative">
              <Input
                id="subdomain"
                placeholder="acme-retail"
                value={workspace.subdomain}
                onChange={(e) => updateWorkspace({ subdomain: e.target.value })}
                className="pr-40 font-mono text-xs"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 pointer-events-none">
                .resolutionsupport.ai
              </span>
            </div>
          </FormGroup>
        </div>

        {/* Industry Vertical & Support Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormGroup>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Label htmlFor="industry">Industry Vertical</Label>
              <InfoTooltip content="Pre-tunes the AI prompt embeddings and automated triage categories for your domain." />
            </div>
            <Select
              id="industry"
              value={workspace.industry}
              onChange={(e) => updateWorkspace({ industry: e.target.value })}
            >
              {industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Label htmlFor="supportEmail">Primary Support Email</Label>
              <InfoTooltip content="Used for ticket escalation notices, courier fallback notifications, and weekly CSAT summaries." />
            </div>
            <Input
              id="supportEmail"
              type="email"
              placeholder="support@company.com"
              value={workspace.supportEmail}
              onChange={(e) => updateWorkspace({ supportEmail: e.target.value })}
              required
            />
          </FormGroup>
        </div>

        {/* Language & Timezone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormGroup>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Label htmlFor="language">Primary Workspace Language</Label>
              <InfoTooltip content="Default language for system greetings, canned actions, and agent notifications. AI will automatically reply in whatever language customer messages in." />
            </div>
            <Select
              id="language"
              value={workspace.language}
              onChange={(e) => updateWorkspace({ language: e.target.value })}
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </Select>
          </FormGroup>

          <FormGroup>
            <div className="flex items-center gap-1.5 mb-1.5">
              <Label htmlFor="timezone">Operational Timezone</Label>
              <InfoTooltip content="Used to calculate first-response SLAs and trigger off-hours automated triage." />
            </div>
            <Select
              id="timezone"
              value={workspace.timezone}
              onChange={(e) => updateWorkspace({ timezone: e.target.value })}
            >
              {timezones.map((tz) => (
                <option key={tz} value={tz}>
                  {tz}
                </option>
              ))}
            </Select>
          </FormGroup>
        </div>

        {/* Support Operating Hours */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 mb-2.5">
            <Label>Operating Schedule & SLA Window</Label>
            <InfoTooltip content="When your human agents are actively staffing the queue. Outside these hours, AI Copilot handles 100% of tickets with off-hours disclaimers." />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: '24_7',
                title: '24/7 Round-the-Clock',
                desc: 'Continuous AI copilot & rotating agent shifts for global coverage.',
              },
              {
                id: 'business_hours',
                title: 'Business Hours (9-6)',
                desc: 'Mon - Fri, 09:00 - 18:00 local time. AI off-hours triage outside.',
              },
              {
                id: 'extended',
                title: 'Extended Shifts',
                desc: 'Mon - Sat, 08:00 - 22:00. Fast weekend priority queueing.',
              },
            ].map((schedule) => {
              const isSelected = workspace.supportHours === schedule.id
              return (
                <div
                  key={schedule.id}
                  onClick={() => updateWorkspace({ supportHours: schedule.id as any })}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'border-violet-600 bg-violet-50/70 shadow-xs ring-1 ring-violet-500'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">{schedule.title}</span>
                    {isSelected && <CheckCircle2 size={14} className="text-violet-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">{schedule.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
