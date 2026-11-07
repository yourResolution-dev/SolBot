import { useNavigate } from 'react-router-dom'
import { agents } from '@/lib/data'
import { AgentStatusBadge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { Card, CardHeader } from '@/components/ui/Card'
import { Star, ArrowRight } from 'lucide-react'

export function AgentPerformanceWidget() {
  const navigate = useNavigate()

  return (
    <Card className="h-full flex flex-col justify-between">
      <div>
        <CardHeader
          title="Support Agent Specialists"
          subtitle="Human agent availability and resolution CSAT"
          action={
            <button
              onClick={() => navigate('/reports')}
              className="text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors flex items-center gap-1"
            >
              All Agents <ArrowRight size={12} />
            </button>
          }
        />

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {agents.map((ag) => (
            <div
              key={ag.id}
              onClick={() => navigate('/reports')}
              className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/70 dark:hover:bg-slate-800/40 -mx-2 px-2 rounded-xl transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar name={ag.name} size="sm" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-violet-900 dark:group-hover:text-violet-300">
                    {ag.name}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{ag.role}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 justify-end">
                    <Star size={10} className="fill-amber-400 text-amber-400" />
                    <span>{ag.csat}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">
                    {ag.ticketsResolved} solved &bull; {ag.ticketsOpen} queue
                  </span>
                </div>
                <AgentStatusBadge status={ag.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 bg-violet-50/50 dark:bg-violet-950/40 -mx-5 -mb-5 p-4 rounded-b-2xl flex items-center justify-between text-xs">
        <span className="text-violet-900 dark:text-violet-200 font-medium">Handoff protocol active</span>
        <button
          onClick={() => navigate('/ai')}
          className="font-semibold text-violet-700 dark:text-violet-300 hover:text-violet-900 dark:hover:text-violet-100 transition-colors cursor-pointer"
        >
          Tune Thresholds &rarr;
        </button>
      </div>
    </Card>
  )
}
