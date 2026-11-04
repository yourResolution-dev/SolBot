// ─── Additional Rich Data & Time-series Analytics for Dashboard ────────────

export interface TimeSeriesDataPoint {
  label: string
  total: number
  aiResolved: number
  humanResolved: number
}

export interface ChannelMetric {
  channel: 'whatsapp' | 'email' | 'chat' | 'phone'
  name: string
  volume: number
  percentage: number
  avgResponseSec: number
  satisfaction: number
  uptime: string
  activeChats: number
}

export type DateRangeKey = 'today' | '7d' | '30d' | '90d'

export interface DateFilterPreset {
  key: DateRangeKey
  label: string
  periodLabel: string
}

export const datePresets: DateFilterPreset[] = [
  { key: 'today', label: 'Today', periodLabel: 'vs yesterday' },
  { key: '7d', label: 'Last 7 Days', periodLabel: 'vs previous 7 days' },
  { key: '30d', label: 'Last 30 Days', periodLabel: 'vs previous 30 days' },
  { key: '90d', label: 'Last Quarter', periodLabel: 'vs previous quarter' },
]

export const analyticsByRange: Record<DateRangeKey, {
  summary: {
    totalConversations: number
    totalChange: number
    aiResolutionRate: number
    aiRateChange: number
    avgResponseTime: string
    avgResponseChange: number
    csatScore: number
    csatChange: number
  }
  chart: TimeSeriesDataPoint[]
}> = {
  today: {
    summary: {
      totalConversations: 1840,
      totalChange: 14.8,
      aiResolutionRate: 86.4,
      aiRateChange: 2.3,
      avgResponseTime: '54s',
      avgResponseChange: -24.5,
      csatScore: 4.8,
      csatChange: 0.1,
    },
    chart: [
      { label: '00:00', total: 42, aiResolved: 38, humanResolved: 4 },
      { label: '04:00', total: 68, aiResolved: 61, humanResolved: 7 },
      { label: '08:00', total: 240, aiResolved: 204, humanResolved: 36 },
      { label: '12:00', total: 410, aiResolved: 352, humanResolved: 58 },
      { label: '16:00', total: 530, aiResolved: 462, humanResolved: 68 },
      { label: '20:00', total: 380, aiResolved: 330, humanResolved: 50 },
      { label: '23:00', total: 170, aiResolved: 152, humanResolved: 18 },
    ],
  },
  '7d': {
    summary: {
      totalConversations: 12450,
      totalChange: 8.5,
      aiResolutionRate: 84.2,
      aiRateChange: 3.1,
      avgResponseTime: '1m 42s',
      avgResponseChange: -18.2,
      csatScore: 4.6,
      csatChange: 0.2,
    },
    chart: [
      { label: 'Mon', total: 1620, aiResolved: 1360, humanResolved: 260 },
      { label: 'Tue', total: 1840, aiResolved: 1550, humanResolved: 290 },
      { label: 'Wed', total: 1980, aiResolved: 1680, humanResolved: 300 },
      { label: 'Thu', total: 1750, aiResolved: 1470, humanResolved: 280 },
      { label: 'Fri', total: 2100, aiResolved: 1790, humanResolved: 310 },
      { label: 'Sat', total: 1420, aiResolved: 1220, humanResolved: 200 },
      { label: 'Sun', total: 1740, aiResolved: 1480, humanResolved: 260 },
    ],
  },
  '30d': {
    summary: {
      totalConversations: 54890,
      totalChange: 19.4,
      aiResolutionRate: 82.8,
      aiRateChange: 5.4,
      avgResponseTime: '1m 58s',
      avgResponseChange: -12.0,
      csatScore: 4.65,
      csatChange: 0.35,
    },
    chart: [
      { label: 'Week 1', total: 12200, aiResolved: 9980, humanResolved: 2220 },
      { label: 'Week 2', total: 13800, aiResolved: 11420, humanResolved: 2380 },
      { label: 'Week 3', total: 14100, aiResolved: 11800, humanResolved: 2300 },
      { label: 'Week 4', total: 14790, aiResolved: 12350, humanResolved: 2440 },
    ],
  },
  '90d': {
    summary: {
      totalConversations: 168400,
      totalChange: 34.2,
      aiResolutionRate: 80.5,
      aiRateChange: 8.7,
      avgResponseTime: '2m 14s',
      avgResponseChange: -28.0,
      csatScore: 4.55,
      csatChange: 0.45,
    },
    chart: [
      { label: 'Month 1', total: 48000, aiResolved: 37440, humanResolved: 10560 },
      { label: 'Month 2', total: 56200, aiResolved: 45520, humanResolved: 10680 },
      { label: 'Month 3', total: 64200, aiResolved: 52640, humanResolved: 11560 },
    ],
  },
}

export const channelMetrics: ChannelMetric[] = [
  {
    channel: 'whatsapp',
    name: 'WhatsApp Business API',
    volume: 38240,
    percentage: 69.7,
    avgResponseSec: 42,
    satisfaction: 4.8,
    uptime: '99.98%',
    activeChats: 142,
  },
  {
    channel: 'chat',
    name: 'Web Chat Widget',
    volume: 9450,
    percentage: 17.2,
    avgResponseSec: 68,
    satisfaction: 4.5,
    uptime: '100%',
    activeChats: 38,
  },
  {
    channel: 'email',
    name: 'Email Support Desk',
    volume: 5820,
    percentage: 10.6,
    avgResponseSec: 320,
    satisfaction: 4.2,
    uptime: '99.95%',
    activeChats: 19,
  },
  {
    channel: 'phone',
    name: 'Voice AI Callback',
    volume: 1380,
    percentage: 2.5,
    avgResponseSec: 90,
    satisfaction: 4.6,
    uptime: '99.9%',
    activeChats: 4,
  },
]
