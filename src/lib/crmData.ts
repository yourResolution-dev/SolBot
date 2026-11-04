// ─── Extended Sample Data for Customer CRM & Contact Directory ──────────────

export type CustomerSegmentKey = 'all' | 'vip' | 'at_risk' | 'enterprise' | 'whatsapp_frequent' | 'new'

export interface CustomerSegment {
  id: CustomerSegmentKey
  name: string
  description: string
  badgeColor: string
  count: number
}

export interface CustomerTimelineEvent {
  id: string
  type: 'whatsapp' | 'email' | 'chat' | 'order' | 'note' | 'handover'
  title: string
  description: string
  timestamp: string
  author?: string
}

export interface CustomerCustomField {
  key: string
  label: string
  value: string
}

export interface ContactRecord {
  id: string
  name: string
  email: string
  phone: string
  company: string
  location: string
  avatarInitials: string
  avatarGradient: string
  tier: 'Enterprise' | 'Growth' | 'Starter'
  status: 'active' | 'inactive' | 'lead'
  segment: CustomerSegmentKey
  tags: string[]
  lifetimeValue: string
  ordersCount: number
  satisfactionScore: number
  lastContactDate: string
  lastContactChannel: 'whatsapp' | 'email' | 'chat'
  joinedDate: string
  assignedSpecialist: string
  customFields: CustomerCustomField[]
  timeline: CustomerTimelineEvent[]
  notes: string[]
}

export const initialSegments: CustomerSegment[] = [
  { id: 'all', name: 'All Contacts', description: 'Complete directory of customer profiles', badgeColor: 'bg-slate-100 text-slate-700', count: 6 },
  { id: 'vip', name: 'VIP Buyers', description: 'LTV > $10,000 with wholesale privileges', badgeColor: 'bg-violet-100 text-violet-700', count: 2 },
  { id: 'enterprise', name: 'Enterprise Accounts', description: 'Contracted high-volume SLA tiers', badgeColor: 'bg-indigo-100 text-indigo-700', count: 2 },
  { id: 'whatsapp_frequent', name: 'WhatsApp Frequent', description: 'Over 80% conversation volume on WhatsApp Cloud', badgeColor: 'bg-emerald-100 text-emerald-700', count: 4 },
  { id: 'at_risk', name: 'At Risk', description: 'CSAT < 4.0 or unresolved billing discrepancies', badgeColor: 'bg-red-100 text-red-700', count: 1 },
]

