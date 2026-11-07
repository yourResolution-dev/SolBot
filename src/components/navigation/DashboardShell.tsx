import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { TopNavbar } from './TopNavbar'
import { OnboardingModal } from '@/components/onboarding/OnboardingModal'
import { ProductTour } from '@/components/onboarding/ProductTour'
import { cn } from '@/lib/utils'

export function DashboardShell() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
        isMobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Main layout container with dynamic left margin for collapsed/expanded sidebar */}
      <div
        className={cn(
          'flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out',
          collapsed ? 'lg:ml-20' : 'lg:ml-64'
        )}
      >
        <TopNavbar
          onOpenMobileSidebar={() => setMobileOpen(true)}
          onToggleSidebar={() => setCollapsed((prev) => !prev)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* First-time Onboarding Wizard Modal */}
      <OnboardingModal />

      {/* Interactive Product Tour */}
      <ProductTour />
    </div>
  )
}
