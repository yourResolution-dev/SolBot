import { useState } from 'react'
import type { TimeSeriesDataPoint } from '@/lib/analyticsData'
import { cn } from '@/lib/utils'

interface AnalyticsChartProps {
  data: TimeSeriesDataPoint[]
  className?: string
}

export function AnalyticsChart({ data, className }: AnalyticsChartProps) {
  const [activeMetric, setActiveMetric] = useState<'both' | 'ai' | 'human'>('both')
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  // Compute maximum value for scaling
  const maxTotal = Math.max(...data.map((d) => d.total), 1)

  return (
    <div className={cn('space-y-4', className)}>
      {/* Legend & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveMetric('both')}
            className={cn(
              'flex items-center gap-1.5 font-medium transition-colors cursor-pointer',
              activeMetric === 'both' ? 'text-violet-900 dark:text-violet-300 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            )}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-violet-600 ring-2 ring-violet-200 dark:ring-violet-900" />
            <span>AI Automated</span>
          </button>
          <button
            onClick={() => setActiveMetric('both')}
            className={cn(
              'flex items-center gap-1.5 font-medium transition-colors cursor-pointer',
              activeMetric === 'both' ? 'text-slate-900 dark:text-slate-200 font-semibold' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            )}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
            <span>Human Escalated</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 dark:text-slate-500">
          Hover over bars for exact resolution volume breakdown
        </div>
      </div>

      {/* SVG Responsive Bar & Area Chart */}
      <div className="relative pt-6 pb-2">
        {/* Y Axis Gridlines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
          <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full" />
          <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full" />
          <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full" />
          <div className="border-b border-dashed border-slate-200 dark:border-slate-800 w-full" />
        </div>

        {/* Chart Bars */}
        <div className="relative h-56 flex items-end justify-between gap-2 sm:gap-4 px-2">
          {data.map((item, index) => {
            const totalHeight = (item.total / maxTotal) * 100
            const aiHeight = (item.aiResolved / item.total) * 100
            const humanHeight = 100 - aiHeight

            const isHovered = hoveredIdx === index

            return (
              <div
                key={item.label}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Tooltip on hover */}
                {isHovered && (
                  <div className="absolute -top-16 z-20 bg-slate-900 dark:bg-slate-800 text-white text-[11px] py-1.5 px-2.5 rounded-xl shadow-dropdown whitespace-nowrap animate-slide-up pointer-events-none border border-slate-700">
                    <p className="font-semibold text-violet-300 mb-0.5">{item.label}</p>
                    <p className="text-slate-200">
                      Total: <span className="font-bold text-white">{item.total.toLocaleString()}</span>
                    </p>
                    <p className="text-emerald-300 text-[10px]">
                      AI: {item.aiResolved.toLocaleString()} ({Math.round(aiHeight)}%)
                    </p>
                    <p className="text-slate-400 text-[10px]">
                      Human: {item.humanResolved.toLocaleString()} ({Math.round(humanHeight)}%)
                    </p>
                  </div>
                )}

                {/* Compound Stacked Bar */}
                <div
                  className={cn(
                    'w-full max-w-[42px] rounded-xl overflow-hidden flex flex-col justify-end transition-all duration-300 shadow-xs',
                    isHovered ? 'scale-105 shadow-md ring-2 ring-violet-400/40' : 'opacity-90 group-hover:opacity-100'
                  )}
                  style={{ height: `${totalHeight}%` }}
                >
                  {/* Human portion (Top) */}
                  {(activeMetric === 'both' || activeMetric === 'human') && (
                    <div
                      className="w-full bg-slate-200 dark:bg-slate-700 transition-all duration-300"
                      style={{ height: `${humanHeight}%` }}
                    />
                  )}
                  {/* AI portion (Bottom) */}
                  {(activeMetric === 'both' || activeMetric === 'ai') && (
                    <div
                      className="w-full bg-gradient-to-t from-violet-700 via-violet-600 to-indigo-500 transition-all duration-300"
                      style={{ height: `${aiHeight}%` }}
                    />
                  )}
                </div>

                {/* X Axis Label */}
                <span
                  className={cn(
                    'text-[11px] font-medium mt-3 transition-colors',
                    isHovered ? 'text-violet-900 dark:text-violet-300 font-bold' : 'text-slate-500 dark:text-slate-400'
                  )}
                >
                  {item.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