export const initialContacts: ContactRecord[] = [
  {
    id: 'CUST-001',
    name: 'Priya Sharma',
    email: 'priya@sharmafashion.in',
    phone: '+91 98765 43210',
    company: 'Sharma Couture Group',
    location: 'Mumbai, India',
    avatarInitials: 'PS',
    avatarGradient: 'from-violet-600 to-indigo-600',
    tier: 'Enterprise',
    status: 'active',
    segment: 'vip',
    tags: ['VIP Client', 'WhatsApp Preferred', 'Wholesale Buyer'],
    lifetimeValue: '$18,400',
    ordersCount: 14,
    satisfactionScore: 4.8,
    lastContactDate: '2026-11-04T18:12:00Z',
    lastContactChannel: 'whatsapp',
    joinedDate: 'Jan 15, 2025',
    assignedSpecialist: 'Alex Rivera',
    customFields: [
      { key: 'tax_id', label: 'GSTIN / VAT', value: '27AAAAA0000A1Z5' },
      { key: 'preferred_language', label: 'Preferred Language', value: 'English / Hindi' },
      { key: 'courier_service', label: 'Preferred Courier', value: 'DHL Express Air' },
    ],
    timeline: [
      { id: 't-1', type: 'whatsapp', title: 'Inquired about Order #SC-99201', description: 'Customer tracked DHL shipment status via WhatsApp bot.', timestamp: 'Nov 04, 2026 6:12 PM' },
      { id: 't-2', type: 'order', title: 'Wholesale Order #SC-99201 Placed', description: '25 Silk Embroidered Kaftans ($1,850.00)', timestamp: 'Nov 02, 2026 10:15 AM' },
      { id: 't-3', type: 'note', title: 'Internal Account Note Added', description: 'Priya requested Diwali delivery fast-tracking.', timestamp: 'Oct 30, 2026 4:00 PM', author: 'Alex Rivera' },
    ],
    notes: [
      'Preferred contact channel is strictly WhatsApp Business API.',
      'Always confirm sample swatches before dispatching bulk wholesale orders.',
    ],
  },
  {
    id: 'CUST-002',
    name: 'Daniel Koch',
    email: 'd.koch@nexusinvest.de',
    phone: '+49 30 12345678',
    company: 'Nexus Finance GmbH',
    location: 'Berlin, Germany',
    avatarInitials: 'DK',
    avatarGradient: 'from-blue-600 to-cyan-600',
    tier: 'Growth',
    status: 'active',
    segment: 'at_risk',
    tags: ['Billing Query', 'GDPR Compliant', 'Annual Plan'],
    lifetimeValue: '$7,250',
    ordersCount: 6,
    satisfactionScore: 3.9,
    lastContactDate: '2026-11-04T14:30:00Z',
    lastContactChannel: 'email',
    joinedDate: 'Mar 10, 2025',
    assignedSpecialist: 'Sarah Chen',
    customFields: [
      { key: 'vat_id', label: 'EU VAT Number', value: 'DE 998877665' },
      { key: 'contract_renewal', label: 'Renewal Date', value: 'Dec 01, 2026' },
      { key: 'seats_count', label: 'Licensed Seats', value: '15 Seats' },
    ],
    timeline: [
      { id: 't-4', type: 'email', title: 'Ticket TKT-1040 Escalation', description: 'Billing adjustment credit memo issued for 3 unused seats.', timestamp: 'Nov 04, 2026 2:30 PM' },
      { id: 't-5', type: 'order', title: 'Invoice #INV-2026-11 Generated', description: 'Annual seat renewal: $1,290.00', timestamp: 'Nov 01, 2026 9:00 AM' },
    ],
    notes: [
      'Credit memo of $180 pending finance director sign-off.',
    ],
  },
  {
    id: 'CUST-003',
    name: 'Marcus Vance',
    email: 'marcus@cloudretail.com',
    phone: '+1 415 555 0123',
    company: 'CloudRetail Co.',
    location: 'San Francisco, USA',
    avatarInitials: 'MV',
    avatarGradient: 'from-emerald-600 to-teal-600',
    tier: 'Enterprise',
    status: 'active',
    segment: 'enterprise',
    tags: ['Enterprise SLA', 'Custom Webhook Cluster', 'High Volume'],
    lifetimeValue: '$34,900',
    ordersCount: 28,
    satisfactionScore: 4.9,
    lastContactDate: '2026-11-04T07:00:00Z',
    lastContactChannel: 'whatsapp',
    joinedDate: 'Nov 01, 2023',
    assignedSpecialist: 'Marcus Obi',
    customFields: [
      { key: 'sla_tier', label: 'Support SLA', value: '15-Minute Response Tier' },
      { key: 'api_cluster', label: 'Cluster Endpoint', value: 'us-west-2.cloudretail' },
    ],
    timeline: [
      { id: 't-6', type: 'whatsapp', title: 'Load Test Succeeded', description: '2,500 req/sec rate limit validated for Black Friday peak.', timestamp: 'Nov 04, 2026 7:00 AM' },
    ],
    notes: [
      'Account has dedicated Redis cluster in us-west-2.',
    ],
  },
  {
    id: 'CUST-004',
    name: 'Layla Hassan',
    email: 'layla@arabstore.ae',
    phone: '+971 50 123 4567',
    company: 'ArabStore FZCO',
    location: 'Dubai, UAE',
    avatarInitials: 'LH',
    avatarGradient: 'from-amber-600 to-rose-600',
    tier: 'Starter',
    status: 'active',
    segment: 'whatsapp_frequent',
    tags: ['Arabic Localization', 'GCC Dialect', 'COD Orders'],
    lifetimeValue: '$2,400',
    ordersCount: 3,
    satisfactionScore: 4.7,
    lastContactDate: '2026-11-04T08:00:00Z',
    lastContactChannel: 'whatsapp',
    joinedDate: 'Aug 01, 2026',
    assignedSpecialist: 'Fatima Al-Rashid',
    customFields: [
      { key: 'preferred_currency', label: 'Currency', value: 'AED (Dirham)' },
      { key: 'cod_enabled', label: 'Cash on Delivery', value: 'Enabled' },
    ],
    timeline: [
      { id: 't-7', type: 'whatsapp', title: 'Bot Dialog Optimization', description: 'Tuned colloquial Gulf dialect prompt for WhatsApp storefront.', timestamp: 'Nov 04, 2026 8:00 AM' },
    ],
    notes: [],
  },
  {
    id: 'CUST-005',
    name: 'TechNova Global',
    email: 'support@technova.io',
    phone: '+44 20 7946 0012',
    company: 'TechNova Ltd.',
    location: 'London, UK',
    avatarInitials: 'TN',
    avatarGradient: 'from-purple-600 to-indigo-700',
    tier: 'Enterprise',
    status: 'active',
    segment: 'enterprise',
    tags: ['Shopify Sync', 'Multi-Store', 'European Hub'],
    lifetimeValue: '$42,100',
    ordersCount: 42,
    satisfactionScore: 4.8,
    lastContactDate: '2026-11-04T10:15:00Z',
    lastContactChannel: 'chat',
    joinedDate: 'Mar 10, 2024',
    assignedSpecialist: 'Marcus Obi',
    customFields: [
      { key: 'store_count', label: 'Shopify Storefronts', value: '8 Regional Stores' },
    ],
    timeline: [
      { id: 't-8', type: 'chat', title: 'Webhook Sync Requested', description: 'Configured inventory webhooks across UK and EU warehouses.', timestamp: 'Nov 04, 2026 10:15 AM' },
    ],
    notes: [],
  },
  {
    id: 'CUST-006',
    name: 'Bright Homes Inc.',
    email: 'info@brighthomes.ca',
    phone: '+1 604 555 0199',
    company: 'Bright Homes Inc.',
    location: 'Vancouver, Canada',
    avatarInitials: 'BH',
    avatarGradient: 'from-slate-600 to-zinc-700',
    tier: 'Growth',
    status: 'inactive',
    segment: 'all',
    tags: ['Real Estate', 'SMS & WhatsApp'],
    lifetimeValue: '$5,800',
    ordersCount: 21,
    satisfactionScore: 4.1,
    lastContactDate: '2026-11-04T09:30:00Z',
    lastContactChannel: 'whatsapp',
    joinedDate: 'Sep 05, 2024',
    assignedSpecialist: 'Alex Rivera',
    customFields: [],
    timeline: [
      { id: 't-9', type: 'whatsapp', title: 'Handoff Trigger Fixed', description: 'Automated live routing restored after bot misfire.', timestamp: 'Nov 04, 2026 9:30 AM' },
    ],
    notes: [],
  },
]
