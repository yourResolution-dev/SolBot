import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from '@/components/ui/Toast'
import { DashboardShell } from '@/components/navigation/DashboardShell'
import { DashboardOverview } from '@/pages/DashboardOverview'
import { TicketsPage } from '@/pages/TicketsPage'
import { CustomersPage } from '@/pages/CustomersPage'
import { AutomationsPage } from '@/pages/AutomationsPage'
import { AIAssistantPage } from '@/pages/AIAssistantPage'
import { ReportsPage } from '@/pages/ReportsPage'
import { SettingsPage } from '@/pages/SettingsPage'

export function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardShell />}>
            <Route index element={<DashboardOverview />} />
            <Route path="tickets" element={<TicketsPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="automations" element={<AutomationsPage />} />
            <Route path="ai" element={<AIAssistantPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
