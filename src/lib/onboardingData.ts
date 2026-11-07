import type { Conversation } from './inboxData'

export interface WorkspaceProfile {
  companyName: string
  subdomain: string
  industry: string
  supportEmail: string
  language: string
  timezone: string
  supportHours: '24_7' | 'business_hours' | 'extended'
}

export interface WhatsAppSetupData {
  phoneNumber: string
  wabaAccountId: string
  phoneNumberId: string
  verifiedName: string
  verificationMethod: 'qr' | 'otp'
  status: 'connected' | 'pending' | 'disconnected'
  webhookUrl: string
  verifyToken: string
  healthLatencyMs: number | null
  lastTestedAt: string | null
}

export interface AIAgentSetupData {
  name: string
  model: 'Resolution Native-70B' | 'GPT-4o Omnichannel' | 'Claude 3.5 Sonnet'
  tone: 'empathetic' | 'professional' | 'casual' | 'concise'
  handoverThreshold: number // percentage e.g. 75
  greetingMessage: string
  preloadedKnowledge: string[]
}

export interface InvitedTeamMember {
  id: string
  name: string
  email: string
  role: 'Admin' | 'Manager' | 'Agent' | 'AI Trainer' | 'Viewer'
  status: 'invited' | 'active'
}

export interface OnboardingState {
  isCompleted: boolean
  currentStep: number // 0: Welcome, 1: Business, 2: WhatsApp, 3: AI Agent, 4: Team, 5: Completion
  completedSteps: number[]
  demoMode: boolean // true = sample realistic conversations loaded
  hasSeenTour: boolean
  workspace: WorkspaceProfile
  whatsapp: WhatsAppSetupData
  aiAgent: AIAgentSetupData
  team: InvitedTeamMember[]
}

export const ONBOARDING_STORAGE_KEY = 'resolution_ai_onboarding_v1'

export const defaultOnboardingState: OnboardingState = {
  isCompleted: false,
  currentStep: 0,
  completedSteps: [],
  demoMode: true,
  hasSeenTour: false,
  workspace: {
    companyName: 'Acme Retail & Co.',
    subdomain: 'acme-retail',
    industry: 'E-Commerce & Omnichannel Retail',
    supportEmail: 'support@acmeretail.com',
    language: 'English (US)',
    timezone: 'America/New_York (UTC-5)',
    supportHours: '24_7',
  },
  whatsapp: {
    phoneNumber: '+1 (555) 019-9201',
    wabaAccountId: '920184918204918',
    phoneNumberId: '109482710394829',
    verifiedName: 'Acme Retail Official Support',
    verificationMethod: 'qr',
    status: 'connected',
    webhookUrl: 'https://api.resolutionsupport.ai/v1/webhooks/whatsapp',
    verifyToken: 'res_secret_verify_token_2026',
    healthLatencyMs: 42,
    lastTestedAt: 'Just now',
  },
  aiAgent: {
    name: 'Resolution Support Copilot',
    model: 'Resolution Native-70B',
    tone: 'empathetic',
    handoverThreshold: 75,
    greetingMessage:
      'Hello there! 👋 Welcome to Acme Support. I am your Resolution AI Copilot. How can I help you today with your order or questions?',
    preloadedKnowledge: [
      'Return & Refund Policy (30-day window)',
      'DHL Express Live Tracking Integration',
      'Warranty & Defective Item Replacement',
      'WhatsApp Payment & Invoicing FAQs',
    ],
  },
  team: [
    {
      id: 'tm-init-1',
      name: 'Julian Sterling',
      email: 'julian@acmeretail.com',
      role: 'Admin',
      status: 'active',
    },
    {
      id: 'tm-init-2',
      name: 'Sarah Chen',
      email: 'sarah.chen@acmeretail.com',
      role: 'Manager',
      status: 'invited',
    },
    {
      id: 'tm-init-3',
      name: 'Marcus Obi',
      email: 'marcus.o@acmeretail.com',
      role: 'Agent',
      status: 'invited',
    },
  ],
}

// ─── 5 Realistic Demo Conversations for Interactive Workspace ─────────────────

