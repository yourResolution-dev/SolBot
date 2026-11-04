// ─── Service Layer for External Integrations & WhatsApp Cloud WABA ──────────

export interface WhatsAppConnectionState {
  status: 'connected' | 'disconnected' | 'verifying' | 'rate_limited'
  phoneNumberId: string
  wabaAccountId: string
  displayPhoneNumber: string
  verifiedName: string
  qualityRating: 'GREEN' | 'YELLOW' | 'RED'
  messagingLimit: string
  webhookUrl: string
  verifyToken: string
  appId: string
  lastHealthCheck: string
  dailyUsage: {
    sent: number
    limit: number
  }
}

export interface WorkspaceSettingsState {
  workspaceName: string
  workspaceSlug: string
  supportEmail: string
  timezone: string
  operatingHours: string
  defaultLanguage: string
  fallbackAgentId: string
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Manager' | 'Agent' | 'AI Trainer' | 'Viewer'
  avatar: string
  status: 'active' | 'invited' | 'suspended'
  twoFactorEnabled: boolean
  lastActive: string
}

export interface ChannelConfig {
  id: 'whatsapp' | 'email' | 'webchat'
  name: string
  enabled: boolean
  autoAssignment: boolean
  responseSlaMinutes: number
  businessHoursOnly: boolean
}

export interface BillingPlanInfo {
  tier: 'Enterprise Suite' | 'Growth Plan' | 'Starter'
  billingCycle: string
  amount: string
  nextBillingDate: string
  seatsUsed: number
  seatsTotal: number
  monthlyMessagesUsed: number
  monthlyMessagesTotal: number
  paymentMethod: {
    brand: string
    last4: string
    exp: string
  }
  invoices: {
    id: string
    date: string
    amount: string
    status: 'Paid' | 'Processing'
    pdfUrl: string
  }[]
}

// In-memory mock storage
export const mockWhatsAppState: WhatsAppConnectionState = {
  status: 'connected',
  phoneNumberId: '109482710394829',
  wabaAccountId: '920184918204918',
  displayPhoneNumber: '+1 (555) 019-9201',
  verifiedName: 'Resolution Support Official',
  qualityRating: 'GREEN',
  messagingLimit: '100k business-initiated conversations / 24h',
  webhookUrl: 'https://api.resolutionsupport.ai/v1/webhooks/whatsapp',
  verifyToken: 'res_secret_verify_token_2026',
  appId: '9840192840192',
  lastHealthCheck: 'Just now (0ms latency)',
  dailyUsage: {
    sent: 14820,
    limit: 100000,
  },
}

export const mockTeamMembers: TeamMember[] = [
  { id: 'tm-1', name: 'Julian Sterling', email: 'julian@resolutionsupport.ai', role: 'Admin', avatar: 'JS', status: 'active', twoFactorEnabled: true, lastActive: 'Online now' },
  { id: 'tm-2', name: 'Alex Rivera', email: 'alex@resolutionsupport.ai', role: 'Agent', avatar: 'AR', status: 'active', twoFactorEnabled: true, lastActive: '10m ago' },
  { id: 'tm-3', name: 'Sarah Chen', email: 'sarah@resolutionsupport.ai', role: 'Manager', avatar: 'SC', status: 'active', twoFactorEnabled: true, lastActive: '32m ago' },
  { id: 'tm-4', name: 'Marcus Obi', email: 'marcus@resolutionsupport.ai', role: 'Agent', avatar: 'MO', status: 'active', twoFactorEnabled: false, lastActive: '2h ago' },
  { id: 'tm-5', name: 'Fatima Al-Rashid', email: 'fatima@resolutionsupport.ai', role: 'AI Trainer', avatar: 'FA', status: 'active', twoFactorEnabled: true, lastActive: 'Yesterday' },
  { id: 'tm-6', name: 'David Vance', email: 'david@investorgroup.com', role: 'Viewer', avatar: 'DV', status: 'invited', twoFactorEnabled: false, lastActive: 'Never' },
]

export const mockBillingInfo: BillingPlanInfo = {
  tier: 'Enterprise Suite',
  billingCycle: 'Annual (20% off applied)',
  amount: '$1,290.00 / month',
  nextBillingDate: 'Dec 01, 2026',
  seatsUsed: 6,
  seatsTotal: 15,
  monthlyMessagesUsed: 54890,
  monthlyMessagesTotal: 250000,
  paymentMethod: {
    brand: 'Mastercard',
    last4: '9821',
    exp: '08/29',
  },
  invoices: [
    { id: 'INV-2026-11', date: 'Nov 01, 2026', amount: '$1,290.00', status: 'Paid', pdfUrl: '#' },
    { id: 'INV-2026-10', date: 'Oct 01, 2026', amount: '$1,290.00', status: 'Paid', pdfUrl: '#' },
    { id: 'INV-2026-09', date: 'Sep 01, 2026', amount: '$1,290.00', status: 'Paid', pdfUrl: '#' },
  ],
}

// ─── Service Simulation Layer ────────────────────────────────────────────────

export async function testWhatsAppWebhookConnection(phoneId: string, token: string): Promise<{ success: boolean; latencyMs: number; message: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!phoneId || phoneId.length < 5) {
        resolve({ success: false, latencyMs: 0, message: 'Invalid Meta Phone Number ID.' })
      } else {
        resolve({ success: true, latencyMs: 84, message: 'Meta Cloud API responded with HTTP 200 (Webhook Active).' })
      }
    }, 750)
  })
}

export async function simulateRotateApiSecret(): Promise<{ newSecret: string }> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ newSecret: `res_live_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}` })
    }, 600)
  })
}
