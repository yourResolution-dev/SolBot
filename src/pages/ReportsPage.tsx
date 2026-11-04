import { useState } from 'react'
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  Award,
  Download,
  ArrowUpRight,
  Sparkles,
  Bot,
  Zap,
  Star,
  CheckCircle2,
  Calendar,
  Filter,
} from 'lucide-react'
import { Card, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { agents } from '@/lib/data'
import { AgentStatusBadge, Badge } from '@/components/ui/Badge'
import { Avatar, ChannelIcon } from '@/components/ui/Avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableWrapper } from '@/components/ui/Table'
import { useToast } from '@/components/ui/Toast'

type AnalyticsDateRange = '7d' | '30d' | '90d' | '12m'

interface AnalyticsBreakdown {
  periodLabel: string
  totalVolume: number
  totalChange: number
  resolutionRate: number
  aiContainmentRate: number
  firstResponseTime: string
  csat: number
  dailyTrend: { day: string; ai: number; human: number; total: number }[]
  channelBreakdown: { channel: 'whatsapp' | 'email' | 'chat'; name: string; volume: number; share: number; avgTime: string; csat: number }[]
}

const analyticsDataByRange: Record<AnalyticsDateRange, AnalyticsBreakdown> = {
  '7d': {
    periodLabel: 'Last 7 Days',
    totalVolume: 12450,
    totalChange: 8.5,
    resolutionRate: 88.2,
    aiContainmentRate: 84.2,
    firstResponseTime: '42s',
    csat: 4.8,
    dailyTrend: [
      { day: 'Mon', ai: 1360, human: 260, total: 1620 },
      { day: 'Tue', ai: 1550, human: 290, total: 1840 },
      { day: 'Wed', ai: 1680, human: 300, total: 1980 },
      { day: 'Thu', ai: 1470, human: 280, total: 1750 },
      { day: 'Fri', ai: 1790, human: 310, total: 2100 },
      { day: 'Sat', ai: 1220, human: 200, total: 1420 },
      { day: 'Sun', ai: 1480, human: 260, total: 1740 },
    ],
    channelBreakdown: [
      { channel: 'whatsapp', name: 'WhatsApp Cloud API', volume: 8680, share: 69.7, avgTime: '32s', csat: 4.9 },
      { channel: 'chat', name: 'Web Widget Live Chat', volume: 2140, share: 17.2, avgTime: '55s', csat: 4.6 },
      { channel: 'email', name: 'Email Support Queue', volume: 1630, share: 13.1, avgTime: '4m 10s', csat: 4.3 },
    ],
  },
  '30d': {
    periodLabel: 'Last 30 Days',
    totalVolume: 54890,
    totalChange: 19.4,
    resolutionRate: 86.8,
    aiContainmentRate: 82.5,
    firstResponseTime: '58s',
    csat: 4.7,
    dailyTrend: [
      { day: 'W1', ai: 9980, human: 2220, total: 12200 },
      { day: 'W2', ai: 11420, human: 2380, total: 13800 },
      { day: 'W3', ai: 11800, human: 2300, total: 14100 },
      { day: 'W4', ai: 12350, human: 2440, total: 14790 },
    ],
    channelBreakdown: [
      { channel: 'whatsapp', name: 'WhatsApp Cloud API', volume: 38240, share: 69.7, avgTime: '38s', csat: 4.8 },
      { channel: 'chat', name: 'Web Widget Live Chat', volume: 9450, share: 17.2, avgTime: '1m 02s', csat: 4.5 },
      { channel: 'email', name: 'Email Support Queue', volume: 7200, share: 13.1, avgTime: '5m 20s', csat: 4.2 },
    ],
  },
  '90d': {
    periodLabel: 'Last Quarter',
    totalVolume: 168400,
    totalChange: 34.2,
    resolutionRate: 85.1,
    aiContainmentRate: 80.9,
    firstResponseTime: '1m 15s',
    csat: 4.65,
    dailyTrend: [
      { day: 'Month 1', ai: 37440, human: 10560, total: 48000 },
      { day: 'Month 2', ai: 45520, human: 10680, total: 56200 },
      { day: 'Month 3', ai: 52640, human: 11560, total: 64200 },
    ],
    channelBreakdown: [
      { channel: 'whatsapp', name: 'WhatsApp Cloud API', volume: 117380, share: 69.7, avgTime: '44s', csat: 4.8 },
      { channel: 'chat', name: 'Web Widget Live Chat', volume: 28960, share: 17.2, avgTime: '1m 18s', csat: 4.4 },
      { channel: 'email', name: 'Email Support Queue', volume: 22060, share: 13.1, avgTime: '6m 40s', csat: 4.1 },
    ],
  },
  '12m': {
    periodLabel: 'Past 12 Months',
    totalVolume: 642800,
    totalChange: 52.8,
    resolutionRate: 84.6,
    aiContainmentRate: 79.4,
    firstResponseTime: '1m 24s',
    csat: 4.6,
    dailyTrend: [
      { day: 'Q1', ai: 98000, human: 32000, total: 130000 },
      { day: 'Q2', ai: 122000, human: 34000, total: 156000 },
      { day: 'Q3', ai: 141000, human: 35000, total: 176000 },
      { day: 'Q4', ai: 149000, human: 31800, total: 180800 },
    ],
    channelBreakdown: [
      { channel: 'whatsapp', name: 'WhatsApp Cloud API', volume: 448000, share: 69.7, avgTime: '48s', csat: 4.7 },
      { channel: 'chat', name: 'Web Widget Live Chat', volume: 110500, share: 17.2, avgTime: '1m 20s', csat: 4.5 },
      { channel: 'email', name: 'Email Support Queue', volume: 84300, share: 13.1, avgTime: '7m 10s', csat: 4.0 },
    ],
  },
}

export function ReportsPage() {
  const { toast } = useToast()
  const [range, setRange] = useState<AnalyticsDateRange>('7d')
  const [hoveredTrendIdx, setHoveredTrendIdx] = useState<number | null>(null)
  const current = analyticsDataByRange[range]

  const maxDaily = Math.max(...current.dailyTrend.map((d) => d.total), 1)

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Metric,Value,Period']
        .concat([
          `"Total Conversations","${current.totalVolume}","${current.periodLabel}"`,
          `"Resolution Rate","${current.resolutionRate}%","${current.periodLabel}"`,
          `"AI Containment Rate","${current.aiContainmentRate}%","${current.periodLabel}"`,
          `"Avg First Response","${current.firstResponseTime}","${current.periodLabel}"`,
          `"CSAT Score","${current.csat} / 5","${current.periodLabel}"`,
        ])
        .join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Resolution_Analytics_Report_${range}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      type: 'success',
      title: 'Analytics Export Ready',
      description: `Report for ${current.periodLabel} generated and downloaded.`,
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Analytics & Executive Reports
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold">
              Live Data
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track SLA performance, AI containment, agent workloads, and WhatsApp conversation volume
          </p>
        </div>

        {/* Date Filter & Export */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-xs">
            {(['7d', '30d', '90d', '12m'] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRange(r)
                  toast({
                    type: 'info',
                    title: `Viewing ${analyticsDataByRange[r].periodLabel}`,
                    description: 'Analytics benchmarks refreshed.',
                  })
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
                  range === r
                    ? 'bg-violet-600 text-white font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {r === '7d' ? '7 Days' : r === '30d' ? '30 Days' : r === '90d' ? 'Quarter' : '1 Year'}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Download size={14} />}
            onClick={handleExportCSV}
          >
            Export CSV
          </Button>
        </div>
      </div>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Total Conversations
          </span>
          <div className="my-2">
            <div className="text-2xl font-bold text-slate-900">
              {current.totalVolume.toLocaleString()}
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-600">
            +{current.totalChange}% vs prior
          </span>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Resolution Rate
          </span>
          <div className="my-2">
            <div className="text-2xl font-bold text-slate-900">
              {current.resolutionRate}%
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-600">SLA Met (98%)</span>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            AI Containment
          </span>
          <div className="my-2">
            <div className="text-2xl font-bold text-violet-700">
              {current.aiContainmentRate}%
            </div>
          </div>
          <span className="text-xs text-slate-400">No human handoff</span>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            First Response
          </span>
          <div className="my-2">
            <div className="text-2xl font-bold text-slate-900">
              {current.firstResponseTime}
            </div>
          </div>
          <span className="text-xs font-semibold text-emerald-600">-18s reduction</span>
        </Card>

        <Card className="p-4 flex flex-col justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Customer CSAT
          </span>
          <div className="my-2 flex items-baseline gap-1">
            <div className="text-2xl font-bold text-slate-900">{current.csat}</div>
            <span className="text-slate-400 text-xs">/ 5.0</span>
          </div>
          <span className="text-xs font-semibold text-amber-600 flex items-center gap-1">
            <Star size={11} className="fill-amber-400 text-amber-400" /> Top 5% SaaS
          </span>
        </Card>
      </div>

      {/* Main Resolution Trends Chart */}
      <Card className="p-6">
        <CardHeader
          title="Conversation Volume & AI Containment Trend"
          subtitle={`Daily volume breakdown across ${current.periodLabel}`}
          action={
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-600" />
                AI Auto-Resolved
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                Human Handled
              </span>
            </div>
          }
        />

        {/* Custom Visual Bar Chart */}
        <div className="relative pt-6 pb-2">
          <div className="h-56 flex items-end justify-between gap-3 px-2">
            {current.dailyTrend.map((d, idx) => {
              const totalH = (d.total / maxDaily) * 100
              const aiH = (d.ai / d.total) * 100
              const humanH = 100 - aiH
              const isHovered = hoveredTrendIdx === idx

              return (
                <div
                  key={d.day}
                  onMouseEnter={() => setHoveredTrendIdx(idx)}
                  onMouseLeave={() => setHoveredTrendIdx(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                >
                  {isHovered && (
                    <div className="absolute -top-16 z-20 bg-slate-900 text-white text-[11px] py-1.5 px-3 rounded-xl shadow-xl whitespace-nowrap animate-slide-up pointer-events-none">
                      <p className="font-bold text-violet-300">{d.day}</p>
                      <p className="text-slate-200">
                        Total: <span className="font-bold text-white">{d.total.toLocaleString()}</span>
                      </p>
                      <p className="text-emerald-300 text-[10px]">
                        AI: {d.ai.toLocaleString()} ({Math.round(aiH)}%)
                      </p>
                      <p className="text-slate-400 text-[10px]">
                        Human: {d.human.toLocaleString()} ({Math.round(humanH)}%)
                      </p>
                    </div>
                  )}

                  <div
                    className={`w-full max-w-[48px] rounded-xl overflow-hidden flex flex-col justify-end transition-all ${
                      isHovered ? 'scale-105 ring-2 ring-violet-500/30' : 'opacity-90'
                    }`}
                    style={{ height: `${totalH}%` }}
                  >
                    <div className="w-full bg-slate-200" style={{ height: `${humanH}%` }} />
                    <div
                      className="w-full bg-gradient-to-t from-violet-700 via-violet-600 to-indigo-500"
                      style={{ height: `${aiH}%` }}
                    />
                  </div>

                  <span
                    className={`text-[11px] font-medium mt-3 transition-colors ${
                      isHovered ? 'text-violet-900 font-bold' : 'text-slate-500'
                    }`}
                  >
                    {d.day}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </Card>

      {/* Channel Performance & Agent Scoreboard Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Channel Distribution Table (5 cols) */}
        <div className="lg:col-span-5">
          <Card className="h-full">
            <CardHeader
              title="Channel Ingestion SLAs"
              subtitle="Response speed by support touchpoint"
            />
            <div className="space-y-3 mt-2">
              {current.channelBreakdown.map((ch) => (
                <div
                  key={ch.channel}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ChannelIcon channel={ch.channel} />
                      <span className="font-bold text-xs text-slate-800">{ch.name}</span>
                    </div>
                    <span className="font-bold text-xs text-slate-900">{ch.share}%</span>
                  </div>

                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full"
                      style={{ width: `${ch.share}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>
                      Avg First Response: <strong className="text-slate-700">{ch.avgTime}</strong>
                    </span>
                    <span className="font-semibold text-amber-600 flex items-center gap-0.5">
                      <Star size={10} className="fill-amber-400 text-amber-400" /> {ch.csat}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Support Specialist Performance Scoreboard (7 cols) */}
        <div className="lg:col-span-7">
          <Card className="h-full">
            <CardHeader
              title="Support Agent Productivity Scoreboard"
              subtitle="Resolution volume, active queue, and live availability"
            />
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-[11px] font-semibold text-slate-400 uppercase">
                    <th className="pb-3 px-3">Specialist</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3">Active</th>
                    <th className="pb-3 px-3">Resolved</th>
                    <th className="pb-3 px-3">CSAT Avg</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {agents.map((ag) => (
                    <tr key={ag.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar name={ag.name} size="sm" />
                          <div>
                            <div className="font-bold text-slate-900">{ag.name}</div>
                            <div className="text-[10px] text-slate-400">{ag.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <AgentStatusBadge status={ag.status} />
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{ag.ticketsOpen}</td>
                      <td className="py-3 px-3 font-bold text-violet-700">
                        {ag.ticketsResolved}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-amber-600 flex items-center gap-1">
                          <Star size={11} className="fill-amber-400 text-amber-400" />
                          {ag.csat}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
