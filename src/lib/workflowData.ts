// ─── Data models for Visual Flow Builder & Automations ──────────────────────

export type NodeType = 'trigger' | 'condition' | 'action' | 'ai_agent' | 'handover'

export interface WorkflowNode {
  id: string
  type: NodeType
  title: string
  subtitle: string
  x: number
  y: number
  config: {
    channel?: 'whatsapp' | 'email' | 'chat'
    triggerEvent?: string
    conditionField?: string
    conditionOperator?: 'contains' | 'equals' | 'greater_than' | 'less_than'
    conditionValue?: string
    actionType?: 'send_message' | 'send_catalog' | 'add_tag' | 'webhook_post' | 'create_ticket'
    templateText?: string
    targetAgent?: string
    delayMinutes?: number
  }
}

export interface WorkflowConnection {
  id: string
  fromNodeId: string
  toNodeId: string
  label?: 'Yes' | 'No' | 'Next'
}

export interface AutomationWorkflow {
  id: string
  name: string
  description: string
  channel: 'whatsapp' | 'email' | 'chat'
  status: 'active' | 'paused' | 'draft'
  category: 'onboarding' | 'ecommerce' | 'support' | 'sales'
  executionsCount: number
  successRate: number
  lastExecuted: string
  nodes: WorkflowNode[]
  connections: WorkflowConnection[]
  executionLogs: {
    id: string
    time: string
    recipient: string
    status: 'success' | 'failed' | 'running'
    details: string
  }[]
  createdAt: string
  updatedAt: string
}

