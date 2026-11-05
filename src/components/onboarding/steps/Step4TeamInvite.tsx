import { useState } from 'react'
import {
  Users,
  UserPlus,
  Mail,
  Shield,
  Trash2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import { TeamInviteIllustration } from '../OnboardingIllustrations'
import { Input, Select, FormGroup, Label } from '@/components/ui/FormControls'
import { Button } from '@/components/ui/Button'
import { InfoTooltip } from '@/components/ui/Tooltip'
import { useOnboarding } from '@/context/OnboardingContext'
import { useToast } from '@/components/ui/Toast'

type RoleType = 'Admin' | 'Manager' | 'Agent' | 'AI Trainer' | 'Viewer'

const rolePermissions: Record<RoleType, string> = {
  Admin: 'Full access to WABA tokens, billing, team management, and AI models.',
  Manager: 'Queue SLA triage, agent re-assignments, CSAT reports, and audit logs.',
  Agent: 'Live WhatsApp ticket chat, human takeover, customer notes, and RMA creation.',
  'AI Trainer': 'Knowledge base documents, prompt fine-tuning, and confidence evals.',
  Viewer: 'Read-only access to analytics dashboards, CSAT scores, and queue metrics.',
}

export function Step4TeamInvite() {
  const { state, addTeamMember, removeTeamMember } = useOnboarding()
  const { team } = state
  const { toast } = useToast()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<RoleType>('Agent')

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) {
      toast({
        type: 'error',
        title: 'Missing information',
        description: 'Please provide both team member name and work email.',
      })
      return
    }

    addTeamMember({ name, email, role })
    setName('')
    setEmail('')
    setRole('Agent')

    toast({
      type: 'success',
      title: 'Invite Queued',
      description: `Invitation link dispatched to ${email}.`,
    })
  }

  const handleQuickAdd = (sampleName: string, sampleEmail: string, sampleRole: RoleType) => {
    addTeamMember({ name: sampleName, email: sampleEmail, role: sampleRole })
    toast({
      type: 'success',
      title: 'Member Added',
      description: `${sampleName} added as ${sampleRole}.`,
    })
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl mx-auto py-2">
      {/* Header with illustration */}
      <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-50/70 via-blue-50/40 to-white border border-indigo-100">
        <TeamInviteIllustration className="shrink-0" />
        <div className="text-left space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[11px] font-semibold">
            Step 4 of 4 • Team Onboarding
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Invite your Support Team
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Collaborate on tickets with intelligent auto-assignment, role-based controls, and human copilot takeover.
          </p>
        </div>
      </div>

      {/* Main Invite Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 text-left">
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormGroup>
              <Label htmlFor="memberName">Full Name</Label>
              <Input
                id="memberName"
                placeholder="e.g. Alex Rivera"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="memberEmail">Work Email</Label>
              <Input
                id="memberEmail"
                type="email"
                placeholder="alex@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Label htmlFor="memberRole">Role</Label>
                <InfoTooltip content={rolePermissions[role]} />
              </div>
              <Select
                id="memberRole"
                value={role}
                onChange={(e) => setRole(e.target.value as RoleType)}
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Agent">Agent</option>
                <option value="AI Trainer">AI Trainer</option>
                <option value="Viewer">Viewer</option>
              </Select>
            </FormGroup>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
            {/* Quick-add suggestions */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-slate-400 font-medium">Quick add:</span>
              <button
                type="button"
                onClick={() =>
                  handleQuickAdd('Sarah Connor', 'sarah.c@company.com', 'Manager')
                }
                className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                + Support Lead
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickAdd('Carlos Mendez', 'carlos.m@company.com', 'Agent')
                }
                className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                + Tier-1 Agent
              </button>
              <button
                type="button"
                onClick={() =>
                  handleQuickAdd('Dr. Maya Patel', 'maya.p@company.com', 'AI Trainer')
                }
                className="px-2 py-1 text-[11px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                + AI Trainer
              </button>
            </div>

            <Button
              type="submit"
              size="sm"
              leftIcon={<UserPlus size={14} />}
              className="w-full sm:w-auto"
            >
              Add Teammate
            </Button>
          </div>
        </form>

        {/* Invited List */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Users size={14} className="text-violet-600" />
              Workspace Team ({team.length})
            </h4>
            <span className="text-[11px] text-slate-400">
              Invitations will be dispatched via email
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
            {team.map((member) => (
              <div
                key={member.id}
                className="py-2.5 flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                    {member.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-slate-800 truncate">
                        {member.name}
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          member.role === 'Admin'
                            ? 'bg-purple-100 text-purple-700'
                            : member.role === 'Manager'
                            ? 'bg-blue-100 text-blue-700'
                            : member.role === 'AI Trainer'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {member.role}
                      </span>
                    </div>
                    <span className="text-slate-400 text-[11px] truncate block">
                      {member.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-emerald-600 font-medium">
                    {member.status === 'active' ? 'Active' : 'Invited'}
                  </span>
                  {member.role !== 'Admin' && (
                    <button
                      type="button"
                      onClick={() => removeTeamMember(member.id)}
                      className="text-slate-400 hover:text-red-500 p-1 rounded transition-colors"
                      title="Remove teammate"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
