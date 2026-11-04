// ─── Rich Sample Data for AI Agents Section ────────────────────────────────

export type AgentRoleType = 'support' | 'sales' | 'billing' | 'onboarding' | 'triage'
export type AgentTone = 'empathetic' | 'professional' | 'casual' | 'concise' | 'technical'
export type AgentModel = 'GPT-4o Omnichannel' | 'Claude 3.5 Sonnet' | 'Gemini 1.5 Pro' | 'Resolution Native-70B'

export interface KnowledgeDocument {
  id: string
  name: string
  type: 'pdf' | 'docx' | 'url' | 'notion' | 'faq'
  size: string
  chunkCount: number
  lastSynced: string
  status: 'indexed' | 'syncing' | 'failed'
}

export interface HandoverRule {
  id: string
  condition: string
  targetRole: string
  action: 'escalate_human' | 'route_specialist' | 'open_ticket'
  priority: 'urgent' | 'high' | 'medium'
}

export interface AIAgent {
  id: string
  name: string
  slug: string
  description: string
  role: AgentRoleType
  avatarColor: string
  model: AgentModel
  tone: AgentTone
  temperature: number
  maxTokens: number
  status: 'active' | 'paused' | 'draft'
  systemPrompt: string
  handoffConfidenceThreshold: number // percentage e.g. 75
  channels: ('whatsapp' | 'email' | 'chat')[]
  knowledgeSources: KnowledgeDocument[]
  handoffRules: HandoverRule[]
  metrics: {
    totalResolved: number
    resolutionRate: number
    avgLatencySec: number
    csat: number
  }
  createdAt: string
  updatedAt: string
}