export const initialWorkflows: AutomationWorkflow[] = [
  {
    id: 'wf-1',
    name: 'Order Status & Tracking Auto-Dispatch',
    description: 'Listens for customer order status queries on WhatsApp, verifies Shopify order state, and sends dynamic DHL tracking links.',
    channel: 'whatsapp',
    status: 'active',
    category: 'ecommerce',
    executionsCount: 14820,
    successRate: 98.4,
    lastExecuted: '2 mins ago',
    createdAt: '2026-02-14',
    updatedAt: '2026-11-04',
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        title: 'Incoming WhatsApp Message',
        subtitle: 'Phrase contains "order status" or "track package"',
        x: 60,
        y: 80,
        config: {
          channel: 'whatsapp',
          triggerEvent: 'order_status_query',
        },
      },
      {
        id: 'node-2',
        type: 'condition',
        title: 'Has Valid Order ID?',
        subtitle: 'Message contains regex #SC-[0-9]{5}',
        x: 340,
        y: 80,
        config: {
          conditionField: 'message_text',
          conditionOperator: 'contains',
          conditionValue: '#SC-',
        },
      },
      {
        id: 'node-3',
        type: 'action',
        title: 'Send Live Tracking Card',
        subtitle: 'Dispatch interactive WhatsApp template with ETA & Map',
        x: 640,
        y: 30,
        config: {
          actionType: 'send_message',
          templateText: 'Hello {{customer_name}}, your order {{order_id}} is In Transit with DHL Express. Estimated arrival: Tomorrow before 6 PM.',
        },
      },
      {
        id: 'node-4',
        type: 'action',
        title: 'Request Order Number',
        subtitle: 'Ask customer for 5-digit invoice/order number',
        x: 640,
        y: 190,
        config: {
          actionType: 'send_message',
          templateText: 'We would love to track that for you! Could you please reply with your 5-digit order number (e.g. #SC-99201)?',
        },
      },
    ],
    connections: [
      { id: 'c-1', fromNodeId: 'node-1', toNodeId: 'node-2', label: 'Next' },
      { id: 'c-2', fromNodeId: 'node-2', toNodeId: 'node-3', label: 'Yes' },
      { id: 'c-3', fromNodeId: 'node-2', toNodeId: 'node-4', label: 'No' },
    ],
    executionLogs: [
      { id: 'log-1', time: '11:42 AM', recipient: '+91 98765 43210 (Priya Sharma)', status: 'success', details: 'Sent tracking #SC-99201 via DHL Express webhook' },
      { id: 'log-2', time: '11:38 AM', recipient: '+49 30 12345678 (Daniel Koch)', status: 'success', details: 'Delivered invoice tracking card' },
      { id: 'log-3', time: '11:15 AM', recipient: '+971 50 123 4567 (Layla Hassan)', status: 'success', details: 'Replied with Arabic shipping ETA' },
    ],
  },
  {
    id: 'wf-2',
    name: 'Abandoned Cart WhatsApp Recovery',
    description: 'Triggers 45 minutes after checkout abandonment with a personalized WhatsApp recovery discount button.',
    channel: 'whatsapp',
    status: 'active',
    category: 'ecommerce',
    executionsCount: 5210,
    successRate: 94.6,
    lastExecuted: '18 mins ago',
    createdAt: '2026-04-10',
    updatedAt: '2026-11-03',
    nodes: [
      {
        id: 'node-201',
        type: 'trigger',
        title: 'Shopify Cart Abandoned',
        subtitle: 'User left checkout > 45 minutes ago',
        x: 60,
        y: 90,
        config: {
          triggerEvent: 'cart_abandoned',
          delayMinutes: 45,
        },
      },
      {
        id: 'node-202',
        type: 'condition',
        title: 'Cart Value > $100',
        subtitle: 'Filter high-value VIP buyers',
        x: 340,
        y: 90,
        config: {
          conditionField: 'cart_total',
          conditionOperator: 'greater_than',
          conditionValue: '100',
        },
      },
      {
        id: 'node-203',
        type: 'action',
        title: 'Send 15% VIP Coupon',
        subtitle: 'WhatsApp template with 1-tap checkout URL',
        x: 640,
        y: 40,
        config: {
          actionType: 'send_message',
          templateText: 'Hi {{first_name}}! We saved the items in your bag. Complete checkout in the next 2 hours with code VIP15 for 15% off!',
        },
      },
      {
        id: 'node-204',
        type: 'action',
        title: 'Send Standard Reminder',
        subtitle: 'Friendly reminder without discount',
        x: 640,
        y: 180,
        config: {
          actionType: 'send_message',
          templateText: 'Hi {{first_name}}, did you forget something in your cart? Tap here to complete your order anytime.',
        },
      },
    ],
    connections: [
      { id: 'c-201', fromNodeId: 'node-201', toNodeId: 'node-202', label: 'Next' },
      { id: 'c-202', fromNodeId: 'node-202', toNodeId: 'node-203', label: 'Yes' },
      { id: 'c-203', fromNodeId: 'node-202', toNodeId: 'node-204', label: 'No' },
    ],
    executionLogs: [
      { id: 'log-4', time: '10:50 AM', recipient: '+1 415 555 0199', status: 'success', details: 'VIP 15% coupon converted ($240 sale)' },
      { id: 'log-5', time: '09:12 AM', recipient: '+44 20 7946 0012', status: 'success', details: 'Sent reminder template' },
    ],
  },
  {
    id: 'wf-3',
    name: 'Off-Hours Intelligent Auto-Greeting',
    description: 'Greets inbound messages received outside operating business hours and collects inquiry triage info.',
    channel: 'whatsapp',
    status: 'active',
    category: 'support',
    executionsCount: 8730,
    successRate: 100,
    lastExecuted: '45 mins ago',
    createdAt: '2026-03-01',
    updatedAt: '2026-11-01',
    nodes: [
      {
        id: 'node-301',
        type: 'trigger',
        title: 'Inbound Message Received',
        subtitle: 'Any customer text outside 9 AM - 6 PM',
        x: 60,
        y: 90,
        config: { triggerEvent: 'off_hours_message' },
      },
      {
        id: 'node-302',
        type: 'ai_agent',
        title: 'Resolution Support Copilot',
        subtitle: 'Attempt automated FAQ triage & order lookup',
        x: 350,
        y: 90,
        config: { targetAgent: 'Resolution Support Copilot' },
      },
      {
        id: 'node-303',
        type: 'handover',
        title: 'Escalate to Morning Queue',
        subtitle: 'Assign priority ticket for 9 AM agent shift',
        x: 650,
        y: 90,
        config: { actionType: 'create_ticket' },
      },
    ],
    connections: [
      { id: 'c-301', fromNodeId: 'node-301', toNodeId: 'node-302', label: 'Next' },
      { id: 'c-302', fromNodeId: 'node-302', toNodeId: 'node-303', label: 'Next' },
    ],
    executionLogs: [
      { id: 'log-6', time: '04:12 AM', recipient: '+1 604 555 0199', status: 'success', details: 'Auto-replied with FAQ docs and created morning ticket' },
    ],
  },
  {
    id: 'wf-4',
    name: 'Frustration Detection & Human Handover',
    description: 'Detects negative sentiment or keywords like "speak to agent" and routes conversation to specialist immediately.',
    channel: 'whatsapp',
    status: 'active',
    category: 'support',
    executionsCount: 2340,
    successRate: 96.7,
    lastExecuted: '1 hour ago',
    createdAt: '2026-06-12',
    updatedAt: '2026-10-25',
    nodes: [
      {
        id: 'node-401',
        type: 'trigger',
        title: 'Customer Expresses Frustration',
        subtitle: 'Sentiment score < 0.35 OR keywords detected',
        x: 60,
        y: 90,
        config: { triggerEvent: 'frustration_detected' },
      },
      {
        id: 'node-402',
        type: 'handover',
        title: 'Emergency Human Takeover',
        subtitle: 'Dispatches holding text and rings senior agent',
        x: 360,
        y: 90,
        config: {
          actionType: 'create_ticket',
          templateText: 'I am connecting you right now with a senior support lead who will take over this chat immediately.',
        },
      },
    ],
    connections: [
      { id: 'c-401', fromNodeId: 'node-401', toNodeId: 'node-402', label: 'Next' },
    ],
    executionLogs: [
      { id: 'log-7', time: '10:04 AM', recipient: '+91 98765 43210 (Priya Sharma)', status: 'success', details: 'Transferred to Alex Rivera in 8 seconds' },
    ],
  },
]
