import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  LifeBuoy,
  Users,
  Cpu,
  Bot,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
} from 'lucide-react'
import { ResolutionLogo } from '@/components/ui/Illustrations'
import { cn } from '@/lib/utils'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  isMobileOpen: boolean
  onCloseMobile: () => void
}

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/tickets', label: 'Tickets Queue', icon: LifeBuoy, badge: '8' },
  { to: '/customers', label: 'Customers', icon: Users },
  { to: '/automations', label: 'WhatsApp Flows', icon: Cpu, badge: 'Active' },
  { to: '/ai', label: 'AI Copilot & Models', icon: Bot, highlight: true },
  { to: '/reports', label: 'Reports & CSAT', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar({ collapsed, onToggle, isMobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        data-tour="sidebar"
        className={cn(
          'fixed top-0 bottom-0 left-0 z-40 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 transition-all duration-300 ease-in-out flex flex-col',
          collapsed ? 'w-20' : 'w-64',
          // Mobile state
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <ResolutionLogo className="w-8 h-8 shrink-0" />
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-slate-900 dark:text-slate-100 tracking-tight text-base leading-none">
                  ReSolution
                </span>
                <span className="text-[10px] uppercase font-semibold text-violet-600 dark:text-violet-400 tracking-wider mt-1">
                  Support AI & WA
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onToggle}
            className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5 no-scrollbar">
          {!collapsed && (
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Main Operations
            </div>
          )}

          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onCloseMobile}
                className={({ isActive }: { isActive: boolean }) =>
                  cn(
                    'sidebar-link group',
                    isActive ? 'active' : '',
                    collapsed ? 'justify-center px-0' : ''
                  )
                }
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  size={18}
                  className="shrink-0 transition-transform group-hover:scale-110 duration-200"
                />
                {!collapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span
                    className={cn(
                      'text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0',
                      item.badge === 'Active'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-violet-100 text-violet-700'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
                {!collapsed && item.highlight && (
                  <Sparkles size={14} className="text-amber-500 shrink-0" />
                )}
              </NavLink>
            )
          })}
        </div>

        {/* WhatsApp & AI Live Status Widget */}
        {!collapsed && (
          <div className="p-3 m-3 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 text-white shadow-glass relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold tracking-wide text-violet-100">
                WhatsApp API Active
              </span>
            </div>
            <p className="text-[11px] text-violet-200 leading-snug mb-3">
              Meta Cloud API connected. Auto-dispatch running at 99.8% uptime.
            </p>
            <div className="flex items-center justify-between text-[11px] font-medium pt-2 border-t border-white/10">
              <span className="flex items-center gap-1">
                <Zap size={12} className="text-amber-300" /> 14.8k calls
              </span>
              <span className="text-violet-200 hover:text-white cursor-pointer transition-colors">
                View logs &rarr;
              </span>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