export const initialAIAgents: AIAgent[] = [
  {
    id: 'agent-1',
    name: 'Resolution Support Copilot',
    slug: 'support-copilot',
    description: 'Primary customer service agent for orders, shipping updates, returns, and general FAQ queries.',
    role: 'support',
    avatarColor: 'from-violet-600 to-indigo-600',
    model: 'Resolution Native-70B',
    tone: 'empathetic',
    temperature: 0.35,
    maxTokens: 512,
    status: 'active',
    systemPrompt: `You are Resolution Support AI, an empathetic and highly accurate customer care agent.
Your primary goals:
1. Provide immediate, accurate order status and courier tracking info for WhatsApp inquiries.
2. Guide customers step-by-step through return and exchange policies.
3. If order issues involve damage or incorrect shipment, express empathy and collect order photos before escalating to a human specialist.
Never invent tracking numbers. Be polite, concise, and professional.`,
    handoffConfidenceThreshold: 78,
    channels: ['whatsapp', 'chat', 'email'],
    knowledgeSources: [
      {
        id: 'kb-1',
        name: 'Standard Return & Exchange Policy 2026.pdf',
        type: 'pdf',
        size: '2.4 MB',
        chunkCount: 148,
        lastSynced: '2 hours ago',
        status: 'indexed',
      },
      {
        id: 'kb-2',
        name: 'Shopify Shipping Zones & Rates.faq',
        type: 'faq',
        size: '420 KB',
        chunkCount: 94,
        lastSynced: 'Yesterday',
        status: 'indexed',
      },
      {
        id: 'kb-3',
        name: 'https://help.resolutionsupport.ai/warranty',
        type: 'url',
        size: '1.1 MB',
        chunkCount: 76,
        lastSynced: '3 days ago',
        status: 'indexed',
      },
    ],
    handoffRules: [
      {
        id: 'rule-1',
        condition: 'Customer sentiment drops below 0.3 or mentions "scam / lawyer / fraud"',
        targetRole: 'Senior Support Specialist',
        action: 'escalate_human',
        priority: 'urgent',
      },
      {
        id: 'rule-2',
        condition: 'Model confidence score is under 78%',
        targetRole: 'Human Live Agent',
        action: 'escalate_human',
        priority: 'high',
      },
      {
        id: 'rule-3',
        condition: 'Refund requested exceeds $500.00',
        targetRole: 'Tier-2 Finance Support',
        action: 'route_specialist',
        priority: 'high',
      },
    ],
    metrics: {
      totalResolved: 24890,
      resolutionRate: 88.4,
      avgLatencySec: 1.2,
      csat: 4.8,
    },
    createdAt: '2026-01-10',
    updatedAt: '2026-11-04',
  },
  {
    id: 'agent-2',
    name: 'WhatsApp Sales Concierge',
    slug: 'sales-concierge',
    description: 'Conversational shopping assistant that qualifies leads, recommends catalog products, and drives WhatsApp checkout.',
    role: 'sales',
    avatarColor: 'from-emerald-500 to-teal-600',
    model: 'GPT-4o Omnichannel',
    tone: 'professional',
    temperature: 0.6,
    maxTokens: 600,
    status: 'active',
    systemPrompt: `You are the WhatsApp Sales Concierge.
Your purpose is to answer customer questions about pricing, bulk discounts, and product compatibility.
Guide customers towards completed WhatsApp catalog orders. Provide direct payment link buttons when qualified.`,
    handoffConfidenceThreshold: 72,
    channels: ['whatsapp', 'chat'],
    knowledgeSources: [
      {
        id: 'kb-4',
        name: 'Wholesale Catalog & Price List Q4.pdf',
        type: 'pdf',
        size: '5.8 MB',
        chunkCount: 310,
        lastSynced: '5 hours ago',
        status: 'indexed',
      },
    ],
    handoffRules: [
      {
        id: 'rule-4',
        condition: 'Bulk order inquiry over 500 units',
        targetRole: 'B2B Wholesale Director',
        action: 'route_specialist',
        priority: 'urgent',
      },
    ],
    metrics: {
      totalResolved: 9420,
      resolutionRate: 74.2,
      avgLatencySec: 1.8,
      csat: 4.6,
    },
    createdAt: '2026-03-15',
    updatedAt: '2026-11-03',
  },
  {
    id: 'agent-3',
    name: 'Billing & Account Dispute Bot',
    slug: 'billing-dispute',
    description: 'Handles seat licensing adjustments, invoice downloads, VAT calculations, and credit memos.',
    role: 'billing',
    avatarColor: 'from-amber-500 to-orange-600',
    model: 'Claude 3.5 Sonnet',
    tone: 'concise',
    temperature: 0.2,
    maxTokens: 400,
    status: 'active',
    systemPrompt: `You are the Billing & Invoicing Specialist Bot.
Provide clear breakdown of subscription invoices, credit card update links, and refund status.
Always request invoice ID and verify account email before revealing billing amounts.`,
    handoffConfidenceThreshold: 85,
    channels: ['email', 'whatsapp', 'chat'],
    knowledgeSources: [
      {
        id: 'kb-5',
        name: 'Stripe & Merchant Billing Documentation.notion',
        type: 'notion',
        size: '850 KB',
        chunkCount: 112,
        lastSynced: '1 day ago',
        status: 'indexed',
      },
    ],
    handoffRules: [
      {
        id: 'rule-5',
        condition: 'Chargeback threat or bank dispute notification',
        targetRole: 'Finance Operations Lead',
        action: 'escalate_human',
        priority: 'urgent',
      },
    ],
    metrics: {
      totalResolved: 4180,
      resolutionRate: 81.0,
      avgLatencySec: 1.4,
      csat: 4.4,
    },
    createdAt: '2026-05-20',
    updatedAt: '2026-11-02',
  },
  {
    id: 'agent-4',
    name: 'Multilingual Arabic & MENA Bot',
    slug: 'mena-bot',
    description: 'Tuned specifically for Arabic, English, and French inquiries across the GCC region with local dialect support.',
    role: 'support',
    avatarColor: 'from-purple-600 to-pink-600',
    model: 'Resolution Native-70B',
    tone: 'empathetic',
    temperature: 0.4,
    maxTokens: 500,
    status: 'paused',
    systemPrompt: `أنت مساعد دعم العملاء الذكي لمنطقة الشرق الأوسط وشمال أفريقيا.
تحدث باللغة العربية الفصحى أو اللهجة الخليجية حسب لغة العميل.
ساعد العملاء في تتبع الطلبات والإرجاع وسياسات الدفع عند الاستلام.`,
    handoffConfidenceThreshold: 80,
    channels: ['whatsapp'],
    knowledgeSources: [
      {
        id: 'kb-6',
        name: 'GCC Shipping & Cash-on-Delivery Terms.pdf',
        type: 'pdf',
        size: '1.9 MB',
        chunkCount: 88,
        lastSynced: '4 days ago',
        status: 'indexed',
      },
    ],
    handoffRules: [],
    metrics: {
      totalResolved: 1850,
      resolutionRate: 79.5,
      avgLatencySec: 2.1,
      csat: 4.7,
    },
    createdAt: '2026-08-01',
    updatedAt: '2026-10-28',
  },
]