export const realisticDemoConversations: Conversation[] = [
  {
    id: 'conv-demo-1',
    ticketNumber: 'RES-89201',
    customer: {
      id: 'cust-demo-1',
      name: 'Sofia Rossi',
      email: 'sofia.rossi@luxuryboutique.it',
      phone: '+39 349 881 2091',
      avatar: 'SR',
      company: 'Rossi Atelier Milano',
      tier: 'Enterprise',
      location: 'Milan, Italy',
      timezone: 'Europe/Rome (UTC+1)',
      joinedDate: 'Mar 12, 2025',
      totalOrders: 14,
      lifetimeValue: '€18,450.00',
      tags: ['VIP Patron', 'WhatsApp Preferred', 'Express Shipping'],
      orders: [
        {
          id: 'ord-it-1',
          orderNumber: 'IT-9821-X',
          date: 'Yesterday, 14:20',
          total: '€1,290.00',
          status: 'In Transit',
          items: 'Cashmere Winter Coat (Oatmeal / M) × 1',
        },
        {
          id: 'ord-it-2',
          orderNumber: 'IT-8711-A',
          date: 'Oct 02, 2026',
          total: '€840.00',
          status: 'Delivered',
          items: 'Handcrafted Tuscan Leather Tote × 1',
        },
      ],
    },
    channel: 'whatsapp',
    subject: 'Urgent Delivery Status Inquiry for Milan Fashion Gala',
    status: 'open',
    priority: 'urgent',
    assignedTo: 'Resolution AI Copilot',
    unreadCount: 1,
    lastMessage: 'Customer: Perfect, so the courier will call my WhatsApp before arrival?',
    lastMessageTime: '2m ago',
    aiActive: true,
    aiConfidence: 94,
    suggestedReplies: [
      'Yes, Sofia! DHL Express courier drivers are mandated to ring or message you 30 mins prior to delivery.',
      'Would you like me to add custom gate instructions (e.g., ring concierge / Apartment 4B) for the courier right now?',
      'Escalate to our VIP Milan concierge specialist for immediate courier phone dispatch.',
    ],
    messages: [
      {
        id: 'msg-1-1',
        sender: 'customer',
        text: 'Buon pomeriggio! I ordered the Oatmeal Cashmere Coat yesterday (order IT-9821-X). I have a runway event tomorrow evening and must know if it arrives by 2 PM!',
        time: '11:40 AM',
        status: 'read',
      },
      {
        id: 'msg-1-2',
        sender: 'ai',
        text: 'Ciao Sofia! ✨ Checking your DHL Express priority tracking right now. Order IT-9821-X cleared customs at Milan Malpensa at 09:15 AM today and has been loaded onto courier van #41. Scheduled delivery window is today between 1:00 PM and 2:30 PM!',
        time: '11:41 AM',
        status: 'read',
      },
      {
        id: 'msg-1-3',
        sender: 'customer',
        text: 'Che sollievo! Perfect, so the courier will call my WhatsApp before arrival?',
        time: '11:43 AM',
        status: 'delivered',
      },
    ],
    notes: [
      {
        id: 'note-1-1',
        author: 'Julian Sterling (Admin)',
        text: 'Sofia is an Enterprise VIP client. AI Native-70B pulled live Malpensa DHL manifest automatically. If delivery slips past 3 PM, escalate directly to human concierge.',
        time: '3m ago',
      },
    ],
  },
  {
    id: 'conv-demo-2',
    ticketNumber: 'RES-89202',
    customer: {
      id: 'cust-demo-2',
      name: 'Marcus Chen',
      email: 'm.chen@hyperion-tech.io',
      phone: '+1 (415) 555-0812',
      avatar: 'MC',
      company: 'Hyperion Labs Inc.',
      tier: 'Growth',
      location: 'San Francisco, CA',
      timezone: 'America/Los_Angeles (UTC-8)',
      joinedDate: 'Jan 15, 2026',
      totalOrders: 6,
      lifetimeValue: '$4,890.00',
      tags: ['Hardware Dev', 'High Volume'],
      orders: [
        {
          id: 'ord-us-1',
          orderNumber: 'US-4491-Z',
          date: 'Nov 02, 2026',
          total: '$749.00',
          status: 'Delivered',
          items: 'Ergonomic 4K Multi-Monitor Arm + Thunderbolt Dock',
        },
      ],
    },
    channel: 'whatsapp',
    subject: 'Damaged item box upon arrival - replacement arm bracket needed',
    status: 'open',
    priority: 'high',
    assignedTo: 'Alex Rivera',
    unreadCount: 0,
    lastMessage: 'Marcus: I uploaded the photo of the cracked hinge. Let me know if you need more angles.',
    lastMessageTime: '18m ago',
    aiActive: false, // Human takeover
    aiConfidence: 81,
    suggestedReplies: [
      'I reviewed the cracked hinge photo, Marcus. We are dispatching an immediate warranty replacement (no return of broken piece required)!',
      'FedEx overnight tracking for the new arm bracket has been generated: 7891-2391-4401.',
      'Would you prefer a 100% refund or expedited same-day replacement?',
    ],
    messages: [
      {
        id: 'msg-2-1',
        sender: 'customer',
        text: 'Hey team, package US-4491-Z arrived today, but the outer carton was crushed in transit and the heavy aluminum desk mount hinge has a hairline fracture.',
        time: '10:15 AM',
        status: 'read',
      },
      {
        id: 'msg-2-2',
        sender: 'customer',
        text: 'I uploaded the photo of the cracked hinge. Let me know if you need more angles.',
        time: '10:16 AM',
        status: 'read',
        attachment: {
          type: 'image',
          name: 'hinge_damage_photo.jpg',
          size: '2.4 MB',
          url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300&auto=format&fit=crop&q=80',
        },
      },
      {
        id: 'msg-2-3',
        sender: 'agent',
        text: 'Hi Marcus, Alex here taking over from the AI copilot. I deeply apologize for that courier mishandling. That hairline fracture is unsafe for dual 4K monitors.',
        time: '10:20 AM',
        status: 'read',
      },
      {
        id: 'msg-2-4',
        sender: 'agent',
        text: 'I have approved an immediate priority replacement without requiring you to repack the broken unit. FedEx Overnight will deliver the new unit tomorrow morning!',
        time: '10:22 AM',
        status: 'delivered',
      },
    ],
    notes: [
      {
        id: 'note-2-1',
        author: 'Alex Rivera (Agent)',
        text: 'Escalated from AI due to attachment detection. RMA-2910 created. Replacement booked under FedEx Overnight shipping account #889.',
        time: '20m ago',
      },
    ],
  },
  {
    id: 'conv-demo-3',
    ticketNumber: 'RES-89203',
    customer: {
      id: 'cust-demo-3',
      name: 'Amara Okafor',
      email: 'amara@pulsebrands.ng',
      phone: '+234 803 129 4810',
      avatar: 'AO',
      company: 'Pulse Logistics & Retail',
      tier: 'Enterprise',
      location: 'Lagos, Nigeria',
      timezone: 'Africa/Lagos (UTC+1)',
      joinedDate: 'Aug 19, 2025',
      totalOrders: 32,
      lifetimeValue: '$42,500.00',
      tags: ['Enterprise WABA', 'High Broadcast Volume', 'Global SLA'],
      orders: [
        {
          id: 'ord-ng-1',
          orderNumber: 'ENT-9021',
          date: 'Nov 01, 2026',
          total: '$3,800.00',
          status: 'Delivered',
          items: 'Monthly Enterprise WhatsApp Cloud Bandwidth (500k messages)',
        },
      ],
    },
    channel: 'whatsapp',
    subject: 'Meta Cloud API Tier 3 Limit Upgrade & Webhook Failover Config',
    status: 'pending',
    priority: 'medium',
    assignedTo: 'Sarah Chen',
    unreadCount: 0,
    lastMessage: 'Sarah: Meta has upgraded your verified WABA phone number to Tier 3 (100k messages / 24h).',
    lastMessageTime: '45m ago',
    aiActive: false,
    aiConfidence: 88,
    suggestedReplies: [
      'Your webhook secondary backup server at lagos-gateway.pulse.ng is actively receiving traffic.',
      'Would you like us to test an automated batch template send to verify 100k throughput?',
    ],
    messages: [
      {
        id: 'msg-3-1',
        sender: 'customer',
        text: 'Good morning Sarah! Black Friday promotions start next week across West Africa. We anticipate pushing 80,000 WhatsApp alerts in 4 hours. Can we confirm our WABA Tier upgrade?',
        time: '08:30 AM',
        status: 'read',
      },
      {
        id: 'msg-3-2',
        sender: 'agent',
        text: 'Hello Amara! Great news: Meta Cloud API team approved our tier request 15 minutes ago. Your verified number is now Tier 3 with 100k business-initiated daily capacity.',
        time: '08:45 AM',
        status: 'read',
      },
      {
        id: 'msg-3-3',
        sender: 'customer',
        text: 'Outstanding speed! And our webhook redundancy?',
        time: '08:47 AM',
        status: 'read',
      },
      {
        id: 'msg-3-4',
        sender: 'agent',
        text: 'Failover is active with 0% dropped packets during our 5,000 ping stress test this morning.',
        time: '08:50 AM',
        status: 'read',
      },
    ],
    notes: [
      {
        id: 'note-3-1',
        author: 'Sarah Chen (Manager)',
        text: 'Client is running a high-stakes Black Friday campaign. Keep tier monitor alert active on Slack channel #enterprise-watch.',
        time: '1h ago',
      },
    ],
  },
  {
    id: 'conv-demo-4',
    ticketNumber: 'RES-89204',
    customer: {
      id: 'cust-demo-4',
      name: 'Carlos Rodriguez',
      email: 'carlos.rodriguez@valenciacatering.es',
      phone: '+34 612 889 012',
      avatar: 'CR',
      company: 'Valencia Gastronomy SL',
      tier: 'Growth',
      location: 'Valencia, Spain',
      timezone: 'Europe/Madrid (UTC+1)',
      joinedDate: 'Feb 10, 2026',
      totalOrders: 8,
      lifetimeValue: '€6,240.00',
      tags: ['Spanish Preferred', 'B2B Wholesale'],
      orders: [
        {
          id: 'ord-es-1',
          orderNumber: 'ES-1102-M',
          date: 'Yesterday, 19:40',
          total: '€349.00',
          status: 'Processing',
          items: 'Commercial Cold Brew Extractor (Double Filter)',
        },
      ],
    },
    channel: 'whatsapp',
    subject: 'Duplicate charge detected on Mastercard statement',
    status: 'resolved',
    priority: 'high',
    assignedTo: 'Resolution AI Copilot',
    unreadCount: 0,
    lastMessage: 'AI Copilot: Refund of €349.00 has been credited back to your card ending in 4109.',
    lastMessageTime: '2h ago',
    aiActive: true,
    aiConfidence: 99,
    suggestedReplies: [
      'Customer has confirmed receipt of bank reversal notification.',
      'No further action required. Ticket is closed and customer rating received: 5/5 stars.',
    ],
    messages: [
      {
        id: 'msg-4-1',
        sender: 'customer',
        text: 'Hola. Revisé mi cuenta bancaria y veo dos cargos idénticos de 349€ para el pedido ES-1102-M. ¿Podéis comprobarlo por favor?',
        time: '07:10 AM',
        status: 'read',
      },
      {
        id: 'msg-4-2',
        sender: 'ai',
        text: '¡Hola Carlos! Disculpa las molestias. He auditado inmediatamente los registros de Stripe para el pedido ES-1102-M. Efectivamente, hubo una doble retención temporal debido a un error de red durante el checkout.',
        time: '07:11 AM',
        status: 'read',
      },
      {
        id: 'msg-4-3',
        sender: 'ai',
        text: 'He liberado la segunda retención de 349,00 € ahora mismo. Tu banco (Santander) reflejará la cancelación en 2-4 horas. Tu pedido principal sigue en preparación con envío urgente garantizado.',
        time: '07:12 AM',
        status: 'read',
      },
      {
        id: 'msg-4-4',
        sender: 'customer',
        text: '¡Increíble rapidez! Ya he recibido la notificación del banco. Muchísimas gracias.',
        time: '07:15 AM',
        status: 'read',
      },
    ],
    notes: [
      {
        id: 'note-4-1',
        author: 'Resolution AI Copilot',
        text: 'Autonomous resolution via Stripe Connect API action. Idempotency key conflict resolved with full refund of second authorization.',
        time: '2h ago',
      },
    ],
  },
  {
    id: 'conv-demo-5',
    ticketNumber: 'RES-89205',
    customer: {
      id: 'cust-demo-5',
      name: 'Elena Rostova',
      email: 'elena.rostova@berlinfintech.de',
      phone: '+49 170 992 4811',
      avatar: 'ER',
      company: 'KlaroPay GmbH',
      tier: 'Enterprise',
      location: 'Berlin, Germany',
      timezone: 'Europe/Berlin (UTC+1)',
      joinedDate: 'Just now (Lead)',
      totalOrders: 0,
      lifetimeValue: '$0.00 (Lead)',
      tags: ['Sales Inquiry', 'GDPR Inquiry', 'Fintech'],
      orders: [],
    },
    channel: 'whatsapp',
    subject: 'Pre-sales technical inquiry: GDPR & WhatsApp end-to-end data residency',
    status: 'open',
    priority: 'medium',
    assignedTo: 'Resolution AI Copilot',
    unreadCount: 1,
    lastMessage: 'Elena: Are customer WhatsApp conversations encrypted at rest in EU (Frankfurt) datacenters?',
    lastMessageTime: '5m ago',
    aiActive: true,
    aiConfidence: 96,
    suggestedReplies: [
      'Yes, Elena! All data, embeddings, and chat histories are hosted in AWS Frankfurt (eu-central-1) with SOC2 Type II and ISO 27001 certifications.',
      'Would you like me to send our GDPR Data Processing Addendum (DPA) and WhatsApp Security Whitepaper to your email?',
      'Let me connect you directly with our Chief Security Officer for a compliance review.',
    ],
    messages: [
      {
        id: 'msg-5-1',
        sender: 'customer',
        text: 'Guten Tag! We are evaluating ReSolution AI to automate WhatsApp support for 120,000 banking customers in Germany and Austria.',
        time: '11:10 AM',
        status: 'read',
      },
      {
        id: 'msg-5-2',
        sender: 'customer',
        text: 'Before booking an enterprise pilot, can you confirm: Are customer WhatsApp conversations encrypted at rest in EU (Frankfurt) datacenters?',
        time: '11:11 AM',
        status: 'delivered',
      },
    ],
    notes: [
      {
        id: 'note-5-1',
        author: 'Julian Sterling (Admin)',
        text: 'High-value Enterprise lead from Berlin Fintech summit. AI copilot primed with GDPR compliance knowledge base.',
        time: '5m ago',
      },
    ],
  },
]
