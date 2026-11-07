import { useState } from 'react'
import {
  User,
  Building,
  Users,
  Smartphone,
  Shield,
  CreditCard,
  Bell,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Plus,
  Trash2,
  Key,
  ExternalLink,
  Lock,
  Mail,
  Zap,
  Globe,
  Clock,
  Sparkles,
  Sun,
  Moon,
  Monitor,
  Palette,
} from 'lucide-react'
import {
  mockWhatsAppState,
  mockTeamMembers,
  mockBillingInfo,
  testWhatsAppWebhookConnection,
  simulateRotateApiSecret,
  type WhatsAppConnectionState,
  type TeamMember,
} from '@/lib/settingsService'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal, ConfirmDialog } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { useTheme } from '@/context/ThemeContext'

type SettingsTab =
  | 'whatsapp'
  | 'profile'
  | 'appearance'
  | 'workspace'
  | 'team'
  | 'channels'
  | 'notifications'
  | 'ai_defaults'
  | 'security'
  | 'billing'

export function SettingsPage() {
  const { toast } = useToast()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [activeTab, setActiveTab] = useState<SettingsTab>('whatsapp')

  // Profile Form States
  const [profileName, setProfileName] = useState('Julian Sterling')
  const [profileEmail, setProfileEmail] = useState('julian@resolutionsupport.ai')
  const [profileRole, setProfileRole] = useState('Workspace Owner')

  // Workspace Settings
  const [wsName, setWsName] = useState('Resolution Global Support')
  const [wsSlug, setWsSlug] = useState('resolution-global')
  const [wsEmail, setWsEmail] = useState('support@resolutionsupport.ai')
  const [wsTimezone, setWsTimezone] = useState('America/Los_Angeles (PST)')
  const [wsHours, setWsHours] = useState('Mon - Fri, 09:00 - 18:00')

  // WhatsApp Connection States
  const [waState, setWaState] = useState<WhatsAppConnectionState>(mockWhatsAppState)
  const [phoneIdInput, setPhoneIdInput] = useState(mockWhatsAppState.phoneNumberId)
  const [tokenInput, setTokenInput] = useState('EAAG...982x_waba_system_token_verified')
  const [webhookUrlInput, setWebhookUrlInput] = useState(mockWhatsAppState.webhookUrl)
  const [isVerifyingWa, setIsVerifyingWa] = useState(false)

  // Team Members
  const [team, setTeam] = useState<TeamMember[]>(mockTeamMembers)
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<TeamMember['role']>('Agent')

  // Security
  const [apiKey, setApiKey] = useState('res_live_7a8b9c0d1e2f3g4h5i6j7k8l9m0')
  const [isRotatingKey, setIsRotatingKey] = useState(false)
  const [confirmRotateModal, setConfirmRotateModal] = useState(false)

  // Notifications toggles
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [waDowntimeAlerts, setWaDowntimeAlerts] = useState(true)
  const [dailyDigest, setDailyDigest] = useState(true)
  const [urgentEscalationSound, setUrgentEscalationSound] = useState(true)

  // AI Defaults
  const [defaultConfidence, setDefaultConfidence] = useState(78)
  const [autoResolveCsat, setAutoResolveCsat] = useState(true)
  const [multilingualDetection, setMultilingualDetection] = useState(true)

  // Handlers
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      type: 'success',
      title: 'Profile Updated',
      description: 'Your account credentials and display name have been saved.',
    })
  }

  const handleSaveWorkspace = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      type: 'success',
      title: 'Workspace Saved',
      description: 'Operating hours, support routing email, and timezone refreshed.',
    })
  }

  const handleTestWhatsApp = async () => {
    setIsVerifyingWa(true)
    const res = await testWhatsAppWebhookConnection(phoneIdInput, tokenInput)
    setIsVerifyingWa(false)
    if (res.success) {
      setWaState((prev) => ({ ...prev, status: 'connected', lastHealthCheck: 'Just now (84ms)' }))
      toast({
        type: 'success',
        title: 'WhatsApp Webhook Verified',
        description: res.message,
      })
    } else {
      toast({
        type: 'error',
        title: 'Connection Failed',
        description: res.message,
      })
    }
  }

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteName.trim() || !inviteEmail.trim()) return

    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      avatar: inviteName.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase(),
      status: 'invited',
      twoFactorEnabled: false,
      lastActive: 'Pending invite',
    }

    setTeam([...team, newMember])
    setInviteModalOpen(false)
    setInviteName('')
    setInviteEmail('')
    toast({
      type: 'success',
      title: 'Team Member Invited',
      description: `Invitation link sent to ${newMember.email}.`,
    })
  }

  const handleRemoveMember = (id: string) => {
    if (team.length <= 1) return
    setTeam((prev) => prev.filter((m) => m.id !== id))
    toast({
      type: 'info',
      title: 'Member Removed',
      description: 'Access revoked from support workspace.',
    })
  }

  const handleRotateKey = async () => {
    setIsRotatingKey(true)
    const { newSecret } = await simulateRotateApiSecret()
    setApiKey(newSecret)
    setIsRotatingKey(false)
    setConfirmRotateModal(false)
    toast({
      type: 'success',
      title: 'API Secret Rotated',
      description: 'Old API tokens have been invalidated immediately.',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Settings & Workspace</h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure Meta WhatsApp Cloud API credentials, theme appearance, team RBAC permissions, security keys, and billing
        </p>
      </div>

      {/* Main Two-Column Settings Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Navigation Tabs (3 cols) */}
        <div className="lg:col-span-3 space-y-1">
          {[
            { id: 'whatsapp', label: 'WhatsApp Cloud API', icon: Smartphone, highlight: true },
            { id: 'appearance', label: 'Appearance & Theme', icon: Palette },
            { id: 'profile', label: 'My Account Profile', icon: User },
            { id: 'workspace', label: 'Workspace & Hours', icon: Building },
            { id: 'team', label: 'Team & RBAC Roles', icon: Users, badge: team.length },
            { id: 'channels', label: 'Channel Routing SLAs', icon: Globe },
            { id: 'ai_defaults', label: 'AI Behavior & Triage', icon: Sliders },
            { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
            { id: 'security', label: 'Security & API Keys', icon: Shield },
            { id: 'billing', label: 'Plans & Invoices', icon: CreditCard },
          ].map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon size={15} />
                  <span>{item.label}</span>
                </div>
                {item.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                )}
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Content Panel (9 cols) */}
        <div className="lg:col-span-9 space-y-5">
          {/* TAB 1: WhatsApp Cloud WABA Connection */}
          {activeTab === 'whatsapp' && (
            <div className="space-y-5">
              {/* Live Connection Status Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-violet-500/10 dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-violet-950/30 border border-emerald-200/80 dark:border-emerald-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center text-lg shadow-xs">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {waState.verifiedName}
                      </h3>
                      <Badge variant="green" dot>
                        Connected & Healthy
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Phone ID: {waState.phoneNumberId} &bull; Display: {waState.displayPhoneNumber}
                    </p>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  size="xs"
                  loading={isVerifyingWa}
                  leftIcon={<RefreshCw size={12} />}
                  onClick={handleTestWhatsApp}
                >
                  Health Check Ping
                </Button>
              </div>

              {/* Meta Credentials Configuration Form */}
              <Card className="p-5">
                <CardHeader
                  title="Meta Cloud API WABA Credentials"
                  subtitle="System user token and webhook routing endpoints"
                />
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Phone Number ID
                    </label>
                    <input
                      type="text"
                      value={phoneIdInput}
                      onChange={(e) => setPhoneIdInput(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Permanent System User Access Token
                    </label>
                    <input
                      type="password"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Webhook Callback URL
                    </label>
                    <input
                      type="text"
                      value={webhookUrlInput}
                      onChange={(e) => setWebhookUrlInput(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-900 dark:text-slate-100 outline-none focus:ring-2 focus:ring-violet-500/20"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">
                      Tier: {waState.messagingLimit} &bull; Quality Rating: {waState.qualityRating}
                    </span>
                    <Button variant="primary" size="xs" onClick={handleTestWhatsApp}>
                      Verify & Save WABA Config
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB: Appearance & Theme */}
          {activeTab === 'appearance' && (
            <Card className="p-5">
              <CardHeader
                title="Appearance & Interface Theme"
                subtitle="Customize interface lighting, color schemes, and accessibility preferences"
              />
              <div className="space-y-6 text-xs mt-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-3">
                    Active Theme Preference (Saved in LocalStorage)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'light', label: 'Light Mode', desc: 'Clean white surfaces with high contrast', icon: Sun },
                      { id: 'dark', label: 'Dark Mode', desc: 'Deep slate palettes easy on the eyes', icon: Moon },
                      { id: 'system', label: 'System Default', desc: 'Syncs with your operating system preference', icon: Monitor },
                    ].map((item) => {
                      const Icon = item.icon
                      const isSelected = theme === item.id
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setTheme(item.id as any)
                            toast({
                              type: 'info',
                              title: `Theme: ${item.label}`,
                              description: `Active interface palette set to ${item.label.toLowerCase()}.`,
                            })
                          }}
                          className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-violet-600 dark:border-violet-500 bg-violet-50/60 dark:bg-violet-950/30 ring-2 ring-violet-500/20'
                              : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className={`p-2 rounded-xl ${isSelected ? 'bg-violet-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                              <Icon size={18} />
                            </div>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-violet-600 dark:bg-violet-400" />
                            )}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">{item.label}</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-violet-600 dark:text-violet-400" />
                      Quick Keyboard Shortcut
                    </span>
                    <kbd className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-600 dark:text-slate-300 shadow-2xs">
                      Alt + T
                    </kbd>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    You can toggle between light and dark modes from anywhere in the application by pressing <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">Alt + T</span> or clicking the sun/moon icon in the top navigation bar.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">Accessibility & Reduced Motion</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    Resolution Support AI automatically honors your operating system's <span className="font-mono text-slate-700 dark:text-slate-300">prefers-reduced-motion</span> setting by disabling non-essential CSS transitions, bounces, and animation loops.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 2: Profile Settings */}
          {activeTab === 'profile' && (
            <Card className="p-5">
              <CardHeader title="Account Profile" subtitle="Your credentials and admin identity" />
              <form onSubmit={handleSaveProfile} className="space-y-4 text-xs max-w-xl">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Role</label>
                  <input
                    type="text"
                    disabled
                    value={profileRole}
                    className="w-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-500 dark:text-slate-400"
                  />
                </div>
                <div className="pt-2">
                  <Button variant="primary" size="xs" type="submit">
                    Save Profile Changes
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* TAB 3: Workspace & Operating Hours */}
          {activeTab === 'workspace' && (
            <Card className="p-5">
              <CardHeader
                title="Workspace Configuration"
                subtitle="Brand identity, timezones, and operating business hours"
              />
              <form onSubmit={handleSaveWorkspace} className="space-y-4 text-xs max-w-xl">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Workspace Name
                  </label>
                  <input
                    type="text"
                    value={wsName}
                    onChange={(e) => setWsName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Support Routing Email
                  </label>
                  <input
                    type="email"
                    value={wsEmail}
                    onChange={(e) => setWsEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Operating Hours
                  </label>
                  <input
                    type="text"
                    value={wsHours}
                    onChange={(e) => setWsHours(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div className="pt-2">
                  <Button variant="primary" size="xs" type="submit">
                    Save Workspace Settings
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* TAB 4: Team Members & RBAC */}
          {activeTab === 'team' && (
            <Card className="p-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Support Team Members</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    RBAC roles: Admin, Manager, Agent, and AI Trainer
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="xs"
                  leftIcon={<Plus size={13} />}
                  onClick={() => setInviteModalOpen(true)}
                >
                  Invite Specialist
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-left text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase">
                      <th className="pb-3">Specialist</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">2FA</th>
                      <th className="pb-3">Last Active</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {team.map((member) => (
                      <tr key={member.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-violet-600 text-white font-bold flex items-center justify-center text-[11px]">
                              {member.avatar}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 dark:text-slate-100">{member.name}</p>
                              <p className="text-[11px] text-slate-400 dark:text-slate-500">{member.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{member.role}</span>
                        </td>
                        <td className="py-3">
                          <Badge variant={member.status === 'active' ? 'green' : 'yellow'} dot>
                            {member.status}
                          </Badge>
                        </td>
                        <td className="py-3">
                          {member.twoFactorEnabled ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 size={12} /> Enabled
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500">Disabled</span>
                          )}
                        </td>
                        <td className="py-3 text-slate-500 dark:text-slate-400">{member.lastActive}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleRemoveMember(member.id)}
                            className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Remove member"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* TAB 5: Channel Routing SLAs */}
          {activeTab === 'channels' && (
            <Card className="p-5">
              <CardHeader
                title="Channel Routing & SLA Thresholds"
                subtitle="Configure response limits per communication touchpoint"
              />
              <div className="space-y-4 text-xs">
                {[
                  { channel: 'WhatsApp Cloud API', sla: '2 Minutes', defaultAgent: 'Alex Rivera' },
                  { channel: 'Web Live Chat', sla: '5 Minutes', defaultAgent: 'Sarah Chen' },
                  { channel: 'Email Queue', sla: '60 Minutes', defaultAgent: 'Marcus Obi' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100">{item.channel}</h4>
                      <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                        Target First Response SLA: <strong className="text-violet-700 dark:text-violet-400">{item.sla}</strong>
                      </p>
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                      Default: {item.defaultAgent}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* TAB 6: Notifications & Alerts */}
          {activeTab === 'notifications' && (
            <Card className="p-5">
              <CardHeader title="Alert Preferences" subtitle="When and how agents get notified" />
              <div className="space-y-3 text-xs">
                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 cursor-pointer">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">WhatsApp Webhook Outage Alerts</p>
                    <p className="text-slate-500 dark:text-slate-400">Send immediate SMS and Email if Meta API fails</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={waDowntimeAlerts}
                    onChange={(e) => setWaDowntimeAlerts(e.target.checked)}
                    className="accent-violet-600 w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 cursor-pointer">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">Urgent Ticket Escalation Chime</p>
                    <p className="text-slate-500 dark:text-slate-400">Play audio ping when urgent priority tickets land</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={urgentEscalationSound}
                    onChange={(e) => setUrgentEscalationSound(e.target.checked)}
                    className="accent-violet-600 w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 cursor-pointer">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">Daily Executive Resolution Digest</p>
                    <p className="text-slate-500 dark:text-slate-400">Email daily metrics summary at 8:00 AM</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={dailyDigest}
                    onChange={(e) => setDailyDigest(e.target.checked)}
                    className="accent-violet-600 w-4 h-4"
                  />
                </label>
              </div>
            </Card>
          )}

          {/* TAB 7: AI Behavior & Triage Defaults */}
          {activeTab === 'ai_defaults' && (
            <Card className="p-5">
              <CardHeader
                title="Global AI Governance"
                subtitle="Baseline safety filters and language detection"
              />
              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-slate-800 dark:text-slate-200">Default Global Confidence Cutoff</span>
                    <span className="text-violet-700 dark:text-violet-400">{defaultConfidence}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="95"
                    value={defaultConfidence}
                    onChange={(e) => setDefaultConfidence(Number(e.target.value))}
                    className="w-full accent-violet-600 cursor-pointer"
                  />
                </div>

                <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 cursor-pointer">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-slate-100">Automatic Multilingual NLP Detection</p>
                    <p className="text-slate-500 dark:text-slate-400">Auto-detect customer language and respond in-kind</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={multilingualDetection}
                    onChange={(e) => setMultilingualDetection(e.target.checked)}
                    className="accent-violet-600 w-4 h-4"
                  />
                </label>
              </div>
            </Card>
          )}

          {/* TAB 8: Security & API Keys */}
          {activeTab === 'security' && (
            <Card className="p-5">
              <CardHeader
                title="Security & API Credentials"
                subtitle="Private API secret key for programmatic webhook calls"
              />
              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                    Live API Secret Key
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      readOnly
                      value={apiKey}
                      className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-mono text-xs text-slate-800 dark:text-slate-200"
                    />
                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => setConfirmRotateModal(true)}
                    >
                      Rotate Key
                    </Button>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-violet-50/60 dark:bg-violet-950/20 border border-violet-100 dark:border-violet-900/50 text-slate-700 dark:text-slate-300 space-y-1">
                  <p className="font-bold text-violet-900 dark:text-violet-300">Enforce Mandatory 2FA</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Require TOTP authenticator app verification for all admin and specialist logins.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 9: Plans & Invoices */}
          {activeTab === 'billing' && (
            <div className="space-y-4">
              <Card className="p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{mockBillingInfo.tier}</h3>
                      <Badge variant="violet">{mockBillingInfo.billingCycle}</Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Next renewal on {mockBillingInfo.nextBillingDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-slate-900 dark:text-slate-100">{mockBillingInfo.amount}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 text-xs">
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-medium">
                      Licensed Seats
                    </span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1 block">
                      {mockBillingInfo.seatsUsed} / {mockBillingInfo.seatsTotal} Active
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block uppercase font-medium">
                      WhatsApp Quota
                    </span>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
                      {mockBillingInfo.monthlyMessagesUsed.toLocaleString()} /{' '}
                      {mockBillingInfo.monthlyMessagesTotal.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Invoices Table */}
              <Card className="p-5">
                <CardHeader title="Recent Invoices" subtitle="Receipts and payment history" />
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-left text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase">
                      <th className="pb-3">Invoice</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">PDF</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {mockBillingInfo.invoices.map((inv) => (
                      <tr key={inv.id}>
                        <td className="py-2.5 font-bold text-slate-900 dark:text-slate-100">{inv.id}</td>
                        <td className="py-2.5 text-slate-500 dark:text-slate-400">{inv.date}</td>
                        <td className="py-2.5 font-bold text-slate-800 dark:text-slate-200">{inv.amount}</td>
                        <td className="py-2.5">
                          <Badge variant="green" dot>
                            {inv.status}
                          </Badge>
                        </td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={() =>
                              toast({
                                type: 'success',
                                title: 'Invoice Downloaded',
                                description: `Receipt for ${inv.id} generated.`,
                              })
                            }
                            className="text-violet-600 dark:text-violet-400 font-semibold hover:text-violet-800 dark:hover:text-violet-300"
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* ─── Invite Member Modal ─────────────────────────────────────────────── */}
      <Modal
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite Support Specialist"
        subtitle="Grant workspace credentials and configure role permissions"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleInviteMember}>
              Send Invitation
            </Button>
          </>
        }
      >
        <form onSubmit={handleInviteMember} className="space-y-3 text-xs">
          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Full Name</label>
            <input
              type="text"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              placeholder="e.g. Carlos Gomez"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Work Email Address
            </label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="carlos@company.com"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500/20"
            />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">Role</label>
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as any)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-violet-500/20"
            >
              <option value="Agent">Support Agent</option>
              <option value="Manager">Support Manager</option>
              <option value="AI Trainer">AI Copilot Trainer</option>
              <option value="Admin">Administrator</option>
              <option value="Viewer">Read-Only Viewer</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* ─── Confirm Rotate Secret Dialog ────────────────────────────────────── */}
      <ConfirmDialog
        open={confirmRotateModal}
        onClose={() => setConfirmRotateModal(false)}
        onConfirm={handleRotateKey}
        title="Rotate API Secret Key?"
        description="Rotating your secret key will immediately invalidate current integration tokens. Any external backend services using the old token will experience authentication failures until updated."
        confirmLabel="Rotate & Invalidate"
        variant="danger"
        loading={isRotatingKey}
      />
    </div>
  )
}
