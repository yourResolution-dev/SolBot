// ─── Rich Sample Data for 3-Panel Support Inbox ──────────────────────────────

export type ConversationStatus = 'open' | 'pending' | 'resolved' | 'closed'
export type ConversationPriority = 'low' | 'medium' | 'high' | 'urgent'
export type InboxChannel = 'whatsapp' | 'email' | 'chat'

export interface ChatMessage {
  id: string
  sender: 'customer' | 'agent' | 'ai' | 'system'
  text: string
  time: string
  status?: 'sent' | 'delivered' | 'read'
  attachment?: {
    type: 'image' | 'file'
    name: string
    size: string
    url?: string
  }
}

export interface InternalNote {
  id: string
  author: string
  text: string
  time: string
}

export interface OrderItem {
  id: string
  orderNumber: string
  date: string
  total: string
  status: 'Delivered' | 'In Transit' | 'Processing' | 'Refunded'
  items: string
}

export interface CustomerProfile {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  company: string
  tier: 'Enterprise' | 'Growth' | 'Starter'
  location: string
  timezone: string
  joinedDate: string
  totalOrders: number
  lifetimeValue: string
  tags: string[]
  orders: OrderItem[]
}

export interface Conversation {
  id: string
  ticketNumber: string
  customer: CustomerProfile
  channel: InboxChannel
  subject: string
  status: ConversationStatus
  priority: ConversationPriority
  assignedTo: string
  unreadCount: number
  lastMessage: string
  lastMessageTime: string
  aiActive: boolean
  aiConfidence: number
  suggestedReplies: string[]
  messages: ChatMessage[]
  notes: InternalNote[]
}

