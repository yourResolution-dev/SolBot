import { channelMetrics } from '@/lib/analyticsData'
import { ChannelIcon } from '@/components/ui/Avatar'
import { Card, CardHeader } from '@/components/ui/Card'
import { Sparkles, Activity, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function ChannelPerformance() {
  const navigate = useNavigate()

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader
          title="Channel Performance"
          subtitle="Conversation distribution & response SLAs"
          action={
            <span className="text-[11px] font-semibold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/60 px-2 py-0.5 rounded-full border border-violet-100 dark:border-violet-900/60">
              Omnichannel
            </span>
          }
        />

        <div className="space-y-4 mt-2">
          {channelMetrics.map((ch) => (
            <div
              key={ch.channel}
              onClick={() => navigate('/automations')}
              className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-violet-200 dark:hover:border-violet-700 hover:bg-violet-50/30 dark:hover:bg-violet-950/20 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <ChannelIcon channel={ch.channel} />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-violet-900 dark:group-hover:text-violet-300">
                      {ch.name}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">
                      {ch.volume.toLocaleString()} msgs &bull; {ch.activeChats} active sessions
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{ch.percentage}%</span>
                  <div className="flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 font-medium justify-end">
                    <Star size={10} className="fill-amber-400 text-amber-400" />
                    <span>{ch.satisfaction}</span>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full transition-all duration-500"
                  style={{ width: `${ch.percentage}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 mt-2">
                <span>Avg Response: <strong className="text-slate-600 dark:text-slate-300">{ch.avgResponseSec}s</strong></span>
                <span>Uptime: <strong className="text-emerald-600 dark:text-emerald-400">{ch.uptime}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1.5">
          <Activity size={13} className="text-emerald-500" />
          Real-time webhook sync enabled
        </span>
        <button
          onClick={() => navigate('/settings')}
          className="text-violet-600 dark:text-violet-400 font-semibold hover:text-violet-800 dark:hover:text-violet-300 transition-colors cursor-pointer"
        >
          API Config &rarr;
        </button>
      </div>
    </Card>
  )
}