export const initialConversations: Conversation[] = [
  {
    id: 'conv-1',
    ticketNumber: 'WA-8041',
    customer: {
      id: 'cust-101',
      name: 'Priya Sharma',
      email: 'priya@sharmafashion.in',
      phone: '+91 98765 43210',
      avatar: 'PS',
      company: 'Sharma Couture Group',
      tier: 'Enterprise',
      location: 'Mumbai, India',
      timezone: 'IST (UTC+5:30)',
      joinedDate: 'Jan 15, 2025',
      totalOrders: 14,
      lifetimeValue: '$18,400',
      tags: ['VIP Client', 'WhatsApp Preferred', 'Bulk Buyer'],
      orders: [
        {
          id: 'ord-1',
          orderNumber: '#SC-99201',
          date: 'Nov 02, 2026',
          total: '$1,850.00',
          status: 'In Transit',
          items: 'Silk Embroidered Kaftans x 25',
        },
        {
          id: 'ord-2',
          orderNumber: '#SC-88140',
          date: 'Oct 14, 2026',
          total: '$4,200.00',
          status: 'Delivered',
          items: 'Festive Velvet Collection x 50',
        },
        {
          id: 'ord-3',
          orderNumber: '#SC-77309',
          date: 'Sep 05, 2026',
          total: '$920.00',
          status: 'Delivered',
          items: 'Chiffon Scarves Assorted',
        },
      ],
    },
    channel: 'whatsapp',
    subject: 'Urgent tracking status for courier shipment #SC-99201',
    status: 'open',
    priority: 'urgent',
    assignedTo: 'Alex Rivera',
    unreadCount: 2,
    lastMessage: 'Can you please check why the DHL tracking has not updated since yesterday?',
    lastMessageTime: '2 mins ago',
    aiActive: true,
    aiConfidence: 94,
    suggestedReplies: [
      'Hi Priya! I checked DHL tracking #SC-99201. It cleared Delhi customs at 2:15 PM and is scheduled for final delivery tomorrow before 6 PM.',
      'Hello Priya, our warehouse logistics team has escalated the tracking delay with DHL express. You will receive real-time SMS updates shortly.',
      'We apologize for the delay. Would you like me to connect you directly with your dedicated VIP dispatch agent?',
    ],
    notes: [
      {
        id: 'note-1',
        author: 'Alex Rivera',
        text: 'Priya is preparing for Diwali wholesale trunk show. Needs express delivery confirmed today.',
        time: 'Nov 04, 2026 5:40 PM',
      },
    ],
    messages: [
      {
        id: 'm-1',
        sender: 'customer',
        text: 'Hi support team, I ordered wholesale bundle #SC-99201 on Monday.',
        time: '11:15 AM',
      },
      {
        id: 'm-2',
        sender: 'ai',
        text: 'Hello Priya! Welcome back. I found your order #SC-99201 placed on Nov 02 for $1,850.00. How can I assist you with this shipment today?',
        time: '11:15 AM',
        status: 'read',
      },
      {
        id: 'm-3',
        sender: 'customer',
        text: 'Can you please check why the DHL tracking has not updated since yesterday? Our boutique launch is on Friday and we are getting anxious.',
        time: '11:18 AM',
      },
    ],
  },
  {
    id: 'conv-2',
    ticketNumber: 'WA-8042',
    customer: {
      id: 'cust-102',
      name: 'Daniel Koch',
      email: 'd.koch@nexusinvest.de',
      phone: '+49 30 12345678',
      avatar: 'DK',
      company: 'Nexus Finance GmbH',
      tier: 'Growth',
      location: 'Berlin, Germany',
      timezone: 'CET (UTC+1:00)',
      joinedDate: 'Mar 10, 2025',
      totalOrders: 6,
      lifetimeValue: '$7,250',
      tags: ['Billing Query', 'GDPR Compliant'],
      orders: [
        {
          id: 'ord-4',
          orderNumber: '#INV-2026-11',
          date: 'Nov 01, 2026',
          total: '$1,290.00',
          status: 'Processing',
          items: 'Resolution Enterprise 15-Seat License',
        },
      ],
    },
    channel: 'whatsapp',
    subject: 'Billing discrepancy on seat add-ons for November invoice',
    status: 'pending',
    priority: 'high',
    assignedTo: 'Sarah Chen',
    unreadCount: 0,
    lastMessage: 'Thanks Sarah, I sent the PO confirmation from our finance director.',
    lastMessageTime: '24 mins ago',
    aiActive: false,
    aiConfidence: 78,
    suggestedReplies: [
      'Thank you Daniel! I have credited the $180 difference to your account balance.',
      'Received the PO document. I am forwarding this to our accounting lead for immediate re-issue.',
    ],
    notes: [
      {
        id: 'note-2',
        author: 'Sarah Chen',
        text: 'Applied 15% annual enterprise discount. Finance approved adjustment.',
        time: 'Nov 04, 2026 2:10 PM',
      },
    ],
    messages: [
      {
        id: 'm-4',
        sender: 'customer',
        text: 'Guten Tag, our invoice shows charges for 18 seats instead of our agreed 15 seats.',
        time: '09:20 AM',
      },
      {
        id: 'm-5',
        sender: 'agent',
        text: 'Hello Daniel! Sarah here. Let me review your contract agreement right now and issue a revised credit memo.',
        time: '09:35 AM',
        status: 'read',
      },
      {
        id: 'm-6',
        sender: 'customer',
        text: 'Thanks Sarah, I sent the PO confirmation from our finance director.',
        time: '10:02 AM',
      },
    ],
  },
  {
    id: 'conv-3',
    ticketNumber: 'WA-8043',
    customer: {
      id: 'cust-103',
      name: 'Layla Hassan',
      email: 'layla@arabstore.ae',
      phone: '+971 50 123 4567',
      avatar: 'LH',
      company: 'ArabStore FZCO',
      tier: 'Starter',
      location: 'Dubai, UAE',
      timezone: 'GST (UTC+4:00)',
      joinedDate: 'Aug 01, 2026',
      totalOrders: 3,
      lifetimeValue: '$2,400',
      tags: ['Arabic Localization', 'Shopify Sync'],
      orders: [
        {
          id: 'ord-5',
          orderNumber: '#AE-5521',
          date: 'Oct 28, 2026',
          total: '$850.00',
          status: 'Delivered',
          items: 'Arabic RTL Widget Plugin Bundle',
        },
      ],
    },
    channel: 'whatsapp',
    subject: 'Arabic bot prompt response tuning for colloquial Gulf dialect',
    status: 'open',
    priority: 'medium',
    assignedTo: 'Fatima Al-Rashid',
    unreadCount: 1,
    lastMessage: 'مرحباً، هل يمكن تعديل رسائل الترحيب لتكون باللهجة الخليجية؟',
    lastMessageTime: '1 hour ago',
    aiActive: true,
    aiConfidence: 91,
    suggestedReplies: [
      'أهلاً ليلى! بالتأكيد، قمت بتفعيل نموذج اللهجة الخليجية في إعدادات البوت الخاص بك.',
      'مرحباً بك! يمكننا تخصيص عبارات الترحيب لتناسب عملائك في الخليج فوراً.',
    ],
    notes: [],
    messages: [
      {
        id: 'm-7',
        sender: 'customer',
        text: 'مرحباً، هل يمكن تعديل رسائل الترحيب لتكون باللهجة الخليجية؟',
        time: '08:45 AM',
      },
    ],
  },
  {
    id: 'conv-4',
    ticketNumber: 'WA-8044',
    customer: {
      id: 'cust-104',
      name: 'Marcus Vance',
      email: 'marcus@cloudretail.com',
      phone: '+1 415 555 0123',
      avatar: 'MV',
      company: 'CloudRetail Co.',
      tier: 'Enterprise',
      location: 'San Francisco, USA',
      timezone: 'PST (UTC-8:00)',
      joinedDate: 'Nov 01, 2023',
      totalOrders: 28,
      lifetimeValue: '$34,900',
      tags: ['API Enterprise', 'High Volume', 'Custom SLA'],
      orders: [
        {
          id: 'ord-6',
          orderNumber: '#CR-10492',
          date: 'Nov 03, 2026',
          total: '$3,400.00',
          status: 'Delivered',
          items: 'Dedicated WhatsApp Webhook Cluster',
        },
      ],
    },
    channel: 'whatsapp',
    subject: 'Webhook throughput rate limits during Black Friday prep test',
    status: 'resolved',
    priority: 'urgent',
    assignedTo: 'Marcus Obi',
    unreadCount: 0,
    lastMessage: 'Confirmed 2,500 req/sec limit is now active. All test payloads passed.',
    lastMessageTime: '3 hours ago',
    aiActive: true,
    aiConfidence: 98,
    suggestedReplies: [
      'Glad to hear all tests passed Marcus! Your cluster is now primed for Black Friday traffic.',
    ],
    notes: [
      {
        id: 'note-3',
        author: 'Marcus Obi',
        text: 'Provisioned dual dedicated Redis instances for CloudRetail webhook queue.',
        time: 'Nov 04, 2026 8:00 AM',
      },
    ],
    messages: [
      {
        id: 'm-8',
        sender: 'customer',
        text: 'Marcus, we hit HTTP 429 during load simulation on our staging environment.',
        time: '07:15 AM',
      },
      {
        id: 'm-9',
        sender: 'agent',
        text: 'Looking into it right now. Scaling our Redis rate limiter to 2,500 req/sec.',
        time: '07:22 AM',
        status: 'read',
      },
      {
        id: 'm-10',
        sender: 'customer',
        text: 'Confirmed 2,500 req/sec limit is now active. All test payloads passed.',
        time: '07:55 AM',
      },
    ],
  },
  {
    id: 'conv-5',
    ticketNumber: 'WA-8045',
    customer: {
      id: 'cust-105',
      name: 'Elena Rostova',
      email: 'elena@novatech.fi',
      phone: '+358 40 1234567',
      avatar: 'ER',
      company: 'NovaTech Oy',
      tier: 'Growth',
      location: 'Helsinki, Finland',
      timezone: 'EET (UTC+2:00)',
      joinedDate: 'May 18, 2025',
      totalOrders: 9,
      lifetimeValue: '$11,300',
      tags: ['Shopify Webhooks', 'Automations'],
      orders: [
        {
          id: 'ord-7',
          orderNumber: '#NT-302',
          date: 'Oct 19, 2026',
          total: '$1,150.00',
          status: 'Delivered',
          items: 'Automations Growth License',
        },
      ],
    },
    channel: 'whatsapp',
    subject: 'Request to connect custom CRM webhook with WhatsApp bot triggers',
    status: 'open',
    priority: 'low',
    assignedTo: 'Alex Rivera',
    unreadCount: 0,
    lastMessage: 'Is there a sandbox endpoint where we can test JSON payload schema?',
    lastMessageTime: '4 hours ago',
    aiActive: true,
    aiConfidence: 89,
    suggestedReplies: [
      'Hi Elena! Yes, our sandbox endpoint is available at https://sandbox.resolutionsupport.ai/v1/events with dummy credentials.',
      'Hello Elena, I can share our Postman collection for sandbox webhook payload schema testing.',
    ],
    notes: [],
    messages: [
      {
        id: 'm-11',
        sender: 'customer',
        text: 'Is there a sandbox endpoint where we can test JSON payload schema?',
        time: '06:10 AM',
      },
    ],
  },
]
